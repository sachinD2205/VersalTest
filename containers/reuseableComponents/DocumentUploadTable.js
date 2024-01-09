import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import FormattedLabel from "./FormattedLabel";
import axios from "axios";
import router from "next/router";
import { useSelector } from "react-redux";
import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import URLs from "../../URLS/urls";

const TableFile = (props) => {
  const [runAgain, setRunAgain] = useState(false);

  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  useEffect(() => {
    setRunAgain(false);
    console.table("props.rows: ", props.rows);
  }, [runAgain, props.rows]);

  const handleFile = (event, rowData) => {
    if (event.target.files) {
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      axios
        .post(
          `${URLs.CFCURL}/file/upload?appName=${props.appName}&serviceName=${props.serviceName}`,
          formData,
        )
        .then((r) => {
          if (r.status === 200) {
            const temp = props.rows;

            for (let i of temp) {
              if (i.documentKey == rowData.documentKey) {
                i["fileAttachmentPath"] = r.data.filePath;
                i["status"] = "upload";
                i["remark"] = "Pending Approval";
              }
            }
            props.rowUpdation(temp);

            setRunAgain(true);
          }
        });
    }
  };

  const deleteFile = (docKey) => {
    const temp = props.rows;

    for (let i of temp) {
      if (i.documentKey == docKey) {
        i["fileAttachmentPath"] = "";
        i["status"] = "";
      }
    }
    props.rowUpdation(temp);
    setRunAgain(true);
  };

  const columns = [
    {
      headerClassName: "cellColor",
      field: language === "en" ? "documentNameEn" : "documentNameMr",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="fileName" />,
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: "cellColor",
      cellClassName: "columnColor",
      headerAlign: "center",
      align: "center",
      field: "isDocumentMandetory",
      headerName: <FormattedLabel id="mandatoryOrOptional" />,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.isDocumentMandetory ? (
              <FormattedLabel id="mandatory" required />
            ) : (
              <FormattedLabel id="optional" />
            )}
          </>
        );
      },
    },
    {
      headerClassName: "cellColor",
      headerAlign: "center",
      align: "center",
      field: "upload",
      headerName: <FormattedLabel id="upload" />,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <UploadButton
              use={router.query.pageMode}
              // rowData={props.rows[params.row.srNo - 1]} //Change this logic
              rowData={params.row}
              deletePath={() => {
                deleteFile(params.row.documentKey);
              }}
              Change={(e) => {
                handleFile(e, params.row);
              }}
            />
          </>
        );
      },
    },
    {
      headerClassName: "cellColor",
      headerAlign: "center",
      align: "center",
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      hide: router.query.id ? false : true,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <span
              style={{
                fontSize: 14,
              }}
            >
              {params.row.remark}
            </span>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <DataGrid
        sx={{
          marginTop: "5vh",
          marginBottom: "3vh",
          width: "80vw",
          "& .cellColor": {
            backgroundColor: "#1976d2",
            color: "white",
          },
          "& .redText": {
            color: "red",
          },
          "& .normalText": {
            color: "black",
          },
        }}
        // @ts-ignore
        getCellClassName={(params) => {
          if (params.field === "isDocumentMandetory" || params.value == null) {
            return params.value == true ? "redText" : "normalText";
          }
        }}
        // rows={table}
        rows={props.rows}
        // @ts-ignore
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        hideFooter
        disableSelectionOnClick
        disableColumnMenu
      />
      {/* {router.query.id && props.rows.find((obj) => obj.status === "upload") && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" onClick={() => props.uploadAgain()}>
            <FormattedLabel id="save" />
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default TableFile;

export const UploadButton = (props) => {
  useEffect(() => {
    console.log("RowData: ", props.rowData);
  }, []);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            padding: "5px 5px",
            width: "max-content",
            cursor: "pointer",
          }}
        >
          {!props.rowData?.fileAttachmentPath && (
            <>
              <Add
                sx={{
                  width: 30,
                  height: 30,
                  border: "1.4px dashed #1976d2",
                  color: "#1976d2",
                  marginRight: 1.5,
                }}
              />

              <input
                type="file"
                onChange={(e) => {
                  // @ts-ignore
                  if (e.target.files[0]) {
                    props.Change(e);
                  }
                }}
                hidden
              />
              <span
                style={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: 12,
                  color: "#1976d2",
                }}
              >
                {<FormattedLabel id="addFile" />}
              </span>
            </>
          )}
          {props.rowData?.fileAttachmentPath && (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  window.open(
                    `${URLs.CFCURL}/file/preview?filePath=${props.rowData.fileAttachmentPath}`,
                    "_blank",
                  );
                }}
              >
                {<FormattedLabel id="preview" />}
              </Button>
              {props.rowData.fileAttachmentPath && props.rowData.status === "upload" && (
                <IconButton
                  onClick={() => {
                    axios
                      .delete(`${URLs.CFCURL}/file/discard?filePath=${props.rowData.fileAttachmentPath}`)
                      .then((res) => {
                        if (res.status === 200) {
                          props.deletePath();
                        }
                      });
                  }}
                >
                  <Delete color="error" />
                </IconButton>
              )}
            </>
          )}
        </label>
      </div>
    </>
  );
};
