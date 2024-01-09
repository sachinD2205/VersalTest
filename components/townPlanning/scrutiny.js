import { Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import PersonalDetails from "../../../../../components/townPlanning/PersonalDetails";
import DocumentChecklistHeader from "../townPlanning/DocumentChecklistHeader";
import HistoryComponent from "../townPlanning/HistoryComponent";
import ScrutinyAction from "../townPlanning/ScrutinyAction";

const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();

  const {
    reset,

    formState: { errors },
  } = methods;

  useEffect(() => {
    console.log("router?.query?.role", router?.query);
    reset(router?.query);
  }, []);

  return (
    <>
      <Paper
        sx={{
          marginLeft: 2,
          marginRight: 2,
          marginTop: 1,
          marginBottom: 1,
          padding: 1,

          border: 1,
          borderColor: "#5BCAFA",
        }}
      >
        <FormProvider {...methods}>
          <DocumentChecklistHeader />
          {/* {(router?.query?.role === "DOCUMENT_VERIFICATION" ||
            router?.query?.role === "FINAL_APPROVAL") && (
            <HistoryComponent
              serviceId={10}
              applicationId={router?.query?.id}
            />
            )} */}
          <HistoryComponent
          // serviceId={17} applicationId={router?.query?.id}
          />
          <h1>4444</h1>
          <PersonalDetails />

          <ScrutinyAction />
        </FormProvider>
      </Paper>
    </>
  );
};

export default Index;
