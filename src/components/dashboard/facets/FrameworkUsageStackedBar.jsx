import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function FrameworkUsageStackedBar({ data }) {
  if (!data) return <Card sx={{ minHeight: 340 }}><CardContent>Loading...</CardContent></Card>;
  // Merge all framework usages into a single array of {name, ...frameworks}
  const allKeys = Array.from(new Set([
    ...Object.keys(data.springBootUsage || {}),
    ...Object.keys(data.reactUsage || {}),
  ]));
  const chartData = allKeys.map(name => ({
    name,
    SpringBoot: data.springBootUsage?.[name] || 0,
    React: data.reactUsage?.[name] || 0,
  }));

  return (
    <Card sx={{ minHeight: 340 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Framework Usage</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="SpringBoot" stackId="a" fill="#1976d2" />
            <Bar dataKey="React" stackId="a" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 