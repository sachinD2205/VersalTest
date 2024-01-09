//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import { yupResolver } from '@hookform/resolvers/yup'
import CloseIcon from '@mui/icons-material/Close'
import NextPlanIcon from '@mui/icons-material/NextPlan'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import UndoIcon from '@mui/icons-material/Undo'
import ReportIcon from '@mui/icons-material/Report'
import {
  Button,
  IconButton,
  Modal,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FormattedLabel from '../../containers/reuseableComponents/FormattedLabel'
import styles from '../../styles/ElectricBillingPayment_Styles/scutinyActions.module.css'
import urls from '../../URLS/urls'
import scrutinyActionSchema from '../../containers/schema/ElelctricBillingPaymentSchema/scrutinyActionSchema'
import { cfcCatchMethod,moduleCatchMethod } from '../../util/commonErrorUtil'

const Index = ({dataSource, getAllBillData}) => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(scrutinyActionSchema),
    mode: "onChange",
  });
  const router = useRouter()
  let user = useSelector((state) => state.user.user)
  const [modalforAprov, setmodalforAprov] = useState(false)
  const [selectedData, setSelectedData] = useState({})

  const language = useSelector((state) => state.labels.language);

  let selectedMenuFromDrawer = localStorage.getItem('selectedMenuFromDrawer')
  let serviceId = (serviceId = user?.menus?.find(
    (m) => m?.id == selectedMenuFromDrawer,
  )?.serviceId)

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  useEffect(()=>{
    getCreatedBillData()
  },[dataSource])

  const getCreatedBillData = () => {
    axios
      .get(`${urls.EBPSURL}/trnBillGenerate/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnBillGenerateList;
        let temp = result.find((each)=> each.id == dataSource?.id);
        setSelectedData(temp);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      })
  };

  //aprovel
  const remarks = async (btnType) => {
    // e.preventDefault();
    let jrEngRole = authority?.find((val)=>val === "JUNIOR_ENGINEER");
    let dyEngRole = authority?.find((val)=>val === "DEPUTY_ENGINEER"); 
    let exEngRole = authority?.find((val)=>val === "EXECUTIVE_ENGINEER"); 
    let deptAccRole = authority?.find((val)=>val === "ACCOUNTANT"); 
    let hoAccRole = authority?.find((val)=>val === "HEAD_ACCOUNTANT");

    let remarkObj={
      jrEngApprovalRemark: jrEngRole? watch('remark') : selectedData?.jrEngApprovalRemark,
      dyApprovalRemark: dyEngRole? watch('remark') : selectedData?.dyApprovalRemark,
      exApprovalRemark: exEngRole? watch('remark') : selectedData?.exApprovalRemark,
      deptAccApprovalRemark: deptAccRole? watch('remark') : selectedData?.deptAccApprovalRemark,
      hoAccApprovalRemark: hoAccRole? watch('remark') : selectedData?.hoAccApprovalRemark ,
    }

    console.log("deptAccRole",deptAccRole , selectedData?.status == 7 );

    if(btnType === "APPROVE"){
      let payload = {
          ...selectedData,
          ...remarkObj,
          isApproved: true,
          isCompleted: null,
          isSentToMsecdl: null,
          formNo14: (selectedData?.status == 7 || selectedData?.status == 28) && deptAccRole  ? true :  selectedData?.formNo14
      }

      let result = [payload];

    let _data = {
      trnBillGenerateDao: result,
    };

    console.log("_data",_data);

      await axios
      .post(
        `${urls.EBPSURL}/trnBillGenerate/save/multiplBills`,
        _data,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      ).then((response) => {
        if (response.status === 201) {
          console.log("response", response.data.message);
          let string = response.data.message
          let string1 =  string.split("[");
          let billNoStr = string1[1].split("]");
      
          console.log("string1", billNoStr[0]);
          sweetAlert(
            language == "en" ? "Approved!" : "मंजूर",
            language == "en"
              ? `Bill ${billNoStr[0]} Approved Successfully !!!`
              : `बिल  ${billNoStr[0]} यशस्वीरित्या मंजूर झाले !!!`,
            "success"
          );
          getAllBillData();
          setmodalforAprov(false);
        }
      })
      .catch((err)=>{
        cfcErrorCatchMethod(err, false);
      })
    }else if(btnType === "REVERT"){
      let payload = {
        ...selectedData,
        ...remarkObj,
        isApproved: false,
        isCompleted: null,
        isSentToMsecdl: null,
        formNo14: (selectedData?.status == 7 || selectedData?.status == 28) && deptAccRole  ? false : selectedData?.formNo14
    }

    let result = [payload];

    let _data = {
      trnBillGenerateDao: result,
    };

    console.log("_data",_data);

    await axios
    .post(
      `${urls.EBPSURL}/trnBillGenerate/save/multiplBills`,
      _data,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    )

    .then((response) => {
      if (response.status === 201) {
        console.log("response", response.data.message);
        let string = response.data.message
        let string1 =  string.split("[");
        let billNoStr = string1[1].split("]");
    
        console.log("string1", billNoStr[0]);
        sweetAlert(
          language == "en" ? "Revert!" : "पूर्ववत केले",
          language == "en"
            ? `Bill ${billNoStr[0]} Revert Back successfully !`
            : `बिल ${billNoStr[0]} यशस्वीरित्या परत आले!`,
          "success"
        );
        getAllBillData();
        setmodalforAprov(false);
      }
    })
    .catch((err)=>{
      cfcErrorCatchMethod(err, false);
    })
     }
  }

  return (
    <>
  
        <Button
          variant="contained"
          endIcon={<NextPlanIcon />}
          color="success"
          size='small'
          onClick={() => {
            // alert(serviceId)
            setmodalforAprov(true)
          }}
          sx={{
            marginLeft: "5px"
          }}
        >
          <FormattedLabel id="actions" />
        </Button>

      <form {...methods} onSubmit={handleSubmit('remarks')}>
        <div className={styles.model}>
          <Modal
            open={modalforAprov}
            //onClose={clerkApproved}
            onCancel={() => {
              setmodalforAprov(false)
            }}
          >
            <div className={styles.boxRemark}>
              <div className={styles.titlemodelremarkAprove}>
                <Typography
                  className={styles.titleOne}
                  variant="h6"
                  component="h2"
                  color="#f7f8fa"
                  style={{ marginLeft: '25px' }}
                >
                  <FormattedLabel id="remarkModel" />
                  {/* Enter Remark on application */}
                </Typography>

                <IconButton>
                  <CloseIcon
                    onClick={() => { setmodalforAprov(false); setValue("remark", "");} }
                  />
                </IconButton>
              </div>

              <div className={styles.btndate} style={{ marginLeft: "20%", marginRight: "20%" }}>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={4}
                  placeholder="Enter a Remarks"
                  style={{ width: "100%" }}
                  // onChange={(e) => {
                  //   setRemark(e.target.value)
                  // }}
                  // name="remark"
                  {...register('remark')}
                />
              </div>

              {(authority?.find((val) => val == "DEPUTY_ENGINEER") &&
            (dataSource?.statusCode == 3 || dataSource?.statusCode == 4)) 
            ||
            (authority?.find((val) => val == "EXECUTIVE_ENGINEER") &&
            (dataSource?.statusCode == 5 || dataSource?.statusCode == 6))
            ||
            (authority?.find((val) => val == "ACCOUNTANT") &&
            (dataSource?.statusCode == 7 || dataSource?.statusCode == 28)) ? (
              <div className={styles.btnappr}>
          
              <Button
                variant="contained"
                color="success"
                size="small"
                endIcon={<ThumbUpIcon />}
                onClick={async () => {
                  remarks('APPROVE')
                  // setBtnSaveText('APPROVED')
                  // alert(serviceId)
                }}
              >
                <FormattedLabel id="approve" />
              </Button>

              <Button
                variant="contained"
                color="primary"
                size="small"
                endIcon={<UndoIcon />}
                onClick={() => {
                  remarks('REVERT')
                }}
              >
                <FormattedLabel id="revert" />
              </Button>
              
            </div>
            ) : (
              ""
            )}

            </div>
          </Modal>
        </div>
      </form>
    </>
  )
}
export default Index
