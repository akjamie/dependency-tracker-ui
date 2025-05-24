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
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import RuleForm from '../components/rules/RuleForm';
import RuleList from '../components/rules/RuleList';
import { searchRules, createRule, updateRule } from '../services/rules';

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRules = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchRules({
        page: searchParams.page || 1,
        size: searchParams.size || 10,
        name: searchParams.name || '',
        language: searchParams.language || '',
        status: searchParams.status || ''
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
    fetchRules();
  }, []);

  const handleSearch = (searchParams) => {
    fetchRules(searchParams);
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

  if (loading && !rules.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 600,
              color: 'primary.main',
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
            alignItems: 'center'
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