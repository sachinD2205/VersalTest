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
import React from "react";
import HawkerDetails from "../../../components/streetVendorManagementSystem/components/HawkerDetails";
import PropertyAndWaterTaxes from "../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes";
import AadharAuthentication from "../../../components/streetVendorManagementSystem/components/AadharAuthentication";
import AdditionalDetails from "../../../components/streetVendorManagementSystem/components/AdditionalDetails";
import AddressOfHawker from "../../../components/streetVendorManagementSystem/components/AddressOfHawker";
import BasicApplicationDetails from "../../../components/streetVendorManagementSystem/components/BasicApplicationDetails";
// Main Component - Clerk

// Form Preview Dailog
const FormPreviewDailog = () => {
  return (
    <div>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={formPreviewDailog}
        onClose={() => formPreviewDailogClose()}
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
                aria-label="delete"
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
    </div>
  );
};

export default FormPreviewDailog;
