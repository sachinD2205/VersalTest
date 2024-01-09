import { FormControl, TextField, Tooltip } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";

const Transliteration = (props) => {
  console.log(":a2", props);
  const {
    control,
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isDirty },
  } = useFormContext();
  const router = useRouter();
  const textFieldRef = useRef(null);
  const ref = useRef(null);
  const _token = useSelector((state) => state.user.user.token);

  console.log("props324324", props?.color);

  const handleChange = (value) => {
    console.log("valueeeee", value?.target?.value);
    if (isDirty && !ref.current) {
      console.log("trueee", value?.target?.value);
      console.log("props?.updateFieldName", watch(props?.updateFieldName));

      if (
        value?.target?.value?.trim()?.length !== 0 &&
        props?.sourceLang !== props?.targetLang &&
        (watch(props?.updateFieldName) == null ||
          watch(props?.updateFieldName)?.trim().length === 0)
      ) {
        console.log("All trueee", value?.target?.value);

        setValue("_callTime", moment().format("YYYY-MM-DDTHH:mm:ss.SSSSSS"));

        let token = "LSPCMCATOSUAT";
        let sourceLang = "";
        let targetLang = "";

        if (props?.sourceLang) {
          switch (props?.sourceLang) {
            case "eng":
              sourceLang = "en-US";
              break;
            case "mar":
              sourceLang = "mr-IN";
              break;
            default:
              sourceLang = "";
              break;
          }
        }

        if (props?.targetLang) {
          switch (props?.targetLang) {
            case "eng":
              targetLang = "en-US";
              break;
            case "mar":
              targetLang = "mr-IN";
              break;
            default:
              targetLang = "";
              break;
          }
        }

        switch (location.hostname) {
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

        const data = {
          CustOrigin: "https://172.20.3.104:5000/",
          CustTokenID: token,
          SLngCode: sourceLang,
          TLngCode: targetLang,
          Source: value?.target?.value,
          IsVernacular: true,
        };

        // console.log("!props?.error", !props?.error);
        if (!props?.error) {
          axios
            .post(
              "https://noncoreuat.pcmcindia.gov.in/linguify/api/lsphonetic",
              data,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${_token}`,
                },
              },
            )
            .then((r) => {
              setValue(props?.updateFieldName, r?.data?.result);
              if (props?.targetError) {
                clearErrors(props?.targetError);
              }
              // setResponseTime(moment().format("x"));
              setValue(
                "_responseTime",
                moment().format("YYYY-MM-DDTHH:mm:ss.SSSSSS"),
              );
              setValue(
                "_difference",
                Math.abs(
                  moment(watch("_callTime")).diff(
                    moment(watch("_responseTime")),
                  ),
                ),
              );
              // console.log(r?.data?.result);
              saveTime();
            })
            .catch((error) => {
              // console.log("error", error);
            });
        }
      }
      document.addEventListener("mousedown", ref.current);
    }
  };

  const saveTime = () => {
    const data = {
      callTime: watch("_callTime"),
      responseTime: watch("_responseTime"),
      totalDuration: watch("_difference"),
    };

    // console.log("data55", data);

    axios
      .post(`${urls.CFCURL}/linguosolApiCallLog/save`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        // console.log("resp save", r);
      })
      .catch((error) => {
        // console.log("error", error);
      });
  };

  return (
    <>
      {/* <TextField
        key={props._key}
        disabled={props.disabled}
        autoFocus
        // onChange={
        //   (e) => console.log("called")
        //   // watch(props?.updateFieldName).trim() !== 0 &&
        //   // handleChange(e.target.value)
        // }
        InputLabelProps={{
          shrink:
            (watch(props.fieldName) ? true : false) ||
            (router.query.pplaceOfMarriage ? true : false),
        }}
        id="standard-basic"
        label={<FormattedLabel id="placeofMarriage" required />}
        variant="standard"
        {...register(props.fieldName)}
        onBlur={handleChange}
        error={!!errors?.pplaceOfMarriage}
        helperText={
          errors?.pplaceOfMarriage ? errors.pplaceOfMarriage.message : null
        }
      /> */}

      <FormControl
        // error={errors.employeeId}
        variant="outlined"
        size="small"
        // style={{
        //   // marginTop: props.textFieldMargin != 1 ? "0" : "",
        //   color: "red",
        // }}
        sx={{ width: "100%" }}
      >
        <Controller
          name={props.fieldName}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Tooltip title={props.label}>
              <TextField
                // multiline
                style={{
                  marginTop: props.textFieldMargin != 1 ? "0" : "",
                  backgroundColor: props?.color && props?.color(),
                  width: props.width ? props.width : "100%",
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
                onBlur={handleChange}
                label={props.label}
                error={props.error}
                helperText={props.helperText}
                disabled={props.disabled}
                InputLabelProps={props.InputLabelProps}
                autoFocus={props.autoFocus}
              />
            </Tooltip>
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
