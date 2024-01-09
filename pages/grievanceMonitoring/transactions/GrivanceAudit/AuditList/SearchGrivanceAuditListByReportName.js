import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import AuditListStyle from "./AuditList.module.css";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";

const SearchGrivanceAuditListByReportName = () => {
  const {
    control,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  let user = useSelector((state) => state?.user?.user);
  const router = useRouter();
  const [auditNames, setAuditNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // getReportName
  const getReportName = () => {
    setIsLoading(true);
    let url = `${urls.GM}/internalAuditMaster/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res?.status == 200 || res?.status == 201) {
          let data = res?.data?.internalAuditMasterList?.map((row) => ({
            id: row?.id,
            auditName: row?.auditName,
            auditedDate: row?.auditedDate,
            auiditStatus: row?.status,
          }));
          setAuditNames(data.sort(sortByProperty("auditName")));
        } else {
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };
  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };
  //cancellButton
  const cancellButton = () => {
    setValue("reportTitle", null);
    setValue("TokenHistoryDetails", null);
    setValue("AuditList", []);
    setValue("GrivanceAuditListTableData", []);
    setValue("TokenHistoryDetails", []);
    setValue("tokenNo", "");
    setValue("searchInputState", true);
    clearErrors();
  };

  //exitButton
  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };



  useEffect(() => {
    getReportName();
  }, []);


  // View
  return (
    <>
      {isLoading && <CommonLoader />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "auto",
          overflow: "auto",
          padding: "0.5%",
          color: "white",
          fontSize: "18.72px",
          borderRadius: 100,
          fontWeight: 500,
          background:
            "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
        }}
      >
        <strong className={AuditListStyle.SearchHeader}>
          {language == "en" ? "Audit List" : "ऑडिट यादी"}
        </strong>
      </div>

      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
        }}
        className={AuditListStyle.Grid}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={AuditListStyle.GridItem}
        >
          <FormControl
            style={{ width: "400px" }}
            variant="standard"
            error={!!errors?.reportTitle}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="auditName" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  style={{ width: "400px" }}
                  disabled={!watch("searchInputState")}
                  value={field.value}
                  defaultValue={null}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="departmentName" />}
                >
                  {auditNames &&
                    auditNames.map((auditName, index) => (
                      <MenuItem key={index} value={auditName?.auditName}>
                        {language == "en"
                          ? auditName?.auditName
                          : auditName?.auditName}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="reportTitle"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.reportTitle ? errors?.reportTitle?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      {/** Buttons*/}
      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent="center"
        alignItems="center"
        paddingBottom="5"
        marginTop="5"
      >
        <>
          {watch("searchInputState") && (
            <>
             <Button
                variant="contained"
                color="error"
                size="small"
                endIcon={<ExitToAppIcon />}
                onClick={() => exitButton()}
              >
                <FormattedLabel id="exit" />
              </Button>
            

              <Button
                variant="contained"
                color="primary"
                size="small"
                endIcon={<ClearIcon />}
                onClick={() => cancellButton()}
              >
                <FormattedLabel id="clear" />
              </Button>
              <Button
                type="submit"
                size="small"
                onClick={() => {
                  setValue("buttonName", "SubmitButton");
                }}
                variant="contained"
                color="success"
                endIcon={<SearchIcon />}
              >
                {language == "en" ? "Search" : "शोधा"}
              </Button>
            </>
          )}
        </>
      </Stack>
    </>
  );
};

export default SearchGrivanceAuditListByReportName;
