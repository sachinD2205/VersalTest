import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/court.module.css";

import schema from "../../../../containers/schema/LegalCaseSchema/courtSchema";
import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import { ElevatorOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { EyeFilled } from "@ant-design/icons";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

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
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [moduleNames, setModuleName] = useState([]);

  const language = useSelector((state) => state.labels.language);
  let user = useSelector((state) => state.user.user);
  // const [data, setData] = useState({
  //   rows: [],
  //   totalRows: 0,
  //   rowsPerPageOptions: [10, 20, 50, 100],
  //   pageSize: 10,
  //   page: 1,column
  // });
  const [data, setData] = useState([]);

  useEffect(() => {
    getParameter();
  }, [moduleNames]);

  // get Module Name
  const getModuleName = () => {
    axios
      .get(`${urls.SLB}/module/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setModuleName(
          res?.data?.moduleList?.map((r, i) => ({
            id: r.id,
            // name: r.name,
            moduleName: r.moduleName,
          }))
        );
      });
  };

  useEffect(() => {
    getModuleName();
  }, []);

  // get Parameter
  const getParameter = () => {
    axios
      .get(`${urls.SLB}/parameter/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        // let result = r.data.parameter;

        setData(r.data.parameterList);
      });
  };

  useEffect(() => {
    getParameter();
  }, [moduleNames]);

  // New
  const onSubmitForm = (fromData) => {
    // alert("1");

    // Save - DB
    let _body = {
      ...fromData,

      // activeFlag: /* btnSaveText === "Update" ? null :  */ fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${urls.SLB}/parameter/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            let title = "";
            let message = "";
            if (language === "en") {
              title = "Saved!";
              message = "Record Saved successfully !";
            } else {
              title = "जतन!";
              message = "रेकॉर्ड यशस्वीरित्या जतन केले!";
            }
            sweetAlert(title, message, "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      const tempData = axios
        .post(`${urls.SLB}/parameter/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            let title = "";
            let message = "";
            if (language === "en") {
              if (FormData.id) {
                title = "Updated!";
                message = "Record Updated successfully !";
              } else {
                title = "Saved!";
                message = "Record Saved successfully !";
              }
            } else {
              if (FormData.id) {
                title = "अपडेट केले!";
                message = "रेकॉर्ड यशस्वीरित्या अपडेट केले!";
              } else {
                title = "जतन!";
                message = "रेकॉर्ड यशस्वीरित्या जतन केले!";
              }
            }
            sweetAlert(title, message, "success");
            getParameter();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
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

  const columns = [
    { field: "srNo", headerName: "Sr.No", flex: 1 },
    // { field: "courtNo", headerName: "Court No", flex: 1 },

    {
      field: "moduleKey",
      headerName: "Module Name",
    },
    {
      field: "parameterName",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: "Parameter Name",
      // headerName: <FormattedLabel id="courtName" />,
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
                setBtnSaveText("Update"), setID(params.row.id), setIsOpenCollapse(true), setSlideChecked(true);
                // setButtonInputState(true);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), setSlideChecked(true);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon style={{ color: "green", fontSize: 30 }} onClick={() => deleteById(params.id, "N")} />
              ) : (
                <ToggleOffIcon style={{ color: "red", fontSize: 30 }} onClick={() => deleteById(params.id, "Y")} />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Row

  return (
    // <BasicLayout>
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
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>Parameter</h2>
      </Box>

      <Divider />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <Grid container sx={{ marginLeft: "30px", marginTop: "5px", padding: "30px" }}>
                {/* Module Name */}
                <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} error={!!errors.caseMainType}>
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* {<FormattedLabel id="caseType" />} */}
                      Module Name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label={<FormattedLabel id="caseType" />}
                          label="Module Name"

                          // InputLabelProps={{
                          //   shrink: //true
                          //     (watch("caseMainType") ? true : false) ||
                          //     (router.query.caseMainType ? true : false),
                          // }}
                        >
                          {moduleNames &&
                            moduleNames.map((moduleName, index) => (
                              <MenuItem key={index} value={moduleName.id}>
                                {moduleName.moduleName}

                                {/* {language == "en"
                                      ? name?.name
                                      : name?.name} */}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="moduleName"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.moduleName ? errors.moduleName.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                {/* Parameter */}
                <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
                  <TextField
                    // required
                    id="standard-basic"
                    label="Parameter"
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink: (watch("parameterName") ? true : false) || (router.query.parameterName ? true : false),
                    }}
                    {...register("parameterName")}
                    error={!!errors.name}
                    helperText={errors?.name ? errors.name.message : " "}
                  />
                </Grid>

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "50px",
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
                      {/* {btnSaveText} */}
                      {btnSaveText === "Update"
                        ? // <FormattedLabel id="update" />
                          "Update"
                        : // <FormattedLabel id="save" />
                          "Save"}
                    </Button>{" "}
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      {/* <FormattedLabel id="clear" /> */}
                      Clear
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {/* <FormattedLabel id="exit" /> */}
                      Exit
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
            setBtnSaveText("Save");
            setButtonInputState(true);
            setSlideChecked(true);
            setIsOpenCollapse(!isOpenCollapse);
          }}
        >
          {/* <FormattedLabel id="add" /> */}
          Add
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
            printOptions: { disableToolbarButton: true },
            // disableExport: true,
            // disableToolbarButton: true,
            // csvOptions: { disableToolbarButton: true },
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
        // autoHeight={true}
        // rowHeight={50}
        // pagination
        // paginationMode="server"
        // loading={data.loading}
        // rowCount={data.totalRows}
        // rowsPerPageOptions={data.rowsPerPageOptions}
        // page={data.page}
        // pageSize={data.pageSize}
        rows={data}
        columns={columns}
        // onPageChange={(_data) => {
        //   getParameter(data.pageSize, _data);
        // }}
        // onPageSizeChange={(_data) => {
        // updateData("page", 1);
        // getParameter(_data, data.page);
        // }}
      />
    </Paper>
    // </BasicLayout>
  );
};

export default Index;
