import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

import { useRouter } from "next/router";
import schema from "./form";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
// import FormattedLabel from "../../../../containers/FB_ReusableComponent/reusableComponents/FormattedLabel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const router = useRouter();
  const [id, setID] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getVardiTypes();
  }, []);

  useEffect(() => {
    console.log("router.query", router.query);
    getFireStationName();
  }, []);

  useEffect(() => {
    getData();
  }, [dataSource]);

  const [fireStation, setfireStation] = useState();

  // get fire station name
  const getFireStationName = () => {
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("resss", res.data);
        setfireStation(res?.data);
      });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("vardi Name", res?.data);
        setDataSource(res.data);
        // setDataSource(
        //   res.data.map((r, i) => ({
        //     id: r.id,
        //     vardiName: r.vardiName,
        //   }))
        // );
      });

    // r.data.map((r) => (id: r.id, ));
    // setVardiTypes(vardi);
    // });
  };

  console.log("after vardi Name", dataSource);

  // For Paginantion
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
  //           vardiPlace: r.vardiPlace,
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
  const getData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.FbsURL}/transaction/trnBussinessNOC/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("12", res.data.bussiness);

        let _res = res?.data?.bussiness.map((r, i) => ({
          activeFlag: r.activeFlag,

          id: r.id,
          serialNo: i + 1 + _pageNo * _pageSize,
          businessNocId: r.id,

          applicationStatus: r?.applicationStatus,
          applicationDate: r?.applicationDate,
          applicationNo: r?.applicationNo,
          applicationNameCol:
            r?.applicantName != null &&
            r?.applicantMiddleName != null &&
            r?.applicantLastName
              ? r?.applicantName +
                " " +
                r?.applicantMiddleName +
                " " +
                r?.applicantLastName
              : "-",
          applicationNameColMr:
            r?.applicantNameMr +
            r?.applicantMiddleNameMr +
            r?.applicantLastNameMr,
          mobileNo: r?.mobileNo,
          emailId: r?.emailId,
          propertyNo: r?.propertyNo,

          applicantName: r?.applicantName,

          applicantNameMr: r?.applicantNameMr,

          applicantMiddleName: r?.applicantMiddleName,

          //   nOCFor: r?.nOCFor,

          applicantMiddleNameMr: r?.applicantMiddleNameMr,

          applicantLastName: r?.applicantLastName,

          applicantLastNameMr: r?.applicantLastNameMr,

          applicantAddress: r?.applicantAddress,

          applicantAddressMr: r?.applicantAddressMr,

          mobileNo: r?.mobileNo,

          emailId: r?.emailId,

          IsRentalApplicant: r?.IsRentalApplicant,

          // Owner Details

          ownerName: r?.ownerName,

          ownerNameMr: r?.ownerNameMr,

          ownerMiddleName: r?.ownerMiddleName,

          ownerMiddleNameMr: r?.ownerMiddleNameMr,

          ownerLastName: r?.ownerLastName,

          ownerLastNameMr: r?.ownerLastNameMr,

          ownerAddress: r?.ownerAddress,

          ownerAddressMr: r?.ownerAddressMr,

          ownerMobileNo: r?.ownerMobileNo,

          ownerEmailId: r?.ownerEmailId,

          // Business Detailss

          firmName: r?.firmName,

          firmNameMr: r?.firmNameMr,

          // zone List

          propertyNo: r?.propertyNo,

          shopNo: r?.shopNo,

          plotNo: r?.plotNo,

          buildingName: r?.buildingName,

          buildingNameMr: r?.buildingNameMr,

          gatNo: r?.gatNo,

          citySurveyNo: r?.citySurveyNo,

          roadName: r?.roadName,

          landmark: r?.landmark,

          area: r?.area,

          //   roadNameMr: r?.roadNameMr,

          //   landmarkMr: r?.landmarkMr,

          //   areaMr: r?.areaMr,

          village: r?.village,

          pincode: r?.pincode,

          officeContactNo: r?.officeContactNo,

          workingOnsitePersonMobileNo: r?.workingOnsitePersonMobileNo,

          officeMailId: r?.officeMailId,

          lattitude: r?.lattitude,

          longitude: r?.longitude,

          // object feild
          starHotel: r?.starHotel,
          noOfRooms: r?.noOfRooms,
          foodAndDrugSafetyLicenseCopy: r?.foodAndDrugSafetyLicenseCopy,
          nocAreaForPetrolPumpInSqMtrs: r?.nocAreaForPetrolPumpInSqMtrs,
          noOfDespesingUnit: r?.noOfDespesingUnit,
          fuelTankCapacity: r?.fuelTankCapacity,
          lengthOfCascadeForCNG: r?.lengthOfCascadeForCNG,
          widthOfCascadeForCNG: r?.widthOfCascadeForCNG,
          noOfBeds: r?.noOfBeds,
          noOfScreen: r?.noOfScreen,
          eachScreenSeatingCapacity: r?.eachScreenSeatingCapacity,

          typesOfCompany: r?.typesOfCompany,
          businessDetails: r?.businessDetails,
          rawMaterialDetails: r?.rawMaterialDetails,
          finalMaterialDetails: r?.finalMaterialDetails,
          listOfHazardousMaterial: r?.listOfHazardousMaterial,
          emergencyContactPersonDetails: r?.emergencyContactPersonDetails,

          //   informerName: r?.vardiSlip?.informerName,
          //   informerNameMr: r?.vardiSlip?.informerNameMr,
          //   informerMiddleName: r?.vardiSlip?.informerMiddleName,
          //   informerMiddleNameMr: r?.vardiSlip?.informerMiddleNameMr,
          //   informerLastName: r?.vardiSlip?.informerLastName,
          //   informerLastNameMr: r?.vardiSlip?.informerLastNameMr,
          //   area: r?.vardiSlip?.area,
          //   areaMr: r?.vardiSlip?.areaMr,
          //   city: r?.vardiSlip?.city,
          //   cityMr: r?.vardiSlip?.cityMr,
          //   contactNumber: r?.vardiSlip?.contactNumber,
          //   mailID: r?.vardiSlip?.mailID,
          //   // vardi details
          //   vardiPlace: r?.vardiSlip?.vardiPlace,
          //   vardiPlaceMr: r?.vardiSlip?.vardiPlaceMr,
          //   landmark: r?.vardiSlip?.landmark,
          //   landmarkMr: r?.vardiSlip?.landmarkMr,
          //   typeOfVardiId: r?.vardiSlip?.typeOfVardiId,
          //   otherVardiType: r?.vardiSlip?.otherVardiType,
          //   vardiTime: r?.vardiSlip?.vardiTime,
          //   shift: r?.vardiSlip?.shift,
        }));

        // YYYY-MM-DDThh:mm:ss
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  // Delete
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                setEditButtonInputState(true);
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getData();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                setEditButtonInputState(false);
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getSubType()
                getData();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
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
        slipHandedOverTo: record.slipHandedOverTo,
      },
    });
  };

  // define colums table
  const columns = [
    {
      headerName: <FormattedLabel id="srNoF" />,
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 100,
    },
    {
      headerName: <FormattedLabel id="applicationDate" />,
      // headerName: "Informer Name",
      field: language == "en" ? "applicationDate" : "applicationDate",
      flex: 0.8,
      width: 20,
    },
    {
      headerName: <FormattedLabel id="applicationNo" />,
      // headerName: "Informer Name",
      field: language == "en" ? "applicationNo" : "applicationNo",
      flex: 1.1,
      width: 150,
    },
    {
      headerName: <FormattedLabel id="applicantName" />,
      // headerName: "Informer Name",
      field: language == "en" ? "applicationNameCol" : "applicationNameMrCol",
      flex: 1,
      width: 230,
    },
    // {
    //   headerName: <FormattedLabel id='applicationStatus' />,
    //   // headerName: "Informer Name",
    //   field: language == "en" ? "applicationStatus" : "applicationStatus",
    //   flex: 1,
    //   width: 150,
    // },
    {
      headerName: <FormattedLabel id="mobileNo" />,
      // headerName: "Informer Name",
      field: "mobileNo",
      flex: 1,
      width: 150,
    },
    {
      headerName: <FormattedLabel id="emailId" />,
      // headerName: "Informer Name",
      field: "emailId",
      flex: 1,
      width: 150,
    },
    {
      headerName: <FormattedLabel id="propertyNo" />,
      // headerName: "Informer Name",
      field: "propertyNo",
      flex: 1,
      width: 150,
    },

    // For Paginantion Change Code
    {
      field: "actions",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row.activeFlag);
        return (
          <Box>
            <Tooltip title="View">
              <IconButton
                onClick={(e) => {
                  console.log("e", e, "params", params.row);
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/businessNocNew/form",
                    query: {
                      ...params.row,
                      mode: "view",
                      pageMode: "View",
                    },
                  });
                }}
              >
                <VisibilityIcon
                  style={{
                    fontSize: "20px",
                    hover: {
                      color: "blue",
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            <IconButton
              disabled={params.row.activeFlag === "Y" ? false : true}
              onClick={() => {
                // const record = {
                //   ...r?,
                //   dateAndTimeOfVardi: moment(r?.dateAndTimeOfVardi).format(
                //     "YYYY-MM-DDThh:mm:ss"
                //   ),
                // };
                const record = params.row;

                router.push({
                  pathname:
                    "/FireBrigadeSystem/transactions/businessNocNew/form",
                  query: {
                    pageMode: "Edit",
                    role: "CREATE_APPLICATION",
                    desg: "DEPT_CLERK",
                    ...record,
                    slipHandedOverTo: record.slipHandedOverTo == "No" ? 2 : 1,
                    // fireStationName:
                    //   record.fireStationName === "string"
                    //     ? record.fireStationName
                    //         .split(",")
                    //         .map(
                    //           (rec) =>
                    //             fireStation.find((fire) => fire.id == rec)
                    //               ?.fireStationName
                    //         )
                    //     : "",
                  },
                });
                console.log("...record", params.row);
                ("");
              }}
            >
              {/* {params.row.activeFlag == "Y" ? <EditIcon style={{ color: "#556CD6" }} /> : <EditIcon />} */}

              <Button
                size="small"
                // variant="contained"
                // className={styles.click}

                sx={{
                  border: "1px solid #5499C7",
                  backgroundColor: "#ecf0f1",
                }}
              >
                Edit
                <EditIcon style={{ color: "#556CD6" }} />
              </Button>
            </IconButton>
            {/* <IconButton
              style={{ cursor: "pointer" }}
              onClick={() => {
                setBtnSaveText("Update"), setID(params.row.id), console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton> */}
          </Box>
        );
      },
    },
  ];

  console.log("iddddd", id);
  return (
    <>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="addBusinessNoc" />}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() =>
              router.push({
                query: {
                  id,
                },
                pathname:
                  "/FireBrigadeSystem/transactions/businessNocNew/nocTypes",
              })
            }
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>

      <Box style={{ height: "100%", width: "100%" }}>
        {/* For Pagination Changes in Code */}
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          // autoHeight
          autoHeight={data.pageSize}
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
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getData(_data, data.page);
          }}
        />
      </Box>
    </>
  );
};

export default Index;
