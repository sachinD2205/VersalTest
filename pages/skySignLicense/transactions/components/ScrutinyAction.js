//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import CloseIcon from "@mui/icons-material/Close";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Button,
  IconButton,
  Modal,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
// import styles from "../../styles/skysignstyles/scrutinyAction.module.css";
// import styles from "../../../../styles/skysignstyles/scrutinyAction.module.css";
import styles from "../../../../styles/skysignstyles/issuanceOfBusinessScrutinyAction.module.css";
import urls from "../../../../URLS/urls";

const Index = (propss) => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const [modalforAprov, setmodalforAprov] = useState(false);
  const [remark, setRemark] = useState(null);
  const language = useSelector((state) => state?.labels?.language);

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  //aprovel
  const remarks = async (props) => {
    console.log("ha aala", watch("trnSiteVisitFormDao"));
    const finalBody = {
      id: Number(router?.query?.id),
      approveRemark: props == "APPROVE" ? remark : null,
      rejectRemark: props == "REASSIGN" ? remark : null,
      role: router.query.role,
      userId: user.id,
      trnSiteVisitFormDao: watch("trnSiteVisitFormDao"),
      // ...photoAndThumb,
    };

    if (router?.query?.serviceId == 8) {
      propss?.loading(true);
      await axios
        .post(
          // `http://localhost:8091/mr/api/transaction/applicant/saveApplicationApprove`,
          `${urls.SSLM}/trnIssuanceOfIndustrialLicense/saveApprove`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => {
          propss?.loading(false);
          if (response.status === 200 || response.status === 201) {
            // swal("Saved!", "Record Saved successfully !", "success")
            // router.push(`/skySignLicense/dashboards`);

            sweetAlert({
              title: language === "en" ? "Saved " : "जतन केले",
              text:
                language === "en"
                  ? "Record saved successfully"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                router.push(`/skySignLicense/dashboards`);
              }
            });
          }
        })
        .catch((err) => {
          propss?.loading(false);
          sweetAlert({
            title: language === "en" ? "Error !! " : "त्रुटी !!",
            text:
              language === "en"
                ? "Somethings Wrong !! Record not Saved!"
                : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              router.push(`/skySignLicense/dashboards`);
            }
          });
        });
    } else if (router?.query?.serviceId == 9) {
      propss?.loading(true);
      await axios
        .post(
          // `http://localhost:8091/mr/api/transaction/applicant/saveApplicationApprove`,
          `${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/saveApprove`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => {
          propss?.loading(false);
          if (response.status === 200 || response.status === 201) {
            // swal("Saved!", "Record Saved successfully !", "success")
            // router.push(`/skySignLicense/dashboards`);
            sweetAlert({
              title: language === "en" ? "Saved " : "जतन केले",
              text:
                language === "en"
                  ? "Record saved successfully"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                router.push(`/skySignLicense/dashboards`);
              }
            });
          }
        })
        .catch((err) => {
          propss?.loading(false);
          sweetAlert({
            title: language === "en" ? "Error !! " : "त्रुटी !!",
            text:
              language === "en"
                ? "Somethings Wrong !! Record not Saved!"
                : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        });
    } else {
      propss?.loading(true);
      await axios
        .post(
          // `http://localhost:8091/mr/api/transaction/applicant/saveApplicationApprove`,
          `${urls.SSLM}/trnIssuanceOfBusinessLicense/saveApprove`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        .then((response) => {
          propss?.loading(false);
          if (response.status === 200 || response.status === 201) {
            // swal("Saved!", "Record Saved successfully !", "success")
            // router.push(`/skySignLicense/dashboards`);
            sweetAlert({
              title: language === "en" ? "Saved " : "जतन केले",
              text:
                language === "en"
                  ? "Record saved successfully"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
              dangerMode: false,
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                router.push(`/skySignLicense/dashboards`);
              }
            });
          }
        })
        .catch((err) => {
          propss?.loading(false);
          sweetAlert({
            title: language === "en" ? "Error !! " : "त्रुटी !!",
            text:
              language === "en"
                ? "Somethings Wrong !! Record not Saved!"
                : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!",
            icon: "error",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        });
    }
  };

  return (
    <>
      <div className={styles.apprve} style={{ marginTop: "25px" }}></div>

      <Stack
        spacing={15}
        direction="row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          endIcon={<NextPlanIcon />}
          color="success"
          onClick={() => {
            setmodalforAprov(true);
          }}
        >
          Action
        </Button>

        <Button
          variant="contained"
          endIcon={<CloseIcon />}
          color="error"
          onClick={() => {
            router.push(`/skySignLicense/dashboards`);
          }}
        >
          exit
        </Button>
      </Stack>
      <form onSubmit={handleSubmit("remarks")}>
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
                  Enter Remark on application
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={() => router.push(`/skySignLicense/dashboards`)}
                  />
                </IconButton>
              </div>

              <div className={styles.btndate} style={{ marginLeft: "200px" }}>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={4}
                  placeholder="Enter a Remarks"
                  style={{ width: 700 }}
                  onChange={(e) => {
                    setRemark(e.target.value);
                  }}
                />
              </div>

              <div className={styles.btnappr}>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ThumbUpIcon />}
                  onClick={async () => {
                    remarks("APPROVE");
                    // setBtnSaveText('APPROVED')
                    // router.push(`/skySignLicense/dashboards`);
                  }}
                >
                  approve
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<UndoIcon />}
                  onClick={() => {
                    // alert('tu karnar ressign ')
                    // setBtnSaveText('REASSIGN')
                    remarks("REASSIGN");
                    // router.push(`/skySignLicense/dashboards`);
                  }}
                >
                  reassign
                </Button>

                <Button
                  variant="contained"
                  endIcon={<CloseIcon />}
                  color="error"
                  onClick={() => router.push(`/skySignLicense/dashboards`)}
                >
                  Exit
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </form>
    </>
  );
};
export default Index;
