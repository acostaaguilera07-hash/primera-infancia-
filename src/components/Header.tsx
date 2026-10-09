import React from 'react';
import { BookOpen, Wrench, BookMarked, Info, History, Share2, User as UserIcon, LogOut, ShieldCheck, UserCheck, Shapes } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: 'planificador' | 'conceptos' | 'recursos' | 'normativa' | 'historial' | 'evaluacion';
  setActiveTab: (tab: 'planificador' | 'conceptos' | 'recursos' | 'normativa' | 'historial' | 'evaluacion') => void;
  savedCount: number;
  onShareApp?: () => void;
  currentUser?: User | null;
  onLoginGoogle?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  savedCount, 
  onShareApp,
  currentUser,
  onLoginGoogle,
  onLogout
}) => {
  const isAnonymous = currentUser?.isAnonymous ?? true;

  return (
    <header className="bg-[#1e3a8a] text-white shadow-lg border-b border-[#1d4ed8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('planificador')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all border border-white/25 shadow-inner">
            <BookOpen className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight uppercase">
                I.E. MUNICIPIO DE SAN PEDRO
              </h1>
              <span className="hidden xl:inline px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-blue-950 rounded-full shadow-xs">
                PPEI 2026
              </span>
            </div>
            <p className="text-xs text-blue-200 font-medium hidden sm:block">
              Primera Infancia • San Pedro, Sucre • Dcto. 1411 & Ley 2503
            </p>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('planificador')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'planificador'
                ? 'bg-blue-600 text-white border border-blue-400 shadow-sm font-bold'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">Planificador PPEI</span>
          </button>

          <button
            onClick={() => setActiveTab('conceptos')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'conceptos'
                ? 'bg-blue-600 text-white border border-blue-400 shadow-sm font-bold'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Shapes className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">Conceptos Clave</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluacion')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'evaluacion'
                ? 'bg-blue-600 text-white border border-blue-400 shadow-sm font-bold'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">Valorar el Proceso & Diario</span>
          </button>

          <button
            onClick={() => setActiveTab('recursos')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'recursos'
                ? 'bg-blue-600 text-white border border-blue-400 shadow-sm font-bold'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">Recursos & Alianza</span>
          </button>

          <button
            onClick={() => setActiveTab('normativa')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'normativa'
                ? 'bg-blue-600 text-white border border-blue-400 shadow-sm font-bold'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">PPEI & Normativa</span>
          </button>

          <button
            onClick={() => setActiveTab('historial')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all relative ${
              activeTab === 'historial'
                ? 'bg-blue-600 text-white border border-blue-400 shadow-sm font-bold'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <History className="w-4 h-4 text-blue-200" />
            <span className="hidden sm:inline">Historial</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-amber-400 text-blue-950 font-bold rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Section */}
          <div className="flex items-center space-x-1 pl-1 sm:pl-2 border-l border-blue-700 ml-1">
            {currentUser && !isAnonymous ? (
              <div className="flex items-center space-x-2 bg-blue-950/60 border border-blue-500/50 rounded-full py-1 px-2.5">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'Usuario'} 
                    className="w-5 h-5 rounded-full border border-blue-300"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-blue-300" />
                )}
                <span className="text-xs font-semibold text-blue-100 max-w-[90px] truncate hidden lg:inline">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <button
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="p-1 hover:bg-blue-800 rounded-full text-blue-200 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginGoogle}
                title="Acceder con Google para respaldar tus clases en la nube"
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-blue-950/70 hover:bg-blue-800 text-blue-100 border border-blue-400/50 shadow-sm transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">Guardar en Google</span>
              </button>
            )}

            {onShareApp && (
              <button
                onClick={onShareApp}
                title="Compartir Aplicación"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-blue-950 bg-amber-300 hover:bg-amber-200 shadow-sm transition-all active:scale-95 ml-1"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-950" />
                <span className="hidden md:inline">Compartir</span>
              </button>
            )}
          </div>

        </nav>

      </div>
    </header>
  );
};

