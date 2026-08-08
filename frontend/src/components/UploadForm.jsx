import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, X, Calendar as CalIcon } from 'lucide-react';
import API_BASE_URL from '../api/config';

export default function UploadForm({ onUploadSuccess }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [target, setTarget] = useState('');
  const [outcome, setOutcome] = useState('Manual');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-calculate RR Preview
  let rrText = '-';
  if (entryPrice && stopLoss && target) {
    const risk = Math.abs(parseFloat(entryPrice) - parseFloat(stopLoss));
    const reward = Math.abs(parseFloat(target) - parseFloat(entryPrice));
    if (risk > 0) {
      rrText = `1:${(reward / risk).toFixed(2)}`;
    }
  }

  // Auto-calculate Duration Preview
  let durationText = '-';
  if (entryTime && exitTime) {
    const entryDate = new Date(entryTime);
    const exitDate = new Date(exitTime);
    const diffMs = exitDate - entryDate;
    if (diffMs > 0) {
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }
  }

  // Auto-calculate Points Preview
  let pointsText = '-';
  let pnlText = null;
  if (entryPrice && exitPrice) {
    const points = parseFloat(exitPrice) - parseFloat(entryPrice);
    pointsText = points > 0 ? `+${points.toFixed(2)}` : points.toFixed(2);
    
    if (quantity) {
      const pnl = points * parseFloat(quantity);
      pnlText = pnl > 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select a backtest screenshot to upload.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('quantity', quantity);
    formData.append('entryPrice', entryPrice);
    formData.append('exitPrice', exitPrice);
    formData.append('stopLoss', stopLoss);
    formData.append('target', target);
    formData.append('outcome', outcome);
    formData.append('entryTime', entryTime);
    formData.append('exitTime', exitTime);
    formData.append('text', text);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/journals/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      onUploadSuccess(response.data);
      clearImage();
      setTitle('');
      setQuantity('');
      setEntryPrice('');
      setExitPrice('');
      setStopLoss('');
      setTarget('');
      setOutcome('Manual');
      setEntryTime('');
      setExitTime('');
      setText('');
      setShowResult(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to upload journal.');
    } finally {
      setLoading(false);
    }
  };

  // Base input classes for 3D smooth styling
  const input3DClasses = "w-full bg-background border border-theme-border rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none transition-all duration-300 shadow-inner hover:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:shadow-[0_0_15px_rgba(126,224,129,0.3),inset_0_2px_5px_rgba(0,0,0,0.5)]";

  return (
    <div className="bg-surface/90 backdrop-blur-md border border-theme-border rounded-2xl p-6 md:p-8 mb-8 card-3d overflow-hidden">
      <div className="glare z-0"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">Log New Trade / Backtest</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-in fade-in">
              {error}
            </div>
          )}

          {/* Image Upload Area */}
          <div className="relative group/upload">
            {!preview ? (
              <div 
                className="border-2 border-dashed border-theme-border rounded-xl p-10 text-center cursor-pointer transition-all duration-500 hover:border-primary bg-background/50 hover:bg-background/80 hover:shadow-[0_0_20px_rgba(126,224,129,0.15)] group-hover/upload:-translate-y-1 transform-gpu"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-12 h-12 text-primary mx-auto mb-4 opacity-70 group-hover/upload:opacity-100 group-hover/upload:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(126,224,129,0.3)]" />
                <p className="text-white font-medium">Click to upload a screenshot</p>
                <p className="text-xs text-textMuted mt-2">PNG, JPG, WEBP</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-theme-border bg-background shadow-lg shadow-black/40 group">
                <img src={preview} alt="Preview" className="w-full h-auto max-h-72 object-contain transition-transform duration-700 group-hover:scale-[1.02]" />
                <button 
                  type="button"
                  onClick={clearImage}
                  className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur hover:bg-red-500 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-theme-border hover:border-red-500 hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>

          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Trade Heading (e.g. BTC/USD Long Setup)"
              className="w-full bg-background border border-theme-border rounded-xl p-4 text-white text-lg font-medium placeholder-textMuted/50 focus:outline-none focus:border-primary transition-all duration-300 shadow-inner focus:shadow-[0_0_20px_rgba(126,224,129,0.2),inset_0_2px_5px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Trade Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 p-4 sm:p-5 bg-background/40 rounded-xl border border-theme-border shadow-[inset_0_2px_15px_rgba(0,0,0,0.3)] relative">
            
            <div>
              <label className="block text-xs text-secondary mb-1.5 uppercase font-bold tracking-wider drop-shadow-sm">Quantity</label>
              <input type="number" step="any" value={quantity} onChange={e => setQuantity(e.target.value)} className={input3DClasses} placeholder="1" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1.5 uppercase font-bold tracking-wider drop-shadow-sm">Entry Price</label>
              <input type="number" step="any" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} className={input3DClasses} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1.5 uppercase font-bold tracking-wider drop-shadow-sm">Exit Price</label>
              <input type="number" step="any" value={exitPrice} onChange={e => setExitPrice(e.target.value)} className={input3DClasses} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1.5 uppercase font-bold tracking-wider drop-shadow-sm">Stop Loss</label>
              <input type="number" step="any" value={stopLoss} onChange={e => setStopLoss(e.target.value)} className={input3DClasses} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1.5 uppercase font-bold tracking-wider drop-shadow-sm">Target</label>
              <input type="number" step="any" value={target} onChange={e => setTarget(e.target.value)} className={input3DClasses} placeholder="0.00" />
            </div>

            {/* Smooth 3D Datetime Inputs */}
            <div className="md:col-span-2 group/time">
              <label className="block text-xs text-secondary mb-1.5 uppercase font-bold tracking-wider drop-shadow-sm">Entry Time</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  value={entryTime} 
                  onChange={e => setEntryTime(e.target.value)} 
                  style={{ colorScheme: 'dark' }}
                  className={`${input3DClasses} pr-10`} 
                />
                <CalIcon className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover/time:opacity-100 transition-opacity drop-shadow-[0_0_5px_rgba(126,224,129,0.5)]" />
              </div>
            </div>
            <div className="md:col-span-2 group/time">
              <label className="block text-xs text-secondary mb-1.5 uppercase font-bold tracking-wider drop-shadow-sm">Exit Time</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  value={exitTime} 
                  onChange={e => setExitTime(e.target.value)} 
                  style={{ colorScheme: 'dark' }}
                  className={`${input3DClasses} pr-10`} 
                />
                <CalIcon className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover/time:opacity-100 transition-opacity drop-shadow-[0_0_5px_rgba(126,224,129,0.5)]" />
              </div>
            </div>

            <div className="md:col-span-5 mt-3">
              <button 
                type="button" 
                onClick={() => setShowResult(true)}
                className="w-full bg-surface border border-theme-border hover:border-primary/50 text-white font-bold py-3 rounded-lg transition-all shadow-[0_5px_15px_-5px_rgba(0,0,0,0.5)] btn-3d flex items-center justify-center gap-2"
              >
                Show Results Preview
              </button>
            </div>

            {/* Live Preview Box */}
            {showResult && (
              <div className="md:col-span-5 mt-2 flex flex-wrap gap-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex-1 min-w-[120px] bg-background border border-theme-border rounded-xl p-4 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]">
                  <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-2">Points</p>
                  <p className={`text-2xl font-black drop-shadow-sm ${pointsText.startsWith('+') ? 'text-primary' : pointsText !== '-' && parseFloat(pointsText) < 0 ? 'text-red-400' : 'text-white'}`}>{pointsText}</p>
                </div>
                {pnlText && (
                  <div className="flex-1 min-w-[120px] bg-primary/10 border border-primary/30 rounded-xl p-4 text-center shadow-[inset_0_2px_15px_rgba(126,224,129,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary blur-[2px]"></div>
                    <p className="text-xs text-primary uppercase font-bold tracking-wider mb-2 drop-shadow-sm">Total PnL</p>
                    <p className={`text-2xl font-black drop-shadow-md ${pnlText.startsWith('+') ? 'text-primary' : pnlText !== '-' && parseFloat(pnlText) < 0 ? 'text-red-400' : 'text-white'}`}>{pnlText}</p>
                  </div>
                )}
                <div className="flex-1 min-w-[120px] bg-background border border-theme-border rounded-xl p-4 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]">
                  <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-2">R:R</p>
                  <p className="text-2xl text-secondary font-black drop-shadow-[0_0_5px_rgba(47,201,184,0.3)]">{rrText}</p>
                </div>
                <div className="flex-1 min-w-[120px] bg-background border border-theme-border rounded-xl p-4 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]">
                  <p className="text-xs text-textMuted uppercase font-bold tracking-wider mb-2">Duration</p>
                  <p className="text-2xl text-secondary font-black drop-shadow-[0_0_5px_rgba(47,201,184,0.3)]">{durationText}</p>
                </div>
              </div>
            )}

            <div className="md:col-span-5 mt-4">
              <label className="block text-xs text-secondary mb-3 uppercase font-bold tracking-wider drop-shadow-sm">Trade Outcome</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-300 btn-3d ${outcome === 'Target Hit' ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(126,224,129,0.3)]' : 'bg-background border-theme-border text-textMuted hover:border-primary/50'}`}>
                  <input type="radio" name="outcome" value="Target Hit" checked={outcome === 'Target Hit'} onChange={e => setOutcome(e.target.value)} className="hidden" />
                  <span className="font-bold text-sm">✓ Target Hit</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-300 btn-3d ${outcome === 'SL Hit' ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-background border-theme-border text-textMuted hover:border-red-500/50'}`}>
                  <input type="radio" name="outcome" value="SL Hit" checked={outcome === 'SL Hit'} onChange={e => setOutcome(e.target.value)} className="hidden" />
                  <span className="font-bold text-sm">✗ SL Hit</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-300 btn-3d ${outcome === 'Manual' ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(47,201,184,0.3)]' : 'bg-background border-theme-border text-textMuted hover:border-secondary/50'}`}>
                  <input type="radio" name="outcome" value="Manual" checked={outcome === 'Manual'} onChange={e => setOutcome(e.target.value)} className="hidden" />
                  <span className="font-bold text-sm">↩ Manual</span>
                </label>
              </div>
            </div>
          </div>

          {/* Text Area */}
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your thoughts, strategy, or backtesting results here..."
              className="w-full bg-background border border-theme-border rounded-xl p-5 text-white placeholder-textMuted/50 focus:outline-none focus:border-primary transition-all duration-300 shadow-inner focus:shadow-[0_0_20px_rgba(126,224,129,0.2),inset_0_2px_5px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] min-h-[150px] resize-y"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center sm:justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-background font-black py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_10px_25px_-5px_rgba(126,224,129,0.5)] hover:shadow-[0_15px_35px_-5px_rgba(126,224,129,0.6)] btn-3d disabled:opacity-50 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Save to Journal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
