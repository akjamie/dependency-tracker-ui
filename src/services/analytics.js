import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/dependency-tracker/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getStatusAnalysis = async () => {
  try {
    const response = await api.get('/analytics/rules/status');
    return response.data.data; // Returns StatusAnalysisResponse
  } catch (error) {
    console.error('Error fetching status analysis:', error);
    throw error;
  }
};

export const getComponentHealth = async () => {
  try {
    const response = await api.get('/analytics/components/health');
    return response.data.data; // Returns ComponentHealthResponse
  } catch (error) {
    console.error('Error fetching component health:', error);
    throw error;
  }
};

export const getComplianceSummary = async () => {
  try {
    const response = await api.get('/analytics/compliance/summary');
    return response.data.data; // Returns ComplianceSummaryResponse
  } catch (error) {
    console.error('Error fetching compliance summary:', error);
    throw error;
  }
}; 