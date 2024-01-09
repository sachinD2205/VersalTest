import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import AadharAuthentication from "./AadharAuthentication";
import AdditionalDetails from "./AdditionalDetails";
import AddressOfHawker from "./AddressOfHawker";
import BasicApplicationDetails from "./BasicApplicationDetails";
import HawkerDetails from "./HawkerDetails";
import PropertyAndWaterTaxes from "./PropertyAndWaterTaxes";

const FormPreview = () => {
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    // formState: { errors },
  } = useFormContext();
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => {
    setValue("formPreviewDailogState", false);
  };

  useEffect(() => {}, []);
  // View
  return (
    <>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={true}
        // onClose={() => formPreviewDailogClose()}
      >
        <CssBaseline />
        <DialogTitle>
          <Grid container>
            <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
              Preview
            </Grid>
            <Grid
              item
              xs={1}
              sm={2}
              md={4}
              lg={6}
              xl={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <IconButton
                aria-label='delete'
                sx={{
                  marginLeft: "530px",
                  backgroundColor: "primary",
                  ":hover": {
                    bgcolor: "red", // theme.palette.primary.main
                    color: "white",
                  },
                }}
              >
                <CloseIcon
                  sx={{
                    color: "black",
                  }}
                  onClick={() => {
                    formPreviewDailogClose();
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <BasicApplicationDetails />
          <HawkerDetails />
          <AddressOfHawker />
          <AadharAuthentication />
          <PropertyAndWaterTaxes />
          <AdditionalDetails />
        </DialogContent>

        <DialogTitle>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button onClick={formPreviewDailogClose}>Exit</Button>
          </Grid>
        </DialogTitle>
      </Dialog>
    </>
  );
};

export default FormPreview;
