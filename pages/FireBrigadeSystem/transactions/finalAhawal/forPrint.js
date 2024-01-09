// import BasicLayout from "../../../../../containers/Layout/BasicLayout";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";

import React, { useRef, useEffect, useState } from "react";

import { useReactToPrint } from "react-to-print";
// import styles from "./goshwara.module.css";
import styles from "../../../../styles/skysignstyles/goshwara.module.css";

import { Box, Button, Paper } from "@mui/material";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

//  Certificate Form
const IndustryCertificateReport = () => {
  const componentRef = useRef();
  const componentRef1 = useRef();
  const userToken = useGetToken();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // content: () => componentRef1.current,
  });
  const [data, setData] = useState();

  const router = useRouter();

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query);
      // reset(router.query);
    }
  }, []);

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#D7DBDD",
      // color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    "&: td, &: th": {
      border: "1px solid black",
    },
  }));

  function createData(name, calories, fat, carbs, protein, upload) {
    return { name, calories, fat, carbs, protein, upload };
  }

  const rows = [
    createData(
      <>
        <>Receipt No./ पावती क्र.</>
        {/* <br /> <h5> {state.map((d) => d.id)}</h5> */}
      </>,
      <>Date/ तारीख</>,
      <>Related To/ विभागाकडुन</>,
      <>CFC Ref. No</>,
      <>CFC Counter No.</>
    ),
    // createData(
    //   2,
    //   <>
    //     {/* <>Approved Key Plan, Site Plan,Elivatio n Section PCMC</> */}
    //     {/* <FormattedLabel id="approvedKeyPlan" /> */}
    //     approvedKeyPlan
    //     <br /> <h5> (Upload file in .pdf format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   3,
    //   <>
    //     {/* <FormattedLabel id="approvedLayoutPlanPCMC" /> */}
    //     <>Approved Layout plan PCMC</>
    //     <br />
    //     <h5> (Upload file in .pdf format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   4,
    //   <>
    //     {/* <FormattedLabel id="approvedApproachRoadPCMC" /> */}
    //     <>Approved Approach Road PCMC</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   5,
    //   <>
    //     {/* <FormattedLabel id="measurementOfTank" /> */}
    //     <>Measurement of Tank (undergroun d, overhead) with map</> <br />
    //     <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   6,
    //   <>
    //     {/* <FormattedLabel id="explosiveLicense" /> */}
    //     explosiveLicense
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   7,
    //   <>
    //     {/* <FormattedLabel id="permissionLetterOfPCMC" /> */}
    //     <>Permission letter of PCMC</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   8,
    //   <>
    //     {/* <FormattedLabel id="completionCertificate" /> */}
    //     <>Completion Certificate</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   9,
    //   <>
    //     {/* <FormattedLabel id="structuralStabilityCertificate" /> */}
    //     <>Structural Stability Certificate</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   10,
    //   <>
    //     {/* <FormattedLabel id="escalatorApprovedByGovtCertificate" /> */}
    //     <>Escalator / Lift approved by Govt. Certificate</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   11,
    //   <>
    //     {/* <FormattedLabel id="fireDrawingFloorWiseAlsoApprovedByComplianceAuthority" /> */}
    //     <>Fire Drawing Floor wise i,e also approved by compliance Authority</>{" "}
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
  ];

  //   const backToHomeButton = () => {
  //     history.push({ pathname: "/homepage" });
  //   };

  const getById = (appId) => {
    axios
      .get(
        `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${appId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        // setValue("typeOfVardiId", res?.data?.typeOfVardiId);
        // reset(res.data.vardiSlip);
        // setValue("id", res.data.id);
        console.log("res.data**", res.data);
        setData(res.data);
      });
  };
  useEffect(() => {
    getById(router.query.id);
  }, []);

  return (
    <>
      {/* <div style={{ display: "flex", justifyContent: "center" }}> */}

      <ComponentToPrint ref={componentRef} data={data} />

      <Box sx={{ margin: "10px", marginRight: "52%", marginLeft: "25%" }}>
        <Button
          sx={{ marginLeft: "30%" }}
          size="small"
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          onClick={handlePrint}
        >
          print
        </Button>
        <Button
          size="small"
          onClick={() =>
            router.push({
              pathname: "/FireBrigadeSystem/transactions/firstAhawal",
            })
          }
          variant="contained"
          color="primary"
        >
          back To home
        </Button>
      </Box>
    </>
  );
};

class ComponentToPrint extends React.Component {
  //   constructor(props) {
  //     console.log("test", this.props, this.data);
  //   }
  componentDidMount() {
    // console.log("test", this.props, this.data);
    //     if (router.query.pageMode == "Edit") {
    //       console.log("hello", router.query);
    //       reset(router.query);
    //     }
  }

  render() {
    console.log("test", this.props, this.data);
    return (
      <>
        <div style={{ width: "800px" }}>
          <div>
            <Paper>
              <Box>
                {/* <table className={styles.data}>
                  <tr>
                    <div className={styles.main}>
                      <div
                      // className={styles.one}
                      >
                        <img
                          src="/logo.png"
                          alt="Maharashtra Logo"
                          height={130}
                          width={130}
                        ></img>
                        <tr></tr>
                      </div>
                      <tr>
                        <center>
                          <h3>
                            <b>पिंपरी चिंचवड महानगरपालिका</b>
                          </h3>
                          <h3>
                            <b>मुख्य कार्यालय, पिंपरी ४११ ०१८</b>
                          </h3>
                          <h3>
                            <b>पैसे भरल्याची पावती</b>
                          </h3>
                        </center>
                      </tr>
                      <div>
                        <img
                          src="/smartCityPCMC.png"
                          alt="Maharashtra Logo"
                          height={140}
                          width={140}
                        ></img>

                        <tr></tr>
                      </div>
                    </div>
                  </tr>
                </table> */}

                <Table
                  sx={{ width: "100%", marginTop: "3rem" }}
                  size="small"
                  aria-label="a dense table"
                  border="1"
                  stickyHeader
                >
                  <TableRow>
                    <TableCell
                      //   colspan="3"
                      align="start"
                      style={{ width: "200px" }}
                    >
                      <img
                        src="/logo.png"
                        alt="Maharashtra Logo"
                        height={130}
                        width={130}
                      ></img>
                    </TableCell>

                    <TableCell colspan="3" align="center">
                      {/* <center> */}
                      <h3>
                        <b>पिंपरी चिंचवड महानगरपालिका</b>
                      </h3>
                      <h3>
                        <b>मुख्य कार्यालय, पिंपरी ४११ ०१८</b>
                      </h3>

                      {/* </center> */}
                    </TableCell>

                    <TableCell
                      colspan="6"
                      align="start"
                      style={{ width: "200px" }}
                    >
                      <img
                        src="/smartCityPCMC.png"
                        alt="Maharashtra Logo"
                        height={140}
                        width={140}
                      ></img>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      colspan="6"
                      align="center"
                      style={{ width: "200px" }}
                    >
                      <h3>
                        <b>पैसे भरल्याची पावती</b>
                      </h3>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow >
          <TableCell colspan="6" align="start">
            <FormattedLabel id="remarkForPrint" /><br />
            <FormattedLabel id="tip" />
          </TableCell>

          <TableCell colspan="3" align="start">
            <FormattedLabel id="receiverSign" />
          </TableCell>
        </TableRow> */}

                  {/* <TableRow >
          <TableCell colspan="6" align="start">
            <FormattedLabel id="printedBy" />:
          </TableCell>

          <TableCell colspan="3" align="start">
            <FormattedLabel id="printDateTime" />:
          </TableCell>
        </TableRow> */}

                  {/* </div> */}
                  {/* <div className={styles.small}>
      <div className={styles.row}> */}
                  {/* Documents Upload */}
                  {/* <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" border="1" stickyHeader >
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr.No</StyledTableCell>
                <StyledTableCell>Document Upload</StyledTableCell>
                <StyledTableCell align="right">Document Type</StyledTableCell>
                <StyledTableCell align="right">
                  Upload Document
                </StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell> */}
                  {/* <StyledTableCell align="right">Protein&nbsp;</StyledTableCell> */}
                  {/* </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.finalRow}>
                <TableCell align="left" colSpan={6}>
                  <b>Mandatory Documents</b>
                </TableCell>
              </TableRow>
              {rows.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell>{row.calories}</StyledTableCell>
                  <StyledTableCell
                    align="right"
                    // style={{ color: "red" }}
                  >
                    {row.fat}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                  <StyledTableCell>{row.protein}</StyledTableCell>
                </StyledTableRow>
              ))}



{/* <Table sx={{  width: '100%', height: "40%" }} size="small" aria-label="a dense table" border="1" stickyHeader> */}
                  <TableRow>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>Application Number</b>
                    </TableCell>
                    <TableCell colspan="6">
                      {this?.props?.data?.applicationNo}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>
                        Receipt No./ पावती क्र.
                      </b>
                    </TableCell>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>Date/ तारीख</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>Related To/ विभागाकडुन</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>CFC Ref. No</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>CFC Counter No.</b>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>
                        Service Name/सेवेचे नाव
                      </b>
                    </TableCell>
                    <TableCell colspan="6">
                      {console.log("this?.props?.data", this?.props?.data)}
                      <b>{this?.props?.data?.paymentDetails?.serviceName}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>Narration/ विवरण</b>
                    </TableCell>
                    <TableCell colspan="6"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b style={{ padding: "1.5px" }}>Address/पत्ता</b>
                    </TableCell>
                    <TableCell colspan="6">
                      {this?.props?.data?.paymentDetails?.billPayeraddress},{" "}
                      {this?.props?.data?.city}
                    </TableCell>
                  </TableRow>
                  {/* <TableRow></TableRow> */}
                  <TableRow>
                    <TableCell>
                      payment mode/पेमेंट मोड
                      <br />
                      <b>{this?.props?.data?.paymentDetails?.paymentMode}</b>
                    </TableCell>
                    <TableCell>Rupees/रुपये</TableCell>
                    <TableCell>
                      Cheque No/धनादेश क्र <br />
                      <b>{this?.props?.data?.chequeNo}</b>
                    </TableCell>
                    <TableCell>
                      Cheque Date/धनादेश तारीख
                      <br />
                      <b>{this?.props?.data?.chequeDate}</b>
                    </TableCell>
                    <TableCell>
                      Bank Name/बँकेचे नाव <br />
                      <b>{this?.props?.data?.paymentDetails?.bankName}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colspan="12">
                      <b
                        style={{ backgroundColor: "white", padding: "1px" }}
                      ></b>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Refrence No/संदर्भ क्रमांक</TableCell>
                    <TableCell>Date/तारीख</TableCell>
                    <TableCell>Details/तपशील</TableCell>
                    <TableCell>Payable Amount/देय रक्कम</TableCell>
                    <TableCell>Received Amount/प्राप्त रक्कम</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <b
                        style={{ backgroundColor: "white", padding: "1px" }}
                      ></b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b
                        style={{ backgroundColor: "white", padding: "1px" }}
                      ></b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b
                        style={{ backgroundColor: "white", padding: "1px" }}
                      ></b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>total amount/एकूण रक्कम</TableCell>
                    <TableCell>
                      <b>{this?.props?.data?.paymentDetails?.totalAmount}</b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>0.00</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      Payable Amount/देय रक्कम <br />{" "}
                      <b>{this?.props?.data?.paymentDetails?.totalAmount}</b>
                    </TableCell>
                    <TableCell>Rebate Amount/सूट रक्कम</TableCell>
                    <TableCell>Advance Amount/आगाऊ रक्कम</TableCell>
                    <TableCell>Actual Payable/वास्तविक देय</TableCell>
                    <TableCell>Received Amount/प्राप्त रक्कम</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <b
                        style={{ backgroundColor: "white", padding: "1px" }}
                      ></b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <b style={{ backgroundColor: "white" }}>
                        Amount in words/शब्दात रक्कम:
                      </b>
                    </TableCell>

                    <TableCell colspan="6">
                      <b> {this?.props?.data?.paymentDetails?.amountInWord} </b>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colspan="3">
                      <span>Remark/शेरा</span>
                      <br></br>
                      <div>
                        टीप: सदरची पावती चेक वटल्यावरती ग्राह्य धरण्यात यईल.
                      </div>
                    </TableCell>

                    <TableCell colspan="6">
                      <b>Receiver Signature/प्राप्तकर्त्याची स्वाक्षरी</b>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colspan="3">
                      <b>Priented By:</b>
                    </TableCell>
                    <TableCell colspan="6">
                      <b>Print Date And Time:</b>
                    </TableCell>
                  </TableRow>
                  {/* </Table> */}
                  {/* </TableBody> */}
                  {/* </Table> */}
                  {/* </TableContainer> */}
                  {/* </div> */}
                  {/* <br /> */}

                  {/* <Button
              sx={{ marginRight: 8 }}
              variant="contained"
              color="primary"
              endIcon={<ClearIcon />}
              onClick={() => cancellButton()}
            >
              Clear
            </Button> */}
                  {/* </form>
      </FormProvider> */}
                  {/* </div> */}
                  {/* </Slide> */}
                  {/* )} */}
                  {/* </Paper> */}
                  {/* </Card> */}
                  {/* </BasicLayout> */}
                </Table>
              </Box>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}

export default IndustryCertificateReport;
