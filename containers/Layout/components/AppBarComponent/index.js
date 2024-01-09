import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import Image from "next/image";
import styles from "./[AppBarComponent].module.css";
import loginLabels from "../../../reuseableComponents/labels/common/loginLabels";
import { useSelector } from "react-redux";

const AppBarComponent = () => {
  const _language = useSelector((state) => {
    return state.labels.language;
  });

  const findLoginLabel = (id) => {
    if (_language) {
      return loginLabels[_language][id];
    } else {
      return loginLabels["mr"][id];
    }
  };
  return (
    <div>
      <AppBar position="static" className={styles.appBar} elevation={0}>
        <Toolbar>
          <Grid container>
            <Grid item xs={1} className={styles.gridLayout}>
              <img src="/logo.png" alt="PP" width="50" height="50" />
              {/* <img src={"/logo.png"} alt="pcmcLogo" /> */}
            </Grid>
            <Grid item xs={10} className={styles.nameGridLayout}>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, marginLeft: "10px" }}
              >
                {findLoginLabel("pcmcName")}
              </Typography>
            </Grid>
            <Grid item xs={1} className={styles.gridLayout}>
              <Image src="/smartCityPCMC.png" alt="PP" width="50" height="50" />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppBarComponent;
