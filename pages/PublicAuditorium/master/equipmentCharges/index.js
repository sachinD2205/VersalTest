import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/EquipmentCharges";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[equipmentCharges].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";

const EquipmentCharges = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({ resolver: yupResolver(schema) });
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [loading, setLoading] = useState(false);

  const [equipmentCategory, setEquipmentCategory] = useState([]);
  const [filteredEquipmentNames, setFilteredEquipmentNames] = useState([]);
  const [equipmentName, setEquipmentName] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getEquipmentCategory();
    getEquipmentName();
    getAuditorium();
  }, []);

  useEffect(() => {
    getEquipmentCharges();
  }, [equipmentCategory, equipmentName, auditoriums]);

  const getEquipmentCharges = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCharges/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(";res", res);
        setLoading(false);
        let result = res.data.mstEquipmentChargesList;
        let _res = result.map((val, i) => {
          console.log("222", auditoriums);
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1,
            auditoriumName: val.auditoriumName
              ? auditoriums?.find((obj) => {
                  return obj?.id == Number(val.auditoriumName);
                })?.auditoriumNameEn
              : "-",
            auditoriumNameMr: val.auditoriumName
              ? auditoriums?.find((obj) => {
                  return obj?.id == Number(val.auditoriumName);
                })?.auditoriumNameMr
              : "-",
            equipmentCategory: val.equipmentCategory
              ? equipmentCategory?.find((obj) => {
                  return obj?.id == Number(val.equipmentCategory);
                })?.equipmentCategoryNameEn
              : "-",
            equipmentCategoryMr: val.equipmentCategory
              ? equipmentCategory?.find((obj) => {
                  return obj?.id == Number(val.equipmentCategory);
                })?.equipmentCategoryNameMr
              : "-",
            price: val.price ? val.price : "NA",
            corporationRate: val.corporationRate ? val.corporationRate : "NA",
            id: val.id,
            multiplyingFactor: val.multiplyingFactor,
            totalAmount: val.totalAmount,
            equipmentName: val.equipmentName
              ? equipmentName?.find((obj) => {
                  return obj?.id == Number(val.equipmentName);
                })?.equipmentNameEn
              : "-",
            equipmentNameMr: val.equipmentName
              ? equipmentName?.find((obj) => {
                  return obj?.id == Number(val.equipmentName);
                })?.equipmentNameMr
              : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            _auditoriumName: val.auditoriumName,
            _equipmentName: val.equipmentName,
            _equipmentCategory: val.equipmentCategory,
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast("Something went wrong", {
          type: "error",
        });
      });
  };

  const getEquipmentCategory = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("11res", res);

        let result = res.data.mstEquipmentCategoryList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            activeFlag: val.activeFlag,
            srNo: val.id,
            equipmentCategoryNameEn: val.equipmentCategoryNameEn,
            equipmentCategoryNameMr: val.equipmentCategoryNameMr,
            id: val.id,
          };
        });

        setEquipmentCategory(_res);
      });
  };

  const getEquipmentName = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipment/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("11res", res);

        let result = res.data.mstEquipmentList;
        let _res = result.map((val, i) => {
          console.log("4214", val);
          return {
            ...val,
            activeFlag: val.activeFlag,
            srNo: val.id,
            equipmentName: val.equipmentName,
            equipmentNameMr: val.equipmentNameMr,
            id: val.id,
          };
        });

        setEquipmentName(_res);
      });
  };

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
            auditoriumNameMr: row.auditoriumNameMr,
          }))
        );
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.PABBMURL}/mstEquipmentCharges/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal(
                  language == "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getEquipmentCharges();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.PABBMURL}/mstEquipmentCharges/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal(
                  language == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getEquipmentCharges();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    billPrefix: "",
    billType: "",
    fromDate: null,
    toDate: null,
    remark: "",
  };

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

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      corporationRate:
        formData.corporationRate == "NA" ? 0 : formData.corporationRate,
      price: formData.price == "NA" ? 0 : formData.price,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PABBMURL}/mstEquipmentCharges/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert(
                language == "en" ? "Updated!" : "अपडेट केले",
                language == "en"
                  ? "Record Updated successfully!"
                  : "रेकॉर्ड यशस्वीरित्या अपडेट केले",
                "success"
              )
            : sweetAlert(
                language == "en" ? "Saved!" : "जतन केले",
                language == "en"
                  ? "Record Saved successfully!"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
                "success"
              );
          getEquipmentCharges();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    billType: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      minWidth: 70,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "auditoriumName" : "auditoriumNameMr",
      headerName:
        language == "en" ? (
          <FormattedLabel id="auditorium" />
        ) : (
          <FormattedLabel id="auditoriumMr" />
        ),
      flex: 1.5,
      minWidth: 350,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "equipmentCategory" : "equipmentCategoryMr",
      headerName:
        language == "en" ? (
          <FormattedLabel id="equipmentCategory" />
        ) : (
          <FormattedLabel id="equipmentCategoryMr" />
        ),
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "equipmentName",
      headerName: <FormattedLabel id="equipment" />,
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: "equipmentNameMr",
      headerName: <FormattedLabel id="equipmentNameMr" />,
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: "corporationRate",
      headerName: <FormattedLabel id="corporationRate" />,
      flex: 0.8,
      align: "right",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: <FormattedLabel id="_price" />,
      flex: 0.6,
      align: "right",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "multiplyingFactor",
      headerName: <FormattedLabel id="multiplyingFactor" />,
      flex: 0.8,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "totalAmount",
      headerName: <FormattedLabel id="totalAmount" />,
      flex: 0.8,
      align: "right",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      minWidth: 120,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue("auditoriumName", params.row._auditoriumName);
                setValue("equipmentCategory", params.row._equipmentCategory);
                setValue("equipmentName", params.row._equipmentName);
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

  return (
    <div>
      <Paper style={{ marginTop: "10%" }}>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <PabbmHeader labelName="equipmentCharges" />

        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
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
                        error={errors.auditoriumName}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="auditorium" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="auditorium" />}
                            >
                              {auditoriums &&
                                auditoriums.map((auditorium, index) => {
                                  console.log("sd23", auditorium);
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
                        error={errors.equipmentCategory}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="equipmentCategory" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                setFilteredEquipmentNames(
                                  equipmentName.map((val) => {
                                    return (
                                      val.equipmentCategoryId ==
                                        value.target.value && val
                                    );
                                  })
                                );
                              }}
                              label={<FormattedLabel id="equipmentCategory" />}
                            >
                              {equipmentCategory?.map((equipmentCat, index) => {
                                return (
                                  <MenuItem key={index} value={equipmentCat.id}>
                                    {equipmentCat.equipmentCategoryNameEn}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                          name="equipmentCategory"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.equipmentCategory
                            ? errors.equipmentCategory.message
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
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        error={errors.equipmentName}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="equipmentName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="equipmentName" />}
                            >
                              {filteredEquipmentNames?.map(
                                (equipmentCat, index) => {
                                  return (
                                    <MenuItem
                                      sx={{
                                        display: equipmentCat.equipmentNameEn
                                          ? "flex"
                                          : "none",
                                      }}
                                      key={index}
                                      value={equipmentCat.id}
                                    >
                                      {equipmentCat.equipmentNameEn}
                                    </MenuItem>
                                  );
                                }
                              )}
                            </Select>
                          )}
                          name="equipmentName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.equipmentName
                            ? errors.equipmentName.message
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
                      <TextField
                        sx={{ width: "90%" }}
                        id="outlined-basic"
                        size="small"
                        label={<FormattedLabel id="corporationRate" />}
                        variant="outlined"
                        {...register("corporationRate")}
                        error={!!errors.corporationRate}
                        helperText={
                          errors?.corporationRate
                            ? errors.corporationRate.message
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
                        id="outlined-basic"
                        label={<FormattedLabel id="_price" />}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                        {...register("price")}
                        error={!!errors.price}
                        helperText={errors?.price ? errors.price.message : null}
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
                        label={<FormattedLabel id="multiplyingFactor" />}
                        variant="outlined"
                        size="small"
                        {...register("multiplyingFactor")}
                        error={!!errors.multiplyingFactor}
                        helperText={
                          errors?.multiplyingFactor
                            ? errors.multiplyingFactor.message
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
                        id="outlined-basic"
                        label={<FormattedLabel id="totalAmount" />}
                        sx={{
                          width: "90%",
                        }}
                        size="small"
                        variant="outlined"
                        {...register("totalAmount")}
                        error={!!errors.totalAmount}
                        helperText={
                          errors?.totalAmount
                            ? errors.totalAmount.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        size="small"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider />
                </form>
              </Slide>
            )}

            {!isOpenCollapse && (
              <>
                <Grid container style={{ padding: "10px" }}>
                  <Grid item xs={9}></Grid>
                  <Grid
                    item
                    xs={2}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<AddIcon />}
                      size="small"
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
                    </Button>
                  </Grid>
                </Grid>

                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
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
                    components={{ Toolbar: GridToolbar }}
                    density="compact"
                    autoHeight={true}
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
                      getEquipmentCharges(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getEquipmentCharges(_data, data.page);
                    }}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default EquipmentCharges;
