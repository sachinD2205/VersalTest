//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";
import ReportIcon from "@mui/icons-material/Report";
import { Button, IconButton, Modal, Stack, TextareaAutosize, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";

import styles from "../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import urls from "../../../../URLS/urls";
// import scrutinyActionSchema from './schema/scrutinyActionSchema'
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import swal from "sweetalert";

const Index = (props) => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const [modalforAprov, setmodalforAprov] = useState(false);
  // const [remark, setRemark] = useState(null)

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  let serviceId = (serviceId = user?.menus?.find((m) => m?.id == selectedMenuFromDrawer)?.serviceId);

  useEffect(() => {
    console.log("props12121", props);
    console.log("selectedMenuFromDrawer:-->", selectedMenuFromDrawer);
    console.log("serviceId", serviceId);
    console.log(router.query.role, "123456");
  }, []);

  const methods = useFormContext({
    criteriaMode: "all",
    // resolver: yupResolver(scrutinyActionSchema),
    mode: "onChange",
  });

  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  //aprovel
  const remarks = async (prop) => {
    let id;
    if (router?.query?.id) {
      id = router?.query?.id;
    }

    console.log("props?.data", props?.data);
    console.log("props?.data?.id", props?.data?.id);

    if (props?.data?.id) {
      id = props?.data?.id;
    }

     // {
    //   "clerkRejectRemark":"zala  ka N",
    //   "id":184,
    //   "groundSlotsLst":[{
    //   "id":46,
    //   "date":"2023-06-10",
    //   "toBookingTime":"08:00:00",
    //   "fromBookingTime":"08:00:00",
    //   "fromDate":"2023-06-01",
    //   "toDate":"2023-06-30",
    //   "groundBookingKey":184,
    //   "activeFlag":"Y"
      
    //   }

    const finalBody = {
        // id: Number(router?.query?.id),
        id: Number(id),
        clerkRejectRemark:
          prop == "APPROVE"
            ? getValues("remark") == null || getValues("remark") == undefined
              ? ""
              : getValues("remark")
            : null,
            groundSlotsLst:watch("groundSlotsLst"),
         emailAddress : (getValues("emailAddress")),
         serviceId : (getValues("serviceId")), 
      };

       // const finalBody = {
    //   // id: Number(router?.query?.id),
    //   id: Number(id),
    //   desg: props?.hardCodeAuthority,
    //   facilityName:props?.facilityName,
    //   role: props?.newRole,
    //   approveRemark:
    //     prop == "APPROVE"
    //       ? getValues("remark") == null || getValues("remark") == undefined
    //         ? ""
    //         : getValues("remark")
    //       : null,
    //   rejectRemark:
    //     prop == "REASSIGN"
    //       ? getValues("remark") == null || getValues("remark") == undefined
    //         ? ""
    //         : getValues("remark")
    //       : null,
    // };
  
    await axios
      .post(`${urls.SPURL}/groundBooking/cancelSlots`, finalBody, {

        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      .then((response) => {
        if (response.status === 200) {
          swal("Saved!", "Record Saved successfully !", "success");
        }
      })
      .catch((err) => {
        swal("Error!", "Somethings Wrong!", "error");
      });
  };

  return (
    <>
      <div className={styles.apprve} style={{ marginTop: "25px" }}></div>

      <Stack spacing={15} direction="row" style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          endIcon={<NextPlanIcon />}
          color="success"
          onClick={() => {
            // alert(serviceId)
            setmodalforAprov(true);
          }}
        >
            CANCEL SLOT
          {/* <FormattedLabel id="actions" /> */}
        </Button>

        <Button
          variant="contained"
          endIcon={<CloseIcon />}
          color="error"
          onClick={() => {
            swal({
              title: "Exit?",
              text: "Are you sure you want to exit this Record ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal("Record is Successfully Exit!", {
                  icon: "success",
                });
                router.push(`/sportsPortal/transaction/groundBookingNew/scrutiny`);
              } else {
                swal("Record is Safe");
              }
            });
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
      </Stack>
      <form {...methods} onSubmit={handleSubmit(remarks)}>
        <div className={styles.model}>
          <Modal
            open={modalforAprov}
            //onClose={clerkApproved}
            onCancel={() => {
              setmodalforAprov(false);
            }}
          >
            <div className={styles.boxRemark}>
              <div className={styles.titlemodelremarkAprove}>
                <Typography
                  className={styles.titleOne}
                  variant="h6"
                  component="h2"
                  color="#f7f8fa"
                  style={{ marginLeft: "25px" }}
                >
                  <FormattedLabel id="remarkModel" />
                  {/* Enter Remark on application */}
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={() => router.push(`/sportsPortal/transaction/groundBookingNew/scrutiny`)}
                  />
                </IconButton>
              </div>

              <div className={styles.btndate} style={{ marginLeft: "200px" }}>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={4}
                  placeholder="Enter a Remarks"
                  style={{ width: 700 }}
                  // onChange={(e) => {
                  //   setRemark(e.target.value)
                  // }}
                  // name="remark"
                  {...register("remark")}
                />
              </div>

              <div className={styles.btnappr}>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ThumbUpIcon />}
                  onClick={async () => {
                    remarks("APPROVE");

                    // if (serviceId == 10) {
                    router.push(`/sportsPortal/transaction/groundBookingNew/scrutiny`);
                    // } else if (serviceId == 67) {
                    //   router.push(
                    //     `/marriageRegistration/transactions/boardRegistrations/scrutiny`,
                    //   )
                    // }
                  }}
                >
                  APPROVE
                  {/* <FormattedLabel id="APPROVE" /> */}
                </Button>

                
                {router.query.role == "FINAL_APPROVAL" ? (
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ReportIcon />}
                    onClick={() => {
                      remarks("REJECT");
                    }}
                  >
                    <FormattedLabel id="reject" />
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  variant="contained"
                  endIcon={<CloseIcon />}
                  color="error"
                  onClick={() => {
                    swal({
                      title: "Exit?",
                      text: "Are you sure you want to exit this Record ? ",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete) {
                        swal("Record is Successfully Exit!", {
                          icon: "success",
                        });
                        router.push(`/sportsPortal/transaction/groundBookingNew/scrutiny`);
                      } else {
                        swal("Record is Safe");
                      }
                    });
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </form>
    </>
  );
};
export default Index;
