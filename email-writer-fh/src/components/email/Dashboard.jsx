import { Paper, Typography } from "@mui/material";

export default function Dashboard() {

  return (

    <Paper sx={{ p: 4 }}>

      <Typography variant="h5">
        Dashboard
      </Typography>

      <Typography sx={{ mt: 2 }}>
        Total Replies Generated: 10
      </Typography>

    </Paper>

  );
}