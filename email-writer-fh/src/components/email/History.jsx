import { Paper, Typography } from "@mui/material";

export default function History() {

  return (

    <Paper sx={{ p: 4 }}>

      <Typography variant="h5">
        Reply History
      </Typography>

      <Typography sx={{ mt: 2 }}>
        No history yet
      </Typography>

    </Paper>

  );
}