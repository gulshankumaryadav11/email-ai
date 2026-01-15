import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Drawer,
  IconButton,
  CssBaseline,
  useMediaQuery,
  Alert,
  Divider,
  CircularProgress
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function App() {
  const isMobile = useMediaQuery("(max-width:430px)");

  const [activeTab, setActiveTab] = useState("generator");
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [emailContent, setEmailContent] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generatedReply, setGeneratedReply] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          background: {
            default: darkMode ? "#0f1f1d" : "#eef6f6",
            paper: darkMode ? "#142826" : "#ffffff"
          },
          primary: {
            main: darkMode ? "#4fd1c5" : "#2f8f8b"
          }
        },
        typography: {
          fontFamily: '"Inter", system-ui, sans-serif'
        }
      }),
    [darkMode]
  );

  const handleSidebarClick = (key) => {
    if (key === "dark") setDarkMode((v) => !v);
    else setActiveTab(key);
    setDrawerOpen(false);
  };

  /* ================= REAL BACKEND CALL ================= */
  const handleGenerate = async () => {
    if (!emailContent.trim()) {
      setError("Original Email is required");
      return;
    }

    setError("");
    setGeneratedReply("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/email/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: emailContent,
            instructions,
            tone
          })
        }
      );

      if (!res.ok) {
        throw new Error("Backend error: " + res.status);
      }

      const data = await res.json();
      console.log("Backend Response:", data);

      const replyText = data.reply || data.message || data.text;

      setGeneratedReply(replyText);

      setHistory((prev) => [
        {
          email: emailContent,
          instructions,
          tone,
          reply: replyText,
          date: new Date().toLocaleString()
        },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
      setError("Backend se response nahi aa raha");
    } finally {
      setLoading(false);
    }
  };

  const mostUsedTone = useMemo(() => {
    if (history.length === 0) return "—";
    const map = {};
    history.forEach((h) => (map[h.tone] = (map[h.tone] || 0) + 1));
    return Object.keys(map).reduce((a, b) =>
      map[a] > map[b] ? a : b
    );
  }, [history]);

  const Sidebar = (
    <Box
      sx={{
        width: 240,
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(180deg,#0e3a36,#0b2d2a)"
          : "linear-gradient(180deg,#2f8f8b,#1f6f6b)",
        color: "#fff",
        px: 3,
        py: 4
      }}
    >
      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 4 }}>
        EMIPI
      </Typography>
      <List>
        {["generator", "dashboard", "history", "dark"].map((key) => (
          <ListItem
            key={key}
            onClick={() => handleSidebarClick(key)}
            sx={{
              mb: 1,
              borderRadius: 999,
              cursor: "pointer",
              background:
                activeTab === key
                  ? "rgba(255,255,255,0.3)"
                  : "transparent"
            }}
          >
            <ListItemText
              primary={
                key === "dark"
                  ? "Dark Mode"
                  : key.charAt(0).toUpperCase() + key.slice(1)
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", display: "flex" }}>
        {!isMobile && Sidebar}

        {isMobile && (
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            {Sidebar}
          </Drawer>
        )}

        <Box sx={{ flex: 1 }}>
          <Box sx={{ py: 2, textAlign: "center", position: "relative" }}>
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ position: "absolute", left: 12, top: 12 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h4">Welcome to EMIPI</Typography>
          </Box>

          <Container maxWidth="lg">
            {activeTab === "generator" && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Paper sx={{ p: 3 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                      fullWidth
                      label="Original Email"
                      multiline
                      rows={4}
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      sx={{ my: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Additional Instructions"
                      multiline
                      rows={3}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Tone</InputLabel>
                      <Select
                        value={tone}
                        label="Tone"
                        onChange={(e) => setTone(e.target.value)}
                      >
                        <MenuItem value="Professional">Professional</MenuItem>
                        <MenuItem value="Friendly">Friendly</MenuItem>
                        <MenuItem value="Casual">Casual</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      fullWidth
                      onClick={handleGenerate}
                      disabled={loading}
                      sx={{ height: 48, borderRadius: 999 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Generate Reply"
                      )}
                    </Button>

                    {generatedReply && (
                      <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography fontWeight={700}>
                          Generated Reply
                        </Typography>
                        <Typography>{generatedReply}</Typography>
                      </Paper>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Paper sx={{ p: 3 }}>
                    <Typography fontWeight={700}>
                      How EMIPI Works
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography>Paste email → Choose tone → Generate</Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {activeTab === "dashboard" && (
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h4">
                      {history.length}
                    </Typography>
                    <Typography>Total Replies</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h4">
                      {mostUsedTone}
                    </Typography>
                    <Typography>Most Used Tone</Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {activeTab === "history" && (
              <Paper sx={{ p: 3 }}>
                {history.length === 0 ? (
                  <Typography>No history yet</Typography>
                ) : (
                  <List>
                    {history.map((h, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={h.email.slice(0, 60)}
                          secondary={h.reply}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            )}
          </Container>

          <Box sx={{ py: 2, textAlign: "center" }}>
            © 2026 EMIPI · Smart Email Replies
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
