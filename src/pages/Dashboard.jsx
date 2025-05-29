import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Paper, Alert, CircularProgress, Stack, Chip, useTheme, alpha } from '@mui/material';
import SummaryCards from '../components/dashboard/facets/SummaryCards';
import LanguagePieChart from '../components/dashboard/facets/LanguagePieChart';
import BuildManagerBarChart from '../components/dashboard/facets/BuildManagerBarChart';
import VersionDistributionTabs from '../components/dashboard/facets/VersionDistributionTabs';
import StatusDistributionChart from '../components/dashboard/charts/StatusDistributionChart';
import {
  getTechnologyStackFacet,
  getVersionPatternFacet,
  getComponentActivityFacet,
} from '../services/api';
import { getStatusAnalysis, getComponentHealth, getComplianceSummary } from '../services/analytics';
import {
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  InfoOutlined as InfoOutlinedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const CHART_HEIGHT = 440; // Adjusted height for potentially more charts

const STATUS_COLORS = {
  OPEN: 'error',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'secondary',
  IGNORED: 'info',
};

const STATUS_ICONS = {
  OPEN: <ErrorOutlineIcon />,
  IN_PROGRESS: <WarningAmberIcon />,
  RESOLVED: <CheckCircleOutlineIcon />,
  CLOSED: <CloseIcon />,
  IGNORED: <InfoOutlinedIcon />,
};

export default function Dashboard() {
  const theme = useTheme();
  const [tech, setTech] = useState(null);
  const [versions, setVersions] = useState(null);
  const [activity, setActivity] = useState(null);

  const [statusAnalysis, setStatusAnalysis] = useState(null);
  const [componentHealth, setComponentHealth] = useState(null);
  const [complianceSummary, setComplianceSummary] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch import statistics data initially
  useEffect(() => {
    Promise.all([
      getTechnologyStackFacet(),
      getVersionPatternFacet(),
      getComponentActivityFacet()
    ])
      .then(([techData, versionData, activityData]) => {
        setTech(techData);
        setVersions(versionData);
        setActivity(activityData);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load import statistics data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array to run only once on mount

  // Fetch violation analytics data initially
  useEffect(() => {
    Promise.all([
      getStatusAnalysis(),
      getComponentHealth(),
      getComplianceSummary()
    ])
      .then(([statusData, healthData, summaryData]) => {
        setStatusAnalysis(statusData);
        setComponentHealth(healthData);
        setComplianceSummary(summaryData);
      })
      .catch((err) => {
        setError(prev => prev ? `${prev} and Failed to load violation analytics data.` : 'Failed to load violation analytics data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array to run only once on mount

  // Auto-refresh component health data every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      getComponentHealth()
        .then(healthData => {
          setComponentHealth(healthData);
        })
        .catch(err => {
          console.error('Error refreshing component health:', err);
        });
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []); // Empty dependency array - setInterval is managed internally

  // Auto-refresh status analysis and compliance summary every 3 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      Promise.all([
        getStatusAnalysis(),
        getComplianceSummary()
      ])
      .then(([statusData, summaryData]) => {
        setStatusAnalysis(statusData);
        setComplianceSummary(summaryData);
      })
      .catch(err => {
        console.error('Error refreshing analytics data:', err);
      });
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(refreshInterval);
  }, []); // Empty dependency array

  // Calculate summary values for import statistics
  const totalComponents = activity?.componentTypes
    ? Object.values(activity.componentTypes).reduce((a, b) => a + b, 0)
    : 0;

  // Group dependencies by language for import statistics
  const dependenciesByLanguage = tech?.languageDistribution
    ? Object.entries(tech.languageDistribution).map(([language, count]) => ({
        language,
        count
      }))
    : [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 1
          }}>
            Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and analyze project's dependencies, technology stack, and violation status.
          </Typography>
        </Box>

        {/* Summary Cards for Import Statistics */}
        <SummaryCards
          totalComponents={totalComponents}
          dependenciesByLanguage={dependenciesByLanguage}
        />

        {/* Overall Compliance Summary */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 4 }}>
           <Grid item xs={12}>
              <Paper elevation={0} sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                 <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Overall Compliance Summary
                </Typography>
                <Grid container spacing={3}>
                   <Grid item xs={12} sm={3}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>{complianceSummary?.activeRules ?? 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">Active Rules</Typography>
                   </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>{complianceSummary?.activeViolations ?? 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">Active Violations</Typography>
                   </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>{complianceSummary?.violatedComponents ?? 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">Components with Violations</Typography>
                   </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>{complianceSummary?.totalComponents ?? 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">Total Components</Typography>
                   </Grid>
                </Grid>
              </Paper>
           </Grid>
        </Grid>

        {/* Violation Distribution Charts */}
        <Box sx={{ mt: 4 }}>
           <Typography variant="h5" sx={{ 
            mb: 3,
            fontWeight: 500,
            color: 'text.primary'
          }}>
            Rule & Violation Distribution
          </Typography>
          <Grid container spacing={3}>
            {/* Violation Status Distribution Chart */}
            <Grid item xs={12} md={6}>
               <Paper elevation={0} sx={{ 
                p: 3,
                height: CHART_HEIGHT,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Rule Status Distribution
                </Typography>
                 {statusAnalysis?.statusDistribution ? (
                   <StatusDistributionChart data={statusAnalysis.statusDistribution} />
                 ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No status distribution data available for chart.</Typography>
                 )}
              </Paper>
            </Grid>

            {/* Component Health Summary */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ 
                p: 3,
                height: CHART_HEIGHT,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Component Health
                </Typography>
                <Stack spacing={2}>
                   <Box>
                     <Typography variant="body1" sx={{ mb: 1 }}><strong>Total Components:</strong> {complianceSummary?.totalComponents ?? 'N/A'}</Typography>
                     <Typography variant="body1"><strong>Components with Violations:</strong> {complianceSummary?.violatedComponents ?? 'N/A'}</Typography>
                   </Box>
                    {componentHealth?.topViolatedComponents?.length > 0 && (
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Top Violated Components:</Typography>
                        <Stack spacing={1}>
                          {componentHealth.topViolatedComponents.map(comp => (
                            <Box key={comp.componentId} sx={{ 
                              p: 1.5, 
                              borderRadius: 1,
                              backgroundColor: theme => alpha(theme.palette.background.paper, 0.6),
                              border: '1px solid',
                              borderColor: theme => alpha(theme.palette.divider, 0.1)
                            }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>{comp.componentName}</Typography>
                              <Typography variant="body2" color="error.main" sx={{ mt: 0.5 }}>
                                {comp.violationCount} violations
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                     {componentHealth && (componentHealth.topViolatedComponents?.length === 0) && (
                         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No top violated components found.</Typography>
                     )}
                 </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Existing Dependency Insights Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ 
            mb: 3,
            fontWeight: 500,
            color: 'text.primary'
          }}>
            Dependency Insights
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ 
                p: 3,
                height: CHART_HEIGHT,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                  Language Distribution
                </Typography>
                <LanguagePieChart data={tech?.languageDistribution} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ 
                p: 3,
                height: CHART_HEIGHT,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                  Build Manager Usage
                </Typography>
                <BuildManagerBarChart data={tech?.buildManagerDistribution} />
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                  Version Distribution
                </Typography>
                <VersionDistributionTabs data={versions} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
} 