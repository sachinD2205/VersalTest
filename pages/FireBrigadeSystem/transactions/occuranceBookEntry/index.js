import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

import schema from "../../../../containers/schema/fireBrigadeSystem/occuranceBookEntryReport";

import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const userToken = useGetToken();

  const language = useSelector((state) => state?.labels.language);

  const router = useRouter();

  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);

  useEffect(() => {
    getVardiTypes();
    getData();
  }, []);

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        let vardi = {};
        r.data.map((r) => (vardi[r.id] = r.vardiName));
        setVardiTypes(vardi);
      });
  };

  // get Table Data
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/saveTrnEmergencyServices`
  //     )
  //     .then((res) => {
  //       setDataSource(
  //         res.data.map((r, i) => ({
  //           id: r.id,
  //           srNo: i + 1,
  //           informerName: r.informerName,
  //           contactNumber: r.contactNumber,
  //           occurancePlace: r.occurancePlace,
  //           typeOfVardiId: r.typeOfVardiId,
  //           dateAndTimeOfVardi: moment(
  //             r.dateAndTimeOfVardi,
  //             "DD-MM-YYYY  HH:mm"
  //           ).format("DD-MM-YYYY  HH:mm"),
  //           // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
  //           // businessType: r.businessType,
  //           // businessTypeName: businessTypes?.find(
  //           //   (obj) => obj?.id === r.businessType
  //           // )?.businessType,
  //           // businessSubType: r.businessSubType,
  //           // remark: r.remark,
  //         }))
  //       );
  //     });
  // };

  // Get Table - Data
  const getData = () => {
    axios
      .get(
        `${urls.FbsURL}/transaction/trnEmergencyServices/getTrnEmergencyServicesData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("dattaaa", res.data, vardiTypes);
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            serialNo: r.id,
            informerName: r.informerName,
            informerNameMr: r.informerNameMr,
            informerMiddleName: r.informerMiddleName,
            informerMiddleNameMr: r.informerMiddleNameMr,
            informerLastName: r.informerLastName,
            informerLastNameMr: r.informerLastNameMr,
            contactNumber: r.contactNumber,
            occurancePlace: r.occurancePlace,
            occurancePlaceMr: r.occurancePlaceMr,
            area: r.area,
            areaMr: r.areaMr,
            landmark: r.landmark,
            landmarkMr: r.landmarkMr,
            city: r.city,
            cityMr: r.cityMr,
            pinCode: r.pinCode,
            typeOfVardiId: vardiTypes[r.typeOfVardiId]
              ? vardiTypes[r.typeOfVardiId]
              : "-",

            slipHandedOverTo: r.slipHandedOverTo,
            slipHandedOverToMr: r.slipHandedOverToMr,
            dateAndTimeOfVardi: moment(
              r.dateAndTimeOfVardi,
              "YYYY-DD-MM HH:mm:ss"
            ).format("YYYY-DD-MM HH:mm:ss"),
          }))
        );
      });
  };

  // Delete
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios
          .delete(
            `${urls.FbsURL}/transaction/trnEmergencyServices/discardTrnEmergencyServices/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
  };

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

  // define colums table
  const columns = [
    {
      // headerName: <FormattedLabel id="srNoF" />,
      headerName: "Application Number",
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 100,
    },
    {
      // headerName: <FormattedLabel id="informerNameF" />,
      headerName: "Date of Incident",
      field: language == "en" ? "informerName" : "informerNameMr",
      flex: 1,
      width: 150,
    },
    {
      field: "contactNumber",
      // headerName: <FormattedLabel id="contactNumberF" />,
      headerName: "Time of Incident",
      flex: 1,
    },
    {
      // headerName: <FormattedLabel id="occurancePlaceF" />,
      headerName: "Occurance Place",
      field: language == "en" ? "occurancePlace" : "occurancePlaceMr",
      flex: 1,
    },
    {
      headerName: "Informer Name",
      field: language == "en" ? "typeOfVardiId" : "typeOfVardiIdMr",
      flex: 1,
    },
    {
      headerName: "Informer Address",
      field: "dateAndTimeOfVardi",
      width: 200,

      // flex: 1,
    },

    {
      field: "actions",
      headerAlign: "center",

      headerName: <FormattedLabel id="actions" />,
      // width: "160",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              className={btnStyles.edit}
              disabled={editButtonInputState}
              onClick={() => {
                console.log("Record", record);
                viewRecord(record.row);
                setBtnSaveText("Update");
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className={btnStyles.delete}
              disabled={deleteButtonInputState}
              onClick={() => deleteById(record.id)}
            >
              <DeleteIcon />
            </IconButton>
            <br />
            {/* <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(record.id)}
            >
              <DeleteIcon className={styles.delete} />
              <br />
            </IconButton> */}
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
                padding: "2%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
              }}
            >
              {<FormattedLabel id="occuranceBookEntry" />}
            </Typography>
          </Box>
        </Box>
        {/* <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            sx={{
              borderRadius: 100,
              padding: 2,
              marginLeft: 1,
              textAlign: "center",
              border: "2px solid #3498DB",
            }}
            disabled={buttonInputState}
            onClick={() =>
              router.push({
                pathname:
                  "/FireBrigadeSystem/transactions/occuranceBookEntry/form",
              })
            }
          >
            <AddIcon />
          </Button>
        </Box> */}
      </Box>
      <Box style={{ height: 400, width: "100%" }}>
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
