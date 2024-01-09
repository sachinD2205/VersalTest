import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css";
import styles from "../styles/view.module.css";
import { catchExceptionHandlingMethod } from "../../../util/util";

let drawerWidth;

/** Authore - Sachin Durge */
// ConnectionDetails
const ConnectionDetails = () => {
  const {
    control,
    register,
    setValue,
    getValues,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [addressShrink, setAddressShrink] = useState();
  const [connectionSize, setConnectionSize] = useState([]);
  const [connectionType, setConnectionType] = useState([]);
  const [usageType, setUsageType ] = useState([]);
  const [open, setOpen] = useState(false);
  
  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "50%";
  };


  // View
  return (
    <>
      {/** Main Component  */}
      <div className={HawkerReusableCSS.MainHeader}>
        {<FormattedLabel id="connectionDetails" />}
      </div>
      <div className={styles.flexMain}>
        <Grid container className={HawkerReusableCSS.GridContainer}>

          {/** connectionSize */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.connectionSize}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("connectionSize") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="connectionSize" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    label={<FormattedLabel id="connectionSize" required />}
                  >
                    {connectionSize &&
                      connectionSize?.map((connectionSize) => (
                        <MenuItem key={connectionSize?.id} value={connectionSize?.id}>
                          {language == "en"
                            ? connectionSize?.connectionSize
                            : connectionSize?.connectionSizeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="connectionSize"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.connectionSize ? errors?.connectionSize?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** noOfTaps */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              id="standard-basic"
              disabled={watch("disabledFieldInputState")}
              label={<FormattedLabel id="noOfTaps" required />}
              {...register("noOfTaps")}
              error={!!errors?.noOfTaps}
              helperText={
                errors?.noOfTaps ? errors?.noOfTaps?.message : null
              }
            />
          </Grid>
        
          {/** connectionType */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.connectionType}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("connectionType") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="connectionType" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    label={<FormattedLabel id="connectionType" required />}
                  >
                    {connectionType &&
                      connectionType?.map((connectionType) => (
                        <MenuItem key={connectionType?.id} value={connectionType?.id}>
                          {language == "en"
                            ? connectionType?.connectionType
                            : connectionType?.connectionTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="connectionType"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.connectionType ? errors?.connectionType?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** noOfFamily */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              id="standard-basic"
              disabled={watch("disabledFieldInputState")}
              label={<FormattedLabel id="noOfFamily" required />}
              {...register("noOfFamily")}
              error={!!errors?.noOfFamily}
              helperText={
                errors?.noOfFamily ? errors?.noOfFamily?.message : null
              }
            />
          </Grid>

           {/** usageType */}
           <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.usageType}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("usageType") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="usageType" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    label={<FormattedLabel id="usageType" required />}
                  >
                    {usageType &&
                      usageType?.map((usageType) => (
                        <MenuItem key={usageType?.id} value={usageType?.id}>
                          {language == "en"
                            ? usageType?.usageType
                            : usageType?.usageTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="usageType"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.usageType ? errors?.usageType?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* {watch("disabledFieldInputState") ? (
            <>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              ></Grid>
            </>
          ) : (
            <>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              >
                <Button
                  className={HawkerReusableCSS.viewMapLocationButton}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleDrawerOpen();
                  }}
                >
                  <FormattedLabel id="viewLocationOnMap" />
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              ></Grid>
            </>
          )} */}
        </Grid>
      </div>
    
    </>
  );
};

export default ConnectionDetails;
