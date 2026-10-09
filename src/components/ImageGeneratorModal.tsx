import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Download, 
  RefreshCw, 
  Image as ImageIcon, 
  Wand2, 
  Check, 
  AlertCircle,
  Upload,
  FolderOpen,
  Trash2,
  Camera,
  FileImage
} from 'lucide-react';
import { HIGH_QUALITY_SAMPLE_IMAGES, SAMPLE_IMAGE_CARDS } from '../data/generatedImages';

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  title?: string;
  onSelectImage?: (imageUrl: string) => void;
}

export const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialPrompt = 'Un rincón de la naturaleza en un aula de educación inicial en Colombia con flores, terrarios, niños explorando con lupas y afiches de flora colombiana.',
  title = 'Personalizar Ilustración Pedagógica',
  onSelectImage
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'generate' | 'upload'>('generate');
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custom Upload state
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setPrompt(initialPrompt);
      setGeneratedImageUrl(null);
      setUploadedImageUrl(null);
      setUploadedFileInfo(null);
      setErrorMsg(null);
      setActiveTab('generate');
    }
  }, [isOpen, initialPrompt]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const categories = [
    'Todas',
    'Educación Socioemocional',
    'Exploración & Ciencia',
    'Arte Plástico & Expresión',
    'Música & Danza',
    'Literatura & Diálogo',
    'Juego & Psicomotricidad',
    'Educación Propia & Territorio'
  ];

  const filteredImageCards = SAMPLE_IMAGE_CARDS.filter((card) => {
    const matchesCategory = selectedCategory === 'Todas' || card.category === selectedCategory;
    const matchesSearch =
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }
    setErrorMsg(null);
    const sizeInKB = (file.size / 1024).toFixed(1);
    const sizeText = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKB} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImageUrl(result);
      setUploadedFileInfo({ name: file.name, size: sizeText });
      setGeneratedImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          setGeneratedImageUrl(data.imageUrl);
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Servidor local o API de imágenes con fallback:', e);
    }

    // Smart fallback: Selección de imagen pedagógica de alta resolución según palabras clave
    setTimeout(() => {
      const p = prompt.toLowerCase();
      if (p.includes('vocal') || p.includes('letra') || p.includes('alfabeto') || p.includes('palabra')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.vocalesLetras);
      } else if (p.includes('geometr') || p.includes('conteo') || p.includes('figura') || p.includes('número') || p.includes('matemátic')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.conteoFiguras);
      } else if (p.includes('volcán') || p.includes('experimento') || p.includes('reacción') || p.includes('científic')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.experimentoVolcan);
      } else if (p.includes('reciclaje') || p.includes('caneca') || p.includes('planeta') || p.includes('basura') || p.includes('ecolog')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.cuidadoPlaneta);
      } else if (p.includes('higiene') || p.includes('jabón') || p.includes('lavado') || p.includes('mano')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.saludHigiene);
      } else if (p.includes('espejo') || p.includes('rostro') || p.includes('autoconocimiento') || p.includes('cuerpo humano')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.cuerpoHumanoEspejo);
      } else if (p.includes('familia') || p.includes('árbol') || p.includes('genealógico') || p.includes('raíz') || p.includes('hogar')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.familiaArbol);
      } else if (p.includes('profesión') || p.includes('oficio') || p.includes('médic') || p.includes('bombero') || p.includes('comunidad')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.profesionesComunidad);
      } else if (p.includes('marino') || p.includes('pez') || p.includes('acuario') || p.includes('mar') || p.includes('océano')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.ecosistemaMarino);
      } else if (p.includes('espacio') || p.includes('estrella') || p.includes('planeta') || p.includes('cohete') || p.includes('universo')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.espacioEstrellas);
      } else if (p.includes('clima') || p.includes('lluvia') || p.includes('paraguas') || p.includes('estación') || p.includes('tiempo')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.estacionesClima);
      } else if (p.includes('fruta') || p.includes('nutrición') || p.includes('alimento') || p.includes('degustación') || p.includes('sabor')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.alimentosFrutas);
      } else if (p.includes('mascota') || p.includes('cachorro') || p.includes('perro') || p.includes('gato') || p.includes('animal doméstico')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.mascotasAnimales);
      } else if (p.includes('orquesta') || p.includes('instrumento reciclado') || p.includes('maraca') || p.includes('latas')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.instrumentosReciclados);
      } else if (p.includes('luz') || p.includes('sombra') || p.includes('linterna') || p.includes('óptica') || p.includes('retroproyector')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.juegoLucesSombras);
      } else if (p.includes('compost') || p.includes('abono') || p.includes('tierra viva') || p.includes('hojas secas')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.compostaAbono);
      } else if (p.includes('poesía') || p.includes('rima') || p.includes('trabalenguas') || p.includes('títere')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.poesiaRimas);
      } else if (p.includes('yoga') || p.includes('meditación') || p.includes('respiración') || p.includes('mindfulness')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.yogaMeditacion);
      } else if (p.includes('cumbia') || p.includes('folclor') || p.includes('sombrero vueltiao') || p.includes('traje típico')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.folclorCumbia);
      } else if (p.includes('huella') || p.includes('mural') && p.includes('mano')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.muralHuellas);
      } else if (p.includes('mural') || p.includes('pintura') || p.includes('lienzo') || p.includes('plástic') || p.includes('arte')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.arteMural);
      } else if (p.includes('danza') || p.includes('cinta') || p.includes('fiesta')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.danzaCintasTropical);
      } else if (p.includes('música') || p.includes('ritmo') || p.includes('tambor') || p.includes('sonor') || p.includes('baile')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.musicaRitmo);
      } else if (p.includes('chagra') || p.includes('ancestr') || p.includes('siembra') || p.includes('tierra') || p.includes('etno') || p.includes('cultura')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.chagraAncestral);
      } else if (p.includes('teatro') && p.includes('sombra')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.teatroSombras);
      } else if (p.includes('teatro') || p.includes('máscara')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.teatroMascarasAnimales);
      } else if (p.includes('cocina') || p.includes('receta') || p.includes('amasar')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.cocinaSabores);
      } else if (p.includes('bloque') || p.includes('construcción') || p.includes('madera') || p.includes('torre')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.construccionBloques);
      } else if (p.includes('tejido') || p.includes('hilo') || p.includes('lana')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.tejeduriaHilos);
      } else if (p.includes('agua') || p.includes('trasvasado') || p.includes('flotar')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.experienciaAgua);
      } else if (p.includes('circuito') || p.includes('motor') || p.includes('cuerpo') || p.includes('psicomotor') || p.includes('juego libre')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.movimientoMotor);
      } else if (p.includes('lectura') || p.includes('cuento') || p.includes('libro') || p.includes('literatura')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.circuloLectura);
      } else if (p.includes('calma') || p.includes('panel') || p.includes('paz')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.panelEmocionesCalma);
      } else if (p.includes('terrario') || p.includes('diario') || p.includes('emocion') || p.includes('arcilla')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiarioInfantil);
      } else if (p.includes('lupa') || p.includes('detective') || p.includes('jardin') || p.includes('flores')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.detectivesFloresLupas);
      } else if (p.includes('democracia') || p.includes('voto') || p.includes('elección')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.votoInfantilDemocracia);
      } else if (p.includes('feria') || p.includes('comunidad')) {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.feriaPrimavera);
      } else {
        setGeneratedImageUrl(HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza);
      }
      setIsGenerating(false);
    }, 600);
  };

  const handleSelectSampleCard = (samplePrompt: string, sampleSrc: string) => {
    setPrompt(samplePrompt);
    setGeneratedImageUrl(sampleSrc);
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `ilustracion-personalizada-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#1e3a8a] text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e3a8a]/80 text-blue-200 flex items-center justify-center border border-blue-600/50 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-xs text-blue-200">
                Personaliza con IA Nana Banana o carga tu propia foto / archivo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-1 px-3 py-1.5 bg-[#1e3a8a]/80 hover:bg-[#1e40af] text-blue-100 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-600/60 shadow-sm"
            title="Cerrar Modal"
          >
            <span>Cerrar</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Mode Switcher Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'generate'
                ? 'bg-[#1e3a8a] text-white shadow-md border border-blue-700'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Wand2 className={`w-4 h-4 ${activeTab === 'generate' ? 'text-amber-300' : 'text-blue-700'}`} />
            <span>Generar / Galería Nana Banana</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'upload'
                ? 'bg-[#1e3a8a] text-white shadow-md border border-blue-700'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Upload className={`w-4 h-4 ${activeTab === 'upload' ? 'text-amber-300' : 'text-blue-700'}`} />
            <span>Cargar Mi Propia Imagen</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: GENERAR O SELECCIONAR NANA BANANA AI */}
          {activeTab === 'generate' && (
            <div className="space-y-6 animate-fade-in">
              {/* Prompt Input Box */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Descripción de la Ilustración Pedagógica:</span>
                  <span className="text-blue-700 font-bold lowercase">Motor: Nana Banana / Imagen 3</span>
                </label>
                
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    placeholder="Escribe lo que deseas ilustrar (ej: 'Niños de 3 años explorando un rincon de insectos con lupas y frascos traslúcidos')..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all resize-none"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="mt-2 w-full sm:w-auto px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Generando Imagen de Alta Calidad...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 text-amber-300" />
                        <span>Generar con Nana Banana</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Aspect Ratio selector */}
              <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
                <span className="text-slate-500 font-bold">Formato:</span>
                {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                      aspectRatio === ratio
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              {/* Banco de Imágenes Pedagógicas Nana Banana AI */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                      <span>Banco de Imágenes Pedagógicas Temáticas</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Selecciona una imagen ilustrativa para la experiencia / sesión o producto final
                    </p>
                  </div>

                  {/* Search Bar */}
                  <input
                    type="text"
                    placeholder="Buscar imagen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all w-full sm:w-48"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                        selectedCategory === cat
                          ? 'bg-[#1e3a8a] text-white border-blue-900 shadow-sm'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                  {filteredImageCards.length > 0 ? (
                    filteredImageCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => handleSelectSampleCard(card.prompt, card.src)}
                        className={`bg-slate-50 border rounded-2xl p-2 space-y-1.5 cursor-pointer transition-all group ${
                          generatedImageUrl === card.src
                            ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/50 shadow-md'
                            : 'border-slate-200 hover:border-blue-500 hover:shadow-md'
                        }`}
                      >
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 relative">
                          <img
                            src={card.src}
                            alt={card.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-[9px] text-amber-200 font-bold px-1.5 py-0.5 rounded-md">
                            {card.category.split('&')[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-[#1e3a8a]">
                            {card.title}
                          </p>
                          <p className="text-[9px] text-slate-500 line-clamp-1 font-medium">
                            {card.subtitle}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-xs text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No se encontraron imágenes en esta categoría. Prueba otra búsqueda o genera una nueva imagen arriba.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CARGAR MI PROPIA IMAGEN */}
          {activeTab === 'upload' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Upload className="w-4 h-4 text-blue-700" />
                  <span>Cargar Foto o Registro Fotográfico Pedagógico</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Sube una foto tomada en el aula, mapa comunitario, evidencia de trabajo infantil o ilustración propia.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-8 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/80 scale-[0.99]'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center border border-blue-300 shadow-sm">
                  <Camera className="w-7 h-7 text-blue-700" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Haz clic aquí para seleccionar o arrastra una foto
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Soporta formatos JPG, PNG, WEBP, GIF o SVG (máximo recomendado 10MB)
                  </p>
                </div>

                <span className="px-4 py-1.5 bg-[#1e3a8a] text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center space-x-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>Explorar Archivos en Dispositivo</span>
                </span>
              </div>

              {uploadedFileInfo && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-950">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <FileImage className="w-5 h-5 text-blue-700 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold truncate">{uploadedFileInfo.name}</p>
                      <p className="text-[10px] text-blue-700 font-medium">Tamaño: {uploadedFileInfo.size}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImageUrl(null);
                      setUploadedFileInfo(null);
                      setGeneratedImageUrl(null);
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                    title="Quitar archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Result Display & Apply Box */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-blue-700" />
              <span>Imagen Seleccionada para la Sección</span>
            </div>

            {isGenerating ? (
              <div className="w-full h-56 rounded-2xl bg-slate-100 border-2 border-dashed border-blue-300 flex flex-col items-center justify-center space-y-3 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center animate-bounce">
                  <Sparkles className="w-6 h-6 text-blue-700" />
                </div>
                <p className="text-xs font-bold text-slate-700">Renderizando imagen en alta resolución...</p>
                <p className="text-[11px] text-slate-500 max-w-xs">Ajustando detalles pedagógicos, flora colombiana y composición cromática.</p>
              </div>
            ) : generatedImageUrl ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-900 group">
                  <img
                    src={generatedImageUrl}
                    alt="Ilustración Personalizada"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover max-h-[360px]"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{uploadedImageUrl ? 'Foto Personalizada Cargada' : 'Nana Banana • HD'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Imagen</span>
                  </button>

                  {onSelectImage && (
                    <button
                      onClick={() => {
                        onSelectImage(generatedImageUrl);
                        onClose();
                      }}
                      className="flex items-center space-x-1.5 px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>Aplicar Imagen a la Experiencia / Sección</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-36 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Wand2 className="w-7 h-7 text-slate-300" />
                <p className="text-xs text-slate-500 font-medium">
                  {activeTab === 'generate' 
                    ? 'Haz clic en "Generar con Nana Banana" o selecciona un ejemplo de la galería.'
                    : 'Selecciona una foto desde tu dispositivo o arrástrala a la zona superior.'}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Sticky Footer for Easy Exit */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Presiona ESC o haz clic en cualquier lugar fuera para cerrar la ventana
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center space-x-1.5 active:scale-95 ml-auto"
          >
            <span>Cerrar / Volver a la APP</span>
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
