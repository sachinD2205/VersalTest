import { Add } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/LegalCase_Styles/upload.module.css";
import UploadButton from "./UploadButton";

const FileTable = (props) => {
  let filePath = {};
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [inableDisabled, setinableDiabled] = useState();
  const [btnInputStateDemandBill, setBtnInputStateDemandBill] = useState(true);

  const [finalDataToShow, setFinalDataToShow] = useState([]);

  const language = useSelector((state) => state.labels.language);

  const user = useSelector((state) => {
    return state.user.user;
  });

  function temp(arg) {
    filePath = arg;
  }

  const handleClose = () => {
    props.newFilesFn((oldElements) => {
      console.log("user7878787", user);
      return [
        ...oldElements,
        {
          // id: props.rows.length + 1,
          srNo: props.rows.length + 1,
          attachedNameEn:
            (user?.userDao?.firstNameEn ? user?.userDao?.firstNameEn : "") +
            " " +
            (user?.userDao?.middleNameEn ? user?.userDao?.middleNameEn : "") +
            " " +
            (user?.userDao?.lastNameEn ? user?.userDao?.lastNameEn : ""),

          attachedNameMr:
            (user?.userDao?.firstNameMr ? user?.userDao?.firstNameMr : "") +
            " " +
            (user?.userDao?.middleNameMr ? user?.userDao?.middleNameMr : "") +
            " " +
            (user?.userDao?.lastNameMr ? user?.userDao?.lastNameMr : ""),
          attachedDate: new Date(),
          originalFileName: label.toUpperCase(),
          // attachmentName:  filePath?.filePath,
          originalFileName: filePath?.fileName,
          // attachedNameEn: filePath?.attachedBy ? filePath?.attachedBy : "-",
          extension: filePath?.extension.split(".")[1].toUpperCase(),
          filePath: filePath?.filePath,
          rowIndex: props?.rowIndex,
          deptId: props?.deptId,
          // uploadedBy: user.fullName,
        },
      ];
    });
    props.filePath("");
    props.uploading(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "white",
    boxShadow: 10,
    p: 2,
  };

  // useEffect
  useEffect(() => {
    // setBtnInputStateDemandBill(true);
    if (localStorage.getItem("btnInputStateDemandBill") == "false") {
      setBtnInputStateDemandBill(localStorage.getItem(false));
    } else {
      setBtnInputStateDemandBill(true);
    }
  }, []);

  // useEffect
  useEffect(() => {}, [btnInputStateDemandBill]);

  useEffect(() => {
    console.log(":nm2", props?.rows);

    let getLocalData = localStorage.getItem("parawiseRequestAttachmentList");

    if (getLocalData) {
      // alert("if FileUpload")
      let setLocalData = JSON.parse(JSON.stringify(getLocalData));
      if (setLocalData) {
        let filteredValues = props?.rows?.filter(
          (obj) => obj?.rowIndex == props?.rowIndex
        );
        console.log(":nm3", filteredValues);
        setFinalDataToShow(filteredValues);
      }
    } else {
      // alert("else FileUpload")
      localStorage.removeItem("parawiseRequestAttachmentList");
      setFinalDataToShow([]);
    }
  }, [props?.rows, localStorage.getItem("parawiseRequestAttachmentList")]);

  // View
  return (
    <div className={styles.attachFile}>
      {btnInputStateDemandBill && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 800 }}>
            {/* <FormattedLabel id="attachmentSchema" /> */}
            {language == "en"
              ? "*the maximum upload size is 10MB."
              : "*कमाल अपलोड आकार 10MB आहे"}
          </Typography>
        </Box>
      )}
      {/* {props.buttonInputStateNew === "true" ? ( */}
      {true ? (
        <div className={styles.mainButton}>
          {/* <Button
          sx={{ width: 135, marginBottom: 2 }}
          variant='contained'
          onClick={handleOpen}
        >
          Upload File
        </Button> */}

          {/* {props.showNoticeAttachment == true ? ( */}
          {/* {btnInputStateDemandBill && (
          
        )} */}
          <div
            style={{
              backgroundColor: "#1976d2",
              borderRadius: "5px",
              marginBottom: 10,
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
          >
            {/* <IconButton onClick={handleOpen}>
             ADD DOCUMENTS <Add sx={{ color: "white" }} />
            </IconButton> */}
            <Button
              onClick={handleOpen}
              //  endIcon={<Add sx={{ color: "white" }} />}
              sx={{ color: "white" }}
            >
              {/* ADD DOCUMENTS */}

              {/* <FormattedLabel id="addDocuments" /> */}
              <FormattedLabel id="browse" />
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Modal
        open={(props.fileLabel ? true : false) || open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <div className={styles.filee}>
            <Typography
              align="center"
              sx={{
                fontWeight: "bolder",
                fontSize: "large",
                textTransform: "capitalize",
              }}
            >
              {/* <FormattedLabel id="fileUpload" /> */}

              {language == "en" ? "File Upload" : "फाइल अपलोड"}
            </Typography>
            <UploadButton
              appName={props.appName}
              serviceName={props.serviceName}
              filePath={temp}
              fileName={props.fileName}
              fileLabel={setLabel}
              handleClose={handleClose}
              uploading={props.uploading}
              modalState={setOpen}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="error"
              sx={{ marginTop: "2vw" }}
              onClick={() => {
                setOpen(false);
              }}
            >
              {/* <FormattedLabel id='cancel' /> */}
              {language == "en" ? "Cancle" : "रद्द करा"}
            </Button>
          </div>
        </Box>
      </Modal>

      <DataGrid
        getRowId={(row) => row.srNo}
        autoHeight
        disableSelectionOnClick
        rows={finalDataToShow}
        columns={props.columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};
export default FileTable;
