import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useSelector } from "react-redux"
import Loader from "../../../containers/Layout/components/Loader/index.js"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel.js"
import UploadButtonOP from "../../fileUpload/DocumentsUploadOP.js"
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css"

const Document = ({ loadderState }) => {
  const {
    getValues,
    watch,
    formState: { errors },
  } = useFormContext()

  useEffect(() => {
    console.log("attachmentssafterupdate", watch("attachmentss"))
  }, [watch("attachmentss")])

  const language = useSelector((state) => state.labels.language)

  let appName = "FBS"

  let serviceName = "ProvisionalBuildingFire"

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
              appName={appName}
              serviceName={serviceName}
              fileDtl={getValues(
                `attachmentss[${params.row.srNo - 1}].filePath`
              )}
              fileKey={params.row.srNo - 1}
              showDel={true}
            />
          </>
        )
      },
    },
  ]

  return (
    <>
      <div className={HawkerReusableCSS.MainHeader}>
        <strong>{<FormattedLabel id="documentUpload" />}</strong>
      </div>
      <div className={HawkerReusableCSS.DoucmentUploadIntractions}>
        <FormattedLabel id="fileSizeInstrction" />
      </div>
      {loadderState ? (
        <>
          <Loader />
        </>
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
  )
}
export default Document
