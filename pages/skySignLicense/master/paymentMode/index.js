import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  InputLabel,
  Select,
  MenuItem,
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
// import styles from "../paymentMode/view.module.css";
// import schema from "./paymentModeschema";

import styles from "../../../../styles/skysignstyles/view.module.css";
import schema from "../../../../containers/schema/skysignschema/paymentModeschema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";

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

  const [paymentTypes, setpaymentTypes] = useState([]);

  const getpaymentTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstPaymentType/getpaymentTypeData`)
      .then((r) => {
        setpaymentTypes(
          r.data.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
          }))
        );
      });
  };

  useEffect(() => {
    getpaymentTypes();
  }, []);

  // Get Data By ID
  const getDataById = (value) => {
    setIsOpenCollapse(false);
    setID(value);
    axios
      .get(
        `${urls.SSLM}/master/MstPaymentMode/getpaymentModeDaoDataById/?id=${value}`
      )
      .then((res) => {
        reset(res.data);
        setButtonInputState(true);
        setIsOpenCollapse(true);
        setBtnSaveText("Update");
      });
  };

  // Delete By ID
  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.SSLM}/master/MstPaymentMode/discardpaymentMode/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              getPaymentModeDetails();
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });

              setButtonInputState(false);
              //getcast();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    const fromDate = new Date(fromData.fromDate).toISOString();
    const toDate = new Date(fromData.toDate).toISOString();
    console.log("From Date ${fromDate} ");

    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
    };

    // Save - DB

    // Update Data Based On ID
    axios
      .post(
        `${urls.SSLM}/master/MstPaymentMode/savepaymentMode`,
        finalBodyForApi
      )
      .then((res) => {
        if (res.status == 201) {
          id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getPaymentModeDetails();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
        getPaymentModeDetails();
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
    paymentMode: "",
    paymentModePrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    paymentMode: "",
    paymentModePrefix: "",
    remark: "",
    id: "",
  };

  // Get Table - Data
  const getPaymentModeDetails = () => {
    console.log("getLIC ----");
    axios
      .get(`${urls.SSLM}/master/MstPaymentMode/getpaymentModeData`)
      .then((res) => {
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            paymentModePrefix: r.paymentModePrefix,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            paymentMode: r.paymentMode,
            remark: r.remark,
            paymentType: r.paymentType,

            paymentTypeName: paymentTypes?.find(
              (obj) => obj?.id == r.paymentType
            )?.paymentType,
          }))
        );
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getPaymentModeDetails();
  }, [paymentTypes]);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "paymentModePrefix",
      headerName: "Payment Mode Prefix",
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
      field: "paymentTypeName",
      headerName: "Payment Type",
      // type: "number",
      flex: 1,
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
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
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton onClick={() => getDataById(params.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // View
  return (
    <>
      <BasicLayout titleProp={"none"}>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          {isOpenCollapse && (
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Payment Mode Prefix *"
                          variant="standard"
                          {...register("paymentModePrefix")}
                          error={!!errors.paymentModePrefix}
                          helperText={
                            errors?.paymentModePrefix
                              ? errors.paymentModePrefix.message
                              : null
                          }
                        />
                      </div>
                      <div>
                        <FormControl style={{ marginTop: 10 }}>
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
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
                      </div>
                      <div>
                        <FormControl style={{ marginTop: 10 }}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
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
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div className={styles.fieldss}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.paymentType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Payment Type *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Payment Type *"
                              >
                                {paymentTypes &&
                                  paymentTypes.map((paymentType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={paymentType.id}
                                    >
                                      {paymentType.paymentType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="paymentType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.paymentType
                              ? errors.paymentType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="PaymentMode *"
                          variant="standard"
                          // value={dataInForm && dataInForm.paymentMode}
                          {...register("paymentMode")}
                          error={!!errors.paymentMode}
                          helperText={
                            errors?.paymentMode
                              ? errors.paymentMode.message
                              : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Remark"
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </div>
                    </div>

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
      </BasicLayout>
    </>
  );
};

export default Index;

// export default index
