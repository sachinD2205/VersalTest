import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import URLs from "../../../URLS/urls";
import styles from "./report.module.css";

import { Button, FormControl, Grid, Paper, TextField } from "@mui/material";
// import FormattedLabel from "/../../containers/reuseableComponents/FormattedLabel";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";

const IpdRegistration = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [runAgain, setRunAgain] = useState(false);
  const [table, setTable] = useState([]);
  const [area, setArea] = useState([{ id: 1, areaEn: "", areaMr: "" }]);
  const [zone, setZone] = useState([{ id: 1, zoneEn: "", zoneMr: "" }]);
  const [ward, setWard] = useState([{ id: 1, wardEn: "", wardMr: "" }]);
  const [petAnimal, setPetAnimal] = useState([
    { id: 1, naemEn: "", nameMr: "" },
  ]);
  const [petAnimalBreed, setPetAnimalBreed] = useState([
    { id: 1, breedNameEn: "", breedNameMr: "" },
  ]);

  const componentRef = useRef(null);

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    // documentTitle: applicationDetails.petName + " License",
  });

  useEffect(() => {
    //Get Area
    axios.get(`${URLs.CFCURL}/master/area/getAll`).then((res) => {
      setArea(
        res.data.area.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          areaEn: j.areaName,
          areaMr: j.areaNameMr,
        }))
      );
    });

    //Get Zone
    axios.get(`${URLs.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(
        res.data.zone.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        }))
      );
    });

    //Get Ward
    axios.get(`${URLs.CFCURL}/master/ward/getAll`).then((res) => {
      setWard(
        res.data.ward.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          wardEn: j.wardName,
          wardMr: j.wardNameMr,
        }))
      );
    });

    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimal(
        res.data.mstPetAnimalList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          nameEn: j.nameEn,
          nameMr: j.nameMr,
        }))
      );
    });

    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setPetAnimalBreed(
        res.data.mstAnimalBreedList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
          petAnimalKey: j.petAnimalKey,
        }))
      );
    });
  }, []);

  const [fDate, setFDate] = useState();
  const [tDate, setTDate] = useState();

  const filDate = moment(fDate).format("DD/MM/YYYY");
  const filTDate = moment(tDate).format("DD/MM/YYYY");

  // Get date From Date and to date
  const getData = () => {
    axios
      .get(
        `${URLs.VMS}/trnAnimalTreatmentIpd/getAllByFromDateAndToDate?fromDate=${filDate}&toDate=${filTDate}`
      )
      .then((res) => {
        console.log("0000", res.data.trnAnimalTreatmentIpdList);
        setTable(
          res.data.trnAnimalTreatmentIpdList.map((j, i) => ({
            srNo: i + 1,
            ...j,
            wardEn: ward.find((obj) => obj.id === j.wardKey)?.wardEn,
            wardMr: ward.find((obj) => obj.id === j.wardKey)?.wardMr,
            areaEn: area.find((obj) => obj.id === j.areaKey)?.areaEn,
            areaMr: area.find((obj) => obj.id === j.areaKey)?.areaMr,
            zoneEn: zone.find((obj) => obj.id === j.zoneKey)?.zoneEn,
            zoneMr: zone.find((obj) => obj.id === j.zoneKey)?.zoneMr,
            petAnimalEn: petAnimal.find(
              (obj) => obj.id === Number(j.animalName)
            )?.nameEn,
            petAnimalMr: petAnimal.find(
              (obj) => obj.id === Number(j.animalName)
            )?.nameMr,
            petAnimalBreedEn: petAnimalBreed.find(
              (obj) => obj.id === j.animalSpeciesKey
            )?.breedNameEn,
            petAnimalBreedMr: petAnimalBreed.find(
              (obj) => obj.id === j.animalSpeciesKey
            )?.breedNameMr,
          }))
        );
      });
  };

  useEffect(() => {
    setRunAgain(false);
    //Get IPD data
    axios.get(`${URLs.VMS}/trnAnimalTreatmentIpd/getAll`).then((res) => {
      console.log("OPD data: ", res.data.trnAnimalTreatmentIpdList);
      setTable(
        res.data.trnAnimalTreatmentIpdList.map((j, i) => ({
          srNo: i + 1,
          ...j,
          wardEn: ward.find((obj) => obj.id === j.wardKey)?.wardEn,
          wardMr: ward.find((obj) => obj.id === j.wardKey)?.wardMr,
          areaEn: area.find((obj) => obj.id === j.areaKey)?.areaEn,
          areaMr: area.find((obj) => obj.id === j.areaKey)?.areaMr,
          zoneEn: zone.find((obj) => obj.id === j.zoneKey)?.zoneEn,
          zoneMr: zone.find((obj) => obj.id === j.zoneKey)?.zoneMr,
          petAnimalEn: petAnimal.find((obj) => obj.id === Number(j.animalName))
            ?.nameEn,
          petAnimalMr: petAnimal.find((obj) => obj.id === Number(j.animalName))
            ?.nameMr,
          petAnimalBreedEn: petAnimalBreed.find(
            (obj) => obj.id === j.animalSpeciesKey
          )?.breedNameEn,
          petAnimalBreedMr: petAnimalBreed.find(
            (obj) => obj.id === j.animalSpeciesKey
          )?.breedNameMr,
        }))
        // res.data.trnAnimalTreatmentIpdList,
      );
    });
  }, [runAgain, area, zone, ward, petAnimal, petAnimalBreed]);

  const columns = [
    // {
    //   headerClassName: "cellColor",

    //   field: "srNo",
    //   // align: 'center',
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="srNo" />,
    //   width: 80,
    // },
    {
      headerClassName: "cellColor",

      field: "licenseNo",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="licenseNo" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "petAnimalEn" : "petAnimalMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="petAnimal" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "petAnimalBreedEn" : "petAnimalBreedMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="petAnimal" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "animalColour",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="animalColor" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "ownerFullName",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "status",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 180,
    },

    // {
    //   headerClassName: "cellColor",

    //   field: "action",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="actions" />,
    //   width: 125,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           style={{ color: "#1976d2" }}
    //           onClick={() => {
    //             router.push({
    //               pathname: `/veterinaryManagementSystem/transactions/ipd/clerk/view`,
    //               query: {
    //                 id: params.row.id,
    //                 // petAnimal: params.row.petAnimal
    //               },
    //             });
    //             console.log("444", params.row);
    //           }}
    //         >
    //           <Visibility />
    //         </IconButton>
    //         {/* <IconButton
    //           style={{ color: "red" }}
    //           onClick={() => {
    //             console.log(params.row.id);
    //             deleteApplication(params.row.id);
    //           }}
    //         >
    //           <Delete />
    //         </IconButton> */}
    //       </>
    //     );
    //   },
    // },
  ];

  const deleteApplication = (deleteId) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${URLs.VMS}/trnAnimalTreatment/delete/${deleteId}`)
          .then((res) => {
            if (res.status == 226) {
              sweetAlert(
                "Deleted!",
                "Record Deleted successfully !",
                "success"
              );
              setRunAgain(true);
            }
          });
      }
    });
  };

  return (
    <>
      <Head>
        <title>IPD Report</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>IPD Report</div>
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            paddingBottom: "45px",
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <Grid
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            className={styles.feildres}
          >
            <Grid item xs={4} className={styles.feildres}>
              <FormControl style={{ marginTop: 10 }}>
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}>From Date</span>}
                        value={field.value}
                        onChange={(date) => {
                          console.log("dateformat", date);
                          field.onChange(date);
                          setFDate(date);
                        }}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                      {/* <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText> */}
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <FormControl style={{ marginTop: 10 }}>
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}>To Date</span>}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                          setTDate(date);
                        }}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                {/* <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText> */}
              </FormControl>
            </Grid>
            <Grid item xs={2} className={styles.feildres}>
              {/* <IconButton
                disabled={router.query.id ? true : false}
                sx={{ color: "#1976D2" }}
                onClick={() => {
                  // getPetData();
                }}
              >
              
              </IconButton> */}
              <Button variant="contained" onClick={() => getData()}>
                Search
              </Button>
            </Grid>
            <Grid item xs={2} className={styles.feildres}>
              <Button
                variant="outlined"
                sx={{
                  color: "black",
                  textTransform: "capitalize",
                  // paddingLeft: "100px",
                }}
                onClick={handleToPrint}
              >
                Print
                <PrintIcon
                  sx={{
                    paddingLeft: "10px",
                    fontSize: "37px",
                  }}
                />
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {/* <div className={styles.row} style={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            endIcon={<Add />}
            onClick={() => {
              router.push(`/veterinaryManagementSystem/transactions/ipd/clerk/view`);
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        </div> */}
        {/* <div ref={componentRef} style={{ padding: "1% 3%" }}> */}
        <div ref={componentRef}>
          <DataGrid
            autoHeight
            sx={{
              marginTop: "5vh",
              width: "100%",

              "& .cellColor": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 0 },
                disableExport: false,
                disableToolbarButton: false,
                csvOptions: { disableToolbarButton: false },
                printOptions: { disableToolbarButton: true },
              },
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>
      </Paper>
    </>
  );
};

export default IpdRegistration;
