import React, { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Chip,
  Link,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';

const DependencyDetails = ({ dependency, onClose }) => {
  const [filter, setFilter] = useState('');

  // Wildcard/fuzzy match: all terms in filter must be present in any field
  const filteredDependencies = dependency.dependencies.filter(dep => {
    const terms = filter.toLowerCase().split(' ').filter(Boolean);
    const target = `${dep.artefact} ${dep.version} ${dep.type}`.toLowerCase();
    return terms.every(term => target.includes(term));
  });

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Component Details</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        {dependency.component.name}
      </Typography>
      
      <Box mb={2}>
        <Link href={dependency.component.sourceCodeUrl} target="_blank" rel="noopener">
          {dependency.component.sourceCodeUrl}
        </Link>
      </Box>

      <Box display="flex" gap={1} mb={2}>
        <Chip label={dependency.language} size="small" />
        <Chip label={dependency.buildManager} size="small" />
        <Chip label={dependency.branch} size="small" />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Dependencies ({filteredDependencies.length} / {dependency.dependencies.length})
      </Typography>
      
      <TextField
        fullWidth
        size="small"
        placeholder="Filter dependencies..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 1 }}
      />

      <List sx={{ maxHeight: 480, overflowY: 'auto', border: '1px solid #eee', borderRadius: 1 }}>
        {filteredDependencies.length === 0 && (
          <ListItem>
            <ListItemText primary="No dependencies found." />
          </ListItem>
        )}
        {filteredDependencies.map((dep, index) => (
          <React.Fragment key={dep.artefact + dep.version + dep.type}>
            <ListItem>
              <ListItemText
                primary={dep.artefact}
                secondary={`Version: ${dep.version} | Type: ${dep.type}`}
              />
            </ListItem>
            {index < filteredDependencies.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default DependencyDetails; 