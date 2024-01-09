import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { Delete } from "@mui/icons-material";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import DOMPurify from "dompurify";

// style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
// NoticeDetails
const NoticeDetails = () => {
  const [loadderState, setLoadderState] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  // {
  // criteriaMode: "all",
  // mode: "onChange",
  // }
  const [open, setOpen] = useState(false);
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state.labels.language);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [tempRowData, setTempRowData] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [isFirstAdd, setIsFirstAdd] = useState(true);
  // For set field name Adv
  const [inputValue, setInputValue] = useState("Adv");
  const [disabledAll, setDisabledAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // HYPERLINKS CHECKED
  const [messageToShowOnError, setMessageToShowOnError] = useState("");
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("");

  // noticeDetails
  const [noticeDetailsFiledChk, setNoticeDetailsFiledChk] = useState(true);
  // noticeDetailsMr
  const [noticeDetailsMrFiledChk, setNoticeDetailsMrFiledChk] = useState(true);

  const error1Messsage = () => {
    if (language == "en") {
      return messageToShowOnError;
    } else {
      return messageToShowOnErrorMr;
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const router = useRouter();

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

  // Modal Close
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setOpen(true);
  };
  // ---------------disabled={disabledAll}---------------------------------
  useEffect(() => {
    if (router?.query?.pageMode === "_VIEW") {
      setDisabledAll(true);
    } else {
      setDisabledAll(false);
    }
  }, [router?.query]);
  // --------------------------Transaltion API--------------------------------
  const noticeDetailsApi = (
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
  // delete dept from table
  const handleDeleteDpt = (props) => {
    console.log("props1", props);
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let rows = rowsData;
        setRowsData([]);
        console.log("deleteeeeee");
        if (props?.id) {
          setLoadderState(true);
          console.log("bbbbbbbb", loadderState);
          let _delItem = rows?.map((row, i) => {
            if (row?.id == props?.id) {
              return {
                ...row,
                activeFlag: "N",
              };
            } else {
              return {
                ...row,
              };
            }
          });
          localStorage.setItem("rowsData", JSON.stringify(_delItem ?? []));
          setRowsData(_delItem ?? []);
          console.log("_delItem", _delItem);
          setLoadderState(false);
          console.log("aaaaaaa", loadderState);
        } else {
          setLoadderState(true);
          let updatedArray = rows?.filter(
            (obj) => obj?.departmentId !== props?.departmentId
          );
          localStorage.setItem("rowsData", JSON.stringify(updatedArray ?? []));
          setRowsData(updatedArray ?? []);
          console.log("ggg");
          setLoadderState(false);
        }

        // setArr([]);
      }
    });
  };

  const updateNoticeData = () => {
    setOpen(false);

    // temp Obj
    let updateConcerDept = {
      locationId: watch("locationName"),
      departmentId: watch("departmentName"),
      id: watch("id"),
      activeFlag: "Y",
      empoyeeId: null,
    };

    console.log("updateConcerDept", updateConcerDept);
    let _data = rowsData.filter((data) => {
      if (data.id != watch("id")) {
        return data;
      }
    });

    let tempTableData = [..._data, updateConcerDept];

    let updatedTableData =
      tempTableData?.length > 0 &&
      tempTableData?.map((val, i) => {
        console.log("val?.id", val?.id);
        return {
          srNo: i + 1,
          id: val?.id,
          activeFlag: val?.activeFlag,
          departmentNameEn: filteredDepartments?.find(
            (obj) => obj?.id === val.departmentId
          )?.department,
          departmentNameMr: filteredDepartments?.find(
            (obj) => obj?.id === val.departmentId
          )?.departmentMr,
          locationNameEn: officeLocationList?.find(
            (obj) => obj?.id === val.locationId
          )?.officeLocationName,
          locationNameMr: officeLocationList?.find(
            (obj) => obj?.id === val.locationId
          )?.officeLocationNameMar,
          departmentId: val?.departmentId,
          locationId: val?.locationId,
        };
      });

    console.log("updatedTableData", updatedTableData);
    setRowsData(updatedTableData);
    setValue("departmentName", null);
    setValue("locationName", null);
  };

  // cols
  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="subDepartment" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    ,
    {
      field: "actions",
      hide: disabledAll,
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {/* for edit */}
            <IconButton
              style={{
                color: "green",
              }}
              onClick={(index) => {
                console.log("check", params.row);
                setValue("id", params.row.id);
                setValue("departmentName", params.row.departmentId);
                setValue("locationName", params.row.locationId);
                handleOpen();
              }}
            >
              <EditIcon />
            </IconButton>

            {/* Delete  */}
            <IconButton
              // onClick={(index) => {
              //   // console.log("check", params.row);
              //   // setValue("id", params.row.id);
              //   // setValue("departmentName", params.row.departmentId);
              //   // setValue("locationName", params.row.locationId);
              //   // handleOpen();

              //   onClick={() => handleDeleteDpt(record.row)}

              // }}

              style={{
                color: "red",
              }}
              onClick={() => handleDeleteDpt(params.row)}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  // notice number - serial number
  const getNoticeNumber = async () => {
    await axios
      .get(`${urls.LCMSURL}/notice/getNoticeNumber`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          r?.data ? setValue("serialNo", r.data) : setValue("serialNo", 0);
        } else {
          //
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // officeLocation
  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setOfficeLocationList(r.data.officeLocation);
        } else {
          //
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // getDepartments
  const getFilteredDepartmentsBasedonLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (
          res?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setFilteredDepartments(
            res.data.department.map((r, i) => ({
              id: r.id,
              department: r.department,
              departmentMr: r.departmentMr,
            }))
          );
        } else {
          //
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // addMore - concerDept
  const addConcernDeptList = () => {
    // add new concerDept
    let newConcerDept = {
      departmentId: watch("departmentName"),
      locationId: watch("locationName"),
      // id: null;
      activeFlag: "Y",
      empoyeeId: null,
    };

    let tempTableData;

    let tempRow = [];
    if (
      localStorage.getItem("rowsData") != null ||
      localStorage.getItem("rowsData") != undefined
      // localStorage.getItem("rowsData") !=
    ) {
      tempRow = JSON.parse(localStorage.getItem("rowsData"));
      console.log("23432432", [...tempRow, newConcerDept]);
      tempTableData = [...tempRow, newConcerDept];
    } else {
      tempTableData = [newConcerDept];
    }

    console.log("tempTableData", tempTableData);

    let updatedTableData =
      tempTableData?.length > 0 &&
      tempTableData?.map((val, i) => {
        return {
          srNo: i + 1,
          id: val?.id,
          activeFlag: val?.activeFlag,
          departmentNameEn: filteredDepartments?.find(
            (obj) => obj?.id === val.departmentId
          )?.department,
          departmentNameMr: filteredDepartments?.find(
            (obj) => obj?.id === val.departmentId
          )?.departmentMr,
          locationNameEn: officeLocationList?.find(
            (obj) => obj?.id === val.locationId
          )?.officeLocationName,
          locationNameMr: officeLocationList?.find(
            (obj) => obj?.id === val.locationId
          )?.officeLocationNameMar,
          departmentId: val?.departmentId,
          locationId: val?.locationId,
        };
      });

    console.log("newNoticesddsk", updatedTableData);
    localStorage.setItem("rowsData", JSON.stringify(updatedTableData));
    setRowsData(updatedTableData);
    setValue("departmentName", null);
    setValue("locationName", null);
  };

  //! ====================> useEffects <==========

  useEffect(() => {
    console.log("loaders", loadderState);
  }, [loadderState]);

  useEffect(() => {
    getNoticeNumber();
    getOfficeLocation();
  }, []);

  useEffect(() => {
    console.log("officeLocationList", officeLocationList);
    getFilteredDepartmentsBasedonLocation();
  }, [officeLocationList]);

  useEffect(() => {
    if (
      officeLocationList?.length > 0 &&
      filteredDepartments?.length > 0 &&
      localStorage.getItem("rowsData") != undefined &&
      localStorage.getItem("rowsData") != null
    ) {
      console.log("callled:::");
      let tempTableData = JSON.parse(localStorage.getItem("rowsData"));
      let tableDataNew = tempTableData?.map((val, i) => {
        return {
          srNo: i + 1,
          id: val?.id,
          activeFlag: val?.activeFlag,
          departmentNameEn: filteredDepartments?.find(
            (obj) => obj?.id === val.departmentId
          )?.department,
          departmentNameMr: filteredDepartments?.find(
            (obj) => obj?.id === val.departmentId
          )?.departmentMr,
          locationNameEn: officeLocationList?.find(
            (obj) => obj?.id === val.locationId
          )?.officeLocationName,
          locationNameMr: officeLocationList?.find(
            (obj) => obj?.id === val.locationId
          )?.officeLocationNameMar,
          departmentId: val?.departmentId,
          locationId: val?.locationId,
        };
      });
      setRowsData(tableDataNew);
    } else {
      setRowsData([]);
    }
  }, [
    officeLocationList,
    filteredDepartments,
    localStorage.getItem("rowsData"),
  ]);

  useEffect(() => {
    console.log(
      "sdfsdf===",
      watch("hodRejectionRemarkMr") != undefined &&
        watch("hodRejectionRemarkMr") != null &&
        watch("hodRejectionRemarkMr") != ""
    );
  }, [watch("hodRejectionRemarkMr")]);

  useEffect(() => {
    const hyperlinkRegex = /https?:\/\/|ftp:\/\//i;
    const csvRegex = /,\s*=/;
    const noSpecialCharRegex = /^(=).*/;

    const checkField = (fieldName, setFieldChk) => {
      const fieldValue = watch(fieldName);

      if (!fieldValue) {
        setFieldChk(true);
        return;
      }

      if (!noSpecialCharRegex.test(fieldValue)) {
        setFieldChk(true);

        if (!hyperlinkRegex.test(fieldValue)) {
          setFieldChk(true);

          if (csvRegex.test(fieldValue)) {
            setFieldChk(false);
            setMessageToShowOnError("Potential CSV injection detected! 😣");
            setMessageToShowOnErrorMr("संभाव्य CSV इंजेक्शन आढळले! 😣");
          } else {
            const sanitizedValue = DOMPurify.sanitize(fieldValue);

            if (fieldValue !== sanitizedValue) {
              setFieldChk(false);
              setMessageToShowOnError(
                "Potential HTML/Script injection detected! 😣"
              );
              setMessageToShowOnErrorMr(
                "संभाव्य एचटीएमएल/स्क्रिप्ट इंजेक्शन आढळले! 😣"
              );
            } else {
              setFieldChk(true);
            }
          }
        } else {
          setFieldChk(false);
          setMessageToShowOnError("Hyperlink is not allowed 😒");
          setMessageToShowOnErrorMr("हायपरलिंकला परवानगी नाही 😒");
        }
      } else {
        setFieldChk(false);
        setMessageToShowOnError(
          "Value should not start with any special character 😒"
        );
        setMessageToShowOnErrorMr(
          "मूल्य कोणत्याही विशेष वर्णाने सुरू होऊ नये 😒"
        );
      }
    };

    checkField("noticeDetails", setNoticeDetailsFiledChk);
    checkField("noticeDetailsMr", setNoticeDetailsMrFiledChk);
    // checkField("subjectDetails", setSubjectDetailsFiledChk)
    // checkField("outwardNumber", setOutwardNumberFiledChk)
    // checkField("budgetHead", setBudgetHeadFiledChk)
    // checkField("nameOfApprover", setNameOfApproverFiledChk)
    // checkField("toDepartment", setToDepartmentFiledChk)
    // checkField("toDesignation", setToDesignationFiledChk)
  }, [
    watch("noticeDetails"),
    watch("noticeDetailsMr"),
    // watch("subjectDetails"),
    // watch("outwardNumber"),
    // watch("budgetHead"),
    // watch("nameOfApprover"),
    // watch("toDepartment"),
    // watch("toDesignation"),
  ]);

  // view
  return (
    <>
      {/* <div
        style={{
          backgroundColor: "#0084ff",
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
        <strong> {<FormattedLabel id="noticeDetails" />}</strong>
      </div> */}

      {/* 1st Row */}
      <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
        {/* Serail Number */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={3}
          xl={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            autoFocus
            disabled
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="serialNo" />}
            variant="standard"
            {...register("serialNo")}
          />
        </Grid>

        <Grid item xl={1} lg={1} md={1} sm={1} xs={1}></Grid>

        {/* Inward Number */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={3}
          xl={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            autoFocus
            disabled={disabledAll}
            id="standard-basic"
            label={<FormattedLabel id="inwardNo" />}
            variant="standard"
            {...register("inwardNo")}
            error={!!errors.inwardNo}
            helperText={errors?.inwardNo ? errors.inwardNo.message : null}
          />
        </Grid>
        <Grid item xl={1} lg={1} md={1} sm={1} xs={1}></Grid>

        {/* notice Date */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={3.2}
          xl={3.2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl
            error={!!errors.noticeDate}
            fullWidth
            // sx={{ width: "100%" }}
          >
            <Controller
              control={control}
              name="noticeDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="noticeDate" /> *
                      </span>
                    }
                    value={field.value}
                    disabled={disabledAll}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      setValue("requisitionDate", moment(date).add(30, "days"));
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        variant="standard"
                        size="small"
                        error={!!errors.noticeDate}
                        sx={{
                          width: "100%",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText sx={{ marginLeft: 0 }}>
              {errors?.noticeDate ? errors.noticeDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      {/* 2nd Row */}
      <Grid container sx={{ padding: "10px" }}>
        {/* notice received data */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={3}
          xl={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl
            error={!!errors.noticeRecivedDate}
            fullWidth
            // sx={{ width: "90%" }}
          >
            <Controller
              control={control}
              name="noticeRecivedDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disableFuture
                    inputFormat="DD/MM/YYYY"
                    disabled={disabledAll}
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="noticeRecivedDate" />*
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        fullWidth
                        error={!!errors.noticeRecivedDate}
                        sx={{
                          width: "100%",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText sx={{ marginLeft: 0 }}>
              {errors?.noticeRecivedDate
                ? errors.noticeRecivedDate.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xl={1} lg={1} md={1} sm={1} xs={1}></Grid>

        {/* Notice Received from Advocate in English */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={3}
          xl={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // width: "90%",
            // maxWidth: "90%",
          }}
        >
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            autoFocus
            // value={inputValue}
            // onChange={handleInputChange}
            disabled={disabledAll}
            id="standard-basic"
            label={<FormattedLabel id="noticeReceviedFromAdvocateEn" />}
            variant="standard"
            {...register("noticeRecivedFromAdvocatePerson", {})}
            defaultValue="Adv."
            error={!!errors.noticeRecivedFromAdvocatePerson}
            helperText={
              errors?.noticeRecivedFromAdvocatePerson
                ? errors.noticeRecivedFromAdvocatePerson.message
                : null
            }
          />

          {/* <Transliteration
            _key={"noticeRecivedFromAdvocatePerson"}
            labelName={"noticeRecivedFromAdvocatePerson"}
            fieldName={"noticeRecivedFromAdvocatePerson"}
            updateFieldName={"noticeRecivedFromAdvocatePersonMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            label={
              <FormattedLabel id="noticeReceviedFromAdvocateEn" required />
            }
            error={!!errors.noticeRecivedFromAdvocatePerson}
            helperText={
              errors?.noticeRecivedFromAdvocatePerson
                ? errors.noticeRecivedFromAdvocatePerson.message
                : null
            }
          /> */}
        </Grid>

        <Grid
          item
          sx={{
            marginLeft: "2vw",
          }}
          xl={1.5}
          lg={1.5}
          md={1}
          sm={1}
          xs={1}
        >
          <Button
            // style={{ flexDirection: "column" }}
            sx={{
              marginTop: "20px",
              marginLeft: "1vw",
              height: "4vh",
              width: "9vw",
            }}
            onClick={() =>
              noticeDetailsApi(
                watch("noticeRecivedFromAdvocatePerson"),
                "noticeRecivedFromAdvocatePersonMr",
                "en"
              )
            }
          >
            <FormattedLabel id="mar" />
          </Button>
          <Button
            // style={{ flexDirection: "column" }}
            sx={{
              marginTop: "10px",
              marginLeft: "1vw",
              height: "4vh",
              width: "9vw",
            }}
            onClick={() =>
              noticeDetailsApi(
                watch("noticeRecivedFromAdvocatePersonMr"),
                "noticeRecivedFromAdvocatePerson",
                "mr"
              )
            }
          >
            <FormattedLabel id="eng" />
          </Button>
        </Grid>
        {/*  Translator button */}

        {/* Notice Recived from Advocate in Marathi */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={2.2}
          xl={2.2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Button
            sx={{
              marginTop: "2vh",

              height: "5vh",
              width: "9vw",
              marginRight: "1vw",
            }}
            disabled={disabledAll}
            onClick={() =>
              noticeDetailsApi(
                watch("noticeRecivedFromAdvocatePerson"),
                "noticeRecivedFromAdvocatePersonMr"
              )
            }
          >
            <FormattedLabel id="translate" />
          </Button> */}
          <TextField
            fullWidth
            sx={{ width: "100%" }}
            autoFocus
            id="standard-basic"
            disabled={disabledAll}
            label={<FormattedLabel id="noticeReceviedFromAdvocateMr" />}
            variant="standard"
            {...register("noticeRecivedFromAdvocatePersonMr")}
            defaultValue="अ‍ॅड."
            error={!!errors.noticeRecivedFromAdvocatePersonMr}
            helperText={
              errors?.noticeRecivedFromAdvocatePersonMr
                ? errors.noticeRecivedFromAdvocatePersonMr.message
                : null
            }
          />

          {/* <Transliteration
            _key={"noticeRecivedFromAdvocatePersonMr"}
            labelName={"noticeRecivedFromAdvocatePersonMr"}
            fieldName={"noticeRecivedFromAdvocatePersonMr"}
            updateFieldName={"noticeRecivedFromAdvocatePerson"}
            sourceLang={"mar"}
            targetLang={"eng"}
            label={
              <FormattedLabel id="noticeReceviedFromAdvocateMr" required />
            }
            error={!!errors.noticeRecivedFromAdvocatePersonMr}
            helperText={
              errors?.noticeRecivedFromAdvocatePersonMr
                ? errors.noticeRecivedFromAdvocatePersonMr.message
                : null
            }
          /> */}
        </Grid>
      </Grid>

      {/* 3rd row */}
      <Grid container sx={{ padding: "10px", marginTop: "5vh" }}>
        {/* requisitionDate */}
        <Grid
          item
          xl={3.2}
          lg={3.2}
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
          <FormControl>
            <Controller
              control={control}
              name="requisitionDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    disabled
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="requisitionDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        sx={{ width: "135%" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xl={1} lg={1} md={1} sm={1} xs={1}></Grid>

        {/* client Name in English */}
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
          <TextField
            fullWidth
            sx={{ width: "100%" }}
            autoFocus
            id="standard-basic"
            disabled={disabledAll}
            label="Client Name(In English)"
            variant="standard"
            {...register("clientNameEn")}
            InputLabelProps={{
              shrink:
                (watch("clientNameEn") ? true : false) ||
                (router.query.clientNameEn ? true : false),
            }}

            // error={!!errors.noticeRecivedFromAdvocatePersonMr}
            // helperText={
            //   errors?.noticeRecivedFromAdvocatePersonMr
            //     ? errors.noticeRecivedFromAdvocatePersonMr.message
            //     : null
            // }
          />
        </Grid>

        {/* Translataion Button  */}
        <Grid
          item
          sx={{
            marginLeft: "2vw",
          }}
          xl={1.5}
          lg={1.5}
          md={1}
          sm={1}
          xs={1}
        >
          <Button
            // style={{ flexDirection: "column" }}
            sx={{
              marginTop: "20px",
              marginLeft: "1vw",
              height: "4vh",
              width: "9vw",
            }}
            onClick={() =>
              noticeDetailsApi(watch("clientNameEn"), "clientNameMr", "en")
            }
          >
            <FormattedLabel id="mar" />
          </Button>
          <Button
            // style={{ flexDirection: "column" }}
            sx={{
              marginTop: "10px",
              marginLeft: "1vw",
              height: "4vh",
              width: "9vw",
            }}
            onClick={() =>
              noticeDetailsApi(watch("clientNameMr"), "clientNameEn", "mr")
            }
          >
            <FormattedLabel id="eng" />
          </Button>
        </Grid>
        {/* <Grid
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
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Button
            // style={{ flexDirection: "column" }}
            sx={{
              marginTop: "70px",
              marginLeft: "1vw",
              height: "4vh",
              width: "9vw",
            }}
            onClick={() => caseDetailsApi(watch("filedBy"), "filedByMr", "en")}
          >
            <FormattedLabel id="mar" />
          </Button>
          <Button
            // style={{ flexDirection: "column" }}
            sx={{
              marginTop: "10px",
              marginLeft: "1vw",
              height: "4vh",
              width: "9vw",
            }}
            onClick={() => caseDetailsApi(watch("filedByMr"), "filedBy", "mr")}
          >
            <FormattedLabel id="eng" />
          </Button>
        </Grid> */}

        <Grid
          item
          xl={2.5}
          lg={2.5}
          md={6}
          sm={6}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Button
            sx={{
              marginTop: "3vh",
              marginLeft: "1vw",
              height: "6vh",
              width: "10vw",
            }}
            disabled={disabledAll}
            onClick={() =>
              noticeDetailsApi(watch("clientNameEn"), "clientNameMr", "en")
            }
          >
            <FormattedLabel id="translate" />
          </Button> */}

          <TextField
            fullWidth
            sx={{ width: "100%" }}
            autoFocus
            id="standard-basic"
            disabled={disabledAll}
            label="Client Name( In Marathi)"
            variant="standard"
            {...register("clientNameMr")}
            InputLabelProps={{
              shrink:
                (watch("clientNameMr") ? true : false) ||
                (router.query.clientNameMr ? true : false),
            }}
            // error={!!errors.noticeRecivedFromAdvocatePersonMr}
            // helperText={
            //   errors?.noticeRecivedFromAdvocatePersonMr
            //     ? errors.noticeRecivedFromAdvocatePersonMr.message
            //     : null
            // }
          />
        </Grid>
      </Grid>

      {/* 4th Row for Notice Details */}

      <Grid container sx={{ padding: "10px" }}>
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
          <TextField
            autoFocus
            sx={{ width: "88%" }}
            multiline
            id="standard-basic"
            label={<FormattedLabel id="noticeDetailsEn" />}
            disabled={disabledAll}
            variant="standard"
            {...register("noticeDetails")}
            error={!!errors.noticeDetails}
            helperText={
              errors?.noticeDetails ? errors.noticeDetails.message : null
            }
            InputLabelProps={{
              shrink:
                (watch("noticeDetails") ? true : false) ||
                (router.query.noticeDetails ? true : false),
            }}
          />

          <FormHelperText style={{ color: "red" }}>
            {!noticeDetailsFiledChk ? error1Messsage() : ""}
          </FormHelperText>

          {/*  Button For Translation */}
          <Button
            sx={{
              marginTop: "3vh",
              marginLeft: "1vw",
              height: "5vh",
              width: "10vw",
            }}
            disabled={disabledAll}
            onClick={() =>
              noticeDetailsApi(watch("noticeDetails"), "noticeDetailsMr", "en")
            }
          >
            {/* Translate */}
            <FormattedLabel id="mar" />
          </Button>

          {/* <Transliteration
            _key={"noticeDetails"}
            labelName={"noticeDetails"}
            fieldName={"noticeDetails"}
            updateFieldName={"noticeDetailsMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id="noticeDetailsEn" required />}
            error={!!errors.noticeDetails}
            helperText={
              errors?.noticeDetails ? errors.noticeDetails.message : null
            }
          /> */}
        </Grid>

        {/* Notice Details in Marathi */}
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
          <TextField
            autoFocus
            sx={{ width: "88%", marginTop: "5vh" }}
            multiline
            id="standard-basic"
            label={<FormattedLabel id="noticeDetailsMr" />}
            variant="standard"
            disabled={disabledAll}
            {...register("noticeDetailsMr")}
            error={!!errors.noticeDetailsMr}
            helperText={
              errors?.noticeDetailsMr ? errors.noticeDetailsMr.message : null
            }
            InputLabelProps={{
              shrink:
                (watch("noticeDetailsMr") ? true : false) ||
                (router.query.noticeDetailsMr ? true : false),
            }}
          />

          <FormHelperText style={{ color: "red" }}>
            {!noticeDetailsMrFiledChk ? error1Messsage() : ""}
          </FormHelperText>

          <Button
            sx={{
              marginTop: "4vh",
              marginLeft: "1vw",
              height: "5vh",
              width: "10vw",
            }}
            disabled={disabledAll}
            onClick={() =>
              noticeDetailsApi(watch("noticeDetailsMr"), "noticeDetails", "mr")
            }
          >
            {/* Translate */}
            <FormattedLabel id="eng" />
          </Button>

          {/* <Transliteration
            _key={"noticeDetailsMr"}
            labelName={"noticeDetailsMr"}
            fieldName={"noticeDetailsMr"}
            updateFieldName={"noticeDetails"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id="noticeDetailsMr" required />}
            error={!!errors.noticeDetailsMr}
            helperText={
              errors?.noticeDetailsMr ? errors.noticeDetailsMr.message : null
            }
          /> */}
        </Grid>
      </Grid>

      {/* 5th row */}
      <Grid container sx={{ padding: "10px" }}>
        {/* advocateAddress in English */}
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
          <TextField
            multiline
            fullWidth
            sx={{ width: "88%" }}
            id="standard-basic"
            label={<FormattedLabel id="advocateAddressEn" />}
            variant="standard"
            disabled={disabledAll}
            {...register("advocateAddress")}
            error={!!errors.advocateAddress}
            helperText={
              errors?.advocateAddress ? errors.advocateAddress.message : null
            }
            InputLabelProps={{
              shrink:
                (watch("advocateAddress") ? true : false) ||
                (router.query.advocateAddress ? true : false),
            }}
          />
          <Button
            sx={{
              marginTop: "3vh",
              marginLeft: "1vw",
              height: "5vh",
              width: "10vw",
            }}
            disabled={disabledAll}
            onClick={() =>
              noticeDetailsApi(
                watch("advocateAddress"),
                "advocateAddressMr",
                "en"
              )
            }
          >
            {/* Translate */}
            <FormattedLabel id="mar" />
          </Button>

          {/* <Transliteration
            _key={"advocateAddress"}
            labelName={"advocateAddress"}
            fieldName={"advocateAddress"}
            updateFieldName={"advocateAddressMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
           
            label={<FormattedLabel id="advocateAddressEn" required />}
            error={!!errors.advocateAddress}
            helperText={
              errors?.advocateAddress ? errors.advocateAddress.message : null
            }
          /> */}
        </Grid>

        {/* Advocate Address in Marathi */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            marginTop: "10px",
          }}
        >
          <TextField
            multiline
            fullWidth
            // sx={{ width: "97%" }}
            sx={{ width: "88%", marginTop: "5vh" }}
            id="standard-basic"
            label={<FormattedLabel id="advocateAddressMr" />}
            variant="standard"
            disabled={disabledAll}
            {...register("advocateAddressMr")}
            error={!!errors.advocateAddressMr}
            helperText={
              errors?.advocateAddressMr
                ? errors.advocateAddressMr.message
                : null
            }
            InputLabelProps={{
              shrink:
                (watch("advocateAddressMr") ? true : false) ||
                (router.query.advocateAddressMr ? true : false),
            }}
          />

          <Button
            sx={{
              marginTop: "6vh",
              marginLeft: "1vw",
              height: "5vh",
              width: "10vw",
            }}
            disabled={disabledAll}
            onClick={() =>
              noticeDetailsApi(
                watch("advocateAddressMr"),
                "advocateAddress",
                "mr"
              )
            }
          >
            {/* Translate */}
            <FormattedLabel id="eng" />
          </Button>

          {/* <Transliteration
            _key={"advocateAddressMr"}
            labelName={"advocateAddressMr"}
            fieldName={"advocateAddressMr"}
            updateFieldName={"advocateAddress"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id="advocateAddressMr" required />}
            error={!!errors.advocateAddressMr}
            helperText={
              errors?.advocateAddressMr
                ? errors.advocateAddressMr.message
                : null
            }
          /> */}
        </Grid>
      </Grid>

      {/** new fields  */}
      {/* <Grid container sx={{ marginTop: "25px" }}>
        <Grid
          item
          xs={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            autoFocus
            disabled
            hidden
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="serialNo" />}
            variant="standard"
            {...register("hodRejectionRemark")}
          />

          {true && (
            <TextField
              fullWidth
              sx={{ width: "90%" }}
              autoFocus
              disabled
              hidden
              id="standard-basic"
              InputLabelProps={{ shrink: true }}
              label={<FormattedLabel id="serialNo" />}
              variant="standard"
              {...register("hodRejectionRemarkMr")}
            />
          )}
        </Grid>
      </Grid> */}

      {/* New Exp */}

      <Grid
        container
        sx={{
          padding: "10px",
        }}
      >
        {watch("hodRejectionRemark") != undefined &&
          watch("hodRejectionRemark") != null &&
          watch("hodRejectionRemark") != "" && (
            <Grid
              item
              sx={{
                width: "100%",
              }}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <TextField
                style={{
                  width: "100%",
                }}
                multiline
                fullWidth
                disabled
                label={<FormattedLabel id="hodRemarksEn" />}
                {...register("hodRejectionRemark")}
                // error={!!errors?.caseFees}
                // helperText={errors?.caseFees ? errors?.caseFees?.message : null}
                InputLabelProps={{
                  shrink: watch("caseFees") == "" || null ? false : true,
                }}
              />
            </Grid>
          )}

        {watch("hodRejectionRemarkMr") != undefined &&
          watch("hodRejectionRemarkMr") != null &&
          watch("hodRejectionRemarkMr") != "" && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                style={{
                  width: "100%",
                }}
                multiline
                fullWidth
                disabled
                label={<FormattedLabel id="hodRemarksMr" />}
                {...register("hodRejectionRemarkMr")}
                // error={!!errors?.caseFees}
                // helperText={errors?.caseFees ? errors?.caseFees?.message : null}
                InputLabelProps={{
                  shrink: watch("caseFees") == "" || null ? false : true,
                }}
              />
            </Grid>
          )}
      </Grid>

      {/*  */}
      {/* 5th Row */}
      <Grid container sx={{ marginTop: "25px" }}>
        {/* deptName */}
        <Grid item xs={0.4}></Grid>
        <Grid
          item
          xs={5}
          // sm={5}
          // md={5}
          // lg={5}
          // xl={5}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          // }}
        >
          {/* new Department Name */}
          {/* <FormControl
            variant="standard"
            error={!!errors?.locationName}
            //  sx={{ width: "90%" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="deptName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="deptName" />}
                >
                  {officeLocationList &&
                    officeLocationList
                      .slice()

                      .sort((a, b) =>
                        a.officeLocationName.localeCompare(
                          b.officeLocationName,
                          undefined,
                          {
                            numeric: true,
                          }
                        )
                      )

                      .map((officeLocation, index) => (
                        <MenuItem key={index} value={officeLocation.id}>
                          {language == "en"
                            ? officeLocation?.officeLocationName
                            : officeLocation?.officeLocationNameMar}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="locationName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.locationName ? errors?.locationName?.message : null}
            </FormHelperText>
          </FormControl> */}

          {/* Autocomplete  */}
          <FormControl
            // variant="outlined"
            error={!!errors?.priviouseCourtName}
            sx={{ marginTop: 2 }}
          >
            <Controller
              name="locationName"
              control={control}
              defaultValue={null}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  variant="standard"
                  id="controllable-states-demo"
                  disabled={disabledAll}
                  sx={{ width: 300 }}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : null);
                  }}
                  value={
                    officeLocationList?.find((data) => data?.id === value) ||
                    null
                  }
                  options={officeLocationList.sort((a, b) =>
                    language === "en"
                      ? a.officeLocationName.localeCompare(b.officeLocationName)
                      : a.officeLocationNameMar.localeCompare(
                          b.officeLocationNameMar
                        )
                  )} //! api Data
                  getOptionLabel={(officeLocation) =>
                    language == "en"
                      ? officeLocation?.officeLocationName
                      : officeLocation?.officeLocationNameMar
                  } //! Display name the Autocomplete
                  renderInput={(params) => (
                    //! display lable list
                    <TextField
                      fullWidth
                      {...params}
                      label={
                        language == "en" ? "Department Name" : "विभागाचे नाव"
                      }
                      // variant="outlined"
                      variant="standard"
                    />
                  )}
                />
              )}
            />
            <FormHelperText>
              {errors?.locationName ? errors?.locationName?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* sub Department name */}
        <Grid item xs={5}>
          {/* <FormControl
            variant="standard"
            error={!!errors?.departmentName}
            sx={{ width: "90%" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="subDepartment" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="subDepartment" />}
                >
                  {filteredDepartments &&
                    filteredDepartments
                      .slice()

                      .sort((a, b) =>
                        a.department.localeCompare(b.department, undefined, {
                          numeric: true,
                        })
                      )
                      .map((filteredDepartment, index) => (
                        <MenuItem key={index} value={filteredDepartment?.id}>
                          {language == "en"
                            ? filteredDepartment?.department
                            : filteredDepartment?.departmentMr}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="departmentName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.departmentName ? errors?.departmentName?.message : null}
            </FormHelperText>
          </FormControl> */}

          {/* Autocomplete  */}
          <FormControl
            // variant="outlined"
            error={!!errors?.departmentName}
            sx={{ marginTop: 2 }}
          >
            <Controller
              name="departmentName"
              control={control}
              defaultValue={null}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  variant="standard"
                  id="controllable-states-demo"
                  disabled={disabledAll}
                  sx={{ width: 300 }}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : null);
                  }}
                  value={
                    filteredDepartments?.find((data) => data?.id === value) ||
                    null
                  }
                  options={filteredDepartments.sort((a, b) =>
                    language === "en"
                      ? a.department.localeCompare(b.department)
                      : a.departmentMr.localeCompare(b.departmentMr)
                  )} //! api Data
                  getOptionLabel={(filteredDepartment) =>
                    language == "en"
                      ? filteredDepartment?.department
                      : filteredDepartment?.departmentMr
                  } //! Display name the Autocomplete
                  renderInput={(params) => (
                    //! display lable list
                    <TextField
                      fullWidth
                      {...params}
                      label={
                        language == "en"
                          ? "Sub-Department Name"
                          : "उप-विभागाचे नाव"
                      }
                      // variant="outlined"
                      variant="standard"
                    />
                  )}
                />
              )}
            />
            <FormHelperText>
              {errors?.departmentName ? errors?.departmentName?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={1}
          sx={{
            marginTop: "20px",
          }}
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
        >
          <Button
            type="Button"
            disabled={
              watch("departmentName") && watch("locationName") ? false : true
            }
            variant="contained"
            size="small"
            onClick={() => {
              addConcernDeptList();
              // For Label change
              if (isFirstAdd) {
                setIsFirstAdd(false);
              }
            }}
          >
            {/* <FormattedLabel id="addMore" /> */}
            {isFirstAdd ? (
              <FormattedLabel id="add" />
            ) : (
              <FormattedLabel id="addMore" />
            )}
          </Button>
        </Grid>
      </Grid>

      {/** DataGrid */}
      {loadderState ? (
        <Loader />
      ) : (
        <Grid container sx={{ padding: "10px" }}>
          <DataGrid
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
            density="compact"
            autoHeight={true}
            pagination
            getRowId={(row) => row.srNo}
            paginationMode="server"
            rows={
              rowsData
                ? rowsData?.filter(
                    (obj) =>
                      obj?.activeFlag == "Y" || obj?.activeFlag === undefined
                  )
                : []
              // rowsData == [] || rowsData == undefined || rowsData == ""
              //   ? []
              //   : rowsData
            }
            columns={_col}
            onPageChange={(_data) => {}}
            onPageSizeChange={(_data) => {}}
          />
        </Grid>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "10px",
            }}
          >
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                sx={{ width: "90%" }}
                autoFocus
                disabled
                hidden
                id="standard-basic"
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="serialNo" />}
                variant="standard"
                {...register("id")}
              />
              <FormControl fullWidth size="small" sx={{ width: "90%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="deptName" />}
                </InputLabel>

                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={<FormattedLabel id="deptName" />}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      style={{ backgroundColor: "white" }}
                    >
                      {officeLocationList &&
                        officeLocationList.map((officeLocation, index) => (
                          <MenuItem key={index} value={officeLocation.id}>
                            {language == "en"
                              ? officeLocation?.officeLocationName
                              : officeLocation?.officeLocationNameMar}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="locationName"
                  control={control}
                  defaultValue=""
                />
                {/* <FormHelperText style={{ color: "red" }}>
                                  {rowsData.length === 0 && errors?.oficeLocationId
                                    ? errors.oficeLocationId.message
                                    : null}
                                </FormHelperText> */}
              </FormControl>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                variant="standard"
                error={!!errors?.departmentName}
                sx={{ width: "90%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="subDepartment" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="subDepartment" />}
                    >
                      {filteredDepartments &&
                        filteredDepartments.map((filteredDepartment, index) => (
                          <MenuItem key={index} value={filteredDepartment?.id}>
                            {language == "en"
                              ? filteredDepartment?.department
                              : filteredDepartment?.departmentMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="departmentName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.hawkingZoneName
                    ? errors?.hawkingZoneName?.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              padding: "10px",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                console.log(
                  "watch212",
                  watch("departmentName"),
                  watch("locationName")
                );
                updateNoticeData();
              }}
            >
              SAVE
            </Button>
            <Button variant="outlined" size="small" onClick={handleClose}>
              CANCEL
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NoticeDetails;
