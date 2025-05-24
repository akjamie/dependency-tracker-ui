import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/dependency-tracker',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const searchDependencies = async (params) => {
  try {
    // Remove empty values to keep the request clean
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '')
    );

    console.log('Searching with params:', cleanParams); // Debug log
    const response = await api.post('/api/v1/dependencies', cleanParams);
    console.log('Search response:', response.data); // Debug log
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to search dependencies.'
    );
  }
};

export const dependencyService = {
  uploadComponent: async (componentData) => {
    const response = await api.put('/api/v1/components', componentData);
    return response.data;
  },
  
  registerComponent: async (componentData) => {
    const response = await api.post('/api/v1/components', componentData);
    return response.data;
  },
  
  unregisterComponent: async (componentData) => {
    const response = await api.delete('/api/v1/components', { data: componentData });
    return response.data;
  },
};

export const ruleService = {
  getRules: async () => {
    const response = await api.get('/api/v1/rules');
    return response.data;
  },
  
  createRule: async (ruleData) => {
    const response = await api.put('/api/v1/rules', ruleData);
    return response.data;
  },
  
  updateRule: async (ruleId, ruleData) => {
    const response = await api.patch(`/api/v1/rules/${ruleId}`, ruleData);
    return response.data;
  },
  
  deleteRule: async (ruleId) => {
    const response = await api.delete(`/api/v1/rules/${ruleId}`);
    return response.data;
  },
};

export const getTechnologyStackFacet = async () => {
  try {
    const response = await api.get('/api/v1/dependencies/facets/technology');
    return response.data.data;
  } catch (error) {
    console.warn('Failed to fetch technology stack facet:', error);
    return []; // Return empty array instead of throwing
  }
};

export const getVersionPatternFacet = async () => {
  try {
    const response = await api.get('/api/v1/dependencies/facets/versions');
    return response.data.data;
  } catch (error) {
    console.warn('Failed to fetch version distribution facet:', error);
    return []; // Return empty array instead of throwing
  }
};

export const getFrameworkUsageFacet = async () => {
  try {
    const response = await api.get('/api/v1/dependencies/facets/frameworks');
    return response.data.data;
  } catch (error) {
    console.warn('Failed to fetch framework usage facet:', error);
    return []; // Return empty array instead of throwing
  }
};

export const getComponentActivityFacet = async () => {
  try {
    const response = await api.get('/api/v1/dependencies/facets/activity');
    return response.data.data;
  } catch (error) {
    console.warn('Failed to fetch component activity facet:', error);
    return []; // Return empty array instead of throwing
  }
};

export default api; 