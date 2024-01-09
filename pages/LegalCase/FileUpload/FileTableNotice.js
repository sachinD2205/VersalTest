import { Add } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/LegalCase_Styles/upload.module.css";
// import UploadButtonNotice from "./UploadButtonNotice";
import UploadButtonNotice from "./UploadButton";
import { useRouter } from "next/router";

// File Table Notice
const FileTableNotice = (props) => {
  let filePath = {};
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [inableDisabled, setinableDiabled] = useState();
  // const [btnInputStateDemandBill, setBtnInputStateDemandBill] = useState(true);
  const router = useRouter();

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
          srNo: props.rows.length + 1,
          attachedNameEn:
            user.userDao.firstNameEn + " " + user.userDao.lastNameEn,
          attachedNameMr:
            user.userDao.firstNameMr + " " + user.userDao.lastNameMr,
          attachedDate: new Date(),
          activeFlag: "Y",
          originalFileName: label.toUpperCase(),
          originalFileName: filePath?.fileName,
          extension: filePath?.extension.split(".")[1].toUpperCase(),
          filePath: filePath?.filePath,
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
    console.log("FileTableNoticeProps", props);
  }, [props]);

  // View
  return (
    <div className={styles.attachFile}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Typography sx={{ fontWeight: 800 }}>
          <FormattedLabel id='attachmentSchema' />
        </Typography> */}
      </Box>

      <div className={styles.mainButton}>
        <div
          style={{
            // backgroundColor: "#1976d2",
            borderRadius: "5px",
            marginBottom: 10,
            paddingLeft: "5px",
            paddingRight: "5px",
            height: "40px",
          }}
        >
          <Button
            disabled={router?.query?.pageMode === "_VIEW" ? true : false}
            onClick={handleOpen}
          >
            <FormattedLabel id="browse" />
          </Button>
        </div>
      </div>
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
              {/* <FormattedLabel id='fileUpload' /> */}
              {language == "en" ? "File Upload" : ""}
            </Typography>
            <UploadButtonNotice
              appName={props.appName}
              serviceName={props.serviceName}
              filePath={temp}
              fileName={props.fileName}
              activeFlag={props.activeFlag}
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
              <FormattedLabel id="cancel" />
            </Button>
          </div>
        </Box>
      </Modal>

      <DataGrid
        getRowId={(row) => row.srNo}
        autoHeight
        disableSelectionOnClick
        rows={props.rows}
        columns={props.columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};
export default FileTableNotice;
