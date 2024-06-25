import {
  Button,
  DatePicker,
  Input,
  Modal,
  Popover,
  Select,
  Spin,
  Table,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import { PlusOutlined } from "@ant-design/icons";
import GetAllHotels from "../../components/Helper/GetAllHotels";
import GetAllUsers from "../../components/Helper/GetAllUsers";
import GetAllServices from "../../components/Helper/GetAllServices";

import { formatDate } from "../../components/Helper/FormatDate";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import GetPackageByID from "../../components/Helper/GetPackageByID";
import { EditIcon } from "../../components/Customized/EditIcon";
import { BASE_URL } from "../../components/API/APIURL";
import { useLocation } from "react-router-dom";
const formData2 = new FormData();
const timestamp = new Date().toLocaleDateString();
const minDate = new Date(timestamp);

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditPackage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const record = searchParams.get("record");
  const parsedRecord = record ? JSON.parse(record) : null;

  const [rowData, setRowData] = useState({});
  const { userUnderHotel, usersUnderDMC, userAgent } = GetAllUsers();
  const { hotelValue } = GetAllHotels();
  const { servicesValue } = GetAllServices();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [hotelById, setHotelById] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const imageArray = parsedRecord.links_of_images.map((image) => ({
    id: image.id,
    uid: image.link,
    name: `image_${image.id}.jpeg`,
    status: "done",
    url: `${BASE_URL}${image.link}`,
  }));

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const [activeItem, setActiveItem] = useState(0);
  const [imageList, setImagelist] = useState(imageArray || []);
  const [toggle, setToggle] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    child_age_from: parsedRecord?.child_age_from ?? "",
    child_age_to: parsedRecord?.child_age_to ?? "",
    name: parsedRecord?.name ?? "",
    package_id: parsedRecord?.id ?? "",
    owner_id: parsedRecord?.owner_id ?? "",
    owner_type: parsedRecord?.owner_type ?? "",
    is_this_created_by_owner: parsedRecord?.is_this_created_by_owner ?? "",
    description: parsedRecord?.description ?? "",
    youtube_link: parsedRecord?.youtube_link ?? "",
    price_if_fixed: parsedRecord?.price_if_fixed ?? "",
    profit_of_seller: parsedRecord?.profit_of_seller ?? "",
    discount: parsedRecord?.discount ?? "",
    from_date: parsedRecord?.from_date ?? "",
    to_date: parsedRecord?.to_date ?? "",
    fixed_price_adult: parsedRecord?.fixed_price_adult ?? "",
    fixed_price_child: parsedRecord?.fixed_price_child ?? "",
  });
  const {
    child_age_from,
    child_age_to,
    name,
    package_id,
    owner_id,
    owner_type,
    is_this_created_by_owner,
    description,
    youtube_link,
    discount,
    from_date,
    to_date,
    fixed_price_adult,
    fixed_price_child,
    meal,
    room_id,
    contract_id,
    hotel_id,
    service_id,
    rooms_day,
  } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { PackgeByID, fetchPackgeByID } = GetPackageByID(package_id);

  const onSubmitImg = async () => {
    if (fileList.length === 0) {
      return;
    }
    setLoading(true);
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const images = fileList.map((item) => item.originFileObj);
    const mutation = `
   mutation (  $images: [Upload]) {
    add_images_of_packages(
      images: $images
      package_id: ${package_id}
      ) {
      respmessage
  }
   }
`;
    console.log(rowData);

    const path = "";
    try {
      formData2.delete("operations");
      formData2.delete("map");
      formData2.forEach((value, key) => {
        if (!["operations", "map"].includes(key)) {
          formData2.delete(key);
        }
      });
      let array = [];
      for (let i = 0; i < images.length; i++) {
        array.push(null);
      }
      const operations = JSON.stringify({
        query: mutation,
        variables: {
          images: array,
        },
      });
      formData2.append("operations", operations);
      let stringformap = {};
      for (let i = 0; i < images.length; i++) {
        stringformap[i.toString()] = ["variables.images." + i.toString()];
      }
      const map = JSON.stringify(stringformap);
      formData2.append("map", map);
      for (let i = 0; i < images.length; i++) {
        formData2.append(i.toString(), images[i]);
      }

      const res = await POST_API(path, formData2, headers);
      if (res.data) {
        setLoading(false);
        message.success(res.data.add_images_of_packages?.respmessage);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const onSubmitRoom = async () => {
    if (!package_id || !room_id || !contract_id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        add_rooms_under_package(
          package_id: ${package_id},
          rooms_under_package: [{ day: ${rooms_day}, hotel_id: ${
      hotel_id || 0
    }, contract_id: ${contract_id}, room_id: ${room_id}, meal: "${meal}" }]
  
        )  {
          respmessage
        }
      }
    `;

    const path = "";
    setLoading(true);
    try {
      const res = await POST_API(
        path,
        JSON.stringify({ query: mutation }),
        headers
      );
      if (res) {
        setLoading(false);
        fetchPackgeByID();
        message.success(res.data.add_rooms_under_package?.respmessage);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const onSubmitServices = async () => {
    if (!package_id || !service_id || !rooms_day) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        add_services_under_package(
          package_id: ${package_id},
          services_under_package: [{ day: ${rooms_day}, service_id: ${service_id} }]
        )  {
          respmessage
        }
      }
    `;

    const path = "";
    setLoading(true);
    try {
      const res = await POST_API(
        path,
        JSON.stringify({ query: mutation }),
        headers
      );
      if (res) {
        setLoading(false);
        fetchPackgeByID();
        message.success(res.data.add_services_under_package?.respmessage);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const onSubmit = async () => {
    if (package_id) {
      return;
    }

    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        add_a_package(
          is_this_created_by_owner: ${is_this_created_by_owner}
          owner_type: ${owner_type}
          owner_id: ${owner_id}
            name: "${name}"
            youtube_link: "${youtube_link}"
            description: "${description}"
        ) {
            id
        }
      }
    `;

    const path = "";
    setLoading(true);
    try {
      const res = await POST_API(
        path,
        JSON.stringify({
          query: mutation,
        }),
        headers
      );
      if (res.data && !res.errors) {
        setLoading(false);
        message.success("Successful");
        setFormData((prev) => ({
          ...prev,
          package_id: res.data?.add_a_package?.id,
        }));
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const items = ["Content", "Itinerary", "Price"];
  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const Columns = [
    {
      title: "item type",
      dataIndex: "itemtype",
      key: "itemtype",
    },
    {
      title: "hotel/Service",
      dataIndex: "hotelOrService",
      key: "hotelOrService",
    },
    {
      title: "contract",
      dataIndex: "contract",
      key: "contract",
    },
    {
      title: "room",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "meal",
      dataIndex: "meal",
      key: "meal",
    },
    {
      title: "action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const dataArray = [
    {
      key: "dataary",
      itemtype: (
        <Select
          value={toggle}
          className="w-[120px]"
          onChange={(value) => setToggle(value)}
          options={[
            { value: "hotel", label: "Hotel" },
            { value: "service", label: "Service" },
          ]}
        />
      ),
      meal: (
        <Select
          value={meal}
          options={
            toggle === "hotel" && [
              // { value: "N/A", label: "N/A" },
              { value: "ROOM ONLY", label: "ROOM ONLY" },
              { value: "BREAKFAST", label: "BREAKFAST" },
              { value: "HB", label: "HB" },
              { value: "FB", label: "FB" },
              { value: "SOFT ALL INC", label: "SOFT ALL INC" },
              { value: "ALL INC", label: "ALL INC" },
              { value: "ULTRA ALL INC", label: "ULTRA ALL INC" },
            ]
          }
          onChange={(value) => {
            setFormData((prevData) => ({
              ...prevData,
              meal: value,
            }));
          }}
          className="w-[160px] border-black"
        />
      ),
      room: (
        <Select
          value={room_id}
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          className="input-style w-[200px] inputfildinsearch-bg"
          options={hotelById?.rooms?.map((item) => ({
            value: item.id ? item.id : "",
            label: item.name ? item.name : "",
          }))}
          onChange={(value) => {
            setFormData((prevData) => ({
              ...prevData,
              room_id: value,
            }));
          }}
        />
      ),
      hotelOrService: (
        <Select
          value={
            toggle === "service"
              ? service_id
              : toggle === "hotel"
              ? hotel_id
              : ""
          }
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          className="input-style w-[200px]  inputfildinsearch-bg"
          options={
            toggle === "service"
              ? servicesValue.map((item) => ({
                  value: item.id ? item.id : "",
                  label: item.name ? item.name : "",
                }))
              : toggle === "hotel"
              ? hotelValue.map((item) => ({
                  value: item.id ? item.id : "",
                  label: item.name ? item.name : "",
                }))
              : []
          }
          onChange={(value) => {
            setFormData((prevData) => ({
              ...prevData,
              [toggle === "service" ? "service_id" : "hotel_id"]: value,
            }));
            const hotelValueById = hotelValue.find((item) => item.id === value);
            setHotelById(hotelValueById);
          }}
        />
      ),
      contract: (
        <Select
          value={contract_id}
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          className="input-style w-[200px]  inputfildinsearch-bg"
          options={hotelById?.Live_static_contracts?.map((item) => ({
            value: item.id ? item.id : "",
            label: item.name ? item.name : "",
          }))}
          onChange={(value) => {
            setFormData((prevData) => ({
              ...prevData,
              contract_id: value,
            }));
          }}
        />
      ),
      action: (
        <Button
          onClick={() => {
            if (service_id) {
              onSubmitServices();
            }
            if (hotel_id) {
              onSubmitRoom();
            }
          }}
          className="list-btn"
        >
          Add New
        </Button>
      ),
    },
  ];

  const packageServices =
    PackgeByID.services_under_package_grouped_by_date || [];
  const roomLength =
    PackgeByID.rooms_under_package_grouped_by_date?.length || 0;

  // Calculate the difference in lengths
  const serviceAndRoomDifference = roomLength - packageServices.length;

  // Add empty items to packageServices to match the length of PackgeByID.rooms_under_package_grouped_by_date
  const updatedPackageServices = packageServices.concat(
    Array.from({ length: serviceAndRoomDifference }, () => "")
  );

  const renderTables = () => {
    if (
      PackgeByID.length === 0 &&
      !PackgeByID.services_under_package_grouped_by_date &&
      !PackgeByID.rooms_under_package_grouped_by_date
    ) {
      return null;
    }

    return updatedPackageServices?.map((entry, index) => {
      const servicesUnderPackage = entry?.services?.map((item, subIndex) => ({
        key: subIndex,
        itemtype: "Service",
        hotelOrService: item.service?.name || "",
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

      const roomsUnderPackage =
        PackgeByID.rooms_under_package_grouped_by_date?.[index]?.rooms?.map(
          (item, subIndex) => ({
            key: `${item.room?.id + "package"}`,
            room: item.room?.name || "",
            contract: item.contract?.name || "",
            meal: item.meal || "",
            hotelOrService: item.hotel?.name || "",
            itemtype: "Hotel",
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
          })
        );

      const roomAndServiceArray = [
        ...(Array.isArray(roomsUnderPackage) ? roomsUnderPackage : []),
        ...(Array.isArray(servicesUnderPackage) ? servicesUnderPackage : []),
      ];

      return (
        <div className="w-full mb-6" key={`day-${index}`}>
          <label className="labelStyle w-40">
            Day {/* Display the day number */}
            <Input
              onKeyPress={handleKeyPress}
              name="rooms_day"
              value={
                entry?.day ||
                PackgeByID.rooms_under_package_grouped_by_date?.[index]?.day
              }
              readOnly
              className="w-full border-black"
            />
          </label>
          <Table
            className="package-table"
            size="small"
            dataSource={roomAndServiceArray}
            columns={Columns}
            onRow={(record) => {
              return {
                onClick: () => {
                  setRowData(record);
                },
              };
            }}
          />
        </div>
      );
    });
  };

  const allImageList = [
    ...imageList,
    ...fileList.filter(
      (file) => !imageList.find((image) => image.uid === file.uid)
    ),
  ];

  return loading ? (
    <Spin />
  ) : (
    <div>
      <ul className="list-none tab-btn  flex justify-between my-4 max-w-[180px]">
        {items.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer capitalize ${
              activeItem === index ? "font-bold tab-btn-active" : ""
            }`}
            onClick={() => handleItemClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>
      {activeItem === 0 && (
        <div className="w-full capitalize flex gap-5 md:gap-10">
          <span className="w-full space-y-2 relative">
            <label className="labelStyle w-full">
              Package
              <Input
                name="name"
                value={name}
                onChange={onChange}
                placeholder="type Package name"
                className="w-full border-black"
              />
            </label>
            <label className="labelStyle w-full">
              youtube link
              <Input
                name="youtube_link"
                value={youtube_link}
                onChange={onChange}
                placeholder="type youtube link"
                className="w-full border-black"
              />
            </label>
            <span className="flex gap-3 mt-2">
              <label className="labelStyle w-full">
                from date
                <DatePicker
                  allowClear={false}
                  format={formatDate}
                  value={from_date ? dayjs(from_date) : null}
                  disabledDate={(current) =>
                    current && current < new Date(minDate)
                  }
                  className="w-full border-black"
                  placeholder="From Date:"
                  onChange={(value, dateString) => {
                    const dateObject = new Date(dateString ? dateString : null);
                    const isoString = dateObject.toISOString();
                    setFormData((prev) => ({
                      ...prev,
                      from_date: isoString,
                    }));
                  }}
                  suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
                />
              </label>
              <label className="labelStyle w-full">
                to date
                <DatePicker
                  allowClear={false}
                  format={formatDate}
                  value={to_date ? dayjs(to_date) : null}
                  disabledDate={(current) =>
                    current && current < new Date(from_date)
                  }
                  className="w-full border-black"
                  placeholder="To Date:"
                  onChange={(value, dateString) => {
                    const dateObject = new Date(dateString ? dateString : null);
                    const isoString = dateObject.toISOString();
                    setFormData((prev) => ({ ...prev, to_date: isoString }));
                  }}
                  suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
                />
              </label>
            </span>
            <span className="flex justify-between w-full">
              <label className="labelStyle w-[170px]">
                owner type
                <Select
                  className="inputfildinsearch"
                  value={owner_type}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      owner_type: value,
                      owner_id: "",
                    }))
                  }
                  options={[
                    { value: 4, label: "Users Under DMC" },
                    { value: 6, label: "Users Under Hotel" },
                  ]}
                />
              </label>
              <label className="labelStyle w-[170px]">
                owner ID
                <Select
                  className="inputfildinsearch"
                  value={owner_id}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, owner_id: value }))
                  }
                  options={
                    owner_type === 4
                      ? usersUnderDMC?.map((item) => ({
                          value: item.id ? item.id : "",
                          label: item.uname ? item.uname : "",
                        }))
                      : owner_type === 6
                      ? userUnderHotel.map((item) => ({
                          value: item.id ? item.id : "",
                          label: item.uname ? item.uname : "",
                        }))
                      : null
                  }
                />
              </label>
              <label className="labelStyle">
                created by owner
                <Select
                  className="inputfildinsearch"
                  value={is_this_created_by_owner}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_this_created_by_owner: value,
                    }))
                  }
                  options={[
                    { value: true, label: "true" },
                    { value: false, label: "false" },
                  ]}
                />
              </label>
            </span>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
                onSubmitImg();
              }}
              className="list-btn absolute -bottom-16 right-0"
            >
              Save Package
            </Button>
          </span>
          <span className="w-full space-y-2 -mt-2">
            <label className="labelStyle">Description</label>
            <TextArea
              name="description"
              value={description}
              onChange={onChange}
              placeholder="type description here"
              className="border-black"
              style={{ height: 70 }}
            />
            <br />
            <br />
            <label className="title">Package Images</label>
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              fileList={allImageList}
              customRequest={(file, onSuccess) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              )}
            </Upload>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt="example"
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </span>
        </div>
      )}
      {activeItem === 1 && (
        <div className="w-full">
          <div className="mb-5">
            <label className="labelStyle w-40">
              Day
              <Input
                onKeyPress={handleKeyPress}
                name="rooms_day"
                value={rooms_day}
                onChange={onChange}
                className="w-full border-black"
              />
            </label>
            <Table size="small" dataSource={dataArray} columns={Columns} />
          </div>
          {renderTables()}
        </div>
      )}
      {activeItem === 2 && (
        <div className="flex flex-col w-[800px]">
          <span className="flex gap-3 mt-2">
            <label className="labelStyle w-full">
              Fixed Price (Adult)
              <Input
                name="fixed_price_adult"
                value={fixed_price_adult}
                className="w-full"
              />
            </label>
            <label className="labelStyle w-full">
              Fixed Price (Child)
              <Input
                name="fixed_price_child"
                value={fixed_price_child}
                className="w-full"
              />
            </label>
          </span>
          <span className="flex gap-3 mt-2">
            <label className="labelStyle w-full">
              Child Age From
              <Input
                name="child_age_from"
                value={child_age_from}
                className="w-full"
              />
            </label>
            <label className="labelStyle w-full">
              Child Age To
              <Input
                name="child_age_to"
                value={child_age_to}
                className="w-full"
              />
            </label>
          </span>

          <label className="labelStyle mt-2">discount</label>
          <Input name="discount" value={discount} className="w-[50%]" />
          <Button className="list-btn mt-5 w-80">Save Price</Button>
        </div>
      )}
    </div>
  );
};

export default EditPackage;
