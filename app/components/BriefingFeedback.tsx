"use client";

import React, { useState } from 'react';
import { X, Star, ThumbsUp, ThumbsDown, Send, Check } from 'lucide-react';
import { ExecutiveBriefingOutput } from '@/app/lib/briefingPrompt';

interface BriefingFeedbackProps {
  briefing: ExecutiveBriefingOutput;
  onClose: () => void;
}

interface FeedbackData {
  accuracyRating: number;
  useful: boolean | null;
  wouldSendToCEO: boolean | null;
  inaccuracyReport: string;
  improvements: string;
  timestamp: string;
  briefingId: string;
}

export default function BriefingFeedback({ briefing, onClose }: BriefingFeedbackProps) {
  const [accuracyRating, setAccuracyRating] = useState<number>(0);
  const [useful, setUseful] = useState<boolean | null>(null);
  const [wouldSendToCEO, setWouldSendToCEO] = useState<boolean | null>(null);
  const [inaccuracyReport, setInaccuracyReport] = useState('');
  const [improvements, setImprovements] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const handleSubmit = () => {
    const feedback: FeedbackData = {
      accuracyRating,
      useful,
      wouldSendToCEO,
      inaccuracyReport,
      improvements,
      timestamp: new Date().toISOString(),
      briefingId: briefing.generatedAt,
    };
    
    // Store in localStorage for prototype
    const existingFeedback = JSON.parse(localStorage.getItem('briefingFeedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('briefingFeedback', JSON.stringify(existingFeedback));
    
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };
  
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Thank You!
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your feedback helps us improve the executive briefing feature.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Briefing Feedback
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Accuracy Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              How accurately does this briefing represent the current status?
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  onClick={() => setAccuracyRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoveredStar || accuracyRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-slate-600 dark:text-slate-400 min-w-[3ch]">
                {accuracyRating > 0 ? `${accuracyRating}/10` : ''}
              </span>
            </div>
          </div>
          
          {/* Usefulness */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Would you use this instead of manual reporting?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setUseful(true)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  useful === true
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                Yes
              </button>
              <button
                onClick={() => setUseful(false)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  useful === false
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                No
              </button>
            </div>
          </div>
          
          {/* Send to CEO */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Would you feel comfortable sending this to your CEO as-is?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setWouldSendToCEO(true)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  wouldSendToCEO === true
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                Yes
              </button>
              <button
                onClick={() => setWouldSendToCEO(false)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  wouldSendToCEO === false
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                No
              </button>
            </div>
          </div>
          
          {/* Inaccuracy Report */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Report any inaccuracies (optional)
            </label>
            <textarea
              value={inaccuracyReport}
              onChange={(e) => setInaccuracyReport(e.target.value)}
              placeholder="Describe any information that seems incorrect or misleading..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
          
          {/* Improvements */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              What would make this more useful? (optional)
            </label>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="Suggest improvements or missing information..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={accuracyRating === 0}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}


