import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Rate,
  Select,
  Spin,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { POST_API } from "../../components/API/PostAPI";
import getAllHotelChains from "../../components/Helper/GetAllHotelChains";
import GetAllPlacesOfInterest from "../../components/Helper/GetAllPlacesOfInterest";
import GetAllFacilities from "../../components/Helper/GetAllFacilities";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import GetAllUsers from "../../components/Helper/GetAllUsers";
import { BASE_URL } from "../../components/API/APIURL";
import { GET_API } from "../../components/API/GetAPI";
import { useLocation, useNavigate } from "react-router-dom";
const apiKey = process.env.REACT_APP_PUBLIC_MAPS_API_KEY;
const formData2 = new FormData();

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function PlaceSearchAutocomplete() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <EditHotel />;
}

export const EditHotel = ({ address }) => {
  const { hotelChainValue } = getAllHotelChains();
  const { placeOfInterestValue } = GetAllPlacesOfInterest();
  const { facilityValue } = GetAllFacilities();
  const { accManager } = GetAllUsers();
  const router = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const record = searchParams.get("record");
  const parsedRecord = record ? JSON.parse(record) : null;

  const { Option } = Select;
  const [userLocation, setUserLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageList, setImagelist] = useState([]);
  const [FormData, setFormData] = useState({
    id: Number(parsedRecord?.hotelid) || "",
    country: parsedRecord?.country || "",
    city: parsedRecord?.city || "",
    name: parsedRecord?.name || "",
    default_markup_id: Number(parsedRecord?.default_markup_id) || 0,
    giataId: parsedRecord?.giataId || "",
    street: parsedRecord?.street ? parsedRecord?.street : "",
    latitude: parsedRecord?.latitude ? parsedRecord?.latitude : 0,
    longtude: parsedRecord?.longtude ? parsedRecord?.longtude : 0,
    description: parsedRecord?.description ? parsedRecord?.description : "",
    star_rating: parsedRecord?.star_rating ? parsedRecord?.star_rating : "",
    hotel_status: parsedRecord?.hotel_status ? parsedRecord?.hotel_status : "",
    phone_no: parsedRecord?.phone_no ? parsedRecord?.phone_no : "",
    email: parsedRecord?.email ? parsedRecord?.email : "",
    google_place_id: parsedRecord?.google_place_id || 0,
    id_acc_mngr: Number(parsedRecord?.id_acc_mngr?.id) || 0,
    id_of_place_of_intrst: parsedRecord?.place_of_intrst || 0,
    id_of_hotel_chain: parsedRecord?.hotel_chain || 0,
    facility_ids:
      parsedRecord?.facilities?.map((item) =>
        parseInt(item.facility?.id, 10)
      ) || [],
  });

  const {
    id,
    name,
    country,
    city,
    street,
    latitude,
    longtude,
    description,
    star_rating,
    hotel_status,
    phone_no,
    website,
    email,
    id_acc_mngr,
    id_of_place_of_intrst,
    id_of_hotel_chain,
    facility_ids,
    giataId,
    google_place_id,
    default_markup_id,
  } = FormData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const getImages = async () => {
    const GET_ALL = `{
      get_image_links_by_a_hotel_id(hotel_id: ${id}) {
        id
        link_for_image
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data) {
        const tableArray = res.data.get_image_links_by_a_hotel_id.map(
          (image) => ({
            id: image.id,
            uid: image.uid,
            name: `image_${image.id}.jpeg`,
            status: "done",
            url: `${BASE_URL}${image.link_for_image}`,
          })
        );
        setImagelist(tableArray);
        setLoading(false);
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const variables = {
      facility_ids: facility_ids.map((item) => ({ facility_id: item })),
    };
    const mutation = `
    mutation {
      edit_a_hotel(
        id: ${id},
        google_place_id: "${google_place_id}",
        name: "${name}",
      country: "${country || ""}",
      city: "${city || ""}",
      street: "${street || ""}",
      latitude: "${latitude || ""}",
      longtude: "${longtude || ""}",
      description: "${description || ""}",
      star_rating: ${star_rating || ""},
      hotel_status: "${hotel_status || "Active"}",
      phone_no: "${phone_no || ""}",
      email: "${email || ""}",
      id_acc_mngr: ${id_acc_mngr || ""},
      id_of_place_of_intrst: ${id_of_place_of_intrst || ""},
      id_of_hotel_chain: ${id_of_hotel_chain || ""},
      giataId: "${giataId}",
      default_selling_markup_id_if_hotel_makes_contract_for_itself : ${default_markup_id},
      ${JSON.stringify(variables)
        .replace(/"([^(")"]+)":/g, "$1:")
        .replace(/^\s*{|\}\s*$/g, "")}
    ) {
      id
      createdAt
      name
      country
      city
      street
      latitude
      longtude
      description
      star_rating
      hotel_status
      phone_no
      email
      giataId
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
      if (res.data) {
        setLoading(false);
        message.success("Hotel has been Updated Successfully");
        router("/Hotels");
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed to Update Hotel, Please check and try again");
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
    add_more_imges_to_a_hotel(
      images: $images
      id_of_hotel: ${id}
      ) {
      respmessage
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
      if (res.data && !res.errors) {
        message.success("Successful");
        getImages();
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const DeleteImg = async (a) => {
    if (!a.id) {
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
   mutation {
    delete_an_image_of_hotel_by_id(
      id: ${a.id}
      ) {
      respmessage
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
      if (res.data && !res.errors) {
        message.success("Successful");
        getImages();
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const handleChangeAddress = (newAddress) => {
    userLocation && setUserLocation(newAddress);
  };

  const handleSelectAddress = (newAddress) => {
    geocodeByAddress(newAddress)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        setFormData((prev) => ({ ...prev, latitude: lat, longtude: lng }))
      )
      .catch((error) => console.error("Error", error));
  };

  const handleSuggestionClick = (suggestion) => {
    setUserLocation(suggestion.description);
    const hotelName = suggestion.formattedSuggestion.mainText;

    // Use geocodeByAddress to get more details
    geocodeByAddress(suggestion.description)
      .then((results) => {
        const place = results[0];
        if (place) {
          // Extract the desired address components
          const country = place.address_components.find((component) =>
            component.types.includes("country")
          )?.long_name;

          const city = place.address_components.find(
            (component) =>
              component.types.includes("locality") ||
              component.types.includes("administrative_area_level_2")
          )?.long_name;

          const street = place.address_components.find(
            (component) =>
              component.types.includes("route") ||
              component.types.includes("sublocality")
          )?.long_name;

          setFormData((prev) => ({
            ...prev,
            country: country || "",
            city: city || "",
            street: street || "",
            name: hotelName || "",
          }));
        }
      })
      .catch((error) => {
        console.error("Error geocoding address:", error);
      });
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
  const filteredPlaceOfInterest = placeOfInterestValue
    ?.filter((item) => item.country === country)
    .map((item) => ({
      value: item.id ? item.id : "",
      label: item.name ? item.name : "",
    }));

  useEffect(() => {
    getImages();
  }, []);
  const allImageList = [
    ...imageList,
    ...fileList.filter(
      (file) => !imageList?.find((image) => image.uid === file.uid)
    ),
  ];

  return (
    <section className="">
      {loading ? (
        <Spin />
      ) : (
        <form onSubmit={onSubmit}>
          <div className="flex justify-between mt-2">
            <div className="w-full">
              <label className="block font-semibold">Hotel Name</label>
              <PlacesAutocomplete
                value={userLocation}
                onChange={handleChangeAddress}
                onSelect={handleSelectAddress}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <Input
                      {...getInputProps({
                        placeholder: "start typing hotel name",
                        className: "input-style",
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const className = suggestion.active
                          ? "h-full bg-black"
                          : "bg-white";
                        // Inline style for demonstration purpose
                        const style = suggestion.active
                          ? { backgroundColor: "#fafafa", cursor: "pointer" }
                          : { backgroundColor: "#ffffff", cursor: "pointer" };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                              onClick: () => handleSuggestionClick(suggestion),
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
              <label className="label-style mt-1">hotel name</label>
              <Input
                name="name"
                value={name}
                onChange={onChange}
                className="input-style-bg"
                placeholder=""
              />
              <label className="label-style mt-1">Country</label>
              <Input
                name="country"
                value={country}
                onChange={onChange}
                className="input-style-bg"
                placeholder=""
              />
              <label className="label-style mt-1">City</label>
              <Input
                name="city"
                value={city}
                onChange={onChange}
                className="input-style-bg"
                placeholder=""
              />
              <label className="label-style mt-1">Street</label>
              <Input
                name="street"
                value={street}
                onChange={onChange}
                className="input-style-bg"
                placeholder=""
              />
              <label className="label-style mt-1">place ID</label>
              <Input
                name="placeId"
                value={google_place_id}
                onChange={onChange}
                className="input-style-bg"
                placeholder=""
                readOnly
              />
              <label className="label-style mt-1">Giata ID</label>
              <Input
                name="giataId"
                value={giataId}
                onChange={onChange}
                className="input-style"
                placeholder=""
              />
              <label className="label-style mt-1">default selling markup</label>
              <Input
                name="default_markup_id"
                value={default_markup_id}
                onChange={onChange}
                className="input-style"
                placeholder=""
              />
              <label className="labelStyle mt-1">
                Area / Place of interest
              </label>
              <Select
                showSearch
                value={id_of_place_of_intrst}
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
                style={{ width: 500 }}
                options={filteredPlaceOfInterest}
                onChange={(value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    id_of_place_of_intrst: Number(value),
                  }));
                }}
              />
              <label className="labelStyle mt-1">Hotel Chain</label>
              <Select
                value={id_of_hotel_chain}
                showSearch
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
                className="w-[500px]"
                options={hotelChainValue}
                onChange={(value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    id_of_hotel_chain: Number(value),
                  }));
                }}
              />
              <label className="labelStyle mt-1">Phone Number</label>
              <Input
                name="phone_no"
                value={phone_no}
                onChange={onChange}
                className="input-style"
                onKeyPress={handleKeyPress}
                placeholder=""
              />
              <label className="labelStyle mt-1">Account Manager</label>
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
                value={id_acc_mngr}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, id_acc_mngr: value }))
                }
                options={
                  accManager
                    ? accManager?.map((item) => ({
                        key: item.id,
                        label: item.uname,
                        value: Number(item.id),
                      }))
                    : ""
                }
                className="input-style w-[500px]"
              />
              <label className="labelStyle mt-1">Email</label>
              <Input
                name="email"
                value={email}
                onChange={onChange}
                className="input-style"
                type="email"
                placeholder="start typing an email"
              />
              <label className="labelStyle mt-1">
                Website <span className=" text-blue-800">(Optional)</span>
              </label>
              <Input
                name="website"
                value={website}
                onChange={onChange}
                className="input-style"
                placeholder="start typing a website"
              />
              <label className="labelStyle">Description</label>
              <TextArea
                name="description"
                value={description}
                onChange={onChange}
                className="w-[500px] mb-5"
                style={{ height: 110 }}
              />
              <p>Star Rating</p>
              <Rate
                name="star_rating"
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    star_rating: value,
                  }))
                }
                defaultValue={3}
                allowHalf
                style={{ border: "1px black solid", padding: "2px 5px" }}
              />
              <p className="mt-5">Choose Facilities</p>
              <Checkbox.Group
                value={facility_ids}
                className="grid grid-cols-2 capitalize "
                style={{ width: "100%" }}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, facility_ids: value }));
                }}
              >
                {facilityValue
                  ? facilityValue.map((item) => (
                      <Checkbox key={item.id} value={Number(item.id)}>
                        {item.name}
                      </Checkbox>
                    ))
                  : ""}
              </Checkbox.Group>
              <Button htmlType="submit" className="list-btn w-[60%] mt-5 mb-10">
                Update
              </Button>
            </div>
            <div className="w-full mt-[20px] flex flex-col">
              <div className="w-[600px] h-[300px] object-contain">
                <GoogleMap
                  slot="action"
                  center={{ lat: latitude, lng: longtude }}
                  zoom={userLocation ? 16 : 4}
                  map-id="gmpid"
                  mapContainerClassName="map-container"
                  // onClick={handleMapClick}
                >
                  <MarkerF
                    position={{ lat: latitude, lng: longtude }}
                  ></MarkerF>
                </GoogleMap>
              </div>

              <div className="flex justify-between mt-2">
                <span>
                  <label>Longitude</label>
                  <Input
                    name="longtude"
                    readOnly
                    value={longtude}
                    onChange={onChange}
                  />
                </span>
                <span>
                  <label>Latitude</label>
                  <Input
                    name="latitude"
                    readOnly
                    value={latitude}
                    onChange={onChange}
                  />
                </span>
              </div>
              <div className="mt-4">
                <h1 className="calendar-head my-3">Hotel Images</h1>
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
              </div>
              <Button className="action-btn w-40" onClick={onSubmitImg}>
                Update Images
              </Button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};
