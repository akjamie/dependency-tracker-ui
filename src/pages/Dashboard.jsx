import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import SummaryCards from '../components/dashboard/facets/SummaryCards';
import LanguagePieChart from '../components/dashboard/facets/LanguagePieChart';
import BuildManagerBarChart from '../components/dashboard/facets/BuildManagerBarChart';
import FrameworkUsageStackedBar from '../components/dashboard/facets/FrameworkUsageStackedBar';
import VersionDistributionTabs from '../components/dashboard/facets/VersionDistributionTabs';
import {
  getTechnologyStackFacet,
  getVersionPatternFacet,
  getFrameworkUsageFacet,
  getComponentActivityFacet,
} from '../services/api';

const CHART_HEIGHT = 340;

export default function Dashboard() {
  const [tech, setTech] = useState(null);
  const [versions, setVersions] = useState(null);
  const [frameworks, setFrameworks] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    getTechnologyStackFacet().then(setTech);
    getVersionPatternFacet().then(setVersions);
    getFrameworkUsageFacet().then(setFrameworks);
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
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6} sx={{ minHeight: CHART_HEIGHT }}>
          <LanguagePieChart data={tech?.languageDistribution} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: CHART_HEIGHT }}>
          <BuildManagerBarChart data={tech?.buildManagerDistribution} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: CHART_HEIGHT }}>
          <FrameworkUsageStackedBar data={frameworks} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: CHART_HEIGHT }}>
          <VersionDistributionTabs data={versions} />
        </Grid>
      </Grid>
    </Container>
  );
} 