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
import AdditionalInformation from "../../../components/pTax/components/AdditionalInformation.js";
import AddressOfPropertyHolder from "../../../components/pTax/components/AddressOfPropertyHolder.js";
import PropertyHolderDetails from "../../../components/pTax/components/PropertyHolderDetails.js";
import PropertyInformation from "../../../components/pTax/components/PropertyInformation.js";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Authore - Sachin Durge */
//  view form
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

  //!=================> view
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={watch("viewFormDailog")}
          onClose={() => {
            const data = {
              ...watch(),
              loadderState: false,
              viewFormDailog: false,
            }
            reset(data);
          }}
        >
          <CssBaseline />
          <DialogTitle>
            {<FormattedLabel id="viewForm" />}
          </DialogTitle>
          <DialogContent>
            <div>
              <PropertyHolderDetails />
              <AddressOfPropertyHolder />
              <PropertyInformation />
              <AdditionalInformation />
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
                        viewFormDailog: false,
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
