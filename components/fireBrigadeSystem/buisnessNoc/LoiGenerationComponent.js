import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Paper,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Stack } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToWords } from "to-words";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme.js";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import ApplicantBasicDetails from "./ApplicantBasicDetails";
import { Watch } from "@mui/icons-material";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

// For table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: "#D7DBDD",
    // color: "blue",
    backgroundColor: "#337AFF",
    color: "white",
    fontSize: "15px",
    // color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&: td, &: th": {
    border: "1px solid black",
  },
}));

function createData(name, calories, fat, carbs, protein, upload) {
  return { name, calories, fat, carbs, protein, upload };
}
// ...end

// Loi Generation
const LoiGenerationComponent = (props) => {
  // const {
  //   control,
  //   register,
  //   getValues,
  //   setValue,
  //   reset,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  // useFormContext();
  const router = useRouter();
  const toWords = new ToWords();
  const userToken = useGetToken();

  const [daoNameState, setDaoNameState] = useState();

  const getDaoName = () => {
    axios
      .get(
        `${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterDataById?id=${props?.props?.typeOfBusiness}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        // let daoName = r?.data?.remark;
        console.log("123", r?.data?.remark);
        setValue("daoName", r?.data?.remark);
        setDaoNameState(r?.data?.remark);
      });
  };

  useEffect(() => {
    getDaoName();
    console.log("propsprops", props?.props);
  }, []);

  let type;
  let idOfBusiness;
  type = props?.props?.typeOfBusiness;
  // type = getValues("typeOfBusiness");
  console.log("type", type);
  // departmentCol: departments.find((f) => f.id == res.department)?.department,
  idOfBusiness = bussinessTypes?.find((b) => b.id == type)?.typeOfBusiness;

  let formId = props?.props?.id;
  // let formId = getValues("id");
  console.log("formId", formId);

  let idddd = props?.props?.applicantNameMr;
  // let idddd = getValues("applicantNameMr");
  console.log("Idddd", idddd);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "serviceCharges", // unique name for your Field Array
    }
  );
  const language = useSelector((state) => state?.labels.language);

  // lOI GENERATION PREVIEW

  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] =
    useState(false);
  const loiGenerationReceiptDailogOpen = () =>
    setLoiGenerationReceiptDailog(true);
  const loiGenerationReceiptDailogClose = () =>
    setLoiGenerationReceiptDailog(false);

  // const loi Recipit - Preview
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen();
  };

  const [serviceCharge, setServiceCharges] = useState([]);
  useEffect(() => {
    console.log("title", getValues("title"));
    console.log("serviceName", getValues("serviceName"));
    console.log("firstName", getValues("firstName"));
  }, []);

  useEffect(() => {
    getBusinessType();
    getCharge();
    getTypesOfComapany();
  }, []);

  const [typeOfCompanyS, setTypeOfCompanyS] = useState();

  const getTypesOfComapany = () => {
    axios
      .get(`${urls.FbsURL}/master/typeOfCompany/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("sub6666", res?.data?.typeOfCompany);
        setTypeOfCompanyS(res?.data?.typeOfCompany);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [bussinessTypes, setBussinessTypes] = useState();

  const getBusinessType = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBussinessTypes(res.data);
        console.log("res.data", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // title
  const [titles, setTitles] = useState([]);

  const [bussinessCharge, setBussinessCharge] = useState();

  const [numberOfRoomState, setNumberOfRoomState] = useState();

  const getCharge = () => {
    axios
      .get(
        `${urls.FbsURL}/master/businessRateCharge/getByNocIdAndTypeOfBusinessId?nocId=${formId}&typeOfBusinessId=${type}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log(
          "res?.data?.businessRateCharge",
          res?.data?.businessRateCharge
        );
        let allDataToMap = res?.data?.bussinesss;
        const filterData = res?.data?.businessRateCharge?.map((row) => ({
          ...row,
          // calculateOn: row.calculateOn ? row.calculateOn + " = " + router.query.numberOfTrip : "",
          // amount: row.rate * router.query.numberOfTrip,
          // id: null,
          // activeFlag: null,
          // thirdCharge: null,
          capacity: row.capacity ? row.capacity : "-",

          // capacity:
          //   daoNameState == "lodggingDTLDao"
          //     ? `Number Of Rooms-${numberOfRoomState}`
          //     : row.capacity,
          rate: row.rate,
          // amount: row.capacity ? row.capacity + " = " + row.rate : "",
          amount: row.capacity * row.rate,
          parishishtha: row.parishishtha ? row.parishishtha : "-",
          typeOfBusinessId: bussinessTypes?.find(
            (b) => b.id == row.typeOfBusinessId
          )?.typeOfBusiness,
        }));

        setValue("allData", allDataToMap);

        // const dataToMap = watch(`allData.${daoNameState}`);
        // console.log("daoName123....", watch(`allData.${daoNameState}`));
        console.log(
          "daoName123....",
          watch(`allData.${daoNameState}`)?.noOfRooms
        );
        setValue("noOfRooms", watch(`allData.${daoNameState}`)?.noOfRooms);

        setNumberOfRoomState(watch(`allData.${daoNameState}`)?.noOfRooms);
        // console.log("noOfRooms", watch("noOfRooms"));

        setBussinessCharge(filterData);
        console.log("filterData", filterData);
      });
  };

  console.log("noOfRooms", numberOfRoomState);

  const [total, setTotal] = useState();

  const [totalInWords, setTotalInWords] = useState();

  useEffect(() => {
    console.log("props", props?.props);
    reset(props?.props);

    // console.log("9090", getValues("noOfRooms"));
    let total1 = 0;
    bussinessCharge?.forEach((data, index) => {
      total1 += data.rate;
    });
    setTotal(total1);
  }, [bussinessCharge]);

  // setTotalInWords(toWords.convert(total));

  // Get Table - Data
  // const getCharge = () => {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/master/businessRateCharge/getByNocIdAndTypeOfBusinessId?nocId=${formId}&typeOfBusinessId=${type}`
  //     )
  //     .then((res) => {
  //       setBussinessCharge(res?.data?.businessRateCharge);
  //       console.log("12345", res.data.businessRateCharge);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const [shrinkState, setShrinkState] = useState(false);

  // getTitles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setTitles(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
            titleMr: row.titleMr,
          }))
        );
      });
  };

  const token = useSelector((state) => state.user.user.token);

  const [serviceNames, setServiceNames] = useState([]);
  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            }))
          );
        } else {
          message.error("Filed To Load !! Please Try Again !");
        }
      })
      .catch((err) => {
        console.log(err);
        // toast.success("Error !", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      });
  };

  const [inputState, setInputState] = useState(false);

  useEffect(() => {
    setInputState(getValues("inputState"));
    setValue("serviceCharges", serviceCharge);
    let total = 0;
    serviceCharge.forEach((data, index) => {
      total += data.amount;
    });
    // setValue("loi.total", total);
    // setValue("loi.totalInWords", toWords.convert(total));
  }, [serviceCharge]);

  const [companyType, setCompanyType] = useState();

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    let key = getValues("typeOfCompany");
    console.log("keyyy", key);
    setCompanyType(key);
    // console.log("companyType", getValues("typeOfCompany"));
    // setCompanyType(getValues("companyDTLDao.typeOfCompany"));
  }, []);

  useEffect(() => {
    console.log("typeInmm", type);
    if (type) {
      axios
        .get(`${urls.FbsURL}/transaction/trnBussinessNOC/getById?id=${type}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          // setValue("typeOfVardiId", res?.data?.typeOfVardiId);
          // reset(res.data.vardiSlip);
          // setValue("id", res.data.id);
          console.log("res?.dataaaaaaaa", res?.data);

          // setCompanyType(res?.data);

          Object.keys(res?.data)
            .filter((d, i) => d)
            .forEach((k) => {
              if (k == "companyDTLDao") {
                console.log(
                  "pratikshak",
                  res?.data?.companyDTLDao?.typesOfCompany
                );
                setFormEditId(k);
              }
              return console.log("33333", k);
            });
        });
    }
  }, []);

  let appId;
  useEffect(() => {
    appId = getValues("id");

    console.log("bhava yetay ka id ");
  }, [getValues("id")]);

  appId = getValues("id");

  // Handle Next
  const handleNext = (data) => {
    setIsDisabled(true);

    const loi = {
      // ...data.loi,
      nocId: appId,
      // id: appId,
      allTotal: total,
      applicableCharagess: bussinessCharge,
      // totalInWordss: totalInWords,
      // amount:
      // rate:
      // typeOfBusinessId:
    };

    let finalBodyForApi = {
      // ...data,
      id: appId,
      loi,
      role: "LOI_GENERATION",
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/trnBussinessNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            role: "LOI_GENERATION",
            id: data.id,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push("/FireBrigadeSystem/transactions/businessNoc/scrutiny");
        } else if (res.status == 201) {
          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved !", "Record Saved successfully !", "success");
          router.push("/FireBrigadeSystem/transactions/businessNoc/scrutiny");
        }
        setIsDisabled(false);
      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <form onSubmit={handleSubmit(handleNext)}>
          <ApplicantBasicDetails props={props?.props} />
          <br />
          <Box className={styles.tableHead}>
            <Box className={styles.feildHead}>
              {<FormattedLabel id="applicantDetails" />}
            </Box>
          </Box>
          {/* <h3 style={{ textAlign: "center", backgroundColor: "#E5E7E9" }}>
            Applicant Details
          </h3> */}

          <Grid
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            className={styles.feildres}
          >
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "80%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantName" />}
                variant="standard"
                {...register("applicantName")}
                error={!!errors.applicantName}
                helperText={
                  errors?.applicantName ? errors.applicantName.message : null
                }
              />
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "80%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantMiddleName" />}
                variant="standard"
                {...register("applicantMiddleName")}
                error={!!errors.applicantMiddleName}
                helperText={
                  errors?.applicantMiddleName
                    ? errors.applicantMiddleName.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "80%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantLastName" />}
                variant="standard"
                {...register("applicantLastName")}
                error={!!errors.applicantLastName}
                helperText={
                  errors?.applicantLastName
                    ? errors.applicantLastName.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "80%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantNameMr" />}
                variant="standard"
                {...register("applicantNameMr")}
                error={!!errors.applicantNameMr}
                helperText={
                  errors?.applicantNameMr
                    ? errors.applicantNameMr.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "80%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantMiddleNameMr" />}
                variant="standard"
                {...register("applicantMiddleNameMr")}
                error={!!errors.applicantMiddleNameMr}
                helperText={
                  errors?.applicantMiddleNameMr
                    ? errors.applicantMiddleNameMr.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "80%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantLastNameMr" />}
                variant="standard"
                {...register("applicantLastNameMr")}
                error={!!errors.applicantLastNameMr}
                helperText={
                  errors?.applicantLastNameMr
                    ? errors.applicantLastNameMr.message
                    : null
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            className={styles.feildres}
          >
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "80%" }}
                id="standard-basic"
                label={<FormattedLabel id="mobileNo" />}
                variant="standard"
                {...register("mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
              />
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "80%" }}
                id="standard-basic"
                label={<FormattedLabel id="emailId" />}
                variant="standard"
                {...register("emailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>
            <Grid item xs={4} className={styles.feildres}></Grid>
          </Grid>
          <Grid
            container
            columns={{ xs: 12, sm: 12, md: 12 }}
            className={styles.feildres}
          >
            <Grid item xs={12} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "94%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantAddresss" />}
                variant="standard"
                {...register("applicantAddress")}
                error={!!errors.applicantAddress}
                helperText={
                  errors?.applicantAddress
                    ? errors.applicantAddress.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={12} className={styles.feildres}>
              <TextField
                InputLabelProps={{
                  shrink: { shrinkState },
                }}
                sx={{ width: "94%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantAddressMr" />}
                variant="standard"
                {...register("applicantAddressMr")}
                error={!!errors.applicantAddressMr}
                helperText={
                  errors?.applicantAddressMr
                    ? errors.applicantAddressMr.message
                    : null
                }
              />
            </Grid>
          </Grid>
          <br />
          <br />

          <div className={styles.small}>
            <div className={styles.row}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Sr.No</StyledTableCell>
                      <StyledTableCell align="center">
                        Charge Apply
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        Charge Name (In Marathi)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Rate (Rs)
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        Calculated On
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        Amount (Rs)
                      </StyledTableCell>
                      {/* <StyledTableCell align="right">Protein&nbsp;</StyledTableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bussinessCharge?.map((d) => {
                      return console.log("ffff");
                    })}
                    {/* <TableRow className={classes.finalRow}>
                              <TableCell align="left" colSpan={6}>
                                <b>Mandatory Documents</b>
                              </TableCell>
                            </TableRow> */}
                    {bussinessCharge &&
                      bussinessCharge.map((row, index) => {
                        console.log("111id", row.rate);

                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <b style={{ color: "blue" }}>
                                {/* {
                                    chargeName?.find(
                                      (obj) => obj.id == row.chargeType
                                    )?.chargeType
                                  } */}
                              </b>
                              <br />

                              <b>{row.typeOfBusinessEn}</b>

                              {/* {router.query.chargesApply} */}
                              {/*

                                        {row.subCharge ===
                                        router.query.chargesApply
                                          ? row.subCharge
                                          : "-"} */}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.typeOfBusinessMr}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.rate}
                            </StyledTableCell>

                            <StyledTableCell align="center">
                              {/* {row.capacity} */}
                              {row.capacity}
                            </StyledTableCell>

                            <StyledTableCell align="center">
                              {row.rate}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}

                    <TableRow style={{ backgroundColor: "skyblue" }}>
                      <TableCell
                        align="right"
                        colSpan={5}
                        style={{ fontStyle: "under" }}
                      >
                        <b>Total :</b>
                      </TableCell>
                      <TableCell align="center" colSpan={5}>
                        {/* <b> {(row.rate += pre)}</b> */}
                        {/* <b>{row.rate}</b> */}

                        {/* {chargeRate &&
                                  chargeRate.map((values) => {
                                    console.log("values", values);
                                    var chargeTotal = 0;
                                    for (let i = 0; i < values.length; i++) {
                                      console.log("i", i);
                                      chargeTotal += values[i].rate;
                                      console.log("total", chargeTotal);
                                      return <p>{chargeTotal}</p>;
                                    }
                                  })} */}
                        <b>{total} Rs</b>
                        <b>{totalInWords}</b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <br />
            {/* <Button
                sx={{ marginRight: 8 }}
                variant="contained"
                color="primary"
                endIcon={<ClearIcon />}
                onClick={() => cancellButton()}
              >
                Clear
              </Button> */}
            {/* </form>
        </FormProvider> */}
          </div>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                marginTop: "30px",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <Stack spacing={5} direction="row">
                <Button
                  disabled={isDisabled}
                  size="small"
                  type="submit"
                  sx={{ width: "230 px" }}
                  variant="contained"
                >
                  {/* <FormattedLabel id='generateLoi' /> */}
                  Generate LOI
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>

        {/** Form Preview Dailog */}

        {/***
        <Dialog
          
          fullWidth
          maxWidth={"lg"}
          open={loiGenerationReceiptDailog}
          onClose={() => loiGenerationReceiptDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                Preview
              </Grid>
              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  aria-label='delete'
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                    onClick={() => {
                      loiGenerationReceiptDailogClose();
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <LoiGenerationRecipt />
          </DialogContent>

          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                variant='contained'
                onClick={loiGenerationReceiptDailogClose}
              >
                Exit
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>
         */}
      </ThemeProvider>
    </>
  );
};

export default LoiGenerationComponent;
