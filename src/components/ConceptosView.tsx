import React, { useState } from 'react';
import { 
  Shapes, 
  Sparkles, 
  Download, 
  Eye, 
  X, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Heart, 
  Smile, 
  Palette, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Users, 
  Zap, 
  Loader2,
  Printer,
  Compass,
  Baby
} from 'lucide-react';
import { CONCEPTOS_PREDEFINIDOS, ConceptPlanUnit, convertConceptToPlan } from '../data/conceptosData';
import { exportConceptPlanToWord } from '../utils/exportWord';
import { Planification, AgeRange } from '../types';
import { createChildDetonatingQuestion } from '../utils/childQuestions';
import { PlanSummaryTable } from './PlanSummaryTable';

interface ConceptosViewProps {
  onImportToPlanner?: (plan: Planification) => void;
}

export const ConceptosView: React.FC<ConceptosViewProps> = ({ onImportToPlanner }) => {
  const [conceptList, setConceptList] = useState<ConceptPlanUnit[]>(CONCEPTOS_PREDEFINIDOS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeConceptModal, setActiveConceptModal] = useState<ConceptPlanUnit | null>(null);
  const [modalTab, setModalTab] = useState<'detalle' | 'tabla'>('detalle');

  // Form state for generating a new custom concept with AI
  const [customConceptName, setCustomConceptName] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [customAgeRange, setCustomAgeRange] = useState<AgeRange>('2 a 4 años');
  const [customCategory, setCustomCategory] = useState<ConceptPlanUnit['category']>('Pensamiento Matemático');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genSuccessMessage, setGenSuccessMessage] = useState<string | null>(null);

  const categories = [
    'Todos',
    'Pensamiento Matemático',
    'Comunicación',
    'Exploración del Medio',
    'Arte',
    'Juego'
  ];

  const filteredConcepts = conceptList.filter(c => {
    const matchesCat = selectedCategory === 'Todos' || c.category === selectedCategory;
    const matchesSearch = c.conceptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.guidingQuestion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.justification.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleGenerateCustomConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customConceptName.trim()) return;

    setIsGenerating(true);
    setGenSuccessMessage(null);

    let newUnit: ConceptPlanUnit | null = null;

    try {
      const response = await fetch('/api/generate-concept-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptName: customConceptName.trim(),
          ageRange: customAgeRange,
          category: customCategory,
          teacherPrompt: customPrompt.trim()
        })
      });

      if (response.ok) {
        newUnit = await response.json();
      }
    } catch (err) {
      console.warn('Error llamando API de concepto, usando generador local:', err);
    }

    if (!newUnit) {
      // Fallback local custom unit generator if API is offline or key missing
      const name = customConceptName.trim();
      newUnit = {
        id: `concepto-${Date.now()}`,
        conceptName: name,
        category: customCategory,
        icon: '✨',
        ageRange: customAgeRange,
        dimensions: ['COGNITIVA', 'COMUNICATIVA Y CREATIVA', 'CORPORAL'],
        aprendizajesImprescindibles: [
          `Reconoce y relaciona propiedades y atributos del concepto "${name}" en situaciones cotidianas.`,
          `Expresa vivencias, descubrimientos e interrogantes sobre "${name}" a través del juego y el dibujo.`,
          `Participa en experiencias colaborativas de exploración y construcción simbólica de "${name}".`
        ],
        propositoMEN: 'Propósito 3: Los niños y las niñas disfrutan aprendiendo, exploran y se relacionan con el mundo para comprenderlo y construirlo.',
        guidingQuestion: createChildDetonatingQuestion(name, customPrompt),
        justification: `El trabajo pedagógico centrado en "${name}" estimula el pensamiento estructurado, la indagación y la asimilación vivencial en la primera infancia, en consonancia con el Decreto 1411 de 2022 y las Bases Curriculares del MEN.`,
        sensoryProvocation: {
          title: `Momento 1: Provocación Sensorial y Sorpresa con "${name}"`,
          description: `Rincón de exploración con caja misteriosa, texturas, objetos reales y estímulos sonoros centrados en "${name}".`,
          materials: ['Caja mística', 'Material concreto del medio', 'Tarjetas táctiles', 'Cuento corto o canción']
        },
        guidedExploration: {
          title: `Momento 2: Estaciones de Descubrimiento y Juego con "${name}"`,
          description: `Circuito de estaciones de aprendizaje donde los niños clasifican, agrupan y experimentan con "${name}".`,
          materials: ['Masa o plastilina casera', 'Bloques de construcción', 'Espejos o lupas', 'Papel e instrumentos de dibujo']
        },
        creativeConsolidation: customCategory === 'Pensamiento Matemático' ? {
          title: `Momento 3: Maqueta Tridimensional y Circuito de Retos de "${name}"`,
          description: `Construcción colectiva de maquetas o esculturas 3D y circuito de piso donde los niños resuelven desafíos lúdicos sobre "${name}".`,
          materials: ['Cajas de cartón', 'Bloques de madera', 'Cinta de piso', 'Lanas y conos']
        } : customCategory === 'Comunicación' ? {
          title: `Momento 3: Libro Gigante Colectivo de Telas y Dramatización de "${name}"`,
          description: `Creación de páginas en relieve para el Libro Vivo del Aula y escenificación de un mini-teatro sobre "${name}".`,
          materials: ['Retazos de tela', 'Títeres de mano', 'Lanas', 'Cartulina gruesa']
        } : customCategory === 'Exploración del Medio' ? {
          title: `Momento 3: Museo de Hallazgos y Terrario Sensorial sobre "${name}"`,
          description: `Montaje de un museo pedagógico de objetos curiosos y rincones vivos donde comparten sus descubrimientos sobre "${name}".`,
          materials: ['Frascos transparentes', 'Lupas', 'Cajas organizadoras', 'Elementos de la naturaleza']
        } : customCategory === 'Arte' ? {
          title: `Momento 3: Galería de Esculturas e Instalación de Luz y Sombras sobre "${name}"`,
          description: `Exposición de ensamblajes en material reciclable e instalación lumínica que proyecta siluetas del concepto "${name}".`,
          materials: ['Materiales reutilizables', 'Linternas', 'Papeles transparentes', 'Arcilla o masa']
        } : {
          title: `Momento 3: Festival de Roles y Carnaval Vivencial de "${name}"`,
          description: `Encuentro festivo donde los niños caracterizan roles, comparten juegos simbólicos y expresan lo vivido sobre "${name}".`,
          materials: ['Accesorios de disfraces', 'Instrumentos sonoros', 'Música infantil', 'Sombreros de papel']
        },
        evaluativeDescriptors: [
          `Muestra curiosidad por explorar e identificar características de "${name}".`,
          `Nombra o representa el concepto de "${name}" en actividades lúdicas y artísticas.`,
          `Relaciona el concepto "${name}" con objetos de su aula o su hogar.`
        ],
        adaptationsDUA: 'Uso de pictogramas de alta visibilidad, apoyos táctiles con relieve y tiempos flexibles.',
        familyActivity: `Reto en Familia: Identificar 2 objetos o momentos en casa vinculados a "${name}" y compartir un dibujo o foto.`,
        rectorActivities: [
          {
            activity: 'Exploración del Medio',
            description: `Rincón de indagación sensorial y manipulación de elementos concretos para explorar "${name}".`,
            howChildApplies: `El niño/a manipula, toca texturas, compara tamaños y formula preguntas espontáneas sobre "${name}".`
          },
          {
            activity: 'Juego',
            description: `Circuitos psicomotores y dinámicas lúdicas de roles estructurados en torno a "${name}".`,
            howChildApplies: `El niño/a interactúa con sus pares, respeta acuerdos sencillos y resuelve retos motrices y cognitivos.`
          },
          {
            activity: 'Arte',
            description: `Taller de expresión plástica, dactilopintura y modelado tridimensional con masa sobre "${name}".`,
            howChildApplies: `El niño/a estampa huellas, moldea figuras y plasma con colores vivos lo aprendido sobre "${name}".`
          },
          {
            activity: 'Literatura',
            description: `Lectura interactiva de cuentos ilustrados, rimas sonoras y adivinanzas temáticas de "${name}".`,
            howChildApplies: `El niño/a escucha historias, "lee" ilustraciones y narra pequeñas anécdotas con sus propias palabras.`
          }
        ]
      };
    }

    setConceptList([newUnit, ...conceptList]);
    setActiveConceptModal(newUnit);
    setCustomConceptName('');
    setGenSuccessMessage(`¡Unidad de Planificación por concepto "${newUnit.conceptName}" creada con éxito!`);
    
    setTimeout(() => setGenSuccessMessage(null), 5000);
    setIsGenerating(false);
  };

  const handleExportWord = async (unit: ConceptPlanUnit) => {
    try {
      await exportConceptPlanToWord(unit);
    } catch (err) {
      console.error('Error exportando Word:', err);
      alert('Error al descargar el archivo Word.');
    }
  };

  const convertToPlanification = (unit: ConceptPlanUnit): Planification => {
    return convertConceptToPlan(unit);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-700/40 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Shapes className="w-3.5 h-3.5 text-blue-300" />
            <span>Planificación por Conceptos Clave • Decreto 1411</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Planificación Didáctica Centrada en Conceptos
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Estructura unidades pedagógicas vivenciales enfocadas en conceptos esenciales de la educación inicial (ej: <strong>El Cuadrado</strong>, <strong>La Familia</strong>, <strong>Mi Cuerpo</strong>, <strong>Los Colores</strong>, <strong>Números 1 al 5</strong>). Integra las Experiencias Rectoras, Aprendizajes Imprescindibles y actividades sensoriales en las I.E. del municipio de San Pedro (Sucre).
          </p>
        </div>
      </div>

      {/* GENERADOR DE CONCEPTOS CON IA */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Generador de Planificación por CUALQUIER Concepto</h3>
            <p className="text-xs text-slate-500">Escribe el concepto que deseas trabajar en el aula (ej: El Triángulo, El Agua, Los Alimentos, Las Emociones, El Reciclaje) y la IA estructurará la unidad pedagógica.</p>
          </div>
        </div>

        {genSuccessMessage && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold rounded-xl flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{genSuccessMessage}</span>
          </div>
        )}

        <form onSubmit={handleGenerateCustomConcept} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Concepto a Trabajar:</label>
            <input
              type="text"
              value={customConceptName}
              onChange={(e) => setCustomConceptName(e.target.value)}
              placeholder="Ej: El Cuadrado, La Familia, Mi Cuerpo, El Círculo, El Agua..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-medium text-slate-900 placeholder-slate-400"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">Categoría Pedagógica:</label>
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-medium text-slate-900 bg-white"
            >
              <option value="Pensamiento Matemático">Pensamiento Matemático</option>
              <option value="Comunicación">Comunicación</option>
              <option value="Exploración del Medio">Exploración del Medio</option>
              <option value="Arte">Arte</option>
              <option value="Juego">Juego</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Edad:</label>
            <select
              value={customAgeRange}
              onChange={(e) => setCustomAgeRange(e.target.value as AgeRange)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-medium text-slate-900 bg-white"
            >
              <option value="0 a 2 años">0 a 2 años</option>
              <option value="2 a 4 años">2 a 4 años</option>
              <option value="4 a 6 años">4 a 6 años</option>
            </select>
          </div>

          <div className="sm:col-span-10">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Ideas Pedagógicas y Prompt Personalizado (Opcional):</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Personaliza los momentos y materiales</span>
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ej: 'Priorizar materiales de la naturaleza (hojas, piedras), dinámicas de dramatización y rondas infantiles tradicionales...'"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-medium text-slate-900 placeholder-slate-400 bg-white"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isGenerating || !customConceptName.trim()}
              className="w-full h-[38px] bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] hover:from-[#172554] hover:to-[#1e3a8a] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generar Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* BUSCADOR Y FILTROS POR CATEGORÍA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categorías */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1e3a8a] text-white shadow-sm ring-2 ring-blue-600/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar concepto..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* GRID DE CONCEPTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((unit) => (
          <div 
            key={unit.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Card Top Header */}
            <div className="p-5 space-y-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-3xl p-2 rounded-2xl bg-blue-50 border border-blue-100 shrink-0">
                  {unit.icon}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {unit.category}
                </span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#1e3a8a] transition-colors">
                  {unit.conceptName}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Rango: {unit.ageRange}
                </p>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-950 italic leading-relaxed">
                "{unit.guidingQuestion}"
              </div>
            </div>

            {/* Card Body highlights */}
            <div className="p-5 space-y-3 text-xs text-slate-600 flex-1">
              <div>
                <span className="font-bold text-slate-800 block mb-1">Propósito MEN:</span>
                <p className="line-clamp-2 text-slate-600 text-[11px] leading-relaxed">
                  {unit.propositoMEN}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Desarrollo de Experiencias:</span>
                <ul className="space-y-1 text-[11px]">
                  <li className="flex items-center space-x-1.5 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                    <span className="truncate">{unit.sensoryProvocation.title}</span>
                  </li>
                  <li className="flex items-center space-x-1.5 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                    <span className="truncate">{unit.guidedExploration.title}</span>
                  </li>
                  <li className="flex items-center space-x-1.5 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                    <span className="truncate">{unit.creativeConsolidation.title}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveConceptModal(unit)}
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-700" />
                <span>Ver Plan</span>
              </button>

              <button
                onClick={() => handleExportWord(unit)}
                className="py-2 px-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                title="Descargar en formato Word (.docx)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Word</span>
              </button>

              {onImportToPlanner && (
                <button
                  onClick={() => onImportToPlanner(convertToPlanification(unit))}
                  className="py-2 px-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  title="Abrir en Planificador Principal"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL / DRAWER DETALLE DEL CONCEPTO */}
      {activeConceptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 p-6 sm:p-8 relative">
            
            {/* Close button */}
            <button
              onClick={() => setActiveConceptModal(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header del Modal */}
            <div className="flex items-start space-x-4 border-b border-slate-100 pb-5 pr-10">
              <span className="text-4xl p-3 bg-blue-50 rounded-2xl border border-blue-100 shrink-0">
                {activeConceptModal.icon}
              </span>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    {activeConceptModal.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    • Rango: {activeConceptModal.ageRange}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {activeConceptModal.conceptName}
                </h3>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/80 p-4 rounded-2xl border border-blue-200/80">
              <div className="text-xs font-bold text-blue-950">
                Ficha Didáctica por Concepto Clave
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExportWord(activeConceptModal)}
                  className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Word (.docx)</span>
                </button>
                {onImportToPlanner && (
                  <button
                    onClick={() => {
                      onImportToPlanner(convertToPlanification(activeConceptModal));
                      setActiveConceptModal(null);
                    }}
                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Abrir en Planificador</span>
                  </button>
                )}
              </div>
            </div>

            {/* Selector de Vista: Ficha Detallada vs Resumen Tipo Tabla (5 Momentos) */}
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setModalTab('detalle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'detalle'
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ficha Pedagógica
              </button>
              <button
                onClick={() => setModalTab('tabla')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  modalTab === 'tabla'
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                <span>Resumen Tipo Tabla (5 Momentos)</span>
                <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">MEN</span>
              </button>
            </div>

            {modalTab === 'tabla' ? (
              <div className="pt-2 animate-fadeIn">
                <PlanSummaryTable plan={convertToPlanification(activeConceptModal)} />
              </div>
            ) : (
              <>
            {/* Experiencia de Interés (Pregunta Detonante de los Niños) */}
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-950 space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 block">
                Experiencia de Interés (Pregunta Detonante en Indagar):
              </span>
              <p className="text-sm font-bold italic text-blue-950">
                "{activeConceptModal.guidingQuestion}"
              </p>
            </div>

            {/* Justificación Pedagógica */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>Justificación Pedagógica (Decreto 1411 de 2022)</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                {activeConceptModal.justification}
              </p>
            </div>

            {/* Propósito y Aprendizajes Imprescindibles */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                <span>Propósito y Aprendizajes Imprescindibles</span>
              </h4>
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 space-y-2 text-xs">
                <p className="font-bold text-blue-950">
                  {activeConceptModal.propositoMEN}
                </p>
                <ul className="space-y-1 pl-1">
                  {activeConceptModal.aprendizajesImprescindibles.map((app, idx) => (
                    <li key={idx} className="text-slate-700 flex items-start space-x-1.5">
                      <span className="text-blue-700 font-bold mt-0.5">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Desarrollo de Momentos / Experiencias */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Desarrollo de la Experiencia Pedagógica
              </h4>

              {/* Momento 1 */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2 text-xs">
                <div className="font-bold text-blue-950 text-sm">
                  1. {activeConceptModal.sensoryProvocation.title}
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {activeConceptModal.sensoryProvocation.description}
                </p>
                <div className="text-[11px] text-blue-900 font-medium">
                  <strong>Materiales:</strong> {activeConceptModal.sensoryProvocation.materials.join(', ')}
                </div>
              </div>

              {/* Momento 2 */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2 text-xs">
                <div className="font-bold text-teal-950 text-sm">
                  2. {activeConceptModal.guidedExploration.title}
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {activeConceptModal.guidedExploration.description}
                </p>
                <div className="text-[11px] text-teal-900 font-medium">
                  <strong>Materiales:</strong> {activeConceptModal.guidedExploration.materials.join(', ')}
                </div>
              </div>

              {/* Momento 3 */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2 text-xs">
                <div className="font-bold text-indigo-950 text-sm">
                  3. {activeConceptModal.creativeConsolidation.title}
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {activeConceptModal.creativeConsolidation.description}
                </p>
                <div className="text-[11px] text-indigo-900 font-medium">
                  <strong>Materiales:</strong> {activeConceptModal.creativeConsolidation.materials.join(', ')}
                </div>
              </div>
            </div>

            {/* Actividades Rectoras y Vivencia del Niño/a (Decreto 1411 de 2022) */}
            {activeConceptModal.rectorActivities && activeConceptModal.rectorActivities.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    <span>Actividades Rectoras y Vivencia Infantil (Decreto 1411 de 2022)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
                    4 Pilares
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {activeConceptModal.rectorActivities.map((act, idx) => {
                    const isMedio = act.activity.toLowerCase().includes('medio') || act.activity.toLowerCase().includes('explor');
                    const isJuego = act.activity.toLowerCase().includes('juego');
                    const isArte = act.activity.toLowerCase().includes('arte');

                    const theme = isMedio
                      ? { bg: 'bg-emerald-50/50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-900', icon: <Compass className="w-3.5 h-3.5 text-emerald-700" />, childBg: 'bg-emerald-100/60 text-emerald-950 border-emerald-300' }
                      : isJuego
                      ? { bg: 'bg-amber-50/50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-900', icon: <Smile className="w-3.5 h-3.5 text-amber-700" />, childBg: 'bg-amber-100/60 text-amber-950 border-amber-300' }
                      : isArte
                      ? { bg: 'bg-purple-50/50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-900', icon: <Palette className="w-3.5 h-3.5 text-purple-700" />, childBg: 'bg-purple-100/60 text-purple-950 border-purple-300' }
                      : { bg: 'bg-indigo-50/50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-900', icon: <BookOpen className="w-3.5 h-3.5 text-indigo-700" />, childBg: 'bg-indigo-100/60 text-indigo-950 border-indigo-300' };

                    return (
                      <div key={idx} className={`p-3.5 rounded-xl border ${theme.border} ${theme.bg} space-y-2 flex flex-col justify-between`}>
                        <div className="space-y-1">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${theme.badge}`}>
                            {theme.icon}
                            <span>{act.activity}</span>
                          </span>
                          <p className="text-xs text-slate-700 leading-snug">
                            {act.description}
                          </p>
                        </div>
                        <div className={`p-2 rounded-lg border ${theme.childBg} text-[11px] space-y-0.5`}>
                          <span className="font-extrabold block flex items-center space-x-1">
                            <Baby className="w-3 h-3 shrink-0" />
                            <span>¿Cómo lo aplica el niño/a?:</span>
                          </span>
                          <p className="leading-snug">{act.howChildApplies}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Descriptores Cualitativos para Valorar el Proceso */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Descriptores Cualitativos para Valorar el Proceso (Diario de Campo / Observador)
              </h4>
              <ul className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800">
                {activeConceptModal.evaluativeDescriptors.map((desc, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DUA y Familia */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200/80">
                <span className="font-bold text-purple-950 block mb-1">Ajustes DUA / Inclusión:</span>
                <p className="text-slate-700">{activeConceptModal.adaptationsDUA}</p>
              </div>
              <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200/80">
                <span className="font-bold text-rose-950 block mb-1">Vinculación Familiar:</span>
                <p className="text-slate-700">{activeConceptModal.familyActivity}</p>
              </div>
            </div>
            </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
