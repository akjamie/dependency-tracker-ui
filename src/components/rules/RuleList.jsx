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
  Button,
  Card,
  CardContent,
  CardActions,
  Stack,
  useTheme,
  alpha,
  Collapse,
  Tooltip, // Added Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircleOutline as CheckCircleOutlineIcon, // Icon for Active status
  WarningAmber as WarningAmberIcon,         // Icon for Draft status/Medium severity
  ArchiveOutlined as ArchiveOutlinedIcon,   // Icon for Archived status
  ErrorOutline as ErrorOutlineIcon,         // Icon for Critical/High severity
  InfoOutlined as InfoOutlinedIcon,         // Icon for Low severity
} from '@mui/icons-material';
import { format as formatDate } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const STATUS_COLORS = {
  ACTIVE: 'success',
  DRAFT: 'warning',
  ARCHIVED: 'default'
};

const STATUS_ICONS = {
  ACTIVE: <CheckCircleOutlineIcon />,
  DRAFT: <WarningAmberIcon />,
  ARCHIVED: <ArchiveOutlinedIcon />,
};

const SEVERITY_COLORS = {
  CRITICAL: 'error',
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info'
};

const SEVERITY_ICONS = {
  CRITICAL: <ErrorOutlineIcon />,
  HIGH: <ErrorOutlineIcon />,
  MEDIUM: <WarningAmberIcon />,
  LOW: <InfoOutlinedIcon />,
};

const LANGUAGE_ICONS = {
  JAVA: '☕',
  PYTHON: '🐍',
  NODEJS: '⬢',
  REACT: '⚛️',
  VUE: '⚡',
  ANGULAR: '🅰️',
  JAVASCRIPT: '📜'
};

// Helper to map operator string to symbol
const getOperatorSymbol = (operator) => {
    switch (operator) {
        case 'GREATER_EQUAL': return '>=';
        case 'LESS_EQUAL': return '<=';
        case 'EQUAL': return '==';
        case 'GREATER': return '>';
        case 'LESS': return '<';
        case 'TILDE': return '~';
        case 'CARET': return '^';
        default: return '';
    }
};


export default function RuleList({ rules, metadata, onSearch, onEdit, searchParams, setSearchParams }) {
  const theme = useTheme();

  // State for expanded row
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Convert dates to yyyy-MM-dd strings
    const params = {
      ...searchParams,
      fromDate: searchParams.fromDate ? formatDate(searchParams.fromDate, 'yyyy-MM-dd') : undefined,
      toDate: searchParams.toDate ? formatDate(searchParams.toDate, 'yyyy-MM-dd') : undefined,
    };
    onSearch(params);
  };

  const handlePageChange = (event, newPage) => {
    const newParams = { ...searchParams, page: newPage };
    onSearch({
      ...newParams,
      fromDate: newParams.fromDate ? formatDate(newParams.fromDate, 'yyyy-MM-dd') : undefined,
      toDate: newParams.toDate ? formatDate(newParams.toDate, 'yyyy-MM-dd') : undefined,
    });
    setSearchParams(newParams);
  };

  const handleRowsPerPageChange = (event) => {
    const newParams = { ...searchParams, page: 0, size: parseInt(event.target.value, 10) };
    onSearch({
      ...newParams,
      fromDate: newParams.fromDate ? formatDate(newParams.fromDate, 'yyyy-MM-dd') : undefined,
      toDate: newParams.toDate ? formatDate(newParams.toDate, 'yyyy-MM-dd') : undefined,
    });
    setSearchParams(newParams);
  };

  // Handle row click to expand/collapse
  const handleRowClick = (ruleId) => {
    setExpandedRow(expandedRow === ruleId ? null : ruleId);
  };

  // --- Search Bar Layout ---
  const renderSearchBar = () => (
    <Box sx={{ mb: 3 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', md: 'flex-start' },
          }}
        >
          <TextField
            label="Search by Name"
            value={searchParams.name}
            onChange={(e) => handleSearchChange('name', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{
              background: '#fafbfc',
              borderRadius: 2,
              minWidth: { xs: '100%', sm: 180 },
              flex: '1 1 180px',
            }}
          />
          <FormControl
            sx={{
              background: '#fafbfc',
              borderRadius: 2,
              minWidth: { xs: '100%', sm: 140 },
              flex: '1 1 140px',
            }}
          >
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
          <FormControl
            sx={{
              background: '#fafbfc',
              borderRadius: 2,
              minWidth: { xs: '100%', sm: 140 },
              flex: '1 1 140px',
            }}
          >
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={searchParams.fromDate}
              onChange={(date) => handleSearchChange('fromDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    background: '#fafbfc',
                    borderRadius: 2,
                    minWidth: { xs: '100%', sm: 140 },
                    flex: '1 1 140px',
                  }}
                />
              )}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="To Date"
              value={searchParams.toDate}
              onChange={(date) => handleSearchChange('toDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    background: '#fafbfc',
                    borderRadius: 2,
                    minWidth: { xs: '100%', sm: 140 },
                    flex: '1 1 140px',
                  }}
                />
              )}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{
              height: '56px',
              fontWeight: 600,
              background: theme.palette.primary.main,
              color: '#fff',
              borderRadius: 2,
              minWidth: 120,
              flex: '0 0 120px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': {
                background: theme.palette.primary.dark
              }
            }}
          >
            Search
          </Button>
        </Box>
      </Paper>
    </Box>
  );

  // --- List View ---
  const renderListView = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ background: '#fafbfc' }}>
            <TableCell /> {/* Empty cell for expand icon */}
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
            <React.Fragment key={rule.id}>
              <TableRow
                hover
                onClick={() => handleRowClick(rule.id)} // Add click handler to toggle expand
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    cursor: 'pointer',
                  },
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: expandedRow === rule.id ? alpha(theme.palette.primary.main, 0.08) : 'inherit',
                }}
              >
                <TableCell>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRowClick(rule.id); }}>
                    {expandedRow === rule.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {rule.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rule.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">
                      {LANGUAGE_ICONS[rule.ruleDefinition.language]}
                    </Typography>
                    <Typography variant="body2">
                      {rule.ruleDefinition.language}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Tooltip title={`Status: ${rule.status}`}> {/* Added Tooltip */}
                    <Chip
                      label={rule.status}
                      color={STATUS_COLORS[rule.status]}
                      size="small"
                      icon={STATUS_ICONS[rule.status]} // Added Icon
                      sx={{
                        backgroundColor: alpha(theme.palette[STATUS_COLORS[rule.status]].main, 0.2),
                        fontWeight: 600,
                        borderColor: alpha(theme.palette[STATUS_COLORS[rule.status]].main, 0.6),
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        color: theme.palette[STATUS_COLORS[rule.status]].dark, // Ensure text is readable
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={`Severity: ${rule.compliance.severity}`}> {/* Added Tooltip */}
                    <Chip
                      label={rule.compliance.severity}
                      color={SEVERITY_COLORS[rule.compliance.severity]}
                      size="small"
                      icon={SEVERITY_ICONS[rule.compliance.severity]} // Added Icon
                      sx={{
                        backgroundColor: alpha(theme.palette[SEVERITY_COLORS[rule.compliance.severity]].main, 0.2),
                        fontWeight: 600,
                        borderColor: alpha(theme.palette[SEVERITY_COLORS[rule.compliance.severity]].main, 0.6),
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        color: theme.palette[SEVERITY_COLORS[rule.compliance.severity]].dark, // Ensure text is readable
                      }}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatDate(new Date(rule.compliance.deadline), 'MMM dd, yyyy')}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(new Date(rule.createdAt), 'MMM dd, yyyy')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(rule)}
                    color="primary"
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              {expandedRow === rule.id && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Collapse in={expandedRow === rule.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 600 }}>
                          Rule Details
                        </Typography>
                        <Grid container spacing={2}>
                          {rule.ruleDefinition.target?.runtimeTarget && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Runtime Target</Typography>
                               <Stack spacing={0.5}>
                                 <Typography variant="body2">
                                     <Box component="span" sx={{ fontWeight: 600 }}>Target:</Box> {`${rule.ruleDefinition.target.runtimeTarget.runtimeType || ''} `}
                                     {rule.ruleDefinition.target.runtimeTarget.operator &&
                                         (getOperatorSymbol(rule.ruleDefinition.target.runtimeTarget.operator))}
                                     {` ${rule.ruleDefinition.target.runtimeTarget.version || ''}`}
                                 </Typography>
                               </Stack>
                            </Grid>
                          )}
                          {rule.ruleDefinition.target?.dependencyTarget && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Dependency Target</Typography>
                              <Stack spacing={0.5}>
                                 <Typography variant="body2">
                                     <Box component="span" sx={{ fontWeight: 600 }}>Target:</Box> {`${rule.ruleDefinition.target.dependencyTarget.artefact || ''} `}
                                     {rule.ruleDefinition.target.dependencyTarget.operator &&
                                         (getOperatorSymbol(rule.ruleDefinition.target.dependencyTarget.operator))}
                                     {` ${rule.ruleDefinition.target.dependencyTarget.version || ''}`}
                                 </Typography>
                               </Stack>
                            </Grid>
                          )}
                          {!rule.ruleDefinition.target?.runtimeTarget && !rule.ruleDefinition.target?.dependencyTarget && (
                            <Grid item xs={12}>
                              <Typography variant="body2">No specific runtime or dependency target defined for this rule.</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      {renderSearchBar()}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          backgroundColor: theme.palette.background.paper
        }}
      >
        {renderListView()}
        <TablePagination
          component="div"
          count={metadata?.total || 0}
          page={searchParams.page}
          onPageChange={handlePageChange}
          rowsPerPage={searchParams.size}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            '.MuiTablePagination-select': {
              borderRadius: 1
            }
          }}
        />
      </Paper>
    </Box>
  );
}