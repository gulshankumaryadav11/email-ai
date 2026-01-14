import React, { useState, useMemo } from 'react';
import {
  Container, Typography, Box, TextField, FormControl, InputLabel,
  MenuItem, Select, Button, CircularProgress, Paper, Card,
  CardContent, Grid, List, ListItem, ListItemText,
  AppBar, Toolbar, IconButton
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { saveAs } from 'file-saver';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function App() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [emailContent, setEmailContent] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tone, setTone] = useState('Professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalRepliesGenerated: 0,
    mostUsedTone: 'N/A',
    averageReplyLength: 0
  });

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: '#6C63FF' },
        background: {
          default: darkMode ? '#0f172a' : '#f1f5f9',
          paper: 'rgba(255,255,255,0.15)'
        }
      },
      shape: { borderRadius: 16 },
      typography: { fontFamily: 'Inter, sans-serif' }
    }), [darkMode]
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/email/generate`, {
        emailContent,
        instructions,
        tone
      });

      const reply = res.data;
      setGeneratedReply(reply);

      setHistory(prev => [
        { reply, tone, time: new Date().toLocaleString() },
        ...prev
      ].slice(0, 5));

      setStats(prev => ({
        totalRepliesGenerated: prev.totalRepliesGenerated + 1,
        mostUsedTone: tone,
        averageReplyLength: Math.round(
          (prev.averageReplyLength * prev.totalRepliesGenerated + reply.length) /
          (prev.totalRepliesGenerated + 1)
        )
      }));

      toast.success('Reply Generated ✨');
    } catch {
      toast.error('Backend Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* ===== NAVBAR ===== */}
      <AppBar
        position="sticky"
        sx={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(0,0,0,0.5)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography fontWeight={800}>EMIPI</Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {['generator', 'dashboard', 'history'].map(tab => (
              <Button
                key={tab}
                size="small"
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? 'contained' : 'text'}
                sx={{ minWidth: 80 }}
              >
                {tab}
              </Button>
            ))}
          </Box>

          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ===== HERO ===== */}
      <Box
        sx={{
          py: 6,
          textAlign: 'center',
          color: '#fff',
          background:
            'linear-gradient(135deg,#6366f1,#22d3ee)'
        }}
      >
        <Typography variant="h4" fontWeight={800}>
          Smart Email Reply Generator
        </Typography>
        <Typography sx={{ mt: 1, opacity: 0.9 }}>
          AI-powered replies in seconds
        </Typography>
      </Box>

      {/* ===== BODY ===== */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            backdropFilter: 'blur(14px)',
            animation: 'fadeIn 0.6s ease'
          }}
        >
          {activeTab === 'generator' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Original Email"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Extra Instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tone</InputLabel>
                  <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                    <MenuItem value="Professional">Professional</MenuItem>
                    <MenuItem value="Friendly">Friendly</MenuItem>
                    <MenuItem value="Casual">Casual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? <CircularProgress size={22} /> : 'Generate Reply'}
                </Button>
              </Grid>

              {generatedReply && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={generatedReply}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button fullWidth onClick={() => navigator.clipboard.writeText(generatedReply)}>
                      Copy
                    </Button>
                    <Button fullWidth onClick={() => saveAs(new Blob([generatedReply]), 'reply.txt')}>
                      Download
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}

          {activeTab === 'dashboard' && (
            <Grid container spacing={2}>
              {Object.entries(stats).map(([k, v]) => (
                <Grid item xs={12} sm={4} key={k}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{v}</Typography>
                      <Typography variant="caption">{k}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 'history' && (
            <List>
              {history.map((h, i) => (
                <ListItem key={i} divider>
                  <ListItemText primary={h.reply} secondary={h.time} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      {/* ===== FOOTER ===== */}
      <Box sx={{ textAlign: 'center', py: 3, opacity: 0.7 }}>
        © {new Date().getFullYear()} EMIPI
      </Box>

      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;
