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
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Document = (props) => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isLoading, setIsLoading] = useState(true);
  let user = useSelector((state) => state.user.user);
  console.log(props.docApi, "props--serviceId");
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
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
        `${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId?serviceId=${props?.serviceId}`,{
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
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

              // id: null,
              // isDocumentMandetory: r?.isDocumentMandetory
              //   ? "Mandatory"
              //   : "Not Mandatory",
              // department: r?.department,
              // service: r?.service,
              // document: r?.document,
              // documentChecklistEn: r?.documentChecklistEn,
              // documentChecklistMr: r?.documentChecklistMr,
              // documentType: r?.documentType,
              // usageType: r?.usageType,
              activeFlag: r?.activeFlag,
            };
          }),
        );
        // setAttachment("attachments", res?.data?.serviceWiseChecklist);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
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
              showDel={router.query.pageMode != "View" ? true : false}
            />
          </>
        );
      },
    },
    // ---------------------------------------------------------------------------------
    {
      field: "action",
      headerName: "Approve/Reject",
      width: 300,
      flex:1,
      hide: router.query.mode=="DOCUMENT_VERIFICATION" ?false:true,
      editable: true,
      valueGetter: (params) => params?.row?.action,
      renderCell: (params) => {
        const handleValueChange = (event) => {
          console.log("sssssss",event);
          params.api.setEditCellValue({
            id: params.id,
            field: "action",
            value: event,
          });
          // setValue(
          //   `attachmentss[${params.row.srNo - 1}].action`,
          //   event.target.value
          // );
        };
        return (
          <Select value={params.value} style={{ minWidth: '150px', maxWidth: '300px' }}  onChange={handleValueChange}>
            <MenuItem value="approve">Approve</MenuItem>
            <MenuItem value="reassign">Reassign</MenuItem>
          </Select>
        );
      },
    },
    // ---------------------------------------------------------------------------------
    {
      field: "remark",
      headerName: "Remarks",
      flex:1,
      width: 300,
      hide: router.query.mode=="DOCUMENT_VERIFICATION" ?false:true,
      editable: true,
      valueGetter: (params) => params?.row?.remark,
      renderCell: (params) => {
        let regexEn = /^[A-Za-z\s]*$/;
        return (
          <TextField
            placeholder="Enter Remark"
            value={params.value || ""}
            multiline
            error={!regexEn.test(params.value)}
            disabled={false}
            helperText={
              !regexEn.test(params.value)
                ? `Remarks should be in English`
                : null
            }
          />
        );
      },
    },
  ];
  const handleDocsAction = (params) => {
    let _id = params?.row?.id;
    let _updatedDocs = watch("attachmentss")?.map((docs) =>
      _id == docs?.id && params?.field === "action"
        ? { ...docs, action: params.value }
        : _id == docs?.id && params?.field === "remark"
        ? { ...docs, remark: params.value }
        : docs
    );
    console.log("__params", params, _updatedDocs);
    setValue("attachmentss", _updatedDocs);
  };

  useEffect(() => {
    setIsLoading(false);
    console.log("attachmentsafterupdate", watch("attachmentss"));
  }, [watch("attachmentss")]);
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
          // rows={getValues(`attachmentss`) ? getValues(`attachmentss`) : []}
          // columns={columnsF}
          rows={
            watch(`attachmentss`)
              ? watch(`attachmentss`)?.map((w, ii) => {
                  return { ...w, srNo: ii + 1 };
                })
              : []
          }
          columns={columnsF}
          onCellEditCommit={handleDocsAction}
        />
      )}
    </>
  );
};
export default Document;
