import {
  Box,
  Button,
  FormHelperText,
  Grid,
  Modal,
  Paper,
  TextField,
  FormControl,
  ThemeProvider,
  Typography,
} from "@mui/material";
import theme from "../../../../theme";
import { Add } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { FormProvider, useForm,Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import trnRtiAppealSchema from "../../../../containers/schema/rtiOnlineSystemSchema/trnRtiAppealSchema.js";
import saveAsDraftTrnRtiAppealSchema from "../../../../containers/schema/rtiOnlineSystemSchema/saveAsDraftTrnRtiAppealSchema";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls.js";
import Document from "../../Document/UploadButton";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil.js";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt/index.js";
const EntryForm = () => {
  const [isName, setSaveButtonName] = useState("");
  const handleSaveAsDraft = (name) => {
    setIsDraft(true);
    setSaveButtonName(name);
  };
  const {
    register,
    handleSubmit,
    methods,control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver:
      isName === "draft"
        ? yupResolver(saveAsDraftTrnRtiAppealSchema)
        : yupResolver(trnRtiAppealSchema),
    mode: "onChange",
  });
  const currDate = new Date();
  const language = useSelector((state) => state?.labels?.language);
  const router = useRouter();
  const [applicationId, setApplicationID] = useState(null);
  const [isBpl, setIsBpl] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [departments, setDepartments] = useState([]);
  const [loadFormData, setLoadFormData] = useState([]);
  const [isDraft, setIsDraft] = useState(false);
  let user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  let filePath = {};
  function temp(arg) {
    filePath = arg;
  }
  const [uploading, setUploading] = useState(false);
  const [label, setLabel] = useState("");
  const logedInUser = localStorage.getItem("loggedInUser");
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [attachedFile, setAttachedFile] = useState();
  const headers = { Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const handleClose = () => {
    setFetchDocuments([
      ...fetchDocument,
      {
        id:
          fetchDocument.length != 0
            ? fetchDocument[fetchDocument.length - 1].id + 1
            : 1,
        documentKey: null,
        documentPath: filePath.filePath,
        fileName: filePath.fileName.split("/").pop().split("_").pop(),
      },
    ]);
    setAttachedFile("");
    setUploading(false);
  };

  const deleteById = (value) => {
    sweetAlert({
      title: language === "en" ? "Delete?" : "हटवा?",
      text:
        language === "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((result) => {
      if (result) {
        setFetchDocuments(fetchDocument.filter((obj) => obj.id !== value));
        sweetAlert(
          language === "en"
            ? "File Deleted Successfully!"
            : "फाइल यशस्वीरित्या हटवली!",
          { icon: "success", button: language === "en" ? "Ok" : "ठीक आहे" }
        );
      }
    });
  };
  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        if (r?.data?.mimeType == "application/pdf") {
          const byteCharacters = atob(r?.data?.fileName);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const newTab = window.open();
          newTab.location.href = url;
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
              </body>
            </html>
          `);
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };
  const docColumns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fileName",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                //   "_blank"
                // );
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton color="primary" onClick={() => deleteById(record.id)}>
              <DeleteIcon style={{ color: "red", fontSize: 30 }} />
            </IconButton>
          </>
        );
      },
    },
  ];

  // load department
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get application by application no
  const searchApplication = () => {
    if (watch("rtiApplicationNo")) {
      setIsLoading(true);
      axios
        .get(
          `${
            urls.RTI
          }/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${watch(
            "rtiApplicationNo"
          ).trim()}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          // alert(res.data.pendingDays )
          if (
            (res.data.status != 11 && res.data.pendingDays > 0) ||
            res.data.status == 0 ||
            res.data.status === 2
          ) {
            sweetAlert(
              language === "en" ? "OOPS!" : "क्षमस्व!",
              language == "en"
                ? "RTI appeal not eligible for this RTI Application No.!"
                : "या आरटीआय अर्ज क्रमांकासाठी आरटीआय अपील पात्र नाही.!",
              "error",
              { button: language == "en" ? "Ok" : "ठीक आहे" }
            );
          } else {
            setValue("applicantFirstName", res.data?.applicantFirstName);
            setValue("applicantMiddleName", res.data?.applicantMiddleName);
            setValue("applicantLastName", res.data?.applicantLastName);
            setValue("applicantFirstNameMr", res.data?.applicantFirstNameMr);
            setValue("applicantMiddleNameMr", res.data?.applicantMiddleNameMr);
            setValue("applicantLastNameMr", res.data?.applicantLastNameMr);
            setValue("address", res.data?.address);
            setValue("addressMr", res.data?.addressMr);
            setValue("informationDescription", res.data?.description);
            setApplicationID(res.data.id);
            setIsBpl(res.data.isBpl);
            setValue(
              "concernedOfficeDetails",
              departments?.find((obj) => {
                return obj.id == res.data.departmentKey;
              })
                ? departments.find((obj) => {
                    return obj.id == res.data.departmentKey;
                  }).department
                : "-"
            );
            if (res.data.userDao) {
              if (res.data.status === 15) {
                setValue(
                  "officerDetails",
                  language === "en"
                    ? res.data?.userDao === null
                      ? ""
                      : res.data?.userDao?.firstNameEn +
                        " " +
                        res.data?.userDao?.middleNameEn +
                        " " +
                        res.data?.userDao?.lastNameEn
                    : res.data?.userDao?.firstNameMr +
                        res.data?.userDao?.middleNameMr +
                        res.data?.userDao?.lastNameMr
                );
              } else {
                setValue(
                  "officerDetails",
                  language === "en"
                    ? res.data?.userDao === null
                      ? ""
                      : res.data?.userDao?.firstNameEn +
                        " " +
                        res.data?.userDao?.middleNameEn +
                        " " +
                        res.data?.userDao?.lastNameEn
                    : res.data?.userDao?.firstNameMr +
                        " " +
                        res.data?.userDao?.middleNameMr +
                        " " +
                        res.data?.userDao?.lastNameMr
                );
              }
            }
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  useEffect(() => {
    if (applicationId != null && applicationId != undefined) {
      getRtiApplicationById();
    }
  }, [applicationId]);

  const getRtiApplicationById = () => {
    axios
      .get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationId}`, {
        headers: headers,
      })
      .then((res) => {
        setValue("rtiApplicationNo", res.data.applicationNo);
        setIsBpl(res.data?.isBpl);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const saveAsDraft = window.event.submitter.name === "draft";
    const dateOfOrderAgainstAppeal = moment(
      formData.dateOfOrderAgainstAppeal
    ).format("YYYY-MM-DD");

    const attachedDocuments = Array(10).fill(null);
    if (fetchDocument) {
      for (let i = 0; i < fetchDocument.length && i < 10; i++) {
        attachedDocuments[i] = fetchDocument[i].documentPath;
      }
    }
    const body = {
      ...loadFormData,
      ...formData,
      id: Number(router.query.id),
      applicationKey: applicationId,
      isBpl: isBpl,
      saveAsDraft: saveAsDraft,
      // dateOfOrderAgainstAppeal,
      activeFlag: "Y",
      attachedDocument1: attachedDocuments[0],
      attachedDocument2: attachedDocuments[1],
      attachedDocument3: attachedDocuments[2],
      attachedDocument4: attachedDocuments[3],
      attachedDocument5: attachedDocuments[4],
      attachedDocument6: attachedDocuments[5],
      attachedDocument7: attachedDocuments[6],
      attachedDocument8: attachedDocuments[7],
      attachedDocument9: attachedDocuments[8],
      attachedDocument10: attachedDocuments[9],
    };
    localStorage.setItem("draftFormData", JSON.stringify(body));
    const tempData = axios
      .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          saveAsDraft === true
            ? sweetAlert({
                title: language == "en" ? "Saved!" : "जतन केले",
                text:
                  language == "en"
                    ? "RTI Appeal Saved in draft Successfully !"
                    : "आरटीआय अपील मसुद्यात यशस्वीरित्या जतन झाला!",
                icon: "success",
                dangerMode: false,
                closeOnClickOutside: false,
                button: language == "en" ? "Ok" : "ठीक आहे",
              }).then((will) => {
                if (will) {
                  cancellButton();
                }
              })
            : afterSaveShowAlert(res);
        } else {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी",
            language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            "error",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const loadDraftData = () => {
    setIsLoading(true);
    const loadData = axios
      .get(`${urls.RTI}/trnRtiAppeal/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        setLoadFormData(res.data);
        setTempFormData(res.data);
        setApplicationID(res.data.applicationKey);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      loadDraftData();
  }, [router.query.id]);

  const setTempFormData = (_res) => {
    setValue("applicantFirstName", _res?.applicantFirstName);
    setValue("applicantMiddleName", _res?.applicantMiddleName);
    setValue("applicantLastName", _res?.applicantLastName);
    setValue("applicantFirstNameMr", _res?.applicantFirstNameMr);
    setValue("applicantMiddleNameMr", _res?.applicantMiddleNameMr);
    setValue("applicantLastNameMr", _res?.applicantLastNameMr);
    setValue("address", _res?.address);
    setValue("addressMr", _res?.addressMr);
    setValue("informationDescription", _res?.informationDescription);
    setValue("concernedOfficeDetails", _res?.concernedOfficeDetails);
    setValue("appealReason", _res?.appealReason);
    setValue("place", _res.place);
    setValue(
      "officerDetails",
      _res?.userDao?.firstNameEn +
        " " +
        _res?.userDao?.middleNameEn +
        " " +
        _res?.userDao?.lastNameEn
    );
    setIsBpl(_res?.isBpl);
    setApplicationID(_res?.id);

    const doc = [];
    // Loop through each attached document and add it to the `doc` array
    for (let i = 1; i <= 10; i++) {
      const attachedDocument = _res[`attachedDocument${i}`];
      if (attachedDocument != null) {
        doc.push({
          id: i,
          fileName: attachedDocument.split("/").pop().split("_").pop(),
          documentPath: attachedDocument,
          documentType: attachedDocument.split(".").pop().toUpperCase(),
        });
      }
    }
    setFetchDocuments([...doc]);
  };

  // manage save in one method
  const afterSaveShowAlert = (res) => {
    if (isBpl) {
      sweetAlert({
        title: language == "en" ? "Saved!" : "जतन केले!",
        text:
          language == "en"
            ? "RTI Appeal Saved Successfully !"
            : "आरटीआय अपील यशस्वीरित्या जतन झाले!",
        icon: "success",
        dangerMode: false,
        button: language == "en" ? "Ok" : "ठीक आहे",
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          sweetAlert({
            text:
              language == "en"
                ? ` Your Application Appeal No Is : ${
                    res.data.message.split("[")[1].split("]")[0]
                  }`
                : `तुमचा अपील अर्ज क्र: ${
                    res.data.message.split("[")[1].split("]")[0]
                  }`,
            icon: "success",
            buttons: [
              language == "en" ? "View Acknowledgement" : "पावती पहा",
              language == "en" ? "Go To Dashboard" : " सूचीवर जा",
            ],
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              {
                cancellButton();
              }
            } else {
              router.push({
                pathname:
                  "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                query: { id: res.data.message.split("[")[1].split("]")[0] },
              });
            }
          });
        }
      });
    } else {
      var a = res.data.message;
      router.push({
        pathname: "/RTIOnlineSystem/transactions/payment/PaymentCollection",
        query: {
          id: res.data.message.split("[")[1].split("]")[0],
          trnType: "apl",
        },
      });
    }
  };

  // cancel button
  const cancellButton = () => {
    logedInUser === "citizenUser"
      ? router.push("/dashboard")
      : logedInUser === "cfcUser"
      ? router.push("/CFC_Dashboard")
      : router.push("/RTIOnlineSystem/transactions/rtiAppeal/rtiAppealList");
  };



  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <BreadcrumbComponent />
        {isLoading && <CommonLoader />}
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            padding: 1,
          }}
        >
          <Box>
            <Grid container className={commonStyles.title}>
              <Grid item xs={1}>
                <IconButton
                  style={{
                    color: "white",
                  }}
                  onClick={() => {
                    router.back();
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs={10}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginRight: "2rem",
                  }}
                >
                  <FormattedLabel id="rtiAppeal" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          {/* <Divider /> */}
          <Box>
            <Box>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid
                    container
                    spacing={3}
                    style={{
                      padding: "2rem",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xl={10}
                      lg={10}
                      md={10}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        InputLabelProps={{ shrink: true }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="filled-error-helper-text"
                        label={<FormattedLabel id="applicationNo" />}
                        variant="standard"
                        {...register("rtiApplicationNo")}
                        error={!!errors.rtiApplicationNo}
                        // helperText={
                        //   language === "en"
                        //     ? "Note: RTI Application status should be completed or registered date before 30 days "
                        //     : "टीप: अँप्लिकेशन रेजिस्टर केलेली तारीख 30 दिवसांपूर्वीची असणे आवश्यक आहे किंवा अँप्लिकेशन स्थिती पूर्ण असावी "
                        // }
                        FormHelperTextProps={{
                          className: commonStyles.helperText,
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xl={2}
                      lg={2}
                      md={2}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        sx={{ marginTop: 2, marginLeft: "-10px" }}
                        variant="contained"
                        size="small"
                        color="primary"
                        endIcon={<SearchIcon />}
                        onClick={() => searchApplication()}
                      >
                        <FormattedLabel id="search" />
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantFirstName" />}
                        multiline
                        variant="standard"
                        {...register("applicantFirstName")}
                        error={!!errors.applicantFirstName}
                        helperText={
                          errors?.applicantFirstName
                            ? errors.applicantFirstName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantMiddleName" />}
                        multiline
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        variant="standard"
                        {...register("applicantMiddleName")}
                        error={!!errors.applicantMiddleName}
                        helperText={
                          errors?.applicantMiddleName
                            ? errors.applicantMiddleName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        label={<FormattedLabel id="applicantLastName" />}
                        multiline
                        variant="standard"
                        {...register("applicantLastName")}
                        error={!!errors.applicantLastName}
                        helperText={
                          errors?.applicantLastName
                            ? errors.applicantLastName.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantFirstNameMr" />}
                        multiline
                        variant="standard"
                        {...register("applicantFirstNameMr")}
                        error={!!errors.applicantFirstNameMr}
                        helperText={
                          errors?.applicantFirstNameMr
                            ? errors.applicantFirstNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantMiddleNameMr" />}
                        multiline
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        variant="standard"
                        {...register("applicantMiddleNameMr")}
                        error={!!errors.applicantMiddleNameMr}
                        helperText={
                          errors?.applicantMiddleNameMr
                            ? errors.applicantMiddleNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        label={<FormattedLabel id="applicantLastNameMr" />}
                        multiline
                        variant="standard"
                        {...register("applicantLastNameMr")}
                        error={!!errors.applicantLastNameMr}
                        helperText={
                          errors?.applicantLastNameMr
                            ? errors.applicantLastNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="address" />}
                        multiline
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        variant="standard"
                        {...register("address")}
                        error={!!errors.address}
                        helperText={
                          errors?.address ? errors.address.message : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="addressMr" />}
                        multiline
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        variant="standard"
                        {...register("addressMr")}
                        error={!!errors.addressMr}
                        helperText={
                          errors?.address ? errors.addressMr.message : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="descriptionOfInfo" />}
                        multiline
                        variant="standard"
                        {...register("informationDescription")}
                        error={!!errors.informationDescription}
                        helperText={
                          errors?.informationDescription
                            ? errors.informationDescription.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="descInfoOfOfficer" />}
                        multiline
                        variant="standard"
                        {...register("officerDetails")}
                        error={!!errors.officerDetails}
                        helperText={
                          errors?.officerDetails
                            ? errors.officerDetails.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={
                          <FormattedLabel id="concernOfficerDeptnmWhoseInfoRequired" />
                        }
                        multiline
                        variant="standard"
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        {...register("concernedOfficeDetails")}
                        error={!!errors.concernedOfficeDetails}
                        helperText={
                          errors?.concernedOfficeDetails
                            ? errors.concernedOfficeDetails.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        required={!isDraft}
                        InputLabelProps={{ shrink: true }}
                        label={<FormattedLabel id="reasonForAppeal" />}
                        multiline
                        variant="standard"
                        {...register("appealReason")}
                        error={!!errors.appealReason}
                        helperText={
                          errors?.appealReason
                            ? errors.appealReason.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                        <FormControl
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            minDate={watch("fromDate")}
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="date" required />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </FormControl>
                     
                    </Grid>
                    <Grid item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                >
                   <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        InputLabelProps={{ shrink: watch('place') }}
                        label={<FormattedLabel id="place" />}
                        multiline
                        variant="standard"
                        {...register("place")}
                        error={!!errors.place}
                        helperText={
                          errors?.place
                            ? errors.place.message
                            : null
                        }
                      />
                </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ width: "88%", marginTop: 5 }}>
                        <Grid
                          container
                          style={{
                            padding: "10px",
                            backgroundColor: "lightblue",
                          }}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid
                            item
                            xs={10}
                            sm={10}
                            md={10}
                            lg={10}
                            xl={10}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                marginLeft: { xs: "5%", md: "20%" },
                                textAlign: { xs: "center", md: "left" },
                              }}
                            >
                              <FormattedLabel id="uploadFile" />
                            </Typography>
                          </Grid>
                          <Grid item md={2} lg={2} xl={2}>
                            <Button
                              variant="contained"
                              endIcon={<Add />}
                              type="button"
                              color="primary"
                              onClick={handleOpen}
                              size="small"
                            >
                              {<FormattedLabel id="addDoc" />}
                            </Button>
                          </Grid>
                        </Grid>

                        <DataGrid
                          sx={{
                            overflowY: "scroll",
                            "& .MuiDataGrid-columnHeadersInner": {
                              backgroundColor: "#556CD6",
                              color: "white",
                            },

                            "& .MuiDataGrid-cell:hover": {
                              color: "primary.main",
                            },
                          }}
                          autoHeight
                          disableSelectionOnClick
                          rows={fetchDocument.filter(
                            (obj) => obj.activeFlag != "N"
                          )}
                          columns={docColumns}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                        />
                      </Box>
                    </Grid>

                    <Grid
                      container
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Grid item>
                        <Button
                          sx={{ margin: 1 }}
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="back" />
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          sx={{ margin: 1 }}
                          variant="contained"
                          color="primary"
                          type="submit"
                          size="small"
                          name="draft"
                          onClick={() => handleSaveAsDraft("draft")}
                        >
                          <FormattedLabel id="saveAsDraft" />
                        </Button>
                      </Grid>

                      {isBpl && (
                        <Grid>
                          <Button
                            sx={{ margin: 1 }}
                            type="submit"
                            variant="contained"
                            color="success"
                            size="small"
                            endIcon={<SaveIcon />}
                          >
                            <FormattedLabel id="save" />
                          </Button>
                        </Grid>
                      )}
                      {isBpl === false && (
                        <Grid>
                          <Button
                            sx={{ margin: 1 }}
                            type="submit"
                            variant="contained"
                            color="success"
                            size="small"
                            endIcon={<SaveIcon />}
                          >
                            <FormattedLabel id="saveAndPay" />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "15%",
        }}
      >
        <Box
          sx={{
            width: "50%",
            backgroundColor: "white",
            height: "40%",
            borderRadius: "10px",
          }}
        >
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.5%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bolder",
                  fontSize: "large",
                  textTransform: "capitalize",
                }}
              >
                <FormattedLabel id="fileUpload" />
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Document
                appName={"RTI"}
                serviceName={"RTI-Appeal"}
                fileName={attachedFile} //State to attach file
                filePath={temp}
                fileLabel={setLabel}
                handleClose={handleClose}
                uploading={setUploading}
                modalState={setOpen}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setOpen(false);
                }}
                size="small"
              >
                <FormattedLabel id="cancel" />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default EntryForm;
