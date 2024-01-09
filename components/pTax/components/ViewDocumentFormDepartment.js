import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ThemeProvider
} from "@mui/material";
import { Stack, flexbox } from "@mui/system";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks.js";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel.js";
import theme from "../../../theme.js";
import { catchExceptionHandlingMethod } from "../../../util/util.js";
import PropertyRegistractionDocumentUpload from "./PropertyRegistractionDocumentUpload.js";

/** Authore - Sachin Durge */
//  view documents
const Index = () => {
  const userToken = useGetToken();
  const {
    control,
    getValues,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels?.language);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  // view
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={watch("viewDocumentDailog")}
          onClose={() => {
            const data = {
              ...watch(),
              loadderState: false,
              viewDocumentDailog: false,
            }
            reset(data);
          }}
        >
          <CssBaseline />
          <DialogTitle>
            {<FormattedLabel id="viewDocument" />}
          </DialogTitle>
          <DialogContent>
            <div>
              <PropertyRegistractionDocumentUpload />
            </div>
          </DialogContent>
          <DialogTitle>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
                <Stack
                  style={{ display: flexbox, justifyContent: "center" }}
                  spacing={3}
                  direction={"row"}
                >
                  {/* Exit Button */}
                  <IconButton
                    onClick={() => {
                      const data = {
                        ...watch(),
                        loadderState: false,
                        viewDocumentDailog: false,
                      }
                      reset(data);

                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </DialogTitle>
        </Dialog>
      </ThemeProvider>
    </div >
  );
};

export default Index;
