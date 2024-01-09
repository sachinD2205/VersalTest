import {
  Grid,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import Loader from "../../../../../containers/Layout/components/Loader/index.js";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel.js";
import UploadButtonOP from "../FileUploadTable/DocumentsUploadOP.js";

const Document = () => {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state.labels.language);
  const isDeptUser = useSelector((state) => state.user.user?.userDao?.deptUser);
  const [isLoading, setIsLoading] = useState(true);
  let appName = "FBS";
  let serviceName = "ProvisionalBuildingFire";

  // columnsF
  const columnsF = [
    {
      field: "srNo",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: language == "en" ? "documentChecklistEn" : "documentChecklistMr",
      headerName: "Document Name ",
      flex: 1,
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
    },
    {
      field: "actions",
      headerName: "File Name",
      align: "center",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <UploadButtonOP
            appName={appName}
            serviceName={serviceName}
            fileDtl={params?.row?.filePath}
            fileKey={params?.row?.srNo - 1}
            showDel={false}
          />
        );
      },
    },

    // ---------------------------------------------------------------------------------
    {
      field: "docStatus",
      headerName: "Approve/Reject",
      width: 300,
      hide: !isDeptUser,
      editable: true,
      valueGetter: (params) => params?.row?.docStatus,
      renderCell: (params) => {
        const handleValueChange = (event) => {
          params?.api.setEditCellValue({
            id: params?.id,
            field: "docStatus",
            value: event.target.value,
          });

        };
        return (
          <Select value={params?.value} onChange={handleValueChange}>
            <MenuItem value="Approve">Approve</MenuItem>
            <MenuItem value="Reject">Reject</MenuItem>
          </Select>
        );
      },
    },
    // ---------------------------------------------------------------------------------
    {
      field: "docRemark",
      headerName: "Remarks",
      width: 300,
      hide: !isDeptUser,
      editable: true,
      valueGetter: (params) => params?.row?.docRemark,
      renderCell: (params) => {
        let regexEn = /^[A-Za-z\s]*$/;
        return (
          <TextField
            placeholder="Enter Remark"
            value={params?.value || ""}
            multiline
            error={!regexEn.test(params?.value)}
            disabled={false}
            helperText={
              !regexEn.test(params?.value)
                ? `Remarks should be in English`
                : null
            }
          />
        );
      },
    },
  ];

  // handleDocsAction
  const handleDocsAction = (params) => {
    let _id = params?.row?.id;
    let _updatedDocs = watch("attachmentList")?.map((docs) =>
      _id == docs?.id && params?.field === "docStatus"
        ? { ...docs, docStatus: params?.value }
        : _id == docs?.id && params?.field === "docRemark"
          ? { ...docs, docRemark: params?.value }
          : docs
    );
    console.log("__params", params, _updatedDocs);
    setValue("attachmentList", _updatedDocs);
  };

  //!=================== useEffects 

  useEffect(() => {
    setIsLoading(false);
    console.log("attachmentsafterupdate", watch("attachmentList"));
  }, [watch("attachmentList")]);


  //!=============================== view
  return (
    <div>
      <Grid container>
        {isLoading ? (
          <Loader />
        ) : (
          <DataGrid

            getRowId={(row) => row.srNo}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableExport
            hideFooter
            components={{ Toolbar: GridToolbar }}
            autoHeight
            density="comfortable"
            sx={{
              backgroundColor: "white",

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
            rows={
              watch(`attachmentList`)
                ? watch(`attachmentList`)?.map((w, ii) => {
                  return { ...w, srNo: ii + 1 };
                })
                : []
            }
            columns={columnsF}
            onCellEditCommit={handleDocsAction}
          />
        )}
      </Grid>
    </div>
  );
};
export default Document;
