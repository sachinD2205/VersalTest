import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './petIncinerator.module.css'

import { Button, IconButton, Paper } from '@mui/material'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { Add, Delete, Payment, Visibility } from '@mui/icons-material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import URLs from '../../../../URLS/urls'
import axios from 'axios'
import { useSelector } from 'react-redux'
import sweetAlert from 'sweetalert'
import Breadcrumb from '../../../../components/common/BreadcrumbComponent'
import Title from '../../../../containers/VMS_ReusableComponents/Title'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [table, setTable] = useState([])
  const [petBreeds, setPetBreeds] = useState([])
  const [loader, setLoader] = useState(false)

  useEffect(() => {
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
        console.log('error: ', error)
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    setLoader(true)
    if (petBreeds?.length > 0) {
      axios
        .get(`${URLs.VMS}/trnSmallPetIncineration/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setTable(
            res.data.trnSmallPetIncinerationList.map((j, i) => ({
              srNo: i + 1,
              ...j,
              petBreedEn: petBreeds.find(
                (obj) => obj.id == Number(j.animalBreedKey)
              )?.breedNameEn,
              petBreedMr: petBreeds.find(
                (obj) => obj.id == Number(j.animalBreedKey)
              )?.breedNameMr,
            }))
          )
          setLoader(false)
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language)

          setLoader(false)
        })
    }
  }, [petBreeds])

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

      field: 'applicationNumber',
      headerAlign: 'center',
      headerName: <FormattedLabel id='applicationNo' />,
      width: 250,
    },
    {
      headerClassName: 'cellColor',

      field: 'licenseNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='licenseNo' />,
      width: 160,
    },
    {
      headerClassName: 'cellColor',

      field: 'ownerName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='ownerName' />,
      width: 160,
    },
    {
      headerClassName: 'cellColor',

      field: 'ownerAddress',
      headerAlign: 'center',
      headerName: <FormattedLabel id='ownerAddress' />,
      width: 280,
    },

    {
      headerClassName: 'cellColor',

      field: 'petName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petName' />,
      width: 120,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'petBreedEn' : 'petBreedMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petBreed' />,
      width: 150,
    },
    {
      headerClassName: 'cellColor',

      field: 'applicationStatus',
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
                  pathname: `/veterinaryManagementSystem/transactions/petIncinerator`,
                  query: { id: params.row?.id, pageMode: 'view' },
                })
              }}
            >
              <Visibility />
            </IconButton>

            {params.row?.applicationStatus == 'Application Submitted' && (
              <Button
                variant='contained'
                endIcon={<Payment />}
                onClick={() =>
                  router.push({
                    pathname:
                      '/veterinaryManagementSystem/transactions/petIncinerator/paymentGateway',
                    query: { id: params.row?.id },
                  })
                }
              >
                <FormattedLabel id='makePayment' />
              </Button>
            )}
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Pet Incinerator</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='smallPetIncinerator' />} />

        <DataGrid
          autoHeight
          sx={{
            marginTop: '5vh',
            width: '100%',

            '& .cellColor': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
            '& .orangeText': {
              color: 'orange',
            },
            '& .blueText': {
              color: 'blue',
            },
          }}
          getCellClassName={(params) => {
            if (
              params.field === 'applicationStatus' &&
              params.value == 'Application Submitted'
            ) {
              return 'orangeText'
            } else if (
              params.field === 'applicationStatus' &&
              params.value == 'Payment Successful'
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
