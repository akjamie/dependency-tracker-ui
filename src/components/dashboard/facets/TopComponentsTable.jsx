import React from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function TopComponentsTable({ data }) {
  if (!data) return <Card><CardContent>Loading...</CardContent></Card>;
  const sorted = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Top 10 Components by Dependency Count</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Component ID</TableCell>
              <TableCell align="right">Dependency Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map(([componentId, count]) => (
              <TableRow key={componentId}>
                <TableCell>{componentId}</TableCell>
                <TableCell align="right">{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 