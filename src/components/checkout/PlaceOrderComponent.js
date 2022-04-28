//Author: Rahul Tulani
import React from "react";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import OnlyAddressComponent from "./OnlyAddressComponent";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import constants from "../../constants/constants";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Swal from "sweetalert2";

function PlaceOrderComponent() {
  let navigate = useNavigate();

  let address = {};

  const [savedAddress, setSavedAddress] = useState([]);
  const [validated, setValidated] = useState(false);
  const [savedAddressSelected, setSavedAddressSelected] = useState(true);
  const [newAddressSelected, setNewAddressSelected] = useState(true);
  const [previousAddressSelected, setpreviousAddressSelected] = useState(true);
  const [paymentEnable, setpaymentEnable] = useState(true);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZIP] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");
  const [ship, setShip] = useState("");

  //API end points being hit from this frontend page.
  const addressApi = `${constants.API_BASE_URL}/getaddress`;
  const resetShipppingAPI = `${constants.API_BASE_URL}/resetshippingaddress`;
  const shipppingAPI = `${constants.API_BASE_URL}/shippingaddress`;
  const storeDeliveryAddessAPI = `${constants.API_BASE_URL}/storedeliveryaddress`;

  const handlePreviousAddressSelection = () => {
    setpreviousAddressSelected(false);
    setNewAddressSelected(true);
  };

  const handleSavedAddressSelection = (event) => {
    setSavedAddressSelected(false);
    setpaymentEnable(false);
    setShip({
      id: event.target.value,
    });
  };

  const handleNewAddress = () => {
    setNewAddressSelected(false);
    setpaymentEnable(false);
    setpreviousAddressSelected(true);
  };

  const handleStreet = (event) => {
    setStreet("");
    setStreet(event.target.value);
  };
  const handleCity = (event) => {
    setCity("");
    setCity(event.target.value);
  };
  const handleProvince = (event) => {
    setProvince("");
    setProvince(event.target.value);
  };

  const handleZIP = (event) => {
    setZIP("");
    setZIP(event.target.value);
  };

  const handleCountry = (event) => {
    setCountry("");
    setCountry(event.target.value);
  };
  const handleTitle = (event) => {
    setType("");
    setType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //This logic checkes if the address is selected from the saved address or a new address is selected to be entered.
    if (savedAddressSelected || newAddressSelected === false) {
      address = {
        street: street,
        city: city,
        province: province,
        zip: zip,
        country: country,
        shipping_ind: "Y",
        title: type,
      };

      console.log(address);
      if (
        Object.keys(address).length === 0 ||
        address.street.length === 0 ||
        address.city.length === 0 ||
        address.province.length === 0 ||
        address.zip.length === 0 ||
        address.country.length === 0 ||
        address.title.length === 0
      ) {
        Swal.fire({
          icon: "error",
          title: "Insufficient address details",
          text: "Please select or enter valid address",
        });
        const checkout = event.currentTarget;

        if (checkout.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        setValidated(true);
        return null;
      }
      //API post request to reset the Shipping Indicator of the deivery addresses.
      await axios
        .post(
          resetShipppingAPI,
          {},
          {
            headers: {
              Authorization: Cookies.get(constants.authorization_token),
            },
          }
        )
        .then((res) => {
          console.log("Res: " + JSON.stringify(res));
          console.log("Res: " + res.data);
          if (res.data.success) {
            console.log("res.data.success", res.data.success);
            navigate("/payment");
          } else if (!res.data.success) {
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log("Err", err);
        });
      //API post request to store the entered delivery address.
      console.log(JSON.stringify(address));
      await axios
        .post(storeDeliveryAddessAPI, address, {
          headers: {
            Authorization: Cookies.get(constants.authorization_token),
          },
        })
        .then((res) => {
          console.log("Res: " + JSON.stringify(res));
          console.log("Res: " + res.data);
          if (res.data.success) {
            console.log("res.data.success", res.data.success);
            navigate("/payment");
          } else if (!res.data.success) {
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log("Err", err);
        });
    } else {
      //API post request to reset the shipping indicator to N for all addresses.
      await axios
        .post(
          resetShipppingAPI,
          {},
          {
            headers: {
              Authorization: Cookies.get(constants.authorization_token),
            },
          }
        )
        .then((res) => {
          console.log("Res: " + JSON.stringify(res));
          console.log("Res: " + res.data);
          if (res.data.success) {
            console.log("res.data.success", res.data.success);
            navigate("/payment");
          } else if (!res.data.success) {
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log("Err", err);
        });
      //API post request to set the shipping indicator of the selected address as 'Y'.
      await axios
        .post(shipppingAPI, ship, {
          headers: {
            Authorization: Cookies.get(constants.authorization_token),
          },
        })
        .then((res) => {
          console.log("Res: " + JSON.stringify(res));
          console.log("Res: " + res.data);
          if (res.data.success) {
            console.log("res.data.success", res.data.success);
            navigate("/payment");
          } else if (!res.data.success) {
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log("Err", err);
        });
    }

    event.preventDefault();
  };

  useEffect(() => {
    //GET API to fetch the addresses saved in the user profile.
    axios
      .get(addressApi, {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      })
      .then((res) => {
        console.log("Res: " + JSON.stringify(res));
        console.log("Res: " + res.data.message);
        if (res.data.success) {
          setSavedAddress(res.data.response);

          //Sweet Alert popup which asks the user their delivery address preferences.
          //This pop up will come only if the user has any saved addresses in their profile.
          if (res.data.response != null && Object.keys(res.data.response).length > 0) {
            const inputOptions = new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  "Previous Address": "Previous Address",
                  "New Address": "New Address",
                });
              }, 1000);
            });

            Swal.fire({
              title: "Where would you wish your order to be delivered",
              input: "radio",
              inputOptions: inputOptions,
              inputValidator: (value) => {
                if (!value) {
                  return "Please choose your delivery address preference. You can change it again.";
                } else {
                  if (value === "Previous Address") {
                    setpreviousAddressSelected(false);
                    setNewAddressSelected(true);
                  } else {
                    setpreviousAddressSelected(true);
                    setNewAddressSelected(false);
                    setpaymentEnable(false);
                  }
                }
              },
            });
          }
        } else {
          console.log("Authentication failed");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("Err", err);
      });
  }, []);

  //If there are saved addresses in the user profile, render the saved addresses as a deck of cards and also give them the
  //option to enter a new address.
  if (savedAddress != null && Object.keys(savedAddress).length > 0) {
    return (
      <div>
        <div>
          <Container fluid={true}>
            <div className="col-12" style={{ textAlign: "center" }}>
              <h2>Change your delivery preference below</h2>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ToggleButtonGroup type="checkbox">
                <ToggleButton
                  className="blue-main-gradient border-button-blue
                        border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
                  style={{ marginRight: "25px", color: "black" }}
                  id="tbg-btn-1"
                  name="del-pref"
                  value="previous"
                  onChange={handlePreviousAddressSelection}
                >
                  To previous address
                </ToggleButton>
                <ToggleButton
                  className="blue-main-gradient border-button-blue
                        border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0"
                  style={{ color: "black" }}
                  id="tbg-btn-2"
                  name="del-pref"
                  value="new"
                  onChange={handleNewAddress}
                >
                  To new address
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <Row>
              <Col md="8" sm="12" style={{ flex: "1 0 50%", marginLeft: "0px" }}>
                <div>
                  <h1 className="col-12 m-4">Choose shipping address</h1>
                  <Row xs={1} md={2} lg={2} sm={1} xl={3} xxl={3} className="g-4" style={{ marginLeft: "5px" }}>
                    {Array.from({ length: 1 }).map((_, idx) =>
                      savedAddress.map((r) => (
                        <div key={r.id}>
                          <Col lg={true}>
                            <Card className="address-card blue-main-gradient border-button-blue" border="info" style={{ width: "18rem", height: "13rem" }}>
                              <Card.Body>
                                <Card.Title>{r.title}</Card.Title>
                                <Card.Text>
                                  {r.street}, {r.city}, {r.province}, {r.zip}, {r.country}
                                </Card.Text>
                              </Card.Body>
                              <Card.Footer>
                                <div>
                                  <Form.Check
                                    id="deladdsaved"
                                    required
                                    name="del-add"
                                    type="radio"
                                    style={{ fontWeight: "bold" }}
                                    label={"Deliver here"}
                                    value={r.id}
                                    disabled={previousAddressSelected}
                                    onChange={handleSavedAddressSelection}
                                  />
                                </div>
                              </Card.Footer>
                            </Card>
                          </Col>
                        </div>
                      ))
                    )}
                  </Row>
                </div>
              </Col>
              <Col lg={12} md={12} sm={12} style={{ flex: "1 0 10%", marginLeft: "0px" }}>
                <div>
                  <Col
                    style={{
                      borderLeft: "2px solid navy",
                      marginLeft: "0px",
                    }}
                  >
                    <h1 className="col-12 m-4">Add a new address</h1>

                    <Form controlId="form.cc" noValidate validated={validated} onSubmit={handleSubmit} id="addressform" style={{ marginLeft: "10px" }}>
                      <Row>
                        <Col lg={true}>
                          <Form.Group controlId="form.Street">
                            <Form.Label>Street</Form.Label>
                            <Form.Control required type="text" placeholder="Street" onChange={handleStreet} disabled={newAddressSelected} />
                            <Form.Control.Feedback type="invalid">Please enter street.</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col lg={true}>
                          <Form.Group controlId="form.City">
                            <Form.Label>City</Form.Label>
                            <Form.Control required type="text" placeholder="City" onChange={handleCity} disabled={newAddressSelected} />
                            <Form.Control.Feedback type="invalid">Please enter your city.</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={true}>
                          <Form.Group controlId="form.Province">
                            <Form.Label>Province</Form.Label>
                            <Form.Select required type="text" placeholder="Province" onChange={handleProvince} disabled={newAddressSelected}>
                              <option value="" disabled selected>
                                Choose Province
                              </option>
                              <option value="Alberta">Alberta</option>
                              <option value="British Columbia">British Columbia</option>
                              <option value="Manitoba">Manitoba</option>
                              <option value="New Brunswick">New Brunswick</option>
                              <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                              <option value="Nova Scotia">Nova Scotia</option>
                              <option value="Ontario">Ontario</option>
                              <option value="Prince Edward Island">Prince Edward Island</option>
                              <option value="Quebec">Quebec</option>
                              <option value="Saskatchewan">Saskatchewan</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Please enter your province.</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col lg={true}>
                          <Form.Group controlId="form.ZIP">
                            <Form.Label>ZIP Code</Form.Label>
                            <Form.Control required type="text" placeholder="ZIP Code" onChange={handleZIP} disabled={newAddressSelected} />
                            <Form.Control.Feedback type="invalid">Please enter your ZIP.</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={true}>
                          <Form.Group controlId="form.Country">
                            <Form.Label>Country</Form.Label>
                            <Form.Select required type="text" placeholder="Country" onChange={handleCountry} disabled={newAddressSelected}>
                              <option value="" disabled selected>
                                Choose Country
                              </option>
                              <option value="Canada">Canada</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col lg={true}>
                          <Form.Group controlId="form.Type">
                            <Form.Label>Address type</Form.Label>
                            <Form.Select required onChange={handleTitle} disabled={newAddressSelected}>
                              <option value="" disabled selected>
                                Address type
                              </option>
                              <option value="Home">Home</option>
                              <option value="Office">Office</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Please enter your adress type.</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <div style={{ textAlign: "center" }}>
                        <Button
                          type="submit"
                          className="blue-main-gradient border-button-blue
                        border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
                          disabled={paymentEnable}
                          style={{
                            margin: "35px auto 0 auto",
                            textAlign: "center",
                            minWidth: "50%",
                            color: "black",
                            padding: "0rem 0.5rem",
                          }}
                          size="lg"
                        >
                          Proceed to Payment
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
  //If there are no saved addresses in the profile, ask the user to enter a new address by rendering OnlyAddressComponent
  else {
    return (
      <div>
        <Container fluid={true} className="p-2">
          <OnlyAddressComponent />
        </Container>
      </div>
    );
  }
}

export default PlaceOrderComponent;
