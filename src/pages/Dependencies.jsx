import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Alert, CircularProgress } from '@mui/material';
import DependencySearch from '../components/dependencies/DependencySearch';
import DependencyList from '../components/dependencies/DependencyList';
import DependencyDetails from '../components/dependencies/DependencyDetails';
import { searchDependencies } from '../services/api';

const Dependencies = () => {
  const [selectedDependency, setSelectedDependency] = useState(null);
  const [searchParams, setSearchParams] = useState({
    q: '',
    componentId: '',
    name: '',
    sourceCodeUrl: '',
    branch: '',
    runtimeVersion: '',
    compiler: '',
    language: '',
    buildManager: '',
    page: 1,
    size: 20,
    sort: '',
    order: 'ASC'
  });
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchDependencies(params);
      setSearchResults(results);
      setSearchParams(params);
    } catch (err) {
      setError('Failed to fetch dependencies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dependency Management
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DependencySearch 
            searchParams={searchParams}
            onSearch={handleSearch}
          />
        </Grid>

        {loading && (
          <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Grid>
        )}

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {!loading && !error && (
          <Grid item xs={12} md={selectedDependency ? 7 : 12}>
            <DependencyList 
              data={searchResults}
              onSelectDependency={setSelectedDependency}
            />
          </Grid>
        )}

        {!loading && !error && selectedDependency && (
          <Grid item xs={12} md={5}>
            <DependencyDetails 
              dependency={selectedDependency}
              onClose={() => setSelectedDependency(null)}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dependencies; 