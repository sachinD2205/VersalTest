import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/LegalCase_Styles/upload.module.css";
import { DataGrid } from "@mui/x-data-grid";
import UploadButton from "./UploadButton";
import { Add } from "@mui/icons-material";

// new
const FileTable = (props) => {
  console.log("props", props);
  let filePath = {};
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // @ts-ignore
  const user = useSelector((state) => {
    console.log("user11", state.user.user);
    return state.user.user;
  });

  function temp(arg) {
    filePath = arg;
  }

  // useEffect(() => {
  //   console.log("dsfjldsf", props?.fileName);
  // }, [props]);

  const handleClose = () => {
    // setOpen(false)
    // props.uploading(true)
    // setTimeout(() => {
    //    props.uploading(false)
    //   props.newFilesFn((oldElements) => {
    //     return [
    //       ...oldElements,
    //       {
    //         id: props.rows.length + 1,
    //         srNo: props.rows.length + 1,
    //         fileName: filePath?.filePath,
    //         extension: filePath?.extension.split('.')[1].toUpperCase(),
    //         fileLabel: label.toUpperCase(),
    //         uploadedBy: user.fullName,
    //       },
    //     ]
    //   })
    //   props.filePath('')
    // }, 2000)
    props.newFilesFn((oldElements) => {
      console.log("filePath", filePath);
      return [
        ...oldElements,
        {
          id: props.rows.length + 1,
          srNo: props.rows.length + 1,
          // attachedNameEn: user.fullNameEn,
          attachedNameEn:
            user.userDao.firstNameEn + " " + user.userDao.lastNameEn,
          attachedNameMr: user.fullNameMr,
          attachedDate: new Date(),
          originalFileName: label.toUpperCase(),
          // attachmentName:  filePath?.filePath,
          originalFileName: filePath?.fileName,
          // attachedNameEn: filePath?.attachedBy ? filePath?.attachedBy : "-",
          extension: filePath?.extension.split(".")[1].toUpperCase(),
          // filePath:  filePath?.filePath
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

  return (
    <div className={styles.attachFile}>
      <div className={styles.mainButton}>
        {/* <Button
          sx={{ width: 135, marginBottom: 2 }}
          variant='contained'
          onClick={handleOpen}
        >
          Upload File
        </Button> */}
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
      <Modal
        open={(props.fileLabel ? true : false) || open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <div className={styles.filee}>
            <Typography
              align='center'
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
              variant='contained'
              color='error'
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

      <DataGrid
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
