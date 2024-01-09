import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import router, { useRouter } from "next/router";
import styles from "./form_no_fourteen.module.css";
import axios from "axios";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import moment from "moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const token = useSelector((state) => state.user.user.token);

  const router = useRouter();
  const [dataa, setDataa] = useState(null);
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

  useEffect(() => {
    console.log(
      "props",
      props,
      router?.query?.bookedData,

      getAuditoriumBookingDetailsById(
        router?.query?.bookedData &&
          JSON.parse(router?.query?.bookedData)?.applicationNumber
      )
    );
  }, []);

  const getAuditoriumBookingDetailsById = (id) => {
    axios
      .get(
        `${urls.PABBMURL}/trnDepositeRefundProcessByDepartment/getByApplicationNo?applicationNo=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("By id", r);
        if (r.status === 200) {
          setDataa(r?.data);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  // view
  return (
    <>
      <div>
        <ComponentToPrint dataa={dataa} ref={componentRef} />
      </div>

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
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
                router.back();
              } else {
                swal("Record is Safe");
              }
            });
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div>
              <h2 className={styles.heading}>
                <b>नमुना १४</b>
              </h2>
            </div>
            <div className={styles.one}>
              <div
                className={styles.middle}
                styles={{ paddingTop: "15vh", marginTop: "20vh" }}
              >
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका, पुणे १८</b>
                </h1>
              </div>
            </div>

            <div className={styles.two}>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    padding: "10px",
                  }}
                >
                  <h4>
                    <b>बिल क्रमांक :</b>
                  </h4>{" "}
                </div>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "end",
                    padding: "10px",
                  }}
                >
                  <h4>
                    <b>बिल दिनांक :</b>
                  </h4>{" "}
                  <h4>
                    {moment(
                      this.props.dataa
                        ?.trnDepositeRefundProcessByDepartmentList[0]?.billDate
                    )?.format("DD/MM/YYYY")}
                  </h4>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  padding: "10px",
                }}
              >
                <h4>
                  {" "}
                  <b>पैसे घेणाऱ्याचे नाव : </b>
                </h4>{" "}
                <h4>
                  <b>
                    {
                      this.props.dataa
                        ?.trnDepositeRefundProcessByDepartmentList[0]
                        ?.trnAuditoriumBookingOnlineProcess?.applicantName
                    }
                  </b>
                </h4>
              </div>

              <div
                style={{
                  display: "flex",
                  padding: "10px",
                }}
              >
                <h4>
                  {" "}
                  <b>माल / मोजणी अर्जाचा संदर्भ क्रमांक : </b>
                </h4>{" "}
                <h4>
                  <b>
                    {
                      this.props.dataa
                        ?.trnDepositeRefundProcessByDepartmentList[0]
                        ?.applicationNumberKey
                    }
                  </b>{" "}
                  &
                  <b>
                    {" "}
                    {moment(
                      this.props.dataa
                        ?.trnDepositeRefundProcessByDepartmentList[0]
                        ?.applicationDate
                    ).format("DD/MM/YYYY")}
                  </b>
                </h4>
              </div>

              <div style={{ padding: "10px", display: "flex" }}>
                <h4>
                  {" "}
                  <b>लेखाशीर्ष : </b>
                </h4>{" "}
                <h4></h4>
              </div>

              <div
                style={{
                  padding: "10px",
                }}
              >
                <h4>बिलाचा तपशील :-</h4>
                <table id="table-to-xls" className={styles.report_table}>
                  <thead>
                    <tr>
                      <th colSpan={2}>अ.क्र</th>
                      <th colSpan={8}>
                        पुरविलेल्या मालाचा / केलेल्या कामाचा तपशिल
                      </th>
                      <th colSpan={2}>परिमाण</th>
                      <th colSpan={2}>दर</th>
                      <th colSpan={2}>युनिट</th>
                      <th colSpan={2}>रक्कम रुपये</th>
                    </tr>
                    <tr>
                      <td colSpan={2}>1)</td>
                      <td colSpan={8}>नाट्यगृह / प्रेक्षागृह अनामत रक्कम</td>
                      <td colSpan={2}></td>
                      <td colSpan={2}></td>
                      <td colSpan={2}></td>
                      <td colSpan={2}>
                        {this.props.dataa &&
                          (this.props.dataa?.trnDepositeRefundProcessByDepartmentList[0]?.trnAuditoriumBookingOnlineProcess?.depositAmount).toFixed(
                            2
                          )}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={14}>
                        <b></b>
                      </td>
                      <td colSpan={2}>
                        <b>जी.एस.टी कर रक्कम : </b>
                      </td>
                      <td colSpan={4}>
                        <b>0.00</b>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={14}>
                        <b></b>
                      </td>
                      <td colSpan={2}>
                        <b>एकूण बिल रुपये : </b>
                      </td>
                      <td colSpan={4}>
                        <b>
                          {this.props.dataa &&
                            (this.props.dataa?.trnDepositeRefundProcessByDepartmentList[0]?.trnAuditoriumBookingOnlineProcess?.depositAmount).toFixed(
                              2
                            )}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  padding: "10px",
                }}
              >
                <h4>बिल कपात माहिती :-</h4>
                <table id="table-to-xls" className={styles.report_table}>
                  <thead>
                    <tr>
                      <th colSpan={2}>अ.क्र</th>
                      <th colSpan={8}>बिल कपात लेखाशिर्ष</th>
                      <th colSpan={2}>परिमाण</th>
                      <th colSpan={2}>दर</th>
                      <th colSpan={2}>युनिट</th>
                      <th colSpan={2}>रक्कम रुपये</th>
                    </tr>
                    <tr>
                      <td colSpan={2}>१)</td>
                      <td colSpan={8}>अतिरिक्त उपकरणे</td>
                      <td colSpan={2}></td>
                      <td colSpan={2}></td>
                      <td colSpan={2}></td>
                      <td colSpan={2}>
                        {this.props.dataa &&
                          Number(
                            this.props.dataa
                              ?.trnDepositeRefundProcessByDepartmentList[0]
                              ?.trnAuditoriumBookingOnlineProcess
                              ?.extraEquipmentUsedChargesAmout
                          ).toFixed(2)}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={14}>
                        <b></b>
                      </td>
                      <td colSpan={2}>
                        <b>एकुण कपात रुपये : </b>
                      </td>
                      <td colSpan={4}>
                        <b>
                          {this.props.dataa &&
                            Number(
                              this.props.dataa
                                ?.trnDepositeRefundProcessByDepartmentList[0]
                                ?.trnAuditoriumBookingOnlineProcess
                                ?.extraEquipmentUsedChargesAmout
                            ).toFixed(2)}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "53%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                ></div>
                <div
                  style={{
                    width: "24%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <b>एकुण देय रक्कम : </b>
                </div>
                <div
                  style={{
                    width: "16%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <b>
                    {this.props.dataa &&
                      Number(
                        this.props.dataa
                          ?.trnDepositeRefundProcessByDepartmentList[0]
                          ?.trnAuditoriumBookingOnlineProcess?.refundableAmount
                      ).toFixed(2)}
                  </b>
                </div>
              </div>

              <div
                style={{
                  padding: "10px",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "50%",
                  }}
                >
                  <table id="table-to-xls" className={styles.report_table}>
                    <thead>
                      <tr>
                        <th colSpan={2}>अ.क्र</th>
                        <th colSpan={8}>लेखाशिर्ष</th>
                        <th colSpan={2}>रुपये</th>
                      </tr>
                      <tr>
                        <td colSpan={2}>१)</td>
                        <td colSpan={8}>अंदाजपतकीय तरतूद</td>
                        <td colSpan={2}>100000.00</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>२)</td>
                        <td colSpan={8}>या पूर्वीचा खर्च</td>
                        <td colSpan={2}>0.00</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>३)</td>
                        <td colSpan={8}>या देयकाची रक्कम</td>
                        <td colSpan={2}>22000.00</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>४)</td>
                        <td colSpan={8}>या देयाकासह संपूर्ण खर्च</td>
                        <td colSpan={2}>22000.00</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>५)</td>
                        <td colSpan={8}>शिल्लक तरतूद</td>
                        <td colSpan={2}>78000.00</td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div
                  style={{
                    width: "50%",
                    padding: "10px",
                  }}
                >
                  प्रमाणित करण्यात येते की, ह्या देयकामध्ये दर व परिमाणे ही अचूक
                  आहेत. आणि सामुग्री, वस्तू चांगल्या स्थितीत मिळाल्या असून त्या
                  प्रुष्ठावरील संक्यात्मक लेखाच्या समुचित पुरवठा नोंद वही
                  क्रमांक १ प्रुष्ठ क्रमांक १७३ अनु. क्रमांक २७० वर नोंदविल्या
                  आहेत. सदरची रक्कम यापूर्वी अदा केलेली नाही.
                </div>
              </div>

              <div
                style={{
                  padding: "10px",
                }}
              >
                <h4>
                  {" "}
                  <b>
                    {`प्रदानार्थ प्रतिपूर्ती र.रक्कम ${
                      this.props.dataa &&
                      Number(
                        this.props.dataa
                          ?.trnDepositeRefundProcessByDepartmentList[0]
                          ?.trnAuditoriumBookingOnlineProcess?.refundableAmount
                      ).toFixed(2)
                    } अक्षरी र. रुपये
                    बावीस हजार रुपये फक्त:`}
                  </b>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
