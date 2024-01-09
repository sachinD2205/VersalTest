import { Paper, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { ToWords } from "to-words";
import urls from "../../../../../URLS/urls";
import theme from "../../../../../theme";
import styles from "../../boardRegistrations/scrutiny/LoiGeneration.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
const Index = () => {
  const language = useSelector((state) => state?.labels.language);
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
  let user = useSelector((state) => state.user.user);
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

  const [total, setTotal] = useState();
  const [totalWord, setTotalWord] = useState("zero");
  const [chargePerCopy, setChargePerCopy] = useState(0);

  const toWords = new ToWords();

  useEffect(() => {
    setTotal(
      Number(router?.query?.serviceCharge) +
        Number(router?.query?.penaltyCharge),
    );
    console.log("serviceID", router.query.serviceId);
  }, []);

  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=11`)
      .then((r) => {
        setChargePerCopy(r.data.serviceCharge[0].amount);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  useEffect(() => {
    if (total) {
      if (router.query.serviceId != 9) {
        console.log("total", total, typeof total);
        setTotalWord(toWords.convert(total));
      }
    }
  }, total);

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

  const handleExit = () => {
    swal("Exit!", "Successfully Exitted  Payment!", "success");
    router.push(
      "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny",
    );
  };

  const handlePay = () => {
    console.log("router?.query?.id,", router?.query?.id);
    const finalBody = {
      id: Number(router?.query?.id),
      role: "CASHIER",
      accountNumber: getValues("accountNumber"),
      bankName: getValues("bankName"),
      branchName: getValues("branchName"),
      ifscCode: getValues("ifsc"),
    };

    console.log("Search Body", finalBody);
    axios
      .post(
        `${urls.MR}/transaction/applicant/saveApplicationApprove`,
        finalBody,
      )
      .then((res) => {
        console.log(res);
        swal("Submitted!", "Payment Collected successfully !", "success");
        router.push({
          pathname: "/marriageRegistration/Receipts/ServiceChargeRecipt",
          query: {
            ...router?.query,
          },
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
        router.push(
          "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
        );
      });
    // .catch((err) => {
    //   swal("Error!", "Somethings Wrong!", "error");
    // });
  };

  // Loi Generation Open
  const [loiGeneration, setLoiGeneration] = useState(false);
  const loiGenerationOpen = () => setLoiGeneration(true);
  const loiGenerationClose = () => setLoiGeneration(false);

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
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                Loi Generation
              </h3>
            </div>
          </div>
          <div className={styles.appDetails}>
            {/* <div className={styles.row} >
                              <div > */}
            <h4>Application Number : {router?.query?.applicationNumber}</h4>
            {/* </div>
                          </div>
                          <div className={styles.row1}>
                              <div > */}
            <h4>Applicant Name :{router?.query?.applicantName}</h4>
            {/* </div>
                          </div>
                          <div className={styles.row1}>
                              <div > */}
            <h4>Application Date :{router?.query?.applicationDate}</h4>
          </div>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
