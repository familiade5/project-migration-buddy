export type PdfRGB = readonly [number, number, number];

export interface PdfTheme {
  page: {
    margin: number;
    gutter: number;
  };
  colors: {
    ink: PdfRGB;
    muted: PdfRGB;
    border: PdfRGB;
    surface: PdfRGB;
    surfaceAlt: PdfRGB;
    brand: PdfRGB;
    brandDark: PdfRGB;
    success: PdfRGB;
    danger: PdfRGB;
    warn: PdfRGB;
  };
  fonts: {
    family: "helvetica";
    sizes: {
      h1: number;
      h2: number;
      h3: number;
      body: number;
      small: number;
      tiny: number;
    };
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Paleta "big players": alto contraste, pouco ruído, muita hierarquia.
export const defaultPdfTheme: PdfTheme = {
  page: {
    margin: 14,
    gutter: 6,
  },
  colors: {
    ink: [17, 24, 39], // slate-900
    muted: [75, 85, 99], // slate-600
    border: [229, 231, 235], // gray-200
    surface: [255, 255, 255],
    surfaceAlt: [246, 247, 249],
    brand: [37, 99, 235], // blue-600
    brandDark: [15, 23, 42], // slate-900 (header)
    success: [22, 163, 74], // green-600
    danger: [220, 38, 38], // red-600
    warn: [217, 119, 6], // amber-600
  },
  fonts: {
    family: "helvetica",
    sizes: {
      h1: 18,
      h2: 12,
      h3: 10,
      body: 9,
      small: 7.5,
      tiny: 6,
    },
  },
  radius: {
    sm: 2,
    md: 4,
    lg: 6,
  },
};
