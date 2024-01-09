//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import DocumentChecklistHeader from "../../../../../components/marriageRegistration/DocumentChecklistHeader";
import HistoryComponent from "../../../../../components/marriageRegistration/HistoryComponent";
import ScrutinyAction from "../../../../../components/marriageRegistration/ScrutinyAction";
import ModBoardRegistration from "../../modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration";

const Index = (props) => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();
  let serviceId = 15;
  const [data, setData] = useState();
  const {
    // getValues,
    // register,
    // handleSubmit,
    // control,
    reset,
    // setValue,
    formState: { errors },
  } = methods;
  //http://localhost:8090/mr/api/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}
  useEffect(() => {
    console.log("router?.query?111111", router?.query);
    if (router?.query?.id) {
      setData(router?.query);
      reset(router?.query);
    }
  }, [router?.query]);
  // console.log("ppppppp",data);
  // useEffect(() => {
  //   console.log('router?.query?.role', router?.query?.role)
  //   reset(router?.query)
  // }, [])
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
          {(router?.query?.role === "DOCUMENT_VERIFICATION" ||
            router?.query?.role === "FINAL_APPROVAL") && (
            <HistoryComponent
              serviceId={15}
              applicationId={router?.query?.id}
            />
          )}
          {/* <HistoryComponent serviceId={15} applicationId={router?.query?.id} /> */}

          <ModBoardRegistration
            onlyDoc={true}
            preview={false}
            photos={data ? data : []}
          />

          <ScrutinyAction />
        </FormProvider>
      </Paper>
    </>
  );
};

export default Index;
