import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Paper, Slide, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
//import urls from '../../../../URLS/urls'
import swal from "sweetalert";
import schema from "../../../../containers/schema/marriageRegistration/relation";
import urls from "../../../../URLS/urls";
import styles from "./view.module.css";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useRouter } from "next/router";


// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const router = useRouter();

const [encRequest, setEncRequest] = useState();
const [access_code, setAccess_code] = useState();   
const [url, setUrl] = useState();

useEffect(() => {
    console.log("useEffect");
      
  url = "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

  encRequest = "39f3e600707ed0858f8d3ef7d7382d17dd160f36904c0e73ce89640ec0d0c9211f41d233132128b0232623446913cbe76d6a44c1f9da13865586e1ce030a50fb2fe71e14056b511b033117ba0688528930fdd4e3fb47d15dc82544cafbd95082f4dc8a17b57a7b3b0ba8449e33b52dfd56ac980e247978b149886b15f072b0989f4a51fc991f4f31fe84d27aff44c6b6ba3c46f29aa75d5df719bfecf15ee98ec9d87f8b6e8bad2328aeab6409809d5f80aab9d687387f1602effa3b11395efe88e5485f1d15778abe53152a488300cd6016fbcfb03cfd57f5b6e1b64f72e43227fea357c8c1a79457a0877d5ab68f220d34259f36003b7470b68abc41d672a5566df615d9e34db1f078bc9a3faa0da03ec7662019715c2997c2090e1c93cdb90610e208c9b2c00ab8201bf1bee712fc7c36128167ff7379133cb2cd8ae97956";

   access_code = "AVBM73KF04AF04MBFA";
}, []);
  


  //{"url":"https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction","encRequest":"39f3e600707ed0858f8d3ef7d7382d17dd160f36904c0e73ce89640ec0d0c9211f41d233132128b0232623446913cbe76d6a44c1f9da13865586e1ce030a50fb2fe71e14056b511b033117ba0688528930fdd4e3fb47d15dc82544cafbd95082f4dc8a17b57a7b3b0ba8449e33b52dfd56ac980e247978b149886b15f072b0989f4a51fc991f4f31fe84d27aff44c6b6ba3c46f29aa75d5df719bfecf15ee98ec9d87f8b6e8bad2328aeab6409809d5f80aab9d687387f1602effa3b11395efe88e5485f1d15778abe53152a488300cd6016fbcfb03cfd57f5b6e1b64f72e43227fea357c8c1a79457a0877d5ab68f220d34259f36003b7470b68abc41d672a5566df615d9e34db1f078bc9a3faa0da03ec7662019715c2997c2090e1c93cdb90610e208c9b2c00ab8201bf1bee712fc7c36128167ff7379133cb2cd8ae97956","access_code":"AVBM73KF04AF04MBFA"}

  // OnSubmit Form
  const onSubmitForm = (event) => {

    event.preventDefault();

    console.log("onSubmitForm", event.target);

  

    // form body with above data
    let formBody = {
        
        encRequest: encRequest,
        access_code: access_code,
    };

    console.log("formBody", formBody);

    

    // User router.push to submit post request to ccavenue test url
  

    
    
    router.push(url, formBody).then((response) => {
        console.log("pgresponse", response);
        if (response.status === 200) {
            swal({
            title: "Success",
            text: "Module Added Successfully",
            icon: "success",
            timer: 2000,
            button: false,
            });

        } else {
            swal({
            title: "Error",
            text: "Something went wrong",
            icon: "error",
            timer: 2000,
            button: false,
            });

        }
    }).catch((error) => {
        console.log("pgerror", error);
        swal({
            title: "Error",
            text: JSON.stringify(error),
            icon: "error",
            timer: 10000,
            button: false,
        });
    }
    );


    // // use axios post to call ccavenue test url and post the data
    // axios.post(url, formBody).then((response) => {
    //     console.log("pgresponse", response);
    //     if (response.status === 200) {
    //         swal({
    //         title: "Success",
    //         text: "Module Added Successfully",
    //         icon: "success",
    //         timer: 2000,
    //         button: false,
    //         });
            
    //     } else {
    //         swal({
    //         title: "Error",
    //         text: "Something went wrong",
    //         icon: "error",
    //         timer: 2000,
    //         button: false,
    //         });

    //     }
    // }).catch((error) => {
    //     console.log("pgerror", error);
    //     swal({
    //         title: "Error",
    //         text: JSON.stringify(error),
    //         icon: "error",
    //         timer: 10000,
    //         button: false,
    //     });
    // }
    // );

    
  };

 

  // View
  return (
    <>
      {/* <BasicLayout> */}
      <Paper >
       
              <FormProvider {...methods}>
                <form method="POST"  action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction">
                  <div className={styles.small} hidden>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="encRequest"
                          variant="standard"
                          value="fb6139dcdd711918327c72518e161e0d48b9728d7710b5da3bdf56d7d9e8c3f7cfb8117dc96c99d07e3f372347f0b5392571f6dc8458d2d90cf286a92a28599186c056e32e1167dc02e32e6d1b0c184de4f732c69df41feddcb3942e33e1bc754754b698bfecbaf0ac57caba6a5bd9f62f931c7ee3a698f8486b69920f3f78efa6ea854c0e002986b4d61cad2dac3a03e9b2d8ebbec36dddfe95b1a4551370988459d21f1dbb078c6f39dea3d3ffd13b96f26f5a2348f9ad4bb2d652ed42b91894f3adecb96ee0506c34e3c46577e68201a22071617559e617d202031845f56dc1e2690a59917dc8134f4662264a4669160256a3423d679e76d231c23e67b6d96b29b1a79c06b4f09f59bcf09a794bc099e08f2f03497639e69f62912e1a95b1"
                          {...register("encRequest")}
                          error={!!errors.moduleName}
                          helperText={errors?.moduleName ? errors.moduleName.message : null}
                        />
                      </div>
                    </div>
             
                    <div className={styles.row} hidden>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="access_code"
                          variant="standard"
                          value="AVOV05KF01CK11VOKC"
                          {...register("access_code")}
                          error={!!errors.moduleName}
                          helperText={errors?.moduleName ? errors.moduleName.message : null}
                        />
                      </div>
                    </div>
                  </div>

                  {/* add button for submit */}
                    <div className={styles.row}>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<SaveIcon />}
                                type="submit"
                               
                            >
                                Save
                            </Button>
                        </div>
                    </div>

                </form>
              </FormProvider>
           
        
        
        
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;
