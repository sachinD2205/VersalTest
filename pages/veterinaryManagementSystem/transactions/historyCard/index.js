import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from './historyCard.module.css'
import router from 'next/router'

import { Button, IconButton, Paper } from '@mui/material'
import Title from '../../../../containers/VMS_ReusableComponents/Title'
import Breadcrumb from '../../../../components/common/BreadcrumbComponent'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { Add, Visibility } from '@mui/icons-material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import urls from '../../../../URLS/urls'
import { useSelector } from 'react-redux'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [table, setTable] = useState([])

  const [speciesName, setSpeciesName] = useState([])

  useEffect(() => {
    axios
      .get(`${urls.VMS}/mstZooAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setSpeciesName(
          res.data?.mstZooAnimalList.map((obj) => ({
            id: obj?.id,
            animalNameEn: obj?.animalNameEn,
            animalNameMr: obj?.animalNameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    console.log('data111: ', speciesName, table)

    axios
      .get(`${urls.VMS}/trnAnimalHistoryCard/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setTable(
          res.data?.trnAnimalHistoryCardDao?.map((j, i) => ({
            srNo: i + 1,
            ...j,
            speciesNameEn: speciesName?.find((obj) => obj.id == j?.speciesKey)
              ?.animalNameEn,
            speciesNameMr: speciesName?.find((obj) => obj.id == j?.speciesKey)
              ?.animalNameEn,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [speciesName])

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      width: 60,
    },
    {
      headerClassName: 'cellColor',

      field: 'dateAcquiredOrReceived',
      headerName: <FormattedLabel id='dateAcquiredOrReceived' />,
      headerAlign: 'center',

      minWidth: 200,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'speciesNameEn' : 'speciesNameMr',
      headerName: <FormattedLabel id='speciesName' />,
      headerAlign: 'center',

      minWidth: 125,
    },
    {
      headerClassName: 'cellColor',

      field: 'houseName',
      headerName: <FormattedLabel id='houseName' />,
      headerAlign: 'center',

      minWidth: 150,
      flex: 1,
    },

    {
      headerClassName: 'cellColor',

      field: 'age',
      headerName: <FormattedLabel id='animalAge' />,
      headerAlign: 'center',

      minWidth: 175,
    },
    {
      headerClassName: 'cellColor',

      field: 'sex',
      headerName: <FormattedLabel id='sex' />,
      headerAlign: 'center',

      minWidth: 125,
    },
    {
      headerClassName: 'cellColor',

      field: 'animalStockOrRegisterNo',
      headerName: <FormattedLabel id='animalStockOrRegisterNo' />,
      headerAlign: 'center',

      width: 200,
    },

    {
      headerClassName: 'cellColor',

      field: 'action',
      headerAlign: 'center',
      align: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: '#1976d2',
              }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/historyCard/view`,
                  query: { id: params.row?.id },
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
        <title>Animal History Card</title>
      </Head>
      <Breadcrumb />
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='animalHistoryCard' />} />
        <div className={styles.right}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() =>
              router.push(
                '/veterinaryManagementSystem/transactions/historyCard/view'
              )
            }
          >
            <FormattedLabel id='add' />
          </Button>
          {/* <Button
            variant='contained'
            endIcon={<Visibility />}
            onClick={() =>
              router.push(
                '/veterinaryManagementSystem/transactions/historyCard/view?id=4'
              )
            }
          >
            <FormattedLabel id='view' />
          </Button> */}
        </div>

        <DataGrid
          autoHeight
          sx={{
            marginTop: '10px',
            width: '100%',

            '& .cellColor': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
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
          //   loading={loader}
        />
      </Paper>
    </>
  )
}

export default Index
