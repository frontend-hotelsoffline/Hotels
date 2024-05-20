import { Button, Modal, Popover, message } from "antd";
import React, { useEffect, useState } from "react";
import { GET_API } from "../components/API/GetAPI";

import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { formatDate } from "../components/Helper/FormatDate";
import EditPrice from "./Static-Contract/EditStaticContract/EditPrice";
import AssignDistribution from "./Static-Contract/EditStaticContract/AssignDistribution";
import { EditIcon } from "../components/Customized/EditIcon";

const GetAllContracts = (
  id_from_contract_id,
  rowData,
  hotel_id,
  Occupancy_and_category_cross,
  hotelValue
) => {
  const [mealsData, setMealsData] = useState([]);
  const [OffersData, setOffersData] = useState([]);
  const [supplementsData, setSupplementsData] = useState([]);
  const [cancellationData, setCancellationData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [rawPriceData, setRawPriceData] = useState([]);
  const [distAg, setDistAg] = useState([]);
  const [distDMCs, setDistDMCs] = useState([]);
  const [distCnR, setDistCnR] = useState([]);
  const [distCp, setDistCp] = useState([]);
  const [priceMarkupData, setPriceMarkupData] = useState([]);
  const [compressData, setCompressedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomSetupData, setRoomSetupData] = useState([]);

  const [isModalOpenPrice, setIsModalOpenPrice] = useState(false);
  const [isOpenAssignDistribution, setIsOpenAssignDistribution] =
    useState(false);
  const [isModalOpenMeal, setIsModalOpenMeal] = useState(false);
  const [isModalOpenRoomSetup, setIsModalOpenRoomSetup] = useState(false);
  const [isModalOpenOffer, setIsModalOpenOffer] = useState(false);

  const handleCancel = () => {
    setIsModalOpenPrice(false);
    setIsModalOpenMeal(false);
    setIsModalOpenRoomSetup(false);
    setIsModalOpenOffer(false);
    setIsOpenAssignDistribution(false);
  };

  const selectedDate = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  var date_to_pass = selectedDate.toISOString();

  const getAllContractData = async () => {
    // setLoading(true);
    const GET_ALL = `{
        getSC(id: ${id_from_contract_id}) {
            from(ftz: "${date_to_pass}")
            To(ftz: "${date_to_pass}")
            renewal(ftz: "${date_to_pass}")
            id
            CRT
            name
            OT
            oId
            cur
            status
            country
            city
            bMeal
            hId
            caFrom
            caT
            sRate
            mId
            hotel {
                id
                name
                rooms {
                  id
                  name
                  prio
              }
            }
            markup {
                id
                CRT
                name
                markup
            } 
            viewRS {
              rId
              rname
              tPax
              minA
              maxA
              maxC
              Beds
              sBed
              ssType
              ss
              mcas
              ebeds
              maieb
              est
              ebs
              mInc
          }pricesG(ftz: "${date_to_pass}") {
              from
              to
              rows {
                  id
                  CRT
                  cId
                  from
                  to
                  rId
                  sgl
                  dbl
                  twn
                  trl
                  qud
                  unit
                  minS
                  maxS
                  room {
                      id
                      name
                  }
              }
          } 
          CPAC(ftz: "${date_to_pass}") {
            from
            to
            rooms {
                dInR {
                    id
                    CRT
                    cId
                    from
                    to
                    rId
                    sgl
                    dbl
                    twn
                    trl
                    qud
                    unit
                    minS
                    maxS
                    room {
                        id
                        name
                        prio
                    }
                }
            }
        }
          CAnRAC(ftz: "${date_to_pass}") {
            from
            to
            rooms {
                dInR {
                    id
                    CRT
                    cId
                    from
                    to
                    rId
                    alm
                    rel
                    room {
                        id
                        name
                        prio
                    }
                }
            }
        }
            meals(ftz: "${date_to_pass}") {
                id
                CRT
                cId
                from
                to
                roA
                roC
                bA
                bC
                hbA
                hbC
                fbA
                fbC
                saiA
                saiC
                aiA
                aiC
                uaiA
                uaiC
            }
            offers(ftz: "${date_to_pass}") {
              id
              CRT
              cId
              ofr
              rId
              sfrom
              theroom {
                id
                name
            }
              sto
              bwfrom
              bwto
              dAOrR
              disc
              linkId
              room
              meals
              supp
              order
              minS
              ArOrSt
              Scountries {
                  id
                  country
              }
            }
            suppliments(ftz: "${date_to_pass}") {
              id
              cId
              CRT
              rId
              rmrk
              vali
              type
              supp
              theroom {
                id
                name
            }
              sfrom
              sto
              pAmn
              PAa
              PCa
              PAr
              PCr
              cafrom
              cato
              mand
              ArOrSt
            }
            cancellation(ftz: "${date_to_pass}") {
                id
                CRT
                cId
                from
                to
                type
                rId
                ArOrSt
                theroom {
                  id
                  name
              }
                nRef
                cDays
                cPRte
                cPlcy
            }EBMarkups {
              id
              btype
              bid
              mId
              markup {
                  id
                  CRT
                  name
                  markup
              }
          }
            distribution {
              CnR {
                  countries {
                      id
                      country
                  }
                  regions {
                      id
                      rId
                      region {
                        id
                        rgn
                    }
                  }
              }
              Ag {
                  id
                  agId
                  agentName
                  CRT
              }
              DMCs {
                  id
                  dId
                  dmcName
                  CRT
              }
              Cp {
                  id
                  cpId
                  coopName
                  CRT
              }
          }
        }
    }
    `;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (res.data && !res.errors) {
        const contractData = res.data.getSC;
        const no_of_rooms = contractData.hotel?.rooms;
        setLoading(false);
        const mealsDataArray = contractData?.meals || [];
        const calendarDataArray = contractData?.CAnRAC || [];
        const CompressedDataArray = contractData?.CPAC || [];
        setRawPriceData(calendarDataArray);
        setCompressedData(CompressedDataArray);
        const roomSetupDataArray = contractData?.viewRS || [];
        const offersDataArray = contractData?.offers || [];
        const SuppDataArray = contractData?.suppliments || [];
        const CancellationDataArray = contractData?.cancellation || [];
        const PricesDataArray = contractData?.pricesG || [];
        const PricesMarkUp = contractData?.markup || [];
        const BuyerMarkUp = contractData?.EBMarkups || [];
        const CnR = contractData?.distribution?.CnR || [];
        const Cp = contractData.distribution?.Cp || [];
        const Ag = contractData.distribution?.Ag || [];
        const DMCs = contractData.distribution?.DMCs || [];

        const mealsFinal = mealsDataArray?.map((item, index) => ({
          key: index,
          allinc: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.aiA || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.aiC || ""}</li>
              </ul>
            </span>
          ),
          ultraallinc: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.uaiA || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.uaiC || ""}</li>
              </ul>
            </span>
          ),
          softallinc: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.soft_aiA || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.uaiC || ""}</li>
              </ul>
            </span>
          ),
          fb: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.fbA || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.fbC || ""}</li>
              </ul>
            </span>
          ),
          hb: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.hbA || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.hbC || ""}</li>
              </ul>
            </span>
          ),
          breakfast: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.bA || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.bC || ""}</li>
              </ul>
            </span>
          ),
          roomonly: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.roA || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.roC || ""}</li>
              </ul>
            </span>
          ),
          date: (
            <span className="w-[110px]">
              <p>{formatDate(item.from) || null}</p>
              <p>{formatDate(item.to) || null}</p>
            </span>
          ),
          timestamp: item.CRT && formatDate(item.CRT || null),
          action: (
            <span className="w-full flex justify-center">
              <Popover
                content={
                  <div className="flex flex-col gap-3">
                    <Button className="action-btn">edit</Button>
                  </div>
                }
              >
                {EditIcon}
              </Popover>
            </span>
          ),
        }));
        const offersFinal = offersDataArray?.map((item, index) => ({
          key: index || "",
          id: item.id,
          timestamp: item.CRT && formatDate(item.CRT || null),
          bookingwindow: (
            <span>
              <p>{formatDate(item.bwfrom) || null}</p>
              <p>{formatDate(item.bwto) || null}</p>
            </span>
          ),
          stay: (
            <span>
              <p>{formatDate(item.sfrom) || null}</p>
              <p>{formatDate(item.sto) || null}</p>
            </span>
          ),
          roomcategory:
            item.theroom?.name === 0 ? "All" : item.theroom?.name || null,
          offer: item.ofr || "",
          discount:
            item.dAOrR === "amnt"
              ? item.disc
              : item.dAOrR === "rate"
              ? item.disc + "%"
              : "",
          source: item.Scountries?.map((item) => <p>{item.country || ""}</p>),
          linked: item.linkId,
          room: (
            <span className="float-right">
              {item.room === true ? (
                <FaCheck className="text-blue-800" />
              ) : (
                <ImCross className="text-red-500" /> || ""
              )}
            </span>
          ),
          meals: (
            <span className="float-right">
              {item.meals === true ? (
                <FaCheck className="text-blue-800" />
              ) : (
                <ImCross className="text-red-500" /> || ""
              )}
            </span>
          ),
          supp: (
            <span className="float-right">
              {item.supp === true ? (
                <FaCheck className="text-blue-800" />
              ) : (
                <ImCross className="text-red-500" /> || ""
              )}
            </span>
          ),
          order: item.order || "",
          ArOrSt: item.ArOrSt || "",
          minStay: item.minS || "",
          action: (
            <span className="w-full flex justify-center">
              <Popover
                content={
                  <div className="flex flex-col gap-3">
                    <Button className="action-btn">edit</Button>
                  </div>
                }
              >
                {EditIcon}
              </Popover>
            </span>
          ),
        }));

        const supplementFinal = SuppDataArray?.map((item, index) => ({
          key: index,
          timestamp: item.CRT && formatDate(item.CRT || null),
          roomcategory: item.theroom?.name || "",
          type: item.type || "",
          supplement: item.supp || "",
          validity: item.vali || "",
          ArOrSt: item.ArOrSt || "",
          mandatory: item.mand === true ? "Yes" : "No" || "",
          price_type: item.pAmn === true ? "Amount" : "Rate",
          remark: item.rmrk || "",
          price: (
            <span className="">
              <p className="flex flex-row items-center gap-1">
                adult:{" "}
                <ul>
                  <li> {item.PAa || ""}</li>
                </ul>
              </p>
              <p className="flex flex-row items-center gap-1">
                child:{" "}
                <ul>
                  <li> {item.PCa || ""}</li>
                </ul>
              </p>
            </span>
          ),
          pricerate: (
            <span className="">
              <p className="flex flex-row items-center gap-1">
                adult:{" "}
                <ul>
                  <li> {item.PAr || ""}</li>
                </ul>
              </p>
              <p className="flex flex-row items-center gap-1">
                child:{" "}
                <ul>
                  <li> {item.PCr || ""}</li>
                </ul>
              </p>
            </span>
          ),
          stay: (
            <span>
              <ul>
                <li> {item.sfrom && formatDate(item.sfrom || null)}</li>
              </ul>
              <ul>
                <li> {item.sto && formatDate(item.sto || null)}</li>
              </ul>
            </span>
          ),

          childage: (
            <span>
              <ul>
                <li> {item.cafrom || ""}</li>
              </ul>
              <ul>
                <li> {item.cato}</li>
              </ul>
            </span>
          ),
          action: (
            <span className="w-full flex justify-center">
              <Popover
                content={
                  <div className="flex flex-col gap-3">
                    <Button className="action-btn">edit</Button>
                  </div>
                }
              >
                {EditIcon}
              </Popover>
            </span>
          ),
        }));

        const cancellationFinal = CancellationDataArray?.map((item, index) => ({
          key: index || "",
          timestamp: item.CRT && formatDate(item.CRT || null),
          bookingpolicy: item.cPlcy || "",
          room: item.theroom?.name || "",
          refundable:
            item.nRef && item.nRef == true ? (
              <span className="flex items-center justify-center">
                <FaCheck className="text-blue-800" />
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <ImCross className="text-red-500" />
              </span>
            ),
          ArOrSt: item.ArOrSt,
          type: item.type || "",
          penaltyrate: item.cPRte || "",
          cancellationdays: item.cDays || "",
          date: (
            <span>
              <p> {formatDate(item.from || "")}</p>
              <p> {formatDate(item.to)}</p>
            </span>
          ),
          action: (
            <span className="w-full flex justify-center">
              <Popover
                content={
                  <div className="flex flex-col gap-3">
                    <Button className="action-btn">edit</Button>
                  </div>
                }
              >
                {EditIcon}
              </Popover>
            </span>
          ),
        }));

        const PriceFinal = PricesDataArray?.map((item, index) => {
          const addedOn = item.rows;
          const balanceArray = no_of_rooms?.length - addedOn?.length;

          if (balanceArray > 0) {
            const roomsToAdd = no_of_rooms.filter(
              (room) => !addedOn.some((data) => data.room?.id === room?.id)
            );

            addedOn.push(
              ...roomsToAdd?.map((room) => ({
                room: {
                  id: room?.id,
                  name: room?.name,
                  prio: room?.prio,
                },
              }))
            );
          }
          const sortedData = addedOn.sort((a, b) => a.room.prio - b.room.prio);

          return {
            ...item,
            key: index,
            DBL: sortedData?.map((list, listIndex) => (
              <ul key={`dbl-${list?.id}-${listIndex}`}>
                {Occupancy_and_category_cross[
                  listIndex
                ]?.array_of_occupancies.includes("DBL") ? (
                  <li
                    className="borderedRow active"
                    key={`dbl-${list}-${listIndex}`}
                  >
                    {list.dbl === 0 ? 0 : list.dbl > 0 ? list.dbl : ""}
                  </li>
                ) : (
                  <li className="borderedRow inactive"></li>
                )}
              </ul>
            )),

            price_id: sortedData?.map((list, listIndex) => (
              <ul key={`"id"-${list?.id}-${listIndex}`}>
                <li key={`"id"-${list}-${listIndex}`}>{list?.id || ""}</li>
              </ul>
            )),
            timestamp: formatDate(
              (item.rows?.find((list) => list.CRT) || {}).CRT
            ),
            QUAD: sortedData?.map((list, listIndex) => (
              <ul key={`"quad"-${list?.id}-${listIndex}`}>
                {Occupancy_and_category_cross[
                  listIndex
                ]?.array_of_occupancies.includes("QUAD") ? (
                  <li
                    className="borderedRow active"
                    key={`"qud"-${list}-${listIndex}`}
                  >
                    {list.qud === 0 ? 0 : list.qud > 0 ? list.qud : ""}
                  </li>
                ) : (
                  <li className="borderedRow inactive"></li>
                )}
              </ul>
            )),
            SGL: sortedData?.map((list, listIndex) => (
              <ul key={`"sgl"-${list?.id}-${listIndex}`}>
                {Occupancy_and_category_cross[
                  listIndex
                ]?.array_of_occupancies.includes("SGL") ? (
                  <li
                    className="borderedRow active"
                    key={`"sgl"-${list}-${listIndex}`}
                  >
                    {list.sgl === 0 ? 0 : list.sgl > 0 ? list.sgl : ""}
                  </li>
                ) : (
                  <li className="borderedRow inactive"></li>
                )}
              </ul>
            )),
            TRPL: sortedData?.map((list, listIndex) => (
              <ul key={`"trl"-${list?.id}-${listIndex}`}>
                {Occupancy_and_category_cross[
                  listIndex
                ]?.array_of_occupancies.includes("TRPL") ? (
                  <li
                    className="borderedRow active"
                    key={`"trl"-${list}-${listIndex}`}
                  >
                    {list.trl === 0 ? 0 : list.trl > 0 ? list.trl : ""}
                  </li>
                ) : (
                  <li className="borderedRow inactive"></li>
                )}
              </ul>
            )),
            TWN: sortedData?.map((list, listIndex) => (
              <ul key={`"twin"-${list?.id}-${listIndex}`}>
                {Occupancy_and_category_cross[
                  listIndex
                ]?.array_of_occupancies.includes("TWN") ? (
                  <li
                    className="borderedRow active"
                    key={`"twn"-${list}-${listIndex}`}
                  >
                    {list.twn === 0 ? 0 : list.twn > 0 ? list.twn : ""}
                  </li>
                ) : (
                  <li className="borderedRow inactive"></li>
                )}
              </ul>
            )),
            unit: sortedData?.map((list, listIndex) => (
              <ul key={`"unit"-${list?.id}-${listIndex}`}>
                {Occupancy_and_category_cross[
                  listIndex
                ]?.array_of_occupancies.includes("UNIT") ? (
                  <li
                    className="borderedRow active"
                    key={`"unit"-${list}-${listIndex}`}
                  >
                    {list.unit === 0 ? 0 : list.unit > 0 ? list.unit : ""}
                  </li>
                ) : (
                  <li className="borderedRow inactive"></li>
                )}
              </ul>
            )),
            minstay: sortedData?.map((list, listIndex) => (
              <ul key={`"min"-${list?.id}-${listIndex}`}>
                <li key={`"minst"-${list}-${listIndex}`}>
                  {list.minS === 0 ? 0 : list.minS > 0 ? list.minS : ""}
                </li>
              </ul>
            )),
            maxstay: sortedData?.map((list, listIndex) => (
              <ul key={`"max"-${list?.id}-${listIndex}`}>
                <li key={`"max"-${list}-${listIndex}`}>
                  {list.maxS === 0 ? 0 : list.maxS > 0 ? list.maxS : ""}
                </li>
              </ul>
            )),
            from_date: item.from || null,
            to_date: item.to || null,
            category: sortedData?.map((list, listIndex) => (
              <p
                key={`"category" -${listIndex}`}
                className="flex text-center h-[25px] items-center justify-center w-full"
              >
                {list?.room?.name || ""}
              </p>
            )),
            date: (
              <span key={item.id}>
                <p key={`"from"-${item.from}-${index}`}>
                  {formatDate(item.from || "")}
                </p>
                <p key={`"to_date"-${item.from}-${index}`}>
                  {formatDate(item.to || "")}
                </p>
              </span>
            ),
            action: (
              <span className="w-full flex justify-center">
                <Popover
                  content={
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => setIsModalOpenPrice(true)}
                        className="action-btn"
                      >
                        edit
                      </Button>
                    </div>
                  }
                >
                  {EditIcon}
                </Popover>
                <Modal
                  width={1000}
                  footer={false}
                  open={isModalOpenPrice}
                  onOk={handleCancel}
                  onCancel={handleCancel}
                >
                  <EditPrice
                    rowData={rowData}
                    getAllContractData={getAllContractData}
                    handleCancel={handleCancel}
                    id={id_from_contract_id}
                    hotel_id={hotel_id}
                  />
                </Modal>
              </span>
            ),
          };
        });

        const occupancyOrder = ["SGL", "DBL", "TWN", "TRPL", "QUAD", "UNIT"];

        const roomSetupFinal = roomSetupDataArray?.map((item, index) => ({
          key: index || "",
          category: item.rname || "",
          occupancy: item.occupancy || "",
          total_persons: (
            <ul>
              <li>{item.tPax || ""}</li>
            </ul>
          ),
          min_adult: (
            <ul>
              <li>{item.minA || ""}</li>
            </ul>
          ),
          max_adult: (
            <ul>
              <li>{item.maxA || ""}</li>
            </ul>
          ),
          max_child: (
            <ul>
              <li>{item.maxC || ""}</li>
            </ul>
          ),
          no_of_beds: (
            <ul>
              <li>{item.Beds || ""}</li>
            </ul>
          ),
          shared_bed:
            item.sBed === true ? (
              <ul>
                <li>Yes</li>
              </ul>
            ) : item.sBed === false ? (
              <ul>
                <li>No</li>
              </ul>
            ) : (
              ""
            ),
          shared_supliment_type: (
            <ul>
              <li>{item.ssType || ""}</li>
            </ul>
          ),
          shared_suppliment: (
            <ul>
              <li>{item.ss || ""}</li>
            </ul>
          ),
          max_age_in_extra_bed: (
            <ul>
              <li>{item.maieb || ""}</li>
            </ul>
          ),
          no_of_extra_beds: (
            <ul>
              <li>{item.ebeds || ""}</li>
            </ul>
          ),
          extra_bed_suppliment: (
            <ul>
              <li>{item.ebs || ""}</li>
            </ul>
          ),
          extra_suppliment_type: (
            <ul>
              <li>{item.est || ""}</li>
            </ul>
          ),
          meals_included: (
            <ul>
              <li>{item.mInc}</li>
            </ul>
          ),
          max_child_age_in_shared: (
            <ul>
              <li>{item.mcas || ""}</li>
            </ul>
          ),
          customOrder:
            occupancyOrder.indexOf(item.occupancy) !== -1
              ? occupancyOrder.indexOf(item.occupancy)
              : Infinity,
        }));
        roomSetupFinal.sort((a, b) => a.customOrder - b.customOrder);
        setRoomSetupData(roomSetupFinal);

        setPriceData(PriceFinal);

        setMealsData(mealsFinal);
        setOffersData(offersFinal);
        setSupplementsData(supplementFinal);
        setCancellationData(cancellationFinal);
        const distAgArray = Ag?.map((item) => ({
          key: item.id,
          agent: item.agentName || 0,
          date: item.CRT && formatDate(item.CRT),
        }));
        setDistAg(distAgArray);

        const distCpArray = Cp?.map((item) => ({
          key: item.id,
          corporate: item.coopName,
          date: item.CRT && formatDate(item.CRT),
        }));
        setDistCp(distCpArray);

        const distDMCsArray = DMCs?.map((item) => ({
          key: item.id,
          dmcs: item.dmcName,
          date: item.CRT && formatDate(item.CRT),
        }));
        setDistDMCs(distDMCsArray);

        const distCnRArray = CnR.countries?.map((item, index) => ({
          key: item.id,
          region: CnR.regions[index]?.region?.rgn,
          country: item?.country,
        }));
        setDistCnR(distCnRArray);

        const priceMarkupArray = [
          {
            key: PricesMarkUp.id,
            markup:
              (PricesMarkUp.markup && PricesMarkUp.markup.toFixed(2) + "%") ||
              "",
            timestamp:
              contractData.markup?.CRT &&
              formatDate(contractData.markup?.CRT || null),
          },
        ];

        const buyMarkupArray = BuyerMarkUp?.map((item) => ({
          key: item.id,
          markup:
            (item.markup?.markup &&
              (item.markup?.markup * 1).toFixed(2) + "%") ||
            "",
          timestamp: item.markup?.CRT && formatDate(item.markup?.CRT || null),
          action: (
            <span className="w-full flex justify-center">
              <Popover
                content={
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => setIsOpenAssignDistribution(true)}
                      className="action-btn"
                    >
                      edit
                    </Button>
                  </div>
                }
              >
                {EditIcon}
              </Popover>
              <Modal
                footer={false}
                open={isOpenAssignDistribution}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <AssignDistribution
                  rowData={rowData}
                  getAllContractData={getAllContractData}
                  handleCancel={handleCancel}
                  id={id_from_contract_id}
                />
              </Modal>
            </span>
          ),
        }));
        const combinedMarkup = [...priceMarkupArray, ...buyMarkupArray];
        setPriceMarkupData(combinedMarkup);
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id_from_contract_id && getAllContractData();
  }, [
    isModalOpenPrice,
    isOpenAssignDistribution,
    hotelValue,
    hotel_id,
    Occupancy_and_category_cross,
    id_from_contract_id,
  ]);

  return {
    mealsData,
    OffersData,
    supplementsData,
    cancellationData,
    priceData,
    priceMarkupData,
    distAg,
    distCp,
    distDMCs,
    distCnR,
    loading,
    roomSetupData,
    getAllContractData,
    rawPriceData,
    compressData,
  };
};

export default GetAllContracts;
