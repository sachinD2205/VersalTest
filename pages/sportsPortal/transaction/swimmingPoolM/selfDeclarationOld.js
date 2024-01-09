import { Button, Grid, Typography } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import axios from "axios";
import router from "next/router";
import styles from "./declaration.module.css";

import { useForm } from "react-hook-form";
import swal from "sweetalert";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf-jspdf2";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = (props) => {
    const {
        control,
        register,
        getValues,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const componentRef = useRef();
    const language = useSelector((state) => state?.labels.language);
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
    const printHandler = () => {
        let opt = {
            margin: 1,
            filename: "Sanction-Letter.pdf",
            image: { type: "jpeg", quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
        };
        const element = ReactDOMServer.renderToString(
            <ComponentToPrint
                dataa={dataa}
                ref={componentRef} language={language} />
        );
        let base64str;
        html2pdf()
            .from(element)
            .toPdf()
            .set(opt)
            .output("datauristring")
            .save();
    };

    const handlePrint = useReactToPrint({ content: () => componentRef.current, });
    const token = useSelector((state) => state.user.user.token);

    const [dataa, setDataa] = useState(null);
    useEffect(() => {
        //     if(router.query?.applicationId){
        //     axios
        //   .get(`${urls.SPURL}/gymBooking/getById?id=${router.query?.applicationId}`,{ headers: {
        //         Authorization: `Bearer ${token}`,
        //       },
        //   })
        //       .then((res) => {
        //         setDataa(res.data);        
        //       })
        //       .catch((error) => {
        //         callCatchMethod(error, language);
        //       });
        //     }
    }, []);
    // view
    return (
        <>
            <div>
                <ComponentToPrint dataa={dataa} ref={componentRef} language={language}/>
            </div>
            <br />

            <div className={styles.btn}>
                <Button
                    variant="contained"
                    sx={{ size: "23px" }}
                    type="primary"
                    onClick={printHandler}
                >
                    {language == "en" ? "Download" : "डाउनलोड करा"}
                </Button>
                <Button
                    variant="contained"
                    sx={{ size: "23px" }}
                    type="primary"
                    onClick={handlePrint}
                >
                    {language == "en" ? "Print" : "छापा"}
                </Button>
                <Button
                    type="primary"
                    variant="contained"
                    onClick={() => {
                        let title
                        let titleText
                        {
                            language == "en" ? title = "Exit?" : title = "बाहेर पडू?"
                        }
                        {
                            language == "en" ? titleText = "Are you sure you want to exit this Record ? " : titleText = "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ? "
                        }
                        swal({
                            title: title,
                            text: titleText,
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((willDelete) => {
                            if (willDelete) {
                                {
                                    language == "en"
                                        ? swal("Record is Successfully Exit!", { icon: "success", })
                                        : swal("रेकॉर्ड यशस्वीरित्या बाहेर पडा!", { icon: "success", })
                                }
                                // router.push("/sportsPortal/transaction/gymBooking/scrutiny");
                                router.push("/dashboard");
                            } else {
                                {
                                    language == "en"
                                        ? swal("Record is Safe")
                                        : swal("रेकॉर्ड सुरक्षित आहे")
                                }
                            }
                        });
                    }}
                >
                    {language == "en" ? "Exit" : "बाहेर पडा"}
                </Button>
            </div>
        </>
    );
};

class ComponentToPrint extends React.Component {
    render() {
        let language = this.props.language
        return (
            <>
                <div className={styles.main}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        style={{ minHeight: '98vh' }} // Adjust height as needed
                    >
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center" className={styles.heading}>
                                {language == "en"
                                ?<b>For Swimming<br/>
Self declaration</b>
                                :<b>जलतरण तलावावर पोहण्याकरीता<br />
                                    स्वयं घोषणापत्र
                                </b>
    }
                            </Typography>
                            <Typography variant="h6" className={styles.content}>
                                {language == "en"
                                ?<span>1) I am able to swim perfectly and I am coming to
                                swim at my own responsibility in the ------------- pool
                                of the Pimpri Chinchwad Municipal Corporation.
                                <br/>
                                2) I have made an online booking for swimming in the
                                -------------------swimming pool of Pimpri Chinchwad
                                Municipal Corporation. The information and
                                certificate provided by me for booking are true. I am
                                aware that if the said information and certificate is
                                found to be false, I will be fully responsible for it.</span>
                                :<span> १) मला उत्तम प्रकारे पोहता येत असून मी पिंपरी चिंचवड  महानगरपालिकेच्या    -----------------------येथील तलावात मी माझ्या जबाबदारीवर पोहण्यासाठी येत आहे.
                                <br />
                                २) पिंपरी चिंचवड महानगरपालिकेच्या ------------------------------------- येथील जलतरण तलावात पोहण्यासाठी मी ऑनलाईन बुकींग केलेले असून ऑनलाईन बुकींग साठी माझी दिलेली माहिती व प्रमाणपत्र खरी आहेत. सदर माहिती व प्रमाणपत्र खोटी आढळून आल्यास त्याची संपुर्ण जबाबदारी माझी राहील याची मला जाणीव आहे.</span>
                               
    }
                            </Typography>
                            <Typography variant="h6" align="right" className={styles.footer}>
                            {language == "en"
                               ?<span>
                                 Signature -.....................................<br />
                                Full Name -......................................
                                </span>
                                :<snap>
                                    स्वाक्षरी-.....................................<br />
                                संपुर्ण नाव -......................................
                               
                                </snap>}

                            </Typography>
                        </Grid>
                    </Grid>



                </div>
            </>
        );
    }
}

export default Index;
