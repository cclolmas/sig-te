import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import govBrTheme from './theme';

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MuiThemeProvider theme={govBrTheme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);
