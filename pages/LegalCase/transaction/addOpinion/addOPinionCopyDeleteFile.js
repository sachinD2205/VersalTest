import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/LegalCaseSchema/addOpinionSchema";
import { Delete, Visibility } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../features/labelSlice";
import styles from "../../../../styles/LegalCase_Styles/opinion.module.css";
import urls from "../../../../URLS/urls";
import Documents from "./Documents";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const View = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    watch,
    reset,
    getValues,

    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const router = useRouter();

  // const token = useSelector((state) => state.user.user.token);
  // const [advocateNames1, setadvocateName1] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [activeStep, setActiveStep] = useState(0);

  const token = useSelector((state) => state.user.user.token);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);

  const [advocateNames, setadvocateName] = useState([]);

  const [isOpenCollapse1, setIsOpenCollapse1] = useState(false);
  const [isOpenCollapse2, setIsOpenCollapse2] = useState(false);

  const [personName, setPersonName] = React.useState([]);

  const [personName1, setPersonName1] = React.useState([]);

  const _opinionRequestDate = watch("opinionRequestDate");

  const _concenDeptId = watch("concenDeptId");
  const _opinionSubject = watch("opinionSubject");
  const _officeLocation = watch("officeLocation");

  const [document, setDocument] = useState([]);
  const [completed, setCompleted] = useState({});
  const [opinionDetails, setOpinionDetails] = useState({});

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

  // const isLastStep = () => {
  //   return activeStep === totalSteps() - 1;
  // };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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

  console.log("personName1", personName, "personName2", personName1);

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

  const getAdvocateNames = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // let advs=
        // setadvocateName1(
        //   advs );
        setadvocateName(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            FullName: r.firstName + "  " + r.middleName + "  " + r.lastName,
            FullNameMr:
              r.firstNameMr + "  " + r.middleNameMr + "  " + r.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getAdvocateNames();
    getDeptName();
    getOfficeName();
    // getAllOpinion();
  }, []);

  useEffect(() => {
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "View" ||
      router.query.pageMode == "Opinion"
    ) {
      // setValue("opinionSubject", router.query.opinionSubject),
      console.log("Data------", router.query);
      console.log("advPanel------", router.query.advPanel);
      axios
        .get(
          `${urls.LCMSURL}/transaction/opinion/getById?id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("ghfgf", res);
          reset(res.data);

          setValue(
            "reportAdvLst",
            res.data.reportAdvPanelList.map((ra) => ra)
          );
          setValue(
            "opinionAdvLst",
            res.data.opinionAdvPanelList.map((ra) => ra)
          );

          setValue(
            "reportAdvPanelList",
            res.data.reportAdvPanelList.map((ra) => ra.advocate)
          );
          setValue(
            "opinionAdvPanelList",
            res.data.opinionAdvPanelList.map((pa) => pa.advocate)
          );
          console.log("getValues", getValues("opinionAdvPanelList"));
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
      // reset(router.query);
    }
  }, []);

  useEffect(() => {
    setFinalFiles([...additionalFiles]);
  }, [additionalFiles]);

  const getDeptName = () => {
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

  // get Office Name
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
            officeLocationNameMar: r.officeLocationNameMar,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // // get Opinion
  // const getAllOpinion = (_pageSize = 10, _pageNo = 0) => {
  //   console.log("_pageSize,_pageNo", _pageSize, _pageNo);
  //   axios
  //     .get(`${urls.LCMSURL}/transaction/opinion/getAll`, {
  //       params: {
  //         pageSize: _pageSize,
  //         pageNo: _pageNo,
  //       },
  //     })
  //     .then((r) => {
  //       console.log("r", r);
  //       let result = r.data.opinion;
  //       console.log("result", result);

  //       let _res = result.map((r, i) => {
  //         console.log("44");
  //         return {
  //           // r.data.map((r, i) => ({
  //           activeFlag: r.activeFlag,

  //           id: r.id,
  //           srNo: i + 1,
  //           opinionRequestDate: moment(r.opinionRequestDate).format(
  //             "YYYY-MM-DD"
  //           ),

  //           searchTitleRptDate: moment(r.searchTitleRptDate).format(
  //             "YYYY-MM-DD"
  //           ),

  //           finalDraftDeliveryDate: moment(r.finalDraftDeliveryDate).format(
  //             "YYYY-MM-DD"
  //           ),
  //           opinionSubject: r.opinionSubject,
  //           // concenDeptName: r.concenDeptName,
  //           concenDeptId: r.concenDeptId,
  //           concenDeptName: concenDeptNames?.find(
  //             (obj) => obj?.id === r.concenDeptId
  //           )?.department,

  //           advPanel: r.advPanel,
  //           panelRemarks: r.panelRemarks,
  //           reportRemarks: r.reportRemarks,
  //           remarks: r.remarks,
  //           opinionSubmisionDate: moment(r.opinionSubmisionDate).format(
  //             "YYYY-MM-DD"
  //           ),
  //           opinion: r.opinion,
  //           officeLocation: r.officeLocation,
  //           officeLocationNameText: officeName?.find(
  //             (obj) => obj?.id === r.officeLocation
  //           )?.officeLocationName,
  //           officeLocationNameTextMr: officeName?.find(
  //             (obj) => obj?.id === r.officeLocation
  //           )?.officeLocationNameMr,

  //           department: r.department,
  //           department: concenDeptNames?.find(
  //             (obj) => obj?.id === r.concenDeptId
  //           )?.department,
  //           departmentMr: concenDeptNames?.find(
  //             (obj) => obj?.id === r.concenDeptId
  //           )?.department,

  //           opinionMr: r.opinionMr,

  //           panelRemarks: r.panelRemarks,
  //           panelRemarksMr: r.panelRemarksMr,

  //           courtCaseNumber: r.courtCaseNumber,

  //           filedBy: r.filedBy,
  //           filedByMr: r.filedByMr,
  //           caseDetails: r.caseDetails,
  //           caseDetailsMr: r.caseDetailsMr,

  //           status: r.activeFlag === "Y" ? "Active" : "Inactive",
  //         };
  //       });
  //       // setDataSource([..._res]);
  //       // setData({
  //       //   rows: _res,
  //       //   totalRows: r.data.totalElements,
  //       //   rowsPerPageOptions: [10, 20, 50, 100],
  //       //   pageSize: r.data.pageSize,
  //       //   page: r.data.pageNo,
  //       // });
  //     });
  // };

  // final submit
  const onSubmitForm = (data) => {
    console.log("additionalFiles", additionalFiles);
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    // handleNext();

    setDocument(
      additionalFiles.map((Obj, index) => {
        return {
          attachedNameEn: Obj.attachedNameEn,
          attachedNameMr: Obj.attachedNameMr,
          attachedDate: Obj.attachedDate,
          originalFileName: Obj.originalFileName,
          attachmentNameEng: Obj.attachmentName,
          extension: Obj.extension,
        };
      })
    );

    console.log("callleddd");

    const bodyForAPI = {
      ...data,
      ...opinionDetails,
      id: router?.query?.id,
      //role kuthy ith
      role: "ADD_OPINION",
      // status:"ADD_OPINION_SUBMITTED",
      // status: router.query.advPanel ? "ADD_OPINION_SUBMITTED" : "ABCD",
      status: "ADD_OPINION_SUBMITTED",
      timeStamp: moment(new Date()).unix().toString(),
      // noticeAttachment: faltugiri,
      reportAdvPanelList: data?.reportAdvLst?.map((rpt) => {
        if (rpt.advocate == getValues("reportAdvPanelList")) {
          return {
            ...rpt,
            remark: data?.reportTitleAdvocateOpinion
              ? data?.reportTitleAdvocateOpinion
              : null,
            remarkMr: data?.reportTitleAdvocateOpinionMr
              ? data?.reportTitleAdvocateOpinionMr
              : null,
          };
        }
      }),
      opinionAdvPanelList: data?.opinionAdvLst?.map((rpt) => {
        if (rpt.advocate == getValues("opinionAdvPanelList")) {
          return {
            ...rpt,
            remark: data?.panelAdvocateOpinion
              ? data?.panelAdvocateOpinion
              : null,
            remarkMr: data?.panelAdvocateOpinionMr
              ? data?.panelAdvocateOpinionMr
              : null,
          };
        }
      }),

      trnOpinionAttachmentDao: JSON.parse(
        localStorage.getItem("trnOpinionAttachmentDao")
      ),
    };

    console.log("Final Data: ", bodyForAPI);

    //  if(opinionAdvPanelList){
    //   console.log("opinionAdvPanelList",opinionAdvPanelList)
    //   axios
    //   .post(`${urls.LCMSURL}/opinionAdvocatePanel/save`, bodyForAPI, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }).then((res) => {
    //     if (res.status == 200) {
    //       sweetAlert("Saved!", "Record Saved successfully !", "success");
    //       router.push(`/LegalCase/transaction/opinion/`);
    //       localStorage.removeItem("trnOpinionAttachmentDao");
    //     }
    //   });

    //  }
    //  else{
    //   axios
    //   .post(`${urls.LCMSURL}/reportAdvocatePanel/save`, bodyForAPI, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }).then((res) => {
    //     if (res.status == 200) {
    //       sweetAlert("Saved!", "Record Saved successfully !", "success");
    //       router.push(`/LegalCase/transaction/opinion/`);
    //       localStorage.removeItem("trnOpinionAttachmentDao");
    //     }
    //   });

    //  }

    axios
      .post(`${urls.LCMSURL}/transaction/opinion/save`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/LegalCase/transaction/opinion/`);
          localStorage.removeItem("trnOpinionAttachmentDao");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    if (router.query.pageMode == "PanelAdv") {
      console.log("advPanel------", router.query.advPanel);
      reset(router.query);
    }
  }, []);

  const columns = [
    // {
    //   headerName: 'Sr.No',
    //   field: 'srNo',
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: "File Name",
      // field: "fileLabel",
      File: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 140,
    },
    {
      headerName: "Uploaded By",
      field: "uploadedBy",
      flex: 1,
      // width: 300,
    },
    {
      headerName: "action",
      field: "Action",
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.fileName}`,
                  "_blank"
                );
              }}
            >
              <Visibility />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => discard(record.row.fileName, record.row.srNo)}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  // reportAdvocateIds:[{
  //   opinionRequestDate:opinionRequestDate,
  //   concenDeptId:concenDeptId,
  //   opinionSubject:opinionSubject,
  //   panelRemarks:panelRemarks
  // }]

  // View
  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          // marginLeft: "10px",
          // marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="advocateOpinion" />
          </h2>
        </Box>

        <Divider />

        <Box
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
            // border:1,
            // borderColor:'grey.500'
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {/* First Row */}

              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xl={3}
                  lg={3}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={
                    {
                      // display: "flex",
                      // justifyContent: "center",
                      // alignItems: "center",
                    }
                  }
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
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            // disabled={router?.query?.pageMode === "View"}
                            disabled
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {/* Opinion Request Date */}

                                {<FormattedLabel id="opinionRequestDate" />}
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
                                {...params}
                                size="small"
                                variant="standard"
                                // sx={{ width: 230 }}
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

                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  <FormControl
                    // variant="outlined"
                    variant="standard"
                    // size="small"
                    sx={{ m: 1, width: 200 }}
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
                          // sx={{ width: 200 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="locationName" />}
                        >
                          {officeName &&
                            officeName.map((officeLocationName, index) => (
                              <MenuItem
                                key={index}
                                value={officeLocationName.id}
                              >
                                {language == "en"
                                  ? officeLocationName?.officeLocationName
                                  : officeLocationName?.officeLocationNameMar}
                              </MenuItem>
                            ))}
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
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  <FormControl
                    // variant="outlined"
                    variant="standard"
                    sx={{ m: 1, minWidth: 200 }}
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
                          // sx={{ width: 230 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="deptName" />}
                        >
                          {concenDeptNames &&
                            concenDeptNames.map((department, index) => (
                              <MenuItem key={index} value={department.id}>
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

                {/* Search Title Report Datepicker */}
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  <FormControl variant="standard">
                    <Controller
                      control={control}
                      name="searchTitleRptDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {<FormattedLabel id="searchTitleReport" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) =>
                              field.onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={field.value}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // size="small"
                                variant="standard"
                                // sx={{ width: 230 }}
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                    marginTop: 3,
                                  },

                                  //true
                                  shrink:
                                    (watch("searchTitleRptDate")
                                      ? true
                                      : false) ||
                                    (router.query.searchTitleRptDate
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
                      {errors?.searchTitleRptDate
                        ? errors.searchTitleRptDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* For Opinion */}
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  <TextField
                    disabled
                    id="standard-textarea"
                    // label="Opinion Subject"
                    label={<FormattedLabel id="opinionSubject" />}
                    placeholder="Opinion Subject"
                    multiline
                    variant="standard"
                    style={{ width: 224 }}
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

                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  {router.query.advPanel &&
                    getValues("opinionAdvPanelList")?.includes(
                      user.userDao.advocateId
                    ) && (
                      <>
                        <TextField
                          disabled
                          id="standard-textarea"
                          // label="Opinion"
                          // label={<FormattedLabel id="clerkRemark" />}
                          label="Panel Advocate Remarks"
                          style={{ marginLeft: "10px", width: 200 }}
                          // placeholder="Opinion"
                          multiline
                          variant="standard"
                          // style={{ width: 1000, marginTop: "20px" }}
                          {...register("panelRemarks")}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("panelRemarks") ? true : false) ||
                              (router.query.panelRemarks ? true : false),
                          }}
                          error={!!errors.panelRemarks}
                          helperText={
                            errors?.opinion ? errors.panelRemarks.message : null
                          }
                        />
                      </>
                    )}
                </Grid>

                <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                  {router.query.reportAdvPanel &&
                    getValues("reportAdvPanelList")?.includes(
                      user.userDao.advocateId
                    ) && (
                      <>
                        <TextField
                          disabled
                          id="standard-textarea"
                          // label="Opinion"
                          // label={<FormattedLabel id="clerkRemark" />}
                          label="Title Report Remark"
                          // placeholder="Opinion"
                          multiline
                          variant="standard"
                          style={{ width: 200, marginLeft: "10px" }}
                          {...register("reportRemarks")}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("reportRemarks") ? true : false) ||
                              (router.query.reportRemarks ? true : false),
                          }}
                          error={!!errors.panelRemarks}
                          helperText={
                            errors?.opinion ? errors.panelRemarks.message : null
                          }
                        />
                      </>
                    )}
                </Grid>
              </Grid>

              {/* second Row */}

              {router.query.advPanel &&
                getValues("opinionAdvPanelList")?.includes(
                  user.userDao.advocateId
                ) && (
                  <>
                    {/* Third Row */}
                    <Grid container sx={{ padding: "10px" }}>
                      {/* opinin Panel Advoacte */}
                      <Grid item xs={12} xl={12} md={12} sm={12}>
                        <TextField
                          id="standard-textarea"
                          disabled={router?.query?.pageMode === "View"}
                          label={<FormattedLabel id="panalAdvocateOpinionEn" />}
                          // label="Advocate Opinion"
                          multiline
                          variant="standard"
                          style={{ width: 1000 }}
                          // {...register("opinion")}
                          {...register("panelAdvocateOpinion")}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("panelAdvocateOpinion") ? true : false) ||
                              (router.query.panelAdvocateOpinion
                                ? true
                                : false),
                          }}
                          // InputLabelProps={{
                          //   shrink: //true
                          //     (watch("panelAdvocateOpinion") ? true : false) ||
                          //     (router.query.panelAdvocateOpinion ? true : false),
                          // }}
                          error={!!errors.panelAdvocateOpinion}
                          helperText={
                            errors?.panelAdvocateOpinion
                              ? errors.panelAdvocateOpinion.message
                              : " "
                          }
                        />
                      </Grid>

                      {/* Opinion Panel Advoacte Mr */}
                      <Grid item xs={12} xl={12} md={12} sm={12}>
                        <TextField
                          id="standard-textarea"
                          disabled={router?.query?.pageMode === "View"}
                          label={<FormattedLabel id="panalAdvocateOpinionMr" />}
                          multiline
                          variant="standard"
                          style={{ width: 1000 }}
                          {...register("panelAdvocateOpinionMr")}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("panelAdvocateOpinionMr")
                                ? true
                                : false) ||
                              (router.query.panelAdvocateOpinionMr
                                ? true
                                : false),
                          }}
                          error={!!errors.panelAdvocateOpinionMr}
                          helperText={
                            errors?.panelAdvocateOpinionMr
                              ? errors.panelAdvocateOpinionMr.message
                              : " "
                          }
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

              {router.query.reportAdvPanel &&
                getValues("reportAdvPanelList")?.includes(
                  user.userDao.advocateId
                ) && (
                  <>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={12} xl={12} md={12} sm={12}>
                        <TextField
                          id="standard-textarea"
                          disabled={router?.query?.pageMode === "View"}
                          label={
                            <FormattedLabel id="reportAdvocateOpinionEn" />
                          }
                          // label="Advocate Opinion"
                          multiline
                          variant="standard"
                          style={{ width: 1000, marginTop: "10px" }}
                          // {...register("opinion")}
                          {...register("reportTitleAdvocateOpinion")}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("reportTitleAdvocateOpinion")
                                ? true
                                : false) ||
                              (router.query.reportTitleAdvocateOpinion
                                ? true
                                : false),
                          }}
                          // InputLabelProps={{
                          //   shrink: //true
                          //     (watch("opinion") ? true : false) ||
                          //     (router.query.opinion ? true : false),
                          // }}
                          error={!!errors.reportTitleAdvocateOpinion}
                          helperText={
                            errors?.reportTitleAdvocateOpinion
                              ? errors.reportTitleAdvocateOpinion.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        xl={12}
                        md={12}
                        sm={12}
                        // sx={{
                        //   display: "flex",
                        //   justifyContent: "center",
                        //   alignItems: "center",
                        // }}
                      >
                        <TextField
                          id="standard-textarea"
                          disabled={router?.query?.pageMode === "View"}
                          // label="Opinion"
                          label={
                            <FormattedLabel id="reportAdvocateOpinionMr" />
                          }
                          // label="Advocate Opinion Marathi"
                          // placeholder="Opinion"
                          multiline
                          variant="standard"
                          style={{ width: 1000, marginTop: "10px" }}
                          {...register("reportTitleAdvocateOpinionMr")}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("reportTitleAdvocateOpinionMr")
                                ? true
                                : false) ||
                              (router.query.reportTitleAdvocateOpinionMr
                                ? true
                                : false),
                          }}
                          error={!!errors.reportTitleAdvocateOpinionMr}
                          helperText={
                            errors?.reportTitleAdvocateOpinionMr
                              ? errors.reportTitleAdvocateOpinionMr.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

              {/* Document Upload */}

              {/* {isOpenCollapse && (
          
                 )} */}

              <div className={styles.small}>
                <h4
                  style={{
                    marginLeft: "40px",
                    color: "red",
                    fontStyle: "italic",
                    marginTop: "25px",
                  }}
                ></h4>
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {" "}
                      Documents Upload
                    </h3>

                    <h5
                      style={{
                        color: "white",
                        marginTop: "10px",
                        marginLeft: "5px",
                      }}
                    >
                      (Only jpg.jpeg.png.bmp.pdf file allowed to upload. File
                      size should be 2 MB)
                    </h5>
                  </div>
                </div>

                {/* FileTable */}
                <div>
                  {/**
                     * <FileTable
                      appName="LCMS" //Module Name
                      serviceName={"L-Opinion"} //Transaction Name
                      fileName={attachedFile} //State to attach file
                      filePath={setAttachedFile} // File state upadtion function
                      newFilesFn={setAdditionalFiles} // File data function
                      columns={columns} //columns for the table
                      rows={finalFiles} //state to be displayed in table
                      uploading={setUploading}
                      showOpinionAttachment={router.query.showOpinionAttachment}
                    />
                     */}

                  <Documents />
                </div>
              </div>

              {/* Row Button */}

              <Grid container mt={10} ml={5} mb={5} border px={5}>
                <Grid item xs={3.5}></Grid>
                <Grid item>
                  <Button
                    type="Submit"
                    variant="contained"
                    // onClick={finalSubmit}
                  >
                    {/* Submit */}

                    {<FormattedLabel id="submit" />}
                  </Button>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => {
                      localStorage.removeItem("trnOpinionAttachmentDao");
                      router.push(`/LegalCase/transaction/opinion/`);
                    }}
                  >
                    {/* Cancel */}

                    {<FormattedLabel id="cancel" />}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Paper>
      {/* </Box> */}

      {/* </BasicLayout> */}
    </>
  );
};

export default View;
