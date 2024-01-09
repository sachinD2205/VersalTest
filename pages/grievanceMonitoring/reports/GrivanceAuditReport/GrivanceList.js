import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { Button, Grid, Stack, TextField, Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { convertToXLSX } from "../../../../components/xlsx.js/index";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import DepartmentCategoryCSS from "./DepartmentCategory.module.css";
import moment from "moment";
import ClearIcon from "@mui/icons-material/Clear";
import Styles from "../GrivanceAuditReport/GrivanceAudit.module.css";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/** Sachin Durge */
// DepartmentCategory
const DepartmentCategory = () => {
  const {
    control,
    register,
    getValues,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [GrievanceAuditData, setGrievanceAuditData] = useState([]);
  let user = useSelector((state) => state.user.user);
  const componentRef = useRef();
  // printTableFunction
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  const router = useRouter();
  // Exit Button
  //exitButton
  const exitButton = () => {
    router.push(`/grievanceMonitoring/`);
  };

  // GrivanceAuditTableColumns
  const GrivanceAuditTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: language == "en" ? "Token Number" : "टोकन क्रमांक",
      description: language == "en" ? "Token Number" : "टोकन क्रमांक",
      // width: 270,
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: language == "en" ? "citizenName" : "citizenNameMr",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Citizen Name" : "नागरिकाचे नाव",
      description: language == "en" ? "Citizen Name" : "नागरिकाचे नाव",
      // width: 120,
      flex: 1,
    },
    {
      field: language == "en" ? "complaintType" : "complaintTypeMr",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Subject" : "विषय",
      description: language == "en" ? "Subject" : "विषय",
      // width: 200,
      flex: 1,
    },
    {
      field: "grievanceDate",
      align: "center",
      headerName: language == "en" ? "Date" : "तारीख",
      description: language == "en" ? "Date" : "तारीख",
      headerAlign: "center",
      // width: 250,
      flex: 1,
    },
    {
      field: "closedDate",
      align: "center",
      headerName: language == "en" ? "Due Date" : "देय तारीख",
      description: language == "en" ? "Due Date" : "देय तारीख",
      headerAlign: "center",
      // width: 250,
      flex: 1,
    },
    {
      field: language == "en" ? "complaintStatusText" : "complaintStatusTextMr",
      align: "center",
      headerName: language == "en" ? "Status" : "स्थिती",
      description: language == "en" ? "Status" : "स्थिती",
      headerAlign: "center",
      // width: 250,
      flex: 1,
    },
  ];

  //cancellButton
  const cancellButton = () => {
    setValue("department", null);
    setValue("subDepartmentlist", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("percentage", "");
    // GrievanceAuditData
    setValue("GrievanceAuditData", null);
    setValue("complaintIdList", null);
    setValue("reportTitle", "");
    clearErrors();
    setValue("searchInputState", true);
    // Second Screen
  };

  // handleCellClickGoshwara
  // const handleCellClickGoshwara = (params) => {
  //   setValue("loadderState", true);

  //   console.log("1212", params?.value, params?.field);

  //   let body = {
  //     fromDate: watch("fromDate"),
  //     toDate: watch("toDate"),
  //     lastCommissionorDate: watch("lastCommissionorDate"),
  //   };

  //   let url;
  //   let url1;

  //   // open / pralabhit
  //   if (params?.field == "totalOpenGhoshwara") {
  //     url = `${urls.GM}/report/getCommissionorReviewPralambitGhoshwara`;
  //     url1 = `${urls.GM}/report/getCommissionorReviewPralambitEscalationGhoshwara`;
  //   }

  //   // else if (params?.field == "totalOpenGriv") {
  //   //   url = `${urls.GM}/report/getCommissionorReviewPralambitGhoshwara`;
  //   //   url1 = `${urls.GM}/report/getCommissionorReviewPralambitEscalationGhoshwara`;
  //   // }
  //   //  setteled / approved / nikali
  //   else if (params?.field == "totalCloseGhoshwara") {
  //     // url = `${urls.GM}/report/getCommissionorReviewPralambitEscalationGhoshwara`;
  //     // url1 = `${urls.GM}/report/getCommissionorReviewPralambitEscalationGhoshwara`;
  //   }
  //   // total / akunprapt
  //   else if (params?.field == "totalCloseGhoshwara") {
  //     // url = `${urls.GM}/report/getCommissionorReviewPralambitEscalationGhoshwara`;
  //     // url1 = `${urls.GM}/report/getCommissionorReviewPralambitEscalationGhoshwara`;
  //   }

  //   // GoshwaraInDetail
  //   axios
  //     .post(url, body, {
  //       headers: {
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     })
  //     .then((res) => {
  //       if (res?.status == 200 || res?.status == 201) {
  //         console.log("PralabitData", res?.data);
  //         setValue("PralabitData", res?.data);
  //         setValue("loadderState", false);
  //       } else {
  //         setValue("loadderState", false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error", error);
  //       setValue("loadderState", false);
  //     });
  // };

  // saveExcel
  const downloadExcel = () => {
    if (
      GrievanceAuditData != undefined &&
      GrievanceAuditData != null &&
      GrievanceAuditData.length != 0
    ) {
      convertToXLSX(GrievanceAuditData, "DepartmentCategory.xlsx");
    }
  };

  // useEffects ===============>

  useEffect(() => {
    let GrievanceAuditData = watch("GrievanceAuditData");

    console.log("GrievanceAuditData12chyabhavat", GrievanceAuditData);

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
    console.log("pointWise12121", watch("GrievanceAuditData"));
  }, [watch("GrievanceAuditData")]);

  useEffect(() => {
    console.log("GrievanceAuditDataFinal", GrievanceAuditData);
  }, [GrievanceAuditData]);

  // View
  return (
    <>
      {/** Buttons  */}

      {/** 
      <hr className={DepartmentCategoryCSS.hrUpper}></hr>
*/}
      {/*      
      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent='right'
        alignItems='center'
        marginTop='5'
        marginBottom='5'
        marginRight='2vw'
      
      >
        
        <Button
          variant='contained'
          color='primary'
          endIcon={<DownloadIcon />}
          onClick={() => downloadExcel()}>
          Excel
        </Button>

        <Button
          variant='contained'
          color='primary'
          endIcon={<PrintIcon />}
          onClick={() => handlePrint()}>
          <FormattedLabel id='print' />
        </Button>
        
      </Stack> */}

      {/** Department Start */}

      <Box>
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center", // Center vertically
            alignItems: "center",
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
                // marginBottom: "2vh",
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
              {language == "en" ? "Grivance List" : "तक्रार यादी"}
            </h3>
          </Grid>
        </Grid>
      </Box>
      {/** 
      <div className={DepartmentCategoryCSS.DepartmentCategoryName}>
        {language == "en" ? "Grivance List" : "तक्रार यादी"}
      </div>
       */}

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
            backgroundColor: "#0084ff",
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
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageSizeChange={handlePageSizeChange}
        // components={{
        //   Toolbar: GridToolbar,
        //   content: renderTableHeader,
        //   header: {
        //     content: renderTableHeader,
        //   },
        // }}
        title="Goshwara"
        // onCellClick={handleCellClickGoshwara}
        // title={(language = "en" ? "Goshwara" : "घोषवारा")}
        components={{ Toolbar: GridToolbar }}
      />

      {/** Department End*/}

      {/** New Table Report  */}

      {/* <div> */}
      {/** 
      <div className={DepartmentCategoryCSS.HideComponent}>
        <ReportLayout
          // centerHeader
          // centerData
          // rows={
          //   GrievanceAuditData != undefined && GrievanceAuditData != null
          //     ? GrievanceAuditData
          //     : []
          // }
          // columns={GrivanceAuditTableColumns}
          columnLength={5}
          componentRef={componentRef}
          // showDates
          // date={{ from: "01-06-2023", to: "30-06-2023" }}
          deptName={{
            en: "Grievance Monitoring System",
            mr: "तक्रार निवारण प्रणाली",
          }}
          reportName={{
            en: "Grivance List",
            mr: "तक्रार यादी",
          }}>
          <ComponentToPrintNew
            // ref={componentRef}
            language={language}
            GrievanceAuditData={GrievanceAuditData}
          />
        </ReportLayout>
    </div >
         */}

      {/** New Table Report */}
      {/** 
      <ComponentToPrintNew
        // ref={componentRef}
        language={language}
        GrievanceAuditData={GrievanceAuditData}
      />
       */}

      <Grid
        container
        className={DepartmentCategoryCSS.Grid}
        sx={{
          marginTop: 1,
          marginBottom: 2,
          // paddingLeft: "50px",
          // align: "center",
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
            label={language == "en" ? "Report Titile" : "अहवाल शीर्षक"}
            variant="outlined"
            style={{ width: "400px" }}
            {...register("reportTitle")}
            error={!!errors.reportTitle}
            helperText={
              errors?.reportTitle
                ? errors.reportTitle.message
                : "Enter Audit Name"
            }
          />
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent="center"
        alignItems="center"
        paddingBottom="5"
        // marginTop='5'
      >
        <Button
          type="submit"
          onClick={() => {
            setValue("buttonName", "GrivanceListReportNameSubmitButton");
          }}
          variant="contained"
          color="success"
          // endIcon={<SearchIcon />}
        >
          {language == "en" ? "Submit" : "प्रस्तुत करणे"}
        </Button>

        <Button
          variant="contained"
          color="primary"
          endIcon={<ClearIcon />}
          onClick={() => cancellButton()}
        >
          <FormattedLabel id="clear" />
        </Button>
        <Button
          variant="contained"
          color="error"
          endIcon={<ExitToAppIcon />}
          onClick={() => exitButton()}
        >
          <FormattedLabel id="exit" />
        </Button>
      </Stack>
    </>
  );
};

// componentToPrintNew
{
  /**  
class ComponentToPrintNew extends React.Component {
  render() {
    let language = this?.props?.language;
    let GrievanceAuditData = this?.props?.GrievanceAuditData;
    // console.log("GrievanceAuditData", GrievanceAuditData);

    // view
    return (
      <>
        <div className={DepartmentCategoryCSS.MainDiv}>
          <table className={DepartmentCategoryCSS.table}>
            <tbody>
              <tr>
                <td className={DepartmentCategoryCSS.Table1Header} colSpan={7}>
                  {language == "en" ? "Grivance List" : "तक्रार यादी"}
                </td>
              </tr>
              <tr>
                <td
                  className={`${DepartmentCategoryCSS.TableTd} ${DepartmentCategoryCSS.TableTh}`}
                  colSpan={1}>
                  {language == "en" ? "Sr.No" : "अ.क्र."}
                </td>
                <td
                  className={`${DepartmentCategoryCSS.TableTd} ${DepartmentCategoryCSS.TableTh}`}
                  colSpan={1}>
                  {language == "en" ? "Token Number" : "टोकन क्रमांक"}
                </td>
                <td
                  className={`${DepartmentCategoryCSS.TableTd} ${DepartmentCategoryCSS.TableTh}`}
                  colSpan={1}>
                  {language == "en" ? "Citizen Name" : "नागरिकाचे नाव"}
                </td>
                <td
                  className={`${DepartmentCategoryCSS.TableTd} ${DepartmentCategoryCSS.TableTh}`}
                  colSpan={1}>
                  {language == "en" ? "Subject" : "विषय"}
                </td>

                <td
                  className={`${DepartmentCategoryCSS.TableTd} ${DepartmentCategoryCSS.TableTh}`}
                  colSpan={1}>
                  {language == "en" ? "Date" : "तारीख"}
                </td>
                <td
                  className={`${DepartmentCategoryCSS.TableTd} ${DepartmentCategoryCSS.TableTh}`}
                  colSpan={1}>
                  {language == "en" ? "Due Date" : "देय तारीख"}
                </td>
                <td
                  className={`${DepartmentCategoryCSS.TableTd} ${DepartmentCategoryCSS.TableTh}`}
                  colSpan={1}>
                  {language == "en" ? "Status" : "स्थिती"}
                </td>
              </tr>

              {GrievanceAuditData &&
                GrievanceAuditData?.map((data, index) => (
                  <tr>
                    <td className={DepartmentCategoryCSS.TableTd} colSpan={1}>
                      {language == "en" ? data?.srNo : data?.srNo}
                    </td>
                    <td className={DepartmentCategoryCSS.TableTd} colSpan={1}>
                      {data?.applicationNo}
                    </td>
                    <td className={DepartmentCategoryCSS.TableTd} colSpan={1}>
                      {language == "en"
                        ? data?.citizenName
                        : data?.citizenNameMr}
                    </td>

                    <td className={DepartmentCategoryCSS.TableTd} colSpan={1}>
                      {language == "en"
                        ? data?.complaintType
                        : data?.complaintTypeMr}
                    </td>

                    <td className={DepartmentCategoryCSS.TableTd} colSpan={1}>
                      {data?.grievanceDate}
                    </td>
                    <td className={DepartmentCategoryCSS.TableTd} colSpan={1}>
                      {data?.closedDate}
                    </td>
                    <td className={DepartmentCategoryCSS.TableTd} colSpan={1}>
                      {language == "en"
                        ? data?.complaintStatusText
                        : data?.complaintStatusTextMr}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
*/
}

export default DepartmentCategory;
