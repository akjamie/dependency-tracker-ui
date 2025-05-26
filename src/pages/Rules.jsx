import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Paper,
  Tabs,
  Tab,
  Chip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import RuleForm from '../components/rules/RuleForm';
import RuleList from '../components/rules/RuleList';
import { searchRules, createRule, updateRule } from '../services/rules';

const STATUS_FILTERS = [
  { value: 'ACTIVE', label: 'Active', color: 'success' },
  { value: 'DRAFT', label: 'Draft', color: 'warning' },
  { value: 'ARCHIVED', label: 'Archived', color: 'default' },
];

const SEVERITY_FILTERS = [
  { value: 'CRITICAL', label: 'Critical', color: 'error' },
  { value: 'HIGH', label: 'High', color: 'error' },
  { value: 'MEDIUM', label: 'Medium', color: 'warning' },
  { value: 'LOW', label: 'Low', color: 'info' },
];

export default function Rules() {
  const theme = useTheme();
  const [rules, setRules] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    language: '',
    status: '',
    fromDate: null,
    toDate: null,
    page: 0,
    size: 10
  });

  const fetchRules = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchRules({
        page: params.page || 1,
        size: params.size || 10,
        name: params.name || '',
        language: params.language || '',
        status: params.status || '',
        fromDate: params.fromDate || '',
        toDate: params.toDate || '',
      });
      setRules(response.data);
      setMetadata(response.metadata);
    } catch (err) {
      setError(err.message || 'Failed to fetch rules');
      toast.error(err.message || 'Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules(searchParams);
    // eslint-disable-next-line
  }, []);

  const handleSearch = (params) => {
    setSearchParams(params);
    fetchRules(params);
  };

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRule(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedRule) {
        await updateRule(selectedRule.id, formData);
        toast.success('Rule updated successfully');
      } else {
        await createRule(formData);
        toast.success('Rule created successfully');
      }
      handleFormClose();
      fetchRules();
    } catch (err) {
      toast.error(err.message || 'Failed to save rule');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleSeverityFilter = (severity) => {
    setSelectedSeverity(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  if (loading && !rules.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 1
            }}>
              Rules Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage rules for dependency tracking
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          >
            Create Rule
          </Button>
        </Box>

        {/* Main Content */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <RuleList
          rules={rules}
          metadata={metadata}
          onSearch={handleSearch}
          onEdit={handleEdit}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <Dialog
          open={isFormOpen}
          onClose={handleFormClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }
          }}
        >
          <DialogTitle sx={{ 
            m: 0, 
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {selectedRule ? 'Edit Rule' : 'Create New Rule'}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleFormClose}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <RuleForm
              rule={selectedRule}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
} 