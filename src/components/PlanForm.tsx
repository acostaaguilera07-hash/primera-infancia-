import React, { useState } from 'react';
import { 
  Calendar, 
  Folder, 
  Shapes,
  GraduationCap, 
  Baby, 
  Smile, 
  Check, 
  Sparkles, 
  ArrowRight,
  Leaf,
  Globe,
  Brain,
  MessageSquare,
  Activity,
  Music,
  Shield,
  Clock,
  Heart,
  FileText,
  Loader2,
  BookOpen,
  Lightbulb,
  Wand2,
  MessageSquareText,
  Trash2,
  HelpCircle,
  Info,
  Sliders
} from 'lucide-react';
import { PlanType, AgeRange, DimensionType, Planification } from '../types';
import { DEFAULT_PLANS } from '../data/defaultPlans';
import { CONCEPTOS_PREDEFINIDOS, convertConceptToPlan } from '../data/conceptosData';

interface PlanFormProps {
  onGeneratePlan: (
    type: PlanType, 
    ageRange: AgeRange, 
    dimensions: DimensionType[], 
    topic: string, 
    propositosMEN: string[],
    teacherPrompt?: string
  ) => void;
  onSelectPrebuiltPlan: (plan: Planification) => void;
  isLoading: boolean;
}

export const PlanForm: React.FC<PlanFormProps> = ({
  onGeneratePlan,
  onSelectPrebuiltPlan,
  isLoading
}) => {
  const [activeType, setActiveType] = useState<PlanType>('clase');
  const [selectedAge, setSelectedAge] = useState<AgeRange>('2 a 4 años');
  const [selectedDimensions, setSelectedDimensions] = useState<DimensionType[]>([
    'AMBIENTAL',
    'SOCIOEMOCIONAL',
    'CORPORAL',
    'COMUNICATIVA Y CREATIVA'
  ]);
  const [selectedPropositos, setSelectedPropositos] = useState<string[]>([
    'Propósito 1: Identidad, Autonomía y Pertenencia',
    'Propósito 2: Comunicación Activa y Lenguajes',
    'Propósito 3: Indagación y Relación con el Mundo',
    'Propósito 4: Descubrimiento de Sí Mismos, Espacio, Territorio y Movimiento Libre'
  ]);
  const [topic, setTopic] = useState<string>('el movimiento');
  const [teacherPrompt, setTeacherPrompt] = useState<string>('');
  const [showPromptGuide, setShowPromptGuide] = useState<boolean>(false);

  const propositosMENList = [
    {
      id: 'Propósito 1: Identidad, Autonomía y Pertenencia',
      title: 'Propósito 1: Identidad y Pertenencia',
      description: 'Construcción de identidad, seguridad afectiva, autonomía y pertenencia familiar y cultural.'
    },
    {
      id: 'Propósito 2: Comunicación Activa y Lenguajes',
      title: 'Propósito 2: Comunicación Activa',
      description: 'Expresión verbal, corporizada y artística, literatura, imaginación y representación de la realidad.'
    },
    {
      id: 'Propósito 3: Indagación y Relación con el Mundo',
      title: 'Propósito 3: Indagación y Aprendizaje',
      description: 'Curiosidad natural, asombro, exploración del entorno, pensamiento lógico y cuidado del medio ambiente.'
    },
    {
      id: 'Propósito 4: Descubrimiento de Sí Mismos, Espacio, Territorio y Movimiento Libre',
      title: 'Propósito 4: Espacio, Territorio y Movimiento',
      description: 'Descubrimiento de sí mismos, apropiación del espacio y territorio, y expresión a través del cuerpo y movimiento libre con los otros.'
    }
  ];

  const toggleProposito = (propId: string) => {
    if (selectedPropositos.includes(propId)) {
      if (selectedPropositos.length > 1) {
        setSelectedPropositos(selectedPropositos.filter(p => p !== propId));
      }
    } else {
      setSelectedPropositos([...selectedPropositos, propId]);
    }
  };

  const dimensionList: { id: DimensionType; label: string; icon: React.ReactNode }[] = [
    { id: 'AMBIENTAL', label: 'AMBIENTAL', icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'CIUDADANA Y POLÍTICA', label: 'CIUDADANA Y POLÍTICA', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'COGNITIVA', label: 'COGNITIVA', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'COMUNICATIVA Y CREATIVA', label: 'COMUNICATIVA Y CREATIVA', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'CORPORAL', label: 'CORPORAL', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'CULTURAL', label: 'CULTURAL', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'ÉTICA', label: 'ÉTICA', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'HISTÓRICA Y DE MEMORIA HISTÓRICA', label: 'HISTÓRICA Y DE MEMORIA HISTÓRICA', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'SOCIOEMOCIONAL', label: 'SOCIOEMOCIONAL', icon: <Heart className="w-3.5 h-3.5" /> }
  ];

  const toggleDimension = (dim: DimensionType) => {
    if (selectedDimensions.includes(dim)) {
      if (selectedDimensions.length > 1) {
        setSelectedDimensions(selectedDimensions.filter(d => d !== dim));
      }
    } else {
      setSelectedDimensions([...selectedDimensions, dim]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGeneratePlan(
      activeType, 
      selectedAge, 
      selectedDimensions, 
      topic.trim(), 
      selectedPropositos,
      teacherPrompt.trim()
    );
  };

  const PROMPT_IDEAS = [
    { id: 'patio', text: 'Exploración sensorial al aire libre y recolección en el patio escolar', icon: '🌿' },
    { id: 'titeres', text: 'Teatro de títeres, juego dramático de roles y caracterización infantil', icon: '🎭' },
    { id: 'reciclaje', text: 'Construcción con cajas de cartón, botellas sensoriales y tapas reutilizables', icon: '♻️' },
    { id: 'sabana', text: 'Saberes culturales de San Pedro y Sucre (música de viento, tradiciones campesinas y sabana)', icon: '🌴' },
    { id: 'musica', text: 'Rondas, nanas y cantos tradicionales con percusión corporal', icon: '🎶' },
    { id: 'dua', text: 'Ajustes DUA: materiales táctiles de alto relieve y apoyos en pictogramas', icon: '♿' },
    { id: 'familia', text: 'Reto en casa: bitácora viajera o relato compartido con padres y abuelos', icon: '👨‍👩‍👧' },
    { id: 'emociones', text: 'Rincón de la calma, botella de la paz y asamblea de resolución afectiva', icon: '🧘' }
  ];

  const handleAddPromptIdea = (ideaText: string) => {
    setTeacherPrompt((prev) => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) {
        return `Priorizar: ${ideaText}.`;
      }
      if (cleanPrev.includes(ideaText)) {
        return cleanPrev;
      }
      return `${cleanPrev}\n- ${ideaText}.`;
    });
  };

  // Theme color accents based on active tab (royal blue for clase, deep blue for proyecto, sky/cyan for contenido)
  const tabColorClass = activeType === 'clase'
    ? 'bg-[#1e3a8a] hover:bg-[#1d4ed8]'
    : activeType === 'proyecto'
    ? 'bg-[#1e40af] hover:bg-[#1d4ed8]'
    : 'bg-[#0369a1] hover:bg-[#0284c7]';

  const suggestions = activeType === 'clase' ? [
    'Me relaciono con afecto en mi entorno',
    'Amigos del medio ambiente "Soy Ecotierno"',
    'El país donde vivo - Colombia tierra querida',
    'Recreando el cuento aprendo',
    'el movimiento',
    'los seres vivos y las emociones'
  ] : activeType === 'proyecto' ? [
    'Proyecto 1: Me relaciono con afecto en mi entorno',
    'Proyecto 2: Amigos del medio ambiente "Soy Ecotierno"',
    'Proyecto 3: El país donde vivo - Colombia tierra querida',
    'Proyecto 4: Recreando el cuento aprendo'
  ] : [
    'El cuadrado y las formas geométricas',
    'La familia, afecto y mi entorno social',
    'Los colores primarios y la mezcla mágica',
    'El agua, la lluvia y sus transformaciones'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-800 text-xs font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>I.E. DEL MUNICIPIO DE SAN PEDRO • PPEI 2026</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Planificador Integral de Primera Infancia
        </h2>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Experiencias y proyectos pedagógicos alineados con el <span className="text-[#1e3a8a] font-bold">Decreto 1411 de 2022</span>, la <span className="text-blue-700 font-bold">Ley 2503 de 2025</span> y el <span className="text-[#0369a1] font-bold">PPEI Institucional</span>.
        </p>
      </div>

      {/* Main Form Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden transition-all">
        
        {/* Top Type Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 bg-slate-50/50">
          
          <button
            type="button"
            onClick={() => {
              setActiveType('clase');
              setTopic('Me relaciono con afecto en mi entorno');
            }}
            className={`py-4 px-3 flex flex-col items-center justify-center space-y-1 transition-all border-b-2 ${
              activeType === 'clase'
                ? 'border-[#1e3a8a] bg-white text-[#1e3a8a] font-extrabold shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs sm:text-sm">Experiencia / Sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('proyecto');
              setTopic('Me relaciono con afecto en mi entorno');
            }}
            className={`py-4 px-3 flex flex-col items-center justify-center space-y-1 transition-all border-b-2 ${
              activeType === 'proyecto'
                ? 'border-[#1e40af] bg-white text-[#1e40af] font-extrabold shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Folder className="w-5 h-5" />
            <span className="text-xs sm:text-sm">Proyecto Pedagógico PPEI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('contenido');
              setTopic('El cuadrado y las formas geométricas');
            }}
            className={`py-4 px-3 flex flex-col items-center justify-center space-y-1 transition-all border-b-2 ${
              activeType === 'contenido'
                ? 'border-[#0369a1] bg-white text-[#0369a1] font-extrabold shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
            }`}
          >
            <Shapes className="w-5 h-5" />
            <span className="text-xs sm:text-sm">Planeación de Contenidos</span>
          </button>

        </div>

        {/* Tab Description Banner */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-100">
          <div className="flex items-center space-x-3 text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm">
            {activeType === 'clase' && (
              <>
                <Calendar className="w-5 h-5 text-[#1e3a8a] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">PLANIFICAR EXPERIENCIA / SESIÓN PEDAGÓGICA</div>
                  <div className="text-xs text-slate-500">Sesión vivencial estructurada en 5 Momentos de la Experiencia: Indagar, Proyectar, Vivir la experiencia, Consolidación y Valorar el proceso.</div>
                </div>
              </>
            )}
            {activeType === 'proyecto' && (
              <>
                <Folder className="w-5 h-5 text-[#1e40af] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#1e40af] uppercase tracking-wider">PROYECTO PEDAGÓGICO DE AULA (PPEI 2026)</div>
                  <div className="text-xs text-slate-500">Estructurado en 5 fases metodológicas: Indagar, Proyectar, Vivir la Experiencia, Consolidación Creativa y Valorar el Proceso (20 horas/semana).</div>
                </div>
              </>
            )}
            {activeType === 'contenido' && (
              <>
                <Shapes className="w-5 h-5 text-[#0369a1] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">PLANEACIÓN DE CONTENIDOS Y CONCEPTOS CLAVE</div>
                  <div className="text-xs text-slate-500">Unidades didácticas articuladas con los 5 momentos y la matriz resumen tipo tabla de Educación Inicial.</div>
                </div>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* 1. RANGO DE EDAD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              1. RANGO DE EDAD / GRADO
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <button
                type="button"
                onClick={() => setSelectedAge('0 a 2 años')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all ${
                  selectedAge === '0 a 2 años'
                    ? `border-blue-600 bg-blue-50/80 text-blue-950 shadow-sm ring-2 ring-blue-500/20`
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Baby className="w-4 h-4 text-blue-600" />
                  <span>0 a 2 años (Caminadores)</span>
                </div>
                {selectedAge === '0 a 2 años' && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedAge('2 a 4 años')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all ${
                  selectedAge === '2 a 4 años'
                    ? `border-blue-600 bg-blue-50/80 text-blue-950 shadow-sm ring-2 ring-blue-500/20`
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Smile className="w-4 h-4 text-blue-600" />
                  <span>2 a 4 años (Párvulos / Prejardín)</span>
                </div>
                {selectedAge === '2 a 4 años' && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedAge('4 a 6 años')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all ${
                  selectedAge === '4 a 6 años'
                    ? `border-blue-600 bg-blue-50/80 text-blue-950 shadow-sm ring-2 ring-blue-500/20`
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>4 a 6 años (Jardín / Transición)</span>
                </div>
                {selectedAge === '4 a 6 años' && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>

            </div>
          </div>

          {/* 2. EL SER */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. DIMENSIONES DEL DESARROLLO (LINEAMIENTOS 2026)
              </label>
              <span className="text-xs text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {selectedDimensions.length} seleccionadas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {dimensionList.map((dim) => {
                const isSelected = selectedDimensions.includes(dim.id);
                return (
                  <button
                    key={dim.id}
                    type="button"
                    onClick={() => toggleDimension(dim.id)}
                    className={`flex items-center space-x-2 p-3 rounded-xl text-left text-xs font-bold tracking-tight transition-all uppercase ${
                      isSelected
                        ? activeType === 'clase'
                          ? 'bg-[#1e3a8a] text-white shadow-md'
                          : activeType === 'proyecto'
                          ? 'bg-[#1e40af] text-white shadow-md'
                          : 'bg-[#0369a1] text-white shadow-md'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="shrink-0">{dim.icon}</span>
                    <span className="truncate">{dim.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. PROPÓSITOS DE LA FORMACIÓN INTEGRAL (MEN COLOMBIA) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. PROPÓSITOS DE LA FORMACIÓN INTEGRAL (MEN COLOMBIA)
              </label>
              <span className="text-xs text-blue-800 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {selectedPropositos.length} de {propositosMENList.length} seleccionados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {propositosMENList.map((item) => {
                const isSelected = selectedPropositos.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleProposito(item.id)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all space-y-2 ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 text-blue-950 shadow-sm ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug pr-2">
                        {item.title}
                      </h4>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] mt-0.5 ${
                        isSelected ? 'bg-blue-700 text-white font-bold' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. TEMA O CONTENIDO CONCEPTUAL DE LOS NIÑOS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {activeType === 'contenido' ? '4. CONTENIDO O SABER CONCEPTUAL' : '4. TEMA O INTERÉS DE LOS NIÑOS (PROYECTO PPEI)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Sparkles className={`w-4 h-4 ${activeType === 'contenido' ? 'text-[#0369a1]' : activeType === 'proyecto' ? 'text-[#1e40af]' : 'text-blue-600'}`} />
                </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    activeType === 'contenido'
                      ? "Ej. El cuadrado y las formas geométricas, la familia, los colores primarios..."
                      : "Ej. Me relaciono con afecto en mi entorno, Soy Ecotierno, Colombia tierra querida..."
                  }
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              {/* Suggestions */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium">Sugerencias I.E. San Pedro:</span>
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setTopic(sug)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-600 rounded-lg text-[11px] font-medium transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* 4.1 TUS IDEAS Y PROMPT PEDAGÓGICO PERSONALIZADO (OPTIMIZACIÓN CON IA) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 border border-blue-200/80 shadow-sm space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Tus Ideas y Prompt Pedagógico Personalizado
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold tracking-wide uppercase">
                        Optimización por Prompts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Indica cómo imaginas la planeación: actividades específicas, salidas al patio, materiales o enfoque.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPromptGuide(!showPromptGuide)}
                    className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white/80 hover:bg-white px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showPromptGuide ? 'Ocultar guía' : '¿Cómo funciona?'}</span>
                  </button>
                  {teacherPrompt.trim() && (
                    <button
                      type="button"
                      onClick={() => setTeacherPrompt('')}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 bg-white/80 hover:bg-white px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
                      title="Borrar indicaciones"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Limpiar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Guía explicativa colapsable */}
              {showPromptGuide && (
                <div className="p-3.5 bg-white rounded-xl border border-blue-100 text-xs text-slate-600 space-y-2 animate-fadeIn">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800">
                        La IA estructurará la planeación adaptándola a tus indicaciones directas:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                        <li><strong>Momentos pedagógicos:</strong> Si pides una salida al patio, títeres en la acogida o una fogata simbólica, la IA lo ubicará en la secuencia.</li>
                        <li><strong>Materiales del aula:</strong> Si tienes cajas de cartón, botellas sensoriales, arena o lupas, la IA los priorizará.</li>
                        <li><strong>Cultura y territorio:</strong> Menciona coplas, relatos campesinos, cantos de San Pedro y de la sabana para integrarlos.</li>
                        <li><strong>Inclusión DUA:</strong> Puedes especificar requerimientos sensoriales o adaptaciones para niños con necesidades específicas.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Área de texto para el prompt personalizado */}
              <div className="relative">
                <textarea
                  value={teacherPrompt}
                  onChange={(e) => setTeacherPrompt(e.target.value)}
                  rows={3}
                  placeholder="Escribe aquí tus ideas o prompt personalizado. Ej: 'Quiero que en el Momento 1 utilicemos lupas en el patio para buscar bichitos y hojas. En el juego libre, que jueguen a ser exploradores. Usar cajas de cartón y botellas sensoriales. Incluir una ronda infantil de la costa y un reto con las familias...'"
                  className="w-full px-4 py-3 bg-white border border-blue-200/90 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner leading-relaxed resize-y"
                />
              </div>

              {/* Banco de Prompts e Ideas Rápidas (1 clic) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-600 flex items-center space-x-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ideas pedagógicas rápidas (haz clic para agregar a tu prompt):</span>
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {teacherPrompt.trim() ? `${teacherPrompt.length} caracteres` : 'Opcional'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {PROMPT_IDEAS.map((idea) => {
                    const isAdded = teacherPrompt.includes(idea.text);
                    return (
                      <button
                        key={idea.id}
                        type="button"
                        onClick={() => handleAddPromptIdea(idea.text)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 transition-all border ${
                          isAdded
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <span>{idea.icon}</span>
                        <span>{idea.text}</span>
                        {isAdded && <Check className="w-3 h-3 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Indicador de personalización activa */}
              {teacherPrompt.trim() && (
                <div className="flex items-center space-x-2 text-[11px] font-bold text-blue-900 bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-300/60">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  <span>Personalización activada: La IA adaptará los momentos, estrategias, materiales y actividades rectoras según estas ideas.</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${tabColorClass}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Diseñando {activeType === 'contenido' ? 'Planeación de Contenido' : activeType === 'proyecto' ? 'Proyecto Pedagógico' : 'Experiencia Pedagógica'}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generar {activeType === 'contenido' ? 'Planeación de Contenidos' : activeType === 'proyecto' ? 'Proyecto PPEI' : 'Experiencia'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Prebuilt Examples Showcase (Source Documents) */}
        <div className="p-6 bg-slate-50 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-blue-700" />
              <span>
                {activeType === 'contenido' ? 'Unidades de Contenido Predefinidas (Carga Inmediata)' : 'Proyectos Oficiales PPEI 2026 I.E. San Pedro (Carga Inmediata)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeType === 'contenido' ? (
              CONCEPTOS_PREDEFINIDOS.slice(0, 4).map((c) => {
                const plan = convertConceptToPlan(c);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectPrebuiltPlan(plan)}
                    className="p-3.5 bg-white rounded-2xl border border-sky-200/80 hover:border-sky-500 hover:shadow-md text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-sky-700">
                      {c.icon} {c.conceptName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2">
                      <span className="bg-sky-100 text-sky-800 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                        {c.category}
                      </span>
                      <span>• {c.ageRange}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              DEFAULT_PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPrebuiltPlan(p)}
                  className="p-3.5 bg-white rounded-2xl border border-blue-200/80 hover:border-blue-500 hover:shadow-md text-left transition-all group"
                >
                  <div className="text-xs font-bold text-blue-950 line-clamp-1 group-hover:text-blue-700">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                      {p.ageRange}
                    </span>
                    <span>• {p.duration}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

