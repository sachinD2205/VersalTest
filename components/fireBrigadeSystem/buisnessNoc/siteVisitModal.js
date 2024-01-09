import { Modal } from "@mui/material";
import React from "react";

const SiteVisitModal = (props) => {
  let siteVisitModalState = props.siteVisitModalState;

  useEffect(() => {
    if (sitevisitModal == "ture") {
      setSiteVisitModal(siteVisitModalState);
    }
  }, [siteVisitModalState]);
  const [siteVisitModal, setSiteVisitModal] = useState(false);
  const siteVisitModalOpen = () => setSiteVisitModal(true);
  const siteVisitOtpModalClose = () => setSiteVisitModal(false);
  return (
    <>
      <Modal
        open={siteVisitModal}
        onClose={() => siteVisitOtpModalClose()}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // padding: 5,
        }}
      ></Modal>
    </>
  );
};

export default SiteVisitModal;
