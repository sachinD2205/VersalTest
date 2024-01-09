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
  Paper,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { styled, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  CalendarPicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";

const Index = () => {
  const {
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const language = useSelector((state) => state?.labels.language);
  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  const router = useRouter();

  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);
  const [nocList, setNocList] = useState([]);

  const CustomizedCalendarPicker = styled(CalendarPicker)`


  & .css-1n2mv2k {
    display: 'flex',
    justifyContent: 'spaceAround',
    backgroundColor: 'red',
  }
  & mui-style-mvmu1r{
    display: 'flex',
    justifyContent: 'spaceAround',
    backgroundColor: 'red',
  }
`;

  const { register, control, handleSubmit, methods, reset } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  // Get Table - Data

  // View Record
  const viewRecord = (record) => {
    console.log("rec", record);
    router.push({
      pathname: "/FireBrigadeSystem/transactions/emergencyService/form",
      query: {
        btnSaveText: "Update",
        pageMode: "Edit",
        ...record,
      },
    });
  };

  const onSubmitForm = (fromData) => {};

  // define colums table
  const columns = [
    {
      headerName: "Sr No",
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 200,
    },
    {
      headerName: "Slot",
      field: "slot",
      width: 250,
    },
    {
      headerName: "Application No",
      field: "appno",
      width: 250,
    },

    {
      headerName: "Applicant Name",

      field: "applicantname",
      width: 270,
    },
    {
      headerName: "Service Name",

      field: "servicename",
      width: 230,
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
                padding: "1%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
              }}
            >
              Site Visit Dashboard
            </Typography>
          </Box>
        </Box>
      </Box>

      <FormProvider {...methods}>
        <Paper
          sx={{
            marginLeft: 4,
            marginRight: 4,
            marginTop: 2,
            marginBottom: 1,
            padding: 1,
            border: 1,
          }}
        >
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
            >
              <Grid item xs={3} className={styles.feildres}>
                <Controller
                  control={control}
                  name="slotDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <CustomizedCalendarPicker
                        orientation="landscape"
                        openTo="day"
                        inputFormat="DD/MM/YYYY"
                        shouldDisableDate={isWeekend}
                        value={field.value}
                        onChange={(date) => {
                          //  getSlot(moment(date).format("YYYY-MM-DD"));
                          // setmodalforAppoitment(true),
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
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
