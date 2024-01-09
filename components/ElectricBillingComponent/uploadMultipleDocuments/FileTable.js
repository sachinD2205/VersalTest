import { Add } from "@mui/icons-material";
import {
  Box,
  Grid,
  Button,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/LegalCase_Styles/upload.module.css";
import UploadButton from "./UploadButton";
import UploadButtonThumbOP from "./DocumentsUploadThumbOP";

const FileTable = (props) => {
  let filePath = {};
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  } 
  // const [btnInputStateDemandBill, setBtnInputStateDemandBill] = useState(true);

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  function temp(arg) {
    filePath = arg;
  }

  const handleClose = () => {
    props?.newFilesFn((oldElements) => {
      return [
        ...oldElements,
        {
          srNo: props.rows.length + 1,
          fileId: props.rows.length + 1,
          attacheDepartment: filePath?.attacheDepartment,
          attacheDesignation: filePath?.attacheDesignation,
          attchedBy: filePath?.attachedBy,
          activeFlag: "Y",
          attachedDate: new Date(),

          // originalFileName: label.toUpperCase(),
          originalFileName: filePath?.fileName,

          fileName: filePath?.fileName,

          documentType: filePath?.extension.split(".")[1].toUpperCase(),
          documentPath: filePath?.filePath,

          attacheDepartmentEn: user?.userDao?.departmentName,
          attacheDepartmentMr: user?.userDao?.departmentNameMr,

          attacheDesignationEn: user?.userDao?.designationName,
          attacheDesignationMr: user?.userDao?.designationNameMr,

          attachedNameEn:
            user?.userDao?.firstNameEn +
            " " +
            user?.userDao?.middleNameEn +
            " " +
            user?.userDao?.lastNameEn,
          attachedNameMr:
            user?.userDao?.firstNameMr +
            " " +
            user?.userDao?.middleNameMr +
            " " +
            user?.userDao?.lastNameMr,
        },
      ];
    });
    props.filePath("");
    // props.uploading(false);
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
  useEffect(() => {
    console.log("props.authorizedToUpload", props.authorizedToUpload);
  }, [props.authorizedToUpload]);

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
          {/* <FormattedLabel id="attachmentSchema" /> */}
        </Typography>
      </Box>
      {props.authorizedToUpload ? (
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
            {/* <IconButton onClick={handleOpen}>
             ADD DOCUMENTS <Add sx={{ color: "white" }} />
            </IconButton> */}
            {/* {console.log("props?.additionalFiles", props)} */}
            {/* ADD DOCUMENTS */}
            <Button
              onClick={handleOpen}
              endIcon={<Add sx={{ color: "white" }} />}
              sx={{ color: "white" }}
            >
              <FormattedLabel id="attachImages" />
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
            ></div>
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
          <Grid container className={styles.filee} >
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center", 
                marginBottom: "20px",
              }}
            >
              <Typography
                align="center"
                sx={{
                  fontWeight: "bolder",
                  fontSize: "large",
                  textTransform: "capitalize",
                }}
              >
                <FormattedLabel id="fileUpload" />
              </Typography>
            </Grid>
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "60px",
               
              }}
            >
              <UploadButton
                appName={props.appName}
                serviceName={props.serviceName}
                filePath={temp}
                fileName={props.fileName}
                fileLabel={setLabel}
                handleClose={handleClose}
                // uploading={props.uploading}
                modalState={setOpen}
              />
            </Grid>
          </Grid>
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
        sx={{
          overflowY: "scroll",
          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "#556CD6",
            color: "white",
          },

          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
        getRowId={(row) => row.srNo}
        autoHeight
        disableSelectionOnClick
        rows={props.rows}
        columns={props.columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        // getRowId={(row) => row.customId}
      />
    </div>
  );
};
export default FileTable;
