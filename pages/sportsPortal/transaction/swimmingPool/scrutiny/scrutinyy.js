import { Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
// import ScrutinyAction from "../../../../../components/marriageRegistration/ScrutinyAction";
import ScrutinyAction from "../../../transaction/components/ScrutinyAction";

const Index = () => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm();
  let serviceId = 10;
  const [data, setData] = useState();
  const {
    getValues,
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    setData(router?.query);
    console.log("router?.query?.role", router?.query?.role);
    reset(router?.query);
    console.log("id", router?.query);
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
          <ScrutinyAction props={data} />
        </FormProvider>
      </Paper>
    </>
  );
};

export default Index;
