//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import ReportIcon from "@mui/icons-material/Report";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Button,
  IconButton,
  Modal,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../URLS/urls";
import Loader from "../../containers/Layout/components/Loader";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
import scrutinyActionSchema from "./schema/scrutinyActionSchema";

const Index = (props) => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const [modalforAprov, setmodalforAprov] = useState(false);
  const [trnMode, setTrnMode] = useState("");

  const [loaderState, setloaderState] = useState(false);
  const language = useSelector((state) => state?.labels.language);

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  let serviceId = (serviceId = user?.menus?.find(
    (m) => m?.id == selectedMenuFromDrawer,
  )?.serviceId);

  useEffect(() => {
    console.log("selectedMenuFromDrawer:-->", selectedMenuFromDrawer);
    console.log("serviceId", serviceId);
    console.log(router.query.role, "123456");
  }, []);

  const methods = useFormContext({
    criteriaMode: "all",
    resolver: yupResolver(scrutinyActionSchema),
    mode: "onChange",
  });

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  //aprovel
  console.log("editBody1111121", { ...getValues() });
  const remarks = async (props) => {
    // e.preventDefault();
    console.log("gphoto", getValues("gphoto"), getValues("gthumb"));
    console.log("gphoto/////", watch("encryptedGphoto"));
    console.log("all values", getValues("marriageBoardName"));
    const photoAndThumb = {
      gphoto: getValues("gphoto"),

      gthumb: getValues("gthumb"),
      bphoto: getValues("bphoto"),
      bthumb: getValues("bthumb"),
      wfPhoto: getValues("wfPhoto"),
      wfThumb: getValues("wfThumb"),
      wsPhoto: getValues("wsPhoto"),
      wsThumb: getValues("wsThumb"),
      wtPhoto: getValues("wtPhoto"),
      wtThumb: getValues("wtThumb"),
      boardHeadPersonPhoto: getValues("boardHeadPersonPhoto"),
      boardHeadPersonThumbImpression: getValues(
        "boardHeadPersonThumbImpression",
      ),
    };

    console.log("photoAndThumb", photoAndThumb);
    console.log("photoAndThumb", photoAndThumb);
    let applicationId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    console.log(
      "appid",
      applicationId,
      router?.query?.applicationId,
      router?.query?.id,
    );
    let editBody;
    if (
      router.query.role == "DOCUMENT_VERIFICATION" ||
      router.query.role == "ADMIN"
    ) {
      editBody = { ...getValues() };
    }

    console.log("editBody111112", { ...(editBody && editBody) });
    const finalBody = {
      // id: Number(router?.query?.id),
      ...(editBody && editBody),

      // id: Number(router?.query?.id),
      id: Number(applicationId),
      approveRemark:
        props == "APPROVE"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      rejectRemark:
        props == "REASSIGN"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,

      finalRejectionRemark:
        props == "REJECT"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      role: router.query.role,
      ...photoAndThumb,
    };

    const finalBody1 = {
      id: Number(applicationId),
      approveRemark:
        props == "APPROVE"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      rejectRemark:
        props == "REASSIGN"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,

      finalRejectionRemark:
        props == "REJECT"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      role: router.query.role,
    };
    console.log("serviceId**-", serviceId);
    console.log("finalbody", finalBody);
    if (serviceId == 10) {
      setloaderState(true);
      await axios
        .post(
          `${urls.MR}/transaction/applicant/saveApplicationApprove`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )

        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            // swal("Saved!", "Record Saved successfully !", "success");
            language == "en"
              ? sweetAlert({
                  title: "Saved!",
                  text: "Record Saved successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "जतन केले!",
                  text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  icon: "success",
                  button: "ओके",
                });
            setloaderState(false);
            router.push(
              `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (serviceId == 67) {
      console.log("updateData", finalBody);
      let finalBodyy = {
        ...finalBody,
        payment: null,
        loi: null,
        applicantHistoryLst: null,
      };
      setloaderState(true);
      axios
        .post(
          `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistrationApprove`,
          finalBodyy,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setloaderState(false);
            router.push(
              `/marriageRegistration/transactions/boardRegistrations/scrutiny`,
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (serviceId == 15) {
      setloaderState(true);
      let finalBodyy = {
        ...finalBody,
        payment: null,
        loi: null,
        zone: null,
        applicantHistoryLst: null,
      };
      console.log("modification of mbr", finalBody);
      axios
        .post(
          `${urls.MR}/transaction/modOfMarBoardCertificate/saveModOfMarBoardCertificateApprove`,
          finalBodyy,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((response) => {
          console.log("responseOut", response);
          if (response.status === 200 || response.status === 201) {
            setloaderState(false);
            // console.log("responseIn",response.status);
            router.push(
              `/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny`,
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (serviceId == 12) {
      console.log("modification of NewMr", finalBody);

      axios
        .post(
          `${urls.MR}/transaction/modOfMarCertificate/saveApplicationApprove`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            // setloaderState(false);
            router.push(
              `/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny`,
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (serviceId == 11) {
      console.log("reissue", finalBody1);
      alert("reissuance of marriage regstrion");
      axios
        .post(
          `${urls.MR}/transaction/reIssuanceM/saveApplicationApprove`,
          finalBody1,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              serviceId: 11,
            },
          },
        )
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            // setloaderState(false);
            router.push(
              `/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ReissuanceofMCertificate`,
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }

    setloaderState(false);
  };
  console.log("errors::::", errors);
  console.log("pratikshaKurkure2", getValues("gfName"));

  return (
    <>
      {loaderState ? (
        <Loader />
      ) : (
        // <div
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     height: "60vh", // Adjust itasper requirement.
        //   }}
        // >
        //   <Paper
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       background: "white",
        //       borderRadius: "50%",
        //       padding: 8,
        //     }}
        //     elevation={8}
        //   >
        //     <CircularProgress color="success" />
        //   </Paper>
        // </div>
        <>
          {/* <div className={styles.apprve} style={{ marginTop: "25px" }}></div>
          <Stack
            spacing={15}
            direction="row"
            style={{ display: "flex", justifyContent: "center" }}
          > */}
          {/* <Button
              variant="contained"
              endIcon={<NextPlanIcon />}
              color="success"
              onClick={() => {
                // alert(serviceId)
                setmodalforAprov(true);
              }}
            >
              <FormattedLabel id="actions" />
            </Button> */}

          <div className={styles.btnappr1}>
            {router.query.role == "LOI_GENERATION" || (
              <>
                <Button
                  variant="contained"
                  color="success"
                  // disabled={watch("remark") ? false : true}
                  endIcon={<ThumbUpIcon />}
                  onClick={async () => {
                    setTrnMode("APPROVE");
                    // remarks("APPROVE");
                    setmodalforAprov(true);
                  }}
                >
                  <FormattedLabel id="APPROVE" />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  // disabled={watch("remark") ? false : true}
                  endIcon={<UndoIcon />}
                  onClick={() => {
                    setTrnMode("REASSIGN");

                    // remarks("REASSIGN");
                    setmodalforAprov(true);
                  }}
                >
                  <FormattedLabel id="REASSIGN" />
                </Button>
              </>
            )}
            {router.query.role == "FINAL_APPROVAL" ||
            (router.query.role == "DOCUMENT_VERIFICATION" &&
              router.query.serviceId == 67) ? (
              <Button
                variant="contained"
                color="error"
                endIcon={<ReportIcon />}
                onClick={() => {
                  setTrnMode("REJECT");
                  // remarks("REJECT");
                  setmodalforAprov(true);
                }}
              >
                <FormattedLabel id="reject" />
              </Button>
            ) : (
              ""
            )}

            <Button
              variant="contained"
              endIcon={<CloseIcon />}
              color="error"
              onClick={() => {
                // alert(serviceId)
                setloaderState(true);
                if (serviceId == 10) {
                  router.push(
                    `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
                  );
                } else if (serviceId == 67) {
                  router.push(
                    `/marriageRegistration/transactions/boardRegistrations/scrutiny`,
                  );
                } else if (serviceId == 15) {
                  router.back();
                }
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </div>
          {/* </Stack> */}
          <form {...methods} onSubmit={handleSubmit("remarks")}>
            <div className={styles.model}>
              <Modal
                open={modalforAprov}
                //onClose={clerkApproved}
                onCancel={() => {
                  setmodalforAprov(false);
                }}
              >
                <div className={styles.boxRemark}>
                  <div className={styles.titlemodelremarkAprove}>
                    <Typography
                      className={styles.titleOne}
                      variant="h6"
                      component="h2"
                      color="#f7f8fa"
                      style={{ marginLeft: "25px" }}
                    >
                      <FormattedLabel id="remarkModel" />
                      {/* Enter Remark on application */}
                    </Typography>
                    <IconButton>
                      <CloseIcon onClick={() => setmodalforAprov(false)} />
                    </IconButton>
                  </div>

                  <div
                    className={styles.btndate}
                    style={{ marginLeft: "23vh" }}
                  >
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={4}
                      placeholder={
                        language == "en"
                          ? "Enter a Remarks"
                          : "एक टिप्पणी प्रविष्ट करा"
                      }
                      style={{ width: 700 }}
                      {...register("remark")}
                    />
                  </div>

                  <div className={styles.btnappr}>
                    <Button
                      variant="contained"
                      color="success"
                      // disabled={watch("remark") ? false : true}
                      endIcon={<ThumbUpIcon />}
                      onClick={async () => {
                        remarks(trnMode);
                      }}
                    >
                      {/* <FormattedLabel id="APPROVE" /> */}
                      <FormattedLabel id="save" />
                      {/* Save */}
                    </Button>

                    <Button
                      variant="contained"
                      endIcon={<CloseIcon />}
                      color="error"
                      onClick={() => {
                        setmodalforAprov(false);
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </form>
        </>
      )}
    </>
  );
};
export default Index;
