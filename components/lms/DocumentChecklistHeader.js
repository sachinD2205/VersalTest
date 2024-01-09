//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import NewMembershipRegistration from "../../pages/lms/transactions/newMembershipRegistration/citizen/newMembershipRegistration";
// import BoardRegistration from '../../pages/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration'
import styles from "../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import theme from "../../theme";
import URLS from "../../URLS/urls";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import LmsHeader from "./lmsHeader";
const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.user.token);

  const language = useSelector((state) => state?.labels.language);
  const [document, setDocument] = useState([]);
  const [modalforAprov, setmodalforAprov] = useState(false);
  const [remark, setRemark] = useState(null);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  // const methods = useForm();
  let serviceId = Number(router.query.serviceId);
  console.log("serviceId", serviceId, typeof serviceId);

  // let serviceId = 67
  const [data, setData] = useState();
  const methods = useFormContext();
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    method,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    console.log("router?.query?", router?.query);
    if (router?.query) {
      // reset(router?.query)
      // setData(router?.query)
    }
  }, []);

  // viewForm
  const viewForm = (props) => {
    console.log("hsldjf", props);
    const ID = props;
    // if (serviceId === 10) {
    //   axios
    //     .get(
    //       `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${ID}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       },
    //     )
    //     .then((resp) => {
    //       console.log('sdljfslkdfjslkdjflskdjf', resp.data)
    //       reset(resp.data)
    //     })
    // } else if (serviceId === 67) {
    //   axios
    //     .get(
    //       `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${ID}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       },
    //     )
    //     .then((resp) => {
    //       if (resp.status == 200) {
    //         // setApplicationData(resp.data)
    //         reset(resp.data)
    //         console.log('sdljfslkdfjslkdjflskdjf', JSON.stringify(resp.data))
    //       }
    //     })
    // } else if (serviceId === 15) {
    //   axios
    //     .get(
    //       `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${ID}`,
    //       // localhost:8091/mr/api/transaction/modOfMarBoardCertificate/getModOfMarCertificateById?applicationId=3
    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       },
    //     )
    //     .then((resp) => {
    //       console.log('sdljfslkdfjslkdjflskdjf', resp.data)
    //       reset(resp.data)
    //       setData(resp.data)
    //     })
    // } else if (serviceId === 12) {
    //   axios
    //     .get(
    //       `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${ID}`,

    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       },
    //     )
    //     .then((resp) => {
    //       console.log('MODOFCER', resp.data)
    //       reset(resp.data)
    //       setData(resp.data)
    //     })
    // }
    formPreviewDailogOpen();
  };

  useEffect(() => {
    //DocumentsList
    if (Number(router?.query?.id) != null) {
      // reset(router.query);
      axios
        .get(`${URLS.CFCURL}/master/documentMaster/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setDocument(
            res.data.documentMaster.map((j, i) => ({
              id: j.id,
              documentNameEn: j.documentChecklistEn,
              documentNameMr: j.documentChecklistMr,
            }))
          );
        });
    }
  }, []);

  useEffect(() => {
    setValue(
      "serviceName",
      language === "en"
        ? router?.query?.serviceName
        : router?.query?.serviceNameMr
    );
    setValue(
      "applicantName",
      language === "en"
        ? router?.query?.applicantName
        : router?.query?.applicantNameMr
    );
  }, [language]);

  useEffect(() => {
    console.log("router?.query?", router?.query);
    if (router?.query) {
      setData(router?.query);
      reset(router?.query);
      setValue(
        "applicationDate",
        moment(router?.query?.applicationDate).format("DD-MM-YYYY")
      );
    }
  }, []);

  useEffect(() => {
    const ID = router.query?.id;

    console.log("router?.query?", router?.query);
    if (ID) {
      setValue("applicationNumber", Number(ID));
      axios
        .get(`${urls.LMSURL}/trnApplyForNewMembership/getById?id=${ID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          console.log("MODOFCER", resp.data);
          // setValue("applicationNumber", ID)
          reset(resp.data);
          // setValue("applicationNumber", ID)

          setData(resp.data);
          setValue(
            "applicationDate",
            moment(resp.data.applicationDate).format("DD-MM-YYYY")
          );
        });
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <form /* onSubmit={handleSubmit(onFinish)} */>
          <div className={styles.small}>
            {/* <div className={styles.detailsApot}>
              <div className={styles.h1TagApot}>
                <h1
                  style={{
                    color: 'white',
                    marginTop: '1px',
                  }}
                >
                  {language === 'en'
                    ? router?.query?.pageHeader
                    : router?.query?.pageHeaderMr}
                </h1>
              </div>
            </div> */}
            <LmsHeader
              language={language}
              enName={router?.query?.pageHeader}
              mrName={router?.query?.pageHeaderMr}
              showBackBtn={false}
            />
            <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: "white",
                    marginTop: "6px",
                  }}
                >
                  {language === "en" ? "Applicant details" : "अर्जदार तपशील"}
                </h3>
              </div>
            </div>

            <div className={styles.row2}>
              <div>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  // label="Service Name"
                  sx={{ width: 280 }}
                  label={<FormattedLabel id="serviceName" />}
                  variant="standard"
                  {...register("serviceName")}
                  error={!!errors.serviceName}
                  helperText={
                    errors?.serviceName ? errors.serviceName.message : null
                  }
                />
              </div>

              <div>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  // label="Applicant Name"
                  sx={{ width: 280 }}
                  label={<FormattedLabel id="applicantName" />}
                  variant="standard"
                  {...register("applicantName")}
                  error={!!errors.applicantName}
                  helperText={
                    errors?.applicantName ? errors.applicantName.message : null
                  }
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  label={<FormattedLabel id="applicationNo" />}
                  // label="Application No"
                  sx={{ width: 280 }}
                  variant="standard"
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  defaultValue=""
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
                  }
                />
              </div>

              <div>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  label={<FormattedLabel id="applicationDate" />}
                  // label="Application Date"
                  sx={{ width: 280 }}
                  variant="standard"
                  {...register("applicationDate")}
                  error={!!errors.applicationDate}
                  helperText={
                    errors?.applicationDate
                      ? errors.applicationDate.message
                      : null
                  }
                />
              </div>
            </div>

            <div className={styles.row2}>
              <Button
                variant="contained"
                endIcon={<VisibilityIcon />}
                size="small"
                onClick={() => {
                  const id = router.query.id;
                  console.log("sddlfkjslkfdjsdlkf", router.query.id);
                  viewForm(id);
                }}
              >
                {language === "en" ? "View Form" : "अर्ज पहा"}
              </Button>
            </div>
          </div>
        </form>

        {/** Form Preview Dailog */}

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
            {serviceId === 85 ? (
              <>
                <NewMembershipRegistration
                  id={router?.query?.id}
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                />
              </>
            ) : (
              ""
            )}
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
              <Button
                size="small"
                onClick={() => {
                  swal({
                    title: "Exit?",
                    text: "Are you sure you want to exit this Record ? ",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      swal("Record is Successfully Exit!", {
                        icon: "success",
                      });
                      formPreviewDailogClose();
                    } else {
                      swal("Record is Safe");
                    }
                  });
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default Index;
