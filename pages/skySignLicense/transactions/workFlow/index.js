import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GridSearchIcon } from "@mui/x-data-grid";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ToggleOffSharpIcon from "@mui/icons-material/ToggleOffSharp";
import CheckIcon from "@mui/icons-material/Check";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DoneIcon from "@mui/icons-material/Done";
import WcIcon from "@mui/icons-material/Wc";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelIcon from "@mui/icons-material/Cancel";
import UndoIcon from "@mui/icons-material/Undo";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useRouter } from "next/router";

import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Grid,
  CssBaseline,
  FormControl,
  FormHelperText,
  TextareaAutosize,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Modal,
} from "@mui/material";
// import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import urls from "../../../../URLS/urls";
// import styles from "../cancellationOfLicense/cancellationOfLicense.module.css";
// import schema from "./siteVisit11schema";
import styles from "../../../../styles/skysignstyles/cancellationOfLicense.module.css";
import schema from "../../../../containers/schema/skysignschema/workFlowschema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import { router } from "next/router";
import industryCertificateReport from "../../report/industryCertificateReport";
import LoiGenerationComponent from "../components/LoiGenerationComponent";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import UploadButton1 from "../../../components/fileUpload/UploadButton1";

// func
const Index = () => {
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
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnsearchText, setBtnSearchText] = useState("search");
  const [inputState, setInputState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalforAprov, setmodalforAprov] = useState(false);
  // const [tableData, setTableData] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [licenseType, setlicenseType] = useState([]);
  const [licenseType1, setlicenseType1] = useState([]);

  // site visit Modal
  const [siteVisitModal, setSiteVisitModal] = useState(false);
  const siteVisitModalOpen = () => setSiteVisitModal(true);
  const siteVisitModalClose = () => setSiteVisitModal(false);
  viewcertificateOpen;
  const [viewcertificate, setviewcertificate] = useState(false);
  const viewcertificateOpen = () => setviewcertificate(true);
  const viewcertificateClose = () => setviewcertificate(false);

  const [digital, setdigital] = useState(false);
  const digitalOpen = () => setdigital(true);
  const digitalClose = () => setdigital(false);

  const [insertdigital, setinsertdigital] = useState(false);
  const insertdigitalOpen = () => setinsertdigital(true);
  const insertdigitalClose = () => setinsertdigital(false);
  // loi Collection
  const [loiCollection, setLoiCollection] = useState(false);
  const loiCollectionOpen = () => setLoiCollection(true);
  const loiCollectionClose = () => setLoiCollection(false);

  const [licenseTypes, setlicenseTypes] = useState([]);
  const loiModalFun = (record) => {
    const record3 = { ...record };
    reset(record);
    viewcertificateOpen();
  };

  const digitalModalFun = () => {
    digitalOpen();
    //viewcertificateClose();
  };

  const loiCollectionFun = () => {
    loiCollectionOpen();
    loiModalClose();
  };

  const insertdigitalFun = () => {
    insertdigitalOpen();
    //loiModalClose();
  };
  const getlicenseType = () => {
    axios.get(`${urls.SSLM}/master/MstLicenseType/getAll`).then((r) => {
      setlicenseTypes(
        r.data.MstLicenseType.map((row) => ({
          id: row.id,
          licenseType: row.licenseType,
          licenseTypeMar: row.licenseTypeMar,
        }))
      );
    });
  };

  const getlicenseType1 = () => {
    axios.get(`${urls.SSLM}/api/License/getLoidata`).then((r) => {
      setlicenseType1(
        r.data.MstLicenseType.map((row) => ({
          id: row.id,
          licenseType: row.licenseType,
          licenseTypeMar: row.licenseTypeMar,
        }))
      );
    });
  };

  useEffect(() => {
    getIssuanceOfHawkerLicense();
    getlicenseType();
  }, []);

  const getIssuanceOfHawkerLicense = () => {
    axios
      .get(`${urls.SSLM}/Trn/ApplicantDetails/getApplicantDetails`)
      .then((resp) => {
        console.log("response Data", JSON.stringify(resp.data));
        // dispach(addAllNewMarriageRegistraction(resp.data));

        // const response = {
        //   ...resp.data,
        //   // srNo: i + 1,
        // };
        setDataSource(resp.data);
        // setTableData(resp.data);
        // console.log("response", resp.data);

        // // Approved Application Count
        // const approvedApplicationCount = resp.data.filter((data, index) => {
        //   return data.applicationVerficationStatus == "APPROVED";
        // });
        // setApprovedApplication(approvedApplicationCount.length);

        // // Pending Application
        // const pendingApplicationCount = resp.data.filter((data, index) => {
        //   return data.applicationVerficationStatus == "PENDING";
        // });
        // setPendingApplication(pendingApplicationCount.length);

        // // Rejected  Application
        // const rejectedApplicationCount = resp.data.filter((data, index) => {
        //   return data.applicationVerficationStatus == "REJECTED";
        // });
        // setRejectedApplication(rejectedApplicationCount.length);

        // // Total  Application
        // const totalApplicationCount = resp.data.filter((data, index) => {
        //   return data.applicationVerficationStatus;
        // });
        // setTotalApplication(totalApplicationCount.length);
      });
  };

  // Get Table - Data
  const getCancellLicDetails = (licenseNo) => {
    axios
      .get(`${urls.SSLM}/License/getLicense`)
      .then((res) => {
        console.log(res);
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            licenseNo: r.licenseNo,
            applicantName: r.applicantName,
            mobile: r.mobile,
            emailAddress: r.emailAddress,
            applicationNumber: r.applicationNo,
            organizationname: r.organizationname,
            gstNo: r.gstNo,
            licenseType: licenseType[r.licenseTypeMar]
            ? licenseType[r.licenseTypeMar].licenseTypeMar
            : "-",

          }))
        );
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getCancellLicDetails();
    getlicenseType();
    console.log("useEffect");
  }, []);

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      // activeFlag: btnSaveText === "Update" ? null : null,
      // isParent: formData.selectedChildOrParent === "Y" ? "Y" : null,
      // breadcrumName:formData.clickTo,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.SSLM}/License/saveLicense`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getCancellLicDetails();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const viewRecord = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      // pathname: `/skySignLicense/transactions/components/siteVisit`,
      pathname: `/skySignLicense/transactions/reIssuanceOfIndustry`,

      query: {
        ...record,
      },
    });
  };

  const viewRecord2 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      pathname: `/skySignLicense/transactions/siteVisit`,
      // pathname: `/skySignLicense/transactions/reIssuanceOfIndustry`,

      query: {
        ...record,
      },
    });
  };

  const viewRecord3 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      pathname: `/skySignLicense/transactions/components/slot`,

      query: {
        ...record,
      },
    });
  };

  const viewRecord4 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      // pathname: `/skySignLicense/transactions/components/siteVisit`,
      pathname: `/skySignLicense/transactions/loiGenerationRecipt`,

      query: {
        ...record,
      },
    });
  };

  const viewRecord5 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      // pathname: `/skySignLicense/transactions/components/siteVisit`,
      pathname: `/skySignLicense/transactions/components/LoiGenerationComponent`,

      query: {
        ...record,
      },
    });
  };

  const viewRecord6 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      // pathname: `/skySignLicense/transactions/components/siteVisit`,
      pathname: `/skySignLicense/transactions/components/LoiCollectionComponent`,

      query: {
        ...record,
      },
    });
  };

  const viewRecord7 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      // pathname: `/skySignLicense/transactions/components/siteVisit`,
      pathname: `/skySignLicense/report/applicationPaymentReceipt`,

      query: {
        ...record,
      },
    });
  };
  const viewRecord8 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      pathname: `/skySignLicense/transactions/components/IndustryDocView`,
      // pathname: `/skySignLicense/transactions/reIssuanceOfIndustry`,

      query: {
        ...record,
      },
    });
  };

  const viewRecord9 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      pathname: `/skySignLicense/transactions/components/CertificateGeneration`,
      // pathname: `/skySignLicense/transactions/reIssuanceOfIndustry`,

      query: {
        ...record,
      },
    });
  };

  const viewRecord10 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      pathname: `/skySignLicense/report/industryCertificateReport`,
      // pathname: `/skySignLicense/transactions/reIssuanceOfIndustry`,

      query: {
        ...record,
      },
    });
  };

  //OnSearch
  // const onSearchForm = (formData) => {
  //   const finalBodyForApi = {
  //     ...formData,
  //   };

  //   axios
  //     .get(
  //       `${urls.SSLM}/License/getDataByLiscenceNo?licenseNo=${formData.licenseNo}`
  //     )
  //     .then((res) => {
  //       console.log(res);
  //       setDataSource(
  //         res.data.trnApplicantDetails.map((r, i) => ({
  //           id: r.id,
  //           srNo: i + 1,
  //           licenseType: r.licenseType,
  //           licenseNo: r.licenseNo,
  //           applicantName: r.applicantName,
  //           mobile: r.mobile,
  //           emailAddress: r.emailAddress,
  //           applicationNumber: r.applicationNumber,
  //           organizationname: r.organization_name,
  //           gstNo: r.gstNo,
  //         }))
  //       );
  //     });
  // };

 





  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex: 1,
      width: 100,
    },
    {
      field: "licenseType",
      headerName: "License Type",
      // flex: 1,
      width: 100,
    },
    {
      field: "licenseNo",
      headerName: "License No",
      // flex: 1,
      width: 100,
    },
    {
      field: "applicantName",
      headerName: "Name",
      // type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      // type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "emailAddress",
      headerName: "EmailAddress",
      // type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "applicationNumber",
      headerName: "Application No",
      // type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "organizationname",
      headerName: "Organazation Name",
      // type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "gstNo",
      headerName: "Gst",
      //type: "number",
      // flex: 1,
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 1500,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <>
              <IconButton onClick={() => viewRecord(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  View Form
                </Button>
                {/* <VisibilityIcon /> */}
              </IconButton>

              <IconButton onClick={() => viewRecord8(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  View Document
                </Button>
                {/* <VisibilityIcon /> */}
              </IconButton>
              {/* <IconButton
              > */}
              {/* <Button
                  endIcon={<VisibilityIcon />}
                  size='small'
                  onClick={() => viewRecord7(record.row)}
                >
                  View Document
                </Button> */}
              {/* </IconButton> */}

              {/** Site Visit Modal */}

              <IconButton onClick={() => viewRecord3(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  Schedule Site Visit
                </Button>
              </IconButton>

              <IconButton onClick={() => viewRecord2(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  Site Visit
                </Button>
              </IconButton>

              <IconButton onClick={() => viewRecord5(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  LOI Generation
                </Button>
              </IconButton>

              <IconButton onClick={() => viewRecord4(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  LOI Recipt
                </Button>
              </IconButton>
              <IconButton onClick={() => viewRecord6(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  LOI Collection
                </Button>
              </IconButton>

              <IconButton onClick={() => viewRecord7(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  Payment Reciept
                </Button>
              </IconButton>

              <IconButton onClick={() => viewRecord9(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  Certificate Generation
                </Button>
              </IconButton>

              <IconButton>
                <Button
                  endIcon={<VisibilityIcon />}
                  size="small"
                  onClick={() => loiModalFun(params.row)}
                >
                  View Certificate
                </Button>
                {/* <VisibilityIcon /> */}
              </IconButton>

              <IconButton
              // onClick={() => viewRecord(record.row)}
              >
                <Button size="small">Approval</Button>
                {/* <VisibilityIcon /> */}
              </IconButton>
            </>
          </>
        );
      },
    },
  ];


    // cancell Button
    const cancellButton = () => {
      reset({
        ...resetValuesCancell,
        id,
      });
    };


      // Reset Values Cancell
  const resetValuesCancell = {
    // fromDate: null,
    // toDate: null,
    applicantName: "",
    licenseNo: "",
    mobile: "",
    emailAddress: "",
    applicationNumber: "",
    organizationname: "",
    gstNo: "",
  };
  // View
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          border: 1,
          padding: 1,
        }}
      >
        <div
          style={{
            // backgroundColor: "#0084ff",
            backgroundColor: "#556CD6",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
          Work Flow
          {/* <FormattedLabel id='aadharAuthentication' /> */}
        </div>
        {/* {isOpenCollapse && ( */}
        {/* <Slide direction='down' in={slideChecked} mountOnEnter unmountOnExit> */}
        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className={styles.small}>
                <div className={styles.row}>
                  <div className={styles.fieldss}>
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120, marginTop: "5vh" }}
                      error={!!errors.licenseType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        License Type
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={inputState}
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="License Type"
                          >
                            {licenseTypes &&
                              licenseTypes.map((licenseType, index) => (
                                <MenuItem key={index} value={licenseType.id}>
                                  {licenseType.licenseType}

                                  {/* {language == 'en'
                                        ?
                                        licenseType?.licenseType
                                        : licenseType?.licenseTypeMar} */}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="licenseType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.licenseType
                          ? errors.licenseType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className={styles.fieldss}>
                    <TextField
                      autoFocus
                      sx={{ width: 250, marginTop: "5vh" }}
                      id="standard-basic"
                      label="License No"
                      variant="standard"
                      {...register("licenseNo")}
                      error={!!errors.licenseNo}
                      helperText={
                        errors?.licenseNo ? errors.licenseNo.message : null
                      }
                    />
                  </div>
                  <div className={styles.fieldss}>
                    <TextField
                      sx={{ width: 250, marginTop: "5vh" }}
                      id="standard-basic"
                      label="Name "
                      variant="standard"
                      // value={dataInForm && dataInForm.religion}
                      {...register("applicantName")}
                      error={!!errors.applicantName}
                      helperText={
                        errors?.applicantName
                          ? errors.applicantName.message
                          : null
                      }
                    />
                  </div>
                  <div className={styles.fieldss}>
                    <TextField
                      sx={{ width: 250, marginTop: "5vh" }}
                      id="standard-basic"
                      label="Mobile No"
                      variant="standard"
                      // value={dataInForm && dataInForm.religion}
                      {...register("mobile")}
                      error={!!errors.mobile}
                      helperText={errors?.mobile ? errors.mobile.message : null}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.fieldss}>
                    <TextField
                      sx={{ width: 250, marginTop: "5vh" }}
                      id="standard-basic"
                      label="EmailAddress"
                      variant="standard"
                      // value={dataInForm && dataInForm.religion}
                      {...register("emailAddress")}
                      error={!!errors.emailAddress}
                      helperText={
                        errors?.emailAddress
                          ? errors.emailAddress.message
                          : null
                      }
                    />
                  </div>
                  <div className={styles.fieldss}>
                    <TextField
                      sx={{ width: 250, marginTop: "5vh" }}
                      id="standard-basic"
                      label="Application No"
                      variant="standard"
                      // value={dataInForm && dataInForm.religion}
                      {...register("applicationNumber")}
                      error={!!errors.applicationNumber}
                      helperText={
                        errors?.applicationNumber
                          ? errors.applicationNumber.message
                          : null
                      }
                    />
                  </div>
                  <div className={styles.fieldss}>
                    <TextField
                      sx={{ width: 250, marginTop: "5vh" }}
                      id="standard-basic"
                      label="Organazation Name"
                      variant="standard"
                      // value={dataInForm && dataInForm.religion}
                      {...register("organizationname")}
                      error={!!errors.organizationname}
                      helperText={
                        errors?.organizationname
                          ? errors.organizationname.message
                          : null
                      }
                    />
                  </div>
                  <div className={styles.fieldss}>
                    <TextField
                      sx={{ width: 250, marginTop: "5vh" }}
                      id="standard-basic"
                      label="Gst"
                      variant="standard"
                      // value={dataInForm && dataInForm.gstNo}
                      {...register("gstNo")}
                      error={!!errors.gstNo}
                      helperText={errors?.gstNo ? errors.gstNo.message : null}
                    />
                  </div>
                </div>
                <div className={styles.btn}>
                  <div className={styles.btn1}>
                        <Button
                        sx={{ marginRight: 8 }}
                          type='submit'
                          variant='contained'
                          color='success'
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
                      </div>

                      <div className={styles.btn1}>
                        <Button
                         sx={{ marginRight: 8 }}
                          variant='contained'
                          color='primary'
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                      </div>
                  <div className={styles.btn1}>
                        <Button
                         sx={{ marginRight: 8 }}
                          variant='contained'
                          color='error'
                          endIcon={<ExitToAppIcon />}
                          // onClick={() => exitButton()}
                          onClick={() => router.push(`./workFlow`)}
                        >
                         <FormattedLabel id="exit" />
                        </Button>
                      </div>
                  {/* <div className={styles.btn1}>
                    <Button
                      // onClick={()=>}
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<GridSearchIcon />}
                    >
                      {btnsearchText}
                    </Button>{" "}
                  </div> */}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
        {/* </Slide> */}
        {/* )} */}
        {/* <div className={styles.addbtn}>
          <Button
            variant='contained'
            endIcon={<AddIcon />}
            type='primary'
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setBtnSearchText("Search");
              setButtonInputState(true);
              setSlideChecked(true);
              // setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            Add{" "}
          </Button>
        </div> */}
        <DataGrid
          autoHeight
          sx={{
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },

            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
        />
      </Paper>
      <Grid
        container
        sx={{
          marginTop: 1000,
          marginBottom: 5,
          marginLeft: 5000,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        <Paper>
          <Modal
            open={viewcertificate}
            onClose={viewcertificateClose}
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
                height: "200px",
                width: "500px",
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
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0084ff",
                  }}
                >
                  <h3 id="parent-modal-description" style={{ color: "white" }}>
                    View Certificate
                  </h3>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sm={2}
                  md={4}
                  lg={6}
                  xl={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0084ff",
                    color: "white",
                  }}
                ></Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{
                    mt: "30px",
                    mb: "30px",
                    ml: "30px",
                    mr: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Stack direction="row" spacing={10}>
                    <Button
                      sx={{ width: 150 }}
                      variant="contained"
                      onClick={(record3) => {
                        router.push({
                          // pathname: `/skySignLicense/transactions/components/FormPreview`,
                          pathname: `/skySignLicense/report/industryCertificateReport`,
                          // pathname: `/skySignLicense/transactions/reIssuanceOfIndustry`,

                          query: {
                            ...record3,
                          },
                        });
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      sx={{ width: 150 }}
                      variant="contained"
                      onClick={() => {
                        digitalModalFun();
                      }}
                    >
                      Generate Certificate
                    </Button>
                  </Stack>
                </Grid>
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
                    variant="contained"
                    size="small"
                    onClick={viewcertificateClose}
                  >
                    Exit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Modal>
        </Paper>
      </Grid>

      <Grid
        container
        sx={{
          marginTop: 1000,
          marginBottom: 5,
          marginLeft: 5000,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        <Paper>
          <Modal
            open={digital}
            onClose={digitalClose}
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
                height: "250px",
                width: "500px",
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
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0084ff",
                  }}
                >
                  <h3 id="parent-modal-description" style={{ color: "white" }}>
                    Generate Certificate
                  </h3>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sm={2}
                  md={4}
                  lg={6}
                  xl={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0084ff",
                    color: "white",
                  }}
                ></Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{
                    mt: "30px",
                    mb: "30px",
                    ml: "30px",
                    mr: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Stack direction="row" spacing={10}>
                    <Button
                      sx={{ width: 100 }}
                      variant="contained"
                      onClick={() => {
                        insertdigitalFun();
                      }}
                    >
                      Approval With Digital
                    </Button>
                    <Button
                      sx={{ width: 100 }}
                      variant="contained"
                      onClick={() => {
                        sweetAlert("Approved Successfully");
                        //  setIsOpenCollapse("true");
                      }}
                    >
                      Proceed Without Digital
                    </Button>
                  </Stack>
                </Grid>
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
                    variant="contained"
                    size="small"
                    onClick={digitalClose}
                  >
                    Exit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Modal>
        </Paper>
      </Grid>

      <Grid
        container
        sx={{
          marginTop: 1000,
          marginBottom: 5,
          marginLeft: 5000,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        <Paper>
          <Modal
            open={insertdigital}
            onClose={insertdigitalClose}
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
                height: "200px",
                width: "500px",
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
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0084ff",
                  }}
                >
                  <h3 id="parent-modal-description" style={{ color: "white" }}>
                    Insert Your Digital Key
                  </h3>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sm={2}
                  md={4}
                  lg={6}
                  xl={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0084ff",
                    color: "white",
                  }}
                ></Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{
                    mt: "30px",
                    mb: "30px",
                    ml: "30px",
                    mr: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Stack direction="row" spacing={10}>
                    <Button
                      sx={{ width: 150 }}
                      variant="contained"
                      onClick={() => {
                        sweetAlert("Approved Successfully");
                        //  setIsOpenCollapse("true");
                      }}
                    >
                      Apply
                    </Button>
                  </Stack>
                </Grid>
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
                    variant="contained"
                    size="small"
                    onClick={insertdigitalClose}
                  >
                    Exit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Modal>
        </Paper>
      </Grid>
    </>
  );
};

export default Index;
