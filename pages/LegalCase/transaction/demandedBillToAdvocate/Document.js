import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import FileTable from "../../FileUpload/FileTable";
import { useRouter } from "next/router";

import { catchExceptionHandlingMethod } from "../../../../util/util";

// Documents
const Documents = (props) => {
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mainFiles, setMainFiles] = useState([]);
  const [buttonInputStateNew, setButtonInputStateNew] = useState(false);
  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
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
  // Delete
  const discard = async (props) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        console.log("_props", props);
        if (props?.id) {
          // let _attachement = mainFiles?.map((a) => {
          //   if (props?.id == a?.id) {
          //     return {
          //       ...a,
          //       activeFlag: "N",
          //     };
          //   } else {
          //     return a;
          //   }
          // });
          let _attachement = mainFiles?.map((a) => ({
            ...a,
            activeFlag: props?.id == a?.id ? "N" : a.activeFlag,
          }));

          console.log("_attachments", _attachement);
          setMainFiles(_attachement);
          swal("File Deleted Successfully!", { icon: "success" });
        } else {
          axios
            .delete(`${urls.CFCURL}/file/discard?filePath=${props.filePath}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              if (res.status == 200) {
                // setFilePath(null),
                // props.filePath(null);

                // let attachement = JSON?.parse(
                //   localStorage.getItem("attachments")
                // )
                //   ?.filter((a) => a?.filePath != props.filePath)
                let attachement = additionalFiles
                  ?.filter((a) => a?.filePath != props.filePath)
                  ?.map((a) => a);
                setAdditionalFiles(attachement);
                // localStorage.removeItem("attachments");
                // localStorage.setItem(
                //   "attachments",
                //   JSON.stringify(attachement)
                // );

                swal("File Deleted Successfully!", { icon: "success" });
              } else {
                swal("Something went wrong..!!!");
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        }
      } else {
        swal("File is Safe");
      }
    });
  };

  // Columns
  const columns = [
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      width: 140,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      // width: 300,
    },
    {
      // field:
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      // flex: 1,
      renderCell: (record, buttonInputState) => {
        console.log("pathhhh", record?.row?.filePath);
        return (
          <>
            {/** ViewButton */}
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record?.row?.filePath}`,
                  "_blank"
                );
              }}
            >
              <Visibility />
            </IconButton>
            {/** DeleteButton **/}
            {deleteButtonInputState && (
              <IconButton
                color="error"
                disabled={
                  router?.query?.pageMode === "VIEW_ONLY" ? true : false
                }
                onClick={() => discard(record.row)}
              >
                <Delete />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // -------------- useEffect --------------

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("attachments")) !== null) {
      const localStorageData = JSON.parse(localStorage.getItem("attachments"));

      const mappedData = localStorageData.map((data, i) => ({
        // attachments: data.attachments,
        // id: data.id,
        ...data,
        srNo: data?.srNo ?? i + 1,
      }));
      console.log("mappedData", mappedData);

      setMainFiles(mappedData);
      // setAdditionalFiles(mappedData);
    }

    // if (localStorage.getItem("attachments") !== null) {
    //   console.log(
    //     "JSON.parse",
    //     JSON.parse(localStorage.getItem("attachments"))
    //   );
    //   setAdditionalFiles(JSON.parse(localStorage.getItem("attachments")));
    // }
    if (localStorage.getItem("buttonInputstateNew") !== null) {
      setButtonInputStateNew(true);
    } else {
      setButtonInputStateNew(false);
    }
    if (localStorage.getItem("deleteButtonInputState") == "false") {
      setDeleteButtonInputState(false);
    } else {
      setDeleteButtonInputState(true);
    }
  }, []);

  useEffect(() => {
    // let _newData = [...mainFiles, ...additionalFiles]?.filter(
    //   (obj) => obj !== {}
    // );
    let _newData = [...mainFiles, ...additionalFiles]?.filter(
      (obj) => Object.keys(obj).length > 0
    );

    // setAttachments([...mainFiles, ...additionalFiles]);
    setAttachments(_newData);
    localStorage.setItem(
      "attachments",
      // JSON.stringify([...mainFiles, ...additionalFiles])
      JSON.stringify(_newData)
    );
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("__attachments", mainFiles, additionalFiles, attachments);
  }, [mainFiles, additionalFiles, attachments]);

  useEffect(() => {}, [buttonInputStateNew]);

  useEffect(() => {
    setButtonInputStateNew(props?.buttonInputStateNew);
  }, [props]);

  // view
  return (
    <>
      <Paper
        style={
          {
            // marginLeft: "15vh",
            // marginRight: "17vh",
            // marginTop: "5vh",
            // marginBottom: "5vh",
          }
        }
        elevation={0}
      >
        <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 20,
            // padding: 8,
            // paddingLeft: 30,
            // marginLeft: "50px",
            // marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <strong style={{ display: "flex", justifyContent: "center" }}>
            <FormattedLabel id="document" />
          </strong>
        </div>

        {/** FileTableComponent **/}
        <FileTable
          appName="LCMS" //Module Name
          serviceName={"L-Notice"} //Transaction Name
          fileName={attachedFile} //State to attach file
          filePath={setAttachedFile} // File state upadtion function
          newFilesFn={setAdditionalFiles} // File data function
          // pageMode={"View"}
          pageMode={router?.query?.pageMode === "VIEW_ONLY" ? "View" : ""}
          columns={columns} //columns for the table
          rows={
            attachments
              ? attachments?.filter((doc) => doc?.activeFlag !== "N")
              : []
          }
          // rows={attachments?.map((data, index) => {
          //   return {
          //     srNo: index + 1,
          //     ...data,
          //   };
          // })}
          // rows={attachments?.filter((obj) => obj !== {})}
          uploading={setUploading}
          buttonInputStateNew={buttonInputStateNew}
        />
      </Paper>
    </>
  );
};

export default Documents;
