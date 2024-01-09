import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Stack,
  FormHelperText,
  ThemeProvider,
} from "@mui/material";
//import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import theme from "../../../../theme";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const Index = () => {
  const {
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const language = useSelector((state) => state?.labels.language);

  const router = useRouter();

  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);
  const [nocList, setNocList] = useState([]);
  const [inputState, setInputState] = useState(false);

  const { register, control, watch, handleSubmit, methods, reset } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });
  const viewRecord = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      // pathname: `/skySignLicense/transactions/components/FormPreview`,
      // pathname: `/skySignLicense/transactions/components/siteVisit`,
      pathname: `/skySignLicense/transactions/reIssuanceOfIndustry`,

      query: {
        ...record,
      },
    });
  };
  const onSubmitForm = (fromData) => {};

  // define colums table
  const columns = [
    {
      headerName: "Sr No.",
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 150,
    },
    {
      headerName: "Service Name",
      field: "servicenme",
      width: 190,
    },
    {
      headerName: "Application No",
      field: "applno",
      width: 190,
    },

    {
      headerName: "Applicant Name ",
      field: "applicantName",
      width: 190,
    },

    {
      headerName: "Email Address",
      field: "email",
      width: 190,
    },

    {
      headerName: "Mobile No",
      field: "mobile",
      width: 190,
    },

    {
      field: "actions",
      headerAlign: "center",

      headerName: <FormattedLabel id="actions" />,
      // width: "160",

      renderCell: (params) => {
        return (
          <>
            <>
              <IconButton onClick={() => viewRecord(params.row)}>
                <Button endIcon={<VisibilityIcon />} size="small">
                  Print
                </Button>
                {/* <VisibilityIcon /> */}
              </IconButton>
            </>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Box style={{ display: "flex", marginTop: "2%" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            <Typography
              sx={{
                color: "white",
                padding: "0.5%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h1",
                },
              }}
            >
              License Printing
            </Typography>
          </Box>
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <ThemeProvider theme={theme}>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
            >
              <Grid item xs={3} className={styles.feildres}>
                <TextField
                  sx={{ width: 250 }}
                  id="standard-basic"
                  FormattedLabel
                  label={
                    <FormattedLabel id="applicationNumber"></FormattedLabel>
                  }
                  variant="standard"
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
                  }
                />
              </Grid>
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

                alignItem: "center",
                marginTop: "20px",
              }}
            >
              <Typography
                sx={{
                  color: "#808080",
                  padding: "0.5%",
                  typography: {
                    //  xs: "body1",
                    //   sm: "h6",
                    //md: "h5",
                    lg: "h6",
                    xl: "h1",
                  },
                }}
              >
                <FormattedLabel id="or" />
              </Typography>
            </Grid>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
            >
              <Grid item xs={6} className={styles.feildres}>
                <TextField
                  sx={{ width: 250 }}
                  id="standard-basic"
                  label={
                    <span style={{ fontSize: 16, marginTop: 10 }}>
                      License No
                    </span>
                  }
                  variant="standard"
                  {...register("licenseno")}
                  error={!!errors.licenseno}
                  helperText={
                    errors?.licenseno ? errors.licenseno.message : null
                  }
                />
              </Grid>

              <Grid item xs={6} className={styles.feildres}>
                <FormControl sx={{ marginTop: 4 }} error={!!errors.licenseDate}>
                  <Controller
                    name="licenseDate"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={inputState}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16, marginTop: 10 }}>
                              License Date
                            </span>
                          }
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  // fontSize: 12,
                                  // marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.licenseDate ? errors.licenseDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Grid
              item
              // xs={12}
              // sm={12}
              // md={12}
              // lg={12}
              // xl={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
                marginTop: "50px",
              }}
            >
              <Grid item xs={3} className={styles.feildres}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{
                    backgroundColor: "#008CBA",
                    color: "white",
                    marginTop: "30px",
                    marginLeft: "50px",
                  }}
                  // onClick={getDataByApplicationNumber}
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={3} className={styles.feildres}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{
                    backgroundColor: "#008CBA",
                    color: "white",
                    marginTop: "30px",
                    marginLeft: "50px",
                  }}
                  // onClick={getDataByApplicationNumber}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={3} className={styles.feildres}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{
                    backgroundColor: "#008CBA",
                    color: "white",
                    marginTop: "30px",
                    marginLeft: "50px",
                  }}
                  // onClick={getDataByApplicationNumber}
                >
                  Exit
                </Button>
              </Grid>
            </Grid>
          </ThemeProvider>
        </form>
      </FormProvider>

      <Box style={{ height: 400, width: "100%", marginTop: "2rem" }}>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            paddingLeft: "1%",
            paddingRight: "1%",
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box>
    </>
  );
};

export default Index;
