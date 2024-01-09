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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // useEffect(() => {
  //   setDisbledInputStateButton(false);
  // }, [
  //   watch("previouslyAnyFireNocTaken"),
  //   watch("firmRegistrationNo"),
  //   watch("jvName"),
  //   watch("jvRegistrationNo"),
  //   watch("ownerName"),
  //   watch("ownerMiddleName"),
  //   watch("ownerLastName"),
  //   watch("ownerNameMr"),
  //   watch("ownerMiddleNameMr"),
  //   watch("ownerLastNameMr"),
  //   watch("ownerMobileNo"),
  //   watch("ownerEmailId"),
  // ]);

  const [disbledInputStateButton, setDisbledInputStateButton] = useState(false);

  const handleClick = () => {
    // const previouslyAnyFireNocTaken = watch("previouslyAnyFireNocTaken");
    const ownerShipType = watch("ownerShipType");
    const ownerName = watch("ownerName");
    const ownerMiddleName = watch("ownerMiddleName");
    const ownerLastName = watch("ownerLastName");
    const ownerNameMr = watch("ownerNameMr");
    const ownerMiddleNameMr = watch("ownerMiddleNameMr");
    const ownerLastNameMr = watch("ownerLastNameMr");
    const ownerMobileNo = watch("ownerMobileNo");
    const ownerEmailId = watch("ownerEmailId");

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
    }
    // if (firm === "JV") {
    //   if (jvName === "") {
    //     setErrorJv("Please enter JV Name");
    //   }
    // }

    // if (firm === "JV") {
    //   if (jvRegistrationNo === "") {
    //     setErrorJvNo("Please enter JV regisstration no.");
    //   }
    // }
    else {
      setDisbledInputStateButton(true);
      saveOwner();
      setIsOpenCollapse(isOpenCollapse);
      // setError("");
      // animalKeyFunction();
      // setCollapse(true);
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
    // currentownerDTLIodDao
    const currentownerDTLIodDao = {
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

    console.log("currentownerDTLIodDao", currentownerDTLIodDao?.id);

    // getAlredyData
    let tempownerDTLIodDao = watch("ownerDTLIodDao");
    console.log("tempownerDTLIodDao", typeof tempownerDTLIodDao);

    // if( typeof tempownerDTLIodDao == )
    // const tempownerDTLIodDaoLength = Number(tempownerDTLIodDao.length);

    // OwnerTableList
    if (tempownerDTLIodDao != null && tempownerDTLIodDao != undefined) {
      // ifArrayIsNotEmpty - secondRecordUpdateInTable
      if (
        currentownerDTLIodDao?.id == null ||
        currentownerDTLIodDao?.id == undefined
      ) {
        // ifAlredyRecordNotExit - Save
        setValue("ownerDTLIodDao", [
          ...tempownerDTLIodDao,
          currentownerDTLIodDao,
        ]);
      } else {
        // ifAlredyRecordExit - Update
        const tempData = tempownerDTLIodDao.filter((data, index) => {
          if (data?.id != currentownerDTLIodDao?.id) {
            return data;
          }
        });
        setValue("ownerDTLIodDao", [...tempData, currentownerDTLIodDao]);
      }
    } else {
      // ifArrayIsEmpty - firstRecordInTable
      setValue("ownerDTLIodDao", [currentownerDTLIodDao]);
    }

    // finalBodyForApi
    const finalBodyForApi = {
      ...getValues(),
      id: getValues("provisionalBuildingNocId"),
      // applicantDTLDao
      // applicantDTLDao: watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
      // ownerDTLIodDao
      ownerDTLIodDao:
        watch("ownerDTLIodDao") == undefined
          ? []
          : [...watch("ownerDTLIodDao")],
      // formDTLDao
      // formDTLDao: watch("formDTLDao") == undefined ? {} : watch("formDTLDao"),
      // buildingDTLDao
      // buildingDTLDao: watch("buildingDTLDao") == undefined ? [] : [...watch("buildingDTLDao")],
      // attachments
      // attachments: watch("attachments") == undefined ? [] : [...watch("attachments")],
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.FbsURL}/transaction/iodNoc/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setDisbledInputStateButton(false);

          console.log("res?.data", res?.data);
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
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        } else {
          //
        }
      })
      .catch((error) => {
        console.log("Error", error);
        //
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
        let tempownerDTLIodDao = watch("ownerDTLIodDao");

        if (tempownerDTLIodDao != null || tempownerDTLIodDao != undefined) {
          //activeFlagYRecords
          const tempDataY = tempownerDTLIodDao.filter((data, index) => {
            if (data?.id != ownerDetailDelteId) {
              return data;
            }
          });

          // wantToDeletRecord
          const tempData = tempownerDTLIodDao.filter((data, index) => {
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
          setValue("ownerDTLIodDao", [...tempDataY, ...tempDataN]);

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
    console.log("ownerDTLIodDaoqwe2e", watch("ownerDTLIodDao"));

    // filterTableData-ActiveFlag "Y"
    const tempTableDataWithFlagY = watch("ownerDTLIodDao")?.filter(
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

    console.log("tempTableData", tempTableData);

    // SetTableData
    setFinalOwnerDetailsTableData(tempTableData);
  }, [watch("ownerDTLIodDao")]);

  useEffect(() => {
    console.log("finalOwnerDetailsTableData", finalOwnerDetailsTableData);
  }, [finalOwnerDetailsTableData]);

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
                    className={styles.feildres}
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
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
                                setFirm(value.target.value);
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

                    {firm === "Individual" && (
                      <>
                        <Grid item xs={4} className={styles.feildres}></Grid>
                        <Grid item xs={4} className={styles.feildres}></Grid>
                      </>
                    )}
                    {firm === "Firm" && (
                      <>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            disabled={viewButtonInputState}
                            label={<FormattedLabel id="firmName" />}
                            variant="standard"
                            {...register("firmName")}
                            error={!!errors.firmName}
                            helperText={
                              errors?.firmName ? errors.firmName.message : null
                            }
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            type="number"
                            sx={{ width: "100%" }}
                            disabled={viewButtonInputState}
                            id="standard-basic"
                            label="Firm Registration No."
                            variant="standard"
                            {...register("firmRegistrationNo")}
                            error={!!errors.firmRegistrationNo}
                            helperText={
                              errors?.firmRegistrationNo
                                ? errors.firmRegistrationNo.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}

                    {firm === "JV" && (
                      <>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            sx={{ width: "100%" }}
                            disabled={viewButtonInputState}
                            id="standard-basic"
                            label="JV Name"
                            variant="standard"
                            {...register("jvName")}
                            onChange={(event) => {
                              if (errorJv !== "") {
                                setErrorJv("");
                              }
                            }}
                            helperText={
                              <p className={styles.error}>{errorJv}</p>
                            }
                            // error={!!errors.jvName}
                          />
                          {/* {<p className={styles.error}>{errorJv}</p>} */}
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            type="number"
                            sx={{ width: "100%" }}
                            id="standard-basic"
                            disabled={viewButtonInputState}
                            label="JV Registration No."
                            variant="standard"
                            {...register("jvRegistrationNo")}
                            onChange={(event) => {
                              if (errorJvNo !== "") {
                                setErrorJvNo("");
                              }
                            }}
                            helperText={
                              <p className={styles.error}>{errorJvNo}</p>
                            }
                          />
                          {/* {<p className={styles.error}>{errorJvNo}</p>} */}
                        </Grid>
                      </>
                    )}
                  </Grid>

                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      {/* <TextField
                          required
                          disabled={viewButtonInputState}
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label="Owner First Name"
                          variant="standard"
                          {...register("ownerName")}
                          onChange={(event) => {
                            if (error !== "") {
                              setError("");
                            }
                          }}
                          helperText={<p className={styles.error}>{error}</p>}
                        /> */}
                      <Transliteration
                        _key={"ownerName"}
                        labelName={"ownerName"}
                        fieldName={"ownerName"}
                        updateFieldName={"ownerNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        // variant="standard"
                        label="Owner First Name"
                        // label={
                        //   <FormattedLabel id="applicantTypeEn" required />
                        // }
                        InputLabelProps={{
                          shrink: watch("ownerName") ? true : false,
                        }}
                        onChange={(event) => {
                          if (ownerName !== "") {
                            setOwnerNameErr("");
                          }
                        }}
                        helperText={<p className={styles.error}>{ownerName}</p>}
                        // error={!!errors.typeName}
                        // helperText={
                        //   errors?.typeName ? errors.typeName.message : null
                        // }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      {/* <TextField
                          required
                          disabled={viewButtonInputState}
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label="Owner Middle Name"
                          variant="standard"
                          {...register("ownerMiddleName")}
                          onChange={(event) => {
                            if (errorMiddleName !== "") {
                              setErrorMiddleName("");
                            }
                          }}
                          helperText={
                            <p className={styles.error}>{errorMiddleName}</p>
                          }
                        /> */}
                      <Transliteration
                        _key={"ownerMiddleName"}
                        labelName={"ownerMiddleName"}
                        fieldName={"ownerMiddleName"}
                        updateFieldName={"ownerMiddleNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        // variant="standard"
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
                    <Grid item xs={4} className={styles.feildres}>
                      {/* <TextField
                          required
                          disabled={viewButtonInputState}
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label="Owner Last Name"
                          variant="standard"
                          {...register("ownerLastName")}
                          onChange={(event) => {
                            if (errorLastName !== "") {
                              setErrorlastName("");
                            }
                          }}
                          helperText={
                            <p className={styles.error}>{errorLastName}</p>
                          }
                        /> */}
                      <Transliteration
                        _key={"ownerLastName"}
                        labelName={"ownerLastName"}
                        fieldName={"ownerLastName"}
                        updateFieldName={"ownerLastNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        // variant="standard"
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
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        required
                        sx={{ width: "100%" }}
                        disabled={viewButtonInputState}
                        id="standard-basic"
                        label="Owner First Name (In Marathi)"
                        variant="standard"
                        {...register("ownerNameMr")}
                        InputLabelProps={{
                          shrink: watch("ownerName") ? true : false,
                        }}
                        onChange={(event) => {
                          if (errorNameMr !== "") {
                            setErrorNameMr("");
                          }
                        }}
                        helperText={
                          <p className={styles.error}>{errorNameMr}</p>
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        required
                        disabled={viewButtonInputState}
                        sx={{ width: "100%" }}
                        id="standard-basic"
                        label="Owner Middle Name (In Marathi)"
                        variant="standard"
                        {...register("ownerMiddleNameMr")}
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
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        required
                        disabled={viewButtonInputState}
                        sx={{ width: "100%" }}
                        id="standard-basic"
                        label="Owner Last Name (In Marathi)"
                        variant="standard"
                        {...register("ownerLastNameMr")}
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
