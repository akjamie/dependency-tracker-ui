import React, { useState } from 'react';
import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Collapse,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

const languages = ['JAVA', 'PYTHON', 'NODEJS'];
const buildManagers = ['MAVEN', 'GRADLE', 'NPM', 'YARN', 'PIP'];
const sortOrders = ['ASC', 'DESC'];

const DependencySearch = ({ searchParams, onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchParams, setLocalSearchParams] = useState({
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
    order: 'ASC',
    ...searchParams
  });

  const handleChange = (field) => (event) => {
    setLocalSearchParams(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSearch = () => {
    console.log('Search triggered with params:', localSearchParams); // Debug log
    onSearch(localSearchParams);
  };

  const handleClear = () => {
    const clearedParams = {
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
    };
    setLocalSearchParams(clearedParams);
    onSearch(clearedParams);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const activeFilters = Object.entries(localSearchParams)
    .filter(([key, value]) => 
      value && 
      !['page', 'size', 'sort', 'order'].includes(key) && 
      key !== 'q'
    );

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {/* Main Search Bar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search dependencies, components, or any field..."
          value={localSearchParams.q}
          onChange={handleChange('q')}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {localSearchParams.q && (
                  <IconButton size="small" onClick={() => handleChange('q')({ target: { value: '' } })}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton 
                  size="small" 
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? "primary" : "default"}
                >
                  <FilterIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ minWidth: 100 }}
        >
          Search
        </Button>
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {activeFilters.map(([key, value]) => (
            <Chip
              key={key}
              label={`${key}: ${value}`}
              onDelete={() => handleChange(key)({ target: { value: '' } })}
              size="small"
            />
          ))}
          <Button
            size="small"
            onClick={handleClear}
            startIcon={<CloseIcon />}
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* Advanced Filters */}
      <Collapse in={showFilters}>
        <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Component ID"
                value={localSearchParams.componentId}
                onChange={handleChange('componentId')}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Component Name"
                value={localSearchParams.name}
                onChange={handleChange('name')}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Source Code URL"
                value={localSearchParams.sourceCodeUrl}
                onChange={handleChange('sourceCodeUrl')}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Branch"
                value={localSearchParams.branch}
                onChange={handleChange('branch')}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Runtime Version"
                value={localSearchParams.runtimeVersion}
                onChange={handleChange('runtimeVersion')}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Compiler"
                value={localSearchParams.compiler}
                onChange={handleChange('compiler')}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Language</InputLabel>
                <Select
                  value={localSearchParams.language}
                  onChange={handleChange('language')}
                  label="Language"
                >
                  <MenuItem value="">All</MenuItem>
                  {languages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Build Manager</InputLabel>
                <Select
                  value={localSearchParams.buildManager}
                  onChange={handleChange('buildManager')}
                  label="Build Manager"
                >
                  <MenuItem value="">All</MenuItem>
                  {buildManagers.map((manager) => (
                    <MenuItem key={manager} value={manager}>
                      {manager}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Sort Field"
                  value={localSearchParams.sort}
                  onChange={handleChange('sort')}
                  size="small"
                  placeholder="e.g., createdAt"
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={localSearchParams.order}
                    onChange={handleChange('order')}
                    label="Order"
                  >
                    {sortOrders.map((order) => (
                      <MenuItem key={order} value={order}>
                        {order}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default DependencySearch; 