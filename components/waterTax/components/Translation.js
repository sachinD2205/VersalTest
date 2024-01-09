import { TextField, ThemeProvider } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../URLS/urls";
import theme from "../../../theme";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useSelector } from "react-redux";

// Authore - Sachin_Durge 🥰
//! Transalation Component
const Translation = (props) => {
  const {
    control,
    register,
    watch,
    setValue,
    clearErrors,
    trigger,
    formState: { errors, isDirty },
  } = useFormContext();
  const textFieldRef = useRef(null);
  const ref = useRef(null);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const language = useSelector((state) => state?.labels.language);


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

  //! handleChange
  const handleChange = (data) => {
    let token;

    // hostName
    let hostName = location.hostname;
    // sourceLanguageProps
    let sourceLanguageProps = props?.sourceLang;
    // targetLanguageProps
    let targetLanguageProps = props?.targetLang;
    // sourceValue
    let soruceValue = data?.target?.value;

    // updatedFieldName
    let updatedFieldName = props?.updateFieldName;

    // fieldName =
    let filedName = props?.fieldName;

    // propsError
    let propsError = props?.error;

    if (isDirty && !ref?.current) {
      if (
        soruceValue?.trim()?.length !== 0 &&
        sourceLanguageProps !== targetLanguageProps &&
        (watch(updatedFieldName) == null ||
          watch(updatedFieldName)?.trim().length === 0)
      ) {
        setValue("callDateTime", moment().format("YYYY-MM-DDTHH:mm:ss.SSSSSS"));

        switch (hostName) {
          case "localhost":
            token = "LSPCMCATOSLOCALHOST";
            break;
          case "noncoredev.pcmcindia.gov.in":
            token = "LSPCMCATOSDEV";
            break;
          case "noncoreuat.pcmcindia.gov.in":
            token = "LSPCMCATOSUAT";
            break;
          default:
            token = "LSPCMC@&*@#";
            break;
        }

        // data
        const data = {
          CustOrigin: "https://172.20.3.104:5000/",
          CustTokenID: token,
          SLngCode: sourceLanguageProps,
          TLngCode: targetLanguageProps,
          Source: soruceValue,
          IsVernacular: true,
        };

        if (!propsError) {
          axios
            .post(
              "https://noncoreuat.pcmcindia.gov.in/linguify/api/lsphonetic",
              data,
              {
                headers: { "Content-Type": "application/json" },
              }
            )
            .then((r) => {
              let result = r?.data?.result;
              // get Transalted Text and set Updated Filed
              if (result != undefined && result != "" && result != "") {
                setValue(updatedFieldName, result);
                trigger(updatedFieldName);
                trigger(filedName);
              }

              // responseTime
              setValue(
                "responseDateTime",
                moment().format("YYYY-MM-DDTHH:mm:ss.SSSSSS")
              );

              // diffrence
              setValue(
                "diffrenceBetweenCallDateTimeAndDiffrenceBetweenResponseDateTime",
                Math.abs(
                  moment(watch("callDateTime")).diff(
                    moment(watch("responseDateTime"))
                  )
                )
              );

              // saveTime_ApiCall
              saveTime();
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        }
      }
      document.addEventListener("mousedown", ref.current);
    }
  };

  //! saveTime
  const saveTime = () => {
    // url
    const url = `${urls.CFCURL}/linguosolApiCallLog/save`;

    // finalBodyForApi
    const finalBodyForApi = {
      callTime: watch("callDateTime"),
      responseTime: watch("responseDateTime"),
      totalDuration: watch(
        "diffrenceBetweenCallDateTimeAndDiffrenceBetweenResponseDateTime"
      ),
    };

    // api_Call
    axios
      .post(url, finalBodyForApi)
      .then((res) => console.log("response", res))
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("Translation_Api_Errors", error);
      });
  };

  //! ====================> useEffects <========

  useEffect(() => {
    // console.log("Transalation_Component_Props", props);
  }, [props]);

  //! view
  return (
    <ThemeProvider theme={theme}>
      <Controller
        name={props?.fieldName}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            style={{
              marginTop:10,
              // marginTop: props?.textFieldMargin != 1 ? "0" : "",
              backgroundColor: props?.variant && "white",
              width: props?.width ? props?.width : "100%",
            }}
            variant={props?.variant || "standard"}
            id={
              (props?.variant && `${props?.variant}-basic`) || `standard-basic`
            }
            {...field}
            size="small"
            ref={textFieldRef}
            onBlur={handleChange}
            label={props?.label}
            error={props?.error}
            helperText={props?.helperText}
            disabled={props?.disabled}
            InputLabelProps={props?.InputLabelProps}
          />
        )}
      />
    </ThemeProvider>
  );
};

export default Translation;

{
  /* <Translation
  labelName={"firstName"}
  label={<FormattedLabel id='firstName' required />}
  width={230}
  disabled={disabled}
  error={!!errors.bfName}
  helperText={errors?.bfName ? errors.bfName.message : null}
  _key={"bfName"}
  fieldName={"bfName"}
  updateFieldName={"bfNameMr"}
  // English To Marathi
  sourceLang={"en-US"}
  targetLang={"mr-IN"}
  // Marathi to English
   sourceLang={ "mr-IN"}
            targetLang={"en-US"}
/>; */
}
