import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useDispatch } from "react-redux";

import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FileTable from "../../../../components/newsRotationManagementSystem/FileUpload/FileTable";
import { catchExceptionHandlingMethod } from "../../../../util/util";
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);
  const [cutNews, setCutNews] = useState("");
  const [caseEntry, setCaseEntry] = useState([]);
  const [allTabelData, setAllTabelData] = useState([]);
  const [ward, setWard] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [subGroup, setSubGroup] = useState([]);
  const [department, setDepartment] = useState([]);
  const [parameterName, setParameterName] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [number, setNumber] = useState("");
  const [aOneForm, setAOneForm] = useState();
  const [newsRequest, setNewsRequest] = useState("");
  const [newsLevel, setNewsLevel] = useState("");
  const [newsRequestDoc, setNewsRequestDoc] = useState("");
  const [zone, setZone] = useState("");
  const [image, setImage] = useState();
  const [selectedObject, setSelectedObject] = useState();
  const [valueData, setValueData] = useState();
  const [updateData, setUpdateData] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const [rotationSubGroup, setRotationSubGroup] = useState();
  const [isdisabled, setIsDisabled] = useState();

  const [editData, setEditData] = useState({});
  const { inputData, setInputData } = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
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
  //file attach

  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  // const [slideChecked, setSlideChecked] = useState(false);

  let appName = "NRMS";
  let serviceName = "N-PCB";

  const dispatch = useDispatch();
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDepartment();

    getNewsPaper();
  }, []);

  const user = useSelector((state) => state.user.user);
  // console.log("user", user);
  // selected menu from drawer
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);
  const getAllEditTableData = (id) => {
    axios.get(`${urls.NRMS}/trnPaperCuttingBook/getAll`)
    .then((r) => {
      console.log(
        ":aaaa",
        id,
        r.data.trnPaperCuttingBookList.find((row) => id == row.id)
      );
      setValueData(r.data.trnPaperCuttingBookList.find((row) => id == row.id));
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };
  console.log("valueData", valueData);

  useEffect(() => {
    let _res = valueData;

    console.log("editData", valueData);
    if (btnSaveText === "Update") {
      setValue(
        "departmentName",
        _res?.departmentName ? _res?.departmentName : "-"
      );
      setValue(
        "newspaperName",
        _res?.newspaperName ? _res?.newspaperName : "-"
      );

      setValue("fromDate", _res?.fromDate ? _res?.fromDate : "-");

      setValue("attachement", _res?.attachement ? _res?.attachement : "-");
    }
  }, [valueData]);

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department);
      // console.log("res.data", r.data);
    }) .catch((error) => {
      callCatchMethod(error, language);
    })
  };
  const getNewsPaper = () => {
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`)
    .then((r) => {
      setNewsPaper(
        r?.data?.newspaperMasterList?.map((r, i) => ({
          id: r.id,
          newspaperName: r.newspaperName,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  useEffect(() => {
    if (router.query.id != undefined) {
      getAllEditTableData(router.query.id);
      setBtnSaveText("Update");
      console.log("hwllo", router.query.id);
    }
  }, [router.query.id]);

  useEffect(() => {
    getAllTableData();
    getAllPressData();
  }, [fetchData]);
  let approvalId = router?.query?.id;

  const getAllPressData = () => {
    axios.get(`${urls.NRMS}/trnNewsPublishRequest/getAll`)
    .then((r) => {
      let result = r.data.trnNewsPublishRequestList;
      console.log("getAllTableData", result);

      result &&
        result.map((each) => {
          if (each.id == approvalId) {
            setSelectedObject(each);
          }
        });
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  // Get Table - Data
  const getAllTableData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnPaperCuttingBook/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 435,
        },
      })
      .then((r) => {
        console.log(";rressss", r);
        let result = r.data.trnPaperCuttingBookList;
        console.log("@@@@@@", result);
        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            devisionKey: r.divisionKey,
            srNo: i + 1,
            id: r.id,
            attachement: r.attachement,
            departmentName: r.departmentName,
            newspaperName: r.newspaperName,

            sequenceNumber: r.sequenceNumber,
            publishedDate: r.publishedDate,
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  const onSubmitForm = (formData) => {
    let temp = [];
    const fileObj = {};
    temp = [{ ...fileObj, attachement: cutNews }];

    let _formData = {
      ...formData,
      attachement: temp[0].attachement,
      activeFlag: formData.activeFlag,
    };
    console.log("cutNews", temp);

    // console.log("Attachement",newsAttachement)
    if (btnSaveText === "Save") {
      console.log("_body", _formData);
      const tempData = axios
        .post(`${urls.NRMS}/trnPaperCuttingBook/save`, _formData)
        .then((res) => {
          console.log("res---", res);
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setButtonInputState(false);
            // setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            router.push({
              pathname:
                "/newsRotationManagementSystem/transaction/paperCuttingBook/",
              query: {
                pageMode: "View",
              },
            });
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("_body", valueData, _formData);
      let _formData = {
        ...formData,
        attachement: temp[0].attachement,
        activeFlag: formData.activeFlag,
      };
      console.log("cutNews", temp);

      console.log("payload", _formData);

      const tempData = axios
        .post(`${urls.NRMS}/trnPaperCuttingBook/save`, _formData)
        .then((res) => {
          console.log(":res", res);
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                  language === "en" ? "Updated!" : "अपडेट केले!",
                  language === "en"
                    ? "Record Updated successfully!"
                    : "रेकॉर्ड यशस्वीरित्या अपडेट केले",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
              : sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                );
            getAllTableData();
            // setButtonInputState(false);
            setEditButtonInputState(true);
            router.push({
              pathname:
                "/newsRotationManagementSystem/transaction/paperCuttingBook/",
              query: {
                pageMode: "View",
              },
            });
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  // console.log("data.status === 6",data.status ==5)
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    router.push({
      pathname: "/newsRotationManagementSystem/transaction/paperCuttingBook/",
      query: {
        pageMode: "View",
      },
    });
  };

  //   const [openEntryConnections, setOpenEntryConnections] = React.useState(false);
  //   const handleOpenEntryConnections = () => setOpenEntryConnections(true);
  //   const handleSearchConnections = () => {
  //     handleOpenEntryConnections();
  //     console.log("newsPublishRequestNo", id);
  //     axios
  //       .get(
  //         `${urls.NRMS}/trnNewsPublishRequest/getDetailsByNewsPublishRequestNo?newsPublishRequestNo=newsRotationManagementSystem/ADVT30/03/2023/000016`,
  //         {},
  //       )
  //       .then((r) => {
  //         let result = r.data.trnNewsPublishRequestList;
  //         console.log("result", result);
  //         result &&
  //           result.map((each) => {
  //             if (each?.newsPublishRequestNo == number) {
  //               setSelectedObject(each);
  //             }
  //           });

  //         let _res = result.map((r, i) => {
  //           console.log("r", r);
  //           return {
  //             activeFlag: r.activeFlag,
  //             id: r.id,
  //             srNo: i + 1,
  //             consumerNo: r.consumerNo,
  //             consumerName: r.consumerName,
  //             consumerNameMr: r.consumerNameMr,
  //             consumerAddress: r.consumerAddress,
  //             consumerAddressMr: r.consumerAddressMr,
  //             meterNo: r.meterNo,
  //           };
  //         });
  //       });
  //   };

  const [flagSearch, setFlagSearch] = useState(false);
  //   const [data, setData] = useState();

  const handleSearch = () => {
    let temp = watch("newsRotationNumber");
    console.log("type", typeof temp);
    let bodyForApi = {
      newsRotationNumber: temp,
    };

    axios
      .get(
        `${urls.NRMS}/trnNewsPublishRequest/getDetailsByNewsPublishRequestNo?newsPublishRequestNo=newsRotationManagementSystem/ADVT30/03/2023/000016`,
        bodyForApi
        // allvalues,
      )
      .then((res) => {
        if (res.status == 200) {
          swal(
            language === "en" ? "Success!" : "यश!",
            language === "en"
              ? "Record Searched successfully !"
              : "रेकॉर्ड यशस्वीरित्या शोधले",
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
          setData(res.data);
          setFlagSearch(true);
          setValue("otitleM", res.data.otitle);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };

  const resetValuesCancell = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    newsAttachement: "",
  };

  const resetValuesExit = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    id: null,
    newsAttachement: "",
  };

  const _columns = [
    // {
    //   headerName: "Sr.No",
    //   field: "srNo",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: "File Name",
      field: "originalFileName",
      // File: "originalFileName",
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
      field: "Action",
      headerName: "Action",
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                  "_blank"
                );
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",

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
          <h2>Paper Cutting Book</h2>
        </Box>

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid>
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
                  <Grid item xl={10} lg={10} md={10} sm={10} xs={10}>
                    <TextField
                      id="standard-textarea"
                      label="Search News Request Number"
                      sx={{ m: 1, minWidth: "90%", width: 300 }}
                      variant="standard"
                      onChange={(e) => {
                        setNumber(e.target.value);
                      }}
                      error={!!errors.newsRotationNumber}
                      helperText={
                        errors?.newsRotationNumber
                          ? errors.newsRotationNumber.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                    <Button
                      variant="outlined"
                      color="success"
                      endIcon={<SearchIcon />}
                      //   onClick={handleSearchConnections}
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  {/* Date Picker */}
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "start",
                    }}
                  >
                    {/* {console.log("approvalId",approvalId)} */}
                    <TextField
                      id="standard"
                      label="Paper Cutting Sequence Number"
                      required
                      // value={approvalId}
                      sx={{ width: 300 }}
                      value={selectedObject?.releasingOrderNumber}
                      multiline
                      variant="standard"
                      // {...register("sequenxcceNumber")}
                      // error={!!errors.sequenxcceNumber}
                      // helperText={
                      //     errors?.sequenxcceNumber ? errors.sequenxcceNumber.message : null
                      // }
                      InputLabelProps={{
                        //true
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.concenDeptId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="locationName" />} */}
                        Newspaper Name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // required
                            // disabled={router?.query?.pageMode === "View"}
                            // sx={{ m: 1, minWidth: '50%' }}
                            sx={{ width: 300 }}
                            value={field.value}
                            // onChange={(value) => field.onChange(value)}
                            {...register("newspaperName")}
                            //   label={<FormattedLabel id="locationName" />}
                          >
                            {newsPaper &&
                              newsPaper.map((newsPaper, index) => (
                                <MenuItem
                                  key={index}
                                  value={newsPaper.newspaperName}
                                >
                                  {newsPaper.newspaperName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="newspaperName"
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

                  {/* from date in marathi */}

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      // size="small"
                      // sx={{ m: 1, minWidth: 120 }}
                      error={!!errors.concenDeptId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="de     partment" />} */}
                        Department Name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // disabled={router?.query?.pageMode === "View"}
                            sx={{ width: 300 }}
                            value={field.value} // value={departmentName}
                            {...register("departmentName")}
                            //   label={<FormattedLabel id="department" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {department &&
                              department.map((department, index) => (
                                <MenuItem
                                  key={index}
                                  value={department.department}
                                >
                                  {department.department}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="departmentName"
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

                  {/* to date in marathi */}

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      style={{ marginTop: 10 }}
                      error={!!errors.publishedDate}
                    >
                      <Controller
                        control={control}
                        name="publishedDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Published Date
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
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  sx={{ width: 300 }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.publishedDate
                          ? errors.publishedDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                {/* Attachement */}
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "30px",
                    background:
                      "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  }}
                >
                  <h2>
                    Attachement
                    {/* <FormattedLabel id="addHearing" /> */}
                  </h2>
                </Box>

                <Grid container sx={{ padding: "10px" }}>
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
                      alignItems: "start",
                    }}
                    p={1}
                    style={{
                      margin: "25px",
                    }}
                  >
                    {/* <Typography>
                      <h3>Attach News</h3>
                    </Typography> */}
                  </Grid>
                  <Grid item xs={12}>
                    <FileTable
                      appName="NRMS" //Module Name
                      serviceName={"N-PCB"} //Transaction Name
                      fileName={attachedFile} //State to attach file
                      filePath={setAttachedFile} // File state upadtion function
                      newFilesFn={setAdditionalFiles} // File data function
                      columns={_columns} //columns for the table
                      rows={finalFiles} //state to be displayed in table
                      uploading={setUploading}
                      showNoticeAttachment={router.query.showNoticeAttachment}
                    />
                  </Grid>
                  {/* <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "start",
                    }}
                    p={1}
                    style={{ margin: "20px" }}
                  >
                    <UploadButton
                      appName="TP"
                      serviceName="PARTMAP"
                      fileUpdater={setCutNews}
                      filePath={cutNews}
                    />
                  </Grid> */}
                </Grid>

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "50px",
                  }}
                >
                  {/* sdfgtjhdty */}
                  <Grid container ml={5} border px={5}>
                    {/* Save ad Draft */}

                    <Grid item xs={2}></Grid>

                    <Grid item>
                      <Button
                        // sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText === "Save"
                          ? // <FormattedLabel id="update" />
                            "Update"
                          : // <FormattedLabel id="save" />
                            "Save"}
                      </Button>
                    </Grid>

                    <Grid item xs={2}></Grid>

                    <Grid item>
                      <Button
                        // sx={{ marginRight: 8 }}
                        variant="contained"
                        color="warning"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        {/* <FormattedLabel id="clear" /> */}
                        Clear
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {/* <FormattedLabel id="exit" /> */}
                        Exit
                      </Button>
                    </Grid>
                  </Grid>

                  {/* dsghfjhyfjfhjkfhy */}
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Paper>
    </>
  );
};

export default Index;
