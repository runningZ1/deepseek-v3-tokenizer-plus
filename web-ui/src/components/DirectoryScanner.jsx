import React, { useState } from 'react';
import axios from 'axios';
import { FolderSearch, FileText, BarChart3, AlertCircle, Search, FolderOpen, HardDrive, FileCode, Loader2, TrendingUp } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const API_URL = 'http://localhost:8000';

export default function DirectoryScanner() {
    const [path, setPath] = useState('./examples');
    const [recursive, setRecursive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const handleScan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/tokenize/directory`, {
                path,
                recursive,
                pattern: "*.*"
            });
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to scan directory. Please check the path.');
        } finally {
            setLoading(false);
        }
    };

    // Prepare chart data with dark mode support
    const isDark = document.documentElement.classList.contains('dark');

    const chartData = data ? {
        labels: data.files
            .sort((a, b) => b.tokens - a.tokens)
            .slice(0, 10)
            .map(f => f.name.length > 20 ? f.name.substring(0, 20) + '...' : f.name),
        datasets: [
            {
                label: 'Token Count',
                data: data.files
                    .sort((a, b) => b.tokens - a.tokens)
                    .slice(0, 10)
                    .map(f => f.tokens),
                backgroundColor: isDark ? 'rgba(129, 140, 248, 0.6)' : 'rgba(99, 102, 241, 0.6)',
                borderColor: isDark ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)',
                borderWidth: 0,
                borderRadius: 8,
                hoverBackgroundColor: isDark ? 'rgba(165, 180, 252, 0.8)' : 'rgba(139, 92, 246, 0.8)',
            },
        ],
    } : null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDark ? '#e2e8f0' : '#1e293b',
                bodyColor: isDark ? '#cbd5e1' : '#475569',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
                usePointStyle: true,
                titleFont: { family: 'Inter', size: 13, weight: '600' },
                bodyFont: { family: 'Inter', size: 12 },
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.6)',
                    drawBorder: false,
                },
                ticks: {
                    font: { family: 'Inter', size: 11 },
                    color: isDark ? '#94a3b8' : '#64748b'
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { family: 'Inter', size: 11 },
                    color: isDark ? '#94a3b8' : '#64748b'
                }
            }
        }
    };

    // Format file size
    const formatSize = (sizeKb) => {
        if (sizeKb < 1024) return `${sizeKb.toFixed(2)} KB`;
        return `${(sizeKb / 1024).toFixed(2)} MB`;
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Search Bar - Enhanced */}
            <div className="glass-panel rounded-2xl p-4 sm:p-8 transition-all duration-300
              hover:shadow-xl hover:shadow-indigo-500/10 border-subtle animate-scale-in">
                <form onSubmit={handleScan} className="flex flex-col gap-4 sm:gap-6">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300
                          mb-2 ml-1 flex items-center gap-2">
                          <FolderSearch size={16} />
                          Directory Path
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                className="input-field pl-12"
                                placeholder="/path/to/your/project"
                            />
                            <FolderSearch
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400
                                dark:text-slate-500 group-focus-within:text-indigo-500
                                dark:group-focus-within:text-indigo-400 transition-colors"
                              size={20}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-end">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            id="recursive"
                            checked={recursive}
                            onChange={(e) => setRecursive(e.target.checked)}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md
                              border border-slate-300 dark:border-slate-600
                              transition-all checked:border-indigo-500 checked:bg-indigo-500
                              hover:border-indigo-400 dark:hover:border-indigo-500"
                          />
                          <div className="pointer-events-none absolute left-1/2 top-1/2
                            -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <label htmlFor="recursive"
                          className="text-sm font-medium text-slate-600 dark:text-slate-400
                            cursor-pointer select-none">
                          Recursive Scan
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full sm:w-auto sm:min-w-[140px] h-[54px]"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Scanning...</span>
                          </>
                        ) : (
                          <>
                            <Search size={20} />
                            <span>Scan Directory</span>
                          </>
                        )}
                      </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-50/50 dark:bg-red-950/30 border border-red-200
                      dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl
                      flex items-start gap-3 text-sm animate-slide-down">
                        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold mb-1">Scan Failed</div>
                          <div className="text-xs opacity-90">{error}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data && !loading && (
                <div className="space-y-6 sm:space-y-8 animate-scale-in">
                    {/* Stats Cards - Enhanced */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="stat-card rounded-xl p-4 sm:p-6 flex items-center gap-4
                          animate-scale-in border border-indigo-100/50 dark:border-indigo-900/50"
                          style={{ animationDelay: '0.05s' }}>
                            <div className="p-2.5 sm:p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl
                              text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500
                                  uppercase tracking-wider mb-1">
                                  Total Tokens
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {data.total_tokens.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="stat-card rounded-xl p-4 sm:p-6 flex items-center gap-4
                          animate-scale-in border border-violet-100/50 dark:border-violet-900/50"
                          style={{ animationDelay: '0.1s' }}>
                            <div className="p-2.5 sm:p-3 bg-violet-50 dark:bg-violet-950/30 rounded-xl
                              text-violet-600 dark:text-violet-400 flex-shrink-0">
                                <FileText size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500
                                  uppercase tracking-wider mb-1">
                                  Total Files
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {data.total_files.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="stat-card rounded-xl p-4 sm:p-6 flex items-center gap-4
                          animate-scale-in border border-blue-100/50 dark:border-blue-900/50
                          sm:col-span-2 lg:col-span-1"
                          style={{ animationDelay: '0.15s' }}>
                            <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl
                              text-blue-600 dark:text-blue-400 flex-shrink-0">
                                <HardDrive size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500
                                  uppercase tracking-wider mb-1">
                                  Total Size
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {formatSize(data.total_size_kb)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart - Enhanced */}
                    <div className="glass-panel rounded-2xl p-4 sm:p-8 border-subtle animate-scale-in"
                      style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <BarChart3 size={20} className="text-indigo-500 dark:text-indigo-400" />
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm sm:text-base">
                              Top 10 Files by Token Count
                            </h3>
                        </div>
                        <div className="h-[250px] sm:h-[300px] w-full">
                            <Bar options={options} data={chartData} />
                        </div>
                    </div>

                    {/* File List - Enhanced */}
                    <div className="glass-panel rounded-2xl overflow-hidden border-subtle animate-scale-in"
                      style={{ animationDelay: '0.25s' }}>
                        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100/50
                          dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200
                              flex items-center gap-2 text-sm sm:text-base">
                                <FileCode size={20} className="text-slate-400 dark:text-slate-500" />
                                File Details ({data.files.length} files)
                            </h3>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden divide-y divide-slate-100/50 dark:divide-slate-800/50">
                          {data.files.sort((a, b) => b.tokens - a.tokens).map((file, index) => (
                            <div key={index}
                              className="p-4 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20
                                transition-colors">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500
                                  dark:text-slate-400 rounded-lg flex-shrink-0">
                                  <FileText size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-slate-700 dark:text-slate-300
                                    text-sm truncate" title={file.path}>
                                    {file.name}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                  <div className="text-slate-400 dark:text-slate-500 mb-1">Tokens</div>
                                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                                    {file.tokens.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-400 dark:text-slate-500 mb-1">Chars</div>
                                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                                    {file.chars.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-400 dark:text-slate-500 mb-1">Size</div>
                                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                                    {formatSize(file.size_kb)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 dark:text-slate-400
                                  uppercase bg-slate-50/50 dark:bg-slate-900/30
                                  border-b border-slate-100/50 dark:border-slate-800/50">
                                    <tr>
                                        <th className="px-6 lg:px-8 py-4 font-semibold">File Name</th>
                                        <th className="px-6 lg:px-8 py-4 font-semibold">Tokens</th>
                                        <th className="px-6 lg:px-8 py-4 font-semibold">Chars</th>
                                        <th className="px-6 lg:px-8 py-4 font-semibold">Size</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                                    {data.files.sort((a, b) => b.tokens - a.tokens).map((file, index) => (
                                        <tr key={index}
                                          className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20
                                            transition-colors group">
                                            <td className="px-6 lg:px-8 py-4 font-medium text-slate-700
                                              dark:text-slate-300">
                                                <div className="flex items-center gap-3">
                                                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800
                                                    text-slate-500 dark:text-slate-400 rounded-lg
                                                    group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/50
                                                    group-hover:text-indigo-600 dark:group-hover:text-indigo-400
                                                    transition-colors flex-shrink-0">
                                                    <FileText size={14} />
                                                  </div>
                                                  <span title={file.path} className="truncate max-w-[200px] lg:max-w-[300px]">
                                                    {file.name}
                                                  </span>
                                                </div>
                                            </td>
                                            <td className="px-6 lg:px-8 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5
                                                  rounded-full text-xs font-medium badge">
                                                    {file.tokens.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 lg:px-8 py-4 text-slate-500 dark:text-slate-400">
                                                {file.chars.toLocaleString()}
                                            </td>
                                            <td className="px-6 lg:px-8 py-4 text-slate-500 dark:text-slate-400">
                                                {formatSize(file.size_kb)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!data && !loading && !error && (
              <div className="glass-panel rounded-2xl p-12 sm:p-16 text-center animate-fade-in">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800
                    rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FolderSearch size={32} className="text-slate-400 dark:text-slate-500 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                    No Directory Scanned Yet
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter a directory path above and click "Scan Directory" to analyze token counts.
                  </p>
                </div>
              </div>
            )}
        </div>
    );
}
