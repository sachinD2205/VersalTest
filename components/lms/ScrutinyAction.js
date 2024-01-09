//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";
import ReportIcon from "@mui/icons-material/Report";
import {
  Button,
  IconButton,
  Modal,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../styles/lms/[scrutinyAction]view.module.css";
import urls from "../../URLS/urls";
import scrutinyActionSchema from "./schema/scrutinyActionSchema";
import { catchExceptionHandlingMethod } from "../../util/util";
import Loader from "../../containers/Layout/components/Loader";

const Index = (props) => {
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const [modalforAprov, setmodalforAprov] = useState(false);
  // const [remark, setRemark] = useState(null)
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  let serviceId = (serviceId = user?.menus?.find(
    (m) => m?.id == selectedMenuFromDrawer
  )?.serviceId);

  useEffect(() => {
    console.log("selectedMenuFromDrawer:-->", selectedMenuFromDrawer);
    console.log("serviceId", serviceId);
    console.log(router.query.role, "123456");
    setValue("remark", "");
  }, []);

  const methods = useFormContext({
    criteriaMode: "all",
    resolver: yupResolver(scrutinyActionSchema),
    mode: "onChange",
  });

  const {
    control,
    register,
    watch,
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  //aprovel
  const remarks = async (props) => {
    setLoading(true);
    // e.preventDefault();
    console.log("gphoto", getValues("gphoto"));

    const photoAndThumb = {
      aadharCard: getValues("aadharCard"),
    };

    console.log("photoAndThumb", photoAndThumb);
    let applicationId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    console.log(
      "appid",
      applicationId,
      router?.query?.applicationId,
      router?.query?.id
    );
    console.log("a12345678", router?.query?.id, watch("remark"), serviceId);
    if (router?.query?.id) {
      let finalbody = {
        id: router?.query?.id,
        isApprove: true,
        remark: watch("remark"),
      };

      if (serviceId == 84) {
        setLoading(false);
        // await axios
        //     .post(
        //         `${urls.MR}/transaction/applicant/saveApplicationApprove`,
        //         finalBody,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${user.token}`,
        //             },
        //         },
        //     )
        //     .then((response) => {
        //         if (response.status === 200) {
        //             swal('Saved!', 'Record Saved successfully !', 'success')
        //             router.push(
        //                 `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
        //             )
        //         }
        //     })
        //     .catch((err) => {
        //         swal('Error!', 'Somethings Wrong!', 'error')
        //     })
      } else if (serviceId == 85) {
        console.log("aala");
        // axios
        //   .post(
        //     `${urls.LMSURL}/trnApplyForNewMembership/updateStatus?id=${
        //       router?.query?.id
        //     }&isApprove=${props == "APPROVE" ? true : false}&remark=${watch(
        //       "remark"
        //     )}`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${token}`,
        //       },
        //     }
        //   )
        axios
          .get(
            `${urls.LMSURL}/trnApplyForNewMembership/updateStatus?id=${
              router?.query?.id
            }&isApprove=${props == "APPROVE" ? true : false}&remark=${watch(
              "remark"
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              setLoading(false);
              props == "APPROVE"
                ? sweetAlert({
                    title: language === "en" ? "Approved ! " : "मंजूर !",
                    text:
                      language === "en"
                        ? "Application Approved successfully !"
                        : "अर्ज यशस्वीरित्या मंजूर झाला !",
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                    dangerMode: false,
                    closeOnClickOutside: false,
                  }).then((will) => {
                    if (will) {
                      router.push(
                        `/lms/transactions/newMembershipRegistration/scrutiny`
                      );
                    }
                  })
                : sweetAlert({
                    title: language === "en" ? "Reassign ! " : "नाकारले !",
                    text:
                      language === "en"
                        ? "Application Reassign successfully !"
                        : "अर्ज यशस्वीरित्या पुन्हा नियुक्त केला!",
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                    dangerMode: false,
                    closeOnClickOutside: false,
                  }).then((will) => {
                    if (will) {
                      router.push(
                        `/lms/transactions/newMembershipRegistration/scrutiny`
                      );
                    }
                  });
              // router.push(
              //   `/lms/transactions/newMembershipRegistration/scrutiny`
              // );
            }
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            catchExceptionHandlingMethod(e, language);
          });
      } else if (serviceId == 87) {
        setLoading(false);
        // console.log("modification of mbr", finalBody);
        // axios
        //     .post(
        //         `${urls.MR}/transaction/modOfMarBoardCertificate/saveModOfMarBoardCertificateApprove`,
        //         finalBody,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${user.token}`,
        //             },
        //         },
        //     )
        //     .then((response) => {
        //         if (response.status === 200) {
        //             router.push(
        //                 `/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny`,
        //             )
        //         }
        //     })
      } else if (serviceId == 88) {
        setLoading(false);
        // console.log("modification of NewMr", finalBody);
        // axios
        //     .post(
        //         `${urls.MR}/transaction/modOfMarCertificate/saveApplicationApprove`,
        //         finalBody,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${user.token}`,
        //             },
        //         },
        //     )
        //     .then((response) => {
        //         if (response.status === 200) {
        //             router.push(
        //                 `/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny`,
        //             )
        //         }
        //     })
      } else if (serviceId == 90) {
        // setLoading(false);
        let ID = router.query.id;
        // axios
        //   .post(
        //     `${urls.LMSURL}/trnRenewalOfMembership/updateStatus?id=${
        //       router?.query?.id
        //     }&isApprove=${props == "APPROVE" ? true : false}&remark=${watch(
        //       "remark"
        //     )}`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${token}`,
        //       },
        //     }
        //   )
        axios
          .get(
            `${urls.LMSURL}/trnRenewalOfMembership/updateStatus?id=${
              router?.query?.id
            }&isApprove=${props == "APPROVE" ? true : false}&remark=${watch(
              "remark"
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            // setLoading(false);
            if (response.status === 200 || response.status === 201) {
              setLoading(false);
              props == "APPROVE"
                ? sweetAlert({
                    title: language === "en" ? "Approved ! " : "मंजूर !",
                    text:
                      language === "en"
                        ? "Application Approved successfully !"
                        : "अर्ज यशस्वीरित्या मंजूर झाला !",
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                    dangerMode: false,
                    closeOnClickOutside: false,
                  }).then((will) => {
                    if (will) {
                      router.push(`/lms/transactions/renewMembership/scrutiny`);
                    }
                  })
                : sweetAlert({
                    title: language === "en" ? "Reassign ! " : "नाकारले !",
                    text:
                      language === "en"
                        ? "Application Reassign successfully !"
                        : "अर्ज यशस्वीरित्या पुन्हा नियुक्त केला!",
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                    dangerMode: false,
                    closeOnClickOutside: false,
                  }).then((will) => {
                    if (will) {
                      router.push(`/lms/transactions/renewMembership/scrutiny`);
                    }
                  });
              // props == "APPROVE"
              //   ? sweetAlert({
              //       title: language === "en" ? "Approved ! " : "मंजूर !",
              //       text:
              //         language === "en"
              //           ? "Application Approved successfully !"
              //           : "अर्ज यशस्वीरित्या मंजूर झाला !",
              //       icon: "success",
              //     })
              //   : sweetAlert({
              //       title: language === "en" ? "Reassign ! " : "नाकारले !",
              //       text:
              //         language === "en"
              //           ? "Application Reassign successfully !"
              //           : "अर्ज यशस्वीरित्या पुन्हा नियुक्त केला!",
              //       icon: "success",
              //     });
              // router.push(`/lms/transactions/renewMembership/scrutiny`);
            }
          })
          .catch((e) => {
            setLoading(false);
            catchExceptionHandlingMethod(e, language);
          });
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.apprve} style={{ marginTop: "25px" }}></div>

          <Stack
            spacing={15}
            direction="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              size="small"
              variant="contained"
              endIcon={<NextPlanIcon />}
              color="success"
              onClick={() => {
                // alert(serviceId)
                setmodalforAprov(true);
              }}
            >
              <FormattedLabel id="actions" />
            </Button>

            <Button
              variant="contained"
              endIcon={<CloseIcon />}
              color="error"
              size="small"
              onClick={() => {
                // alert(serviceId)
                if (serviceId == 84) {
                  // router.push(
                  //     `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
                  // )
                } else if (serviceId == 85) {
                  router.push(
                    `/lms/transactions/newMembershipRegistration/scrutiny`
                  );
                } else if (serviceId == 90) {
                  router.push(`/lms/transactions/renewMembership/scrutiny`);
                }
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </Stack>
          <form {...methods} onSubmit={handleSubmit("remarks")}>
            <div className={styles.model}>
              <Modal
                open={modalforAprov}
                //onClose={clerkApproved}
                onCancel={() => {
                  setmodalforAprov(false);
                }}
                style={{
                  // marginLeft: "25vh",
                  // marginTop: "25vh",
                  // marginRight: "25vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "solid red",
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
                        onClick={() => {
                          if (serviceId == 84) {
                            // router.push(
                            //     `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
                            // )
                          } else if (serviceId == 85) {
                            router.push(
                              `/lms/transactions/newMembershipRegistration/scrutiny`
                            );
                          } else if (serviceId == 90) {
                            router.push(
                              `/lms/transactions/renewMembership/scrutiny`
                            );
                          }
                        }}
                      />
                    </IconButton>
                  </div>

                  <div
                    className={styles.btndate}
                    style={{ marginLeft: "200px" }}
                  >
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={4}
                      placeholder="Enter a Remarks"
                      style={{ width: "50vw" }}
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
                      size="small"
                      endIcon={<ThumbUpIcon />}
                      disabled={!(watch("remark")?.length > 0 ? true : false)}
                      onClick={async () => {
                        remarks("APPROVE");
                        // setBtnSaveText('APPROVED')
                        // alert(serviceId)

                        // if (serviceId == 84) {
                        //   // router.push(
                        //   //     `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
                        //   // )
                        // } else if (serviceId == 85) {
                        //   router.push(
                        //     `/lms/transactions/newMembershipRegistration/scrutiny`
                        //   );
                        // } else if (serviceId == 90) {
                        //   router.push(`/lms/transactions/renewMembership/scrutiny`);
                        // }
                      }}
                    >
                      <FormattedLabel id="approve" />
                      {/* Approve */}
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      endIcon={<UndoIcon />}
                      disabled={!(watch("remark")?.length > 0 ? true : false)}
                      onClick={() => {
                        remarks("REASSIGN");
                        // alert(serviceId, 'REASSIGN')
                        // if (serviceId == 84) {
                        //   // router.push(
                        //   //     `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
                        //   // )
                        // } else if (serviceId == 85) {
                        //   router.push(
                        //     `/lms/transactions/newMembershipRegistration/scrutiny`
                        //   );
                        // } else if (serviceId == 90) {
                        //   router.push(
                        //     `/lms/transactions/renewMembership/scrutiny`
                        //   );
                        // }
                      }}
                    >
                      <FormattedLabel id="reassign" />
                      {/* Reassign */}
                    </Button>
                    {router.query.role == "FINAL_APPROVAL" ? (
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        endIcon={<ReportIcon />}
                        disabled={!(watch("remark")?.length > 0 ? true : false)}
                        onClick={() => {
                          remarks("REJECT");
                        }}
                      >
                        {/* <FormattedLabel id="reject" /> */}
                        Reject
                      </Button>
                    ) : (
                      ""
                    )}
                    <Button
                      size="small"
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
                            if (serviceId == 84) {
                              // router.push(
                              //     `/marriageRegistration/transactions/newMarriageRegistration/scrutiny`,
                              // )
                            } else if (serviceId == 85) {
                              router.push(
                                `/lms/transactions/newMembershipRegistration/scrutiny`
                              );
                            } else if (serviceId == 90) {
                              router.push(
                                `/lms/transactions/renewMembership/scrutiny`
                              );
                            }
                          } else {
                            swal("Record is Safe");
                          }
                        });
                      }}
                    >
                      <FormattedLabel id="exit" />
                      {/* Exit */}
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </form>
        </>
      )}
    </>
  );
};
export default Index;
