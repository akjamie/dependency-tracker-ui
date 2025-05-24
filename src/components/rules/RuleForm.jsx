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
      setFormData(rule);
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
      } else if (!new RegExp(VERSION_PATTERN).test(formData.ruleDefinition.target.runtimeTarget.version)) {
        newErrors.runtimeVersion = 'Invalid version format. Expected format: x.y.z[-suffix]';
      }
      if (!formData.ruleDefinition.target.runtimeTarget.operator) {
        newErrors.runtimeOperator = 'Operator is required when using runtime target';
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
      } else if (!new RegExp(VERSION_PATTERN).test(formData.ruleDefinition.target.dependencyTarget.version)) {
        newErrors.dependencyVersion = 'Invalid version format. Expected format: x.y.z[-suffix]';
      }
      if (!formData.ruleDefinition.target.dependencyTarget.operator) {
        newErrors.dependencyOperator = 'Operator is required when using dependency target';
      }
    }

    // At least one target must be filled
    if (!hasRuntimeTarget && !hasDependencyTarget) {
      newErrors.targets = 'At least one target (Runtime or Dependency) must be specified';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
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
      toast.error(error.message || 'Failed to save rule');
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