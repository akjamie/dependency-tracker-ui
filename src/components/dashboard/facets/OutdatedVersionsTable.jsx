import React from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';

function extractOutdatedVersions(versions) {
  if (!versions) return [];
  // Flatten all version objects and filter where isLatest === false
  return Object.entries(versions)
    .filter(([_, info]) => info.isLatest === false)
    .map(([version, info]) => ({
      version,
      count: info.count,
      latest: info.latestVersion,
    }));
}

export default function OutdatedVersionsTable({ data }) {
  if (!data) return <Card><CardContent>Loading...</CardContent></Card>;
  // Merge all outdated versions from all language/framework keys
  const allOutdated = []
    .concat(
      extractOutdatedVersions(data.javaVersions),
      extractOutdatedVersions(data.pythonVersions),
      extractOutdatedVersions(data.nodeVersions),
      extractOutdatedVersions(data.springBootVersions)
    )
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Top Outdated Versions</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>Latest</TableCell>
              <TableCell align="right">Count</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allOutdated.map((row, idx) => (
              <TableRow key={row.version + idx}>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.latest}</TableCell>
                <TableCell align="right">{row.count}</TableCell>
                <TableCell>
                  <Chip label="Outdated" color="warning" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 