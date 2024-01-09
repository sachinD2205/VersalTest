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

const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const methods = useForm();
  let serviceId = 86;
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
          console.log(res, "reg123");
          // setData(res.data)
          reset(res.data);
          // let tempData = res.data.trnCloseMembershipList?.sort((a, b) => b.id - a.id)
          //   .map((r, i) => {
          //     return {
          //       srNo: i + 1,
          //       ...r,
          //       applicationDate: r.applicationDate ? moment(r.applicationDate).format('DD-MM-YYYY') : '',
          //       startDate: r.startDate ? moment(r.startDate).format('DD-MM-YYYY') : '',
          //       endDate: r.endDate ? moment(r.endDate).format('DD-MM-YYYY') : '',
          //     }
          //   })
          // setTableData(
          //   tempData
          // )
        });
    }
  }, []);
  return (
    <>
      <FormProvider {...methods}>
        <ViewMembership
          id={router?.query?.id}
          disabled={router?.query?.disabled}
        />
        {/* <ScrutinyAction /> */}
      </FormProvider>
    </>
  );
};

export default Index;
