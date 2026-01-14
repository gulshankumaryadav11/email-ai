import React, { useState, useMemo } from 'react';
import {
  Container, Typography, Box, TextField, FormControl, InputLabel,
  MenuItem, Select, Button, CircularProgress, Paper, Card,
  CardContent, Grid, List, ListItem, ListItemText,
  AppBar, Toolbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { saveAs } from 'file-saver';

function App() {

  /* ================= ENV ================= */
  const API_URL = import.meta.env.VITE_API_URL;

  /* ================= STATES ================= */
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

  /* ================= THEME ================= */
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: darkMode ? '#9fa8da' : '#2f3c7e' },
        secondary: { main: darkMode ? '#b0bec5' : '#78909c' },
        background: {
          default: darkMode ? '#101820' : '#eef1f5',
          paper: darkMode ? '#1c2431' : '#ffffff'
        }
      },
      typography: {
        fontFamily: 'Georgia, Inter, serif'
      }
    }), [darkMode]
  );

  /* ================= FALLBACK ================= */
  const generateToneReply = (tone) => {
    switch (tone) {
      case 'Professional':
        return `Dear Sir/Madam,

Thank you for your email.

Please let me know the details so I can assist you better.

Best regards,
[Your Name]`;

      case 'Friendly':
        return `Hi 😊,

Thanks for reaching out!
Could you please share a bit more detail?

Best,
[Your Name]`;

      case 'Casual':
        return `Hey,

Got your message 🙂
Can you tell me a little more?

Thanks!`;

      default:
        return `Hello,

Please let me know how I can help.

Thanks`;
    }
  };

  /* ================= GENERATE ================= */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/email/generate`, {
        emailContent,
        instructions,
        tone
      });

      const reply = res.data?.trim() || generateToneReply(tone);
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

      toast.success('Reply Generated');
    } catch (err) {
      console.error(err);
      setGeneratedReply(generateToneReply(tone));
      toast.warning('Backend unavailable – using fallback reply');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    saveAs(new Blob([generatedReply]), 'email_reply.txt');
    toast.success('Downloaded');
  };

  return (
    <ThemeProvider theme={theme}>

      {/* ===== NAVBAR (FIXED RESPONSIVE) ===== */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg,#2f3c7e,#546e7a)' }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            EMIPI
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: { xs: '100%', md: 'auto' }
            }}
          >
            {['generator', 'dashboard', 'history'].map(tab => (
              <Button
                key={tab}
                size="small"
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? 'contained' : 'outlined'}
                sx={{
                  color: '#fff',
                  borderColor: '#fff',
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  padding: { xs: '4px 6px', md: '6px 12px' }
                }}
              >
                {tab.toUpperCase()}
              </Button>
            ))}
          </Box>

          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              width: { xs: '100%', md: 'auto' },
              fontSize: { xs: '0.7rem', md: '0.8rem' }
            }}
          >
            {darkMode ? 'Light' : 'Dark'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* ===== HEADER ===== */}
      <Box
        sx={{
          minHeight: 220,
          backgroundImage:
            'linear-gradient(rgba(16,24,32,0.75),rgba(16,24,32,0.75)),url(https://images.unsplash.com/photo-1507679799987-c73779587ccf)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 2
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Welcome to EMIPI
        </Typography>

        <Typography sx={{ mt: 2, color: '#cfd8dc', maxWidth: 700 }}>
          Generate professional, friendly, or casual email replies instantly.
        </Typography>
      </Box>

      {/* ===== BODY ===== */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Paper sx={{ p: { xs: 2, md: 4 } }}>

          {activeTab === 'generator' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Original Email"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Additional Instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Tone</InputLabel>
                  <Select value={tone} label="Tone" onChange={(e) => setTone(e.target.value)}>
                    <MenuItem value="Professional">Professional</MenuItem>
                    <MenuItem value="Friendly">Friendly</MenuItem>
                    <MenuItem value="Casual">Casual</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !emailContent}
                >
                  {loading ? <CircularProgress size={22} /> : 'Generate Reply'}
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                {generatedReply && (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      rows={10}
                      value={generatedReply}
                      onChange={(e) => setGeneratedReply(e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button fullWidth onClick={handleCopy}>Copy</Button>
                      <Button fullWidth onClick={handleDownload}>Download</Button>
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>
          )}

          {activeTab === 'dashboard' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}><Card><CardContent>Total Replies: {stats.totalRepliesGenerated}</CardContent></Card></Grid>
              <Grid item xs={12} md={4}><Card><CardContent>Most Used Tone: {stats.mostUsedTone}</CardContent></Card></Grid>
              <Grid item xs={12} md={4}><Card><CardContent>Avg Length: {stats.averageReplyLength}</CardContent></Card></Grid>
            </Grid>
          )}

          {activeTab === 'history' && (
            <List>
              {history.map((h, i) => (
                <ListItem key={i} divider>
                  <ListItemText primary={h.reply} secondary={`${h.tone} • ${h.time}`} />
                </ListItem>
              ))}
            </List>
          )}

        </Paper>
      </Container>

      {/* ===== FOOTER ===== */}
      <Box sx={{ textAlign: 'center', py: 3, background: '#2f3c7e', color: '#fff' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} EMIPI · Smart Email Replies
        </Typography>
      </Box>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;

