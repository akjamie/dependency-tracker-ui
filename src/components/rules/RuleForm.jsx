import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ['ACTIVE', 'DRAFT', 'ARCHIVED'];
const LANGUAGE_OPTIONS = ['JAVA', 'PYTHON', 'NODEJS', 'REACT', 'VUE', 'ANGULAR', 'JAVASCRIPT'];
const OPERATOR_OPTIONS = ['GREATER_EQUAL', 'LESS_EQUAL', 'EQUAL', 'GREATER', 'LESS', 'TILDE', 'CARET'];
const SEVERITY_OPTIONS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const RUNTIME_TYPE_OPTIONS = [
  { value: 'JDK', label: 'JDK' },
  { value: 'PYTHON', label: 'Python' },
  { value: 'NODE_JS', label: 'Node.js' },
  { value: 'GO', label: 'Go' },
  { value: 'DOTNET', label: '.NET' },
  { value: 'PHP', label: 'PHP' },
  { value: 'KOTLIN', label: 'Kotlin' },
  { value: 'SCALA', label: 'Scala' },
  { value: 'GROOVY', label: 'Groovy' }
];

const VERSION_PATTERN = '^[0-9]+(\\.[0-9]+)*(-[a-zA-Z0-9]+)?$';

export default function RuleForm({ rule, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'DRAFT',
    ruleDefinition: {
      language: '',
      target: {
        runtimeTarget: {
          runtimeType: '',
          version: '',
          operator: ''
        },
        dependencyTarget: {
          artefact: '',
          version: '',
          operator: ''
        }
      }
    },
    compliance: {
      deadline: new Date(),
      severity: 'MEDIUM'
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rule) {
      // Parse the deadline date string to a Date object
      const ruleData = {
        ...rule,
        ruleDefinition: {
            ...rule.ruleDefinition,
            target: {
                ...rule.ruleDefinition.target,
                runtimeTarget: rule.ruleDefinition.target?.runtimeTarget || { runtimeType: '', version: '', operator: '' },
                dependencyTarget: rule.ruleDefinition.target?.dependencyTarget || { artefact: '', version: '', operator: '' },
            }
        },
        compliance: {
          ...rule.compliance,
          deadline: rule.compliance.deadline ? parseISO(rule.compliance.deadline) : new Date()
        }
      };
      setFormData(ruleData);
    }
  }, [rule]);

  const validateForm = () => {
    const newErrors = {};
    
    // Mandatory fields validation
    if (!formData.name) {
      newErrors.name = 'Rule name is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    if (!formData.ruleDefinition.language) {
      newErrors.language = 'Language is required';
    }
    if (!formData.compliance.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    // Runtime Target validation
    const hasRuntimeTarget = formData.ruleDefinition.target.runtimeTarget?.runtimeType ||
                           formData.ruleDefinition.target.runtimeTarget?.version ||
                           formData.ruleDefinition.target.runtimeTarget?.operator;

    if (hasRuntimeTarget) {
      if (!formData.ruleDefinition.target.runtimeTarget.runtimeType) {
        newErrors.runtimeType = 'Runtime type is required when using runtime target';
      }
      if (!formData.ruleDefinition.target.runtimeTarget.version) {
        newErrors.runtimeVersion = 'Runtime version is required when using runtime target';
      } else if (formData.ruleDefinition.target.runtimeTarget.version && !new RegExp(VERSION_PATTERN).test(formData.ruleDefinition.target.runtimeTarget.version)) {
        newErrors.runtimeVersion = 'Invalid version format. Expected format: x.y.z[-suffix]';
      }
      if (formData.ruleDefinition.target.runtimeTarget.version && !formData.ruleDefinition.target.runtimeTarget.operator) {
        newErrors.runtimeOperator = 'Operator is required when a version is specified';
      }
    }

    // Dependency Target validation
    const hasDependencyTarget = formData.ruleDefinition.target.dependencyTarget?.artefact ||
                               formData.ruleDefinition.target.dependencyTarget?.version ||
                               formData.ruleDefinition.target.dependencyTarget?.operator;

    if (hasDependencyTarget) {
      if (!formData.ruleDefinition.target.dependencyTarget.artefact) {
        newErrors.artefact = 'Artefact is required when using dependency target';
      }
      if (!formData.ruleDefinition.target.dependencyTarget.version) {
        newErrors.dependencyVersion = 'Dependency version is required when using dependency target';
      } else if (formData.ruleDefinition.target.dependencyTarget.version && !new RegExp(VERSION_PATTERN).test(formData.ruleDefinition.target.dependencyTarget.version)) {
        newErrors.dependencyVersion = 'Invalid version format. Expected format: x.y.z[-suffix]';
      }
       if (formData.ruleDefinition.target.dependencyTarget.version && !formData.ruleDefinition.target.dependencyTarget.operator) {
        newErrors.dependencyOperator = 'Operator is required when a version is specified';
      }
    }

    // --- Mutual Exclusivity and At Least One Target Validation ---
    // Check if both targets are set
    if (hasRuntimeTarget && hasDependencyTarget) {
        newErrors.targets = 'Cannot set both Runtime and Dependency targets simultaneously.';
    } else if (!hasRuntimeTarget && !hasDependencyTarget) {
        // Check if at least one target is set, if either section was interacted with
         if (formData.ruleDefinition.target.runtimeTarget?.runtimeType || formData.ruleDefinition.target.dependencyTarget?.artefact) {
              newErrors.targets = 'At least one target (Runtime or Dependency) must be specified correctly.';
         }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const fields = field.split('.');
      let current = newData;

      for (let i = 0; i < fields.length - 1; i++) {
        // If the nested object doesn't exist, create it
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }

      current[fields[fields.length - 1]] = value;
      return newData;
    });

    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
     // Also clear the general 'targets' error if either target section is being edited
    if ((field.startsWith('ruleDefinition.target.runtimeTarget') || field.startsWith('ruleDefinition.target.dependencyTarget')) && errors.targets) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.targets;
            return newErrors;
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous backend errors
    setErrors({});

    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    // Clean up empty targets before submission
    const submitData = { ...formData };
    if (!submitData.ruleDefinition.target.runtimeTarget?.runtimeType &&
        !submitData.ruleDefinition.target.runtimeTarget?.version &&
        !submitData.ruleDefinition.target.runtimeTarget?.operator) {
      submitData.ruleDefinition.target.runtimeTarget = null;
    }
    if (!submitData.ruleDefinition.target.dependencyTarget?.artefact &&
        !submitData.ruleDefinition.target.dependencyTarget?.version &&
        !submitData.ruleDefinition.target.dependencyTarget?.operator) {
      submitData.ruleDefinition.target.dependencyTarget = null;
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('API Error:', error);
      // Check for detailed validation errors from the backend
      if (error?.response?.data?.error?.details) {
        const backendErrors = error.response.data.error.details;
        const formErrors = {};
        // Map backend error keys to form field keys
        for (const key in backendErrors) {
          if (backendErrors.hasOwnProperty(key)) {
            // Simple mapping for now, can be extended for nested fields if needed
            const fieldName = key.split('.').pop(); // Get the last part of nested keys like 'compliance.deadline'
            if (fieldName) {
              // Special case for deadline as backend sends compliance.deadline but form uses 'deadline'
              formErrors[fieldName === 'deadline' ? 'deadline' : fieldName] = backendErrors[key];
            }
          }
        }
         // Handle the case where the backend returns a general validation error message
        if (backendErrors.length > 0 && Object.keys(formErrors).length === 0) {
             toast.error(error?.response?.data?.error?.message || 'Validation failed.');
         } else if(Object.keys(formErrors).length > 0) {
            setErrors(formErrors); // Set specific field errors
            toast.error('Please fix the errors highlighted in the form.');
         } else {
            // Fallback for other types of backend errors
             toast.error(error?.response?.data?.error?.message || 'An error occurred.');
         }
      } else {
        // Handle non-validation errors or errors without details
        toast.error(error.message || 'Failed to save rule');
      }
      throw error; // Re-throw to allow onSubmit caller to handle if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              {rule ? 'Edit Rule' : 'Create New Rule'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rule Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              error={!!errors.name}
              helperText={errors.name}
              inputProps={{ minLength: 3, maxLength: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
                required
              >
                <MenuItem value="">None</MenuItem>
                {STATUS_OPTIONS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
              {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              error={!!errors.description}
              helperText={errors.description}
              inputProps={{ maxLength: 1000 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Rule Definition
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.language}>
              <InputLabel>Language</InputLabel>
              <Select
                value={formData.ruleDefinition.language}
                label="Language"
                onChange={(e) => handleChange('ruleDefinition.language', e.target.value)}
                required
              >
                <MenuItem value="">None</MenuItem>
                {LANGUAGE_OPTIONS.map(lang => (
                  <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                ))}
              </Select>
              {errors.language && <FormHelperText>{errors.language}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Runtime Target
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.runtimeType}>
              <InputLabel>Runtime Type</InputLabel>
              <Select
                value={formData.ruleDefinition.target.runtimeTarget?.runtimeType || ''}
                label="Runtime Type"
                onChange={(e) => handleChange('ruleDefinition.target.runtimeTarget.runtimeType', e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {RUNTIME_TYPE_OPTIONS.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
              {errors.runtimeType && <FormHelperText>{errors.runtimeType}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Version"
              value={formData.ruleDefinition.target.runtimeTarget?.version || ''}
              onChange={(e) => handleChange('ruleDefinition.target.runtimeTarget.version', e.target.value)}
              error={!!errors.runtimeVersion}
              helperText={errors.runtimeVersion}
              inputProps={{ pattern: VERSION_PATTERN }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.runtimeOperator}>
              <InputLabel>Operator</InputLabel>
              <Select
                value={formData.ruleDefinition.target.runtimeTarget?.operator || ''}
                label="Operator"
                onChange={(e) => handleChange('ruleDefinition.target.runtimeTarget.operator', e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {OPERATOR_OPTIONS.map(op => (
                  <MenuItem key={op} value={op}>{op}</MenuItem>
                ))}
              </Select>
              {errors.runtimeOperator && <FormHelperText>{errors.runtimeOperator}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Dependency Target
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Artefact"
              value={formData.ruleDefinition.target.dependencyTarget?.artefact || ''}
              onChange={(e) => handleChange('ruleDefinition.target.dependencyTarget.artefact', e.target.value)}
              error={!!errors.artefact}
              helperText={errors.artefact}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Version"
              value={formData.ruleDefinition.target.dependencyTarget?.version || ''}
              onChange={(e) => handleChange('ruleDefinition.target.dependencyTarget.version', e.target.value)}
              error={!!errors.dependencyVersion}
              helperText={errors.dependencyVersion}
              inputProps={{ pattern: VERSION_PATTERN }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.dependencyOperator}>
              <InputLabel>Operator</InputLabel>
              <Select
                value={formData.ruleDefinition.target.dependencyTarget?.operator || ''}
                label="Operator"
                onChange={(e) => handleChange('ruleDefinition.target.dependencyTarget.operator', e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {OPERATOR_OPTIONS.map(op => (
                  <MenuItem key={op} value={op}>{op}</MenuItem>
                ))}
              </Select>
              {errors.dependencyOperator && <FormHelperText>{errors.dependencyOperator}</FormHelperText>}
            </FormControl>
          </Grid>

          {errors.targets && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {errors.targets}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Compliance
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={formData.compliance.deadline}
                onChange={(date) => handleChange('compliance.deadline', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    error={!!errors.deadline}
                    helperText={errors.deadline}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={formData.compliance.severity}
                label="Severity"
                onChange={(e) => handleChange('compliance.severity', e.target.value)}
                required
              >
                <MenuItem value="">None</MenuItem>
                {SEVERITY_OPTIONS.map(severity => (
                  <MenuItem key={severity} value={severity}>{severity}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  rule ? 'Update Rule' : 'Create Rule'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
} 