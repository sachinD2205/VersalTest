// import { Card, Col, Row } from "antd";
import { useRouter } from "next/router"
import React from "react"
import { useSelector } from "react-redux"
import menu from "../menu"
import IconButton from "@mui/material/IconButton"

import styles from "./[innercards].module.css"
import { Card, CardHeader, Grid, Tooltip, Box, Typography } from "@mui/material"

const InnerCards = ({ pageKey }) => {
  // @ts-ignore
  const backEndApiMenu = useSelector((state) => state.user.menu)

  const router = useRouter()
  const onClickHandler = (pageMode, linkToForSubMenu) => {
    // setCurrent(e.key)
    router.push({
      pathname: `${linkToForSubMenu}`,
      query: {
        pageMode: `${pageMode}`,
      },
    })
  }

  return (
    <div>
      <div className="site-card-wrapper">
        <Box className={styles.container}>
          <Grid container>
            {menu
              .filter((menuObj) => {
                return menuObj.key === "/" + pageKey
              })
              .map((i) => {
                if (i.innerCards) {
                  return i.innerCards
                    .filter(
                      (Obj) =>
                        backEndApiMenu.BackendInnerCards.indexOf(Obj.code) >= 0
                    )
                    .map((j) => {
                      let pageMode
                      const linkToForMenu = `${j.clickTo}`
                      const Icon = j.icon
                      if (j.pageMode) {
                        pageMode = j.pageMode
                      }
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <Grid>
                          {console.log("j", j)}
                          <Tooltip title={j.title}>
                            <Box
                              // className={styles.innerCard}
                              onClick={() => {
                                onClickHandler(pageMode, linkToForMenu)
                              }}
                            >
                              <IconButton
                                color="inherit"
                                aria-label="open drawer"
                              >
                                <j.icon style={{ fontSize: 65 }} />
                              </IconButton>
                              <Typography
                                sx={{
                                  textAlign: "center",
                                  textTransform: "none",
                                  fontSize: {
                                    xs: 17,
                                    lg: 15,
                                    md: 13,
                                    sm: 12,
                                    xs: 10,
                                  },
                                }}
                              >
                                {j.title}
                              </Typography>
                              <Typography
                                sx={{
                                  textTransform: "none",
                                  fontSize: {
                                    xs: 15,
                                    lg: 13,
                                    md: 12,
                                    sm: 10,
                                    xs: 8,
                                  },
                                }}
                              >
                                {j.content}
                              </Typography>
                            </Box>

                            {/* <Card
                              className={styles.innerCard}
                              onClick={() => {
                                onClickHandler(pageMode, linkToForMenu);
                              }}
                            >
                              <CardHeader
                                titleTypographyProps={{
                                  textAlign: "center",
                                  fontSize: {
                                    xs: 17,
                                    lg: 15,
                                    md: 13,
                                    sm: 12,
                                    xs: 10,
                                  },
                                }}
                                title={j.title}
                              />
                            </Card> */}
                          </Tooltip>
                        </Grid>
                        /* <Col xl={8} lg={8} md={8} xs={24}>
                          <Card
                            onClick={() => {
                              onClickHandler(pageMode, linkToForMenu)
                            }}
                            style={{
                              height: 200,
                              color: 'rgb(32, 159, 238)',
                              backgroundColor: 'white',
                              marginBottom: 10,
                            }}
                            title={
                              <div style={{ textAlign: 'center' }}>
                                {j.title}
                              </div>
                            }
                            hoverable
                            bordered={true}
                          >
                            {
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Icon
                                  style={{
                                    color: 'rgb(32, 159, 238)',
                                    fontSize: '50px',
                                    paddingTop: 10,
                                  }}
                                />
                              </div>
                            }
                          </Card>
                        </Col> */
                      )
                    })
                }
              })}
          </Grid>
        </Box>
      </div>
    </div>
  )
}

export default InnerCards
