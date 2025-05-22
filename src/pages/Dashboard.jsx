import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Paper } from '@mui/material';
import SummaryCards from '../components/dashboard/facets/SummaryCards';
import LanguagePieChart from '../components/dashboard/facets/LanguagePieChart';
import BuildManagerBarChart from '../components/dashboard/facets/BuildManagerBarChart';
import VersionDistributionTabs from '../components/dashboard/facets/VersionDistributionTabs';
import {
  getTechnologyStackFacet,
  getVersionPatternFacet,
  getComponentActivityFacet,
} from '../services/api';

const CHART_HEIGHT = 446;

export default function Dashboard() {
  const [tech, setTech] = useState(null);
  const [versions, setVersions] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    getTechnologyStackFacet().then(setTech);
    getVersionPatternFacet().then(setVersions);
    getComponentActivityFacet().then(setActivity);
  }, []);

  // Calculate summary values
  const totalComponents = activity?.componentTypes
    ? Object.values(activity.componentTypes).reduce((a, b) => a + b, 0)
    : 0;
  
  // Group dependencies by language
  const dependenciesByLanguage = tech?.languageDistribution
    ? Object.entries(tech.languageDistribution).map(([language, count]) => ({
        language,
        count
      }))
    : [];

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
            Monitor and analyze project's dependencies and technology stack
          </Typography>
        </Box>

        <SummaryCards
          totalComponents={totalComponents}
          dependenciesByLanguage={dependenciesByLanguage}
        />

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