# Sachin Durge 🥇

## Getting Started

```dev
npm run dev
# or
yarn dev
```

```uat
npm run build
#or
yarn run build
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

"build": "NODE_OPTIONS=\"--max_old_space_size=8192\" next build",

## libraries Used in Project - PCMC

- Material UI (version 5)
- React Hook Form (version 7)
- Yup Validation
- React Redux
- SweetAlert (version 1)
- React Big Calender
- React Toastify
- Rechart js
- React to Print
- React Webcam
- To Words
-

## code snippets 🗝️

### TextField

```
 <TextField
            id="standard-basic"
           // disabled={true}
            label={<FormattedLabel id="fieldName" required />}
            {...register("fieldName")}
            error={!!errors?.fieldName}
            helperText={
              errors?.fieldName ? errors?.fieldName?.message : null
            }
          />
```

### Select

```
const [fieldNames, setFieldNames] = useState([]);
```

```
 <FormControl sx={{ marginTop: 2 }} error={!!errors?.fieldName}>
            <InputLabel
              shrink={watch("fieldName") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="fieldName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                 // disabled={true}
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel required id="fieldName" />}
                >
                  {fieldNames &&
                    fieldNames?.map((fieldName) => (
                      <MenuItem
                        key={fieldName?.id + 1}
                        value={fieldName?.id}
                      >
                        {language == "en"
                          ? fieldName?.fieldNameEn
                          : fieldName?.fieldNameEnMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="fieldName"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.fieldName ? errors?.fieldName?.message : null}
            </FormHelperText>
          </FormControl>

```

### Multiple Select With Check Box

```
 const [events, setEvents] = useState([]);
```

```
 <FormControl variant="standard" error={!!errors.splevent}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="eventName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!watch("searchButtonInputState")}
                  label="Events"
                  multiple
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  renderValue={(val) =>
                    watch("splevent")
                      .map((j) => {
                        if (language == "en") {
                          return events.find((obj) => obj.id == j)?.eventNameEn;
                        } else {
                          return events.find((obj) => obj.id == j)?.eventNameMr;
                        }
                      })
                      .join(",")
                  }
                >
                  {events.map((obj) => (
                    <MenuItem key={obj.id} value={obj.id}>
                      <Checkbox
                        checked={watch("splevent")?.includes(obj?.id)}
                      />
                      <ListItemText
                        primary={
                          language == "en" ? obj.eventNameEn : obj.eventNameMr
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
              )}
              name="splevent"
              control={control}
              defaultValue={[]}
            />
            <FormHelperText>
              {errors?.splevent ? errors?.splevent?.message : null}
            </FormHelperText>
          </FormControl>

```

### Multi Select With Auto Complete

```
  const [departments, setDepartments] = useState([]);
```

```
   <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={departments ? departments : []}
                        disableCloseOnSelect
                        getOptionLabel={(option) => {
                          return language === "en"
                            ? option.departmentEn
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : option.departmentMr
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ");
                        }}
                        onChange={handleSelect}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.departmentEn
                              : option.departmentMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: "320px", margin: 0 }}
                            variant="standard"
                            {...params}
                            label={<FormattedLabel id="departmentName" />}
                          />
                        )}
                      />

```

```
zoneKey: yup
  .array()
  .of(yup.number().required(<FormattedLabel id='zoneNameValidation' />))
  .min(1, <FormattedLabel id='zoneNameValidation' />)
  .required(<FormattedLabel id='zoneNameValidation' />);

```

### Singel Select With Auto Complete

```
 const [courtNames, setCourtNames] = useState([]);
```

```
  <FormControl
                error={!!errors?.priviouseCourtName}
                sx={{ marginTop: 2 }}
              >
                <Controller
                  name="priviouseCourtName"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      variant="standard"
                      id="controllable-states-demo"
                      sx={{ width: 300 }}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : null);
                        setDropDownValue(true);
                        //! store Selected id -- dont change here
                      }}
                      value={
                        courtNames?.find((data) => data?.id === value) || null
                      }
                      options={courtNames ? courtNames : []  } //! api Data
                      getOptionLabel={(courtName) =>
                        language == "en"
                          ? courtName?.courtName
                          : courtName?.courtMr
                      } //! Display name the Autocomplete
                      renderInput={(params) => (
                        //! display lable list
                        <TextField
                          fullWidth
                          {...params}
                          label={<FormattedLabel id="prevCourtName" required />}
                          variant="standard"
                        />
                      )}
                      disabled={disabledButtonInputState}
                    />
                  )}
                />
                <FormHelperText>
                  {errors?.priviouseCourtName
                    ? errors?.priviouseCourtName?.message
                    : null}
                </FormHelperText>
              </FormControl>


```

## Report

````
/* eslint-disable react-hooks/exhaustive-deps */
import PrintIcon from "@mui/icons-material/Print";
import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../URLS/urls";
import PropertyTaxShapeInformationCSS from "./propertyTaxShapeInformation.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Author - Sachin Durge */
// IssuanceOfStreetVendorlicensecertificate
const PropertyTaxShapeInformation = () => {
  // language
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();
  // useForm
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });
  // destructure values from methods
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;
  const componentRef = useRef();
  const router = useRouter();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [propertyTaxShapeInformationData, setPropertyTaxShapeInformationData] = useState();


  // callCatchMethod
  const callCatchMethod = (error, language) => {
    console.log("catchMethodStatus", catchMethodStatus);
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  // HandleToPrintButton
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  // certificateData
  const getPropertyTaxShapeInformation = () => {
    setValue("loadderState", true);
     const  url = `${urls.HMSURL}/hawkerLiscenseCertificate/getById?issuanceOfliscenseId=${id}`;


    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          if (typeof r?.data == "object" && r?.data != undefined) {
            const finalDataOP = {
              ...r?.data,
              loadderState: true,
            };
            reset(finalDataOP);
            setPropertyTaxShapeInformationData(r?.data);
          }
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };



  // ! =========================> useEffects <===============

  // idSet
  useEffect(() => {
    setValue("loadderState", true);
    if (
      localStorage.getItem("id") != null &&
      localStorage.getItem("id") != "" &&
      localStorage.getItem("id") != undefined
    ) {
      setIssuanceOfHawkerLicenseId(
        localStorage.getItem("id")
      );
    }
    else {
      setValue("loadderState", false);
    }
  }, []);

  // api
  useEffect(() => {
    if (id != null && id != undefined && id != "") {
      getPropertyTaxShapeInformation();
    }
  }, [
    id
  ]);


  useEffect(() => {
    console.log("certificateData", cer)
  }, [certificateData]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <Paper elevation={0} className={PropertyTaxShapeInformationCSS.Paper}>
          {/**Stack */}
          <Stack spacing={5} direction="row" className={PropertyTaxShapeInformationCSS.Stack}>
            {/** Print Button */}
            <Button
              variant="contained"
              type="primary"
              startIcon={<PrintIcon />}
              style={{ float: "right" }}
              onClick={() => handlePrint()}
            >
              {<FormattedLabel id="print" />}
            </Button>
            {/** Back Button */}
            <Button
              onClick={() => {
                localStorage.removeItem("id");
                if (localStorage.getItem("loggedInUser") == "citizenUser") {
                  router.push("/dashboard");
                } else {
                  router.push("/streetVendorManagementSystem/dashboards");
                }
              }}
              type="button"
              variant="contained"
              color="primary"
            >
              {<FormattedLabel id="back" />}
            </Button>
          </Stack>

          {/** componentToPrint */}
          <div className={PropertyTaxShapeInformationCSS.ComponentToPrint}>
            <ComponentToPrint
              ref={componentRef}
              propertyTaxShapeInformationData={propertyTaxShapeInformationData}
              language={language}
            />
          </div>
        </Paper>
      )}
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends React.Component {
  // render
  render() {
    // Print_view;
    return (<>
      <h1>Hello Bhava</h1>
      <h1>Kasa Aahes</h1>
    </>);
  }
}

export default PropertyTaxShapeInformation;

```

### Modal
```
// Modal States
const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
 const approveRevertRemarkDailogOpen = () =>
    setApproveRevertRemarkDailog(true);
  const approveRevertRemarkDailogClose = () =>
    setApproveRevertRemarkDailog(false);
  //=========================================


```

```
 <Button
                                variant="contained"
                                onClick={() => approveRevertRemarkDailogOpen()}
                              >
                                {<FormattedLabel id="action" />}
                              </Button>

```


```
{/** Approve Button   Preview Dailog  */}
                      <Modal
                        open={approveRevertRemarkDailog}
                        onClose={() => approveRevertRemarkDailogClose()}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 5,
                        }}
                      >
                        <Paper
                          sx={{
                            padding: 2,
                            height: "400px",
                            width: "600px",
                          }}
                          elevation={5}
                          component={Box}
                        >
                          <Grid container>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                style={{
                                  marginBottom: "30px",
                                  marginTop: "20px",
                                }}
                                variant="h6"
                              >
                                {
                                  <FormattedLabel id="enterRemarkForApplication" />
                                }
                              </Typography>
                              <br />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <TextareaAutosize
                                style={{
                                  width: "550px",
                                  height: "200px",
                                  display: "flex",
                                  justifyContent: "center",
                                  marginBottom: "30px",
                                }}
                                {...register("verificationRemark")}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Stack spacing={5} direction="row">
                                <Button
                                  variant="contained"
                                  style={{ backgroundColor: "green" }}
                                  onClick={() => remarkFun("Approve")}
                                >
                                  {<FormattedLabel id="approve" />}
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => remarkFun("Revert")}
                                >
                                  {<FormattedLabel id="reassign" />}
                                </Button>
                                {/** Form Preview Button */}
                                <Button
                                  style={{ backgroundColor: "red" }}
                                  onClick={() =>
                                    approveRevertRemarkDailogClose()
                                  }
                                >
                                  {<FormattedLabel id="exit" />}
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Modal>

```
````
