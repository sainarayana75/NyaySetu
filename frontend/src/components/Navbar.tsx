import React from 'react';
import { Scale, Globe, Moon, Sun, FileText, GitCompare, HelpCircle, UserCheck, Search, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  onOpenDemo,
}) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Scale },
    { id: 'workspace', label: 'Workspace', icon: FileText },
    { id: 'clarity_map', label: 'Clarity Map', icon: Search },
    { id: 'clauses', label: 'Clauses', icon: ShieldCheck },
    { id: 'obligations', label: 'Obligations', icon: UserCheck },
    { id: 'ask', label: 'Ask Document', icon: HelpCircle },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'knowledge', label: 'Legal Knowledge', icon: Globe },
    { id: 'lawyer_prep', label: 'Lawyer Prep', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 via-indigo-800 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/20">
              <Scale className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">NyaySetu</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">India</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium hidden sm:block">Bridging Legal Complexity & Understanding</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls & Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Demo Button */}
            <button
              onClick={onOpenDemo}
              className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-sm shadow-amber-500/20 transition-all transform active:scale-95"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Rental Demo</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                  language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                  language === 'hi' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                  language === 'te' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-200 dark:border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
