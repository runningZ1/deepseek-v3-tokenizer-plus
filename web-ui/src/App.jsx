import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, FolderOpen, Sparkles, Github, Moon, Sun } from 'lucide-react';
import TokenPlayground from './components/TokenPlayground';
import DirectoryScanner from './components/DirectoryScanner';

function App() {
  const [activeTab, setActiveTab] = useState('playground');
  const [isDark, setIsDark] = useState(() => {
    // 从 localStorage 读取主题偏好
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // 切换深色模式
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern Floating Header - Enhanced */}
      <header className="sticky top-4 sm:top-6 z-50 px-3 sm:px-6 lg:px-8 mb-8 sm:mb-12 animate-slide-down">
        <div className="max-w-5xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-3 sm:py-4
          flex items-center justify-between gap-4 shadow-2xl transition-all duration-300">

          {/* Logo & Title */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-shrink">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600
                rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse-subtle"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-violet-600
                rounded-xl flex items-center justify-center text-white shadow-lg
                transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Sparkles size={20} className="text-white/90 sm:w-6 sm:h-6 animate-float" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">
                DeepSeek <span className="text-gradient">Tokenizer</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide hidden sm:block">
                V3 Model Analysis
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden sm:flex bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-xl gap-1
            shadow-inner backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('playground')}
              className={`tab-btn ${activeTab === 'playground' ? 'active' : ''}`}
            >
              <FileText size={18} />
              <span className="hidden lg:inline">Playground</span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
            >
              <FolderOpen size={18} />
              <span className="hidden lg:inline">Directory</span>
            </button>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 dark:bg-slate-800
              hover:bg-slate-200 dark:hover:bg-slate-700
              border border-slate-200 dark:border-slate-700
              shadow-sm hover:shadow-md transition-all duration-300
              flex items-center justify-center group flex-shrink-0"
            aria-label="Toggle theme"
          >
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <Sun
                size={20}
                className={`absolute inset-0 text-amber-500 transition-all duration-300
                  ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
              />
              <Moon
                size={20}
                className={`absolute inset-0 text-indigo-400 transition-all duration-300
                  ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden max-w-5xl mx-auto mt-4">
          <nav className="glass-panel rounded-xl p-1.5 flex gap-1 shadow-lg">
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex-1 tab-btn ${activeTab === 'playground' ? 'active' : ''}`}
            >
              <FileText size={18} />
              <span>Playground</span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex-1 tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
            >
              <FolderOpen size={18} />
              <span>Directory</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content - Enhanced */}
      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pb-8 sm:pb-12 w-full">
        <div className="animate-scale-in" key={activeTab}>
          {activeTab === 'playground' ? <TokenPlayground /> : <DirectoryScanner />}
        </div>
      </main>

      {/* Footer - Enhanced */}
      <footer className="py-6 sm:py-8 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap px-4">
          <Sparkles size={14} className="text-indigo-400 dark:text-indigo-500 animate-pulse-subtle" />
          <span className="font-medium text-slate-500 dark:text-slate-400">
            Powered by DeepSeek V3
          </span>
        </div>
        <p className="opacity-60 px-4">Designed for modern LLM development</p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400
              transition-colors duration-200 flex items-center gap-1.5"
          >
            <Github size={16} />
            <span className="text-xs">GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
