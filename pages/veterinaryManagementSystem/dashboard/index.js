import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from './vmsDashboard.module.css'

import {
  petLicenseColumns,
  renewedPetLicenseColumns,
  opdColumns,
  ipdColumns,
} from '../../../containers/VMS_ReusableComponents/dashboard/columns'
import {
  petLicenseTiles,
  renewedPetLicenseTiles,
  opdTiles,
  ipdTiles,
} from '../../../containers/VMS_ReusableComponents/dashboard/tiles'
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material'

import { useSelector } from 'react-redux'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import Tiles from '../../../containers/VMS_ReusableComponents/Tiles'
import URLs from '../../../URLS/urls'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [tiles, setTiles] = useState([])
  // const [area, setArea] = useState([{ id: 1, areaEn: '', areaMr: '' }])
  // const [zone, setZone] = useState([{ id: 1, zoneEn: '', zoneMr: '' }])
  // const [ward, setWard] = useState([{ id: 1, wardEn: '', wardMr: '' }])
  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    {
      id: 1,
      petNameEn: '',
      petNameMr: '',
    },
  ])
  const [petBreeds, setPetBreeds] = useState([
    { id: 1, breedNameEn: '', breedNameMr: '' },
  ])

  const [petLicenseData, setPetLicenseData] = useState([])
  const [renewedPetLicenseData, setRenewedPetLicenseData] = useState([])
  const [opdData, setOpdData] = useState([])
  const [ipdData, setIpdData] = useState([])

  const [rowData, setRowData] = useState([])
  const [columnData, setColumnData] = useState([])

  const [dashboardType, setDashboardType] = useState('petLicense')
  const [petAnimalKey, setPetAnimalKey] = useState(0)

  useEffect(() => {
    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetAnimalDropDown(
          res.data.mstPetAnimalList.map((j) => ({
            id: j.id,
            petNameEn: j.nameEn,
            petNameMr: j.nameMr,
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
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    //Get Pet License Data
    axios
      .get(`${URLs.VMS}/trnPetLicence/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetLicenseData(
          res.data.trnPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            petAnimalKey: j.petAnimalKey,
            petLicenceNo: j.petLicenceNo ?? 'Not Generated Yet',
            // ownerName: j.ownerName,
            ownerName: j?.firstName + ' ' + j?.middleName + ' ' + j?.lastName,
            ownerNameMr:
              j?.firstNameMr + ' ' + j?.middleNameMr + ' ' + j?.lastNameMr,
            mobileNo: j.ownerMobileNo,
            breedEn: petBreeds.find((obj) => obj.id == j.animalBreedKey)
              ?.breedNameEn,
            breedMr: petBreeds.find((obj) => obj.id == j.animalBreedKey)
              ?.breedNameMr,
            status: j.status,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Renewed Pet License Data
    axios
      .get(`${URLs.VMS}/trnRenewalPetLicence/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setRenewedPetLicenseData(
          res.data.trnRenewalPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            petAnimalKey: j.petAnimalKey,
            petLicenceNo: j.petLicenceNo ?? 'Not Generated Yet',
            // ownerName: j.ownerName,
            ownerName: j?.firstName + ' ' + j?.middleName + ' ' + j?.lastName,
            ownerNameMr:
              j?.firstNameMr + ' ' + j?.middleNameMr + ' ' + j?.lastNameMr,

            mobileNo: j.ownerMobileNo,
            breedEn: petBreeds.find((obj) => obj.id == j.animalBreedKey)
              ?.breedNameEn,
            breedMr: petBreeds.find((obj) => obj.id == j.animalBreedKey)
              ?.breedNameMr,
            status: j.status,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get OPD Data
    axios
      .get(`${URLs.VMS}/trnAnimalTreatment/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setOpdData(
          res.data.trnAnimalTreatmentList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            petAnimalKey: j.animalName,
            petLicenceNo: j.petLicenceNo ?? 'No License',
            // ownerName: j.ownerFullName,
            ownerName: j?.firstName + ' ' + j?.middleName + ' ' + j?.lastName,
            ownerNameMr:
              j?.firstNameMr + ' ' + j?.middleNameMr + ' ' + j?.lastNameMr,

            mobileNo: j.mobileNumber,
            breedEn: petBreeds.find((obj) => obj.id == j.animalSpeciesKey)
              ?.breedNameEn,
            breedMr: petBreeds.find((obj) => obj.id == j.animalSpeciesKey)
              ?.breedNameMr,
            status: j.status,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get IPD Data
    axios
      .get(`${URLs.VMS}/trnAnimalTreatmentIpd/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setIpdData(
          res.data.trnAnimalTreatmentIpdList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            petAnimalKey: j.animalName,
            casePaperNo: j.casePaperNo,
            kennelNo: j.kennelNo,
            petLicenceNo: j.petLicenceNo ?? 'No License',
            teamOrVolunteerName:
              j.ownerFullName != '' && j.ownerFullName != null
                ? j.ownerFullName
                : j.volunteerName,
            complainerName: j.complainerName,
            mobileNo: j.mobileNumber,
            breedEn: petBreeds.find((obj) => obj.id == j.animalSpeciesKey)
              ?.breedNameEn,
            breedMr: petBreeds.find((obj) => obj.id == j.animalSpeciesKey)
              ?.breedNameMr,
            status: j.status,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [petBreeds])

  useEffect(() => {
    setPetAnimalKey(petAnimalDropDown[0]?.id)
  }, [petAnimalDropDown])

  useEffect(() => {
    if (dashboardType == 'petLicense') {
      // @ts-ignore
      setTiles(
        // @ts-ignore
        petLicenseTiles.map((j) => ({
          ...j,
          count: petLicenseData.filter(
            (data) =>
              // @ts-ignore
              j.status.includes(data.status) &&
              // @ts-ignore
              data.petAnimalKey == petAnimalKey
          ).length,
        }))
      )
      // @ts-ignore
      setColumnData(petLicenseColumns)
      setRowData(
        // @ts-ignore
        petLicenseData
          // @ts-ignore
          .filter((j) => j.petAnimalKey == petAnimalKey)
          // @ts-ignore
          .map((j, i) => ({ ...j, srNo: i + 1 }))
      )
    } else if (dashboardType == 'renewedLicense') {
      // @ts-ignore
      setTiles(
        // @ts-ignore
        renewedPetLicenseTiles.map((j) => ({
          ...j,
          count: renewedPetLicenseData.filter(
            (data) =>
              // @ts-ignore
              j.status.includes(data.status) &&
              // @ts-ignore
              data.petAnimalKey == petAnimalKey
          ).length,
        }))
      )
      // @ts-ignore
      setColumnData(renewedPetLicenseColumns)

      setRowData(
        // @ts-ignore
        renewedPetLicenseData
          // @ts-ignore
          .filter((j) => j.petAnimalKey == petAnimalKey)
          // @ts-ignore
          .map((j, i) => ({ ...j, srNo: i + 1 }))
      )
    } else if (dashboardType == 'opdRegistrations') {
      // @ts-ignore
      // setTiles(opdTiles)
      setTiles(
        // @ts-ignore
        opdTiles.map((j) => ({
          ...j,
          count: opdData.filter(
            (data) =>
              // @ts-ignore
              j.status.includes(data.status) &&
              // @ts-ignore
              data.petAnimalKey == petAnimalKey
          ).length,
        }))
      )
      // @ts-ignore
      setColumnData(opdColumns)

      setRowData(
        // @ts-ignore
        opdData
          // @ts-ignore
          .filter((j) => j.petAnimalKey == petAnimalKey)
          // @ts-ignore
          .map((j, i) => ({ ...j, srNo: i + 1 }))
      )
    } else if (dashboardType == 'ipdRegistrations') {
      // setTiles(ipdTiles)
      // @ts-ignore
      setTiles(
        // @ts-ignore
        ipdTiles.map((j) => ({
          ...j,
          count: ipdData.filter(
            (data) =>
              // @ts-ignore
              j.status.includes(data.status) &&
              // @ts-ignore
              data.petAnimalKey == petAnimalKey
          ).length,
        }))
      )
      // @ts-ignore
      setColumnData(ipdColumns)

      setRowData(
        // @ts-ignore
        ipdData
          // @ts-ignore
          .filter((j) => j.petAnimalKey == petAnimalKey)
          // @ts-ignore
          .map((j, i) => ({ ...j, srNo: i + 1 }))
      )
    }
  }, [
    dashboardType,
    petAnimalKey,
    petLicenseData,
    renewedPetLicenseData,
    opdData,
    ipdData,
  ])

  return (
    <>
      <Head>
        <title>VMS Dashboard</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.centerDiv}>
          <h2
            style={{
              marginTop: 0,
              marginBottom: 25,
              color: 'red',
              textTransform: 'capitalize',
              fontWeight: 'bold',
            }}
          >
            <FormattedLabel id='vms' />
          </h2>
        </div>

        <div className={styles.centerDiv}>
          <FormControl variant='standard'>
            <InputLabel>
              <FormattedLabel id='petAnimal' />
            </InputLabel>
            <Select
              sx={{ width: '180px' }}
              value={petAnimalKey}
              onChange={(value) => setPetAnimalKey(Number(value.target.value))}
            >
              {petAnimalDropDown &&
                petAnimalDropDown.map((value, index) => (
                  <MenuItem
                    key={index}
                    value={
                      //@ts-ignore
                      value.id
                    }
                  >
                    {language == 'en'
                      ? //@ts-ignore
                        value.petNameEn
                      : // @ts-ignore
                        value?.petNameMr}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <FormControl className={styles.centerDiv}>
          <RadioGroup
            className={styles.radioDiv}
            name='dashboard'
            defaultValue='petLicense'
            onChange={(e) => {
              console.log(e.target.value)
              setDashboardType(e.target.value)
            }}
            row
          >
            {[
              'petLicense',
              'renewedLicense',
              'opdRegistrations',
              'ipdRegistrations',
            ].map((j) => (
              <FormControlLabel
                value={j}
                control={<Radio />}
                label={<FormattedLabel id={j} />}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <div className={styles.centerDiv}>
          <label className={styles.title}>
            <FormattedLabel id={dashboardType} />
          </label>
        </div>
        <Tiles
          tiles={tiles}
          tableData={
            dashboardType == 'petLicense'
              ? petLicenseData
                  // @ts-ignore
                  .filter((j) => j.petAnimalKey == petAnimalKey)
                  // @ts-ignore
                  .map((j, i) => ({ ...j, srNo: i + 1 }))
              : dashboardType == 'renewedLicense'
              ? renewedPetLicenseData
                  // @ts-ignore
                  .filter((j) => j.petAnimalKey == petAnimalKey)
                  // @ts-ignore
                  .map((j, i) => ({ ...j, srNo: i + 1 }))
              : dashboardType == 'opdRegistrations'
              ? opdData
                  // @ts-ignore
                  .filter((j) => j.petAnimalKey == petAnimalKey)
                  // @ts-ignore
                  .map((j, i) => ({ ...j, srNo: i + 1 }))
              : dashboardType == 'ipdRegistrations'
              ? ipdData
                  // @ts-ignore
                  .filter((j) => j.petAnimalKey == petAnimalKey)
                  // @ts-ignore
                  .map((j, i) => ({ ...j, srNo: i + 1 }))
              : []
          }
          updater={setRowData}
        />
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
          rows={rowData}
          //@ts-ignore
          columns={columnData}
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
