import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Box, Button, Grid, IconButton, Paper, Slide } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../view.module.css";
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
    roadSizeEn: yup.string().required(<FormattedLabel id="authorityNameVE" />),
    roadSizeMr: yup
      .string()
      .required(<FormattedLabel id="authorityNameVM" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
  });
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    // @ts-ignore
    // methods,
    reset,
    formState: { errors },
  } = methods;
  const language = useSelector((state) => state?.labels.language);

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
  const [isLoading, setIsLoading] = useState(false);
  useEffect(
    (_pageSize = 10, _pageNo = 0) => {
      setRunAgain(false);

      axios
        .get(`${urls.TPURL}/roadTypeMaster/getAll`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("Authority Master: ", res.data.roadType);
          setTable(
            res.data.roadType.map((j, i) => ({
              srNo: i + 1,
              ...j,
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
      field: "roadSizeEn",
      headerName: <FormattedLabel id="RoadTypeEn" />,
      flex: 1,
    },
    {
      field: "roadSizeMr",
      headerName: <FormattedLabel id="RoadTypeMr" />,
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
              <Edit color="primary" />
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
      const textAlert =
        language == "en"
          ? "Are you sure you want to inactivate this Record ?"
          : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?";
      const title = language == "en" ? "Inactivate?" : "निष्क्रिय करा";
      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          const tempData = axios
            .post(`${urls.TPURL}/roadTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201 || res.status == 200) {
                language == "en"
                  ? sweetAlert({
                      title: "Inactivate!",
                      text: "The record is Successfully Deleted!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "निष्क्रिय करा!",
                      text: "रेकॉर्ड यशस्वीरित्या निष्क्रिय केला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                setRunAgain(true);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
        }
      });
    } else {
      language == "en"
        ? "Are you sure you want to activate this Record ? "
        : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?";
      const title = language == "en" ? "Activate?" : "सक्रिय करायचे?";
      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          const tempData = axios
            .post(`${urls.TPURL}/roadTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201 || res.status == 200) {
                language == "en"
                  ? sweetAlert({
                      title: "Activate!",
                      text: "The record is Successfully Activated!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "सक्रिय केला!",
                      text: "रेकॉर्ड यशस्वीरित्या सक्रिय केला गेला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                setRunAgain(true);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
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
      .post(`${urls.TPURL}/roadTypeMaster/save`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
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
            <FormattedLabel id="RoadType" />
            {/* Possession Type */}
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
                      <Transliteration
                        variant={"outlined"}
                        _key={"roadSizeEn"}
                        labelName={"roadSizeEn"}
                        fieldName={"roadSizeEn"}
                        updateFieldName={"roadSizeMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="RoadTypeEn" required />}
                        error={!!errors.roadSizeEn}
                        helperText={
                          errors?.roadSizeEn ? errors.roadSizeEn.message : null
                        }
                      />
                      {/* <TextField
                        sx={{
                          width: "250px",
                          marginTop: "2%",
                        }}
                        id="standard-basic"
                        label={<FormattedLabel id="RoadTypeEn" required />}
                        variant="standard"
                        {...register("roadSizeEn")}
                        error={!!errors.roadSizeEn}
                        helperText={
                          errors?.roadSizeEn ? errors.roadSizeEn.message : null
                        }
                        defaultValue={
                          router.query.roadSizeEn ? router.query.roadSizeEn : ""
                        }
                      /> */}
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
                      <Transliteration
                        variant={"outlined"}
                        _key={"roadSizeMr"}
                        labelName={"roadSizeMr"}
                        fieldName={"roadSizeMr"}
                        updateFieldName={"roadSizeEn"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        label={<FormattedLabel id="RoadTypeEn" required />}
                        error={!!errors.roadSizeMr}
                        helperText={
                          errors?.roadSizeMr ? errors.roadSizeMr.message : null
                        }
                      />
                      {/* <TextField
                        sx={{
                          width: "250px",
                          marginTop: "2%",
                        }}
                        id="standard-basic"
                        label={<FormattedLabel id="RoadTypeMr" required />}
                        variant="standard"
                        {...register("roadSizeMr")}
                        error={!!errors.roadSizeMr}
                        helperText={
                          errors?.roadSizeMr ? errors.roadSizeMr.message : null
                        }
                        defaultValue={
                          router.query.roadSizeMr ? router.query.roadSizeMr : ""
                        }
                      /> */}
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
