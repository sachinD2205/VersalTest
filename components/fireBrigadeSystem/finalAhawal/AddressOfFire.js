import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { Delete, Visibility } from "@mui/icons-material";
import { useRouter } from "next/router";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import FileTable from "../../../pages/FireBrigadeSystem/FileUpload/FileTable";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

// constructionLoss: r.constructionLoss,
//             insuranced: r.insuranced,
//             fireType: r.fireType,
//             fireTypeMr: r.fireTypeMr,
//             fireReason: r.fireReason,
//             fireReasonMr: r.fireReasonMr,

// http://localhost:4000/hawkerManagementSystem/transactions/components/AddressOfFire
const AddressOfFire = (props) => {
  const userToken = useGetToken();

  // table document
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const language = useSelector((state) => state.labels.language);
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  const router = useRouter();

  // Columns
  const columns = [
    // {
    //   headerName: 'Sr.No',
    //   field: 'srNo',
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: "File Name",
      field: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 140,
    },
    {
      headerName: "Uploaded By",
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      // field: language ==='en'?'attachedNameMr':'attachedNameEn',
      flex: 1,
      // width: 300,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      // flex: 1,

      renderCell: (record, buttonInputState) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record?.row?.filePath}`,
                  "_blank"
                );
              }}
            >
              <Visibility />
            </IconButton>
            {/* {buttonInputStateNew && ( */}
            <IconButton color="error" onClick={() => discard(record.row)}>
              <Delete />
            </IconButton>
            {/* )} */}
          </>
        );
      },
    },
  ];

  // useEffect(() => {
  //   if (router.query.pageMode === "Edit" || router.query.pageMode === "View") {
  //     console.log("222222", router.query);
  //     if (router?.query?.id) {
  //       axios
  //         .get(`${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${router?.query?.id}`)
  //         .then((res) => {
  //           // if (r.status == 200) {
  //           console.log("332233", res.data);
  //           reset(res?.data);
  //         })
  //         .catch((err) => {
  //           console.log("errApplication", err);
  //         });
  //     }
  //   }
  // }, []);

  // useEffect
  useEffect(() => {
    if (localStorage.getItem("attachments") !== null) {
      setAdditionalFiles(JSON.parse(localStorage.getItem("attachments")));
    }
  }, []);

  // useEffect
  useEffect(() => {}, [attachments, mainFiles, additionalFiles]);

  // useEffect
  useEffect(() => {
    setAttachments([...mainFiles, ...additionalFiles]);
    localStorage.setItem(
      "attachments",
      JSON.stringify([...mainFiles, ...additionalFiles])
    );
  }, [mainFiles, additionalFiles]);

  useEffect(() => {}, [buttonInputStateNew]);

  // Delete
  const discard = async (props) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${props.filePath}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              // setFilePath(null),
              // props.filePath(null);

              let attachement = JSON.parse(localStorage.getItem("attachments"))
                ?.filter((a) => a?.filePath != props.filePath)
                ?.map((a) => a);
              setAdditionalFiles(attachement);
              localStorage.removeItem("attachments");
              localStorage.setItem("attachments", JSON.stringify(attachement));

              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  // useEffect
  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
  }, [props]);

  // document end

  // file uploading
  let documentsUpload = null;
  let appName = "MR";
  let serviceName = "M-MBR";
  let applicationFrom = "Web";

  //handel file
  // const handleFile1 = async (e, labelName) => {
  //   let formData = new FormData();
  //   formData.append("file", e.target.files[0]);
  //   axios
  //     .post(
  //       `${urls.CFCURL}/file/upload?appName=${appName}&serviceName=${serviceName}`,
  //       formData
  //     )
  //     .then((r) => {
  //       if (r.status == 200) {
  //         console.log(r.data);
  //         console.log(r.data.filePath);

  //         if (labelName === "documentsUpload") {
  //           console.log("File path sapadala Ka---?>", r.data.filePath);
  //           setValue("documentsUpload", r.data.filePath);
  //         } else if (labelName === "boardHeadPersonPhoto") {
  //           setValue("boardHeadPersonPhoto", r.data.filePath);
  //         } else if (labelName == "boardHeadPersonThumbImpression") {
  //           setValue("boardHeadPersonThumbImpression", r.data.filePath);
  //         }
  //       } else {
  //         sweetAlert("Error");
  //       }
  //     });
  // };

  // useEffect(() => {
  //   getLevelOfFire();
  // }, []);

  // const [levelOfFire, setLevelOfFire] = useState();

  // get Vardi Types
  // const getLevelOfFire = () => {
  //   axios
  //     .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`)
  //     .then((res) => {
  //       console.log("vardi", res?.data);
  //       setLevelOfFire(res?.data);
  //     });
  // };

  useEffect(() => {
    getChargeRate();
  }, []);

  const [chargeRate, setChargeRate] = useState();
  const [standByDuty, setStandByDuty] = React.useState();
  const [menus, subMenus] = React.useState();
  const [Payment, setPayment] = useState([]);
  const [OutsiteArea, setOutsiteArea] = useState([]);

  // Get Charge Rate
  const getChargeRate = () => {
    axios
      .get(`${urls.FbsURL}/chargeTypeRateEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("ch", res?.data?.chargeTypeRate);
        setChargeRate(res?.data?.chargeTypeRate);
      });
  };

  return (
    <>
      <Box className={styles.tableHead}>
        <Box className={styles.feildHead}>
          {/* {<FormattedLabel id="informerDetails" />} */}
          Details
        </Box>
      </Box>
      <Grid
        container
        // spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
        spacing={4}
      >
        <Grid item xs={6} className={styles.feildres}>
          <FormControl
            size="small"
            sx={{ minWidth: "90%" }}
            variant="outlined"
            error={!!errors.outSidePcmcArea}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* Citizen need to Payment */}
              {<FormattedLabel id="citizenNeedToPayment" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ backgroundColor: "white" }}
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                    setPayment(value.target.value);
                  }}
                  // label='Citizen need to Payment'
                  label={<FormattedLabel id="citizenNeedToPayment" />}
                >
                  <MenuItem value={1}>{<FormattedLabel id="yes" />}</MenuItem>
                  <MenuItem value={2}>{<FormattedLabel id="no" />}</MenuItem>
                </Select>
              )}
              name="finalAhawal.citizenNeedToPayment"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} className={styles.feildres}>
          <FormControl
            size="small"
            sx={{ minWidth: "90%" }}
            variant="outlined"
            error={errors?.finalAhawal?.outSidePcmcArea}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="isCitizenOutsideFromPcmcArea" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ backgroundColor: "white" }}
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                  }}
                  // label='is citizen outside from pcmc area'
                  lable={<FormattedLabel id="isCitizenOutsideFromPcmcArea" />}
                >
                  <MenuItem value={1}>{<FormattedLabel id="yes" />}</MenuItem>
                  <MenuItem value={2}>{<FormattedLabel id="no" />}</MenuItem>
                </Select>
              )}
              name="finalAhawal.outSidePcmcArea"
              control={control}
              defaultValue=""
            />
            <FormHelperText style={{ color: "red" }}>
              {errors?.finalAhawal?.outSidePcmcArea
                ? errors?.finalAhawal?.outSidePcmcArea.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={6} className={styles.feildres}>
          <FormControl
            size="small"
            sx={{ minWidth: "90%" }}
            variant="outlined"
            error={!!errors.outSidePcmcArea}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="waterSprayingPumpingCharge" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ backgroundColor: "white" }}
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                    setOutsiteArea(value.target.value);
                  }}
                  // label='water spraying / pumping charge'
                  label={<FormattedLabel id="waterSprayingPumpingCharge" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {chargeRate &&
                    chargeRate
                      .filter((fil) => fil.chargeType == 5)
                      .map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.subCharge}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="finalAhawal.pumpingCharge"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} className={styles.feildres}>
          <TextField
            size="small"
            sx={{ minWidth: "90%", backgroundColor: "white" }}
            variant="outlined"
            type="number"
            id="outlined-basic"
            // label={<FormattedLabel id="billPayeraddress" />}
            // label='Number Of Trip'
            label={<FormattedLabel id="numberOfTrip" />}
            {...register("finalAhawal.numberOfTrip")}
            error={!!errors.numberOfTrip}
            helperText={
              errors?.numberOfTrip ? errors.numberOfTrip.message : null
            }
          />
        </Grid>
      </Grid>
      <br />
      <Grid
        container
        // spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
        spacing={4}
      >
        <Grid item xs={6} className={styles.feildres}>
          <FormControl
            size="small"
            sx={{ minWidth: "90%" }}
            variant="outlined"
            error={!!errors.rescueVardi}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* स्टैंड बाय डयुटी (आगाऊ रक्कम भरणे)- */}
              {<FormattedLabel id="outsidePCMCAreaRescueVardi" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ backgroundColor: "white" }}
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                    // setOutsiteArea(value.target.value);
                    subMenus(value.target.value);
                  }}
                  // label='Outside PCMC Area / Rescue Vardi'
                  label={<FormattedLabel id="outsidePCMCAreaRescueVardi" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {chargeRate &&
                    chargeRate
                      .filter((fil) => fil.chargeType == 6)
                      .map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.subCharge}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="finalAhawal.rescueVardi"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        {/* Display Submenu According to Menus */}
        <Grid item xs={6} className={styles.feildres}>
          <FormControl
            size="small"
            sx={{ minWidth: "90%" }}
            variant="outlined"
            error={!!errors.thirdCharge}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="charge" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ backgroundColor: "white" }}
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                  }}
                  // label='Charge'
                  label={<FormattedLabel id="charge" />}
                >
                  <MenuItem value="9090">
                    <em>None</em>
                  </MenuItem>
                  {/* {thirdCharge &&
                              thirdCharge
                                .filter((fil) => fil.subCharge == menus)
                                .map((u) => (
                                  <MenuItem key={u.id} value={u.id}>
                                    {u.thirdCharge}
                                  </MenuItem>
                                ))} */}
                  {chargeRate &&
                    chargeRate
                      .filter((fil) => fil.id == menus)
                      .map(
                        (item, index) =>
                          item.thirdCharge &&
                          item.thirdCharge.map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                              {u.thirdCharge}
                            </MenuItem>
                          ))
                      )}
                </Select>
              )}
              name="finalAhawal.thirdCharge"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} className={styles.feildres}>
          <TextField
            sx={{ width: "90%", backgroundColor: "white" }}
            size="small"
            variant="outlined"
            // label={<FormattedLabel id="billPayeraddress" />}
            // label='Other Charges Name (If Applicable)'
            label={<FormattedLabel id="otherChargesNameIfApplicable" />}
            {...register("finalAhawal.otherChargesName")}
            error={!!errors.otherChargesName}
            helperText={
              errors?.otherChargesName ? errors.otherChargesName.message : null
            }
          />
        </Grid>
        <Grid item xs={6} className={styles.feildres}>
          <TextField
            size="small"
            sx={{ width: "90%", backgroundColor: "white" }}
            type="number"
            variant="outlined"
            // label={<FormattedLabel id="billPayeraddress" />}
            // label='Other Charges Amount'
            label={<FormattedLabel id="otherChargesAmount" />}
            {...register("finalAhawal.otherChargesAmount")}
            error={!!errors.otherChargesAmount}
            helperText={
              errors?.otherChargesAmount
                ? errors.otherChargesAmount.message
                : null
            }
          />
        </Grid>
      </Grid>
      {/* <div className={styles.details}>
        <div className={styles.h1Tag}>
          <h3
            style={{
              color: "white",
              marginTop: "5px",
              paddingLeft: 10,
            }}
          >
            {<FormattedLabel id="fireDetails" />}
          </h3>
        </div>
      </div> */}
      {/* <br />
      <br />
      <Box className={styles.tableHead}>
        <Box className={styles.feildHead}>Fire Loss Details</Box>
      </Box> */}
      <br />
      <Grid
        container
        // spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
        spacing={4}
      >
        {/* <Grid item xs={4} className={styles.feildres}>
           <TextField
            sx={{width: "80%"}}
            id="standard-basic"
            label={<FormattedLabel id="fireReason" />}
            // label="Fire Reason (Tentetive)"
            variant="standard"
            {...register("fireReason")}
            error={!!errors.fireReason}
            helperText={errors?.fireReason ? errors.fireReason.message : null}
          />
        </Grid> */}
        <Grid item xs={6} className={styles.feildres}>
          <FormControl
            size="small"
            sx={{ minWidth: "90%" }}
            variant="outlined"
            error={!!errors.typeOfFire}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* <FormattedLabel id="typeOfVardi" /> */}
              {/* Classification Of Fire (Type Of Fire) */}
              {<FormattedLabel id="classificationOfFireTypeOfFire" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ backgroundColor: "white" }}
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                  }}
                  // label='Classification Of Fire (Type Of Fire)'
                  label={<FormattedLabel id="classificationOfFireTypeOfFire" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="31">
                    <em>A- Solid</em>
                  </MenuItem>
                  <MenuItem value="32">
                    <em>B- Liquid</em>
                  </MenuItem>
                  <MenuItem value="33">
                    <em>C- Gases</em>
                  </MenuItem>
                  <MenuItem value="34">
                    <em>D- Metal</em>
                  </MenuItem>
                  <MenuItem value="35">
                    <em>K- Kitchen</em>
                  </MenuItem>
                  {/* {levelOfFire &&
                    levelOfFire.map((vardi, index) => (
                      <MenuItem key={index} value={vardi.id}>
                        {language == "en" ? vardi.vardiName : vardi.vardiNameMr}
                      </MenuItem>
                    ))} */}
                </Select>
              )}
              name="finalAhawal.typeOfFire"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.typeOfVardiId ? errors.typeOfVardiId.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={6} className={styles.feildres}>
          <FormControl
            size="small"
            sx={{ minWidth: "90%" }}
            variant="outlined"
            error={!!errors.typeOfVardiId}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* <FormattedLabel id="typeOfVardi" /> */}
              {<FormattedLabel id="levelOfFire" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ backgroundColor: "white" }}
                  fullWidth
                  value={field.value}
                  onChange={(value) => {
                    console.log("value", value);
                    field.onChange(value);
                  }}
                  // label='Level Of Fire'
                  label={<FormattedLabel id="levelOfFire" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="41">
                    <em>Minor</em>
                  </MenuItem>
                  <MenuItem value="42">
                    <em>Modarate</em>
                  </MenuItem>
                  <MenuItem value="43">
                    <em>Major</em>
                  </MenuItem>
                  {/* {levelOfFire &&
                    levelOfFire.map((vardi, index) => (
                      <MenuItem key={index} value={vardi.id}>
                        {language == "en" ? vardi.vardiName : vardi.vardiNameMr}
                      </MenuItem>
                    ))} */}
                </Select>
              )}
              name="finalAhawal.levelOfFire"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.typeOfVardiId ? errors.typeOfVardiId.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* <Grid item xs={4} className={styles.feildres}>
           <TextField
 sx={{width: "80%"}}
            id="standard-basic"
            label={<FormattedLabel id="fireReasonMr" />}
            // label="Fire Reason (Tentetive)"
            variant="standard"
            {...register("fireReasonMr")}
            error={!!errors.fireReasonMr}
            helperText={
              errors?.fireReasonMr ? errors.fireReasonMr.message : null
            }
          /> 
        </Grid>*/}
      </Grid>
      <br />
      <Grid
        container
        // spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid
          item
          xs={4}
          sx={{ marginTop: "2%" }}
          className={styles.feildres}
        ></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>

      {console.log("9999999999", props?.props?.pageMode)}
      {props?.props?.pageMode == "Edit" ? (
        <></>
      ) : (
        <>
          <Box className={styles.tableHead}>
            <Box className={styles.feildHead}>
              {<FormattedLabel id="documentsUploadEmr" />}
            </Box>
          </Box>
          <>
            <Paper
              style={{
                marginLeft: "15vh",
                marginRight: "17vh",
                marginTop: "5vh",
                marginBottom: "5vh",
              }}
              elevation={0}
            >
              <FileTable
                appName="FBS" //Module Name
                serviceName={"EmergencyServices"} //Transaction Name
                fileName={attachedFile} //State to attach file
                filePath={setAttachedFile} // File state upadtion function
                newFilesFn={setAdditionalFiles} // File data function
                columns={columns} //columns for the table
                rows={attachments} //state to be displayed in table
                uploading={setUploading}
                buttonInputStateNew={buttonInputStateNew}
              />
            </Paper>
          </>
        </>
      )}

      {/* <Grid container columns={{ xs: 6, md: 8 }} className={styles.feildres}>
        <Grid item xs={4} className={styles.feildres}>
          <div>
            <br />
            <Typography
              sx={{
                color: "red",
                fontSize: "15px",
                fontFamily: "inherit",
              }}
            >
              Photo (upload.jpeg, .png, .doc, .pdf file)
            </Typography>
            <br />
            <UploadButton
              Change={(e) => {
                handleFile1(e, "documentsUpload");
              }}
              {...register("documentsUpload")}
            />
          </div>
        
        </Grid>
        <Grid item xs={6} md={4}></Grid>
      </Grid> */}
      {/* <FormControl component="fieldset">
  <FormLabel component="legend">Gender</FormLabel>
  <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
    <FormControlLabel value="female" control={<Radio />} label="Female" />
    <FormControlLabel value="male" control={<Radio />} label="Male" />
    <FormControlLabel value="other" control={<Radio />} label="Other" />
    <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
  </RadioGroup>
</FormControl> */}
    </>
  );
};

export default AddressOfFire;
