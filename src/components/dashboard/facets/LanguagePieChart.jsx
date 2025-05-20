import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699'];

export default function LanguagePieChart({ data }) {
  if (!data) return <Card sx={{ minHeight: 340 }}><CardContent>Loading...</CardContent></Card>;
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <Card sx={{ minHeight: 340 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Language Distribution</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 