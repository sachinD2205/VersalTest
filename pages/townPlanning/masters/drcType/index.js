import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Paper, Slide } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/marriageRegistration/maritalStatus";
import styles from "./view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// func
const Index = () => {
  let schema = yup.object().shape({
    drcTypeEn: yup.string().required(
      <FormattedLabel id="authorityNameVE" />,
      // language == "en"
      //   ? "Please enter name in english."
      //   : "कृपया इंग्रजीमध्ये नाव प्रविष्ट करा.",
    ),
    drcTypeMr: yup
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
    mode: "onChange",
  });
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const language = useSelector((state) => state?.labels.language);
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
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getDRCType = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc",
  ) => {
    console.log("caledddddd");
    axios
      .get(`${urls.TPURL}/master/drcTypeMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let _res = res.data.drcTypeMasterDaoList.map((r, i) => ({
          id: r.id,
          srNo: i + 1 + _pageNo * _pageSize,
          drcTypeEn: r.drcTypeEn,
          drcTypeMr: r.drcTypeMr,
          //serialNo: r.serialNo,
          activeFlag: r.activeFlag,
        }));
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getDRCType();
  }, [fetchData]);
  {
    console.log("sdfsdf", errors);
  }
  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.TPURL}/master/drcTypeMaster/save`, fromData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert(
              language == "en" ? "Saved!" : "जतन केले!",
              language == "en"
                ? "Record Saved successfully! "
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success",
            );
            getDRCType();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (btnSaveText === "Update") {
      const tempData = axios
        .post(`${urls.TPURL}/master/drcTypeMaster/save`, fromData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert(
              language == "en" ? "Updated!" : "अपडेट केले!",
              language == "en"
                ? "Record Updated successfully !"
                : " यशस्वीरित्या अपडेट केले गेले",
              "success",
            );
            getDRCType();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", _activeFlag);
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
          axios
            .post(`${urls.TPURL}/master/drcTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
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
                getDRCType();
                // setButtonInputState(false)
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
          axios
            .post(`${urls.TPURL}/master/drcTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 200) {
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
                getDRCType();
                // setButtonInputState(false)
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
    drcTypeEn: "",
    drcTypeMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    drcTypeEn: "",
    drcTypeMr: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    // {
    //   field: 'serialNo',
    //   headerName: 'serialNo',
    //   flex: 1,
    // },

    {
      field: "drcTypeEn",
      headerName: <FormattedLabel id="drcTypeEn" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "drcTypeMr",
      headerName: <FormattedLabel id="drcTypeMr" />,
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
                reset(params.row);
              }}
            >
              <EditIcon color="primary" />
            </IconButton>
            {/* <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.row.id, 'N')}
            > */}
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
            {/* <DeleteIcon color='error' /> */}
            {/* </IconButton> */}
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      {/* <BasicLayout> */}
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
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
        // sx={{
        //   marginLeft: 1,
        //   marginRight: 1,
        //   marginTop: 1,
        //   marginBottom: 1,
        //   padding: 1,
        // }}
      >
        <div
          className={styles.details}
          style={
            {
              // marginTop: "20vh",
            }
          }
        >
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {/* {<FormattedLabel id="boardDetail" />} */}
              {language == "en" ? "DRC Type" : "DRC प्रकार"}
            </h3>
          </div>
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      {/* <div>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="serialNo *"
                            variant="standard"
                            {...register('serialNo')}
                            error={!!errors.serialNo}
                            helperText={
                              errors?.serialNo ? errors.serialNo.message : null
                            }
                          />
                        </div> */}

                      <div>
                        <Transliteration
                          style={{ backgroundColor: "white", margin: "250px" }}
                          _key={"drcTypeEn"}
                          labelName={"drcTypeEn"}
                          fieldName={"drcTypeEn"}
                          updateFieldName={"drcTypeMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          targetError={"drcTypeMr"}
                          width={250}
                          // disabled={disabled}
                          // label="DRC Type"
                          label={<FormattedLabel id="drcTypeEn" required />}
                          error={!!errors.drcTypeEn}
                          helperText={
                            errors?.drcTypeEn ? errors.drcTypeEn.message : null
                          }
                        />
                        {/* <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Status Details "
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register('drcTypeEn')}
                          error={!!errors.drcTypeEn}
                          helperText={
                            errors?.drcTypeEn
                              ? errors.drcTypeEn.message
                              : null
                          }
                        /> */}
                      </div>

                      <div>
                        <Transliteration
                          style={{ backgroundColor: "white", margin: "250px" }}
                          _key={"drcTypeMr"}
                          labelName={"drcTypeMr"}
                          fieldName={"drcTypeMr"}
                          updateFieldName={"drcTypeEn"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          targetError={"drcTypeEn"}
                          width={250}
                          // disabled={disabled}
                          // label="DRC प्रकार"
                          label={<FormattedLabel id="drcTypeMr" required />}
                          error={!!errors.drcTypeMr}
                          helperText={
                            errors?.drcTypeMr ? errors.drcTypeMr.message : null
                          }
                        />
                        {/* <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="स्थिती तपशील "
                          variant="standard"
                          {...register('drcTypeMr')}
                          error={!!errors.drcTypeMr}
                          helperText={
                            errors?.drcTypeMr
                              ? errors.drcTypeMr.message
                              : null
                          }
                        /> */}
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == "Save" ? (
                            <FormattedLabel id="save" />
                          ) : (
                            <FormattedLabel id="update" />
                          )}
                        </Button>{" "}
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn} style={{ marginTop: "25px" }}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
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
        </div>
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
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={dataSource}
          columns={columns}
          onPageChange={(_data) => {
            console.log("222", data.pageSize, _data);
            getDRCType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            // console.log("222", _data);
            // updateData("page", 1);
            getDRCType(_data, data.page);
          }}
        />
        {/* <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          //checkboxSelection
        /> */}
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;
