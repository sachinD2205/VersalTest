import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import URLs from '../../../../../URLS/urls'
import styles from '../vet.module.css'

import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import { Paper, Button, IconButton } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Add, Edit, Pets, Visibility } from '@mui/icons-material'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import Breadcrumb from '../../../../../components/common/BreadcrumbComponent'
import Title from '../../../../../containers/VMS_ReusableComponents/Title'
import { useSelector } from 'react-redux'
import { useGetToken } from '../../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../../util/util'

const Index = () => {
  const [table, setTable] = useState([])
  const [loader, setLoader] = useState(false)

  const language = useSelector((state) => state?.labels?.language)
  const userToken = useGetToken()

  useEffect(() => {
    setLoader(true)

    //Get Applications
    axios
      .get(`${URLs.VMS}/trnRenewalPetLicence/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setTable(
          res.data.trnRenewalPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            petAnimal: j?.petAnimalKey,
            // ownerName: j.ownerName,
            ownerName: j?.firstName + ' ' + j?.middleName + ' ' + j?.lastName,
            ownerNameMr:
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
      width: 60,
    },

    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'ownerName' : 'ownerNameMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='ownerName' />,
      minWidth: 225,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'petName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petName' />,
      width: 125,
    },
    {
      headerClassName: 'cellColor',

      field: 'animalAge',
      headerAlign: 'center',
      headerName: <FormattedLabel id='animalAge' />,
      width: 180,
    },
    {
      headerClassName: 'cellColor',

      field: 'animalColor',
      headerAlign: 'center',
      headerName: <FormattedLabel id='animalColor' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: 'status',
      headerAlign: 'center',
      headerName: <FormattedLabel id='status' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: '#1976d2' }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                  query: {
                    id: params.row.id,
                    petAnimal: params.row.petAnimal,
                    pageMode: 'view',
                  },
                })
              }}
            >
              <Visibility />
            </IconButton>
            {params.row.status === 'Reassigned by Clerk' && (
              <IconButton
                style={{ color: '#1976d2' }}
                onClick={() => {
                  router.push({
                    pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                    query: { id: params.row.id, pageMode: 'edit' },
                  })
                }}
              >
                <Edit />
              </IconButton>
            )}

            <Button
              disabled={params.row.status == 'License Generated' ? false : true}
              variant='contained'
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/petLicense`,
                  query: { id: params.row.id },
                })
              }}
              endIcon={<Pets />}
            >
              <FormattedLabel id='viewLicense' />
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Pet License Renewal</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='renewalPetLicense' />} />

        <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() => {
              router.push(
                `/veterinaryManagementSystem/transactions/renewalPetLicense/TnC`
              )
            }}
          >
            <FormattedLabel id='add' />
          </Button>
        </div>
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
            if (params.field === 'status' && params.value == 'Applied') {
              return 'orangeText'
            } else if (
              params.field === 'status' &&
              params.value == 'Approved by Clerk'
            ) {
              return 'greenText'
            } else if (
              params.field === 'status' &&
              params.value == 'Approved by HOD'
            ) {
              return 'greenText'
            } else if (
              params.field === 'status' &&
              (params.value == 'Reassigned by Clerk' ||
                params.value == 'Reassigned by HOD' ||
                params.value == 'Rejected by HOD')
            ) {
              return 'redText'
            } else if (
              params.field === 'status' &&
              (params.value == 'Payment Successful' ||
                params.value == 'License Generated')
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
