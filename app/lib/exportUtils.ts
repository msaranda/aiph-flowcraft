// Export Utilities for Executive Briefing

import { ExecutiveBriefingOutput } from './briefingPrompt';

// Convert briefing to markdown format
export function briefingToMarkdown(briefing: ExecutiveBriefingOutput): string {
  let md = '';
  
  md += `# EXECUTIVE BRIEFING\n`;
  md += `**Week of ${briefing.weekOf}** | Generated ${new Date(briefing.generatedAt).toLocaleString()}\n\n`;
  md += `---\n\n`;
  
  // Top Risks
  md += `## 🔴 TOP RISKS\n\n`;
  if (briefing.topRisks.length === 0) {
    md += `*No critical risks at this time.*\n\n`;
  } else {
    briefing.topRisks.forEach((risk, index) => {
      md += `### ${index + 1}. ${risk.title}\n`;
      md += `- **Issue:** ${risk.issue}\n`;
      md += `- **Impact:** ${risk.impact}\n`;
      md += `- **Owner:** ${risk.owner}\n`;
      md += `- **Next Step:** ${risk.nextStep}\n\n`;
    });
  }
  
  // Attention Needed
  md += `## 🟡 ATTENTION NEEDED\n\n`;
  if (briefing.attentionNeeded.length === 0) {
    md += `*No items requiring immediate attention.*\n\n`;
  } else {
    briefing.attentionNeeded.forEach((item, index) => {
      md += `### ${index + 1}. ${item.title}\n`;
      md += `- **Context:** ${item.context}\n`;
      md += `- **Recommendation:** ${item.recommendation}\n`;
      md += `- **Impact:** ${item.impact}\n\n`;
    });
  }
  
  // On Track
  md += `## 🟢 ON TRACK\n\n`;
  if (briefing.onTrack.length === 0) {
    md += `*No updates this period.*\n\n`;
  } else {
    briefing.onTrack.forEach((item, index) => {
      md += `${index + 1}. **${item.title}** - ${item.status}\n`;
    });
    md += `\n`;
  }
  
  // Team Health
  md += `## 📊 TEAM HEALTH\n\n`;
  md += `| Team | Headcount | Capacity | Velocity | Blockers | Status |\n`;
  md += `|------|-----------|----------|----------|----------|--------|\n`;
  briefing.teamHealth.forEach(team => {
    const statusEmoji = team.status === 'healthy' ? '🟢' : team.status === 'warning' ? '🟡' : '🔴';
    md += `| ${team.team} | ${team.headcount} | ${team.capacity}% | ${team.velocity} | ${team.blockers} | ${statusEmoji} ${team.status} |\n`;
  });
  md += `\n`;
  
  // Notes
  const teamsWithNotes = briefing.teamHealth.filter(t => t.notes);
  if (teamsWithNotes.length > 0) {
    md += `### Notes:\n`;
    teamsWithNotes.forEach(team => {
      md += `- **${team.team}:** ${team.notes}\n`;
    });
    md += `\n`;
  }
  
  // Summary
  md += `---\n\n`;
  md += `## 📋 SUMMARY\n\n`;
  md += `${briefing.summary}\n\n`;
  md += `---\n`;
  md += `*Last updated: ${new Date(briefing.generatedAt).toLocaleString()}*\n`;
  
  return md;
}

// Convert briefing to plain text format
export function briefingToPlainText(briefing: ExecutiveBriefingOutput): string {
  let text = '';
  
  text += `EXECUTIVE BRIEFING\n`;
  text += `Week of ${briefing.weekOf} | Generated ${new Date(briefing.generatedAt).toLocaleString()}\n`;
  text += `${'='.repeat(60)}\n\n`;
  
  // Top Risks
  text += `🔴 TOP RISKS\n`;
  text += `${'-'.repeat(40)}\n`;
  if (briefing.topRisks.length === 0) {
    text += `No critical risks at this time.\n\n`;
  } else {
    briefing.topRisks.forEach((risk, index) => {
      text += `${index + 1}. ${risk.title}\n`;
      text += `   Issue: ${risk.issue}\n`;
      text += `   Impact: ${risk.impact}\n`;
      text += `   Owner: ${risk.owner} → ${risk.nextStep}\n\n`;
    });
  }
  
  // Attention Needed
  text += `🟡 ATTENTION NEEDED\n`;
  text += `${'-'.repeat(40)}\n`;
  if (briefing.attentionNeeded.length === 0) {
    text += `No items requiring immediate attention.\n\n`;
  } else {
    briefing.attentionNeeded.forEach((item, index) => {
      text += `${index + 1}. ${item.title}\n`;
      text += `   ${item.context}\n`;
      text += `   → ${item.recommendation}\n\n`;
    });
  }
  
  // On Track
  text += `🟢 ON TRACK\n`;
  text += `${'-'.repeat(40)}\n`;
  briefing.onTrack.forEach((item, index) => {
    text += `${index + 1}. ${item.title} - ${item.status}\n`;
  });
  text += `\n`;
  
  // Team Health
  text += `📊 TEAM HEALTH\n`;
  text += `${'-'.repeat(40)}\n`;
  briefing.teamHealth.forEach(team => {
    const statusIcon = team.status === 'healthy' ? '✓' : team.status === 'warning' ? '⚠' : '✗';
    text += `${statusIcon} ${team.team} (${team.headcount}): ${team.capacity}% capacity, ${team.blockers} blockers\n`;
    if (team.notes) {
      text += `   Note: ${team.notes}\n`;
    }
  });
  text += `\n`;
  
  // Summary
  text += `${'='.repeat(60)}\n`;
  text += `SUMMARY: ${briefing.summary}\n`;
  
  return text;
}

// Copy briefing to clipboard
export async function copyToClipboard(briefing: ExecutiveBriefingOutput, format: 'markdown' | 'text' = 'markdown'): Promise<boolean> {
  try {
    const content = format === 'markdown' 
      ? briefingToMarkdown(briefing) 
      : briefingToPlainText(briefing);
    
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Generate printable HTML for PDF export
export function briefingToHTML(briefing: ExecutiveBriefingOutput): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Executive Briefing - ${briefing.weekOf}</title>
  <style>
    @page { margin: 1in; size: letter; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #1a1a2e;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 { color: #2d3748; border-bottom: 2px solid #4299e1; padding-bottom: 10px; }
    h2 { color: #2d3748; margin-top: 24px; font-size: 1.2em; }
    .meta { color: #718096; font-size: 0.9em; margin-bottom: 20px; }
    .section { margin-bottom: 24px; }
    .risk-item, .attention-item { 
      background: #fef3f2; 
      border-left: 4px solid #ef4444; 
      padding: 12px; 
      margin: 8px 0;
      border-radius: 0 8px 8px 0;
    }
    .attention-item { 
      background: #fffbeb; 
      border-left-color: #f59e0b; 
    }
    .ontrack-item { 
      background: #f0fdf4; 
      border-left: 4px solid #22c55e; 
      padding: 8px 12px; 
      margin: 4px 0;
      border-radius: 0 8px 8px 0;
    }
    .team-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .team-table th, .team-table td { 
      padding: 8px 12px; 
      text-align: left; 
      border-bottom: 1px solid #e2e8f0; 
    }
    .team-table th { background: #f7fafc; font-weight: 600; }
    .status-healthy { color: #22c55e; }
    .status-warning { color: #f59e0b; }
    .status-critical { color: #ef4444; }
    .summary { 
      background: #f7fafc; 
      padding: 16px; 
      border-radius: 8px; 
      margin-top: 24px;
      border: 1px solid #e2e8f0;
    }
    .label { font-weight: 600; color: #4a5568; }
    @media print {
      body { padding: 0; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>📊 Executive Briefing</h1>
  <div class="meta">Week of ${briefing.weekOf} | Generated ${new Date(briefing.generatedAt).toLocaleString()}</div>
  
  <div class="section">
    <h2>🔴 TOP RISKS</h2>
    ${briefing.topRisks.length === 0 
      ? '<p>No critical risks at this time.</p>'
      : briefing.topRisks.map(risk => `
        <div class="risk-item">
          <strong>${risk.title}</strong><br>
          <span class="label">Issue:</span> ${risk.issue}<br>
          <span class="label">Impact:</span> ${risk.impact}<br>
          <span class="label">Owner:</span> ${risk.owner} → ${risk.nextStep}
        </div>
      `).join('')
    }
  </div>
  
  <div class="section">
    <h2>🟡 ATTENTION NEEDED</h2>
    ${briefing.attentionNeeded.length === 0
      ? '<p>No items requiring immediate attention.</p>'
      : briefing.attentionNeeded.map(item => `
        <div class="attention-item">
          <strong>${item.title}</strong><br>
          <span class="label">Context:</span> ${item.context}<br>
          <span class="label">Recommendation:</span> ${item.recommendation}
        </div>
      `).join('')
    }
  </div>
  
  <div class="section">
    <h2>🟢 ON TRACK</h2>
    ${briefing.onTrack.map(item => `
      <div class="ontrack-item">
        <strong>${item.title}</strong> — ${item.status}
      </div>
    `).join('')}
  </div>
  
  <div class="section">
    <h2>📊 TEAM HEALTH</h2>
    <table class="team-table">
      <thead>
        <tr>
          <th>Team</th>
          <th>Size</th>
          <th>Capacity</th>
          <th>Velocity</th>
          <th>Blockers</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${briefing.teamHealth.map(team => `
          <tr>
            <td>${team.team}</td>
            <td>${team.headcount}</td>
            <td>${team.capacity}%</td>
            <td>${team.velocity}</td>
            <td>${team.blockers}</td>
            <td class="status-${team.status}">${team.status.toUpperCase()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="summary">
    <h2 style="margin-top: 0;">📋 Summary</h2>
    <p>${briefing.summary}</p>
  </div>
</body>
</html>`;
}

// Open print dialog for PDF export
export function exportToPDF(briefing: ExecutiveBriefingOutput): void {
  const html = briefingToHTML(briefing);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

// Format briefing for Slack (simplified markdown)
export function briefingToSlack(briefing: ExecutiveBriefingOutput): string {
  let text = '';
  
  text += `*📊 EXECUTIVE BRIEFING*\n`;
  text += `_Week of ${briefing.weekOf}_\n\n`;
  
  // Top Risks
  text += `*🔴 TOP RISKS*\n`;
  if (briefing.topRisks.length === 0) {
    text += `> No critical risks\n`;
  } else {
    briefing.topRisks.forEach(risk => {
      text += `• *${risk.title}*: ${risk.issue} → _${risk.owner}_\n`;
    });
  }
  text += `\n`;
  
  // Attention Needed
  text += `*🟡 ATTENTION NEEDED*\n`;
  if (briefing.attentionNeeded.length === 0) {
    text += `> All clear\n`;
  } else {
    briefing.attentionNeeded.forEach(item => {
      text += `• ${item.title}: ${item.recommendation}\n`;
    });
  }
  text += `\n`;
  
  // On Track
  text += `*🟢 ON TRACK*\n`;
  briefing.onTrack.forEach(item => {
    text += `• ${item.title} - ${item.status}\n`;
  });
  text += `\n`;
  
  // Team Health summary
  text += `*📊 TEAM HEALTH*\n`;
  briefing.teamHealth.forEach(team => {
    const emoji = team.status === 'healthy' ? '✅' : team.status === 'warning' ? '⚠️' : '🔴';
    text += `${emoji} ${team.team}: ${team.capacity}% capacity, ${team.blockers} blockers\n`;
  });
  text += `\n`;
  
  text += `> _${briefing.summary}_\n`;
  
  return text;
}


