//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import DocumentChecklistHeader from "../../../../../components/marriageRegistration/DocumentChecklistHeader";
import HistoryComponent from "../../../../../components/marriageRegistration/HistoryComponent";
import ScrutinyAction from "../../../../../components/marriageRegistration/ScrutinyAction";
import BoardRegistration from "../../../transactions/boardRegistrations/citizen/boardRegistration";
import {
  DecryptData,
  EncryptData,
} from "../../../../../components/common/EncryptDecrypt";

const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();
  let serviceId = 67;
  const [data, setData] = useState();
  const {
    // getValues,
    // register,
    // handleSubmit,
    // control,
    reset,
    setValue,
    // setValue,
    formState: { errors },
  } = methods;
  //http://localhost:8090/mr/api/transaction/marriageBoardRegistration/getapplicantById?applicationId=${router?.query?.id}
  // useEffect(() => {
  //   console.log('router?.query?', router?.query)
  //   if (router?.query?.id) {

  //     // setData(router?.query)
  //     // reset(router?.query)
  //   }
  // }, [])

  useEffect(() => {
    console.log("router?.query", router?.query);
    reset(router?.query);

    // const plaintext = DecryptData(
    //   "passphraseaaaaaaaaupload",
    //   router?.query?.boardHeadPersonPhoto,
    // );

    // console.log("sdfdsPlainText", plaintext);

    // setValue("boardHeadPersonPhoto", plaintext);
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
        {(router?.query?.role === "DOCUMENT_VERIFICATION" ||
          router?.query?.role === "FINAL_APPROVAL") && (
          <HistoryComponent serviceId={67} applicationId={router?.query?.id} />
        )}
        <FormProvider {...methods}>
          <DocumentChecklistHeader />

          <BoardRegistration
            onlyDoc={true}
            preview={false}
            photos={data ? data : []}
          />

          {/* <BoardDocumentThumbAndSign /> */}
          <ScrutinyAction />
        </FormProvider>
      </Paper>
    </>
  );
};

export default Index;
