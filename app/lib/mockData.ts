// Mock Data Generator for Executive Briefing
// Generates realistic task data for a 35-person startup

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'ready' | 'in-progress' | 'in-review' | 'done';
  owner: string;
  dueDate: string;
  createdDate: string;
  lastUpdated: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  blocked: boolean;
  blockerReason?: string;
  dependencies: string[];
  tags: string[];
  estimatedHours: number;
  actualHours?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface Team {
  name: string;
  members: TeamMember[];
  tasks: Task[];
  capacity: number; // percentage utilized
  velocity: number; // points per sprint
  blockerCount: number;
}

export interface BriefingData {
  teams: Team[];
  timeWindow: string;
  currentDate: string;
  totalTasks: number;
  overdueCount: number;
  blockedCount: number;
  criticalCount: number;
}

// Team member data
const engineeringMembers: TeamMember[] = [
  { id: 'eng-1', name: 'Alice Chen', role: 'Engineering Lead' },
  { id: 'eng-2', name: 'Marcus Johnson', role: 'Senior Backend Dev' },
  { id: 'eng-3', name: 'Sarah Kim', role: 'Senior Frontend Dev' },
  { id: 'eng-4', name: 'David Park', role: 'Backend Developer' },
  { id: 'eng-5', name: 'Emma Wilson', role: 'Frontend Developer' },
  { id: 'eng-6', name: 'James Liu', role: 'Full Stack Developer' },
  { id: 'eng-7', name: 'Rachel Green', role: 'DevOps Engineer' },
  { id: 'eng-8', name: 'Michael Brown', role: 'Backend Developer' },
  { id: 'eng-9', name: 'Lisa Wang', role: 'Frontend Developer' },
  { id: 'eng-10', name: 'Tom Garcia', role: 'QA Engineer' },
  { id: 'eng-11', name: 'Nina Patel', role: 'Backend Developer' },
  { id: 'eng-12', name: 'Chris Lee', role: 'Frontend Developer' },
  { id: 'eng-13', name: 'Amy Thompson', role: 'Full Stack Developer' },
  { id: 'eng-14', name: 'Kevin Zhang', role: 'Backend Developer' },
  { id: 'eng-15', name: 'Jessica Martinez', role: 'QA Engineer' },
];

const designMembers: TeamMember[] = [
  { id: 'des-1', name: 'Bob Smith', role: 'Design Lead' },
  { id: 'des-2', name: 'Olivia Taylor', role: 'Senior UX Designer' },
  { id: 'des-3', name: 'Daniel Adams', role: 'UI Designer' },
  { id: 'des-4', name: 'Sophie Clark', role: 'UX Researcher' },
  { id: 'des-5', name: 'Ryan Moore', role: 'Visual Designer' },
  { id: 'des-6', name: 'Emily Davis', role: 'Product Designer' },
  { id: 'des-7', name: 'Nathan White', role: 'UI Designer' },
  { id: 'des-8', name: 'Mia Anderson', role: 'UX Designer' },
];

const productMembers: TeamMember[] = [
  { id: 'prod-1', name: 'Carol Davis', role: 'VP Product' },
  { id: 'prod-2', name: 'Alex Turner', role: 'Senior PM' },
  { id: 'prod-3', name: 'Hannah Scott', role: 'Product Manager' },
  { id: 'prod-4', name: 'Jake Robinson', role: 'Product Analyst' },
  { id: 'prod-5', name: 'Laura Mitchell', role: 'Technical Writer' },
];

// Generate dates relative to current date
function getRelativeDate(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function getRandomMember(members: TeamMember[]): string {
  return members[Math.floor(Math.random() * members.length)].name;
}

// Engineering tasks (20 tasks)
const engineeringTasks: Task[] = [
  {
    id: 'ENG-001',
    title: 'Payment API integration',
    description: 'Integrate with Stripe payment API for checkout flow',
    status: 'in-progress',
    owner: 'Marcus Johnson',
    dueDate: getRelativeDate(2),
    createdDate: getRelativeDate(-14),
    lastUpdated: getRelativeDate(-5),
    priority: 'critical',
    blocked: true,
    blockerReason: 'Waiting on vendor API credentials - no response in 5 days',
    dependencies: [],
    tags: ['payments', 'api', 'critical-path'],
    estimatedHours: 40,
    actualHours: 24,
  },
  {
    id: 'ENG-002',
    title: 'Mobile app release build',
    description: 'Prepare and submit mobile app to App Store and Play Store',
    status: 'in-progress',
    owner: 'Sarah Kim',
    dueDate: getRelativeDate(-1),
    createdDate: getRelativeDate(-10),
    lastUpdated: getRelativeDate(0),
    priority: 'critical',
    blocked: true,
    blockerReason: 'Waiting on Design team final mocks - 3 days behind',
    dependencies: ['DES-003'],
    tags: ['mobile', 'release'],
    estimatedHours: 32,
    actualHours: 20,
  },
  {
    id: 'ENG-003',
    title: 'API rate limiting implementation',
    description: 'Implement rate limiting for all public API endpoints',
    status: 'in-review',
    owner: 'David Park',
    dueDate: getRelativeDate(3),
    createdDate: getRelativeDate(-7),
    lastUpdated: getRelativeDate(-1),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['security', 'api'],
    estimatedHours: 16,
    actualHours: 14,
  },
  {
    id: 'ENG-004',
    title: 'Database migration v2.0',
    description: 'Migrate database schema for new feature set',
    status: 'ready',
    owner: 'Emma Wilson',
    dueDate: getRelativeDate(7),
    createdDate: getRelativeDate(-5),
    lastUpdated: getRelativeDate(-2),
    priority: 'high',
    blocked: false,
    dependencies: ['ENG-003'],
    tags: ['database', 'migration'],
    estimatedHours: 24,
  },
  {
    id: 'ENG-005',
    title: 'User authentication refactor',
    description: 'Refactor OAuth implementation for better security',
    status: 'done',
    owner: 'Alice Chen',
    dueDate: getRelativeDate(-3),
    createdDate: getRelativeDate(-14),
    lastUpdated: getRelativeDate(-3),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['security', 'auth'],
    estimatedHours: 32,
    actualHours: 28,
  },
  {
    id: 'ENG-006',
    title: 'Performance optimization - bundle size',
    description: 'Reduce JavaScript bundle size by 40%',
    status: 'in-progress',
    owner: 'James Liu',
    dueDate: getRelativeDate(5),
    createdDate: getRelativeDate(-7),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['performance', 'frontend'],
    estimatedHours: 20,
    actualHours: 8,
  },
  {
    id: 'ENG-007',
    title: 'Infrastructure migration to K8s',
    description: 'Migrate infrastructure from EC2 to Kubernetes',
    status: 'in-progress',
    owner: 'Rachel Green',
    dueDate: getRelativeDate(14),
    createdDate: getRelativeDate(-21),
    lastUpdated: getRelativeDate(0),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['infrastructure', 'devops'],
    estimatedHours: 80,
    actualHours: 32,
  },
  {
    id: 'ENG-008',
    title: 'Real-time notifications system',
    description: 'Implement WebSocket-based notification system',
    status: 'in-review',
    owner: 'Michael Brown',
    dueDate: getRelativeDate(1),
    createdDate: getRelativeDate(-10),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['feature', 'websocket'],
    estimatedHours: 24,
    actualHours: 22,
  },
  {
    id: 'ENG-009',
    title: 'Search functionality improvements',
    description: 'Add fuzzy search and filters to main search',
    status: 'done',
    owner: 'Lisa Wang',
    dueDate: getRelativeDate(-5),
    createdDate: getRelativeDate(-12),
    lastUpdated: getRelativeDate(-5),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['feature', 'search'],
    estimatedHours: 16,
    actualHours: 18,
  },
  {
    id: 'ENG-010',
    title: 'Unit test coverage improvement',
    description: 'Increase test coverage from 65% to 80%',
    status: 'in-progress',
    owner: 'Tom Garcia',
    dueDate: getRelativeDate(10),
    createdDate: getRelativeDate(-7),
    lastUpdated: getRelativeDate(-2),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['testing', 'quality'],
    estimatedHours: 40,
    actualHours: 12,
  },
  {
    id: 'ENG-011',
    title: 'API documentation update',
    description: 'Update OpenAPI spec and developer docs',
    status: 'done',
    owner: 'Nina Patel',
    dueDate: getRelativeDate(-2),
    createdDate: getRelativeDate(-8),
    lastUpdated: getRelativeDate(-2),
    priority: 'low',
    blocked: false,
    dependencies: [],
    tags: ['documentation'],
    estimatedHours: 8,
    actualHours: 10,
  },
  {
    id: 'ENG-012',
    title: 'Dashboard widget system',
    description: 'Create customizable dashboard widget framework',
    status: 'in-progress',
    owner: 'Chris Lee',
    dueDate: getRelativeDate(4),
    createdDate: getRelativeDate(-6),
    lastUpdated: getRelativeDate(0),
    priority: 'high',
    blocked: false,
    dependencies: ['DES-002'],
    tags: ['feature', 'dashboard'],
    estimatedHours: 32,
    actualHours: 16,
  },
  {
    id: 'ENG-013',
    title: 'Security audit fixes',
    description: 'Address findings from Q4 security audit',
    status: 'in-review',
    owner: 'Amy Thompson',
    dueDate: getRelativeDate(-2),
    createdDate: getRelativeDate(-14),
    lastUpdated: getRelativeDate(-1),
    priority: 'critical',
    blocked: false,
    dependencies: [],
    tags: ['security', 'compliance'],
    estimatedHours: 24,
    actualHours: 26,
  },
  {
    id: 'ENG-014',
    title: 'Data export feature',
    description: 'Allow users to export their data in CSV/JSON formats',
    status: 'ready',
    owner: 'Kevin Zhang',
    dueDate: getRelativeDate(8),
    createdDate: getRelativeDate(-3),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['feature', 'data'],
    estimatedHours: 16,
  },
  {
    id: 'ENG-015',
    title: 'Accessibility improvements',
    description: 'Ensure WCAG 2.1 AA compliance across the app',
    status: 'backlog',
    owner: 'Jessica Martinez',
    dueDate: getRelativeDate(21),
    createdDate: getRelativeDate(-1),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['accessibility', 'compliance'],
    estimatedHours: 40,
  },
  {
    id: 'ENG-016',
    title: 'Caching layer optimization',
    description: 'Implement Redis caching for frequently accessed data',
    status: 'done',
    owner: 'Marcus Johnson',
    dueDate: getRelativeDate(-7),
    createdDate: getRelativeDate(-21),
    lastUpdated: getRelativeDate(-7),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['performance', 'backend'],
    estimatedHours: 24,
    actualHours: 20,
  },
  {
    id: 'ENG-017',
    title: 'Error tracking integration',
    description: 'Integrate Sentry for production error monitoring',
    status: 'done',
    owner: 'Rachel Green',
    dueDate: getRelativeDate(-10),
    createdDate: getRelativeDate(-15),
    lastUpdated: getRelativeDate(-10),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['monitoring', 'devops'],
    estimatedHours: 8,
    actualHours: 6,
  },
  {
    id: 'ENG-018',
    title: 'Multi-language support',
    description: 'Add i18n support for Spanish and French',
    status: 'backlog',
    owner: 'Lisa Wang',
    dueDate: getRelativeDate(30),
    createdDate: getRelativeDate(-2),
    lastUpdated: getRelativeDate(-2),
    priority: 'low',
    blocked: false,
    dependencies: [],
    tags: ['i18n', 'feature'],
    estimatedHours: 48,
  },
  {
    id: 'ENG-019',
    title: 'CI/CD pipeline improvements',
    description: 'Reduce build time and add staging environment',
    status: 'in-progress',
    owner: 'Rachel Green',
    dueDate: getRelativeDate(6),
    createdDate: getRelativeDate(-5),
    lastUpdated: getRelativeDate(0),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['devops', 'infrastructure'],
    estimatedHours: 24,
    actualHours: 10,
  },
  {
    id: 'ENG-020',
    title: 'Analytics dashboard backend',
    description: 'Build API endpoints for analytics dashboard',
    status: 'ready',
    owner: 'David Park',
    dueDate: getRelativeDate(12),
    createdDate: getRelativeDate(-3),
    lastUpdated: getRelativeDate(-1),
    priority: 'high',
    blocked: false,
    dependencies: ['PROD-004'],
    tags: ['analytics', 'api'],
    estimatedHours: 32,
  },
];

// Design tasks (15 tasks)
const designTasks: Task[] = [
  {
    id: 'DES-001',
    title: 'Dashboard redesign',
    description: 'Complete redesign of main dashboard with new metrics',
    status: 'done',
    owner: 'Bob Smith',
    dueDate: getRelativeDate(-5),
    createdDate: getRelativeDate(-20),
    lastUpdated: getRelativeDate(-5),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['dashboard', 'redesign'],
    estimatedHours: 40,
    actualHours: 45,
  },
  {
    id: 'DES-002',
    title: 'Widget component library',
    description: 'Design reusable widget components for dashboard',
    status: 'in-progress',
    owner: 'Olivia Taylor',
    dueDate: getRelativeDate(2),
    createdDate: getRelativeDate(-10),
    lastUpdated: getRelativeDate(0),
    priority: 'high',
    blocked: false,
    dependencies: ['DES-001'],
    tags: ['components', 'design-system'],
    estimatedHours: 32,
    actualHours: 24,
  },
  {
    id: 'DES-003',
    title: 'Mobile app final mocks',
    description: 'Finalize all mobile app screens for release',
    status: 'in-progress',
    owner: 'Daniel Adams',
    dueDate: getRelativeDate(-3),
    createdDate: getRelativeDate(-14),
    lastUpdated: getRelativeDate(0),
    priority: 'critical',
    blocked: false,
    dependencies: [],
    tags: ['mobile', 'mocks'],
    estimatedHours: 48,
    actualHours: 40,
  },
  {
    id: 'DES-004',
    title: 'User onboarding flow redesign',
    description: 'Improve first-time user experience',
    status: 'in-review',
    owner: 'Sophie Clark',
    dueDate: getRelativeDate(1),
    createdDate: getRelativeDate(-12),
    lastUpdated: getRelativeDate(-2),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['onboarding', 'ux'],
    estimatedHours: 24,
    actualHours: 22,
  },
  {
    id: 'DES-005',
    title: 'Icon set expansion',
    description: 'Create 50 new icons for product features',
    status: 'done',
    owner: 'Ryan Moore',
    dueDate: getRelativeDate(-8),
    createdDate: getRelativeDate(-15),
    lastUpdated: getRelativeDate(-8),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['icons', 'design-system'],
    estimatedHours: 16,
    actualHours: 18,
  },
  {
    id: 'DES-006',
    title: 'Settings page redesign',
    description: 'Modernize settings and preferences UI',
    status: 'ready',
    owner: 'Emily Davis',
    dueDate: getRelativeDate(10),
    createdDate: getRelativeDate(-4),
    lastUpdated: getRelativeDate(-2),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['settings', 'ui'],
    estimatedHours: 20,
  },
  {
    id: 'DES-007',
    title: 'Dark mode refinements',
    description: 'Polish dark mode color palette and contrast',
    status: 'in-progress',
    owner: 'Nathan White',
    dueDate: getRelativeDate(4),
    createdDate: getRelativeDate(-6),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['dark-mode', 'polish'],
    estimatedHours: 12,
    actualHours: 6,
  },
  {
    id: 'DES-008',
    title: 'Email template designs',
    description: 'Design responsive email templates for notifications',
    status: 'done',
    owner: 'Mia Anderson',
    dueDate: getRelativeDate(-4),
    createdDate: getRelativeDate(-12),
    lastUpdated: getRelativeDate(-4),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['email', 'templates'],
    estimatedHours: 16,
    actualHours: 14,
  },
  {
    id: 'DES-009',
    title: 'Error states and empty states',
    description: 'Design consistent error and empty state illustrations',
    status: 'in-progress',
    owner: 'Ryan Moore',
    dueDate: getRelativeDate(6),
    createdDate: getRelativeDate(-5),
    lastUpdated: getRelativeDate(-1),
    priority: 'low',
    blocked: false,
    dependencies: [],
    tags: ['illustrations', 'ux'],
    estimatedHours: 20,
    actualHours: 8,
  },
  {
    id: 'DES-010',
    title: 'Analytics dashboard mockups',
    description: 'Design analytics dashboard with charts and graphs',
    status: 'in-progress',
    owner: 'Olivia Taylor',
    dueDate: getRelativeDate(8),
    createdDate: getRelativeDate(-4),
    lastUpdated: getRelativeDate(0),
    priority: 'high',
    blocked: true,
    blockerReason: 'Waiting on product requirements from PM team',
    dependencies: ['PROD-004'],
    tags: ['analytics', 'dashboard'],
    estimatedHours: 32,
    actualHours: 8,
  },
  {
    id: 'DES-011',
    title: 'User research synthesis',
    description: 'Compile findings from Q4 user interviews',
    status: 'done',
    owner: 'Sophie Clark',
    dueDate: getRelativeDate(-6),
    createdDate: getRelativeDate(-14),
    lastUpdated: getRelativeDate(-6),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['research', 'ux'],
    estimatedHours: 24,
    actualHours: 28,
  },
  {
    id: 'DES-012',
    title: 'Accessibility audit review',
    description: 'Review and document accessibility gaps',
    status: 'ready',
    owner: 'Emily Davis',
    dueDate: getRelativeDate(14),
    createdDate: getRelativeDate(-2),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['accessibility', 'audit'],
    estimatedHours: 16,
  },
  {
    id: 'DES-013',
    title: 'Marketing landing page',
    description: 'Design new marketing landing page for Q1 campaign',
    status: 'backlog',
    owner: 'Daniel Adams',
    dueDate: getRelativeDate(21),
    createdDate: getRelativeDate(-1),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['marketing', 'landing-page'],
    estimatedHours: 24,
  },
  {
    id: 'DES-014',
    title: 'Component documentation',
    description: 'Document all design system components in Figma',
    status: 'in-progress',
    owner: 'Nathan White',
    dueDate: getRelativeDate(12),
    createdDate: getRelativeDate(-7),
    lastUpdated: getRelativeDate(-2),
    priority: 'low',
    blocked: false,
    dependencies: [],
    tags: ['documentation', 'design-system'],
    estimatedHours: 20,
    actualHours: 6,
  },
  {
    id: 'DES-015',
    title: 'Print style improvements',
    description: 'Improve print stylesheets for reports',
    status: 'backlog',
    owner: 'Mia Anderson',
    dueDate: getRelativeDate(28),
    createdDate: getRelativeDate(-1),
    lastUpdated: getRelativeDate(-1),
    priority: 'low',
    blocked: false,
    dependencies: [],
    tags: ['print', 'styling'],
    estimatedHours: 8,
  },
];

// Product tasks (10 tasks)
const productTasks: Task[] = [
  {
    id: 'PROD-001',
    title: 'Q1 roadmap finalization',
    description: 'Finalize and communicate Q1 product roadmap',
    status: 'done',
    owner: 'Carol Davis',
    dueDate: getRelativeDate(-7),
    createdDate: getRelativeDate(-21),
    lastUpdated: getRelativeDate(-7),
    priority: 'critical',
    blocked: false,
    dependencies: [],
    tags: ['roadmap', 'planning'],
    estimatedHours: 16,
    actualHours: 20,
  },
  {
    id: 'PROD-002',
    title: 'Competitor analysis update',
    description: 'Update competitive landscape analysis',
    status: 'done',
    owner: 'Alex Turner',
    dueDate: getRelativeDate(-3),
    createdDate: getRelativeDate(-10),
    lastUpdated: getRelativeDate(-3),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['research', 'competitive'],
    estimatedHours: 12,
    actualHours: 14,
  },
  {
    id: 'PROD-003',
    title: 'Feature prioritization workshop',
    description: 'Conduct prioritization workshop with stakeholders',
    status: 'in-progress',
    owner: 'Hannah Scott',
    dueDate: getRelativeDate(2),
    createdDate: getRelativeDate(-5),
    lastUpdated: getRelativeDate(0),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['workshop', 'prioritization'],
    estimatedHours: 8,
    actualHours: 4,
  },
  {
    id: 'PROD-004',
    title: 'Analytics requirements spec',
    description: 'Write detailed requirements for analytics feature',
    status: 'in-progress',
    owner: 'Alex Turner',
    dueDate: getRelativeDate(-2),
    createdDate: getRelativeDate(-10),
    lastUpdated: getRelativeDate(-1),
    priority: 'high',
    blocked: false,
    dependencies: [],
    tags: ['requirements', 'analytics'],
    estimatedHours: 16,
    actualHours: 12,
  },
  {
    id: 'PROD-005',
    title: 'User feedback analysis',
    description: 'Analyze and summarize user feedback from Q4',
    status: 'in-review',
    owner: 'Jake Robinson',
    dueDate: getRelativeDate(1),
    createdDate: getRelativeDate(-8),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['feedback', 'analysis'],
    estimatedHours: 12,
    actualHours: 10,
  },
  {
    id: 'PROD-006',
    title: 'Release notes for v2.5',
    description: 'Prepare release notes and documentation',
    status: 'ready',
    owner: 'Laura Mitchell',
    dueDate: getRelativeDate(5),
    createdDate: getRelativeDate(-3),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: ['ENG-002', 'ENG-003'],
    tags: ['release', 'documentation'],
    estimatedHours: 8,
  },
  {
    id: 'PROD-007',
    title: 'Beta program recruitment',
    description: 'Recruit beta users for new feature testing',
    status: 'in-progress',
    owner: 'Hannah Scott',
    dueDate: getRelativeDate(7),
    createdDate: getRelativeDate(-4),
    lastUpdated: getRelativeDate(-1),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['beta', 'users'],
    estimatedHours: 8,
    actualHours: 3,
  },
  {
    id: 'PROD-008',
    title: 'Customer interview scheduling',
    description: 'Schedule 10 customer interviews for research',
    status: 'done',
    owner: 'Jake Robinson',
    dueDate: getRelativeDate(-4),
    createdDate: getRelativeDate(-12),
    lastUpdated: getRelativeDate(-4),
    priority: 'medium',
    blocked: false,
    dependencies: [],
    tags: ['research', 'interviews'],
    estimatedHours: 6,
    actualHours: 8,
  },
  {
    id: 'PROD-009',
    title: 'KPI dashboard setup',
    description: 'Set up product KPI tracking dashboard',
    status: 'backlog',
    owner: 'Carol Davis',
    dueDate: getRelativeDate(14),
    createdDate: getRelativeDate(-2),
    lastUpdated: getRelativeDate(-2),
    priority: 'high',
    blocked: false,
    dependencies: ['ENG-020'],
    tags: ['kpi', 'dashboard'],
    estimatedHours: 12,
  },
  {
    id: 'PROD-010',
    title: 'API documentation review',
    description: 'Review and approve API documentation updates',
    status: 'done',
    owner: 'Laura Mitchell',
    dueDate: getRelativeDate(-2),
    createdDate: getRelativeDate(-6),
    lastUpdated: getRelativeDate(-2),
    priority: 'low',
    blocked: false,
    dependencies: ['ENG-011'],
    tags: ['documentation', 'review'],
    estimatedHours: 4,
    actualHours: 3,
  },
];

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

// Generate complete briefing data
export function generateMockBriefingData(): BriefingData {
  const engMetrics = calculateTeamMetrics(engineeringTasks);
  const desMetrics = calculateTeamMetrics(designTasks);
  const prodMetrics = calculateTeamMetrics(productTasks);
  
  const allTasks = [...engineeringTasks, ...designTasks, ...productTasks];
  const today = new Date();
  
  const overdueCount = allTasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate < today && t.status !== 'done';
  }).length;
  
  const blockedCount = allTasks.filter(t => t.blocked).length;
  const criticalCount = allTasks.filter(t => t.priority === 'critical' && t.status !== 'done').length;
  
  return {
    teams: [
      {
        name: 'Engineering',
        members: engineeringMembers,
        tasks: engineeringTasks,
        capacity: engMetrics.capacity,
        velocity: engMetrics.velocity,
        blockerCount: engMetrics.blockerCount,
      },
      {
        name: 'Design',
        members: designMembers,
        tasks: designTasks,
        capacity: desMetrics.capacity,
        velocity: desMetrics.velocity,
        blockerCount: desMetrics.blockerCount,
      },
      {
        name: 'Product',
        members: productMembers,
        tasks: productTasks,
        capacity: prodMetrics.capacity,
        velocity: prodMetrics.velocity,
        blockerCount: prodMetrics.blockerCount,
      },
    ],
    timeWindow: 'last_7_days',
    currentDate: getRelativeDate(0),
    totalTasks: allTasks.length,
    overdueCount,
    blockedCount,
    criticalCount,
  };
}

// Get tasks by scenario for testing
export function getScenarioData(scenario: 'healthy' | 'crisis' | 'mixed'): BriefingData {
  const baseData = generateMockBriefingData();
  
  if (scenario === 'healthy') {
    // Clear all blockers and make everything on track
    baseData.teams.forEach(team => {
      team.tasks.forEach(task => {
        task.blocked = false;
        task.blockerReason = undefined;
        if (task.priority === 'critical') task.priority = 'high';
      });
      team.blockerCount = 0;
      team.capacity = Math.min(95, team.capacity);
    });
    baseData.blockedCount = 0;
    baseData.criticalCount = 0;
  } else if (scenario === 'crisis') {
    // Add more blockers and critical items
    baseData.teams.forEach(team => {
      const taskCount = team.tasks.length;
      for (let i = 0; i < Math.floor(taskCount * 0.3); i++) {
        if (team.tasks[i].status !== 'done') {
          team.tasks[i].blocked = true;
          team.tasks[i].blockerReason = 'Critical dependency delayed';
          team.tasks[i].priority = 'critical';
        }
      }
      team.capacity = Math.min(130, team.capacity + 30);
      team.blockerCount = team.tasks.filter(t => t.blocked).length;
    });
    baseData.blockedCount = baseData.teams.reduce((sum, t) => sum + t.blockerCount, 0);
    baseData.criticalCount = baseData.teams.reduce((sum, t) => 
      sum + t.tasks.filter(task => task.priority === 'critical' && task.status !== 'done').length, 0
    );
  }
  // 'mixed' uses the default data which is already mixed
  
  return baseData;
}


