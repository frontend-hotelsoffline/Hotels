import { Button, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import { POST_API } from "../../components/API/PostAPI";

const RoomSetup = ({
  categoryData,
  hotel_id,
  id_from_contract_id,
  getAllContractData,
}) => {
  const [formData, setFormData] = useState({});
  const {
    category,
    occupancy,
    total_persons,
    min_adult,
    max_adult,
    max_child,
    no_of_beds,
    shared_bed,
    shared_supliment_type,
    shared_suppliment,
    max_age_in_extra_bed,
    no_of_extra_beds,
    extra_bed_suppliment,
    extra_suppliment_type,
    meals_included,
    max_child_age_in_shared,
  } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // if (!min_adult || !no_of_beds || !total_persons) {
    //   message.error("Please fill all required");
    //   return;
    // }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
          mutation {
            create_a_static_contract_body_room_setup_of_contract(
                id_from_contracts: ${id_from_contract_id}
                room_setup_of_contract: [
                    {
                      room_id_0_if_all: ${category}
                        occupancy: "${occupancy}"
                        total_persons: ${total_persons || -1}
                        min_adult: ${min_adult || -1}
                        max_adult: ${max_adult || -1}
                        max_child: ${max_child || -1}
                        no_of_beds: ${no_of_beds || -1}
                        shared_bed: ${shared_bed || false}
                        shared_supliment_type: "${shared_supliment_type || ""}"
                        shared_suppliment: ${shared_suppliment || -1}
                        max_child_age_in_shared: ${
                          max_child_age_in_shared || -1
                        }
                        no_of_extra_beds: ${no_of_extra_beds || -1}
                        max_age_in_extra_bed: ${max_age_in_extra_bed || -1}
                        extra_suppliment_type: "${extra_suppliment_type || ""}"
                        extra_bed_suppliment: ${extra_bed_suppliment || -1}
                        meals_included: "${meals_included || "false"}"
                      }]
            ) {
              id
            }
          }
        `;

    const path = "";
    try {
      const res = await POST_API(
        path,
        JSON.stringify({ query: mutation }),
        headers
      );
      if (res.data && !res.errors) {
        message.success("Successful");
        getAllContractData();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed");
    }
  };
  const options = [];
  const { Option } = Select;
  options.push(
    <Option key={0} value={0}>
      N/A
    </Option>
  );
  for (let i = 1; i <= 20; i++) {
    options.push(
      <Option key={i} value={i}>
        {i}
      </Option>
    );
  }
  const options1000 = [];
  options1000.push(
    <Option key={0} value={0}>
      N/A
    </Option>
  );
  for (let i = 1; i <= 1000; i++) {
    options1000.push(
      <Option key={i} value={i}>
        {i}
      </Option>
    );
  }

  const [roomSetupDataSource, setRoomSetupDataSource] = useState([]);
  // const roomSetuparray = [
  //   {
  //     category: (
  //       <Select
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, category: value }))
  //         }
  //         options={[
  //           { value: 0, label: "ALL" },
  //           ...categoryData?.map((item) => ({
  //             key: item.id,
  //             value: item.id,
  //             label: item.name,
  //           })),
  //         ]}
  //         className="relative w-[140px] h-[25px]"
  //       />
  //     ),
  //     occupancy: (
  //       <Select
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, occupancy: value }))
  //         }
  //         options={[
  //           { value: "ALL", label: "ALL" },
  //           { value: "SGL", label: "SGL" },
  //           { value: "DBL", label: "DBL" },
  //           { value: "TWN", label: "TWN" },
  //           { value: "TRPL", label: "TRPL" },
  //           { value: "QUAD", label: "QUAD" },
  //           { value: "UNIT", label: "UNIT" },
  //         ]}
  //         className="relative w-[70px] h-[25px]"
  //       />
  //     ),
  //     total_persons: (
  //       <Select
  //         value={total_persons}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, total_persons: value }))
  //         }
  //         className="relative w-[50px] h-[25px]"
  //       >
  //         {options}
  //       </Select>
  //     ),
  //     min_adult: (
  //       <Select
  //         value={min_adult}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, min_adult: value }))
  //         }
  //         className="relative w-[50px] h-[25px]"
  //       >
  //         {options}
  //       </Select>
  //     ),
  //     max_adult: (
  //       <Select
  //         value={max_adult}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, max_adult: value }))
  //         }
  //         className="relative w-[50px] h-[25px]"
  //       >
  //         {options}
  //       </Select>
  //     ),
  //     max_child: (
  //       <Select
  //         value={max_child}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, max_child: value }))
  //         }
  //         className="relative w-[50px] h-[25px]"
  //       >
  //         {options}
  //       </Select>
  //     ),
  //     no_of_beds: (
  //       <Select
  //         value={no_of_beds}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, no_of_beds: value }))
  //         }
  //         className="relative w-[50px] h-[25px]"
  //       >
  //         {options1000}
  //       </Select>
  //     ),
  //     shared_bed: (
  //       <Select
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, shared_bed: value }))
  //         }
  //         options={[
  //           { value: true, label: "Yes" },
  //           { value: false, label: "No" },
  //         ]}
  //         className="relative w-[60px] h-[25px]"
  //       />
  //     ),
  //     shared_supliment_type: (
  //       <Select
  //         value={shared_supliment_type}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, shared_supliment_type: value }))
  //         }
  //         options={[
  //           { value: "N/A", label: "N/A" },
  //           { value: "%", label: "%" },
  //           { value: "Amout", label: "Amount" },
  //         ]}
  //         className="relative w-[80px] h-[25px]"
  //       />
  //     ),
  //     shared_suppliment: (
  //       <Input
  //         value={shared_suppliment}
  //         name="shared_suppliment"
  //         onChange={onChange}
  //         className="relative w-[70px] h-[25px]"
  //         onKeyPress={handleKeyPress}
  //         readOnly={shared_supliment_type === "N/A"}
  //       />
  //     ),
  //     max_child_age_in_shared: (
  //       <Select
  //         value={max_child_age_in_shared}
  //         name="max_child_age_in_shared"
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, max_child_age_in_shared: value }))
  //         }
  //         className="relative w-[50px] h-[25px]"
  //       >
  //         {options}
  //       </Select>
  //     ),
  //     no_of_extra_beds: (
  //       <Select
  //         value={no_of_extra_beds}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, no_of_extra_beds: value }))
  //         }
  //         className="relative w-[50px] h-[25px]"
  //       >
  //         {options1000}
  //       </Select>
  //     ),
  //     max_age_in_extra_bed: (
  //       <Select
  //         value={max_age_in_extra_bed}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, max_age_in_extra_bed: value }))
  //         }
  //         className="relative w-[50px] h-[25px]"
  //       >
  //         {options}
  //       </Select>
  //     ),
  //     extra_suppliment_type: (
  //       <Select
  //         value={extra_suppliment_type}
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, extra_suppliment_type: value }))
  //         }
  //         options={[
  //           { value: "N/A", label: "N/A" },
  //           { value: "%", label: "%" },
  //           { value: "Amout", label: "Amount" },
  //         ]}
  //         className="relative w-[80px] h-[25px]"
  //       />
  //     ),
  //     extra_bed_suppliment: (
  //       <Input
  //         value={extra_bed_suppliment}
  //         name="extra_bed_suppliment"
  //         onChange={onChange}
  //         className="relative w-[70px] h-[25px]"
  //         onKeyPress={handleKeyPress}
  //         readOnly={extra_suppliment_type === "N/A"}

  //       />
  //     ),
  //     meals_included: (
  //       <Select
  //         onChange={(value) =>
  //           setFormData((prev) => ({ ...prev, meals_included: value }))
  //         }
  //         options={[
  //           { value: "N/A", label: "N/A" },
  //           { value: "true", label: "Yes" },
  //           { value: "false", label: "No" },
  //         ]}
  //         className="relative w-[60px] h-[25px]"
  //       />
  //     ),
  //     action: (
  //       <Button onClick={onSubmit} className="relative save-btn">
  //         Save
  //       </Button>
  //     ),
  //   },
  // ];
  useEffect(() => {
    // setRoomSetupDataSource(roomSetuparray);
  }, [hotel_id, formData, categoryData]);
  return { roomSetupDataSource };
};

export default RoomSetup;
