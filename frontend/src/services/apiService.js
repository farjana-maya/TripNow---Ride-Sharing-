// FILE: src/services/ApiService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  /**
   * Get authentication token from localStorage
   */
  static getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  /**
   * Set authentication token in localStorage
   */
  static setAuthToken(token) {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Remove authentication token
   */
  static clearAuthToken() {
    localStorage.removeItem('auth_token');
  }

  /**
   * Get default headers with auth token
   */
  static getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make API request
   */
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.auth !== false),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.clearAuthToken();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }

        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  static async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  static async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  static async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  static async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  static async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // ==================== ADMIN RIDE ENDPOINTS ====================

  /**
   * Get all rides with filters
   */
  static async getRides(params = {}) {
    return this.get('/admin/rides', params);
  }

  /**
   * Get ongoing rides
   */
  static async getOngoingRides() {
    return this.get('/admin/rides/ongoing');
  }

  /**
   * Get completed rides
   */
  static async getCompletedRides(params = {}) {
    return this.get('/admin/rides/completed', params);
  }

  /**
   * Get cancelled rides
   */
  static async getCancelledRides(params = {}) {
    return this.get('/admin/rides/cancelled', params);
  }

  /**
   * Get ride statistics
   */
  static async getRideStatistics() {
    return this.get('/admin/rides/statistics');
  }

  /**
   * Get single ride details
   */
  static async getRideDetails(rideId) {
    return this.get(`/admin/rides/${rideId}`);
  }

  /**
   * Update ride status
   */
  static async updateRideStatus(rideId, status, reason = null) {
    return this.patch(`/admin/rides/${rideId}/status`, { status, reason });
  }

  /**
   * Assign driver to ride
   */
  static async assignDriver(rideId, driverId) {
    return this.post(`/admin/rides/${rideId}/assign-driver`, { driver_id: driverId });
  }

  /**
   * Export rides to CSV
   */
  static async exportRides(params = {}) {
    return this.get('/admin/rides/export/csv', params);
  }

  /**
   * Clear all active rides
   */
  static async clearActiveRides() {
    return this.post('/admin/rides/clear-active');
  }

  /**
   * Bulk update ride status
   */
  static async bulkUpdateRideStatus(rideIds, status, reason = null) {
    return this.post('/admin/rides/bulk-update-status', {
      ride_ids: rideIds,
      status,
      reason
    });
  }
}

export default ApiService;