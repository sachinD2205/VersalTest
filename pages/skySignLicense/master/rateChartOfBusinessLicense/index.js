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
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
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
// import styles from "../rateChartOfIndustrialLicense/view.module.css";
// import schema from "./rateChartOfBusinessLicenseschema";
import styles from "../../../../styles/skysignstyles/view.module.css";
import schema from "../../../../containers/schema/skysignschema/rateChartOfBusinessLicenseschema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [businessTypes, setBusinessTypes] = useState([]);
  const [unitTypes, setUnitTypes] = useState([])

  const getBusinessTypes = () => {
    axios.get(`${urls.SSLM}/master/MstBusinessTypes/getAll`).then((r) => {
      setBusinessTypes(
        r.data.mstBusinessTypesDao.map((row, i) => ({
          activeFlag: r.activeFlag,
          id: row.id,
          srNo: i + 1,
          businessType: row.businessType,
          status: row.activeFlag === "Y" ? "Active" : "Inactive",
        }))
      );
    });
  };
  const getUnitTypes = () => {
    axios.get(`${urls.SSLM}/master/MstUnitType/getAll`).then((r) => {
      setUnitTypes(
        r.data?.mstUnitTypeDaoList?.map((row, i) => ({
          activeFlag: row.activeFlag,
          id: row.id,
          srNo: i + 1,
          unitType: row.unitType,
          status: row.activeFlag === "Y" ? "Active" : "Inactive",
        }))
      );
    });
  };

  useEffect(() => {
    getBusinessTypes();
    getUnitTypes();
  }, []);

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
            .post(
              `${urls.SSLM}/master/MstRateChartOfBusinessLicense/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getRateChartOfBusinessLicenseDetails();
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
          axios
            .post(
              `${urls.SSLM}/master/MstRateChartOfBusinessLicense/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getRateChartOfBusinessLicenseDetails();
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
    const fromDate = moment(fromData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(fromData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
      minValue: Number(fromData.minValue),
      maxValue: Number(fromData.maxValue),
      rate: Number(fromData.rate),
      activeFlag: fromData.activeFlag,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    // Save - DB
    console.log("Post -----");
    axios
      .post(
        `${urls.SSLM}/master/MstRateChartOfBusinessLicense/save`,
        finalBodyForApi
      )
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getRateChartOfBusinessLicenseDetails();
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
    fromDate: null,
    toDate: null,
    // fieldLabel:"",
    rateChartOfBusinessLicensePrefix: "",
    slab: "",
    businessDescription: "",
    rate: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    // fieldLabel:"",
    rateChartOfBusinessLicensePrefix: "",
    slab: "",
    businessDescription: "",
    rate: "",
    remark: "",
    id: "",
  };

  // Get Table - Data
  const getRateChartOfBusinessLicenseDetails = (
    _pageSize = 10,
    _pageNo = 0
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    console.log("getLIC ----");
    axios
      .get(`${urls.SSLM}/master/MstRateChartOfBusinessLicense/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.MstRateChartOfBusinessLicense;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            //fieldLabel:r,fieldLabel,
            // rateChartOfBusinessLicensePrefix:
            //   r.rateChartOfBusinessLicensePrefix,
            // businessDescription: r.businessDescription,
            // slab: r.slab,
            businessType: businessTypes?.find((item) => item.id == r.businessTypesKey)?.businessType,
            typeOfRate: r.typeOfRate,
            minValue: r.minValue,
            maxValue: r.maxValue,
            rate: r.rate,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
            remark: r.remark,
            unit: unitTypes?.find((unitType) => unitType.id == r.unitKey)?.unitType,
            noOfQuantity: r.noOfQuantity,
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
      });
  };
  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getRateChartOfBusinessLicenseDetails();
  }, [unitTypes, businessTypes]);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },


    { field: "fromDate", headerName: "From Date" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    {
      field: "businessType",
      headerName: "Business Type",
      flex: 1,
    },
    {
      field: "typeOfRate",
      headerName: "Type of Rate",
      flex: 1,
    },
    {
      field: "minValue",
      headerName: "Minimum Value",
      flex: 1,
    },
    {
      field: "maxValue",
      headerName: "Maximum Value",
      flex: 1,
    },
    {
      field: "noOfQuantity",
      headerName: "No. Of Quantity",
      flex: 1,
    },

    {
      field: "rate",
      headerName: "Rate ",
      // type: "number",
      flex: 1,
    },
    {
      field: "unit",
      headerName: "Unit Type ",
      // type: "number",
      flex: 1,
    },
    {
      field: "remark",
      headerName: "Remark",
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
                setValue("toDate", params?.row?.toDate)
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
                setValue("toDate", params?.row?.toDate)

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
      {/* <BasicLayout titleProp={"Rate Chart of Business License"}> */}
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
          <h2>
            Rate Chart of Business License
          </h2>
        </Box>
        {isOpenCollapse && (
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>

                <Grid
                  container
                  sx={{ marginLeft: "10vh", marginTop: 2, marginBottom: 5, align: "center" }}
                >




                  <Grid item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}>
                    <FormControl style={{ marginTop: 10 }}>
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD-MM-YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  From Date
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
                                      marginTop: 3,
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}>
                    <FormControl style={{ marginTop: 10 }}>
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD-MM-YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>To Date</span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
                                      marginTop: 3,
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}>

                    {/* <TextField
                      id="standard-basic"
                      label="Rate Chart of Business License Prefix *"
                      variant="standard"
                      {...register("rateChartOfBusinessLicensePrefix")}
                      error={!!errors.rateChartOfBusinessLicensePrefix}
                      helperText={
                        errors?.rateChartOfBusinessLicensePrefix
                          ? errors.rateChartOfBusinessLicensePrefix.message
                          : null
                      }
                    /> */}

                    <FormControl
                      variant="standard"
                      sx={{ m: 1, width: 120 }}
                      error={!!errors.businessTypesKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Business Type
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Business Type *"
                          >
                            {businessTypes &&
                              businessTypes.map((businessType, index) => (
                                <MenuItem key={index} value={businessType.id}>
                                  {businessType.businessType}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="businessTypesKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.businessTypesKey ? errors.businessTypesKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}>
                    {/* <TextField
                      id="standard-basic"
                      label="Business Description*"
                      variant="standard"
                      // value={dataInForm && dataInForm.roadZonePremium}
                      {...register("businessDescription")}
                      error={!!errors.businessDescription}
                      helperText={
                        errors?.businessDescription
                          ? errors.businessDescription.message
                          : null
                      }
                    /> */}
                    <Controller
                      name="typeOfRate"
                      control={control}
                      render={({ field }) => (
                        <>
                          {/* <Typography sx={{ m: 1 }}>Type of rate</Typography> */}

                          <RadioGroup
                            {...field}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="Slab"
                          >
                            <FormControlLabel
                              value="Slab"
                              control={<Radio />}
                              label={<FormattedLabel id="slab" />}
                            />
                            <FormControlLabel
                              value="Flat"
                              control={<Radio />}
                              label={<FormattedLabel id="flat" />}
                            />
                            <FormControlLabel
                              value="Quantity"
                              control={<Radio />}
                              label={<FormattedLabel id="quantity" />}
                            />
                          </RadioGroup>
                        </>
                      )}
                    />

                  </Grid>
                  {watch('typeOfRate') == "Flat" || watch('typeOfRate') == "Quantity" ? "" : (
                    <>
                      <Grid item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}>
                        <TextField
                          id="standard-basic"
                          label="Minimum Value"
                          variant="standard"
                          type="number"
                          sx={{ m: 1, width: 250 }}
                          // value={dataInForm && dataInForm.roadZonePremium}
                          {...register("minValue")}
                          error={!!errors.minValue}
                          helperText={errors?.minValue ? errors.minValue.message : null}
                        />
                      </Grid>
                      <Grid item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}>
                        <TextField
                          id="standard-basic"
                          label="Maximum Value"
                          variant="standard"
                          type="number"
                          sx={{ m: 1, width: 250 }}
                          // value={dataInForm && dataInForm.roadZonePremium}
                          {...register("maxValue")}
                          error={!!errors.maxValue}
                          helperText={errors?.maxValue ? errors.maxValue.message : null}
                        />
                      </Grid>
                    </>
                  )}

                  {watch('typeOfRate') == "Quantity" ? (
                    <Grid item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}>
                      <TextField
                        id="standard-basic"
                        label="No Of Quantity"
                        variant="standard"
                        type="number"
                        sx={{ m: 1, width: 250 }}
                        // value={dataInForm && dataInForm.roadZonePremium}
                        {...register("noOfQuantity")}
                        error={!!errors.noOfQuantity}
                        helperText={errors?.noOfQuantity ? errors.noOfQuantity.message : null}
                      />
                    </Grid>
                  ) : ""}

                  <Grid item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}>
                    <TextField
                      id="standard-basic"
                      label="Rate*"
                      variant="standard"
                      sx={{ m: 1, width: 250 }}
                      // value={dataInForm && dataInForm.roadZonePremiumFactor}
                      {...register("rate")}
                      error={!!errors.rate}
                      helperText={errors?.rate ? errors.rate.message : null}
                    />
                  </Grid>
                  <Grid item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}>

                    <FormControl
                      variant="standard"
                      sx={{ m: 1, width: 120 }}
                      error={!!errors.unitKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Unit Type
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 250 }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Unit Type"
                          >
                            {unitTypes &&
                              unitTypes.map((unitType, index) => (
                                <MenuItem key={index} value={unitType.id}>
                                  {unitType.unitType}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="unitKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.unitKey ? errors.unitKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item
                    xl={4}
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}>
                    <TextField
                      id="standard-basic"
                      label="Remark"
                      variant="standard"
                      sx={{ m: 1, width: 250 }}
                      // value={dataInForm && dataInForm.remark}
                      {...register("remark")}
                      error={!!errors.remark}
                      helperText={
                        errors?.remark ? errors.remark.message : null
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
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    Exit
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
            getRateChartOfBusinessLicenseDetails(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getRateChartOfBusinessLicenseDetails(_data, data.page);
          }}
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;

// export default index
