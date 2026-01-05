// LLM Prompt Templates for Executive Briefing Generation

import { BriefingData } from './mockData';

export const SYSTEM_PROMPT = `You are an executive briefing assistant for FlowCraft, a startup project management tool.

Your role is to analyze task data from multiple teams and generate a concise, actionable executive briefing.

RULES:
1. Identify TOP RISKS (0-3 items): Tasks that are blocked, overdue by >2 days, or on critical path with issues
2. Flag ATTENTION NEEDED (0-5 items): Capacity issues (>100%), prolonged stagnation, upcoming dependencies
3. Highlight ON TRACK (2-4 items): Progress worth celebrating, milestones achieved, work completing on schedule
4. Summarize TEAM HEALTH: Per-team capacity utilization, velocity trends, blocker counts

FORMATTING RULES:
- Be concise - maximum 1 page when printed
- Use executive-friendly language, no technical jargon
- Every item must be actionable with a clear next step or owner
- Prioritize by impact - most critical items first
- Use specific numbers: "3 days overdue" not "late"

CONTEXT:
- This is a 35-person startup with Engineering (15), Design (8), and Product (5) teams
- The briefing is for Monday leadership standup
- Focus on what needs attention, not exhaustive lists`;

export const EXAMPLE_OUTPUT = `{
  "generatedAt": "2025-01-06T08:00:00Z",
  "weekOf": "January 6, 2025",
  "topRisks": [
    {
      "title": "Mobile app release BLOCKED",
      "issue": "Design team 3 days behind on final mocks",
      "impact": "Launch delayed by at least 1 week",
      "owner": "Sarah (Design Lead)",
      "nextStep": "Meeting with Alex (PM) today at 2pm"
    },
    {
      "title": "Payment API integration STALLED",
      "issue": "External vendor hasn't responded in 5 days",
      "impact": "Cannot complete checkout flow, release at risk",
      "owner": "Mark",
      "nextStep": "Escalate to vendor account manager"
    }
  ],
  "attentionNeeded": [
    {
      "title": "Backend team at 110% capacity",
      "context": "Currently handling 8 critical tasks simultaneously",
      "recommendation": "Move 2 medium-priority tasks to next sprint",
      "impact": "Risk of burnout, potential quality issues"
    },
    {
      "title": "QA has 8 bugs in review >3 days",
      "context": "Unclear if capacity issue or priority problem",
      "recommendation": "Jane (Eng Manager) to assess today",
      "impact": "May delay release if not addressed"
    }
  ],
  "onTrack": [
    {
      "title": "Web dashboard feature",
      "status": "Shipping Friday as planned, demo ready"
    },
    {
      "title": "User onboarding flow redesign",
      "status": "Launched yesterday, early metrics positive"
    },
    {
      "title": "Security audit",
      "status": "Passed all tests, report finalized"
    }
  ],
  "teamHealth": [
    {
      "team": "Engineering",
      "headcount": 15,
      "capacity": 95,
      "velocity": "42 points/sprint (target: 40)",
      "blockers": 2,
      "status": "healthy",
      "notes": "2 people at 110%"
    },
    {
      "team": "Design",
      "headcount": 8,
      "capacity": 110,
      "velocity": "3 days slower than usual",
      "blockers": 1,
      "status": "warning",
      "notes": "Overloaded, waiting on product decisions"
    },
    {
      "team": "Product",
      "headcount": 5,
      "capacity": 75,
      "velocity": "On track for Q1 milestones (85%)",
      "blockers": 0,
      "status": "healthy",
      "notes": ""
    }
  ],
  "summary": "2 critical blockers need immediate attention. One team overloaded. Overall trajectory positive but watch payment API and design capacity closely."
}`;

export function buildUserPrompt(data: BriefingData): string {
  return `Analyze the following task data and generate an executive briefing in JSON format.

CURRENT DATE: ${data.currentDate}
TIME WINDOW: ${data.timeWindow}

TEAM DATA:
${JSON.stringify(data, null, 2)}

SUMMARY STATS:
- Total Tasks: ${data.totalTasks}
- Overdue Tasks: ${data.overdueCount}
- Blocked Tasks: ${data.blockedCount}
- Critical (not done): ${data.criticalCount}

Generate a JSON response matching this exact structure:
${EXAMPLE_OUTPUT}

Important: Return ONLY valid JSON, no markdown formatting or extra text.`;
}

// Fallback briefing when LLM fails or for demo purposes
export function generateFallbackBriefing(data: BriefingData) {
  const today = new Date();
  const weekOf = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  // Find blocked tasks (P0/P1 only)
  const blockedTasks = data.teams.flatMap(team => 
    team.tasks.filter(t => t.blocked && (t.priority === 'critical' || t.priority === 'high'))
      .map(t => ({ ...t, teamName: team.name }))
  );
  
  // Find overdue tasks with days calculation
  const overdueTasks = data.teams.flatMap(team =>
    team.tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate < today && t.status !== 'done';
    }).map(t => ({ ...t, teamName: team.name, daysOverdue: getDaysOverdue(t.dueDate) }))
  );
  
  // Find critical incomplete tasks
  const criticalTasks = data.teams.flatMap(team =>
    team.tasks.filter(t => t.priority === 'critical' && t.status !== 'done')
      .map(t => ({ ...t, teamName: team.name }))
  );
  
  // Find completed tasks
  const completedTasks = data.teams.flatMap(team =>
    team.tasks.filter(t => t.status === 'done').map(t => ({ ...t, teamName: team.name }))
  );
  
  // STRICT RISK CRITERIA:
  // 1. P0/P1 tasks that are BOTH blocked AND overdue
  // 2. P0 tasks overdue by >7 days (even if not blocked)
  // 3. Tasks blocking other work (in-progress critical tasks)
  
  const topRiskCandidates: Array<{
    title: string;
    issue: string;
    impact: string;
    owner: string;
    nextStep: string;
    priority: number; // For sorting - lower is higher priority
  }> = [];
  
  // Category 1: Blocked AND overdue P0/P1 tasks (highest priority)
  blockedTasks.forEach(task => {
    const daysOverdue = getDaysOverdue(task.dueDate);
    if (daysOverdue > 0) {
      topRiskCandidates.push({
        title: `${task.title} BLOCKED`,
        issue: task.blockerReason || 'Blocked and overdue',
        impact: task.priority === 'critical' ? 'Release timeline at risk' : 'Sprint completion at risk',
        owner: task.owner,
        nextStep: 'Resolve blocker immediately',
        priority: 1
      });
    }
  });
  
  // Category 2: P0 tasks overdue by >7 days (even if not blocked)
  overdueTasks
    .filter(t => t.priority === 'critical' && t.daysOverdue > 7)
    .forEach(task => {
      // Avoid duplicates
      if (!topRiskCandidates.some(r => r.title.includes(task.title))) {
        topRiskCandidates.push({
          title: `${task.title} critically overdue`,
          issue: `${task.daysOverdue} days past deadline`,
          impact: 'Release timeline at risk',
          owner: task.owner,
          nextStep: 'Escalate and reassess timeline',
          priority: 2
        });
      }
    });
  
  // Category 3: Blocked P0/P1 tasks (even if not overdue yet)
  blockedTasks.forEach(task => {
    if (!topRiskCandidates.some(r => r.title.includes(task.title))) {
      topRiskCandidates.push({
        title: `${task.title} BLOCKED`,
        issue: task.blockerReason || 'Awaiting dependencies',
        impact: task.priority === 'critical' ? 'May delay release' : 'May delay sprint',
        owner: task.owner,
        nextStep: 'Review and resolve blocker',
        priority: 3
      });
    }
  });
  
  // Sort by priority and take top 3
  topRiskCandidates.sort((a, b) => a.priority - b.priority);
  const topRisks = topRiskCandidates.slice(0, 3).map(({ priority, ...rest }) => rest);
  
  // Build attention needed (less critical items)
  // - Capacity issues
  // - Overdue P0 tasks (< 7 days) or P1/P2 overdue tasks
  // - Items approaching deadline
  const attentionNeeded = [
    ...data.teams.filter(t => t.capacity > 100).map(team => ({
      title: `${team.name} team at ${team.capacity}% capacity`,
      context: `${team.blockerCount} blocked items`,
      recommendation: 'Consider redistributing tasks or pushing to next sprint',
      impact: 'Risk of burnout and quality issues'
    })),
    // P0 tasks overdue by 1-7 days (not critical enough for top risks)
    ...overdueTasks
      .filter(t => t.priority === 'critical' && t.daysOverdue > 0 && t.daysOverdue <= 7)
      .filter(t => !topRiskCandidates.some(r => r.title.includes(t.title)))
      .slice(0, 2)
      .map(task => ({
        title: `${task.title} is ${task.daysOverdue} days overdue`,
        context: `Owner: ${task.owner}, Priority: Critical`,
        recommendation: 'Review blockers and timeline',
        impact: 'May affect upcoming milestones'
      })),
    // P1/P2 overdue tasks
    ...overdueTasks
      .filter(t => (t.priority === 'high' || t.priority === 'medium') && t.daysOverdue > 3)
      .slice(0, 2)
      .map(task => ({
        title: `${task.title} is ${task.daysOverdue} days overdue`,
        context: `Owner: ${task.owner}`,
        recommendation: 'Review priority and timeline',
        impact: 'May affect downstream deliverables'
      }))
  ].slice(0, 5);
  
  // Build on track items
  const onTrack = completedTasks.slice(-4).map(task => ({
    title: task.title,
    status: `Completed - ${task.teamName} team`
  }));
  
  // Build team health
  const teamHealth = data.teams.map(team => ({
    team: team.name,
    headcount: team.members.length,
    capacity: team.capacity,
    velocity: `${team.velocity} points/sprint`,
    blockers: team.blockerCount,
    status: team.capacity > 100 ? 'warning' : team.blockerCount > 2 ? 'warning' : 'healthy',
    notes: team.capacity > 100 ? 'Overloaded' : team.blockerCount > 0 ? `${team.blockerCount} blockers to resolve` : ''
  }));
  
  // Generate summary
  const criticalBlockers = blockedTasks.filter(t => t.priority === 'critical').length;
  const overloadedTeams = data.teams.filter(t => t.capacity > 100).length;
  
  let summary = '';
  if (criticalBlockers > 0) {
    summary += `${criticalBlockers} critical blocker${criticalBlockers > 1 ? 's' : ''} need immediate attention. `;
  }
  if (overloadedTeams > 0) {
    summary += `${overloadedTeams} team${overloadedTeams > 1 ? 's' : ''} overloaded. `;
  }
  if (criticalBlockers === 0 && overloadedTeams === 0) {
    summary += 'All teams operating normally. ';
  }
  summary += `${completedTasks.length} tasks completed this period.`;
  
  return {
    generatedAt: new Date().toISOString(),
    weekOf,
    topRisks,
    attentionNeeded,
    onTrack,
    teamHealth,
    summary
  };
}

function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Type definitions for briefing output
export interface BriefingRisk {
  title: string;
  issue: string;
  impact: string;
  owner: string;
  nextStep: string;
}

export interface BriefingAttention {
  title: string;
  context: string;
  recommendation: string;
  impact: string;
}

export interface BriefingOnTrack {
  title: string;
  status: string;
}

export interface BriefingTeamHealth {
  team: string;
  headcount: number;
  capacity: number;
  velocity: string;
  blockers: number;
  status: 'healthy' | 'warning' | 'critical';
  notes: string;
}

export interface ExecutiveBriefingOutput {
  generatedAt: string;
  weekOf: string;
  topRisks: BriefingRisk[];
  attentionNeeded: BriefingAttention[];
  onTrack: BriefingOnTrack[];
  teamHealth: BriefingTeamHealth[];
  summary: string;
}

