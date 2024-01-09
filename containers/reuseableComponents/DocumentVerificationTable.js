import { Button, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FormattedLabel from './FormattedLabel'
import URLs from '../../URLS/urls'

const Index = (props) => {
  const [table, setTable] = useState([])
  const [runAgain, setRunAgain] = useState(false)

  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  useEffect(() => {
    setRunAgain(false)
    console.log('Props.rows: ', props.rows)
    setTable(props.rows)
  }, [runAgain])

  useEffect(() => {
    console.log('props', props)
    props.rows.forEach((obj) => {
      obj.status = obj.status === 'verified' ? 'verified' : ''
    })
  }, [])

  const columns = [
    {
      headerClassName: 'cellColor',
      field: language === 'en' ? 'documentNameEn' : 'documentNameMr',
      headerAlign: 'center',
      align: 'center',
      headerName: <FormattedLabel id='fileName' />,
      flex: 1,
      sortable: false,
    },

    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'upload',
      headerName: <FormattedLabel id='upload' />,
      flex: 0.6,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <UploadButton rowData={props.rows[params.row.srNo - 1]} />
          </>
        )
      },
    },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      // @ts-ignore
      headerName: <FormattedLabel id='actions' />,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {props.rows[params.row.srNo - 1]['status'] === 'verified' && (
              <>
                <span
                  style={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 15,
                  }}
                >
                  <FormattedLabel id='verified' />
                </span>
              </>
            )}
            {props.rows[params.row.srNo - 1]['status'] !== 'verified' && (
              <>
                <Select
                  variant='standard'
                  sx={{
                    width: 120,
                    textAlign: 'center',
                  }}
                  disabled={
                    props.rows[params.row.srNo - 1]['status'] === 'verified'
                  }
                  defaultValue={
                    props.rows[params.row.srNo - 1]['status'] === 'verified'
                      ? 'verified'
                      : ''
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      const actionUpdater = props.rows
                      actionUpdater[params.row.srNo - 1]['status'] =
                        e.target.value
                      console.log('Filee: ', actionUpdater)
                      props.rowUpdation(actionUpdater)
                    }
                  }}
                >
                  <MenuItem key={2} value={'verify'}>
                    {language === 'en' ? 'Verify' : 'तपासले'}
                  </MenuItem>
                  <MenuItem key={3} value={'rejected'}>
                    {language === 'en' ? 'Reject' : 'नाकारा'}
                  </MenuItem>
                </Select>
              </>
            )}
          </>
        )
      },
    },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      field: 'remark',
      headerName: <FormattedLabel id='remark' />,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {/* <TextareaAutosize
              // aria-label='minimum height'
              maxRows={2}
              // placeholder='Minimum 3 rows'
              style={{ width: 200 }}
            /> */}
            <TextField
              variant='standard'
              sx={{ width: '100%' }}
              defaultValue={props.rows[params.row.srNo - 1]['remark'] ?? ''}
              disabled={
                props.rows[params.row.srNo - 1]['status'] === 'verified'
              }
              onKeyDown={(e) => {
                e.stopPropagation()
              }}
              onChange={(e) => {
                if (e.target.value) {
                  const actionUpdater = props.rows
                  actionUpdater[params.row.srNo - 1]['remark'] = e.target.value
                  props.rowUpdation(actionUpdater)
                  console.log('Remark Updated: ', props.rows)
                }
              }}
            />
          </>
        )
      },
    },
  ]

  return (
    <div>
      <DataGrid
        sx={{
          marginTop: '5vh',
          marginBottom: '3vh',
          width: '80vw',
          '& .cellColor': {
            backgroundColor: '#1976d2',
            color: 'white',
          },
        }}
        rows={table}
        // @ts-ignore
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        hideFooter
        disableSelectionOnClick
        disableColumnMenu
      />
      {props.rows.find((obj) => obj.status !== 'verified') && (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Button variant='contained' onClick={() => props.save()}>
            <FormattedLabel id='save' />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Index

export const UploadButton = (props) => {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '5px 5px',
            width: 'max-content',
            cursor: 'pointer',
          }}
        >
          {!props?.rowData?.filePath && (
            <>
              <span
                style={{
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: 12,
                  // color: '#1976d2',
                }}
              >
                {<FormattedLabel id='noFileFound' />}
              </span>
            </>
          )}
          {props?.rowData?.filePath && (
            <>
              <Button
                variant='contained'
                onClick={() => {
                  window.open(
                    `${URLs.CFCURL}/file/preview?filePath=${props.rowData.filePath}`,
                    '_blank'
                  )
                }}
              >
                {<FormattedLabel id='preview' />}
              </Button>
            </>
          )}
        </label>
      </div>
    </>
  )
}
