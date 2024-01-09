import { Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useRouter } from "next/router";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";

const LmsHeader = (props) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      sx={{
        background: "#556cd6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: 19,
        fontWeight: 500,
        borderRadius: 100,
      }}
    >
      <Grid item xs={0.5}>
        {props?.showBackBtn == false ? (
          ""
        ) : (
          <IconButton
            onClick={() => {
              router.back();
            }}
            sx={{ color: "white" }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
      </Grid>
      <Grid
        item
        xs={11.5}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize : isSmallScreen ? 14 : 19,
            fontWeight: 600,
          }}
        >
          {props?.labelName && <FormattedLabel id={props.labelName} />}
          {props?.enName && props.language == "en"
            ? props.enName
            : props.mrName}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LmsHeader;
