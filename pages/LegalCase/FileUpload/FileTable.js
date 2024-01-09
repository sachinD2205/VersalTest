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

  const user = useSelector((state) => {
    return state.user.user;
  });

  console.log("propsRowss", props?.rows);

  function temp(arg) {
    filePath = arg;
  }

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
      console.log(
        "user7878787",
        (typeof user?.userDao?.firstNameMr === "string" &&
          user?.userDao?.firstNameMr) +
          " " +
          (typeof user?.userDao?.middleNameMr === "string"
            ? user?.userDao?.middleNameMr
            : " ") +
          " " +
          (typeof user?.userDao?.lastNameMr === "string" &&
            user?.userDao?.lastNameMr)
      );

      let _enName =
        (typeof user?.userDao?.firstNameEn === "string" &&
          user?.userDao?.firstNameEn) +
        " " +
        (typeof user?.userDao?.middleNameEn === "string"
          ? user?.userDao?.middleNameEn
          : " ") +
        " " +
        (typeof user?.userDao?.lastNameEn === "string" &&
          user?.userDao?.lastNameEn);
      let _mrName =
        (typeof user?.userDao?.firstNameMr === "string" &&
          user?.userDao?.firstNameMr) +
        " " +
        (typeof user?.userDao?.middleNameMr === "string"
          ? user?.userDao?.middleNameMr
          : " ") +
        " " +
        (typeof user?.userDao?.lastNameMr === "string" &&
          user?.userDao?.lastNameMr);
      return [
        ...oldElements,
        {
          // -----------------------------New By Vishal---------------------------------------------
          srNo: props.rows.length + 1,
          attachedNameEn: _enName,
          attachedNameMr: _mrName,
          attachmentNameMr: _mrName,
          uploadedBy: _enName,
          uploadedByMr: _mrName,
          attachedDate: new Date(),
          originalFileName: label.toUpperCase(),
          originalFileName: filePath?.fileName,
          extension: filePath?.extension.split(".")[1].toUpperCase(),
          filePath: filePath?.filePath,
          // -------------------------------Below code is old--------------------------------------------
          // // id: props.rows.length + 1,
          // srNo: props.rows.length + 1,
          // attachedNameEn:
          //   // user?.userDao?.firstNameEn +
          //   // " " +
          //   // user?.userDao?.middleNameEn +
          //   // " " +
          //   // user?.userDao?.lastNameEn,
          //   (typeof user?.userDao?.firstNameEn === "string" &&
          //     user?.userDao?.firstNameEn) +
          //   " " +
          //   (typeof user?.userDao?.middleNameEn === "string"
          //     ? user?.userDao?.middleNameEn
          //     : " ") +
          //   " " +
          //   (typeof user?.userDao?.lastNameEn === "string" &&
          //     user?.userDao?.lastNameEn),
          // // attachedNameMr: user.fullNameMr,
          // attachedNameMr:
          //   // user?.userDao?.firstNameEn +
          //   // " " +
          //   // user?.userDao?.middleNameEn +
          //   // " " +
          //   // user?.userDao?.lastNameEn,
          //   (typeof user?.userDao?.firstNameMr === "string" &&
          //     user?.userDao?.firstNameMr) +
          //   " " +
          //   (typeof user?.userDao?.middleNameMr === "string"
          //     ? user?.userDao?.middleNameMr
          //     : " ") +
          //   " " +
          //   (typeof user?.userDao?.lastNameMr === "string" &&
          //     user?.userDao?.lastNameMr),
          // attachmentNameMr:
          //   (typeof user?.userDao?.firstNameMr === "string" &&
          //     user?.userDao?.firstNameMr) +
          //   " " +
          //   (typeof user?.userDao?.middleNameMr === "string"
          //     ? user?.userDao?.middleNameMr
          //     : " ") +
          //   " " +
          //   (typeof user?.userDao?.lastNameMr === "string" &&
          //     user?.userDao?.lastNameMr),
          // attachedDate: new Date(),
          // originalFileName: label.toUpperCase(),
          // // attachmentName:  filePath?.filePath,
          // originalFileName: filePath?.fileName,
          // // attachedNameEn: filePath?.attachedBy ? filePath?.attachedBy : "-",
          // extension: filePath?.extension.split(".")[1].toUpperCase(),
          // filePath: filePath?.filePath,
          // ------------------------------------------------------------------------------------------------
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
            {/* <FormattedLabel id='attachmentSchema' /> */}
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
            {props?.pageMode !== "View" && (
              <Button
                size="small"
                onClick={handleOpen}
                //  endIcon={<Add sx={{ color: "white" }} />}
                sx={{ color: "white" }}
                // disabled={props?.pageMode === "View" ? true : false}
              >
                {/* ADD DOCUMENTS */}

                {/* <FormattedLabel id="addDocuments" /> */}
                <FormattedLabel id="browse" />
              </Button>
            )}
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
              {/* document */}
              <FormattedLabel id="document" />
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
              size="small"
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
        getRowId={(row) => row?.srNo || row?.id}
        autoHeight
        disableSelectionOnClick
        // rows={props?.rows?.filter((obj) => obj !== {})}
        rows={props?.rows}
        columns={props.columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};
export default FileTable;
