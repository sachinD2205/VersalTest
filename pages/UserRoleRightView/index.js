import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Grid, Toolbar, Button, Box, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
// import {columns} from './utils';
import { toast } from 'react-toastify'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckIcon from '@mui/icons-material/Check'
import Loader from '../../containers/Layout/components/Loader'
// import { Box, IconButton, Tooltip } from "@mui/material";
import styles from '../../styles/[UserRoleRightView].module.css'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import { useSelector } from 'react-redux'
import urls from '../../URLS/urls'
// import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";

const UserRoleRightView = () => {
  const [adminUsers, setAdminUsers] = useState([])
  const [_adminUsers, _setAdminUsers] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [roleList, setRoleList] = useState({})
  const [filteredDepartment, setFilteredDepartment] = useState([])
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  const lang = useSelector((state) => state.user.lang)

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const router = useRouter()

  useEffect(() => {
    // getDepartmentName();
    getUsers()
    // getRoleName();
  }, [])

  const onUserClick = () => {
    console.log('sss')
  }

  const onEditUser = (params) => {
    console.log('fwerf', params.row)
  }

  const onInactiveUser = (value, _activeFlag) => {
    const body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log('body', body)
    axios
      .post(`${urls.CFCURL}/master/userRoleMenu/save`, body)
      .then((r) => {
        if (r.status == 200) {
          console.log('res', r)
          setIsActive(true)
        } else {
          message.error('Inactivate failed ! Please Try Again !')
        }
      })
      .catch((err) => {
        console.log(err)
        toast('Inactivate failed ! Please Try Again !', {
          type: 'error',
        })
      })
  }

  const columns = [
    {
      field: 'id',
      headerName: 'Sr No',
      // width: 100,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'user',
      headerName: 'User full name',
      // width: 350,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
    },
    // {
    //   field: "department",
    //   headerName: "Department",
    //   // width: 160,
    //   flex: 1,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: "designation",
    //   headerName: "Designation",
    //   // width: 160,
    //   flex: 1,
    //   disableColumnMenu: true,
    //   sortable: false,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: 'role',
      headerName: 'Role',
      // width: 160,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'menu',
      headerName: 'Menu',
      // width: 160,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'activeFlag',
      headerName: 'Status ',
      // width: 160,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'Action',
      headerName: 'Action',
      // width: '20%',
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        // if (hoveredRow === params.id) {
        return (
          <Box
            sx={{
              // backgroundColor: "whitesmoke",
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box>
              <Tooltip title='View'>
                <IconButton onClick={onUserClick}>
                  <VisibilityIcon style={{ fontSize: '20px' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <Tooltip title='Edit'>
                <IconButton
                  onClick={() => {
                    onEditUser(params)
                  }}
                >
                  <EditIcon style={{ fontSize: '20px' }} />
                </IconButton>
              </Tooltip>
            </Box>
            {/* <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
            </Box> */}

            {isActive ? (
              <Box>
                <Tooltip title='Inactive'>
                  <IconButton onClick={() => onInactiveUser(params.id, 'N')}>
                    <ToggleOnIcon style={{ color: 'green', fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box>
                <Tooltip title='Active'>
                  <IconButton onClick={() => onInactiveUser(params.id, 'Y')}>
                    <ToggleOffIcon style={{ color: 'red', fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        )
        // } else return null;
      },
    },
  ]

  const getUsers = () => {
    setLoading(true)
    axios
      .get(`${urls.CFCURL}/master/roleMenu/getAll`)
      .then((res) => {
        console.log('res getUser', res)
        setLoading(false)
        setAdminUsers(res.data.roleMenu)

        let result = res.data.roleMenu
        let _res = result.map((val, i) => {
          return {
            // activeFlag: val.activeFlag,
            srNo: val.id,
            application: val.application,
            id: val.id,
            menu: val.menu,
            user: val.user,
            // service: _serviceList[val.serviceId]
            // ? _serviceList[val.serviceId]
            // : "-",
            role: val.role,
            status: val.activeFlag === 'Y' ? 'Active' : 'Inactive',
          }
        })

        console.log('result', _res)

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res department', r)
          let departments = {}
          r.data.map((r) => (departments[r.id] = r.department))
          console.log('departments', departments)
          setDepartmentList(departments)
        }
      })
      .catch((err) => {
        // console.log("err", err);
      })
  }

  const getRoleName = () => {
    axios
      .get(`${urls.CFCURL}/master/role/getAll`)
      .then((r) => {
        if (r.status == 200) {
          let roles = {}
          r.data.map((r) => (roles[r.id] = r.name))
          setRoleList(roles)
        }
      })
      .catch((err) => {
        console.log('err getRole name', err)
      })
  }

  let aa =
    adminUsers &&
    adminUsers.map((ee) => {
      return ee.roleId
    })

  // let ans = roleList.map((val) => {
  //   return aa.map((rr) => {
  //     return rr == val.id && val.name;
  //   });
  // });

  //   setFilteredDepartment(ans);

  return (
    <>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loading && <Loader />}
      </Box>
      <Grid container>
        <Grid
          item
          xs={11}
          style={{ display: 'flex', justifyContent: 'end', padding: '10px' }}
        >
          <Button
            variant='contained'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => {
              router.push('/UserRoleRight')
            }}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Box style={{ height: 'auto', overflow: 'auto' }} px={'80px'}>
        <DataGrid
          sx={{
            overflowY: 'scroll',

            '& .MuiDataGrid-virtualScrollerContent': {},
            '& .MuiDataGrid-columnHeadersInner': {
              backgroundColor: '#556CD6',
              color: 'white',
            },

            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          density='compact'
          autoHeight={true}
          // rowHeight={50}
          pagination
          paginationMode='server'
          // loading={data.loading}
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getServiceChecklist(data.pageSize, _data)
          }}
          onPageSizeChange={(_data) => {
            console.log('222', _data)
            // updateData("page", 1);
            getServiceChecklist(_data, data.page)
          }}
        />
      </Box>
      {/* <DataGrid
          autoHeight
          hideFooterSelectedRowCount
          rows={
            adminUsers.length > 0
              ? adminUsers.map((val, id) => {
                  console.log("val", val);
                  return {
                    ...val,
                    activeFlag: val.activeFlag === "Y" ? "Active" : "Inactive",
                    // departmentId: departmentList[val.departmentId] ? departmentList[val.departmentId] : "-" ,
                    // roleId: roleList[val.roleId] ? roleList[val.roleId] : "-",
                  };
                })
              : ""
          }
          columns={columns}
          pageSize={6}
          rowsPerPageOptions={[5]}
        /> */}
    </>
  )
}

export default UserRoleRightView
