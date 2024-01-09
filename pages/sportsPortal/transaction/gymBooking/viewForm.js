import { Button, Paper, ThemeProvider } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { IssuanceOfHawkerLicenseCitizenSchema } from "../../../../components/streetVendorManagementSystem/schema/issuanceOfHawkerLicenseSchema";
import theme from "../../../../theme";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import BookingDetailsSwimming from "../components/BookingDetailsSwimming";
import EcsDetails from "../components/EcsDetails";
import PersonalDetails from "../components/PersonalDetails";
import BookingDetailsGym from "../components/BookingDetailsGym";
import BookingPersonDetailsGym from "../components/BookingPersonDetailsGym";
const Citizen = () => {
  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(IssuanceOfHawkerLicenseCitizenSchema),
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: {},
  } = methods;
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [loadderState, setLoadderState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setid] = useState();
  const [shrinkTemp, setShrinkTemp] = useState(false);
  const [applicationRevertedToCititizen, setApplicationRevertedToCititizen] = useState(false);
  const [applicationRevertedToCititizenNew, setApplicationRevertedToCititizenNew] = useState(true);
  let user = useSelector((state) => state.user.user);
  const handleNext = (data) => {
    let userType;

    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "CFC_USER") {
      userType = 2;
    } else if (localStorage.getItem("loggedInUser") == "DEPT_USER") {
      userType = 3;
    }

    console.log("user.id", user?.id);

    const finalBodyForApi = {
      ...data,
      applicationStatus: "APPLICATION_CREATED",
      pageMode: "APPLICATION_CREATED",
      id: id,
      activeFlag: "Y",
      serviceId: 24,
      crCityNameMr: "पिंपरी चिंचवड",
      crStateMr: "महाराष्ट्र",
      serviceName: "Issuance Of Hawker License",
      createdUserId: user?.id,
      userType: userType,
    };

    axios
      .post(`${urls.HMSURL}/IssuanceofHawkerLicense/saveIssuanceOfHawkerLicense`, finalBodyForApi, {
        headers: {
          role: "CITIZEN",
        },
      })
      .then((res) => {
        console.log("res?.stasdf", res);
        if (res?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setLoading(false);
          res?.data?.id
            ? sweetAlert("Submitted!", res?.data?.message, "success")
            : sweetAlert("Submitted !", res?.data?.message, "success");
          if (localStorage.getItem("loggedInUser") == "departmentUser") {
            setLoadderState(false);
            router.push(`/streetVendorManagementSystem`);
          } else {
            setLoadderState(false);
            router.push(`/dashboard`);
          }
        } else {
          setLoadderState(false);
          setLoading(false);
         
        }
      })
      .catch((err) => {
        setLoadderState(false);
        setLoading(false);
       
      });
  };

  // getHawkerLiceseData
  const getData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.SPURL}/gymBooking/getById?id=${id}`)
      .then((r) => {
        console.log("54332313456", r?.data);
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log("hawkerLicenseData", r?.data);
          reset(r.data);
          if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
            setValue("disabledFieldInputState", false);
          } else {
            setValue("disabledFieldInputState", true);
          }
          setShrinkTemp(true);
          setLoadderState(false);
        } else {
          setLoadderState(false);
          setShrinkTemp(true);
         
        }
      })
      .catch(() => {
        setLoadderState(false);
        setShrinkTemp(true);
       
      });
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (localStorage.getItem("id") != null || localStorage.getItem("id") != "") {
      setid(localStorage.getItem("id"));
    }
    if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
      setApplicationRevertedToCititizen(true);
      setApplicationRevertedToCititizenNew(false);
      setValue("disabledFieldInputState", true);
    } else {
      setApplicationRevertedToCititizen(false);
      setApplicationRevertedToCititizenNew(true);
      setValue("disabledFieldInputState", false);
    }
  }, []);

  useEffect(() => {}, [watch("disabledFieldInputState")]);
  useEffect(() => {}, [setApplicationRevertedToCititizen, setApplicationRevertedToCititizen]);

  // view
  return (
    <>
      {shrinkTemp && (
        <div>
          <ThemeProvider theme={theme}>
            {loadderState ? (
              <Loader />
            ) : (
              <Paper
                square
                sx={{
                  // margin: 5,
                  padding: 1,
                  // paddingTop: 5,
                  paddingTop: 5,
                  paddingBottom: 5,
                  backgroundColor: "white",
                }}
                elevation={5}
              >
                <br /> <br />
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handleNext)} sx={{ marginTop: 10 }}>
                    <BookingDetailsGym />
                    <BookingPersonDetailsGym />

                    <Button
                      onClick={() => {
                        localStorage.removeItem("id");
                        router.push("/dashboard");
                      }}
                      type="button"
                      variant="outlined"
                      color="primary"
                    >
                      {<FormattedLabel id="back" />}
                    </Button>
                  </form>
                </FormProvider>
              </Paper>
            )}
          </ThemeProvider>
        </div>
      )}
    </>
  );
};

export default Citizen;
