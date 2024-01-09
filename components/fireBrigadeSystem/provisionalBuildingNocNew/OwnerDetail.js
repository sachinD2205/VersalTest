import { Visibility } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import Transliteration from "../../../components/common/linguosol/transliteration";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

/** Sachin Durge */
// OwnerDetail
const OwnerDetail = ({ view = false }) => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const userToken = useGetToken();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [finalOwnerDetailsTableData, setFinalOwnerDetailsTableData] = useState(
    []
  );
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [viewIconState, setViewIconState] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [firm, setFirm] = useState();
  const language = useSelector((state) => state?.labels.language);
  const [error, setError] = useState(" ");

  // Owner Details
  const [ownerName, setOwnerNameErr] = useState(" ");

  const [errorJv, setErrorJv] = useState(" ");
  const [errorJvNo, setErrorJvNo] = useState(" ");

  const [ownerShipType, setOwnershipType] = useState(" ");
  const [errorMiddleName, setErrorMiddleName] = useState(" ");
  const [errorLastName, setErrorlastName] = useState(" ");
  const [errorNameMr, setErrorNameMr] = useState(" ");
  const [errorMiddleNameMr, setErrorMiddleNameMr] = useState(" ");
  const [errorLastNameMr, setErrorLastNameMr] = useState(" ");
  const [errorMobileNo, setErrorMobileNo] = useState(" ");
  const [errorEmailId, setErrorEmailId] = useState(" ");

  const [errorFirmName, setErrorFirmName] = useState("");
  const [errorFirmRegistrationNo, setErrorFirmRegistrationNo] = useState("");

  const [errorJvName, setErrorJvName] = useState("");
  const [errorJvRegistrationNo, setErrorJvRegistrationNo] = useState("");

  const [firstRender, setFirstRender] = useState(true);
  const [disabledOrNot, setDisabledOrNot] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [disbledInputStateButton, setDisbledInputStateButton] = useState(false);

  const handleClick = () => {
    console.log(":a1", watch("ownerMobileNo"));
    setFirstRender(false);

    const ownerShipType = watch("ownerShipType");
    const ownerName = watch("ownerName");
    const ownerMiddleName = watch("ownerMiddleName");
    const ownerLastName = watch("ownerLastName");
    const ownerNameMr = watch("ownerNameMr");
    const ownerMiddleNameMr = watch("ownerMiddleNameMr");
    const ownerLastNameMr = watch("ownerLastNameMr");
    const ownerMobileNo = watch("ownerMobileNo");
    const ownerEmailId = watch("ownerEmailId");

    const firmName = watch("firmName");
    const jvName = watch("jvName");
    const jvRegistrationNo = watch("jvRegistrationNo");

    const firmRegistrationNo = watch("firmRegistrationNo");

    if (ownerName === "") {
      setOwnerNameErr("Please enter Owner Name");
    }
    if (ownerShipType === "") {
      setOwnershipType("Please select a type");
    }
    if (ownerMiddleName === "") {
      setErrorMiddleName("Please enter Owner middle Name");
    }
    if (ownerLastName === "") {
      setErrorlastName("Please enter Owner last Name");
    }
    if (ownerNameMr === "") {
      setErrorNameMr("Please enter Owner Name (Marathi)");
    }
    if (ownerMiddleNameMr === "") {
      setErrorMiddleNameMr("Please enter Owner middle Name (Marathi) ");
    }
    if (ownerLastNameMr === "") {
      setErrorLastNameMr("Please enter Owner last Name (Marathi)");
    }
    if (ownerMobileNo === "") {
      setErrorMobileNo("Please enter Owner mobile no.");
    }
    if (ownerEmailId === "") {
      setErrorEmailId("Please enter Owner email id");
    } else if (
      ownerName !== "" &&
      ownerShipType !== "" &&
      ownerMiddleName !== "" &&
      ownerLastName !== "" &&
      ownerNameMr !== "" &&
      ownerMiddleNameMr !== "" &&
      ownerLastNameMr !== "" &&
      watch("ownerMobileNo")?.length == 10 &&
      ownerEmailId !== ""
    ) {
      setDisbledInputStateButton(true);
      saveOwner();
      setIsOpenCollapse(isOpenCollapse);
    }
  };

  // resetOwnerValuesWithId
  const resetOwnerValuesId = () => {
    setValue("id", null);
    setValue("OwnerDetailId", null);
    setValue("OwnerDetailActiveFlag", null);
    setValue("ownerDetail");
    setValue("srNoOwnerDTL", null);
    setValue("previouslyAnyFireNocTaken", null);
    setValue("firmName", "");
    setValue("firmRegistrationNo", "");
    setValue("jvName", "");
    setValue("jvRegistrationNo", "");
    setValue("ownerName", "");
    setValue("ownerNameMr", "");
    setValue("ownerMiddleName", "");
    setValue("ownerLastName", "");
    setValue("ownerMiddleNameMr", "");
    setValue("ownerLastNameMr", "");
    setValue("ownerMobileNo", "");
    setValue("ownerEmailId", "");
  };

  // setValues- onUpdate
  const SetOwnerValues = (props) => {
    console.log("setOwnerValues", props);
    setValue("OwnerDetailId", props?.id);
    setValue("ownerShipType", props?.ownerShipType);
    setValue("OwnerDetailActiveFlag", props?.activeFlag);
    setValue("nocId", props?.nocId);
    setValue("srNoOwnerDTL", props?.srNo);
    setValue("previouslyAnyFireNocTaken", props?.previouslyAnyFireNocTaken);
    setValue("firmName", props?.firmName);
    setValue("firmRegistrationNo", props?.firmRegistrationNo);
    setValue("jvName", props?.jvName);
    setValue("jvRegistrationNo", props?.jvRegistrationNo);
    setValue("ownerName", props?.ownerName);
    setValue("ownerNameMr", props?.ownerNameMr);
    setValue("ownerMiddleName", props?.ownerMiddleName);
    setValue("ownerLastName", props?.ownerLastName);
    setValue("ownerMiddleNameMr", props?.ownerMiddleNameMr);
    setValue("ownerLastNameMr", props?.ownerLastNameMr);
    setValue("ownerMobileNo", props?.ownerMobileNo);
    setValue("ownerEmailId", props?.ownerEmailId);
  };

  // saveOwner
  const saveOwner = () => {
    // currentOwnerDTLDao
    const currentOwnerDTLDao = {
      id: getValues("OwnerDetailId"),
      activeFlag: getValues("OwnerDetailActiveFlag"),
      nocId: getValues("nocId"),
      previouslyAnyFireNocTaken: getValues("previouslyAnyFireNocTaken"),
      firmName: getValues("firmName"),
      firmRegistrationNo: getValues("firmRegistrationNo"),
      ownerShipType: getValues("ownerShipType"),
      jvName: getValues("jvName"),
      jvRegistrationNo: getValues("jvRegistrationNo"),
      ownerName: getValues("ownerName"),
      ownerNameMr: getValues("ownerNameMr"),
      ownerMiddleName: getValues("ownerMiddleName"),
      ownerLastName: getValues("ownerLastName"),
      ownerMiddleNameMr: getValues("ownerMiddleNameMr"),
      ownerLastNameMr: getValues("ownerLastNameMr"),
      ownerMobileNo: getValues("ownerMobileNo"),
      ownerEmailId: getValues("ownerEmailId"),
    };

    console.log("currentOwnerDTLDao", currentOwnerDTLDao?.id);

    // getAlredyData
    let tempOwnerDTLDao = watch("ownerDTLDao");
    console.log("tempOwnerDTLDao", typeof tempOwnerDTLDao);

    // OwnerTableList
    if (tempOwnerDTLDao != null && tempOwnerDTLDao != undefined) {
      if (
        currentOwnerDTLDao?.id == null ||
        currentOwnerDTLDao?.id == undefined
      ) {
        // ifAlredyRecordNotExit - Save
        setValue("ownerDTLDao", [...tempOwnerDTLDao, currentOwnerDTLDao]);
      } else {
        // ifAlredyRecordExit - Update
        const tempData = tempOwnerDTLDao.filter((data, index) => {
          if (data?.id != currentOwnerDTLDao?.id) {
            return data;
          }
        });
        setValue("ownerDTLDao", [...tempData, currentOwnerDTLDao]);
      }
    } else {
      // ifArrayIsEmpty - firstRecordInTable
      setValue("ownerDTLDao", [currentOwnerDTLDao]);
    }

    // finalBodyForApi
    const finalBodyForApi = {
      ...getValues(),
      id: getValues("provisionalBuildingNocId"),
      ownerDTLDao:
        watch("ownerDTLDao") == undefined ? [] : [...watch("ownerDTLDao")],
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setDisbledInputStateButton(false);

          // setId
          setValue(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );
          // collpaseOpen/Close
          setIsOpenCollapse(false);
          // editButtonState
          setEditButtonInputState(false);
          // deleteButtonState
          setDeleteButtonState(false);
          // addButtonState
          setButtonInputState(false);
          // viewIconState
          setViewIconState(false);
          // resetOwnerValuesWithID
          resetOwnerValuesId();
          setValue("ownerShipType", "");
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  // deleteById
  const deleteById = async (value) => {
    let ownerDetailDelteId = value;
    console.log("ownerDetailDelteId", value);

    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let tempOwnerDTLDao = watch("ownerDTLDao");

        if (tempOwnerDTLDao != null || tempOwnerDTLDao != undefined) {
          //activeFlagYRecords
          const tempDataY = tempOwnerDTLDao.filter((data, index) => {
            if (data?.id != ownerDetailDelteId) {
              return data;
            }
          });

          // wantToDeletRecord
          const tempData = tempOwnerDTLDao.filter((data, index) => {
            if (data?.id == ownerDetailDelteId) {
              return data;
            }
          });

          // activeFlagNRecord
          const tempDataN = tempData.map((data) => {
            return {
              ...data,
              activeFlag: "N",
            };
          });

          // updateRecord
          setValue("ownerDTLDao", [...tempDataY, ...tempDataN]);

          // states
          // editButtonState
          setEditButtonInputState(false);
          // deleteButtonState
          setDeleteButtonState(false);
          // addButtonState
          setButtonInputState(false);
          // viewIconState
          setViewIconState(false);
        }
      } else {
        // editButtonState
        setEditButtonInputState(false);
        // deleteButtonState
        setDeleteButtonState(false);
        // addButtonState
        setButtonInputState(false);
        // viewIconState
        setViewIconState(false);
      }
    });
  };

  // exitFunction
  const exitFunction = () => {
    setValue("ownerShipType", "");
    // editButtonState
    setEditButtonInputState(false);
    // deleteButtonState
    setDeleteButtonState(false);
    // addButtonState
    setButtonInputState(false);
    // viewIconState
    setViewIconState(false);
    // save/updateButtonText
    setBtnSaveText("Save");
    // conditionalRendering
    setSlideChecked(true);
    // collpaseOpen/Close
    setIsOpenCollapse(false);
    // resetValuesWithId
    resetOwnerValuesId();
    // disabledInputState
    setViewButtonInputState(false);
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ownerName",
      headerName: "Owner Name",
      flex: 1.3,
      valueGetter: (params) =>
        `${params.row.ownerName} ${params.row.ownerMiddleName} ${params.row.ownerLastName}`,
    },
    {
      field: "ownerMobileNo",
      headerName: "Mobile No.",
      flex: 0.8,
    },
    {
      field: "ownerEmailId",
      headerName: "Email ID",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      align: "center",
      flex: 0.7,

      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              className={styles.view}
              disabled={viewIconState}
              onClick={() => {
                SetOwnerValues(params?.row);
                // editButtonState
                setEditButtonInputState(true);
                // deleteButtonState
                setDeleteButtonState(true);
                // addButtonState
                setButtonInputState(true);
                // viewIconState
                setViewIconState(true);
                // conditionalRendering
                setSlideChecked(true);
                // collpaseOpen/Close
                setIsOpenCollapse(!isOpenCollapse);
                // disabledInputState
                setViewButtonInputState(true);
                // save/updateButtonText
                // setBtnSaveText("Save");
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputState}
                onClick={() => {
                  console.log("params?.row", params?.row);
                  // setValues
                  SetOwnerValues(params?.row);
                  // editButtonState
                  setEditButtonInputState(true);
                  // deleteButtonState
                  setDeleteButtonState(true);
                  // addButtonState
                  setButtonInputState(true);
                  // viewIconState
                  setViewIconState(true);
                  // save/updateButtonText
                  setBtnSaveText("Update");
                  // conditionalRendering
                  setSlideChecked(true);
                  // collpaseOpen/Close
                  setIsOpenCollapse(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputState}
                onClick={() => {
                  deleteById(params?.row?.id);
                  // editButtonState
                  setEditButtonInputState(true);
                  // deleteButtonState
                  setDeleteButtonState(true);
                  // addButtonState
                  setButtonInputState(true);
                  // viewIconState
                  setViewIconState(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // =============================> useEffect ========================================>

  useEffect(() => {
    // filterTableData-ActiveFlag "Y"
    const tempTableDataWithFlagY = watch("ownerDTLDao")?.filter(
      (data, index) => {
        if (data?.activeFlag == "Y") {
          return data;
        }
      }
    );

    // mapRecordActiveFlagY
    const tempTableData = tempTableDataWithFlagY?.map((data, index) => {
      return {
        srNo: index + 1,
        ...data,
      };
    });

    // SetTableData
    setFinalOwnerDetailsTableData(tempTableData);
  }, [watch("ownerDTLDao")]);

  /////////

  useEffect(() => {
    if (!firstRender) {
      if (watch("ownerName") !== "") {
        setOwnerNameErr("");
      } else if (watch("ownerName") === "") {
        // alert("Please enter Owner Name")
        setOwnerNameErr("Please enter Owner Name");
      }

      if (watch("ownerShipType") !== "") {
        setOwnershipType("");
      } else if (watch("ownerShipType") === "") {
        // alert("Please select a type")
        setOwnershipType("Please select a type");
      }

      if (watch("ownerMiddleName") !== "") {
        setErrorMiddleName("");
      } else if (watch("ownerMiddleName") === "") {
        // alert("Please enter Owner middle Name")
        setErrorMiddleName("Please enter Owner middle Name");
      }

      if (watch("ownerLastName") !== "") {
        setErrorlastName("");
      } else if (watch("ownerLastName") === "") {
        // alert("Please enter Owner last Name")
        setErrorlastName("Please enter Owner last Name");
      }

      if (watch("ownerNameMr") !== "") {
        setErrorNameMr("");
      } else if (watch("ownerNameMr") === "") {
        // alert("Please enter Owner Name (Marathi)")
        setErrorNameMr("Please enter Owner Name (Marathi)");
      }

      if (watch("ownerMiddleNameMr") !== "") {
        setErrorMiddleNameMr("");
      } else if (watch("ownerMiddleNameMr") === "") {
        // alert("Please enter Owner middle Name (Marathi)")
        setErrorMiddleNameMr("Please enter Owner middle Name (Marathi)");
      }

      if (watch("ownerLastNameMr") !== "") {
        setErrorLastNameMr("");
      } else if (watch("ownerLastNameMr") === "") {
        // alert("Please enter Owner last Name (Marathi)")
        setErrorLastNameMr("Please enter Owner last Name (Marathi)");
      }

      if (
        // watch("ownerMobileNo") !== "" &&
        watch("ownerMobileNo")?.length == 10
      ) {
        setErrorMobileNo("");
      } else if (watch("ownerMobileNo") === "") {
        // alert("Please enter Owner mobile no.")
        setErrorMobileNo("Please enter Owner mobile no.");
      } else if (watch("ownerMobileNo")?.length <= 10) {
        setErrorMobileNo("Mobile number should be exactly 10 digits");
      }

      if (watch("ownerEmailId") !== "") {
        setErrorEmailId("");
      } else if (watch("ownerEmailId") === "") {
        // alert("Please enter Owner email id")
        setErrorEmailId("Please enter Owner email id");
      }

      // DIFFERENT OWNERSHIPDETAILS
      if (watch("ownerShipType") === "Firm") {
        if (watch("firmName") !== "") {
          setErrorFirmName("");
        } else if (watch("firmName") === "") {
          // alert("Please enter Owner email id")
          setErrorFirmName("Please enter Firm Name");
        }

        if (watch("firmRegistrationNo") !== "") {
          setErrorFirmRegistrationNo("");
        } else if (watch("firmRegistrationNo") === "") {
          // alert("Please enter Owner email id")
          setErrorFirmRegistrationNo("Please enter Firm Name");
        }
      }

      if (watch("ownerShipType") === "JV") {
        if (watch("jvName") !== "") {
          setErrorJvName("");
        } else if (watch("jvName") === "") {
          // alert("Please enter Owner email id")
          setErrorJvName("Please enter Jv Name");
        }

        if (watch("jvRegistrationNo") !== "") {
          setErrorJvRegistrationNo("");
        } else if (watch("jvRegistrationNo") === "") {
          // alert("Please enter Owner email id")
          setErrorJvRegistrationNo("Please enter Jv Registration No");
        }
      }
    }
  }, [
    firstRender,
    watch("ownerShipType"),
    watch("ownerName"),
    watch("ownerMiddleName"),
    watch("ownerLastName"),
    watch("ownerNameMr"),
    watch("ownerMiddleNameMr"),
    watch("ownerLastNameMr"),
    watch("ownerMobileNo"),
    watch("ownerEmailId"),
    watch("firmName"),
    watch("firmRegistrationNo"),
    watch("jvName"),
    watch("jvRegistrationNo"),
  ]);

  useEffect(() => {
    if (router?.query?.disabled) {
      setDisabledOrNot(JSON.parse(router?.query?.disabled));
    }
  }, [router?.query]);

  // view
  return (
    <>
      <Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <Box
                style={{
                  margin: "-10px 40px 50px 40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Paper
                  sx={{
                    padding: "18px 50px 20px 50px",
                    backgroundColor: "#F5F5F5",
                  }}
                  elevation={5}
                >
                  <Box className={styles.tableHead}>
                    <Box className={styles.feildHead}>
                      {language == "en" ? "Owner Details" : "मालक तपशील"}
                    </Box>
                  </Box>

                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    spacing={4}
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      marginTop: "10px",
                    }}
                  >
                    <Grid item xs={4}>
                      <FormControl variant="standard" sx={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          OwnerShip Type
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={viewButtonInputState}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);

                                if (ownerShipType !== "") {
                                  setOwnershipType("");
                                }
                              }}
                              name="ownerShipType"
                              fullWidth
                              size="small"
                              error={!!errors.ownerShipType}
                              helperText={
                                errors?.ownerShipType
                                  ? errors.ownerShipType.message
                                  : null
                              }
                            >
                              <MenuItem value="Firm">Firm </MenuItem>
                              <MenuItem value="JV">JV</MenuItem>
                              <MenuItem value="Individual">Individual</MenuItem>
                            </Select>
                          )}
                          name="ownerShipType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {<p className={styles.error}>{ownerShipType}</p>}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {watch("ownerShipType") === "Firm" && (
                      <>
                        <Grid item xs={4}>
                          <TextField
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            disabled={viewButtonInputState}
                            label={<FormattedLabel id="firmName" />}
                            variant="standard"
                            {...register("firmName")}
                            helperText={
                              <p className={styles.error}>{errorFirmName}</p>
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            type="number"
                            sx={{ width: "100%" }}
                            disabled={viewButtonInputState}
                            id="standard-basic"
                            label="Firm Registration No."
                            variant="standard"
                            {...register("firmRegistrationNo")}
                            helperText={
                              <p className={styles.error}>
                                {errorFirmRegistrationNo}
                              </p>
                            }
                          />
                        </Grid>
                      </>
                    )}

                    {watch("ownerShipType") === "JV" && (
                      <>
                        <Grid item xs={4}>
                          <TextField
                            sx={{ width: "100%" }}
                            disabled={viewButtonInputState}
                            id="standard-basic"
                            label="JV Name"
                            variant="standard"
                            {...register("jvName")}
                            helperText={
                              <p className={styles.error}>{errorJvName}</p>
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            type="number"
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            disabled={viewButtonInputState}
                            label="JV Registration No."
                            variant="standard"
                            {...register("jvRegistrationNo")}
                            helperText={
                              <p className={styles.error}>
                                {errorJvRegistrationNo}
                              </p>
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>

                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    spacing={2}
                  >
                    <Grid item xs={4}>
                      <Transliteration
                        _key={"ownerName"}
                        labelName={"ownerName"}
                        fieldName={"ownerName"}
                        updateFieldName={"ownerNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={viewButtonInputState}
                        label="Owner First Name"
                        InputLabelProps={{
                          shrink: watch("ownerName") ? true : false,
                        }}
                        onChange={(event) => {
                          if (ownerName !== "") {
                            setOwnerNameErr("");
                          }
                        }}
                        helperText={<p className={styles.error}>{ownerName}</p>}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Transliteration
                        _key={"ownerMiddleName"}
                        labelName={"ownerMiddleName"}
                        fieldName={"ownerMiddleName"}
                        updateFieldName={"ownerMiddleNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={viewButtonInputState}
                        label="Owner Middle Name"
                        InputLabelProps={{
                          shrink: !!watch("ownerMiddleName"),
                        }}
                        onChange={(event) => {
                          if (errorMiddleName !== "") {
                            setErrorMiddleName("");
                          }
                        }}
                        helperText={
                          <p className={styles.error}>{errorMiddleName}</p>
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Transliteration
                        _key={"ownerLastName"}
                        labelName={"ownerLastName"}
                        fieldName={"ownerLastName"}
                        updateFieldName={"ownerLastNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={viewButtonInputState}
                        label="Owner Last Name"
                        InputLabelProps={{
                          shrink: watch("ownerLastName") ? true : false,
                        }}
                        onChange={(event) => {
                          if (errorLastName !== "") {
                            setErrorlastName("");
                          }
                        }}
                        helperText={
                          <p className={styles.error}>{errorLastName}</p>
                        }
                      />
                    </Grid>
                    {/* <Grid item xs={4} className={styles.feildres}> */}
                    <Grid item xs={4}>
                      <Transliteration
                        _key={"ownerNameMr"}
                        labelName={"ownerNameMr"}
                        fieldName={"ownerNameMr"}
                        updateFieldName={"ownerName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={viewButtonInputState}
                        label="Owner First Name (In Marathi)"
                        // label={
                        //   <FormattedLabel id="applicantTypeEn" required />
                        // }
                        InputLabelProps={{
                          shrink: watch("ownerNameMr") ? true : false,
                        }}
                        onChange={(event) => {
                          if (errorNameMr !== "") {
                            setOwnerNameErr("");
                          }
                        }}
                        helperText={
                          <p className={styles.error}>{errorNameMr}</p>
                        }
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <Transliteration
                        _key={"ownerMiddleNameMr"}
                        labelName={"ownerMiddleNameMr"}
                        fieldName={"ownerMiddleNameMr"}
                        updateFieldName={"ownerMiddleName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={viewButtonInputState}
                        label="Owner Middle Name (In Marathi)"
                        InputLabelProps={{
                          shrink: !!watch("ownerMiddleNameMr"),
                        }}
                        onChange={(event) => {
                          if (errorMiddleNameMr !== "") {
                            setErrorMiddleNameMr("");
                          }
                        }}
                        helperText={
                          <p className={styles.error}>{errorMiddleNameMr}</p>
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Transliteration
                        _key={"ownerLastNameMr"}
                        labelName={"ownerLastNameMr"}
                        fieldName={"ownerLastNameMr"}
                        updateFieldName={"ownerLastName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={viewButtonInputState}
                        label="Owner Last Name (In Marathi)"
                        InputLabelProps={{
                          shrink: watch("ownerLastNameMr") ? true : false,
                        }}
                        onChange={(event) => {
                          if (errorLastNameMr !== "") {
                            setErrorLastNameMr("");
                          }
                        }}
                        helperText={
                          <p className={styles.error}>{errorLastNameMr}</p>
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        required
                        disabled={viewButtonInputState}
                        sx={{ width: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="mobileNo" />}
                        variant="standard"
                        inputProps={{ maxLength: 10 }}
                        {...register("ownerMobileNo")}
                        onChange={(event) => {
                          let number = event.target.value;
                          if (number === "") {
                            setErrorMobileNo("Please enter mobile number");
                          } else if (!/^\d+$/.test(number)) {
                            setErrorMobileNo(
                              "Mobile number should contain only digits"
                            );
                          } else if (number.length !== 10) {
                            setErrorMobileNo(
                              "Mobile number should be exactly 10 digits"
                            );
                          } else {
                            setErrorMobileNo("");
                          }
                        }}
                        helperText={
                          <p className={styles.error}>{errorMobileNo}</p>
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        required
                        disabled={viewButtonInputState}
                        sx={{ width: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="emailId" />}
                        variant="standard"
                        {...register("ownerEmailId")}
                        onChange={(event) => {
                          let emailValue = event.target.value;
                          if (emailValue === "") {
                            setErrorEmailId("");
                          } else if (!isValidEmail(emailValue)) {
                            setErrorEmailId(
                              "Please enter a valid email address"
                            );
                          } else {
                            setErrorEmailId("");
                          }
                        }}
                        helperText={
                          <p className={styles.error}>{errorEmailId}</p>
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                  <br />
                  <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      {!viewButtonInputState && (
                        <Button
                          // disabled={disbledInputStateButton}
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                          onClick={() => {
                            handleClick();
                            // checkValidation();
                            // saveOwner();
                            // setIsOpenCollapse(isOpenCollapse);
                          }}
                        >
                          {btnSaveText == "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>
                      )}
                    </Grid>

                    <Grid item>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitFunction()}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </div>
          </Slide>
        )}
        <br />
        <Box style={{ display: "flex", marginLeft: 20, marginRight: 20 }}>
          <Box className={styles.tableHead}>
            <Box className={styles.h1Tag}>Owner Details</Box>
          </Box>
          {!view && (
            <Box>
              <Button
                variant="contained"
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  // editButtonState
                  setEditButtonInputState(true);
                  // deleteButtonState
                  setDeleteButtonState(true);
                  // addButtonState
                  setButtonInputState(true);
                  // viewIconState
                  setViewIconState(true);
                  // save/updateButtonText
                  setBtnSaveText("Save");
                  // conditionalRendering
                  setSlideChecked(true);
                  // collpaseOpen/Close
                  setIsOpenCollapse(!isOpenCollapse);
                }}
                className={styles.adbtn}
                sx={{
                  borderRadius: 100,
                  padding: 2,
                  marginLeft: 1,
                  textAlign: "center",
                  border: "2px solid #3498DB",
                }}
              >
                <AddIcon />
              </Button>
            </Box>
          )}
        </Box>

        <Box style={{ display: "flex", marginLeft: 20, marginRight: 20 }}>
          <DataGrid
            getRowId={(row) => row.srNo}
            disableColumnFilter
            disableColumnSelector
            disableExport
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
            }}
            components={{ Toolbar: GridToolbar }}
            autoHeight
            density="compact"
            sx={{
              backgroundColor: "white",

              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E1FDFF",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#87E9F7",
              },
            }}
            rows={
              finalOwnerDetailsTableData == null ||
              finalOwnerDetailsTableData == undefined
                ? []
                : finalOwnerDetailsTableData
            }
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7]}
          />
        </Box>
      </Box>
    </>
  );
};

export default OwnerDetail;
