import { Button, Grid, Modal, TextareaAutosize } from "@mui/material";
import React, { useState } from "react";

const ApproveRevertModal = (props) => {
  modalTest = props.modalTest;
  useEffect(() => {
    setOtpModal(modalTest);
  }, [modalTest]);

  const [otpModal, setOtpModal] = useState(false);
  const otpModalOpen = () => setOtpModal(true);
  const otpModalClose = () => setOtpModal(false);
  return (
    <>
      <Modal
        open={otpModal}
        onClose={() => otpModalClose()}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{
              backgroundColor: "solid red 1px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Remarks
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ backgroundColor: "solid red 1px", width: "500px" }}
          >
            <TextareaAutosize
              sx={{ width: "500px", backgroundColor: "solid red 1px" }}
              style={{
                width: "500px",
                minWidth: "550px",
                backgroundColor: "solid red 1px",
              }}
            ></TextareaAutosize>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button>Save </Button>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default ApproveRevertModal;
