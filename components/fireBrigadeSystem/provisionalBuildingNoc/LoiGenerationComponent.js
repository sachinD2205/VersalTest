// New
import {
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
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToWords } from "to-words";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme.js";
import urls from "../../../URLS/urls";
import styles from "../../../components/fireBrigadeSystem/provisionalBuildingNoc/loi.module.css";
// Loi Generation
const LoiGenerationComponent = (props) => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const toWords = new ToWords();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "serviceCharges", // unique name for your Field Array
    }
  );
  const language = useSelector((state) => state?.labels.language);
  const [applicableCharages, setApplicableCharages] = useState([]);
  const [sum, setSum] = useState(0);
  const [gross, setGross] = useState(0);
  const [nocAmount, setNocAmount] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0);
  const [editableNocAmount, setEditableNocAmount] = useState(0);
  const [editableNetNocAmount, setEditableNetNocAmount] = useState(0);
  const [editableGrossNocAmount, setEditableGrossNocAmount] = useState(0);
  // const [nocCollectionType, setNocCollectionType] = useState();
  const [nocTypeEditable, setNocTypeEditable] = useState();

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
    console.log("All Values", getValues());
    console.log("1212121", getValues("applicationNo"));
    console.log("title", getValues("title"));
    console.log("serviceName", getValues("serviceName"));
    console.log("firstName", getValues("firstName"));
  }, []);

  useEffect(() => {
    // loi generation API Call
    console.log("applicationID", getValues("id"));
    const finalBodyForApi = {
      trnId: getValues("id"),
    };
    axios
      .post(
        `${urls.FbsURL}/master/rateCharge/getRateForBuildingNoc`,
        finalBodyForApi
      )
      .then((res) => {
        console.log("resmmmmmmm", res);
        if (res?.data !== "No Charges Found") {
          setApplicableCharages(
            res?.data &&
              res?.data?.map((charge, i) => {
                return {
                  ...charge,
                  srNo: i + 1,
                };
              })
          );

          let total = 0;
          let totalGross = 0;
          let totalNocAmount = 0;
          let totalEditableNetNocAmount = 0;
          let totalEditableGrossNocAmount = 0;
          let totalOfNetArea = 0;
          let totalOfGrossArea = 0;
          res?.data?.map((charge) => {
            console.log("charge", charge);
            totalOfNetArea = totalOfNetArea + charge.finalNetNocAmount;
            setEditableNetNocAmount(totalOfNetArea);

            totalOfGrossArea = totalOfGrossArea + charge.finalGrossNocAmount;
            setEditableGrossNocAmount(totalOfGrossArea);

            total = total + charge.netBuiltUpAreaAmount;
            totalGross = totalGross + charge.grossBuiltUpAreaAmount;
            totalNocAmount = totalNocAmount + charge.minimumNocAmount;
            // totalEditableNetNocAmount = totalEditableNetNocAmount + charge.finalNetNocAmount;
            totalEditableGrossNocAmount =
              totalEditableGrossNocAmount + charge.finalGrossNocAmount;
          });

          setSum(total);
          setGross(totalGross);
          setNocAmount(totalNocAmount);
          setNetTotal(totalEditableNetNocAmount);
          setGrossTotal(totalEditableGrossNocAmount);
          console.log("11", res);
        }
      });
  }, []);

  // useEffect(() => {
  //   if (applicableCharages) {
  //     // setEditableNocAmount(totalEditableNocAmount);
  //   }
  // }, [applicableCharages]);

  // useEffect(() => {
  //     axios.get(`${urls.SPURL}/groundBooking/getById?id=${router?.query?.applicationId}`).then((res) => {
  //       setApplicableCharages(res?.data?.applicableCharages);
  //       console.log("getbyId", _res);
  //     });
  // }, []);

  // title
  const [titles, setTitles] = useState([]);
  const [data, setData] = useState([]);

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        }))
      );
    });
  };

  const [serviceNames, setServiceNames] = useState([]);
  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
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
        toast.success("Error !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // const [hawkerTypes, setHawkerTypes] = useState([]);

  // const getHawkerType = () => {
  //   axios.get(`${urls.HMSURL}/hawkerType/getAll`).then((r) => {
  //     setHawkerTypes(
  //       r.data.hawkerType.map((row) => ({
  //         id: row.id,
  //         hawkerType: row.hawkerType,
  //       }))
  //     );
  //   });
  // };

  const [durationOfLicenseValiditys, setDurationOfLicenseValiditys] =
    useState();

  // const getDurationOfLicenseValiditys = () => {
  //   axios.get(`${urls.HMSURL}/licenseValidity/getAll`).then((res) => {
  //     if (res.status == 200) {
  //       setDurationOfLicenseValiditys(
  //         res.data.licenseValidity.map((r) => ({
  //           id: r.id,
  //           licenseValidity: r.licenseValidity,
  //           hawkerType: r.hawkerType,
  //         }))
  //       );
  //     }
  //   });
  // };

  const getServiceCharges = () => {
    console.log("serviceId", getValues("servicName"));

    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=76`)
      .then((r) => {
        setServiceCharges(
          r.data?.serviceCharge
            .filter((d) => d.id == 27)
            .map((row) => ({
              id: row.id,
              serviceChargeType: row.serviceChargeType,
              serviceChargeTypeName: row.serviceChargeTypeName,
              serviceChargeType: row.serviceChargeType,
              charge: row.charge,
              chargeName: row.chargeName,
              amount: row.amount,
            }))
        );
      });
  };

  const [inputState, setInputState] = useState(false);

  useEffect(() => {
    getTitles;
    getserviceNames();
    getTitles;
    // getHawkerType();
    // getDurationOfLicenseValiditys();
    getServiceCharges();
  }, []);

  useEffect(() => {
    setInputState(getValues("inputState"));
    setValue("serviceCharges", serviceCharge);
    let total = 0;
    serviceCharge.forEach((data, index) => {
      total += data.amount;
    });
    setValue("loi.total", total);
    setValue("loi.totalInWords", toWords.convert(total));
  }, [serviceCharge]);

  const getLoiGenerationData = () => {
    const appId = getValues("id");
    console.log("22", getValues());
    axios
      .get(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`
      )
      .then((res) => {
        if (res.data == 200) {
          console.log("resp.data", res.data);
          setData(res.data);
          console.log("1234", res.data.applicationNumber);
          reset(res.data);
        }
      });
  };

  useEffect(() => {
    console.log("9999", getValues("id"));
    getLoiGenerationData();
  }, [getValues("id")]);

  const [disabledButtonApproved, setDisabledButtonApproved] = useState(false);

  // Handle Next
  const handleNext = (data) => {
    setDisabledButtonApproved(true);
    console.log("data7878", data);
    // loi;
    const loi = {
      buildingNocApplicableCharagesDao: [...applicableCharages],
      totalNetbuiltUpArea: Number(sum),
      totalGrossbuiltUpArea: Number(gross),
      totalNocAmount: Number(nocAmount),
      editableNocAmount: Number(editableNocAmount),
      netTotal: Number(netTotal),
      grossTotal: Number(grossTotal),
      allTotal: Number(nocAmount),
      // buildingNocApplicableCharagesDao:watch("applicableCharages"),
      // buildingNocApplicableCharagesDao: [
      // ],
      // ...data.serviceCharges,
      // loiServiceCharges: getValues("serviceCharges"),
    };

    let finalBodyForApi = {
      ...data.serviceCharge,
      id: getValues("id"),
      loi,
      role: "LOI_GENERATION",
    };
    console.log("LOIfinalBodyForApi", finalBodyForApi);
    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            role: "LOI_GENERATION",
            id: data.id,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          setDisabledButtonApproved(false);
          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(
            "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
          );
        } else if (res.status == 201) {
          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved !", "Record Saved successfully !", "success");
          router.push(
            "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
          );
        }
      });
  };

  // const handleChange = (value, index) => {
  //   console.log(value, "::", index);
  //   let final = applicableCharages?.map((g, i) => {
  //     return {
  //       ...g,
  //       totalEditableNocAmount: i == index ? (isNaN(value) ? 0 : parseFloat(value)) : (g?.totalEditableNocAmount ? g.totalEditableNocAmount : 0),
  //     }
  //   });
  //   console.log("final", final)
  //   setApplicableCharages(final);
  //   let totalOfEditableAmount = 0;
  //   final.map((t) => {
  //     totalOfEditableAmount += isNaN(t.totalEditableNocAmount) ? 0 : parseFloat(t.totalEditableNocAmount)
  //   })
  //   console.log("totalOfEditableAmount", totalOfEditableAmount);
  //   setEditableNocAmount(totalOfEditableAmount);

  // }

  const handleChange = (value, index) => {
    console.log(value, "::", index);
    let final = applicableCharages?.map((g, i) => {
      return {
        ...g,
        finalNetNocAmount:
          i == index
            ? isNaN(value)
              ? 0
              : parseFloat(value)
            : g?.finalNetNocAmount
            ? g.finalNetNocAmount
            : 0,
      };
    });
    console.log("final", final);
    setApplicableCharages(final);
    let totalOfEditableAmount = 0;
    final.map((t) => {
      totalOfEditableAmount += isNaN(t.finalNetNocAmount)
        ? 0
        : parseFloat(t.finalNetNocAmount);
    });
    console.log("totalOfEditableAmount", totalOfEditableAmount);
    setEditableNetNocAmount(totalOfEditableAmount);
  };

  const handleChangeGross = (value, index) => {
    console.log(value, "::", index);
    let final = applicableCharages?.map((g, i) => {
      return {
        ...g,
        finalGrossNocAmount:
          i == index
            ? isNaN(value)
              ? 0
              : parseFloat(value)
            : g?.finalGrossNocAmount
            ? g.finalGrossNocAmount
            : 0,
      };
    });
    console.log("final", final);
    setApplicableCharages(final);
    let totalOfEditableAmount = 0;
    final.map((t) => {
      totalOfEditableAmount += isNaN(t.finalGrossNocAmount)
        ? 0
        : parseFloat(t.finalGrossNocAmount);
    });
    console.log("totalOfEditableAmount", totalOfEditableAmount);
    setEditableGrossNocAmount(totalOfEditableAmount);
  };

  // const handleChangeG= (value, index) => {
  //   console.log("76576", value);
  //   let final = applicableCharages?.map((g, i) => {
  //     return {
  //       ...g,
  //       totalEditableNetNocAmount:
  //         i == index
  //           ? isNaN(value)
  //             ? 0
  //             : parseFloat(value)
  //           : g?.totalEditableNetNocAmount
  //           ? g.totalEditableNetNocAmount
  //           : 0,
  //     };
  //   });
  //   setApplicableCharages(final);
  //   let totalOfEditableNetAmount = 0;
  //   final.map((t) => {
  //     totalOfEditableNetAmount += isNaN(t.totalEditableNetNocAmount)
  //       ? 0
  //       : parseFloat(t.totalEditableNetNocAmount);
  //   });
  //   setEditableNetNocAmount(totalOfEditableNetAmount);
  //   console.log("6876", totalOfEditableNetAmount);
  // };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <form onSubmit={handleSubmit(handleNext)}>
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "40px",
              borderRadius: 100,
            }}
          >
            <strong>
              {/* <FormattedLabel id="applicantDetails" /> */}
              Application Details
            </strong>
          </div>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id='demo-simple-select-standard-label'>
                  {/* {<FormattedLabel id="serviceName" />} */}
                  Service Name
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ minWidth: "230px", width: "250px" }}
                      // // dissabled={inputState}
                      autoFocus
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label='Service Name *'
                      id='demo-simple-select-standard'
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      {serviceNames &&
                        serviceNames.map((serviceName, index) => (
                          <MenuItem key={index} value={serviceName.id}>
                            {language == "en"
                              ? serviceName?.serviceName
                              : serviceName?.serviceNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name='serviceName'
                  control={control}
                  defaultValue=''
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                // width="900px"
                sx={{ width: "250px" }}
                disabled={inputState}
                label='Application No.'
                {...register("applicationNumber")}
                error={!!errors.applicationNumber}
                helperText={
                  errors?.applicationNumber
                    ? errors.applicationNumber.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl
                sx={{ marginTop: 0 }}
                error={!!errors.applicationDate}
              >
                <Controller
                  name='applicationDate'
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={inputState}
                        inputFormat='DD/MM/YYYY'
                        label={
                          <span style={{ fontSize: 16, marginTop: 2 }}>
                            Application Date
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.applicationDate
                    ? errors.applicationDate.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id='standard-basic'
                // disabled={inputState}
                // label={<FormattedLabel id="firstName" />}
                label='First Name'
                {...register("applicantDTLDao.applicantName")}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id='standard-basic'
                // disabled={inputState}
                // label={<FormattedLabel id="middleName" />}
                label='Middle Name'
                {...register("applicantDTLDao.applicantMiddleName")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id='standard-basic'
                // disabled={inputState}
                // label={<FormattedLabel id="lastName" />}
                label='Last Name'
                {...register("applicantDTLDao.applicantLastName")}
                error={!!errors.lastName}
                helperText={errors?.lastName ? errors.lastName.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id='standard-basic'
                // disabled={inputState}
                // label={<FormattedLabel id="emailAddress" />}
                label='emailAddress'
                {...register("applicantDTLDao.applicantEmailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                id='standard-basic'
                // disabled={inputState}
                // label={<FormattedLabel id="mobile" />}
                label='Mobile'
                {...register("applicantDTLDao.applicantMobileNo")}
                error={!!errors.mobile}
                helperText={errors?.mobile ? errors.mobile.message : null}
              />
            </Grid>

            {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  NOC based on
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={inputState}
                      sx={{ minWidth: "230px", width: "250px" }}
                      value={field.value}
                      onChange={
                        (event) => {
                          field.onChange(event.target.value),
                            setNocCollectionType(event.target.value)
                            console.log("654654465",nocCollectionType);
                        }
                      } 
                      label="Service Name *"
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >

                      <MenuItem value="netBuiltUpArea">Net Built Up Area </MenuItem>
                      <MenuItem value="grossBuiltUpArea"> Gross Built Up Area</MenuItem>
                    </Select>
                  )}
                  name="nocBasedOn"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid> */}

            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
            >
              <Grid item xs={4} className={styles.feildres}>
                <FormControl sx={{ width: "80%" }}>
                  <InputLabel variant='standard' htmlFor='uncontrolled-native'>
                    NOC Collection Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        // disabled={viewButtonInputState}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          setNocTypeEditable(value.target.value);
                          localStorage.setItem("nocType", value.target.value);

                          console.log("121", nocTypeEditable);
                        }}
                        name='nocCoolectionType'
                        fullWidth
                        size='small'
                        variant='standard'
                      >
                        <MenuItem value='net'>Net Built Up Area</MenuItem>
                        <MenuItem value='gross'>Gross Built Up Area</MenuItem>
                      </Select>
                    )}
                    name='previouslyAnyFireNocTaken'
                    control={control}
                    defaultValue=''
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          ></Grid>

          {/* ///////////////////////////////// */}
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "40px",
              borderRadius: 100,
            }}
          >
            <strong>
              {/* <FormattedLabel id="applicantDetails" /> */}
              LOI Details
            </strong>
          </div>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <table className={styles.openingTable}>
              <thead>
                <tr>
                  <th>Sr no.</th>
                  <th>Building Name</th>
                  <th>Occupancy Type</th>
                  <th>Net Built Up Area</th>
                  <th>Gross Built Up Area</th>
                  <th>Prishishatha</th>
                  <th>Building Height (from)</th>
                  <th>Building height (to)</th>
                  <th>Rate (sq.mr)</th>
                  <th>Net Built Up Area Amount</th>
                  <th>Gross Built Up Area Amount</th>
                  <th>Minimum Rate for NOC</th>
                  {/* <th> Rate for NOC</th> */}
                  {nocTypeEditable === "net" && (
                    <th> Final Net Built Up Area</th>
                  )}

                  {nocTypeEditable === "gross" && (
                    <th> Final Gross Built Up Area</th>
                  )}
                  {/* {nocCollectionType === "grossBuiltUpArea" && (
                  <th> Final Gross Built Up Area</th>
                  )} */}

                  {/* <th disabled={nocTypeEditable==="gross"}> Final Net Built Up Area</th>
                  <th disabled={nocTypeEditable==="net"}> Final Gross Built Up Area</th> */}
                </tr>
              </thead>
              <tbody>
                {applicableCharages?.map((r, i) => (
                  <>
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{r.buildingName}</td>
                      <td>{r.occupancyType}</td>
                      <td>{r.netBuiltUpArea}</td>
                      <td>{r.grossBuiltUpArea}</td>
                      <td>{r.parishishtha}</td>
                      <td>{r.buildingHeightFrom}</td>
                      <td>{r.buildingHeightTo}</td>
                      <td>{r.minimumRate}</td>
                      <td>{r.netBuiltUpAreaAmount}</td>
                      <td>{r.grossBuiltUpAreaAmount}</td>
                      <td>{r.minimumNocAmount}</td>
                      {/* <td>
                        <input
                          className={styles.editableTextField}
                          //  width="50"
                          type="number"
                          min="0"
                          value={r.totalEditableNocAmount}
                          onChange={(event) =>
                            handleChange(event.target.value, i)
                          }
                        />
                      </td> */}

                      {nocTypeEditable === "gross" && (
                        <td>
                          <input
                            className={styles.editableTextField}
                            //  width="50"
                            type='number'
                            min='0'
                            // value={r.finalNetNocAmount}
                            value={r.finalGrossNocAmount}
                            onChange={(event) => {
                              console.log("event", event);
                              handleChangeGross(event.target.value, i);
                            }}
                          />
                        </td>
                      )}

                      {nocTypeEditable === "net" && (
                        <td>
                          <input
                            // style={{ color: "red" }}
                            className={styles.editableTextField}
                            //  width="50"
                            type='number'
                            min='0'
                            value={r.finalNetNocAmount}
                            // value={r.finalGrossNocAmount}
                            onChange={(event) =>
                              handleChange(event.target.value, i)
                            }
                          />
                        </td>
                      )}
                    </tr>
                  </>
                ))}

                <tr>
                  <td colSpan={9}>
                    <b>Total</b>
                  </td>
                  <td>
                    <b>{sum}</b>
                  </td>
                  <td>
                    <b>{gross}</b>
                  </td>
                  <td>
                    <b>{nocAmount}</b>
                  </td>
                  {/* <td>
                    <b>{editableNocAmount}</b>
                  </td> */}

                  {nocTypeEditable === "net" && (
                    <td>
                      <b>{editableNetNocAmount}</b>
                    </td>
                  )}

                  {nocTypeEditable === "gross" && (
                    <td>
                      {/* <b>{grossTotal}</b> */}
                      {/* <b>{editableNetNocAmount}</b> */}
                      <b>{editableGrossNocAmount}</b>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </Grid>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          ></Grid>

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
              <Stack spacing={5} direction='row'>
                <Button
                  disabled={disabledButtonApproved}
                  size='small'
                  type='submit'
                  sx={{ width: "230 px" }}
                  variant='contained'
                >
                  {/* <FormattedLabel id="generateLoi" /> */}
                  Generate LOI
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </ThemeProvider>
    </>
  );
};

export default LoiGenerationComponent;
