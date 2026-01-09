import { NextRequest, NextResponse } from 'next/server';
import { generateMockBriefingData, getScenarioData, BriefingData } from '@/app/lib/mockData';
import { 
  SYSTEM_PROMPT, 
  buildUserPrompt, 
  generateFallbackBriefing,
  ExecutiveBriefingOutput 
} from '@/app/lib/briefingPrompt';
import { 
  transformFlowCraftDataToBriefingData, 
  FlowCraftIssue, 
  FlowCraftSprint,
  FlowCraftUser,
  FlowCraftTeam 
} from '@/app/lib/dataTransform';

// POST /api/briefing - Generate executive briefing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const scenario = body.scenario as 'healthy' | 'crisis' | 'mixed' | undefined;
    const useLLM = body.useLLM !== false; // Default to true
    const issues = body.issues as FlowCraftIssue[] | undefined;
    const sprints = body.sprints as FlowCraftSprint[] | undefined;
    const users = body.users as FlowCraftUser[] | undefined;
    const teams = body.teams as FlowCraftTeam[] | undefined;
    
    // Use real data if provided, otherwise use mock data
    let briefingData: BriefingData;
    if (issues && issues.length > 0) {
      // Transform real FlowCraft data with users and teams
      briefingData = transformFlowCraftDataToBriefingData(
        issues, 
        sprints || [], 
        users || [],
        teams || []
      );
    } else {
      // Use mock data with scenario
      briefingData = scenario 
        ? getScenarioData(scenario) 
        : generateMockBriefingData();
    }
    
    let briefing: ExecutiveBriefingOutput;
    
    // Try LLM generation if enabled and API key is available
    if (useLLM && process.env.OPENAI_API_KEY) {
      try {
        briefing = await generateWithOpenAI(briefingData);
      } catch (llmError) {
        console.error('LLM generation failed, using fallback:', llmError);
        briefing = generateFallbackBriefing(briefingData);
      }
    } else if (useLLM && process.env.ANTHROPIC_API_KEY) {
      try {
        briefing = await generateWithAnthropic(briefingData);
      } catch (llmError) {
        console.error('LLM generation failed, using fallback:', llmError);
        briefing = generateFallbackBriefing(briefingData);
      }
    } else {
      // Use fallback briefing generator
      briefing = generateFallbackBriefing(briefingData);
    }
    
    return NextResponse.json({
      success: true,
      briefing,
      metadata: {
        generatedAt: new Date().toISOString(),
        scenario: scenario || 'mixed',
        usedLLM: useLLM && !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY),
        dataStats: {
          totalTasks: briefingData.totalTasks,
          overdueCount: briefingData.overdueCount,
          blockedCount: briefingData.blockedCount,
          criticalCount: briefingData.criticalCount,
        }
      }
    });
  } catch (error) {
    console.error('Error generating briefing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate briefing' },
      { status: 500 }
    );
  }
}

// GET /api/briefing - Get briefing with default settings
export async function GET() {
  const briefingData = generateMockBriefingData();
  const briefing = generateFallbackBriefing(briefingData);
  
  return NextResponse.json({
    success: true,
    briefing,
    metadata: {
      generatedAt: new Date().toISOString(),
      scenario: 'mixed',
      usedLLM: false,
      dataStats: {
        totalTasks: briefingData.totalTasks,
        overdueCount: briefingData.overdueCount,
        blockedCount: briefingData.blockedCount,
        criticalCount: briefingData.criticalCount,
      }
    }
  });
}

// OpenAI integration
async function generateWithOpenAI(data: BriefingData): Promise<ExecutiveBriefingOutput> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(data) }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }
  
  const result = await response.json();
  const content = result.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content in OpenAI response');
  }
  
  return JSON.parse(content) as ExecutiveBriefingOutput;
}

// Anthropic integration
async function generateWithAnthropic(data: BriefingData): Promise<ExecutiveBriefingOutput> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildUserPrompt(data) }
      ],
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${error}`);
  }
  
  const result = await response.json();
  const content = result.content[0]?.text;
  
  if (!content) {
    throw new Error('No content in Anthropic response');
  }
  
  // Extract JSON from response (Claude might include markdown)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Anthropic response');
  }
  
  return JSON.parse(jsonMatch[0]) as ExecutiveBriefingOutput;
}

