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

const FileTable = (props) => {
  let filePath = {};
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
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
    console.log("FileTable auth", arg);
  }

  const handleClose = () => {
    props.newFilesFn((oldElements) => {
      console.log("user7878787 oldElements", oldElements);
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
    props.uploading(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "50%",
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
            }}
          >
            <Button
              size="small"
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
        {props?.rows?.length > 4 ? (
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
                <FormattedLabel id="fileUploadValidationError" />
              </Typography>
            </div>
            <div>
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
        ) : (
          <Box sx={style}>
            <Grid container className={styles.filee}>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginBottom: "40px",
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
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginTop: "50px",
                  marginBottom: "20px",
                }}
              >
                <UploadButton
                  appName={props.appName}
                  serviceName={props.serviceName}
                  filePath={temp}
                  // fileName={props.fileName}
                  fileLabel={setLabel}
                  handleClose={handleClose}
                  uploading={props.uploading}
                  modalState={setOpen}
                />
              </Grid>
            </Grid>
            <Grid
              sx={{
                // minWidth: "80%",
                display: "flex",
                justifyContent: "center",
                alignItems:"cener"
              }}
            >
              <Button
                variant="contained"
                size="small"
                color="error"
                // sx={{ marginTop: "2vw" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <FormattedLabel id="cancel" />
              </Button>
            </Grid>
          </Box>
        )}
      </Modal>

      <DataGrid
        getRowId={(row) => row.srNo}
        autoHeight
        sx={{
          margin: "10px",
          overflowY: "scroll",
          "& .MuiDataGrid-virtualScrollerContent": {},
          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "#556CD6",
            color: "white",
          },

          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
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
