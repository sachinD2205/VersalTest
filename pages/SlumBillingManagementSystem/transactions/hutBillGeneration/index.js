import React, { useEffect, useState } from "react";
import Head from "next/head";
// import styles from "../sbms.module.css";
import styles from "../sbms.module.css";
import {
  Paper,
  Button,
  Select,
  MenuItem,
  Box,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridToolbar,
} from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import router from "next/router";
import sweetAlert from "sweetalert";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  // @ts-ignore
  const token = useSelector((state) => state.user.user.token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
  const [huts, setHuts] = useState([]);
  const [slums, setSlums] = useState([
    { id: 1, slumNameEn: "", slumNameMr: "" },
  ]);
  const [table, setTable] = useState([]);
  const [selectedHuts, setSelectedHuts] = useState([]);
  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: "",
      financialYearMr: "",
    },
  ]);
  const headers = { Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const {
    // register,
    reset,
    watch,
    // handleSubmit,
    control,
    setValue,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    //Get Huts
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((res) => {
        console.log("hutdata", res.data.mstHutList);
        setHuts(
          res.data.mstHutList.map((j, i) => ({
            id: j.id,
            hutNo: j.hutNo,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });

    //Get Slums
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setSlums(
          res.data.mstSlumList.map((j, i) => ({
            srNo: i + 1,
            slumNameEn: j.slumName,
            slumNameMr: j.slumNameMr,
            id: j.id,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });

    //Get Financial Year
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll`, config)
      .then((res) => {
        setFinancialYear(
          res.data.financialYear.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  }, []);
  console.log("table", table);

  useEffect(() => {
    setValue("year", financialYear[0]["financialYearEn"]);
    //Table Data
    getAllForBilling(financialYear[0]["financialYearEn"]);
  }, [huts, slums, financialYear]);

  const getAllForBilling = (year) => {
    console.log("yearrrr", year);
    //Table
    if (year) {
      axios
        .get(`${urls.SLUMURL}/mstHut/getAllForBilling?billYear=${year}`, {
          headers: headers,
        })
        .then((res) => {
          console.log("getAllForBilling", res.data.mstHutList);
          setTable(
            res.data.mstHutList.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              // hutKey: j.id,
              hutNo: j.hutNo,
              slumNameEn: slums.find((obj) => obj.id == j.slumKey)?.slumNameEn,
              slumNameMr: slums.find((obj) => obj.id == j.slumKey)?.slumNameMr,
              ownerName:
                j.ownerFirstName && j.ownerMiddleName && j.ownerLastName
                  ? `${j.ownerFirstName} ${j.ownerMiddleName} ${j.ownerLastName}`
                  : "--",
              ownerNameMr:
                j.ownerFirstNameMr && j.ownerMiddleNameMr && j.ownerLastNameMr
                  ? `${j.ownerFirstNameMr} ${j.ownerMiddleNameMr} ${j.ownerLastNameMr}`
                  : "--",
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  const generateBill = () => {
    const bodyForApi = {
      year: watch("year"),
      hutKeys: selectedHuts,
    };
    axios
      .post(`${urls.SLUMURL}/trnBill/bulk/generate`, bodyForApi, {
        headers: headers,
      })
      .then((res) => {
        if (res?.status === "SUCCESS")
          sweetAlert(
            "Generated!",
            `Hut Bill Generated Successfully !`,
            "success"
          );
        getAllForBilling(watch("year"));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const columns = [
    {
      headerClassName: "cellColor",
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "ownerName" : "ownerNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "slumNameEn" : "slumNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="slumName" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "hutNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="hutNo" />,
      width: 150,
    },
  ];

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Head>
        <title>
          <FormattedLabel id="hutBillGeneration" />
        </title>
      </Head>
      <Paper className={styles.main}>
        {/* <div className={styles.title}>
          <FormattedLabel id="hutBillGeneration" />
        </div> */}

        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FormattedLabel id="hutBillGeneration" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <div className={styles.row} style={{ justifyContent: "center" }}>
          <FormControl
            // disabled={router.query.pageMode == "view" ? true : false}
            variant="standard"
            error={!!error.year}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* <FormattedLabel id="year" /> */}
              <FormattedLabel id="financialYear" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: "250px" }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // @ts-ignore
                  value={field.value}
                  onChange={(value) => {
                    getAllForBilling(value.target.value);
                    field.onChange(value);
                  }}
                  label="year"
                >
                  {financialYear &&
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
                    ))}
                </Select>
              )}
              name="year"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {error?.year ? error.year.message : null}
            </FormHelperText>
          </FormControl>
        </div>
        <div className={styles.row} style={{ justifyContent: "center" }}>
          <DataGrid
            autoHeight
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                // printOptions: { disableToolbarButton: true },
                // disableExport: true,
                // disableToolbarButton: true,
                // csvOptions: { disableToolbarButton: true },
              },
            }}
            sx={{
              // marginLeft: 5,
              // marginRight: 5,
              // marginTop: 5,
              // marginBottom: 5,

              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            rows={table}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(allRowsId) => {
              console.log("allRowsId", allRowsId);
              setSelectedHuts(allRowsId);
            }}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>
        <div
          className={styles.buttons}
          style={{ justifyContent: "space-evenly" }}
        >
         
          <Button
            variant="contained"
            color="error" size="small"
            onClick={() => {
              router.push("/SlumBillingManagementSystem");
            }}
          >
            <FormattedLabel id="exit" />
          </Button>
          <Button variant="contained" size="small" onClick={generateBill}>
            <FormattedLabel id="generate" />
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
