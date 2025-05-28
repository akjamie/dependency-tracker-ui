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
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  WarningAmber as WarningAmberIcon,
  ArchiveOutlined as ArchiveOutlinedIcon,
  ErrorOutline as ErrorOutlineIcon,
  InfoOutlined as InfoOutlinedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { format as formatDate } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getViolationsByRuleId } from '../../services/violations';
import { useNavigate } from 'react-router-dom';

// Mappings for Rule Statuses
const RULE_STATUS_COLORS = {
  ACTIVE: 'success',
  DRAFT: 'warning',
  ARCHIVED: 'default',
  INACTIVE: 'error',
};

const RULE_STATUS_ICONS = {
  ACTIVE: <CheckCircleOutlineIcon />,
  DRAFT: <WarningAmberIcon />,
  ARCHIVED: <ArchiveOutlinedIcon />,
  INACTIVE: <ErrorOutlineIcon />,
};

// Mappings for Severity
const SEVERITY_COLORS = {
  CRITICAL: 'error',
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info',
  // INACTIVE status might not apply to severity, keep if needed based on API
  INACTIVE: 'error', // Assuming INACTIVE severity should be error color
};

const SEVERITY_ICONS = {
  CRITICAL: <ErrorOutlineIcon />,
  HIGH: <ErrorOutlineIcon />,
  MEDIUM: <WarningAmberIcon />,
  LOW: <InfoOutlinedIcon />,
  // INACTIVE status might not apply to severity, keep if needed based on API
  INACTIVE: <ErrorOutlineIcon />,
};

// Mappings for Violation Statuses
const VIOLATION_STATUS_COLORS = {
  OPEN: 'error',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'secondary',
  IGNORED: 'info',
};

const VIOLATION_STATUS_ICONS = {
  OPEN: <ErrorOutlineIcon />,
  IN_PROGRESS: <WarningAmberIcon />,
  RESOLVED: <CheckCircleOutlineIcon />,
  CLOSED: <CloseIcon />,
  IGNORED: <InfoOutlinedIcon />,
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

function Row({ rule, onEditRule }) {
  const [open, setOpen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [loadingViolations, setLoadingViolations] = useState(false);
  const [violationsError, setViolationsError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleRowClick = async () => {
    if (!open && violations.length === 0 && !loadingViolations) {
      setLoadingViolations(true);
      setViolationsError(null);
      try {
        const ruleViolations = await getViolationsByRuleId(rule.id);
        setViolations(Array.isArray(ruleViolations?.data?.violations) ? ruleViolations.data.violations : []);
      } catch (err) {
        setViolationsError(err.message || 'Failed to fetch violations');
        setViolations([]);
      } finally {
        setLoadingViolations(false);
      }
    }
    setOpen(!open);
  };

  // Function to group violations by component
  const groupViolationsByComponent = (violations) => {
    const grouped = {};
    violations.forEach(violation => {
      if (!grouped[violation.componentId]) {
        grouped[violation.componentId] = {
          componentName: violation.componentName,
          violations: []
        };
      }
      grouped[violation.componentId].violations.push(violation);
    });
    return Object.values(grouped);
  };

  const renderTargetDetails = (rule) => {
    const target = rule.ruleDefinition?.target;

    if (!target) {
      return <Typography variant="body2" color="text.secondary">No target specified</Typography>;
    }

    if (target.runtimeTarget) {
      const { runtimeType, version, operator } = target.runtimeTarget;
      const operatorSymbol = {
        EQUAL: '==',
        NOT_EQUAL: '!=',
        GREATER: '>',
        GREATER_EQUAL: '>=',
        LESS: '<',
        LESS_EQUAL: '<=',
      }[operator] || operator;
      return (
        <Typography variant="body2">
          <Box component="span" sx={{ fontWeight: 600 }}>Runtime Target:</Box> {`${runtimeType} ${operatorSymbol} ${version}`}
        </Typography>
      );
    } else if (target.dependencyTarget) {
      const { artefact, version, operator } = target.dependencyTarget;
       const operatorSymbol = {
        EQUAL: '==',
        NOT_EQUAL: '!=',
        GREATER: '>',
        GREATER_EQUAL: '>=',
        LESS: '<',
        LESS_EQUAL: '<=',
      }[operator] || operator;
      return (
        <Stack spacing={0.5}>
           <Typography variant="body2">
             <Box component="span" sx={{ fontWeight: 600 }}>Artefact:</Box> {artefact}
           </Typography>
           <Typography variant="body2">
             <Box component="span" sx={{ fontWeight: 600 }}>Version Target:</Box> {`${version}`}
           </Typography>
        </Stack>
      );
    }
    return <Typography variant="body2" color="text.secondary">No target specified</Typography>;
  };

  const groupedViolations = groupViolationsByComponent(violations);

  return (
    <React.Fragment>
      <TableRow hover onClick={handleRowClick} sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}>
        <TableCell><IconButton aria-label="expand row" size="small" onClick={(e) => { e.stopPropagation(); handleRowClick(); }}>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton></TableCell><TableCell component="th" scope="row">{rule.name}</TableCell><TableCell>{rule.language}</TableCell><TableCell>
           <Tooltip title={`Status: ${rule.status}`}> 
              <Chip
                  label={rule.status}
                  color={RULE_STATUS_COLORS[rule.status]}
                  size="small"
                  icon={RULE_STATUS_ICONS[rule.status]}
                  sx={{
                    backgroundColor: theme => alpha(theme.palette[RULE_STATUS_COLORS[rule.status]].main, 0.2),
                    fontWeight: 600,
                    borderColor: theme => alpha(theme.palette[RULE_STATUS_COLORS[rule.status]].main, 0.6),
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: theme => theme.palette[RULE_STATUS_COLORS[rule.status]].dark,
                  }}
                />
          </Tooltip>
        </TableCell><TableCell><Tooltip title={`Severity: ${rule.compliance.severity}`}><Chip label={rule.compliance.severity} color={SEVERITY_COLORS[rule.compliance.severity]} size="small" icon={SEVERITY_ICONS[rule.compliance.severity]} sx={{backgroundColor: theme => alpha(theme.palette[SEVERITY_COLORS[rule.compliance.severity]].main, 0.2),fontWeight: 600,borderColor: theme => alpha(theme.palette[SEVERITY_COLORS[rule.compliance.severity]].main, 0.6),borderWidth: '1px',borderStyle: 'solid',color: theme => theme.palette[SEVERITY_COLORS[rule.compliance.severity]].dark,}}/></Tooltip></TableCell><TableCell>{rule.description || 'N/A'}</TableCell><TableCell>{formatDate(new Date(rule.createdAt), 'MMM dd, yyyy')}</TableCell><TableCell align="right"><Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); onEditRule(rule); }}>Edit</Button></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, pl: 4 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 600 }}>
                Rule Details
              </Typography>
              {renderTargetDetails(rule)}

              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 600, mt: 2 }}>
                Violations by Component
              </Typography>
              {loadingViolations ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : violationsError ? (
                 <Alert severity="error" sx={{ mt: 1 }}>{violationsError}</Alert>
              ) : groupedViolations.length === 0 ? (
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No components with violations found for this rule.</Typography>
              ) : (
                <Stack spacing={1.5} sx={{ mt: 1 }}>
                  {groupedViolations.map((componentGroup) => (
                    <Box key={componentGroup.componentName} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: '1px solid #eee', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {componentGroup.componentName} ({componentGroup.violations.length} violations)
                      </Typography>
                       <Button
                          variant="outlined"
                          size="small"
                          endIcon={<OpenInNewIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to Violations page filtered by rule and component
                            navigate('/violations', { state: { ruleId: rule.id, componentId: componentGroup.violations[0].componentId, ruleName: rule.name, componentName: componentGroup.componentName } });
                          }}
                        >
                          View Details
                        </Button>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

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
              slotProps={{
                textField: {
                  sx: {
                    background: '#fafbfc',
                    borderRadius: 2,
                    minWidth: { xs: '100%', sm: 140 },
                    flex: '1 1 140px',
                  }
                }
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="To Date"
              value={searchParams.toDate}
              onChange={(date) => handleSearchChange('toDate', date)}
              slotProps={{
                textField: {
                  sx: {
                    background: '#fafbfc',
                    borderRadius: 2,
                    minWidth: { xs: '100%', sm: 140 },
                    flex: '1 1 140px',
                  }
                }
              }}
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
            <TableCell>Description</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.map((rule) => (
            <Row key={rule.id} rule={rule} onEditRule={onEdit} />
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