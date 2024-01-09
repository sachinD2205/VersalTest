import React, { useState } from "react";
import axios from "axios";
import URLs from "../../URLS/urls";
import sweetAlert from "sweetalert";
import { useGetToken } from "./CustomHooks";
import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton, MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import FormattedLabel from "./FormattedLabel";
import { Controller } from "react-hook-form";
import { catchExceptionHandlingMethod } from "../../util/util";
import {
  DecryptData,
  EncryptData,
} from "../../components/common/EncryptDecrypt";

const Index = ({
  rows = [],
  updater,
  reassignedStatus = ["Reassigned", "Rejected"],
  viewOnly = false,
}) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);





  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 60,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "documentCategoryEn" : "documentCategoryMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="documentCategory" />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "documents",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="documentName" />,
      minWidth: 300,
      flex: 1,
      renderCell: (params) =>
        params?.value?.length > 1 ? (
          <Select
            variant="standard"
            sx={{ width: 300, textAlign: "center" }}
            value={params.row?.documentId}
            onChange={(value) =>
              updater((prev) =>
                prev?.map((j) =>
                  j?.id == params?.row?.id
                    ? { ...j, documentId: value.target?.value }
                    : j
                )
              )
            }
          >
            {params?.value &&
              params?.value?.map((value, index) => (
                <MenuItem key={index} value={value.id}>
                  {language == "en"
                    ? value?.documentNameEn
                    : value?.documentNameMr}
                </MenuItem>
              ))}
          </Select>
        ) : (
          params?.value[0][
          language == "en" ? "documentNameEn" : "documentNameMr"
          ]
        ),
    },
    {
      headerClassName: "cellColor",

      field: "status",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      minWidth: 150,
      flex: 0.4,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      minWidth: 180,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <div style={{ margin: "4px 0px" }}>
            <UploadButton
              appName="VMS"
              serviceName="PetLicense"
              rowData={params.row}
              fileHandler={{ rows, updater }}
              imageAndPDF
              view={viewOnly}
              reassigned={reassignedStatus.includes(params.row.status)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataGrid
        autoHeight
        sx={{
          marginTop: "5vh",
          width: "100%",

          border: "1px solid rgb(128,128,128,0.5)",
          boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.5)",

          "& .cellColor": {
            backgroundColor: "#125597",
            color: "white",
          },
        }}
        density="compact"
        hideFooter
        rows={rows}
        //@ts-ignore
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </>
  );
};

export default Index;



export const UploadButton = ({
  appName,
  serviceName,
  label = "",
  addFileText = { en: "Add File", mr: "फाइल जोडा" },
  rowData,
  fileHandler,
  view = false,
  onlyImage = false,
  onlyPDF = false,
  imageAndPDF = false,
  reassigned = false,
  defaultStatus = "Pending",
}) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const userToken = useGetToken();

  const imageFormats = ["image/jpeg", "image/jpg", "image/png"];
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
  const fileUpload = (fileData) => {
    let formData = new FormData();
    formData.append("file", fileData);
    formData.append("appName", appName);
    formData.append("serviceName", serviceName);

    const url = `${URLs.CFCURL}/file/uploadAllTypeOfFileEncrypted`;





    axios
      .post(
        url,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        if (r.status === 200) {
          fileHandler.updater(
            fileHandler.rows.map((j) => {
              if (j.id == rowData.id) {
                return { ...j, filePath: r.data.filePath };
              } else {
                return { ...j };
              }
            })
          );
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  const handleFile = (event) => {
    if (event.target.files) {
      if (onlyPDF) {
        if (event.target.files[0].type == "application/pdf") {
          fileUpload(event.target.files[0]);
        } else {
          sweetAlert(
            "Error!",
            "Please upload PDF files with size less than 2MB!",
            "error"
          );
        }
      } else if (onlyImage) {
        if (imageFormats.includes(event.target.files[0].type)) {
          fileUpload(event.target.files[0]);
        } else {
          sweetAlert(
            "Error!",
            "Please upload JPEG/JPG/PNG files with size less than 2MB!",
            "error"
          );
        }
      } else if (imageAndPDF) {
        if (
          event.target.files[0].type == "application/pdf" ||
          imageFormats.includes(event.target.files[0].type)
        ) {
          fileUpload(event.target.files[0]);
        } else {
          sweetAlert(
            "Error!",
            "Please upload JPEG/JPG/PNG/PDF files with size less than 2MB!",
            "error"
          );
        }
      } else {
        fileUpload(event.target.files[0]);
      }
    }
  };

  // filePreview 

  const filePreview = (filePath) => {

    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);


    console.log("filePath", filePath)

    // const url = `${URLs.CFCURL}/file/previewNew?filePath=${filePath}`;

    const url = `${URLs.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
        const newTab = window.open();
        newTab.document.write(`
      <html>
        <body style="margin: 0;">
          <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
        </body>
      </html>
    `);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error)
        callCatchMethod(error, language);
      });
  }


  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          columnGap: 5,
          width: "max-content",
          cursor: "pointer",
        }}
      >
        {!!label && (
          <span style={{ fontSize: "medium", fontWeight: "bold" }}>
            {label} :
          </span>
        )}

        {rowData?.filePath ? (
          <>
            {true && (
              <Button
                variant="contained"
                style={{ height: "30px" }}
                onClick={() => {
                  filePreview(rowData?.filePath)
                }}
              >
                {language === "en" ? "Preview" : "पूर्वावलोकन"}
              </Button>
            )}

            {reassigned && (
              <IconButton
                onClick={() => {
                  const ciphertext = EncryptData("passphraseaaaaaaadiscard", rowData?.filePath);
                  const urls = `${URLs.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`;

                  axios
                    .delete(urls,
                      {
                        headers: {
                          Authorization: `Bearer ${userToken}`,
                        },
                      })
                    .then((res) => {
                      if (res.status === 200) {
                        fileHandler.updater(
                          fileHandler.rows.map((j) => {
                            if (j.id == rowData.id) {
                              return {
                                ...j,
                                filePath: "",
                              };
                            } else {
                              return { ...j };
                            }
                          })
                        );
                      }
                    })
                    .catch((error) =>
                      catchExceptionHandlingMethod(error, language)
                    );
                }}
              >
                <Delete sx={{ height: "25px" }} color="error" />
              </IconButton>
            )}
          </>
        ) : (
          <>
            {view && reassigned ? (
              <label
                style={{
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                {language == "en" ? "File Not Attached" : "फाइल जोडली नाही"}
              </label>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Add
                  sx={{
                    width: 30,
                    height: 30,
                    border: "1.5px dashed #1976d2",
                    color: "#1976d2",
                    marginRight: 1.5,
                  }}
                />

                <input
                  id="uploadButton"
                  type="file"
                  onChange={(e) => {
                    // @ts-ignore
                    if (e.target.files[0]) {
                      // @ts-ignore
                      if (e.target.files[0].size > 2097152) {
                        sweetAlert(
                          "Error!",
                          "Please upload file with size less than 2MB !",
                          "error"
                        );
                        e.target.value = "";
                      } else {
                        handleFile(e);
                      }
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
                  {addFileText[language]}
                </span>
              </div>
            )}
          </>
        )}
      </label>
    </div>
  );
};
