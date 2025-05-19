import React from 'react';
import { Grid, Container } from '@mui/material';
import DependencyStats from '../components/dashboard/DependencyStats';
import UpgradeProgress from '../components/dashboard/UpgradeProgress';
import ProjectFacets from '../components/dashboard/ProjectFacets';

const Dashboard = () => {
  // Sample data - replace with actual API data
  const dependencyData = [
    { name: 'Java', value: 400 },
    { name: 'Python', value: 300 },
    { name: 'Node.js', value: 200 },
    { name: 'Other', value: 100 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DependencyStats data={dependencyData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <UpgradeProgress />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProjectFacets />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 