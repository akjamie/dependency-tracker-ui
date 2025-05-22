import React from 'react';
import { Card, CardContent, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699'];

export default function LanguagePieChart({ data }) {
  if (!data) return <Card sx={{ minHeight: 340, height: 340 }}><CardContent sx={{ height: '100%', p: 0 }}>Loading...</CardContent></Card>;
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <Card sx={{ minHeight: 340, height: 340, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, height: '100%', p: 0 }}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
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
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Legend layout="horizontal" align="center" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 