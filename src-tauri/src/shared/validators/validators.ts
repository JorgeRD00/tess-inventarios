/**
 * Email validator
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone validator (basic format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Tax ID validator (basic format - can be customized per country)
 */
export const isValidTaxId = (taxId: string): boolean => {
  // Basic validation - at least 10 characters alphanumeric
  const taxIdRegex = /^[A-Z0-9]{10,}$/i;
  return taxIdRegex.test(taxId);
};

/**
 * Code validator (alphanumeric, dashes, underscores)
 */
export const isValidCode = (code: string): boolean => {
  const codeRegex = /^[A-Z0-9-_]+$/i;
  return codeRegex.test(code);
};

/**
 * Positive number validator
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * Non-negative number validator
 */
export const isNonNegative = (value: number): boolean => {
  return value >= 0;
};

/**
 * Required field validator
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Alias for isValidEmail
 */
export const isEmail = isValidEmail;

/**
 * Alias for isValidPhone
 */
export const isPhone = isValidPhone;
