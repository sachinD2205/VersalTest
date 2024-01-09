import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../URLS/urls";
import { useGetToken, useLanguage, useGetLoggedInUserDetails, useApplicantType } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import styles from "../../../components/pTax/styles/PropertyRegistractionDocumentUpload.module.css"
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import Translation from "../../streetVendorManagementSystem/components/Translation";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from "@mui/icons-material";
import { useSelector } from "react-redux";
import PropertyRegistractionDocumentUplaodTable from "./PropertyRegistractionDocumentUplaodTable"


/** Author - Sachin Durge */
// PropertyRegistractionDocumentUpload -
const PropertyRegistractionDocumentUpload = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useLanguage();
  const userToken = useGetToken();
  const applicantType = useApplicantType();
  const isDeptUser = useSelector(
    (state) => state?.user?.user?.userDao?.deptUser
  );
  const loggedInUserDetails = useGetLoggedInUserDetails();
  const userID = useSelector(
    (state) => state?.user?.user?.id
  );
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



  //! useEffect -  ================================================>

  useEffect(() => {
    // getDocumentByServiceId();
  }, [])

  useEffect(() => {

  }, [])


  useEffect(() => {
    console.log("09876543", watch("documents"))
  }, [watch("documents")])


  //! =======================>  view
  return (
    <div>

      {/**  Header  */}

      <div className={styles.DivOuter}>
        <div className={styles.Header}>
          <FormattedLabel id="documentTable" />
        </div>
      </div>

      {/**   Body */}
      <div className={styles.DocumentUploadTableOuter}>

        <PropertyRegistractionDocumentUplaodTable />

      </div>

    </div >
  );
};

export default PropertyRegistractionDocumentUpload;
