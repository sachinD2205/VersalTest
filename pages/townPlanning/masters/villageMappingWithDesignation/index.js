import { yupResolver } from "@hookform/resolvers/yup";
import { Delete, Edit } from "@mui/icons-material";
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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../view.module.css";
// import URLS from "../../../components/townPlanning/urls";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
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
    villageName: yup.string().required(<FormattedLabel id="villageNameV" />),
    ddtp: yup.string().required(<FormattedLabel id="ddtpV" />),
    deAndTp: yup.string().required(<FormattedLabel id="deAndTpV" />),
    atpAndJe: yup.string().required(<FormattedLabel id="atpAndJeV" />),
  });

  const {
    // register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    // watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);

  const [ID, setID] = useState(null);
  const [collapse, setCollapse] = useState(false);
  const [runAgain, setRunAgain] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [villageNameDropDown, setVillageNameDropDown] = useState([
    { id: 1, villageNameEn: "", villageNameMr: "" },
  ]);
  const [employeeNameDropDown, setEmployeeNameDropDown] = useState([
    {
      id: 1,
      name: "",
      designation: "",
    },
  ]);
  const [table, setTable] = useState([
    {
      id: 1,
      srNo: 1,
      villageNameEn: "",
      villageNameMr: "",
      ddtpEn: "",
      ddtpMr: "",
      deAndTpEn: "",
      deAndTpMr: "",
      atpAndJeEn: "",
      atpAndJeMr: "",
    },
  ]);

  let isDisabled = false;

  useEffect(() => {
    //Village
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setVillageNameDropDown(
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

    //User
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setEmployeeNameDropDown(
          r.data.user.map((j) => ({
            id: j.id,
            nameEn: j.firstNameEn + " " + j.lastNameEn,
            nameMr: j.firstNameMr + " " + j.lastNameMr,
            designation: j.desg,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  useEffect(() => {
    setRunAgain(false);

    axios
      .get(
        `${urls.TPURL}/villageMappingWithDesignation/getVillageMappingWithDesignationData`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setTable(
          r.data.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            villageNameEn: villageNameDropDown.find(
              (arg) => arg.id === j.villageName,
            )?.villageNameEn,
            villageNameMr: villageNameDropDown.find(
              (arg) => arg.id === j.villageName,
            )?.villageNameMr,
            ddtpEn: employeeNameDropDown.find((arg) => arg.id === j.ddtp)
              ?.nameEn,
            ddtpMr: employeeNameDropDown.find((arg) => arg.id === j.ddtp)
              ?.nameMr,
            deAndTpEn: employeeNameDropDown.find((arg) => arg.id === j.deAndTp)
              ?.nameEn,
            deAndTpMr: employeeNameDropDown.find((arg) => arg.id === j.deAndTp)
              ?.nameMr,
            atpAndJeEn: employeeNameDropDown.find(
              (arg) => arg.id === j.atpAndJe,
            )?.nameEn,
            atpAndJeMr: employeeNameDropDown.find(
              (arg) => arg.id === j.atpAndJe,
            )?.nameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, [runAgain, employeeNameDropDown, villageNameDropDown]);

  const resetValuesCancell = {
    villageName: "",
    ddtp: "",
    deAndTp: "",
    atpAndJe: "",
  };
  // Reset Values Exit
  const resetValuesExit = {
    id: null,
  };
  const cancellButton = () => {
    reset({ id: ID, ...resetValuesCancell });
  };

  const onBack = () => {
    const urlLength = router.asPath.split("/").length;
    const urlArray = router.asPath.split("/");
    let backUrl = "";
    if (urlLength > 2) {
      for (let i = 0; i < urlLength - 1; i++) {
        backUrl += urlArray[i] + "/";
      }
      console.log("Final URL: ", backUrl);
      router.push(`${backUrl}`);
    } else {
      router.push("/dashboard");
    }
  };

  const onSubmit = async (data) => {
    console.log("Data: ", data);

    const bodyForAPI = {
      ...data,
    };

    await axios
      .post(
        `${urls.TPURL}/villageMappingWithDesignation/saveVillageMappingWithDesignation`,
        bodyForAPI,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          if (data.id) {
            sweetAlert(
              language == "en" ? "Updated!" : "अपडेट केले!",
              language == "en"
                ? "Record Updated successfully !"
                : " यशस्वीरित्या अपडेट केले गेले",
              "success",
            );
          } else {
            sweetAlert(
              language == "en" ? "Saved!" : "जतन केले!",
              language == "en"
                ? "Record Saved successfully! "
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success",
            );
          }
          setRunAgain(true);
          reset({ ...resetValuesCancell, id: null });
          setCollapse(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const editById = (values) => {
    setID(values.id);
    console.log("Edit sathi cha data: ", values);

    const villageID =
      language === "en"
        ? villageNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.villageNameEn === values.villageNameEn,
            // @ts-ignore
          )?.id
        : villageNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.villageNameEn === values.villageNameEn,
            // @ts-ignore
          )?.id;
    const ddtpID =
      language === "en"
        ? employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameEn === values.ddtpEn,
            // @ts-ignore
          )?.id
        : employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameMr === values.ddtpMr,
            // @ts-ignore
          )?.id;
    const deAndTpID =
      language === "en"
        ? employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameEn === values.deAndTpEn,
            // @ts-ignore
          )?.id
        : employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameMr === values.deAndTpMr,
            // @ts-ignore
          )?.id;
    const atpAndJeID =
      language === "en"
        ? employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameEn === values.atpAndJeEn,
            // @ts-ignore
          )?.id
        : employeeNameDropDown.find(
            // @ts-ignore
            (obj) => obj?.nameMr === values.atpAndJeMr,
            // @ts-ignore
          )?.id;

    console.log("IDya: ", { villageID, ddtpID, deAndTpID, atpAndJeID });

    reset({
      ...values,
      villageName: villageID,
      ddtp: ddtpID,
      deAndTp: deAndTpID,
      atpAndJe: atpAndJeID,
    });
    setCollapse(true);
  };

  const deleteById = async (id) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.TPURL}/villageMappingWithDesignation/discardVillageMappingWithDesignation/${id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((res) => {
            if (res.status == 226) {
              // sweetAlert(
              //   "Deleted!",
              //   "Record Deleted successfully !",
              //   "success",
              // );

              sweetAlert(
                language == "en" ? "Deleted!" : "हटवले!",
                language == "en"
                  ? "Record Deleted successfully !"
                  : "रेकॉर्ड यशस्वीरित्या हटवले!",
                "success",
              );
              setRunAgain(true);
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
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
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      field: language === "en" ? "villageNameEn" : "villageNameMr",
      headerName: <FormattedLabel id="villageName" />,
      width: 200,
    },
    {
      field: language === "en" ? "ddtpEn" : "ddtpMr",
      headerName: <FormattedLabel id="ddtp" />,
      width: 200,
    },
    {
      field: language === "en" ? "deAndTpEn" : "deAndTpMr",
      headerName: <FormattedLabel id="deAndTp" />,
      width: 250,
    },
    {
      field: language === "en" ? "atpAndJeEn" : "atpAndJeMr",
      headerName: <FormattedLabel id="atpAndJe" />,
      width: 300,
    },

    {
      field: "action",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
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
              onClick={() => deleteById(params.id)}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

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
            <FormattedLabel id="villageMappingWithDesignation" />
            {/* Reservation Type */}
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
                      xl={3}
                      lg={3}
                      md={4}
                      sm={4}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{
                          marginTop: "2%",
                        }}
                        variant="standard"
                        error={!!errors.villageName}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          disabled={isDisabled}
                        >
                          <FormattedLabel id="villageName" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "180px" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // value={field.value}
                              disabled={isDisabled}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="villageName"
                            >
                              {villageNameDropDown &&
                                villageNameDropDown.map((value, index) => (
                                  <MenuItem
                                    key={index}
                                    value={
                                      //@ts-ignore
                                      value.id
                                    }
                                  >
                                    {language == "en"
                                      ? //@ts-ignore
                                        value.villageNameEn
                                      : // @ts-ignore
                                        value?.villageNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="villageName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.villageName
                            ? errors.villageName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={4}
                      sm={4}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{
                          marginTop: "2%",
                        }}
                        variant="standard"
                        error={!!errors.ddtp}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          disabled={isDisabled}
                        >
                          <FormattedLabel id="ddtp" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "180px" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // value={field.value}
                              disabled={isDisabled}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="ddtp"
                            >
                              {employeeNameDropDown &&
                                employeeNameDropDown
                                  .filter((arg) => {
                                    // @ts-ignore
                                    return arg.designation === "DDTP";
                                  })
                                  .map((value, index) => (
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
                                          ? value?.nameEn
                                          : value?.nameMr
                                      }
                                    </MenuItem>
                                  ))}
                            </Select>
                          )}
                          name="ddtp"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.ddtp ? errors.ddtp.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={4}
                      sm={4}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{
                          marginTop: "2%",
                        }}
                        variant="standard"
                        error={!!errors.deAndTp}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          disabled={isDisabled}
                        >
                          <FormattedLabel id="deAndTp" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "250px" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // value={field.value}
                              disabled={isDisabled}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="deAndTp"
                            >
                              {employeeNameDropDown &&
                                employeeNameDropDown
                                  .filter((arg) => {
                                    // @ts-ignore
                                    return (
                                      arg.designation === "DE" ||
                                      arg.designation === "TP"
                                    );
                                  })
                                  .map((value, index) => (
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
                                          ? value?.nameEn
                                          : value?.nameMr
                                      }
                                    </MenuItem>
                                  ))}
                            </Select>
                          )}
                          name="deAndTp"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.deAndTp ? errors.deAndTp.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={4}
                      sm={4}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{
                          marginTop: "2%",
                        }}
                        variant="standard"
                        error={!!errors.atpAndJe}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          disabled={isDisabled}
                        >
                          <FormattedLabel id="atpAndJe" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "300px" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // value={field.value}
                              disabled={isDisabled}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="atpAndJe"
                            >
                              {employeeNameDropDown &&
                                employeeNameDropDown
                                  .filter((arg) => {
                                    // @ts-ignore
                                    return (
                                      arg.designation === "ATP" ||
                                      arg.designation === "JE"
                                    );
                                  })
                                  .map((value, index) => (
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
                                          ? value?.nameEn
                                          : value?.nameMr
                                      }
                                    </MenuItem>
                                  ))}
                            </Select>
                          )}
                          name="atpAndJe"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.atpAndJe ? errors.atpAndJe.message : null}
                        </FormHelperText>
                      </FormControl>
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
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
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
