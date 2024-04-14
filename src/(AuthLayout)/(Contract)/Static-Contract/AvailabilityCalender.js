"use client";
import { Suspense, useEffect, useState } from "react";
import { Button, Modal, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RelAndAllotment from "./AddRelAndAllotment";
import CalendarDetails from "./CalendarDetails";

const AvailabilityCalendar = ({
  record,
  categoryData,
  id,
  getAllContractData,
  compressData,
  loading,hotel_id
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAllotmentData, setOpenAllotmentData] = useState(false);
  const [selectedAllotment, setSelectedAllotment] = useState(null);
  const [pricesOverride, setPricesOverride] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setOpenAllotmentData(false);
  };

  const generateDateRange = (rangeData) => {
    const groupArray = rangeData
      ?.flatMap((item) => item.grouped_data)
      ?.sort((a, b) => a.room?.priority - b.room?.priority);
    const compressDatabreak = compressData.flatMap(
      (item) => item.data_packets_of_categories
    );

    const contractCop = compressDatabreak
      ?.map((item) => item?.grouped_data)
      .sort((a, b) => {
        const priorityA = a.map((item) => item.room?.priority)[0];
        const priorityB = b.map((item) => item.room?.priority)[0];
        return priorityA - priorityB;
      });
const groupedByCategory = groupArray.reduce((acc, entry) => {
  const categoryName = entry.room.name;
  if (!acc[categoryName]) {
      acc[categoryName] = [];
  }
  acc[categoryName].push(entry);
  return acc;
}, {});


let earliestFromDate = Object.values(groupedByCategory)?.reduce(
  (earliest, categoryEntries) => {
    categoryEntries.forEach((entry) => {
      const currentFromDate = new Date(entry.from_date);

      if (!earliest || currentFromDate < earliest) {
        earliest = currentFromDate;
      }
    });

    return earliest;
  },
  null
);

    const fromDate = new Date(earliestFromDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const currentDate = new Date(fromDate);
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const dateRange = Array.from(
      { length: daysInMonth },
      (_, index) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1)
    );

    return (
      <div className="flex flex-col w-full mb-10">
        <h1 className="title">
          {
            new Date(earliestFromDate).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
        </h1>
        {/* Header calendar without range */}
        <div className="flex flex-row">
          <div className="w-[200px]"></div>
          <div className="calendar-month">
            {
              Array.from({ length: daysInMonth }, (_, index) => (
                <div key={index} className="calendar-day-no-box h-[42px]">
                  {index + 1}
                </div>
              ))}
          </div>
        </div>
        {Object.keys(groupedByCategory)?.map((categoryName, index) =>
          (
            <div key={index} className="flex flex-row relative">
              <div className="w-[200px]">{categoryName}</div>
              <div className="calendar-month">
                {dateRange.map((date, dayIndex) => {
                  const allotmentData = groupedByCategory[categoryName].find(
                    (item) => {
                      const fromDate = new Date(item.from_date);
                      const toDate = new Date(item.to_date);
                      return date >= fromDate && date <= toDate;
                    }
                  );

                  const priceDateRange = contractCop.find((contractGroup) =>
                    contractGroup.some(
                      (contractItem) =>
                        date >= new Date(contractItem?.from_date) && categoryName==contractItem.room?.name &&
                        date <= new Date(contractItem?.to_date)
                    )
                  );
                  
                  
                  const handleClickDate = () => {
                    setOpenAllotmentData(true);
                    setSelectedAllotment({ ...allotmentData, clickedDate: date });
                    setPricesOverride(priceDateRange); 
                  };

                  return (
                    <div
                      key={dayIndex}
                      className={`calendar-day h-[42px] ${
                        date > yesterday &&
                        allotmentData?.allotment > 0 &&
                        priceDateRange
                          ? "bg-green-600 text-white"
                          : allotmentData?.allotment > 0 && !priceDateRange
                          ? "bg-[#c9c9c9] text-white"
                          : allotmentData?.allotment === 0
                          ? "bg-[#e40b0b] text-white"
                          : allotmentData?.allotment > 0
                          ? "bg-white text-black"
                          : priceDateRange && !allotmentData?.allotment
                          ? "bg-[#c9c9c9]"
                          : ""
                      }`}
                    >
                      {allotmentData ? (
                        <div
                          className="cursor-pointer"
                          onClick={handleClickDate}
                        >
                          {allotmentData?.allotment}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    );
  };


  
// Initialize a new array to collect updated grouped data
const updatedGroupedData = [];

// Iterate over each element in compressData
compressData.forEach((elementB) => {
    // Extract month and year from the fromDate of elementB
    const { from_date } = elementB;
    const fromDateB = new Date(from_date);
    const monthB = fromDateB.getMonth();
    const yearB = fromDateB.getFullYear();

    // Iterate over each category in elementB
    elementB.data_packets_of_categories.forEach((categoryB) => {
        // Iterate over each room in the grouped_data of categoryB
        categoryB.grouped_data.forEach((roomB) => {
            // Extract month from the fromDate of roomB
            const groupFromDateB = new Date(roomB.from_date);
            const monthA = groupFromDateB.getMonth();
            const yearA = groupFromDateB.getFullYear();

            // Check if there's an elementA in record with the same month and year
            const isMonthYearMatch = record.some((elementA) => {
                const fromDateA = new Date(elementA.from_date);
                return fromDateA.getMonth() === monthB && fromDateA.getFullYear() === yearB;
            });

            // If there's no elementA with the same month and year, add elementB to record
            if (!isMonthYearMatch) {
                record.push({ ...elementB });
            }

            // Check if roomB's id is different from all rooms in record for the same month
            const roomExists = record.some((elementA) => {
                const fromDateA = new Date(elementA.from_date);
                const roomFound = fromDateA.getMonth() === monthA && fromDateA.getFullYear() === yearA &&
                    elementA.data_packets_of_categories.some(cat => cat.name === categoryB.name &&
                        cat.grouped_data.some(r => r.room.id === roomB.room.id));
                return roomFound;
            });

            // If roomB's id is not found, add it to updatedGroupedData
            if (!roomExists) {
                updatedGroupedData.push({ ...roomB });
            }
        });
    });
});

// Update record with updatedGroupedData
updatedGroupedData.forEach((roomB) => {
    const monthB = new Date(roomB.from_date).getMonth();
    const yearB = new Date(roomB.from_date).getFullYear();
    
    const categoryIndex = record.findIndex((element) => {
        const fromDate = new Date(element.from_date);
        return fromDate.getMonth() === monthB && fromDate.getFullYear() === yearB;
    });

    if (categoryIndex !== -1) {
        const categoryA = record[categoryIndex].data_packets_of_categories.find((cat) => cat.name === roomB.name);
        if (categoryA) {
            if (!categoryA.grouped_data) {
                categoryA.grouped_data = [];
            }
            categoryA.grouped_data.push({ ...roomB });
        }
    }
});

  return (
   loading? <Spin/>: <Suspense fallback={<Spin />} className="relative mb-[200px] h-full w-full">
      <div className="relative h-[40px]">
        <Button
          onClick={showModal}
          className="button-bar absolute right-0 -mt-3"
          icon={<PlusOutlined />}
        >
          Add Allotment
        </Button>
        <Modal
          className=""
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <RelAndAllotment
            handleCancel={handleCancel}
            id={id}
            getAllContractData={getAllContractData}
            categoryData={categoryData}
          />
        </Modal>
        <Modal
          className=""
          footer={false}
          open={openAllotmentData}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <CalendarDetails
            handleCancel={handleCancel}
            getAllContractData={getAllContractData}
            allotmentData={selectedAllotment}
            pricesOverride={pricesOverride}
            id={id}
            hotel_id={hotel_id}
          />
        </Modal>
      </div>
      { record
            ?.sort((a, b) => {
              const aFromDate = new Date(a.from_date);
              const bFromDate = new Date(b.from_date);
              return aFromDate - bFromDate;
            })
            ?.map((categoryGroup, groupIndex) => (
              <div key={groupIndex} className="flex flex-row items-center">
                {generateDateRange(categoryGroup.data_packets_of_categories)}
              </div>
            ))}
    </Suspense>
  );
};

export default AvailabilityCalendar;
