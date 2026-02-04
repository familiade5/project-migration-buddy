import { EducationalSlide } from '@/types/educational';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical, Type, List, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationalSlideEditorProps {
  slides: EducationalSlide[];
  onChange: (slides: EducationalSlide[]) => void;
}

const slideTypeLabels: Record<EducationalSlide['type'], string> = {
  cover: 'Capa',
  content: 'Conteúdo',
  highlight: 'Destaque',
  cta: 'CTA',
};

const slideTypeColors: Record<EducationalSlide['type'], string> = {
  cover: 'bg-blue-500',
  content: 'bg-gray-500',
  highlight: 'bg-amber-500',
  cta: 'bg-green-500',
};

export const EducationalSlideEditor = ({ slides, onChange }: EducationalSlideEditorProps) => {
  const updateSlide = (index: number, updates: Partial<EducationalSlide>) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], ...updates };
    onChange(newSlides);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 3) return; // Minimum 3 slides
    onChange(slides.filter((_, i) => i !== index));
  };

  const addSlide = (type: EducationalSlide['type']) => {
    if (slides.length >= 10) return; // Maximum 10 slides
    const newSlide: EducationalSlide = {
      type,
      headline: type === 'cta' ? 'Fale conosco' : 'Novo slide',
      body: type === 'cta' ? 'Entre em contato para saber mais.' : '',
    };
    // Insert before the last slide (usually CTA)
    const insertIndex = slides.length > 0 && slides[slides.length - 1].type === 'cta' 
      ? slides.length - 1 
      : slides.length;
    const newSlides = [...slides];
    newSlides.splice(insertIndex, 0, newSlide);
    onChange(newSlides);
  };

  const toggleBullets = (index: number) => {
    const slide = slides[index];
    if (slide.bullets) {
      // Convert bullets to body
      updateSlide(index, { body: slide.bullets.join('\n'), bullets: undefined });
    } else {
      // Convert body to bullets
      const bullets = slide.body?.split('\n').filter(b => b.trim()) || [''];
      updateSlide(index, { bullets, body: undefined });
    }
  };

  const updateBullet = (slideIndex: number, bulletIndex: number, value: string) => {
    const slide = slides[slideIndex];
    if (!slide.bullets) return;
    const newBullets = [...slide.bullets];
    newBullets[bulletIndex] = value;
    updateSlide(slideIndex, { bullets: newBullets });
  };

  const addBullet = (slideIndex: number) => {
    const slide = slides[slideIndex];
    if (!slide.bullets) return;
    updateSlide(slideIndex, { bullets: [...slide.bullets, ''] });
  };

  const removeBullet = (slideIndex: number, bulletIndex: number) => {
    const slide = slides[slideIndex];
    if (!slide.bullets || slide.bullets.length <= 1) return;
    updateSlide(slideIndex, { bullets: slide.bullets.filter((_, i) => i !== bulletIndex) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {slides.length} slides
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSlide('content')}
            disabled={slides.length >= 10}
            className="text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Conteúdo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSlide('highlight')}
            disabled={slides.length >= 10}
            className="text-xs"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Destaque
          </Button>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 bg-white space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-300" />
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full text-white",
                  slideTypeColors[slide.type]
                )}>
                  {index + 1}. {slideTypeLabels[slide.type]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {slide.type === 'content' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBullets(index)}
                    className="h-7 w-7 p-0"
                    title={slide.bullets ? 'Converter para parágrafo' : 'Converter para lista'}
                  >
                    {slide.bullets ? <Type className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSlide(index)}
                  disabled={slides.length <= 3 || slide.type === 'cover'}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                value={slide.headline}
                onChange={(e) => updateSlide(index, { headline: e.target.value })}
                placeholder="Título do slide"
                className="font-medium"
              />

              {slide.bullets ? (
                <div className="space-y-2">
                  {slide.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-2">
                      <span className="text-gray-400 mt-2">•</span>
                      <Input
                        value={bullet}
                        onChange={(e) => updateBullet(index, bulletIndex, e.target.value)}
                        placeholder={`Item ${bulletIndex + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBullet(index, bulletIndex)}
                        disabled={slide.bullets!.length <= 1}
                        className="h-9 w-9 p-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addBullet(index)}
                    className="text-xs text-gray-500"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar item
                  </Button>
                </div>
              ) : (
                <Textarea
                  value={slide.body || ''}
                  onChange={(e) => updateSlide(index, { body: e.target.value })}
                  placeholder="Texto do slide (opcional)"
                  rows={2}
                  className="resize-none"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
