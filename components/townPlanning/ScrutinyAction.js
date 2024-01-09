import CloseIcon from "@mui/icons-material/Close";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ReportIcon from "@mui/icons-material/Report";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
// import { Watch } from "@mui/icons-material";
// import scrutinyActionSchema from './schema/scrutinyActionSchema'

const Index = (props) => {
  //catch
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const [modalforAprov, setmodalforAprov] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState();
  // const [remark, setRemark] = useState(null)

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  let serviceId = (serviceId = user?.menus?.find(
    (m) => m?.id == selectedMenuFromDrawer,
  )?.serviceId);

  useEffect(() => {
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
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  let userInfo = useSelector(
    (state) => state.user.user?.userDao?.officeDepartmentDesignationUserDaoLst,
  );
  // let Designation = useSelector(
  //   (state) => state.user.user.userDao.officeDepartmentDesignationUserDaoLst,
  // );
  //aprovel
  const language = useSelector((state) => state?.labels.language);
  const remarks = async (props) => {
    console.log(props, "props");
    // e.preventDefault();
    console.log("gphoto", getValues("gphoto"));

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
      router?.query?.id,
    );
    const finalBody = {
      selectedDepartment: watch("selectedDepartment"),
      selectedDesignation: watch("selectedDesignation"),
      questionAnswers: watch("tempa"),
      // id: Number(router?.query?.id),
      id: Number(applicationId),
      trnLoiDao: { mstServiceChargesId: 2 },

      approveRemark:
        props == "APPROVE"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      rejectRemark:
        props == "REASSIGN"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,

      finalRejectionRemark:
        props == "REJECT"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      // role: router.query.role,
      // ...photoAndThumb,
    };
    console.log("ddddddddd", watch("tempa"), finalBody);
    console.log("serviceId**-", serviceId);
    if (serviceId == 19) {
      console.log("developmentPlan-remark", finalBody);
      await axios
        .post(
          `${urls.TPURL}/developmentPlanOpinion/saveApplication`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              serviceId: 19,
            },
          },
        )

        .then((response) => {
          if (response.status === 200) {
            {
              language == "en"
                ? swal("Saved!", "Record Saved successfully !", "success")
                : swal(
                    "जतन केले!",
                    "रेकॉर्ड यशस्वीरित्या जतन केले!",
                    "success",
                  );
            }

            router.push(
              `/townPlanning/transactions/developmentPlanOpinion/scrutiny`,
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
      // .catch((err) => {
      //   {
      //     language == "en"
      //       ? swal("Error!", "Somethings Wrong!", "error")
      //       : swal("त्रुटी!", "काहीतरी चुकीचे!", "error");
      //   }
      // });
    } else if (serviceId == 17) {
      console.log("partPlan-remark", finalBody);
      axios
        .post(`${urls.TPURL}/partplan/savepartplan`, finalBody, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            serviceId: 17,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            {
              language == "en"
                ? swal("Saved!", "Record Saved successfully !", "success")
                : swal(
                    "जतन केले!",
                    "रेकॉर्ड यशस्वीरित्या जतन केले!",
                    "success",
                  );
            }

            router.push(`/townPlanning/transactions/partPlan/scrutiny`);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (serviceId == 18) {
      console.log("ZONE CERTIFICATE", finalBody);
      axios
        .post(
          `${urls.TPURL}/transaction/zoneCertificate/savezonecertificate`,
          finalBody,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              serviceId: 18,
            },
          },
        )
        .then((response) => {
          if (response.status === 200) {
            {
              language == "en"
                ? swal("Saved!", "Record Saved successfully !", "success")
                : swal(
                    "जतन केले!",
                    "रेकॉर्ड यशस्वीरित्या जतन केले!",
                    "success",
                  );
            }

            router.push(`/townPlanning/transactions/zoneCertificate/scrutiny`);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (serviceId == 20) {
      console.log("setBack CERTIFICATE", finalBody);
      axios
        .post(`${urls.TPURL}/setBackCertificate/saveApplication`, finalBody, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            serviceId: 20,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            {
              language == "en"
                ? swal("Saved!", "Record Saved successfully !", "success")
                : swal(
                    "जतन केले!",
                    "रेकॉर्ड यशस्वीरित्या जतन केले!",
                    "success",
                  );
            }

            router.push(
              `/townPlanning/transactions/setBackCertificate/scrutiny`,
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    const uniqueObjects = userInfo?.reduce((unique, current) => {
      const { departmentId, department, departmentMr } = current;
      const key = `${departmentId}${department}${departmentMr}`;
      if (!unique[key]) {
        unique[key] = { departmentId, department, departmentMr };
      }
      return unique;
    }, {});

    const uniqueArray = Object?.values(uniqueObjects);
    setDepartments(uniqueArray);
    console.log("uniqueArray++++++", uniqueArray);
  }, [userInfo]);

  return (
    <>
      <div className={styles.apprve} style={{ marginTop: "25px" }}></div>

      <Stack
        spacing={15}
        direction="row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button
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
          onClick={() => {
            // alert(serviceId)
            if (serviceId == 19) {
              router.push(
                `/townPlanning/transactions/developmentPlanOpinion/scrutiny`,
              );
            } else if (serviceId == 17) {
              router.push(`/townPlanning/transactions/partPlan/scrutiny`);
            } else if (serviceId == 18) {
              router.push(
                `/townPlanning/transactions/zoneCertificate/scrutiny`,
              );
            } else if (serviceId == 20) {
              router.push(
                `/townPlanning/transactions/setBackCertificate/scrutiny`,
              );
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
          >
            <div className={styles.boxRemark} style={{ height: "300px" }}>
              <div className={styles.titlemodelremarkAprove}>
                <Typography
                  className={styles.titleOne}
                  variant="h6"
                  component="h2"
                  color="#f7f8fa"
                  style={{ marginLeft: "25px" }}
                >
                  <FormattedLabel id="remarkModel" />
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={() =>
                      router.push(
                        `/townPlanning/transactions/partPlan/scrutiny`,
                      )
                    }
                  />
                </IconButton>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                  marginTop: "3vh",
                }}
              >
                <div>
                  <FormControl
                    sx={{
                      width: "230px",
                    }}
                    variant="standard"
                    error={!!errors.selectedDepartment}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="department" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          onChange={(value) => field.onChange(value)}
                          label="selectedDepartment"
                        >
                          {departments &&
                            departments.map((value, index) => (
                              <MenuItem key={index} value={value?.departmentId}>
                                {value.department}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="selectedDepartment"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.selectedDepartment
                        ? errors.selectedDepartment.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div>
                  <FormControl
                    sx={{
                      width: "230px",
                    }}
                    variant="standard"
                    error={!!errors.selectedDesignation}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="designation" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          onChange={(value) => field.onChange(value)}
                          label="selectedDesignation"
                        >
                          {userInfo &&
                            userInfo
                              .filter(
                                (value) =>
                                  value.departmentId ==
                                  watch("selectedDepartment"),
                              )
                              .map((value, index) => (
                                <MenuItem
                                  key={index}
                                  value={value?.designationId}
                                >
                                  {value.designation}
                                </MenuItem>
                              ))}
                        </Select>
                      )}
                      name="selectedDesignation"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.selectedDesignation
                        ? errors.selectedDesignation.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>
              <div className={styles.btndate} style={{ marginLeft: "200px" }}>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={4}
                  placeholder={
                    language == "en"
                      ? "Enter a Remarks"
                      : "एक टिप्पणी प्रविष्ट करा"
                  }
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
                    // setBtnSaveText('APPROVED')
                    // alert(serviceId)

                    if (serviceId == 19) {
                      router.push(
                        `/townPlanning/transactions/developmentPlanOpinion/scrutiny`,
                      );
                    } else if (serviceId == 17) {
                      router.push(
                        `/townPlanning/transactions/partPlan/scrutiny`,
                      );
                    } else if (serviceId == 18) {
                      router.push(
                        `/townPlanning/transactions/zoneCertificate/scrutiny`,
                      );
                    } else if (serviceId == 20) {
                      router.push(
                        `/townPlanning/transactions/setBackCertificate/scrutiny`,
                      );
                    }
                  }}
                >
                  <FormattedLabel id="APPROVE" />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<UndoIcon />}
                  onClick={() => {
                    remarks("REASSIGN");
                    // alert(serviceId, 'REASSIGN')
                    if (serviceId == 19) {
                      router.push(
                        `/townPlanning/transactions/developmentPlanOpinion/scrutiny`,
                      );
                    } else if (serviceId == 17) {
                      router.push(
                        `/townPlanning/transactions/partPlan/scrutiny`,
                      );
                    } else if (serviceId == 18) {
                      router.push(
                        `/townPlanning/transactions/zoneCertificate/scrutiny`,
                      );
                    } else if (serviceId == 20) {
                      router.push(
                        `/townPlanning/transactions/setBackCertificate/scrutiny`,
                      );
                    }
                  }}
                >
                  <FormattedLabel id="REASSIGN" />
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
                    const textAlert =
                      language == "en"
                        ? "Are you sure you want to exit this Record ? "
                        : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                    const title = language == "en" ? "Exit ! " : "बाहेर पडा!";

                    sweetAlert({
                      title: title,
                      text: textAlert,
                      icon: "warning",
                      buttons: true,
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete) {
                        language == "en"
                          ? sweetAlert({
                              title: "Exit!",
                              text: "Record is Successfully Exit!!",
                              icon: "success",
                              button: "Ok",
                            })
                          : sweetAlert({
                              title: "बाहेर पडा!",
                              text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                              icon: "success",
                              button: "ओके",
                            });
                        router.push(`/DepartmentDashboard`);
                      } else {
                        language == "en"
                          ? sweetAlert({
                              title: "Cancel!",
                              text: "Record is Successfully Cancel!!",
                              icon: "success",
                              button: "Ok",
                            })
                          : sweetAlert({
                              title: "रद्द केले!",
                              text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                              icon: "success",
                              button: "ओके",
                            });
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
