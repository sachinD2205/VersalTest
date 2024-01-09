import { Button, Paper, TextField } from "@mui/material";
import Head from "next/head";
import router from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./deposit.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Title from "../../../../containers/VMS_ReusableComponents/Title";
import {
  useGetToken,
  useLanguage,
} from "../../../../containers/reuseableComponents/CustomHooks";
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import { useForm } from 'react-hook-form'
import { ExitToApp, Save, Search } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

import ApplicantDetails from "../components/depositRefundProcess/ApplicantDetails";
import BankDetails from "../components/depositRefundProcess/BankDetails";
import BookingDetails from "../components/depositRefundProcess/BookingDetails";
import DocumentDetails from "../components/depositRefundProcess/DocumentDetails";
import UserApplications from "../components/depositRefundProcess/UserApplications";
import Loader from "../../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";

const Index = () => {
  const [loadingState, setLoadingState] = useState({
    dataFetched: false,
    fetching: false,
  });
  const [data, setData] = useState({});
  const [userApplications, setUserApplications] = useState([]);

  const citizenId = useSelector((state) => state.user.user.id);

  const language = useLanguage();
  const userToken = useGetToken();

  // const schema = yup.object().shape({
  //   applicationNumber: yup
  //     .string()
  //     .required(
  //       language === 'en'
  //         ? 'Please enter application no.'
  //         : 'कृपया अर्ज क्रमांक प्रविष्ट करा'
  //     )
  //     .matches(
  //       /^[A-Za-z0-9\s]+$/,
  //       language === 'en'
  //         ? 'Must be only english or numeric characters'
  //         : 'फक्त इंग्रजी किंवा अंकीय वर्ण असणे आवश्यक आहे'
  //     ),
  // })

  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors: error },
  // } = useForm({
  //   criteriaMode: 'all',
  //   resolver: yupResolver(schema),
  // })

  useEffect(() => {
    getUserApplications();
  }, []);

  const getUserApplications = () => {
    setLoadingState({
      dataFetched: false,
      fetching: true,
    });

    axios
      .get(`${urls?.SPURL}/report/getByCitizenId`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params: { citizenId },
      })
      .then((res) => {
        const allApplications = [
          ...res.data.groundBooking,
          ...res.data.gymBooking,
          ...res.data.sportsBooking,
          ...res.data.swimmingPool,
          ...res.data.trnMonthlySwimmingBooking,
        ].map((j) => ({
          applicationNumber: j?.applicationNumber,
          serviceName: j?.serviceName,
          serviceNameMr: j?.serviceNameMr,
          amount: j?.applicableCharages?.find((j) => j?.chargeType == 2)
            ?.amountPerHead,
        }));

        setUserApplications(allApplications);

        setTimeout(() => {
          setLoadingState({
            dataFetched: false,
            fetching: false,
          });
        }, 500);
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
        setLoadingState({
          dataFetched: false,
          fetching: false,
        });
      });
  };

  const searchByApplicationNumber = (data) => {
    console.log("ApplicationNo: ", data);
    setLoadingState({
      dataFetched: false,
      fetching: true,
    });
    axios
      .get(`${urls.SPURL}/report/getByApplicationNumber`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          applicationNumber: data?.applicationNumber,
        },
      })
      .then((res) => {
        const finalData =
          res.data.groundBooking[0] ??
          res.data.gymBooking[0] ??
          res.data.sportsBooking[0] ??
          res.data.swimmingPool[0] ??
          res.data.trnMonthlySwimmingBooking[0];

        if (!!finalData) {
          setData({
            ...finalData,
            timeSpan: !!res.data.swimmingPool?.length,
            bookingDate: finalData?.date,
            amount: finalData?.applicableCharages?.find(
              (j) => j?.chargeType == 2
            )?.amountPerHead,
          });
        } else {
          sweetAlert(
            "Info",
            "No application found with the entered application number",
            "info"
          );
        }
        setLoadingState({
          dataFetched: !!finalData,
          fetching: false,
        });
      })
      .catch((error) => {
        console.error(error);
        setLoadingState({
          dataFetched: false,
          fetching: false,
        });
      });
  };

  const finalSubmit = () => {
    const bodyForAPI = {
      serviceId: data?.serviceId,
      applicationId: data?.id,
      // amount: data?.paymentCollection?.totalAmount,
      amount: data?.amount,
    };

    sweetAlert({
      // title: language === 'en' ? 'Confirmation' : 'पुष्टीकरण',
      title: `${data?.applicationNumber}`,
      text:
        language === "en"
          ? `Do you wish to continue the deposit refund process?`
          : "आपल्याला अनामत रक्कम परतावा प्रक्रिया सुरू करायची आहे का?",
      icon: "warning",
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${urls.SPURL}/depositRefund/saveRefundProcess`, bodyForAPI, {
            headers: { Authorization: `Bearer ${userToken}` },
          })
          .then((res) => {
            sweetAlert(
              language === "en" ? "Success" : "यशस्वी झाले",
              language === "en"
                ? "Refund process initiated"
                : "परतावा प्रक्रिया सुरू केली",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            router.push("/dashboard");
          })
          .catch((error) => catchExceptionHandlingMethod(error, language));
      }
    });
  };

  return (
    <>
      <Head>
        <title>Deposit Refund Process</title>
      </Head>
      {loadingState?.fetching && <Loader />}
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id="depositRefundProcess" />} />
        {/* <form
          className={styles.centerAlign}
          onSubmit={handleSubmit(searchByApplicationNumber)}
        >
          <TextField
            sx={{ width: 250 }}
            label={<FormattedLabel id='applicationNumber' />}
            // @ts-ignore
            variant='standard'
            {...register('applicationNumber')}
            InputLabelProps={{
              shrink: router.query.id || watch('applicationNumber'),
            }}
            error={!!error.applicationNumber}
            helperText={
              error?.applicationNumber ? error.applicationNumber.message : null
            }
          />
          <Button variant='contained' type='submit' endIcon={<Search />}>
            <FormattedLabel id='search' />
          </Button>
        </form> */}
        <>
          <UserApplications
            tableData={userApplications}
            applicationSearchFn={searchByApplicationNumber}
            pagination={{ size: [5, 10, 20, 50, 100] }}
            showHeader
            showFooter
          />

          {loadingState?.dataFetched && (
            <>
              <ApplicantDetails data={data} />
              <BankDetails data={data} />
              <DocumentDetails data={data} />
              <BookingDetails data={data} />
              <div className={styles.buttonGroup}>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<Save />}
                  onClick={finalSubmit}
                >
                  <FormattedLabel id="save" />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToApp />}
                  onClick={() => router.back()}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </>
          )}
        </>
      </Paper>
    </>
  );
};

export default Index;
