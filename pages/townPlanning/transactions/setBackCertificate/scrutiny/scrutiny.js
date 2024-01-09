//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { Paper } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import DocumentChecklistHeader from "../../../../../components/townPlanning/DocumentChecklistHeader";
import HistoryComponent from "../../../../../components/townPlanning/HistoryComponent";
import ScrutinyAction from "../../../../../components/townPlanning/ScrutinyAction";
import FileTableVerification from "../../../../../components/townPlanning/fileTablefire/FileTableVerification";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
const Index = () => {
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

  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();
  // let serviceId = 10;
  const {
    // getValues,
    // register,
    // handleSubmit,
    // control,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const [dataa, setDataa] = useState();

  useEffect(() => {
    axios
      .get(
        `${urls.TPURL}/setBackCertificate/getsetBackCertificate?id=${router?.query?.applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((resp) => {
        if (resp.status == 200) {
          reset(resp.data);
          setDataa(resp?.data);
          console.log("partMap:=<>", resp.data);
          setValue("files", resp?.data?.files);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  useEffect(() => {
    console.log("dataaaaaaaaaaaa", dataa);
  }, [dataa]);

  return (
    <>
      <Paper
        sx={{
          marginLeft: 2,
          marginRight: 2,
          marginTop: 1,
          marginBottom: 1,
          padding: 1,
          // borderRadius: 5,
          border: 1,
          borderColor: "#5BCAFA",
        }}
      >
        <FormProvider {...methods}>
          <DocumentChecklistHeader />
          {(router?.query?.role === "APPLICATION_APPROVAL" ||
            router?.query?.role === "FINAL_APPROVAL") && (
            <HistoryComponent docs={dataa} />
          )}
          {/* <HistoryComponent docs={dataa} /> */}
          {/* <PersonalDetails /> */}
          {/* <DocumentUpload docs={dataa} /> */}
          <FileTableVerification />

          <ScrutinyAction />
        </FormProvider>
      </Paper>
    </>
  );
};

export default Index;
