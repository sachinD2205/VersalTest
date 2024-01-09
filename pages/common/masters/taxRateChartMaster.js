import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Button, FormControl, FormHelperText, InputLabel, Paper, Select, MenuItem, Slide, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[taxRateChartMaster].module.css";
import schema from "../../../containers/schema/common/TaxRateChartMaster";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const TaxTypeChartMaster = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
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
  const [hawkigZones, sethawkigZones] = useState([]);
  const [usageTypes, setusageTypes] = useState([]);
  const [propertyTypes, setpropertyTypes] = useState([]);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getHawkingZone();
    getUsageType();
    getPropertyType();


  }, []);

  // useEffect(() => {
  // }, [usageTypes]);

  // useEffect(() => {
  // }, [propertyTypes]);

  useEffect(() => {
    getTaxRateChartMaster();
  }, [hawkigZones, usageTypes, propertyTypes]);


  const getHawkingZone = () => {
    axios.get(`${urls.BaseURL}/hawkigZone/getAll`).then((r) => {
      sethawkigZones(
        r.data.hawkigZone.map((row) => ({
          id: row.id,
          hawingZoneName: row.hawingZoneName,
        })),
      );
    });
  };

  const getUsageType = () => {
    axios.get(`${urls.CFCURL}/master/usageType/getAll`).then((r) => {
      setusageTypes(
        r.data.usageType.map((row) => ({
          id: row.id,
          usageType: row.usageType,
        })),
      );
    });
  };

  const getPropertyType = () => {
    axios.get(`${urls.CFCURL}/master/propertyType/getAll`).then((r) => {
      setpropertyTypes(
        r.data.propertyType.map((row) => ({
          id: row.id,
          propertyType: row.propertyType,
        })),
      );
    });
  };

  // Get Table - Data
  const getTaxRateChartMaster = () => {
    axios
      .get(`${urls.BaseURL}/taxRateChartMaster/getAll`)
      .then((res) => {
        console.log(` ----- ${res.data}`);
        setDataSource(
          res.data.taxRateChart.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            taxRateChartPrefix: r.taxRateChartPrefix,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // hawkigZone:r.hawkigZone,
            // usageType:r.usageType,
            // propertyType:r.propertyType,
            rate: r.rate,
            percentage: r.percentage,
            taxName: r.taxName,
            activeFlag: r.activeFlag,

            // hawkingZoneName: hawkigZones?.find(
            //   (obj) => obj?.id === r.hawkigZone,
            // )?.hawkigZone,
            usageType: usageTypes?.find(
              (obj) => obj?.id === r.usageType,
            )?.usageType,
            //   propertyType: propertyTypes?.find(
            //   (obj) => obj?.id === r.propertyType,
            // )?.propertyType,  
            taxName: r.taxName,
            percentage: r.percentage,
            rate: r.rate,
            remark: r.remark,
          })),
        );
      });
  };

  const editRecord = (rows) => {
    console.log('Edit cha data:', rows)
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const fromDate = new Date(formData.fromDate).toISOString();
    const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    axios
      .post(
        `${urls.BaseURL}/taxRateChartMaster/save`,
        finalBodyForApi,
      )
      .then((res) => {
        if (res.status == 201) {
          formData.id ? sweetAlert("Updated!", "Record Updated successfully !", "success") :
            sweetAlert("Saved!", "Record Saved successfully !", "success");
          getTaxRateChartMaster();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios
  //       .delete(
  //         `${urls.BaseURL}/taxRateChartMaster/save/${value}`,
  //       )
  //       .then((res) => {
  //         if (res.status == 226) {
  //           if (willDelete) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //           } else {
  //             swal("Record is Safe");
  //           }
  //           getHawkingZone();
  //           getUsageType();
  //           getPropertyType();
  //           setButtonInputState(false);
  //         }
  //       });
  //   });
  // };

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
            .post(`${urls.CFCURL}/master/taxRateChartMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });

                getHawkingZone();
                getUsageType();
                getPropertyType();
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
            .post(`${urls.CFCURL}/master/taxRateChartMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });


                getHawkingZone();
                getUsageType();
                getPropertyType();
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
    hawkigZone: "",
    taxName: "",
    taxRateChartPrefix: "",
    percentage: "",
    rate: "",
    usageType: "",
    propertyType: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    hawkigZone: "",
    taxName: "",
    taxRateChartPrefix: "",
    percentage: "",
    rate: "",
    usageType: "",
    propertyType: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      width: 10,
    },
    {
      field: "fromDate",
      headerName: "FromDate",
      width: 100
    },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      width: 100,
    },
    {
      field: "taxName",
      headerName: "Tax Name",
      // type: "number",
      width: 100,
    },
    // {
    //   field: "hawkingZoneName",
    //   headerName: "Hawking Zone",
    //   // type: "number",
    //   width: 130,
    // },

    {
      field: "taxRateChartPrefix",
      headerName: "Tax Rate Chart Prefix ",
      flex: 1
    },
    {
      field: "usageType",
      headerName: "Usage Type",
      // type: "number",
      flex: 1
    },

    // {
    //   field: "propertyType",
    //   headerName: "Property Type",
    //   // type: "number",
    //   width: 120,
    // },




    {
      field: "percentage",
      headerName: "Percentage",
      // type: "number",
      // width: 70,
      fex: 1
    },
    {
      field: "rate",
      headerName: "Rate",
      // type: "number",
      flex: 1
    },



    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      flex: 1
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             setButtonInputState(true);
    //             const usageId = usageTypes.find(
    //               // @ts-ignore
    //                     (obj) => obj?.usageType === params.row.usageType
    //                     // @ts-ignore
    //                   )?.id
    //             const propertyId = propertyTypes.find(
    //               // @ts-ignore
    //                     (obj) => obj?.propertyType === params.row.propertyType
    //                     // @ts-ignore
    //                   )?.id
    //             reset({...params.row, usageType: usageId, propertyType: propertyId  });
    //           }}
    //         >
    //           <EditIcon />
    //         </IconButton>
    //         <IconButton
    //           disabled={deleteButtonInputState}
    //           onClick={() => deleteById(params.id)}
    //         >
    //           <DeleteIcon />
    //         </IconButton>
    //       </>
    //     );
    //   },
    // },

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
                setValue("usageType",usageTypes?.find((type)=>type?.usageType==params?.row?.usageType)?.id)
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
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
          </>
        );
      },
    },


  ];

  // View
  return (

    <>
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
        Tax Rate Chart Master
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper
        sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5, padding: 1 }}
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

                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Tax Name'
                          variant='standard'
                          {...register("taxName")}
                          error={!!errors.taxName}
                          helperText={
                            errors?.taxName ? errors.taxName.message : null
                          }
                        />
                      </div>

                    </div>

                    <div className={styles.row}>
                      {/* <div>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.hawkigZone}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                            Hawking Zone Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='Hawking Zone'
                                >
                                  {hawkigZones &&
                                    hawkigZones.map((hawkigZone, index) => (
                                      <MenuItem
                                        key={index}
                                        value={hawkigZone.id}
                                      >
                                        {hawkigZone.hawkigZone}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='hawkigZone'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.hawkigZone
                                ? errors.hawkigZone.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                          </div> */}

                      <div>
                        <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Tax Rate Chart Prefix *'
                          variant='standard'
                          {...register("taxRateChartPrefix")}
                          error={!!errors.taxRateChartPrefix}
                          helperText={
                            errors?.taxRateChartPrefix
                              ? errors.taxRateChartPrefix.message
                              : null
                          }
                        />
                      </div>

                      <div>
                        <FormControl
                          variant='standard'
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.usageType}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Usage Type
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Usage Type'
                              >
                                {usageTypes &&
                                  usageTypes.map((usageType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={usageType.id}
                                    >
                                      {usageType.usageType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='usageType'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.usageType
                              ? errors.usageType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      {/* <div>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.propertyType}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                            Property Type
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='Property Type'
                                >
                                  {propertyTypes &&
                                    propertyTypes.map((propertyType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={propertyType.id}
                                      >
                                        {propertyType.propertyType}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='propertyType'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.propertyType
                                ? errors.propertyType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                          </div> */}


                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Percentage*'
                          variant='standard'
                          {...register("percentage")}
                          error={!!errors.percentage}
                          helperText={
                            errors?.percentage
                              ? errors.percentage.message
                              : null
                          }
                        />
                      </div>

                    </div>

                    <div className={styles.row}>


                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Rate*'
                          variant='standard'
                          {...register("rate")}
                          error={!!errors.rate}
                          helperText={
                            errors?.rate
                              ? errors.rate.message
                              : null
                          }
                        />
                      </div>


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
    </>

  );
};

export default TaxTypeChartMaster;
