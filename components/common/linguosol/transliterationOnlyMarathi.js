import { FormControl, TextField } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";

const Transliteration = (props) => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors /* , isDirty */ },
  } = useFormContext();
  const router = useRouter();
  const textFieldRef = useRef(null);
  const ref = useRef(null);
  const [textStore, setTextStore] = useState("");
  const token = useSelector((state) => state.user.user.token);

  // console.log("props", props);

  const handleChange = (value) => {
    // if (isDirty && !ref.current) {
    console.log("valueeeee", value);
    if (
      value?.target?.value?.trim()?.length !== 0 &&
      props?.sourceLang !== props?.targetLang
    ) {
      setValue("_callTime", moment().format("YYYY-MM-DDTHH:mm:ss.SSSSSS"));

      setTextStore(textStore + value?.nativeEvent?.data);

      let source = textStore + value?.nativeEvent?.data;
      let token = "LSPCMCATOSUAT";
      switch (location.hostname) {
        case "localhost":
          token = "LSPCMCATOSLOCALHOST";
          break;
        case "https://noncoredev.pcmcindia.gov.in/":
          token = "LSPCMCATOSDEV";
          break;
        case "https://noncoreuat.pcmcindia.gov.in/":
          token = "LSPCMCATOSUAT";
          break;
        default:
          token = "LSPCMC@&*@#";
          break;
      }
      const data = {
        CustOrigin: "https://172.20.3.104:5000/",
        CustTokenID: token,
        SLngCode: props?.sourceLang,
        TLngCode: props?.targetLang,
        Source: source,
        IsVernacular: true,
      };

      // console.log("data", data);

      axios
        .post(
          "https://noncoreuat.pcmcindia.gov.in/linguify/api/lsphonetic",
          data,
          {
            headers: { "Content-Type": "application/json" },
            Authorization: `Bearer ${token}`,
          }
        )
        .then((r) => {
          setValue(props?.fieldName, r?.data?.result);
          // setResponseTime(moment().format("x"));
          // setValue(
          //   "_responseTime",
          //   moment().format("YYYY-MM-DDTHH:mm:ss.SSSSSS")
          // );
          // setValue(
          //   "_difference",
          //   Math.abs(
          //     moment(watch("_callTime")).diff(moment(watch("_responseTime")))
          //   )
          // );
          // console.log(r?.data?.result);
          // saveTime();
        })
        .catch((error) => {
          // console.log("error", error);
        });
    }
    // document.addEventListener("mousedown", ref.current);
    // }
  };

  // const saveTime = () => {
  //   const data = {
  //     callTime: watch("_callTime"),
  //     responseTime: watch("_responseTime"),
  //     totalDuration: watch("_difference"),
  //   };

  //   // console.log("data55", data);

  //   axios
  //     .post(`${urls.CFCURL}/linguosolApiCallLog/save`, data)
  //     .then((r) => {
  //       // console.log("resp save", r);
  //     })
  //     .catch((error) => {
  //       // console.log("error", error);
  //     });
  // };

  return (
    <>
      <FormControl
        // error={errors.employeeId}
        variant="outlined"
        size="small"
        sx={{ width: "90%" }}
      >
        <Controller
          name={props.fieldName}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              style={{
                marginTop: "0",
                backgroundColor: "white",
                width: "100%",
              }}
              // variant="standard"
              variant={props?.variant || "standard"}
              // id="standard-basic"
              id={
                (props?.variant && `${props?.variant}-basic`) ||
                `standard-basic`
              }
              {...field}
              size="small"
              ref={textFieldRef}
              onChange={(e) => handleChange(e)}
              // onBlur={handleChange}
              label={props.label}
              error={props.error}
              helperText={props.helperText}
              disabled={props.disabled}
              InputLabelProps={props.InputLabelProps}
            />
          )}
        />
        {/* <FormHelperText>
          {errors?.employeeId ? errors.employeeId.message : null}
        </FormHelperText> */}
      </FormControl>
    </>
  );
};

export default Transliteration;
