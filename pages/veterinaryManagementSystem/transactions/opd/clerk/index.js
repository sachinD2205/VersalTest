import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from '../opd.module.css'

import URLs from '../../../../../URLS/urls'
import { Add, Visibility } from '@mui/icons-material'
import { Paper, Button, IconButton } from '@mui/material'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import { useSelector } from 'react-redux'
import sweetAlert from 'sweetalert'
import Breadcrumb from '../../../../../components/common/BreadcrumbComponent'
import Title from '../../../../../containers/VMS_ReusableComponents/Title'
import { useGetToken } from '../../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [table, setTable] = useState([])

  const [area, setArea] = useState([])
  const [zone, setZone] = useState([])
  const [ward, setWard] = useState([])

  const [petAnimal, setPetAnimal] = useState([])
  const [petAnimalBreed, setPetAnimalBreed] = useState([])

  const [loader, setLoader] = useState(false)

  useEffect(() => {
    //Get Area
    axios
      .get(`${URLs.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setArea(
          res.data.area.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            areaEn: j.areaName,
            areaMr: j.areaNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Zone
    axios
      .get(`${URLs.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setZone(
          res.data.zone.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Ward
    axios
      .get(`${URLs.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setWard(
          res.data.ward.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            wardEn: j.wardName,
            wardMr: j.wardNameMr,
          }))
        )
      })
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
    if (
      petAnimalBreed?.length > 0 &&
      petAnimal?.length > 0 &&
      ward?.length > 0 &&
      zone?.length > 0 &&
      area?.length > 0
    ) {
      //Get OPD data
      axios
        .get(`${URLs.VMS}/trnAnimalTreatment/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setTable(
            res.data.trnAnimalTreatmentList.map((j, i) => ({
              srNo: i + 1,
              ...j,
              licenseNo: !!j?.licenseNo ? j?.licenseNo : '---',
              ownerFullNameEn:
                j?.firstName + ' ' + j?.middleName + ' ' + j?.lastName,
              ownerFullNameMr:
                j?.firstNameMr + ' ' + j?.middleNameMr + ' ' + j?.lastNameMr,
              wardEn: ward.find((obj) => obj.id === j.wardKey)?.wardEn,
              wardMr: ward.find((obj) => obj.id === j.wardKey)?.wardMr,
              areaEn: area.find((obj) => obj.id === j.areaKey)?.areaEn,
              areaMr: area.find((obj) => obj.id === j.areaKey)?.areaMr,
              zoneEn: zone.find((obj) => obj.id === j.zoneKey)?.zoneEn,
              zoneMr: zone.find((obj) => obj.id === j.zoneKey)?.zoneMr,
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
  }, [area, zone, ward, petAnimal, petAnimalBreed])

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
      width: 150,
    },
    {
      headerClassName: 'cellColor',

      field: 'licenseNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='licenseNo' />,
      width: 150,
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

      field: language === 'en' ? 'petAnimalBreedEn' : 'petAnimalBreedMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petBreed' />,
      width: 150,
    },
    {
      headerClassName: 'cellColor',

      field: 'animalColour',
      headerAlign: 'center',
      headerName: <FormattedLabel id='animalColor' />,
      width: 120,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'ownerFullNameEn' : 'ownerFullNameMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='ownerName' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'status',
      headerAlign: 'center',
      headerName: <FormattedLabel id='status' />,
      width: 150,
    },

    {
      headerClassName: 'cellColor',

      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 85,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: '#1976d2' }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/opd/clerk/view`,
                  query: {
                    id: params.row.id,
                    // petAnimal: params.row.petAnimal
                  },
                })
              }}
            >
              <Visibility />
            </IconButton>
            {/* <IconButton
              style={{ color: "red" }}
              onClick={() => {
                deleteApplication(params.row.id);
              }}
            >
              <Delete />
            </IconButton> */}
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Treating sick and injured animal through OPD</title>
      </Head>
      <Breadcrumb />
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='opdHeading' />} />

        <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() => {
              router.push(
                `/veterinaryManagementSystem/transactions/opd/clerk/view`
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
              return 'orangeText'
            } else if (
              params.field === 'status' &&
              params.value == 'Awaiting Payment'
            ) {
              return 'greenText'
            } else if (
              params.field === 'status' &&
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
