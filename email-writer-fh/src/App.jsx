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

  /* ================= FALLBACK (TONE ONLY) ================= */
  const generateToneReply = (tone) => {
    switch (tone) {
      case 'Professional':
        return `Dear Sir/Madam,

Thank you for your email.

Please let me know the specific details you require so that I can assist you accurately.

Best regards,
[Your Name]`;

      case 'Friendly':
        return `Hi 😊,

Thanks for reaching out!  
Could you please share a bit more detail so I can help you better?

Best,
[Your Name]`;

      case 'Casual':
        return `Hi,

Got your message!  
Can you tell me a little more about what you’re looking for?

Thanks!`;

      default:
        return `Hello,

Please let me know how I can help you.

Thanks`;
    }
  };

  /* ================= GENERATE ================= */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        instructions,
        tone   // 🔥 ONLY TONE SENT
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
    } catch {
      setGeneratedReply(generateToneReply(tone));
      toast.warning('Backend unavailable – using tone-based reply');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    toast.success('Copied');
  };

  const handleDownload = () => {
    saveAs(new Blob([generatedReply]), 'email_reply.txt');
    toast.success('Downloaded');
  };

  return (
    <ThemeProvider theme={theme}>
      {/* ===== NAVBAR ===== */}
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(90deg,#2f3c7e,#546e7a)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            EMIPI
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {['generator', 'dashboard', 'history'].map(tab => (
              <Button
                key={tab}
                size="small"
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? 'contained' : 'outlined'}
                sx={{ color: '#fff', borderColor: '#fff' }}
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
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
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
          alignItems: 'center'
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          Welcome to EMIPI
        </Typography>

        <Typography sx={{ mt: 2, color: '#cfd8dc', textAlign: 'center', maxWidth: 700 }}>
          EMIPI helps you write professional, friendly, or casual email replies instantly —
          just choose a tone and get a polished response.
        </Typography>
      </Box>

      {/* ===== BODY ===== */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Paper sx={{ p: 4 }}>
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
                  label="Additional Instructions (Optional)"
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
                      sx={{
                        mb: 2,
                        '& textarea': { resize: 'vertical' }
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
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



