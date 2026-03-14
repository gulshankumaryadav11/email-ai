import { useState } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Typography
} from "@mui/material";

import Sidebar from "../components/layout/Sidebar";

import Generator from "../components/email/Generator";
import Dashboard from "../components/email/Dashboard";
import History from "../components/email/History";

export default function MainApp() {

  const [activeTab, setActiveTab] = useState("generator");

  const [darkMode, setDarkMode] = useState(false);

  return (

    <Box sx={{ display: "flex" }}>

      <CssBaseline />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          background: darkMode ? "#0f1f1d" : "#f5f9f9"
        }}
      >

        <Box sx={{ py: 4, textAlign: "center" }}>

          <Typography variant="h4" fontWeight={700}>
            EMIPI Dashboard
          </Typography>

          <Typography sx={{ mt: 1 }}>
            Generate smart AI email replies instantly
          </Typography>

        </Box>

        <Container maxWidth="lg">

          {activeTab === "generator" && <Generator />}

          {activeTab === "dashboard" && <Dashboard />}

          {activeTab === "history" && <History />}

        </Container>

      </Box>

    </Box>

  );
}