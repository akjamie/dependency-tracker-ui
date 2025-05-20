import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function SummaryCards({ totalComponents, totalDependencies, mostCommonLanguage, mostUsedBuildManager }) {
  const cards = [
    { label: 'Total Components', value: totalComponents },
    { label: 'Total Dependencies', value: totalDependencies },
    { label: 'Most Common Language', value: mostCommonLanguage },
    { label: 'Most Used Build Manager', value: mostUsedBuildManager },
  ];
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {cards.map(card => (
        <Grid item xs={12} md={3} key={card.label}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">{card.label}</Typography>
              <Typography variant="h5">{card.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
} 