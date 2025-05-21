import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import SummaryCards from '../components/dashboard/facets/SummaryCards';
import LanguagePieChart from '../components/dashboard/facets/LanguagePieChart';
import BuildManagerBarChart from '../components/dashboard/facets/BuildManagerBarChart';
import VersionDistributionTabs from '../components/dashboard/facets/VersionDistributionTabs';
import {
  getTechnologyStackFacet,
  getVersionPatternFacet,
  getComponentActivityFacet,
} from '../services/api';

const CHART_HEIGHT = 340;

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
  const totalDependencies = activity?.dependencyCount
    ? Object.values(activity.dependencyCount).reduce((a, b) => a + b, 0)
    : 0;
  const mostCommonLanguage = tech?.languageDistribution
    ? Object.entries(tech.languageDistribution).sort((a, b) => b[1] - a[1])[0]?.[0]
    : '';
  const mostUsedBuildManager = tech?.buildManagerDistribution
    ? Object.entries(tech.buildManagerDistribution).sort((a, b) => b[1] - a[1])[0]?.[0]
    : '';

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <SummaryCards
        totalComponents={totalComponents}
        totalDependencies={totalDependencies}
        mostCommonLanguage={mostCommonLanguage}
        mostUsedBuildManager={mostUsedBuildManager}
      />
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          Dependency Insights
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} sx={{ minHeight: CHART_HEIGHT }}>
            <LanguagePieChart data={tech?.languageDistribution} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minHeight: CHART_HEIGHT }}>
            <BuildManagerBarChart data={tech?.buildManagerDistribution} />
          </Grid>
          <Grid item xs={12} sx={{ minHeight: CHART_HEIGHT }}>
            <VersionDistributionTabs data={versions} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 