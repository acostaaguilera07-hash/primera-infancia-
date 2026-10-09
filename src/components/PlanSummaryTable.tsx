import React, { useState } from 'react';
import { 
  Table as TableIcon, 
  Sparkles, 
  Compass, 
  Target, 
  HeartHandshake, 
  Smile, 
  FileText, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  ClipboardCheck, 
  HelpCircle,
  Users,
  Search,
  Lightbulb,
  Palette,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Gamepad2,
  BookMarked,
  Info,
  Check,
  Heart
} from 'lucide-react';
import { Planification } from '../types';
import { getArticulatedPropositos } from '../utils/propositosHelper';
import { getRectorActivitiesDetails } from '../utils/rectorActivitiesHelper';
import { 
  getSynchronizedMomentsSocioemotional, 
  getSynchronizedRectorasSocioemotional, 
  getSocioemotionalCrossMatrix 
} from '../utils/socioemotionalHelper';
import { exportMatrizLegalDocx } from '../utils/docxExport';

interface PlanSummaryTableProps {
  plan: Planification;
}

export const PlanSummaryTable: React.FC<PlanSummaryTableProps> = ({ plan }) => {
  // Pestañas disponibles: 5 Momentos, Actividades Rectoras Detalladas, Aspecto Socioemocional, Propósitos e Imprescindibles, Matriz Integral
  const [activeTab, setActiveTab] = useState<'matriz' | 'rectoras' | 'socioemocional' | 'articulacion' | 'integral'>('matriz');
  
  // Nivel de Zoom interactivo: 75% a 150%
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Modo Horizontal Panorámico / Pantalla Completa para máxima área de trabajo
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);

  // Estado de descarga del archivo Word (.docx)
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Obtener los 5 momentos pedagógicos ordenados
  const momento1 = plan.phases.find(p => p.phaseNumber === 1) || plan.phases[0];
  const momento2 = plan.phases.find(p => p.phaseNumber === 2) || plan.phases[1];
  const momento3 = plan.phases.find(p => p.phaseNumber === 3) || plan.phases[2];
  const momento4 = plan.phases.find(p => p.phaseNumber === 4) || plan.phases[3];
  const momento5 = plan.phases.find(p => p.phaseNumber === 5) || plan.phases[4];

  // Experiencia de Interés detonante
  const theExperienceText = plan.theExperience || plan.problematizingQuestion;

  // Propósitos articulados con Imprescindibles
  const propositosArticulados = getArticulatedPropositos(plan);

  // 4 Actividades Rectoras detalladas (Exploración del Medio, Juego, Arte, Literatura)
  const actividadesRectoras = getRectorActivitiesDetails(plan);

  // Aspecto Socioemocional Sincronizado (5 Momentos, 4 Actividades Rectoras y Matriz Cruzada)
  const momentosSocio = getSynchronizedMomentsSocioemotional(plan);
  const rectorasSocio = getSynchronizedRectorasSocioemotional(plan);
  const crossSocio = getSocioemotionalCrossMatrix(plan);

  // Manejadores de Zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 140));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 70));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  // Manejador de descarga en formato Word Legal con márgenes estrechos y Calibri 10
  const handleDownloadWordLegal = async () => {
    try {
      setIsExportingDocx(true);
      await exportMatrizLegalDocx(plan);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (error) {
      console.error('Error al exportar la matriz a Word:', error);
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Componente interno para renderizar el contenido de la tabla según la pestaña activa o modo integral
  const renderTableContent = () => (
    <div className="space-y-6">
      
      {/* SECCIÓN 1: VISTA DE LOS 5 MOMENTOS PEDAGÓGICOS */}
      {(activeTab === 'matriz' || activeTab === 'integral') && (
        <div className="space-y-2">
          {activeTab === 'integral' && (
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-blue-950 px-2 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>1. Matriz de los 5 Momentos de la Experiencia Pedagógica (Decreto 1411 de 2022)</span>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs bg-white">
            <table className="w-full min-w-[1300px] border-collapse text-left text-slate-800 table-fixed">
              
              {/* ENCABEZADOS DE LOS 5 MOMENTOS (1 al 5) */}
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-900 text-xs">
                  
                  {/* MOMENTO 1: INDAGAR */}
                  <th className="w-1/5 p-4 bg-blue-50/95 border-r border-slate-300 align-top">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-blue-950 bg-blue-100/90 px-2.5 py-1 rounded-lg border border-blue-200">
                        <Search className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>MOMENTO 1 • INDAGAR</span>
                      </div>
                      <div className="text-[11px] font-black text-blue-900">
                        Escuchar, observar e indagar
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Provocación inicial, recojo de saberes previos, intereses y preguntas infantiles.
                      </p>
                    </div>
                  </th>

                  {/* MOMENTO 2: PROYECTAR */}
                  <th className="w-1/5 p-4 bg-indigo-50/95 border-r border-slate-300 align-top">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-indigo-950 bg-indigo-100/90 px-2.5 py-1 rounded-lg border border-indigo-200">
                        <Layers className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                        <span>MOMENTO 2 • PROYECTAR</span>
                      </div>
                      <div className="text-[11px] font-black text-indigo-900">
                        Diseñar ambientes y acuerdos
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Acuerdos de aula, articulación de propósitos e imprescindibles y organización de estaciones.
                      </p>
                    </div>
                  </th>

                  {/* MOMENTO 3: VIVIR LA EXPERIENCIA */}
                  <th className="w-1/5 p-4 bg-amber-50/95 border-r border-slate-300 align-top">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Smile className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>MOMENTO 3 • VIVIR LA EXPERIENCIA</span>
                      </div>
                      <div className="text-[11px] font-black text-amber-900">
                        Acción vivencial activa
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Juego, arte, literatura y exploración del medio en pequeños grupos y estaciones vivenciales.
                      </p>
                    </div>
                  </th>

                  {/* MOMENTO 4: CONSOLIDACIÓN */}
                  <th className="w-1/5 p-4 bg-purple-50/95 border-r border-slate-300 align-top">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-purple-950 bg-purple-100/90 px-2.5 py-1 rounded-lg border border-purple-200">
                        <Target className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                        <span>MOMENTO 4 • CONSOLIDACIÓN</span>
                      </div>
                      <div className="text-[11px] font-black text-purple-900">
                        Recoger, socializar y tejer
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Puesta en común, producto vivencial acumulado, asambleas de palabra y vínculo familiar.
                      </p>
                    </div>
                  </th>

                  {/* MOMENTO 5: VALORACIÓN */}
                  <th className="w-1/5 p-4 bg-emerald-50/95 align-top border-l border-emerald-200">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-emerald-950 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <ClipboardCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>MOMENTO 5 • VALORACIÓN</span>
                      </div>
                      <div className="text-[11px] font-black text-emerald-900">
                        Valorar el proceso
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Escucha pedagógica, diarios de campo, bitácoras, portafolio y estudio de casos sin calificar.
                      </p>
                    </div>
                  </th>

                </tr>
              </thead>

              {/* CUERPO DE LA TABLA (LOS 5 MOMENTOS EN FILAS ARTICULADAS) */}
              <tbody className="divide-y divide-slate-200 bg-white text-xs leading-relaxed">
                <tr>
                  
                  {/* CELDA 1: MOMENTO 1 (INDAGAR) */}
                  <td className="p-4 border-r border-slate-200 align-top space-y-3 bg-blue-50/15">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {momento1?.title || 'Provocación Sensorial y Asombro Inicial'}
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200/90 space-y-1">
                      <span className="text-[10px] font-black uppercase text-blue-900 block">
                        Experiencia de Interés (Detonante):
                      </span>
                      <p className="text-[11px] font-semibold italic text-blue-950">
                        "{theExperienceText}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-700 block">
                        Acción de Indagación Docente:
                      </span>
                      <p className="text-[11px] text-slate-700 font-medium">
                        {momento1?.description || 'Provocación sensorial con objetos misteriosos, escucha atenta de hipótesis y círculo de preguntas.'}
                      </p>
                    </div>

                    {momento1?.strategiesAndVoices && momento1.strategiesAndVoices.length > 0 && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-600 uppercase block">Estrategias de Escucha y Asombro:</span>
                        <ul className="space-y-1 text-[11px] text-slate-700">
                          {momento1.strategiesAndVoices.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-1">
                              <span className="text-blue-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>

                  {/* CELDA 2: MOMENTO 2 (PROYECTAR) */}
                  <td className="p-4 border-r border-slate-200 align-top space-y-3 bg-indigo-50/15">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {momento2?.title || 'Acuerdos de Convivencia y Organización de Rutas'}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-indigo-950 block">
                        Proyección de Rutas y Ambientes:
                      </span>
                      <p className="text-[11px] text-slate-700 font-medium">
                        {momento2?.description || 'Asamblea para establecer pactos de aula, distribuir roles lúdicos y proyectar las estaciones exploratorias.'}
                      </p>
                    </div>

                    <div className="bg-indigo-50/80 p-2.5 rounded-xl border border-indigo-200 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-indigo-900 block flex items-center space-x-1">
                        <HeartHandshake className="w-3 h-3 text-indigo-700" />
                        <span>Acuerdos Pedagógicos:</span>
                      </span>
                      <p className="text-[11px] text-slate-700 font-medium">
                        Cuidado mutuo, uso compartido y respetuoso de materiales, turnos en el juego y escucha cariñosa.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-indigo-200 space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-black uppercase text-indigo-950 block">
                        Articulación Propósitos • Imprescindibles:
                      </span>
                      <ul className="space-y-1 text-[10px] text-slate-700">
                        {propositosArticulados.slice(0, 2).map((prop, pIdx) => (
                          <li key={pIdx} className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            <strong className="text-indigo-900 block">{prop.shortTitle}:</strong>
                            <span className="text-slate-600 line-clamp-2">{prop.imprescindibles[0]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>

                  {/* CELDA 3: MOMENTO 3 (VIVIR LA EXPERIENCIA) */}
                  <td className="p-4 border-r border-slate-200 align-top space-y-3 bg-amber-50/15">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {momento3?.title || 'Vivencia Lúdica y Talleres Activos'}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-950 block">
                        Acción Vivencial y Estaciones:
                      </span>
                      <p className="text-[11px] text-slate-700 font-medium">
                        {momento3?.description || 'Estaciones de juego simbólico, manipulación de texturas, modelado, danza o exploración del entorno.'}
                      </p>
                    </div>

                    {momento3?.strategiesAndVoices && momento3.strategiesAndVoices.length > 0 && (
                      <div className="bg-white p-2.5 rounded-xl border border-amber-200 space-y-1 shadow-2xs">
                        <span className="text-[10px] font-bold text-amber-900 uppercase block">Estaciones y Manipulación:</span>
                        <ul className="space-y-1 text-[11px] text-slate-700">
                          {momento3.strategiesAndVoices.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-1">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-[10px] text-slate-600 space-y-0.5">
                      <strong className="text-amber-950 block uppercase">Inclusión DUA:</strong>
                      <span>{plan.inclusionPIAR}</span>
                    </div>
                  </td>

                  {/* CELDA 4: MOMENTO 4 (CONSOLIDACIÓN) */}
                  <td className="p-4 border-r border-slate-200 align-top space-y-3 bg-purple-50/15">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {momento4?.title || 'Taller de Consolidación Creativa y Encuentro'}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-purple-950 block">
                        Socialización y Tejido Colectivo:
                      </span>
                      <p className="text-[11px] text-slate-700 font-medium">
                        {momento4?.description || 'Puesta en común de descubrimientos, ensamble del producto colectivo y círculo de relatos infantiles.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-purple-200 space-y-1 shadow-2xs">
                      <div className="text-[10px] font-black uppercase text-purple-900 flex items-center space-x-1">
                        <Target className="w-3 h-3 text-purple-700" />
                        <span>Producto Final Acumulado:</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 leading-snug">
                        {plan.expectedResult}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-200 text-[10px] text-slate-600 space-y-0.5">
                      <strong className="text-purple-950 block uppercase">Vínculo con la Familia:</strong>
                      <span>{plan.familyInvolvement}</span>
                    </div>
                  </td>

                  {/* CELDA 5: MOMENTO 5 (VALORACIÓN) */}
                  <td className="p-4 align-top space-y-3 bg-emerald-50/20">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {momento5?.title || 'Valorar el Proceso: Escucha Pedagógica y Registro'}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-emerald-950 block">
                        Círculo Dialógico y Seguimiento:
                      </span>
                      <p className="text-[11px] text-slate-700 font-medium">
                        {momento5?.description || 'Asamblea donde las niñas y los niños relatan sus descubrimientos con palabras, gestos y obras, valorando el proceso vivido sin calificaciones.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-emerald-300 space-y-1.5 shadow-2xs">
                      <span className="text-[10px] font-black uppercase text-emerald-950 block">
                        Instrumentos de Valoración Formativa:
                      </span>
                      <ul className="space-y-1 text-[11px] text-emerald-950 font-semibold">
                        <li className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                          <span>Diarios de Campo Pedagógicos</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                          <span>Bitácora de Aula y Viajera</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                          <span>Portafolio de Evidencias Infantiles</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                          <span>Estudio de Casos y Anecdotario</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-100/60 border border-emerald-200 text-[10px] text-emerald-950 font-medium">
                      Seguimiento sensible que visibiliza la singularidad y ritmos del desarrollo infantil, erradicando calificaciones numéricas.
                    </div>
                  </td>

                </tr>
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: ACTIVIDADES RECTORAS DETALLADAS EN ESTILO HORIZONTAL */}
      {(activeTab === 'rectoras' || activeTab === 'integral') && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">
                  Actividades Rectoras de la Primera Infancia (Detalladas en la Tabla Matriz)
                </h4>
                <p className="text-[11px] text-slate-600">
                  Exploración del Medio, Juego, Arte y Literatura: Mediación pedagógica del docente y vivencia activa de las niñas y niños
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase self-start sm:self-auto">
              Pilares Rectores MEN Colombia
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs bg-white">
            <table className="w-full min-w-[1300px] border-collapse text-left text-slate-800 table-fixed">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-900 text-xs">
                  
                  {/* EXPLORACIÓN DEL MEDIO */}
                  <th className="w-1/4 p-4 bg-emerald-50/90 border-r border-slate-300 align-top">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>1. EXPLORACIÓN DEL MEDIO</span>
                      </div>
                      <div className="text-[11px] font-black text-emerald-900">
                        Asombro, curiosidad y contacto directo
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Indagación de espacios, texturas, seres vivos y fenómenos cotidianos.
                      </p>
                    </div>
                  </th>

                  {/* JUEGO */}
                  <th className="w-1/4 p-4 bg-amber-50/90 border-r border-slate-300 align-top">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Gamepad2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>2. JUEGO</span>
                      </div>
                      <div className="text-[11px] font-black text-amber-900">
                        Gozoso, simbólico y cooperativo
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Juego libre, de roles, construcción y acuerdos lúdicos de convivencia.
                      </p>
                    </div>
                  </th>

                  {/* ARTE */}
                  <th className="w-1/4 p-4 bg-purple-50/90 border-r border-slate-300 align-top">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-purple-950 bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200">
                        <Palette className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                        <span>3. ARTE</span>
                      </div>
                      <div className="text-[11px] font-black text-purple-900">
                        Lenguajes expresivos y plásticos
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Pintura, modelado, danza, música, títeres y expresión espontánea.
                      </p>
                    </div>
                  </th>

                  {/* LITERATURA */}
                  <th className="w-1/4 p-4 bg-indigo-50/90 align-top">
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-indigo-950 bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200">
                        <BookMarked className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                        <span>4. LITERATURA</span>
                      </div>
                      <div className="text-[11px] font-black text-indigo-900">
                        Acervo de la palabra y oralidad
                      </div>
                      <p className="text-[10px] text-slate-600 font-normal leading-tight">
                        Lectura compartida, libros álbum, rimas, nanas y relatos infantiles.
                      </p>
                    </div>
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white text-xs leading-relaxed">
                
                {/* FILA 1: ENCABEZADO Y CONTENIDO DE MEDIACIÓN PEDAGÓGICA Y DOCENTE */}
                <tr className="bg-blue-50/90 border-y border-blue-200">
                  <td colSpan={4} className="py-2 px-4">
                    <div className="flex flex-wrap items-center space-x-2 text-xs font-black uppercase text-blue-950 tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>FILA 1 • PROPUESTA Y MEDIACIÓN PEDAGÓGICA DOCENTE</span>
                      <span className="text-[10px] font-medium text-blue-800 hidden sm:inline">
                        — Disposición de ambientes provocadores, preguntas detonantes, materiales y rol mediador
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  {actividadesRectoras.map((rec, rIdx) => {
                    const isExplor = rec.activity.toLowerCase().includes('explor');
                    const isJuego = rec.activity.toLowerCase().includes('juego');
                    const isArte = rec.activity.toLowerCase().includes('arte');
                    const badgeBg = isExplor ? 'bg-emerald-50 text-emerald-950 border-emerald-200' : isJuego ? 'bg-amber-50 text-amber-950 border-amber-200' : isArte ? 'bg-purple-50 text-purple-950 border-purple-200' : 'bg-indigo-50 text-indigo-950 border-indigo-200';
                    const iconColor = isExplor ? 'text-emerald-700' : isJuego ? 'text-amber-700' : isArte ? 'text-purple-700' : 'text-indigo-700';

                    return (
                      <td key={rIdx} className={`p-4 align-top space-y-3 ${rIdx < 3 ? 'border-r border-slate-200' : ''}`}>
                        <div className="space-y-1.5">
                          <span className={`inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${badgeBg}`}>
                            <Sparkles className={`w-3 h-3 ${iconColor}`} />
                            <span>Propuesta y Mediación Docente:</span>
                          </span>
                          <p className="text-[11px] text-slate-800 font-medium leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                            {rec.description}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* FILA 2: ENCABEZADO Y CONTENIDO DE CÓMO LO VIVENCIA, APLICA Y EXPERIMENTA EL NIÑO/A */}
                <tr className="bg-emerald-50/70 border-y border-emerald-200">
                  <td colSpan={4} className="py-2 px-4">
                    <div className="flex flex-wrap items-center space-x-2 text-xs font-black uppercase text-emerald-950 tracking-wide">
                      <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>FILA 2 • CÓMO LO VIVENCIA, APLICA Y EXPERIMENTA LA NIÑA O NIÑO</span>
                      <span className="text-[10px] font-medium text-emerald-800 hidden sm:inline">
                        — Acción infantil directa, asombro sensorial, juego simbólico, lenguajes expresivos y oralidad
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-slate-50/30">
                  {actividadesRectoras.map((rec, rIdx) => {
                    const isExplor = rec.activity.toLowerCase().includes('explor');
                    const isJuego = rec.activity.toLowerCase().includes('juego');
                    const isArte = rec.activity.toLowerCase().includes('arte');
                    const boxBorder = isExplor ? 'border-emerald-200 bg-emerald-50/40' : isJuego ? 'border-amber-200 bg-amber-50/40' : isArte ? 'border-purple-200 bg-purple-50/40' : 'border-indigo-200 bg-indigo-50/40';
                    const labelColor = isExplor ? 'text-emerald-900' : isJuego ? 'text-amber-900' : isArte ? 'text-purple-900' : 'text-indigo-900';

                    return (
                      <td key={rIdx} className={`p-4 align-top space-y-2 ${rIdx < 3 ? 'border-r border-slate-200' : ''}`}>
                        <div className={`p-3 rounded-xl border ${boxBorder} space-y-1.5 shadow-2xs`}>
                          <span className={`text-[10px] font-black uppercase ${labelColor} block`}>
                            Cómo lo Aplica y Vivencia la Niña o Niño:
                          </span>
                          <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                            {rec.howChildApplies}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* FILA 3: ENCABEZADO Y CONTENIDO DE DIMENSIÓN Y DESARROLLO SOCIOEMOCIONAL SINCRONIZADO */}
                <tr className="bg-rose-100/80 border-y border-rose-300">
                  <td colSpan={4} className="py-2 px-4">
                    <div className="flex flex-wrap items-center space-x-2 text-xs font-black uppercase text-rose-950 tracking-wide">
                      <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-200 shrink-0" />
                      <span>FILA 3 • DIMENSIÓN Y DESARROLLO SOCIOEMOCIONAL SINCRONIZADO (LEY 2503 • MEN)</span>
                      <span className="text-[10px] font-medium text-rose-800 hidden sm:inline">
                        — Seguridad afectiva, autorregulación emocional, empatía, buen trato y sincronización con los 5 momentos
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-rose-50/20">
                  {actividadesRectoras.map((rec, rIdx) => {
                    const socio = rectorasSocio[rIdx];
                    return (
                      <td key={rIdx} className={`p-4 align-top space-y-2.5 ${rIdx < 3 ? 'border-r border-slate-200' : ''}`}>
                        <div className="p-3 rounded-xl bg-white border border-rose-200 space-y-1.5 shadow-2xs">
                          <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase text-rose-900">
                            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-100 shrink-0" />
                            <span>Dimensión Socioemocional Sincronizada:</span>
                          </div>
                          <div className="text-[10.5px] font-black text-rose-900 bg-rose-50/80 px-2 py-0.5 rounded-md border border-rose-100 leading-snug">
                            {socio?.coreEmotion}
                          </div>
                          <p className="text-[10.5px] text-slate-700 leading-relaxed font-normal">
                            {rec.socioemotionalAspect || socio?.description}
                          </p>
                          {socio?.socioemotionalCapabilities && socio.socioemotionalCapabilities.length > 0 && (
                            <div className="pt-1 border-t border-rose-100 space-y-0.5">
                              <span className="text-[9px] font-bold uppercase text-rose-900 block">Capacidades Socioemocionales:</span>
                              <ul className="space-y-0.5 text-[9.5px] text-slate-600">
                                {socio.socioemotionalCapabilities.map((cap, cIdx) => (
                                  <li key={cIdx} className="flex items-start space-x-1">
                                    <span className="text-rose-500 font-bold">•</span>
                                    <span>{cap}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="pt-1.5 border-t border-rose-200/80 text-[9.5px] text-rose-950 font-bold flex flex-wrap items-start gap-1">
                            <span className="uppercase text-rose-900 shrink-0">⇄ Sincronizado con:</span>
                            <span className="font-semibold text-slate-700">{rec.momentSync || socio?.syncedMomentos}</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECCIÓN 3: MATRIZ DE SINCRONIZACIÓN SOCIOEMOCIONAL (5 MOMENTOS ↔ 4 ACTIVIDADES RECTORAS) */}
      {(activeTab === 'socioemocional' || activeTab === 'integral') && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-rose-600 text-white shadow-xs">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-rose-950 uppercase tracking-tight">
                  Matriz de Sincronización Socioemocional (Ley 2503 de 2025 • Decreto 1411 de 2022)
                </h4>
                <p className="text-[11px] text-rose-800">
                  Correspondencia armónica e indivisible entre los 5 Momentos Pedagógicos y las 4 Actividades Rectoras
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 self-start sm:self-auto">
              Ley 2503 • Educación Socioemocional
            </span>
          </div>

          {/* TABLA HORIZONTAL DE SINCRONIZACIÓN CRUZADA */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs bg-white">
            <table className="w-full min-w-[1250px] border-collapse text-left text-slate-800 table-fixed">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-900 text-xs bg-rose-50/80">
                  <th className="w-[18%] p-3.5 border-r border-slate-300 font-black uppercase text-rose-950">
                    Momento de la Experiencia
                  </th>
                  <th className="w-[22%] p-3.5 border-r border-slate-300 font-black uppercase text-rose-950">
                    Foco y Vivencia Socioemocional
                  </th>
                  <th className="w-[20%] p-3.5 border-r border-slate-300 font-black uppercase text-rose-950">
                    Actividades Rectoras Sincronizadas
                  </th>
                  <th className="w-[22%] p-3.5 border-r border-slate-300 font-black uppercase text-rose-950">
                    Sinergia Pedagógica en el Aula
                  </th>
                  <th className="w-[18%] p-3.5 font-black uppercase text-rose-950">
                    Prácticas de Cuidado y Buen Trato
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs leading-relaxed bg-white">
                {momentosSocio.map((mSocio, idx) => {
                  const cross = crossSocio[idx];
                  const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-rose-50/15';

                  return (
                    <tr key={idx} className={rowBg}>
                      {/* Momento */}
                      <td className="p-3.5 border-r border-slate-200 align-top space-y-1">
                        <div className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-950 border border-blue-200">
                          <span>{mSocio.momentoName}</span>
                        </div>
                        <div className="text-[11px] font-black text-slate-900">
                          {mSocio.subTitle}
                        </div>
                      </td>

                      {/* Foco Socioemocional */}
                      <td className="p-3.5 border-r border-slate-200 align-top space-y-1.5">
                        <div className="inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-200">
                          <Heart className="w-3 h-3 text-rose-600 fill-rose-100" />
                          <span>{mSocio.coreEmotion}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-700 leading-snug">
                          {mSocio.description}
                        </p>
                      </td>

                      {/* Rectoras Sincronizadas */}
                      <td className="p-3.5 border-r border-slate-200 align-top space-y-1.5">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10.5px] space-y-1">
                          <strong className="text-blue-950 block uppercase text-[10px]">Pilares Rectores Clave:</strong>
                          <span className="font-semibold text-slate-800">{mSocio.syncedRectoras}</span>
                        </div>
                      </td>

                      {/* Sinergia */}
                      <td className="p-3.5 border-r border-slate-200 align-top space-y-1">
                        <p className="text-[10.5px] text-slate-700 leading-snug italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/80">
                          "{cross?.synergy || 'Articulación armónica entre la vivencia lúdica y el florecimiento socioemocional.'}"
                        </p>
                      </td>

                      {/* Prácticas de Cuidado */}
                      <td className="p-3.5 align-top space-y-1">
                        <ul className="space-y-1 text-[10px] text-slate-700">
                          {mSocio.socioemotionalPractices.map((prac, pIdx) => (
                            <li key={pIdx} className="flex items-start space-x-1.5">
                              <span className="text-rose-600 font-bold">•</span>
                              <span className="leading-snug">{prac}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 4 PILARES SOCIOEMOCIONALES EN TARJETAS SINTÉTICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
            {rectorasSocio.map((rSocio, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-2xl border border-rose-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-rose-900 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {rSocio.activity}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-100" />
                </div>
                <h5 className="font-black text-slate-900 text-xs leading-snug">
                  {rSocio.coreEmotion}
                </h5>
                <p className="text-[10.5px] text-slate-600 leading-relaxed">
                  {rSocio.description}
                </p>
                <div className="pt-2 border-t border-rose-100 text-[9.5px] text-rose-950 font-bold">
                  <span>⇄ Momentos: {rSocio.syncedMomentos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 4: ARTICULACIÓN DE PROPÓSITOS DE EDUCACIÓN INICIAL CON IMPRESCINDIBLES */}
      {(activeTab === 'articulacion' || activeTab === 'integral') && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-indigo-950 uppercase tracking-tight">
                  Articulación Curricular: Propósitos de la Educación Inicial con Aprendizajes Imprescindibles
                </h4>
                <p className="text-[11px] text-indigo-800">
                  Relación explícita e inseparable entre los 4 propósitos del MEN y los aprendizajes que construyen los niños
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 self-start sm:self-auto">
              4 Propósitos MEN Colombia
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {propositosArticulados.map((item, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-2xs space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      Propósito {idx + 1}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-xs leading-snug">
                    {item.shortTitle || `Propósito ${idx + 1}`}
                  </h5>
                  <p className="text-[10px] text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{item.proposito}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-950 block">
                    Imprescindibles Articulados:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-700">
                    {item.imprescindibles.map((imp, iIdx) => (
                      <li key={iIdx} className="flex items-start space-x-1.5">
                        <span className="text-indigo-600 font-bold mt-0.5 shrink-0">•</span>
                        <span className="leading-snug">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* CONTENEDOR PRINCIPAL DE LA TABLA MATRIZ */}
      <div className={`bg-white rounded-3xl border-2 border-blue-900/40 shadow-xl overflow-hidden print:shadow-none print:border-slate-800 space-y-0 transition-all ${isExpandedMode ? 'ring-8 ring-blue-500/20' : ''}`}>
        
        {/* 1. BANNER PRINCIPAL DE LA TABLA CON CONTROLES INTEGRADOS */}
        <div className="bg-[#1e3a8a] text-white px-5 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-blue-950">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <TableIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-tight text-white uppercase">
                  RESUMEN TIPO TABLA • MATRIZ PEDAGÓGICA SINTÉTICA
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black uppercase">
                  Decreto 1411 • MEN
                </span>
              </div>
              <p className="text-xs text-blue-200">
                5 Momentos de la Experiencia y 4 Actividades Rectoras Detalladas en Estilo Horizontal
              </p>
            </div>
          </div>

          {/* BARRA DE HERRAMIENTAS: ZOOM, EXPANDIR Y DESCARGAR WORD */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* CONTROLES DE ZOOM DE LA TABLA */}
            <div className="flex items-center bg-blue-950/90 rounded-xl border border-blue-400/40 px-2 py-1 text-xs text-white shadow-inner">
              <span className="text-[10px] uppercase font-bold text-blue-300 mr-2 hidden sm:inline">
                Zoom:
              </span>
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 70}
                title="Alejar tabla (Reducir vista)"
                className="p-1 hover:bg-white/20 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5 text-blue-200" />
              </button>
              
              <button
                onClick={handleZoomReset}
                title="Restablecer zoom al 100%"
                className="px-2 py-0.5 text-[11px] font-extrabold hover:text-amber-300 transition-colors cursor-pointer"
              >
                {zoomLevel}%
              </button>
              
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 140}
                title="Acercar tabla (Ampliar vista)"
                className="p-1 hover:bg-white/20 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-blue-200" />
              </button>

              <button
                onClick={handleZoomReset}
                title="Restablecer (100%)"
                className="p-1 ml-1 hover:bg-white/20 rounded-md text-blue-300 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* BOTÓN DE EXPANDIR / PANTALLA COMPLETA HORIZONTAL */}
            <button
              onClick={() => setIsExpandedMode(!isExpandedMode)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-950/90 hover:bg-blue-900 border border-blue-400/40 text-blue-100 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              title={isExpandedMode ? 'Restaurar vista normal' : 'Expandir área de la tabla a pantalla horizontal amplia'}
            >
              {isExpandedMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Restaurar</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Área Horizontal</span>
                </>
              )}
            </button>

            {/* BOTÓN DESCARGAR WORD LEGAL CON MÁRGENES ESTRECHOS Y CALIBRI 10 */}
            <button
              onClick={handleDownloadWordLegal}
              disabled={isExportingDocx}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Descargar la matriz en Word (.docx) con hoja legal horizontal, márgenes estrechos y letra Calibri 10"
            >
              {isExportingDocx ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-blue-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Generando Word...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-800" />
                  <span>¡Descargado!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Word (Legal • Calibri 10)</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* 2. SELECTOR DE PESTAÑAS Y MODOS DE VISUALIZACIÓN */}
        <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Tabs principales */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('matriz')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'matriz'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>5 Momentos</span>
            </button>

            <button
              onClick={() => setActiveTab('rectoras')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'rectoras'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Actividades Rectoras (Detalladas)</span>
            </button>

            <button
              onClick={() => setActiveTab('socioemocional')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'socioemocional'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
              <span>Aspecto Socioemocional (Sincronizado)</span>
            </button>

            <button
              onClick={() => setActiveTab('articulacion')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'articulacion'
                  ? 'bg-[#1e3a8a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Propósitos e Imprescindibles</span>
            </button>

            <button
              onClick={() => setActiveTab('integral')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'integral'
                  ? 'bg-amber-400 text-blue-950 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-900" />
              <span>Matriz Integral (Todo en Uno)</span>
            </button>
          </div>

          {/* Información del Formato Legal y Zoom */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-600">
            <span className="inline-flex items-center space-x-1 font-semibold text-blue-950 bg-white px-2 py-1 rounded-lg border border-slate-200">
              <Info className="w-3 h-3 text-blue-600" />
              <span>Word: Hoja Legal Horizontal • Márgenes Estrechos (0.5") • Calibri 10pt</span>
            </span>
          </div>

        </div>

        {/* 3. BLOQUE DE IDENTIFICACIÓN Y EXPERIENCIA DE INTERÉS */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Identificación:</span>
            <div className="font-black text-slate-900 text-sm leading-snug">{plan.title}</div>
            <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
              <div><strong className="text-blue-900">Temática / Contenido:</strong> {plan.topic}</div>
              <div><strong className="text-blue-900">Grupo de Edad:</strong> {plan.ageRange} • <strong className="text-blue-900">Duración:</strong> {plan.duration}</div>
              <div><strong className="text-blue-900">Eje Relacional:</strong> {plan.relationalAxis}</div>
            </div>
          </div>

          <div className="md:col-span-8 bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 p-3.5 rounded-2xl border border-blue-200 shadow-2xs space-y-1.5 flex flex-col justify-center">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-blue-950 tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>Experiencia de Interés (Detonante Pedagógico Central):</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-blue-900 italic leading-snug">
              "{theExperienceText}"
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] text-slate-600">
              <span className="font-bold text-blue-950">Pilares Rectores Movilizados:</span>
              <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-semibold">1. Exploración del Medio</span>
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold">2. Juego</span>
              <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md font-semibold">3. Arte</span>
              <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md font-semibold">4. Literatura</span>
              <span className="bg-rose-100 text-rose-950 px-2 py-0.5 rounded-md font-bold inline-flex items-center space-x-1 border border-rose-300">
                <Heart className="w-2.5 h-2.5 text-rose-600 fill-rose-100" />
                <span>Aspecto Socioemocional Sincronizado</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4. CONTENIDO DE LA TABLA MATRIZ CON ZOOM APLICADO */}
        <div className="overflow-x-auto p-4 sm:p-6 bg-slate-100/60">
          <div 
            style={{ 
              zoom: zoomLevel !== 100 ? `${zoomLevel}%` : undefined,
              minWidth: `${Math.round(1350 * (zoomLevel / 100))}px`
            }}
            className="transition-all duration-200 space-y-6"
          >
            {renderTableContent()}
          </div>
        </div>

        {/* 5. FOOTER DE LA TABLA CON ACCIÓN DIRECTA DE DESCARGA */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#1e3a8a]">Matriz Oficial de los 5 Momentos y Actividades Rectoras:</span>
            <span>1. Indagar • 2. Proyectar • 3. Vivir la Experiencia • 4. Consolidación • 5. Valoración</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadWordLegal}
              disabled={isExportingDocx}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 underline flex items-center space-x-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>Descargar esta Matriz en formato Word (Legal / Calibri 10)</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-950 font-bold">
              Decreto 1411 de 2022 • Ley 2503 • Bases Curriculares MEN
            </span>
          </div>
        </div>

      </div>

      {/* MODAL EXPANDIDO DE PANTALLA COMPLETA HORIZONTAL (MAYOR ÁREA DE LA TABLA) */}
      {isExpandedMode && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm p-3 sm:p-6 flex flex-col overflow-hidden animate-in fade-in duration-200">
          
          {/* HEADER DEL MODAL PANORÁMICO */}
          <div className="bg-[#1e3a8a] text-white px-6 py-3 rounded-t-3xl flex flex-wrap items-center justify-between gap-3 shadow-xl shrink-0">
            <div className="flex items-center space-x-3">
              <TableIcon className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wide">
                  MODO HORIZONTAL PANORÁMICO • MÁXIMA ÁREA VISUAL DE LA TABLA MATRIZ
                </h3>
                <p className="text-[11px] text-blue-200">
                  {plan.title} • Decreto 1411 de 2022
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              
              {/* Zoom Controls dentro del Modal */}
              <div className="flex items-center bg-blue-950/90 rounded-xl border border-blue-400/40 px-2 py-1 text-xs text-white">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 70}
                  className="p-1 hover:bg-white/20 rounded-md cursor-pointer"
                  title="Alejar"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-blue-200" />
                </button>
                <button
                  onClick={handleZoomReset}
                  className="px-2 py-0.5 text-[11px] font-extrabold hover:text-amber-300 cursor-pointer"
                >
                  {zoomLevel}%
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 140}
                  className="p-1 hover:bg-white/20 rounded-md cursor-pointer"
                  title="Acercar"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-blue-200" />
                </button>
              </div>

              {/* Botón Descargar Word */}
              <button
                onClick={handleDownloadWordLegal}
                disabled={isExportingDocx}
                className="flex items-center space-x-2 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Word (Legal • Calibri 10)</span>
              </button>

              {/* Botón Cerrar Modal / Restaurar */}
              <button
                onClick={() => setIsExpandedMode(false)}
                className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Cerrar Vista Panorámica</span>
              </button>

            </div>
          </div>

          {/* CONTENEDOR EXPANDIDO CON SCROLL HORIZONTAL Y VERTICAL LIBRE */}
          <div className="flex-1 bg-slate-100 rounded-b-3xl overflow-auto p-4 sm:p-6 shadow-2xl">
            <div 
              style={{ 
                zoom: zoomLevel !== 100 ? `${zoomLevel}%` : undefined,
                minWidth: `${Math.round(1450 * (zoomLevel / 100))}px`
              }}
              className="space-y-6"
            >
              {renderTableContent()}
            </div>
          </div>

        </div>
      )}
    </>
  );
};
