import { Box, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel.js";
import UploadButtonOP from "../../../components/fileUpload/DocumentsUploadOP.js";
import Loader from "../../../containers/Layout/components/Loader/index.js";

const Document = (props) => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    console.log("attachmentssafterupdate", watch("attachmentss"),props);
  }, [watch("attachmentss")]);

  const language = useSelector((state) => state.labels.language);

  // let appName = "FBS";
  // let serviceName = "ProvisionalBuildingFire";

  let appName = "PABBM";
  let serviceName = "PABBM-DRPBA";

  const columnsF = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: language == "en" ? "documentChecklistEn" : "documentChecklistMr",
      headerName: "Document Name",
      flex: 3,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Upload Document",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <UploadButtonOP
              // error={!!errors?.advirtiseMentInDocx}
              //
              appName={appName}
              serviceName={serviceName}
              fileDtl={getValues(
                `attachmentss[${params.row.srNo - 1}].filePath`
              )}
              fileKey={params.row.srNo - 1}
              showDel={true}
            />
            {/*  */}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Grid
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        Documents Upload
      </Grid>
      {isLoading ? (
        <Loader />
      ) : (
        <DataGrid
          style={{
            marginTop: 30,
            marginBottom: 30,
            marginLeft: "40px",
            marginRight: "65px",
          }}
          getRowId={(row) => row.srNo}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableExport
          hideFooter
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            backgroundColor: "white",
            // paddingLeft: "2%",
            // paddingRight: "2%",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {},
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          rows={watch(`attachmentss`) ? watch(`attachmentss`) : []}
          columns={columnsF}
        />
      )}
    </>
  );
};
export default Document;
