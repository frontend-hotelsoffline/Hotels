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
  const [distributionData, setDistributionData] = useState([]);
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
    setLoading(true);
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
            } pricesG(ftz: "${date_to_pass}") {
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
          } CAnRAC(ftz: "${date_to_pass}") {
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
                cId
                ofr
                rId
                sfrom
                sto
                bwfrom
                bwto
                dAOrR
                disc
                linked
                room
                meals
                supp
                order
                nRef
            }
            suppliments(ftz: "${date_to_pass}") {
                id
                cId
                rId
                serv
                supp
                type
                sfrom
                sto
                PA
                PC
                PHDAA
                PHDAR
                PHDCA
                PHDCR
                cafrom
                cato
            }
            cancellation(ftz: "${date_to_pass}") {
                id
                cId
                from
                to
                type
                rId
                nRef
                cDays
                cPRte
                cPlcy
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
        const mealsDataArray = contractData?.meals_of_contract || [];
        const calendarDataArray = contractData?.CAnRAC || [];
        const CompressedDataArray =
          contractData?.compresed_prices_for_availability_clnder || [];
        const roomSetupDataArray = contractData?.room_setup_of_contract || [];
        const offersDataArray = contractData?.offers_of_contract || [];
        const SuppDataArray = contractData?.supplements_of_contract || [];
        const CancellationDataArray =
          contractData?.cancellation_of_contract || [];
        const PricesDataArray = contractData?.pricesG || [];
        const PricesMarkUp = contractData?.price_markup || [];
        const BuyerMarkUp = contractData?.buyer_markup || [];
        const countrie_names =
          contractData?.countries_for_distribution_of_contract || [];
        const corporates_for_distribution_of_contract =
          contractData?.corporates_for_distribution_of_contract || [];
        const agents_for_distribution_of_contract =
          contractData?.agents_for_distribution_of_contract || [];
        const dmcs_for_distribution_of_contract =
          contractData?.dmcs_for_distribution_of_contract || [];

        const mealsFinal = mealsDataArray?.map((item, index) => ({
          key: index,
          allinc: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.all_inc_adult || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.all_inc_child || ""}</li>
              </ul>
            </span>
          ),
          ultraallinc: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.ultra_all_inc_adult || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.ultra_all_inc_child || ""}</li>
              </ul>
            </span>
          ),
          softallinc: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.soft_all_inc_adult || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.ultra_all_inc_child || ""}</li>
              </ul>
            </span>
          ),
          fb: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.fb_adult || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.fb_child || ""}</li>
              </ul>
            </span>
          ),
          hb: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.hb_adult || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.hb_child || ""}</li>
              </ul>
            </span>
          ),
          breakfast: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.breakfast_adult || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.breakfast_child || ""}</li>
              </ul>
            </span>
          ),
          roomonly: (
            <span className="gap-y-2 ">
              <label className="labelStyle"> adult</label>
              <ul>
                <li>{item.room_only_adult || ""}</li>
              </ul>
              <label className="labelStyle"> child</label>
              <ul>
                <li>{item.room_only_child || ""}</li>
              </ul>
            </span>
          ),
          date: (
            <span className="w-[110px]">
              <p>{formatDate(item.from_date) || ""}</p>
              <p>{formatDate(item.to_date) || ""}</p>
            </span>
          ),
          timestamp: formatDate(item.CRT || null),
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
          timestamp: formatDate(item.CRT || null),
          bookingwindow: (
            <span>
              <p>{formatDate(item.booking_window_from) || ""}</p>
              <p>{formatDate(item.booking_window_to) || ""}</p>
            </span>
          ),
          stay: (
            <span>
              <p>{formatDate(item.stay_from) || ""}</p>
              <p>{formatDate(item.stay_to) || ""}</p>
            </span>
          ),
          roomcategory: item.room?.name == 0 ? "All" : item.room?.name || "",
          offer: item.offer || "",
          discount:
            item.discount_amount > 0
              ? item.discount_amount
              : item.discount_rate > 0
              ? item.discount_rate + "%"
              : "",
          source: item.source_countries?.map((item) => (
            <p>{item.country || ""}</p>
          )),
          linked: (
            <span className="float-right">
              {item.is_linked === true ? (
                <FaCheck className="text-blue-800" />
              ) : (
                <ImCross className="text-red-500" /> || ""
              )}
            </span>
          ),
          room: (
            <span className="float-right">
              {item.is_room === true ? (
                <FaCheck className="text-blue-800" />
              ) : (
                <ImCross className="text-red-500" /> || ""
              )}
            </span>
          ),
          meals: (
            <span className="float-right">
              {item.is_meals === true ? (
                <FaCheck className="text-blue-800" />
              ) : (
                <ImCross className="text-red-500" /> || ""
              )}
            </span>
          ),
          supp: (
            <span className="float-right">
              {item.is_supp === true ? (
                <FaCheck className="text-blue-800" />
              ) : (
                <ImCross className="text-red-500" /> || ""
              )}
            </span>
          ),
          order: item.order || "",
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
          timestamp: formatDate(item.CRT || null),
          roomcategory: item.room?.name || "",
          type: item.type || "",
          supplement: item.supplement || "",
          service: item.service || "",
          price: (
            <span className="">
              <p className="flex flex-row items-center gap-1">
                adult:{" "}
                <ul>
                  <li> {item.price_adult || ""}</li>
                </ul>
              </p>
              <p className="flex flex-row items-center gap-1">
                child:{" "}
                <ul>
                  <li> {item.price_child || ""}</li>
                </ul>
              </p>
            </span>
          ),
          stay: (
            <span>
              <ul>
                <li> {formatDate(item.stay_from) || ""}</li>
              </ul>
              <ul>
                <li> {formatDate(item.stay_to) || ""}</li>
              </ul>
            </span>
          ),
          supplementbased: (
            <span className="">
              <label className="labelStyle"> adult</label>
              <span className="flex justify-evenly">
                <p className="flex flex-row items-center gap-1">
                  Amount:{" "}
                  <ul>
                    <li> {item.P_in_Half_Double_adult_amount || ""}</li>
                  </ul>
                </p>
                <p className="flex flex-row items-center gap-1">
                  {" "}
                  Rate:{" "}
                  <ul>
                    <li> {item.P_in_Half_Double_adult_rate || ""}%</li>
                  </ul>
                </p>
              </span>
              <label className="labelStyle mt-2"> child</label>
              <span className="flex justify-evenly">
                <p className="flex flex-row items-center gap-1">
                  Amount:{" "}
                  <ul>
                    <li>{item.P_in_Half_Double_child_amount || ""}</li>
                  </ul>
                </p>
                <p className="flex flex-row items-center gap-1">
                  Rate:{" "}
                  <ul>
                    <li> {item.P_in_Half_Double_child_rate || ""}%</li>
                  </ul>
                </p>
              </span>
            </span>
          ),
          childage: (
            <span>
              <ul>
                <li> {item.child_age_from || ""}</li>
              </ul>
              <ul>
                <li> {item.child_age_to}</li>
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
          timestamp: formatDate(item.CRT || null),
          bookingpolicy: item.booking_cancellation_policy || "",
          room: (item.room && item.room?.name) || "",
          refundable:
            item.is_non_refundable && item.is_non_refundable == true ? (
              <span className="flex items-center justify-center">
                <FaCheck className="text-blue-800" />
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <ImCross className="text-red-500" />
              </span>
            ),
          type: item.type || "",
          penaltyrate: item.cancellation_panelty_rate || "",
          cancellationdays: item.cancellation_days || "",
          date: (
            <span>
              <p> {formatDate(item.date_from || "")}</p>
              <p> {formatDate(item.date_to)}</p>
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
          console.log(item);
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
          category: item.room?.name || "",
          occupancy: item.occupancy || "",
          total_persons: (
            <ul>
              <li>{item.total_persons || ""}</li>
            </ul>
          ),
          min_adult: (
            <ul>
              <li>{item.min_adult || ""}</li>
            </ul>
          ),
          max_adult: (
            <ul>
              <li>{item.max_adult || ""}</li>
            </ul>
          ),
          max_child: (
            <ul>
              <li>{item.max_child || ""}</li>
            </ul>
          ),
          no_of_beds: (
            <ul>
              <li>{item.no_of_beds || ""}</li>
            </ul>
          ),
          shared_bed:
            item.shared_bed === true ? (
              <ul>
                <li>Yes</li>
              </ul>
            ) : item.shared_bed === false ? (
              <ul>
                <li>No</li>
              </ul>
            ) : (
              ""
            ),
          shared_supliment_type: (
            <ul>
              <li>{item.shared_supliment_type || ""}</li>
            </ul>
          ),
          shared_suppliment: (
            <ul>
              <li>{item.shared_suppliment || ""}</li>
            </ul>
          ),
          max_age_in_extra_bed: (
            <ul>
              <li>{item.max_age_in_extra_bed || ""}</li>
            </ul>
          ),
          no_of_extra_beds: (
            <ul>
              <li>{item.no_of_extra_beds || ""}</li>
            </ul>
          ),
          extra_bed_suppliment: (
            <ul>
              <li>{item.extra_bed_suppliment || ""}</li>
            </ul>
          ),
          extra_suppliment_type: (
            <ul>
              <li>{item.extra_suppliment_type || ""}</li>
            </ul>
          ),
          meals_included:
            item.meals_included === true ? (
              <ul>
                <li>Yes</li>
              </ul>
            ) : item.meals_included === false ? (
              <ul>
                <li>No</li>
              </ul>
            ) : (
              ""
            ),
          max_child_age_in_shared: (
            <ul>
              <li>{item.max_child_age_in_shared || ""}</li>
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
        const distributionArray = corporates_for_distribution_of_contract?.map(
          (item, index) => ({
            key: index,
            chooseacountry: (
              <p className="grid grid-cols-3">
                {countrie_names?.map((list) => (
                  <span>{list.country}</span>
                ))}
              </p>
            ),
            dmc_id: dmcs_for_distribution_of_contract[index]?.id || "",
            corporates_id: item?.id || "",
            agent_id: agents_for_distribution_of_contract[index]?.id || "",
          })
        );
        setDistributionData(distributionArray);

        const priceMarkupArray = [
          {
            key: PricesMarkUp.id,
            markup:
              (PricesMarkUp.markup && PricesMarkUp.markup.toFixed(2) + "%") ||
              "",
            timestamp: formatDate(contractData.CRT),
          },
        ];

        const buyMarkupArray = BuyerMarkUp?.map((item) => ({
          key: item.id,
          markup:
            (item.buyer_markup && (item.buyer_markup * 1).toFixed(2) + "%") ||
            "",
          userid: item.user?.uname || "",
          userLevel:
            item.user_level == 4 ? "DMC" : item.user_level == 6 ? "Hotel" : "",
          timestamp: formatDate(item.CRT || null),
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
        setRawPriceData(calendarDataArray);
        setCompressedData(CompressedDataArray);
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
    distributionData,
    loading,
    roomSetupData,
    getAllContractData,
    rawPriceData,
    compressData,
  };
};

export default GetAllContracts;
