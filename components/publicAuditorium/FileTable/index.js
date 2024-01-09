import { Add } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/publicAuditorium/transactions/upload.module.css";
import UploadButton from "../UploadButton";

const FileTable = (props) => {
  let filePath = {};
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  // const [btnInputStateDemandBill, setBtnInputStateDemandBill] = useState(true);

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  const user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  function temp(arg) {
    console.log("FileTable auth", arg);
    filePath = arg;
  }

  const handleClose = () => {
    props.newFilesFn((oldElements) => {
      console.log("user7878787", user);
      return [
        ...oldElements,
        {
          srNo: props.rows.length + 1,

          attacheDepartment: filePath?.attacheDepartment,
          attacheDesignation: filePath?.attacheDesignation,
          attchedBy: filePath?.attachedBy,
          attachedDate: new Date(),

          // originalFileName: label.toUpperCase(),
          originalFileName: filePath?.fileName,

          fileName: filePath?.fileName,

          extension: filePath?.extension.split(".")[1].toUpperCase(),
          filePath: filePath?.filePath,

          uploadedBy: user?.firstName + " " + user?.surname,

          attacheDepartmentEn: user?.departmentName,
          attacheDepartmentMr: user?.departmentNameMr,

          attacheDesignationEn: user?.designationName,
          attacheDesignationMr: user?.designationNameMr,

          attachedNameEn: user?.firstName + " " + user?.middleName + " " + user?.surname,
          attachedNameMr: user?.firstNamemr + " " + user?.middleNamemr + " " + user?.surnameMr,
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

  // // useEffect
  // useEffect(() => {
  //   if (localStorage.getItem("btnInputStateDemandBill") == "false") {
  //     setBtnInputStateDemandBill(localStorage.getItem(false));
  //   } else {
  //     setBtnInputStateDemandBill(true);
  //   }
  // }, []);

  // useEffect
  // useEffect(() => { }, [btnInputStateDemandBill]);

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
        <Typography sx={{ fontWeight: 800, color: "red" }}>
          <FormattedLabel id="attachmentSchema" />
        </Typography>
      </Box>
      {!authority ? (
      <div className={styles.mainButton}>
        <div
          style={{
            backgroundColor: "#1976d2",
            borderRadius: "5px",
            margin: "10px",
          }}
        >
          {/* <IconButton onClick={handleOpen}>
             ADD DOCUMENTS <Add sx={{ color: "white" }} />
            </IconButton> */}
          <Button
            onClick={handleOpen}
            size="small"
            endIcon={<Add sx={{ color: "white" }} />}
            sx={{ color: "white" }}
          >
            UPLOAD DOCUMENTS
            {/* <FormattedLabel id="addDocuments" /> */}
          </Button>
        </div>
      </div>
       ) : (
        <>
          <div className={styles.mainButton}>

            <div
              style={{
                backgroundColor: "#1976d2",
                borderRadius: "5px",
                marginBottom: 10,
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
            </div>
          </div>
        </>
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
              Upload File
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
              {/* <FormattedLabel id="cancel" /> */}
              Cancel
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
export default FileTable;
