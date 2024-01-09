import axios from "axios";
import {
  FormControl,
  FormHelperText,
  TextField,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import theme from "../../../theme";
import moment from "moment";
import urls from "../../../URLS/urls";
import { useSelector } from "react-redux";

const googleTranslation = (props) => {
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
  //  Authore @vishalbibe1111

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

        let sourceLang = "";
        let targetLang = "";

        if (props?.sourceLang) {
          switch (props?.sourceLang) {
            case "en":
              sourceLang = "en";
              break;
            case "mr":
              sourceLang = "mr";
              break;
            default:
              sourceLang = "";
              break;
          }
        }

        if (props?.targetLang) {
          switch (props?.targetLang) {
            case "en":
              targetLang = "en";
              break;
            case "mr":
              targetLang = "mr";
              break;
            default:
              targetLang = "";
              break;
          }
        }

        const _newData = {
          apiKey: "Alpesh",
          textToTranslate: value?.target?.value,
          languagetype: sourceLang,
        };

        if (!props?.error) {
          axios
            .post(`${urls?.GOOGLETRANSLATIONAPI}`, _newData)
            .then((r) => {
              console.log("_newData", r);
              setValue(props?.updateFieldName, r?.data);
              if (props?.targetError) {
                clearErrors(props?.targetError);
              }
            })
            .catch((error) => {
              // console.log("error", error);
            });
        }
      }
      document.addEventListener("mousedown", ref.current);
    }
  };

  return (
    <>
      {props?.textArea === true ? (
        <FormControl variant="outlined" size="small" sx={{ width: "90%" }}>
          <Controller
            name={props.fieldName}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Tooltip title={props.label}>
                <TextField
                  multiline
                  fullWidth
                  rows={5}
                  style={{
                    border: "1px  solid blue",
                    padding: "2px",
                  }}
                  variant={props?.variant || "standard"}
                  placeholder={props?.placeholder ?? ""}
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
                  defaultValue={props.defaultValue ?? ""}
                />
              </Tooltip>
            )}
          />
        </FormControl>
      ) : props?.forAdvParaRequest === true ? (
        <FormControl variant="outlined" size="small" sx={{ width: "90%" }}>
          <Controller
            name={props.fieldName}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Tooltip title={props.label}>
                <TextField
                  multiline
                  fullWidth
                  rows={3}
                  style={{
                    backgroundColor: "LightGray",
                    border: "1px solid",
                  }}
                  variant={props?.variant || "standard"}
                  placeholder={props?.placeholder ?? ""}
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
                  defaultValue={props.defaultValue ?? ""}
                />
              </Tooltip>
            )}
          />
        </FormControl>
      ) : (
        <FormControl variant="outlined" size="small" sx={{ width: "90%" }}>
          <Controller
            name={props.fieldName}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Tooltip title={props.label}>
                <TextField
                  multiline
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
                  defaultValue={props.defaultValue ?? ""}
                />
              </Tooltip>
            )}
          />
        </FormControl>
      )}
    </>
  );
};

export default googleTranslation;
