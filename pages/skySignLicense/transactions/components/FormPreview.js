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
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useFormContext, controller, FormProvider, useForm } from "react-hook-form";
import ApplicantDetails from "../components/ApplicantDetails";
import AddressOfLicense from "../components/AddressOfLicense";
import IssuanceOfLicense from "../components/IssuanceOfLicense";
import PartenershipDetail from "../components/PartenershipDetail";
import IndustryAndEmployeeDetaills from "../components/IndustryAndEmployeeDetaills";
import BusinessOrIndustryInfo from "../components/BusinessOrIndustryInfo";
import AadharAuthentication from "../components/AadharAuthentication";
import IndustryDocumentsUpload from "../components/IndustryDocumentsUpload";
import ReIssuanceOfLicense from "../components/ReIssuanceOfLicense";
import { useRouter } from "next/router";


const FormPreview = () => {
  const router = useRouter();
  const {
    control,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm();  // Form Preview States
  // const [formPreviewDailog, setFormPreviewDailog] = useState(true);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => {
    alert("allo");
    setValue("formPreviewDailogState", false);
    // setFormPreviewDailog(false);
  };
  // const formDailogState
  // useEffect(() => {
  //   console.log("formPreviewDailogState", formPreviewDailogState);
  // }, [formPreviewDailogState]);

  useEffect(() => {
    alert("hello");
  }, []);
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
          <IssuanceOfLicense />
          <ApplicantDetails />
          <AadharAuthentication />
          <AddressOfLicense />
          <BusinessOrIndustryInfo />
          <BusinessOrIndustryInfo />
          <IndustryAndEmployeeDetaills />
          <IndustryAndEmployeeDetaills />
          <PartenershipDetail />
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
