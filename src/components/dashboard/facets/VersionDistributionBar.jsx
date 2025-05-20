import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function VersionDistributionBar({ data }) {
  if (!data) return <Card sx={{ minHeight: 250 }}><CardContent>Loading...</CardContent></Card>;
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Major Version Distribution</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#dc004e" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 