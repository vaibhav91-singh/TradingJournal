import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Loader2, Calendar, Maximize2, X } from 'lucide-react';
import API_BASE_URL from '../api/config';

export default function JournalFeed({ journals, onDelete, compact = false }) {
  if (journals.length === 0) {
    return (
      <div className="text-center py-16 text-textMuted border border-theme-border border-dashed rounded-2xl bg-surface/30 card-3d">
        <p className="text-lg">No journals found. Upload your first backtest screenshot!</p>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-5" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"}>
      {journals.map(journal => (
        <JournalCard key={journal.id} journal={journal} onDelete={onDelete} compact={compact} />
      ))}
    </div>
  );
}

function JournalCard({ journal, onDelete, compact }) {
  const [deleting, setDeleting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this journal?\nThis will permanently delete the image from your Google Drive as well.')) return;

    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/journals/${journal.id}`, { withCredentials: true });
      onDelete(journal.id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete journal');
      setDeleting(false);
    }
  };

  const imageUrl = `${API_BASE_URL}/api/journals/image/${journal.driveFileId}`;

  let rrText = '-';
  if (journal.entryPrice && journal.stopLoss && journal.target) {
    const risk = Math.abs(journal.entryPrice - journal.stopLoss);
    const reward = Math.abs(journal.target - journal.entryPrice);
    if (risk > 0) {
      rrText = `1:${(reward / risk).toFixed(2)}`;
    }
  }

  let durationText = '-';
  if (journal.entryTime && journal.exitTime) {
    const entryDate = new Date(journal.entryTime);
    const exitDate = new Date(journal.exitTime);
    const diffMs = exitDate - entryDate;
    if (diffMs > 0) {
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }
  }

  const getOutcomeColor = (outcome) => {
    if (outcome === 'Target Hit') return 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(126,224,129,0.3)]';
    if (outcome === 'SL Hit') return 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
    return 'bg-secondary/20 text-secondary border-secondary/50 shadow-[0_0_10px_rgba(47,201,184,0.3)]';
  };

  const renderModal = () => (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-y-auto flex justify-center animate-in fade-in duration-300 cursor-default">
      <button 
        onClick={() => setIsFullscreen(false)}
        className="fixed top-3 right-3 sm:top-6 sm:right-6 bg-surface border border-theme-border hover:bg-red-500/20 hover:border-red-500/50 text-white p-2.5 sm:p-3 rounded-full transition-all z-[60] shadow-[0_0_20px_rgba(47,201,184,0.2)] hover:scale-110"
        title="Close"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <div className="max-w-4xl w-full bg-surface border border-theme-border rounded-none sm:rounded-2xl shadow-[0_30px_60px_-15px_rgba(126,224,129,0.2)] overflow-hidden sm:my-auto sm:mx-4">
        <div className="bg-background border-b border-theme-border relative">
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-30"></div>
          <img 
            src={imageUrl} 
            alt="Backtest Screenshot" 
            crossOrigin="use-credentials"
            className="w-full h-auto max-h-[50vh] sm:max-h-[65vh] object-contain mx-auto relative z-10"
          />
        </div>
        
        <div className="p-4 sm:p-6 md:p-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-[80px] -z-10 rounded-full"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-md">{journal.title || 'Untitled Trade'}</h3>
              <div className="flex items-center gap-1.5 text-textMuted text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(journal.createdAt).toLocaleString()}</span>
              </div>
            </div>
            {journal.outcome && (
              <span className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border ${getOutcomeColor(journal.outcome)}`}>
                {journal.outcome}
              </span>
            )}
          </div>

          {(journal.entryPrice || journal.stopLoss || journal.target) && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-5 sm:mb-8 p-3 sm:p-6 bg-background rounded-xl border border-theme-border shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary via-primary to-accent opacity-50"></div>
              <div>
                <p className="text-[10px] sm:text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Entry</p>
                <p className="text-base sm:text-xl text-white font-black">{journal.entryPrice || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Exit</p>
                <p className="text-base sm:text-xl text-white font-black">{journal.exitPrice || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-textMuted uppercase font-bold tracking-wider mb-1">SL</p>
                <p className="text-base sm:text-xl text-white font-black">{journal.stopLoss || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Target</p>
                <p className="text-base sm:text-xl text-white font-black">{journal.target || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-primary uppercase font-bold tracking-wider mb-1">R:R</p>
                <p className="text-base sm:text-xl text-primary font-black drop-shadow-[0_0_8px_rgba(126,224,129,0.5)]">{rrText}</p>
              </div>
              {durationText !== '-' && (
                <div className="col-span-3 sm:col-span-5 border-t border-theme-border pt-3 mt-1">
                  <p className="text-[10px] sm:text-xs text-textMuted uppercase font-bold tracking-wider mb-1">Duration</p>
                  <p className="text-sm sm:text-lg text-white font-medium">{durationText}</p>
                </div>
              )}
            </div>
          )}

          {journal.text && (
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-secondary uppercase tracking-wider mb-2 sm:mb-3">Trade Notes &amp; Revision</h4>
              <div className="p-3 sm:p-5 bg-background/50 rounded-xl border border-theme-border shadow-inner">
                <p className="text-white text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{journal.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="bg-surface rounded-xl overflow-hidden group/card card-3d">
        <div className="glare"></div>
        {/* Compact Card View (For Revise Tab) */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-xl font-bold text-white drop-shadow-md">{journal.title || 'Untitled Trade'}</h4>
              {journal.outcome && (
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getOutcomeColor(journal.outcome)}`}>
                  {journal.outcome}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-textMuted text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(journal.createdAt).toLocaleString()}</span>
              </div>
              {(journal.entryPrice || journal.quantity) && (
                <div className="hidden md:flex items-center gap-2 border-l border-theme-border pl-4">
                  {journal.quantity && <span>Qty: {journal.quantity}</span>}
                  {journal.entryPrice && <span>Entry: {journal.entryPrice}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-theme-border md:border-t-0 pt-4 md:pt-0">
            <button 
              onClick={() => setIsFullscreen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-semibold shadow-[0_0_15px_rgba(126,224,129,0.1)] btn-3d"
            >
              <Maximize2 className="w-4 h-4" />
              Show Details
            </button>
            
            <button 
              onClick={handleDelete}
              disabled={deleting}
              className="text-textMuted hover:text-red-400 p-2 bg-background border border-theme-border rounded-lg disabled:opacity-50 btn-3d"
              title="Delete Journal"
            >
              {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isFullscreen && renderModal()}
      </div>
    );
  }

  // DEFAULT (Expanded) Card View - Grid Style
  return (
    <div className="bg-surface rounded-xl overflow-hidden group/card flex flex-col card-3d">
      <div className="glare z-20"></div>
      
      {/* Top Section: Small Image Thumbnail */}
      <div 
        onClick={() => setIsFullscreen(true)}
        className="relative h-56 bg-background border-b border-theme-border overflow-hidden cursor-zoom-in group/image"
      >
        <img 
          src={imageUrl} 
          alt="Backtest Screenshot Thumbnail" 
          crossOrigin="use-credentials"
          className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-[1.08] opacity-80 group-hover/image:opacity-100"
          loading="lazy"
        />
        
        {/* Hover Expand Overlay */}
        <div className="absolute inset-0 bg-background/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none z-10 backdrop-blur-[2px]">
          <div className="bg-surface border border-theme-border text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(47,201,184,0.4)] flex items-center gap-2 transform translate-y-6 group-hover/image:translate-y-0 transition-all duration-500 ease-out">
            <Maximize2 className="w-4 h-4 text-secondary" />
            <span className="text-sm font-bold tracking-wide">Expand</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Trade Details */}
      <div className="p-5 flex flex-col flex-grow relative z-10">
        
        {/* Header Row */}
        <div className="flex justify-between items-start mb-6">
          <div className="pr-2">
            <h4 className="text-xl font-bold text-white mb-1 line-clamp-1 drop-shadow-md">{journal.title || 'Untitled Trade'}</h4>
            <div className="flex items-center gap-1.5 text-textMuted text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(journal.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            {journal.outcome && (
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getOutcomeColor(journal.outcome)}`}>
                {journal.outcome}
              </span>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-auto flex gap-3">
          <button 
            onClick={() => setIsFullscreen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(126,224,129,0.1)] hover:bg-primary hover:text-background hover:shadow-[0_0_20px_rgba(126,224,129,0.5)] transition-all btn-3d"
          >
            Show Details
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="text-textMuted hover:text-red-400 p-2 bg-background border border-theme-border rounded-lg disabled:opacity-50 btn-3d"
            title="Delete Journal"
          >
            {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isFullscreen && renderModal()}
    </div>
  );
}
