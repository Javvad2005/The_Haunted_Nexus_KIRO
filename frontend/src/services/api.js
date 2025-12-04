/**
 * Centralized API service for making HTTP requests to the backend
 */

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(message, code, details, status) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

/**
 * Generic fetch wrapper with error handling and retry mechanism
 */
async function fetchWithErrorHandling(url, options = {}, retries = 2) {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses
        const error = data.error || {};
        throw new APIError(
          error.message || 'An error occurred',
          error.code || 'UNKNOWN_ERROR',
          error.details || null,
          response.status
        );
      }

      return data;
    } catch (error) {
      lastError = error;
      
      if (error instanceof APIError) {
        // Don't retry on client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
      }
      
      // If this is not the last attempt, wait before retrying
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      // Last attempt failed, throw the error
      if (lastError instanceof APIError) {
        throw lastError;
      }

      // Handle network errors
      if (lastError.name === 'TypeError' && lastError.message.includes('fetch')) {
        throw new APIError(
          'Network error. Please check your connection.',
          'NETWORK_ERROR',
          lastError.message,
          0
        );
      }

      // Handle JSON parsing errors
      throw new APIError(
        'Failed to parse server response',
        'PARSE_ERROR',
        lastError.message,
        0
      );
    }
  }
  
  // This should never be reached, but just in case
  throw lastError || new APIError(
    'Request failed after retries',
    'RETRY_FAILED',
    null,
    0
  );
}

/**
 * API service object with methods for each endpoint
 */
const api = {
  /**
   * Health check endpoint
   */
  async healthCheck() {
    const url = `${API_BASE_URL}/api/health`;
    return fetchWithErrorHandling(url, { method: 'GET' });
  },

  /**
   * Ghost Chat API
   * @param {string} message - User message
   * @param {string} personaId - Optional persona ID
   * @returns {Promise<{reply: string, timestamp: string, persona: object}>}
   */
  async sendGhostChatMessage(message, personaId = null) {
    const url = `${API_BASE_URL}/api/ghost-chat`;
    const body = { message };
    if (personaId) {
      body.persona_id = personaId;
    }
    const response = await fetchWithErrorHandling(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.data;
  },

  /**
   * Get available ghost personas
   * @returns {Promise<{personas: array}>}
   */
  async getGhostPersonas() {
    const url = `${API_BASE_URL}/api/ghost-personas`;
    const response = await fetchWithErrorHandling(url, {
      method: 'GET',
    });
    return response.data;
  },

  /**
   * Haunted Journal API
   * @param {string} entry - Journal entry text
   * @returns {Promise<{emotion: string, haunted_reply: string, timestamp: string}>}
   */
  async submitJournalEntry(entry) {
    const url = `${API_BASE_URL}/api/haunted-journal`;
    const response = await fetchWithErrorHandling(url, {
      method: 'POST',
      body: JSON.stringify({ entry }),
    });
    return response.data;
  },

  /**
   * Reanimator API
   * @param {string} url - URL to reanimate
   * @returns {Promise<{original_html: string, revived_html: string, archive_date: string, success: boolean}>}
   */
  async reanimateWebsite(url) {
    const apiUrl = `${API_BASE_URL}/api/reanimator`;
    const response = await fetchWithErrorHandling(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    return response.data;
  },

  /**
   * Frankenstein Stitcher API
   * @param {string} api1 - First API selection
   * @param {string} api2 - Second API selection
   * @returns {Promise<{stitched_output: string, api1_data: object, api2_data: object}>}
   */
  async stitchAPIs(api1, api2) {
    const url = `${API_BASE_URL}/api/frankenstein-stitch`;
    const response = await fetchWithErrorHandling(url, {
      method: 'POST',
      body: JSON.stringify({ api1, api2 }),
    });
    return response.data;
  },

  /**
   * Haunted Map - Get Locations API
   * @returns {Promise<{locations: Array}>}
   */
  async getHauntedLocations() {
    const url = `${API_BASE_URL}/api/haunted-locations`;
    const response = await fetchWithErrorHandling(url, { method: 'GET' });
    return response.data;
  },

  /**
   * Haunted Map - Get Ghost Story API
   * @param {string} locationId - Location ID
   * @returns {Promise<{story: string, ending_type: string}>}
   */
  async getGhostStory(locationId) {
    const url = `${API_BASE_URL}/api/ghost-story`;
    const response = await fetchWithErrorHandling(url, {
      method: 'POST',
      body: JSON.stringify({ location_id: locationId }),
    });
    return response.data;
  },

  /**
   * Cursed Image - AI Transform Image
   * @param {string} imageData - Base64 image data
   * @param {string} prompt - Transformation prompt
   * @param {string} style - Style ID
   * @returns {Promise<{transformed_image: string, description: string, style: string, prompt: string}>}
   */
  async aiTransformImage(imageData, prompt, style) {
    const url = `${API_BASE_URL}/api/cursed-image/ai-transform`;
    const response = await fetchWithErrorHandling(url, {
      method: 'POST',
      body: JSON.stringify({ image: imageData, prompt, style }),
    });
    return response.data;
  },

  /**
   * Cursed Image - Get Available AI Styles
   * @returns {Promise<{styles: array}>}
   */
  async getAIImageStyles() {
    const url = `${API_BASE_URL}/api/cursed-image/styles`;
    const response = await fetchWithErrorHandling(url, {
      method: 'GET',
    });
    return response.data;
  },
};

export default api;
export { APIError };
