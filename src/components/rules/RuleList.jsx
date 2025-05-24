import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const STATUS_COLORS = {
  ACTIVE: 'success',
  DRAFT: 'warning',
  ARCHIVED: 'default'
};

const SEVERITY_COLORS = {
  CRITICAL: 'error',
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info'
};

export default function RuleList({ rules, metadata, onSearch, onEdit }) {
  const [searchParams, setSearchParams] = useState({
    name: '',
    language: '',
    status: '',
    page: 0,
    size: 10
  });

  const handleSearchChange = (field, value) => {
    const newParams = { ...searchParams, [field]: value, page: 0 };
    setSearchParams(newParams);
    onSearch(newParams);
  };

  const handlePageChange = (event, newPage) => {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);
    onSearch(newParams);
  };

  const handleRowsPerPageChange = (event) => {
    const newParams = { ...searchParams, page: 0, size: parseInt(event.target.value, 10) };
    setSearchParams(newParams);
    onSearch(newParams);
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search by Name"
            value={searchParams.name}
            onChange={(e) => handleSearchChange('name', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={searchParams.language}
              label="Language"
              onChange={(e) => handleSearchChange('language', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="JAVA">Java</MenuItem>
              <MenuItem value="PYTHON">Python</MenuItem>
              <MenuItem value="NODEJS">Node.js</MenuItem>
              <MenuItem value="REACT">React</MenuItem>
              <MenuItem value="VUE">Vue</MenuItem>
              <MenuItem value="ANGULAR">Angular</MenuItem>
              <MenuItem value="JAVASCRIPT">JavaScript</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={searchParams.status}
              label="Status"
              onChange={(e) => handleSearchChange('status', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="ARCHIVED">Archived</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {rule.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rule.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{rule.ruleDefinition.language}</TableCell>
                <TableCell>
                  <Chip
                    label={rule.status}
                    color={STATUS_COLORS[rule.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.compliance.severity}
                    color={SEVERITY_COLORS[rule.compliance.severity]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(rule.compliance.deadline), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {format(new Date(rule.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(rule)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={metadata?.total || 0}
        page={searchParams.page}
        onPageChange={handlePageChange}
        rowsPerPage={searchParams.size}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
} 