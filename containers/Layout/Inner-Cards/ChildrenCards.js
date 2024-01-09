// import { Card, Col, Row } from 'antd'
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import menu from "../menu";

import { Card, CardHeader, Grid, Tooltip } from "@mui/material";
import { Typography } from "antd";
import styles from "./[childrencards].module.css";

const ChildrenCards = ({ pageKey, title }) => {
  console.log("pagekey", pageKey, "titttle", title);
  // @ts-ignore
  const backEndApiMenu = useSelector((state) => {
    console.log('backEndApiMenu',state.user.menu)
    return state.user.menu;
  });

  const router = useRouter();
  const onClickHandler = (linkToForSubMenu) => {
    // setCurrent(e.key)
    router.push(linkToForSubMenu);
  };

  return (
    <Card className={styles.container}>
      <Grid container spacing={2}>
        {menu
          .filter((menuObj) => {
            return menuObj.key === "/" + pageKey;
          })

          .map((i) => {
            if (i.innerCards) {
              return i.innerCards.map((j) => {
                if (j.title === title) {
                  if (j.childrenCards) {
                    return j.childrenCards
                      .filter(
                        (Obj) =>
                          backEndApiMenu.BackendInnerCards.indexOf(Obj.code) >=
                          0
                      )

                      .map((k) => {
                        const linkToForMenu = `${k.clickTo}`;
                        const Icon = k.icon;
                        return (
                          <>
                        
                          <Grid item xs={3} className={styles.innerGrid}>
                            <Tooltip title={k.title}>
                              <Card
                                className={styles.card}
                                sx={{
                                  ":hover": {
                                    backgroundColor: "#2162DF",
                                    color: "white",
                                  },
                                }}
                                onClick={() => {
                                  onClickHandler(linkToForMenu);
                                }}
                              >
                                {/* <Typography>{k.title}</Typography> */}
                                {/* <IconButton aria-label="settings">
                                <Icon />
                              </IconButton> */}
                                <CardHeader
                                  // action={
                                  //   <IconButton aria-label="settings">
                                  //     <Icon />
                                  //   </IconButton>
                                  // }
                                  titleTypographyProps={{
                                    variant: "body1",
                                    textAlign: "center",
                                  }}
                                  title={k.title}
                                />
                              </Card>
                            </Tooltip>
                          </Grid>
                          </>
                        );
                      });
                  }
                }
              });
            }
          })}
      </Grid>
    </Card>

    // <Card>
    //   <div className='site-card-wrapper'>
    //     <Row gutter={8}>
    //       {menu
    //         .filter((menuObj) => {
    //           return menuObj.key === '/' + pageKey
    //         })

    //         .map((i) => {
    //           if (i.innerCards) {
    //             return i.innerCards.map((j) => {
    //               console.log('title : ', j.title)
    //               console.log('title prop value : ', title)
    //               if (j.title === title) {
    //                 if (j.childrenCards) {
    //                   return j.childrenCards
    //                     .filter(
    //                       (Obj) =>
    //                         backEndApiMenu.BackendInnerCards.indexOf(
    //                           Obj.code
    //                         ) >= 0
    //                     )

    //                     .map((k) => {
    //                       // console.log('Final Data: ', k)
    //                       const linkToForMenu = `${k.clickTo}`
    //                       const Icon = k.icon
    //                       return (
    //                         <>
    //                           <Col xl={8} lg={8} md={8} xs={24}>
    //                             <Card
    //                               onClick={() => {
    //                                 onClickHandler(linkToForMenu)
    //                               }}
    //                               style={{
    //                                 height: 60,
    //                                 color: 'rgb(32, 159, 238)',
    //                                 backgroundColor: 'white',
    //                                 marginBottom: 10,
    //                               }}
    //                               hoverable
    //                               bordered={true}
    //                             >
    //                               <div style={{ textAlign: 'start' }}>
    //                                 <b>{k.title}</b>
    //                                 <Icon
    //                                   style={{
    //                                     color: 'black',
    //                                     fontSize: '25px',
    //                                     float: 'right',
    //                                   }}
    //                                 />
    //                               </div>
    //                             </Card>
    //                           </Col>
    //                         </>
    //                       )
    //                     })
    //                 }
    //               }
    //             })
    //           }
    //         })}
    //     </Row>
    //   </div>
    // </Card>
  );
};

export default ChildrenCards;
