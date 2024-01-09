import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel.js";
import UploadButtonOP from "../../fileUpload/DocumentsUploadOP.js";
import Loader from "../../../containers/Layout/components/Loader/index.js";
import { useRouter } from "next/router.js";

const Document = () => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    console.log("attachmentsafterupdate", watch("attachments"));
  }, [watch("attachments")]);

  const language = useSelector((state) => state.labels.language);
  let appName = "FBS";

  let serviceName = "ProvisionalBuildingFire";

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
      headerName: "File Name",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <UploadButtonOP
              appName={appName}
              serviceName={serviceName}
              fileDtl={getValues(
                `attachments[${params.row.srNo - 1}].filePath`
              )}
              fileKey={params.row.srNo - 1}
              showDel={false}
            />
          </>
        );
      },
    },
    {
      field: "actions1",
      headerName: "Approve",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <FormGroup>
              <FormControlLabel
                label="Is Approved"
                control={
                  <Checkbox
                    defaultChecked={true}
                    checked={
                      watch("applicationStatus") == "APPLICATION_CREATED" &&
                      params?.row?.isApproved == null
                        ? true
                        : params?.row?.isApproved
                    }
                  />
                }
                onChange={(e) =>
                  setValue(
                    "attachments",
                    watch("attachments")?.map((m, i) => {
                      return {
                        ...m,
                        srNo: i + 1,
                        isApproved:
                          params.row.srNo - 1 == i
                            ? e.target.checked
                            : params.row.isApproved,
                      };
                    })
                  )
                }
              />
            </FormGroup>
          </>
        );
      },
    },

    {
      field: "actions2",
      headerName: "Reject/Reassign Remark",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <TextField
              disabled={params.row.isApproved}
              sx={{ width: "80%" }}
              id="standard-basic"
              placeholder="Enter Remark"
              // label="floor Height"
              variant="outlined"
              onChange={(e) =>
                setValue(
                  "attachments",
                  watch("attachments")?.map((m, i) => {
                    return {
                      ...m,
                      srNo: i + 1,
                      remark:
                        params.row.srNo - 1 == i
                          ? e.target.value
                          : params.row.remark,
                    };
                  })
                )
              }
              error={!!errors.volumeLBHIn}
              helperText={
                errors?.volumeLBHIn ? errors.volumeLBHIn.message : null
              }
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Grid container>
        {/* <Grid
          item
          xs={12}
          lg={12}
          md={12}
          xl={12}
          sm={12}
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
        </Grid> */}
        {isLoading ? (
          <Loader />
        ) : (
          <DataGrid
            style={
              {
                // marginTop: 30,
                // marginBottom: 30,
                // marginLeft: "40px",
                // marginRight: "65px",
              }
            }
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
            rows={
              watch(`attachments`)
                ? watch(`attachments`)?.map((w, ii) => {
                    return { ...w, srNo: ii + 1 };
                  })
                : []
            }
            columns={columnsF}
          />
        )}
      </Grid>
    </>
  );
};
export default Document;
