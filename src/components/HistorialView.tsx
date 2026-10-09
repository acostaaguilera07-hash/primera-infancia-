import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  Copy, 
  Sparkles,
  FileText,
  Share2,
  ShieldCheck,
  Lock,
  CloudCheck,
  LogIn
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Planification } from '../types';
import { exportPlanToDocx } from '../utils/docxExport';
import { ShareModal } from './ShareModal';
import { getPlanThumbnail } from '../utils/imageSelector';

interface HistorialViewProps {
  savedPlans: Planification[];
  onViewPlan: (plan: Planification) => void;
  onDuplicatePlan: (plan: Planification) => void;
  onDeletePlan: (id: string) => void;
  onClearAllPlans?: () => void;
  onNewPlanClick: () => void;
  currentUser?: User | null;
  onLoginGoogle?: () => void;
}

export const HistorialView: React.FC<HistorialViewProps> = ({
  savedPlans,
  onViewPlan,
  onDuplicatePlan,
  onDeletePlan,
  onClearAllPlans,
  onNewPlanClick,
  currentUser,
  onLoginGoogle
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sharingPlan, setSharingPlan] = useState<Planification | null>(null);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState<boolean>(false);


  const isAnonymous = currentUser?.isAnonymous ?? true;

  const filteredPlans = savedPlans.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const renderPlanThumbnail = (plan: Planification) => {
    return getPlanThumbnail(plan.title, plan.topic, plan.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mi Historial Personal
            </h2>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
              <Lock className="w-3 h-3 text-blue-700" />
              <span>Privado</span>
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Tus experiencias pedagógicas están sincronizadas de forma única y privada para tu labor docente en las I.E. del municipio de San Pedro (Sucre).
          </p>
        </div>

        <button
          onClick={onNewPlanClick}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all shrink-0 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Nueva Planificación</span>
        </button>
      </div>

      {/* Privacy & Account Security Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#1e3a8a] to-indigo-950 rounded-3xl p-5 text-white shadow-md border border-blue-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-blue-800/80 rounded-2xl border border-blue-500/40 shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-200" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Espacio de Trabajo Aislado y Protegido
              </h3>
              <span className="flex items-center space-x-1 text-[11px] bg-blue-950/70 text-blue-200 px-2 py-0.5 rounded-md font-mono border border-blue-800">
                <CloudCheck className="w-3 h-3" />
                <span>ID: {currentUser?.uid ? `${currentUser.uid.slice(0, 8)}...` : 'Local'}</span>
              </span>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed max-w-2xl">
              {isAnonymous ? (
                <>
                  Estás usando una sesión docente privada. Ningún otro usuario tiene acceso a tu historial. 
                  Para sincronizar tus planes en múltiples dispositivos o no perderlos al borrar datos del navegador, vincula tu cuenta de Google.
                </>
              ) : (
                <>
                  Sesión autenticada como <strong className="text-blue-200">{currentUser?.displayName || currentUser?.email}</strong>. 
                  Tus planificaciones están respaldadas en la nube de Firebase y aisladas de otros docentes.
                </>
              )}
            </p>
          </div>
        </div>

        {isAnonymous && onLoginGoogle && (
          <button
            onClick={onLoginGoogle}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-white text-blue-950 font-bold text-xs rounded-xl shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Respaldar con Google</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'proyecto', 'clase'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-[#1e3a8a] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'Todos' : t === 'clase' ? 'Experiencia / Sesión' : 'Proyecto'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o tema..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {savedPlans.length > 0 && onClearAllPlans && (
            <button
              onClick={() => setIsConfirmClearOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer"
              title="Borrar todo el historial de planificaciones"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Vaciar Historial</span>
            </button>
          )}
        </div>

      </div>


      {/* Planifications List */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No se encontraron planificaciones en tu historial</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {savedPlans.length === 0
              ? 'Aún no has guardado planificaciones en tu espacio personal. Diseña una nueva o guarda una experiencia desde el Planificador.'
              : 'Prueba cambiando tus términos de búsqueda o filtros.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPlans.map((plan) => {
            const thumbSrc = renderPlanThumbnail(plan);
            return (
              <div
                key={plan.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Visual Header Image Preview */}
                <div 
                  onClick={() => onViewPlan(plan)}
                  className="relative h-36 bg-slate-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={thumbSrc}
                    alt={plan.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="px-2.5 py-1 rounded-full bg-blue-900/90 backdrop-blur-md border border-blue-500/40 text-blue-200 font-bold text-[10px] uppercase tracking-wider">
                      {plan.type === 'clase' ? 'EXPERIENCIA / SESIÓN' : plan.type} • {plan.ageRange}
                    </span>
                    <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-slate-200 font-medium">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 
                      onClick={() => onViewPlan(plan)}
                      className="text-base font-bold text-slate-900 hover:text-[#1e3a8a] cursor-pointer line-clamp-2 transition-colors"
                    >
                      {plan.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      Tema: <span className="text-slate-800 font-medium">"{plan.topic}"</span>
                    </p>

                    <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                      {plan.selectedDimensions.slice(0, 3).map((dim) => (
                        <span key={dim} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                          {dim}
                        </span>
                      ))}
                      {plan.selectedDimensions.length > 3 && (
                        <span className="text-slate-400 font-semibold px-1">
                          +{plan.selectedDimensions.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    
                    <button
                      onClick={() => onViewPlan(plan)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-900 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Plan</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => exportPlanToDocx(plan)}
                        title="Descargar Word"
                        className="p-2 text-slate-600 hover:text-[#1e3a8a] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSharingPlan(plan)}
                        title="Compartir Plan"
                        className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDuplicatePlan(plan)}
                        title="Duplicar Plan"
                        className="p-2 text-slate-600 hover:text-purple-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeletePlan(plan.id)}
                        title="Eliminar"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={!!sharingPlan}
        onClose={() => setSharingPlan(null)}
        plan={sharingPlan}
      />

      {/* Clear History Confirmation Modal */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                ¿Vaciar todo el historial de planificaciones?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Esta acción eliminará de forma permanente todas las planificaciones guardadas ({savedPlans.length} planes) en tu espacio personal. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onClearAllPlans) {
                    onClearAllPlans();
                  }
                  setIsConfirmClearOpen(false);
                }}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Sí, Vaciar Todo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


