import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { ToWords } from "to-words";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";

import styles from "../../../../styles/common/transactions/PaymentCollection.module.css";

const Index = (props) => {
  let user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const [id, setid] = useState();

  const [total, setTotal] = useState();
  const [totalWord, setTotalWord] = useState("zero");
  const [chargePerCopy, setChargePerCopy] = useState(0);

  const [paymentNo, setPaymentNo] = useState();
  const [cfcDetails, setcfcDetails] = useState([]);

  const onlinModes = [
    {
      id: 11,
      paymentModePrefixMr: null,
      paymentModePrefix: "Test payment Mode Prefix ",
      fromDate: "2022-12-11",
      toDate: "2022-12-12",
      paymentModeMr: null,
      paymentMode: "UPI",
      paymentTypeId: null,
      remark: "remark",
      remarkMr: null,
      activeFlag: "Y",
    },
    {
      id: 22,
      paymentModePrefixMr: null,
      paymentModePrefix: "test payment mode prefix 2",
      fromDate: "2019-02-11",
      toDate: "2022-10-10",
      paymentModeMr: null,
      paymentMode: "Net Banking",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
  ];

  const [dataa, setDataa] = useState(null);
  const [showData, setShowData] = useState(null);
  const isDeptUser = useSelector(
    (state) => state?.user?.user?.userDao?.deptUser
  );

  useEffect(() => {
    console.log(
      "router.query",
      router?.query?.data && JSON.parse(router?.query?.data)
    );
    router?.query?.data && setDataa(JSON.parse(router?.query?.data));
  }, []);

  const getAllData = () => {
    let id = dataa && dataa.applicationNumber;
    axios
      .get(
        // `http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`

        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("respinse", res);
        setShowData(res?.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  useEffect(() => {
    dataa?.applicationNumber && getAllData();
  }, [dataa]);

  const [facilityNames, setFacilityNames] = useState([]);
  const getFacilityName = () => {
    axios
      .get(`${urls.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          }))
        );
      });
  };

  const toWords = new ToWords();
  useEffect(() => {
    // getSwimmingData();
  }, [facilityNames]);

  useEffect(() => {
    if (total) {
      if (router.query.serviceId != 9) {
        console.log("total", total, typeof total);
        setTotalWord(toWords.convert(total));
      }
    }
  }, [total]);

  useEffect(() => {
    if (watch("charges")) {
      if (watch("charges") == undefined || watch("charges") === 0) {
        setTotalWord("zero");
      } else {
        setTotalWord(toWords.convert(watch("charges")));
      }
    } else {
      setTotalWord("zero");
    }
  }, [watch("charges")]);

  useEffect(() => {
    console.log("deid");
    let tempCharges = watch("noOfCopies") * chargePerCopy;
    setValue("charges", tempCharges);
  }, [watch("noOfCopies")]);

  const validatePay = () => {
    if (
      watch("accountNumber") === undefined ||
      watch("accountNumber") === "" ||
      watch("bankName") === undefined ||
      watch("bankName") === "" ||
      watch("branchName") === undefined ||
      watch("branchName") === "" ||
      watch("ifsc") === undefined ||
      watch("ifsc") === ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  const getNextKey = () => {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Swimming Data", res);
        const tempData = res?.data;
        setPaymentNo(tempData);
      });
  };

  const handleExit = () => {
    swal("Exit!", "Successfully Exitted  Payment!", "success");

    router.push(`/CFC_Dashboard`);
  };

  const handlePay = () => {
    const _paymentType = 2;
    const _paymentMode = 42;
    console.log(
      "handlePay",
      cfcDetails?.balanceAvailableRs,
      showData?.depositAmount + showData?.rentAmount
    );

    sweetAlert({
      title: "Auditorium Booking",
      text: "Do you want to pay?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: ["No", "Yes"],
    }).then((willDelete) => {
      if (willDelete) {
        if (cfcDetails?.balanceAvailableRs < showData?.depositAmount) {
          sweetAlert({
            title: "Low wallet balance",
            text: "Do you want to topup your wallet first?",
            dangerMode: false,
            closeOnClickOutside: false,
            buttons: ["No", "Yes"],
          }).then((res) => {
            if (res) {
              router.push({
                pathname: "../../common/transactions/topUpProcess",
                query: {
                  pageMode: "Edit",
                  cfcDetails: cfcDetails && JSON.stringify(cfcDetails),
                },
              });
            } else {
            }
          });
        } else {
          const finalBody = {
            ...showData,
            auditoriumId: showData._auditoriumId,
            eventDate: moment(showData.eventDate, "YYYY/MM/DD").format(
              `YYYY-MM-DD`
            ),
            id: showData.id,
            paymentDao: {
              depositAmount: showData.depositAmount,
              rentAmount: showData.rentAmount,
              paymentNumber: paymentNo,
              paymentType: _paymentType,
              paymentMode: _paymentMode,
            },
            processType: "B",
            designation: "Citizen",
            auditoriumBookingDetailsList: JSON.parse(showData?.timeSlotList),
          };

          console.log("finalBody", finalBody);

          axios
            .post(
              `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/processPaymentCollection`,
              finalBody,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              console.log("omkar", { ...router?.query }, router);
              addToCfcBalanceHistory();

              swal({
                title: "Submitted!",
                text: `Payment Collected successfully ! Receipt Number is - ${
                  res?.data?.message?.split("$")[1]
                }`,
                icon: "success",
                buttons: ["View Receipt", "Exit"],
                dangerMode: true,
              }).then((userChoice) => {
                console.log("User choice:", userChoice);

                // Check which button was clicked
                if (userChoice) {
                  router.push({
                    pathname:
                      "/PublicAuditorium/transaction/auditoriumBooking/acknowledgmentReceiptmarathi",
                    query: {
                      data: JSON.stringify({
                        merchant_param5: "merchant_param5",
                        id: dataa?.id,
                        applicationId: dataa?.applicationNumber,
                      }),
                      mode: "ONLINE",
                    },
                  });
                } else {
                  console.log("User clicked Yes");
                  router.push({
                    pathname:
                      "/PublicAuditorium/transaction/auditoriumBooking/pgSuccessDeposite/PaymentReceipt",
                    query: {
                      data: JSON.stringify({
                        id: dataa?.id,
                        applicationId: dataa?.applicationNumber,
                        merchant_param5: "merchant_param5",
                      }),
                      mode: "ONLINE",
                    },
                  });
                }
              });
            })
            .catch((err) => {
              console.log("er", err);
              swal("Error!", "Somethings Wrong!", "error");
            });
        }
      } else {
      }
    });
  };

  const addToCfcBalanceHistory = () => {
    console.log("moduleId", dataa?.applicationId);
    const finalBody = {
      cfcId: cfcDetails?.cfcId,
      serviceId: showData?.serviceId,
      moduleId: dataa?.applicationId,
      paymentAmount: showData?.depositAmount,
      paymentDate: new Date(),
      paymentTime: moment().format("HH:mm:ss"),
    };

    console.log("finalBody", finalBody);

    axios
      .post(`${urls.CFCURL}/trasaction/cfcPaymentDetails/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("respo", res);
      })
      .catch((err) => {
        console.log("errrr", err);
      });
  };

  const language = useSelector((state) => state?.labels.language);

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setPaymentTypes(
          r.data.paymentType.map((row) => ({
            id: row.id,
            paymentType: row.paymentType,
            paymentTypeMr: row.paymentTypeMr,
          }))
        );
      });
  };

  const [paymentModes, setPaymentModes] = useState([]);
  const [pmode, setPmode] = useState([]);
  const getPaymentModes = () => {
    axios
      .get(`${urls.BaseURL}/paymentMode/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setPmode(
          r.data.paymentMode.map((row) => ({
            id: row.id,
            paymentMode: row.paymentMode,
            paymentModeMr: row.paymentModeMr,
          }))
        );
      });
  };

  const getWalletAmountByCFC_Id = () => {
    let cfcId = user?.userDao?.cfc;
    const tempData = axios
      .get(`${urls.CFCURL}/master/cfcCenters/getByCfcId?cfcId=${cfcId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Id Respose", res);
        setcfcDetails(res?.data);
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getNextKey();
    getWalletAmountByCFC_Id();
  }, []);

  useEffect(() => {
    console.log("paymenttype", watch("payment.paymentType"));
    if (watch("payment.paymentType") == 2) {
      setPaymentModes(onlinModes);
    } else {
      setPaymentModes(pmode);
    }
  }, [watch("payment.paymentType")]);
  // const [data, setdata] = useState()

  useEffect(() => {
    console.log(
      "334",
      dataa,
      dataa &&
        JSON.stringify({
          id: dataa?.id,
          applicationId: dataa?.applicationNumber,
        })
    );
  }, [dataa]);

  var num =
    "Zero One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen".split(
      " "
    );
  var tens = "Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety".split(" ");

  function number2words(n = 0) {
    if (n < 20) return num[n];
    var digit = n % 10;
    if (n < 100) return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
    if (n < 1000)
      return (
        num[~~(n / 100)] +
        " Hundred" +
        (n % 100 == 0 ? "" : " " + number2words(n % 100))
      );
    return (
      number2words(~~(n / 1000)) +
      " Thousand" +
      (n % 1000 != 0 ? " " + number2words(n % 1000) : "")
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 10,
            marginRight: 2,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
            border: 2,
            borderColor: "black.500",
          }}
        >
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              alignItems: "center",
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <Grid
              item
              xs={11}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>
                {language == "en"
                  ? "CFC Payment Collection"
                  : "सीएफसी पेमेंट कलेक्शन"}
              </h2>
            </Grid>
          </Grid>
          <div className={styles.appDetails}>
            <Grid container sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{}}
              >{`CFC Center Name - ${cfcDetails?.cfcName}`}</Typography>
              <Typography
                sx={{}}
              >{`CFC Address - ${cfcDetails?.cfcAddress}`}</Typography>
              <Typography
                sx={{ fontWeight: "900" }}
              >{`CFC Wallet Amount - रु ${cfcDetails?.balanceAvailableRs}`}</Typography>
            </Grid>
          </div>
          <div className={styles.appDetails}>
            <h4>
              Application Number / अर्जाचा क्रमांक :{" "}
              <b>{showData?.applicationNumber}</b>
            </h4>
            <h4>
              Applicant name / अर्जदाराचे नाव :
              <b>{" " + showData?.applicantName}</b>
            </h4>
            <h4>
              Mobile Number / मोबाईल नंबर :
              <b>{" " + showData?.applicantMobileNo}</b>
            </h4>
            <div className={styles.row5}></div>

            <table className={styles.__table}>
              <tr className={styles.__tr}>
                <th className={styles.__th} style={{ width: "10%" }}>
                  Sr No. / अ.क्र
                </th>
                <th className={styles.__th} style={{ width: "30%" }}>
                  Name / नाव
                </th>
                <th className={styles.__th}>Amount / रक्कम (रु)</th>
              </tr>
              <tr className={styles.__tr}>
                <td className={styles.__td}>1)</td>
                <td className={styles.__td}>Deposit Amount / ठेव रक्कम</td>
                <td className={styles.__tdAmt}>
                  <b>{showData?.depositAmount}</b>
                </td>
              </tr>
              {/* <tr className={styles.__tr}>
                <td className={styles.__td}>2)</td>
                <td className={styles.__td}>Rent Amount / भाडे रक्कम</td>
                <td className={styles.__tdAmt}>
                  <b>{showData?.rentAmount}</b>
                </td>
              </tr> */}
              <tr className={styles.__tr}>
                <td className={styles.__td}></td>
                <td className={styles.__td}></td>
                <td className={styles.__tdAmt}>
                  <b>
                    Total Amount / एकूण रक्कम :{" "}
                    {
                      showData?.depositAmount
                      //  +
                      //   showData?.rentAmount
                    }{" "}
                    रु (18% GST (CGST + SGST))
                  </b>
                </td>
              </tr>
              <tr className={styles.__tr}>
                <td className={styles.__td}></td>
                <td className={styles.__td}></td>
                <td className={styles.__tdAmt}>
                  <b>
                    Total Amount (In words) / एकूण रक्कम (शब्दात) :{" "}
                    {showData &&
                      number2words(
                        showData?.depositAmount
                        //  +
                        //   showData?.rentAmount
                      )}{" "}
                    रु (18% GST (CGST + SGST))
                  </b>
                </td>
              </tr>
            </table>
            <div>
              <div className={styles.row4}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    //disabled={validatePay()}
                    onClick={() => {
                      handlePay();
                    }}
                  >
                    {language == "en" ? "Pay" : "पैसे द्या"}
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    // disabled={validateSearch()}
                    onClick={() => {
                      swal({
                        title: "Exit?",
                        text: "Are you sure you want to exit this Record ? ",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      }).then((willDelete) => {
                        if (willDelete) {
                          swal("Record is Successfully Exit!", {
                            icon: "success",
                          });
                          handleExit();
                        } else {
                          swal("Record is Safe");
                        }
                      });
                    }}
                    // onClick={() => {
                    //   handleExit()
                    // }}
                  >
                    {language == "en" ? "Exit" : "बाहेर पडा"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
