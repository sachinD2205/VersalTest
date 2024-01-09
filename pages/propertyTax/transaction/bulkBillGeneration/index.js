import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../ptaxTransactions.module.css";

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import URLs from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import { ExitToApp, Save } from "@mui/icons-material";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const userToken = useGetToken();

  const [financialYear, setFinancialYear] = useState([
    { id: 1, financialYearEn: "", financialYearMr: "" },
  ]);
  // const [propertyType, setPropertyType] = useState([
  //   { id: 1, propertyTypeEn: '', propertyTypeMr: '' },
  // ])
  // const [propertySubType, setPropertySubType] = useState([
  //   { id: 1, propertySubTypeEn: '', propertySubTypeMr: '' },
  // ])
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [table, setTable] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [runAgain, setRunAgain] = useState(false);

  const {
    reset,
    watch,
    control,
    setValue,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
  });

  useEffect(() => {
    //Get Financial Year
    axios
      .get(`${URLs.CFCURL}/master/financialYearMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setFinancialYear(
          res.data.financialYear.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  }, []);

  useEffect(() => {
    if (financialYear[0]["financialYearEn"] != "") {
      setValue("year", financialYear[0]["id"]);
      //Table Data
      getAllForBilling(financialYear[0]["id"]);
    }
  }, [financialYear, runAgain]);

  const getAllForBilling = (year) => {
    setTable([]);
    setLoadingState(true);
    //Table
    axios
      .post(
        `${URLs.PTAXURL}/transaction/property/bill/getPropertyByForBilling`,
        { financialYearKey: year },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        res.data.forEach((element) => {
          console.log("Full name: ", element.propertyHoldersDetails[0]);
        });
        setTable(
          res.data.map((j, i) => ({
            id: j.id,
            propertyCode: j.propertyCode ?? "Not generated yet",
            propertyNameEn: j.propertyNameEng,
            propertyNameMr: j.propertyNameMr,
            propertyHolderNameEn:
              j.propertyHoldersDetails[0] != undefined
                ? j.propertyHoldersDetails[0].fullNameEng ?? " ---"
                : "---",
            propertyHolderNameMr:
              j.propertyHoldersDetails[0] != undefined
                ? j.propertyHoldersDetails[0].fullNameMr ?? " ---"
                : "---",
          }))
        );
        setRunAgain(false);
        setLoadingState(false);
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  const columns = [
    {
      headerClassName: "cellColor",
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
    },
    // {
    //   headerClassName: "cellColor",
    //   align: "center",
    //   field: "srNo",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="srNo" />,
    //   width: 100,
    // },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "propertyCode",
      headerAlign: "center",
      headerName: <FormattedLabel id="propertyCode" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "propertyHolderNameEn" : "propertyHolderNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="propertyHolderName" />,
      width: 250,
    },
  ];

  const generateBill = () => {
    const propertyCodes = selectedProperties.map(
      (j) => table.find((property) => property.id == j)?.propertyCode
    );
    const bodyForApi = {
      // financialYear: watch('year'),
      // propertyCodes: selectedProperties,
      financialYear: financialYear.find((j) => j.id == Number(watch("year")))
        ?.financialYearEn,
      propertyCode: propertyCodes,
    };

    sweetAlert({
      title: "Confirmation",
      text: "Do you really want to save the application?",
      icon: "warning",
      buttons: ["No", "Yes"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(
            `${URLs.PTAXURL}/transaction/property/bill/generate/bulk`,
            bodyForApi,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            sweetAlert(
              "Generated!",
              "Bills generated in the bulk successfully",
              "success"
            );
            setRunAgain(true);
          })
          .catch((error) => catchExceptionHandlingMethod(error, language));
      }
    });
  };

  return (
    <>
      <Head>
        <title>Bulk Bill Generation</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Bulk Bill Generation</div>
        <div className={styles.row} style={{ justifyContent: "center" }}>
          <FormControl
            // disabled={router.query.pageMode == "view" ? true : false}
            variant="standard"
            error={!!error.year}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="financialYear" />
            </InputLabel>
            {/* @ts-ignore */}
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
                          // value.financialYearEn
                          //@ts-ignore
                          value.id
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
            sx={{
              marginTop: "2vh",
              maxWidth: "85%",

              "& .cellColor": {
                backgroundColor: "#125597",
                color: "white",
              },
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            // disableSelectionOnClick
            onSelectionModelChange={(allRowsId) => {
              // @ts-ignore
              setSelectedProperties(allRowsId);
            }}
            experimentalFeatures={{ newEditingApi: true }}
            loading={loadingState}
          />
        </div>

        <div className={styles.buttons}>
          <Button variant="contained" endIcon={<Save />} onClick={generateBill}>
            <FormattedLabel id="save" />
          </Button>
          <Button
            variant="outlined"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              router.back();
            }}
          >
            <FormattedLabel id="exit" />
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
