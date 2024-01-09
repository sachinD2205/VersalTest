import {
  Box,
  Card,
  CssBaseline,
  IconButton,
  Typography,
  Drawer,
} from '@mui/material'
import React from 'react'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import DashboardTabs from '../DashboardTabs'
import { styled } from '@mui/material/styles'

let drawerWidth = 0

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    // padding: theme.spacing(3),
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
        height: '450px',
        // border:'3px solid red',
        // flexWrap:'wrap',
      }}
    >
      <CssBaseline />
      <Box
        style={{
          right: 0,
          position: 'absolute',
          top: '70%',
          backgroundColor: '#F2F2F2',
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          // edge="end"
          onClick={handleDrawerOpen}
          sx={{ width: '30px', height: '50px', borderRadius: 0 }}
        >
          <ArrowLeftIcon />
        </IconButton>
      </Box>
      <Main
        open={open}
        // sx={{
        //   marginLeft: '-5vw',
        //   marginRight: '0vw',
        //   marginTop: '-5vw',
        //   marginBottom: '2vw',
        // }}
      >
        <div
        // className="layout-content"
        >
          {titleProp === 'none' ? (
            <Card>{children}</Card>
          ) : (
            <Box>
              <Card style={{ backgroundColor: '#FAF7F7', padding: '10px' }}>
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
                    width: '68%',
                    // wordBreak:'break-word',
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

              <Box style={{ width: '91vw' }}>
                <DashboardTabs>{children}</DashboardTabs>
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
            // edge="end"
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
            // maxHeight: { xs: 233, md: 167 },
            // maxWidth: { xs: 350, md: 250 },
          }}
          alt="Pic"
          src="/mapImage.png"
        />
      </Drawer>
    </Box>
  )
}

export default CitizenDashboard
