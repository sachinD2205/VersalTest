import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import axios from "axios";
import router from "next/router";
import styles from "./declaration.module.css";
import moment from "moment";
import { Controller, useForm, useFormContext } from "react-hook-form";
import swal from "sweetalert";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const SelfDeclarationGym = (props) => {
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const componentRef = useRef();
  const language = useSelector((state) => state?.labels.language);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [data, setData] = useState();
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
  const [venueState, setVenues] = useState([]);

  const token = useSelector((state) => state.user.user.token);
  const getVenueList = () => {
    // let venueId = getValues("venue");
    let id = watch("facilityName");

    if (id != null && id != undefined && id != "") {
      // console.log("DATA77", body);

      axios
        .get(
          `${urls.SPURL}/venueMasterSection/getVenueByFacilityName?facilityName=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("66", res.data.venueSection);
          let temp = res.data.venueSection.map((row) => ({
            id: row.id,
            venue: row.venue,
            venueMr: row.venueMr,
          }));
          setVenues(temp);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  // view
  useEffect(() => {
    getVenueList();
    setData(watch());
  }, []);
  // console.log("firstName", watch("firstName"));
  return (
    <>
      <div>
        {language == "en" ? (
          <>
            <div className={styles.main}>
              <div className={styles.small}>
                <div className={styles.two}>
                  <div className={styles.date5}>
                    <div className={styles.date6} style={{ marginTop: "5vh" }}>
                      <h4>
                        {" "}
                        <b>Self Declaration Form</b>
                        <br />
                        <b>Gym Booking</b>
                      </h4>{" "}
                    </div>
                  </div>

                  <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                    <div className={styles.date2}>
                      <p style={{ marginLeft: "30px", marginRight: "30px" }}>
                        1) I am coming on my own responsibility to the{" "}
                        <b>
                          {venueState?.find((i) => i?.id == data?.venue)?.venue}
                        </b>{" "}
                        Gymnasium of Pimpri Chinchwad Municipal Corporation.
                        <br />
                        2) I have made an online booking for swimming for
                        exercise in the{" "}
                        <b>
                          {venueState?.find((i) => i?.id == data?.venue)?.venue}{" "}
                        </b>
                        Gymnasium of Pimpri Chinchwad Municipal Corporation. The
                        information and certificate provided by me for booking
                        are true. I am aware that if the said information and
                        certificate is found to be false, I will be fully
                        responsible for it.
                      </p>{" "}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <div className={styles.date4}>
                        <div className={styles.date2}>
                          <p style={{ marginLeft: "30px" }}>
                            {" "}
                            Place:-<b>{watch("cCityName")}</b>
                          </p>
                        </div>
                      </div>
                      <div
                        className={styles.date4}
                        style={{ marginBottom: "2vh" }}
                      >
                        <div className={styles.date2}>
                          <p style={{ marginLeft: "30px" }}>
                            {" "}
                            Date:-{" "}
                            <b>
                              {moment(watch("bookingDate")).format(
                                "DD-MM-YYYY"
                              )}
                            </b>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {/* <div className={styles.date4}>
                      <div className={styles.date2}>
                        <p style={{ marginRight: "80px" }}> Applicant Signature:-……………..</p>
                      </div>
                    </div> */}

                      <div
                        className={styles.date4}
                        style={{ marginBottom: "2vh" }}
                      >
                        <div className={styles.date2}>
                          <p style={{ marginRight: "80px" }}>
                            {" "}
                            Applicant Name:-
                            {/* <b>
                              {watch("applicantName")}.
                            </b> */}
                            {/* Applicant Name:- */}
                            <b>
                              {watch("firstName")} {watch("middleName")}{" "}
                              {watch("lastName")}.
                            </b>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <FormControlLabel
                    // className={styles.accept}
                    style={{ marginLeft: "20px", marginRight: "0px" }}
                    control={
                      <Controller
                        name="acceptDeclaration"
                        control={control}
                        render={({ field: { value, ref, ...field } }) => (
                          <Checkbox
                            {...field}
                            inputRef={ref}
                            checked={!!value}
                          />
                        )}
                      />
                    }
                  />
                  <span>
                    I hereby declare that the information provided is true and
                    accurate to the best of my knowledge, belief, and
                    understanding.
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.main}>
              <div className={styles.small}>
                <div className={styles.two}>
                  <div className={styles.date5}>
                    <div className={styles.date6} style={{ marginTop: "5vh" }}>
                      <h4>
                        {" "}
                        <b> स्वयंघोषणा प्रपत्र </b>
                        <br />
                        <b>जिम बुकिंग</b>
                      </h4>{" "}
                    </div>
                  </div>

                  <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                    <div className={styles.date2}>
                      <p style={{ marginLeft: "30px", marginRight: "30px" }}>
                        १) पिंपरी चिंचवड महानगरपालिकेच्या{" "}
                        <b>
                          {" "}
                          {
                            venueState?.find((i) => i?.id == data?.venue)
                              ?.venueMr
                          }
                        </b>{" "}
                        येथील व्यायामशाळेत मी माझ्या स्वतःच्या जबाबदारीवर येत
                        आहे.
                        <br />
                        २) पिंपरी चिंचवड महानगरपालिकेच्या
                        <b>
                          {" "}
                          {
                            venueState?.find((i) => i?.id == data?.venue)
                              ?.venueMr
                          }
                        </b>{" "}
                        येथील व्यायामशाळेत व्यायामासाठी मी ऑनलाईन बुकींग केलेले
                        असून ऑनलाईन बुकींग साठी माझी दिलेली माहिती व प्रमाणपत्र
                        खरी आहेत. सदर माहिती व प्रमाणपत्र खोटी आढळून आल्यास
                        त्याची संपुर्ण जबाबदारी माझी राहील याची मला जाणीव आहे.
                      </p>{" "}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <div className={styles.date4}>
                        <div className={styles.date2}>
                          <p style={{ marginLeft: "30px" }}>
                            {" "}
                            ठिकाण:-<b>{watch("cCityNameMr")}</b>
                          </p>
                        </div>
                      </div>
                      <div
                        className={styles.date4}
                        style={{ marginBottom: "2vh" }}
                      >
                        <div className={styles.date2}>
                          <p style={{ marginLeft: "30px" }}>
                            {" "}
                            दिनांक:-{" "}
                            <b>
                              {moment(watch("bookingDate")).format(
                                "DD-MM-YYYY"
                              )}
                            </b>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {/* <div className={styles.date4}>
                    <div className={styles.date2}>
                      <p style={{ marginRight: "80px" }}> अर्जदाराची सही:-……………..</p>
                    </div>
                  </div> */}

                      <div
                        className={styles.date4}
                        style={{ marginBottom: "2vh" }}
                      >
                        <div className={styles.date2}>
                          <p style={{ marginRight: "80px" }}>
                            {" "}
                            अर्जदाराचे नाव:-
                            <b>
                              {watch("firstNameMr")} {watch("middleNameMr")}{" "}
                              {watch("lastNameMr")}.{" "}
                            </b>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <FormControlLabel
                    // className={styles.accept}
                    style={{ marginLeft: "20px", marginRight: "0px" }}
                    control={
                      <Controller
                        name="acceptDeclaration"
                        control={control}
                        render={({ field: { value, ref, ...field } }) => (
                          <Checkbox
                            {...field}
                            inputRef={ref}
                            checked={!!value}
                          />
                        )}
                      />
                    }
                  />
                  <span>
                    मी याद्वारे घोषित करतो की प्रदान केलेली माहिती माझ्या
                    सर्वोत्तम माहिती, विश्वास आणि समजानुसार सत्य आणि अचूक आहे.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SelfDeclarationGym;
