//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { Button, Grid, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
// import BoardDocumentThumbAndSign from '../../../../../components/marriageRegistration/BoardDocumentThumbAndSign'
import DocumentChecklistHeader from "../../../../../components/lms/DocumentChecklistHeader";
import ScrutinyAction from "../../../../../components/lms/ScrutinyAction";
import ViewMembership from "./viewMembership";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import urls from "../../../../../URLS/urls";

import { catchExceptionHandlingMethod } from "../../../../../util/util";
import Loader from "../../../../../containers/Layout/components/Loader";
const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.user.token);

  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();
  let serviceId = 86;
  const [data, setData] = useState();

  const [loading, setLoading] = useState(false);
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
  // useEffect(() => {
  //   console.log('router?.query?', router?.query)
  //   if (router?.query?.id) {

  //     // setData(router?.query)
  //     // reset(router?.query)
  //   }
  // }, [])

  // useEffect(() => {
  //   console.log('router?.query?.role', router?.query?.role)
  //   reset(router?.query)
  // }, [])
  useEffect(() => {
    console.log("aala", router?.query?.id);
    if (router?.query?.id) {
      setLoading(true);
      axios
        .get(
          `${urls.LMSURL}/trnDepositeRefund/getByIdAndServiceId?id=${
            router?.query?.id
          }&serviceId=${89}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          console.log(res, "reg123");
          // setData(res.data)
          reset(res.data);
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  }, []);
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
        id="paper-top"
      >
        {loading ? (
          <Loader />
        ) : (
          <FormProvider {...methods}>
            <ViewMembership
              id={router?.query?.id}
              disabled={router?.query?.disabled}
            />
            <ScrutinyAction />
          </FormProvider>
        )}
      </Paper>
    </>
  );
};

export default Index;
