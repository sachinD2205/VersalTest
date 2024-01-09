import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import UploadButtonOP from "../../../components/fileUpload/DocumentsUploadOP";
import Loader from "../../../containers/Layout/components/Loader/index.js";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
const Document = (props) => {
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
  let user = useSelector((state) => state.user.user);
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

  useEffect(() => {
    console.log(props, "props--serviceId");
    getDocuments();
  }, []);

  const getDocuments = () => {
    axios
      .get(
        `${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId?serviceId=${props?.serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
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
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "documentChecklistEn" : "documentChecklistMr",
      headerName: language == "en" ? "Document Name" : "दस्तऐवजचे नाव",
      flex: 3,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: language == "en" ? "Status" : "स्थिती",
      flex: 1,
      width: 30,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: language == "en" ? "Upload Document" : "दस्तऐवज प्रविष्ठ करा",
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
                `attachmentss[${params.row.srNo - 1}].filePath`,
              )}
              fileKey={params.row.srNo - 1}
              showDel={true}
              // fileNameEncrypted={(path) => {                                                        
              //   setTaxReceiptEncrupt(path)
              // }}

            />
          </>
        );
      },
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
