import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import router from "next/router";

import { Button, Paper, TextField } from "@mui/material";
import styles from "./deposit.module.css";
import Title from "../../../../containers/VMS_ReusableComponents/Title";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ApplicationHistory from "../components/depositRefundProcess/ApplicationHistory";
import ApplicationDetails from "../components/depositRefundProcess/ApplicationDetails";
import DocumentDetails from "../components/depositRefundProcess/DocumentDetails";
// import BillDetails from '../components/depositRefundProcess/BillDetails'
import BookingDetails from "../components/depositRefundProcess/BookingDetails";
import ApplicantDetails from "../components/depositRefundProcess/ApplicantDetails";
import BankDetails from "../components/depositRefundProcess/BankDetails";
import Equipments from "../components/depositRefundProcess/Equipments";
import AdjustedDeposit from "../components/depositRefundProcess/AdjustedDeposit";
import axios from "axios";
import urls from "../../../../URLS/urls";
import {
  useGetToken,
  useLanguage,
} from "../../../../containers/reuseableComponents/CustomHooks";
import moment from "moment";
import { useSelector } from "react-redux";
import { ExitToApp, Save } from "@mui/icons-material";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import BreadCrumb from "../../../../components/common/BreadcrumbComponent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loader from "../../../../containers/Layout/components/Loader";

const Scrutiny = () => {
  const [data, setData] = useState();
  // const [authorityRemark, setAuthorityRemark] = useState('')
  const [updateAccess, setUpdateAccess] = useState(false);
  const [penaltyAmount, setPenaltyAmount] = useState({
    equipmentCharges: 0,
    otherCharges: 0,
  });
  const [schemaState, setSchemaState] = useState({});
  const [loadingState, setLoadingState] = useState(false);

  const userToken = useGetToken();
  const language = useLanguage();

  const schema = yup.object().shape(schemaState);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const roles =
    useSelector((state) =>
      // @ts-ignore
      state?.user?.user?.menus?.find(
        (menu) =>
          menu.id == Number(localStorage.getItem("selectedMenuFromDrawer"))
      )
    )?.roles ?? [];

  const totalAuthorities = [
    { order: 1, authority: "SUPERVISOR" },
    { order: 2, authority: "CLERK" },
    { order: 3, authority: "HOD" },
    { order: 4, authority: "ACCOUNTANT" },
  ];

  useEffect(() => {
    setSchemaState(
      updateAccess
        ? {
            remark: yup
              .string()
              .required(
                language == "en"
                  ? "Please enter a remark"
                  : "कृपया शेरा प्रविष्ट करा"
              )
              .typeError(
                language == "en"
                  ? "Please enter a remark"
                  : "कृपया शेरा प्रविष्ट करा"
              ),
          }
        : {}
    );
  }, [updateAccess]);

  useEffect(() => {
    //Get application data
    setLoadingState(true);
    if (!!router.query?.id) {
      axios
        .get(`${urls.SPURL}/depositRefund/getByRefundId`, {
          headers: { Authorization: `Bearer ${userToken}` },
          params: {
            id: router.query?.id,
          },
        })
        .then((res) => {
          //Save button render condition checks whether user's scrutiny role is completed
          checkScrutinyStatus(res.data?.status);
          setPenaltyAmount({
            equipmentCharges: res?.data?.equipmentCharges ?? 0,
            otherCharges: res?.data?.otherCharges ?? 0,
          });

          axios
            .get(`${urls.SPURL}/report/getByApplicationNumber`, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
              params: {
                applicationNumber: res.data?.applicationNumber,
              },
            })
            .then((secondResponse) => {
              const finalData =
                secondResponse.data.groundBooking[0] ??
                secondResponse.data.gymBooking[0] ??
                secondResponse.data.sportsBooking[0] ??
                secondResponse.data.swimmingPool[0] ??
                secondResponse.data.trnMonthlySwimmingBooking[0];

              setData({
                ...finalData,
                timeSpan: !!secondResponse.data.swimmingPool?.length,
                bookingDate: finalData?.date,
                refundId: router.query?.id,
                refundHistoryLst: res.data?.refundHistoryLst?.map((j, i) => ({
                  ...j,
                  srNo: i + 1,
                  approvalDate:
                    moment(j?.sentDate).format("DD-MM-YYYY") +
                    " at " +
                    moment(j?.sentDate).format("hh:mm a"),
                })),
                refundStatus: res.data?.status,
              });

              setTimeout(() => {
                setLoadingState(false);
              }, 500);
            })
            .catch((error) => {
              setLoadingState(false);

              console.error(error);
            });
        })
        .catch((error) => {
          setLoadingState(false);

          console.error(error);
        });
    }
  }, []);

  const checkScrutinyStatus = (applicationStatus) => {
    switch (applicationStatus) {
      //#1
      case "PENDING":
        setUpdateAccess(
          roles?.includes("SUPERVISOR") || roles?.includes("ADMIN")
        );
        break;
      //#1
      case "SUPERVISOR_VERIFICATION_COMPLETED":
        setUpdateAccess(roles?.includes("CLERK") || roles?.includes("ADMIN"));
        break;
      //#2
      case "CLERK_VERIFICATION_COMPLETED":
        setUpdateAccess(roles?.includes("HOD") || roles?.includes("ADMIN"));
        break;
      //#3
      case "HOD_VERIFICATION_COMPLETED":
        setUpdateAccess(
          roles?.includes("ACCOUNTANT") || roles?.includes("ADMIN")
        );
        break;

      default:
        setUpdateAccess(false);
        break;
    }
  };

  const findRole = () => {
    if (roles?.includes("ADMIN")) {
      if (!!data?.refundHistoryLst?.length) {
        for (let i = 0; i < totalAuthorities?.length; i++) {
          if (
            totalAuthorities[i]?.authority ==
            data?.refundHistoryLst[data?.refundHistoryLst?.length - 1]
              ?.authority
          ) {
            return totalAuthorities[i + 1]?.authority;
          }
        }
      } else {
        return totalAuthorities[0]?.authority;
      }
    } else {
      // for (let i = 0; i < roles?.length; i++) {
      //   if (
      //     roles[i] == "CLERK" ||
      //     roles[i] == "SUPERVISOR" ||
      //     roles[i] == "HOD" ||
      //     roles[i] == "ACCOUNTANT"
      //   ) {
      //     mainRole = roles[i];
      //     break;
      //   }
      // }

      return roles?.find(
        (role) =>
          role == "CLERK" ||
          role == "SUPERVISOR" ||
          role == "HOD" ||
          role == "ACCOUNTANT"
      );
    }
  };

  const finalSubmit = (formData) => {
    // var mainRole = "";
    var mainRole = findRole();

    // if (roles?.includes("ADMIN")) {
    //   if (!!data?.refundHistoryLst?.length) {
    //     for (let i = 0; i < totalAuthorities?.length; i++) {
    //       if (
    //         totalAuthorities[i]?.authority ==
    //         data?.refundHistoryLst[data?.refundHistoryLst?.length - 1]
    //           ?.authority
    //       ) {
    //         mainRole = totalAuthorities[i + 1]?.authority;
    //       }
    //     }
    //   } else {
    //     mainRole = totalAuthorities[0]?.authority;
    //   }
    // } else {
    //   // for (let i = 0; i < roles?.length; i++) {
    //   //   if (
    //   //     roles[i] == "CLERK" ||
    //   //     roles[i] == "SUPERVISOR" ||
    //   //     roles[i] == "HOD" ||
    //   //     roles[i] == "ACCOUNTANT"
    //   //   ) {
    //   //     mainRole = roles[i];
    //   //     break;
    //   //   }
    //   // }

    //   mainRole = roles?.find(
    //     (role) =>
    //       role == "CLERK" ||
    //       role == "SUPERVISOR" ||
    //       role == "HOD" ||
    //       role == "ACCOUNTANT"
    //   );
    // }

    const bodyForAPI = {
      role: mainRole,
      id: Number(data?.refundId),
      remark: formData?.remark,
      ...penaltyAmount,
    };

    sweetAlert({
      title: language === "en" ? "Confirmation" : "पुष्टीकरण",
      text:
        language === "en"
          ? "Do you really want to change the status of this application ?"
          : "तुम्हाला खरोखर या रेकॉर्डची स्थिती बदलायची आहे का?",
      icon: "warning",
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((ok) => {
      if (ok) {
        axios
          .post(
            `${urls.SPURL}/depositRefund/refundApprovalByDepartment`,
            bodyForAPI,
            {
              headers: { Authorization: `Bearer ${userToken}` },
            }
          )
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert(
                language === "en" ? "Success" : "यशस्वी झाले",
                language === "en"
                  ? "Refund process updated"
                  : "परतावा प्रक्रिया अद्यतनित केली",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              );

              router.push(`/sportsPortal/transaction/depositRefundProcess`);
            }
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
      <BreadCrumb />
      {loadingState && <Loader />}

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id="depositRefundProcess" />} />
        {!loadingState && (
          <>
            <ApplicationHistory data={data?.refundHistoryLst} />
            <ApplicationDetails data={data} />
            <ApplicantDetails data={data} />
            <DocumentDetails data={data} />
            <BookingDetails data={data} />
            <BankDetails data={data} />
            {/* <BillDetails
          data={{ ...data, updateAccess }}
          sendBackRemark={setAuthorityRemark}
        /> */}

            {data?.refundStatus == "PENDING" && (
              <Equipments
                penalty={penaltyAmount}
                setPenalty={setPenaltyAmount}
              />
            )}
            <AdjustedDeposit
              amount={{
                amount: data?.applicableCharages?.find(
                  (j) => j?.chargeType == 2
                )?.amountPerHead,
                equipmentCharges: penaltyAmount?.equipmentCharges,
                otherCharges: penaltyAmount?.otherCharges,
              }}
            />
            <form onSubmit={handleSubmit(finalSubmit)}>
              {updateAccess && (
                <div style={{ padding: "35px 20px 20px 20px" }}>
                  <TextField
                    sx={{ width: "100%" }}
                    label={<FormattedLabel id="remark" />}
                    // @ts-ignore
                    variant="standard"
                    {...register("remark")}
                    InputLabelProps={{
                      shrink: !!watch("remark"),
                    }}
                    error={!!error.remark}
                    helperText={error?.remark ? error.remark.message : null}
                  />
                </div>
              )}
              <div className={styles.buttonGroup}>
                {updateAccess && (
                  <Button
                    endIcon={<Save />}
                    variant="contained"
                    color="success"
                    type="submit"
                    // onClick={finalSubmit}
                  >
                    <FormattedLabel id="save" />
                  </Button>
                )}
                <Button
                  endIcon={<ExitToApp />}
                  variant="contained"
                  color="error"
                  onClick={() => router.back()}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </form>
          </>
        )}
      </Paper>
    </>
  );
};

export default Scrutiny;
