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

export const getTechnologyStackFacet = async () => {
  try {
    const response = await api.get('/dependencies/facets/technology');
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to fetch technology stack facet.'
    );
  }
};

export const getVersionPatternFacet = async () => {
  try {
    const response = await api.get('/dependencies/facets/versions');
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to fetch version distribution facet.'
    );
  }
};

export const getFrameworkUsageFacet = () => api.get('/dependencies/facets/frameworks').then(r => r.data);
export const getComponentActivityFacet = async () => {
  try {
    const response = await api.get('/dependencies/facets/activity');
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to fetch component activity facet.'
    );
  }
};

export default api; 