import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './vaccination.module.css'

import { Button, IconButton, Paper } from '@mui/material'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { Add, Visibility } from '@mui/icons-material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import axios from 'axios'
import URLs from '../../../../URLS/urls'
import Breadcrumb from '../../../../components/common/BreadcrumbComponent'
import Title from '../../../../containers/VMS_ReusableComponents/Title'
import moment from 'moment'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [allBreeds, setAllBreeds] = useState([
    {
      id: 1,
      breedNameEn: '',
      breedNameMr: '',
      petAnimalKey: '',
    },
  ])
  const [allOPD, setAllOPD] = useState([{ id: 1, opdName: '' }])
  const [allVaccines, setAllVaccines] = useState([
    { id: 1, vaccineEn: '', vaccineMr: '' },
  ])
  const [allPetAnimals, setAllPetAnimals] = useState([
    { id: 1, petNameEn: '', petNameMr: '' },
  ])
  const [table, setTable] = useState([])

  useEffect(() => {
    //Get OPDs
    axios
      .get(`${URLs.VMS}/mstOpd/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setAllOPD(
          res?.data?.mstOpdList.map((j) => ({ id: j.id, opdName: j.opdName }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Vaccines
    axios
      .get(`${URLs.VMS}/mstVaccineUsed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setAllVaccines(
          res?.data?.mstVaccineUsedList.map((j) => ({
            id: j.id,
            vaccineEn: j.vaccineUsedEn,
            vaccineMr: j.vaccineUsedMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setAllPetAnimals(
          res?.data?.mstPetAnimalList.map((j) => ({
            id: j.id,
            petNameEn: j.nameEn,
            petNameMr: j.nameMr,
          }))
        )
      )
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
      .then((res) =>
        setAllBreeds(
          res?.data?.mstAnimalBreedList.map((j) => ({
            id: j.id,
            petAnimalKey: j.petAnimalKey,
            breedNameEn: j.breedNameEn,
            breedNameMr: j.breedNameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    if (!!allOPD && !!allVaccines && !!allPetAnimals && !!allBreeds) {
      axios
        .get(`${URLs.VMS}/trnOpdVaccination/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) =>
          setTable(
            res?.data?.trnOpdVaccinationList.map((j, i) => ({
              srNo: i + 1,
              // ...j,
              id: j?.id,
              opdCaseNo: j?.opdCaseNo,
              nameOfOwner: j?.nameOfOwner,
              vaccinationDate: moment(j?.vaccinationDate).format('DD-MM-YYYY'),
              opdName: allOPD.find((opd) => opd.id == j.opdKey)?.opdName,
              vaccineUsedEn: allVaccines.find(
                (vaccine) => vaccine.id == j.vaccineUsedKey
              )?.vaccineEn,
              vaccineUsedMr: allVaccines.find(
                (vaccine) => vaccine.id == j.vaccineUsedKey
              )?.vaccineMr,
              petNameEn: allPetAnimals.find(
                (animal) => animal.id == j.petAnimalKey
              )?.petNameEn,
              petNameMr: allPetAnimals.find(
                (animal) => animal.id == j.petAnimalKey
              )?.petNameMr,
              petBreedEn: allBreeds.find((breed) => breed.id == j.breed)
                ?.breedNameEn,
              petBreedMr: allBreeds.find((breed) => breed.id == j.breed)
                ?.breedNameMr,
            })) ?? []
          )
        )
        .catch((error) => {
          catchExceptionHandlingMethod(error, language)
        })
    }
  }, [allOPD, allVaccines, allPetAnimals, allBreeds])

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 75,
    },
    {
      headerClassName: 'cellColor',

      field: 'opdCaseNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='casePaperNo' />,
      width: 150,
    },
    {
      headerClassName: 'cellColor',

      field: 'vaccinationDate',
      headerAlign: 'center',
      headerName: <FormattedLabel id='vaccinationDate' />,
      width: 150,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'vaccineUsedEn' : 'vaccineUsedMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='vaccineUsed' />,
      width: 150,
    },
    {
      headerClassName: 'cellColor',

      field: 'opdName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='opdName' />,
      width: 150,
    },
    {
      headerClassName: 'cellColor',

      field: 'nameOfOwner',
      headerAlign: 'center',
      headerName: <FormattedLabel id='ownerName' />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'petNameEn' : 'petNameMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petAnimal' />,
      width: 125,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'petBreedEn' : 'petBreedMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petBreed' />,
      width: 125,
    },
    // {
    //   headerClassName: 'cellColor',

    //   field: 'status',
    //   headerAlign: 'center',
    //   headerName: <FormattedLabel id='status' />,
    //   width: 125,
    // },
    {
      headerClassName: 'cellColor',

      field: 'actions',
      align: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 90,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: '#1976d2' }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/vaccination/view`,
                  query: {
                    id: params.row.id,
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
        <title>Vaccination Report</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {/* <div className={styles.title}>
          <FormattedLabel id='vaccinationReport' />
        </div> */}
        <Title titleLabel={<FormattedLabel id='vaccinationReport' />} />

        <div className={styles.endDiv} style={{ marginTop: 20 }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() =>
              router.push(
                '/veterinaryManagementSystem/transactions/vaccination/view'
              )
            }
          >
            <FormattedLabel id='add' />
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginTop: '5vh',
            width: '100%',

            '.MuiDataGrid-cellContent': {
              whiteSpace: 'normal',
            },

            '& .cellColor': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
            '& .orangeText': {
              color: 'orange',
            },
            '& .greenText': {
              color: 'green',
            },
          }}
          getCellClassName={(params) => {
            if (params.field === 'status' && params.value == 'Pending') {
              return 'orangeText'
            } else if (
              params.field === 'status' &&
              params.value == 'Vaccinated'
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
          loading={table.length == 0}
          rows={table}
          //@ts-ignore
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Paper>
    </>
  )
}

export default Index
