import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  Slide,
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
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[taxNameMaster].module.css";
import schema from "../../../containers/schema/common/TaxNameMaster";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";


const TaxNameMaster = () => {
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
  const [taxTypes, setTaxTypes] = useState([]);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getTaxTypes();
  }, []);

  useEffect(() => {
    getTaxName();
  }, [taxTypes]);

  const getTaxTypes = () => {
    axios.get(`${urls.BaseURL}/taxTypeMaster/getAll`).then((r) => {
      // getTaxTypeMasterData
      setTaxTypes(
        r.data.taxType.map((row) => ({
          id: row.id,
          taxType: row.taxType,
        })),
      );
    });
  };

  // Get Table - Data
  const getTaxName = () => {
    axios
      .get(`${urls.BaseURL}/taxNameMaster/getAll`)
      // getTaxNameMasterData
      .then((res) => {
        setDataSource(
          res.data.taxName.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            taxNameMasterPrefix: r.taxNameMasterPrefix,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            taxName: r.taxName,
            taxType: r.taxType,  
            // taxTypeName:r.taxTypeName,          
            taxTypeName: taxTypes?.find(
              (obj) => obj?.id === r.taxType,
            )?.taxType,
            // prioirtyOfCollectionOrder: r.prioirtyOfCollectionOrder,
            // priorityOfBillDisplay:r.priorityOfBillDisplay,
            remark: r.remark,
            taxNameMr:r.taxNameMr,
            activeFlag:r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
          })),
        );
      });
  };

  const editRecord = (rows) => {
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // const fromDate = new Date(formData.fromDate).toISOString();
    // const toDate = moment(formData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      // fromDate,
      // toDate,
    };

      axios
        .post(
          `${urls.BaseURL}/taxNameMaster/save`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            formData.id ? sweetAlert("Updated!", "Record Updated successfully !", "success"):
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            getTaxName();
            setButtonInputState(false);
            setBtnSaveText("Update")
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
  //         `${urls.BaseURL}/taxNameMaster/save/${value}`,
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
  //           getTaxName();
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
            .post(`${urls.CFCURL}/master/taxNameMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getTaxName();
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
            .post(`${urls.CFCURL}/master/taxNameMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getTaxName();
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
    // taxType: "",
    taxNameMasterPrefix: "",
    taxName:"",
    // prioirtyOfCollectionOrder:"",
    // priorityOfBillDisplay:"",
    remark: "",
    taxNameMr:""
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    taxType: "",
    taxNameMasterPrefix: "",
    taxName:"",
    // prioirtyOfCollectionOrder:"",
    // priorityOfBillDisplay:"",
    remark: "",
    id: null,
    taxNameMr:""
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },

    {
      field: "taxName",
      headerName: "Tax Name",
      // type: "number",
      flex: 1,
    },
    
    {
      field: "taxNameMr",
      headerName: "Tax Name Mr",
      // type: "number",
      flex: 1,
    },
    {
      field: "taxNameMasterPrefix",
      headerName: "Tax Master Prefix",
      flex: 2,
    },
    // { field: "fromDate", headerName: "FromDate" },
    // {
    //   field: "toDate",
    //   headerName: "To Date",
    //   //type: "number",
    //   flex: 1,
    // },
   
    // {
    //   field: "prioirtyOfCollectionOrder",
    //   headerName: "Prioirty Of Collection Order",
    //   // type: "number",
    //   flex: 1,
    // },
    // {
    //     field: "priorityOfBillDisplay",
    //     headerName: "Priority Of Bill Display",
    //     // type: "number",
    //     flex: 1,
    //   },
      // {
      //   field: "taxTypeName",
      //   headerName: "Tax Type",
      //   // type: "number",
      //   flex: 1,
      // },

    {
      field: "status",
      headerName: "Status",
      //type: "number",
      flex: 1,
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
    //             reset(params.row);
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
      // width: 120,
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
Tax Name Master
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

                      <div className={styles.row1}>
                          <TextField
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Tax Name*'
                            variant='standard'
                            {...register("taxName")}
                            error={!!errors.taxName}
                            helperText={
                              errors?.taxName
                                ? errors.taxName.message
                                : null
                            }
                          />
                        </div>

                        <div className={styles.row1}>
                          <TextField
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Tax Name Mr*'
                            variant='standard'
                            {...register("taxNameMr")}
                            error={!!errors.taxNameMr}
                            helperText={
                              errors?.taxNameMr
                                ? errors.taxNameMr.message
                                : null
                            }
                          />
                        </div>
                        <div className={styles.row1}>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Tax Master Prefix *'
                            variant='standard'
                            {...register("taxNameMasterPrefix")}
                            error={!!errors.taxNameMasterPrefix}
                            helperText={
                              errors?.taxNameMasterPrefix
                                ? errors.taxNameMasterPrefix.message
                                : null
                            }
                          />
                        </div>
                       
                        {/* <div className={styles.row1}>
                          <FormControl
                            variant='standard'
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.taxType}
                          >
                            <InputLabel id='demo-simple-select-standard-label'>
                            Tax Type
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label='Tax Type'
                                >
                                  {taxTypes &&
                                    taxTypes.map((taxType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={taxType.id}
                                      >
                                        {taxType.taxType}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name='taxType'
                              control={control}
                              defaultValue=''
                            />
                            <FormHelperText>
                              {errors?.taxType
                                ? errors.taxType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}
                       
                        {/* <div className={styles.row1}> 
                          <TextField
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Prioirty Of Collection Order*'
                            variant='standard'
                            {...register("prioirtyOfCollectionOrder")}
                            error={!!errors.prioirtyOfCollectionOrder}
                            helperText={
                              errors?.prioirtyOfCollectionOrder
                                ? errors.prioirtyOfCollectionOrder.message
                                : null
                            }
                          />
                        </div>
                        <div className={styles.row1}>
                          <TextField
                            sx={{ width: 450 }}
                            id='standard-basic'
                            label='Priority Of Bill Display*'
                            variant='standard'
                            {...register("priorityOfBillDisplay")}
                            error={!!errors.priorityOfBillDisplay}
                            helperText={
                              errors?.priorityOfBillDisplay
                                ? errors.priorityOfBillDisplay.message
                                : null
                            }
                          />
                        </div> */}
                        {/* <div className={styles.row1}>
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
                        </div> */}
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

export default TaxNameMaster;
