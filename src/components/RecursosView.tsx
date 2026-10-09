import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Search,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Compass,
  Heart,
  Sprout,
  BookOpen,
  FileText,
  ShieldCheck,
  Download,
  RefreshCw,
  User,
  FileCheck,
  Building2,
  Calendar,
  Users,
  Check,
  ArrowRight
} from 'lucide-react';
import { RECURSOS_BANK } from '../data/recursosData';
import { SAMPLE_IMAGE_CARDS, ImageCardSample } from '../data/generatedImages';
import { ImageGeneratorModal } from './ImageGeneratorModal';
import { Student, ActaConvivenciaData, ConsentimientoInformadoData } from '../types';
import { exportActaConvivenciaWord, exportConsentimientoInformadoWord } from '../utils/exportWord';

interface RecursosViewProps {
  students?: Student[];
}

export const RecursosView: React.FC<RecursosViewProps> = ({ students = [] }) => {
  // Main sub-section tab: 'banco' | 'acta' | 'consentimiento'
  const [activeMainTab, setActiveMainTab] = useState<'banco' | 'acta' | 'consentimiento'>('banco');

  // State for Banco de Recursos
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInitialPrompt, setModalInitialPrompt] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

  // Selected student for auto-filling form
  const [selectedStudentForActa, setSelectedStudentForActa] = useState<string>('');
  const [selectedStudentForConsent, setSelectedStudentForConsent] = useState<string>('');

  // AI Loading States
  const [isGeneratingActaAi, setIsGeneratingActaAi] = useState<boolean>(false);
  const [isGeneratingConsentAi, setIsGeneratingConsentAi] = useState<boolean>(false);

  // Form State for Acta de Convivencia Escolar
  const [actaForm, setActaForm] = useState<ActaConvivenciaData>({
    institucion: 'INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO',
    sede: 'Sede Principal',
    fecha: new Date().toISOString().split('T')[0],
    hora: '08:30 AM',
    lugar: 'Coordinación Pedagógica / Salón de Mediación',
    studentName: 'Sofía Villalba Ríos',
    studentAge: '4 años',
    studentGrade: 'Jardín / Transición',
    parentName: 'María Villalba',
    parentIdType: 'C.C.',
    parentIdNumber: '1018234567',
    parentRelationship: 'Madre / Acudiente',
    parentPhone: '310 456 7890',
    teacherName: 'Docente Mediadora de Aula',
    teacherRole: 'Especialista en Educación Inicial',
    coordinatorName: 'Coordinación de Convivencia Escolar',
    motivoReunion: 'Reunión de diálogo reflexivo, acompañamiento socioemocional y suscripción de acuerdos pedagógicos de convivencia escolar.',
    hechosSituacion: 'Se convoca a la familia para valorar de manera concertada el proceso de adaptación, pautas de escucha, respeto mutuo y autorregulación emocional del estudiante durante las vivencias pedagógicas.',
    acuerdosEstudiante: '• Hacer uso del rincón de la calma y el semáforo emocional cuando experimente emociones intensas o frustración.\n• Respetar los acuerdos del aula, utilizando un lenguaje afectivo y participando activamente en las actividades grupales.',
    acuerdosPadres: '• Fortalecer en el hogar la crianza amorosa, estableciendo rutinas claras de descanso y diálogo diario sobre las emociones.\n• Mantener una comunicación cercana e informada con la docente y asistir puntualmente a los encuentros citados.',
    acuerdosDocente: '• Implementar estrategias de mediación pedagógica cálida y ambientes favorecedores de la autorregulación socioemocional.\n• Brindar seguimiento cualitativo quincenal e informar periódicamente los logros alcanzados a la familia.',
    fechaSeguimiento: 'En 15 días hábiles (Próximo encuentro de verificación)',
    observacionesAdicionales: 'La reunión se desarrolló en un ambiente de respeto, escucha mutua y corresponsabilidad entre el hogar y la institución educativa.'
  });

  // Form State for Consentimiento Informado
  const [consentForm, setConsentForm] = useState<ConsentimientoInformadoData>({
    institucion: 'INSTITUCIÓN EDUCATIVA DEL MUNICIPIO DE SAN PEDRO',
    departamento: 'DEPARTAMENTO DE SUCRE',
    dane: 'DANE - MUNICIPIO DE SAN PEDRO',
    nit: 'NIT 892.200.599-4',
    telefono: 'TEL. (605) 280-4820',
    ciudad: 'SAN PEDRO - SUCRE',
    fecha: new Date().toISOString().split('T')[0],
    studentName: 'Sofía Villalba Ríos',
    parentName: 'María Villalba',
    parentIdNumber: '1018234567',
    autorizaFotos: '',
    autorizaVideos: '',
    autorizaUsoInterno: '',
    objetivo: 'La Institución Educativa tiene como propósito principal enriquecer las experiencias pedagógicas de los estudiantes de primera infancia (Jardín y Transición). Para lograr esto, el Docente a cargo requiere registrar (mediante fotografías y/o videos) las actividades desarrolladas en el aula y espacios institucionales.',
    compromisoProteccionDatos: 'La institución se compromete a que el material obtenido será utilizado exclusivamente para los fines pedagógicos descritos. Se garantiza que la identidad de los menores será tratada con absoluta reserva y seguridad, evitando la exposición pública del material en redes sociales u otros medios de comunicación sin una autorización adicional específica.'
  });

  // Handlers for Student selection
  const handleSelectStudentForActa = (studentId: string) => {
    setSelectedStudentForActa(studentId);
    const st = students.find((s) => s.id === studentId);
    if (st) {
      setActaForm((prev) => ({
        ...prev,
        studentName: st.name,
        studentAge: st.age || '4 años',
        studentGrade: st.cycle || 'Educación Inicial',
        sede: st.sede || prev.sede,
        parentName: st.guardians || prev.parentName,
        parentPhone: st.contactPhones || prev.parentPhone,
        parentIdNumber: st.documentId || prev.parentIdNumber
      }));
    }
  };

  const handleSelectStudentForConsent = (studentId: string) => {
    setSelectedStudentForConsent(studentId);
    if (!studentId || studentId === 'BLANK') {
      setConsentForm((prev) => ({
        ...prev,
        studentName: '',
        studentAge: '',
        studentDocId: '',
        parentName: '',
        parentPhone: '',
        parentIdNumber: '',
        modoDatosEnBlanco: true
      }));
    } else {
      const st = students.find((s) => s.id === studentId);
      if (st) {
        setConsentForm((prev) => ({
          ...prev,
          studentName: st.name,
          studentAge: st.age || '4 años',
          studentGrade: st.cycle || 'Educación Inicial',
          studentDocId: st.documentId || prev.studentDocId,
          sede: st.sede || prev.sede,
          parentName: st.guardians || prev.parentName,
          parentPhone: st.contactPhones || prev.parentPhone,
          parentIdNumber: st.documentId || prev.parentIdNumber,
          modoDatosEnBlanco: false
        }));
      }
    }
  };

  // AI Generators
  const handleGenerateActaAi = async () => {
    setIsGeneratingActaAi(true);
    try {
      const response = await fetch('/api/generate-acta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: actaForm.studentName,
          parentName: actaForm.parentName,
          reason: actaForm.motivoReunion,
          situationContext: actaForm.hechosSituacion
        })
      });
      if (response.ok) {
        const data = await response.json();
        setActaForm((prev) => ({
          ...prev,
          motivoReunion: data.motivoReunion || prev.motivoReunion,
          hechosSituacion: data.hechosSituacion || prev.hechosSituacion,
          acuerdosEstudiante: data.acuerdosEstudiante || prev.acuerdosEstudiante,
          acuerdosPadres: data.acuerdosPadres || prev.acuerdosPadres,
          acuerdosDocente: data.acuerdosDocente || prev.acuerdosDocente,
        }));
      }
    } catch (e) {
      console.warn('Error fetching AI generated acta:', e);
    } finally {
      setIsGeneratingActaAi(false);
    }
  };

  const handleGenerateConsentAi = async () => {
    setIsGeneratingConsentAi(true);
    try {
      const response = await fetch('/api/generate-consentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: consentForm.studentName,
          parentName: consentForm.parentName,
          institucion: consentForm.institucion,
          departamento: consentForm.departamento,
          dane: consentForm.dane,
          nit: consentForm.nit,
          telefono: consentForm.telefono,
          ciudad: consentForm.ciudad
        })
      });
      if (response.ok) {
        const data = await response.json();
        setConsentForm((prev) => ({
          ...prev,
          objetivo: data.objetivo || prev.objetivo,
          compromisoProteccionDatos: data.compromisoProteccionDatos || prev.compromisoProteccionDatos
        }));
      }
    } catch (e) {
      console.warn('Error fetching AI generated consentimiento:', e);
    } finally {
      setIsGeneratingConsentAi(false);
    }
  };

  // Export handlers
  const handleExportActaWord = async () => {
    try {
      await exportActaConvivenciaWord(actaForm);
    } catch (e) {
      console.error('Error al exportar acta a Word:', e);
      alert('Ocurrió un inconveniente al generar el acta de convivencia en Word.');
    }
  };

  const handleExportConsentWord = async () => {
    try {
      await exportConsentimientoInformadoWord(consentForm);
    } catch (e) {
      console.error('Error al exportar consentimiento a Word:', e);
      alert('Ocurrió un inconveniente al generar el consentimiento en Word.');
    }
  };

  // Banco filtering
  const filteredResources = RECURSOS_BANK.filter((res) => {
    const matchesCat = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenGeneratorForCard = (card: ImageCardSample) => {
    setModalInitialPrompt(card.prompt);
    setModalTitle(`Generar Variante de "${card.title}"`);
    setIsModalOpen(true);
  };

  const handleOpenGeneratorNew = () => {
    setModalInitialPrompt('Un laboratorio de arte infantil con pintura natural de remolacha y cúrcuma en hojas de plátano, niños de 3 años expresándose libremente.');
    setModalTitle('Generar Nueva Ilustración con Nana Banana');
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
              I.E. del Municipio de San Pedro • Decreto 1411 • Ley 2503 • Ley 1620 • Ley 1581
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Banco de Recursos Pedagógicos y Documentos Normativos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Estrategias de aula, fichas DUA/PIAR, ilustraciones AI Nana Banana e instrumentos normativos esenciales: <strong className="text-slate-900 font-bold">Acta de Convivencia Escolar</strong> y <strong className="text-slate-900 font-bold">Consentimiento Informado</strong> para descargar en formato Word (.docx).
          </p>
        </div>

        <button
          onClick={handleOpenGeneratorNew}
          className="flex items-center space-x-2 px-4 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all shrink-0 active:scale-95 border border-blue-500/30"
        >
          <Wand2 className="w-4 h-4 text-amber-300" />
          <span>Generar Imagen Nana Banana</span>
        </button>
      </div>

      {/* NAVEGACIÓN PRINCIPAL DE RECURSOS (TABS DE SECCIONES) */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-2 rounded-2xl border border-slate-300/80">
        <button
          onClick={() => setActiveMainTab('banco')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
            activeMainTab === 'banco'
              ? 'bg-[#1e3a8a] text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-300/70'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>🎨 Banco Pedagógico & Galería Nana Banana</span>
        </button>

        <button
          onClick={() => setActiveMainTab('acta')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
            activeMainTab === 'acta'
              ? 'bg-sky-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-300/70'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-300" />
          <span>📜 Acta de Convivencia Escolar</span>
        </button>

        <button
          onClick={() => setActiveMainTab('consentimiento')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
            activeMainTab === 'consentimiento'
              ? 'bg-indigo-950 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-300/70'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-sky-300" />
          <span>📄 Consentimiento Informado</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 1: BANCO PEDAGÓGICO Y GALERÍA DE IMÁGENES NANA BANANA */}
      {/* ========================================================================= */}
      {activeMainTab === 'banco' && (
        <div className="space-y-8">
          
          {/* Tarjetas destacadas de acceso rápido a Acta y Consentimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card Acta de Convivencia */}
            <div className="bg-gradient-to-br from-sky-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-sky-600/40 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Documento Normativo Ley 1620</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  📜 Generador de Acta de Convivencia Escolar
                </h3>
                <p className="text-xs text-sky-100/90 leading-relaxed">
                  Suscripción formal de acuerdos entre Padres, Estudiante y Docentes con redacción asistida por IA para la autorregulación socioemocional y convivencia armónica.
                </p>
              </div>

              <button
                onClick={() => setActiveMainTab('acta')}
                className="mt-2 w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Diligenciar y Exportar a Word (.docx)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card Consentimiento Informado */}
            <div className="bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-blue-600/40 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Hábeas Data Ley 1581 / Ley 1098</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  📄 Generador de Consentimiento Informado
                </h3>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Autorización legal para la recopilación de evidencias fotográficas, observación cualitativa del desarrollo y salidas pedagógicas en primera infancia.
                </p>
              </div>

              <button
                onClick={() => setActiveMainTab('consentimiento')}
                className="mt-2 w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Diligenciar y Exportar a Word (.docx)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Visual Reference Gallery (High Quality Images from Prompts) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-extrabold border border-amber-200 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Galería Nana Banana AI (Alta Calidad)</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Ilustraciones de Ambientes Pedagógicos Provocadores
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Haz clic en cualquier imagen para expandirla o generar variantes con IA Nana Banana.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SAMPLE_IMAGE_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleOpenGeneratorForCard(card)}
                  className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={card.src}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                      {card.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenGeneratorForCard(card);
                      }}
                      className="absolute bottom-2 right-2 bg-[#1e3a8a]/90 hover:bg-[#1e40af] text-white p-1.5 rounded-xl text-[10px] font-bold shadow transition-all flex items-center space-x-1"
                    >
                      <Wand2 className="w-3 h-3 text-amber-300" />
                      <span>Generar Variante</span>
                    </button>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#1e3a8a] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            
            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'experiencias', label: 'Experiencias Rectoras' },
                { id: 'dua', label: 'DUA / PIAR' },
                { id: 'pictogramas', label: 'Pictogramas' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#1e3a8a] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Field */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar recurso o estrategia..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Resources Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-[11px] font-bold border border-blue-200">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.tag}</span>
                    </div>

                    <button
                      onClick={() => {
                        setModalInitialPrompt(`Ilustración pedagógica de alta calidad para la experiencia "${item.title}": ${item.description}`);
                        setModalTitle(`Ilustrar "${item.title}"`);
                        setIsModalOpen(true);
                      }}
                      className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ilustrar con AI</span>
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pasos y Recomendaciones:
                    </div>
                    <ul className="space-y-1.5">
                      {item.content.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-blue-900 font-semibold italic">
                  💡 {item.recommendation}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 2: ACTA DE CONVIVENCIA ESCOLAR (LEY 1620 / DECRETO 1411) */}
      {/* ========================================================================= */}
      {activeMainTab === 'acta' && (
        <div className="bg-white rounded-3xl border border-sky-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Header de la Sección */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-800 shrink-0 border border-sky-300">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Generador de Acta de Convivencia y Compromiso Escolar</span>
                  <span className="text-[10px] font-extrabold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full border border-sky-300">
                    Ley 1620 / Dec. 1411
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Suscripción formal de acuerdos pedagógicos de convivencia y corresponsabilidad entre Familia, Estudiante y Docente descargables en formato Word (.docx).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportActaWord}
              className="px-5 py-3 bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center space-x-2 shrink-0 border border-sky-500/30"
            >
              <Download className="w-4 h-4 text-sky-200" />
              <span>Exportar Acta a Word (.docx)</span>
            </button>
          </div>

          {/* Quick Cargar Estudiante Dropdown */}
          {students.length > 0 && (
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-sky-800" />
                <span className="text-xs font-extrabold text-sky-950">Cargar datos desde un estudiante registrado:</span>
              </div>
              <select
                value={selectedStudentForActa}
                onChange={(e) => handleSelectStudentForActa(e.target.value)}
                className="px-3.5 py-2 bg-white border border-sky-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:w-72"
              >
                <option value="">-- Seleccionar estudiante --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.sede})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Banner de Asistente IA */}
          <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-sky-700/50">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-300 animate-pulse" />
                <span className="text-xs font-extrabold text-sky-200">Asistente IA para Actas Pedagógicas de Convivencia</span>
              </div>
              <p className="text-xs text-sky-100/90 leading-relaxed">
                Genera automáticamente acrónimos y acuerdos pedagógicos personalizados, normativos y constructivos adaptados al estudiante y la situación expuesta.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateActaAi}
              disabled={isGeneratingActaAi}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2 shrink-0 self-end sm:self-auto"
            >
              {isGeneratingActaAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Redactando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Redactar Acuerdos con IA</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleExportActaWord(); }} className="space-y-6 text-xs">
            
            {/* SECCIÓN 1: DATOS GENERALES DE LA SESIÓN */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-sky-700" />
                <span>1. Datos Generales de la Sesión y Convocatoria</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institución Educativa:</label>
                  <input
                    type="text"
                    value={actaForm.institucion}
                    onChange={(e) => setActaForm({ ...actaForm, institucion: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sede:</label>
                  <input
                    type="text"
                    value={actaForm.sede}
                    onChange={(e) => setActaForm({ ...actaForm, sede: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lugar de Reunión:</label>
                  <input
                    type="text"
                    value={actaForm.lugar}
                    onChange={(e) => setActaForm({ ...actaForm, lugar: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha:</label>
                  <input
                    type="date"
                    value={actaForm.fecha}
                    onChange={(e) => setActaForm({ ...actaForm, fecha: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hora:</label>
                  <input
                    type="text"
                    value={actaForm.hora}
                    onChange={(e) => setActaForm({ ...actaForm, hora: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Seguimiento:</label>
                  <input
                    type="text"
                    value={actaForm.fechaSeguimiento}
                    onChange={(e) => setActaForm({ ...actaForm, fechaSeguimiento: e.target.value })}
                    placeholder="Ej: En 15 días hábiles"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: PARTES FIRMANTES */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <Users className="w-4 h-4 text-sky-700" />
                <span>2. Partes Firmantes (Estudiante, Familiares y Docente)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre del Estudiante:</label>
                  <input
                    type="text"
                    value={actaForm.studentName}
                    onChange={(e) => setActaForm({ ...actaForm, studentName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Edad del Estudiante:</label>
                  <input
                    type="text"
                    value={actaForm.studentAge}
                    onChange={(e) => setActaForm({ ...actaForm, studentAge: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grado / Nivel:</label>
                  <input
                    type="text"
                    value={actaForm.studentGrade}
                    onChange={(e) => setActaForm({ ...actaForm, studentGrade: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Padre / Acudiente:</label>
                  <input
                    type="text"
                    value={actaForm.parentName}
                    onChange={(e) => setActaForm({ ...actaForm, parentName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Documento de Identidad:</label>
                  <div className="flex gap-1.5">
                    <select
                      value={actaForm.parentIdType}
                      onChange={(e) => setActaForm({ ...actaForm, parentIdType: e.target.value })}
                      className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none shrink-0"
                    >
                      <option value="C.C.">C.C.</option>
                      <option value="C.E.">C.E.</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                    <input
                      type="text"
                      value={actaForm.parentIdNumber}
                      onChange={(e) => setActaForm({ ...actaForm, parentIdNumber: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parentesco / Teléfono:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={actaForm.parentRelationship}
                      onChange={(e) => setActaForm({ ...actaForm, parentRelationship: e.target.value })}
                      placeholder="Parentesco"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={actaForm.parentPhone}
                      onChange={(e) => setActaForm({ ...actaForm, parentPhone: e.target.value })}
                      placeholder="Teléfono"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Docente de Aula:</label>
                  <input
                    type="text"
                    value={actaForm.teacherName}
                    onChange={(e) => setActaForm({ ...actaForm, teacherName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cargo / Especialidad:</label>
                  <input
                    type="text"
                    value={actaForm.teacherRole}
                    onChange={(e) => setActaForm({ ...actaForm, teacherRole: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coordinación de Convivencia:</label>
                  <input
                    type="text"
                    value={actaForm.coordinatorName}
                    onChange={(e) => setActaForm({ ...actaForm, coordinatorName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: MOTIVO Y CONTEXTO */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-sky-700" />
                <span>3. Motivo de la Reunión y Contexto Pedagógico</span>
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Motivo de la Convocatoria:</label>
                  <input
                    type="text"
                    value={actaForm.motivoReunion}
                    onChange={(e) => setActaForm({ ...actaForm, motivoReunion: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Descripción Pedagógica de los Hechos / Situación:</label>
                  <textarea
                    rows={3}
                    value={actaForm.hechosSituacion}
                    onChange={(e) => setActaForm({ ...actaForm, hechosSituacion: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: COMPROMISOS Y PACTOS */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-700" />
                <span>4. Pactos y Compromisos de Corresponsabilidad</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* Compromisos del Estudiante */}
                <div className="bg-white p-4 rounded-xl border border-sky-200 space-y-2">
                  <label className="block font-extrabold text-sky-950 text-xs">
                    👶 Compromisos del Estudiante:
                  </label>
                  <textarea
                    rows={5}
                    value={actaForm.acuerdosEstudiante}
                    onChange={(e) => setActaForm({ ...actaForm, acuerdosEstudiante: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-[11px] leading-relaxed"
                  />
                </div>

                {/* Compromisos de los Padres */}
                <div className="bg-white p-4 rounded-xl border border-sky-200 space-y-2">
                  <label className="block font-extrabold text-sky-950 text-xs">
                    🏡 Compromisos de la Familia / Acudiente:
                  </label>
                  <textarea
                    rows={5}
                    value={actaForm.acuerdosPadres}
                    onChange={(e) => setActaForm({ ...actaForm, acuerdosPadres: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-[11px] leading-relaxed"
                  />
                </div>

                {/* Compromisos de la Docente */}
                <div className="bg-white p-4 rounded-xl border border-sky-200 space-y-2">
                  <label className="block font-extrabold text-sky-950 text-xs">
                    👩‍🏫 Compromisos de la Docente / Institución:
                  </label>
                  <textarea
                    rows={5}
                    value={actaForm.acuerdosDocente}
                    onChange={(e) => setActaForm({ ...actaForm, acuerdosDocente: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none text-[11px] leading-relaxed"
                  />
                </div>

              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observaciones Adicionales:</label>
                <textarea
                  rows={2}
                  value={actaForm.observacionesAdicionales}
                  onChange={(e) => setActaForm({ ...actaForm, observacionesAdicionales: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveMainTab('banco')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Volver al Banco de Recursos
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleGenerateActaAi}
                  disabled={isGeneratingActaAi}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black text-amber-300 font-extrabold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Regenerar Acuerdos con IA</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4 text-sky-200" />
                  <span>Descargar Word (.docx)</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 3: CONSENTIMIENTO INFORMADO (LEY 1581 / LEY 1098 / DEC 1411) */}
      {/* ========================================================================= */}
      {activeMainTab === 'consentimiento' && (
        <div className="bg-white rounded-3xl border border-indigo-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Header de la Sección */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-900 shrink-0 border border-indigo-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Generador de Consentimiento Informado</span>
                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-full border border-indigo-300">
                    Ley 1581 / Ley 1098
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Autorización legal y pedagógica para recolección de evidencias, observación del desarrollo y salidas pedagógicas en primera infancia descargable en Word (.docx).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setConsentForm(prev => ({ ...prev, modoDatosEnBlanco: true, studentName: '', parentName: '', parentIdNumber: '', studentDocId: '' }));
                  setSelectedStudentForConsent('BLANK');
                  setTimeout(() => handleExportConsentWord(), 50);
                }}
                className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center space-x-2 border border-amber-400/40"
              >
                <FileText className="w-4 h-4 text-amber-100" />
                <span>Descargar Plantilla en Blanco (.docx)</span>
              </button>

              <button
                type="button"
                onClick={handleExportConsentWord}
                className="px-5 py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center space-x-2 border border-indigo-500/30"
              >
                <Download className="w-4 h-4 text-indigo-200" />
                <span>Exportar Documento a Word (.docx)</span>
              </button>
            </div>
          </div>

          {/* Quick Cargar Estudiante Dropdown y Selector de Modo */}
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-indigo-900" />
                <span className="text-xs font-extrabold text-indigo-950">Seleccionar Estudiante o Formato en Blanco:</span>
              </div>
              <select
                value={selectedStudentForConsent}
                onChange={(e) => handleSelectStudentForConsent(e.target.value)}
                className="px-3.5 py-2 bg-white border border-indigo-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-80 shadow-xs"
              >
                <option value="BLANK">📋 Ningún estudiante (Plantilla en blanco para llenar a mano)</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    👤 {st.name} ({st.sede || 'Sin sede'})
                  </option>
                ))}
              </select>
            </div>

            {/* Tarjetas de modo de diligenciamiento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConsentForm(prev => ({ ...prev, modoDatosEnBlanco: false }))}
                className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition-all ${
                  !consentForm.modoDatosEnBlanco
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-950 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  !consentForm.modoDatosEnBlanco ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                }`}>
                  {!consentForm.modoDatosEnBlanco && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>}
                </div>
                <div>
                  <div className="text-xs font-bold">1. Con Datos del Estudiante Pre-diligenciados</div>
                  <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                    Incluye nombres y documentos del estudiante y acudiente cargados en el sistema.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedStudentForConsent('BLANK');
                  setConsentForm(prev => ({
                    ...prev,
                    studentName: '',
                    studentDocId: '',
                    parentName: '',
                    parentIdNumber: '',
                    parentPhone: '',
                    modoDatosEnBlanco: true
                  }));
                }}
                className={`p-3 rounded-xl border text-left flex items-start space-x-2.5 transition-all ${
                  consentForm.modoDatosEnBlanco
                    ? 'bg-white border-amber-600 ring-2 ring-amber-500/20 text-amber-950 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  consentForm.modoDatosEnBlanco ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                }`}>
                  {consentForm.modoDatosEnBlanco && <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>}
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950">2. Plantilla en Blanco (Ningún Estudiante - Llenar a Mano)</div>
                  <div className="text-[10px] text-amber-900/80 font-normal leading-tight mt-0.5">
                    Genera el documento con líneas (_________) para imprimir masivamente y que los padres lo diligencien en físico.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Banner de Asistente IA */}
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-indigo-700/50">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
                <span className="text-xs font-extrabold text-indigo-200">Asistente IA para Redacción de Consentimientos</span>
              </div>
              <p className="text-xs text-indigo-100/90 leading-relaxed">
                Genera textos legales rigurosos de protección de datos (Hábeas Data) y alcance pedagógico adaptados a la actividad o vivencia planeada.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateConsentAi}
              disabled={isGeneratingConsentAi}
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2 shrink-0 self-end sm:self-auto"
            >
              {isGeneratingConsentAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Redactando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Redactar Texto con IA</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleExportConsentWord(); }} className="space-y-6 text-xs">
            
            {/* SECCIÓN 1: DATOS INSTITUCIONALES */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-700" />
                <span>1. Datos Institucionales del Encabezado</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Institución Educativa:</label>
                  <input
                    type="text"
                    value={consentForm.institucion || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, institucion: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departamento:</label>
                  <input
                    type="text"
                    value={consentForm.departamento || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, departamento: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código DANE:</label>
                  <input
                    type="text"
                    value={consentForm.dane || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, dane: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIT / Teléfono:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={consentForm.nit || ''}
                      onChange={(e) => setConsentForm({ ...consentForm, nit: e.target.value })}
                      placeholder="NIT"
                      className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={consentForm.telefono || ''}
                      onChange={(e) => setConsentForm({ ...consentForm, telefono: e.target.value })}
                      placeholder="Teléfono"
                      className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Municipio / Fecha:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={consentForm.ciudad || ''}
                      onChange={(e) => setConsentForm({ ...consentForm, ciudad: e.target.value })}
                      placeholder="Ciudad"
                      className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="date"
                      value={consentForm.fecha || ''}
                      onChange={(e) => setConsentForm({ ...consentForm, fecha: e.target.value })}
                      className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: DATOS DEL ESTUDIANTE Y ACUDIENTE */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-700" />
                <span>2. Datos del Estudiante y Padre / Acudiente</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Completo del Estudiante:</label>
                  <input
                    type="text"
                    value={consentForm.studentName || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, studentName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre del Padre / Madre / Acudiente:</label>
                  <input
                    type="text"
                    value={consentForm.parentName || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, parentName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">C.C. / Documento del Acudiente:</label>
                  <input
                    type="text"
                    value={consentForm.parentIdNumber || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, parentIdNumber: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: OBJETIVO Y COMPROMISO DE PROTECCIÓN DE DATOS */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-indigo-700" />
                <span>3. Objetivo Pedagógico y Compromiso de Protección de Datos</span>
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Objetivo del Registro de Imagen / Video:</label>
                  <textarea
                    rows={3}
                    value={consentForm.objetivo || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, objetivo: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Compromiso Institucional de Protección de Datos:</label>
                  <textarea
                    rows={3}
                    value={consentForm.compromisoProteccionDatos || ''}
                    onChange={(e) => setConsentForm({ ...consentForm, compromisoProteccionDatos: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: TABLA DE AUTORIZACIONES ESPECÍFICAS */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-700" />
                  <span>4. Autorización Específica (SI / NO)</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setConsentForm({ ...consentForm, autorizaFotos: '', autorizaVideos: '', autorizaUsoInterno: '' })}
                  className="text-[11px] px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg border border-amber-300 transition-all self-start sm:self-auto flex items-center space-x-1"
                >
                  <span>✏️ Dejar todas sin marcar (Para llenar a mano el acudiente)</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {/* Fotografías */}
                <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 text-xs">Toma de Fotografías pedagógicas en el aula/actividades</span>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConsentForm({ ...consentForm, autorizaFotos: consentForm.autorizaFotos === 'SI' ? '' : 'SI' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                        consentForm.autorizaFotos === 'SI' ? 'bg-[#1e3a8a] text-white border-blue-700 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      SI
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsentForm({ ...consentForm, autorizaFotos: consentForm.autorizaFotos === 'NO' ? '' : 'NO' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                        consentForm.autorizaFotos === 'NO' ? 'bg-rose-600 text-white border-rose-700 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      NO
                    </button>
                    {consentForm.autorizaFotos === '' && (
                      <span className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-extrabold">
                        Sin marcar [  ]
                      </span>
                    )}
                  </div>
                </div>

                {/* Videos */}
                <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 text-xs">Grabación de Videos de experiencias pedagógicas</span>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConsentForm({ ...consentForm, autorizaVideos: consentForm.autorizaVideos === 'SI' ? '' : 'SI' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                        consentForm.autorizaVideos === 'SI' ? 'bg-[#1e3a8a] text-white border-blue-700 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      SI
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsentForm({ ...consentForm, autorizaVideos: consentForm.autorizaVideos === 'NO' ? '' : 'NO' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                        consentForm.autorizaVideos === 'NO' ? 'bg-rose-600 text-white border-rose-700 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      NO
                    </button>
                    {consentForm.autorizaVideos === '' && (
                      <span className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-extrabold">
                        Sin marcar [  ]
                      </span>
                    )}
                  </div>
                </div>

                {/* Uso Interno */}
                <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 text-xs">Uso Interno Institucional (Portafolio, murales, observador)</span>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setConsentForm({ ...consentForm, autorizaUsoInterno: consentForm.autorizaUsoInterno === 'SI' ? '' : 'SI' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                        consentForm.autorizaUsoInterno === 'SI' ? 'bg-[#1e3a8a] text-white border-blue-700 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      SI
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsentForm({ ...consentForm, autorizaUsoInterno: consentForm.autorizaUsoInterno === 'NO' ? '' : 'NO' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                        consentForm.autorizaUsoInterno === 'NO' ? 'bg-rose-600 text-white border-rose-700 shadow-xs' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      NO
                    </button>
                    {consentForm.autorizaUsoInterno === '' && (
                      <span className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-extrabold">
                        Sin marcar [  ]
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 flex items-start space-x-2 font-medium">
                <span className="text-amber-700 font-bold shrink-0">📌 NOTA:</span>
                <span>
                  Por defecto, la plantilla se imprime con las casillas vacías <strong>[  ]</strong> para que el padre, madre o acudiente marque con una <strong>(X)</strong> su autorización de forma manuscrita al firmar en físico.
                </span>
              </div>
            </div>

            {/* VISTA PREVIA DEL DOCUMENTO OFICIAL (Coincidencia idéntica con el formato solicitado) */}
            <div className="bg-slate-100/70 p-4 sm:p-6 rounded-2xl border border-slate-300/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-sky-700" />
                  <span>Vista Previa del Documento (.docx)</span>
                </span>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-full border border-sky-300">
                  Formato Oficial de Consentimiento Informado
                </span>
              </div>

              {/* Hoja digital estilo papel */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm space-y-5 font-sans">
                
                {/* 4. Declaración de Consentimiento */}
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-sky-600">
                    4. Declaración de Consentimiento
                  </h4>
                  <p className="text-xs text-slate-800 font-medium">
                    Por favor, marque con una (X) su decisión frente a las siguientes condiciones:
                  </p>

                  {/* Tabla de Consentimiento idéntica a la imagen */}
                  <div className="border-2 border-sky-600 rounded-sm overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-white text-slate-900 font-bold border-b-2 border-sky-600 divide-x-2 divide-sky-600">
                        <tr>
                          <th className="p-2.5 w-[66%]">Actividad</th>
                          <th className="p-2.5 text-center w-[17%]">SÍ ACEPTO</th>
                          <th className="p-2.5 text-center w-[17%]">NO ACEPTO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 divide-x-2 divide-sky-600 text-slate-800">
                        <tr>
                          <td className="p-2.5">Autorizo la toma de fotografías de mi hijo(a) durante actividades pedagógicas.</td>
                          <td className="p-2.5 text-center font-mono text-xs font-bold">
                            {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.autorizaFotos === 'SI' ? '[ X ]' : '[   ]')}
                          </td>
                          <td className="p-2.5 text-center font-mono text-xs font-bold">
                            {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.autorizaFotos === 'NO' ? '[ X ]' : '[   ]')}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5">Autorizo la grabación de videos de mi hijo(a) durante actividades pedagógicas.</td>
                          <td className="p-2.5 text-center font-mono text-xs font-bold">
                            {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.autorizaVideos === 'SI' ? '[ X ]' : '[   ]')}
                          </td>
                          <td className="p-2.5 text-center font-mono text-xs font-bold">
                            {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.autorizaVideos === 'NO' ? '[ X ]' : '[   ]')}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2.5">Autorizo el uso de estas imágenes/videos en presentaciones pedagógicas internas.</td>
                          <td className="p-2.5 text-center font-mono text-xs font-bold">
                            {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.autorizaUsoInterno === 'SI' ? '[ X ]' : '[   ]')}
                          </td>
                          <td className="p-2.5 text-center font-mono text-xs font-bold">
                            {consentForm.modoDatosEnBlanco ? '[   ]' : (consentForm.autorizaUsoInterno === 'NO' ? '[ X ]' : '[   ]')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Campos de Nombre, Firma, Cédula y Fecha (Coincidencia exacta con Imagen 2) */}
                  <div className="pt-6 space-y-3.5 text-xs text-slate-800 font-normal">
                    <p className="flex flex-wrap items-baseline gap-1">
                      <span>Nombre del Estudiante:</span>{' '}
                      <span className="font-mono text-slate-800">
                        {consentForm.modoDatosEnBlanco || !consentForm.studentName
                          ? '_________________________________________________'
                          : consentForm.studentName}
                      </span>
                    </p>
                    <p className="flex flex-wrap items-baseline gap-1">
                      <span>Nombre del Padre/Madre/Acudiente:</span>{' '}
                      <span className="font-mono text-slate-800">
                        {consentForm.modoDatosEnBlanco || !consentForm.parentName
                          ? '_________________________________________________'
                          : consentForm.parentName}
                      </span>
                    </p>
                    <p className="flex flex-wrap items-baseline gap-1">
                      <span>Cédula de Ciudadanía:</span>{' '}
                      <span className="font-mono text-slate-800">
                        {consentForm.modoDatosEnBlanco || !consentForm.parentIdNumber
                          ? '_________________________________________________'
                          : consentForm.parentIdNumber}
                      </span>
                    </p>
                    <p className="flex flex-wrap items-baseline gap-1">
                      <span>Firma:</span>{' '}
                      <span className="font-mono text-slate-800">_________________________________________________</span>
                    </p>
                    <p className="flex flex-wrap items-baseline gap-1">
                      <span>Fecha:</span>{' '}
                      <span className="font-mono text-slate-800">
                        {consentForm.modoDatosEnBlanco || !consentForm.fecha
                          ? '_________________________________________________'
                          : consentForm.fecha}
                      </span>
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveMainTab('banco')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Volver al Banco de Recursos
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleGenerateConsentAi}
                  disabled={isGeneratingConsentAi}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-black text-amber-300 font-extrabold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Regenerar Texto con IA</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4 text-indigo-200" />
                  <span>Descargar Word (.docx)</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Generator Modal */}
      <ImageGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPrompt={modalInitialPrompt}
        title={modalTitle}
      />

    </div>
  );
};
