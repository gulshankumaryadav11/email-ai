import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

export default function Sidebar({ setTab }) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const menu = [
    { key: "generator", label: "✉️ Generator" },
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "history", label: "📜 History" },
  ];

  return (

    <Box
      sx={{
        width: 240,
        minHeight: "100vh",
        background: "linear-gradient(180deg,#2f8f8b,#1f6f6b)",
        color: "#fff",
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

          <ListItem
            key={item.key}
            onClick={() => setTab(item.key)}
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              mb: 1,
              "&:hover": {
                background: "rgba(255,255,255,0.2)"
              }
            }}
          >

            <ListItemText primary={item.label} />

          </ListItem>

        ))}

        <ListItem
          onClick={handleLogout}
          sx={{
            cursor: "pointer",
            borderRadius: 2,
            mt: 3,
            "&:hover": {
              background: "rgba(255,255,255,0.2)"
            }
          }}
        >

          <ListItemText primary="🚪 Logout" />

        </ListItem>

      </List>

    </Box>

  );
}