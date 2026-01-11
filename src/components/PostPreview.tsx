import { PropertyData } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Car, Ruler, MapPin } from 'lucide-react';

interface PostPreviewProps {
  data: PropertyData;
  photos: string[];
}

export const PostPreview = ({ data, photos }: PostPreviewProps) => {
  const formatPrice = (price: string) => {
    if (!price) return 'Consulte';
    const num = parseFloat(price.replace(/\D/g, ''));
    if (isNaN(num)) return price;
    return `R$ ${num.toLocaleString('pt-BR')}`;
  };

  const hasData = data.title || data.price || data.location || photos.length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">📷</span>
        </div>
        <p className="text-center">
          Adicione fotos e preencha os dados<br />
          para visualizar o preview
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feed Post Preview */}
      <Card className="overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative">
          {photos.length > 0 ? (
            <img
              src={photos[0]}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-6xl opacity-50">🏠</span>
            </div>
          )}
          
          {/* Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <Badge className="mb-2 bg-primary">{data.type || 'Imóvel'}</Badge>
            <h3 className="text-white font-bold text-lg">
              {data.title || 'Título do Imóvel'}
            </h3>
            <p className="text-white/90 text-xl font-bold">
              {formatPrice(data.price)}
            </p>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Location */}
          {(data.location || data.neighborhood) && (
            <div className="flex items-center gap-1 text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                {[data.neighborhood, data.location].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Specs */}
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
              <Bed className="h-4 w-4 text-primary mb-1" />
              <span className="text-sm font-medium">{data.bedrooms || '0'}</span>
              <span className="text-xs text-muted-foreground">Quartos</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
              <Bath className="h-4 w-4 text-primary mb-1" />
              <span className="text-sm font-medium">{data.bathrooms || '0'}</span>
              <span className="text-xs text-muted-foreground">Banheiros</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
              <Car className="h-4 w-4 text-primary mb-1" />
              <span className="text-sm font-medium">{data.parkingSpaces || '0'}</span>
              <span className="text-xs text-muted-foreground">Vagas</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
              <Ruler className="h-4 w-4 text-primary mb-1" />
              <span className="text-sm font-medium">{data.area || '0'}</span>
              <span className="text-xs text-muted-foreground">m²</span>
            </div>
          </div>

          {/* Features */}
          {data.features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {data.features.slice(0, 4).map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {data.features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{data.features.length - 4}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Story Preview Thumbnails */}
      {photos.length > 1 && (
        <div>
          <p className="text-sm font-medium mb-2">Stories ({photos.length})</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-16 h-28 rounded-lg overflow-hidden border-2 border-primary/20"
              >
                <img
                  src={photo}
                  alt={`Story ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
