import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Sprout, Heart, Music2, Wand2, ClipboardCheck } from 'lucide-react';
import { HIGH_QUALITY_SAMPLE_IMAGES, getImageInfoBySrc } from '../data/generatedImages';
import { ImageGeneratorModal } from './ImageGeneratorModal';

interface PhaseIllustrationProps {
  phaseNumber: number;
  svgType?: string;
  customImageUrl?: string;
  phaseTitle?: string;
  onImageGenerated?: (url: string) => void;
}

export const PhaseIllustration: React.FC<PhaseIllustrationProps> = ({
  phaseNumber,
  svgType,
  customImageUrl,
  phaseTitle,
  onImageGenerated
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(customImageUrl || null);

  useEffect(() => {
    setCurrentImage(customImageUrl || null);
  }, [customImageUrl]);

  const getDefaultFallbackImage = () => {
    if (phaseNumber === 1 || svgType === 'nature' || svgType === 'wind') return HIGH_QUALITY_SAMPLE_IMAGES.detectivesJardin;
    if (phaseNumber === 2 || svgType === 'body') return HIGH_QUALITY_SAMPLE_IMAGES.lecturaCuento;
    if (phaseNumber === 3 || svgType === 'planting') return HIGH_QUALITY_SAMPLE_IMAGES.terrarioDiario;
    if (phaseNumber === 4 || svgType === 'gallery') return HIGH_QUALITY_SAMPLE_IMAGES.rinconNaturaleza;
    return HIGH_QUALITY_SAMPLE_IMAGES.rinconCalma;
  };

  const displaySrc = currentImage || customImageUrl || getDefaultFallbackImage();
  const cardInfo = getImageInfoBySrc(displaySrc);

  const getBadgeStyle = () => {
    if (phaseNumber === 1) return { color: 'bg-blue-900/80 text-blue-100 border-blue-600/50', icon: Compass };
    if (phaseNumber === 2) return { color: 'bg-purple-900/80 text-purple-100 border-purple-600/50', icon: Heart };
    if (phaseNumber === 3) return { color: 'bg-amber-900/80 text-amber-100 border-amber-600/50', icon: Sprout };
    if (phaseNumber === 4) return { color: 'bg-indigo-900/80 text-indigo-100 border-indigo-600/50', icon: Music2 };
    return { color: 'bg-emerald-900/80 text-emerald-100 border-emerald-500/60', icon: ClipboardCheck };
  };

  const badgeStyle = getBadgeStyle();
  const IconComponent = badgeStyle.icon;

  const badgeText = phaseNumber === 5
    ? `Momento 5 • Valorar el Proceso`
    : cardInfo?.category 
    ? `Momento ${phaseNumber} • ${cardInfo.category}`
    : `Fase ${phaseNumber}: Vivencia Pedagógica`;

  const captionText = cardInfo?.title || phaseTitle || 'Ilustración Pedagógica';

  const handleApplyImage = (url: string) => {
    setCurrentImage(url);
    if (onImageGenerated) {
      onImageGenerated(url);
    }
  };

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-md group bg-slate-900">
        
        {/* Main Image View */}
        <img
          src={displaySrc}
          alt={captionText}
          referrerPolicy="no-referrer"
          className="w-full h-48 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Top Badge */}
        <div className={`absolute top-2.5 left-2.5 flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm backdrop-blur-md ${badgeStyle.color}`}>
          <IconComponent className="w-3.5 h-3.5" />
          <span>{badgeText}</span>
        </div>

        {/* Nana Banana Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-[#1e3a8a] text-amber-300 hover:text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold border border-amber-400/30 flex items-center space-x-1 shadow-md transition-all active:scale-95"
        >
          <Wand2 className="w-3 h-3 text-amber-300" />
          <span>Nana Banana AI</span>
        </button>

        {/* Bottom Caption */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white flex items-center justify-between text-xs font-semibold drop-shadow-md">
          <div className="flex items-center space-x-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate text-slate-100">{captionText}</span>
          </div>
        </div>

      </div>

      {/* Generator Modal */}
      <ImageGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPrompt={cardInfo?.prompt || (phaseTitle ? `Ilustración infantil cálida Decreto 1411 para la fase: "${phaseTitle}". Niños y niñas en aula preescolar colombiana explorando y creando.` : 'Niños de preescolar en un aula colombiana explorando en grupo.')}
        title={`Generar Ilustración Nana Banana para ${phaseTitle || badgeText}`}
        onSelectImage={handleApplyImage}
      />
    </>
  );
};

