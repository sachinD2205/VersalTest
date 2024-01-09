import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from '../ipd.module.css'

import URLs from '../../../../../URLS/urls'
import { Add, Visibility } from '@mui/icons-material'
import { Paper, Button, IconButton } from '@mui/material'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Breadcrumb from '../../../../../components/common/BreadcrumbComponent'
import Title from '../../../../../containers/VMS_ReusableComponents/Title'
import { useGetToken } from '../../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const [table, setTable] = useState([])
  const [petAnimal, setPetAnimal] = useState([])
  const [petAnimalBreed, setPetAnimalBreed] = useState([])
  const [loader, setLoader] = useState(false)
  const userToken = useGetToken()

  useEffect(() => {
    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetAnimal(
          res.data.mstPetAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            nameEn: j.nameEn,
            nameMr: j.nameMr,
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
        setPetAnimalBreed(
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
    if (petAnimal?.length > 0 && petAnimalBreed?.length > 0) {
      //Get IPD data
      axios
        .get(`${URLs.VMS}/trnAnimalTreatmentIpd/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setTable(
            res.data.trnAnimalTreatmentIpdList.map((j, i) => ({
              srNo: i + 1,
              ...j,
              pickupDate:
                j.pickupDate != null
                  ? moment(j.pickupDate).format('DD-MM-YYYY')
                  : 'No Date',
              teamOrVolunteerName:
                j.ownerFullName != '' && j.ownerFullName != null
                  ? j.ownerFullName
                  : j.volunteerName,
              petAnimalEn: petAnimal.find(
                (obj) => obj.id === Number(j.animalName)
              )?.nameEn,
              petAnimalMr: petAnimal.find(
                (obj) => obj.id === Number(j.animalName)
              )?.nameMr,
              petAnimalBreedEn: petAnimalBreed.find(
                (obj) => obj.id === j.animalSpeciesKey
              )?.breedNameEn,
              petAnimalBreedMr: petAnimalBreed.find(
                (obj) => obj.id === j.animalSpeciesKey
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
  }, [petAnimal, petAnimalBreed])

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

      field: 'casePaperNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='casePaperNo' />,
      width: 120,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'petAnimalEn' : 'petAnimalMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petAnimal' />,
      width: 120,
    },
    {
      headerClassName: 'cellColor',

      field: 'kennelNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='kennelNo' />,
      width: 120,
    },
    {
      headerClassName: 'cellColor',

      field: 'pickupDate',
      headerAlign: 'center',
      headerName: <FormattedLabel id='pickupDate' />,
      width: 150,
    },
    {
      headerClassName: 'cellColor',

      field: 'complainerName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='complainerName' />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'teamOrVolunteerName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='teamOrVolunteer' />,
      minWidth: 125,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'status',
      headerAlign: 'center',
      headerName: <FormattedLabel id='status' />,
      width: 185,
    },

    {
      headerClassName: 'cellColor',

      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: '#1976d2' }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/animalTreatment/clerk/view`,
                  query: {
                    id: params.row.id,
                    // petAnimal: params.row.petAnimal
                  },
                })
              }}
            >
              <Visibility />
            </IconButton>
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Treating sick and injured animal through IPD</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='ipdHeading' />} />

        <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() => {
              router.push(
                `/veterinaryManagementSystem/transactions/animalTreatment/clerk/view`
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
            if (params.field === 'status' && params.value == 'Initiated') {
              return 'blueText'
            } else if (
              params.field === 'status' &&
              params.value == 'Under Treatment'
            ) {
              return 'orangeText'
            } else if (params.field === 'status' && params.value == 'Dead') {
              return 'redText'
            } else if (
              params.field === 'status' &&
              params.value == 'Released'
            ) {
              return 'greenText'
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
