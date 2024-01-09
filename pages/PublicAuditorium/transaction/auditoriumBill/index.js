import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import urls from "../../../../URLS/urls";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import SaveIcon from "@mui/icons-material/Save";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumBill";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import DescriptionIcon from "@mui/icons-material/Description";
import moment from "moment";
import { useRouter } from "next/router";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const AuditoriumBill = () => {
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      role: "",
      level: "",
      isPayExtraEquipmentChargesOnly: false,
    },
    defaultValues: {
      levelsOfRolesDaoList: [
        {
          equipment: "",
          quantity: "",
          _rate: [
            {
              label: language == "en" ? "Company Rate" : "कंपनीच ेदर",
              value: 0,
            },
            {
              label: language == "en" ? "Corporation Rate" : "मनपा दर",
              value: 0,
            },
          ],
          rate: "",
          total: "",
        },
      ],
    },
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "levelsOfRolesDaoList",
      control,
    }
  );

  const [auditoriums, setAuditoriums] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentCharges, setEquipmentCharges] = useState([]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [bookedData, setBookedData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const accordionRef = useRef(null);
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

  useEffect(() => {
    getAuditorium();
    getEquipment();
    getEquipmentCharges();
  }, []);

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            ...row,
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getEquipment = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipment/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEquipments(res?.data?.mstEquipmentList);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getEquipmentCharges = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCharges/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("equ charges", res.data.mstEquipmentChargesList);
        setEquipmentCharges(res?.data?.mstEquipmentChargesList);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const searchDetails = () => {};

  const onSubmitForm = (formData) => {
    console.log("formData", formData, watch("isPayExtraEquipmentChargesOnly"));

    sweetAlert({
      title: language == "en" ? "Auditorium Booking" : "प्रेक्षागृह बुकिंग",
      text:
        language == "en"
          ? "Do you really want to generate an bill?"
          : "तुम्हाला खरोखर बिल तयार करायचे आहे का?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: [
        language == "en" ? "No" : "नाही",
        language == "en" ? "Yes" : "होय",
      ],
    }).then((will) => {
      if (will) {
        const eventDate = moment(formData.eventDate, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );

        const applicationDate = moment(
          formData.applicationDate,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD");

        const finalBodyForApi = {
          ...formData,
          eventDate,
          applicationDate,
          isApproved: true,
          processType: "B",
          extraEquipmentUsedChargesList: formData.levelsOfRolesDaoList.map(
            (val) => {
              return {
                equipmentKey: Number(val.equipment),
                quantity: Number(val.quantity),
                rate: Number(val.rate),
                total: Number(val.total),
              };
            }
          ),
          extraEquipmentUsedChargesAmout: watch("extraEquipmentAmount")
            ? watch("extraEquipmentAmount")
            : 0,
          manualOtherCharges: watch("otherChargesAmount")
            ? Number(watch("otherChargesAmount")) +
              Number(watch("otherChargesAmount") * 0.18)
            : 0,
          isPayExtraEquipmentChargesOnly:
            watch("isPayExtraEquipmentChargesOnly") == (null || false)
              ? false
              : true,
        };

        console.log("finalBodyForApi", finalBodyForApi);

        axios
          .post(
            `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`,
            finalBodyForApi,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log("save data", res);
            if (res.status == 201) {
              router.push({
                pathname:
                  "/PublicAuditorium/transaction/auditoriumBill/AuditoriumBillReceipt",
                query: {
                  showData: JSON.stringify(res?.data),
                },
              });
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            setLoading(false);
            callCatchMethod(err, language);
          });
      } else {
        // router.push("/dashboard");
      }
    });
  };

  const onPayExtraAmountAndGenerateBill = (formData) => {
    console.log("formData", formData, watch("isPayExtraEquipmentChargesOnly"));

    sweetAlert({
      title: language == "en" ? "Auditorium Booking" : "प्रेक्षागृह बुकिंग",
      text:
        language == "en"
          ? "Do you really want to generate an bill?"
          : "तुम्हाला खरोखर बिल तयार करायचे आहे का?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: [
        language == "en" ? "No" : "नाही",
        language == "en" ? "Yes" : "होय",
      ],
    }).then((will) => {
      if (will) {
        const eventDate = moment(formData.eventDate, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );

        const applicationDate = moment(
          formData.applicationDate,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD");

        const finalBodyForApi = {
          ...formData,
          eventDate,
          applicationDate,
          isApproved: true,
          processType: "B",
          extraEquipmentUsedChargesList: formData.levelsOfRolesDaoList.map(
            (val) => {
              return {
                equipmentKey: Number(val.equipment),
                quantity: Number(val.quantity),
                rate: Number(val.rate),
                total: Number(val.total),
              };
            }
          ),
          extraEquipmentUsedChargesAmout: watch("extraEquipmentAmount"),
          isPayExtraEquipmentChargesOnly:
            watch("isPayExtraEquipmentChargesOnly") == (null || false)
              ? false
              : true,
        };

        console.log("finalBodyForApi", finalBodyForApi);

        axios
          .post(
            `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`,
            finalBodyForApi,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log("save data", res);
            if (res.status == 201) {
              router.push({
                pathname:
                  "/PublicAuditorium/transaction/auditoriumBill/AuditoriumBillReceipt",
                query: {
                  showData: JSON.stringify(res?.data),
                },
              });
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            setLoading(false);
            callCatchMethod(err, language);
          });
      } else {
        // router.push("/dashboard");
      }
    });
  };

  const appendUI = () => {
    append({
      equipment: "",
      quantity: "",
      rate: "",
      _rate: [
        {
          label: "Company Rate",
          value: 0,
        },
        {
          label: "Corporation Rate",
          value: 0,
        },
      ],
      total: "",
    });
  };

  const getAuditoriumBookingDetailsById = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    let applicationNumber = watch("auditoriumBookingNumber");
    let fromDate =
      watch("fromDate") && moment(watch("fromDate")).format("DD/MM/YYYY");
    let toDate =
      watch("toDate") && moment(watch("toDate")).format("DD/MM/YYYY");
    let auditoriumId = watch("auditoriumName") && watch("auditoriumName");

    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getBookingDetailsForExtraEquipmentAd`,
        {
          params: {
            auditoriumId: auditoriumId ? auditoriumId : null,
            applicationNumber: applicationNumber ? applicationNumber : null,
            fromDate: fromDate ? fromDate : null,
            toDate: toDate ? toDate : null,
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setLoading(true);
        console.log("By id", r);
        setLoading(false);
        if (r.status === 200) {
          let res = r?.data?.trnAuditoriumBookingOnlineProcessList;
          console.log("By id", res);
          let _res = res.map((r, i) => {
            return {
              ...r,
              srNo: i + 1 + _pageNo * _pageSize,
              activeFlag: r.activeFlag,
              applicationNumber: r.applicationNumber,
              applicationDate:
                r.applicationDate &&
                moment(r.applicationDate).format("DD/MM/YYYY"),
              auditorium: r.auditoriumId
                ? auditoriums?.find((obj) => {
                    return obj?.id == r.auditoriumId;
                  })?.auditoriumNameEn
                : "",
              applicantName: r.applicantName,
              eventDate:
                r.eventDate && moment(r.eventDate).format("DD/MM/YYYY"),
              event: r.eventTitle,
              status: r.applicationStatus,
            };
          });

          setData({
            rows: _res,
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getToPaymentGateway = (payDetail) => {
    // return (
    //   <form id="nonseamless" method="post" name="redirect" action={payDetail.url}>
    //     <input type="hidden" id="encRequest" name="encRequest" value={payDetail.encRequest}></input>
    //     <input type="hidden" id="access_code" name="access_code" value={payDetail.access_code}></input>
    //     {/* <script language="javascript">{document.redirect.submit()}</script> */}
    //     <script language="javascript">{dispatchEvent(new Event("submit"))}</script>

    //   </form>
    // )
    document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
    <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
    <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
    document.getElementById("dynForm").submit();
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      minWidth: 70,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
    },
    {
      field: "auditorium",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1.5,
      minWidth: 350,
      headerAlign: "center",
    },
    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "event",
      headerName: <FormattedLabel id="eventName" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Generate Bill">
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => {
                  console.log("params", params.row);
                  if (accordionRef.current) {
                    accordionRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                  reset(params?.row);
                  setValue("isPayExtraEquipmentChargesOnly", false);
                  setValue(
                    "eventDay",
                    moment(params?.row?.eventDate, "DD/MM/YYYY").format("dddd")
                  );
                  setBookedData(params?.row);
                }}
              >
                Generate Bill
              </Button>
            </Tooltip>
          </>
        );
      },
    },
    // {
    //   field: "depo",
    //   headerName: <FormattedLabel id="depositAmount" />,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    // {
    //   field: "rent",
    //   headerName: <FormattedLabel id="rentAmount" />,
    //   flex: 1,
    //   headerAlign: "center",
    // },

    // {
    //   field: "receiptNo",
    //   headerName: "Receipt No",
    //   flex: 1,
    //   headerAlign: "center",
    // },
    // {
    //   field: "gst",
    //   headerName: "gst",
    //   flex: 1,
    //   headerAlign: "center",
    // },
  ];

  // const calculateTotalQuantity = () => {
  //   let totalQuantity = 0;

  //   fields.forEach((field) => {
  //     totalQuantity += parseInt(field.total);
  //   });

  //   return totalQuantity;
  // };

  // const watchGrandTotal = watch(
  //   fields.map((_, index) => `levelsOfRolesDaoList.${index}.total`)
  // );

  // const grandTotal = watchGrandTotal
  //   .map((value) => parseFloat(value))
  //   .filter((value) => !isNaN(value))
  //   .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  useEffect(() => {
    if (getValues("levelsOfRolesDaoList")) {
    }
    console.log(
      "grandTotal",
      getValues("levelsOfRolesDaoList"),
      fields.map((vv) => vv.total)
    );
  }, [getValues("levelsOfRolesDaoList")]);

  return (
    <div>
      <PabbmHeader labelName="auditoriumBill" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              sm={3}
              md={3}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                id="outlined-basic"
                label={<FormattedLabel id="auditoriumBookingNumber" />}
                variant="outlined"
                size="small"
                sx={{
                  width: "90%",
                  backgroundColor: "white",
                }}
                {...register("auditoriumBookingNumber")}
                error={!!errors.auditoriumBookingNumber}
                helperText={
                  errors?.auditoriumBookingNumber
                    ? errors.auditoriumBookingNumber.message
                    : null
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              md={3}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                error={errors.auditoriumName}
                variant="outlined"
                size="small"
                sx={{ width: "90%", backgroundColor: "white" }}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  {" "}
                  <FormattedLabel id="selectAuditorium" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={field.value}
                      onChange={(value) => {
                        console.log("value", value);
                        field.onChange(value);
                      }}
                      label={<FormattedLabel id="selectAuditorium" />}
                    >
                      {auditoriums &&
                        auditoriums.map((auditorium, index) => {
                          return (
                            <MenuItem key={index} value={auditorium.id}>
                              {auditorium.auditoriumNameEn}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="auditoriumName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.auditoriumName
                    ? errors.auditoriumName.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              md={3}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <FormControl
                sx={{ width: "90%", backgroundColor: "white" }}
                error={errors.fromDate}
              >
                <Controller
                  name="fromDate"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="fromDate" />
                          </span>
                        }
                        value={field.value || null}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        // selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            error={errors.fromDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.fromDate ? errors.fromDate.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              md={3}
              lg={3}
              xl={3}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
              }}
            >
              <FormControl
                sx={{ width: "90%", backgroundColor: "white" }}
                error={errors.toDate}
              >
                <Controller
                  name="toDate"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="toDate" />
                          </span>
                        }
                        value={field.value || null}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            error={errors.toDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.toDate ? errors.toDate.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{ padding: "10px", display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="outlined"
              color="success"
              disabled={
                !watch("auditoriumBookingNumber") &&
                !watch("auditoriumName") &&
                !watch("fromDate") &&
                !watch("toDate")
              }
              size="small"
              sx={{
                "&:hover": {
                  backgroundColor: "#0A4EE8",
                  color: "#fff",
                },
              }}
              onClick={() => {
                getAuditoriumBookingDetailsById();
              }}
            >
              <FormattedLabel id="searchByAuditoriumBookingNumber" />
            </Button>
            {/* <Button
              size="small"
              variant="contained"
              color="success"
              endIcon={<SearchIcon />}
              onClick={() => {
                sarchDetails();
              }}
            >
              <FormattedLabel id="search" />
            </Button> */}
          </Grid>
          <Grid sx={{ padding: "10px" }}>
            <DataGrid
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => row.srNo}
              components={{ Toolbar: GridToolbar }}
              // autoHeight={true}
              autoHeight={data.pageSize}
              density="compact"
              sx={{
                "& .super-app-theme--cell": {
                  backgroundColor: "#E3EAEA",
                  borderLeft: "10px solid white",
                  borderRight: "10px solid white",
                  borderTop: "4px solid white",
                },
                backgroundColor: "white",
                boxShadow: 2,
                border: 1,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {},
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#E3EAEA",
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-column": {
                  backgroundColor: "red",
                },
              }}
              pagination
              paginationMode="server"
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBillType(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                getBillType(_data, data.page);
              }}
            />
          </Grid>
          <Accordion sx={{ padding: "10px" }} ref={accordionRef}>
            <AccordionSummary
              sx={{
                backgroundColor: "#0070f3",
                color: "white",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#0070f3"
            >
              <Typography>
                <FormattedLabel id="bookingAuditoriumDetails" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    size="small"
                    label={<FormattedLabel id="organizationName" />}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    disabled
                    {...register("organizationName")}
                    error={!!errors.organizationName}
                    helperText={
                      errors?.organizationName
                        ? errors.organizationName.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    size="small"
                    label={<FormattedLabel id="title" />}
                    variant="outlined"
                    disabled
                    {...register("title")}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.title}
                    helperText={errors?.title ? errors.title.message : null}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    size="small"
                    label={<FormattedLabel id="flat_buildingNo" />}
                    disabled
                    sx={{
                      width: "90%",
                    }}
                    variant="outlined"
                    {...register("flatBuildingNo")}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.flatBuildingNo}
                    helperText={
                      errors?.flatBuildingNo
                        ? errors.flatBuildingNo.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="organizationOwnerFirstName" />}
                    disabled
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    {...register("organizationOwnerFirstName")}
                    error={!!errors.organizationOwnerFirstName}
                    helperText={
                      errors?.organizationOwnerFirstName
                        ? errors.organizationOwnerFirstName.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="organizationOwnerMiddleName" />}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    disabled
                    size="small"
                    {...register("organizationOwnerMiddleName")}
                    error={!!errors.organizationOwnerMiddleName}
                    helperText={
                      errors?.organizationOwnerMiddleName
                        ? errors.organizationOwnerMiddleName.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="organizationOwnerLastName" />}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="small"
                    {...register("organizationOwnerLastName")}
                    error={!!errors.organizationOwnerLastName}
                    disabled
                    helperText={
                      errors?.organizationOwnerLastName
                        ? errors.organizationOwnerLastName.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    size="small"
                    label={<FormattedLabel id="buildingName" />}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    {...register("buildingName")}
                    error={!!errors.buildingName}
                    disabled
                    helperText={
                      errors?.buildingName ? errors.buildingName.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    size="small"
                    label={<FormattedLabel id="roadName" />}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    disabled
                    {...register("roadName")}
                    error={!!errors.roadName}
                    helperText={
                      errors?.roadName ? errors.roadName.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="landmark" />}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    disabled
                    size="small"
                    {...register("landmark")}
                    error={!!errors.landmark}
                    helperText={
                      errors?.landmark ? errors.landmark.message : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label={<FormattedLabel id="pinCode" />}
                    variant="outlined"
                    size="small"
                    disabled
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: "90%",
                    }}
                    {...register("pincode")}
                    error={!!errors.pincode}
                    helperText={errors?.pincode ? errors.pincode.message : null}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label={<FormattedLabel id="aadhaarNo" />}
                    disabled
                    // inputProps={{ maxLength: 12 }}
                    size="small"
                    sx={{
                      width: "90%",
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    {...register("aadhaarNo")}
                    error={!!errors.aadhaarNo}
                    helperText={
                      errors?.aadhaarNo ? errors.aadhaarNo.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label={<FormattedLabel id="landline" />}
                    variant="outlined"
                    disabled
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: "90%",
                    }}
                    {...register("landlineNo")}
                    error={!!errors.landlineNo}
                    helperText={
                      errors?.landlineNo ? errors.landlineNo.message : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label={<FormattedLabel id="mobile" />}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{
                      width: "90%",
                    }}
                    variant="outlined"
                    {...register("mobile")}
                    error={!!errors.mobile}
                    helperText={errors?.mobile ? errors.mobile.message : null}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    disabled
                    size="small"
                    label={<FormattedLabel id="emailAddress" />}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    {...register("emailAddress")}
                    error={!!errors.emailAddress}
                    helperText={
                      errors?.emailAddress ? errors.emailAddress.message : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="eventDetails" />}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    disabled
                    size="small"
                    {...register("eventDetails")}
                    error={!!errors.eventDetails}
                    helperText={
                      errors?.eventDetails ? errors.eventDetails.message : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                {bookedData?.timeSlotList &&
                JSON.parse(bookedData?.timeSlotList).length > 0
                  ? JSON.parse(bookedData?.timeSlotList)?.map((val, index) => {
                      return (
                        <Grid container key={index}>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "end",
                            }}
                          >
                            <FormControl
                              sx={{ width: "90%" }}
                              error={errors.eventDate}
                            >
                              <Controller
                                name="eventDate"
                                control={control}
                                defaultValue={val.date}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      disablePast
                                      inputFormat="DD/MM/YYYY"
                                      disabled
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="eventDate" />
                                          {/* Event Date From */}
                                        </span>
                                      }
                                      value={val.bookingDate}
                                      onChange={(date) => {
                                        field.onChange(date);
                                      }}
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          fullWidth
                                          error={errors.eventDate}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.eventDate
                                  ? errors.eventDate.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              sx={{ width: "90%" }}
                              id="outlined-basic"
                              size="small"
                              label={<FormattedLabel id="eventHours" />}
                              disabled
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={val.fromTime + " To " + val.toTime}
                              variant="outlined"
                              {...register("EventHours")}
                              error={!!errors.EventHours}
                              helperText={
                                errors?.EventHours
                                  ? errors.EventHours.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              sx={{ width: "90%" }}
                              id="outlined-basic"
                              size="small"
                              label={<FormattedLabel id="eventDay" />}
                              disabled
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={moment(val.bookingDate).format("dddd")}
                              variant="outlined"
                              {...register("eventDay")}
                              error={!!errors.eventDay}
                              helperText={
                                errors?.eventDay
                                  ? errors.eventDay.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                      );
                    })
                  : null}
              </Grid>

              {/* <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
                          <Controller
                            name="eventTimeFrom"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  value={field.value}
                                  disabled
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="eventTimeFrom" />
                                    </span>
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" error={!!errors.eventTimeFrom} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.eventTimeFrom ? errors.eventTimeFrom.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
                          <Controller
                            name="eventTimeTo"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  disabled
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="eventTimeTo" />
                                    </span>
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" error={!!errors.eventTimeTo} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.eventTimeTo ? errors.eventTimeTo.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="depositAmount" />}
                          disabled
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          {...register("depositAmount")}
                          error={!!errors.depositAmount}
                          helperText={errors?.depositAmount ? errors.depositAmount.message : null}
                        />
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="payDepositAmount" />
                        </Typography>
                        <Link href="#">Link</Link>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="rentAmount" />}
                          variant="standard"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                          disabled
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("rentAmount")}
                          error={!!errors.rentAmount}
                          helperText={errors?.rentAmount ? errors.rentAmount.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="payRentAmount" />}
                          variant="standard"
                          type="number"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("payRentAmount")}
                          error={!!errors.payRentAmount}
                          helperText={errors?.payRentAmount ? errors.payRentAmount.message : null}
                        />
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="depositReceipt" />
                        </Typography>
                        <Link href="#">Print</Link>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="extendedRentAmount" />}
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          disabled
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("extendedRentAmount")}
                          error={!!errors.extendedRentAmount}
                          helperText={errors?.extendedRentAmount ? errors.extendedRentAmount.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="rentReceipt" />
                        </Typography>
                        <Link href="#">Print</Link>
                      </Grid>
                    </Grid> */}

              {/* <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            disabled
                            label={<FormattedLabel id="managersDigitalSignature" />}
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            {...register("managersDigitalSignature")}
                            error={!!errors.managersDigitalSignature}
                            helperText={
                              errors?.managersDigitalSignature
                                ? errors.managersDigitalSignature.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="termsAndConditions" />}
                            variant="standard"
                            disabled
                            InputLabelProps={{ shrink: true }}
                            {...register("termsAndCondition")}
                            error={!!errors.termsAndCondition}
                            helperText={errors?.termsAndCondition ? errors.termsAndCondition.message : null}
                          />
                        </Grid>
                      </Grid> */}
            </AccordionDetails>
          </Accordion>
          {/* <Accordion sx={{ padding: "10px" }}>
            <AccordionSummary
              sx={{
                backgroundColor: "#0070f3",
                color: "white",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#0070f3"
            >
              <Typography>
                <FormattedLabel id="applicantDetails" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    disabled
                    InputLabelProps={{ shrink: true }}
                    label="Applicant Name"
                    variant="standard"
                    {...register("applicantName")}
                    error={!!errors.applicantName}
                    helperText={
                      errors?.applicantName
                        ? errors.applicantName.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Mobile Number"
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    {...register("applicantMobileNo")}
                    error={!!errors.applicantMobileNo}
                    helperText={
                      errors?.applicantMobileNo
                        ? errors.applicantMobileNo.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Confirm Mobile"
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    {...register("applicantConfirmMobileNo")}
                    error={!!errors.applicantConfirmMobileNo}
                    helperText={
                      errors?.applicantConfirmMobileNo
                        ? errors.applicantConfirmMobileNo.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    id="standard-basic"
                    label="Email Address"
                    variant="standard"
                    {...register("applicantEmail")}
                    error={!!errors.applicantEmail}
                    helperText={
                      errors?.applicantEmail
                        ? errors.applicantEmail.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    id="standard-basic"
                    label="Confirm Email Address"
                    variant="standard"
                    {...register("applicantConfirmEmail")}
                    error={!!errors.applicantConfirmEmail}
                    helperText={
                      errors?.applicantConfirmEmail
                        ? errors.applicantConfirmEmail.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    id="standard-basic"
                    label="Relation With Organization"
                    variant="standard"
                    {...register("relationWithOrganization")}
                    error={!!errors.relationWithOrganization}
                    helperText={
                      errors?.relationWithOrganization
                        ? errors.relationWithOrganization.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label="Flat/Building No."
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    {...register("applicantFlatHouseNo")}
                    error={!!errors.applicantFlatHouseNo}
                    helperText={
                      errors?.applicantFlatHouseNo
                        ? errors.applicantFlatHouseNo.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    id="standard-basic"
                    label="Building Name"
                    variant="standard"
                    {...register("applicantBuildingName")}
                    error={!!errors.applicantBuildingName}
                    helperText={
                      errors?.applicantBuildingName
                        ? errors.applicantBuildingName.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    id="standard-basic"
                    label="Landmark"
                    variant="standard"
                    {...register("applicantLandmark")}
                    error={!!errors.applicantLandmark}
                    helperText={
                      errors?.applicantLandmark
                        ? errors.applicantLandmark.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    id="standard-basic"
                    label="Area"
                    variant="standard"
                    {...register("applicantArea")}
                    error={!!errors.applicantArea}
                    helperText={
                      errors?.applicantArea
                        ? errors.applicantArea.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl
                    error={errors.applicantCountry}
                    variant="standard"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Country
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Country"
                          disabled
                          InputLabelProps={{ shrink: true }}
                        >
                          {[
                            { id: 1, name: "India" },
                            { id: 2, name: "Other" },
                          ].map((country, index) => {
                            return (
                              <MenuItem key={index} value={country.name}>
                                {country.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="applicantCountry"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.applicantCountry
                        ? errors.applicantCountry.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl
                    error={errors.applicantState}
                    variant="standard"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Select State
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select State"
                          disabled
                          InputLabelProps={{ shrink: true }}
                        >
                          {["Maharashtra", "Other"].map((state, index) => {
                            return (
                              <MenuItem key={index} value={state}>
                                {state}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="applicantState"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.applicantState
                        ? errors.applicantState.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl
                    error={errors.applicantCity}
                    variant="standard"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      City
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          onChange={(value) => field.onChange(value)}
                          label="City"
                        >
                          {["Pune", "Other"].map((city, index) => {
                            return (
                              <MenuItem key={index} value={city}>
                                {city}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="applicantCity"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.applicantCity
                        ? errors.applicantCity.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    sx={{
                      width: "90%",
                    }}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    id="standard-basic"
                    label="Pin Code"
                    variant="standard"
                    {...register("applicantPinCode")}
                    error={!!errors.applicantPinCode}
                    helperText={
                      errors?.applicantPinCode
                        ? errors.applicantPinCode.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion> */}

          <Accordion sx={{ padding: "10px" }}>
            <AccordionSummary
              sx={{
                backgroundColor: "#0070f3",
                color: "white",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#0070f3"
            >
              <Typography>
                <FormattedLabel id="equipments" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginBottom: "10px",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<AddBoxOutlinedIcon />}
                  onClick={() => {
                    appendUI();
                  }}
                >
                  <FormattedLabel id="addMore" />
                </Button>
              </Box>
              <Grid container>
                {fields.map((witness, index) => {
                  return (
                    <>
                      <Grid
                        container
                        key={index}
                        sx={{
                          backgroundColor: "#E8F6F3",
                          padding: "5px",
                        }}
                      >
                        <Grid
                          item
                          xs={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl style={{ width: "90%" }} size="small">
                            <InputLabel id="demo-simple-select-label">
                              <FormattedLabel id="equipments" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={<FormattedLabel id="equipments" />}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    let df = equipmentCharges.find((val) => {
                                      return (
                                        val.equipmentName ==
                                          value.target.value && val.totalAmount
                                      );
                                    });
                                    console.log("df", df);
                                    const labels = [
                                      "Company Rate",
                                      "Corporation Rate",
                                    ];
                                    const values = [
                                      df?.price,
                                      df?.corporationRate,
                                    ];
                                    const priceAndRateArray = labels.map(
                                      (label, index) => {
                                        return {
                                          label: label,
                                          value: values[index],
                                        };
                                      }
                                    );
                                    // setValue(
                                    //   `levelsOfRolesDaoList.${index}.rate`,
                                    //   df?.totalAmount
                                    // );
                                    setValue(
                                      `levelsOfRolesDaoList.${index}._rate`,
                                      priceAndRateArray
                                    );
                                    setValue(
                                      `levelsOfRolesDaoList.${index}.total`,
                                      0
                                    );
                                    setValue(
                                      `levelsOfRolesDaoList.${index}.quantity`,
                                      0
                                    );
                                    console.log(
                                      "first",
                                      index + 1,
                                      getValues("levelsOfRolesDaoList").length
                                    );

                                    if (
                                      index + 1 ===
                                      getValues("levelsOfRolesDaoList").length
                                    ) {
                                      appendUI();
                                    } else {
                                      remove(index + 1);
                                    }
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {equipments.length > 0
                                    ? equipments.map((val, id) => {
                                        return (
                                          <MenuItem key={id} value={val.id}>
                                            {`${id + 1}. ${
                                              language === "en"
                                                ? val.equipmentNameEn
                                                : val.equipmentNameMr
                                            }`}
                                            {/* {language === "en"
                                              ? val.equipmentNameEn
                                              : val.equipmentNameMr} */}
                                          </MenuItem>
                                        );
                                      })
                                    : "Not Available"}
                                </Select>
                              )}
                              name={`levelsOfRolesDaoList.${index}.equipment`}
                              control={control}
                              defaultValue=""
                              key={witness.id}
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.departmentName
                                ? errors.departmentName.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {/* <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="rate" />}
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            style={{ backgroundColor: "white" }}
                            {...register(`levelsOfRolesDaoList.${index}.rate`)}
                          /> */}
                          {/* <FormLabel component="legend">Rate</FormLabel>{" "} */}
                          {/* Add a label for the radio group */}
                          <RadioGroup
                            aria-label="Rate"
                            row
                            name={`levelsOfRolesDaoList.${index}.rate`}
                            value={watch(`levelsOfRolesDaoList.${index}.rate`)}
                            onChange={(event) => {
                              console.log("eve", event.target.value);
                              setValue(
                                `levelsOfRolesDaoList.${index}.rate`,
                                event.target.value
                              );

                              ////////////////////////////
                              if (
                                watch(
                                  `levelsOfRolesDaoList.${index}.quantity` > 0
                                )
                              ) {
                                const { value } = event.target;
                                setValue(
                                  `levelsOfRolesDaoList[${index}].total`,
                                  watch(
                                    `levelsOfRolesDaoList.${index}.quantity`
                                  ) * value
                                );
                                let tempTotal = 0;
                                watch("levelsOfRolesDaoList").map(
                                  (item) => (tempTotal = tempTotal + item.total)
                                );
                                setValue("equipmentsTotal", tempTotal);
                                setValue(
                                  "extraEquipmentAmount",
                                  Number(tempTotal) + Number(tempTotal * 0.18)
                                );
                                // setValue("extraEquipmentAmount", tempTotal);

                                setGrandTotal(tempTotal);

                                const depositAmount =
                                  parseFloat(getValues("depositAmount")) || 0;

                                const extraEquipmentAmount =
                                  parseFloat(
                                    getValues("extraEquipmentAmount")
                                  ) || 0;
                                const newRefundableAmount =
                                  depositAmount - extraEquipmentAmount;

                                setValue(
                                  "refundableAmount",
                                  newRefundableAmount
                                );
                                setValue(
                                  "onlyAdditionalCharges",
                                  Number(tempTotal) + Number(tempTotal * 0.18)
                                );
                              }
                              /////////////////////////////
                            }}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            {getValues("levelsOfRolesDaoList") &&
                              getValues("levelsOfRolesDaoList")[
                                index
                              ]?._rate?.map((rate, rateIndex) => {
                                return (
                                  <FormControlLabel
                                    key={rateIndex}
                                    value={rate.value}
                                    control={<Radio />}
                                    label={
                                      <span
                                        style={{ fontSize: "14px" }}
                                      >{`${rate.label} : ${rate.value}`}</span>
                                    }
                                  />
                                );
                              })}
                          </RadioGroup>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="quantity" />}
                            variant="outlined"
                            style={{ backgroundColor: "white" }}
                            {...register(
                              `levelsOfRolesDaoList.${index}.quantity`
                            )}
                            key={witness.id}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputRef={register()}
                            onChange={(event) => {
                              const { value } = event.target;
                              setValue(
                                `levelsOfRolesDaoList[${index}].total`,
                                value *
                                  watch(`levelsOfRolesDaoList.${index}.rate`)
                              );
                              let tempTotal = 0;
                              watch("levelsOfRolesDaoList").map(
                                (item) => (tempTotal = tempTotal + item.total)
                              );
                              console.log("aalaa", tempTotal);
                              setValue("equipmentsTotal", tempTotal);
                              setValue(
                                "extraEquipmentAmount",
                                Number(tempTotal) + Number(tempTotal * 0.18)
                              );

                              setGrandTotal(tempTotal);

                              const depositAmount =
                                parseFloat(getValues("depositAmount")) || 0;

                              const extraEquipmentAmount =
                                parseFloat(getValues("extraEquipmentAmount")) ||
                                0;
                              const newRefundableAmount =
                                depositAmount - extraEquipmentAmount;

                              setValue("refundableAmount", newRefundableAmount);
                            }}
                            error={
                              errors?.levelsOfRolesDaoList?.[index]?.quantity
                            }
                            helperText={
                              errors?.levelsOfRolesDaoList?.[index]?.quantity
                                ? errors.levelsOfRolesDaoList?.[index]?.quantity
                                    .message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            id="outlined-basic"
                            label={<FormattedLabel id="total" />}
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            style={{ backgroundColor: "white" }}
                            {...register(`levelsOfRolesDaoList.${index}.total`)}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            color="error"
                            onClick={() => {
                              setValue(
                                "equipmentsTotal",
                                watch("equipmentsTotal") -
                                  watch(`levelsOfRolesDaoList.${index}.total`)
                              );
                              remove(index);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </>
                  );
                })}
              </Grid>
              <Grid
                container
                sx={{
                  padding: "10px",
                }}
              >
                <DataGrid
                  getRowId={(row) => row.srNo}
                  // autoHeight={true}
                  autoHeight={data.pageSize}
                  density="compact"
                  sx={{
                    "& .super-app-theme--cell": {
                      backgroundColor: "#E3EAEA",
                      borderLeft: "10px solid white",
                      borderRight: "10px solid white",
                      borderTop: "4px solid white",
                    },
                    backgroundColor: "white",
                    boxShadow: 2,
                    border: 1,
                    borderColor: "primary.light",
                    "& .MuiDataGrid-cell:hover": {},
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "#E3EAEA",
                    },
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-column": {
                      backgroundColor: "red",
                    },
                  }}
                  pagination
                  paginationMode="server"
                  rowCount={0}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  page={1}
                  pageSize={10}
                  rows={[
                    {
                      srNo: 1,
                      equipmentsTotal: watch("equipmentsTotal"),
                      cgst: watch("equipmentsTotal") * 0.09,
                      sgst: watch("equipmentsTotal") * 0.09,
                      total:
                        Number(watch("equipmentsTotal")) +
                        Number(watch("equipmentsTotal") * 0.18),
                    },
                  ]}
                  columns={[
                    {
                      field: "srNo",
                      headerName: <FormattedLabel id="srNo" />,
                      flex: 0.3,
                      minWidth: 70,
                      headerAlign: "center",
                    },
                    {
                      field: "equipmentsTotal",
                      headerName: <FormattedLabel id="equipmentsTotal" />,
                      flex: 1,
                      minWidth: 70,
                      headerAlign: "center",
                      align: "right",
                    },
                    {
                      field: "cgst",
                      headerName: <FormattedLabel id="cgst" />,
                      flex: 1,
                      minWidth: 70,
                      headerAlign: "center",
                      align: "right",
                    },
                    {
                      field: "sgst",
                      headerName: <FormattedLabel id="sgst" />,
                      flex: 1,
                      minWidth: 70,
                      headerAlign: "center",
                      align: "right",
                    },
                    {
                      field: "total",
                      headerName: <FormattedLabel id="total" />,
                      flex: 1,
                      minWidth: 70,
                      headerAlign: "center",
                      align: "right",
                    },
                  ]}
                  onPageChange={(_data) => {}}
                  onPageSizeChange={(_data) => {}}
                />

                {/* <Grid
                  item
                  xs={11}
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label={<FormattedLabel id="equipmentsTotal" />}
                    variant="outlined"
                    size="small"
                    // disabled
                    inputProps={{
                      readOnly: true,
                      style: {
                        fontWeight: "600",
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontWeight: "600",
                      },
                    }}
                    sx={{
                      width: "17%",
                    }}
                    {...register("equipmentsTotal")}
                  />
                </Grid> */}
              </Grid>
              <Grid
                container
                sx={{
                  padding: "10px",
                }}
              >
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Additional charges"
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ width: "90%" }}
                    {...register("otherCharges")}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ width: "90%" }}
                  >
                    <Controller
                      name="otherChargesAmount"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          label="Additional charges Amount"
                          variant="outlined"
                          onChange={(value) => {
                            field.onChange(value);

                            const depositAmount =
                              parseFloat(getValues("depositAmount")) || 0;

                            const extraEquipmentAmount =
                              parseFloat(getValues("extraEquipmentAmount")) ||
                              0;

                            const newRefundableAmount =
                              depositAmount -
                              (extraEquipmentAmount +
                                (Number(value.target.value) +
                                  Number(value.target.value) * 0.18));

                            setValue(
                              "additionalChargesAmountShow",
                              Number(value.target.value) +
                                Number(value.target.value) * 0.18
                            );

                            setValue("refundableAmount", newRefundableAmount);
                            setValue(
                              "onlyAdditionalCharges",
                              extraEquipmentAmount +
                                (Number(value.target.value) +
                                  Number(value.target.value) * 0.18)
                            );
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  {/* <TextField
                    id="outlined-basic"
                    fullWidth
                    label=""
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      console.log("OCA", e);
                    }}
                    sx={{ width: "90%", border: "solid green" }}
                    {...register("otherChargesAmount")}
                  /> */}
                </Grid>
              </Grid>
              <DataGrid
                getRowId={(row) => row.srNo}
                // autoHeight={true}
                autoHeight={data.pageSize}
                density="compact"
                sx={{
                  "& .super-app-theme--cell": {
                    backgroundColor: "#E3EAEA",
                    borderLeft: "10px solid white",
                    borderRight: "10px solid white",
                    borderTop: "4px solid white",
                  },
                  backgroundColor: "white",
                  boxShadow: 2,
                  border: 1,
                  borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {},
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#E3EAEA",
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-column": {
                    backgroundColor: "red",
                  },
                }}
                pagination
                paginationMode="server"
                rowCount={0}
                rowsPerPageOptions={[10, 20, 50, 100]}
                page={1}
                pageSize={10}
                rows={[
                  {
                    srNo: 1,
                    otherChargesAmount: watch("otherChargesAmount"),
                    cgst: watch("otherChargesAmount") * 0.09,
                    sgst: watch("otherChargesAmount") * 0.09,
                    total:
                      Number(watch("otherChargesAmount")) +
                      Number(watch("otherChargesAmount") * 0.18),
                  },
                ]}
                columns={[
                  {
                    field: "srNo",
                    headerName: <FormattedLabel id="srNo" />,
                    flex: 0.3,
                    minWidth: 70,
                    headerAlign: "center",
                  },
                  {
                    field: "otherChargesAmount",
                    headerName: "Additional charges Amount",
                    flex: 1,
                    minWidth: 70,
                    headerAlign: "center",
                    align: "right",
                  },
                  {
                    field: "cgst",
                    headerName: <FormattedLabel id="cgst" />,
                    flex: 1,
                    minWidth: 70,
                    headerAlign: "center",
                    align: "right",
                  },
                  {
                    field: "sgst",
                    headerName: <FormattedLabel id="sgst" />,
                    flex: 1,
                    minWidth: 70,
                    headerAlign: "center",
                    align: "right",
                  },
                  {
                    field: "total",
                    headerName: <FormattedLabel id="total" />,
                    flex: 1,
                    minWidth: 70,
                    headerAlign: "center",
                    align: "right",
                  },
                ]}
                onPageChange={(_data) => {}}
                onPageSizeChange={(_data) => {}}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ padding: "10px" }}>
            <AccordionSummary
              sx={{
                backgroundColor: "#0070f3",
                color: "white",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#0070f3"
            >
              <Typography>
                <FormattedLabel id="depositAdjustment" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Typography sx={{ fontWeight: 600, color: "green" }}>
                  *{" "}
                  {`${
                    language == "en"
                      ? "Paid Deposit on"
                      : "देय अनामत भरलेली दिनांक"
                  } ${moment(bookedData?.paymentDao?.depositePayDate).format(
                    "DD/MM/YYYY"
                  )} ${
                    language == "en"
                      ? ", Receipt Number is"
                      : "पावती क्रमांक आहे"
                  } ${bookedData?.paymentDao?.pgDepositeKey}`}
                </Typography>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label={<FormattedLabel id="depositAmount" />}
                    variant="outlined"
                    size="small"
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      width: "90%",
                    }}
                    {...register("depositAmount")}
                    error={!!errors.depositAmount}
                    helperText={
                      errors?.depositAmount
                        ? errors.depositAmount.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    size="small"
                    label={<FormattedLabel id="extraEquipmentAmount" />}
                    // label="Extra Equipment Amount"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                    // value={watch("equipmentsTotal")}
                    sx={{ width: "90%" }}
                    {...register("extraEquipmentAmount")}
                    error={!!errors.extraEquipmentAmount}
                    helperText={
                      errors?.extraEquipmentAmount
                        ? errors.extraEquipmentAmount.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    size="small"
                    label="Additional Charges Amount"
                    variant="outlined"
                    disabled
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("additionalChargesAmountShow")}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    size="small"
                    label={<FormattedLabel id="refundableAmount" />}
                    variant="outlined"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                    {...register("refundableAmount")}
                    error={!!errors.refundableAmount}
                    helperText={
                      errors?.refundableAmount
                        ? errors.refundableAmount.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Controller
                  name="isPayExtraEquipmentChargesOnly"
                  control={control}
                  defaultValue={false} // Set your initial value here
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label={
                        language === "en"
                          ? "Pay Extra Equipment or Other Charges Only"
                          : "फक्त अतिरिक्त उपकरणे किंवा इतर शुल्क भरा"
                      }
                    />
                  )}
                />
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                {watch("isPayExtraEquipmentChargesOnly") && (
                  <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      size="small"
                      label="Only Additional Charges"
                      variant="outlined"
                      {...register("onlyAdditionalCharges")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // value={watch("onlyAdditionalCharges")}
                      disabled
                    />
                  </Grid>
                )}
              </Grid>

              <Grid
                container
                sx={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {watch("isPayExtraEquipmentChargesOnly") ? (
                  <Button
                    size="small"
                    type="button"
                    onClick={handleSubmit(onPayExtraAmountAndGenerateBill)}
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id="payExtraAmountAndGenerateBill" />
                  </Button>
                ) : (
                  <Button
                    size="small"
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id="generateBill" />
                  </Button>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </form>
      </FormProvider>
    </div>
  );
};

export default AuditoriumBill;
