import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./billGenerationAndTaxCollection.module.css";

import {
  Paper,
  Button,
  Radio,
  RadioGroup,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { Clear, ExitToApp, Save, Search } from "@mui/icons-material";
import axios from "axios";
import URLs from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const userToken = useGetToken();

  const [circleData, setCircleData] = useState([
    { id: 1, circleEn: "", circleMr: "" },
  ]);
  const [areaData, setAreaData] = useState([{ id: 1, areaEn: "", areaMr: "" }]);
  const [usageTypeData, setUsageTypeData] = useState([
    { id: 1, usageTypeEn: "", usageTypeMr: "" },
  ]);
  const [subUsageTypeData, setSubUsageTypeData] = useState([
    { id: 1, subUsageTypeEn: "", subUsageTypeMr: "" },
  ]);
  const [propertySubTypeData, setPropertySubTypeData] = useState([
    { id: 1, propertySubTypeEn: "", propertySubTypeMr: "" },
  ]);

  let schema = yup.object().shape({
    nameEn: yup.string().required("Please enter pet animal name in english"),
    nameMr: yup.string().required("Please enter pet animal name in marathi"),
  });

  const {
    register,
    reset,
    watch,
    // handleSubmit,
    control,
    setValue,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    //Get Circle
    axios
      .get(`${URLs.PTAXURL}/master/circle/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setCircleData(
          res.data.circle.map((j) => ({
            id: j.id,
            circleEn: j.circleName,
            circleMr: j.circleNameMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));

    //Get Area
    axios
      .get(`${URLs.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAreaData(
          res.data.area.map((j) => ({
            id: j.id,
            areaEn: j.areaName,
            areaMr: j.areaNameMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  }, []);

  return (
    <>
      <Head>
        <title>Bill Generation and Tax Collection</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Bill Generation and Tax Collection</div>
        <form>
          <div className={styles.row}>
            <FormControl
              // disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.billType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="billType" /> */}
                Bill Type
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="billType"
                  >
                    <MenuItem key={1} value={"newBill"}>
                      {language == "en" ? "New Bill" : "नवीन बील"}
                    </MenuItem>
                    <MenuItem key={1} value={"normalBill"}>
                      {language == "en" ? "Normal Bill" : "साधारण बील"}
                    </MenuItem>
                    <MenuItem key={1} value={"newBill"}>
                      {language == "en"
                        ? "Revaluation Bill"
                        : "पुनर्मूल्यांकन बील"}
                    </MenuItem>

                    {/* {financialYear &&
                      financialYear.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.financialYearEn
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.financialYearEn
                            : // @ts-ignore
                              value?.financialYearMr}
                        </MenuItem>
                      ))} */}
                  </Select>
                )}
                name="billType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.billType ? error.billType.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              // disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.circle}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="circle" /> */}
                Circle
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="circle"
                  >
                    {circleData &&
                      circleData.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.circleEn
                            : // @ts-ignore
                              value?.circleMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="circle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.circle ? error.circle.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              // disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.area}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="area" /> */}
                Area
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="area"
                  >
                    {areaData &&
                      areaData.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.areaEn
                            : // @ts-ignore
                              value?.areaMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="area"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.area ? error.area.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              // disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.usageType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="usageType" /> */}
                Usage Type
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="usageType"
                  >
                    {usageTypeData &&
                      usageTypeData.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.usageTypeEn
                            : // @ts-ignore
                              value?.usageTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="usageType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.usageType ? error.usageType.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div className={styles.row}>
            <FormControl
              // disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.subUsageType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="subUsageType" /> */}
                Sub Usage Type
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="subUsageType"
                  >
                    {subUsageTypeData &&
                      subUsageTypeData.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.subUsageTypeEn
                            : // @ts-ignore
                              value?.subUsageTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="subUsageType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.subUsageType ? error.subUsageType.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              // disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.propertyType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="propertyType" /> */}
                Property Type
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="propertyType"
                  >
                    {/* {financialYear &&
                      financialYear.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.financialYearEn
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.financialYearEn
                            : // @ts-ignore
                              value?.financialYearMr}
                        </MenuItem>
                      ))} */}
                  </Select>
                )}
                name="propertyType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.propertyType ? error.propertyType.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              // disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.propertySubType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="propertySubType" /> */}
                Property Sub Type
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="propertySubType"
                  >
                    {propertySubTypeData &&
                      propertySubTypeData.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.propertySubTypeEn
                            : // @ts-ignore
                              value?.propertySubTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="propertySubType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.propertySubType ? error.propertySubType.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "200px" }}
              //   label={<FormattedLabel id="propertyNo" />}
              label="Property No."
              variant="standard"
              {...register("propertyNo")}
              InputLabelProps={{
                shrink: router.query.id || watch("propertyNo") ? true : false,
              }}
              error={!!error.propertyNo}
              helperText={error?.propertyNo ? error.propertyNo.message : null}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={router.query.id ? true : false}
                      sx={{ color: "#1976D2" }}
                      onClick={() => {
                        // getPetData();
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={styles.row}>
            <FormControl
              // disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!error.property}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="property" /> */}
                Select Property
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="property"
                  >
                    {/* {financialYear &&
                      financialYear.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.financialYearEn
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.financialYearEn
                            : // @ts-ignore
                              value?.financialYearMr}
                        </MenuItem>
                      ))} */}
                  </Select>
                )}
                name="property"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.property ? error.property.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "200px" }}
              //   label={<FormattedLabel id="ownerName" />}
              label="Owner Name"
              variant="standard"
              {...register("ownerName")}
              InputLabelProps={{
                shrink: router.query.id || watch("ownerName") ? true : false,
              }}
              error={!!error.ownerName}
              helperText={error?.ownerName ? error.ownerName.message : null}
            />
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "200px" }}
              //   label={<FormattedLabel id="occupierName" />}
              label="Occupier Name"
              variant="standard"
              {...register("occupierName")}
              InputLabelProps={{
                shrink: router.query.id || watch("occupierName") ? true : false,
              }}
              error={!!error.occupierName}
              helperText={
                error?.occupierName ? error.occupierName.message : null
              }
            />
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "200px" }}
              //   label={<FormattedLabel id="selectedCount" />}
              label="Selected Count"
              variant="standard"
              {...register("selectedCount")}
              InputLabelProps={{
                shrink:
                  router.query.id || watch("selectedCount") ? true : false,
              }}
              error={!!error.selectedCount}
              helperText={
                error?.selectedCount ? error.selectedCount.message : null
              }
            />
          </div>
          <div className={styles.row}>
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "200px" }}
              //   label={<FormattedLabel id="totalCount" />}
              label="Total Count"
              variant="standard"
              {...register("totalCount")}
              InputLabelProps={{
                shrink: router.query.id || watch("totalCount") ? true : false,
              }}
              error={!!error.totalCount}
              helperText={error?.totalCount ? error.totalCount.message : null}
            />
          </div>

          <div className={styles.buttons}>
            <Button variant="contained" color="success" endIcon={<Save />}>
              Save
            </Button>
            <Button variant="outlined" color="error" endIcon={<Clear />}>
              Clear
            </Button>
            <Button variant="contained" color="error" endIcon={<ExitToApp />}>
              Exit
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default Index;
