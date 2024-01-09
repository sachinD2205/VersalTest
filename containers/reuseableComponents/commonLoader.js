import { Paper, CircularProgress } from "@mui/material";

const CommonLoader = () => {
  return  <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%", // Adjust itasper requirement.
            width: '100%',
            zIndex: '9999999',
            top: 0,
            position: 'fixed',
        }}
    >
        <Paper
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
                borderRadius: "50%",
                padding: 8,
            }}
            elevation={8}
        >
            <CircularProgress color="success" />
        </Paper>
    </div>
}

export default CommonLoader;