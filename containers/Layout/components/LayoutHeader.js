import React, { useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import styles from "./[header].module.css";
import { useSelector } from "react-redux";
import menu from "../menu";
const LayoutHeader = () => {
  const router = useRouter();
  // @ts-ignore
  const backEndApiMenu = useSelector((state) => state.user.menu);
  const [current, setCurrent] = useState("mail");
  const onClickHandler = (e, linkToForSubMenu) => {
    setCurrent(e.key);
    router.push(linkToForSubMenu);
  };
  return (
    <>
      <Menu
        // style={{
        //   color: 'white',
        //   width: '100%',
        //   background: 'rgb(32, 159, 238)',
        // }}
        selectedKeys={[current]}
        mode="horizontal"
        // items={menu}
        //theme='dark'
        className={styles.test}
      >
        {menu
          .filter(
            (outObj) => backEndApiMenu.BackendMenu?.indexOf(outObj.code) >= 0
          )
          .map((i) => {
            // const Icon = i.icon
            const linkToForMenu = `${i.key}`;
            if (i.children) {
              return (
                <Menu.SubMenu
                  // style={{
                  //   color: 'black',
                  // }}
                  title={i.label}
                  key={i.label}
                  // icon={<Icon />}
                >
                  {i.children
                    .filter(
                      (inObj) =>
                        backEndApiMenu.BackendMenu.indexOf(inObj.code) >= 0
                    )
                    .map((j) => {
                      let keyForSubMenu = j.key;
                      // const Icon2 = j.icon

                      const linkToForSubMenu = `${i.path}${keyForSubMenu}`;
                      return (
                        <Menu.Item className={styles.test} key={i.key}>
                          <a
                            style={{ color: "black" }}
                            onClick={() =>
                              onClickHandler(i.key, linkToForSubMenu)
                            }
                          >
                            {/* <Icon2 /> */}
                            <b
                            //</a>style={{ color: 'black' }}
                            >
                              {j.label}
                            </b>
                          </a>
                        </Menu.Item>
                      );
                    })}
                </Menu.SubMenu>
              );
            } else {
              // const Icon1 = i.icon
              return (
                <Menu.Item
                  className={styles.test}
                  // style={{ color: 'white' }}
                  key={i.key}
                >
                  <a
                    style={{ color: "rgb(10, 180, 242)" }}
                    onClick={() => onClickHandler(i.key, linkToForMenu)}
                  >
                    {/* <Icon1 /> */}
                    <b>{i.label}</b>
                  </a>
                </Menu.Item>
              );
            }
          })}
      </Menu>
      {/* </Header> */}
    </>
  );
};

export default LayoutHeader;
