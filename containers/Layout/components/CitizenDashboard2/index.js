import {
  Box,
  Card,
  CssBaseline,
  IconButton,
  Typography,
  Drawer,
} from '@mui/material'
import React from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import DashboardTabs3 from '../DashboardTabs3'
import DashboardTabs2 from '../DashboardTabs2'


import { styled } from '@mui/material/styles'

let drawerWidth = 0

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
)

const CitizenDashboard = ({
  handleDrawerOpen,
  titleProp,
  subTitle,
  children,
  handleDrawerClose,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
      }}
    >
      <CssBaseline />
      <Main
        open={open}
      >
        <div>
          {titleProp === 'none' ? (
            <Card>{children}</Card>
          ) : (
            <Box>
              <Card style={{
                backgroundColor: 'white', padding: '10px',
                width: '91%',
                margin: 'auto',
                marginTop: '10px',
                boxShadow: 'box-shadow: 5px 4px 7px 4px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);'
              }}>
                <Typography
                  sx={{
                    color: '#3752CC',
                    fontWeight: 600,
                    fontSize: {
                      xs: 19,
                      lg: 19,
                      md: 15,
                      sm: 12,
                      xs: 10,
                    },
                  }}
                >
                  {titleProp}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: 12,
                      lg: 12,
                      md: 10,
                      sm: 10,
                      xs: 8,
                    },
                  }}
                >
                  {subTitle}
                </Typography>
              </Card>

              <Box style={{ width: '91vw', margin: 'auto' }}>
                <DashboardTabs2>{children}</DashboardTabs2>
              </Box>
            </Box>
          )}
        </div>
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            position: 'absolute',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box
          style={{
            left: 0,
            position: 'absolute',
            top: '70%',
            backgroundColor: '#F2F2F2',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClose}
            sx={{ width: '30px', height: '50px', borderRadius: 0 }}
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>

        <Box
          component="img"
          sx={{
            height: '100%',
            width: '100%',
          }}
          alt="Pic"
          src="/mapImage.png"
        />
      </Drawer>
    </Box>
  )
}

export default CitizenDashboard
