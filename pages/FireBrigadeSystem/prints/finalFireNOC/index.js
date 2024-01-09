import React, { useEffect, useRef, useState } from "react";
import styles from "./view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card, Grid } from "@mui/material";
import urls from "../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const userToken = useGetToken();

  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("router.query", router.query);
    if (router.query.id && router.query.serviceId) {
      axios
        .get(
          `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${router.query.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("r.data", r.data);
          setData(r.data);
        });
    }
  }, []);

  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
      </div>

      {/* Button for Print and Exit */}
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <Card>
          <div className={styles.reportContainer}>
            <table className={styles.headerTable}>
              <td>
                <tr>
                  <img
                    src="/Amrutmohtsavlogo.jpg"
                    alt=""
                    height={80}
                    width={80}
                  />
                </tr>
              </td>
              <td>
                <tr style={{ justifyContent: "center", display: "flex" }}>
                  <img src="/logo.png" alt="" height={80} width={80} />
                </tr>
                <tr
                  style={{
                    height: "1px",
                    fontSize: 19,
                    textAlign: "center",
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  <b>PIMPRI CHINCHWAD MUNICIPAL CORPORATION, PIMPRI -18</b>
                  <br></br>
                </tr>
              </td>
              <td>
                <tr>
                  <img
                    src="/rts_servicelogo.png"
                    alt=""
                    height={80}
                    width={80}
                  />
                </tr>
              </td>
            </table>
            <p
              style={{
                justifyContent: "center",
                display: "flex",
                marginBottom: "5px",
                fontSize: "18px",
              }}
            >
              <b>FIRE DEPARTMENT</b>
              <br></br>
            </p>
            <table className={styles.headerTable1}>
              <tr>
                <td
                  style={{
                    marginRight: "200px",
                    // background: "red",
                    // marginLeft: "200px",
                  }}
                >
                  <td
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",

                      // marginRight: "200px",
                    }}
                  >
                    File No:-{" "}
                    <input
                      style={{
                        width: "100px",
                      }}
                    ></input>
                    <span></span>
                  </td>
                </td>
                <td
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  <p
                    style={{
                      marginLeft: "20px",
                    }}
                  >
                    O.W.No:- Fire/01/5PC/WS/
                    <input
                      style={{
                        width: "80px",
                        border: "0px solid white",
                      }}
                    ></input>
                    /2022
                  </p>
                </td>
                <td
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  {/* <h3> */}
                  <p
                    style={{
                      // background: "red ",
                      marginLeft: "50px",
                    }}
                  >
                    Date:-{" "}
                    <input
                      style={{
                        width: "60px",
                        border: "0px solid white",
                      }}
                    ></input>
                    /
                    <input
                      style={{
                        width: "60px",
                        border: "0px solid white",
                      }}
                    ></input>
                    /2022
                  </p>
                  {/* </h3> */}
                </td>
              </tr>
            </table>

            <div className={styles.reportContent}>
              <h1>
                ................................................................................................................................
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "2%",
                }}
              >
                <td
                  style={{
                    fontSize: 16,
                    marginTop: "-15px",
                  }}
                >
                  <u>
                    <b>FINAL FIRE NO OBJECTION CERTIFICATE FOR BUILDING</b>
                  </u>
                </td>
                <table className={styles.Table1}>
                  <td
                    style={{
                      fontSize: 12,
                      width: "80%",
                    }}
                  >
                    <h3>Token No:-103322230010950</h3>
                  </td>
                  <td
                    style={{
                      fontSize: 12,
                      width: "20%",
                    }}
                  >
                    <h3>Token Dt:- 21/10/2022</h3>
                  </td>
                </table>
              </div>
              <p
                style={{
                  fontSize: 12,
                  textAlign: "justify",
                  marginTop: "2%",
                }}
              >
                With reference to the application <b>Dt.21/10/2022 </b>of the
                under mentioned applicant, technical site inspection had been
                carried out by the Sub Officer of the department in accordance
                with the submitted plan copies and documents to this office.
              </p>
              <p
                style={{
                  fontSize: 12,
                  marginTop: "-2px",
                }}
              >
                Final Fire No Objection Certificate is being herewith issued
                under Unified Development Control Rules of State Govt. order No.
                TPS1818/Pra.
                Kra.236/18/Viyo.Prayo./Cl.27(1cc)(g)&Cl.20(4),UD-13, Dt -
                02/12/2020, NBC 2016- Part IV, and under Sec 3(2) of Maharashtra
                Fire & Life Safety Act 2006 & Rules 2009, at the under mentioned
                site, subject to compliance of the following conditions.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              ></div>
              <h3>
                Plot Area (Permission FSI)9152.38 Sq.Mtrs.(Incl.Ancillary Area){" "}
              </h3>
              <table
                style={{
                  // height: "10x",
                  // width: "10%",
                  height: "10%",
                  // background: "red",
                }}
              >
                <thead>
                  <tr
                    style={{
                      // height: "200px",
                      height: "10px",
                    }}
                  >
                    <th
                      style={{
                        fontSize: 12,
                        width: "2%",
                      }}
                    >
                      Bidg. Nos.
                    </th>
                    <th
                      style={{
                        fontSize: 12,
                      }}
                    >
                      Height From G.L up to Slab(in Mtrs)
                    </th>
                    <th
                      style={{
                        fontSize: 12,
                      }}
                    >
                      No. of Floors
                    </th>
                    <th
                      style={{
                        fontSize: 12,
                      }}
                    >
                      Built up Area (Sq.mt)
                    </th>
                    <th
                      style={{
                        fontSize: 12,
                      }}
                    >
                      Gross Built up Area (Sq.mt)
                    </th>
                    <th
                      style={{
                        fontSize: 12,
                      }}
                    >
                      Occupancy Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{
                      // height: "200px",
                      height: "10px",
                    }}
                  >
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      One
                    </td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      42.20
                    </td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      GP+Pod.Prk+12
                    </td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      9148.91
                    </td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      10903.36
                    </td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      Resi.
                    </td>
                  </tr>
                </tbody>
              </table>
              <br></br>
              <p>
                This Final NOC is issued as per layout and building plans
                sanctioned , Fire Supplier's Csertificate from fire prevention
                point of view.Rules governing of department are applicable from
                time to time
              </p>
              <table className={styles.Table4}>
                <tbody>
                  <tr
                    style={{
                      // height: "200px",
                      height: "9px",
                    }}
                  >
                    <td>1</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>
                        {" "}
                        Building Side margins, Drive ways, Staircases, Passages,
                        Vehicle Ramps
                      </b>{" "}
                      clearance as per shown in plan, for the maneuverability of
                      the fire fighting vehicle should be kept absolutely free
                      of obstructions, all the time. No Landscaping or any other
                      structural work, being done in side margins or in any
                      other way, obstructing the access to side margins.
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Emergency Contact Numbers Board</b> of Fire,
                      Ambulance, Police & MSEB o be displayed prominently at
                      main gate and other easily visible places.
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Podium if provided </b>, should be designed and
                      constructed to carry weight of 45 tons for Special Heavy
                      Fire Rescue Vehicle load (ALP, TTL, etc). The required
                      vehicular Turning Width, at Ramp ends & building corners
                      to be provided on podium. Podium slab to be painted with
                      Red color strip exactly above the Beam line so as to
                      easily identify it and ease operation of the Special Fire
                      Vehicle Outrigger Jacking.
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>Hose Reel Hose (Type B)</b>, to be provided on all
                      floors with shut off nozzle, (according to length of
                      Bldg), fixed on wall Only. (Fitting of hose reel drums on
                      Riser-Down comer pipe is not allowed).
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>
                        {" "}
                        Extra Standby Pump (Electric for Res. And Diesel driven
                        as applicable)
                      </b>{" "}
                      of same capacity connected to DG Set, to be installed.
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>Independent Duct provision </b>to be made for Riser cum
                      Down Comer System for Buildings more than 7 floors and all
                      Commercial Buildings.
                    </td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>Over Head RCC Fire Water Tank</b> - 10,000 Its for
                      Buildings up to 24 Mtrs height,25,000 Its for buildings
                      from 24 to 70 Mtrs height as well for Special/Non
                      Res.Bldgs. Tank capacity varies depending upon type of
                      occupancy of building.
                    </td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Under Ground RCC Fire Water Tank -</b> 50,000 Itrs
                      capacity for Buildings above 24 mtrs to 40 mtrs height.
                      75,000 Itrs capacity for Buildings from 40 mtrs to 60 mtrs
                      & 1,00,000 Itrs. capacity for Buildings 60 to 70 mts.
                      height and for Special/Non Res.Bldgs. Tank capacity varies
                      depending upon type of occupancy of building. However for
                      group (cluster) of maximum 5 buildings, fire Water tank if
                      single, its capacity should be calculated on the basis of
                      2250 Ipm for minimum 2 hours of fire fighting or min 50%
                      of the total water requirement for all buildings,
                      whichever is higher.
                    </td>
                  </tr>
                  <tr
                    style={{
                      // height: "200px",
                      height: "10px",
                    }}
                  >
                    <td>9</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> (a) Down Comer System - 4"</b> dia, C class ISI mark
                      GI pipe, 3 to 5 HP Terrace pump with ISI mark accessories
                      for each Bldg/Wing upto 24 mts height, with Hose Reels on
                      all floors being provided with fire service Inlet at
                      accessible position. <br></br>(b) Riser cum Down Comer
                      System (each Bldg/Wing) - 6" dia, C class, ISI mark Gl
                      pipe,{" "}
                      <b>
                        UG Tank Pump being of Coupled Type, Positive Pressure
                        Operating
                      </b>{" "}
                      and above capacity for group/cluster of buildings (5 Wings
                      and above) based on calculation with Hose Pipes (according
                      to length of Bldg), Hydrant Valves, Nozzle, fittings,
                      Starter, Pressure Switches, DOL Switch, etc. being ISI
                      Mark for all bldgs and provided with Fire Service Inlet at
                      accessible position. For Bldgs above 60 mtrs, UG Tank Pump
                      being of Multi Head, Multi Outlet type. Automatic
                      Sprinkler installation if any being provided with
                      independent Pump of rated output and capacity. Jockey Pump
                      of rated capacity being provided , for Wet/Sprinkler
                      system, etc
                      <table className={styles.Table5}>
                        <thead>
                          <tr>
                            <th
                              style={{
                                fontSize: 13,
                              }}
                            >
                              Height of Bidg. (Mtrs)
                            </th>
                            <th
                              style={{
                                fontSize: 13,
                              }}
                            >
                              OH Tank Pump Cap.
                            </th>
                            <th
                              style={{
                                fontSize: 13,
                              }}
                            >
                              UG Tank Pump Cap.
                            </th>
                            <th
                              style={{
                                fontSize: 13,
                              }}
                            >
                              Head (UG Pump)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              (i) 24 to 40 mts
                            </td>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              900 lpm
                            </td>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              1800 lpm
                            </td>
                            <td>90 mts</td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              (ii) 40 to 60 mts
                            </td>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              900 lpm
                            </td>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              2280 lpm
                            </td>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              110 mts
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              (iii) 60 to 70 mts
                            </td>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              900 lpm
                            </td>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              2280 lpm
                            </td>
                            <td
                              style={{
                                fontSize: 11,
                              }}
                            >
                              120 mts
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <tr>
                    <td>10</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Automatic Sprinkler System to be provided for -</b>
                      <br></br> (a) All types of Bldgs. Having Lower/Basements
                      Parking area more than 200 sq.mt.<br></br> (b) All
                      Multilevel Basements.<br></br> (c) All Covered Ground and
                      all Upper floor (multilevel) Stilt parking.<br></br> (d)
                      All Podium Parking (Below Podium /all parking under
                      elevated open spaces on podium).
                      <br></br>(e) All Mechanical/Puzzle/Stack Parking as Side
                      Wall Sprinklers diagonally fitted on opposite sides of
                      support channels of the structure.<br></br>
                      (f) All Commercial Bldg. with Covered Area more than 500
                      sq mts. - (For Entire building.)<br></br>
                      (g) All buildings <b>(Including Refuge Area)</b> other
                      than Residential, Mix and Educational of height above 15
                      mtrs.
                      <br></br>
                      (h) All Hotels, Hospitals, Malls, Multiplexes, Warehouses,
                      etc with height above 15 mtrs.
                      <br></br>
                      (i) All{" "}
                      <b>
                        Residential Buildings (Including Refuge Area) above 45
                        mtrs height to be fully{" "}
                      </b>
                      sprinklered. IS-15105-Design and Installation of Fixed
                      Automatic Sprinkler Fire Extinguishing System.{" "}
                      <b>Sprinkler Pump shall be independent </b> of rated
                      output and capacity.
                      <br></br>
                      (j) All Basement/Lower Parking Area, All Ground/Upper
                      Parking, All Covered Parking Area, All Comm. Area, All
                      Shops, All Offices including passage area should be
                      covered with sprinkler system.
                      <br></br>
                    </td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <br></br>
                      <b> Garbage chute </b> if any, shall be provided with
                      <b> independent Sprinkler system </b>at each garbage inlet
                      point of the chute pipe.
                      <br></br>
                      <br></br>
                    </td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>
                        {" "}
                        MCP (Manual Call Points) and PA (Public Address)
                        Communication System
                      </b>{" "}
                      with Talk Back facility to be provided. (Not allowed in
                      Fire Ducts or Staircases)
                    </td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Minimum TWO Staircases</b> (apart) to be provided .One
                      enclosed Fire Escape Staircase of Fire Tower Type to be
                      provided with Fire Resistance Doors Assembly (with frame &
                      accessories) of min 120 mins. (45mm thick)and Commercial
                      Bldgs. to install Metal F. R. Door of CBRI / IPIRTI
                      approved. This fire staircase shall be treated for use of
                      inhabitants during fire and other emergencies and will not
                      be taken into any other use, not even for installation of
                      firefighting system, etc
                    </td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Fire Resistance Doors </b>as above, of min 120 mins
                      (45mm thick) as per IS 4079 to be provided for all Flats
                      Entrances and Balcony/Terrace opening Doors for buildings
                      above 60 mtrs.
                    </td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <br></br>
                      <b> Fire Escape Staircase </b> to be provided with
                      Pressurization System, for Bldgs above 60 mtrs
                      <br></br>
                      <br></br>
                    </td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      All Bldgs above 60 mtrs and Starred Hotels, Malls,
                      Multiplexes, Hospitals above 50 beds being provided with
                      <b> Fire Sealant material</b> of 2 hours rating at every
                      floors at the point of Electric cables and other pipes etc
                      passing through such floors or walls openings, etc
                    </td>
                  </tr>
                  <tr>
                    <td>17</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      Hotel bldgs above 24 mtrs, Hospital bldgs above 15 mtrs,
                      other Fully Commercial Bldgs above 24 mtrs, Residential
                      Bldgs above 45 mtrs and Malls, Multiplexes irrespective of
                      their height to provide <b>Fire Retardant Paint/Coat</b>{" "}
                      (DRDO approved) for Electrical Cables.
                    </td>
                  </tr>
                  <tr>
                    <td>18</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Special Commercial bldgs </b>like Hotels, Hospitals,
                      Commercial Complexes, above 30 mtrs, Mix Occupancy Bldgs
                      above 45 mtrs and fully Residential Bldgs above 60 mtrs to
                      provide at least 1 no. of Self Rescue Chute for each
                      building.
                    </td>
                  </tr>
                  <tr>
                    <td>19</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>
                        {" "}
                        <b>
                          {" "}
                          Automatic Fire Suppression Systems being provided for
                          Commercial Kitchen Hoods of Hotels, Restaurants,
                          Canteens, etc, complying LPS 1223/UL300.
                        </b>
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td>20</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Among the total Lifts provided,</b> for bldgs upto 36
                      mtrs height, minimum one Lift being Fire Lift of 545 kgs
                      (8 person) capacity. Bldgs above 36 mtrs height being
                      provided with Fire cum Stretcher Lift (min 1.9 m x 2.5 m).
                      These lifts shall have Fireman's switch and Talk back
                      Facility emergency communication system
                    </td>
                  </tr>
                  <tr>
                    <td>21</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Refuge Area </b>of minimum 1/4th of the maximum floor
                      area being provided in front & conspicuously marked for
                      identification located after 24 mtr, 39 mtr and every 5th
                      floor thereafter. Refuge Area parapet wall a railings
                      being painted in red color and a bold 'Fire Refuge Area"
                      Board of min. 5ft x 3 ft painting prominently being
                      displayed. Fire Resistance Door (with frame & accessories)
                      of min 120 mins (45mm thick) being fitted for Refuge Area.
                    </td>
                  </tr>
                  <tr>
                    <td>22</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>a) Basement/Lower Parking </b> should have proper
                      Mechanical
                      <b> Smoke Extraction & Dewatering pump Arrangements</b> to
                      prevent smoke and water logging
                      <br></br>{" "}
                      <b>
                        b) Mirror should be provided all
                        Basement/Lower/Ground/Upper Parking Level's blind turn
                        appropriate areas.
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td>23</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> Basement/Lower Parking </b>being used{" "}
                      <b>only for Parking and Nonflammable stores </b>as per DC
                      Rule Cl.15.11.12 &15.11.13. Human habitation use of any
                      kind is not permitted.
                    </td>
                  </tr>
                  <tr>
                    <td>24</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <br></br>

                      <b>
                        Adequate Ventilation arrangement being provided for
                        Hotel Kitchen room areas.
                      </b>
                      <br></br>
                      <br></br>
                    </td>
                  </tr>
                  <tr>
                    <td>25</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      Open Terrace, especially over topmost floor of the
                      building should not be covered or taken into use for any
                      Hotel, Business, commercial purposes or human habitation
                      such as any Roof Top Structure or alike.
                    </td>
                  </tr>

                  <tr>
                    <td>26</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> (a) ABC Type Fire Extinguishers,</b> 6 kg cap. (ISI
                      mark of Reputed Brand) -2 Nos. on<b> every floor </b>and
                      additional 1Nos for Electric Panel Board, 1 Nos for Lift
                      Room of each building and 1 Nos for D.G. Set
                      /Transformer/D.P/ Feeder pole being provided.<br></br>{" "}
                      <b>(b)</b> ABC Type 6 kg cap. (ISI mark of Reputed Brand)
                      -2 Nos. minimum for every shop/office, etc being provided
                      in case of Mix or Commercial occupancy Bldgs. <br></br>
                      <b>(c) </b>ABC Type 6 kg capacity (ISI mark of Reputed
                      Brand) -1 Nos. minimum for every 100 sq mtr area for every
                      Basement or other Parking areas AND 1 no for every vehicle
                      for Bldgs. Having Stack Mechanical/Puzzle Parking if any.{" "}
                      <br></br>
                      <b>(d)</b> ABC Type 2 kg capacity (ISI mark of Reputed
                      Brand) -1 Nos. minimum for every Flat. <br></br>
                      <b>(e) </b>
                      <b>(i) Modular type Fire Extinguisher,</b>5 kg cap - 1
                      Nos. being provided in flat kitchens for Residential
                      Buildings more than 60 m in height and 1 no over top of
                      every upper car for Mechanical/Puzzle area Parking, if
                      any.
                      <br></br> <b> (ii) Modular FE-10 KG </b>capacity to be
                      provided of every shop of Bldg. for Mezzanine floor and
                      Hotel kitchens.
                      <br></br>
                      <b> (iii) Modular FE-10 KG </b>capacity being provided
                      over Indoor Transformers given under roof(covered slab)
                      <r></r> <br></br>{" "}
                      <b>(f) (i) Automatic Fire Trace & Suppression System</b>{" "}
                      being provided for Computer Server Rooms.<br></br>
                      <b> (ii)</b> Automatic Fire Suppression System being
                      provided over Kitchen Hoods Ducts for Kitchens for Hotels.
                    </td>
                  </tr>

                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>

                  <tr>
                    <td>27</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <br></br>
                      <b>
                        {" "}
                        Courtyard Ring Mains (Above Ground) and or Parking
                        Hydrants
                      </b>
                      with one 2/4 way Collecting Head for each wing being
                      provided apart from the bldgs. in front, at accessible
                      position as per IS-13039-1991 - Provision & Maintenance of
                      External Hydrant System.
                      <br></br>
                    </td>
                  </tr>
                  <tr>
                    <td>28</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <br></br>
                      Fire Pump Installation and all Emergency Lighting System
                      (eg. Staircase, passage, etc. to be connected to 3
                      <b> Independent Backup System, </b>for cluster and Tower
                      Buildings.
                      <br></br>
                      <br></br>
                    </td>
                  </tr>
                  <tr>
                    <td>29</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b> a) LPG Reticulated System (Gas Bank)</b> installation
                      is preferred on ground level from fire safety point in
                      High Rise/Commercial Building. It shall comply with ISI
                      6044-1988 Code and OISD norms. Modular Fire Ext. 10 kg-1
                      No for each Gas bank, (up to 500 kg -1 No and 500 kg -2
                      Nos.) ABC Type Fire Ext. (ISI mark)-6 kgs-5 Nos. <br></br>
                      <b>
                        b)LP Gas detection system being installed in the Comm.
                        Kitchen area/Restaurant.
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td>30</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>
                        {" "}
                        Heat and or Smoke /Multi Sensor Detectors with Response
                        Indicators (RI)
                      </b>{" "}
                      being provided for entire False Ceilings and coverings if
                      any.
                    </td>
                  </tr>
                  <tr>
                    <td>31</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>a) Fire Evacuation Plan/Fire Orders</b> to be prepared
                      for Special Buildings with proper display of adequate
                      Directional Illuminated Signage's and Exit Drawings
                      boards, etc.<br></br>
                      <b>
                        {" "}
                        b) Lightning Arresters (As per IS 3070-3 (1993))
                      </b>{" "}
                      being provided on top of bldgs. Above 36 mts. For
                      Lightning safety.
                    </td>
                  </tr>
                  <tr>
                    <td>32</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>
                        {" "}
                        Addressable Automatic Smoke/Multi Sensor Detection and
                        Fire Alarm System{" "}
                      </b>
                      being provided for Commercial Buildings above 15mtrs
                      height or having floor area above 500 sq.mtrs, with Laser
                      Beam Detectors in Malls, Godowns, Auditoriums, Multiplexes
                      & all other building, including{" "}
                      <b>Residential Bldgs. above 45 Meter in height</b> as per
                      IS-2189-1999 Code of Practice for selection, installation
                      and maintenance of Automatic Fire Detection and Alarm
                      System. Detectors and Panel Board being of reputed
                      company. Linear Heat Detection System for
                      Electrical/Electronic Panels/Computer Server, etc
                    </td>
                  </tr>
                  <tr>
                    <td>33</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <br></br>
                      Hotels, Hospitals, Malls and other special/commercial
                      buildings to install<b> LP Gas Detector Devices </b>in
                      their kitchens.
                      <br></br>
                      <br></br>
                    </td>
                  </tr>
                  <tr>
                    <td>34</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      All Three Star & above Starred Hotels, Hospitals above 100
                      beds, Malls and other special/commercial building s to
                      install <b>Fire Stop Curtains </b>of minimum 2 hrs
                      resistance in passages, etc at strategic locations.
                    </td>
                  </tr>
                  <tr>
                    <td>35</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      Starred Hotels, Hospitals above 100 beds, Malls,
                      Multiplexes and other special/commercial buildings should
                      apply
                      <b> Fire Retardant Paint </b>for Electric Cables and
                      Pipes, etc
                    </td>
                  </tr>
                  <tr>
                    <td>36</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      Hotels, Hospitals, Malls, Multiplexes, Industrial special
                      Bldgs. above 15 mtrs height of individual proprietorship
                      to install
                      <b>
                        {" "}
                        Cloud based Remote Monitoring and Alert Notification
                        System (Feeds){" "}
                      </b>
                      for their entire Fire Fighting Installation connected to
                      PCMC Fire Brigade Control Centre.
                    </td>
                  </tr>
                  <tr>
                    <td>37</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      Full equipped <b>Fire Control Room </b>be provided on
                      Ground floor with <b>qualified Fire Officer</b>{" "}
                      appointment for Special Bldgs. like Hotels, Malls,
                      Multiplexes, Hospitals, etc above 30 mtrs and or
                      recommended by fire dept.
                    </td>
                  </tr>
                  <tr>
                    <td>38</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>
                        Fire Installation being got done from the authorized
                        Licensed Agency{" "}
                      </b>
                      of Govt. of Maharashtra only and Drawings for Tower
                      buildings above 40 mtrs height, Commercial Complexes
                      Malls, Multiplexes, Hospitals above 100 beds, Star Hotels
                      etc. to be got approved, from local fire authority before
                      starting of work.
                    </td>
                  </tr>
                  <tr>
                    <td>39</td>
                    <td
                      style={{
                        fontSize: 11,
                      }}
                    >
                      <b>
                        {" "}
                        Building Revision if any towards Remaining/Addl FSI,
                      </b>
                      TDR Loading, Addl Plot Amalgamation, etc. in future, shall
                      be sanctioned, subject to strict compliance of PCMC DC
                      Rules Cl.6.2.6.1, 10.6,19.6.2,19.6.3,19.6.4 and GR
                      No.TPS-1809/287/CR-1924/UD-13, Dt.10/03/2010, for Two
                      Staircases, proper Side Margins & proper Approach Road
                      width clearance, only. Apart from above requirements, the
                      construction of the building and compliance to be carried
                      out as per the following codes, which is the moral
                      responsibility of the applicant- <br></br>
                      <b>a. NBC-2016 Codes - Part IV</b>-Fire and Life Safety{" "}
                      <br></br>
                      <b>b. ISI Codes</b> -<br></br> <br></br>
                      <ul>
                        <li>
                          IS-1642-Code for Fire Safety of Buildings.-Details of
                          Construction
                        </li>
                        <li>
                          IS-1643-Code for Fire Safety of Buildings- Exposure
                          Hazard.
                        </li>
                        <li>
                          IS-1644 Code for Fire Safety of Buildings- Exit
                          requirement and Personal Hazards.
                        </li>
                        <li>
                          IS-1646 Code for Fire Safety of Buildings-Electrical
                          Installation.
                        </li>
                        <li>
                          IS-732 Code for Electrical Wiring installations.
                        </li>
                        <li>
                          IS-1893- Criteria for Earthquake Design of Structures
                          and
                        </li>
                        <li>
                          IS-4326- Code for Earthquake Resistance Design and
                          Construction of building
                        </li>
                        <li>
                          IS-2309- Code for Protection of buildings against
                          Lightning Safety.
                        </li>
                      </ul>
                      {/* <br></br> */}
                    </td>
                  </tr>
                  {/* Exp  */}
                </tbody>
              </table>
              <table
                style={{
                  borderTop: "0px solid white",
                }}
              >
                <tr>
                  <td
                    style={{
                      width: "15%",
                    }}
                  >
                    NOC Applicable Ponts Nos:
                  </td>

                  <td
                    style={{
                      fontSize: 12,
                      width: "85%",
                    }}
                  >
                    <b>
                      1, 2, 4, 5, 6, 7, 8, 9 (b), 10 (a, c, f, j), 11, 12, 13,
                      20, 21, 22 (a, b), 23, 25, 26 (a, b, c, e (iii) f (i)),
                      27, 28, 29 (a), 30, 31 (a, b), 32, 38, 39 Only.
                    </b>
                  </td>
                </tr>
                <tr>
                  <td>NOC Remarks if any</td>

                  <td
                    style={{
                      fontSize: 12,
                    }}
                  >
                    <b>
                      Prov. NOC No. Fire/02/5B/WS/217/2018, Dt.30/08/2018.
                      Recommended against Prov. NOC No. Fire/01/5PC/WS/504/2022,
                      Dt.02/08/2022. Subject to Sanctioned Plan No.
                      BP/Dudulgaon/45/2021, Dt.05/10/2021
                    </b>
                  </td>
                </tr>
                <br></br>
                <br></br>
              </table>
              <table className={styles.Table8}>
                <tr>
                  <td
                    style={{
                      fontSize: 15,
                    }}
                  >
                    <b>
                      <p>
                        Since, this NOC is only for building construction
                        purposes, Fire NOC for the Business / Utility purposes
                        should be taken separately. eg. Malls, Multiplexes,
                        Hotels, Hospitals, Schools, Gas Banks, Gas Agencies,
                        Petrol Pumps, etc.
                      </p>
                    </b>
                  </td>
                </tr>
                <tr>
                  <p
                    style={{
                      fontSize: 15,
                    }}
                  >
                    The Builder/Promoter/Architect, etc. to enter Annual
                    Maintenance Contract with certified Fire Agency for minimum
                    period of 3-5 years towards, efficient working of the system
                    and to hand over the entire Fire Fighting system in
                    operating condition to the Society/Apartment/Occupier,
                    officially during the Tenement/Society handing over process.
                  </p>

                  <br></br>
                  <br></br>

                  <p>
                    It is the sole responsibility of the occupier to maintain
                    and keep in good working conditions all the time, the
                    installed fire fighting system and keep in use and impart
                    training of the use of system to the tenements, as per Sec.
                    3(1) of Mah. Fire Act - 2006, failing of which the NOC shall
                    be deemed cancelled
                  </p>

                  <p>
                    The Occupier / Fire Agency should submit Certificate for
                    proper maintenance and good working condition of the fire
                    fighting system every year to this office as per Sec.3(3) of
                    Mah. Fire & Life Safety Act -2006, in "B" Form.
                  </p>
                  <p>
                    The Fire Office reserves the right of entry for surprise
                    visit and inspection of the system as per the Sec. 5(1) of
                    the Mah. Fire & Life Safety Act - 2006
                  </p>

                  <p>
                    *Difference of Fees amount if any, found during Audit, in
                    future, will be recovered from the Applicant/Occupier.
                  </p>
                </tr>

                <tr>
                  <p
                    style={{
                      fontSize: 15,
                    }}
                  >
                    <b>Fire NOC Fees once paid, is Non-refundable.</b>
                  </p>
                </tr>

                <tr>
                  <p style={{ fontSize: 15 }}>
                    (Abbrv: B-Basement, Gr.-Ground, Po-Podium, Pr-Parking,
                    BP-Basement Parking, GP-Ground Parking)
                  </p>
                </tr>
              </table>
              <table className={styles.Table6}>
                <tr>
                  <td>
                    <b>
                      Sitr Address :-
                      <br></br>
                      "Devrai",
                      <br></br>
                      Gat No.188(P),Dudulgaon,Pune
                    </b>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <b>
                      <u> Fire System Installer :-</u>
                      <br></br>
                      M/s.Om Sai Fire Systems <br />
                      Pimple Saudagar,Pune
                    </b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>
                      To,<br></br>
                      <br></br>
                      Mr.S R Shah /M/s.Kimaya Associates<br></br>
                      For:Owner : Mr.S.R.Shah Atul Enterprises Through Partners
                      Mr.Sandip R. Shah ,Mr.Rahul H.Mundada
                      <br></br>
                      <br></br>
                      Details of previous Fees Paid :1
                    </b>
                  </td>
                  <td></td>
                </tr>
              </table>
              <table className={styles.Table7}>
                <tr>
                  <td
                    style={{
                      width: "25%",
                    }}
                  >
                    <b>Particulars</b>
                  </td>
                  <td
                    style={{
                      width: "25%",
                    }}
                  >
                    <b>Pre.fees paid in Rs.</b>
                  </td>
                  <td
                    style={{
                      width: "15%",
                    }}
                  >
                    <b>
                      Receipt No & Date<br></br>
                      (Rs.)
                    </b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>CFC</b>
                  </td>
                  <td>
                    <b>1,500/-</b>
                  </td>
                  <td>
                    <b>R.No.303318190001551, Dt.19/04/2018</b>
                  </td>
                </tr>

                <tr>
                  <td>
                    <b>Paid For Prov.NOC</b>
                  </td>
                  <td>
                    <b>20,62,200/-/-</b>
                  </td>
                  <td>
                    <b>R.No.303318190009890, Dt.30/08/2018</b>
                  </td>
                </tr>

                <tr>
                  <td>
                    <b>CFC</b>
                  </td>
                  <td>
                    <b>1,500/-</b>
                  </td>
                  <td>
                    <b>R.No.303321220013617, Dt.29/09/2021</b>
                  </td>
                </tr>

                <tr>
                  <td>
                    <b>Total Paid</b>
                  </td>
                  <td>
                    <b>20,65,200/-</b>
                  </td>
                  <td>
                    <b>.........................................</b>
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td
                    style={{
                      fontSize: "20px",
                    }}
                    colSpan="4"
                  >
                    <b>Final Fire NOC Fees Rs.NIL/-</b>
                  </td>
                </tr>
              </table>
              <span>
                <b>
                  *Fees Receipt to be presserved properly & Xerox copy submitted
                  dureing next submissing for Revision or Final NOC Case.
                </b>
              </span>
              <br></br>
              <span>
                ..................................................................................................................................FINISH..................................................................................................................................
              </span>
            </div>
          </div>
        </Card>
      </>
    );
  }
}

export default Index;
