import React from "react";
import axios from "axios";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import { Box, Button, InputLabel, TextField, Paper, Grid } from "@mui/material";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";

const PropertyTax = () => {
  const router = useRouter();

  const [propertyNum, setPropertyNo] = useState();

  console.log("propertyNum", propertyNum);
  // let propertyNo;
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();

  const onSubmitForm = (formData) => {
    let consumerID = watch("propertyNo");
    console.log("9999", consumerID);

    const data = {
      consumerID: consumerID,
    };

    // alert("ds");
    axios
      .post(
        `http://localhost:8092/fbs/api/transaction/provisionalBuildingFireNOC/getPropertyDueDtl`,
        data
      )
      .then((res) => {
        alert(res.data.reason);

        localStorage.setItem("propertTaxStatus", res.data.reason);

        // setPropertyNo(res.data.status);
        // router.push({
        //   pathname:
        //     "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
        //   query: { propertyNum },
        // });

        // console.log("2222", res);
      });
  };

  // const property = () => {
  //   axios
  //     .post(
  //       "http://103.224.247.135:8081/PropertyTaxService/webapi/propertyTaxWebServiceController/getConsumerBalance",
  //       propertyNo
  //     )
  //     .then((res) => {
  //       console.log("property API", res);
  //     })
  //     .catch((err) => console.log(err));
  // };
  // const property = () => {
  //   // alert("hiii");
  // };
  return (
    <FormProvider>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            onChange={setPropertyNo}
            id="standard-basic"
            // label={<FormattedLabel id="applicantName" />}
            label="Property Tax NO."
            variant="standard"
            {...register("propertyNo")}
            error={!!errors.propertyNo}
            helperText={errors?.propertyNo ? errors.propertyNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <Button onClick={onSubmitForm}>Search</Button>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default PropertyTax;
