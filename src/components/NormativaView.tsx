import React, { useState } from 'react';
import { 
  Heart, 
  Scale, 
  Sparkles, 
  Wand2, 
  BookOpen, 
  Compass, 
  User, 
  Users, 
  Sprout, 
  Laptop, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  HelpCircle,
  FileCheck,
  Search,
  Target,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { 
  DIMENSIONES_SER, 
  NORMATIVA_INFO, 
  EJES_RELACIONALES_2026, 
  PRINCIPIOS_CURRICULARES, 
  MOMENTOS_ITINERARIO, 
  DIVERSIDADES_ETNICAS,
  PROPOSITOS_MEN_COLOMBIA
} from '../data/normativaData';
import { HIGH_QUALITY_SAMPLE_IMAGES } from '../data/generatedImages';
import { ImageGeneratorModal } from './ImageGeneratorModal';

export const NormativaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'propositos' | 'marcos' | 'ejes' | 'dimensiones' | 'itinerario' | 'etno' | 'evaluacion'>('propositos');
  const [activeDimension, setActiveDimension] = useState<string>(DIMENSIONES_SER[0].code);
  const [activeMomento, setActiveMomento] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalPrompt, setModalPrompt] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

  const currentDim = DIMENSIONES_SER.find((d) => d.code === activeDimension) || DIMENSIONES_SER[0];
  const currentMomento = MOMENTOS_ITINERARIO.find((m) => m.step === activeMomento) || MOMENTOS_ITINERARIO[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/80 text-amber-300 text-xs font-extrabold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>I.E. del Municipio de San Pedro • Ministerio de Educación Nacional • Colombia 2026</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Lineamientos Curriculares para la Formación Integral
          </h2>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
            "Un viaje curricular: rutas para la transformación del ser y del saber" — Integración del Decreto 1411 de 2022, Ley 2503 de 2025, los 4 Propósitos de la Educación Inicial y los Ejes Curriculares Relacionales para la Educación Preescolar en las Instituciones Educativas del Municipio de San Pedro, Sucre.
          </p>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Tab Bar Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'propositos', label: '4 Propósitos MEN Colombia', icon: Target },
          { id: 'ejes', label: '4 Ejes Relacionales (2026)', icon: Compass },
          { id: 'dimensiones', label: '9 Lineamientos del Ser', icon: Layers },
          { id: 'itinerario', label: 'Itinerario Pedagógico (4 Momentos)', icon: MapPin },
          { id: 'marcos', label: 'Marcos Legales & Normativas', icon: Scale },
          { id: 'etno', label: 'Educación Propia & Saberes', icon: BookOpen },
          { id: 'evaluacion', label: 'Valorar el Proceso (Seguimiento)', icon: FileCheck }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all shadow-sm ${
                isSelected
                  ? 'bg-[#1e3a8a] text-white ring-2 ring-blue-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: 4 PROPÓSITOS DE LA EDUCACIÓN INICIAL (MEN COLOMBIA) */}
      {activeTab === 'propositos' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-4 border border-blue-800 relative overflow-hidden">
            <div className="flex items-center space-x-2.5 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              <Target className="w-5 h-5 text-amber-300" />
              <span>Marcos de Referencia • Ministerio de Educación Nacional de Colombia</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Los 4 Propósitos de la Educación Inicial y la Primera Infancia
            </h3>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-4xl">
              De acuerdo con las Bases Curriculares para la Educación Inicial y Preescolar del Ministerio de Educación Nacional (MEN) de Colombia, la acción pedagógica intencionada busca potenciar el desarrollo integral de los niños y niñas a través de cuatro grandes propósitos articulados con las experiencias rectoras: el juego, el arte, la literatura y la exploración del medio.
            </p>
          </div>

          {/* 4 Interactive Purpose Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROPOSITOS_MEN_COLOMBIA.map((prop) => (
              <div 
                key={prop.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5 hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-extrabold text-sm flex items-center justify-center border border-blue-300">
                      {prop.number}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-900 text-[11px] font-bold rounded-full border border-blue-200">
                      MEN Colombia
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {prop.title}
                  </h4>

                  <p className="text-xs text-blue-900 font-semibold bg-blue-50/80 p-2.5 rounded-xl border border-blue-200/60">
                    "{prop.subtitle}"
                  </p>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {prop.description}
                  </p>

                  {/* Aspectos Clave */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider block">
                      Aspectos Clave del Desarrollo:
                    </span>
                    <ul className="space-y-1.5">
                      {prop.keyAspects.map((asp, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{asp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Acciones Pedagógicas */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider block">
                      Acciones Pedagógicas en el Aula:
                    </span>
                    <ul className="space-y-1.5">
                      {prop.pedagogicalActions.map((act, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Integrado en el Planificador</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">Bases Curriculares MEN</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 1: 4 EJES CURRICULARES RELACIONALES & PRINCIPIOS */}
      {activeTab === 'ejes' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-[#1e3a8a] uppercase tracking-wider">
              <Compass className="w-4 h-4 text-blue-700" />
              <span>Novedad Curricular MEN 2026: Los 4 Ejes Relacionales</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Los ejes curriculares relacionales son unidades de sentido y tramas de la vida que evitan que la escuela sea un "archipiélago de asignaturas". Articulan los contenidos con los lineamientos del ser humano y la realidad territorial del estudiante.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {EJES_RELACIONALES_2026.map((eje) => {
                const getEjeIcon = (id: string) => {
                  if (id === 'consigo_mismo') return <User className="w-5 h-5 text-purple-700" />;
                  if (id === 'con_los_otros') return <Users className="w-5 h-5 text-blue-700" />;
                  if (id === 'con_la_vida_y_entorno') return <Sprout className="w-5 h-5 text-amber-700" />;
                  return <Laptop className="w-5 h-5 text-blue-700" />;
                };

                const getBgStyle = (id: string) => {
                  if (id === 'consigo_mismo') return 'bg-purple-50/70 border-purple-200/80';
                  if (id === 'con_los_otros') return 'bg-blue-50/70 border-blue-200/80';
                  if (id === 'con_la_vida_y_entorno') return 'bg-amber-50/70 border-amber-200/80';
                  return 'bg-blue-50/70 border-blue-200/80';
                };

                return (
                  <div key={eje.id} className={`p-6 rounded-3xl border ${getBgStyle(eje.id)} space-y-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all`}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-slate-200/60 shrink-0">
                          {getEjeIcon(eje.id)}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                            {eje.title}
                          </h3>
                          <span className="text-[11px] font-bold text-slate-600">
                            {eje.subtitle}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                        {eje.description}
                      </p>

                      <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/60 space-y-1.5 text-xs text-slate-800">
                        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">ÉNFASIS PEDAGÓGICO:</div>
                        {eje.pedagogicalFocus.map((f, fIdx) => (
                          <div key={fIdx} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold italic text-slate-600 pt-2 border-t border-slate-200/50">
                      {eje.keyQuotes[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Principios de Organización Curricular */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                PRINCIPIOS DE ORGANIZACIÓN CURRICULAR (MEN 2026)
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Cuatro Principios Fundamentales para la Concreción
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRINCIPIOS_CURRICULARES.map((p) => (
                <div key={p.name} className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl space-y-2">
                  <div className="text-blue-400 font-extrabold text-sm uppercase tracking-wide">
                    {p.name}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {p.definition}
                  </p>
                  <div className="pt-2 border-t border-slate-700 text-[11px] text-amber-200 font-medium">
                    💡 {p.application}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: LOS 9 LINEAMIENTOS DEL SER */}
      {activeTab === 'dimensiones' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Lineamientos del Ser
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Selecciona un lineamiento para consultar su fundamento y metas orientadoras por rango de edad (0 a 2, 2 a 4 y 4 a 6 años).
            </p>
          </div>

          {/* Lineamiento Buttons Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {DIMENSIONES_SER.map((dim) => (
              <button
                key={dim.code}
                onClick={() => setActiveDimension(dim.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeDimension === dim.code
                    ? 'bg-[#1e3a8a] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dim.code}
              </button>
            ))}
          </div>

          {/* Active Lineamiento Showcase */}
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">LINEAMIENTO FORMATIVO</span>
                <h4 className="text-xl font-extrabold text-[#1e3a8a]">
                  {currentDim.name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl">
                  {currentDim.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setModalPrompt(`Un ambiente de aprendizaje pedagógico enfocado en la ${currentDim.name} en la educación inicial colombiana con materiales didácticos, jardín y niños participando con alegría.`);
                  setModalTitle(`Ilustrar ${currentDim.name}`);
                  setIsModalOpen(true);
                }}
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-4 py-2 rounded-2xl text-xs font-bold shadow transition-all flex items-center space-x-1.5 shrink-0 active:scale-95"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Generar Ilustración IA</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
                <div className="text-xs font-extrabold text-blue-900 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                  0 a 2 años (Lactantes / Caminadores)
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentDim.keyGoals['0-2']}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
                <div className="text-xs font-extrabold text-blue-900 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                  2 a 4 años (Párvulos / Prejardín)
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentDim.keyGoals['2-4']}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
                <div className="text-xs font-extrabold text-blue-900 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                  4 a 6 años (Jardín / Transición)
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentDim.keyGoals['4-6']}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ITINERARIO PEDAGÓGICO (4 MOMENTOS DE DISEÑO) */}
      {activeTab === 'itinerario' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-[#064e3b] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span>Itinerario para el Diseño de Prácticas Educativas (MEN 2026)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Un plano reflexivo durante el cual los docentes articulan las Experiencias de Interés y los 5 Momentos Pedagógicos con la vida de las niñas y los niños y la realidad del territorio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
              {MOMENTOS_ITINERARIO.map((m) => (
                <button
                  key={m.step}
                  onClick={() => setActiveMomento(m.step)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    activeMomento === m.step
                      ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-md ring-2 ring-blue-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className={`text-[10px] font-extrabold uppercase tracking-wider ${activeMomento === m.step ? 'text-amber-300' : 'text-[#1e3a8a]'}`}>
                    {m.name}
                  </div>
                  <div className="text-xs font-bold line-clamp-1 mt-0.5">
                    {m.title}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50/80 border border-blue-200/80 p-6 rounded-3xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#064e3b] text-white font-extrabold flex items-center justify-center text-base shrink-0">
                  {currentMomento.step}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {currentMomento.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {currentMomento.description}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-extrabold text-[#064e3b] uppercase tracking-wider flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-700" />
                  <span>Preguntas Clave para el Docente:</span>
                </div>
                <ul className="space-y-1.5">
                  {currentMomento.keyQuestions.map((q, qIdx) => (
                    <li key={qIdx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong className="font-extrabold">Resultado de este Momento:</strong> {currentMomento.output}</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: MARCOS LEGALES (DECRETO 1411 & LEY 2503) */}
      {activeTab === 'marcos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Decreto 1411 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden bg-slate-900 group">
              <img
                src={HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza}
                alt="Ambiente Decreto 1411"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-extrabold text-blue-200 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ambientes Estructurados • Decreto 1411</span>
                </span>
                <button
                  onClick={() => {
                    setModalPrompt('Un ambiente pedagógico enriquecido según Decreto 1411 con materiales naturales, rincón de plantas colombianas y niños jugando en autonomía.');
                    setModalTitle('Generar Ilustración Decreto 1411');
                    setIsModalOpen(true);
                  }}
                  className="bg-white/90 hover:bg-white text-slate-900 px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow transition-all flex items-center space-x-1"
                >
                  <Wand2 className="w-3 h-3 text-blue-700" />
                  <span>Nana Banana AI</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center font-bold shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{NORMATIVA_INFO.decreto1411.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{NORMATIVA_INFO.decreto1411.sub}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {NORMATIVA_INFO.decreto1411.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pilares Fundamentales:</div>
                <div className="space-y-2">
                  {NORMATIVA_INFO.decreto1411.pillars.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-bold text-[#064e3b]">{p.name}: </span>
                      <span className="text-slate-600">{p.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ley 2503 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden bg-slate-900 group">
              <img
                src={HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento}
                alt="Educación Socioemocional Ley 2503"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-extrabold text-purple-200 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Educación Socioemocional • Ley 2503</span>
                </span>
                <button
                  onClick={() => {
                    setModalPrompt('Un círculo de diálogo socioemocional de Ley 2503 en un aula con cojines de colores, profesora leyendo cuento sobre la empatía y afiches de caritas de emociones.');
                    setModalTitle('Generar Ilustración Ley 2503');
                    setIsModalOpen(true);
                  }}
                  className="bg-white/90 hover:bg-white text-slate-900 px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow transition-all flex items-center space-x-1"
                >
                  <Wand2 className="w-3 h-3 text-purple-700" />
                  <span>Nana Banana AI</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold shrink-0">
                  <Heart className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{NORMATIVA_INFO.ley2503.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{NORMATIVA_INFO.ley2503.sub}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {NORMATIVA_INFO.ley2503.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Aspectos Clave:</div>
                <ul className="space-y-2">
                  {NORMATIVA_INFO.ley2503.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-purple-50/50 p-3 rounded-xl border border-purple-100/60">
                      <span className="w-2 h-2 rounded-full bg-purple-600 mt-1 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Ley 1620 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden bg-slate-900 group">
              <img
                src={HIGH_QUALITY_SAMPLE_IMAGES.abrazoEmpatia}
                alt="Convivencia Escolar Ley 1620"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-extrabold text-sky-200 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Convivencia Escolar • Ley 1620</span>
                </span>
                <button
                  onClick={() => {
                    setModalPrompt('Un grupo de niños en un aula colombiana participando en un acuerdo de convivencia escolar, abrazándose con empatía y resolviendo un conflicto con la orientación de su maestra.');
                    setModalTitle('Generar Ilustración Ley 1620');
                    setIsModalOpen(true);
                  }}
                  className="bg-white/90 hover:bg-white text-slate-900 px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow transition-all flex items-center space-x-1"
                >
                  <Wand2 className="w-3 h-3 text-sky-700" />
                  <span>Nana Banana AI</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5 text-sky-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{NORMATIVA_INFO.ley1620.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{NORMATIVA_INFO.ley1620.sub}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {NORMATIVA_INFO.ley1620.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pilares Fundamentales:</div>
                <div className="space-y-2">
                  {NORMATIVA_INFO.ley1620.pillars.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-xs">
                      <span className="font-bold text-sky-950">{p.name}: </span>
                      <span className="text-slate-700">{p.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ley 1581 / Ley 1098 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden bg-slate-900 group">
              <img
                src={HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas}
                alt="Hábeas Data Ley 1581"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-extrabold text-blue-200 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Protección de Datos & Hábeas Data • Ley 1581</span>
                </span>
                <button
                  onClick={() => {
                    setModalPrompt('Una maestra de educación inicial registrando con delicadeza un mural de huellas digitales de manos infantiles con formato de consentimiento informado firmado.');
                    setModalTitle('Generar Ilustración Ley 1581 / 1098');
                    setIsModalOpen(true);
                  }}
                  className="bg-white/90 hover:bg-white text-slate-900 px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow transition-all flex items-center space-x-1"
                >
                  <Wand2 className="w-3 h-3 text-blue-700" />
                  <span>Nana Banana AI</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{NORMATIVA_INFO.ley1581_1098.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{NORMATIVA_INFO.ley1581_1098.sub}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {NORMATIVA_INFO.ley1581_1098.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Aspectos Clave:</div>
                <ul className="space-y-2">
                  {NORMATIVA_INFO.ley1581_1098.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Manual de Convivencia Escolar I.E. del Municipio de San Pedro */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden bg-slate-900 group">
              <img
                src={HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia}
                alt="Manual de Convivencia I.E. del Municipio de San Pedro"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-extrabold text-blue-200 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Democracia Escolar & Pacto • I.E. del Municipio de San Pedro</span>
                </span>
                <button
                  onClick={() => {
                    setModalPrompt('Estudiantes de primera infancia en el municipio de San Pedro Sucre participando en una votación democrática escolar con urna decorada y pacto de aula.');
                    setModalTitle('Generar Ilustración Manual de Convivencia');
                    setIsModalOpen(true);
                  }}
                  className="bg-white/90 hover:bg-white text-slate-900 px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow transition-all flex items-center space-x-1"
                >
                  <Wand2 className="w-3 h-3 text-blue-700" />
                  <span>Nana Banana AI</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{NORMATIVA_INFO.manualConvivencia.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{NORMATIVA_INFO.manualConvivencia.sub}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {NORMATIVA_INFO.manualConvivencia.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ejes y Componentes Institucionales:</div>
                <div className="space-y-2">
                  {NORMATIVA_INFO.manualConvivencia.pillars.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                      <span className="font-bold text-blue-950">{p.name}: </span>
                      <span className="text-slate-700">{p.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: EDUCACIÓN PROPIA Y DIVERSIDAD ÉTNICA */}
      {activeTab === 'etno' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 animate-fade-in">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-extrabold border border-amber-200 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Etnoeducación & Educación Propia</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Aproximación Intercultural desde las Cosmovisiones Colombianas
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Los Lineamientos de Formación Integral (MEN 2026) reconocen los Tejidos de Sabiduría y los planes colectivos de vida de los pueblos étnicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIVERSIDADES_ETNICAS.map((item) => (
              <div key={item.code} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-lg font-extrabold text-[#064e3b]">
                    {item.community}
                  </h4>

                  <div className="flex flex-wrap gap-1.5">
                    {item.keyConcepts.map((c) => (
                      <span key={c} className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-extrabold">
                        {c}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 font-medium">
                  <strong className="font-extrabold text-[#064e3b]">Impacto en el Aula: </strong>
                  {item.pedagogicalImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: EVALUACIÓN FORMATIVA */}
      {activeTab === 'evaluacion' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 animate-fade-in">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-extrabold border border-emerald-200 mb-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Valorar el Proceso en la Primera Infancia</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Valorar el Proceso con Sentido Formativo y Humanizador (Seguimiento al Desarrollo Integral)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Tránsito de la calificación sancionatoria hacia la valoración del proceso: observación atenta, escucha pedagógica dialógica, continua y participativa con instrumentos técnicos (diarios de campo, bitácora, portafolio y estudio de casos).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-purple-900 uppercase">Autoevaluación</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                El niño/a reconoce sus propios avances, emociones y metas de mejora mediante portafolios, dibujos y pictogramas de autorreflexión.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-blue-900 uppercase">Coevaluación</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Diálogo horizontal entre pares para valorar el trabajo cooperativo, ejercitando la escucha activa, el respeto y la empatía.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <h4 className="text-sm font-extrabold text-amber-900 uppercase">Retroalimentación Dialógica</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                El error se concibe como oportunidad extraordinaria de aprendizaje. La orientación docente es descriptiva, afectiva y motivadora.
              </p>
            </div>
          </div>
        </div>
      )}

      <ImageGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPrompt={modalPrompt}
        title={modalTitle}
      />

    </div>
  );
};

