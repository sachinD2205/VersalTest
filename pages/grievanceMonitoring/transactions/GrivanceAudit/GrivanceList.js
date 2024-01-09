import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Button, Grid, Stack, TextField, Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import DepartmentCategoryCSS from "./DepartmentCategory.module.css";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";


const DepartmentCategory = () => {
  const {
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [GrievanceAuditData, setGrievanceAuditData] = useState([]);
 

  const router = useRouter();

  //exitButton
  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };

  // GrivanceAuditTableColumns
  const GrivanceAuditTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "applicationNo",
      headerName: language == "en" ? "Token Number" : "टोकन क्रमांक",
      description: language == "en" ? "Token Number" : "टोकन क्रमांक",
      headerAlign: "center",
      align: "center",
      width: 300,
    },
    {
      field: language == "en" ? "citizenName" : "citizenNameMr",
      headerAlign: "center",
      align: "left",
      headerName: language == "en" ? "Citizen Name" : "नागरिकाचे नाव",
      description: language == "en" ? "Citizen Name" : "नागरिकाचे नाव",
      width: 270,
    },
    {
      field: language == "en" ? "complaintType" : "complaintTypeMr",
      headerAlign: "center",
      align: "left",
      headerName: language == "en" ? "Subject" : "विषय",
      description: language == "en" ? "Subject" : "विषय",
      width: 300,
    },
    {
      field: "grievanceDate",
      align: "left",
      headerName: language == "en" ? "Date" : "तारीख",
      description: language == "en" ? "Date" : "तारीख",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "closedDate",
      align: "left",
      headerName: language == "en" ? "Due Date" : "देय तारीख",
      description: language == "en" ? "Due Date" : "देय तारीख",
      headerAlign: "center",
      width: 200,
    },
    {
      field: language == "en" ? "complaintStatusText" : "complaintStatusTextMr",
      align: "left",
      headerName: language == "en" ? "Status" : "स्थिती",
      description: language == "en" ? "Status" : "स्थिती",
      headerAlign: "center",
      width: 150,
    },
  ];

  //cancellButton
  const cancellButton = () => {
    setValue("department", null);
    setValue("subDepartmentlist", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("percentage", "");
    setValue("GrievanceAuditData", null);
    setValue("complaintIdList", null);
    setValue("reportTitle", "");
    clearErrors();
    setValue("searchInputState", true);
  };

  useEffect(() => {
    let GrievanceAuditData = watch("GrievanceAuditData");

    if (
      GrievanceAuditData != null &&
      GrievanceAuditData?.length != "0" &&
      GrievanceAuditData != undefined
    ) {
      // added srNo in array objects
      let withSrNoGrievanceAuditTableData = GrievanceAuditData?.map(
        (data, index) => {
          return {
            ...data,
            srNo: index + 1,
            grievanceDate: moment(data?.grievanceDate).format("DD-MM-YYYY"),
            closedDate: moment(data?.closedDate).format("DD-MM-YYYY"),
          };
        }
      );
      setGrievanceAuditData(withSrNoGrievanceAuditTableData);
    }
  }, [watch("GrievanceAuditData")]);

  // View
  return (
    <>
      {/** HeadingName */}
      <Box>
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center", // Center vertically
            width: "100%",
            height: "auto",
            overflow: "auto",
            color: "white",
            fontSize: "18.72px",
            borderRadius: 100,
            fontWeight: 500,
            background:
              "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
          }}
        >
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
                marginRight: "2rem",
              }}
            >
              {language == "en" ? "Grievance List" : "तक्रार यादी"}
            </h3>
          </Grid>
        </Grid>
      </Box>

      {/** GrivanceList */}
      <DataGrid
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 100 },
            printOptions: { disableToolbarButton: true },
            disableExport: false,
            disableToolbarButton: true,
            csvOptions: { disableToolbarButton: true },
          },
        }}
        sx={{
          backgroundColor: "white",
          m: 2,
          overflowY: "scroll",
          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "#556CD6",
            color: "white",
          },
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
        density="density"
        getRowId={(row) => row.srNo}
        autoHeight
        rows={
          GrievanceAuditData != undefined && GrievanceAuditData != null
            ? GrievanceAuditData
            : []
        }
        columns={GrivanceAuditTableColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        title={<FormattedLabel id="goshwaraT" />}
        components={{ Toolbar: GridToolbar }}
      />
      {/** titleTextFiled */}
      <Grid
        container
        className={DepartmentCategoryCSS.Grid}
        sx={{
          marginTop: 1,
          marginBottom: 2,
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={DepartmentCategoryCSS.GridItem}
        >
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="reportTitle" />}
            variant="standard"
            style={{ width: "400px" }}
            {...register("reportTitle")}
            error={!!errors.reportTitle}
            helperText={
              errors?.reportTitle
                ? errors.reportTitle.message
                : errors.reportTitle?.message
            }
          />
        </Grid>
      </Grid>

      {/** Buttons Start */}
      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent="center"
        alignItems="center"
        paddingBottom="5"
      >
       
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
          onClick={() => {
            setValue("buttonName", "GrivanceListReportNameSubmitButton");
          }}
          variant="contained"
          color="success"
          size="small"
        >
          <FormattedLabel id="submit" />
        </Button>
      </Stack>
    </>
  );
};

export default DepartmentCategory;
