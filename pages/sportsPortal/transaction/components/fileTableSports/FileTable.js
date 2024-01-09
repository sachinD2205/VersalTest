import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import UploadButtonOP from "../../../../../components/fileUpload/DocumentsUploadOP";
import Loader from "../../../../../containers/Layout/components/Loader/index.js";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/sportsPortalStyles/view.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util.js";

const Document = (props) => {
  const language = useSelector((state) => state?.labels?.language);
  const { watch, setValue } = useFormContext();
  const userId = useSelector((state) => state?.user?.user?.id);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.user.user.token);
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
  const appName = "FBS";
  const serviceName = "BusinessNoc";

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
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: language == "en" ? "Status" : "स्थिती",
      flex: 1,
      width: 30,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        console.log(":a1", params);
        return (
          <div>
            {params?.row?.status == "Mandatory"
              ? language == "en"
                ? "Mandatory"
                : "अनिवार्य"
              : language == "en"
              ? "Not Mandatory"
              : "अनिवार्य नाही"}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: language == "en" ? "Upload Document" : "दस्तऐवज प्रविष्ठ करा",
      flex: 2,
      align: "center",
      sortable: false,
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log(params?.row?.filePath, "534534");
        return (
          <>
            <UploadButtonOP
              readOnly={props?.readOnly}
              appName={appName}
              serviceName={serviceName}
              fileDtl={params?.row?.filePath}
              fileKey={params?.row?.srNo - 1}
              showDel={
                props?.forCitizen === true &&
                params?.row?.docStatus === "Approve"
                  ? false
                  : true
              }
            />
          </>
        );
      },
    },
    {
      field: "docStatus",
      hide: props?.forCitizen === true ? false : true,
      headerName: language == "en" ? "Approve/Reject" : "मंजूर/नामंजूर",
      flex: 1,
      width: 30,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "docRemark",
      hide: props?.forCitizen === true ? false : true,
      headerName: language == "en" ? "Remarks" : "टिप्पणी",
      flex: 2,
      align: "center",
      sortable: false,
      headerAlign: "center",
    },
  ];

  const getDocuments = () => {
    axios
      .get(`${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId`, {
        params: { serviceId: props?.serviceId },

        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        axios
          .get(`${urls.SPURL}/gymBooking/getByCreatedUserIdAndService`, {
            params: {
              createdUserId: userId,
              service: props?.serviceId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((recentResponse) => {
            console.log("dsfds", recentResponse);
            console.log(
              "res?.data?.serviceWiseChecklist",
              res?.data?.serviceWiseChecklist
            );

            if (
              watch("attachmentss") != null &&
              watch("attachmentss") != undefined &&
              watch("attachmentss").length != 0
            ) {
            } else {
              setValue(
                "attachmentss",
                res?.data?.serviceWiseChecklist?.map((r, i) => ({
                  ...r,
                  docKey: r?.document,
                  id: null,
                  status: r?.isDocumentMandetory
                    ? "Mandatory"
                    : "Not Mandatory",
                  srNo: i + 1,
                  filePath:
                    recentResponse?.data?.docKey == r.document
                      ? recentResponse?.data?.filePath
                      : null,
                  activeFlag: r?.activeFlag,
                }))
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //!========================> useEffect
  useEffect(() => {
    console.log(props, "props--serviceId");
    if (props?.serviceId) {
      getDocuments();
    }
  }, []);

  useEffect(() => {
    setIsLoading(false);
    console.log("attachmentssAfterUpdate: ", watch("attachmentss"));
  }, [watch("attachmentss")]);

  // view
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!(props.serviceId == 29 || props.serviceId == 68) && (
            <>
              <h4
                style={{
                  marginLeft: "40px",
                  marginTop: "20px",
                  color: "red",
                  fontStyle: "italic",
                }}
              >
                <p>
                  <blink className={styles.blink}>
                    {<FormattedLabel id="depositeCondition" />}
                  </blink>
                </p>
              </h4>
            </>
          )}
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
            rows={
              watch(`attachmentss`) != null &&
              watch(`attachmentss`) != undefined &&
              watch(`attachmentss`).length != 0
                ? watch(`attachmentss`)
                : []
            }
            columns={columnsF}
          />
        </>
      )}
    </>
  );
};
export default Document;
