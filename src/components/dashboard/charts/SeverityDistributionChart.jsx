import React from 'react';
import { Box, Chip, Typography, useTheme, alpha } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SEVERITY_COLORS_CHART = {
  CRITICAL: '#E57373', // Red
  HIGH: '#EF5350',     // Red
  MEDIUM: '#FFB74D',   // Orange
  LOW: '#4FC3F7',      // Blue
};

const SEVERITY_COLORS_MUI = {
  CRITICAL: 'error',
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info',
};

export default function SeverityDistributionChart({ data }) {
  const theme = useTheme();

  if (!data || Object.keys(data).length === 0) {
    return <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No severity data available.</Typography>;
  }

  // Prepare data for the chart, filtering out severities with 0 violations
  const chartData = Object.entries(data)
    .filter(([, details]) => details.violations > 0)
    .map(([severity, details]) => ({
      name: severity,
      value: details.violations,
    }));

  if (chartData.length === 0) {
       return <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No violations found across severities.</Typography>;
  }

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={SEVERITY_COLORS_CHART[entry.name?.toUpperCase()] || '#A4A6B3'} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} violations`, name]} />
           <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            formatter={(value) => (
              <Chip
                label={value}
                color={SEVERITY_COLORS_MUI[value?.toUpperCase()] || 'default'}
                size="small"
                 sx={{
                  backgroundColor: theme => alpha(theme.palette[SEVERITY_COLORS_MUI[value?.toUpperCase()] || 'secondary']?.main || theme.palette.secondary.main, 0.2),
                  fontWeight: 600,
                  borderColor: theme => alpha(theme.palette[SEVERITY_COLORS_MUI[value?.toUpperCase()] || 'secondary']?.main || theme.palette.secondary.main, 0.6),
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: theme => theme.palette[SEVERITY_COLORS_MUI[value?.toUpperCase()] || 'secondary']?.dark || theme.palette.secondary.dark,
                }}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
} 