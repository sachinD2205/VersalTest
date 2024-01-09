import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

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
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import urls from "../../../../URLS/urls";
// import styles from "../mediaType/view.module.css";
// import schema from "./mediaTypeschema";

import styles from "../../../../styles/skysignstyles/view.module.css";
import schema from "../../../../containers/schema/skysignschema/subZoneAreaMasterschema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [zoneNames, setZoneNames] = useState([]);
  const [subZoneNames, setSubZoneNames] = useState([]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((state) => state.labels.language);

  const handleZoneSelect = (zoneId) => {
    getSubZone(zoneId);
  };
  useEffect(() => {
    getZoneName();
  }, []);

  useEffect(() => {
    getSubZone();
  }, [zoneNames]);

  // get Zone Name
  const getZoneName = () => {
    axios.get(`${urls.SSLM}/mstSkySignZone/getAll`).then((res) => {
      setZoneNames(
        res.data.mstSkySignZoneDao.map((r, i) => ({
          id: r.id,

          zoneName: r.zoneName,
          zoneNameMr: r.zoneNameMr,
        }))
      );
    });
  };

  // get Sub-Zone
  const getSubZone = (zoneId) => {
    axios
      .get(
        `${urls.SSLM}/mstSkySignZone/getData/?id=${
          // pass Zone Name
          zoneId
        }`
      )
      .then((res) => {
        setSubZoneNames(
          res.data.mstSubZoneDao.map((r, i) => ({
            id: r.id,

            subZoneName: r.subZoneName,
            subZoneNameMr: r.subZoneNameMr,
          }))
        );
      });
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
          axios.post(`${urls.SSLM}/mstSkySignZone/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getSubZoneAreaDetails();
              setButtonInputState(false);
            }
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
          axios.post(`${urls.SSLM}/mstSkySignZone/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getSubZoneDetails();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    console.log("formData", fromData);

    const finalBodyForApi = {
      ...fromData,

      activeFlag: btnSaveText === "Update" ? null : fromData.activeFlag,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    // Save - DB
    console.log("Post -----");
    axios
      .post(`${urls.SSLM}/mstSubZoneArea/save`, finalBodyForApi)
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // getSubZoneDetails();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
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
    zoneKey: "",
    subZoneName: "",
    subZoneNameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneKey: "",
    subZoneName: "",
    subZoneNameMr: "",
    id: "",
  };

  // Get Table - Data
  const getSubZoneAreaDetails = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    console.log("getLIC ----");
    axios
      .get(`${urls.SSLM}/mstSubZoneArea/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.mstSubZoneAreaDao;
        console.log("result", result);

        let _res = result?.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            // subZoneName: r.subZoneName,
            // subZoneNameMr: r.subZoneNameMr,

            zoneName: r.zoneKey
              ? zoneNames?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              : "-",
            zoneNameMr: r.zoneKey
              ? zoneNames?.find((obj) => obj?.id == r.zoneKey)?.zoneNameMr
              : "-",
            // subZoneAreaKey: r.subZoneAreaKey,

            subZoneAreaKey: r.subZoneAreaKey
              ? subZoneNames?.find((obj) => obj?.id == r.subZoneAreaKey)
                  ?.subZoneName
              : "-",

            // subZoneAreaName: subZoneNames?.find(
            //   (obj) => obj?.id === r.subZoneAreaKey
            // )?.subZoneName,

            // subZoneAreaKey: r.subZoneAreaKey
            //   ? subZoneNames?.find(
            //       (obj) => (obj?.id == r.subZoneAreaKey)?.subZoneName
            //     )
            //   : "-",

            // subZoneAreaKey convert in string

            // subZoneAreaKey:r.subZoneAreaKey?subZoneNames?.find((obj)=>obj?.id==r.subZoneAreaKey)?subZoneAreaKey:"-",

            subZoneAreaName: r.subZoneAreaName,
            subZoneAreaNameMr: r.subZoneAreaNameMr,
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
      });
  };
  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getSubZoneAreaDetails();
  }, []);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    {
      // field: "zoneKey",
      field: language === "en" ? "zoneName" : "zoneNameMr",

      headerName: <FormattedLabel id="zonename" />,
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "subZoneAreaKey",
    //   headerName: "Sub-Zone Name",
    //   flex: 1,
    // },

    {
      field: "subZoneAreaName",
      // headerName: "Sub-Zone Area",
      headerName: <FormattedLabel id="areaEn" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "subZoneAreaNameMr",
      // headerName: "Sub-Zone Area Marathi",
      headerName: <FormattedLabel id="areaMr" />,

      //type: "number",
      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
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
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
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
      {/* <BasicLayout titleProp={"none"}> */}
      <Paper
        sx={{
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
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          {/* <h2>Sub-Zone Area Master</h2> */}
          <h2>
            <FormattedLabel id="subZoneAreaMaster" />
          </h2>
        </Box>
        {isOpenCollapse && (
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid
                  container
                  sx={{
                    marginLeft: "10vh",
                    marginTop: 2,
                    marginBottom: 5,
                    align: "center",
                  }}
                >
                  {/* Zone Name */}
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: 120 }}
                      error={errors.zoneKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="zonename" />}
                        {/* Zone Name */}
                      </InputLabel>
                      <Controller
                        name="zoneKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            sx={{ width: 250 }}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleZoneSelect(e.target.value); // Call getSubZone with the selected zoneId
                            }}
                            value={field.value}
                            // label={<FormattedLabel id="departmentName" required />}
                            label="Zone Name"
                          >
                            {zoneNames?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.zoneName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.zoneKey ? errors.zoneKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Sub Zone  */}
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <FormControl
                      fullWidth
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: 120 }}
                      error={errors.subZoneAreaKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="subZoneName" />}
                        {/* Sub-Zone Name */}
                      </InputLabel>
                      <Controller
                        name="subZoneAreaKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            sx={{ width: 250 }}
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            // label={<FormattedLabel id="departmentName" required />}
                            label="Sub-Zone Name"
                          >
                            {subZoneNames?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.subZoneName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      {/* <FormHelperText style={{ color: "red" }}>
                        {errors?.zoneKey ? errors.zoneKey.message : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                  {/* Area in English  */}
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <TextField
                      id="standard-basic"
                      // label="Area *"
                      label={<FormattedLabel id="areaEn" />}
                      variant="standard"
                      {...register("subZoneAreaName")}
                      error={!!errors.subZoneAreaName}
                      helperText={
                        errors?.subZoneAreaName
                          ? errors.subZoneAreaName.message
                          : null
                      }
                    />
                  </Grid>
                  {/* Area in Marathi  */}
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <TextField
                      id="standard-basic"
                      // label="Area Marathi*"
                      label={<FormattedLabel id="areaMr" />}
                      variant="standard"
                      {...register("subZoneAreaNameMr")}
                      error={!!errors.subZoneAreaNameMr}
                      helperText={
                        errors?.subZoneAreaNameMr
                          ? errors.subZoneAreaNameMr.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <div className={styles.btn}>
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    {btnSaveText}
                  </Button>{" "}
                  <Button
                    sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    {/* Clear */}
                    <FormattedLabel id="clear" />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    {/* Exit */}
                    <FormattedLabel id="exit" />
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
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
              setBtnSaveText("Save");
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            Add{" "}
          </Button>
        </div>
        <DataGrid
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
            getSubZoneAreaDetails(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getSubZoneAreaDetails(_data, data.page);
          }}
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;

// export default index
