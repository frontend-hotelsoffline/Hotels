"use client";
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
import Image from "next/image";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { POST_API } from "../../components/API/PostAPI";
import getAllHotelChains from "../../components/Helper/GetAllHotelChains";
import getAllPlacesOfInterest from "../../components/Helper/GetAllPlacesOfInterest";
import { useRouter } from "next/navigation";
import GetAllFacilities from "../../components/Helper/GetAllFacilities";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import AddPlacesOfInterest from "../Places-of-Interest/AddPlacesOfInterest";
import AddChains from "../Chains/AddChains";
import AddFacility from "../Facility/AddFacility";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import GetAllUsers from "../../components/Helper/GetAllUsers";
import GetAllPricingMarkUp from "../../components/Helper/GetAllPricingMarkUp";
const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

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
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <AddHotel />;
}

const AddHotel = ({ address }) => {
  const { hotelChainValue, getAllChains } = getAllHotelChains();
  const { placeOfInterestValue, getAllPlaces } = getAllPlacesOfInterest();
  const { facilityValue, getFacility } = GetAllFacilities();
  const { accManager } = GetAllUsers();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const router = useRouter();
  const [openPlaceOfInterestModal, setOpenPlaceOfInterestModal] =
    useState(false);
  const [openHotelChainModal, setOpenHotelChainModal] = useState(false);
  const [openFacilityModal, setOpenFacilityModal] = useState(false);
  const [loading, setLoading] = useState(false)

  const showPlaceOfInterestModal = () => {
    setOpenPlaceOfInterestModal(true);
  };
  const showHotelChainModal = () => setOpenHotelChainModal(true);
  const showFacilityModal = () => setOpenFacilityModal(true);

  const cancelModal = () => {
    setOpenFacilityModal(false);
    setOpenPlaceOfInterestModal(false);
    setOpenHotelChainModal(false);
  };

  const { Option } = Select;
  const [userLocation, setUserLocation] = useState("");
  const [FormData, setFormData] = useState({
    latitude: 25,
    longtude: 55,
    star_rating: 0,
    hotel_status: "Active",
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !country ||
      !city ||
      !latitude ||
      !longtude ||
      !id_of_place_of_intrst ||
      !id_of_hotel_chain ||
      !facility_ids ||
      !giataId || !fileList.length>0
    ) {
      message.error("Please fill required fields");
      return;
    }
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const FacilityVariables = {
      facility_ids: facility_ids
        ? facility_ids.map((item) => ({ facility_id: item }))
        : "",
    };
    const images = fileList.map((item) => item.originFileObj);
    const mutation = `
    mutation (  $images: [Upload]) {
      add_a_hotel(
        google_place_id: "${google_place_id}",
        name: "${name ? name : ""}",
      country: "${country ? country : ""}",
      city: "${city ? city : ""}",
      street: "${street ? street : ""}",
      latitude: "${latitude ? latitude : ""}",
      longtude: "${longtude ? longtude : ""}",
      description: "${description ? description : ""}",
      star_rating: ${star_rating},
      hotel_status: "${hotel_status}",
      phone_no: "${phone_no ? phone_no : ""}",
      email: "${email ? email : ""}",
      id_acc_mngr: ${id_acc_mngr ? id_acc_mngr : ""},
      id_of_place_of_intrst: ${
        id_of_place_of_intrst ? id_of_place_of_intrst : ""
      },
      id_of_hotel_chain: ${id_of_hotel_chain ? id_of_hotel_chain : ""},
      giataId: "${giataId}",
      default_selling_markup_id_if_hotel_makes_contract_for_itself : ${
        default_markup_id || 0
      }
      ${JSON.stringify(FacilityVariables)
        .replace(/"([^(")"]+)":/g, "$1:")
        .replace(/^\s*{|\}\s*$/g, "")}
      images: $images
    ) {
      id
    }
  }
`;
    const path = "";
    setLoading(true)
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
      if (res && !res.errors) {
        setLoading(false)
        message.success("Hotel has been Added Successfully");
        router("/Hotels");
      }else{
        message.error(res?.errors?.message)
      }
    } catch (error) {
      message.error("Failed to Add Hotel, Please check and try again");
    }
  };

  const handleChangeAddress = (newAddress) => {
    setUserLocation(newAddress);
  };

  const handleSelectAddress = (newAddress) => {
    geocodeByAddress(newAddress)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        setFormData((prev) => ({ ...prev, latitude: lat, longtude: lng }))
      )
      .catch((error) => message.error("Error", error));
  };

  // const handleMapClick = (mapProps) => {
  //   const lat = mapProps.latLng.lat();
  //   const lng = mapProps.latLng.lng();
  //   geocodeByPlaceId(mapProps?.placeId)
  //   .then((result)=>{
  //     const place = result[0];
  //       if (place) {
  //         // Extract the desired address components
  //         const country = place.address_components.find((component) =>
  //           component.types.includes("country")
  //         )?.long_name;

  //         const city = place.address_components.find(
  //           (component) =>
  //             component.types.includes("locality") ||
  //             component.types.includes("administrative_area_level_2")
  //         )?.long_name;

  //         const street = place.address_components.find(
  //           (component) =>
  //             component.types.includes("route") ||
  //             component.types.includes("sublocality")
  //         )?.long_name;

  //         setFormData((prev) => ({
  //           ...prev,
  //           country: country || "",
  //           city: city || "",
  //           street: street || "",
  //         }));
  //       }
  //   })
  //   setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  // };

  const handleSuggestionClick = (suggestion) => {
    setUserLocation(suggestion.description);
    const hotelName = suggestion.formattedSuggestion.mainText;
    const placeID = suggestion.placeId;
    // Use geocodeByAddress to get more details
    geocodeByAddress(suggestion.description)
      .then((results) => {
        const place = results[0];
        if (place) {
          // Extract the desired address components
          const country = place.address_components.find((component) =>
            component.types.includes("country")
          )?.long_name;

          const city =
            place.address_components.find((component) =>
              component.types.includes("administrative_area_level_1")
            )?.long_name ||
            place.address_components.find((component) =>
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
            google_place_id: placeID || "",
          }));
        }
      })
      .catch((error) => {
        message.error("Error geocoding address:", error);
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

  return (
    <section className="capitalize">
     {loading ? <Spin/> : <form onSubmit={onSubmit}>
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
                          key={suggestion.placeId}
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
            <label className="label-style mt-1">place id</label>
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
            <label className="label-style mt-1">
            default selling markup
            </label>
            <Select
              name="default_markup_id"
              value={default_markup_id}
              showSearch
              filterOption={(input, option) =>
                (option?.label.toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, default_markup_id: value }))
              }
              options={
                MarkUpValue
                  ? MarkUpValue?.map((item) => ({
                      key: item.id,
                      label: item.name,
                      value: Number(item.id),
                    }))
                  : ""
              }
              className="input-style w-[500px]"
            />
            <span className="labelStyle mt-1">
              Area / Place of interest
              <Button
                className="border-none capitalize"
                onClick={showPlaceOfInterestModal}
              >
                create Place of interest
              </Button>
              <Modal
                open={openPlaceOfInterestModal}
                onCancel={cancelModal}
                onOk={cancelModal}
                footer={false}
              >
                <AddPlacesOfInterest
                  getPlacesOfInterest={getAllPlaces}
                  handleCancel={cancelModal}
                />
              </Modal>
            </span>
            <Select
              showSearch
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
            <span className="labelStyle mt-1">
              Hotel Chain
              <Button
                className="border-none capitalize"
                onClick={showHotelChainModal}
              >
                create Hotel Chain
              </Button>
              <Modal
                open={openHotelChainModal}
                onCancel={cancelModal}
                onOk={cancelModal}
                footer={false}
              >
                <AddChains
                  getChains={getAllChains}
                  handleCancel={cancelModal}
                />
              </Modal>
            </span>
            <Select
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
              defaultValue={0}
              allowHalf 
              // character="★" 
              style={{ border: "1px black solid", padding: "2px 5px" }}
            />
            <p className="mt-5">
              Choose Facilities{" "}
              <Button
                className="border-none capitalize"
                onClick={showFacilityModal}
              >
                create Facilities
              </Button>
              <Modal
                open={openFacilityModal}
                onCancel={cancelModal}
                onOk={cancelModal}
                footer={false}
              >
                <AddFacility
                  getFacilities={getFacility}
                  handleCancel={cancelModal}
                />
              </Modal>
            </p>
            <Checkbox.Group
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
              Submit
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
                <MarkerF position={{ lat: latitude, lng: longtude }}></MarkerF>
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
                fileList={fileList}
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
            </div>
          </div>
        </div>
      </form>}
    </section>
  );
};
