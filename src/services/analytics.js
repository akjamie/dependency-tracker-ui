import api from './api';

export const getStatusAnalysis = async () => {
  try {
    const response = await api.get('/api/v1/analytics/rules/status');
    return response.data.data; // Returns StatusAnalysisResponse
  } catch (error) {
    console.error('Error fetching status analysis:', error);
    throw error;
  }
};

export const getComponentHealth = async () => {
  try {
    const response = await api.get('/api/v1/analytics/components/health');
    return response.data.data; // Returns ComponentHealthResponse
  } catch (error) {
    console.error('Error fetching component health:', error);
    throw error;
  }
};

export const getComplianceSummary = async () => {
  try {
    const response = await api.get('/api/v1/analytics/compliance/summary');
    return response.data.data; // Returns ComplianceSummaryResponse
  } catch (error) {
    console.error('Error fetching compliance summary:', error);
    throw error;
  }
}; 