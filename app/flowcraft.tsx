"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Search, Plus, Calendar, ChevronDown, X, Check, AlertCircle, Mic, MicOff, Sun, Moon, Edit2, Trash2, ArrowRight, Play, Square, CheckCircle2, Clock, Users, Filter, LucideIcon, Sparkles, Zap, Eye, RotateCcw, Settings, FileText } from 'lucide-react';
import ExecutiveBriefing from './components/ExecutiveBriefing';

// ==========================================
// CONFIGURATION SECTION - Easy to customize
// ==========================================

const APP_CONFIG = {
  // Branding
  appName: 'FlowCraft',
  appTagline: 'Work that flows',
  
  // Feature Flags
  features: {
    darkMode: true,
    voiceSearch: true,
    dragAndDrop: true,
    sprints: true,
    kanban: true,
    filters: true,
    search: true,
    bulkActions: false,
    comments: false,
    attachments: false,
    mitosis: false, // Team splitting feature
  },
  
  // Task Configuration
  taskPrefix: 'TSK',
  sprintPrefix: 'SPR',
  
  // Priorities with gentle, eye-friendly colors
  priorities: [
    { value: 'P0', label: 'Critical', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300', dotColor: 'bg-rose-400' },
    { value: 'P1', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', dotColor: 'bg-orange-400' },
    { value: 'P2', label: 'Medium', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300', dotColor: 'bg-amber-400' },
    { value: 'P3', label: 'Low', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300', dotColor: 'bg-sky-400' },
    { value: 'P4', label: 'Minor', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400', dotColor: 'bg-slate-400' },
    { value: 'P5', label: 'Trivial', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400', dotColor: 'bg-gray-400' },
  ],
  
  // Status Configuration with gentle, eye-friendly colors
  statuses: [
    { value: 'todo', label: 'To Do', color: 'bg-slate-50 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400', borderColor: 'border-slate-200' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400', borderColor: 'border-blue-200' },
    { value: 'in-review', label: 'In Review', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400', borderColor: 'border-amber-200' },
    { value: 'done', label: 'Done', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400', borderColor: 'border-emerald-200' },
  ],
  
  // Kanban Columns
  kanbanColumns: ['todo', 'in-progress', 'in-review', 'done'],
  
  // Navigation Items
  navigation: [
    { id: 'issues', label: 'Issues', enabled: true },
    { id: 'current-sprint', label: 'Current Sprint', enabled: true },
    { id: 'sprints', label: 'Sprints', enabled: true },
    { id: 'executive-briefing', label: 'Executive Briefing', enabled: true },
  ],
  
  // Table Columns Configuration
  issueTableColumns: [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'assignee', label: 'Assignee', sortable: true },
    { key: 'sprint', label: 'Sprint', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ],
  
  // Validation Rules
  validation: {
    minTitleLength: 3,
    maxTitleLength: 100,
    minDescriptionLength: 0,
    maxDescriptionLength: 500,
    requireAssignee: true,
    requireDescription: false,
  },
  
  // Mitosis Configuration
  mitosis: {
    teamSizeThresholds: {
      green: { min: 5, max: 15 },
      yellow: { min: 16, max: 24 },
      red: { min: 25, max: 100 }
    },
    widgetAppearThreshold: 18,
    forcedDecisionThreshold: 30,
    previewDuration: 7, // days
    embassySyncInterval: 5, // minutes
  },
};

// ==========================================
// THEME CONFIGURATION - Updated with new palette
// ==========================================

const THEME = {
  colors: {
    // Primary palette - warmer, softer tones
    navy: '#2D3748',          // Softer navy blue
    electric: '#4299E1',      // Gentler blue
    orange: '#ED8936',        // Warmer, less harsh orange
    
    // Support colors - eye-friendly palette
    background: '#FEFEFE',    // Very soft off-white
    surface: '#FDFDFD',       // Gentle white for cards
    textPrimary: '#2D3748',   // Soft charcoal for headers
    textBody: '#4A5568',      // Warm gray for body text
    textMuted: '#718096',     // Gentle muted text
    success: '#38A169',       // Softer emerald
    error: '#E53E3E',         // Gentler red
    warning: '#D69E2E',       // Warmer amber
    
    // Extended palette - reduced contrast
    border: '#E2E8F0',        // Light border
    hover: '#F7FAFC',         // Very gentle hover state
  },
  
  components: {
    button: {
      primary: 'bg-blue-400 text-white hover:bg-blue-500 shadow-sm hover:shadow-md transition-all duration-200',
      secondary: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:border-slate-500',
      danger: 'bg-red-400 text-white hover:bg-red-500 shadow-sm hover:shadow-md transition-all duration-200',
      success: 'bg-emerald-400 text-white hover:bg-emerald-500 shadow-sm hover:shadow-md transition-all duration-200',
      ghost: 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700',
      orange: 'bg-orange-400 text-white hover:bg-orange-500 shadow-sm hover:shadow-md transition-all duration-200',
    },
    
    card: 'bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700',
    modal: 'bg-white dark:bg-slate-900 rounded-xl shadow-2xl',
    input: 'border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors duration-200',
    
    // New themed components - gentler colors
    header: 'bg-slate-700 dark:bg-slate-800 text-white shadow-md',
    nav: {
      active: 'bg-blue-400 text-white shadow-sm',
      inactive: 'text-slate-200 hover:text-white hover:bg-slate-600 transition-colors duration-200',
    },
    badge: {
      default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      primary: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
      warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    }
  },
  
  layout: {
    maxWidth: 'max-w-7xl',
    padding: 'px-4 sm:px-6 lg:px-8',
  },
};

// ==========================================
// LABELS / i18n
// ==========================================

const LABELS = {
  // Actions
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  cancel: 'Cancel',
  save: 'Save',
  edit: 'Edit',
  
  // Issue specific
  newIssue: 'New Issue',
  editIssue: 'Edit Issue',
  deleteIssueConfirm: 'Are you sure you want to delete this issue?',
  
  // Sprint specific
  newSprint: 'New Sprint',
  startSprint: 'Start',
  endSprint: 'End Sprint',
  noActiveSprint: 'No Active Sprint',
  noActiveSprintDescription: 'Start a sprint from the Sprints view to see the Kanban board.',
  onlyOneActiveSprint: 'Only one sprint can be active at a time. Please end the current sprint first.',
  
  // Form labels
  title: 'Title',
  description: 'Description',
  priority: 'Priority',
  assignee: 'Assignee',
  sprint: 'Sprint',
  backlog: 'Backlog',
  startDate: 'Start Date',
  endDate: 'End Date',
  
  // Validation messages
  titleRequired: 'Title is required',
  assigneeRequired: 'Assignee is required',
  sprintNameRequired: 'Sprint name is required',
  startDateRequired: 'Start date is required',
  endDateRequired: 'End date is required',
  endDateAfterStart: 'End date must be after start date',
  
  // Search and filters
  searchPlaceholder: 'Search issues...',
  allPriorities: 'All Priorities',
  allStatuses: 'All Status',
  sortByCreated: 'Sort by Created',
  sortByPriority: 'Sort by Priority',
  sortByTitle: 'Sort by Title',
  
  // Other
  assignToSprint: 'Assign to Sprint',
  selectSprint: 'Select a sprint for issue',
  progress: 'Progress',
  issues: 'issues',
  more: 'more',
  noIssuesFound: 'No issues found matching your filters',
  voiceSearchTranscript: 'Voice search:',
  goToSprints: 'Go to Sprints',
};

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface Issue {
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

interface Sprint {
  id: string;
  name: string;
  status: 'planned' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface TeamCell {
  id: string;
  name: string;
  members: TeamMember[];
  focus: string[];
  color: string;
}

interface SplitAnalysis {
  groups: TeamCell[];
  confidence: number;
  suggestedSplit: boolean;
  sharedTasks: number;
  metrics: {
    standupReduction: number;
    velocityIncrease: number;
    blockerReduction: number;
    happinessIncrease: number;
  };
}

interface MitosisState {
  isActive: boolean;
  mode: 'preview' | 'permanent';
  startDate: string;
  endDate?: string;
  cells: TeamCell[];
  embassyHours: {
    frequency: 'weekly' | 'biweekly';
    day: string;
    time: string;
  };
  previewDaysRemaining?: number;
}

interface ConfigContextType {
  config: typeof APP_CONFIG;
  theme: typeof THEME;
  labels: typeof LABELS;
}

// ==========================================
// CONTEXT FOR CONFIGURATION
// ==========================================

const ConfigContext = createContext<ConfigContextType>({
  config: APP_CONFIG,
  theme: THEME,
  labels: LABELS,
});

const useConfig = () => useContext(ConfigContext);

// ==========================================
// CUSTOM HOOKS FOR BUSINESS LOGIC
// ==========================================

const useIssueManagement = (initialIssues: Issue[]) => {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const { config } = useConfig();
  
  const generateIssueId = (): string => {
    const maxId = Math.max(...issues.map(i => parseInt(i.id.split('-')[1])), 0);
    return `${config.taskPrefix}-${String(maxId + 1).padStart(3, '0')}`;
  };
  
  const createIssue = (formData: Partial<Issue>): Issue => {
    const newIssue: Issue = {
      id: generateIssueId(),
      title: formData.title || '',
      description: formData.description || '',
      status: 'todo',
      priority: formData.priority || config.priorities[2].value,
      assignee: formData.assignee || '',
      sprintId: formData.sprintId || null,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setIssues([...issues, newIssue]);
    return newIssue;
  };
  
  const updateIssue = (id: string, updates: Partial<Issue>): void => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, ...updates } : issue
    ));
  };
  
  const deleteIssue = (id: string): void => {
    setIssues(issues.filter(issue => issue.id !== id));
  };
  
  return {
    issues,
    setIssues,
    createIssue,
    updateIssue,
    deleteIssue,
    generateIssueId,
  };
};

const useSprintManagement = (initialSprints: Sprint[], issues: Issue[], setIssues: React.Dispatch<React.SetStateAction<Issue[]>>) => {
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const { config, labels } = useConfig();
  
  const generateSprintId = (): string => {
    const maxId = Math.max(...sprints.map(s => parseInt(s.id.split('-')[1])), 0);
    return `${config.sprintPrefix}-${String(maxId + 1).padStart(3, '0')}`;
  };
  
  const createSprint = (formData: Partial<Sprint>): Sprint => {
    const newSprint: Sprint = {
      id: generateSprintId(),
      name: formData.name || '',
      status: 'planned',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSprints([...sprints, newSprint]);
    return newSprint;
  };
  
  const startSprint = (sprintId: string): void => {
    const hasActiveSprint = sprints.some(s => s.status === 'active');
    if (hasActiveSprint) {
      alert(labels.onlyOneActiveSprint);
      return;
    }
    setSprints(sprints.map(sprint =>
      sprint.id === sprintId ? { ...sprint, status: 'active' } : sprint
    ));
  };
  
  const endSprint = (sprintId: string): void => {
    setSprints(sprints.map(sprint =>
      sprint.id === sprintId ? { ...sprint, status: 'completed' } : sprint
    ));
    setIssues(issues.map(issue =>
      issue.sprintId === sprintId && issue.status !== 'done'
        ? { ...issue, sprintId: null }
        : issue
    ));
  };
  
  const getCurrentSprint = (): Sprint | undefined => sprints.find(s => s.status === 'active');
  
  return {
    sprints,
    setSprints,
    createSprint,
    startSprint,
    endSprint,
    getCurrentSprint,
    generateSprintId,
  };
};

// ==========================================
// MITOSIS COMPONENTS
// ==========================================

interface TeamSizeIndicatorProps {
  teamSize: number;
  onClick: () => void;
}

const TeamSizeIndicator: React.FC<TeamSizeIndicatorProps> = ({ teamSize, onClick }) => {
  const { config } = useConfig();
  
  if (!config.features.mitosis || !config.mitosis) return null;
  
  const getIndicatorState = () => {
    if (teamSize >= config.mitosis.teamSizeThresholds.red.min) {
      return { color: 'bg-red-500 text-white', emoji: '🧬', pulse: 'animate-pulse' };
    } else if (teamSize >= config.mitosis.teamSizeThresholds.yellow.min) {
      return { color: 'bg-orange-500 text-white', emoji: '⚠️', pulse: 'animate-pulse' };
    }
    return { color: 'bg-emerald-500 text-white', emoji: '', pulse: '' };
  };
  
  const state = getIndicatorState();
  const showTooltip = teamSize >= 20;
  
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${state.color} ${state.pulse} hover:shadow-lg`}
      >
        <Users className="w-4 h-4" />
        <span>{teamSize}</span>
        {state.emoji && <span>{state.emoji}</span>}
      </button>
      
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
          Your team is growing! Click to see optimization options
        </div>
      )}
    </div>
  );
};

interface TeamHealthWidgetProps {
  teamSize: number;
  onPreviewSplit: () => void;
}

const TeamHealthWidget: React.FC<TeamHealthWidgetProps> = ({ teamSize, onPreviewSplit }) => {
  const { config } = useConfig();
  
  if (!config.features.mitosis || !config.mitosis) return null;
  if (teamSize < config.mitosis.widgetAppearThreshold) return null;
  
  const healthScore = Math.max(20, 100 - (teamSize - 15) * 3);
  const naturalGroups = teamSize > 20 ? 2 : 1;
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          Team Health Monitor
          <span className="text-xl">🧬</span>
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">Current size: {teamSize} people</span>
            <span className="text-slate-600 dark:text-slate-400">Optimal: 12-15 per team</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">Team Health</span>
            <span className="font-medium text-slate-900 dark:text-white">{healthScore}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                healthScore > 70 ? 'bg-emerald-500' : healthScore > 40 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
        
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Natural groups detected: <span className="font-medium text-slate-900 dark:text-white">{naturalGroups}</span>
        </div>
        
        <Button 
          onClick={onPreviewSplit}
          variant="primary" 
          className="w-full"
          icon={ArrowRight}
        >
          Preview Smart Split
        </Button>
      </div>
    </Card>
  );
};

interface SplitPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrySplit: () => void;
  analysis: SplitAnalysis;
}

const SplitPreviewModal: React.FC<SplitPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onTrySplit, 
  analysis 
}) => {
  const { theme } = useConfig();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${theme.components.modal} max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            Smart Team Split - AI Analysis
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <p className="text-lg text-slate-700 dark:text-slate-300 text-center">
            Your team naturally works in {analysis.groups.length} groups:
          </p>
          
          <div className="flex justify-center items-center gap-8">
            {analysis.groups.map((cell, index) => (
              <div key={cell.id} className="text-center">
                <div className={`w-32 h-32 rounded-xl ${cell.color} flex flex-col items-center justify-center text-white mb-4`}>
                  <div className="text-sm font-medium mb-1">{cell.name}</div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-bold">{cell.members.length}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {cell.name} Focus:
                  </div>
                  {cell.focus.map((focus, i) => (
                    <div key={i} className="text-slate-600 dark:text-slate-400">
                      • {focus}
                    </div>
                  ))}
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    Members: {cell.members.slice(0, 3).map(m => m.name).join(', ')}
                    {cell.members.length > 3 && ` +${cell.members.length - 3} more`}
                  </div>
                </div>
              </div>
            ))}
            
            {analysis.groups.length === 2 && (
              <div className="flex flex-col items-center text-slate-600 dark:text-slate-400">
                <div className="text-2xl mb-2">↔</div>
                <div className="text-sm font-medium">{analysis.sharedTasks}</div>
                <div className="text-xs">shared tasks</div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100 mb-2">Why split?</div>
                <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <div>• Reduce standup from 32→12 min (-{analysis.metrics.standupReduction}%)</div>
                  <div>• Increase velocity by ~{analysis.metrics.velocityIncrease}%</div>
                  <div>• Reduce blockers by {analysis.metrics.blockerReduction}%</div>
                  <div>• Improve team happiness by {analysis.metrics.happinessIncrease}%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={onClose}>
              Not Now
            </Button>
            <Button variant="primary" onClick={onTrySplit}>
              Try Split Mode (7 days)
            </Button>
            <Button variant="ghost" onClick={onClose} className="text-slate-500">
              Never
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SplitConfigWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPreview: (config: any) => void;
  analysis: SplitAnalysis;
}

const SplitConfigWizard: React.FC<SplitConfigWizardProps> = ({ 
  isOpen, 
  onClose, 
  onStartPreview, 
  analysis 
}) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    cellNames: analysis.groups.map(g => g.name),
    embassyDay: 'Thursday',
    embassyTime: '2:00 PM',
    embassyFrequency: 'weekly',
    mode: 'preview'
  });
  
  const { theme } = useConfig();
  
  if (!isOpen) return null;
  
  const handleStartPreview = () => {
    onStartPreview({
      ...config,
      cells: analysis.groups.map((group, index) => ({
        ...group,
        name: config.cellNames[index]
      }))
    });
  };
  
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${theme.components.modal} max-w-2xl w-full p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Configure Your Team Evolution
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              STEP 1: Name Your Cells
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {config.cellNames.map((name, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Cell {index + 1} Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newNames = [...config.cellNames];
                      newNames[index] = e.target.value;
                      setConfig({ ...config, cellNames: newNames });
                    }}
                    className={`${theme.components.input} w-full px-3 py-2`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              STEP 2: Set Embassy Hours (Team Sync)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={config.embassyFrequency}
                onChange={(e) => setConfig({ ...config, embassyFrequency: e.target.value })}
                className={`${theme.components.input} px-3 py-2`}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
              </select>
              
              <select
                value={config.embassyDay}
                onChange={(e) => setConfig({ ...config, embassyDay: e.target.value })}
                className={`${theme.components.input} px-3 py-2`}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
              
              <select
                value={config.embassyTime}
                onChange={(e) => setConfig({ ...config, embassyTime: e.target.value })}
                className={`${theme.components.input} px-3 py-2`}
              >
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">
              STEP 3: Choose Mode
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="mode"
                  value="preview"
                  checked={config.mode === 'preview'}
                  onChange={(e) => setConfig({ ...config, mode: e.target.value })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Preview Mode (7 days, reversible)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="mode"
                  value="permanent"
                  checked={config.mode === 'permanent'}
                  onChange={(e) => setConfig({ ...config, mode: e.target.value })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Full Split (Permanent after 30 days)
                </span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="secondary" onClick={onClose}>
              ← Back
            </Button>
            <Button onClick={handleStartPreview} variant="primary">
              Start Preview →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CellWorkspaceProps {
  mitosisState: MitosisState;
  currentCell: TeamCell;
  onSwitchCell: (cellId: string) => void;
  onEmbassyView: () => void;
  onMerge: () => void;
}

const CellWorkspace: React.FC<CellWorkspaceProps> = ({ 
  mitosisState, 
  currentCell, 
  onSwitchCell, 
  onEmbassyView, 
  onMerge 
}) => {
  const { config } = useConfig();
  
  return (
    <div className="space-y-4">
      {/* Cell Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {currentCell.name}
            </h2>
            <div className="flex gap-2">
              {mitosisState.cells.filter(c => c.id !== currentCell.id).map(cell => (
                <Button
                  key={cell.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => onSwitchCell(cell.id)}
                  icon={RotateCcw}
                >
                  Switch to {cell.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEmbassyView} icon={Eye}>
              Embassy View
            </Button>
            <Button variant="secondary" size="sm" onClick={onMerge}>
              Merge?
            </Button>
          </div>
        </div>
        
        {mitosisState.mode === 'preview' && mitosisState.previewDaysRemaining && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-green-700 dark:text-green-300 text-sm">
                🟢 Preview Mode: Day {config.mitosis.previewDuration - mitosisState.previewDaysRemaining + 1} of {config.mitosis.previewDuration}
              </span>
              <Button variant="success" size="sm">
                Make Permanent
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Embassy Layer */}
      <Card className="p-4">
        <h3 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          🔗 Embassy Layer (Shared)
        </h3>
        <div className="space-y-2 text-sm">
          <div className="text-slate-600 dark:text-slate-400">
            8 linked tasks with other cells
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Next sync: {mitosisState.embassyHours.day} {mitosisState.embassyHours.time} (in 2 days)
          </div>
          <Button variant="secondary" size="sm" onClick={onEmbassyView}>
            View Details
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface EmbassyViewProps {
  isOpen: boolean;
  onClose: () => void;
  mitosisState: MitosisState;
}

const EmbassyView: React.FC<EmbassyViewProps> = ({ isOpen, onClose, mitosisState }) => {
  const [timeRemaining, setTimeRemaining] = useState('28:45');
  const { theme } = useConfig();
  
  if (!isOpen) return null;
  
  const criticalHandoffs = [
    {
      id: 1,
      title: 'API endpoint /users needs update',
      description: 'Frontend blocked → Backend owner: Marcus',
      priority: 'critical'
    }
  ];
  
  const upcomingDependencies = [
    'Payment flow UI needs backend by Mon',
    'Database migration affects 3 frontend views'
  ];
  
  const quickDecisions = [
    'Delay feature X to next sprint?',
    'Merge PR #234 despite minor issues?',
    'Allocate Bob to help Frontend for 2 days?'
  ];
  
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${theme.components.modal} max-w-3xl w-full p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            🤝 Embassy Hour - Cross-Cell Sync
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="text-slate-700 dark:text-slate-300">
              {mitosisState.embassyHours.day}, {mitosisState.embassyHours.time} - {mitosisState.embassyHours.time.replace(/\d+/, (match) => String(parseInt(match) + 1))}
            </span>
            <span className="font-mono text-lg text-slate-900 dark:text-white flex items-center gap-2">
              ⏱️ {timeRemaining}
            </span>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              CRITICAL HANDOFFS (Resolve First)
            </h3>
            <div className="space-y-3">
              {criticalHandoffs.map(handoff => (
                <Card key={handoff.id} className="p-4 border-l-4 border-red-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white mb-1">
                        🔴 {handoff.title}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {handoff.description}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">Assign</Button>
                      <Button variant="secondary" size="sm">Discuss</Button>
                      <Button variant="ghost" size="sm">Defer</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              UPCOMING DEPENDENCIES
            </h3>
            <div className="space-y-2">
              {upcomingDependencies.map((dep, index) => (
                <div key={index} className="text-sm text-slate-600 dark:text-slate-400">
                  • {dep}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              QUICK DECISIONS (Y/N)
            </h3>
            <div className="space-y-2">
              {quickDecisions.map((decision, index) => (
                <label key={index} className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{decision}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="danger" onClick={onClose}>
              End Embassy Hour
            </Button>
            <Button variant="secondary">
              Extend 15 min
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  children, 
  icon: Icon,
  className = ''
}) => {
  const { theme } = useConfig();
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      className={`${theme.components.button[variant]} ${sizeClasses[size]} rounded-lg font-medium flex items-center gap-2 ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const { theme } = useConfig();
  return (
    <div className={`${theme.components.card} ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useConfig();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${theme.components.modal} max-w-lg w-full p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const FlowCraft: React.FC = () => {
  // Mock team data for Mitosis (only if feature is enabled)
  const mockTeamMembers: TeamMember[] = APP_CONFIG.features.mitosis ? [
    { id: '1', name: 'Alice Chen', role: 'Frontend Lead' },
    { id: '2', name: 'Bob Smith', role: 'Designer' },
    { id: '3', name: 'Carol Davis', role: 'Backend Lead' },
    { id: '4', name: 'David Lee', role: 'DevOps' },
    { id: '5', name: 'Eve Johnson', role: 'Frontend Dev' },
    { id: '6', name: 'Frank Wilson', role: 'QA' },
    { id: '7', name: 'Grace Brown', role: 'Backend Dev' },
    { id: '8', name: 'Henry Taylor', role: 'Tech Writer' },
    { id: '9', name: 'Ivy Chen', role: 'Frontend Dev' },
    { id: '10', name: 'Jack Miller', role: 'Backend Dev' },
    { id: '11', name: 'Kate Wilson', role: 'UI Designer' },
    { id: '12', name: 'Liam Davis', role: 'Full Stack' },
    { id: '13', name: 'Maya Patel', role: 'Frontend Dev' },
    { id: '14', name: 'Noah Kim', role: 'Backend Dev' },
    { id: '15', name: 'Olivia Brown', role: 'Product Manager' },
    { id: '16', name: 'Paul Garcia', role: 'DevOps' },
    { id: '17', name: 'Quinn Lee', role: 'QA Engineer' },
    { id: '18', name: 'Rachel Green', role: 'Frontend Dev' },
    { id: '19', name: 'Sam Johnson', role: 'Backend Dev' },
    { id: '20', name: 'Tara Wilson', role: 'Designer' },
    { id: '21', name: 'Uma Patel', role: 'Frontend Dev' },
    { id: '22', name: 'Victor Chen', role: 'Backend Dev' },
    { id: '23', name: 'Wendy Davis', role: 'Full Stack' },
  ] : [];

  const mockSplitAnalysis: SplitAnalysis | null = APP_CONFIG.features.mitosis ? {
    groups: [
      {
        id: 'cell-a',
        name: 'Frontend Team',
        members: mockTeamMembers.slice(0, 12),
        focus: [
          'Frontend Development (87% of tasks)',
          'Customer Dashboard Project',
          'UI/UX Design Work'
        ],
        color: 'bg-blue-500'
      },
      {
        id: 'cell-b',
        name: 'Backend Team',
        members: mockTeamMembers.slice(12, 23),
        focus: [
          'Backend API (91% of tasks)',
          'Database Optimization',
          'DevOps & Infrastructure'
        ],
        color: 'bg-emerald-500'
      }
    ],
    confidence: 0.82,
    suggestedSplit: true,
    sharedTasks: 8,
    metrics: {
      standupReduction: 63,
      velocityIncrease: 46,
      blockerReduction: 62,
      happinessIncrease: 31
    }
  } : null;

  // Helper to generate dates relative to today
  const getRelativeDate = (daysOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  };

  // Sample data with realistic content - shows a project with slipped timelines
  const initialIssues: Issue[] = [
    // Sprint 1 - Incomplete (ended 5 weeks ago, only 4/7 completed, 3 tasks carried over)
    { id: 'TSK-001', title: 'Implement user authentication', description: 'Add OAuth2 authentication with Google and GitHub providers', status: 'done', priority: 'P0', assignee: 'Alice Chen', sprintId: 'SPR-001', createdAt: getRelativeDate(-56) },
    { id: 'TSK-002', title: 'Design system components', description: 'Create reusable Button, Input, and Card components', status: 'done', priority: 'P1', assignee: 'Bob Smith', sprintId: 'SPR-001', createdAt: getRelativeDate(-55) },
    { id: 'TSK-003', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'done', priority: 'P1', assignee: 'Carol Davis', sprintId: 'SPR-001', createdAt: getRelativeDate(-54) },
    { id: 'TSK-004', title: 'Database schema design', description: 'Design initial database schema for user and project entities', status: 'done', priority: 'P0', assignee: 'David Lee', sprintId: 'SPR-001', createdAt: getRelativeDate(-53) },
    { id: 'TSK-005', title: 'Initial API endpoints', description: 'Create REST API for core resources - still missing 3 endpoints', status: 'in-progress', priority: 'P1', assignee: 'Eve Johnson', sprintId: 'SPR-001', createdAt: getRelativeDate(-52) },
    { id: 'TSK-006', title: 'Environment configuration', description: 'Set up dev/staging/prod environments - BLOCKED by AWS access', status: 'in-progress', priority: 'P0', assignee: 'Frank Wilson', sprintId: 'SPR-001', createdAt: getRelativeDate(-51) },
    { id: 'TSK-007', title: 'Logging infrastructure', description: 'Centralized logging with ELK stack - deferred to next sprint', status: 'todo', priority: 'P2', assignee: 'Grace Brown', sprintId: 'SPR-001', createdAt: getRelativeDate(-50) },
    
    // Sprint 2 - Incomplete (ended 3 weeks ago, only 3/8 completed, 5 tasks spilled over)
    { id: 'TSK-008', title: 'Dashboard layout', description: 'Implement main dashboard with widgets', status: 'done', priority: 'P1', assignee: 'Henry Taylor', sprintId: 'SPR-002', createdAt: getRelativeDate(-42) },
    { id: 'TSK-009', title: 'User profile page', description: 'Create user profile settings and preferences', status: 'done', priority: 'P2', assignee: 'Alice Chen', sprintId: 'SPR-002', createdAt: getRelativeDate(-41) },
    { id: 'TSK-010', title: 'Search functionality', description: 'Add global search across all entities', status: 'done', priority: 'P2', assignee: 'Bob Smith', sprintId: 'SPR-002', createdAt: getRelativeDate(-40) },
    { id: 'TSK-011', title: 'Notification system', description: 'Implement in-app and email notifications - BLOCKED by third-party API issues', status: 'in-progress', priority: 'P0', assignee: 'Carol Davis', sprintId: 'SPR-002', createdAt: getRelativeDate(-39) },
    { id: 'TSK-012', title: 'Data export feature', description: 'Allow exporting data to CSV and JSON - waiting on schema changes', status: 'in-review', priority: 'P1', assignee: 'David Lee', sprintId: 'SPR-002', createdAt: getRelativeDate(-38) },
    { id: 'TSK-013', title: 'Email integration', description: 'SMTP configuration and email templates - BLOCKED by security review', status: 'in-progress', priority: 'P0', assignee: 'Eve Johnson', sprintId: 'SPR-002', createdAt: getRelativeDate(-37) },
    { id: 'TSK-014', title: 'File upload system', description: 'Handle file uploads with validation - depends on storage config', status: 'in-progress', priority: 'P1', assignee: 'Frank Wilson', sprintId: 'SPR-002', createdAt: getRelativeDate(-36) },
    { id: 'TSK-015', title: 'Real-time updates', description: 'WebSocket integration for live updates - complex, needs more time', status: 'todo', priority: 'P2', assignee: 'Grace Brown', sprintId: 'SPR-002', createdAt: getRelativeDate(-35) },
    
    // Sprint 3 - Active but severely behind (started 2 weeks ago, should end in 3 days, only 1/10 completed)
    // Includes carryover from Sprint 1 and Sprint 2
    { id: 'TSK-016', title: 'API rate limiting', description: 'Implement rate limiting for public endpoints - critical for launch', status: 'in-progress', priority: 'P0', assignee: 'David Lee', sprintId: 'SPR-003', createdAt: getRelativeDate(-14) },
    { id: 'TSK-017', title: 'Mobile responsive design', description: 'Ensure all pages work on mobile devices', status: 'in-progress', priority: 'P1', assignee: 'Eve Johnson', sprintId: 'SPR-003', createdAt: getRelativeDate(-13) },
    { id: 'TSK-018', title: 'Accessibility audit', description: 'Ensure WCAG 2.1 AA compliance - depends on design freeze', status: 'todo', priority: 'P1', assignee: 'Frank Wilson', sprintId: 'SPR-003', createdAt: getRelativeDate(-12) },
    { id: 'TSK-019', title: 'Error handling improvements', description: 'Improve error messages and recovery flows', status: 'todo', priority: 'P2', assignee: 'Grace Brown', sprintId: 'SPR-003', createdAt: getRelativeDate(-11) },
    { id: 'TSK-020', title: 'Performance monitoring', description: 'Add APM integration for performance tracking', status: 'todo', priority: 'P2', assignee: 'Henry Taylor', sprintId: 'SPR-003', createdAt: getRelativeDate(-10) },
    { id: 'TSK-021', title: 'Security headers', description: 'Implement security headers and CSP - BLOCKED waiting for infra team', status: 'in-progress', priority: 'P0', assignee: 'Alice Chen', sprintId: 'SPR-003', createdAt: getRelativeDate(-9) },
    { id: 'TSK-022', title: 'Payment gateway integration', description: 'Stripe integration for subscriptions - critical path', status: 'in-progress', priority: 'P0', assignee: 'Bob Smith', sprintId: 'SPR-003', createdAt: getRelativeDate(-8) },
    { id: 'TSK-023', title: 'User onboarding flow', description: 'First-time user experience and tutorial', status: 'done', priority: 'P1', assignee: 'Carol Davis', sprintId: 'SPR-003', createdAt: getRelativeDate(-7) },
    { id: 'TSK-024', title: 'Complete API endpoints', description: 'Finish remaining 3 endpoints from Sprint 1', status: 'in-progress', priority: 'P1', assignee: 'Eve Johnson', sprintId: 'SPR-003', createdAt: getRelativeDate(-6) },
    { id: 'TSK-025', title: 'Environment setup', description: 'Complete AWS environment configuration from Sprint 1', status: 'in-progress', priority: 'P0', assignee: 'Frank Wilson', sprintId: 'SPR-003', createdAt: getRelativeDate(-5) },
    
    // Sprint 4 - Planned but already has carryover concerns (will likely absorb Sprint 3 spillover)
    { id: 'TSK-026', title: 'Advanced filtering', description: 'Add complex filter builder for reports', status: 'todo', priority: 'P2', assignee: 'David Lee', sprintId: 'SPR-004', createdAt: getRelativeDate(-5) },
    { id: 'TSK-027', title: 'Bulk operations', description: 'Enable bulk edit and delete for items', status: 'todo', priority: 'P2', assignee: 'Eve Johnson', sprintId: 'SPR-004', createdAt: getRelativeDate(-4) },
    { id: 'TSK-028', title: 'Keyboard shortcuts', description: 'Add keyboard navigation and shortcuts', status: 'todo', priority: 'P3', assignee: 'Frank Wilson', sprintId: 'SPR-004', createdAt: getRelativeDate(-3) },
    { id: 'TSK-029', title: 'Dark mode polish', description: 'Refine dark mode color palette', status: 'todo', priority: 'P3', assignee: 'Grace Brown', sprintId: 'SPR-004', createdAt: getRelativeDate(-2) },
    { id: 'TSK-030', title: 'Audit logging', description: 'Track all user actions for compliance', status: 'todo', priority: 'P1', assignee: 'Henry Taylor', sprintId: 'SPR-004', createdAt: getRelativeDate(-1) },
    
    // Sprint 5 - Planned
    { id: 'TSK-031', title: 'API v2 design', description: 'Design next version of API with GraphQL', status: 'todo', priority: 'P1', assignee: 'Alice Chen', sprintId: 'SPR-005', createdAt: getRelativeDate(-1) },
    { id: 'TSK-032', title: 'Webhooks system', description: 'Allow users to configure webhooks for events', status: 'todo', priority: 'P2', assignee: 'Bob Smith', sprintId: 'SPR-005', createdAt: getRelativeDate(-1) },
    { id: 'TSK-033', title: 'Team permissions', description: 'Implement role-based access control', status: 'todo', priority: 'P1', assignee: 'Carol Davis', sprintId: 'SPR-005', createdAt: getRelativeDate(-1) },
    
    // Backlog - mix of priorities, includes tasks deferred from earlier sprints
    { id: 'TSK-034', title: 'Logging infrastructure', description: 'Centralized logging with ELK stack - deferred from Sprint 1', status: 'todo', priority: 'P2', assignee: 'Grace Brown', sprintId: null, createdAt: getRelativeDate(-50) },
    { id: 'TSK-035', title: 'Real-time updates', description: 'WebSocket integration for live updates - deferred from Sprint 2', status: 'todo', priority: 'P2', assignee: 'Grace Brown', sprintId: null, createdAt: getRelativeDate(-35) },
    { id: 'TSK-036', title: 'Performance optimization', description: 'Optimize bundle size and loading times', status: 'todo', priority: 'P3', assignee: 'David Lee', sprintId: null, createdAt: getRelativeDate(-20) },
    { id: 'TSK-037', title: 'Unit test coverage', description: 'Achieve 80% code coverage - tech debt from Sprint 1', status: 'in-progress', priority: 'P2', assignee: 'Eve Johnson', sprintId: null, createdAt: getRelativeDate(-45) },
    { id: 'TSK-038', title: 'Documentation update', description: 'Update API documentation with examples', status: 'todo', priority: 'P4', assignee: 'Frank Wilson', sprintId: null, createdAt: getRelativeDate(-18) },
    { id: 'TSK-039', title: 'Mobile app research', description: 'Research React Native for mobile app', status: 'todo', priority: 'P4', assignee: 'Grace Brown', sprintId: null, createdAt: getRelativeDate(-17) },
    { id: 'TSK-040', title: 'Analytics dashboard', description: 'Build analytics dashboard with charts', status: 'todo', priority: 'P3', assignee: 'Henry Taylor', sprintId: null, createdAt: getRelativeDate(-16) },
    { id: 'TSK-041', title: 'Database optimization', description: 'Add indexes and optimize slow queries - URGENT tech debt', status: 'in-progress', priority: 'P1', assignee: 'Alice Chen', sprintId: null, createdAt: getRelativeDate(-30) },
  ];
  
  const initialSprints: Sprint[] = [
    { id: 'SPR-001', name: 'Sprint 1 - Foundation', status: 'completed', startDate: getRelativeDate(-56), endDate: getRelativeDate(-43), createdAt: getRelativeDate(-57) },
    { id: 'SPR-002', name: 'Sprint 2 - Core Features', status: 'completed', startDate: getRelativeDate(-42), endDate: getRelativeDate(-29), createdAt: getRelativeDate(-43) },
    { id: 'SPR-003', name: 'Sprint 3 - Launch Prep', status: 'active', startDate: getRelativeDate(-14), endDate: getRelativeDate(3), createdAt: getRelativeDate(-15) },
    { id: 'SPR-004', name: 'Sprint 4 - Post-Launch', status: 'planned', startDate: getRelativeDate(4), endDate: getRelativeDate(17), createdAt: getRelativeDate(-1) },
    { id: 'SPR-005', name: 'Sprint 5 - API v2', status: 'planned', startDate: getRelativeDate(18), endDate: getRelativeDate(31), createdAt: getRelativeDate(-1) },
  ];
  
  // Core state
  const [currentView, setCurrentView] = useState<string>('issues');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState<boolean>(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [draggedItem, setDraggedItem] = useState<Issue | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
  // Sprint viewing state
  const [viewingSprintId, setViewingSprintId] = useState<string | null>(null);
  
  // Mitosis state (only if feature is enabled)
  const [teamSize] = useState<number>(APP_CONFIG.features.mitosis ? 23 : 0); // Mock team size that triggers Mitosis
  const [isSplitPreviewOpen, setIsSplitPreviewOpen] = useState<boolean>(false);
  const [isSplitConfigOpen, setIsSplitConfigOpen] = useState<boolean>(false);
  const [isEmbassyViewOpen, setIsEmbassyViewOpen] = useState<boolean>(false);
  const [mitosisState, setMitosisState] = useState<MitosisState | null>(null);
  const [currentCellId, setCurrentCellId] = useState<string>('cell-a');
  
  // Use custom hooks
  const { issues, setIssues, createIssue, updateIssue, deleteIssue } = useIssueManagement(initialIssues);
  const { sprints, createSprint, startSprint, endSprint, getCurrentSprint } = useSprintManagement(initialSprints, issues, setIssues);
  
  // Config context value
  const configValue = {
    config: APP_CONFIG,
    theme: THEME,
    labels: LABELS,
  };
  
  // Helper functions
  const getPriorityColor = (priority: string): string => {
    return APP_CONFIG.priorities.find(p => p.value === priority)?.color || 'bg-gray-400 text-white';
  };
  
  const getStatusColor = (status: string): string => {
    return APP_CONFIG.statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };
  
  const handleCreateIssue = (formData: any) => {
    createIssue(formData);
    setIsCreateModalOpen(false);
  };
  
  const handleDeleteIssue = (id: string) => {
    if (window.confirm(LABELS.deleteIssueConfirm)) {
      deleteIssue(id);
    }
  };
  
  // Mitosis handlers (only execute if feature is enabled)
  const handleTeamSizeClick = () => {
    if (!APP_CONFIG.features.mitosis || !APP_CONFIG.mitosis) return;
    if (teamSize >= APP_CONFIG.mitosis.widgetAppearThreshold) {
      setIsSplitPreviewOpen(true);
    }
  };
  
  const handlePreviewSplit = () => {
    if (!APP_CONFIG.features.mitosis) return;
    setIsSplitPreviewOpen(true);
  };
  
  const handleTrySplit = () => {
    if (!APP_CONFIG.features.mitosis) return;
    setIsSplitPreviewOpen(false);
    setIsSplitConfigOpen(true);
  };
  
  const handleStartPreview = (config: any) => {
    if (!APP_CONFIG.features.mitosis || !APP_CONFIG.mitosis) return;
    const newMitosisState: MitosisState = {
      isActive: true,
      mode: config.mode,
      startDate: new Date().toISOString().split('T')[0],
      cells: config.cells,
      embassyHours: {
        frequency: config.embassyFrequency,
        day: config.embassyDay,
        time: config.embassyTime
      },
      previewDaysRemaining: config.mode === 'preview' ? APP_CONFIG.mitosis.previewDuration : undefined
    };
    
    setMitosisState(newMitosisState);
    setIsSplitConfigOpen(false);
    setCurrentView('cell-workspace');
  };
  
  const handleSwitchCell = (cellId: string) => {
    if (!APP_CONFIG.features.mitosis) return;
    setCurrentCellId(cellId);
  };
  
  const handleMergeTeams = () => {
    if (!APP_CONFIG.features.mitosis) return;
    if (window.confirm('Are you sure you want to merge the teams back together?')) {
      setMitosisState(null);
      setCurrentView('issues');
    }
  };
  
  const getCurrentCell = (): TeamCell | null => {
    if (!APP_CONFIG.features.mitosis) return null;
    return mitosisState?.cells.find(cell => cell.id === currentCellId) || null;
  };
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issue: Issue): void => {
    if (!APP_CONFIG.features.dragAndDrop) return;
    setDraggedItem(issue);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string): void => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      updateIssue(draggedItem.id, { status: newStatus });
    }
    setDraggedItem(null);
    setDragOverColumn(null);
  };
  
  // Filter issues
  const getFilteredIssues = (): Issue[] => {
    let filtered = issues;
    
    if (searchQuery && APP_CONFIG.features.search) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterPriority !== 'all' && APP_CONFIG.features.filters) {
      filtered = filtered.filter(issue => issue.priority === filterPriority);
    }
    
    if (filterStatus !== 'all' && APP_CONFIG.features.filters) {
      filtered = filtered.filter(issue => issue.status === filterStatus);
    }
    
    return filtered;
  };
  
  // Issue Form Component
  const IssueForm = ({ issue, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || APP_CONFIG.priorities[2].value,
      assignee: issue?.assignee || '',
      sprintId: issue?.sprintId || '',
    });
    const [errors, setErrors] = useState<any>({});
    
    const validate = () => {
      const newErrors: any = {};
      if (!formData.title.trim()) newErrors.title = LABELS.titleRequired;
      if (!formData.assignee.trim()) newErrors.assignee = LABELS.assigneeRequired;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = () => {
      if (validate()) {
        onSubmit(formData);
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            {LABELS.title} *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`${THEME.components.input} w-full px-3 py-2 ${errors.title ? 'border-red-500' : ''}`}
            placeholder={`Enter ${LABELS.title.toLowerCase()}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            {LABELS.description}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`${THEME.components.input} w-full px-3 py-2`}
            rows={3}
            placeholder={`Enter ${LABELS.description.toLowerCase()}`}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              {LABELS.priority}
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className={`${THEME.components.input} w-full px-3 py-2`}
            >
              {APP_CONFIG.priorities.map(p => (
                <option key={p.value} value={p.value}>
                  {p.value} - {p.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              {LABELS.assignee} *
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className={`${THEME.components.input} w-full px-3 py-2 ${errors.assignee ? 'border-red-500' : ''}`}
              placeholder={`Enter ${LABELS.assignee.toLowerCase()}`}
            />
            {errors.assignee && <p className="text-red-500 text-sm mt-1">{errors.assignee}</p>}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>
            {LABELS.cancel}
          </Button>
          <Button onClick={handleSubmit}>
            {issue ? LABELS.update : LABELS.create}
          </Button>
        </div>
      </div>
    );
  };
  
  // Sprint Form Component
  const SprintForm = ({ onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: '',
      startDate: '',
      endDate: '',
    });
    const [errors, setErrors] = useState<any>({});
    
    const validate = () => {
      const newErrors: any = {};
      if (!formData.name.trim()) newErrors.name = LABELS.sprintNameRequired;
      if (!formData.startDate) newErrors.startDate = LABELS.startDateRequired;
      if (!formData.endDate) newErrors.endDate = LABELS.endDateRequired;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = () => {
      if (validate()) {
        createSprint(formData);
        onCancel();
      }
    };
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Sprint Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`${THEME.components.input} w-full px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter sprint name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              {LABELS.startDate} *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`${THEME.components.input} w-full px-3 py-2 ${errors.startDate ? 'border-red-500' : ''}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              {LABELS.endDate} *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={`${THEME.components.input} w-full px-3 py-2 ${errors.endDate ? 'border-red-500' : ''}`}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>
            {LABELS.cancel}
          </Button>
          <Button onClick={handleSubmit}>
            Create Sprint
          </Button>
        </div>
      </div>
    );
  };
  
  // Render Issues View
  const renderIssuesView = () => {
    const filteredIssues = getFilteredIssues();
    
    return (
      <div className="space-y-6">
        {/* Team Health Widget */}
        {APP_CONFIG.features.mitosis && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Filters and Actions Bar will go here */}
            </div>
            <div className="lg:col-span-1">
              <TeamHealthWidget 
                teamSize={teamSize} 
                onPreviewSplit={handlePreviewSplit}
              />
            </div>
          </div>
        )}
        
        {/* Filters and Actions Bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {APP_CONFIG.features.filters && (
            <div className="flex flex-wrap gap-2">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`${THEME.components.input} px-3 py-2 text-sm`}
              >
                <option value="all">{LABELS.allPriorities}</option>
                {APP_CONFIG.priorities.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.value} - {p.label}
                  </option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`${THEME.components.input} px-3 py-2 text-sm`}
              >
                <option value="all">{LABELS.allStatuses}</option>
                {APP_CONFIG.statuses.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus} variant="primary">
            {LABELS.newIssue}
          </Button>
        </div>
        
        {/* Issues Table */}
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {APP_CONFIG.issueTableColumns.map(col => (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                    {issue.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{issue.title}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{issue.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${getStatusColor(issue.status)}`}>
                      {APP_CONFIG.statuses.find(s => s.value === issue.status)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                    {issue.assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                    {sprints.find(s => s.id === issue.sprintId)?.name || 
                     <span className="text-slate-500">Backlog</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingIssue(issue)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIssue(issue.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredIssues.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              {LABELS.noIssuesFound}
            </div>
          )}
        </Card>
      </div>
    );
  };
  
  // Render Kanban View
  const renderKanbanView = () => {
    const activeSprint = getCurrentSprint();
    if (!activeSprint) {
      return (
        <Card className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {LABELS.noActiveSprint}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {LABELS.noActiveSprintDescription}
          </p>
          <Button onClick={() => setCurrentView('sprints')} variant="primary">
            {LABELS.goToSprints}
          </Button>
        </Card>
      );
    }
    
    const sprintIssues = issues.filter(issue => issue.sprintId === activeSprint.id);
    
    return (
      <div className="space-y-6">
        {/* Sprint Header */}
        <Card className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {activeSprint.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeSprint.startDate} - {activeSprint.endDate}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                <Zap className="w-4 h-4 mr-1" />
                {sprintIssues.length} issues
              </span>
              <Button onClick={() => endSprint(activeSprint.id)} variant="danger" size="sm">
                End Sprint
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {APP_CONFIG.kanbanColumns.map((columnId) => {
            const columnIssues = sprintIssues.filter(issue => issue.status === columnId);
            const statusConfig = APP_CONFIG.statuses.find(s => s.value === columnId);
            
            return (
              <div
                key={columnId}
                className={`bg-slate-50 dark:bg-slate-900 rounded-xl p-4 transition-all ${
                  dragOverColumn === columnId ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950' : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverColumn(columnId);
                }}
                onDrop={(e) => handleDrop(e, columnId)}
                onDragLeave={() => setDragOverColumn(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {statusConfig?.label}
                  </h3>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {columnIssues.length}
                  </span>
                </div>
                
                <div className="space-y-3 min-h-[300px]">
                  {columnIssues.map((issue) => (
                    <Card
                      key={issue.id}
                      hover
                      className={`p-4 cursor-move ${draggedItem?.id === issue.id ? 'opacity-50' : ''}`}
                    >
                      <div
                        draggable={APP_CONFIG.features.dragAndDrop}
                        onDragStart={(e) => handleDragStart(e, issue)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {issue.id}
                          </span>
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                          {issue.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {issue.assignee}
                          </span>
                          <button
                            onClick={() => setEditingIssue(issue)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render Sprints View
  const renderSprintsView = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sprint Management</h2>
          <Button onClick={() => setIsSprintModalOpen(true)} icon={Plus} variant="orange">
            {LABELS.newSprint}
          </Button>
        </div>
        
        <div className="grid gap-4">
          {sprints.map((sprint) => {
            const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id);
            const completedIssues = sprintIssues.filter(issue => issue.status === 'done');
            const progress = sprintIssues.length > 0 
              ? Math.round((completedIssues.length / sprintIssues.length) * 100) 
              : 0;
            
            return (
              <Card key={sprint.id} className="p-6" hover>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {sprint.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {sprint.startDate} - {sprint.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      sprint.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                        : sprint.status === 'completed'
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {sprint.status}
                    </span>
                    
                    {/* View button for all sprints */}
                    <Button 
                      onClick={() => setViewingSprintId(sprint.id)} 
                      size="sm" 
                      variant="ghost" 
                      icon={Eye}
                    >
                      View
                    </Button>
                    
                    {sprint.status === 'planned' && (
                      <Button onClick={() => startSprint(sprint.id)} size="sm" variant="success" icon={Play}>
                        Start
                      </Button>
                    )}
                    
                    {sprint.status === 'active' && (
                      <Button onClick={() => endSprint(sprint.id)} size="sm" variant="danger" icon={Square}>
                        End
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {completedIssues.length}/{sprintIssues.length} completed
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {sprintIssues.slice(0, 5).map((issue) => (
                      <div 
                        key={issue.id} 
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs"
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          issue.status === 'done' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                        <span className="text-slate-700 dark:text-slate-300">{issue.id}</span>
                      </div>
                    ))}
                    {sprintIssues.length > 5 && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 py-1">
                        +{sprintIssues.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render Sprint Detail View (Read-Only Kanban for any sprint)
  const renderSprintDetailView = (sprintId: string) => {
    const sprint = sprints.find(s => s.id === sprintId);
    if (!sprint) return null;
    
    const sprintIssues = issues.filter(issue => issue.sprintId === sprintId);
    const completedIssues = sprintIssues.filter(issue => issue.status === 'done');
    const progress = sprintIssues.length > 0 
      ? Math.round((completedIssues.length / sprintIssues.length) * 100) 
      : 0;
    const isReadOnly = sprint.status !== 'active';
    
    return (
      <div className="space-y-6">
        {/* Sprint Header */}
        <Card className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewingSprintId(null)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {sprint.name}
                  </h2>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    sprint.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : sprint.status === 'completed'
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {sprint.status}
                  </span>
                  {isReadOnly && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 rounded">
                      Read-Only
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {sprint.startDate} - {sprint.endDate} • {progress}% complete ({completedIssues.length}/{sprintIssues.length} tasks)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <Zap className="w-4 h-4 mr-1" />
                {sprintIssues.length} issues
              </span>
              {sprint.status === 'active' && (
                <Button onClick={() => endSprint(sprint.id)} variant="danger" size="sm">
                  End Sprint
                </Button>
              )}
            </div>
          </div>
        </Card>
        
        {/* Kanban Board (Read-Only for non-active sprints) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {APP_CONFIG.kanbanColumns.map((columnId) => {
            const columnIssues = sprintIssues.filter(issue => issue.status === columnId);
            const statusConfig = APP_CONFIG.statuses.find(s => s.value === columnId);
            
            return (
              <div
                key={columnId}
                className={`bg-slate-50 dark:bg-slate-900 rounded-xl p-4 ${
                  isReadOnly ? 'opacity-90' : ''
                } ${!isReadOnly && dragOverColumn === columnId ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950' : ''}`}
                onDragOver={!isReadOnly ? (e) => {
                  e.preventDefault();
                  setDragOverColumn(columnId);
                } : undefined}
                onDrop={!isReadOnly ? (e) => handleDrop(e, columnId) : undefined}
                onDragLeave={!isReadOnly ? () => setDragOverColumn(null) : undefined}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {statusConfig?.label}
                  </h3>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {columnIssues.length}
                  </span>
                </div>
                
                <div className="space-y-3 min-h-[200px]">
                  {columnIssues.map((issue) => (
                    <Card
                      key={issue.id}
                      hover={!isReadOnly}
                      className={`p-4 ${!isReadOnly ? 'cursor-move' : 'cursor-default'} ${draggedItem?.id === issue.id ? 'opacity-50' : ''}`}
                    >
                      <div
                        draggable={!isReadOnly && APP_CONFIG.features.dragAndDrop}
                        onDragStart={!isReadOnly ? (e) => handleDragStart(e, issue) : undefined}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {issue.id}
                          </span>
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                          {issue.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {issue.assignee}
                          </span>
                          {!isReadOnly && (
                            <button
                              onClick={() => setEditingIssue(issue)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {columnIssues.length === 0 && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <ConfigContext.Provider value={configValue}>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
          {/* Header with Gentle Background */}
          <header className="bg-slate-700 dark:bg-slate-800 shadow-lg">
            <div className={`${THEME.layout.maxWidth} mx-auto ${THEME.layout.padding}`}>
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                    <h1 className="text-xl font-bold text-white">{APP_CONFIG.appName}</h1>
                  </div>
                  
                  {/* Navigation */}
                  <nav className="flex gap-1">
                    {APP_CONFIG.navigation.filter(n => n.enabled).map(nav => (
                      <button
                        key={nav.id}
                        onClick={() => { setCurrentView(nav.id); setViewingSprintId(null); }}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                          currentView === nav.id
                            ? 'bg-blue-400 text-white shadow-lg shadow-blue-400/25'
                            : 'text-slate-200 hover:text-white hover:bg-slate-600'
                        }`}
                      >
                        {nav.label}
                      </button>
                    ))}
                  </nav>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Search */}
                  {APP_CONFIG.features.search && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={LABELS.searchPlaceholder}
                        className="pl-9 pr-3 py-2 w-64 bg-slate-600 border border-slate-500 text-white placeholder-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                  )}
                  
                  {/* Team Size Indicator */}
                  {APP_CONFIG.features.mitosis && (
                    <TeamSizeIndicator 
                      teamSize={teamSize} 
                      onClick={handleTeamSizeClick}
                    />
                  )}
                  
                  {/* Dark Mode Toggle */}
                  {APP_CONFIG.features.darkMode && (
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-600 transition-colors"
                    >
                      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className={`${THEME.layout.maxWidth} mx-auto ${THEME.layout.padding} py-8`}>
            {currentView === 'issues' && renderIssuesView()}
            {currentView === 'current-sprint' && APP_CONFIG.features.kanban && renderKanbanView()}
            {currentView === 'sprints' && APP_CONFIG.features.sprints && (
              viewingSprintId ? renderSprintDetailView(viewingSprintId) : renderSprintsView()
            )}
            {currentView === 'executive-briefing' && (
              <ExecutiveBriefing issues={issues} sprints={sprints} />
            )}
            {APP_CONFIG.features.mitosis && currentView === 'cell-workspace' && mitosisState && getCurrentCell() && (
              <CellWorkspace
                mitosisState={mitosisState}
                currentCell={getCurrentCell()!}
                onSwitchCell={handleSwitchCell}
                onEmbassyView={() => setIsEmbassyViewOpen(true)}
                onMerge={handleMergeTeams}
              />
            )}
          </main>
          
          {/* Modals */}
          <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title={LABELS.newIssue}
          >
            <IssueForm
              onSubmit={handleCreateIssue}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </Modal>
          
          <Modal
            isOpen={!!editingIssue}
            onClose={() => setEditingIssue(null)}
            title={LABELS.editIssue}
          >
            <IssueForm
              issue={editingIssue}
              onSubmit={(formData: any) => {
                updateIssue(editingIssue!.id, formData);
                setEditingIssue(null);
              }}
              onCancel={() => setEditingIssue(null)}
            />
          </Modal>
          
          <Modal
            isOpen={isSprintModalOpen}
            onClose={() => setIsSprintModalOpen(false)}
            title={LABELS.newSprint}
          >
            <SprintForm
              onSubmit={createSprint}
              onCancel={() => setIsSprintModalOpen(false)}
            />
          </Modal>
          
          {/* Mitosis Modals */}
          {APP_CONFIG.features.mitosis && mockSplitAnalysis && (
            <>
              <SplitPreviewModal
                isOpen={isSplitPreviewOpen}
                onClose={() => setIsSplitPreviewOpen(false)}
                onTrySplit={handleTrySplit}
                analysis={mockSplitAnalysis}
              />
              
              <SplitConfigWizard
                isOpen={isSplitConfigOpen}
                onClose={() => setIsSplitConfigOpen(false)}
                onStartPreview={handleStartPreview}
                analysis={mockSplitAnalysis}
              />
              
              {mitosisState && (
                <EmbassyView
                  isOpen={isEmbassyViewOpen}
                  onClose={() => setIsEmbassyViewOpen(false)}
                  mitosisState={mitosisState}
                />
              )}
            </>
          )}
        </div>
      </div>
    </ConfigContext.Provider>
  );
};

export default FlowCraft;