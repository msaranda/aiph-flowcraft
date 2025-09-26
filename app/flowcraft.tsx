import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Calendar, ChevronDown, X, Check, AlertCircle, Mic, MicOff, Sun, Moon, Edit2, Trash2, ArrowRight, Play, Square, CheckCircle2, Clock, Users, Filter } from 'lucide-react';

// Type definitions
interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  assignee: string;
  sprintId: string | null;
  createdAt: string;
}

interface Sprint {
  id: string;
  name: string;
  status: 'planned' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface IssueFormData {
  title: string;
  description: string;
  priority: Issue['priority'];
  assignee: string;
  sprintId: string;
}

interface SprintFormData {
  name: string;
  startDate: string;
  endDate: string;
}

interface FormErrors {
  [key: string]: string;
}

type ViewType = 'issues' | 'current-sprint' | 'sprints';
type SortType = 'created' | 'priority' | 'title';

// Component prop types
interface IssueFormProps {
  issue?: Issue | null;
  onSubmit: (formData: IssueFormData) => void;
  onCancel: () => void;
  sprints: Sprint[];
}

interface SprintFormProps {
  onSubmit: (formData: SprintFormData) => void;
  onCancel: () => void;
}

const FlowCraft: React.FC = () => {
  // Initial sample data
  const initialIssues: Issue[] = [
    { id: 'TSK-001', title: 'Implement user authentication', description: 'Add OAuth2 authentication with Google and GitHub providers', status: 'done', priority: 'P0', assignee: 'Alice Chen', sprintId: 'SPR-001', createdAt: '2024-01-15' },
    { id: 'TSK-002', title: 'Design system components', description: 'Create reusable Button, Input, and Card components', status: 'in-review', priority: 'P1', assignee: 'Bob Smith', sprintId: 'SPR-001', createdAt: '2024-01-16' },
    { id: 'TSK-003', title: 'API rate limiting', description: 'Implement rate limiting for public API endpoints', status: 'in-progress', priority: 'P0', assignee: 'Carol Davis', sprintId: 'SPR-002', createdAt: '2024-01-17' },
    { id: 'TSK-004', title: 'Database migration scripts', description: 'Create migration scripts for v2.0 schema changes', status: 'todo', priority: 'P2', assignee: 'David Lee', sprintId: 'SPR-002', createdAt: '2024-01-18' },
    { id: 'TSK-005', title: 'Mobile responsive design', description: 'Ensure all pages work on mobile devices', status: 'todo', priority: 'P1', assignee: 'Eve Johnson', sprintId: 'SPR-002', createdAt: '2024-01-19' },
    { id: 'TSK-006', title: 'Performance optimization', description: 'Optimize bundle size and loading times', status: 'todo', priority: 'P3', assignee: 'Frank Wilson', sprintId: 'SPR-003', createdAt: '2024-01-20' },
    { id: 'TSK-007', title: 'Add unit tests', description: 'Achieve 80% code coverage with unit tests', status: 'todo', priority: 'P2', assignee: 'Grace Brown', sprintId: 'SPR-003', createdAt: '2024-01-21' },
    { id: 'TSK-008', title: 'Documentation update', description: 'Update API documentation for new endpoints', status: 'todo', priority: 'P4', assignee: 'Henry Taylor', sprintId: null, createdAt: '2024-01-22' },
    { id: 'TSK-009', title: 'Bug fix: Login redirect', description: 'Fix incorrect redirect after login', status: 'in-progress', priority: 'P0', assignee: 'Iris Martinez', sprintId: 'SPR-002', createdAt: '2024-01-23' },
    { id: 'TSK-010', title: 'Feature: Dark mode', description: 'Implement dark mode toggle with system preference detection', status: 'done', priority: 'P3', assignee: 'Jack Anderson', sprintId: 'SPR-001', createdAt: '2024-01-24' },
    { id: 'TSK-011', title: 'Security audit', description: 'Conduct security audit and fix vulnerabilities', status: 'todo', priority: 'P0', assignee: 'Kelly White', sprintId: null, createdAt: '2024-01-25' },
    { id: 'TSK-012', title: 'Email notifications', description: 'Set up email notification service', status: 'todo', priority: 'P2', assignee: 'Liam Harris', sprintId: null, createdAt: '2024-01-26' },
    { id: 'TSK-013', title: 'Search functionality', description: 'Add full-text search across all content', status: 'todo', priority: 'P1', assignee: 'Maya Clark', sprintId: null, createdAt: '2024-01-27' },
    { id: 'TSK-014', title: 'Webhook integration', description: 'Add webhook support for third-party integrations', status: 'todo', priority: 'P4', assignee: 'Noah Lewis', sprintId: null, createdAt: '2024-01-28' },
    { id: 'TSK-015', title: 'Analytics dashboard', description: 'Create user analytics dashboard', status: 'todo', priority: 'P5', assignee: 'Olivia Walker', sprintId: null, createdAt: '2024-01-29' },
    { id: 'TSK-016', title: 'Backup automation', description: 'Automate database backup process', status: 'todo', priority: 'P1', assignee: 'Paul Green', sprintId: null, createdAt: '2024-01-30' },
    { id: 'TSK-017', title: 'Load testing', description: 'Perform load testing for 10k concurrent users', status: 'todo', priority: 'P2', assignee: 'Quinn Baker', sprintId: null, createdAt: '2024-01-31' }
  ];

  const initialSprints: Sprint[] = [
    { id: 'SPR-001', name: 'Sprint 1 - Foundation', status: 'completed', startDate: '2024-01-15', endDate: '2024-01-29', createdAt: '2024-01-14' },
    { id: 'SPR-002', name: 'Sprint 2 - Core Features', status: 'active', startDate: '2024-01-30', endDate: '2024-02-13', createdAt: '2024-01-28' },
    { id: 'SPR-003', name: 'Sprint 3 - Optimization', status: 'planned', startDate: '2024-02-14', endDate: '2024-02-28', createdAt: '2024-02-01' }
  ];

  // State management
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [currentView, setCurrentView] = useState<ViewType>('issues');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortType>('created');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState<boolean>(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [assignModalIssue, setAssignModalIssue] = useState<Issue | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [draggedItem, setDraggedItem] = useState<Issue | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Voice search setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setSearchQuery(finalTranscript);
          setVoiceTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceSearch = (): void => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setVoiceTranscript('');
    }
  };

  // Priority colors
  const getPriorityColor = (priority: Issue['priority']): string => {
    const colors: Record<Issue['priority'], string> = {
      'P0': 'bg-red-500 text-white',
      'P1': 'bg-orange-500 text-white',
      'P2': 'bg-yellow-500 text-white',
      'P3': 'bg-blue-500 text-white',
      'P4': 'bg-green-500 text-white',
      'P5': 'bg-gray-500 text-white'
    };
    return colors[priority] || 'bg-gray-400 text-white';
  };

  // Status colors
  const getStatusColor = (status: Issue['status']): string => {
    const colors: Record<Issue['status'], string> = {
      'todo': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'in-review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Generate next issue ID
  const generateIssueId = (): string => {
    const maxId = Math.max(...issues.map(i => parseInt(i.id.split('-')[1])), 0);
    return `TSK-${String(maxId + 1).padStart(3, '0')}`;
  };

  // Generate next sprint ID
  const generateSprintId = (): string => {
    const maxId = Math.max(...sprints.map(s => parseInt(s.id.split('-')[1])), 0);
    return `SPR-${String(maxId + 1).padStart(3, '0')}`;
  };

  // Create new issue
  const createIssue = (formData: IssueFormData): void => {
    const newIssue: Issue = {
      id: generateIssueId(),
      title: formData.title,
      description: formData.description,
      status: 'todo',
      priority: formData.priority,
      assignee: formData.assignee,
      sprintId: formData.sprintId || null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setIssues([...issues, newIssue]);
    setIsCreateModalOpen(false);
  };

  // Update issue
  const updateIssue = (id: string, updates: Partial<Issue>): void => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, ...updates } : issue
    ));
    setEditingIssue(null);
  };

  // Delete issue
  const deleteIssue = (id: string): void => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      setIssues(issues.filter(issue => issue.id !== id));
    }
  };

  // Create sprint
  const createSprint = (formData: SprintFormData): void => {
    const newSprint: Sprint = {
      id: generateSprintId(),
      name: formData.name,
      status: 'planned',
      startDate: formData.startDate,
      endDate: formData.endDate,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSprints([...sprints, newSprint]);
    setIsSprintModalOpen(false);
  };

  // Start sprint
  const startSprint = (sprintId: string): void => {
    const hasActiveSprint = sprints.some(s => s.status === 'active');
    if (hasActiveSprint) {
      alert('Only one sprint can be active at a time. Please end the current sprint first.');
      return;
    }
    setSprints(sprints.map(sprint =>
      sprint.id === sprintId ? { ...sprint, status: 'active' } : sprint
    ));
  };

  // End sprint
  const endSprint = (sprintId: string): void => {
    setSprints(sprints.map(sprint =>
      sprint.id === sprintId ? { ...sprint, status: 'completed' } : sprint
    ));
    // Move unfinished issues back to backlog
    setIssues(issues.map(issue =>
      issue.sprintId === sprintId && issue.status !== 'done'
        ? { ...issue, sprintId: null }
        : issue
    ));
  };

  // Assign issue to sprint
  const assignToSprint = (issueId: string, sprintId: string): void => {
    setIssues(issues.map(issue =>
      issue.id === issueId ? { ...issue, sprintId } : issue
    ));
    setAssignModalIssue(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issue: Issue): void => {
    setDraggedItem(issue);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Issue['status']): void => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      updateIssue(draggedItem.id, { status: newStatus });
    }
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = (): void => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  // Filter and sort issues
  const getFilteredIssues = (): Issue[] => {
    let filtered = issues;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(issue => issue.priority === filterPriority);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(issue => issue.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return parseInt(a.priority.substring(1)) - parseInt(b.priority.substring(1));
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Get current sprint
  const getCurrentSprint = (): Sprint | undefined => sprints.find(s => s.status === 'active');

  // Get issues for current sprint
  const getCurrentSprintIssues = (): Issue[] => {
    const activeSprint = getCurrentSprint();
    if (!activeSprint) return [];
    return issues.filter(issue => issue.sprintId === activeSprint.id);
  };

  // Issue form component
  const IssueForm: React.FC<IssueFormProps> = ({ issue, onSubmit, onCancel, sprints }) => {
    const [formData, setFormData] = useState<IssueFormData>({
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || 'P2',
      assignee: issue?.assignee || '',
      sprintId: issue?.sprintId || ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
      const newErrors: FormErrors = {};
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.assignee.trim()) newErrors.assignee = 'Assignee is required';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (): void => {
      if (validate()) {
        onSubmit(formData);
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-800 dark:text-white`}
            placeholder="Enter issue title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            rows={3}
            placeholder="Enter issue description"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Issue['priority'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="P0">P0 - Critical</option>
              <option value="P1">P1 - High</option>
              <option value="P2">P2 - Medium</option>
              <option value="P3">P3 - Low</option>
              <option value="P4">P4 - Minor</option>
              <option value="P5">P5 - Trivial</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Assignee *</label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.assignee ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-800 dark:text-white`}
              placeholder="Enter assignee name"
            />
            {errors.assignee && <p className="text-red-500 text-sm mt-1">{errors.assignee}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sprint</label>
          <select
            value={formData.sprintId}
            onChange={(e) => setFormData({ ...formData, sprintId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Backlog</option>
            {sprints.filter(s => s.status !== 'completed').map(sprint => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name} ({sprint.status})
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {issue ? 'Update Issue' : 'Create Issue'}
          </button>
        </div>
      </div>
    );
  };

  // Sprint form component
  const SprintForm: React.FC<SprintFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<SprintFormData>({
      name: '',
      startDate: '',
      endDate: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
      const newErrors: FormErrors = {};
      if (!formData.name.trim()) newErrors.name = 'Sprint name is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (): void => {
      if (validate()) {
        onSubmit(formData);
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sprint Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-800 dark:text-white`}
            placeholder="Enter sprint name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-800 dark:text-white`}
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">End Date *</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-800 dark:text-white`}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Sprint
          </button>
        </div>
      </div>
    );
  };

  // Render issues view
  const renderIssuesView = (): JSX.Element => {
    const filteredIssues = getFilteredIssues();
    
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="P0">P0 - Critical</option>
              <option value="P1">P1 - High</option>
              <option value="P2">P2 - Medium</option>
              <option value="P3">P3 - Low</option>
              <option value="P4">P4 - Minor</option>
              <option value="P5">P5 - Trivial</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="in-review">In Review</option>
              <option value="done">Done</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              aria-label="Sort by"
            >
              <option value="created">Sort by Created</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            aria-label="Create new issue"
          >
            <Plus className="w-4 h-4" />
            New Issue
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assignee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sprint</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredIssues.map((issue) => {
                const sprint = sprints.find(s => s.id === issue.sprintId);
                return (
                  <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{issue.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{issue.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{issue.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{issue.assignee}</td>
                    <td className="px-4 py-3 text-sm">
                      {sprint ? (
                        <span className="text-gray-900 dark:text-gray-100">{sprint.name}</span>
                      ) : (
                        <button
                          onClick={() => setAssignModalIssue(issue)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          aria-label="Assign to sprint"
                        >
                          Assign to Sprint
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingIssue(issue)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          aria-label="Edit issue"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteIssue(issue.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="Delete issue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredIssues.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No issues found matching your filters
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render current sprint view (Kanban)
  const renderCurrentSprintView = (): JSX.Element => {
    const activeSprint = getCurrentSprint();
    
    if (!activeSprint) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Active Sprint</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            There is no sprint currently active. Start a sprint from the Sprints view to see the Kanban board.
          </p>
          <button
            onClick={() => setCurrentView('sprints')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Sprints
          </button>
        </div>
      );
    }

    const sprintIssues = getCurrentSprintIssues();
    const columns: Issue['status'][] = ['todo', 'in-progress', 'in-review', 'done'];
    const columnNames: Record<Issue['status'], string> = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'in-review': 'In Review',
      'done': 'Done'
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeSprint.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeSprint.startDate} - {activeSprint.endDate}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sprintIssues.length} issues
            </span>
            <button
              onClick={() => endSprint(activeSprint.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              aria-label="End sprint"
            >
              <Square className="w-4 h-4" />
              End Sprint
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((columnId) => {
            const columnIssues = sprintIssues.filter(issue => issue.status === columnId);
            
            return (
              <div 
                key={columnId} 
                className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-4 transition-colors ${
                  dragOverColumn === columnId ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, columnId)}
                onDrop={(e) => handleDrop(e, columnId)}
                onDragLeave={() => setDragOverColumn(null)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-between">
                  {columnNames[columnId]}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {columnIssues.length}
                  </span>
                </h3>
                
                <div className="space-y-2 min-h-[400px]">
                  {columnIssues.map((issue) => (
                    <div
                      key={issue.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, issue)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-move ${
                        draggedItem?.id === issue.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {issue.id}
                        </span>
                        <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {issue.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {issue.assignee}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingIssue(issue)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Edit issue"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render sprints view
  const renderSprintsView = (): JSX.Element => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sprints</h2>
          <button
            onClick={() => setIsSprintModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            aria-label="Create new sprint"
          >
            <Plus className="w-4 h-4" />
            New Sprint
          </button>
        </div>
        
        <div className="grid gap-4">
          {sprints.map((sprint) => {
            const sprintIssues = issues.filter(issue => issue.sprintId === sprint.id);
            const completedIssues = sprintIssues.filter(issue => issue.status === 'done');
            const progress = sprintIssues.length > 0 
              ? Math.round((completedIssues.length / sprintIssues.length) * 100) 
              : 0;
            
            return (
              <div key={sprint.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{sprint.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sprint.startDate} - {sprint.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sprint.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : sprint.status === 'completed'
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {sprint.status}
                    </span>
                    
                    {sprint.status === 'planned' && (
                      <button
                        onClick={() => startSprint(sprint.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                        aria-label="Start sprint"
                      >
                        <Play className="w-3 h-3" />
                        Start
                      </button>
                    )}
                    
                    {sprint.status === 'active' && (
                      <button
                        onClick={() => endSprint(sprint.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                        aria-label="End sprint"
                      >
                        <Square className="w-3 h-3" />
                        End
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {completedIssues.length}/{sprintIssues.length} issues
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {sprintIssues.slice(0, 5).map((issue) => (
                      <div 
                        key={issue.id} 
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          issue.status === 'done' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-gray-700 dark:text-gray-300">{issue.id}</span>
                      </div>
                    ))}
                    {sprintIssues.length > 5 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 py-1">
                        +{sprintIssues.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">FlowCraft</h1>
                
                <nav className="flex gap-1">
                  <button
                    onClick={() => setCurrentView('issues')}
                    className={`px-4 py-2 rounded-lg transition ${
                      currentView === 'issues'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="View all issues"
                  >
                    Issues
                  </button>
                  <button
                    onClick={() => setCurrentView('current-sprint')}
                    className={`px-4 py-2 rounded-lg transition ${
                      currentView === 'current-sprint'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="View current sprint"
                  >
                    Current Sprint
                  </button>
                  <button
                    onClick={() => setCurrentView('sprints')}
                    className={`px-4 py-2 rounded-lg transition ${
                      currentView === 'sprints'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="View all sprints"
                  >
                    Sprints
                  </button>
                </nav>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search issues..."
                    className="pl-9 pr-10 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    aria-label="Search issues"
                  />
                  <button
                    onClick={toggleVoiceSearch}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isListening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                    aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Voice transcript notification */}
        {voiceTranscript && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2 text-sm text-blue-700 dark:text-blue-300">
            Voice search: "{voiceTranscript}"
          </div>
        )}

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'issues' && renderIssuesView()}
          {currentView === 'current-sprint' && renderCurrentSprintView()}
          {currentView === 'sprints' && renderSprintsView()}
        </main>

        {/* Create Issue Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
              <h2 className="text-xl font-bold mb-4">Create New Issue</h2>
              <IssueForm 
                onSubmit={createIssue}
                onCancel={() => setIsCreateModalOpen(false)}
                sprints={sprints}
              />
            </div>
          </div>
        )}

        {/* Edit Issue Modal */}
        {editingIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
              <h2 className="text-xl font-bold mb-4">Edit Issue</h2>
              <IssueForm 
                issue={editingIssue}
                onSubmit={(formData) => updateIssue(editingIssue.id, formData)}
                onCancel={() => setEditingIssue(null)}
                sprints={sprints}
              />
            </div>
          </div>
        )}

        {/* Create Sprint Modal */}
        {isSprintModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
              <h2 className="text-xl font-bold mb-4">Create New Sprint</h2>
              <SprintForm 
                onSubmit={createSprint}
                onCancel={() => setIsSprintModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Assign to Sprint Modal */}
        {assignModalIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Assign to Sprint</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a sprint for issue {assignModalIssue.id}
              </p>
              <div className="space-y-2">
                {sprints.filter(s => s.status !== 'completed').map(sprint => (
                  <button
                    key={sprint.id}
                    onClick={() => assignToSprint(assignModalIssue.id, sprint.id)}
                    className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition"
                  >
                    <div className="font-medium">{sprint.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {sprint.status} • {sprint.startDate} - {sprint.endDate}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setAssignModalIssue(null)}
                className="w-full mt-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowCraft;