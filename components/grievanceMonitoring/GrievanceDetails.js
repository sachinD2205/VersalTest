import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  CircularProgress,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import DocumentUploadTableSachin from "../../containers/reuseableComponents/DocumentUploadTableSachin";
import AreaWardZoneMapping from "./AreaWardZpneMapping/AreaWardZpneMapping";
import { cfcCatchMethod,moduleCatchMethod } from "../../util/commonErrorUtil";
import Transliteration from "../common/linguosol/transliteration";
import CommonLoader from "../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

// GrievanceDetails
const GrievanceDetails = () => {
  const methods = {
    criteriaMode: "all",
    mode: "onChange",
  };
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext(methods);
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const logedInUser = localStorage.getItem("loggedInUser");
  const [eventTypes, setEventTypes] = useState([]);
  const [categories, setCategory] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [complaintTypes, setcomplaintTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const [pageMode, setPageMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // Get Table - Data
  const getComplaintSubType = () => {
    if (watch("complaintTypeId")) {
      setIsLoading(true);
      axios
        .get(
          `${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${watch(
            "complaintTypeId"
          )}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          let data = res?.data?.complaintSubTypeMasterList?.map((r, i) => ({
            id: r.id,
            complaintSubType: r.complaintSubType,
            complaintSubTypeMr: r.complaintSubTypeMr,
            complaintTypeId: r.complaintTypeId,
            categoryKey: r.categoryKey,
            categoryName: r.categoryName,
            categoryNameMr: r.categoryNameMr,
          }));
          setComplaintSubTypes(data.sort(sortByProperty("complaintSubType")));
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`,{
      headers: headers,
    }).then((res) => {
      let data = res.data.department.map((r, i) => ({
        id: r.id,
        departmentEn: r.department,
        departmentMr: r.departmentMr,
      }));
      setDepartments(data.sort(sortByProperty("departmentEn")));
    }).catch((err)=>{
      cfcErrorCatchMethod(err,true);
    });
  };

  const getSubDepartmentDetails = () => {
    if (watch("departmentName")) {
      setIsLoading(true);
      axios
        .get(
          `${urls.GM}/master/subDepartment/getAllByDeptWise/${watch(
            "departmentName"
          )}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setIsLoading(false);
          let data = res?.data?.subDepartment?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartmentEn: r.subDepartment,
            subDepartmentMr: r.subDepartmentMr,
          }));
          setSubDepartmentList(data.sort(sortByProperty("subDepartmentEn")));
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  const getCategory = () => {
    axios
      .get(`${urls.GM}/categoryTypeMaster/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res.data.categoryTypeMasterList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          categoryEn: r.categoryType,
          categoryMr: r.categoryTypeMr,
        }));
        setCategory(data?.sort(sortByProperty("categoryEn")));
      }).catch((err)=>{
        cfcErrorCatchMethod(err,false);
      });
  };

  const getApplicantType = () => {
    axios
      .get(`${urls.GM}/master/applicantType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res?.data?.applicantType?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          applicantTypeEn: r.applicantType,
          applicantTypeMr: r.applicantTypeMr,
        }));
        setApplicantTypes(data.sort(sortByProperty("applicantTypeEn")));
      }).catch((err)=>{
        cfcErrorCatchMethod(err,false);
      });
  };

  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  const getMediaType = () => {
    axios
      .get(`${urls.GM}/mediaMaster/getMediaForDropDown`, {
        headers: headers,
      })
      .then((res) => {
        let data = res?.data?.mediaMasterList?.map((r, i) => ({
          id: r.id,
          // srNo: i + 1,
          mediaTypeEn: r.mediaName,
          mediaTypeMr: r.mediaNameMr,
        }));
        setMediaTypes(data?.sort(sortByProperty("mediaTypeEn")));
      }).catch((err)=>{
        cfcErrorCatchMethod(err,false);
      });
  };

  const getEventTypes = () => {
    axios
      .get(`${urls.GM}/eventTypeMaster/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res?.data?.eventTypeMasterList?.map((r, i) => ({
          id: r.id,
          // srNo: i + 1,
          eventTypeEn: r.eventType,
          eventTypeMr: r.eventTypeMr,
        }));
        console.log("event type ", data?.sort(sortByProperty("eventTypeEn")));
        setEventTypes(data?.sort(sortByProperty("eventTypeEn")));
      }).catch((err)=>{
        cfcErrorCatchMethod(err,false);
      });
  };

  const getComplaintTypes = () => {
    axios
      .get(`${urls.GM}/complaintTypeMaster/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res?.data?.complaintTypeMasterList?.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          complaintTypeEn: r.complaintType,
          complaintTypeMr: r.complaintTypeMr,
          departmentId: r.departmentId,
          departmentName: r.departmentName,
        }));
        setcomplaintTypes(data?.sort(sortByProperty("complaintTypeEn")));
      }).catch((err)=>{
        cfcErrorCatchMethod(err,false);
      });
  };


  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setPageMode(null);
    } else {
      setPageMode(router.query.pageMode);
    }
    getCategory();
    getApplicantType();
    getMediaType();
    getDepartment();
    getComplaintTypes();
    getEventTypes();
  }, []);

  useEffect(() => {
    if (
      watch("departmentName") != null &&
      watch("departmentName") != undefined &&
      watch("departmentName") != ""
    ) {
      getSubDepartmentDetails();
    }
  }, [watch("departmentName")]);

  useEffect(() => {
    if (
      watch("complaintTypeId") != null &&
      watch("complaintTypeId") != undefined &&
      watch("complaintTypeId") != ""
    ) {
      getComplaintSubType();
    }
  }, [watch("complaintTypeId")]);

  useEffect(() => {
    if (
      watch("complaintTypeId") != null &&
      watch("complaintTypeId") != undefined &&
      watch("complaintTypeId") != ""
    ) {
      let filterObj = complaintTypes?.filter(
        (obj) => obj.id === watch("complaintTypeId")
      );
      setValue("departmentName", filterObj[0]?.departmentId);
    }
  }, [watch("complaintTypeId"), complaintTypes]);

  useEffect(() => {
    if (
      watch("complaintSubTypeId") != null &&
      watch("complaintSubTypeId") != undefined &&
      watch("complaintSubTypeId") != ""
    ) {
      let filterObj = complaintSubTypes?.filter(
        (obj) => obj.id === watch("complaintSubTypeId")
      );
      setValue("category", filterObj[0]?.categoryKey);
    }
  }, [complaintSubTypes, watch("complaintSubTypeId")]);

  // View
  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              position: "absolute",
              xIndex: "99",
            }}
          >
            <Paper
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
                borderRadius: "50%",
                padding: 8,
              }}
              elevation={8}
            >
              <CircularProgress color="success" />
            </Paper>
          </div>
        )}
        <Box>
          <Grid
            container
            style={{
              display: "flex",
              alignItems: "center", // Center vertically
              alignItems: "center",
              width: "100%",
              height: "auto",
              overflow: "auto",
              color: "white",
              fontSize: "18.72px",
              borderRadius: 100,
              fontWeight: 500,
              background:
                "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
            }}
          >
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={11}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="grievanceDetails" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        <Grid
          container
          spacing={2}
          style={{
            padding: "1rem",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            xl={6}
            lg={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              error={!!errors.complaintTypeId}
            >
              <InputLabel
                shrink={watch("complaintTypeId") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                <FormattedLabel id="complaintTypes" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    autoFocus
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    label="Complaint Type"
                  >
                    {complaintTypes &&
                      complaintTypes.map((complaintType, index) => (
                        <MenuItem key={index} value={complaintType.id}>
                          {language == "en"
                            ? complaintType.complaintTypeEn
                            : complaintType?.complaintTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="complaintTypeId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.complaintTypeId
                  ? errors.complaintTypeId.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** complaintSubType */}
          {complaintSubTypes?.length !== 0 ? (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.complaintSubTypeId}
              >
                <InputLabel
                  shrink={watch("complaintSubTypeId") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  <FormattedLabel id="complaintSubTypes" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Sub-Complaint Type"
                    >
                      {complaintSubTypes &&
                        complaintSubTypes.map((complaintSubType, index) => {
                          return (
                            <MenuItem key={index} value={complaintSubType.id}>
                              {language == "en"
                                ? complaintSubType.complaintSubType
                                : complaintSubType?.complaintSubTypeMr}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  name="complaintSubTypeId"
                  control={control}
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.complaintSubTypeId
                    ? errors.complaintSubTypeId.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          ) : (
            ""
          )}

          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              error={!!errors.departmentName}
            >
              <InputLabel
                shrink={watch("departmentName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                <FormattedLabel id="departmentName" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    label={<FormattedLabel id="departmentName" required />}
                  >
                    {departments &&
                      departments.map((department, index) => (
                        <MenuItem key={index} value={department.id}>
                          {language == "en"
                            ? department.departmentEn
                            : department?.departmentMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="departmentName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.departmentName ? errors.departmentName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {subDepartments?.length !== 0 ? (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.subDepartment}
              >
                <InputLabel
                  shrink={watch("subDepartment") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  <FormattedLabel id="subDepartmentName" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Sub Department Name"
                    >
                      {subDepartments &&
                        subDepartments?.map((subDepartment, index) => (
                          <MenuItem key={index} value={subDepartment.id}>
                            {language == "en"
                              ? subDepartment.subDepartmentEn
                              : subDepartment?.subDepartmentMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="subDepartment"
                  control={control}
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.subDepartment ? errors.subDepartment.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          ) : (
            ""
          )}

          {logedInUser === "departmentUser" && (
            <>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.applicantType}
                >
                  <InputLabel
                    shrink={watch("applicantType") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    <FormattedLabel id="applicantTypes" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="applicantType"
                      >
                        {applicantTypes &&
                          applicantTypes.map((applicantType, index) => (
                            <MenuItem key={index} value={applicantType.id}>
                              {language == "en"
                                ? applicantType.applicantTypeEn
                                : applicantType?.applicantTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="applicantType"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.applicantType
                      ? errors.applicantType.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.mediaId}
                >
                  <InputLabel
                    shrink={watch("mediaId") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    <FormattedLabel id="mediaTypes" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Media Type"
                      >
                        {mediaTypes &&
                          mediaTypes?.map(
                            (media, index) => (
                              console.log("media ", media),
                              (
                                <MenuItem key={index} value={media.id}>
                                  {language == "en"
                                    ? media.mediaTypeEn
                                    : media.mediaTypeMr}
                                </MenuItem>
                              )
                            )
                          )}
                      </Select>
                    )}
                    name="mediaId"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.mediaId ? errors.mediaId.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </>
          )}

          {/** cfcUser */}
          {logedInUser === "cfcUser" && (
            <>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.applicantType}
                >
                  <InputLabel
                    shrink={watch("applicantType") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    <FormattedLabel id="applicantTypes" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="applicantType"
                      >
                        {applicantTypes &&
                          applicantTypes.map((applicantType, index) => (
                            <MenuItem key={index} value={applicantType.id}>
                              {language == "en"
                                ? applicantType.applicantTypeEn
                                : applicantType?.applicantTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="applicantType"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.applicantType
                      ? errors.applicantType.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.mediaId}
                >
                  <InputLabel
                    shrink={watch("mediaId") == null ? false : true}
                    id="demo-simple-select-standard-label"
                  >
                    <FormattedLabel id="mediaTypes" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Media Type"
                      >
                        {mediaTypes &&
                          mediaTypes?.map((media, index) => (
                            <MenuItem key={index} value={media.id}>
                              {language == "en"
                                ? media.mediaTypeEn
                                : media.mediaTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="mediaId"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.mediaId ? errors.mediaId.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </>
          )}

          {/** Category */}
          {watch("category") != null ? (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.category}
              >
                <InputLabel
                  shrink={watch("category") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  <FormattedLabel id="categories" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Category"
                    >
                      {categories &&
                        categories.map((category, index) => (
                          <MenuItem key={index} value={category.id}>
                            {language == "en"
                              ? category.categoryEn
                              : category?.categoryMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="category"
                  control={control}
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.category ? errors.category.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          ) : (
            <></>
          )}

          {/** Department User */}
          {logedInUser === "departmentUser" && (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.eventTypeId}
              >
                <InputLabel
                  shrink={watch("eventTypeId") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  <FormattedLabel id="event" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Event"
                    >
                      {eventTypes &&
                        eventTypes.map(
                          (eventType, index) => (
                            console.log("eventType ", eventType.eventTypeEn),
                            (
                              <MenuItem key={index} value={eventType.id}>
                                {language == "en"
                                  ? eventType.eventTypeEn
                                  : eventType?.eventTypeMr}
                              </MenuItem>
                            )
                          )
                        )}
                    </Select>
                  )}
                  name="eventTypeId"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.eventTypeId ? errors.eventTypeId.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          )}

          {/** CFC User */}
          {logedInUser === "cfcUser" && (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.eventTypeId}
              >
                <InputLabel
                  shrink={watch("eventTypeId") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  <FormattedLabel id="event" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Event"
                    >
                      {eventTypes &&
                        eventTypes.map((eventType, index) => (
                          <MenuItem key={index} value={eventType.id}>
                            {language == "en"
                              ? eventType.eventTypeEn
                              : eventType?.eventTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="eventTypeId"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.eventTypeId ? errors.eventTypeId.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          )}
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
            <AreaWardZoneMapping />
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
              marginBottom: "",
            }}
          >
            <Transliteration
              variant={"standard"}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              multiline
              _key={"complaintDescription"}
              labelName={"complaintDescription"}
              fieldName={"complaintDescription"}
              updateFieldName={"complaintDescriptionMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              label={<FormattedLabel id="complaintDescriptionEn" required />}
              error={!!errors.complaintDescription}
              helperText={
                errors?.complaintDescription
                  ? errors.complaintDescription.message
                  : null
              }
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
            }}
          >
            <Transliteration
              variant={"standard"}
              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              multiline
              _key={"complaintDescriptionMr"}
              labelName={"complaintDescriptionMr"}
              fieldName={"complaintDescriptionMr"}
              updateFieldName={"complaintDescription"}
              sourceLang={"eng"}
              targetLang={"mar"}
              label={<FormattedLabel id="complaintDescriptionMr" required />}
              error={!!errors.complaintDescriptionMr}
              helperText={
                errors?.complaintDescriptionMr
                  ? errors.complaintDescriptionMr.message
                  : null
              }
            />
          </Grid>

          {/** DocumentUploadTableSachin */}
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
            <Box sx={{ width: "88%" }}>
              

              <DocumentUploadTableSachin isButton={true} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default GrievanceDetails;
