// Currency formatting utilities for Brazilian Real (BRL)

/**
 * Parse a string that may contain currency formatting and return the numeric value
 */
export const parseCurrencyValue = (value: string): number => {
  if (!value) return 0;
  
  // Remove R$, spaces, and thousands separators (.)
  const cleanValue = value
    .replace(/R\$\s*/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  
  const number = parseFloat(cleanValue);
  return isNaN(number) ? 0 : number;
};

/**
 * Format a numeric value as Brazilian currency (R$ X.XXX,XX)
 */
export const formatCurrency = (value: number): string => {
  if (value === 0) return '';
  
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format input value as currency while typing
 * Accepts raw number input and formats it
 */
export const formatCurrencyInput = (rawValue: string): string => {
  // Remove all non-numeric characters
  const numericOnly = rawValue.replace(/\D/g, '');
  
  if (!numericOnly) return '';
  
  // Convert to number (assuming cents)
  const valueInCents = parseInt(numericOnly, 10);
  const valueInReais = valueInCents / 100;
  
  return formatCurrency(valueInReais);
};

/**
 * Auto-format a simple number to currency
 * e.g., "4500" -> "R$ 4.500,00"
 */
export const autoFormatToCurrency = (value: string): string => {
  if (!value) return '';
  
  // If already formatted (contains R$), return as is
  if (value.includes('R$')) return value;
  
  // Remove any non-numeric characters except comma and dot
  const cleanValue = value.replace(/[^\d,.]/g, '');
  
  // If empty after cleaning, return empty
  if (!cleanValue) return '';
  
  // Parse as number
  let numericValue: number;
  
  // Check if it has decimal places
  if (cleanValue.includes(',')) {
    // Brazilian format: 4.500,00
    numericValue = parseFloat(cleanValue.replace(/\./g, '').replace(',', '.'));
  } else if (cleanValue.includes('.') && cleanValue.split('.')[1]?.length === 2) {
    // US format with cents: 4500.00
    numericValue = parseFloat(cleanValue);
  } else {
    // Plain number: 4500 -> assume it's the full value
    numericValue = parseFloat(cleanValue);
  }
  
  if (isNaN(numericValue)) return value;
  
  return formatCurrency(numericValue);
};
