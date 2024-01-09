import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import styles from './report.module.css'

import {
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
} from '@mui/material'
// import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import moment from 'moment'
import { Print, Search } from '@mui/icons-material'
import { useReactToPrint } from 'react-to-print'
import { useSelector } from 'react-redux'
import axios from 'axios'

// import URLs from '../../../URLS/urls'
import ReportLayout from '../../../containers/reuseableComponents/ReportLayout'
import urls from '../../../URLS/urls'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const componentRef = useRef(null)
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
  

  const [table, setTable] = useState([])
  const userToken = useGetToken();
  const reportSchema = yup.object().shape({
    // petTypeKey: yup
    //   .number()
    //   .required('Please select an animal')
    //   .typeError('Please select an animal'),
    fromDate: yup
      .date()
      .typeError(`Please select a from Date`)
      .required(`Please select a from Date`),
    toDate: yup
      .date()
      .typeError(`Please select a to Date`)
      .required(`Please select a to Date`),
  })

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(reportSchema),
  })

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: 'Road Exacavtion Application Report',
  })

  // useEffect(() => {
  //   //Get Pet Animals
  //   axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
  //     setPetAnimal(
  //       res.data.mstPetAnimalList.map((j, i) => ({
  //         srNo: i + 1,
  //         id: j.id,
  //         nameEn: j.nameEn,
  //         nameMr: j.nameMr,
  //       }))
  //     )
  //   })

  //   //Get Pet Breeds
  //   axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
  //     setPetBreeds(
  //       res.data.mstAnimalBreedList.map((j, i) => ({
  //         srNo: i + 1,
  //         id: j.id,
  //         breedEn: j.breedNameEn,
  //         breedMr: j.breedNameMr,
  //       }))
  //     )
  //   })
  // }, [])

  const reportColumns = [
    {
      field: 'srNo',
      formattedLabel: 'srNo',
      width: 130,
    },
    {
      field: 'applicationNumber',
      formattedLabel: 'applicationNumber',
      width: 120,
    },
    {
      field: language == "en" ? "fullName" : "fullNameMr",
      formattedLabel: 'fullName',
      width: 120,
    },
    {
      field: language=="en" ? "companyName":"companyNameMr",
      formattedLabel: 'companyName',
      width: 100,
    },
    {
      field: 'mobileNo',
      formattedLabel: 'mobileNo',
      width: 100,
    },
    {
      field: 'emailId',
      formattedLabel: 'emailAddress',
      width: 100,
    },
    {
      field: 'applicationDate',
      formattedLabel: 'applicationDate',
      width: 100,
    },
    {
      field: 'applicationStatus',
      formattedLabel: 'applicationStatus',
      width: 110,
    },
  ]

  //have to add new api
  const finalSubmit = (data) => {
    let fromDate= moment(data.fromDate).format('DD-MM-YYYY')
    let toDate= moment(data.toDate).format('DD-MM-YYYY')
    console.log("ppppppppppp",fromDate,toDate);
    axios
      .get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getReportsByFromDtandToDate?fromDate=${fromDate}&toDate=${toDate}`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("resultttt",res);
        setTable(
          //have to add path 
          res.data?.trnExcavationRoadCpmpletionList?.length > 0
            ? res.data.trnExcavationRoadCpmpletionList.map((r, i) => ({
             
              srNo: i + 1 ,
              applicationNumber: r.applicationNumber,
              fullName: `${r.firstName} ${r.middleName} ${r.lastName}`,
              fullNameMr: `${r.firstNameMr} ${r.middleNameMr} ${r.lastNameMr}`,
              mobileNo: r.mobileNo,
              emailId: r.emailAddress,
              companyName: r.companyName,
              companyNameMr: r.companyNameMr,
              applicationDate: moment(r.applicationDate).format('DD-MM-YYYY'),
              applicationStatus:r.applicationStatus
              }))
            : []
        )
        res.data?.trnExcavationRoadCpmpletionList?.length == 0 &&
          sweetAlert('Info', 'No records found', 'info')
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }
  return (
    <>
      <Head>
        <title>Application Report</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
        
          <FormattedLabel id='applicationReport' />
        </div>
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row}>
           
            <FormControl error={!!error.fromDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='fromDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                    // minDate={new Date()}
                      inputFormat='dd-MM-yyyy'
                      label={<FormattedLabel id='fromDate' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.fromDate ? error.fromDate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.toDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='toDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                    minDate={moment(watch("fromDate")).add(1, "days")}
                    maxDate={new Date()}
                      inputFormat='dd-MM-yyyy'
                      label={<FormattedLabel id='toDate' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.toDate ? error.toDate.message : null}
              </FormHelperText>
            </FormControl>

            <div style={{ display: 'flex', gap: 20 }}>
              <Button variant='contained' type='submit' endIcon={<Search />}>
                {/* <FormattedLabel id='search' /> */}
                Search
              </Button>
              <Button
                variant='contained'
                onClick={handleToPrint}
                endIcon={<Print />}
              >
                Print
                {/* <FormattedLabel id='print' /> */}
              </Button>
            </div>
          </div>
        </form>
        {table.length > 0 && (
          <div className={styles.centerDiv}>
            <ReportLayout
              centerHeader
              showDates={watch('fromDate') && watch('toDate')}
              date={{
                from: moment(watch('fromDate')).format('DD-MM-YYYY'),
                to: moment(watch('toDate')).format('DD-MM-YYYY'),
              }}
              style={{
                marginTop: '5vh',
                boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.75)',
              }}
              componentRef={componentRef}
              rows={table}
              // rows={[]}
              columns={reportColumns}
            />
          </div>
        )}
      </Paper>
    </>
  )
}

export default index
