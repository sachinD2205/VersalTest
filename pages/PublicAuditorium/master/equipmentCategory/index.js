import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/EquipmentCategory";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[equipmentCategory].module.css";
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
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const EquipmentCategory = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

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
  }, []);

  const getEquipmentCategory = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log(";res", res);

        let result = res.data.mstEquipmentCategoryList;
        let _res = result.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1,
            equipmentCategoryNameEn: val.equipmentCategoryNameEn
              ? val.equipmentCategoryNameEn
              : "-",
            equipmentCategoryNameMr: val.equipmentCategoryNameMr
              ? val.equipmentCategoryNameMr
              : "-",
            id: val.id,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
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
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
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
            .post(`${urls.PABBMURL}/mstEquipmentCategory/save`, body, {
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
                getEquipmentCategory();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
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
            .post(`${urls.PABBMURL}/mstEquipmentCategory/save`, body, {
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
                getEquipmentCategory();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
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
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PABBMURL}/mstEquipmentCategory/save`, finalBodyForApi, {
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
          getEquipmentCategory();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
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
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field:
        language == "en"
          ? "equipmentCategoryNameEn"
          : "equipmentCategoryNameMr",
      headerName:
        language == "en" ? (
          <FormattedLabel id="equipmentCategoryNameEn" />
        ) : (
          <FormattedLabel id="equipmentCategoryNameMr" />
        ),
      flex: 2,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
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
                setValue(
                  "equipmentCategoryName",
                  params.row.equipmentCategoryName
                );
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

  return (
    <div>
      <Paper style={{ marginTop: "10%" }}>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <PabbmHeader labelName="equipmentCategory" />
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
                      xs={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "60%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="equipmentCategoryNameEn" />}
                        variant="outlined"
                        {...register("equipmentCategoryNameEn")}
                        error={!!errors.equipmentCategoryNameEn}
                        helperText={
                          errors?.equipmentCategoryNameEn
                            ? errors.equipmentCategoryNameEn.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "60%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="equipmentCategoryNameMr" />}
                        variant="outlined"
                        {...register("equipmentCategoryNameMr")}
                        error={!!errors.equipmentCategoryNameMr}
                        helperText={
                          errors?.equipmentCategoryNameMr
                            ? errors.equipmentCategoryNameMr.message
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
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
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
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        size="small"
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
                      type="primary"
                      size="small"
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
                    components={{ Toolbar: GridToolbar }}
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
                      getEquipmentCategory(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getEquipmentCategory(_data, data.page);
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

export default EquipmentCategory;
