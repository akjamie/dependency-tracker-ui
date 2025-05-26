import api from './api';

const RULES_ENDPOINT = '/api/v1/rules';

export const searchRules = async (params) => {
  try {
    const response = await api.post(`${RULES_ENDPOINT}/search`, params);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to search rules.'
    );
  }
};

export const getRuleById = async (id) => {
  try {
    const response = await api.get(`${RULES_ENDPOINT}/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to get rule.'
    );
  }
};

export const createRule = async (ruleData) => {
  try {
    const response = await api.put(RULES_ENDPOINT, ruleData);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to create rule.'
    );
  }
};

export const updateRule = async (id, ruleData) => {
  try {
    const response = await api.post(`${RULES_ENDPOINT}/${id}`, ruleData);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error?.message ||
      error?.message ||
      'Failed to update rule.'
    );
  }
}; 