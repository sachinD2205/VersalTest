import { Add } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../../styles/LegalCase_Styles/upload.module.css";
import UploadButton from "../../FileUpload/UploadButton";

// FileTable
const FileTable = (props) => {
  const user = useSelector((state) => state.user.user);
  let filePath = {};
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // tempFun
  function temp(arg) {
    filePath = arg;
  }

  // handleClose
  const handleClose = () => {
    props.newFilesFn((oldElements) => {
      return [
        ...oldElements,
        {
          srNo: props.rows.length + 1,
          fileName: filePath?.filePath,
          extension: filePath?.extension.split(".")[1].toUpperCase(),
          fileLabel: label.toUpperCase(),
          uploadedBy: user.fullName,
        },
      ];
    });
    props.filePath("");
    props.uploading(false);
  };

  // style
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

  return (
    <div className={styles.attachFile}>
      <div className={styles.mainButton}>
        {/** addButton */}
        <div
          style={{
            backgroundColor: "#1976d2",
            borderRadius: "5px",
            marginBottom: 10,
            paddingLeft: "5px",
            paddingRight: "5px",
          }}
        >
          <IconButton onClick={handleOpen}>
            <Add sx={{ color: "white" }} />
          </IconButton>
        </div>
      </div>
      {/** fileUploadModal */}
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
              File Upload
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
              sx={{ marginTop: "2vw", width: "70px" }}
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
      {/**Table */}
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
export default FileTable;
