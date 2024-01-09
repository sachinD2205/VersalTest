import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "../goshwara.module.css";
import axios from "axios";
// import urls from "../../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { ToWords } from "to-words";

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = ({ connectionData, usageType, ownership, slumName, villageName, componentRef }) => {
    const backToHomeButton = () => {
        history.push({ pathname: "/homepage" });
    };
    const [dataa, setDataa] = useState(null);
    const [selectedObject, setSelectedObject] = useState();
    const [work, setWork] = useState();

    //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
    let approvalId = router?.query?.id;
    useEffect(() => {
        // getWard();
        // getAllTableData();
        // getDepartment();
        // getRotationGroup();
        // getRotationSubGroup();
        // getNewsPaper();
        // getDate();
    });
    console.log("connectionData", ownership);

    // view
    return (
        <>
            <div>
                <ComponentToPrintOfficialNotesheet
                    connectionData={connectionData}
                    slumName={slumName}
                    usageType={usageType}
                    ownership={ownership}
                    villageName={villageName}
                    ref={componentRef}
                />
            </div>
            <br />

            <div className={styles.btn}>
                {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                    onClick={handlePrint}
                >
                    print
                </Button> */}

                {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                >
                    Digital Signature
                </Button> */}

                <Button
                    type="primary"
                    variant="contained"
                    onClick={() => {
                        router.push(`/roadExcavation/transaction/roadExcevationForms/roadExcavationDetails`);
                    }}
                >
                    Exit
                </Button>
            </div>
        </>
    );
};

class ComponentToPrintOfficialNotesheet extends React.Component {
    render() {
        const toWords = new ToWords({ localeCode: "mr-IN" });
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return (
            <>

                <div className={styles.main}>

                    <div className={styles.small}>

                        <div className={styles.one} style={{ marginLeft: "80px", marginRight: "80px" }}>

                            <div className={styles.logo}>
                                <div>
                                    <img src="/logo.png" alt="" height="100vh" width="100vw" />
                                </div>


                            </div>
                            <div><h2 style={{ marginTop: "80px" }}>Road Excavation Permission Letter</h2></div>
                            <div className={styles.middle} styles={{ paddingTop: "15vh", marginTop: "20vh" }}>

                                <div className={styles.add8}>
                                    <div className={styles.add} style={{paddingLeft:"10px"}}>
                                        <h3>
                                            <b>Service Name</b>
                                        </h3>
                                        <div>
                                            <p>Road Excavation<br></br>
                                            Application Number: RUS2737<br></br>
                                            Application Date: 03/2/23<br></br>
                                            Permission Number: RE-001/2022<br></br>
                                            Date: 03/7/23</p>
                                        </div>

                                    </div>

                                    <div className={styles.add1}>
                                        <h3>
                                            <b>Address</b>
                                        </h3>
                                        <div>
                                            <p>Zone No:A <br></br>Pradhikaran Nigdi, <br></br>Pimpari<br></br> Chinchval, Pune </p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={styles.contact} style={{ marginLeft: "80px", marginRight: "80px", marginBottom: "80px" }}>
                            <b>  For Contact :- Mobile No:-99999 99999</b>   <br></br>
                            <b >  Email :- enquiry@pcmcindia.gov.in</b>
                        </div>



                        <div className={styles.box} style={{ marginLeft: "80px", marginRight: "80px" }}>
                            <b>To, </b>  <br></br>
                            <b>Dear Shri ABC, </b> <br></br>
                            <b>This is acknowledged that your application with listed details recived for Road Excavation Permission same message is sent on you
                                registered mobile no. and email. </b> <br></br>
                            <p>Subject :- Road Excavation permission at *Address* for permit excavation *road length for purpose. </p>
                            <b>Order No :- 001236 Shri. ABC., Address :- Plot No. 000, Pradhikaran, Nigdi, Pimpri Chinchwad:-411 018.</b>
                            <div >
                                <table className={styles.table} >
                                    <tr className={styles.tr}>
                                        <th className={styles.th}>Sr No.</th>
                                        <th className={styles.th}>Company Name</th>
                                        <th className={styles.th}>Maharashtra Natural Gas Limited</th>
                                    </tr>
                                    <tr>
                                        <td className={styles.th}> </td>
                                        <td className={styles.th}>Excavation Address</td>
                                        <td className={styles.th}>Plot No. 000, Pradhikaran, Nigdi, Pimpri Chinchwad:-411 018</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.th}> </td>
                                        <td className={styles.th}>Road Type</td>
                                        <td className={styles.th}>Dambri Rasta</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.th}> </td>
                                        <td className={styles.th}>Excavation Pattern</td>
                                        <td className={styles.th}>Parallel Road Excavation</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.th}> </td>
                                        <td className={styles.th}>Road Length</td>
                                        <td className={styles.th}>350 Meter</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.th}> </td>
                                        <td className={styles.th}>Road Width</td>
                                        <td className={styles.th}>24 Meter</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.th}> </td>
                                        <td className={styles.th}>Road Reparing Charge 933 33 Per Sq.Meter</td>
                                        <td className={styles.th}>350*9333=32,66,550</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.th}> </td>
                                        <td className={styles.th}>Manapa Adhlbhar Charge 2000 Per Sq.Meter </td>
                                        <td className={styles.th}>350*2000=7,00,000</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.th}> </td>
                                        <td className={styles.th}>Total Amount </td>
                                        <td className={styles.th}>39,66,550</td>
                                    </tr>
                                </table>
                                <p style={{ marginTop: "20px" }}>Apprval Remark List </p>

                                <div className={styles.contact}>
                                    <b>Authority Signature</b><br></br>
                                    <button>upload</button>
                                    <p>Max file size accepted is 200kb in JPEG,PNG and PDF format </p>
                                    <b>Oficier, Municipal Corporation</b>
                                </div>
                            </div>
                        </div>




                    </div>
                </div>
            </>
        );
    }
}

export default Index;
