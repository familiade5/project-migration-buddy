import { useDraggable } from '@dnd-kit/core';
import { RentalProperty } from '@/types/rentalProperty';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Bed, Bath, Car, MapPin, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatCurrency';

interface RentalPropertyKanbanCardProps {
  property: RentalProperty;
  onClick: () => void;
}

export function RentalPropertyKanbanCard({ property, onClick }: RentalPropertyKanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: property.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const totalMonthly = (property.rent_value || 0) + 
    (property.condominium_fee || 0) + 
    (property.iptu_value || 0);

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        onClick={onClick}
        className={cn(
          'cursor-pointer transition-all hover:shadow-md border-l-4 bg-white border-gray-200',
          isDragging && 'opacity-50 shadow-xl',
          property.current_stage === 'disponivel' && 'border-l-green-500',
          property.current_stage === 'reservado' && 'border-l-yellow-500',
          property.current_stage === 'ocupado' && 'border-l-blue-500',
          property.current_stage === 'catalogo' && 'border-l-gray-500'
        )}
      >
        <CardContent className="p-3">
          {/* Cover Image */}
          {property.cover_image_url && (
            <div className="w-full h-24 mb-2 rounded overflow-hidden">
              <img
                src={property.cover_image_url}
                alt={property.code}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Property Code */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs font-mono border-gray-300 text-gray-700">
              {property.code}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {property.property_type}
            </Badge>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1 text-xs text-gray-600 mb-2">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">
              {property.address}
              {property.neighborhood && `, ${property.neighborhood}`}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-3 h-3" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-3 h-3" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.garage_spaces !== undefined && property.garage_spaces > 0 && (
              <div className="flex items-center gap-1">
                <Car className="w-3 h-3" />
                <span>{property.garage_spaces}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign className="w-3 h-3" />
              <span className="font-semibold text-sm">
                {formatCurrency(property.rent_value)}
              </span>
            </div>
            {totalMonthly > property.rent_value && (
              <span className="text-xs text-gray-400">
                Total: {formatCurrency(totalMonthly)}
              </span>
            )}
          </div>

          {/* Features Badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {property.is_furnished && (
              <Badge variant="outline" className="text-[10px] px-1 border-gray-300 text-gray-600">
                Mobiliado
              </Badge>
            )}
            {property.accepts_pets && (
              <Badge variant="outline" className="text-[10px] px-1 border-gray-300 text-gray-600">
                Aceita Pet
              </Badge>
            )}
          </div>

          {/* Owner */}
          {property.owner && (
            <div className="text-xs text-gray-500 mt-2 truncate">
              Prop: {property.owner.full_name}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
