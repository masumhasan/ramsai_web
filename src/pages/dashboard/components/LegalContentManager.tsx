import React, { useState, useEffect } from 'react';
import { fetchLegalContent, updateLegalContent, type LegalContentItem } from '../../../lib/api';
import { RichTextEditor } from './RichTextEditor';
import { ShieldCheck, FileText, Save, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface LegalContentManagerProps {
  type: 'privacy' | 'terms';
}

export const LegalContentManager: React.FC<LegalContentManagerProps> = ({ type }) => {
  const isPrivacy = type === 'privacy';
  const pageTitle = isPrivacy ? 'Privacy Policy Manager' : 'Terms Manager';
  const pageSubtitle = isPrivacy 
    ? 'Manage your dynamic user Privacy Policy content shown on /privacy' 
    : 'Manage your dynamic Terms of Service content shown on /terms';

  const [title, setTitle] = useState(isPrivacy ? 'Privacy Policy' : 'Terms of Service');
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [type]);

  const loadContent = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data: LegalContentItem = await fetchLegalContent(type);
      setTitle(data.title || (isPrivacy ? 'Privacy Policy' : 'Terms of Service'));
      setContent(data.content || '');
      setLastUpdated(data.updatedAt ? new Date(data.updatedAt).toLocaleString() : null);
    } catch (err: any) {
      console.error('Failed to load legal content:', err);
      setErrorMsg(err.message || 'Failed to fetch content from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setErrorMsg('Content cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await updateLegalContent(type, { title, content });
      setSuccessMsg(res.message || 'Updated successfully!');
      setLastUpdated(new Date().toLocaleString());
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to update legal content:', err);
      setErrorMsg(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm font-medium">Loading {pageTitle} content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border shadow-lg ${
            isPrivacy 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10' 
              : 'bg-teal-500/10 text-teal-400 border-teal-500/30 shadow-teal-500/10'
          }`}>
            {isPrivacy ? <ShieldCheck className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{pageTitle}</h1>
            <p className="text-sm text-slate-400 mt-1">{pageSubtitle}</p>
            {lastUpdated && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {lastUpdated}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadContent}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-all text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reload
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Document
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Document Title Editor */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 shadow-xl space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Document Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Privacy Policy"
          className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder-slate-500 text-base font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      {/* Rich Text Editor */}
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder={isPrivacy ? 'Enter Privacy Policy document content here...' : 'Enter Terms of Service document content here...'}
      />
    </div>
  );
};
