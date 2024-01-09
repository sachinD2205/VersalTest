import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import schema from "../../../../containers/schema/sportsPortalSchema/equipmentSchema";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import URLS from "../../../../URLS/urls";
import swal from "sweetalert";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [facilityTypess, setFacilityTypess] = useState([]);

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
  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   watch,
  //   reset,
  //   setValue,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });
  useLayoutEffect(() => {
    console.log("btnSaveText", btnSaveText);
  }, [btnSaveText]);

  const [btnSaveText, setBtnSaveText] = useState("save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  // const [departments, setDepartments] = useState([]);
  // const [subDepartments, setSubDepartments] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getFacilityTypes = () => {
    axios
      .get(`${URLS.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityTypess(
          r.data.facilityType.map((row) => ({
            id: row.id,
            facilityTypeId: row.facilityType,
            facilityTypeId: row.facilityTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getType();
  }, [zoneNames, wardNames, fetchData]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    getFacilityTypes();
    // getDepartments();
    // getSubDepartments();
  }, []);

  const onSubmitForm = (fromData) => {
    // alert("hi");

    console.log("clicked");
    // console.log('submitted form:', fromData);
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${URLS.SPURL}/equipment/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            // sweetAlert("Saved!", "Record Saved successfully !", "success");
            language == "en"
              ? swal("Submited!", "Record Submited successfully !", "success")
              : swal(
                  "सबमिट केले",
                  "रेकॉर्ड यशस्वीरित्या सबमिट केले !",
                  "success"
                );

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      console.log("update data", _body);
      // const tempData = axios
      axios
        .post(`${URLS.SPURL}/equipment/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          // if (res.status == 200) {
          //   fromData.id
          //     ? sweetAlert('Updated!', 'Record Updated successfully !', 'success')
          //     : language == 'en'
          //     ? swal('Submited!', 'Record Submited successfully !', 'success')
          //     : swal('सबमिट केले', 'रेकॉर्ड यशस्वीरित्या सबमिट केले !', 'success')

          //   getType()

          //   setIsOpenCollapse(false)
          // }

          if (fromData?.id) {
            language == "en"
              ? sweetAlert({
                  title: "Updated!",
                  text: "Record Updated successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "अपडेट केले!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
            getType();
            setIsOpenCollapse(false);
          } else {
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

            getType();
            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  const getAllTypes = () => {
    axios
      .get(`${URLS.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getWardNames = () => {
    axios
      .get(`${URLS.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //Delete by ID(SweetAlert)
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय ?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record ?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete) {
          axios
            .post(`${URLS.SPURL}/equipment/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                language == "en"
                  ? swal("Record is Successfully Deleted!")
                  : swal("रेकॉर्ड यशस्वीरित्या हटवले आहे!");
                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });
                getType();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          // swal("Record is Safe");
          language == "en"
            ? swal("Record is Safe")
            : swal("रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय ?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record ?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय  करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${URLS.SPURL}/equipment/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });

                language == "en"
                  ? swal({
                      text: "Record is Successfully Deleted!",
                      icon: "success",
                    })
                  : swal({
                      text: "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                      icon: "success",
                    }).then;
                // getPaymentRate();
                getType();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? swal("Record is Safe")
            : swal("रेकॉर्ड सुरक्षित आहे");
          // swal("Record is Safe");
        }
      });
    }
  };
  // Get Table - Data
  const getType = (_pageSize = 10, _pageNo = 0, _sortDir = "desc") => {
    axios
      .get(`${URLS.SPURL}/equipment/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.equipmentMaster;
        console.log("result", result);
        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            equipmentNameEng: r.equipmentNameEng,
            equipmentNameMr: r.equipmentNameMr,
            rate: r.rate,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
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
      });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
    setDeleteButtonState(false);
    setEditButtonInputState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    equipmentNameMr: "",
    equipmentNameEng: "",
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    equipmentNameMr: "",
    equipmentNameEng: "",
    id: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "equipmentNameEng",
      headerName: <FormattedLabel id="equipmentNameEn" />,
      width: 320,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "equipmentNameMr",
      headerName: <FormattedLabel id="equipmentNameMr" />,
      width: 390,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "rate",
      headerName: <FormattedLabel id="rate" />,
      width: 390,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                //Facility Id Zone Ward department sub department
                // const facilityTypeIdd = facilityNames.find(
                //   (obj) => obj?.facilityName === params.row.facilityName
                // )?.id;
                const zoneId = zoneNames.find(
                  (obj) => obj?.zoneName === params.row.zoneName
                )?.id;
                // const departmentId = departments.find((obj) => obj?.department === params.row.department)?.id;
                // const subDepartmentId = subDepartments.find(
                //   (obj) => obj?.subDepartment === params.row.subDepartment,
                // )?.id;
                const wardId = wardNames.find(
                  (obj) => obj?.wardName === params.row.wardName
                )?.id;
                const facilityTypeIdd = params.row.id;
                reset({
                  ...params.row,
                  wardName: wardId,
                  // subDepartment: subDepartmentId,
                  // department: departmentId,
                  zoneName: zoneId,
                  facilityTypeId: facilityTypeIdd,
                });

                // console.log('params.row: ', params.row);
                // reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // View
  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        <div
          style={{
            // backgroundColor: "#0084ff",
            backgroundColor: `#556CD6`,
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <strong>{<FormattedLabel id="equipmentMaster" />}</strong>
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.main}>
                    <div className={styles.row}>
                      <div>
                        <Transliteration
                          _key={"equipmentNameEng"}
                          labelName={"equipmentNameEng"}
                          fieldName={"equipmentNameEng"}
                          updateFieldName={"equipmentNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          variant="standard"
                          // sx={{ width: 250 }}
                          width={220}
                          label={
                            <FormattedLabel id="equipmentNameEn" required />
                          }
                          InputLabelProps={{
                            shrink: watch("equipmentNameEng") ? true : false,
                          }}
                          error={!!errors.equipmentNameEng}
                          helperText={
                            errors?.equipmentNameEng
                              ? errors.equipmentNameEng.message
                              : null
                          }
                        />
                      </div>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ width: 220 }}
                          error={!!errors.equipmentNameMr}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="equipmentNameMr" />}
                            variant="standard"
                            sx={{ width: 220 }}
                            {...register("equipmentNameMr")}
                            InputLabelProps={{
                              shrink: watch("equipmentNameMr") ? true : false,
                            }}
                          />
                          <FormHelperText>
                            {errors?.equipmentNameMr
                              ? errors.equipmentNameMr.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ width: 220 }}
                          error={!!errors.rate}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="rate" />}
                            variant="standard"
                            sx={{ width: 220 }}
                            {...register("rate")}
                            InputLabelProps={{
                              shrink: watch("rate") ? true : false,
                            }}
                          />
                          <FormHelperText>
                            {errors?.rate ? errors.rate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </div>

                  <div className={styles.btn}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText == "Save" ? (
                        <FormattedLabel id="save" />
                      ) : (
                        <FormattedLabel id="update" />
                      )}
                    </Button>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <FormattedLabel id="add" />
            {/* Add */}
          </Button>
        </div>
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
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
          density="compact"
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            console.log("222", data.pageSize, _data);
            getType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getType(data.pageSize, _data);
          }}
        />
        {/* <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableColumnFilter
          disableColumnSelector
          // disableToolbarButton
          disableDensitySelector
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
          density="compact"
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            getType(_data, data.page);
          }}
        /> */}
      </Paper>
    </>
  );
};

export default Index;
