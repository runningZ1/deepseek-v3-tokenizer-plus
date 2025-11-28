import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, RefreshCw, Copy, Check, Type, AlignLeft, Hash, Zap, DollarSign, AlertCircle, Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function TokenPlayground() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({ token_count: 0, char_count: 0 });
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (text) {
                tokenizeText(text);
            } else {
                setStats({ token_count: 0, char_count: 0 });
                setError(null);
            }
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [text]);

    const tokenizeText = async (inputText) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(`${API_URL}/tokenize/text`, { text: inputText });
            setStats(response.data);
        } catch (error) {
            console.error('Error tokenizing text:', error);
            setError('Failed to tokenize. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText('');
        setError(null);
    };

    // Cost estimation (approximate)
    const costDeepSeek = (stats.token_count / 1000000) * 0.14; // Input price per 1M tokens (approx)
    const costGPT4o = (stats.token_count / 1000000) * 5.00;
    const savings = ((costGPT4o - costDeepSeek) / costGPT4o * 100).toFixed(1);

    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Input Area */}
            <div className="lg:col-span-2 space-y-4">
                <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[500px] sm:h-[600px]
                  transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10
                  border-subtle animate-scale-in">

                    {/* Header */}
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100/50 dark:border-slate-800/50
                      bg-slate-50/30 dark:bg-slate-900/30 flex justify-between items-center backdrop-blur-sm">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm
                          border-subtle text-indigo-600 dark:text-indigo-400">
                          <Type size={16} />
                        </div>
                        <h2 className="font-semibold text-slate-700 dark:text-slate-200 tracking-tight text-sm sm:text-base">
                          Input Text
                        </h2>
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={handleClear}
                          className="p-2 text-slate-400 dark:text-slate-500
                            hover:text-red-500 dark:hover:text-red-400
                            hover:bg-red-50 dark:hover:bg-red-950/30
                            rounded-lg transition-all duration-200 active:scale-95"
                          title="Clear"
                        >
                          <RefreshCw size={18} />
                        </button>
                        <button
                          onClick={copyToClipboard}
                          disabled={!text}
                          className="p-2 text-slate-400 dark:text-slate-500
                            hover:text-indigo-500 dark:hover:text-indigo-400
                            hover:bg-indigo-50 dark:hover:bg-indigo-950/30
                            rounded-lg transition-all duration-200 active:scale-95
                            disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Copy"
                        >
                          {copied ? (
                            <Check size={18} className="text-emerald-500 dark:text-emerald-400" />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Textarea */}
                    <div className="flex-1 relative group bg-white/40 dark:bg-slate-900/40">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste text here to count tokens..."
                        className="w-full h-full p-4 sm:p-6 resize-none bg-transparent
                          focus:outline-none text-slate-700 dark:text-slate-200
                          font-mono text-xs sm:text-sm leading-relaxed
                          placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        spellCheck="false"
                      />
                      {text.length === 0 && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center
                          text-slate-300 dark:text-slate-700 animate-fade-in">
                          <div className="text-center px-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 dark:bg-slate-800/50
                              rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4
                              border-subtle shadow-sm">
                              <Type size={24} className="opacity-50 sm:w-8 sm:h-8" />
                            </div>
                            <p className="font-medium text-sm sm:text-base">Start typing to analyze tokens</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100/50 dark:border-slate-800/50
                      bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400
                      flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 font-medium">
                      <div className="flex gap-4 sm:gap-6">
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          <AlignLeft size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                          <span className="truncate">{text.length.toLocaleString()} chars</span>
                        </span>
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          <Hash size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                          <span className="truncate">{wordCount.toLocaleString()} words</span>
                        </span>
                      </div>
                      <div>
                        {loading ? (
                          <span className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 animate-pulse">
                            <RefreshCw size={12} className="animate-spin" />
                            Calculating...
                          </span>
                        ) : error ? (
                          <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
                            <AlertCircle size={12} />
                            Error
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500"></div>
                            Ready
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="glass-card rounded-xl p-4 border border-red-200 dark:border-red-900/50
                      bg-red-50/50 dark:bg-red-950/20 animate-slide-down">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-900 dark:text-red-200 text-sm mb-1">
                            Connection Error
                          </h4>
                          <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
            </div>

            {/* Stats Area */}
            <div className="space-y-4 sm:space-y-6">
                {/* Main Counter */}
                <div className="stat-card rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden
                  group border border-indigo-100/50 dark:border-indigo-900/50 animate-scale-in
                  bg-gradient-to-br from-indigo-50/50 to-violet-50/50
                  dark:from-indigo-950/20 dark:to-violet-950/20">

                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10
                    group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500">
                    <Sparkles size={120} className="text-indigo-600 dark:text-indigo-400
                      transform rotate-12 translate-x-8 -translate-y-8" />
                  </div>

                  <h3 className="text-xs font-bold text-indigo-500 dark:text-indigo-400
                    uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                    <Zap size={14} />
                    Total Tokens
                  </h3>

                  <div className="flex items-center justify-center gap-1 mb-3 relative z-10">
                    <span className={`text-5xl sm:text-7xl font-extrabold text-gradient tracking-tighter
                      filter drop-shadow-sm transition-all duration-300
                      ${loading ? 'animate-pulse' : ''}`}>
                      {stats.token_count.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium
                    flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse-subtle"></span>
                    DeepSeek V3 Model
                  </p>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="stat-card rounded-xl p-4 sm:p-5 border-subtle animate-scale-in"
                    style={{ animationDelay: '0.1s' }}>
                    <div className="text-xs text-slate-500 dark:text-slate-400
                      font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlignLeft size={12} />
                      Characters
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-200">
                      {stats.char_count.toLocaleString()}
                    </div>
                  </div>

                  <div className="stat-card rounded-xl p-4 sm:p-5 border-subtle animate-scale-in"
                    style={{ animationDelay: '0.2s' }}>
                    <div className="text-xs text-slate-500 dark:text-slate-400
                      font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Hash size={12} />
                      Words
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-200">
                      {wordCount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Cost Estimation */}
                <div className="glass-panel rounded-2xl p-4 sm:p-6 border-subtle animate-scale-in"
                  style={{ animationDelay: '0.3s' }}>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 bg-violet-50 dark:bg-violet-950/30 rounded-lg
                      text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50">
                      <Calculator size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Cost Comparison
                    </h3>
                  </div>

                  {/* Cost Cards */}
                  <div className="space-y-3">
                    {/* DeepSeek V3 */}
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-indigo-50/80 to-violet-50/80
                      dark:from-indigo-950/40 dark:to-violet-950/40
                      rounded-xl border border-indigo-100 dark:border-indigo-900/50
                      transition-all hover:scale-[1.02] duration-200 shadow-sm
                      hover:shadow-md hover:shadow-indigo-500/10">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-indigo-900 dark:text-indigo-200 text-sm flex items-center gap-1.5">
                            <Sparkles size={14} />
                            DeepSeek V3
                          </div>
                          <div className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70
                            font-medium uppercase tracking-wide mt-0.5">
                            $0.14 / 1M tokens
                          </div>
                        </div>
                        <div className="font-bold text-indigo-700 dark:text-indigo-300 text-base sm:text-lg
                          flex items-center gap-0.5">
                          <DollarSign size={14} strokeWidth={3} />
                          {costDeepSeek.toFixed(6)}
                        </div>
                      </div>
                    </div>

                    {/* GPT-4o */}
                    <div className="p-3 sm:p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl
                      border-subtle grayscale opacity-60
                      hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">GPT-4o</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400
                            font-medium uppercase tracking-wide mt-0.5">
                            $5.00 / 1M tokens
                          </div>
                        </div>
                        <div className="font-bold text-slate-700 dark:text-slate-300 text-base sm:text-lg
                          flex items-center gap-0.5">
                          <DollarSign size={14} strokeWidth={3} />
                          {costGPT4o.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Savings Badge */}
                  {stats.token_count > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30
                      border border-emerald-200 dark:border-emerald-900/50 text-center">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400
                        font-medium uppercase tracking-wide mb-1">
                        You Save
                      </div>
                      <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                        {savings}%
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="mt-4 text-[10px] text-slate-400 dark:text-slate-500
                    text-center leading-relaxed px-2">
                    * Estimates based on standard input pricing. Actual costs may vary.
                  </div>
                </div>
            </div>
        </div>
    );
}
