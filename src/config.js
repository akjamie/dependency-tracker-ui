// Load runtime configuration
const loadConfig = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'env.js';
    script.onload = () => {
      console.log('Environment loaded:', window.ENV);  // Debug log
      resolve(window.ENV || {});
    };
    script.onerror = () => {
      console.warn('Failed to load runtime config, using default values');
      resolve({
        API_URL: 'http://localhost:8080/dependency-tracker',
        ENABLE_ANALYTICS: false,
        ENABLE_LOGGING: true,
        APP_NAME: 'Dependency Tracker',
        APP_VERSION: '1.0.0'
      });
    };
    document.head.appendChild(script);
  });
};

export const config = {
  load: loadConfig
};

export default config; 