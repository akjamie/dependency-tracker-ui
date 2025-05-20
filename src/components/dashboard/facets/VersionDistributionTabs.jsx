import React, { useState } from 'react';
import { Card, CardContent, Typography, Tabs, Tab, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LabelList } from 'recharts';

const versionKeys = [
  { key: 'javaVersions', label: 'Java' },
  { key: 'pythonVersions', label: 'Python' },
  { key: 'nodeVersions', label: 'Node.js' },
  { key: 'springBootVersions', label: 'Spring Boot' },
];

function getChartData(versions) {
  if (!versions || Object.keys(versions).length === 0) return [];
  return Object.entries(versions).map(([version, info]) => ({
    version,
    count: info.count,
    isLatest: info.isLatest,
  }));
}

export default function VersionDistributionTabs({ data }) {
  const [tab, setTab] = useState(0);

  // Defensive: If data is missing or not an object, show loading
  if (!data || typeof data !== 'object') {
    return <Card sx={{ minHeight: 340 }}><CardContent>Loading...</CardContent></Card>;
  }

  // Get the current tab's version data
  const currentKey = versionKeys[tab].key;
  const chartData = getChartData(data[currentKey]);

  return (
    <Card sx={{ minHeight: 340 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Version Distribution</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          {versionKeys.map((v, idx) => (
            <Tab key={v.key} label={v.label} />
          ))}
        </Tabs>
        <Box sx={{ height: 250 }}>
          {chartData.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>No version data available for {versionKeys[tab].label}.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="version" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976d2">
                  <LabelList dataKey="count" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
} 