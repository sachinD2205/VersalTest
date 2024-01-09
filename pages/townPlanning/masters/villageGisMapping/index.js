import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
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
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../view.module.css";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const user = useSelector((state) => state?.user.user);
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
  let schema = yup.object().shape({
    villageKey: yup.string().required("Please Select Village."),
    gisId: yup.string().required("Please enter Gis Id"),
  });
  const {
    register,
    handleSubmit,
    // @ts-ignore
    methods,
    control,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const language = useSelector((state) => state.labels.language);
  const [ID, setID] = useState(null);
  const [table, setTable] = useState([
    {
      id: 1,
      srNo: 1,
      roadSizeEn: "",
      roadSizeMr: "",
    },
  ]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [collapse, setCollapse] = useState(false);
  const [runAgain, setRunAgain] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [villageDropDown, setVillageDropDown] = useState([
    {
      id: 1,
      villageNameEn: "",
      villageNameMr: "",
    },
  ]);

  useEffect(
    (_pageSize = 10, _pageNo = 0) => {
      setRunAgain(false);

      // axios
      //   .get(`${urls.TPURL}/villageGisMapping/getAll`, {
      //     params: {
      //       pageSize: _pageSize,
      //       pageNo: _pageNo,
      //     },
      //   })
      //   .then((res) => {

      //     setTable(
      //       res.data.villageGisMapping.map((j, i) => ({
      //         srNo: i + 1,
      //         ...j,
      //       })),
      //     );
      //   });

      //Village
      axios
        .get(`${urls.CFCURL}/master/village/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((r) => {
          setVillageDropDown(
            // @ts-ignore
            r.data.village.map((j) => ({
              id: j.id,
              villageNameEn: j.villageName,
              villageNameMr: j.villageNameMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    },
    [runAgain],
  );

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
  };
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 80,
    },
    {
      field: "villageKey",
      headerName: "Village",
      flex: 1,
    },
    {
      field: "gisId",
      headerName: "GIS ID",
      // headerName: <FormattedLabel id="RoadTypeMr" />,
      flex: 1,
    },
    {
      field: "action",
      headerName: <FormattedLabel id="actions" />,
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={collapse}
              onClick={() => editById(params.row)}
            >
              <Edit />
            </IconButton>
            <IconButton
              disabled={collapse}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
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

  const editById = (values) => {
    setID(values.id);
    reset({
      ...values,
    });
    setEditButtonInputState(true);

    setBtnSaveText("Save");
    setButtonInputState(true);
    setSlideChecked(true);
    setIsOpenCollapse(!isOpenCollapse);
  };

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
          const tempData = axios
            .post(`${urls.TPURL}/villageGisMapping/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                setRunAgain(true);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
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
          const tempData = axios
            .post(`${urls.TPURL}/villageGisMapping/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                setRunAgain(true);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    roadSizeEn: "",
    roadSizeMr: "",
  };

  const cancellButton = () => {
    reset({
      id: ID,
      ...resetValuesCancell,
    });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  const onSubmit = async (data) => {
    const bodyForAPI = {
      ...data,
      activeFlag: data.activeFlag,
    };
    await axios
      .post(`${urls.TPURL}/villageGisMapping/save`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (data.id) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
          } else {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
          }
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setRunAgain(true);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 2,
          marginBottom: 2,
          padding: 1,
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
        autoHeight
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {/* <FormattedLabel id="villageGisMapping" /> */}
            Village Gis Mapping
          </h2>
        </Box>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={8}
                      sm={8}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "200px", marginTop: "2%" }}
                        variant="standard"
                        error={!!errors.villageKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="villageName" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // value={field.value}

                              value={
                                router.query.villageKey
                                  ? router.query.villageKey
                                  : field.value
                              }
                              onChange={(value) => field.onChange(value)}
                              label="villageKey"
                            >
                              {villageDropDown &&
                                villageDropDown.map((value, index) => (
                                  <MenuItem
                                    key={index}
                                    value={
                                      // @ts-ignore
                                      value?.id
                                    }
                                  >
                                    {
                                      // @ts-ignore
                                      language === "en"
                                        ? value?.villageNameEn
                                        : value?.villageNameMr
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="villageKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.villageKey
                            ? errors.villageKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={8}
                      sm={8}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{
                          width: "250px",
                          marginTop: "2%",
                        }}
                        id="standard-basic"
                        // label={<FormattedLabel id="RoadTypeMr" required />}
                        label="GIS ID"
                        variant="standard"
                        {...register("gisId")}
                        error={!!errors.gisId}
                        helperText={errors?.gisId ? errors.gisId.message : null}
                        defaultValue={
                          router.query.gisId ? router.query.gisId : ""
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      marginTop: "20px",
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
                        {btnSaveText === <FormattedLabel id="update" /> ? (
                          <FormattedLabel id="update" />
                        ) : (
                          <FormattedLabel id="save" />
                        )}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Slide>
            )}
          </form>
        </FormProvider>

        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);

              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            {/* Add */}
            <FormattedLabel id="add" />
          </Button>
        </div>

        <div
          className={styles.table}
          style={{ display: "flex", alignItems: "center" }}
        >
          <DataGrid
            autoHeight
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </div>
      </Paper>
    </>
  );
};

export default Index;
