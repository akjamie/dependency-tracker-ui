import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/dependency-tracker/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchDependencies = async (params) => {
  try {
    // Remove empty values to keep the request clean
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '')
    );

    console.log('Searching with params:', cleanParams); // Debug log
    const response = await api.post('/dependencies', cleanParams);
    console.log('Search response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error searching dependencies:', error);
    throw error;
  }
};

export const dependencyService = {
  uploadComponent: async (componentData) => {
    const response = await api.put('/components', componentData);
    return response.data;
  },
  
  registerComponent: async (componentData) => {
    const response = await api.post('/components', componentData);
    return response.data;
  },
  
  unregisterComponent: async (componentData) => {
    const response = await api.delete('/components', { data: componentData });
    return response.data;
  },
};

export const ruleService = {
  // These endpoints need to be implemented on the backend
  getRules: async () => {
    const response = await api.get('/rules');
    return response.data;
  },
  
  createRule: async (ruleData) => {
    const response = await api.post('/rules', ruleData);
    return response.data;
  },
  
  updateRule: async (ruleId, ruleData) => {
    const response = await api.put(`/rules/${ruleId}`, ruleData);
    return response.data;
  },
  
  deleteRule: async (ruleId) => {
    const response = await api.delete(`/rules/${ruleId}`);
    return response.data;
  },
};

export const getTechnologyStackFacet = () => api.get('/dependencies/facets/technology').then(r => r.data);
export const getVersionPatternFacet = () => api.get('/dependencies/facets/versions').then(r => r.data);
export const getFrameworkUsageFacet = () => api.get('/dependencies/facets/frameworks').then(r => r.data);
export const getComponentActivityFacet = () => api.get('/dependencies/facets/activity').then(r => r.data);

export default api; 