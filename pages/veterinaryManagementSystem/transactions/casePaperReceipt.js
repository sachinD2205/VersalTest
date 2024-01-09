import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import router from 'next/router'
import styles from './paymentSlip.module.css'

import { Button, Paper } from '@mui/material'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { ExitToApp, Print } from '@mui/icons-material'
import { useReactToPrint } from 'react-to-print'
import { useSelector } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import URLs from '../../../URLS/urls'
import Loader from '../../../containers/Layout/components/Loader'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Case Paper Receipt',
  })

  const userToken = useGetToken()

  // @ts-ignore
  const printByNameDao =
    // @ts-ignore
    useSelector((state) => state?.user?.user?.userDao) ??
    // @ts-ignore
    useSelector((state) => state.user.user)
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const isDeptUser = useSelector(
    // @ts-ignore
    (state) => state?.user?.user?.userDao?.deptUser
  )

  const receiptType = ['officeCopy', 'customerCopy']
  const [fiscalYear, setFiscalYear] = useState('')
  const [applicationDetails, setApplicationDetails] = useState({})
  const [petBreeds, setPetBreeds] = useState([])
  const [bankName, setBankName] = useState([])
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    console.log('Sang: ', applicationDetails)
  }, [applicationDetails])

  useEffect(() => {
    let currentYear = Number(moment(new Date()).format('YYYY'))
    setFiscalYear(`${currentYear}-${currentYear + 1}`)

    //Get Bank
    axios
      .get(`${URLs.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBankName(
          res.data.bank.map((j) => ({
            id: j.id,
            bankNameEn: j.bankName,
            bankNameMr: j.bankNameMr,
            branchNameEn: j.branchName,
            branchNameMr: j.branchNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Pet Breeds
    axios
      .get(`${URLs.VMS}/mstAnimalBreed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetBreeds(
          res.data.mstAnimalBreedList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            breedNameEn: j.breedNameEn,
            breedNameMr: j.breedNameMr,
            petAnimalKey: j.petAnimalKey,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    setLoader(true)
    if (router.query.id && bankName?.length > 0 && petBreeds?.length > 0) {
      axios
        .get(`${URLs.VMS}/trnAnimalTreatment/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          setApplicationDetails({
            ...res.data,
            ownerFullNameEn:
              res.data?.firstName +
              ' ' +
              res.data?.middleName +
              ' ' +
              res.data?.lastName,
            ownerFullNameMr:
              res.data?.firstNameMr +
              ' ' +
              res.data?.middleNameMr +
              ' ' +
              res.data?.lastNameMr,

            paymentDao: {
              ...res.data.casePaperPaymentDao,
              bankNameEn: bankName.find(
                (obj) => obj.id == res.data.casePaperPaymentDao.bankName
              )?.bankNameEn,
              bankNameMr: bankName.find(
                (obj) => obj.id == res.data.casePaperPaymentDao.bankName
              )?.bankNameMr,
            },
            animalBreed: petBreeds.find(
              (obj) => obj.id === res.data.animalBreedKey
            )?.breedNameEn,
          })
          setLoader(false)
        })
        .catch((error) => {
          console.log('error: ', error)
          catchExceptionHandlingMethod(error, language)

          setLoader(false)
        })
    }
  }, [petBreeds, bankName])

  return (
    <>
      <Head>
        <title>Case Paper Receipt</title>
      </Head>
      <Paper className={styles.main}>
        {loader && <Loader />}
        <div className={styles.paymentWrapper} ref={componentRef}>
          {receiptType.map((obj, index) => (
            <div key={index}>
              <div className={styles[obj]}>
                <div className={styles.header}>
                  <Image src={'/qrcode1.png'} width={60} height={60} />
                  <div className={styles.centerHeader}>
                    <h1>
                      <FormattedLabel id='pcmc' />
                    </h1>
                    <div className={styles.row}>
                      <div style={{ display: 'flex', columnGap: 10 }}>
                        <label style={{ fontWeight: 'bold' }}>
                          <FormattedLabel id='fiscalYear' />:
                        </label>
                        <span>{fiscalYear}</span>
                      </div>
                    </div>
                  </div>
                  <Image src={'/logo.png'} width={70} height={70} />
                </div>

                <table className={styles.tableWrap}>
                  <tr className={styles.tableRow}>
                    <td
                      className={styles.tableData1}
                      style={{ textAlign: 'center' }}
                      colSpan={5}
                    >
                      <FormattedLabel id={obj} />
                    </td>
                  </tr>

                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='receiptNo' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='date' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='relatedTo' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='cfcRefNo' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='cfcCounterNo' />}</label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData2}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails?.paymentDao?.receiptNo
                        }
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {moment(
                          // @ts-ignore
                          applicationDetails?.applicationDate
                        ).format('DD-MM-YYYY')}
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        <FormattedLabel id='vms' />
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span></span>
                    </td>
                    <td className={styles.tableData2}>
                      <span></span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='receivedFrom' />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      <span>
                        {
                          // @ts-ignore
                          language == 'en'
                            ? applicationDetails.ownerFullNameEn
                            : applicationDetails.ownerFullNameMr
                        }
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='serviceName' />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      <span>
                        <FormattedLabel id='opdTitle' />
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='narration' />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      <span>
                        <FormattedLabel id='casePaperReceipt' />
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='address' />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails.ownerAddress
                        }
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='paymentMode' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='rupees' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='bankName' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='chequeNo' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='chequeDate' />}</label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData2}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails?.paymentDao?.paymentMode?.toUpperCase() ??
                            ''
                        }
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        <FormattedLabel id='twentyRs' />
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        {language === 'en'
                          ? // @ts-ignore
                            applicationDetails?.paymentDao?.bankNameEn
                          : // @ts-ignore
                            applicationDetails?.paymentDao?.bankNameMr}
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      {/* <span>01/02/2023</span> */}
                    </td>
                    <td className={styles.tableData2}>
                      {/* <span>State Bank of India</span> */}
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='referenceNo' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='date' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='details' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='payableAmount' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='receivedAmount' />}</label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData2}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails?.applicationNumber
                        }
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>{moment(new Date()).format('DD-MM-YYYY')}</span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        <FormattedLabel id='casePaperFee' />
                      </span>
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        <FormattedLabel id='twentyRs' />
                      </span>
                      <br />
                    </td>
                    <td className={styles.tableData2}>
                      <span>
                        <FormattedLabel id='twentyRs' />
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='payableAmount' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='rebateAmount' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='advanceAmount' />}</label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>
                        {<FormattedLabel id='actualPayableAmount' />}
                      </label>
                    </td>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='receivedAmount' />}</label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData2}>
                      <label>
                        <FormattedLabel id='twentyRs' />
                      </label>
                    </td>
                    <td className={styles.tableData2}>
                      {/* <label>Rebate Amount/सूट रक्कम</label> */}
                    </td>
                    <td className={styles.tableData2}>
                      {/* <label>Advance Amount/आगाऊ रक्कम</label> */}
                    </td>
                    <td className={styles.tableData2}>
                      <label>
                        <FormattedLabel id='twentyRs' />
                      </label>
                    </td>
                    <td className={styles.tableData2}>
                      <label>
                        <FormattedLabel id='twentyRs' />
                      </label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1} colSpan={1}>
                      <label>{<FormattedLabel id='totalAmount' />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={4}>
                      <label>
                        <FormattedLabel id='twentyRs' />
                      </label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='amountInWords' />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={2}>
                      <span>
                        <FormattedLabel id='twentyRsWords' />
                      </span>
                    </td>
                    <td className={styles.tableData1} colSpan={3}>
                      <label style={{ marginBottom: 100 }}>
                        {<FormattedLabel id='receiverSignature' />}:
                      </label>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='remark' />}:</label>
                    </td>
                    <td className={styles.tableData3} colSpan={2}>
                      <span>
                        {
                          // @ts-ignore
                          applicationDetails.scrutinyRemark
                        }
                      </span>
                    </td>
                    <td
                      className={styles.tableData3}
                      rowSpan={3}
                      colSpan={2}
                    ></td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>
                        {<FormattedLabel id='printDateAndTime' />}:{' '}
                      </label>
                    </td>
                    <td className={styles.tableData3} colSpan={2}>
                      <span>
                        {moment(new Date()).format('DD-MM-YYYY HH:mm')}
                      </span>
                    </td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.tableData1}>
                      <label>{<FormattedLabel id='printBy' />}: </label>
                    </td>
                    <td className={styles.tableData3} colSpan={2}>
                      <span>
                        {useSelector(
                          (state) =>
                            // @ts-ignore
                            state?.user?.user?.userDao
                        )
                          ? language === 'en'
                            ? printByNameDao.firstNameEn +
                              ' ' +
                              printByNameDao.middleNameEn +
                              ' ' +
                              printByNameDao.lastNameEn
                            : printByNameDao?.firstNameMr +
                              ' ' +
                              printByNameDao?.middleNameMr +
                              ' ' +
                              printByNameDao?.lastNameMr
                          : language === 'en'
                          ? printByNameDao.firstName +
                            ' ' +
                            printByNameDao.middleName +
                            ' ' +
                            printByNameDao.surname
                          : printByNameDao.firstNamemr +
                            ' ' +
                            printByNameDao.middleNamemr +
                            ' ' +
                            printByNameDao.surnamemr}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              {index == 0 && <div className={styles.divider}></div>}
            </div>
          ))}
        </div>
        <div className={styles.buttons}>
          <Button
            variant='contained'
            endIcon={<Print />}
            onClick={handleToPrint}
          >
            <FormattedLabel id='print' />
          </Button>
          <Button
            variant='outlined'
            color='error'
            endIcon={<ExitToApp />}
            onClick={() => {
              isDeptUser
                ? // router.push(
                  //     `/veterinaryManagementSystem/transactions/petLicense/application`
                  //   )
                  router.back()
                : router.push(`/dashboard`)
            }}
          >
            <FormattedLabel id='exit' />
          </Button>
        </div>
      </Paper>
    </>
  )
}

export default Index
