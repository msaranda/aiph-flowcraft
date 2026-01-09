"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Users, 
  Building2,
  Mail,
  User as UserIcon,
  Check,
  AlertCircle
} from 'lucide-react';

// Type definitions matching flowcraft.tsx
interface User {
  id: string;
  name: string;
  email: string;
  teamId: string;
  avatar?: string;
  role?: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
}

interface UserManagementProps {
  users: User[];
  teams: Team[];
  onCreateUser: (userData: Omit<User, 'id'>) => User;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onCreateTeam: (teamData: Omit<Team, 'id'>) => Team;
  onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
  onDeleteTeam: (teamId: string) => void;
  getTeamUsers: (teamId: string) => User[];
}

// Team color options for new teams
const TEAM_COLORS = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Emerald', value: 'bg-emerald-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Cyan', value: 'bg-cyan-500' },
  { name: 'Amber', value: 'bg-amber-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
];

// Card component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

// Button component
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', icon: Icon, disabled, type = 'button', className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200';
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300',
    secondary: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
    ghost: 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
};

// Modal component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// User Form Component
const UserForm: React.FC<{
  user?: User;
  teams: Team[];
  onSubmit: (data: Omit<User, 'id'>) => void;
  onCancel: () => void;
}> = ({ user, teams, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    teamId: user?.teamId || teams[0]?.id || '',
    role: user?.role || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.teamId) newErrors.teamId = 'Team is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white ${
            errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
          }`}
          placeholder="Enter full name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white ${
            errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
          }`}
          placeholder="email@company.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Team *
        </label>
        <select
          value={formData.teamId}
          onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white ${
            errors.teamId ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
          }`}
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        {errors.teamId && <p className="text-red-500 text-sm mt-1">{errors.teamId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Role
        </label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          placeholder="e.g., Frontend Developer"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

// Team Form Component
const TeamForm: React.FC<{
  team?: Team;
  onSubmit: (data: Omit<Team, 'id'>) => void;
  onCancel: () => void;
}> = ({ team, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    color: team?.color || TEAM_COLORS[0].value,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Team name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Team Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white ${
            errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
          }`}
          placeholder="Enter team name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Team Color
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TEAM_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: color.value })}
              className={`w-full h-10 rounded-lg ${color.value} flex items-center justify-center transition-all ${
                formData.color === color.value ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white' : ''
              }`}
            >
              {formData.color === color.value && <Check className="w-5 h-5 text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {team ? 'Update Team' : 'Create Team'}
        </Button>
      </div>
    </form>
  );
};

// Main UserManagement Component
export default function UserManagement({
  users,
  teams,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onCreateTeam,
  onUpdateTeam,
  onDeleteTeam,
  getTeamUsers,
}: UserManagementProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'teams'>('users');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleCreateUser = (userData: Omit<User, 'id'>) => {
    onCreateUser(userData);
    setIsUserModalOpen(false);
  };

  const handleUpdateUser = (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      onUpdateUser(editingUser.id, userData);
      setEditingUser(null);
    }
  };

  const handleCreateTeam = (teamData: Omit<Team, 'id'>) => {
    onCreateTeam(teamData);
    setIsTeamModalOpen(false);
  };

  const handleUpdateTeam = (teamData: Omit<Team, 'id'>) => {
    if (editingTeam) {
      onUpdateTeam(editingTeam.id, teamData);
      setEditingTeam(null);
    }
  };

  const getTeamById = (teamId: string): Team | undefined => teams.find((t) => t.id === teamId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Team Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage users and teams for your organization
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users ({users.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'teams'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Teams ({teams.length})
          </div>
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsUserModalOpen(true)} icon={Plus}>
              Add User
            </Button>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {users.map((user) => {
                  const team = getTeamById(user.teamId);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {team && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${team.color}`}
                          >
                            {team.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {user.role || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit2}
                            onClick={() => setEditingUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => {
                              if (window.confirm(`Delete user ${user.name}?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">No users yet. Add your first user to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsTeamModalOpen(true)} icon={Plus}>
              Add Team
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => {
              const teamUsers = getTeamUsers(team.id);
              return (
                <Card key={team.id} className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${team.color} flex items-center justify-center`}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{team.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {teamUsers.length} member{teamUsers.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {!team.isDefault && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingTeam(team)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete team ${team.name}?`)) {
                              onDeleteTeam(team.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {team.isDefault && (
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Team Members */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Members
                    </h4>
                    {teamUsers.length > 0 ? (
                      <div className="space-y-2">
                        {teamUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                              <UserIcon className="w-3 h-3 text-slate-500" />
                            </div>
                            <span>{user.name}</span>
                            {user.role && (
                              <span className="text-slate-400 text-xs">• {user.role}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No members assigned</p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Add New User"
      >
        <UserForm teams={teams} onSubmit={handleCreateUser} onCancel={() => setIsUserModalOpen(false)} />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
      >
        {editingUser && (
          <UserForm
            user={editingUser}
            teams={teams}
            onSubmit={handleUpdateUser}
            onCancel={() => setEditingUser(null)}
          />
        )}
      </Modal>

      {/* Create Team Modal */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title="Add New Team"
      >
        <TeamForm onSubmit={handleCreateTeam} onCancel={() => setIsTeamModalOpen(false)} />
      </Modal>

      {/* Edit Team Modal */}
      <Modal
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        title="Edit Team"
      >
        {editingTeam && (
          <TeamForm
            team={editingTeam}
            onSubmit={handleUpdateTeam}
            onCancel={() => setEditingTeam(null)}
          />
        )}
      </Modal>
    </div>
  );
}
