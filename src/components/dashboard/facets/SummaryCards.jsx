import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';

export default function SummaryCards({ totalComponents, dependenciesByLanguage }) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            height: 200,
            background: 'linear-gradient(135deg, #DB0011 0%, #FF1A1A 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CodeIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total Components
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {totalComponents}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Total number of components collected
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            height: 200,
            borderRadius: 3,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Dependencies by Language
              </Typography>
            </Box>
            <Box sx={{ mt: 1 }}>
              {dependenciesByLanguage.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No data available.
                </Typography>
              ) : (
                dependenciesByLanguage.map(({ language, count }, index) => (
                  <React.Fragment key={language}>
                    {index > 0 && <Divider sx={{ my: 1 }} />}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.5,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {language}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          minWidth: 40,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {count}
                        </Typography>
                      </Box>
                    </Box>
                  </React.Fragment>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
} 