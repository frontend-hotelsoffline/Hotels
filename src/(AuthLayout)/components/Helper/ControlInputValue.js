import React, { useEffect, useState } from 'react'
import GetAllHotels from './GetAllHotels';

const ControlInputValue = (hotel_id) => {
    const { hotelValue } = GetAllHotels();
    const [Occupancy_and_category_cross, setOccupancy_and_category_cross] = useState([])

    useEffect(() => {
        const hotelRooms =
          hotelValue.find((item) => item.id === hotel_id)?.rooms || [];
    
        // Use Set to keep track of unique category names
        const uniqueCategoryNames = new Set();
    
        // Filter out duplicates and update categoryData
        const filteredCategoryData = hotelRooms.filter((item) => {
          if (!uniqueCategoryNames.has(item?.name)) {
            uniqueCategoryNames.add(item?.name);
            return true;
          }
          return false;
        });
    
        let temp_arry_occupncy_and_category = [];
        for (let i = 0; i < hotelRooms.length; i++) {
          var category_id_temp = hotelRooms[i].category.id;
          if (hotelRooms[i].is_SGL == true) {
            var json_item = { category_id: category_id_temp, occupancy: "is_SGL" };
            if (
              !temp_arry_occupncy_and_category.some(
                (obj) => JSON.stringify(obj) === JSON.stringify(json_item)
              )
            ) {
              temp_arry_occupncy_and_category.push(json_item);
            }
          }
          if (hotelRooms[i].is_DBL == true) {
            var json_item = { category_id: category_id_temp, occupancy: "is_DBL" };
            if (
              !temp_arry_occupncy_and_category.some(
                (obj) => JSON.stringify(obj) === JSON.stringify(json_item)
              )
            ) {
              temp_arry_occupncy_and_category.push(json_item);
            }
          }
          if (hotelRooms[i].is_TWN == true) {
            var json_item = { category_id: category_id_temp, occupancy: "is_TWN" };
            if (
              !temp_arry_occupncy_and_category.some(
                (obj) => JSON.stringify(obj) === JSON.stringify(json_item)
              )
            ) {
              temp_arry_occupncy_and_category.push(json_item);
            }
          }
          if (hotelRooms[i].is_TRPL == true) {
            var json_item = { category_id: category_id_temp, occupancy: "is_TRPL" };
            if (
              !temp_arry_occupncy_and_category.some(
                (obj) => JSON.stringify(obj) === JSON.stringify(json_item)
              )
            ) {
              temp_arry_occupncy_and_category.push(json_item);
            }
          }
          if (hotelRooms[i].is_QUAD == true) {
            var json_item = { category_id: category_id_temp, occupancy: "is_QUAD" };
            if (
              !temp_arry_occupncy_and_category.some(
                (obj) => JSON.stringify(obj) === JSON.stringify(json_item)
              )
            ) {
              temp_arry_occupncy_and_category.push(json_item);
            }
          }
          if (hotelRooms[i].is_UNIT == true) {
            var json_item = { category_id: category_id_temp, occupancy: "is_UNIT" };
            if (
              !temp_arry_occupncy_and_category.some(
                (obj) => JSON.stringify(obj) === JSON.stringify(json_item)
              )
            ) {
              temp_arry_occupncy_and_category.push(json_item);
            }
          }
        }
        // now set it in the same order which the categories are in the array of filteredCategoryData
        let temp_arry_of_dta_after_softing_to_categories_order = [];
        for (let i = 0; i < filteredCategoryData.length; i++) {
          let temp_ary = [];
          for (let j = 0; j < temp_arry_occupncy_and_category.length; j++) {
            if (
              filteredCategoryData[i].category.id ==
              temp_arry_occupncy_and_category[j].category_id
            ) {
              temp_ary.push(temp_arry_occupncy_and_category[j].occupancy);
              // temp_arry_of_dta_after_softing_to_categories_order.push( temp_arry_occupncy_and_category[j] )
            }
          }
          temp_arry_of_dta_after_softing_to_categories_order.push({
            category_id: filteredCategoryData[i].category.id,
            array_of_occupancies: temp_ary,
          });
        }
        setOccupancy_and_category_cross(
          temp_arry_of_dta_after_softing_to_categories_order
        );
      }, [hotel_id, hotelValue]);
      
  return (
    {Occupancy_and_category_cross, hotelValue}
  )
}

export default ControlInputValue