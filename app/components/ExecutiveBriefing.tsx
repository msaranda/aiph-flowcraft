"use client";

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  Loader2,
  Sparkles
} from 'lucide-react';
import { ExecutiveBriefingOutput } from '@/app/lib/briefingPrompt';
import { copyToClipboard, exportToPDF, briefingToSlack } from '@/app/lib/exportUtils';
import BriefingFeedback from './BriefingFeedback';
import { FlowCraftIssue, FlowCraftSprint } from '@/app/lib/dataTransform';

interface ExecutiveBriefingProps {
  onClose?: () => void;
  issues?: FlowCraftIssue[];
  sprints?: FlowCraftSprint[];
}

export default function ExecutiveBriefing({ onClose, issues, sprints }: ExecutiveBriefingProps) {
  const [briefing, setBriefing] = useState<ExecutiveBriefingOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [scenario, setScenario] = useState<'mixed' | 'healthy' | 'crisis'>('mixed');
  const [showFeedback, setShowFeedback] = useState(false);
  const [useRealData, setUseRealData] = useState(true);
  
  // Fetch briefing on mount and when scenario or data changes
  useEffect(() => {
    generateBriefing();
  }, [scenario, issues, sprints, useRealData]);
  
  const generateBriefing = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenario: useRealData ? undefined : scenario, 
          useLLM: true,
          issues: useRealData && issues ? issues : undefined,
          sprints: useRealData && sprints ? sprints : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate briefing');
      }
      
      const data = await response.json();
      setBriefing(data.briefing);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = async (format: 'markdown' | 'slack' = 'markdown') => {
    if (!briefing) return;
    
    let success: boolean;
    if (format === 'slack') {
      const slackText = briefingToSlack(briefing);
      try {
        await navigator.clipboard.writeText(slackText);
        success = true;
      } catch {
        success = false;
      }
    } else {
      success = await copyToClipboard(briefing, 'markdown');
    }
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleExportPDF = () => {
    if (!briefing) return;
    exportToPDF(briefing);
  };
  
  const toggleTeamExpanded = (teamName: string) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(teamName)) {
        next.delete(teamName);
      } else {
        next.add(teamName);
      }
      return next;
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Generating executive briefing...</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Analyzing task data across all teams</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={generateBriefing}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }
  
  if (!briefing) return null;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Executive Briefing
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Week of {briefing.weekOf} • Generated {new Date(briefing.generatedAt).toLocaleTimeString()}
            {useRealData && issues && issues.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                Using {issues.length} real tasks
              </span>
            )}
            {!useRealData && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                Using mock data
              </span>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Data Source Toggle */}
          <label className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useRealData}
              onChange={(e) => setUseRealData(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Use Real Data</span>
          </label>
          
          {/* Scenario Selector (only when using mock data) */}
          {!useRealData && (
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as typeof scenario)}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="mixed">Mixed State</option>
              <option value="healthy">Healthy State</option>
              <option value="crisis">Crisis State</option>
            </select>
          )}
          
          <button
            onClick={generateBriefing}
            disabled={loading}
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
          
          <div className="relative group">
            <button
              onClick={() => handleCopy('markdown')}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          
          <button
            onClick={() => handleCopy('slack')}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Slack
          </button>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Risks and Attention */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Risks */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-red-50 dark:bg-red-950/30 px-6 py-4 border-b border-red-100 dark:border-red-900/50">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Top Risks
                <span className="ml-auto text-sm font-normal bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">
                  {briefing.topRisks.length}
                </span>
              </h2>
            </div>
            <div className="p-6">
              {briefing.topRisks.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                  No critical risks at this time
                </p>
              ) : (
                <div className="space-y-4">
                  {briefing.topRisks.map((risk, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500"
                    >
                      <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                        {risk.title}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-red-800 dark:text-red-300">
                          <span className="font-medium">Issue:</span> {risk.issue}
                        </p>
                        <p className="text-red-700 dark:text-red-400">
                          <span className="font-medium">Impact:</span> {risk.impact}
                        </p>
                        <p className="text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="font-medium">Owner:</span> {risk.owner}
                          <span className="text-red-500">→</span> {risk.nextStep}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
          
          {/* Attention Needed */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-amber-50 dark:bg-amber-950/30 px-6 py-4 border-b border-amber-100 dark:border-amber-900/50">
              <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Attention Needed
                <span className="ml-auto text-sm font-normal bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  {briefing.attentionNeeded.length}
                </span>
              </h2>
            </div>
            <div className="p-6">
              {briefing.attentionNeeded.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                  No items requiring immediate attention
                </p>
              ) : (
                <div className="space-y-4">
                  {briefing.attentionNeeded.map((item, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-l-4 border-amber-500"
                    >
                      <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                        {item.title}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-amber-800 dark:text-amber-300">
                          <span className="font-medium">Context:</span> {item.context}
                        </p>
                        <p className="text-amber-700 dark:text-amber-400">
                          <span className="font-medium">Recommendation:</span> {item.recommendation}
                        </p>
                        <p className="text-amber-600 dark:text-amber-500">
                          <span className="font-medium">Impact:</span> {item.impact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
          
          {/* On Track */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 px-6 py-4 border-b border-emerald-100 dark:border-emerald-900/50">
              <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                On Track
                <span className="ml-auto text-sm font-normal bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  {briefing.onTrack.length}
                </span>
              </h2>
            </div>
            <div className="p-6">
              {briefing.onTrack.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                  No updates this period
                </p>
              ) : (
                <div className="space-y-3">
                  {briefing.onTrack.map((item, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border-l-4 border-emerald-500 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-emerald-900 dark:text-emerald-200">
                          {item.title}
                        </h3>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
        
        {/* Right Column - Team Health & Summary */}
        <div className="space-y-6">
          {/* Team Health */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Health
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {briefing.teamHealth.map((team) => (
                  <div 
                    key={team.team}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleTeamExpanded(team.team)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          team.status === 'healthy' ? 'bg-emerald-500' :
                          team.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {team.team}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          ({team.headcount})
                        </span>
                      </div>
                      {expandedTeams.has(team.team) 
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />
                      }
                    </button>
                    
                    {expandedTeams.has(team.team) && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-slate-500 dark:text-slate-400">Capacity</div>
                            <div className={`font-semibold ${
                              team.capacity > 100 ? 'text-red-600 dark:text-red-400' :
                              team.capacity > 90 ? 'text-amber-600 dark:text-amber-400' :
                              'text-slate-900 dark:text-white'
                            }`}>
                              {team.capacity}%
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 dark:text-slate-400">Blockers</div>
                            <div className={`font-semibold ${
                              team.blockers > 2 ? 'text-red-600 dark:text-red-400' :
                              team.blockers > 0 ? 'text-amber-600 dark:text-amber-400' :
                              'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {team.blockers}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-slate-500 dark:text-slate-400">Velocity</div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {team.velocity}
                            </div>
                          </div>
                          {team.notes && (
                            <div className="col-span-2">
                              <div className="text-slate-500 dark:text-slate-400">Notes</div>
                              <div className="text-slate-700 dark:text-slate-300">
                                {team.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Summary */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5" />
              Summary
            </h2>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              {briefing.summary}
            </p>
          </section>
          
          {/* Quick Stats */}
          <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {briefing.topRisks.length}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300">Critical Risks</div>
              </div>
              <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {briefing.attentionNeeded.length}
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-300">Need Attention</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {briefing.onTrack.length}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300">On Track</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {briefing.teamHealth.length}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Teams</div>
              </div>
            </div>
          </section>
          
          {/* Feedback Button */}
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Provide Feedback
          </button>
        </div>
      </div>
      
      {/* Timestamp */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4" />
        Last updated: {new Date(briefing.generatedAt).toLocaleString()}
      </div>
      
      {/* Feedback Modal */}
      {showFeedback && (
        <BriefingFeedback 
          briefing={briefing} 
          onClose={() => setShowFeedback(false)} 
        />
      )}
    </div>
  );
}

