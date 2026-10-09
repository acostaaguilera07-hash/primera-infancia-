import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Mail, 
  MessageCircle, 
  Download, 
  X, 
  Link, 
  FileText, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Planification } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Planification | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, plan }) => {
  const [copiedType, setCopiedType] = useState<'link' | 'text' | 'json' | null>(null);

  if (!isOpen) return null;

  // Clean URL without sandbox iframe tokens or trailing hashes
  const cleanAppUrl = typeof window !== 'undefined' 
    ? (window.location.origin + window.location.pathname).replace(/\/$/, '')
    : '';
  const appUrl = cleanAppUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const planTitle = plan ? plan.title : 'Planificación Pedagógica - APP Primera Infancia';

  // Build formatted text summary for sharing
  const getShareText = () => {
    if (!plan) {
      return `🌟 APP Primera Infancia - Herramienta de Planificación Pedagógica para la Educación Inicial (Decreto 1411 de 2022 y Ley 2503 de 2025).\n\n🚀 Acceso libre y directo para docentes aquí:\n${appUrl}`;
    }

    return `📚 *PLANIFICACIÓN PEDAGÓGICA*
*${plan.title}*

🏛️ *Marco Normativo:* Decreto 1411 de 2022 | Ley 2503 de 2025
⏱️ *Duración:* ${plan.duration} | *Edad:* ${plan.ageRange}

🎯 *Objetivo General:*
${plan.generalObjective}

🌱 *Justificación:*
${plan.justification}

🚀 *Ruta Metodológica:*
${plan.phases.map(p => `• ${p.timeframe ? p.timeframe + ': ' : ''}${p.name} - ${p.title}`).join('\n')}

✨ *Producto Final:*
${plan.expectedResult}

🔗 Generado con APP Primera Infancia (Acceso libre):
${appUrl}`;
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = getShareText();
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  // Email Share
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Planificación Pedagógica: ${planTitle}`);
    const body = encodeURIComponent(getShareText());
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: planTitle,
          text: plan ? `Planificación Pedagógica: ${plan.title}` : 'APP Primera Infancia - Planificación Pedagógica',
          url: appUrl
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedType('link');
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Copy Formatted Text
  const handleCopyText = () => {
    navigator.clipboard.writeText(getShareText());
    setCopiedType('text');
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Download JSON Backup
  const handleDownloadJSON = () => {
    if (!plan) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${plan.id}_planificacion.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setCopiedType('json');
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1e3a8a] text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-700/60 flex items-center justify-center border border-blue-400/30">
              <Share2 className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">Compartir Planificación</h3>
              <p className="text-xs text-blue-200">Educación Inicial • I.E. del Municipio de San Pedro</p>
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
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Plan Summary Badge */}
          {plan && (
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <p className="font-bold text-blue-950 text-sm mb-1 line-clamp-1">{plan.title}</p>
                <p className="line-clamp-2 text-slate-600">{plan.generalObjective}</p>
              </div>
            </div>
          )}

          {/* Native Share Button (if supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Abrir Menú de Compartir del Dispositivo</span>
            </button>
          )}

          {/* Main Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 font-semibold text-xs sm:text-sm rounded-xl transition-all group cursor-pointer"
            >
              <div className="p-2 bg-emerald-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-bold">Enviar por WhatsApp</p>
                <p className="text-[11px] text-emerald-700">Mensaje formateado</p>
              </div>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 font-semibold text-xs sm:text-sm rounded-xl transition-all group cursor-pointer"
            >
              <div className="p-2 bg-blue-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-bold">Enviar por Correo</p>
                <p className="text-[11px] text-blue-700">Para coordinadores</p>
              </div>
            </button>

            {/* Copy Full Text */}
            <button
              onClick={handleCopyText}
              className="flex items-center space-x-3 p-3 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/80 font-semibold text-xs sm:text-sm rounded-xl transition-all group cursor-pointer"
            >
              <div className="p-2 bg-amber-500 text-slate-950 rounded-lg group-hover:scale-105 transition-transform">
                {copiedType === 'text' ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <p className="font-bold">{copiedType === 'text' ? '¡Texto Copiado!' : 'Copiar Resumen'}</p>
                <p className="text-[11px] text-amber-800">Texto pedagógico</p>
              </div>
            </button>

            {/* Copy App Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-3 p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 font-semibold text-xs sm:text-sm rounded-xl transition-all group cursor-pointer"
            >
              <div className="p-2 bg-slate-700 text-white rounded-lg group-hover:scale-105 transition-transform">
                {copiedType === 'link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <p className="font-bold">{copiedType === 'link' ? '¡Enlace Copiado!' : 'Copiar Enlace'}</p>
                <p className="text-[11px] text-slate-500">Dirección de la app</p>
              </div>
            </button>

          </div>

          {/* Backup Download JSON option */}
          {plan && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleDownloadJSON}
                className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100/80 text-purple-950 border border-purple-200/80 rounded-xl transition-all text-xs font-medium"
              >
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-purple-700" />
                  <span>Exportar Respaldo (.JSON)</span>
                </div>
                <span className="text-[11px] bg-purple-200/70 text-purple-900 px-2 py-0.5 rounded-md font-bold">
                  {copiedType === 'json' ? '¡Descargado!' : 'Descargar'}
                </span>
              </button>
            </div>
          )}

          {/* Link URL Preview Input */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Enlace directo
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shrink-0"
              >
                {copiedType === 'link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
            <span>Facilita la articulación con coordinadores y familias</span>
          </p>
        </div>

      </div>
    </div>
  );
};
