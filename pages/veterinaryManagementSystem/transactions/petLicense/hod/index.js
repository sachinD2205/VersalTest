import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import URLs from '../../../../../URLS/urls'
import styles from '../vet.module.css'

import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import { Paper, Button, IconButton } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Pets, Visibility } from '@mui/icons-material'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import { useSelector } from 'react-redux'
import Breadcrumb from '../../../../../components/common/BreadcrumbComponent'
import Title from '../../../../../containers/VMS_ReusableComponents/Title'
import { useGetToken } from '../../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [table, setTable] = useState([])
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setLoader(true)
    //Get Applications
    axios
      .get(`${URLs.VMS}/trnPetLicence/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setTable(
          res.data.trnPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            ownerName: j?.ownerName,
            ownerFullNameEn:
              j?.firstName + ' ' + j?.middleName + ' ' + j?.lastName,
            ownerFullNameMr:
              j?.firstNameMr + ' ' + j?.middleNameMr + ' ' + j?.lastNameMr,
            petName: j?.petName,
            animalAge: j?.animalAge,
            animalColor: j?.animalColor,
            status: j?.status,
          }))
        )
        setLoader(false)
      })
      .catch((error) => {
        console.log('error: ', error)
        catchExceptionHandlingMethod(error, language)

        setLoader(false)
      })
  }, [])

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 70,
    },

    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'ownerFullNameEn' : 'ownerFullNameMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='ownerName' />,
      width: 250,
    },
    {
      headerClassName: 'cellColor',

      field: 'petName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petName' />,
      width: 180,
    },
    {
      headerClassName: 'cellColor',

      field: 'animalAge',
      headerAlign: 'center',
      headerName: <FormattedLabel id='animalAge' />,
      width: 200,
      // flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'animalColor',
      headerAlign: 'center',
      headerName: <FormattedLabel id='animalColor' />,
      width: 200,
    },
    {
      headerClassName: 'cellColor',

      field: 'status',
      headerAlign: 'center',
      headerName: <FormattedLabel id='status' />,
      width: 200,
    },
    {
      headerClassName: 'cellColor',

      field: 'action',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: '#1976d2' }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/petLicense/hod/view`,
                  query: { id: params.row.id },
                })
              }}
            >
              <Visibility />
            </IconButton>

            {/* {params.row.status === "Payment Successful" && (
              <Button
                variant="contained"
                onClick={() => {
                  router.push({
                    pathname: `/veterinaryManagementSystem/transactions/petLicense/petLicense`,
                    query: { id: router.query.id },
                  });
                }}
                endIcon={<Pets />}
              >
                <FormattedLabel id="generateLicense" />
              </Button>
            )} */}
            <Button
              disabled={
                params.row.status === 'Payment Successful' ||
                params.row.status === 'License Generated'
                  ? false
                  : true
              }
              variant='contained'
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/petLicense/petLicense`,
                  query: { id: params.row.id },
                })
              }}
              endIcon={<Pets />}
            >
              {params.row.status === 'Payment Successful' ? (
                <FormattedLabel id='generateLicense' />
              ) : (
                <FormattedLabel id='viewLicense' />
              )}
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Pet License</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='petLicense' />} />

        <DataGrid
          autoHeight
          sx={{
            marginTop: '5vh',
            width: '100%',

            '& .cellColor': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
            '& .redText': {
              color: 'red',
            },
            '& .orangeText': {
              color: 'orange',
            },
            '& .greenText': {
              color: 'green',
            },
            '& .blueText': {
              color: 'blue',
            },
          }}
          getCellClassName={(params) => {
            if (
              params.field === 'status' &&
              ['Initiated', 'Applied'].includes(params.value)
            ) {
              return 'orangeText'
            } else if (
              params.field === 'status' &&
              [
                'Approved by HOD',
                'Approved by Clerk',
                'Awaiting Payment',
                'Released',
              ].includes(params.value)
            ) {
              return 'greenText'
            } else if (
              params.field === 'status' &&
              [
                'Reassigned by Clerk',
                'Reassigned by HOD',
                'Rejected by HOD',
              ].includes(params.value)
            ) {
              return 'redText'
            } else if (
              params.field === 'status' &&
              ['Payment Successful', 'License Generated'].includes(params.value)
            ) {
              return 'blueText'
            } else {
              return ''
            }
          }}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 0 },
              disableExport: false,
              disableToolbarButton: false,
              csvOptions: { disableToolbarButton: false },
              printOptions: { disableToolbarButton: true },
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          loading={loader}
        />
      </Paper>
    </>
  )
}

export default Index
