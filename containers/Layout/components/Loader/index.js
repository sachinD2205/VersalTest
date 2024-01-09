import { Backdrop, Box } from "@mui/material";
import React from "react";
import styles from "../../../../styles/[loader].module.css";

const Loader = () => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "column",
      }}
      open={true}
    >
      <Box sx={{ backgroundColor: "white", borderRadius: "50px" }}>
        {/* <Box sx={{ backgroundColor: "white",padding:'2.5%' }}> */}
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="/logo.png" alt="" className={styles.logo} />
        </Box> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="/NewLoader.gif" alt="" className={styles.loader} />
        </Box>
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Pimpri Chinchwad Municipal Corporation</h2>
        </Box> */}
      </Box>
    </Backdrop>
    // <div className={styles.fullscreen}>
    //   <img className={styles.loader} src="/NewLoader.gif" alt="" />
    // </div>
    // <div className={styles.fullscreen}>
    //   <img src="/logo.png" alt="" className={styles.logo} />
    //   <br />
    //   <img className={styles.loader} src="/NewLoader.gif" alt="" />
    //   <h2>Pimpri Chinchwad Municipal Corporation</h2>
    // </div>
  );
};

export default Loader;
