import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Switch
} from "@mui/material";

export default function Sidebar({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode
}) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const menu = [
    { key: "generator", label: "✉️ Email Generator" },
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "history", label: "📜 History" }
  ];

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(180deg,#0e3a36,#0b2d2a)"
          : "linear-gradient(180deg,#2f8f8b,#1f6f6b)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        px: 3,
        py: 4
      }}
    >

      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          mb: 4
        }}
      >
        EMIPI
      </Typography>

      <List>

        {menu.map((item) => (

          <ListItemButton
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            sx={{
              borderRadius: 2,
              mb: 1,
              background:
                activeTab === item.key
                  ? "rgba(255,255,255,0.25)"
                  : "transparent",
              "&:hover": {
                background: "rgba(255,255,255,0.2)"
              }
            }}
          >

            <ListItemText primary={item.label} />

          </ListItemButton>

        ))}

      </List>

      <Divider sx={{ my: 3, background: "rgba(255,255,255,0.3)" }} />

      {/* Dark Mode */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography>🌙 Dark Mode</Typography>

        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </Box>

      {/* Logout */}

      <ListItemButton
        onClick={handleLogout}
        sx={{
          borderRadius: 2,
          mt: "auto",
          "&:hover": {
            background: "rgba(255,255,255,0.2)"
          }
        }}
      >
        <ListItemText primary="🚪 Logout" />
      </ListItemButton>

    </Box>
  );
}