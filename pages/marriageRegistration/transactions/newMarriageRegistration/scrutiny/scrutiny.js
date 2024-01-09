//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import DocumentChecklistHeader from "../../../../../components/marriageRegistration/DocumentChecklistHeader";
import DocumentsUpload from "../../../../../components/marriageRegistration/DocumentsUpload";
import DocumentThumbAndSign from "../../../../../components/marriageRegistration/DocumentThumbAndSign";
import ScrutinyAction from "../../../../../components/marriageRegistration/ScrutinyAction";
import HistoryComponent from "../../../../../components/marriageRegistration/HistoryComponent";

const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm({});
  let serviceId = 10;
  const {
    // getValues,
    // register,
    // handleSubmit,
    // control,
    reset,
    // setValue,
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
          // borderRadius: 5,
          border: 1,
          borderColor: "#5BCAFA",
        }}
      >
        <FormProvider {...methods}>
          {(router?.query?.role === "DOCUMENT_VERIFICATION" ||
            router?.query?.role === "FINAL_APPROVAL") && (
            <HistoryComponent
              serviceId={10}
              applicationId={router?.query?.id}
            />
          )}
          <DocumentChecklistHeader />

          {/* <HistoryComponent serviceId={10} applicationId={router?.query?.applicationId} /> */}
          <DocumentsUpload />
          {(router?.query?.role === "DOCUMENT_VERIFICATION" ||
            router?.query?.role === "FINAL_APPROVAL") && (
            <DocumentThumbAndSign />
          )}
          <ScrutinyAction />
        </FormProvider>
      </Paper>
    </>
  );
};

export default Index;
