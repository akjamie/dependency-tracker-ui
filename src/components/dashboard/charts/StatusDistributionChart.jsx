import React from 'react';
import { Box, Chip, Typography, useTheme, alpha } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  InfoOutlined as InfoOutlinedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Close as CloseIcon,
  FolderOpenOutlined as FolderOpenOutlinedIcon,
  CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
  ArchiveOutlined as ArchiveOutlinedIcon
} from '@mui/icons-material';

// Define chart colors using theme palette for better consistency, including DRAFT, ACTIVE, and ARCHIVED
const getStatusChartColors = (theme) => ({
  OPEN: theme.palette.error.main,
  IN_PROGRESS: theme.palette.warning.main,
  RESOLVED: theme.palette.success.main,
  CLOSED: theme.palette.secondary.main,
  IGNORED: theme.palette.info.main,
  DRAFT: theme.palette.grey[500],
  ACTIVE: theme.palette.primary.main,
  ARCHIVED: theme.palette.grey[700],
});

const STATUS_COLORS_MUI = {
  OPEN: 'error',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'secondary',
  IGNORED: 'info',
  DRAFT: 'default',
  ACTIVE: 'primary',
  ARCHIVED: 'default',
};

const STATUS_ICONS = {
  OPEN: <ErrorOutlineIcon />,
  IN_PROGRESS: <WarningAmberIcon />,
  RESOLVED: <CheckCircleOutlineIcon />,
  CLOSED: <CloseIcon />,
  IGNORED: <InfoOutlinedIcon />,
  DRAFT: <FolderOpenOutlinedIcon />,
  ACTIVE: <CheckCircleOutlineOutlinedIcon />,
  ARCHIVED: <ArchiveOutlinedIcon />
};

export default function StatusDistributionChart({ data, chartHeight = 300 }) {
  const theme = useTheme();
  const statusChartColors = getStatusChartColors(theme);

  console.log('StatusDistributionChart received data:', data); // Log incoming data

  if (!data || Object.keys(data).length === 0) {
    return <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No status data available.</Typography>;
  }

  // Prepare data for the chart, filtering out statuses with 0 violations
  const chartData = Object.entries(data)
     .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status,
      value: count,
    }));

   console.log('StatusDistributionChart prepared chartData:', chartData); // Log prepared chartData

   if (chartData.length === 0) {
       return <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No violations found across statuses.</Typography>;
  }

  return (
    <Box sx={{ height: chartHeight, width: '100%' }}>
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
              // Use predefined colors based on index
              <Cell key={`cell-${entry.name}`} fill={statusChartColors[entry.name?.toUpperCase()] || theme.palette.secondary.main} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} rules`, name]} />
          {/* Use default legend styling */}
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            // Removed custom formatter
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
} 