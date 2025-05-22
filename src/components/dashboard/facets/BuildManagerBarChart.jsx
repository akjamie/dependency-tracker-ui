import React from 'react';
import { Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699'];

export default function BuildManagerBarChart({ data }) {
  if (!data) return <Card sx={{ height: 340 }}><CardContent sx={{ height: 340, p: 0 }}>Loading...</CardContent></Card>;
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <Card sx={{ height: 340, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 2 }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 