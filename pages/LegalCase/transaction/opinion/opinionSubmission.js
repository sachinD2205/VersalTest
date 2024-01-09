import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  Modal,
  // Card,
  // Checkbox,
  // FormControl,
  // FormControlLabel,
  // FormHelperText,
  // FormLabel,
  // Grid,
  // InputLabel,
  // MenuItem,
  // Radio,
  // RadioGroup,
  // Select,
  // TextField,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSubmissionSchema";
import urls from "../../../../URLS/urls";
import FileTable from "../../FileUpload/FileTable";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import * as yup from "yup";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { saveAs } from "file-saver";

import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const Index = () => {
  // Schema
  const language = useSelector((state) => state.labels.language);

  const [loadderState, setLoadderState] = useState(false);

  // Handle cathch method to display Error sweetalert
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

  // Schema
  const generateSchema = (language) => {
    const baseSchema = yup.object({
      // other
    });

    if (language === "en") {
      return baseSchema.shape({
        clerkRemarkEn: yup
          .string()
          .nullable()
          .required("Opinion Subject is required.")
          .matches(
            // /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?]*$/,

            /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?\'\–]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),
      });
    } else if (language === "mr") {
      return baseSchema.shape({
        clerkRemarkMr: yup
          .string()
          .nullable()
          .required("Opinion Subject is required.")
          .matches(
            // /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?]*$/,
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?\'\–\"]*$/,

            "Must be only marathi characters/ फक्त मराठी शब्द"
          ),
      });
    } else {
      return baseSchema;
    }
  };
  // const language = useSelector((state) => state?.labels?.language);
  const schema = generateSchema(language);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;
  // useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });
  // const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setId] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [isOpenCollapse1, setIsOpenCollapse1] = useState(false);
  const [isOpenCollapse2, setIsOpenCollapse2] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [personName, setPersonName] = React.useState([]);
  const token = useSelector((state) => state.user.user.token);

  const [personName1, setPersonName1] = React.useState([]);

  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayOpinionDetails, setDisplayOpinionDetails] = useState("");
  const [showDocketSubDetailsModel, setShowDocketSubDetailsModel] =
    useState(false);
  const ExpandableCell = ({ value }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div>
        {expanded ? value : value.slice(0, 40)}{" "}
        {value.length > 40 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link
            type="button"
            component="button"
            onClick={() => setExpanded(!expanded)}
          >
            <FormattedLabel id={expanded ? "viewLess" : "viewMore"} />
          </Link>
        )}
      </div>
    );
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("31", value);
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // For clerkRemarkEnApi Translate
  // --------------------------Transaltion API--------------------------------
  const clerkRemarkEnApi = (
    currentFieldInput,
    updateFieldName,
    languagetype
  ) => {
    if (currentFieldInput) {
      let _payL = {
        apiKey: "Alpesh",
        textToTranslate: currentFieldInput,
        languagetype: languagetype,
      };
      setLoading(true);
      axios
        // .post(`${urls.TRANSLATIONAPI}`, _payL)
        .post(`${urls.GOOGLETRANSLATIONAPI}`, _payL)
        .then((r) => {
          setLoading(false);
          if (r.status === 200 || r.status === 201) {
            console.log("_res", currentFieldInput, r);
            if (updateFieldName) {
              setValue(updateFieldName, r?.data);
              clearErrors(updateFieldName);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          catchExceptionHandlingMethod(e, language);
        });
    } else {
      sweetAlert({
        title: language === "en" ? "Not Found !!" : "सापडले नाही !!",
        text:
          language === "en"
            ? "We do not received any input to translate !!"
            : "आम्हाला भाषांतर करण्यासाठी कोणतेही इनपुट मिळाले नाही !!",
        icon: "warning",
      });
    }
  };
  // -------------------------------------------------------------------------

  // const [id,setId]= useState();
  // const getApproveOpinion = () => {
  //   axios.get
  //   reset(res.data)
  // }

  useEffect(() => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
            advocateNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, []);

  useEffect(() => {
    //reset(router.query);
    console.log("router", router.query);

    axios
      .get(
        `${urls.LCMSURL}/transaction/opinion/getById?id=${router?.query?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("datafromaxios", r);
        console.log("trnOpinionAttachmentDao1", r.data.trnOpinionAttachmentDao);

        reset(r.data);

        let _dataList = r.data.trnOpinionAttachmentDao.map((val) => {
          console.log("wfdc3", val);
          return {
            id: val.id,
            srNo: val.id,
            attachedDate: "2023-03-01",
            uploadedBy: val.attachedNameEn ? val.attachedNameEn : "-",
            uploadedByMr: val.attachedNameMr ? val.attachedNameMr : "-",
            attachmentNameMr: val?.attachedNameMr,
            attachedNameEn: val?.attachedNameEn,
            extension: val.extension ? val.extension : "-",
            originalFileName: val.originalFileName ? val.originalFileName : "-",
            filePath: val.filePath,
          };
        });

        _dataList !== null && setMainFiles([..._dataList]);

        let _res = r.data.opinionAdvPanelList.map((r, i) => {
          return {
            ...r,
            srNo: i + 1,
            advocate: advocateNames?.find((a) => a?.id === r?.advocate)
              ?.advocateName,
            advocateMr: advocateNames?.find((a) => a?.id === r?.advocate)
              ?.advocateNameMr,
            advocateOpinion: r.opinion,
            advocateOpinionMr: r.opinionMr,
          };
        });
        // setData(_res)
        setData({
          rows: _res,
          totalRows: r.data.opinionAdvPanelList.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: 100,
          page: 0,
        });

        let _res1 = r.data.reportAdvPanelList.map((r, i) => {
          return {
            srNo: i + 1,
            advocate: advocateNames?.find((a) => a?.id === r?.advocate)
              ?.advocateName,

            advocateMr: advocateNames?.find((a) => a?.id === r?.advocate)
              ?.advocateNameMr,

            advocateOpinion: r.opinion,
            advocateOpinionMr: r.opinionMr,
            // advocateOpinion: r.opinion,
          };
        });
        // setData(_res)
        setData1({
          rows: _res1,
          totalRows: r.data.reportAdvPanelList.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: 100,
          page: 0,
        });

        // console.log("getValues",getValues("opinionAdvPanelList"));
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
    // setId(router.query.id)
    //  getApproveOpinion()
  }, [router.query, advocateNames]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    console.log("31", value);
    setPersonName1(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const checkBox1 = (e) => {
    // alert(e.target.value);
    if (e.target.checked == true) {
      // console.log("Checked ", e.target.value);
      setIsOpenCollapse1(true);
    } else if (e.target.checked == false) {
      // console.log(" Un Checked ", e.target.value);
      setIsOpenCollapse1(false);
    }
  };

  const checkBox2 = (e) => {
    if (e.target.checked == true) {
      setIsOpenCollapse2(true);
    } else if (e.target.checked == false) {
      setIsOpenCollapse2(false);
    }
  };

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [data1, setData1] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDeptName();
    getOfficeName();
  }, []);

  useEffect(() => {
    // getAllOpinion();
  }, [concenDeptNames, officeName]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  // Save DB

  const onSubmitForm = (Data) => {
    console.log("data", Data);

    // let _attachedDocs = JSON.parse(
    //   localStorage.getItem("trnOpinionAttachmentDao")
    // )?.map((item) => {
    //   return {
    //     attachedNameMr: `${user?.userDao?.firstNameMr} ${user?.userDao?.middleNameMr} ${user?.userDao?.lastNameMr}`,
    //     attachedDate: item?.attachedDate,
    //     attachedNameEn: item?.attachedNameEn,
    //     extension: item?.extension,
    //     filePath: item?.filePath,
    //     originalFileName: item?.originalFileName,
    //     srNo: item?.srNo,
    //   };
    // });

    let body = {
      ...Data,
      // opinionAdvPanelList: personName.map((val) => {
      // console.log("val",val);
      // return {
      // advocate: val,
      // };
      // console.log("id", id);
      // }),

      role: "OPINION_SUBMISSION",
      status: "OPINION_SUBMITTED",
      trnOpinionAttachmentDao: finalFiles,

      // pageMode:
      // data.target.textContent === "Submit" ? "OPINION_SUBMISSION" : "OPINION_APPROVE",

      // reportAdvPanelList: personName1.map((val) => {
      //   return {
      //     advocate: val,
      //   };
      // }),
      // courtCaseEntryId: Number(Data?.id),
      // id: null,
      // sentToAdvocate: buttonText === "saveAsDraft" ? "N" : "Y",
      //name
      // id:router.query.pageMode=='Opinion' ? null: Data.id,
      // courtCaseEntryId:router.query.pageMode=='Opinion' ? Data.id:null
    };

    console.log("bodyclkopsub", body);

    setLoadderState(true);

    axios
      .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoadderState(false);

        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert(
            // "Saved!",
            language === "en" ? "Saved" : "जतन केले",

            //  "Record Submitted successfully !"
            language === "en"
              ? "Record Submitted successfully !"
              : "रेकॉर्ड यशस्वीरित्या सबमिट केले!",

            "success"
          );
          router.push(`/LegalCase/transaction/opinion`);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getDeptName = () => {
    // alert("HEllo");
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setconcenDeptName(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Location Name

  const getOfficeName = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("ghfgf", res);
        setOfficeName(
          res.data.officeLocation.map((r, i) => ({
            id: r.id,
            officeLocationName: r.officeLocationName,
            officeLocationNameMr: r.officeLocationNameMar,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  //view----------------------------------------------------------------
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
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          // alert("then");
          setLoading(false);
          console.log(
            "ImageApi21312",
            `data:image/png;base64,${r?.data?.fileName}`
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
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };

  //Delete By ID

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                // getAllOpinion();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                // getAllOpinion();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
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
      field: "originalFileName",
      // File: "originalFileName",
      width: 300,
      // flex: 1,
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      width: 200,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "uploadedBy" : "uploadedByMr",
      // flex: 1,
      width: 400,

      // width: 300,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="action" />,
      width: 400,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                viewFile(record?.row?.filePath);

                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                //   "_blank"
                // );
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 50,
    },

    {
      headerName: <FormattedLabel id="advocateName" />,
      field: language === "en" ? "advocate" : "advocateMr",
      // flex: 0.2,
      width: 300,

      // width: "100px",
      // width: "900px",
    },

    {
      headerName: <FormattedLabel id="advocateOpinion" />,
      field: language === "en" ? "advocateOpinion" : "advocateOpinionMr",
      // width: "100%",
      // width: 250,
      wrapText: true,

      flex: 1,
      // renderCell: (params) => <ExpandableCell {...params} />,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            console.log(":a2", params?.row?.advocateOpinion);

            setDisplayOpinionDetails(params?.row?.advocateOpinion);
            setShowDocketSubDetailsModel(true);
          }}
        >
          <span>{params?.row?.advocateOpinion}</span>
        </div>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            sx={{
              marginLeft: "1vw",
            }}
          >
            <div>
              <BreadcrumbComponent />
            </div>
          </Box>
          {/* Loader */}
          {loadderState ? (
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
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Paper
                    elevation={8}
                    variant="outlined"
                    sx={{
                      border: 1,
                      borderColor: "grey.500",
                      marginLeft: "10px",
                      marginRight: "10px",
                      marginTop: "10px",
                      marginBottom: "60px",
                      padding: 1,
                    }}
                  >
                    <Box
                      // style={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   paddingTop: "10px",
                      //   // backgroundColor:'#0E4C92'
                      //   // backgroundColor:'		#0F52BA'
                      //   // backgroundColor:'		#0F52BA'
                      //   background:
                      //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                      // }}

                      style={{
                        // backgroundColor: "#0084ff",
                        backgroundColor: "#556CD6",
                        // backgroundColor: "#1C39BB",

                        // #00308F
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        // fontSize: 19,
                        // marginTop: 30,
                        marginBottom: "50px",
                        height: "8vh",
                        // marginTop: ,
                        // padding: 8,
                        // paddingLeft: 30,
                        // marginLeft: "50px",
                        marginRight: "75px",
                        borderRadius: 100,
                        width: "100%",
                      }}
                    >
                      <h2
                        style={{
                          color: "white",
                          marginTop: "1vh",
                        }}
                      >
                        {" "}
                        <FormattedLabel id="clerkOpinion" />
                        {/* Opinion approval For Clerk */}
                      </h2>
                    </Box>
                    <Divider />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "right",
                          marginTop: 10,
                        }}
                      ></div>

                      {/* First Row */}

                      <Grid container sx={{ padding: "10px" }}>
                        {/* Case Number */}
                        {/* <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                label="Court Case Number"
                variant="standard"
                maxRows={4}
                style={{ width: 200 }}
                {...register("caseNumber")}
                InputLabelProps={{
                  shrink: //true
                    (watch("caseNumber") ? true : false) ||
                    (router.query.caseNumber ? true : false),
                }}
              />
            </Grid> */}

                        {/* Filed By */}
                        {/* <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                //// required
                style={{ width: 200 }}
                variant="standard"
                disabled
                label={<FormattedLabel id="filedBy" />}
                {...register("filedBy")}

                InputLabelProps={{
                  shrink: //true
                    (watch("filedBy") ? true : false) ||
                    (router.query.filedBy ? true : false),
                }}
              />
            </Grid> */}

                        {/* Case Details */}
                        {/* <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="caseDetails" />}
                placeholder="Placeholder"
                multiline
                disabled
                style={{ width: 200 }}
                variant="standard"
                {...register("caseDetails")}
                InputLabelProps={{
                  shrink: //true
                    (watch("caseDetails") ? true : false) ||
                    (router.query.caseDetails ? true : false),
                }}
              />
            </Grid> */}
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={3}
                          lg={3}
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
                            variant="standard"
                            style={{ marginTop: 10 }}
                            error={!!errors.opinionRequestDate}
                          >
                            <Controller
                              // variant="standard"
                              control={control}
                              name="opinionRequestDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    // disabled={router?.query?.pageMode === "View"}
                                    disabled
                                    variant="standard"
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {/* Opinion Request Date */}

                                        {
                                          <FormattedLabel id="opinionRequestDate" />
                                        }
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      )
                                    }
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        disabled
                                        {...params}
                                        size="small"
                                        variant="standard"
                                        sx={{ width: 230 }}
                                        InputLabelProps={{
                                          style: {
                                            fontSize: 12,
                                            marginTop: 3,
                                          },

                                          //true
                                          shrink:
                                            (watch("opinionRequestDate")
                                              ? true
                                              : false) ||
                                            (router.query.opinionRequestDate
                                              ? true
                                              : false),
                                        }}
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.opinionRequestDate
                                ? errors.opinionRequestDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        {/* Location Name */}

                        <Grid
                          item
                          xl={3}
                          lg={3}
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
                            // variant="outlined"
                            disabled
                            variant="standard"
                            size="small"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.concenDeptId}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Location Name */}

                              {<FormattedLabel id="locationName" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled={router?.query?.pageMode === "View"}
                                  disabled
                                  sx={{ width: 230 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="locationName" />}
                                  InputLabelProps={{
                                    //true
                                    shrink:
                                      (watch("officeLocation")
                                        ? true
                                        : false) ||
                                      (router.query.officeLocation
                                        ? true
                                        : false),
                                  }}
                                >
                                  {officeName &&
                                    officeName.map(
                                      (officeLocationName, index) => (
                                        <MenuItem
                                          key={index}
                                          value={officeLocationName.id}
                                        >
                                          {language == "en"
                                            ? officeLocationName?.officeLocationName
                                            : officeLocationName?.officeLocationNameMr}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="officeLocation"
                              control={control}
                              defaultValue=""
                            />
                            {/* <FormHelperText>
                          {errors?.concenDeptId
                            ? errors.concenDeptId.message
                            : null}
                        </FormHelperText> */}
                          </FormControl>
                        </Grid>

                        {/** Concern Department ID */}
                        <Grid
                          item
                          xl={3}
                          lg={3}
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
                            // variant="outlined"
                            disabled
                            variant="standard"
                            size="small"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.concenDeptId}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="deptName" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  // disabled={router?.query?.pageMode === "View"}
                                  disabled
                                  sx={{ width: 230 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="deptName" />}
                                  InputLabelProps={{
                                    //true
                                    shrink:
                                      (watch("concenDeptId") ? true : false) ||
                                      (router.query.concenDeptId
                                        ? true
                                        : false),
                                  }}
                                >
                                  {concenDeptNames &&
                                    concenDeptNames.map((department, index) => (
                                      <MenuItem
                                        key={index}
                                        value={department.id}
                                      >
                                        {/* {department.department}
                                         */}

                                        {language == "en"
                                          ? department?.department
                                          : department?.departmentMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="concenDeptId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.concenDeptId
                                ? errors.concenDeptId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        sx={{
                          marginLeft: "4vw",
                          marginTop: "6Vh",
                        }}
                      >
                        <Grid
                          item
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          sx={{
                            display: "flex",
                            // justifyContent: "center",
                            // alignItems: "center",
                          }}
                        >
                          <TextField
                            // disabled={router?.query?.pageMode === "View"}
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            multiline
                            id="standard-textarea"
                            // label="Opinion Subject"
                            label={<FormattedLabel id="opinionSubject" />}
                            placeholder="Opinion Subject"
                            variant="standard"
                            // style={{ width: 200 }}
                            {...register("opinionSubject")}
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("opinionSubject") ? true : false) ||
                                (router.query.opinionSubject ? true : false),
                            }}
                            error={!!errors.opinionSubject}
                            helperText={
                              errors?.opinionSubject
                                ? errors.opinionSubject.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>

                      {/* </Paper> */}

                      <Box
                        // style={{
                        //   display: "flex",
                        //   justifyContent: "center",
                        //   paddingTop: "10px",
                        //   marginTop: "30px",
                        //   // backgroundColor:'#0E4C92'
                        //   // backgroundColor:'		#0F52BA'
                        //   // backgroundColor:'		#0F52BA'
                        //   background:
                        //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        // }}

                        style={{
                          // backgroundColor: "#0084ff",
                          backgroundColor: "#556CD6",
                          // backgroundColor: "#1C39BB",
                          display: "flex",
                          justifyContent: "center",

                          // #00308F
                          color: "white",
                          // fontSize: 19,
                          marginTop: 80,
                          marginBottom: "50px",
                          // marginTop: ,
                          // padding: 8,
                          // paddingLeft: 30,
                          // marginLeft: "50px",
                          // marginRight: "75px",
                          borderRadius: 100,
                        }}
                      >
                        <h2
                          style={{
                            color: "white",
                          }}
                        >
                          {" "}
                          <FormattedLabel id="opinionForPanelAdvocate" />
                          {/* Opinion For Panel Advocate */}
                        </h2>
                      </Box>

                      <Box
                        sx={
                          {
                            // height: 200,
                            // width: 1000,
                            // marginLeft: 10,
                            // width: '100%',
                            // overflowX: 'auto',
                          }
                        }
                      >
                        <DataGrid
                          getRowId={(row) => row.srNo}
                          autoHeight
                          sx={{
                            overflowY: "scroll",

                            "& .MuiDataGrid-virtualScrollerContent": {},
                            "& .MuiDataGrid-columnHeadersInner": {
                              backgroundColor: "#556CD6",
                              color: "white",
                            },

                            "& .MuiDataGrid-cell:hover": {
                              color: "primary.main",
                            },
                          }}
                          // density="compact"
                          getEstimatedRowHeight={() => 50}
                          pagination
                          paginationMode="server"
                          // loading={data.loading}
                          rowCount={data.totalRows}
                          rowsPerPageOptions={data.rowsPerPageOptions}
                          page={data.page}
                          pageSize={data.pageSize}
                          rows={data.rows}
                          columns={columns}
                          onPageChange={(_data) => {}}
                          onPageSizeChange={(_data) => {
                            console.log("222", _data);
                          }}
                        />
                      </Box>

                      <Box
                        style={{
                          backgroundColor: "#556CD6",
                          // backgroundColor: "#1C39BB",
                          display: "flex",
                          justifyContent: "center",

                          // #00308F
                          color: "white",
                          // fontSize: 19,
                          marginTop: 30,
                          marginBottom: "50px",

                          borderRadius: 100,
                        }}
                      >
                        <h2
                          style={{
                            color: "white",
                          }}
                        >
                          {" "}
                          <FormattedLabel id="opinionForSearchTitleReport" />
                          {/* Opinion For Report Title Advocate */}
                        </h2>
                      </Box>

                      <Box>
                        <DataGrid
                          getRowId={(row) => row.srNo}
                          autoHeight
                          sx={{
                            overflowY: "scroll",

                            "& .MuiDataGrid-virtualScrollerContent": {},
                            "& .MuiDataGrid-columnHeadersInner": {
                              backgroundColor: "#556CD6",
                              color: "white",
                            },

                            "& .MuiDataGrid-cell:hover": {
                              color: "primary.main",
                            },
                          }}
                          // density="compact"
                          getEstimatedRowHeight={() => 50}
                          // autoHeight={true}
                          // rowHeight={50}
                          pagination
                          paginationMode="server"
                          // loading={data.loading}
                          rowCount={data1.totalRows}
                          rowsPerPageOptions={data1.rowsPerPageOptions}
                          page={data1.page}
                          pageSize={data1.pageSize}
                          rows={data1.rows}
                          columns={columns}
                          onPageChange={(_data1) => {}}
                          onPageSizeChange={(_data1) => {
                            console.log("222", _data1);
                          }}
                        />
                      </Box>
                    </div>
                    <Grid
                      container
                      style={{ padding: "10px", backgroundColor: "white" }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Typography
                          style={{ fontWeight: 900, fontSize: "20px" }}
                        >
                          {/* Opinion Attachment */}
                          <FormattedLabel id="opinionAttachment" />
                        </Typography>
                      </Grid>

                      <Grid item>
                        {/* <FormattedLabel id="documentUploadWithMSG"/> */}
                      </Grid>

                      <Grid item xs={12}>
                        <FileTable
                          appName="LCMS" //Module Name
                          serviceName={"L-Notice"} //Transaction Name
                          fileName={attachedFile} //State to attach file
                          filePath={setAttachedFile} // File state upadtion function
                          newFilesFn={setAdditionalFiles} // File data function
                          columns={_columns} //columns for the table
                          rows={finalFiles} //state to be displayed in table
                          uploading={setUploading}
                          showNoticeAttachment={
                            router.query.showNoticeAttachment
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* HOD Remark */}
                    <Grid
                      container
                      sx={{
                        // marginTop: "10px",
                        padding: "10px",
                      }}
                    >
                      {watch("hodReassignRemarkEn") != undefined &&
                        watch("hodReassignRemarkEn") != null &&
                        watch("hodReassignRemarkEn") != "" && (
                          <Grid
                            item
                            style={{
                              marginTop: "40px",
                            }}
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              style={{ width: "100%" }}
                              multiline
                              variant="standard"
                              disabled
                              label={<FormattedLabel id="hodRemarksEn" />}
                              {...register("hodReassignRemarkEn")}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("hodReassignRemarkEn")
                                    ? true
                                    : false) ||
                                  (router.query.hodReassignRemarkEn
                                    ? true
                                    : false),
                              }}
                            />
                          </Grid>
                        )}

                      {/* Marathi Fields */}
                      {watch("hodReassignRemarkMr") != undefined &&
                        watch("hodReassignRemarkMr") != null &&
                        watch("hodReassignRemarkMr") != "" && (
                          <Grid
                            item
                            style={{
                              marginTop: "60px",
                            }}
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            sx={12}
                          >
                            <TextField
                              style={{ width: "100%" }}
                              variant="standard"
                              multiline
                              disabled
                              label={<FormattedLabel id="hodRemarksMr" />}
                              {...register("hodReassignRemarkMr")}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("hodReassignRemarkMr")
                                    ? true
                                    : false) ||
                                  (router.query.hodReassignRemarkMr
                                    ? true
                                    : false),
                              }}
                            />
                          </Grid>
                        )}
                    </Grid>

                    {/* Fourth Row */}
                    <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
                      <Grid
                        item
                        xs={12}
                        xl={12}
                        md={12}
                        sm={12}
                        sx={
                          {
                            // display: "flex",
                            // justifyContent: "center",
                            // alignItems: "center",
                          }
                        }
                      >
                        <TextField
                          sx={{
                            width: "88%",
                          }}
                          id="standard-textarea"
                          disabled={router?.query?.pageMode === "View"}
                          label={<FormattedLabel id="clerkOpinionEn" />}
                          multiline
                          variant="standard"
                          fullWidth
                          {...register("clerkRemarkEn")}
                          InputLabelProps={{
                            //tru
                            shrink:
                              (watch("clerkRemarkEn") ? true : false) ||
                              (router.query.clerkRemarkEn ? true : false),
                          }}
                          error={!!errors.clerkRemarkEn}
                          helperText={
                            errors?.clerkRemarkEn
                              ? errors.clerkRemarkEn.message
                              : null
                          }
                        />

                        {/*  Button For Translation */}
                        <Button
                          variant="contained"
                          sx={{
                            marginTop: "30px",
                            marginLeft: "1vw",
                            height: "5vh",
                            width: "9vw",
                          }}
                          onClick={() =>
                            clerkRemarkEnApi(
                              watch("clerkRemarkEn"),
                              "clerkRemarkMr",
                              "en"
                            )
                          }
                        >
                          {/* Translate */}
                          <FormattedLabel id="mar" />
                        </Button>

                        {/* Transliteration */}
                        {/* <Transliteration
                      InputLabelProps={{
                        //true
                        shrink:
                          (watch("clerkRemarkEn") ? true : false) ||
                          (router.query.clerkRemarkEn ? true : false),
                      }}
                      _key={"clerkRemarkEn"}
                      labelName={"clerkRemarkEn"}
                      fieldName={"clerkRemarkEn"}
                      updateFieldName={"clerkRemarkMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="clerkOpinionEn" required />}
                      error={!!errors.clerkRemarkEn}
                      helperText={
                        errors?.clerkRemarkEn
                          ? errors.clerkRemarkEn.message
                          : null
                      }
                    /> */}
                      </Grid>

                      <Grid
                        item
                        style={{
                          marginTop: "40px",
                        }}
                        xs={12}
                        xl={12}
                        md={12}
                        sm={12}
                        sx={
                          {
                            // display: "flex",
                            // justifyContent: "center",
                            // alignItems: "center",
                          }
                        }
                      >
                        <TextField
                          sx={{
                            width: "88%",
                          }}
                          id="standard-textarea"
                          disabled={router?.query?.pageMode === "View"}
                          // label=" Clerk Opinion (In Marathi)"
                          label={<FormattedLabel id="clerkOpinionMr" />}
                          // placeholder="Opinion"
                          multiline
                          variant="standard"
                          // style={{ width: 1000 }}
                          fullWidth
                          {...register("clerkRemarkMr")}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("clerkRemarkMr") ? true : false) ||
                              (router.query.clerkRemarkMr ? true : false),
                          }}
                          error={!!errors.clerkRemarkMr}
                          helperText={
                            errors?.clerkRemarkMr
                              ? errors.clerkRemarkMr.message
                              : null
                          }
                        />

                        <Button
                          variant="contained"
                          sx={{
                            marginTop: "30px",
                            marginLeft: "1vw",
                            height: "5vh",
                            width: "9vw",
                          }}
                          onClick={() =>
                            clerkRemarkEnApi(
                              watch("clerkRemarkMr"),
                              "clerkRemarkEn",
                              "mr"
                            )
                          }
                        >
                          {/* Translate */}
                          <FormattedLabel id="eng" />
                        </Button>

                        {/* <Transliteration
                      InputLabelProps={{
                        //true
                        shrink:
                          (watch("clerkRemarkMr") ? true : false) ||
                          (router.query.clerkRemarkMr ? true : false),
                      }}
                      _key={"clerkRemarkMr"}
                      labelName={"clerkRemarkMr"}
                      fieldName={"clerkRemarkMr"}
                      updateFieldName={"clerkRemarkEn"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="clerkOpinionMr" required />}
                      error={!!errors.clerkRemarkMr}
                      helperText={
                        errors?.clerkRemarkMr
                          ? errors.clerkRemarkMr.message
                          : null
                      }
                    /> */}
                      </Grid>

                      {/* <Grid
            item
            xs={3}
            xl={3}
            md={3}
            sm={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "50px",
            }}
          >
            <FormControl
              style={{ marginTop: 10 }}
              error={!!errors.opinionSubmisionDate}
            >
              <Controller
                control={control}
                name="opinionSubmisionDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={router?.query?.pageMode === "View"}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>
                          Opinion Submission Date
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          {...params}
                          size="small"
                          variant="standard"
                          // fullWidth
                          sx={{ width: 230 }}
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },

                              shrink: //true
                                (watch("opinionSubmisionDate") ? true : false) ||
                                (router.query.opinionSubmisionDate ? true : false),
                         
                          }}
                          
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.opinionRecivedDate
                  ? errors.opinionRecivedDate.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
                    </Grid>
                    {/* Button Row */}
                    <Grid container mt={10} ml={5} mb={5} border px={5}>
                      <Grid item xs={2}></Grid>

                      <Grid item xs={2}></Grid>

                      <Grid item>
                        <Button
                          // onClick={() => setButtonText("submit")}

                          type="Submit"
                          variant="contained"
                        >
                          {/* Submit */}
                          {<FormattedLabel id="submit" />}
                        </Button>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={() =>
                            router.push(`/LegalCase/transaction/opinion/`)
                          }
                        >
                          {/* Cancel */}

                          {<FormattedLabel id="cancel" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>

                  <>
                    <Modal
                      open={showDocketSubDetailsModel}
                      sx={{
                        padding: 5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      <Box
                        sx={{
                          width: "50%",
                          bgcolor: "background.paper",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          border: "2px solid black",
                          borderRadius: 5,
                        }}
                      >
                        <TextareaAutosize
                          disabled
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "15px",
                            resize: "none",
                            overflowY: "auto",
                            borderRadius: 20,
                            marginBottom: "20px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px whitesmoke",
                          }}
                          placeholder="Subject Details"
                          value={displayOpinionDetails}
                          color="black"
                          minRows={5}
                          maxRows={8}
                        />

                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => {
                            setShowDocketSubDetailsModel(false),
                              setDisplayOpinionDetails("");
                          }}
                          sx={{ marginBottom: "20px" }}
                        >
                          {language == "en" ? "close" : "बंद करा"}
                        </Button>
                      </Box>
                    </Modal>
                  </>
                </form>
              </FormProvider>
            </>
          )}

          {/* old */}
        </>
      )}
    </>
  );
};

export default Index;
