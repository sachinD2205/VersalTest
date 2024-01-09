import { Grid, TextField, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// BankDetails
const BankDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [authority, setAuthority] = useState();
  const user = useSelector((state) => state?.user?.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("authority", auth);
  }, []);

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

  // useEffect(()=>{
  //   if((authority?.includes("ADMIN") && (localStorage.getItem("advDetails") !=== null))){
  //     setValue
  //   }

  // },[localStorage.getItem("nonExistent" != null)]

  useEffect(() => {
    console.log("dataa=>", JSON.parse(localStorage.getItem("advDetails")));
  }, []);

  const [getBankName, setGetBankName] = useState();

  // let updatedBankName = getBankName?.find(
  //   (b = b.bankName == getValues("bankName"))
  // )?.bankNameSr;

  // get Bank Name
  useEffect(() => {
    axios
      .get(`${urls.LCMSURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGetBankName(res?.data?.bank);
        console.log("stateDaa", res?.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, []);

  useEffect(() => {
    if (authority?.includes("ADMIN")) {
      let advData = JSON.parse(localStorage.getItem("advDetails"));

      setValue("bankName", advData?.bankName);
      setValue("accountNo", advData?.accountNo);
      setValue("bankIFSCCode", advData?.bankIFSCCode);
      setValue("bankMICRCode", advData?.bankMICRCode);
    }
  }, [localStorage.getItem("advDetails" != null), authority]);

  // view
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          {/** BankName */}
          {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("bankName") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id='bankName' />}
              {...register("bankName")}
              error={!!errors?.bankName}
              helperText={errors?.bankName ? errors?.bankName?.message : null}
            />
          </Grid> */}

          {/** AccountNo */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("accountNo") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id="accountNo" />}
              {...register("accountNo")}
              error={!!errors?.accountNo}
              helperText={errors?.accountNo ? errors?.accountNo?.message : null}
            />
          </Grid>

          {/** IFSCCode */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              InputLabelProps={{ shrink: watch("bankIFSCCode") }}
              // disabled={watch("disabledDemandedBillInputState")}\
              disabled
              label={<FormattedLabel id="bankIFSC" />}
              {...register("bankIFSCCode")}
              error={!!errors?.bankIFSCCode}
              helperText={
                errors?.bankIFSCCode ? errors?.bankIFSCCode?.message : null
              }
            />
          </Grid>

          {/** BankMICRCode */}
          {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("bankMICRCode") }}
              disabled={watch("disabledDemandedBillInputState")}
              label={<FormattedLabel id="bankMICR" />}
              {...register("bankMICRCode")}
              error={!!errors?.bankMICRCode}
              helperText={
                errors?.bankMICRCode ? errors?.bankMICRCode?.message : null
              }
            />
          </Grid> */}
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default BankDetails;
