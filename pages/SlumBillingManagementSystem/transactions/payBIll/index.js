import React, { useEffect, useState } from "react";
import styles from "../sbms.module.css";
import {
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import router from "next/router";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  // @ts-ignore
  const token = useSelector((state) => state.user.user.token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
  const [huts, setHuts] = useState([]);
  const [slums, setSlums] = useState([
    { id: 1, slumNameEn: "", slumNameMr: "" },
  ]);
  const [table, setTable] = useState([]);
  const [selectedHuts, setSelectedHuts] = useState([]);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [slumDetails, setSlumDetails] = useState([]);
  const [checkedOne, setCheckedOne] = React.useState(false);
  const [paymentGatUrl, setPayGatUrl] = useState(null);
  const [encRequest, setEncRequest] = useState(null);
  const [accessCode, setAccesssCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: "",
      financialYearMr: "",
    },
  ]);

  const {
    register,
    reset,
    watch,
    // handleSubmit,
    control,
    setValue,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(petSchema),
  });
  const headers ={ Authorization: `Bearer ${user?.token}` };

  // const handleChangeOne = () => {
  //   setCheckedOne(!checkedOne);
  // };

  const catchMethod = (err) => {
    console.log("errr ", err);
    if (err?.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language == "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err?.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language == "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language == "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };
  // useEffect(() => {
  //   if (checkedOne == true) {
  //     getPaymentDetails();
  //   } else {
  //     setPayGatUrl(null);
  //     setEncRequest(null);
  //     setAccesssCode(null);
  //   }
  // }, [checkedOne]);

  const getPaymentDetails = () => {
    let encodeUrl = "SlumBillingManagementSystem/transactions/pgSuccess";
    let body = {
      currency: "INR",
      language: "EN",
      moduleId: "SB",
      amount: table[0]?.billAmount,
      divertPageLink: encodeUrl,
      loiId: 0,
      loiNo: 0,
      domain: window.location.hostname,
      ccAvenueKitLtp: "L",
      serviceId: 141,
      applicationNo: table[0]?.billNo, //bill no
      applicationId: table[0]?.id, //bill id
    };
    setIsLoading(true);
    axios
      .post(
        `${urls.CFCURL}/transaction/paymentCollection/initiatePaymentV1`,
        body, {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setPayGatUrl(r.data.url);
        setEncRequest(r.data.encRequest);
        setAccesssCode(r.data.access_code);
        getToPaymentGateway(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        catchMethod(err);
      });
  };
  const getToPaymentGateway = (payDetail) => {
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };
  useEffect(() => {
    //Get Huts
    getZone();
    getSlumDetails();
  }, []);

  const getZone = () => {
    axios
      .get(`${urls.SLUMURL}/open/getAllZones`, {
        headers: headers,
      })
      .then((res) => {
        setZoneDetails(
          res.data.zone.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            zoneName: r.zoneName,
            zoneNameMr: r.zoneNameMr,
            zone: r.zone,
            ward: r.ward,
            area: r.area,
            zooAddress: r.zooAddress,
            zooAddressAreaInAcres: r.zooAddressAreaInAcres,
            zooApproved: r.zooApproved,
            zooFamousFor: r.zooFamousFor,
          }))
        );
      });
  };

  const getSlumDetails = () => {
    axios
      .get(`${urls.SLUMURL}/open/getAllSlums`, {
        headers: headers,
      })
      .then((res) => {
        setSlumDetails(
          res.data.mstSlumList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            slumName: r.slumName,
          }))
        );
      });
  };

  useEffect(() => {
    setValue("year", financialYear[0]["financialYearEn"]);
    //Table Data
    getAllForBilling(financialYear[0]["financialYearEn"]);
  }, [huts, slums, financialYear]);

  const getAllForBilling = (year) => {
    //Table
    if (year) {
      axios
        .get(`${urls.SLUMURL}/open/getBillsByYear?year=${year}`, {
          headers: headers,
        })
        .then((res) => {
          if(res.data.trnBillList!=null){
            setTable(
              res.data.trnBillList?.map((j, i) => ({
                srNo: i + 1,
                id: j.id,
                hutNo: j.hutNo,
                slumNameEn: slums.find((obj) => obj.id == j.slumKey)?.slumNameEn,
                slumNameMr: slums.find((obj) => obj.id == j.slumKey)?.slumNameMr,
                ownerName: `${j.ownerFirstName} ${j.ownerMiddleName} ${j.ownerLastName}`,
                ownerNameMr: `${j.ownerFirstNameMr} ${j.ownerMiddleNameMr} ${j.ownerLastNameMr}`,
              }))
            );
          }else{
            setTable([])
          }
          
        });
    }
  };

  useEffect(() => {
    if (watch("zoneKey") && watch("slumKey") && watch("hutNo")) {
      getBill();
    }
  }, [watch("zoneKey") && watch("slumKey") && watch("hutNo")]);

  const getBill = () => {
    axios
      .get(
        `${urls.SLUMURL}/open/getBills?zoneKey=${watch(
          "zoneKey"
        )}&slumKey=${watch("slumKey")}&hutNo=${watch("hutNo")}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if(res.data.trnBillList!=null){
        setTable(
          res.data.trnBillList?.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            hutNo: j.hutNo,
            taxName: "एकत्रित सेवा शुल्क",
            year: j.billYear,
            billNo: j.billNo,
            billAmount: j.totalBillAmount.toFixed(2),
            remainingDues: j.balanceAmount.toFixed(2),
            balanceAmount: j.balanceAmount,
            slumNameEn: slums.find((obj) => obj.id == j.slumKey)?.slumNameEn,
            slumNameMr: slums.find((obj) => obj.id == j.slumKey)?.slumNameMr,
            ownerName: `${j.ownerFirstName} ${j.ownerMiddleName} ${j.ownerLastName}`,
            ownerNameMr: `${j.ownerFirstNameMr} ${j.ownerMiddleNameMr} ${j.ownerLastNameMr}`,
          }))
        );
        }else{
          setTable([])
        }
      });
  };

  useEffect(() => {
    console.log("table ", table);
    if (table != [])
      table &&
        setValue(
          "name",
          language == "en" ? table[0]?.ownerName : table[0]?.ownerNameMr
        );
    let sum = table?.reduce(function (prev, current) {
      return prev + +current.balanceAmount;
    }, 0);
    console.log(sum);
    setValue("previousAmount", sum);
  }, [table, language]);

  const columns = [
    {
      align: "center",
      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      align: "center",
      field: "taxName",
      headerAlign: "center",
      headerName: "Tax Name",
      // headerName: <FormattedLabel id="ownerName" />,
      flex: 1,
      minWidth: 300,
    },
    {
      align: "center",
      // field: language == "en" ? "slumNameEn" : "slumNameMr",
      field: "year",
      headerAlign: "center",
      headerName: "Year",
      // headerName: <FormattedLabel id="slumName" />,
      width: 300,
    },
    {
      align: "center",
      field: "billAmount",
      headerAlign: "center",
      headerName: "Bill Amount",
      // headerName: <FormattedLabel id="hutNo" />,
      width: 150,
    },
    {
      align: "center",
      field: "remainingDues",
      headerAlign: "center",
      headerName: "Remaining Dues",
      // headerName: <FormattedLabel id="hutNo" />,
      width: 150,
    },
  ];

  useEffect(()=>{
    console.log('table ',table?.length);
  },[table])

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          //   background:
          //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          {/* <FormattedLabel id="generatedHutBill" /> */}
          Slum Billing Management
        </h2>
      </Box>

      <Paper>
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
            <FormattedLabel id="serviceCharges" />
          </h2>
        </Box>
        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          {/* Spouse Title */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              variant="standard"
              error={!!error.zoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="zoneKey" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "100%" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  >
                    {zoneDetails &&
                      zoneDetails.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {language == "en"
                            ? value.zoneName
                            : value?.zoneNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="zoneKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.zoneKey ? error.zoneKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Spouse mobileNo */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              variant="standard"
              error={!!error.slumKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="slumKey" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  >
                    {slumDetails &&
                      slumDetails.map((value, index) => (
                        <MenuItem key={index} value={value?.id}>
                          {value?.slumName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="slumKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.slumKey ? error.slumKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Spouse aadharNo */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              label={<FormattedLabel id="hutNo" />}
              inputProps={{ maxLength: 12 }}
              variant="standard"
              {...register("hutNo")}
              InputLabelProps={{
                shrink: watch("hutNo") ? true : false,
              }}
              error={!!error.hutNo}
              helperText={error?.hutNo ? error.hutNo.message : null}
            />
          </Grid>

          {table?.length != 0 && (
            <>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                {/* <div>
                            <b>  Name :  </b>{ table&& table[0]?.ownerName}
                        </div> */}
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  // label={<FormattedLabel id="hutNo" />}
                  label={"Name"}
                  inputProps={{ maxLength: 12 }}
                  variant="standard"
                  {...register("name")}
                  value={watch("name")}
                  InputLabelProps={{
                    shrink: watch("name") ? true : false,
                  }}
                  error={!!error.name}
                  helperText={error?.name ? error.name.message : null}
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                {/* <div>
                            <b>  Previous Amount :   </b>
                        </div> */}
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  // label={<FormattedLabel id="hutNo" />}
                  label={"Previous Amount"}
                  inputProps={{ maxLength: 12 }}
                  variant="standard"
                  {...register("previousAmount")}
                  value={watch("previousAmount")}
                  InputLabelProps={{
                    shrink: watch("previousAmount") ? true : false,
                  }}
                  error={!!error.previousAmount}
                  helperText={
                    error?.previousAmount ? error.previousAmount.message : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  // label={<FormattedLabel id="hutNo" />}
                  label={"Current Amount"}
                  inputProps={{ maxLength: 12 }}
                  variant="standard"
                  {...register("currentAmount")}
                  value={watch("currentAmount")}
                  InputLabelProps={{
                    shrink: watch("currentAmount") ? true : false,
                  }}
                  error={!!error.currentAmount}
                  helperText={
                    error?.currentAmount ? error.currentAmount.message : null
                  }
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  // label={<FormattedLabel id="hutNo" />}
                  label={"Deposit Amount"}
                  inputProps={{ maxLength: 12 }}
                  variant="standard"
                  {...register("depositeAmount")}
                  value={watch("depositeAmount")}
                  InputLabelProps={{
                    shrink: watch("depositeAmount") ? true : false,
                  }}
                  error={!!error.depositeAmount}
                  helperText={
                    error?.depositeAmount ? error.depositeAmount.message : null
                  }
                />
              </Grid>
            </>
          )}
        </Grid>

        {table?.length != 0 && (
          <>
            {" "}
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
                {/* <FormattedLabel id="serviceCharges" /> */}
                Bill Summary
              </h2>
            </Box>
            <div className={styles.row} style={{ justifyContent: "center" }}>
              <DataGrid
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
                rows={table || []}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                onSelectionModelChange={(allRowsId) => {
                  setSelectedHuts(allRowsId);
                }}
                experimentalFeatures={{ newEditingApi: true }}
              />
            </div>
          </>
        )}
        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          {/* {table.length != 0 && (
            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    value="I agree"
                    checked={checkedOne}
                    onChange={handleChangeOne}
                  />
                }
                label={<FormattedLabel id="iagreeForOnlinePay" />}
              />
            </Grid>
          )} */}

          {/* <div className={styles.btn}> */}
          {/* {data?.status == 13 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => loiPayment()}
          >
            <FormattedLabel id="payment" />
          </Button>
        ) : (
          <></>
        )} */}
          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <form method="POST" action={paymentGatUrl}>
              <div className={styles.small} hidden>
                <div className={styles.row}>
                  <div>
                    <TextField
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="encRequest"
                      variant="standard"
                      value={encRequest}
                      {...register("encRequest")}
                    />
                  </div>
                </div>

                <div className={styles.row} hidden>
                  <div>
                    <TextField
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="access_code"
                      variant="standard"
                      value={accessCode}
                      {...register("access_code")}
                    />
                  </div>
                </div>
              </div> */}

            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={table?.length == 0}
              onClick={getPaymentDetails}
              startIcon={<SaveIcon />}
              type="submit"
            >
              <FormattedLabel id="payment" />
            </Button>
            {/* </form> */}
          </Grid>
          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{ size: "23px" }}
              type="primary"
              color="primary"
              size="small"
              //   onClick={handlePrint}
            >
              <FormattedLabel id="print" />
            </Button>
          </Grid>
          <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="primary"
              size="small"
              color="error"
              variant="contained"
              onClick={() => {
                swal({
                  title: language == "en" ? "Exit?" : " बाहेर पडू इच्छिता ?",
                  text:
                    language == "en"
                      ? "Are you sure you want to exit this Record ? "
                      : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ? ",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                  buttons: [
                    language === "en" ? "No" : "नाही",
                    language === "en" ? "Yes" : "होय",
                  ],
                }).then((willDelete) => {
                  if (willDelete) {
                    swal(
                      language == "en"
                        ? "Record is Successfully Exit!"
                        : "रेकॉर्ड यशस्वीरित्या बाहेर पडते आहे!",
                      {
                        icon: "success",
                        button: language === "en" ? "Ok" : "ठीक आहे",
                      }
                    );
                    router.push(
                      "/SlumBillingManagementSystem/transactions/hutTransfer/hutTransferDetails"
                    );
                  } else {
                    swal(
                      language == "en"
                        ? "Record is Safe"
                        : "रेकॉर्ड सुरक्षित आहे",
                      { button: language === "en" ? "Ok" : "ठीक आहे" }
                    );
                  }
                });
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </Grid>
          {/* </div> */}
        </Grid>
      </Paper>
    </>
  );
};

export default Index;
