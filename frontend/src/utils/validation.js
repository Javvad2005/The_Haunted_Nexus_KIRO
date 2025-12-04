/**
 * Validation utilities for user inputs
 */

/**
 * Validate URL format
 */
export function validateURL(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, error: 'URL cannot be empty' };
  }

  try {
    new URL(trimmed);
    return { valid: true, value: trimmed };
  } catch {
    return { valid: false, error: 'Please enter a valid URL (e.g., https://example.com)' };
  }
}

/**
 * Validate text input (non-empty)
 */
export function validateText(text, fieldName = 'Text', minLength = 1, maxLength = 5000) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }

  const trimmed = text.trim();
  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} character${minLength > 1 ? 's' : ''}` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate API selection
 */
export function validateAPISelection(api1, api2) {
  if (!api1 || !api2) {
    return { valid: false, error: 'Please select both APIs' };
  }

  if (api1 === api2) {
    return { valid: false, error: 'Please select two different APIs' };
  }

  return { valid: true };
}

/**
 * Debounce function for input handlers
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
