import React, { useEffect, useState } from "react";
import { Card, PageHeader } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import menu from "../menu";

const LayoutPageHeader = () => {
  // @ts-ignore
  //const menu = useSelector((state) => state.user.user)
  const menu2 = useSelector((state) => {
    return state.user.usersCitizenDashboardData;
  });
  const router = useRouter();
  const path = router.pathname;

  const onBack = () => {
    const urlLength = router.asPath.split("/").length;
    const urlArray = router.asPath.split("/");
    let backUrl = "";
    if (urlLength > 2) {
      for (let i = 0; i < urlLength - 1; i++) {
        backUrl += urlArray[i] + "/";
      }
      console.log("Final URL: ", backUrl);
      router.push(`${backUrl}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div>
        {menu.map((i) => {
          if (i.innerCards) {
            return i.innerCards.map((j) => {
              if (j.clickTo === path) {
                return (
                  <PageHeader
                    ghost={false}
                    className="site-page-header"
                    onBack={onBack}
                    title={j.title}
                    extra={
                      <>
                        <p style={{ marginBottom: "0em" }}>{j.breadcrumName}</p>
                      </>
                    }
                  />
                );
              }
            });
          }
        })}
      </div>
      {menu.map((i) => {
        if (i.innerCards) {
          return i.innerCards.map((j) => {
            if (j.childrenCards) {
              return j.childrenCards.map((k) => {
                if (k.clickTo === path) {
                  return (
                    <PageHeader
                      ghost={false}
                      className="site-page-header"
                      onBack={onBack}
                      title={k.title}
                      extra={
                        <>
                          <p style={{ marginBottom: "0em" }}>
                            {k.breadcrumName}
                          </p>
                        </>
                      }
                    />
                  );
                }
              });
            }
          });
        }
      })}
    </>
  );
};

export default LayoutPageHeader;
