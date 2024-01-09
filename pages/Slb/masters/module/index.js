import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Paper, Slide, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
//import urls from '../../../../URLS/urls'
import swal from "sweetalert";
import schema from "../../../../containers/schema/marriageRegistration/relation";
import urls from "../../../../URLS/urls";
import styles from "./view.module.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
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
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const language = useSelector((state) => state.labels.language);
  let user = useSelector((state) => state.user.user);
  // Get Table - Data

  const getModuleDetails = () => {
    axios
      .get(`${urls.SLB}/module/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDataSource(
          res.data.moduleList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            moduleName: r.moduleName,
            activeFlag: r.activeFlag,
          }))
        );
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getModuleDetails();
  }, []);

  // OnSubmit Form
  const onSubmitForm = async (fromData) => {
    fromData.preventDefault();
    // Save - DB
    if (btnSaveText.toLowerCase() === "save" || btnSaveText.toLowerCase().includes("update")) {
      let body = "";
      if (id === undefined || id === null || id === "") {
        body = {
          moduleName: document.getElementById("standard-basic").value,
          activeFlag: "Y",
        };
      } else {
        body = {
          moduleName: document.getElementById("standard-basic").value,
          id: id,
          activeFlag: "Y",
        };
      }
      await axios
        .post(`${urls.SLB}/module/save`, body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then(
          (res) => {
            if (res.status == 201 || res.status == 200) {
              let title = language == "en" ? "Saved!" : "जतन केले गेले!";
              let msg = language == "en" ? "Record Saved successfully !" : "रेकॉर्ड यशस्वीरित्या साठवले गेले !";
              swal(title, msg, "success");
              getModuleDetails();
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
            }
          },
          (error) => {
            alert(error);
          }
        );
    }
    // Update Data Based On ID
    else if (btnSaveText === "delete") {
      const tempData = axios
        .post(`${urls.SLB}/module/save`, {
          activeFlag: N,
          id: null,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            let title = language == "en" ? "Updated!" : "अपडेटेड!";
            let msg = language == "en" ? "Record Updated successfully !" : "रेकॉर्ड यशस्वीरित्या अपडेट केले गेले !";
            swal(title, msg, "success");
            getModuleDetails();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
          }
        });
    }
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      let title = language == "en" ? "Inactivated!" : "अक्रियाशील केले गेले!";
      let msg = language == "en" ? "Record Inactivated successfully !" : "रेकॉर्ड यशस्वीरित्या अक्रियाशील केले गेले !";
      swal({
        title: title,
        text: msg,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLB}/module/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                let title =
                  language == "en" ? "Record is Successfully Deleted!" : "रेकॉर्ड यशस्वीरित्या डिलीट केले गेले !";
                swal(title, {
                  icon: "success",
                });
                getModuleDetails();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          let title = language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे";
          swal(title);
        }
      });
    } else {
      let title = language == "en" ? "Activated!" : "सक्रिय केले गेले!";
      let msg = language == "en" ? "Record Activated successfully !" : "रेकॉर्ड यशस्वीरित्या सक्रिय केले गेले !";
      swal({
        title: title,
        text: msg,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLB}/module/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                let title =
                  language == "en" ? "Record is Successfully Deleted!" : "रेकॉर्ड यशस्वीरित्या डिलीट केले गेले !";
                swal(title, {
                  icon: "success",
                });
                getModuleDetails();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          let title = language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे";
          swal(title);
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
    module: "",
    moduleName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    module: "",

    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr. No." : "क्र.",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },

    {
      // field: "module_name",
      field: "moduleName",
      headerName: language == "en" ? "Module Name" : "मॉड्यूलचे नाव",
      //type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "actions",
      headerName: language == "en" ? "Actions" : "क्रिया",
      flex: 1,
      headerAlign: "left",
      align: "left",

      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <Box>
              <IconButton
                title="Edit"
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"), setID(params.row.id), setIsOpenCollapse(true), setSlideChecked(true);
                  // setButtonInputState(true);
                  reset(params.row);
                }}
              >
                <EditIcon style={{ color: "#556CD6" }} />
              </IconButton>

              <IconButton
                title={params.row.activeFlag == "N" ? "Activate" : "Inactivate"}
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"), setID(params.row.id), setSlideChecked(true);
                  reset(params.row);
                }}
              >
                {params.row.activeFlag == "Y" ? (
                  <ToggleOnIcon style={{ color: "green", fontSize: 30 }} onClick={() => deleteById(params.id, "N")} />
                ) : (
                  <ToggleOffIcon style={{ color: "red", fontSize: 30 }} onClick={() => deleteById(params.id, "Y")} />
                )}
              </IconButton>
            </Box>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      {/* <BasicLayout> */}
      <Paper
      // sx={{
      //   padding: 1,
      // }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={onSubmitForm}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={language == "en" ? "Module Name *" : "मॉड्यूलचे नाव *"}
                          variant="standard"
                          {...register("moduleName")}
                          error={!!errors.moduleName}
                          helperText={errors?.moduleName ? errors.moduleName.message : null}
                        />
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                          disabled={watch("moduleName") ? false : true}
                        >
                          {language == "en" ? "Save" : "जतन करा"}{" "}
                        </Button>{" "}
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          disabled={watch("moduleName") ? false : true}
                          onClick={() => cancellButton()}
                        >
                          {language == "en" ? "Clear" : "साफ करा"}{" "}
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {language == "en" ? "Exit" : "बाहेर पडा"}{" "}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={isOpenCollapse ? true : false}
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
            {language == "en" ? "Add" : "जोडा"}{" "}
          </Button>
        </div>
        <DataGrid
          sx={{
            marginLeft: 1,
            marginRight: 1,
            marginTop: 1,
            marginBottom: 1,
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
          //   marginLeft: 5,
          //   marginRight: 5,
          //   marginTop: 5,
          //   marginBottom: 5,
          // }}
          rows={dataSource}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          //checkboxSelection
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;
