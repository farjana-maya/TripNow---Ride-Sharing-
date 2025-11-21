import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

export const driverService = {
  submitDriverInfo: async (formData) => {
    try {
      const token = localStorage.getItem('auth_token'); // your saved JWT

      const data = new FormData();

      for (let key in formData) {
        if (key === 'vehicle_documents') {
          formData.vehicle_documents.forEach((file) => {
            data.append('vehicle_documents[]', file);
          });
        } else if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      }

      const response = await api.post('/driver/submit-info', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data; // ✅ only return data
    } catch (error) {
      console.error('Driver Service Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Server error',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  getAllDrivers: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token');

      const queryString = new URLSearchParams(params).toString();
      const url = `/driver/all${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Get All Drivers Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch drivers',
        data: { data: [], last_page: 1 }
      };
    }
  },

  getDriverStats: async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await api.get('/driver/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Get Driver Stats Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stats',
      };
    }
  },

  approveDriver: async (driverId) => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await api.post(`/driver/approve/${driverId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Approve Driver Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve driver',
      };
    }
  },

  rejectDriver: async (driverId, reason) => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await api.post(`/driver/reject/${driverId}`, { rejection_reason: reason }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Reject Driver Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject driver',
      };
    }
  },

  toggleBlockDriver: async (driverId) => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await api.post(`/driver/toggle-block/${driverId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Toggle Block Driver Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update driver status',
      };
    }
  },
};
