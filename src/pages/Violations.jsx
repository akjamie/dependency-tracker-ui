import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Stack,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  InfoOutlined as InfoOutlinedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format as formatDate } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { searchViolations, updateViolationStatus } from '../services/violations';
import { toast } from 'react-toastify';

const SEVERITY_COLORS = {
  CRITICAL: 'error',
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info',
};

const SEVERITY_ICONS = {
  CRITICAL: <ErrorOutlineIcon />,
  HIGH: <ErrorOutlineIcon />,
  MEDIUM: <WarningAmberIcon />,
  LOW: <InfoOutlinedIcon />,
};

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

function ViolationRow({ violation, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const theme = useTheme();

  // Calculate total violations count
  const runtimeViolationCount = violation.runtimeCurrentVersion && violation.runtimeTargetVersion ? 1 : 0;
  const dependencyViolationCount = violation.dependencyViolations?.length || 0;
  const totalViolationCount = runtimeViolationCount + dependencyViolationCount;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateViolationStatus(violation.id, newStatus);
      onStatusChange(violation.id, newStatus);
      toast.success('Violation status updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update violation status');
    } finally {
      setUpdating(false);
    }
  };

  const severityColorKey = SEVERITY_COLORS[violation.severity] || 'secondary';
  const statusColorKey = STATUS_COLORS[violation.status] || 'secondary';

  return (
    <React.Fragment>
      <TableRow hover onClick={() => setOpen(!open)} sx={{ cursor: 'pointer' }}>
        <TableCell>
          <IconButton size="small">
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{violation.componentName}</TableCell>
        <TableCell>{violation.ruleName}</TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {violation.ruleId}
          </Typography>
        </TableCell>
        <TableCell>
          <Tooltip title={`Status: ${violation.status}`}>
            <Chip
              label={violation.status}
              color={statusColorKey}
              size="small"
              icon={STATUS_ICONS[violation.status] || <InfoOutlinedIcon />}
              sx={{
                backgroundColor: theme => alpha(theme.palette[statusColorKey]?.main || theme.palette.secondary.main, 0.2),
                fontWeight: 600,
                borderColor: theme => alpha(theme.palette[statusColorKey]?.main || theme.palette.secondary.main, 0.6),
                borderWidth: '1px',
                borderStyle: 'solid',
                color: theme => theme.palette[statusColorKey]?.dark || theme.palette.secondary.dark,
              }}
            />
          </Tooltip>
        </TableCell>
        <TableCell>
          <Chip
            label={totalViolationCount}
            size="small"
            sx={{
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
              color: theme => theme.palette.primary.main,
              fontWeight: 600,
            }}
          />
        </TableCell>
        <TableCell>{formatDate(new Date(violation.createdAt), 'MMM dd, yyyy')}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Violation Details
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({totalViolationCount} violations)
                        </Typography>
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          <strong>Rule Description:</strong> {violation.ruleDescription}
                        </Typography>
                        {violation.runtimeCurrentVersion && violation.runtimeTargetVersion && (
                          <Typography variant="body2">
                            <strong>Runtime Target:</strong> {violation.runtimeCurrentVersion.runtimeType} {violation.runtimeCurrentVersion.version} ==&gt; {violation.runtimeTargetVersion.version}
                          </Typography>
                        )}
                        {violation.dependencyViolations?.map((depViolation, index) => (
                          <Box key={index} sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              <strong>Dependency Target:</strong> {depViolation.dependencyCurrentVersion.artefact} {depViolation.dependencyCurrentVersion.version} ==&gt; {depViolation.dependencyTargetVersion.version}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Violations() {
  const theme = useTheme();
  const location = useLocation();
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    ruleId: '',
    ruleName: '',
    status: '',
    componentName: '',
    page: 0,
    size: 10,
  });

  // Handle navigation state and trigger search
  useEffect(() => {
    if (location.state?.ruleId) {
      const newParams = {
        ...searchParams,
        ruleId: location.state.ruleId,
        ruleName: '',
        status: '',
        componentName: '',
        page: 0,
      };
      setSearchParams(newParams);
      // Trigger search with new params
      fetchViolations(newParams);
    }
  }, [location.state]);

  const fetchViolations = async (params = searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = {
        ...params,
        page: params.page + 1,
      };
      const response = await searchViolations(searchParams);
      setViolations(Array.isArray(response.data?.violations) ? response.data.violations : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch violations');
      toast.error(err.message || 'Failed to fetch violations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.state?.ruleId) {
      fetchViolations();
    }
  }, [searchParams.page, searchParams.size]);

  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
      page: 0,
    }));
  };

  const handleSearch = () => {
    fetchViolations();
  };

  const handleStatusChange = (violationId, newStatus) => {
    setViolations(prev =>
      prev.map(v =>
        v.id === violationId ? { ...v, status: newStatus } : v
      )
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Violations Management
      </Typography>

      {/* Search Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Rule ID"
              value={searchParams.ruleId}
              onChange={(e) => handleSearchChange('ruleId', e.target.value)}
              sx={{ background: '#fafbfc', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Rule Name"
              value={searchParams.ruleName}
              onChange={(e) => handleSearchChange('ruleName', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ background: '#fafbfc', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={{ background: '#fafbfc', borderRadius: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={searchParams.status}
                label="Status"
                onChange={(e) => handleSearchChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
                <MenuItem value="IGNORED">Ignored</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Component Name"
              value={searchParams.componentName}
              onChange={(e) => handleSearchChange('componentName', e.target.value)}
              sx={{ background: '#fafbfc', borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchParams(prev => ({
                    ...prev,
                    ruleId: '',
                    ruleName: '',
                    status: '',
                    componentName: '',
                    page: 0,
                  }));
                }}
                sx={{ borderRadius: 2 }}
              >
                Clear Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchViolations()}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Violations List */}
      <Paper elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : violations.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>No violations found matching your criteria.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#fafbfc' }}>
                  <TableCell />
                  <TableCell>Component</TableCell>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Rule ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Violations</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {violations.map((violation) => (
                  <ViolationRow
                    key={violation.id}
                    violation={violation}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
