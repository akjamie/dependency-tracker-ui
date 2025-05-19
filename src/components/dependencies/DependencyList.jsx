import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const DependencyList = ({ data, onSelectDependency }) => {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No dependencies found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Component</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Build Manager</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Dependencies</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Tooltip title={row.component.sourceCodeUrl}>
                    <span>{row.component.name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip label={row.language} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={row.buildManager} size="small" />
                </TableCell>
                <TableCell>{row.branch}</TableCell>
                <TableCell>{row.dependencies.length}</TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => onSelectDependency && onSelectDependency(row)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DependencyList; 