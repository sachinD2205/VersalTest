import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  TextareaAutosize,
  ThemeProvider,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls.js";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks.js";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel.js";
import theme from "../../../theme.js";
import { catchExceptionHandlingMethod } from "../../../util/util.js";

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

  // remarkFunction
  const approveRejectRemark = (data) => {
    console.log("data34324234234", data)
    // setValue("loadderState", true);
    let approveRemark;
    let rejectRemark;
    let finalBodyForApi;

    // // Appprove
    // if (data == "Approve") {
    //   approveRemark = watch("verificationRemark");
    //   finalBodyForApi = {
    //     approveRemark,
    //     rejectRemark,
    //     id: watch("id"),
    //     serviceId: watch("serviceId"),
    //     desg: hardCodeAuthority,
    //     role: hardCodeAuthority,
    //   };

    //   let url = ``;
    //   if (finalBodyForApi?.serviceId == "24") {
    //     url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
    //   }

    //   axios
    //     .post(url, finalBodyForApi, {
    //       headers: {
    //         Authorization: `Bearer ${userToken}`,
    //       },
    //     })
    //     .then((res) => {
    //       setValue("loadderState", false);
    //       if (res?.status == 200 || res?.status == 201) {
    //         language == "en"
    //           ? sweetAlert("verification successfully completed", {
    //             icon: "success",
    //             buttons: { ok: "OK" },
    //           })
    //           : sweetAlert("सत्यापन यशस्वीरित्या पूर्ण झाले", {
    //             icon: "success",
    //             buttons: { ok: "ठीक आहे" },
    //           });

    //         approveRevertRemarkDailogClose();
    //         router.push("/propertyTax/dashboard");
    //       }
    //     })
    //     .catch((error) => {
    //       setValue("loadderState", false);
    //       callCatchMethod(error, language);
    //     });
    // }
    // // Revert
    // else if (data == "Revert") {
    //   if (
    //     watch("verificationRemark") != "" &&
    //     watch("verificationRemark") != null &&
    //     watch("verificationRemark") != undefined
    //   ) {
    //     rejectRemark = watch("verificationRemark");

    //     finalBodyForApi = {
    //       approveRemark,
    //       rejectRemark,
    //       id: watch("id"),
    //       serviceId: watch("serviceId"),
    //       desg: hardCodeAuthority,
    //       role: hardCodeAuthority,
    //     };

    //     let url = ``;
    //     if (finalBodyForApi?.serviceId == "24") {
    //       url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
    //     } else if (finalBodyForApi?.serviceId == "25")

    //       axios
    //         .post(url, finalBodyForApi, {
    //           headers: {
    //             Authorization: `Bearer ${userToken}`,
    //           },
    //         })
    //         .then((res) => {
    //           setValue("loadderState", false);
    //           if (res?.status == 200 || res?.status == 201) {
    //             language == "en"
    //               ? sweetAlert("application successfully reassigned", {
    //                 icon: "success",
    //                 buttons: { ok: "OK" },
    //               })
    //               : sweetAlert("अर्ज यशस्वीरित्या पुन्हा नियुक्त केला", {
    //                 icon: "success",
    //                 buttons: { ok: "ठीक आहे" },
    //               });

    //             approveRevertRemarkDailogClose();
    //             router.push("/propertyTax/dashboard");
    //           }
    //         })
    //         .catch((error) => {
    //           setValue("loadderState", false);
    //           callCatchMethod(error, language);
    //         });
    //   } else {
    //     setValue("loadderState", false);
    //     language == "en"
    //       ? sweetAlert("Remark is Required !!!", {
    //         icon: "error",
    //         buttons: { ok: "OK" },
    //       })
    //       : sweetAlert("टिप्पणी आवश्यक आहे !!!", {
    //         icon: "error",
    //         buttons: { ok: "ठीक आहे" },
    //       });
    //   }
    // }
  };

  //! ===========> useEffects


  //!=================> view
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Modal
          open={watch("approveRejectDailog")}
          onClose={() => {
            const data = {
              ...watch(),
              loadderState: false,
              approveRejectDailog: false,
            }
            reset(data);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
          }}
        >
          <Paper
            sx={{
              padding: 2,
              height: "400px",
              width: "600px",
            }}
            elevation={5}
            component={Box}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{
                    marginBottom: "30px",
                    marginTop: "20px",
                  }}
                  variant="h6"
                >
                  {
                    <FormattedLabel id="enterRemarkForApplication" />
                  }
                </Typography>
                <br />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextareaAutosize
                  style={{
                    width: "550px",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "30px",
                  }}
                  {...register("verificationRemark")}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack spacing={5} direction="row">
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "green" }}
                    onClick={() => approveRejectRemark("Approve")}
                  >
                    {<FormattedLabel id="approve" />}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => approveRejectRemark("Revert")}
                  >
                    {<FormattedLabel id="reassign" />}
                  </Button>
                  <Button
                    style={{ backgroundColor: "red" }}
                    onClick={() => {
                      const data = {
                        ...watch(),
                        loadderState: false,
                        approveRejectDailog: false,
                      }
                      reset(data);
                    }
                    }
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Modal>
      </ThemeProvider>
    </div >
  );
};

export default Index;
