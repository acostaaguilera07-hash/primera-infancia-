import React from 'react';
import { ShieldCheck, CheckCircle2, ExternalLink, X, Info, Sparkles } from 'lucide-react';

interface AuthNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
  errorCode?: string;
}

export const AuthNoticeModal: React.FC<AuthNoticeModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  errorCode
}) => {
  if (!isOpen) return null;

  const isUnauthorizedDomain = errorCode === 'auth/unauthorized-domain';
  const isPopupBlocked = errorCode === 'auth/popup-blocked';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="bg-[#1e3a8a] text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-700/60 flex items-center justify-center border border-blue-400/30">
              <ShieldCheck className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">
                {isUnauthorizedDomain ? 'Modo Docente Protegido Activo' : 'Estado de Acceso Docente'}
              </h3>
              <p className="text-xs text-blue-200">Acceso Seguro • I.E. del Municipio de San Pedro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-blue-100 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-slate-700">
          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-blue-950 text-sm">
                ¡Tu aplicación está 100% habilitada y lista para usar!
              </p>
              <p className="text-slate-600 leading-relaxed">
                No necesitas cuenta obligatoria ni contraseñas para planificar, redactar informes cualitativos, usar los conceptos clave, exportar a Word o compartir con tus colegas de las I.E. del municipio de San Pedro (Sucre).
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <Info className="w-4 h-4 text-blue-700" />
              <span>Detalles del Acceso:</span>
            </div>
            <p className="leading-relaxed">
              {errorMessage || 'Estás navegando en un entorno docente privado y seguro con almacenamiento local sincronizado y respaldo instantáneo.'}
            </p>
            {isPopupBlocked && (
              <p className="text-amber-800 font-medium pt-1">
                💡 Consejo: Si deseas vincular tu cuenta de Google, habilita las ventanas emergentes (popups) en tu navegador y vuelve a presionar el botón.
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Continuar en Modo Docente (Recomendado)</span>
            </button>

            {typeof window !== 'undefined' && window.self !== window.top && (
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl border border-slate-200 transition-all text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                <span>Abrir la App en Pestaña Completa</span>
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
