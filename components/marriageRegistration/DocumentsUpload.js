import { DeleteRounded } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import theme from "../../theme";
import styles from "../marriageRegistration/documentUpload.module.css";
import UploadButton from "./DocumentsUploadOP";
import FileTable from "./FileTable";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";
const DocumentsUpload = (props) => {
  const methods = useFormContext();
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = methods;
  const [disabled, setDisabled] = useState(false);

  let appName = "MR",
    serviceName = "M-NMR";
  const [document, setDocument] = useState([]);
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [pageMode, setPageMode] = useState(null);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  let user = useSelector((state) => state.user.user);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(true);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  // const [finalFiles, setFinalFiles] = useState([]);
  const [viewOnly, setViewOnly] = useState(false);
  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);
  //document encryption
  //groom

  const [encryptedGageProofDocument, setEncryptedGageProofDocument] =
    useState();
  const [
    encryptedGresidentialProofDocument,
    setEncryptedGresidentialProofDocument,
  ] = useState();
  const [encryptedGidDocument, setEncryptedGidDocument] = useState();

  //bride
  const [encryptedBageProofDocument, setEncryptedBageProofDocument] =
    useState();
  const [encryptedBresidentialDocument, setEncryptedBresidentialDocument] =
    useState();
  const [encryptedBidDocument, setEncryptedBidDocument] = useState();

  //prist

  const [encryptedPresidentialDocument, setEncryptedPresidentialDocument] =
    useState();

  //wintness
  const [encryptedWfResidentialDocument, setEncryptedWfResidentialDocument] =
    useState();
  const [encryptedWsResidentialDocument, setEncryptedWsResidentialDocument] =
    useState();
  const [encryptedWtResidentialDocument, setEncryptedWtResidentialDocument] =
    useState();

  //other document
  const [UinvitationCardPath, setEncryptedUinvitationCardPath] = useState();
  const [
    encryptedUmarrigePhotoCouplePath,
    setEncryptedUmarrigePhotoCouplePath,
  ] = useState();

  const [encryptedUgdisabled, setEncryptedUgdisabled] = useState();

  const [encryptedUbdisabled, setEncryptedUbdisabled] = useState();

  const [encryptedGudivorcePaperPath, setEncryptedGudivorcePaperPath] =
    useState();

  const [encryptedBudivorcePaperPath, setEncryptedBudivorcePaperPath] =
    useState();

  const [encryptedGudeathcerPath, setEncryptedGudeathcerPath] = useState();
  const [encryptedBudeathcerPath, setEncryptedBudeathcerPath] = useState();

  const [encryptedNikahnamaofLawpath, setEncryptedNikahnamaofLawpath] =
    useState();
  const [encryptedUcertiReligiousPath, setEncryptedUcertiReligiousPath] =
    useState();
  const [loading, setLoading] = useState(false);
  // let pageMode = null

  // const user = useSelector((state) => state?.user);
  // useEffect(()=>{
  //    console.log("bhava0000",router?.query?.pageMode);
  // },[router?.query?.pageMode])

  // useEffect(() => {
  //   if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
  //     setPageMode(null);
  //     console.log("enabled", router.query.pageMode);
  //   } else {
  //     setPageMode(router.query.pageMode);
  //     console.log("disabled", router.query.pageMode);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
  //     setDisabled(false);
  //     console.log("enabled");
  //   } else {
  //     setDisabled(true);
  //     console.log("disabled");
  //   }
  // }, []);

  const viewFile = (filePath) => {
    // alert("aaaya");
    console.log("filePath", filePath);

    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);

    const newFilePath = DecryptPhoto?.split(".").pop().toLowerCase();

    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

    if (newFilePath === "pdf") {
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          console.log(r?.data, "doccheck32423");
          setLoading(false);
          // if (response && response.data instanceof ArrayBuffer) {
          //   const pdfBlob = new Blob([response.data], {
          //     type: "application/pdf",
          //   });
          //   const pdfUrl = URL.createObjectURL(pdfBlob);

          //   const newTab = window.open();
          //   newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
          // } else {
          //   console.error("Invalid or missing data in the response");
          // }

          // New
          if (
            r?.data?.mimeType == "application/xlxs" ||
            r?.data?.mimeType == "text/csv" ||
            r?.data?.mimeType ==
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            const excelBase64 = r?.data?.fileName;

            const data = base64ToArrayBuffer(excelBase64);

            const excelBlob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(excelBlob, "FileName.xlsx");
          } else {
            // alert("pdf elsesss");
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
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (newFilePath === "csv") {
      // alert("CSV");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          console.log("Excel API Response:", response);
          console.log("Excel API Response Data:", response.data.fileName);

          const excelBase64 = response.data.fileName;

          const data = base64ToArrayBuffer(excelBase64);

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(excelBlob, "NewDoc.csv");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (newFilePath === "xlsx") {
      // alert("xlsx");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          console.log("Excel API Response:", response);
          console.log("Excel API Response Data:", response.data.fileName);

          const excelBase64 = response.data.fileName;

          const data = base64ToArrayBuffer(excelBase64);

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(excelBlob, "Spreadsheetml.xlsx");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else {
      // alert("else");
      setLoading(true);
      const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          // alert("then");
          setLoading(false);
          console.log(
            "ImageApi21312",
            `data:image/png;base64,${r?.data?.fileName}`,
          );
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          // alert("imageUrl");
          const newTab = window.open();
          // alert("window");
          // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
          newTab.document.body.innerHTML = `<img src="${imageUrl}"/>`;
        })
        .catch((error) => {
          // alert("error");
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  // ------------------------------------------------------------------------
  // Delete
  const discard = async (props) => {
    const discardDecryptPhoto = DecryptData(
      "passphraseaaaaaaaaupload",
      props?.filePath,
    );
    const discardFilePath = EncryptData(
      "passphraseaaaaaaadiscard",
      discardDecryptPhoto,
    );

    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${discardFilePath}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((res) => {
            if (res.status == 200) {
              let tempa = additionalFiles.filter(
                (obj) => obj.filePath !== props?.filePath,
              );
              setAdditionalFiles(tempa);
              swal(
                language == "en" ? "Deleted!" : "हटवले!",
                language == "en"
                  ? "Record Deleted successfully !"
                  : "रेकॉर्ड यशस्वीरित्या हटवले!",

                "success",
              );
            }
          })
          .catch((err) => {
            console.log("err", err);
            // callCatchMethod(err, language);
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  const _columns = [
    // {
    //   headerName: "Sr.No",
    //   field: "srNo",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "fileName",
      // File: "originalFileName",
      minWidth: 400,
      // flex: 0.7,
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      minWidth: 200,
    },
    // {
    //   headerName: <FormattedLabel id="uploadedBy" />,
    //   field: "uploadedBy",
    //   flex: 1,
    //   // width: 300,
    // },
    {
      field: "Action",
      headerName: <FormattedLabel id="action" />,
      minWidth: 300,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                viewFile(record.row.filePath);
                //   const ciphertext = EncryptData(
                //     "passphraseaaaaaaapreview",
                //     record.row.filePath,
                //   );

                //   // const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
                //   window.open(
                //     `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`,
                //     "_blank",
                //   );
              }}
            >
              <VisibilityIcon />
            </IconButton>

            {/** deleteButton */}
            {!viewOnly && (
              <IconButton color="error" onClick={() => discard(record.row)}>
                <DeleteRounded />
              </IconButton>
            )}
            {/* {!viewOnly ? (
              <IconButton
                color="primary"
                onClick={() => {
                  axios
                    .delete(
                      `${urls.CFCURL}/file/discard?filePath=${record.row.filePath}`,
                    )
                    .then((res) => {
                      // console.log("finallllll", finalFiles);
                      let tempa = additionalFiles.filter(
                        (obj) => obj.filePath !== record.row.filePath,
                      );
                      setAdditionalFiles(tempa);
                      swal(
                        language == "en" ? "Deleted!" : "हटवले!",
                        language == "en"
                          ? "Record Deleted successfully !"
                          : "रेकॉर्ड यशस्वीरित्या हटवले!",

                        "success",
                      );
                    })
                    .catch((err) => {
                      console.log("error::", err);
                      swal("Error!", "Record Not Deleted !", "error");
                    });
                }}
              >
                <DeleteRounded />
              </IconButton>
            ) : (
              ""
            )} */}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    // console.log("attachmentsbefore::", watch("attachments"));
    if (router.query.pageMode == "Add" || router.query.pageMode == "Edit") {
      setValue("attachments", [...mainFiles, ...additionalFiles]);
    }
    //  else {
    //   setValue("attachments", watch("attachments"));
    // }
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("router.query", router.query);
    console.log("all values::", getValues());
    console.log("attachments::", watch("attachments"));

    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setAuthorizedToUpload(true);
      setViewOnly(false);
      setPageMode(null);
      console.log("enabled", router.query.pageMode);
      setDisabled(false);
      console.log("enabled");
    } else {
      setAuthorizedToUpload(false);
      setViewOnly(true);
      setPageMode(router.query.pageMode);
      console.log("disabled", router.query.pageMode);
      setDisabled(true);
      console.log("disabled");
    }

    // if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
    //   setDisabled(false);
    //   console.log("enabled");
    // } else {
    //   setDisabled(true);
    //   console.log("disabled");
    // }

    axios
      .get(
        `${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId?serviceId=10`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setDocument(r.data.serviceWiseChecklist);
      });
  }, []);

  // viewForm
  const viewForm = (props) => {
    console.log("hsldjf", props);
    const ID = props;
    {
      if (serviceId == 10) {
        axios
          .get(
            `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${ID}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((resp) => {
            console.log("formdata", resp.data);
            reset(resp.data);
          });
      }
    }

    formPreviewDailogOpen();
  };
  // useEffect(() => {
  //   // if(watch(""))
  //   clearErrors("ubdisabled");
  // }, [watch("bdisabled")]);

  // useEffect(() => {
  //   if(watch("gdisabled")==null || watch("gdisabled")==false){
  //     clearErrors("ugdisabled");
  //   }
  // }, [watch("gdisabled")]);

  useEffect(() => {
    //groom detials
    if (
      watch("gageProofDocument") != null ||
      watch("gageProofDocument") != undefined
    ) {
      watch("gageProofDocument");
      clearErrors("gageProofDocument");
    }
    if (
      watch("gresidentialProofDocument") != null ||
      watch("gresidentialProofDocument") != undefined
    ) {
      watch("gresidentialProofDocument");
      clearErrors("gresidentialProofDocument");
    }
    if (watch("gidDocument") != null || watch("gidDocument") != undefined) {
      watch("gidDocument");
      clearErrors("gidDocument");
    }

    // //watch
    // watch("gageProofDocument");
    // watch("gresidentialProofDocument");
    // watch("gidDocument");
    //bride details
    if (
      watch("bageProofDocument") != null ||
      watch("bageProofDocument") != undefined
    ) {
      watch("bageProofDocument");
      clearErrors("bageProofDocument");
    }
    if (
      watch("bresidentialDocument") != null ||
      watch("bresidentialDocument") != undefined
    ) {
      watch("bresidentialDocument");
      clearErrors("bresidentialDocument");
    }
    if (watch("bidDocument") != null || watch("bidDocument") != undefined) {
      watch("bidDocument");
      clearErrors("bidDocument");
    }

    // //watch
    // watch("bageProofDocument");
    // watch("bresidentialDocument");
    // watch("bidDocument");

    //prist details

    if (
      watch("presidentialDocument") != null ||
      watch("presidentialDocument") != undefined
    ) {
      watch("presidentialDocument");
      clearErrors("presidentialDocument");
    }
    //watch
    watch("presidentialDocument");

    //witness details
    if (
      watch("wfResidentialDocument") != null ||
      watch("wfResidentialDocument") != undefined
    ) {
      watch("wfResidentialDocument");
      clearErrors("wfResidentialDocument");
    }
    if (
      watch("wsResidentialDocument") != null ||
      watch("wsResidentialDocument") != undefined
    ) {
      watch("wsResidentialDocument");
      clearErrors("wsResidentialDocument");
    }
    if (
      watch("wtResidentialDocument") != null ||
      watch("wtResidentialDocument") != undefined
    ) {
      watch("wtResidentialDocument");
      clearErrors("wtResidentialDocument");
    }

    // //watch
    // watch("wfResidentialDocument");
    // watch("wsResidentialDocument");
    // watch("wtResidentialDocument");

    //marriage related document

    if (
      watch("uinvitationCardPath") != null ||
      watch("uinvitationCardPath") != undefined
    ) {
      watch("uinvitationCardPath");
      clearErrors("uinvitationCardPath");
    }
    if (
      watch("umarrigePhotoCouplePath") != null ||
      watch("umarrigePhotoCouplePath") != undefined
    ) {
      watch("umarrigePhotoCouplePath");
      clearErrors("umarrigePhotoCouplePath");
    }

    if (watch("ugdisabled") != null || watch("ugdisabled") != undefined) {
      watch("ugdisabled");
      clearErrors("ugdisabled");
    }

    if (watch("ubdisabled") != null || watch("ubdisabled") != undefined) {
      watch("ubdisabled");
      clearErrors("ubdisabled");
    }

    // other details

    //divorcePaper
    if (
      watch("gudivorcePaperPath") != null ||
      watch("gudivorcePaperPath") != undefined
    ) {
      watch("gudivorcePaperPath");
      clearErrors("gudivorcePaperPath");
    }
    if (
      watch("budivorcePaperPath") != null ||
      watch("budivorcePaperPath") != undefined
    ) {
      watch("budivorcePaperPath");
      clearErrors("budivorcePaperPath");
    }

    //widow

    if (
      watch("gudeathcerPath") != null ||
      watch("gudeathcerPath") != undefined
    ) {
      watch("gudeathcerPath");
      clearErrors("gudeathcerPath");
    }
    if (
      watch("budeathcerPath") != null ||
      watch("budeathcerPath") != undefined
    ) {
      watch("budeathcerPath");
      clearErrors("budeathcerPath");
    }
    //law of marriage of muslim
    if (
      watch("nikahnamaofLawpath") != null ||
      watch("nikahnamaofLawpath") != undefined
    ) {
      watch("nikahnamaofLawpath");
      clearErrors("nikahnamaofLawpath");
    }

    //other
    if (
      watch("ucertiReligiousPath") != null ||
      watch("ucertiReligiousPath") != undefined
    ) {
      watch("ucertiReligiousPath");
      clearErrors("ucertiReligiousPath");
    }
  }, [
    //groom
    watch("gageProofDocument"),
    watch("gresidentialProofDocument"),
    watch("gidDocument"),
    //bride
    watch("bageProofDocument"),
    watch("bresidentialDocument"),
    watch("bidDocument"),
    //prist
    watch("presidentialDocument"),
    //wintness
    watch("wfResidentialDocument"),
    watch("wsResidentialDocument"),
    watch("wtResidentialDocument"),
    //other document
    watch("uinvitationCardPath"),
    watch("umarrigePhotoCouplePath"),
    watch("ugdisabled"),
    watch("ubdisabled"),
    watch("gudivorcePaperPath"),
    watch("budivorcePaperPath"),
    watch("gudeathcerPath"),
    watch("budeathcerPath"),
    watch("nikahnamaofLawpath"),
    watch("ucertiReligiousPath"),
  ]);
  console.log("ddddddd", errors, watch("gdisabled"));
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className={styles.small}>
          {/* <h4
            className={styles.blink}
            style={{
              marginLeft: "40px",
              color: "red",
              fontStyle: "italic",
              marginTop: "25px",
            }}
          >
            <Blink
              // style={{
              //   color: "red",
              //   fontSize: "15px",
              //   fontStyle: "normal",
              //   textTransform: "none",
              // }}
              className={styles.blink}
              text={<FormattedLabel id="onlyMHR" />}
              fontSize="15px"
            >
              {<FormattedLabel id="onlyMHR" />}
            </Blink>
          </h4> */}

          <h4
            style={{
              marginLeft: "40px",
              color: "red",
              fontStyle: "italic",
              // marginTop: "25px",
            }}
          >
            <p>
              <blink className={styles.blink}>
                {<FormattedLabel id="onlyMHR" />}
              </blink>
            </p>
          </h4>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {" "}
                {<FormattedLabel id="documentsUpload" />}
              </h3>

              <h5
                style={{
                  color: "white",
                  marginTop: "10px",
                  marginLeft: "5px",
                }}
              >
                <b>{<FormattedLabel id="docFormat" />}</b>
              </h5>
            </div>
          </div>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "6px",
                }}
              >
                {<FormattedLabel id="groomDetail" />}
              </h3>
            </div>
          </div>

          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {" "}
                {<FormattedLabel id="DBProof" required />}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.gageProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                  {/* Birth Proof Document */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          // setGAgeProofDocumentKey(value.target.value),
                          console.log(
                            "OnChangeqqqw",
                            document.find((r) => r.id === value.target.value)
                              .documentChecklistMr,
                          );
                      }}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gageProofDocumentKey
                    ? errors.gageProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.gageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("gageProofDocument")}
                fileKey={"gageProofDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedGageProofDocument(path);
                }}
              />
              <FormHelperText error={!!errors?.gageProofDocument}>
                {errors?.gageProofDocument
                  ? errors?.gageProofDocument?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {" "}
                {<FormattedLabel id="ResProof" required />}{" "}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.gresidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gresidentialDocumentKey.gresidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gresidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gresidentialDocumentKey
                    ? errors.gresidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.gresidentialProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("gresidentialProofDocument")}
                fileKey={"gresidentialProofDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedGresidentialProofDocument(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.gresidentialProofDocument}>
                {errors?.gresidentialProofDocument
                  ? errors?.gresidentialProofDocument?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>

          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {" "}
                {<FormattedLabel id="IdProof" required />}{" "}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.gidProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="IdDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 3)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gidProofDocumentKey.gidProofDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gidProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gidProofDocumentKey
                    ? errors.gidProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.gidDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("gidDocument")}
                fileKey={"gidDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedGidDocument(path);
                }}

                // showDel={true}
              />
              <FormHelperText error={!!errors?.gidDocument}>
                {errors?.gidDocument ? errors?.gidDocument?.message : null}
              </FormHelperText>
            </Grid>
          </div>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="brideDetails" />}
              </h3>
            </div>
          </div>

          <h4
            style={{
              marginLeft: "40px",
              color: "red",
              fontStyle: "italic",
              marginTop: "25px",
            }}
          >
            {/* {<FormattedLabel id="docNote" />} */}
          </h4>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {" "}
                {<FormattedLabel id="DBProof" required />}{" "}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.bageProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                  {/* Birth Proof Document */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {bageProofDocumentKey.bageProofDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="bageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bageProofDocumentKey
                    ? errors.bageProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.bageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("bageProofDocument")}
                fileKey={"bageProofDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedBageProofDocument(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.bageProofDocument}>
                {errors?.bageProofDocument
                  ? errors?.bageProofDocument?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {" "}
                {<FormattedLabel id="ResProof" required />}{" "}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.bresidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 41)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {bresidentialDocumentKey.bresidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="bresidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bresidentialDocumentKey
                    ? errors.bresidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.bresidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("bresidentialDocument")}
                fileKey={"bresidentialDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedBresidentialDocument(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.bresidentialDocument}>
                {errors?.bresidentialDocument
                  ? errors?.bresidentialDocument?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {<FormattedLabel id="IdProof" required />}{" "}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.bidProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="IdDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="ID Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 3)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gIdDocumentKey.gIdDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="bidProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bidProofDocumentKey
                    ? errors.bidProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.bidDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("bidDocument")}
                fileKey={"bidDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedBidDocument(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.bidDocument}>
                {errors?.bidDocument ? errors?.bidDocument?.message : null}
              </FormHelperText>
            </Grid>
          </div>

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="priestDetails" />}
              </h3>
            </div>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography> {<FormattedLabel id="ResProof" />} </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.presidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {presidentialDocumentKey.presidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="presidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.presidentialDocumentKey
                    ? errors.presidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.presidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("presidentialDocument")}
                fileKey={"presidentialDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedPresidentialDocument(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.presidentialDocument}>
                {errors?.presidentialDocument
                  ? errors?.presidentialDocument?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>
          {/* witness */}
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="witnessDetails" />}
              </h3>
            </div>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {<FormattedLabel id="ResProofW1" required />}(
                {" " +
                  watch("witnesses.[0].witnessFName") +
                  " " +
                  watch("witnesses.[0].witnessMName") +
                  " " +
                  watch("witnesses.[0].witnessLName")}
                )
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wfResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (
                              documentKey.documentType === 40 &&
                              documentKey.id != 210
                            )
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                              {/* {wfResidentialDocumentKey.wfResidentialDocumentKey} */}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wfResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wfResidentialDocumentKey
                    ? errors.wfResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.wfResidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wfResidentialDocument")}
                fileKey={"wfResidentialDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedWfResidentialDocument(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.wfResidentialDocument}>
                {errors?.wfResidentialDocument
                  ? errors?.wfResidentialDocument?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {<FormattedLabel id="ResProofW2" required />} (
                {" " +
                  watch("witnesses.[1].witnessFName") +
                  " " +
                  watch("witnesses.[1].witnessMName") +
                  " " +
                  watch("witnesses.[1].witnessLName")}
                )
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wsResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      //label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 40)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {wsResidentialDocumentKey.wsResidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wsResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wsResidentialDocumentKey
                    ? errors.wsResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.wsResidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wsResidentialDocument")}
                fileKey={"wsResidentialDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedWsResidentialDocument(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.wsResidentialDocument}>
                {errors?.wsResidentialDocument
                  ? errors?.wsResidentialDocument?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {<FormattedLabel id="ResProofW3" required />} (
                {" " +
                  watch("witnesses.[2].witnessFName") +
                  " " +
                  watch("witnesses.[2].witnessMName") +
                  " " +
                  watch("witnesses.[2].witnessLName")}
                )
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wtResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 40)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {wtResidentialDocumentKey.wtResidentialDocumentKey} */}
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wtResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wtResidentialDocumentKey
                    ? errors.wtResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.wtResidentialDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wtResidentialDocument")}
                fileKey={"wtResidentialDocument"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedWtResidentialDocument(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.wtResidentialDocument}>
                {errors?.wtResidentialDocument
                  ? errors?.wtResidentialDocument?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="marrigeRelatedDoc" />}
              </h3>
            </div>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {<FormattedLabel id="invetaionCard" required />}{" "}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              {/* <TextField
                disabled={disabled}
                InputLabelProps={{
                  shrink:
                    (watch("uinvitationCard") ? true : false) ||
                    (router.query.uinvitationCard ? true : false),
                }}
                id="standard-basic"
                label={<FormattedLabel id="enterDoc" required />}
                variant="standard"
                {...register("uinvitationCard")}
                error={!!errors.uinvitationCard}
                helperText={
                  errors?.uinvitationCard
                    ? errors.uinvitationCard.message
                    : null
                }
              /> */}

              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.uinvitationCard}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {language === "en" ? " Marriage Document" : "विवाह दस्तऐवज"}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="  Status of Document"
                    >
                      <MenuItem value={"Marriage Invitation Card"}>
                        {language === "en"
                          ? "Original Marriage Invitation Card"
                          : "मूळ प्रत लग्नपत्रिका"}
                      </MenuItem>
                      <MenuItem value={"Affidavit"}>
                        {language === "en"
                          ? "Affidavit - Rs.100 stamp paper"
                          : "प्रतिज्ञापत्र हे १०० च्या स्टॅम्प वर"}
                      </MenuItem>
                    </Select>
                  )}
                  name="uinvitationCard"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.uinvitationCard
                    ? errors.uinvitationCard.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.uinvitationCardPath}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("uinvitationCardPath")}
                fileKey={"uinvitationCardPath"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedUinvitationCardPath(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.uinvitationCardPath}>
                {errors?.uinvitationCardPath
                  ? errors?.uinvitationCardPath?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>
          <div className={styles.row1}>
            <Grid
              item
              xs={8}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              className={styles.srow}
              style={{ marginTop: "30px" }}
            >
              <Typography>
                {" "}
                {<FormattedLabel id="marrigePhotoC" required />}{" "}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              // style={{ marginLeft: "50px" }}
            >
              <TextField
                disabled={disabled}
                id="standard-basic"
                InputLabelProps={{
                  shrink:
                    (watch("umarrigePhotoCouple") ? true : false) ||
                    (router.query.umarrigePhotoCouple ? true : false),
                }}
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" required />}
                variant="standard"
                {...register("umarrigePhotoCouple")}
                error={!!errors.umarrigePhotoCouple}
                helperText={
                  errors?.umarrigePhotoCouple
                    ? errors.umarrigePhotoCouple.message
                    : null
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginLeft: "50px", marginTop: "25px" }}
            >
              <UploadButton
                error={!!errors?.umarrigePhotoCouplePath}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("umarrigePhotoCouplePath")}
                fileKey={"umarrigePhotoCouplePath"}
                showDel={pageMode ? false : true}
                fileNameEncrypted={(path) => {
                  setEncryptedUmarrigePhotoCouplePath(path);
                }}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.umarrigePhotoCouplePath}>
                {errors?.umarrigePhotoCouplePath
                  ? errors?.umarrigePhotoCouplePath?.message
                  : null}
              </FormHelperText>
            </Grid>
          </div>

          {/* witness 1 */}
          {/* <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>
                {" "}
                {<FormattedLabel id="DBProof1" required />}{" "}
              </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.wfageProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          console.log(
                            "OnChangeqqqw",
                            document.find((r) => r.id === value.target.value)
                              .documentChecklistMr,
                          );
                      }}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wfageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wfageProofDocumentKey
                    ? errors.wfageProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wfageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wfageProofDocument")}
                fileKey={"wfageProofDocument"}
                showDel={pageMode ? false : true}
              />
              <FormHelperText error={!!errors?.wfageProofDocument}>
                {errors?.wfageProofDocument
                  ? errors?.wfageProofDocument?.message
                  : null}
              </FormHelperText>
            </div>
          </div> */}

          {/* witness 2 */}

          {/* <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>
                {" "}
                {<FormattedLabel id="DBProof2" required />}{" "}
              </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.wsageProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          console.log(
                            "OnChangeqqqw",
                            document.find((r) => r.id === value.target.value)
                              .documentChecklistMr,
                          );
                      }}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wsageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wsageProofDocumentKey
                    ? errors.wsageProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wsageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wsageProofDocument")}
                fileKey={"wsageProofDocument"}
                showDel={pageMode ? false : true}
              />
              <FormHelperText error={!!errors?.wsageProofDocument}>
                {errors?.wsageProofDocument
                  ? errors?.wsageProofDocument?.message
                  : null}
              </FormHelperText>
            </div>
          </div> */}

          {/* witness 3 */}

          {/* <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>
                {" "}
                {<FormattedLabel id="DBProof3" required />}{" "}
              </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.wtageProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          console.log(
                            "OnChangeqqqw",
                            document.find((r) => r.id === value.target.value)
                              .documentChecklistMr,
                          );
                      }}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2)
                              return documentKey;
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == "en"
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wtageProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wtageProofDocumentKey
                    ? errors.wtageProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.wtageProofDocument}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("wtageProofDocument")}
                fileKey={"wtageProofDocument"}
                showDel={pageMode ? false : true}
              />
              <FormHelperText error={!!errors?.wtageProofDocument}>
                {errors?.wtageProofDocument
                  ? errors?.wtageProofDocument?.message
                  : null}
              </FormHelperText>
            </div>
          </div> */}
          {/* <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: "30px" }}>
              <Typography>
                {<FormattedLabel id="marDrf" required />}{" "}
              </Typography>
            </div>

            <div style={{ marginLeft: "50px" }}>
              <TextField
                disabled={disabled}
                id="standard-basic"
                InputLabelProps={{
                  shrink:
                    (watch("ustampDetail") ? true : false) ||
                    (router.query.ustampDetail ? true : false),
                }}
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" required />}
                variant="standard"
                {...register("ustampDetail")}
                error={!!errors.ustampDetail}
                helperText={
                  errors?.ustampDetail ? errors.ustampDetail.message : null
                }
              />
            </div>

            <div style={{ marginLeft: "50px", marginTop: "25px" }}>
              <UploadButton
                error={!!errors?.ustampDetailPath}
                appName={appName}
                serviceName={serviceName}
                fileDtl={getValues("ustampDetailPath")}
                fileKey={"ustampDetailPath"}
                showDel={pageMode ? false : true}
                // showDel={true}
              />
              <FormHelperText error={!!errors?.ustampDetailPath}>
                {errors?.ustampDetailPath
                  ? errors?.ustampDetailPath?.message
                  : null}
              </FormHelperText>
            </div>
          </div> */}

          <h4
            style={{
              marginLeft: "40px",
              color: "red",
              fontStyle: "italic",
              // marginTop: "25px",
            }}
          >
            <p>
              <blink className={styles.blink}>
                {language == "en"
                  ? "Please stick Rs. 100 Court Fee stamp on the final application form and bring the form along with all the original documents at the time of your scheduled visit"
                  : "कृपया अंतिम अर्जावर 100  रु कोर्ट फी स्टॅम्प चिकटवा आणि तुमच्या नियोजित भेटीच्या वेळी सर्व मूळ कागदपत्रांसह फॉर्म आणा."}
              </blink>
            </p>

            {/* Please stick Rs. 100 Court Fee stamp on the final application form
            and bring the form along with all the original documents at the time
            of your scheduled visit */}
          </h4>

          {watch("gdisabled") == true && (
            <div className={styles.row1}>
              <Grid
                item
                xs={8}
                sm={6}
                md={4}
                lg={4}
                xl={4}
                className={styles.srow}
                style={{ marginTop: "30px" }}
              >
                <Typography>
                  {language == "en"
                    ? "Disability Groom Certificate"
                    : "वरचा अपंग दस्तऐवज"}{" "}
                  <span style={{ color: "red" }}>*</span>
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={4}
                // style={{ marginLeft: "50px" }}
              >
                <TextField
                  disabled={disabled}
                  id="standard-basic"
                  InputLabelProps={{
                    shrink:
                      (watch("personDisabled1") ? true : false) ||
                      (router.query.personDisabled1 ? true : false),
                  }}
                  label={<FormattedLabel id="enterDoc" required />}
                  variant="standard"
                  {...register("personDisabled1")}
                  error={!!errors.personDisabled1}
                  helperText={
                    errors?.personDisabled1
                      ? errors.personDisabled1.message
                      : null
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={4}
                style={{ marginLeft: "50px", marginTop: "25px" }}
              >
                <UploadButton
                  appName={appName}
                  serviceName={serviceName}
                  fileDtl={getValues("ugdisabled")}
                  fileKey={"ugdisabled"}
                  showDel={pageMode ? false : true}
                  fileNameEncrypted={(path) => {
                    setEncryptedUgdisabled(path);
                  }}
                />
                <FormHelperText error={!!errors?.ugdisabled}>
                  {errors?.ugdisabled ? errors?.ugdisabled?.message : null}
                </FormHelperText>
              </Grid>
            </div>
          )}

          {watch("bdisabled") == true && (
            <div className={styles.row1}>
              <Grid
                item
                xs={8}
                sm={6}
                md={4}
                lg={4}
                xl={4}
                className={styles.srow}
                style={{ marginTop: "30px" }}
              >
                <Typography>
                  {language == "en"
                    ? "Disability Bride Certificate"
                    : "वधूचा अपंग दस्तऐवज"}
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={4}
                // style={{ marginLeft: "50px" }}
              >
                <TextField
                  disabled={disabled}
                  id="standard-basic"
                  InputLabelProps={{
                    shrink:
                      (watch("personDisabled") ? true : false) ||
                      (router.query.personDisabled ? true : false),
                  }}
                  label={<FormattedLabel id="enterDoc" required />}
                  variant="standard"
                  {...register("personDisabled")}
                  error={!!errors.personDisabled}
                  helperText={
                    errors?.personDisabled
                      ? errors.personDisabled.message
                      : null
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={4}
                style={{ marginLeft: "50px", marginTop: "25px" }}
              >
                <UploadButton
                  appName={appName}
                  serviceName={serviceName}
                  fileDtl={getValues("ubdisabled")}
                  fileKey={"ubdisabled"}
                  showDel={pageMode ? false : true}
                  fileNameEncrypted={(path) => {
                    setEncryptedUbdisabled(path);
                  }}
                />
                <FormHelperText error={!!errors?.ubdisabled}>
                  {errors?.ubdisabled ? errors?.ubdisabled?.message : null}
                </FormHelperText>
              </Grid>
            </div>
          )}

          {/* other document */}
          {getValues("udivorcePaper") != "" &&
            getValues("udeathcer") != "" &&
            getValues("ucertiReligious") != "" && (
              <>
                {/* Other Docs */}
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {<FormattedLabel id="otherDetail" />}
                    </h3>
                  </div>
                </div>
                {/* groom divorce */}
                {watch("gstatusAtTimeMarriageKey") &&
                  watch("gstatusAtTimeMarriageKey") == 1 && (
                    <>
                      <div className={styles.row1}>
                        <Grid
                          item
                          xs={8}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          className={styles.srow}
                          style={{ marginTop: "30px" }}
                        >
                          <Typography>
                            {<FormattedLabel id="DivorcePaperg" required />}{" "}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          // style={{ marginLeft: "50px" }}
                        >
                          <TextField
                            InputLabelProps={{
                              shrink:
                                (watch("gudivorcePaper") ? true : false) ||
                                (router.query.gudivorcePaper ? true : false),
                            }}
                            id="standard-basic"
                            disabled={disabled}
                            // label="Enter Document"
                            label={<FormattedLabel id="enterDoc" />}
                            variant="standard"
                            {...register("gudivorcePaper")}
                            error={!!errors.gudivorcePaper}
                            helperText={
                              errors?.gudivorcePaper
                                ? errors.gudivorcePaper.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{ marginLeft: "50px", marginTop: "25px" }}
                        >
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("gudivorcePaperPath")}
                            fileKey={"gudivorcePaperPath"}
                            showDel={pageMode ? false : true}
                            fileNameEncrypted={(path) => {
                              setEncryptedGudivorcePaperPath(path);
                            }}
                            // showDel={true}
                          />
                          <FormHelperText error={!!errors?.gudivorcePaperPath}>
                            {errors?.gudivorcePaperPath
                              ? errors?.gudivorcePaperPath?.message
                              : null}
                          </FormHelperText>
                        </Grid>
                      </div>
                    </>
                  )}
                {/* bride divorce */}
                {watch("bstatusAtTimeMarriageKey") &&
                  watch("bstatusAtTimeMarriageKey") == 1 && (
                    <>
                      <div className={styles.row1}>
                        <Grid
                          item
                          xs={8}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          className={styles.srow}
                          style={{ marginTop: "30px" }}
                        >
                          <Typography>
                            {<FormattedLabel id="DivorcePaperb" required />}{" "}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          // style={{ marginLeft: "50px" }}
                        >
                          <TextField
                            InputLabelProps={{
                              shrink:
                                (watch("budivorcePaper") ? true : false) ||
                                (router.query.budivorcePaper ? true : false),
                            }}
                            id="standard-basic"
                            disabled={disabled}
                            // label="Enter Document"
                            label={<FormattedLabel id="enterDoc" />}
                            variant="standard"
                            {...register("budivorcePaper")}
                            error={!!errors.budivorcePaper}
                            helperText={
                              errors?.budivorcePaper
                                ? errors.budivorcePaper.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{ marginLeft: "50px", marginTop: "25px" }}
                        >
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("budivorcePaperPath")}
                            fileKey={"budivorcePaperPath"}
                            showDel={pageMode ? false : true}
                            fileNameEncrypted={(path) => {
                              setEncryptedBudivorcePaperPath(path);
                            }}
                            // showDel={true}
                          />
                          <FormHelperText error={!!errors?.budivorcePaperPath}>
                            {errors?.budivorcePaperPath
                              ? errors?.budivorcePaperPath?.message
                              : null}
                          </FormHelperText>
                        </Grid>
                      </div>
                    </>
                  )}

                {/* groom widow */}
                {watch("gstatusAtTimeMarriageKey") &&
                  watch("gstatusAtTimeMarriageKey") == 3 && (
                    <>
                      <div className={styles.row1}>
                        <Grid
                          item
                          xs={8}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          className={styles.srow}
                          style={{ marginTop: "30px" }}
                        >
                          <Typography>
                            {<FormattedLabel id="DeathCg" required />} ({" "}
                            {" " +
                              watch("gfName") +
                              " " +
                              watch("gmName") +
                              " " +
                              watch("glName")}
                            )
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          // style={{ marginLeft: "50px" }}
                        >
                          <TextField
                            // sx={{ border: "solid red" }}
                            InputLabelProps={{
                              shrink:
                                (watch("gudeathcer") ? true : false) ||
                                (router.query.gudeathcer ? true : false),
                            }}
                            id="standard-basic"
                            disabled={disabled}
                            // label="Enter Document"
                            label={<FormattedLabel id="enterDoc" />}
                            variant="standard"
                            {...register("gudeathcer")}
                            error={!!errors.gudeathcer}
                            helperText={
                              errors?.gudeathcer
                                ? errors.gudeathcer.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{ marginLeft: "50px", marginTop: "25px" }}
                        >
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("gudeathcerPath")}
                            fileKey={"gudeathcerPath"}
                            showDel={pageMode ? false : true}
                            fileNameEncrypted={(path) => {
                              setEncryptedGudeathcerPath(path);
                            }}
                            // showDel={true}
                          />
                          <FormHelperText error={errors.gudeathcerPath}>
                            {errors.gudeathcerPath
                              ? errors.gudeathcerPath.message
                              : null}
                          </FormHelperText>
                        </Grid>
                      </div>
                    </>
                  )}
                {/* bride widow */}
                {watch("bstatusAtTimeMarriageKey") &&
                  watch("bstatusAtTimeMarriageKey") == 3 && (
                    <>
                      <div className={styles.row1}>
                        <Grid
                          item
                          xs={8}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          className={styles.srow}
                          style={{ marginTop: "30px" }}
                        >
                          <Typography>
                            {<FormattedLabel id="DeathCb" required />}({" "}
                            {" " +
                              watch("bfName") +
                              " " +
                              watch("bmName") +
                              " " +
                              watch("blName")}
                            )
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          // style={{ marginLeft: "50px" }}
                        >
                          <TextField
                            InputLabelProps={{
                              shrink:
                                (watch("budeathcer") ? true : false) ||
                                (router.query.budeathcer ? true : false),
                            }}
                            id="standard-basic"
                            disabled={disabled}
                            // label="Enter Document"
                            label={<FormattedLabel id="enterDoc" />}
                            variant="standard"
                            {...register("budeathcer")}
                            error={!!errors.budeathcer}
                            helperText={
                              errors?.budeathcer
                                ? errors.budeathcer.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{ marginLeft: "50px", marginTop: "25px" }}
                        >
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("budeathcerPath")}
                            fileKey={"budeathcerPath"}
                            showDel={pageMode ? false : true}
                            fileNameEncrypted={(path) => {
                              setEncryptedBudeathcerPath(path);
                            }}
                            // showDel={true}
                          />
                          <FormHelperText error={errors.budeathcerPath}>
                            {errors.budeathcerPath
                              ? errors.budeathcerPath.message
                              : null}
                          </FormHelperText>
                        </Grid>
                      </div>
                    </>
                  )}

                {/* law of marriage muslim  */}
                {watch("lawOfMarriage") && watch("lawOfMarriage") == 2 && (
                  <>
                    <div className={styles.row1}>
                      <Grid
                        item
                        xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        className={styles.srow}
                        style={{ marginTop: "30px", marginLeft: "" }}
                      >
                        <Typography>
                          {/* {<FormattedLabel id="nikahnamag" required />}{" "} */}{" "}
                          {language == "en"
                            ? "Nikahnama (Translated into English or Marathi)"
                            : "निकाहनामा (इंग्रजी किंवा मराठी मध्ये रुपांतरीत)"}
                          <span style={{ color: "red" }}>*</span>
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        // style={{ marginLeft: "50px" }}
                      >
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("nikahnamaofLaw") ? true : false) ||
                              (router.query.nikahnamaofLaw ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          // label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("nikahnamaofLaw")}
                          error={!!errors.nikahnamaofLaw}
                          helperText={
                            errors?.nikahnamaofLaw
                              ? errors.nikahnamaofLaw.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{ marginLeft: "50px", marginTop: "25px" }}
                      >
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("nikahnamaofLawpath")}
                          fileKey={"nikahnamaofLawpath"}
                          showDel={pageMode ? false : true}
                          fileNameEncrypted={(path) => {
                            setEncryptedNikahnamaofLawpath(path);
                          }}
                          // showDel={true}
                        />
                        <FormHelperText error={errors.nikahnamaofLawpath}>
                          {errors.nikahnamaofLawpath
                            ? errors.nikahnamaofLawpath.message
                            : null}
                        </FormHelperText>
                      </Grid>
                    </div>
                  </>
                )}

                {/* groom muslim */}
                {/* {watch("greligionByBirth") &&
                  watch("greligionByBirth") == 1 && (
                    <>
                      <div className={styles.row1}>
                        <Grid
                          item
                          xs={8}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          className={styles.srow}
                          style={{ marginTop: "30px" }}
                        >
                          <Typography>
                            {<FormattedLabel id="nikahnamag" required />}{" "}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                        // style={{ marginLeft: "50px" }}
                        >
                          <TextField
                            InputLabelProps={{
                              shrink:
                                (watch("nikahnamag") ? true : false) ||
                                (router.query.nikahnamag ? true : false),
                            }}
                            id="standard-basic"
                            disabled={disabled}
                            // label="Enter Document"
                            label={<FormattedLabel id="enterDoc" />}
                            variant="standard"
                            {...register("nikahnamag")}
                            error={!!errors.nikahnamag}
                            helperText={
                              errors?.nikahnamag
                                ? errors.nikahnamag.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{ marginLeft: "50px", marginTop: "25px" }}
                        >
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("nikahnamagpath")}
                            fileKey={"nikahnamagpath"}
                            showDel={pageMode ? false : true}
                          // showDel={true}
                          />
                        </Grid>
                      </div>
                    </>
                  )} */}

                {/* bride muslim */}
                {/* {watch("breligionByBirth") &&
                  watch("breligionByBirth") == 1 && (
                    <>
                      <div className={styles.row1}>
                        <Grid
                          item
                          xs={8}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          className={styles.srow}
                          style={{ marginTop: "30px" }}
                        >
                          <Typography>
                            {<FormattedLabel id="nikahnamab" required />}{" "}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                        // style={{ marginLeft: "50px" }}
                        >
                          <TextField
                            InputLabelProps={{
                              shrink:
                                (watch("nikahnamab") ? true : false) ||
                                (router.query.nikahnamab ? true : false),
                            }}
                            id="standard-basic"
                            disabled={disabled}
                            // label="Enter Document"
                            label={<FormattedLabel id="enterDoc" />}
                            variant="standard"
                            {...register("nikahnamab")}
                            error={!!errors.nikahnamab}
                            helperText={
                              errors?.nikahnamab
                                ? errors.nikahnamab.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{ marginLeft: "50px", marginTop: "25px" }}
                        >
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("nikahnamabpath")}
                            fileKey={"nikahnamabpath"}
                            showDel={pageMode ? false : true}
                          // showDel={true}
                          />
                        </Grid>
                      </div>
                    </>
                  )} */}

                {getValues("ucertiReligious") != "" && (
                  <>
                    <div className={styles.row1}>
                      <Grid
                        item
                        xs={8}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        className={styles.srow}
                        style={{ marginTop: "30px" }}
                      >
                        <Typography>
                          {<FormattedLabel id="certiByReligiousPlc" />}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        // style={{ marginLeft: "50px" }}
                      >
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("ucertiReligious") ? true : false) ||
                              (router.query.ucertiReligious ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          //   label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("ucertiReligious")}
                          error={!!errors.ucertiReligious}
                          helperText={
                            errors?.ucertiReligious
                              ? errors.ucertiReligious.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{ marginLeft: "50px", marginTop: "25px" }}
                      >
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("ucertiReligiousPath")}
                          fileKey={"ucertiReligiousPath"}
                          showDel={pageMode ? false : true}
                          fileNameEncrypted={(path) => {
                            setEncryptedUcertiReligiousPath(path);
                          }}
                          // showDel={true}
                        />
                        <FormHelperText error={!!errors?.ucertiReligiousPath}>
                          {errors?.ucertiReligiousPath
                            ? errors?.ucertiReligiousPath?.message
                            : null}
                        </FormHelperText>
                      </Grid>
                    </div>
                  </>
                )}
                {/* {getValues("udeathcer") != "" && (
                  <>
                    <div className={styles.row1}>
                      <div className={styles.srow} style={{ marginTop: "30px" }}>
                        <Typography>{<FormattedLabel id="DeathC" />}</Typography>
                      </div>

                      <div style={{ marginLeft: "50px" }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch("udeathcer") ? true : false) || (router.query.udeathcer ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                      
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register("udeathcer")}
                          error={!!errors.udeathcer}
                          helperText={errors?.udeathcer ? errors.udeathcer.message : null}
                        />
                      </div>

                      <div style={{ marginLeft: "50px", marginTop: "25px" }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues("udeathcerPath")}
                          fileKey={"udeathcerPath"}
                          showDel={pageMode ? false : true}
                          
                        />
                      </div>
                    </div>
                  </>
                )} */}

                {/* {getValues('ubDeathcer') != '' && (
                  <>
                    <div className={styles.row1}>
                      <div
                        className={styles.srow}
                        style={{ marginTop: '30px' }}
                      >
                        <Typography>
                          {<FormattedLabel id="DeathC" />}
                        </Typography>
                      </div>

                      <div style={{ marginLeft: '50px' }}>
                        <TextField
                          InputLabelProps={{
                            shrink:
                              (watch('ubDeathcer') ? true : false) ||
                              (router.query.ubDeathcer ? true : false),
                          }}
                          id="standard-basic"
                          disabled={disabled}
                          // label="Enter Document"
                          label={<FormattedLabel id="enterDoc" />}
                          variant="standard"
                          {...register('ubDeathcer')}
                          error={!!errors.ubDeathcer}
                          helperText={
                            errors?.ubDeathcer
                              ? errors.ubDeathcer.message
                              : null
                          }
                        />
                      </div>

                      <div style={{ marginLeft: '50px', marginTop: '25px' }}>
                        <UploadButton
                          appName={appName}
                          serviceName={serviceName}
                          fileDtl={getValues('ubDeathcerPath')}
                          fileKey={'ubDeathcerPath'}
                          showDel={pageMode ? false : true}
                          // showDel={true}
                        />
                      </div>
                    </div>
                  </>
                )} */}
              </>
            )}

          {/* {!props.preview && (
            <div className={styles.viewformbtn}>
              <Button
                style={{
                  height: '40px',
                  width: '150px',
                }}
                variant="contained"
                endIcon={<VisibilityIcon />}
                size="small"
                onClick={() => {
                  const id = router.query.id
                  console.log('sddlfkjslkfdjsdlkf', router.query.id)
                  viewForm(id)
                }}
              >
                {language === 'en' ? 'Preview' : 'अर्जाचे पूर्वावलोकन'}
              </Button>
            </div>
          )} */}

          {/* other doc */}
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                {<FormattedLabel id="otherDocuments" />}
              </h3>
            </div>
          </div>
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <FileTable
                appName="MR" //Module Name
                serviceName={"M-NMR"} //Transaction Name
                fileName={attachedFile} //State to attach file
                filePath={setAttachedFile} // File state upadtion function
                newFilesFn={setAdditionalFiles} // File data function
                columns={_columns} //columns for the table
                rows={
                  watch("attachments") && watch("attachments")?.length > 0
                    ? watch("attachments")?.map((x, i) => {
                        return { ...x, srNo: i + 1 };
                      })
                    : []
                } //state to be displayed in table
                uploading={setUploading}
                authorizedToUpload={authorizedToUpload}
                // disable={viewOnly}
              />
            </Grid>
            <Grid item xs={1} />
          </Grid>
        </div>

        {/* <>
          <Dialog
            fullWidth
            maxWidth={'lg'}
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
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <IconButton
                    aria-label="delete"
                    sx={{
                      marginLeft: '530px',
                      backgroundColor: 'primary',
                      ':hover': {
                        bgcolor: 'red', // theme.palette.primary.main
                        color: 'white',
                      },
                    }}
                  >
                    <CloseIcon
                      sx={{
                        color: 'black',
                      }}
                      onClick={() => {
                        formPreviewDailogClose()
                      }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent>
              <>
                <FormProvider {...methods}>
                  <form>
                    <ApplicantDetails />
                    <GroomDetails />
                    <BrideDetails />
                    <PriestDetails />
                    <WitnessDetails />
                    <DocumentsUpload preview={true} />
                  </form>
                </FormProvider>
              </>
            </DialogContent>

            <DialogTitle>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button
                  onClick={() => {
                    swal({
                      title: 'Exit?',
                      text: 'Are you sure you want to exit this Record ? ',
                      icon: 'warning',
                      buttons: true,
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete) {
                        swal('Record is Successfully Exit!', {
                          icon: 'success',
                        })
                        formPreviewDailogClose()
                      } else {
                        swal('Record is Safe')
                      }
                    })
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </DialogTitle>
          </Dialog>
        </> */}
      </ThemeProvider>
    </>
  );
};

export default DocumentsUpload;
