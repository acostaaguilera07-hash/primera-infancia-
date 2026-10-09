import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Calendar, 
  Users, 
  Compass, 
  HelpCircle, 
  Lightbulb, 
  Target, 
  BookOpen, 
  Zap, 
  Trophy, 
  Map, 
  HeartHandshake, 
  Accessibility,
  CheckCircle2,
  Wand2,
  Sparkles,
  Clock,
  Flag,
  Share2,
  Palette,
  Smile,
  Baby,
  ClipboardCheck,
  BookMarked
} from 'lucide-react';
import { Planification } from '../types';
import { exportPlanToDocx, exportMatrizLegalDocx } from '../utils/docxExport';
import { PhaseIllustration } from './PhaseIllustration';
import { ImageGeneratorModal } from './ImageGeneratorModal';
import { ShareModal } from './ShareModal';
import { PlanSummaryTable } from './PlanSummaryTable';
import { HIGH_QUALITY_SAMPLE_IMAGES } from '../data/generatedImages';
import { getPlanImagesByTitle } from '../utils/imageSelector';
import { getArticulatedPropositos } from '../utils/propositosHelper';

interface PlanViewProps {
  plan: Planification;
  onBack: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({ plan, onBack }) => {
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [headerImageUrl, setHeaderImageUrl] = useState<string>(HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState<string>(HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza);
  const [productModalPrompt, setProductModalPrompt] = useState<string>('');
  const [productModalTitle, setProductModalTitle] = useState<string>('');

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [phaseImageUrls, setPhaseImageUrls] = useState<string[]>([
    HIGH_QUALITY_SAMPLE_IMAGES.detectivesJardin,
    HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento,
    HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiario,
    HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza,
    HIGH_QUALITY_SAMPLE_IMAGES.rinconCalma
  ]);

  React.useEffect(() => {
    if (plan) {
      const images = getPlanImagesByTitle(plan.title, plan.topic, plan.expectedResult, plan.type, plan.phases);
      setHeaderImageUrl(images.headerImageUrl);
      setProductImageUrl(images.productImageUrl);
      setPhaseImageUrls(images.phaseImageUrls);
    }
  }, [plan]);

  const handleDownloadWord = () => {
    exportPlanToDocx(plan, { headerImageUrl, productImageUrl, phaseImageUrls });
  };

  const handleDownloadMatrizLegal = () => {
    exportMatrizLegalDocx(plan);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
      
      {/* Top Action Controls Bar (Hidden in Print) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Volver al Editor</span>
        </button>

        <div className="flex items-center space-x-2">
          
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>

          <button
            onClick={() => setIsHeaderModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <Wand2 className="w-4 h-4" />
            <span>Personalizar / Cargar Imagen</span>
          </button>

          <button
            onClick={handleDownloadMatrizLegal}
            className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            title="Descargar solo la Matriz en hoja Legal horizontal, márgenes estrechos y Calibri 10"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Matriz Word (Legal • Calibri 10)</span>
          </button>

          <button
            onClick={handleDownloadWord}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            title="Descargar la planeación pedagógica completa en Word"
          >
            <Download className="w-4 h-4" />
            <span>Doc Completo Word</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>

        </div>

      </div>

      {/* Main Document Frame */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
        
        {/* Document Header Banner */}
        <div className="bg-[#1e3a8a] text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/80 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/50">
            <Compass className="w-3.5 h-3.5" />
            <span>{plan.type === 'proyecto' ? 'PROYECTO DE AULA • I.E. DEL MUNICIPIO DE SAN PEDRO' : plan.type === 'clase' ? 'EXPERIENCIA / SESIÓN' : 'LOGROS DE DESARROLLO'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            {plan.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-blue-100">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-300" />
              <span>{plan.duration}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blue-300" />
              <span>{plan.targetAudience}</span>
            </div>
            <div className="bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-700/50 text-blue-200">
              Rango: {plan.ageRange}
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Visual Hero Feature Image */}
        <div className="relative w-full h-56 sm:h-72 overflow-hidden border-b border-slate-200 group bg-slate-900">
          <img
            src={headerImageUrl}
            alt="Ilustración Pedagógica Nana Banana"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-blue-950/90 border border-blue-400/40 text-amber-300 text-xs font-bold flex items-center space-x-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ilustración Pedagógica Nana Banana</span>
              </span>
            </div>

            <button
              onClick={() => setIsHeaderModalOpen(true)}
              className="bg-white/90 hover:bg-white text-slate-900 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Personalizar Imagen</span>
            </button>
          </div>
        </div>

        {/* Inner Content Padding */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* 1. RESUMEN TIPO TABLA OFICIAL (LINEAMIENTOS DE EDUCACIÓN INICIAL MEN - VER IMAGEN 1) */}
          <PlanSummaryTable plan={plan} />

          {/* Eje Relacional & La Experiencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-blue-700" />
                <span>EJE RELACIONAL (LINEAMIENTOS 2026)</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {plan.relationalAxis}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-purple-700" />
                <span>EXPERIENCIA DE INTERÉS (DETONANTE PEDAGÓGICO)</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold italic text-slate-800">
                "{plan.theExperience || plan.problematizingQuestion}"
              </p>
            </div>

          </div>

          {/* Ideas Pedagógicas y Prompt Personalizado del Docente */}
          {plan.teacherPrompt && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/40 border border-blue-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                  <Wand2 className="w-4 h-4 text-blue-600" />
                  <span>IDEAS PEDAGÓGICAS Y PROMPT PERSONALIZADO DEL DOCENTE</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wide">
                  Planeación Personalizada
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic bg-white/80 p-3.5 rounded-xl border border-blue-100 whitespace-pre-line shadow-inner">
                "{plan.teacherPrompt}"
              </p>
              <div className="flex items-center space-x-1.5 text-[11px] font-medium text-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>La IA integró estas directrices en los momentos pedagógicos, materiales, vinculación familiar y actividades rectoras.</span>
              </div>
            </div>
          )}

          {/* Justificacion & Objetivo General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#1e3a8a]" />
                <span>Justificación</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {plan.justification}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1e3a8a] text-white space-y-3 shadow-md">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-blue-200 uppercase tracking-wider">
                <Target className="w-4 h-4 text-blue-300" />
                <span>Objetivo General</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-50 leading-relaxed font-medium">
                {plan.generalObjective}
              </p>
            </div>

          </div>

          {/* Aprendizajes Imprescindibles & Capacidades a Desarrollar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Aprendizajes */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>APRENDIZAJES IMPRESCINDIBLES</span>
              </div>
              <ul className="space-y-2.5">
                {plan.essentialLearnings.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Capacidades */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>CAPACIDADES A DESARROLLAR</span>
              </div>
              <ul className="space-y-2.5">
                {plan.capacitiesToDevelop.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Propósitos de los Lineamientos Curriculares MEN Colombia Articulados con Imprescindibles */}
          {(() => {
            const articulatedList = getArticulatedPropositos(plan);
            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1e3a8a] to-blue-950 text-white shadow-lg space-y-5 border border-blue-700/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-800/80 pb-3 relative z-10">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-6 h-6 text-amber-300 shrink-0" />
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                        Articulación Curricular: Propósitos de la Educación Inicial e Imprescindibles
                      </h3>
                      <p className="text-xs text-blue-200">
                        Bases Curriculares para la Educación Inicial y Preescolar • Ministerio de Educación Nacional (MEN Colombia)
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-blue-900/80 border border-blue-500/60 rounded-full text-[11px] font-extrabold text-amber-300 uppercase tracking-wider shrink-0">
                    Articulación Oficial MEN
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 pt-1">
                  {articulatedList.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-blue-900/60 border border-blue-700/60 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                          <span>PROPÓSITO {idx + 1}</span>
                          <span className="text-[10px] bg-blue-800/80 text-blue-200 px-2 py-0.5 rounded">MEN</span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {item.shortTitle}
                        </h4>
                        <p className="text-[11px] text-blue-100/90 leading-relaxed italic bg-blue-950/40 p-2 rounded-xl border border-blue-800/50">
                          "{item.proposito}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-blue-800/70 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-amber-300 block tracking-wider">
                          Aprendizajes Imprescindibles:
                        </span>
                        <ul className="space-y-1 text-xs text-blue-100">
                          {item.imprescindibles.map((imp, iIdx) => (
                            <li key={iIdx} className="flex items-start space-x-1.5">
                              <span className="text-amber-400 font-bold mt-0.5">•</span>
                              <span className="leading-snug">{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Actividades Rectoras de la Primera Infancia (Decreto 1411 de 2022) */}
          {(() => {
            const rectorList = plan.rectorActivities && plan.rectorActivities.length >= 4 
              ? plan.rectorActivities 
              : [
                  {
                    activity: 'Exploración del Medio',
                    description: `Indagación directa y recolección de materiales sensoriales del entorno sabanero en torno a "${plan.topic}". Los niños observan detalles con lupas, recolectan muestras y formulan hipótesis guiadas.`,
                    howChildApplies: `El niño/a toca, huele, compara texturas, usa recipientes para clasificar elementos de la naturaleza y hace preguntas espontáneas sobre el tema.`
                  },
                  {
                    activity: 'Juego',
                    description: `Experiencias de juego libre, simbólico y cooperativo con circuitos psicomotores estructurados a partir de "${plan.topic}".`,
                    howChildApplies: `El niño/a asume personajes, inventa reglas y acuerdos con sus pares, negocia turnos y disfruta del movimiento corporal coordinado.`
                  },
                  {
                    activity: 'Arte',
                    description: `Expresión plástica, dactilopintura, modelado en arcilla o plastilina, música y danza inspiradas en "${plan.topic}".`,
                    howChildApplies: `El niño/a plasma sus emociones con trazos libres, estampa colores con esponjas y manos, moldea figuras y canta o baila al ritmo de melodías.`
                  },
                  {
                    activity: 'Literatura',
                    description: `Lectura dialógica de cuentos ilustrados, rincón de libros táctiles, rimas, nanas y relatos orales vinculados a "${plan.topic}".`,
                    howChildApplies: `El niño/a hojea libros con curiosidad, "lee" a través de las ilustraciones, anticipa finales e inventa relatos orales con sus compañeros.`
                  }
                ];

            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-900">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                        Actividades Rectoras y Vivencia del Niño/a (Decreto 1411 de 2022)
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Articulación de los 4 pilares fundamentales de la Educación Inicial y la experiencia activa del niño/a
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-extrabold uppercase tracking-wider shrink-0">
                    4 Pilares MEN
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {rectorList.map((item, rIdx) => {
                    const isMedio = item.activity.toLowerCase().includes('medio') || item.activity.toLowerCase().includes('explor');
                    const isJuego = item.activity.toLowerCase().includes('juego');
                    const isArte = item.activity.toLowerCase().includes('arte');
                    const isLit = item.activity.toLowerCase().includes('literatura');

                    const theme = isMedio 
                      ? { bg: 'bg-emerald-50/50', border: 'border-emerald-200', text: 'text-emerald-950', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: <Compass className="w-4 h-4 text-emerald-700" />, childBg: 'bg-emerald-100/70 border-emerald-300/80 text-emerald-950' }
                      : isJuego
                      ? { bg: 'bg-amber-50/50', border: 'border-amber-200', text: 'text-amber-950', badge: 'bg-amber-100 text-amber-900 border-amber-300', icon: <Smile className="w-4 h-4 text-amber-700" />, childBg: 'bg-amber-100/70 border-amber-300/80 text-amber-950' }
                      : isArte
                      ? { bg: 'bg-purple-50/50', border: 'border-purple-200', text: 'text-purple-950', badge: 'bg-purple-100 text-purple-900 border-purple-300', icon: <Palette className="w-4 h-4 text-purple-700" />, childBg: 'bg-purple-100/70 border-purple-300/80 text-purple-950' }
                      : { bg: 'bg-indigo-50/50', border: 'border-indigo-200', text: 'text-indigo-950', badge: 'bg-indigo-100 text-indigo-900 border-indigo-300', icon: <BookOpen className="w-4 h-4 text-indigo-700" />, childBg: 'bg-indigo-100/70 border-indigo-300/80 text-indigo-950' };

                    return (
                      <div key={rIdx} className={`p-5 rounded-2xl border ${theme.border} ${theme.bg} space-y-3.5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between`}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide border ${theme.badge}`}>
                              {theme.icon}
                              <span>{item.activity}</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">Pilar {rIdx + 1}</span>
                          </div>

                          <div>
                            <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                              Propuesta Pedagógica y Ambiente:
                            </span>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* ¿Cómo lo aplica el niño/a? */}
                        <div className={`p-3 rounded-xl border ${theme.childBg} space-y-1`}>
                          <div className="flex items-center space-x-1.5 text-[11px] font-extrabold uppercase tracking-wider">
                            <Baby className="w-3.5 h-3.5 shrink-0" />
                            <span>¿Cómo lo aplica y vivencia el niño/a?</span>
                          </div>
                          <p className="text-xs leading-relaxed font-medium">
                            {item.howChildApplies}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Resultado Esperado: Producto Final Acumulativo + Ilustración */}
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/90 border-2 border-amber-300/80 shadow-sm space-y-5">
            <div className="flex items-center space-x-2.5 text-xs sm:text-sm font-extrabold text-amber-950 uppercase tracking-wider border-b border-amber-200/80 pb-3">
              <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
              <span>RESULTADO ESPERADO: PRODUCTO FINAL ACUMULATIVO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-2">
                <p className="text-sm sm:text-base font-extrabold text-amber-950 leading-relaxed">
                  {plan.expectedResult}
                </p>
                <p className="text-xs text-amber-800/90 leading-relaxed font-medium">
                  Evidencia tangible o experiencia acumulativa comunitaria que sintetiza las 4 fases del itinerario pedagógico y los aprendizajes del proyecto.
                </p>
              </div>

              <div className="md:col-span-5 relative group overflow-hidden rounded-2xl border-2 border-amber-300/80 bg-slate-900 shadow-md h-48 sm:h-52">
                <img
                  src={productImageUrl}
                  alt={plan.expectedResult}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                  <span className="flex items-center space-x-1 text-amber-200 truncate pr-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate">Producto Final</span>
                  </span>
                  <button
                    onClick={() => {
                      setProductModalPrompt(`Ilustración infantil y colorida del producto final pedagógico: ${plan.expectedResult}. Niños de preescolar colombianos compartiendo sus creaciones en un aula temática llena de vida.`);
                      setProductModalTitle('Personalizar Ilustración del Producto Final');
                      setIsProductModalOpen(true);
                    }}
                    className="bg-white/90 hover:bg-white text-slate-900 px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all shadow shrink-0"
                  >
                    Cambiar Imagen
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ruta del Proyecto o Secuencia de la Sesión */}
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2.5">
                {plan.type === 'proyecto' ? (
                  <Calendar className="w-6 h-6 text-[#1e40af]" />
                ) : (
                  <Clock className="w-6 h-6 text-[#1e3a8a]" />
                )}
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {plan.type === 'proyecto' 
                      ? 'Cronología y Fases Aplicativas del Proyecto (Semana a Semana)' 
                      : 'Secuencia Metodológica de la Sesión (Momentos Pedagógicos)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {plan.type === 'proyecto'
                      ? 'Itinerario de aplicación progresiva por semanas con hitos de aprendizaje (5 Fases)'
                      : 'Estructura metodológica de la experiencia: Indagar, Proyectar, Vivir y Valorar (5 Momentos)'}
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                plan.type === 'proyecto' 
                  ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}>
                {plan.type === 'proyecto' ? '5 FASES • CRONOLOGÍA PPEI' : '5 MOMENTOS DE LA EXPERIENCIA'}
              </span>
            </div>

            <div className="space-y-8 relative">
              {/* Vertical connector line for project timeline */}
              {plan.type === 'proyecto' && (
                <div className="hidden md:block absolute left-4 top-6 bottom-6 w-0.5 bg-blue-200 -z-0" />
              )}

              {plan.phases.map((phase) => (
                <div key={phase.phaseNumber} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                  
                  {/* Details (7 cols) */}
                  <div className="md:col-span-7 space-y-3">
                    
                    {/* Timeframe & Milestone Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                        plan.type === 'proyecto' 
                          ? 'bg-[#1e40af] text-blue-100' 
                          : 'bg-[#1e3a8a] text-blue-100'
                      }`}>
                        <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span>{phase.timeframe || (plan.type === 'proyecto' ? `Semana ${phase.phaseNumber}` : `Momento ${phase.phaseNumber}`)}</span>
                      </div>

                      {phase.milestone && (
                        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300/80">
                          <Flag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{phase.milestone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full font-extrabold flex items-center justify-center text-sm shadow-md shrink-0 mt-0.5 ${
                        plan.type === 'proyecto'
                          ? 'bg-[#1e40af] text-white'
                          : 'bg-[#1e3a8a] text-white'
                      }`}>
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                          {phase.name}
                        </h4>
                        <div className="text-xs font-bold text-slate-600 italic mt-0.5">
                          "{phase.title}"
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                      {phase.description}
                    </p>

                    <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100/90 space-y-2">
                      <div className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                        <span>ESTRATEGIAS Y VOCES DE MEDIACIÓN PEDAGÓGICA:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        {phase.strategiesAndVoices.map((strat, sIdx) => (
                          <div key={sIdx} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                            <span className="font-medium">{strat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Phase Illustration Graphic (5 cols) */}
                  <div className="md:col-span-5">
                    <PhaseIllustration
                      phaseNumber={phase.phaseNumber}
                      svgType={phase.svgType}
                      customImageUrl={phaseImageUrls[phase.phaseNumber - 1]}
                      phaseTitle={phase.title}
                      onImageGenerated={(url) => {
                        setPhaseImageUrls(prev => {
                          const next = [...prev];
                          next[phase.phaseNumber - 1] = url;
                          return next;
                        });
                      }}
                    />
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid: Family Involvement & Inclusion PIAR/DUA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4 text-blue-700" />
                <span>Vinculación Familiar</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {plan.familyInvolvement}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-sky-900 uppercase tracking-wider">
                <Accessibility className="w-4 h-4 text-sky-700" />
                <span>Inclusión (PIAR / DUA)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {plan.inclusionPIAR}
              </p>
            </div>

          </div>

          {/* VALORAR EL PROCESO (LINEAMIENTOS DE EDUCACIÓN INICIAL - MEN COLOMBIA) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/80 border-2 border-emerald-300/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-black text-emerald-950 uppercase tracking-wider">
                <ClipboardCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>VALORAR EL PROCESO (LINEAMIENTOS DE EDUCACIÓN INICIAL - MEN COLOMBIA)</span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider self-start sm:self-auto">
                Seguimiento Cualitativo • Sin Notas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 space-y-2 shadow-2xs">
                <div className="font-extrabold text-emerald-950 uppercase flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Seguimiento al Desarrollo:</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Observación atenta y escucha pedagógica activa de los procesos singulares de cada niña y niño, reconociendo sus intereses, ritmos de aprendizaje y conquistas sin calificar numéricamente ni rotular.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 space-y-2 shadow-2xs">
                <div className="font-extrabold text-emerald-950 uppercase flex items-center space-x-1.5">
                  <BookMarked className="w-4 h-4 text-emerald-600" />
                  <span>Instrumentos de Registro:</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Uso sistemático de <strong>diarios de campo pedagógicos</strong>, <strong>bitácora de aula y viajera</strong>, <strong>portafolio de evidencias infantiles</strong> y <strong>estudio de casos</strong> para documentar la vivencia.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 space-y-2 shadow-2xs">
                <div className="font-extrabold text-emerald-950 uppercase flex items-center space-x-1.5">
                  <Smile className="w-4 h-4 text-emerald-600" />
                  <span>Momento 5 de Valoración:</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Círculo dialógico y asamblea con las niñas y niños al finalizar la experiencia, donde comparten con palabras, gestos y obras sus emociones y descubrimientos más queridos.
                </p>
              </div>
            </div>
          </div>

          {/* Territorial Context / Ancestral Knowledge */}
          {plan.ethnicAndTerritorialContext && (
            <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
              <span className="font-extrabold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>CONTEXTO TERRITORIAL Y EDUCACIÓN PROPIA</span>
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {plan.ethnicAndTerritorialContext}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Header Image Modal */}
      <ImageGeneratorModal
        isOpen={isHeaderModalOpen}
        onClose={() => setIsHeaderModalOpen(false)}
        initialPrompt={`Un rincón de aprendizaje de educación inicial sobre "${plan.topic}" con plantas colombianas, terrarios y niños explorando con alegría.`}
        title={`Ilustración Nana Banana para "${plan.title}"`}
        onSelectImage={(url) => setHeaderImageUrl(url)}
      />

      {/* Product Final Image Modal */}
      <ImageGeneratorModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        initialPrompt={productModalPrompt || `Ilustración del producto final: ${plan.expectedResult}`}
        title={productModalTitle || 'Ilustración del Producto Final'}
        onSelectImage={(url) => setProductImageUrl(url)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        plan={plan}
      />
    </div>
  );
};
