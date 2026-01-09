// Transform FlowCraft Issues/Sprints to BriefingData format

import { BriefingData, Team as BriefingTeam, Task, TeamMember } from './mockData';

// FlowCraft Issue interface (from flowcraft.tsx)
export interface FlowCraftIssue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string; // User ID
  sprintId: string | null;
  createdAt: string;
  dueDate?: string;
  [key: string]: any;
}

export interface FlowCraftSprint {
  id: string;
  name: string;
  status: 'planned' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: string;
  teamId?: string;
}

// User interface matching flowcraft.tsx
export interface FlowCraftUser {
  id: string;
  name: string;
  email: string;
  teamId: string;
  avatar?: string;
  role?: string;
}

// Team interface matching flowcraft.tsx
export interface FlowCraftTeam {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
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

// Get team name for a user using actual team data
function getTeamForUser(
  userId: string, 
  users: FlowCraftUser[], 
  teams: FlowCraftTeam[]
): string {
  const user = users.find(u => u.id === userId);
  if (!user) return 'Engineering'; // Default fallback
  
  const team = teams.find(t => t.id === user.teamId);
  return team?.name || 'Engineering';
}

// Get user name from user ID
function getUserName(userId: string, users: FlowCraftUser[]): string {
  const user = users.find(u => u.id === userId);
  return user?.name || userId; // Fallback to userId if not found
}

// Transform FlowCraft issues to briefing tasks
function transformIssuesToTasks(
  issues: FlowCraftIssue[], 
  sprints: FlowCraftSprint[] = [],
  users: FlowCraftUser[] = []
): Task[] {
  return issues.map(issue => {
    // Use issue's dueDate if available, otherwise calculate from sprint
    let dueDate: string;
    if (issue.dueDate) {
      dueDate = issue.dueDate;
    } else if (issue.sprintId) {
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
    
    // Check if blocked - use deterministic logic based on task properties
    // Block P0/P1 in-progress tasks that have been stalled (use task ID hash for consistency)
    const taskHash = issue.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const blocked = issue.status === 'in-progress' && 
                    (issue.priority.startsWith('P0') || issue.priority.startsWith('P1')) && 
                    taskHash % 5 === 0; // Deterministic: ~20% of P0/P1 in-progress tasks are blocked
    
    // Get user name for display
    const ownerName = getUserName(issue.assignee, users);
    
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: mapStatus(issue.status),
      owner: ownerName,
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

// Group tasks by team using actual user-team assignments
function groupTasksByTeam(
  tasks: Task[], 
  issues: FlowCraftIssue[],
  users: FlowCraftUser[],
  teams: FlowCraftTeam[]
): Map<string, Task[]> {
  const teamMap = new Map<string, Task[]>();
  
  // Initialize all teams with empty arrays
  teams.forEach(team => {
    teamMap.set(team.name, []);
  });
  
  tasks.forEach((task, index) => {
    // Get the original issue to find the user ID
    const issue = issues[index];
    if (!issue) return;
    
    // Get the team name from the user's team assignment
    const teamName = getTeamForUser(issue.assignee, users, teams);
    
    if (!teamMap.has(teamName)) {
      teamMap.set(teamName, []);
    }
    teamMap.get(teamName)!.push(task);
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

// Main transformation function - updated to accept users and teams
export function transformFlowCraftDataToBriefingData(
  issues: FlowCraftIssue[],
  sprints: FlowCraftSprint[] = [],
  users: FlowCraftUser[] = [],
  fcTeams: FlowCraftTeam[] = []
): BriefingData {
  // Use provided teams or default to Engineering, Design, Product
  const teamNames = fcTeams.length > 0 
    ? fcTeams.map(t => t.name)
    : ['Engineering', 'Design', 'Product'];
  
  const tasks = transformIssuesToTasks(issues, sprints, users);
  const teamMap = groupTasksByTeam(tasks, issues, users, fcTeams);
  
  // Create teams for briefing
  const briefingTeams: BriefingTeam[] = [];
  
  teamNames.forEach((teamName, index) => {
    const teamTasks = teamMap.get(teamName) || [];
    const metrics = calculateTeamMetrics(teamTasks);
    
    // Get team members from users data
    const fcTeam = fcTeams.find(t => t.name === teamName);
    const teamUsers = fcTeam 
      ? users.filter(u => u.teamId === fcTeam.id)
      : [];
    
    const members: TeamMember[] = teamUsers.length > 0
      ? teamUsers.map((user, i) => ({
          id: user.id,
          name: user.name,
          role: user.role || (index === 0 ? 'Developer' : index === 1 ? 'Designer' : 'Product Manager'),
        }))
      : // Fallback: extract unique assignees from tasks
        [...new Set(teamTasks.map(t => t.owner))].map((name, i) => ({
          id: `${teamName.toLowerCase()}-${i + 1}`,
          name,
          role: index === 0 ? 'Developer' : index === 1 ? 'Designer' : 'Product Manager',
        }));
    
    briefingTeams.push({
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
    teams: briefingTeams,
    timeWindow: 'last_7_days',
    currentDate: today.toISOString().split('T')[0],
    totalTasks: tasks.length,
    overdueCount,
    blockedCount,
    criticalCount,
  };
}
