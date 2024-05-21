"use client";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  Spin,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { POST_API } from "../../components/API/PostAPI";
import useCategories from "../../components/Helper/GetAllCategories";
import GetAllRoomView from "../../components/Helper/GetAllRoomView";
import GetAllAmenities from "../../components/Helper/GetAllAmenities";
import AddAmenity from "../Amenities/AddAmenity";
import AddRoomView from "../Room-View/AddRoomView";
import AddCategory from "../Categories/AddCategory";
import GetAllHotels from "../../components/Helper/GetAllHotels";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import { BASE_URL } from "../../components/API/APIURL";
import { GET_API } from "../../components/API/GetAPI";
import { useLocation, useNavigate } from "react-router-dom";
const formData2 = new FormData();

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const EditRoom = () => {
  const { categoryValue, getAllCategories } = useCategories();
  const { roomViewValue, getAllRoomV } = GetAllRoomView();
  const { amenityValue, getAllAmenity } = GetAllAmenities();
  const { hotelValue } = GetAllHotels();

  const [openAmenityModal, setOpenAmenityModal] = useState(false);
  const [openRoomViewModal, setOpenRoomViewModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const showAmenityModal = () => setOpenAmenityModal(true);
  const showRoomViewModal = () => setOpenRoomViewModal(true);
  const showCategoryModal = () => setOpenCategoryModal(true);

  const cancelModal = () => {
    setOpenAmenityModal(false);
    setOpenRoomViewModal(false);
    setOpenCategoryModal(false);
  };

  const router = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const record = searchParams.get("record");
  const parsedRecord = record ? JSON.parse(record) : null;

  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [imageList, setImagelist] = useState([]);
  const [FormData, setFormData] = useState({
    id: parsedRecord?.id || "",
    name: parsedRecord?.name || "",
    room_size: parsedRecord?.room_size || "",
    giataId: parsedRecord?.giataId || "",
    room_status: parsedRecord?.room_status || "",
    category_id: parsedRecord?.categories.id || "",
    hotel_id: parsedRecord?.hotels?.id || "",
    no_of_units: parsedRecord?.no_of_units || "",
    room_status: parsedRecord?.room_status || "",
    view_id: parsedRecord?.view.id || 0,
    SGL: parsedRecord?.is_SGL || false,
    DBL: parsedRecord?.is_DBL || false,
    TWN: parsedRecord?.is_TWN || false,
    TRPL: parsedRecord?.is_TRPL || false,
    QUAD: parsedRecord?.is_QUAD || false,
    UNIT: parsedRecord?.is_UNIT || false,
    priority: parsedRecord?.priority || "",
    amenity_ids:
      parsedRecord?.amenities?.map((item) => parseInt(item?.amenity?.id, 10)) ||
      [],
    description: parsedRecord?.description || "",
  });
  const {
    id,
    name,
    category_id,
    view_id,
    room_size,
    no_of_units,
    description,
    room_status,
    hotel_id,
    amenity_ids,
    SGL,
    DBL,
    TWN,
    TRPL,
    QUAD,
    UNIT,
    priority,
    tPax,
    minA,
    maxA,
    maxC,
    Beds,
    sBed,
    mcas,
    ebeds,
    maieb,
  } = FormData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const getImages = async () => {
    const GET_ALL = `{
      get_room_by_id(room_id: ${id}) {
        id
        images {
            id
            link_for_image
        }
    }
  }`;
    const query = GET_ALL;
    const path = "";
    // setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      if (res.data) {
        const tableArray = res.data.get_room_by_id.images?.map((image) => ({
          id: image.id,
          uid: image.uid,
          name: `image_${image.id}.jpeg`,
          status: "done",
          url: `${BASE_URL}${image.link_for_image}`,
        }));
        setImagelist(tableArray);
        setLoading(false);
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const variables = {
      amenity_ids: amenity_ids.map((item) => ({ amenity_id: item })) || "",
    };
    const mutation = `
  mutation  {
    editRoom(
      id: ${id},
      name: "${name ? name : ""}"
        SGL: ${SGL}
        DBL: ${DBL}
        TWN: ${TWN}
        TRPL: ${TRPL}
        QUAD: ${QUAD}
        UNIT: ${UNIT}
        catId: ${category_id ? category_id : ""},
        viewId: ${view_id ? view_id : ""},
        size_sqm: ${room_size ? room_size : ""},
        no_units: ${no_of_units ? no_of_units : ""},
        desc: "${description ? description : ""}",
        status: ${room_status}
        hId: ${hotel_id ?? 0}
        prio: ${priority ?? 0}
        images: $images
        tPax: ${tPax || -1}
        minA: ${minA || -1}
        maxA: ${maxA || -1}
        maxC: ${maxC || -1}
        Beds: ${Beds || ""}
        sBed: ${sBed || false}
        mcas: ${mcas || ""}
        ebeds: ${ebeds || ""}
        maieb: ${maieb || ""}
      ${JSON.stringify(variables)
        .replace(/"([^(")"]+)":/g, "$1:")
        .replace(/^\s*{|\}\s*$/g, "")}
    ) {
        message
    } }
`;
    const path = "";
    // setLoading(true);
    try {
      const res = await POST_API(
        path,
        JSON.stringify({
          query: mutation,
        }),
        headers
      );
      if (res.data.editRoom?.message) {
        setLoading(false);
        router("/Rooms");
        message.success(res.data.editRoom?.message);
      } else {
        message.error(res.data.editRoom?.message);
      }
    } catch (error) {
      message.error("Failed, please check and try again");
    }
  };

  const onSubmitImg = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const images = fileList.map((item) => item.originFileObj);
    const mutation = `
   mutation (  $images: [Upload]) {
    addRImgs(
      images: $images
      rid: ${id}
      ) {
      message
  }
   }
`;
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
      if (res.data.addRImgs?.message === "success") {
        message.success(res.data.addRImgs?.message);
      } else {
        message.error(res.data.addRImgs?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const DeleteImg = async (a) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
   mutation {
    delRImg(
      id: ${a.id}
      ) {
      message
  }}
`;
    const path = "";
    try {
      const res = await POST_API(
        path,
        JSON.stringify({
          query: mutation,
        }),
        headers
      );
      if (res.data.delRImg?.message === "success") {
        message.success(res.data.delRImg?.message);
      } else {
        message.error(res.data.delRImg?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
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

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const occupancyOptions = [
    { value: "SGL", label: "SGL" },
    { value: "TRPL", label: "TRPL" },
    { value: "DBL", label: "DBL" },
    { value: "QUAD", label: "QUAD" },
    { value: "TWN", label: "TWN" },
    { value: "UNIT", label: "UNIT" },
  ];

  const handleCheckboxChange = (checkedValues) => {
    setFormData((prev) => ({
      ...prev,
      ...Object.fromEntries(
        occupancyOptions.map(({ value }) => [
          value,
          checkedValues.includes(value),
        ])
      ),
    }));
  };
  const options = [];
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

  const allImageList = [
    ...imageList,
    ...fileList.filter(
      (file) => !imageList.find((image) => image.uid === file.uid)
    ),
  ];

  useEffect(() => {
    getImages();
  }, []);

  return (
    <section className="capitalize">
      {loading ? (
        <Spin />
      ) : (
        <form onSubmit={onSubmit}>
          <div className="flex justify-between gap-5 md:gap-20 mt-2 pb-5 mb-10">
            <div className="w-full relative">
              <label className="block font-semibold">Room Name</label>
              <Input
                name="name"
                value={name}
                onChange={onChange}
                className="input-style"
                placeholder="start typing room name"
              />
              <span className="labelStyle mt-1">
                Category
                <Button
                  className="border-none capitalize"
                  onClick={showCategoryModal}
                >
                  create category
                </Button>
                <Modal
                  open={openCategoryModal}
                  onCancel={cancelModal}
                  onOk={cancelModal}
                  footer={false}
                >
                  <AddCategory
                    getCategory={getAllCategories}
                    handleCancel={cancelModal}
                  />
                </Modal>
              </span>
              <Select
                value={category_id}
                showSearch
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
                className="input-style w-full"
                options={categoryValue}
                onChange={(value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    category_id: Number(value),
                  }));
                }}
              />
              <span className="labelStyle mt-1">
                Occupancy
                <Checkbox.Group
                  className="grid grid-cols-2 capitalize font-normal"
                  style={{ width: "100%" }}
                  options={occupancyOptions}
                  onChange={handleCheckboxChange}
                  value={Object.keys(FormData).filter((key) => FormData[key])}
                />
              </span>
              <label className="labelStyle mt-1">Room Order</label>
              <Input
                name="priority"
                value={priority}
                onChange={onChange}
                className="input-style"
                onKeyPress={handleKeyPress}
              />
              <span className="labelStyle mt-1">
                Room View
                <Button
                  className="border-none capitalize"
                  onClick={showRoomViewModal}
                >
                  create Room View
                </Button>
                <Modal
                  open={openRoomViewModal}
                  onCancel={cancelModal}
                  onOk={cancelModal}
                  footer={false}
                >
                  <AddRoomView
                    GetAllRoomView={getAllRoomV}
                    handleCancel={cancelModal}
                  />
                </Modal>
              </span>
              <Select
                value={view_id}
                showSearch
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
                className="input-style w-full"
                options={roomViewValue}
                onChange={(value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    view_id: value,
                  }));
                }}
              />
              <label className="labelStyle mt-1">
                Room size m<sup>2</sup>
              </label>
              <Input
                name="room_size"
                value={room_size}
                onChange={onChange}
                className="input-style"
                onKeyPress={handleKeyPress}
                placeholder=""
              />
              <label className="labelStyle mt-1">Number of Units</label>
              <Input
                name="no_of_units"
                value={no_of_units}
                onChange={onChange}
                className="input-style"
                onKeyPress={handleKeyPress}
              />
              <label className="labelStyle mt-1">Room Status</label>
              <Select
                value={room_status}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, room_status: value }))
                }
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
                className="input-style w-full"
              />
              <label className="labelStyle mt-1 w-full">hotel Name</label>
              <Select
                value={hotel_id}
                showSearch
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
                className="input-style w-full"
                options={hotelValue?.map((item) => ({
                  value: item.id || "",
                  label: item.name || "",
                }))}
                onChange={(value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    hotel_id: value,
                  }));
                }}
              />
              <p className="mt-5">
                Choose Amenities
                <Button
                  className="border-none capitalize"
                  onClick={showAmenityModal}
                >
                  create Amenities
                </Button>
                <Modal
                  open={openAmenityModal}
                  onCancel={cancelModal}
                  onOk={cancelModal}
                  footer={false}
                >
                  <AddAmenity
                    getAmenities={getAllAmenity}
                    handleCancel={cancelModal}
                  />
                </Modal>
              </p>
              <Checkbox.Group
                value={amenity_ids}
                className="grid grid-cols-2 capitalize "
                style={{ width: "100%" }}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, amenity_ids: value }));
                }}
              >
                {amenityValue
                  ? amenityValue.map((item) => (
                      <Checkbox key={item.id} value={Number(item.id)}>
                        {item.name}
                      </Checkbox>
                    ))
                  : ""}
              </Checkbox.Group>
            </div>
            <div className="w-full relative">
              <span className="w-full grid grid-cols-2 gap-x-5">
                <label className="labelStyle">
                  total persons
                  <Select
                    value={tPax}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, tPax: value }))
                    }
                    className="relative w-full"
                  >
                    {options}
                  </Select>
                </label>
                <label className="labelStyle">
                  min adult:
                  <Select
                    value={minA}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, minA: value }))
                    }
                    className="relative w-full"
                  >
                    {options}
                  </Select>
                </label>
                <label className="labelStyle">
                  max adult
                  <Select
                    value={maxA}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, maxA: value }))
                    }
                    className="relative w-full"
                  >
                    {options}
                  </Select>
                </label>
                <label className="labelStyle">
                  max child
                  <Select
                    value={maxC}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, maxC: value }))
                    }
                    className="relative w-full"
                  >
                    {options}
                  </Select>
                </label>
                <label className="labelStyle">
                  shared bed
                  <Select
                    value={sBed}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, sBed: value }))
                    }
                    options={[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" },
                    ]}
                    className="relative w-full"
                  />
                </label>

                <label className="labelStyle">
                  max child age in shared
                  <Select
                    value={mcas}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, mcas: value }))
                    }
                    className="relative w-full"
                  >
                    {options}
                  </Select>
                </label>
                <label className="labelStyle">
                  beds
                  <Select
                    value={Beds}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, Beds: value }))
                    }
                    className="relative w-full"
                  >
                    {options1000}
                  </Select>
                </label>

                <label className="labelStyle">
                  max age in extra bed
                  <Select
                    value={maieb}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, maieb: value }))
                    }
                    className="relative w-full"
                  >
                    {options}
                  </Select>
                </label>

                <label className="labelStyle">
                  extra bed suppliment:
                  <Input
                    value={ebeds}
                    name="ebeds"
                    onChange={onChange}
                    className="w-full"
                    onKeyPress={handleKeyPress}
                  />
                </label>
              </span>
              <label className="labelStyle">Description</label>
              <TextArea
                name="description"
                value={description}
                onChange={onChange}
                className="w-full mb-5"
                style={{ height: 90 }}
              />
              <div className="mt-4">
                <h1 className="calendar-head my-3">Room Images</h1>
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
                  onRemove={DeleteImg}
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
              </div>{" "}
              <Button className="action-btn w-40" onClick={onSubmitImg}>
                Update Images
              </Button>
              <Button
                htmlType="submit"
                className="button-bar absolute right-0 bottom-0"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default EditRoom;
