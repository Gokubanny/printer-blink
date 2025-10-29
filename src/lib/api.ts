const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://printer-blink-uqb0.onrender.com/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('=== API REQUEST DEBUG ===');
    console.log('URL:', url);
    console.log('Method:', options.method);
    console.log('Headers:', options.headers);
    console.log('Body:', options.body);

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('=== API RESPONSE DEBUG ===');
      console.log('Status:', response.status);
      console.log('Response Data:', data);

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.msg || err.message).join(', ');
          throw new Error(errorMessages || data.message || 'Validation failed');
        }
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('=== API ERROR ===', error);
      throw error;
    }
  }

  private async authRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('admin_token');
    console.log('Auth Token:', token ? 'Present' : 'Missing');
    
    return this.request(endpoint, {
      ...options,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });
  }

  // Auth endpoints
  async login(email: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getMe() {
    return this.authRequest('/auth/me');
  }

  async logout() {
    return this.authRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // Printer endpoints
  async getPrinters(params?: { search?: string; isAvailable?: boolean }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isAvailable !== undefined) queryParams.append('isAvailable', params.isAvailable.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/printers${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getPrinter(id: string) {
    return this.request(`/printers/${id}`);
  }

  async createPrinter(printerData: any) {
    console.log('=== CREATE PRINTER DEBUG ===');
    console.log('Raw printerData received:', printerData);
    
    // Validate data before sending
    if (!printerData.name || !printerData.price || !printerData.description || !printerData.image) {
      console.error('Missing required fields:', {
        name: !!printerData.name,
        price: !!printerData.price,
        description: !!printerData.description,
        image: !!printerData.image
      });
      throw new Error('Missing required fields in printer data');
    }

    const dataToSend = {
      name: printerData.name,
      price: parseFloat(printerData.price),
      image: printerData.image,
      description: printerData.description,
      isAvailable: printerData.isAvailable !== undefined ? printerData.isAvailable : true,
      category: printerData.category || 'other',
      brand: printerData.brand || ''
    };

    console.log('Final data being sent to backend:', dataToSend);
    console.log('Stringified body:', JSON.stringify(dataToSend));

    return this.authRequest('/printers', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
    });
  }

  async updatePrinter(id: string, printerData: any) {
    const dataToSend = {
      name: printerData.name,
      price: parseFloat(printerData.price),
      image: printerData.image,
      description: printerData.description,
      isAvailable: printerData.isAvailable,
      category: printerData.category || 'other',
      brand: printerData.brand || ''
    };

    return this.authRequest(`/printers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dataToSend),
    });
  }

  async deletePrinter(id: string) {
    return this.authRequest(`/printers/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleAvailability(id: string) {
    return this.authRequest(`/printers/${id}/toggle-availability`, {
      method: 'PATCH',
    });
  }

  async getStats() {
    return this.authRequest('/printers/admin/stats');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Note: Make sure your printer objects returned from the backend have an 'id' field
// The backend is returning '_id' from MongoDB, so you might need to map it to 'id'