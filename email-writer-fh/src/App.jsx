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
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
          },
          text: {
            primary: darkMode ? "#e6f5f3" : "#2e6f6b",
            secondary: darkMode ? "#b6d8d4" : "#4b6f6c"
          }
        },
        typography: {
          fontFamily: '"Georgia","Times New Roman",serif',
          h4: {
            fontWeight: 700,
            fontSize: isMobile ? "22px" : "34px"
          },
          body1: {
            fontSize: "15px",
            lineHeight: 1.6
          },
          button: {
            textTransform: "none",
            fontWeight: 700
          }
        }
      }),
    [darkMode, isMobile]
  );

  const handleSidebarClick = (key) => {
    if (key === "dark") {
      setDarkMode((v) => !v);
    } else {
      setActiveTab(key);
    }
    setDrawerOpen(false);
  };

  const dummyGenerateReply = () => {
    return `Thank you for your email.

I have reviewed your message and will get back to you shortly.

Best regards,
EMIPI`;
  };

  const handleGenerate = () => {
    if (!emailContent.trim()) {
      setError("Original Email is required");
      return;
    }
    setError("");
    const reply = dummyGenerateReply();
    setGeneratedReply(reply);

    const entry = {
      email: emailContent,
      instructions,
      tone,
      reply,
      date: new Date().toLocaleString()
    };

    setHistory((prev) => [entry, ...prev]);
  };

  const mostUsedTone = useMemo(() => {
    if (history.length === 0) return "—";
    const map = {};
    history.forEach((h) => {
      map[h.tone] = (map[h.tone] || 0) + 1;
    });
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
                  : "transparent",
              "&:hover": {
                background: "rgba(255,255,255,0.35)"
              }
            }}
          >
            <ListItemText
              primary={
                key === "dark"
                  ? "Dark Mode"
                  : key.charAt(0).toUpperCase() + key.slice(1)
              }
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const GeneratorUI = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: darkMode
              ? "0 0 24px rgba(79,209,197,0.25)"
              : "0 14px 30px rgba(0,0,0,0.12)"
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Original Email"
            multiline
            rows={4}
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 2 }}
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
            sx={{
              height: 48,
              borderRadius: 999,
              color: "#fff",
              background: darkMode
                ? "linear-gradient(90deg,#3fe0c0,#5b7cff)"
                : "linear-gradient(90deg,#5fd0ff,#6c6cff)",
              boxShadow: darkMode
                ? "0 0 18px rgba(79,209,197,0.6)"
                : "0 0 18px rgba(100,120,255,0.6)",
              "&:hover": { opacity: 0.9 }
            }}
          >
            Generate Reply
          </Button>

          {generatedReply && (
            <Paper sx={{ mt: 3, p: 2, borderRadius: 3 }}>
              <Typography fontWeight={700} mb={1}>
                Generated Reply
              </Typography>
              <Typography>{generatedReply}</Typography>
            </Paper>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: darkMode
              ? "0 0 20px rgba(79,209,197,0.2)"
              : "0 12px 28px rgba(0,0,0,0.08)"
          }}
        >
          <Typography fontWeight={700} mb={2}>
            How EMIPI Works
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 1 }}>
            Paste the original email.
          </Typography>
          <Typography sx={{ mb: 1 }}>
            Add any additional instructions.
          </Typography>
          <Typography>Select a reply tone.</Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const DashboardUI = (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h4">{history.length}</Typography>
          <Typography>Total Replies Generated</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h4">{mostUsedTone}</Typography>
          <Typography>Most Used Tone</Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const HistoryUI = (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      {history.length === 0 ? (
        <Typography>No history yet</Typography>
      ) : (
        <List>
          {history.map((item, idx) => (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemText
                primary={item.email.slice(0, 80)}
                secondary={`Tone: ${item.tone} • ${item.date}\n${item.reply}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", display: "flex" }}>
        {!isMobile && Sidebar}

        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ "& .MuiDrawer-paper": { background: "none" } }}
          >
            {Sidebar}
          </Drawer>
        )}

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ position: "relative", py: 2, textAlign: "center" }}>
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

          <Container maxWidth="lg" sx={{ flex: 1, mt: 3 }}>
            {activeTab === "generator" && GeneratorUI}
            {activeTab === "dashboard" && DashboardUI}
            {activeTab === "history" && HistoryUI}
          </Container>

          <Box
            sx={{
              py: 2,
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




















