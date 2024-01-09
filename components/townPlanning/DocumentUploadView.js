import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Grid, IconButton, Paper } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FileTable from "../../components/townPlanning/FileUploadTable/FileTable";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util";
// Component
const DocumentUpload = () => {
  //catch
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

  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  let appName = "TP",
    serviceName = "TP-PartMap";
  // React Hook Form
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [documents, setDocuments] = useState();

  // useEffect(() => {
  //   setValue("")
  // }, [finalFiles])

  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      flex: 1,
      // width: 140,
    },
    // language == "en"
    //   ? {
    //       headerName: "Uploaded By",
    //       field: "attachedNameEn",
    //       flex: 2,
    //       // width: 300,
    //     }
    //   : {
    //       headerName: "द्वारे अपलोड केले",
    //       field: "attachedNameMr",
    //       flex: 2,
    //       // width: 300,
    //     },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      // width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                  "_blank",
                );
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    //DocumentsList
    axios
      .get(`${urls.CFCURL}/master/documentMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDocuments(
          res.data.documentMaster.map((j, i) => ({
            id: j.id,
            documentNameEn: j.documentChecklistEn,
            documentNameMr: j.documentChecklistMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  useEffect(() => {
    let fileee = [];
    if (router?.query?.pageMode == "View") {
      fileee = getValues("files");
      console.log("ahe ka kahi 1st", fileee);
    } else {
      fileee = [...mainFiles, ...additionalFiles];
    }
    setFinalFiles(
      fileee.map((ff, i) => {
        return { ...ff, srNo: i + 1 };
      }),
    );
    setValue("files", fileee);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("finalFiles", finalFiles);
  }, [finalFiles]);

  // view
  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="documentUpload" />
          </h2>
        </Box>

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              <FileTable
                appName={appName} //Module Name
                serviceName={serviceName} //Transaction Name
                fileName={attachedFile} //State to attach file
                filePath={setAttachedFile} // File state upadtion function
                newFilesFn={setAdditionalFiles} // File data function
                columns={_columns} //columns for the table
                rows={finalFiles} //state to be displayed in table
                uploading={setUploading}
                // authorizedToUpload={authorizedToUpload}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default DocumentUpload;
