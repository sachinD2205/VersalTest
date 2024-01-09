import { Add } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import UploadButton from "./UploadButton";
import styles from "../../../components/grievanceMonitoring/view.module.css";
import moment from "moment";

const FileTable = (props) => {
  let filePath = {};
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [btnInputStateDemandBill, setBtnInputStateDemandBill] = useState(true);
  const user = useSelector((state) => {
    return state?.user?.user?.userDao?.id;
  });

  const userCitizen = useSelector((state) => {
    return state?.user?.user?.id;
  });

  const userCFC = useSelector((state) => {
    return state?.user?.user?.id;
  });

  const logedInUser = localStorage.getItem("loggedInUser");

  const handelParams = (key) => {
    if (key === "departmentUser") {
      return user;
    } else if (key === "citizenUser") {
      return userCitizen;
    } else if (key === "cfcUser") {
      return userCFC;
    }
  };

  function temp(arg) {
    filePath = arg;
  }

  const handleClose = () => {
    props.newFilesFn((oldElements) => {
      return [
        ...oldElements,
        {
          id: props.rows.length + 1,
          applicantKey: handelParams(logedInUser),
          documentKey: null,
          documentPath: filePath?.filePath,
          documentType: filePath?.extension.split(".")[1].toUpperCase(),
          attachedDate: moment(new Date()).format("DD-MM-YYYY, h:mm:ss a"),
          originalFileName: filePath?.fileName.split(".")[0].toUpperCase(),
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
    if (localStorage.getItem("btnInputStateDemandBill") == "false") {
      setBtnInputStateDemandBill(localStorage.getItem(false));
    } else {
      setBtnInputStateDemandBill(true);
    }
  }, []);

  // View
  return (
    <>
      <div>
        <Grid
          container
          style={{ padding: "10px", backgroundColor: "lightblue" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            item
            xs={10}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            <Typography
              sx={{ fontWeight: 800, marginLeft: "20%" }}
            >
              <FormattedLabel id="uploadGeotagImage" />
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
          >
            <Button
              variant="contained"
              endIcon={<Add />}
              type="button"
              color="primary"
              onClick={handleOpen}
              size="small"
            >
              {<FormattedLabel id="addDocuments" />}
            </Button>
          </Grid>
        </Grid>

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
          autoHeight
          disableSelectionOnClick
          rows={props.rows}
          columns={props.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>

  
      <Modal
        open={(props.fileLabel ? true : false) || open}
        onClose={() => {
          setOpen(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "15%",
        }}
      >
        <Box
          sx={{
            width: "30%",
            backgroundColor: "white",
            height: "40%",
            borderRadius: "10px",
          }}
        >
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.5%",
              }}
              className={styles.details1}
            >
              <Typography
                sx={{
                  fontWeight: "bolder",
                  fontSize: "large",
                  textTransform: "capitalize",
                }}
                className={styles.fancy_link1}
              >
                <FormattedLabel id="fileUpload" />
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setOpen(false);
                }}
                size="small"
              >
                <FormattedLabel id="cancel" />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
export default FileTable;
