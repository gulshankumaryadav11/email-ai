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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
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

  /* ================= THEME ================= */
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
          fontFamily: '"Georgia","Times New Roman",serif',
          h4: {
            fontWeight: 700,
            fontSize: isMobile ? "22px" : "34px"
          }
        }
      }),
    [darkMode, isMobile]
  );

  const handleSidebarClick = (key) => {
    if (key === "dark") setDarkMode((v) => !v);
    else setActiveTab(key);
    setDrawerOpen(false);
  };

  /* ================= BACKEND ================= */
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailContent, instructions, tone })
        }
      );

      if (!res.ok) throw new Error("Backend error");

      const replyText = await res.text();
      setGeneratedReply(replyText);

      setHistory((prev) => [
        {
          email: emailContent,
          tone,
          reply: replyText,
          date: new Date().toLocaleString()
        },
        ...prev
      ]);
    } catch {
      setError("Backend response failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedReply], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "email-reply.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /* ================= SIDEBAR ================= */
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
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ "& .MuiDrawer-paper": { background: "none" } }}
          >
            {Sidebar}
          </Drawer>
        )}

        {/* MAIN */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* HEADER */}
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
            <Typography sx={{ mt: 1 }}>
              Generate professional, friendly, or casual email replies instantly.
            </Typography>
          </Box>

          {/* CONTENT */}
          <Container maxWidth="lg" sx={{ flex: 1, mt: 3 }}>
            {/* ================= GENERATOR ================= */}
            {activeTab === "generator" && (
              <Grid container spacing={3} alignItems="flex-start">
                {/* LEFT */}
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
                      sx={{
                        height: 48,
                        borderRadius: 999,
                        color: "#fff",
                        background: darkMode
                          ? "linear-gradient(90deg,#3fe0c0,#5b7cff)"
                          : "linear-gradient(90deg,#2f8f8b,#4fd1c5)"
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                      ) : (
                        "Generate Reply"
                      )}
                    </Button>

                    {generatedReply && (
                      <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography fontWeight={700}>
                          Generated Reply
                        </Typography>

                        <Typography sx={{ whiteSpace: "pre-line", mt: 1 }}>
                          {generatedReply}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<ContentCopyIcon />}
                            onClick={handleCopy}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                          >
                            Download
                          </Button>
                        </Box>
                      </Paper>
                    )}
                  </Paper>
                </Grid>

                {/* RIGHT – STICKY */}
                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{
                    position: { md: "sticky" },
                    top: { md: 24 },
                    alignSelf: "flex-start"
                  }}
                >
                  <Paper sx={{ p: 3 }}>
                    <Typography fontWeight={700} mb={2}>
                      How EMIPI Works
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>1. Paste the original email</Typography>
                    <Typography sx={{ mt: 1 }}>
                      2. Add instructions if needed
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      3. Select the reply tone
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      4. Generate the reply
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      5. Copy or download the email
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* ================= DASHBOARD ================= */}
            {activeTab === "dashboard" && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h4">{history.length}</Typography>
                    <Typography>Total Replies Generated</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h4">
                      {history[0]?.tone || "—"}
                    </Typography>
                    <Typography>Last Used Tone</Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* ================= HISTORY ================= */}
            {activeTab === "history" && (
              <Paper sx={{ p: 3 }}>
                {history.length === 0 ? (
                  <Typography>No history yet</Typography>
                ) : (
                  <List>
                    {history.map((h, i) => (
                      <ListItem key={i} alignItems="flex-start">
                        <ListItemText
                          primary={h.email.slice(0, 80)}
                          secondary={`${h.date}\n\n${h.reply}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            )}
          </Container>

          {/* FOOTER */}
          <Box
            sx={{
              mt: "auto",
              py: 3,
              textAlign: "center",
              background: darkMode ? "#0b2d2a" : "#2f8f8b",
              color: "#fff"
            }}
          >
            © 2026 EMIPI · Smart Email Replies
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;


