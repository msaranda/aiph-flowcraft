// Transform FlowCraft Issues/Sprints to BriefingData format

import { BriefingData, Team, Task, TeamMember } from './mockData';

// FlowCraft Issue interface (from flowcraft.tsx)
export interface FlowCraftIssue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  sprintId: string | null;
  createdAt: string;
  [key: string]: any;
}

export interface FlowCraftSprint {
  id: string;
  name: string;
  status: 'planned' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: string;
}

// Map FlowCraft status to briefing status
function mapStatus(status: string): 'backlog' | 'ready' | 'in-progress' | 'in-review' | 'done' {
  const statusMap: Record<string, 'backlog' | 'ready' | 'in-progress' | 'in-review' | 'done'> = {
    'todo': 'backlog',
    'in-progress': 'in-progress',
    'in-review': 'in-review',
    'done': 'done',
  };
  return statusMap[status] || 'backlog';
}

// Map FlowCraft priority to briefing priority
function mapPriority(priority: string): 'critical' | 'high' | 'medium' | 'low' {
  if (priority.startsWith('P0')) return 'critical';
  if (priority.startsWith('P1')) return 'high';
  if (priority.startsWith('P2')) return 'medium';
  return 'low';
}

// Extract team name from assignee (simple heuristic - can be improved)
function inferTeam(assignee: string, issues: FlowCraftIssue[]): string {
  // Group assignees by common patterns
  const assigneeIssues = issues.filter(i => i.assignee === assignee);
  if (assigneeIssues.length === 0) return 'Engineering';
  
  // Simple heuristic: check if assignee appears in Engineering, Design, or Product contexts
  // For now, we'll use a simple distribution
  const allAssignees = [...new Set(issues.map(i => i.assignee))];
  const assigneeIndex = allAssignees.indexOf(assignee);
  
  // Distribute across 3 teams roughly
  if (assigneeIndex < allAssignees.length / 3) return 'Engineering';
  if (assigneeIndex < (allAssignees.length * 2) / 3) return 'Design';
  return 'Product';
}

// Transform FlowCraft issues to briefing tasks
function transformIssuesToTasks(issues: FlowCraftIssue[], sprints: FlowCraftSprint[] = []): Task[] {
  const today = new Date();
  
  return issues.map(issue => {
    // Calculate due date from sprint if available
    let dueDate: string;
    if (issue.sprintId) {
      const sprint = sprints.find(s => s.id === issue.sprintId);
      if (sprint && sprint.endDate) {
        dueDate = sprint.endDate;
      } else {
        // Default: 7 days from now for sprint items
        dueDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      }
    } else {
      // Backlog items: 14 days from now
      dueDate = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    
    // Check if blocked (simplified - in real app, this would come from issue data)
    // For now, mark high-priority in-progress items as potentially blocked
    const blocked = issue.status === 'in-progress' && 
                    issue.priority.startsWith('P0') && 
                    Math.random() > 0.7; // 30% chance for demo
    
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: mapStatus(issue.status),
      owner: issue.assignee,
      dueDate,
      createdDate: issue.createdAt,
      lastUpdated: issue.createdAt, // In real app, this would be tracked
      priority: mapPriority(issue.priority),
      blocked,
      blockerReason: blocked ? 'Awaiting dependencies or external input' : undefined,
      dependencies: [],
      tags: [],
      estimatedHours: 8, // Default estimate
    };
  });
}

// Group tasks by team (inferred from assignees)
function groupTasksByTeam(tasks: Task[], issues: FlowCraftIssue[]): Map<string, Task[]> {
  const teamMap = new Map<string, Task[]>();
  
  tasks.forEach(task => {
    const team = inferTeam(task.owner, issues);
    if (!teamMap.has(team)) {
      teamMap.set(team, []);
    }
    teamMap.get(team)!.push(task);
  });
  
  return teamMap;
}

// Calculate team metrics
function calculateTeamMetrics(tasks: Task[]): { capacity: number; velocity: number; blockerCount: number } {
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress' || t.status === 'in-review');
  const doneTasks = tasks.filter(t => t.status === 'done');
  const blockedTasks = tasks.filter(t => t.blocked);
  
  // Capacity based on in-progress work
  const totalEstimated = inProgressTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const capacity = Math.min(130, 60 + Math.floor(totalEstimated / 8) * 5); // 60-130% range
  
  // Velocity based on done tasks
  const velocity = doneTasks.length * 8; // Points per task
  
  return {
    capacity,
    velocity,
    blockerCount: blockedTasks.length,
  };
}

// Main transformation function
export function transformFlowCraftDataToBriefingData(
  issues: FlowCraftIssue[],
  sprints: FlowCraftSprint[] = []
): BriefingData {
  const tasks = transformIssuesToTasks(issues, sprints);
  const teamMap = groupTasksByTeam(tasks, issues);
  
  // Create teams
  const teams: Team[] = [];
  const teamNames = ['Engineering', 'Design', 'Product'];
  
  teamNames.forEach((teamName, index) => {
    const teamTasks = teamMap.get(teamName) || [];
    const metrics = calculateTeamMetrics(teamTasks);
    
    // Get unique assignees for this team
    const assignees = [...new Set(teamTasks.map(t => t.owner))];
    const members: TeamMember[] = assignees.map((name, i) => ({
      id: `${teamName.toLowerCase()}-${i + 1}`,
      name,
      role: index === 0 ? 'Developer' : index === 1 ? 'Designer' : 'Product Manager',
    }));
    
    teams.push({
      name: teamName,
      members,
      tasks: teamTasks,
      capacity: metrics.capacity,
      velocity: metrics.velocity,
      blockerCount: metrics.blockerCount,
    });
  });
  
  // Calculate overall stats
  const today = new Date();
  const overdueCount = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate < today && t.status !== 'done';
  }).length;
  
  const blockedCount = tasks.filter(t => t.blocked).length;
  const criticalCount = tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length;
  
  return {
    teams,
    timeWindow: 'last_7_days',
    currentDate: today.toISOString().split('T')[0],
    totalTasks: tasks.length,
    overdueCount,
    blockedCount,
    criticalCount,
  };
}

