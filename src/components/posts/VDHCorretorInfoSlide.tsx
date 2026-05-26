import { PropertyData } from '@/types/property';
import sobreNosImage from '@/assets/vdh-sobre-nos.png';

interface Props {
  data?: PropertyData;
  photo?: string | null;
  photos?: string[];
}

export const VDHCorretorInfoSlide = ({}: Props) => {
  return (
    <div
      className="post-template"
      style={{
        width: 1080,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={sobreNosImage}
        alt="Sobre nós - Iury Sampaio"
        crossOrigin="anonymous"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
};
