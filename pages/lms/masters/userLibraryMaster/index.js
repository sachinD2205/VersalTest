// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
// import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [users, setUsers] = useState([]);

  const [libraryList, setLibraryList] = useState([]);
  const [zoneKeys, setZoneKeys] = useState([]);
  const [libraryKeys, setLibraryKeys] = useState([]);
  const [libraryKeysM, setLibraryKeysM] = useState([]);

  useEffect(() => {
    getDepartmentUsers();
    getZoneKeys();
    getLibraryKeys1();
  }, []);

  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   swal("Error!", "Somethings Wrong Zones not Found!", "error");
    // });
  };

  useEffect(() => {
    if (watch("zoneKey")) {
      getLibraryKeys();
    }
  }, [watch("zoneKey")]);

  const getLibraryKeys1 = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLibraryKeysM(
          r.data?.libraryMasterList.map((row) => ({
            id: row.id,
            // zoneName: row.zoneName,
            // zoneNameMr: row.zoneNameMr,
            libraryName: row.libraryName,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };
  const getLibraryKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(
        `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${watch(
          "zoneKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setLibraryKeys(
          r.data.libraryMasterList.map((row) => ({
            id: row.id,
            // zoneName: row.zoneName,
            // zoneNameMr: row.zoneNameMr,
            libraryName: row.libraryName,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };
  const getDepartmentUsers = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          let result = res?.data?.user;
          let _res = result?.map((val, i) => {
            return {
              srNo: i + 1 + _pageNo * _pageSize,
              activeFlag: val?.activeFlag,
              officeDepartmentDesignationUserDaoLst:
                val?.officeDepartmentDesignationUserDaoLst,
              id: val?.id,
              application: val?.applications
                ? val?.applications
                : "Not Available",
              email: val?.email ? val.email : "Not Available",
              role: val?.roles ? val.roles : "Not Available",
              userName: val?.userName,
              userNameColEn: val?.firstNameEn
                ? val.firstNameEn +
                  " " +
                  val.middleNameEn +
                  " " +
                  val.lastNameEn
                : "Not Available",

              userNameColMr: val?.firstNameMr
                ? val.firstNameMr +
                  " " +
                  val.middleNameMr +
                  " " +
                  val.lastNameMr
                : "Not Available",

              department: val?.department,
              // department: _departmentList[val.department] ? _departmentList[val.department] : "-",

              // department: departmentList?.find((d)=>d.id===val.department)?.department,

              dept: val.department,
              desig: val.designation,
              // designation: _designationList[val.designation] ? _designationList[val.designation] : "-",
              designation: val.designation,
              mobileNo: val.phoneNo,
              firstName: val.firstNameEn,
              middleName: val.middleNameEn,
              lastName: val.lastNameEn,
              firstNameMr: val.firstNameMr,
              middleNameMr: val.middleNameMr,
              lastNameMr: val.lastNameMr,
              empCode: val.empCode,
              isDepartmentUser: val.deptUser,
              isCfcUser: val.cFCUser,
              isOtherUser: val.otherUser,
              // useFeildArray
              locationName: val.locationName,
              departmentName: val.departmentName,
              designationName: val.designationName,
              primaryDesignation: val.primaryDesignation,
              primaryDepartment: val.primaryDepartment,
              primaryOffice: val.primaryOffice,
            };
          });

          setUsers({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        }
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   console.log(err);
    //   toast("Data load123", {
    //     type: "error",
    //   });
    // });
  };

  useEffect(() => {
    getBookClassifications();
  }, [fetchData, users, libraryKeys, libraryKeysM]);

  // Get Table - Data
  const getBookClassifications = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LMSURL}/userLibraryMapping/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r?.data?.mstUserLibraryMappingDaoList;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            applicationId: r.applicationId,
            // librarykey: r.librarykey,
            // user: users?.rows?.find((user) => r.userKey == user.id)?.userName,
            user: r.userKey,
            libraryName: libraryKeysM?.find(
              (library) => library?.id == r.libraryKey
            )?.libraryName,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        console.log("aala", _res);
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
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "save") {
      const tempData = axios
        .post(`${urls.LMSURL}/userLibraryMapping/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          // setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      const tempData = axios
        .post(`${urls.LMSURL}/userLibraryMapping/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getBookClassifications();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          // setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  // Delete By ID
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
            // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
            .post(`${urls.LMSURL}/bookTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBookClassifications();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              // setLoading(false);
              callCatchMethod(error, language);
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
            .delete(`${urls.LMSURL}/bookTypeMaster/delete/${body.id}`)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getBookClassifications();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              // setLoading(false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    bookType: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    bookType: "",

    id: null,
  };

  const columns = [
    {
      field: "srNo",
      // headerName: 'id',
      headerName: <FormattedLabel id="id" />,
      flex: 1,
    },
    {
      field: "user",
      headerName: "User",
      // headerName: <FormattedLabel id="bookType" />,
      flex: 1,
    },
    {
      field: "libraryName",
      headerName: "Library Name",
      // headerName: <FormattedLabel id="bookType" />,
      flex: 1,
    },

    {
      field: "actions",
      // headerName: 'Actions',
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
                console.log("params.row: ", params.row);
                reset(params.row);
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
                setBtnSaveText("update"),
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

  // Row

  return (
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
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          User Library Master
          {/* {<FormattedLabel id="bookTypeMaster" />} */}
        </h2>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Grid
                container
                spacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                style={{ justifyContent: "center", marginTop: "1vh" }}
                columns={16}
              >
                <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, width: "100%" }}
                    error={!!errors.zoneKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="zone" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "100%" }}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            console.log("Zone Key: ", value.target.value);
                            // setTemp(value.target.value)
                          }}
                          label="Zone Name  "
                        >
                          {zoneKeys &&
                            zoneKeys.map((zoneKey, index) => (
                              <MenuItem key={index} value={zoneKey.id}>
                                {/*  {zoneKey.zoneKey} */}

                                {language == "en"
                                  ? zoneKey?.zoneName
                                  : zoneKey?.zoneNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="zoneKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.zoneKey ? errors.zoneKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, width: "100%" }}
                    error={!!errors.libraryKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="libraryCSC" required />
                      {/* Library/Competitive Study Centre */}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "100%" }}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            console.log("Zone Key: ", value.target.value);
                            // setTemp(value.target.value)
                          }}
                          // label="Library/Competitive Study Centre "
                          label={<FormattedLabel id="libraryCSC" required />}
                        >
                          {libraryKeys &&
                            libraryKeys.map((libraryKey, index) => (
                              <MenuItem key={index} value={libraryKey.id}>
                                {/*  {zoneKey.zoneKey} */}

                                {/* {language == 'en'
                                                                                    ? libraryKey?.libraryName
                                                                                    : libraryKey?.libraryNameMr} */}
                                {libraryKey?.libraryName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="libraryKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.libraryKey ? errors.libraryKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                  <TextField
                    sx={{ m: 1, width: "100%" }}
                    id="standard-basic"
                    // label="Author"
                    label={<FormattedLabel id="userKey" />}
                    variant="standard"
                    {...register("userKey")}
                    error={!!errors.userKey}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink: watch("userKey") ? true : false,
                      // ||(router.query.author ? true : false),
                    }}
                    helperText={errors?.userKey ? errors.userKey.message : null}
                  />
                </Grid>

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<SaveIcon />}
                    >
                      {/* {btnSaveText === 'Update' ? 'Update' : 'Save'} */}
                      {<FormattedLabel id={btnSaveText} />}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      {/* clear */}
                      {<FormattedLabel id="clear" />}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {/* exit */}
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
                </Grid>
                {/* </div> */}
              </Grid>
            </Slide>
          )}
        </form>
      </FormProvider>

      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          // type='primary'
          disabled={buttonInputState}
          onClick={() => {
            reset({
              ...resetValuesExit,
            });
            setEditButtonInputState(true);
            setDeleteButtonState(true);
            setBtnSaveText("save");
            setButtonInputState(true);
            setSlideChecked(true);
            setIsOpenCollapse(!isOpenCollapse);
          }}
        >
          {/* add */}
          {<FormattedLabel id="add" />}
        </Button>
      </div>

      <DataGrid
        // disableColumnFilter
        // disableColumnSelector
        // disableToolbarButton
        // disableDensitySelector
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            // printOptions: { disableToolbarButton: true },
            // disableExport: true,
            // disableToolbarButton: true,
            // csvOptions: { disableToolbarButton: true },
          },
        }}
        autoHeight
        sx={{
          // marginLeft: 5,
          // marginRight: 5,
          // marginTop: 5,
          // marginBottom: 5,

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
        // rows={dataSource}
        // columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        //checkboxSelection

        density="compact"
        // autoHeight={true}
        // rowHeight={50}
        pagination
        paginationMode="server"
        // loading={data.loading}
        rowCount={data.totalRows}
        rowsPerPageOptions={data.rowsPerPageOptions}
        page={data.page}
        pageSize={data.pageSize}
        rows={data.rows}
        columns={columns}
        onPageChange={(_data) => {
          getBookClassifications(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getBookClassifications(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
