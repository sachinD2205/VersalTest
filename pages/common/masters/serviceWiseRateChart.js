import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[castMaster].module.css";
import schema from "../../../containers/schema/common/serviceWiseRateChartSchema";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";




const ServiceWiseRateChart = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
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
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  // state for name
  // const [religions, setReligions] = useState([]);
  const [zones, setzone] = useState([]);
  const [wards, setward] = useState([]);
  const [services, setServices] = useState([]);
  const [chargeName, setchargeName] = useState([]);
  // const [hawkerType, sethawkerType] = useState([]);
  // const [dependsUpon, setdependsUpon] = useState([]);
  // const getReligions = () => {
  //   axios
  //     .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setReligions(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           religion: row.religion,
  //         })),
  //       );
  //     });
  // };

  useEffect(() => {
    getZones(),
    getward(),
    getchargeName(),
    // gethawkerType(),
    // getdependsUpon(),
    getServices()
  }, []);

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {})
   
      .then((res) => {

        setServices(
          res.data.service.map((row) => ({
            id: row.id,
            serviceName: row.serviceName,
          })),
        )
        // console.log("service res", res);

        // setServices(res.data.service);
      });
  };
  const getZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
   
      .then((r) => {
        setzone(
          r.data.zone.map((row) => ({
            id: row.id,
            zone: row.zoneName,
          })),
        );
      });
  };

  const getward = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)
      .then((r) => {
        setward(
          r.data.ward.map((row) => ({
            id: row.id,
            ward: row.wardName,
          })),
        );
      });
  };

  const getchargeName = () => {
    axios
      .get(`${urls.CFCURL}/master/chargeName/getAll`)

      .then((r) => {
        setchargeName(
          r.data.chargeName.map((row) => ({
            id: row.id,
            chargeName: row.charge,
          })),
        );
      });
  };

  // const gethawkerType = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/ hawkerType/getAll`)
  //     .then((r) => {
  //       sethawkerType(
  //         r.data. hawkerType.map((row) => ({
  //           id: row.id,
  //           hawkerType: row.hawkerType,
  //         })),
  //       );
  //     });
  // };
 
  // const getdependsUpon = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/dependsUpon/getAll`)
  //     .then((r) => {
  //       setdependsUpon(
  //         r.data.dependsUpon.map((row) => ({
  //           id: row.id,
  //          dependsUpon: row.dependsUpon,
  //         })),
  //       );
  //     });
  // };
  // Get Table - Data
  // const getcast = () => {
  //   axios.get(`${urls.CFCURL}/master/serviceWiseRateChart/getAll`).then((res) => {
  //     setDataSource(
  //       res.data.serviceWiseRateChart.map((r, i) => ({
  //         id: r.id,
  //         srNo: i + 1,
  //         activeFlag: r.activeFlag,
  //         zonePrefix: r.zonePrefix,
  //         zoneName:r.zoneName,
  //         toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
  //         fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
  //       // zone: r.zone,
  //         // zone: zone?.find((obj) => obj?.id === r.zone)
  //         //   ?.zone,
       
  //         remark: r.remark,
  //         status: res.activeFlag === "Y" ? "Active" : "InActive",
  //       })),
  //     );
  //   });
  // };

  // useEffect - Reload On update , delete ,Saved on refresh
  // useEffect(() => {
  //   getcast();
  // }, []);


  useEffect(() => {
    getZone();
  }, []);

  const getZone = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/serviceWiseRateChart/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        console.log(";res", res);

        let result = res.data.serviceWiseRateChart;
        setDataSource(
          result.map((res, i) => {
            return {
              activeFlag: res.activeFlag,
              // gisId: res.gisId,
              srNo: i + 1,
              id: res.id,
              toDate: moment(res.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(res.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              serviceWiseRateChartPrefix:res.serviceWiseRateChartPrefix,
              // serviceWiseRateChartPrefixMr:res.serviceWiseRateChartPrefixMr,
              // serviceName:res.serviceName,
              amount:res.amount,
              remark:res.remark,

              zone: zones[res.zone]
              ? zones[res.zone].zone
              : "-",
              serviceName: services[res.serviceName]
              ? services[res.serviceName].serviceName
              : "-",
              ward: wards[res.ward]
              ? wards[res.ward].ward
              : "-",
              chargeName: chargeName[res.chargeName]
              ? chargeName[res.chargeName].chargeName
              : "-",
              // chargeName:res.ward,
              // ward:res.ward,
              // chargeName:res.chargeName,
              // hawkerType:res.hawkerType,
              status: res.activeFlag === "Y" ? "Active" : "InActive",
            };
          })
        );

        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    const fromDate = new Date(fromData.fromDate).toISOString();
    const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
    };

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.CFCURL}/master/serviceWiseRateChart/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            // getcast();
            getZone();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios
        .post(`${urls.CFCURL}/master/serviceWiseRateChart/save`, finalBodyForApi)
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            // getcast();
            getZone();
            setButtonInputState(false);
            setIsOpenCollapse(false);
          }
        });
    }
  };

  // Delete By ID
//   const deleteById = (value) => {
//     swal({
//       title: "Delete?",
//       text: "Are you sure you want to delete this Record ? ",
//       icon: "warning",
//       buttons: true,
//       dangerMode: true,
//     }).then((willDelete) => {
//       if (willDelete) {
//         axios
//           .delete(`${urls.BaseURL}/castMaster/discardCastMaster/${value}`)
//           .then((res) => {
//             if (res.status == 226) {
//               swal("Record is Successfully Deleted!", {
//                 icon: "success",
//               });
//               setButtonInputState(false);
//               getcast();
//             }
//           });
//       } else {
//         swal("Record is Safe");
//       }
//     });
//   };


const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/serviceWiseRateChart/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getZone();
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
            .post(`${urls.CFCURL}/master/serviceWiseRateChart/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getZone();
                setButtonInputState(false);
              }
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
    fromDate: null,
    toDate: null,
    
    serviceWiseRateChartPrefix:"",
    serviceWiseRateChartPrefixMr:"",
    serviceName:"",
    amount:"",
    remark:"",
    zone:"",
    ward:"",
    chargeName:"",
    hawkerType:"",
    remark: "",
    

  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
  
 

    serviceWiseRateChartPrefix:"",
    serviceWiseRateChartPrefixMr:"",
    serviceName:"",
    amount:"",
    remark:"",
    zone:"",
    ward:"",
    chargeName:"",
    hawkerType:"",
    remark: "",
    id: null,


  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },
    {
      field: "serviceWiseRateChartPrefix",
      headerName: "serviceWiseRateChartPrefix ",
      flex: 1,
    },
    { field: "fromDate", headerName: "FromDate" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },

    {
        field: "serviceName",
        headerName: "serviceName ",
        flex: 1,
      },
    {
      field: "zone",
      headerName: "Zone",
      // type: "number",
      flex: 1,
    },
    
    {
        field: "ward",
        headerName: "Ward",
        // type: "number",
        flex: 1,
      },

      {
        field: "chargeName",
        headerName: "chargeName",
        // type: "number",
        flex: 1,
      },
    
    {
      field: "amount",
      headerName: "Amount",
      // type: "number",
      flex: 1,
    },
    // {
    //     field: "dependsUpon",
    //     headerName: "Depends Upon",
    //     // type: "number",
    //     flex: 1,
    //   },
      // {
      //   field: "hawkerType",
      //   headerName: "hawkerType",
      //   // type: "number",
      //   flex: 1,
      // },
    {
      field: "remark",
      headerName: "remark",
      //type: "number",
      flex: 1,
    },
    {
        field: "actions",
        headerName: <FormattedLabel id="actions" />,
        width: 120,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <>
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
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
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
                  <Tooltip title="Deactivate">
                    <ToggleOnIcon
                      style={{ color: "green", fontSize: 30 }}
                      onClick={() => deleteById(params.id, "N")}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Activate">
                    <ToggleOffIcon
                      style={{ color: "red", fontSize: 30 }}
                      onClick={() => deleteById(params.id, "Y")}
                    />
                  </Tooltip>
                )}
              </IconButton>
            </>
          );
        },
      },
  ];

  // View
  return (
    <>
      <div>

      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
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
Service Wise Rate Chart
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
        <Paper
          sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
        >
          {isOpenCollapse && (
            <Slide
              direction='down'
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className={styles.small}>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id='serviceWiseRateChartPrefix'
                            label='serviceWiseRateChartPrefix*'
                            variant='standard'
                            {...register("serviceWiseRateChartPrefix")}
                            error={!!errors.serviceWiseRateChartPrefix}
                            helperText={
                              errors?.serviceWiseRateChartPrefix
                                ? errors.serviceWiseRateChartPrefix.message
                                : null
                            }
                          />
                        </div>
                        <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.fromDate}
                          >
                            <Controller
                              control={control}
                              name='fromDate'
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat='DD/MM/YYYY'
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        From Date *
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size='small'
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
                            <FormHelperText>
                              {errors?.fromDate
                                ? errors.fromDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.toDate}
                          >
                            <Controller
                              control={control}
                              name='toDate'
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat='DD/MM/YYYY'
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
                                        size='small'
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
                            <FormHelperText>
                              {errors?.toDate ? errors.toDate.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                      </div>
                      <div className={styles.row}>

                      {/* <div>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id='serviceName'
                            label='ServiceName*'
                            variant='standard'
                            {...register("serviceName")}
                            error={!!errors.serviceName}
                            helperText={
                              errors?.serviceName
                                ? errors.serviceName.message
                                : null
                            }
                          />
                        </div> */}
 <div>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.zone}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                            serviceName
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='serviceName *'
                                >
                                  {services &&
                                    services.map((serviceName, index) => {
                                     return <MenuItem key={index} value={serviceName.id}>
                                        {serviceName.serviceName}
                                      </MenuItem>
                              })}
                                </Select>
                              )}
                              name='serviceName'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.serviceName
                                ? errors.serviceName.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.zone}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                            Zone
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='Religion *'
                                >
                                  {zones &&
                                    zones.map((zone, index) => {
                                     return <MenuItem key={index} value={zone.id}>
                                        {zone.zone}
                                      </MenuItem>
                              })}
                                </Select>
                              )}
                              name='zone'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.zone
                                ? errors.zone.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.ward}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                         Ward
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='ward *'
                                >
                                  {wards &&
                                    wards.map((ward, index) => (
                                      <MenuItem key={index} value={ward.id}>
                                        {ward.ward}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='ward'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.ward
                                ? errors.ward.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                      
                       
                      </div>

                      <div className={styles.row}>

                      <div>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Amount*'
                            variant='standard'
                            {...register("amount")}
                            error={!!errors.amount}
                            helperText={
                              errors?.amount
                                ? errors.amount.message
                                : null
                            }
                          />
                        </div>
                        <div>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.chargeName}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                         chargeName
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='chargeName *'
                                >
                                  {chargeName &&
                                    chargeName.map((chargeName, index) => (
                                      <MenuItem key={index} value={chargeName.id}>
                                        {chargeName.chargeName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='chargeName'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.chargeName
                                ? errors.chargeName.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                      
                      
                      {/* <div>
    <FormControl
      variant='standard'
      sx={{ m: 1, minWidth: 120 }}
      error={!!errors.hawkerType}
    >
      <InputLabel id='demo-simple-select-standard-label'>
      Hawker Type
      </InputLabel>
      <Controller
        render={({ field }) => (
          <Select
            sx={{ width: 250 }}
            value={field.value}
            onChange={(value) => field.onChange(value)}
            label='hawkarType *'
          >
            {hawkerType &&
              hawkerType.map((hawkerType, index) => (
                <MenuItem key={index} value={hawkerType.id}>
                  {hawkerType.hawkerType}
                </MenuItem>
              ))}
          </Select>
        )}
        name='hawkerType'
        control={control}
        defaultValue=''
      />
      <FormHelperText>
        {errors?.hawkerType
          ? errors.hawkerType.message
          : null}
      </FormHelperText>
    </FormControl>
  </div> */}
                      </div>

                      <div className={styles.row}>



                      {/* <div>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.religion}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                         Depends Upon
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='dependsUpon *'
                                >
                                  {dependsUpon &&
                                    dependsUpon.map((dependsUpon, index) => (
                                      <MenuItem key={index} value={dependsUpon.id}>
                                        {dependsUpon.dependsUpon}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='dependsUpon'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.dependsUpon
                                ? errors.dependsUpon.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}
  

  <div>
    <TextField
      sx={{ width: 250 }}
      id='standard-basic'
      label='Remark'
      variant='standard'
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
                          type='submit'
                          variant='contained'
                          color='success'
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
                        <Button
                          sx={{ marginRight: 8 }}
                          variant='contained'
                          color='primary'
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                        <Button
                          variant='contained'
                          color='error'
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
            </Slide>
          )}
          <div className={styles.addbtn}>
            <Button
              variant='contained'
              endIcon={<AddIcon />}
              type='primary'
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
      </div>
    </>
  );
};

export default ServiceWiseRateChart;
