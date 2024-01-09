import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
// import urls from "../../../URLS/urls";
// import UploadButtonOP from "../../../components/fileUpload/DocumentsUploadOP";
// import Loader from "../../../containers/Layout/components/Loader/index.js";
// import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
// import UploadButtonOP from "../../../../../components/fileUpload/DocumentsUploadOP.js";
// import Loader from "../../../../../containers/Layout/components/Loader";
// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import UploadButtonOP from "../../../../../components/fileUpload/DocumentsUploadOP";
import { useRouter } from "next/router";
import { FormControl, FormHelperText, InputLabel, MenuItem, TextField } from "@mui/material";
import { Select } from "antd";

const Document = (props) => {
    const {
        control,
        register,
        reset,
        getValues,
        setValue,
        watch,
        // formState: { errors },
      } = useFormContext();

  const [isLoading, setIsLoading] = useState(true);

  console.log(props.docApi, "props--serviceId");
  useEffect(() => {
    props.docApi && getDocuments()
  }, [props.docApi]);
  // console.log("sdzfd",docApi);
  const router = useRouter();
  const approveReject = [
    { id: 1, val: "Approve" },
    { id: 2, val: "Reject" }
  ]
  const getDocuments = () => {
    axios
      .get(
        `${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId?serviceId=${props?.serviceId}`,
      )
      .then((res) => {
        console.log(
          "res?.data?.serviceWiseChecklist",
          res?.data?.serviceWiseChecklist,
        );
        setValue(
          "attachmentss",
          res?.data?.serviceWiseChecklist?.map((r, ind) => {
            return {
              ...r,
              docKey: r.document,
              id: null,
              status: r.isDocumentMandetory ? "Mandatory" : "Not Mandatory",
              srNo: ind + 1,
              filePath: null,

              activeFlag: r?.activeFlag,
            };
          }),
        );
        // setAttachment("attachments", res?.data?.serviceWiseChecklist);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setIsLoading(false);
    console.log("attachmentssafterupdate", watch("attachmentss"));
  }, [watch("attachmentss")]);
  // }, []);

  const language = useSelector((state) => state.labels.language);

  let appName = "FBS";

  let serviceName = "BusinessNoc";

  const columnsF = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "documentChecklistEn" : "documentChecklistEn",
      //  "documentChecklistMr",
      headerName: <FormattedLabel id="documentName" />,
      flex: 1,
      headerAlign: "center",

    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      // width: 30,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="documentUpload" />,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
          console.log("params.row.srNo",params.row.srNo)
        return (
          <>
            <UploadButtonOP
              appName={appName}
              serviceName={serviceName}
              fileDtl={getValues(
                `attachmentss[${params.row.srNo - 1}].filePath`,
              )}
              fileKey={params.row.srNo - 1}
              // showDel={true}
              showDel={params.row.action == "reassign" ? true : false}
            //   showDel={
            //     router.query.pageMode != "View" &&
            //     params?.row?.docStatus === "Approve"
            //     ? true
            //     : false
            //   }
            />
          </>
        );
      },
    },
    {
        field: "action",
        // hide: props?.forCitizen === true ? false : true,
        headerName: language == "en" ? "Approve/Reject" : "मंजूर/नामंजूर",
        flex: 1,
        width: 30,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "remark",
        // hide: props?.forCitizen === true ? false : true,
        headerName: language == "en" ? "Remarks" : "टिप्पणी",
        flex: 1,
        align: "center",
        sortable: false,
        headerAlign: "center",
      },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <DataGrid
          style={{
            marginTop: 30,
            marginBottom: 30,
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
          rows={getValues(`attachmentss`) ? getValues(`attachmentss`) : []}
          columns={columnsF}
        />
      )}
    </>
  );
};
export default Document;
