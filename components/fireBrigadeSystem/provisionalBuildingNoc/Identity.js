import { Button, Grid, Paper, Stack } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

// Index
const Identity = (props) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      );
    });
  };

  // Religions
  const [applicantTypes, setApplicantTypes] = useState([]);

  // getGenders
  const getApplicants = () => {
    axios
      .get(`${urls.HMSURL}/mstStreetVendorApplicantCategory/getAll`)
      .then((r) => {
        setApplicantTypes(
          r.data.streetVendorApplicantCategory.map((row) => ({
            id: row.id,
            applicantType: row.type,
            applicantTypeMr: row.typeMr,
          })),
        );
      });
  };

  useEffect(() => {
    console.log("props", props?.props);
  }, [props]);

  // view
  return (
    <div style={{ color: "white" }}>
      <Paper
        style={{
          margin: "50px",
        }}
      >
        <br />
        <Stack
          spacing={5}
          direction='row'
          style={{
            display: "flex",
            justifyContent: "left",
            marginLeft: "50px",
          }}
        >
          <Button
            variant='contained'
            type='primary'
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            print
          </Button>
        </Stack>
        <div>
          <center>
            <h1>ओळखपत्र</h1>
          </center>
        </div>

        <ComponentToPrint ref={componentRef} props={props} />
      </Paper>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    const {
      applicantName,
      dateOfBirth,
      gender,
      hawkerType,
      mobile,
      fullAddressCrMr,
    } = this?.props?.props?.props;
    return (
      <div>
        <Paper
          // style={{
          //   margin: "50px",
          // }}
          elevation={0}
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "1000px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "700px",
                border: "2px solid black",
                paddingLeft: "20px",
                paddingRight: "20px",
                // padding: "20px",
              }}
            >
              {/** First Row */}
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Image
                    src='/logo.png'
                    alt='PCMC Logo'
                    height={100}
                    width={100}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h2>
                    <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                  </h2>
                  <h3>
                    <b>ओळखपत्र</b>
                  </h3>
                </div>
                <div className='col-md-7'>
                  <Image
                    src='/barcode.jpg'
                    alt='Barcode Logo'
                    height={100}
                    width={100}
                  />
                </div>
              </div>
              <table
                style={{
                  width: "100%",
                  marginTop: "75px",
                  marginLeft: "20px",
                  marginRight: "20px",
                  marginBottom: "20px",
                  // border: "2px solid red",
                }}
              >
                {/**1 */}
                <tr>
                  <td
                    colSpan={30}
                    // style={{ border: "2px solid yellow" }}
                  >
                    <h3>
                      <b>ओळखपत्र क्रमांक :</b>
                    </h3>
                  </td>

                  <td
                    colSpan={10}
                    rowSpan={5}
                    style={{
                      // border: "2px solid pink",
                      display: "table-cell",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src='/'
                        alt='Hawker Photo'
                        height={150}
                        width={150}
                      />
                    </div>
                  </td>
                </tr>
                {/**2 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>नावं : {applicantName}</b>
                    </h3>
                  </td>
                </tr>
                {/**3 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>जन्मदिनांक : {dateOfBirth}</b>
                    </h3>
                  </td>
                </tr>
                {/**4 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>लिंग :{gender}</b>
                    </h3>
                  </td>
                </tr>
                {/**5 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>पथविक्रेत्याची वर्गवारी : {hawkerType}</b>
                    </h3>
                  </td>
                </tr>
                {/**6 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>व्यवसायाचा प्रकार : </b>
                    </h3>
                  </td>
                </tr>
                {/**7 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>भ्रमणध्वनी क्रमांक : {mobile} </b>
                    </h3>
                  </td>
                </tr>
                {/**9 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>जारी केल्याचा दिनांक : </b>
                    </h3>
                  </td>
                </tr>
                {/**10 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>वैधता (पर्यंत) : </b>
                    </h3>
                  </td>
                  <td
                    style={{
                      // border: "2px solid pink",
                      display: "table-cell",
                    }}
                  >
                    <h3
                      style={{
                        //   border: "2px solid pink",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <b>स्वाक्षरी : </b>
                    </h3>
                  </td>
                </tr>
                {/**11*/}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>पथविक्रेत्याचा निवासी पत्ता : {fullAddressCrMr} </b>
                    </h3>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default Identity;
