import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  CircularProgress,
  Paper,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import schema from "../../../../containers/schema/marriageRegistration/religion";
import styles from "../religion/view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
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
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  let user = useSelector((state) => state.user.user);
  // Get Table - Data
  const getreligionDetails = () => {
    setLoaderState(true);
    axios
      .get(`${urls.BaseURL}/religion/getReligionDetails`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setLoaderState(false);
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            religion: r.religion,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getreligionDetails();
  }, [fetchData]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    console.log("first");
    // Save - DB
    if (btnSaveText === "Save") {
      setLoaderState(true);
      axios
        .post(`${urls.BaseURL}/religion/saveReligion`, fromData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            setLoaderState(false);
            swal("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            getreligionDetails();
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setLoaderState(true);
      const tempData = axios
        .put(`${urls.BaseURL}/religion/updateReligion`, fromData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            swal("Updated!", "Record Updated successfully !", "success");
            setLoaderState(false);
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
  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setLoaderState(true);
        axios
          .delete(`${urls.BaseURL}/religion/deleteReligion/${value}`)
          .then((res) => {
            if (res.status == 226 || res.status == 201 || res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setLoaderState(false);
              setButtonInputState(false);
              getreligionDetails();
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else {
        swal("Record is Safe");
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
    religion: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    religion: "",

    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    // {
    //   field: 'srNo',
    //   headerName: 'serialNo',
    //   flex: 1,
    // },

    {
      field: "religion",
      headerName: "religion",
      //type: "number",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
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
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      {loaderState ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // Adjust itasper requirement.
          }}
        >
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "50%",
              padding: 8,
            }}
            elevation={8}
          >
            <CircularProgress color="success" />
          </Paper>
        </div>
      ) : (
        <>
          <BasicLayout>
            <Paper
              sx={{
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                marginBottom: 5,
                padding: 1,
              }}
            >
              {isOpenCollapse && (
                <Slide
                  direction="down"
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
                                sx={{ width: 250 }}
                                id="standard-basic"
                                label="Religion"
                                variant="standard"
                                // value={dataInForm && dataInForm.remark}
                                {...register("religion")}
                                error={!!errors.religion}
                                helperText={
                                  errors?.religion
                                    ? errors.religion.message
                                    : null
                                }
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
                              >
                                {btnSaveText}
                              </Button>{" "}
                            </div>
                            <div className={styles.btn1}>
                              <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ClearIcon />}
                                onClick={() => cancellButton()}
                              >
                                Clear
                              </Button>
                            </div>
                            <div className={styles.btn1}>
                              <Button
                                variant="contained"
                                color="error"
                                endIcon={<ExitToAppIcon />}
                                onClick={() => exitButton()}
                              >
                                Exit
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
          </BasicLayout>
        </>
      )}
    </>
  );
};

export default Index;
