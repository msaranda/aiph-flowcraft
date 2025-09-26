"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Search, Plus, Calendar, ChevronDown, X, Check, AlertCircle, Mic, MicOff, Sun, Moon, Edit2, Trash2, ArrowRight, Play, Square, CheckCircle2, Clock, Users, Filter, LucideIcon } from 'lucide-react';

// ==========================================
// CONFIGURATION SECTION - Easy to customize
// ==========================================

const APP_CONFIG = {
  // Branding
  appName: 'FlowCraft',
  appTagline: 'Task Management System',
  
  // Feature Flags
  features: {
    darkMode: true,
    voiceSearch: true,
    dragAndDrop: true,
    sprints: true,
    kanban: true,
    filters: true,
    search: true,
    bulkActions: false, // Example of disabled feature
    comments: false,    // Future feature
    attachments: false, // Future feature
  },
  
  // Task Configuration
  taskPrefix: 'TSK',
  sprintPrefix: 'SPR',
  
  // Priorities
  priorities: [
    { value: 'P0', label: 'Critical', color: 'bg-red-500 text-white' },
    { value: 'P1', label: 'High', color: 'bg-orange-500 text-white' },
    { value: 'P2', label: 'Medium', color: 'bg-yellow-500 text-white' },
    { value: 'P3', label: 'Low', color: 'bg-blue-500 text-white' },
    { value: 'P4', label: 'Minor', color: 'bg-green-500 text-white' },
    { value: 'P5', label: 'Trivial', color: 'bg-gray-500 text-white' },
  ],
  
  // Status Configuration
  statuses: [
    { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'in-review', label: 'In Review', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  ],
  
  // Kanban Columns (can be different from statuses)
  kanbanColumns: ['todo', 'in-progress', 'in-review', 'done'],
  
  // Navigation Items
  navigation: [
    { id: 'issues', label: 'Issues', enabled: true },
    { id: 'current-sprint', label: 'Current Sprint', enabled: true },
    { id: 'sprints', label: 'Sprints', enabled: true },
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
};

// ==========================================
// THEME CONFIGURATION
// ==========================================

const THEME = {
  colors: {
    primary: 'blue',
    danger: 'red',
    success: 'green',
    warning: 'yellow',
  },
  
  components: {
    button: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
    },
    
    card: 'bg-white dark:bg-gray-800 rounded-lg shadow',
    modal: 'bg-white dark:bg-gray-800 rounded-lg',
    input: 'border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white',
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
  noActiveSprintDescription: 'There is no sprint currently active. Start a sprint from the Sprints view to see the Kanban board.',
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
  // Add custom fields here
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
// REUSABLE COMPONENTS
// ==========================================

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
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
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      className={`${theme.components.button[variant]} ${sizeClasses[size]} rounded-lg transition flex items-center gap-2 ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const { theme } = useConfig();
  return (
    <div className={`${theme.components.card} ${className}`}>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${theme.components.modal} max-w-lg w-full p-6`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const FlowCraft: React.FC = () => {
  // Sample data
  const initialIssues: Issue[] = [
    { id: 'TSK-001', title: 'Implement user authentication', description: 'Add OAuth2 authentication', status: 'done', priority: 'P0', assignee: 'Alice Chen', sprintId: 'SPR-001', createdAt: '2024-01-15' },
    { id: 'TSK-002', title: 'Design system components', description: 'Create reusable components', status: 'in-review', priority: 'P1', assignee: 'Bob Smith', sprintId: 'SPR-001', createdAt: '2024-01-16' },
    { id: 'TSK-003', title: 'API rate limiting', description: 'Implement rate limiting', status: 'in-progress', priority: 'P0', assignee: 'Carol Davis', sprintId: 'SPR-002', createdAt: '2024-01-17' },
  ];
  
  const initialSprints: Sprint[] = [
    { id: 'SPR-001', name: 'Sprint 1 - Foundation', status: 'completed', startDate: '2024-01-15', endDate: '2024-01-29', createdAt: '2024-01-14' },
    { id: 'SPR-002', name: 'Sprint 2 - Core Features', status: 'active', startDate: '2024-01-30', endDate: '2024-02-13', createdAt: '2024-01-28' },
    { id: 'SPR-003', name: 'Sprint 3 - Optimization', status: 'planned', startDate: '2024-02-14', endDate: '2024-02-28', createdAt: '2024-02-01' },
  ];
  
  // Core state
  const [currentView, setCurrentView] = useState<string>('issues');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [draggedItem, setDraggedItem] = useState<Issue | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
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
  
  // Simple Issue Form Component
  const IssueForm = ({ issue, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || APP_CONFIG.priorities[2].value,
      assignee: issue?.assignee || '',
      sprintId: issue?.sprintId || '',
    });
    
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{LABELS.title} *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={THEME.components.input + ' w-full px-3 py-2'}
            placeholder={`Enter ${LABELS.title.toLowerCase()}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{LABELS.priority}</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className={THEME.components.input + ' w-full px-3 py-2'}
          >
            {APP_CONFIG.priorities.map(p => (
              <option key={p.value} value={p.value}>
                {p.value} - {p.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>
            {LABELS.cancel}
          </Button>
          <Button onClick={() => onSubmit(formData)}>
            {issue ? LABELS.update : LABELS.create} {LABELS.newIssue.split(' ')[1]}
          </Button>
        </div>
      </div>
    );
  };
  
  // Render Issues View
  const renderIssuesView = () => {
    const filteredIssues = getFilteredIssues();
    
    return (
      <div className="space-y-4">
        {/* Filters */}
        {APP_CONFIG.features.filters && (
          <div className="flex gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={THEME.components.input + ' px-3 py-2'}
            >
              <option value="all">{LABELS.allPriorities}</option>
              {APP_CONFIG.priorities.map(p => (
                <option key={p.value} value={p.value}>
                  {p.value} - {p.label}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <Button onClick={() => setIsCreateModalOpen(true)} icon={Plus}>
          {LABELS.newIssue}
        </Button>
        
        {/* Issues Table */}
        <Card>
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {APP_CONFIG.issueTableColumns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-4 py-3">{issue.id}</td>
                  <td className="px-4 py-3">{issue.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                      {APP_CONFIG.statuses.find(s => s.value === issue.status)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">{issue.assignee}</td>
                  <td className="px-4 py-3">
                    {sprints.find(s => s.id === issue.sprintId)?.name || LABELS.backlog}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingIssue(issue)}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteIssue(issue.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };
  
  // Render Kanban View
  const renderKanbanView = () => {
    const activeSprint = getCurrentSprint();
    if (!activeSprint) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">{LABELS.noActiveSprint}</h3>
          <p className="text-gray-500">{LABELS.noActiveSprintDescription}</p>
        </div>
      );
    }
    
    const sprintIssues = issues.filter(issue => issue.sprintId === activeSprint.id);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {APP_CONFIG.kanbanColumns.map((columnId) => {
          const columnIssues = sprintIssues.filter(issue => issue.status === columnId);
          const statusConfig = APP_CONFIG.statuses.find(s => s.value === columnId);
          
          return (
            <div
              key={columnId}
              className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 ${
                dragOverColumn === columnId ? 'ring-2 ring-blue-500' : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverColumn(columnId);
              }}
              onDrop={(e) => handleDrop(e, columnId)}
              onDragLeave={() => setDragOverColumn(null)}
            >
              <h3 className="font-semibold mb-3">
                {statusConfig?.label} ({columnIssues.length})
              </h3>
              
              <div className="space-y-2 min-h-[200px]">
                {columnIssues.map((issue) => (
                  <div
                    key={issue.id}
                    draggable={APP_CONFIG.features.dragAndDrop}
                    onDragStart={(e) => handleDragStart(e, issue)}
                    className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm hover:shadow-md cursor-move"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-500">{issue.id}</span>
                      <span className={`px-1 py-0.5 text-xs rounded ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium mb-2">{issue.title}</h4>
                    <span className="text-xs text-gray-500">{issue.assignee}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <ConfigContext.Provider value={configValue}>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
            <div className={`${THEME.layout.maxWidth} mx-auto ${THEME.layout.padding}`}>
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-8">
                  <h1 className="text-xl font-bold text-blue-600">{APP_CONFIG.appName}</h1>
                  
                  {/* Navigation */}
                  <nav className="flex gap-1">
                    {APP_CONFIG.navigation.filter(n => n.enabled).map(nav => (
                      <button
                        key={nav.id}
                        onClick={() => setCurrentView(nav.id)}
                        className={`px-4 py-2 rounded-lg ${
                          currentView === nav.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100'
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
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={LABELS.searchPlaceholder}
                        className={`pl-9 pr-3 py-2 w-64 ${THEME.components.input}`}
                      />
                    </div>
                  )}
                  
                  {/* Dark Mode Toggle */}
                  {APP_CONFIG.features.darkMode && (
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
              <div>
                <h2 className="text-2xl font-bold mb-4">Sprints Management</h2>
                {sprints.map(sprint => (
                  <Card key={sprint.id} className="mb-4 p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{sprint.name}</h3>
                        <p className="text-sm text-gray-500">{sprint.startDate} - {sprint.endDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                          {sprint.status}
                        </span>
                        {sprint.status === 'planned' && (
                          <Button size="sm" onClick={() => startSprint(sprint.id)}>
                            Start
                          </Button>
                        )}
                        {sprint.status === 'active' && (
                          <Button size="sm" variant="danger" onClick={() => endSprint(sprint.id)}>
                            End
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
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
        </div>
      </div>
    </ConfigContext.Provider>
  );
};

export default FlowCraft;