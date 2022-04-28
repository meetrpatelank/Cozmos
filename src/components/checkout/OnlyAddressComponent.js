//Author: Rahul Tulani
import React from "react";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import constants from "../../constants/constants";
import Swal from "sweetalert2";

function OnlyAddressComponent() {
  let navigate = useNavigate();

  let address = {};

  const [validated, setValidated] = useState(false);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZIP] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");

  const resetShipppingAPI = `${constants.API_BASE_URL}/resetshippingaddress`;
  const storeDeliveryAddessAPI = `${constants.API_BASE_URL}/storedeliveryaddress`;

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
      //Sweet alert for insufficient address details
      Swal.fire({
        icon: "error",
        title: "Insufficient address details",
        text: "Please enter valid address",
      });
      const checkout = event.currentTarget;

      if (checkout.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      setValidated(true);
      return null;
    }
    //POST request to reset the shipping addresses, if any.
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

    event.preventDefault();
    //POST request to store the delivery address entered by the user.
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
  };

  return (
    <div>
      <Container fluid={true}>
        <Alert style={{ maxWidth: "50%" }}>
          <Alert.Heading>No address found!</Alert.Heading>
          <p>Your saved addresses show up here, but you do not have any address saved in your profile</p>
        </Alert>

        <h1 className="m-2">Add a new address</h1>

        <Form controlId="form.cc" noValidate validated={validated} onSubmit={handleSubmit} id="addressform" style={{ marginLeft: "10px" }}>
          <Row>
            <Col lg={true}>
              <Form.Group controlId="form.Street">
                <Form.Label>Street</Form.Label>
                <Form.Control required type="text" placeholder="Street" onChange={handleStreet} />
                <Form.Control.Feedback type="invalid">Please enter street.</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={true}>
              <Form.Group controlId="form.City">
                <Form.Label>City</Form.Label>
                <Form.Control required type="text" placeholder="City" onChange={handleCity} />
                <Form.Control.Feedback type="invalid">Please enter your city.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={true}>
              <Form.Group controlId="form.Province">
                <Form.Label>Province</Form.Label>
                <Form.Select required type="text" placeholder="Province" onChange={handleProvince}>
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
                <Form.Control required type="text" placeholder="ZIP Code" onChange={handleZIP} />
                <Form.Control.Feedback type="invalid">Please enter your ZIP.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={true}>
              <Form.Group controlId="form.Country">
                <Form.Label>Country</Form.Label>
                <Form.Select required type="text" placeholder="Country" onChange={handleCountry}>
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
                <Form.Select required onChange={handleTitle}>
                  <option value="" disabled selected>
                    Address type
                  </option>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">Please enter your adress type</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div style={{ textAlign: "center" }}>
            <Button
              type="submit"
              className="blue-main-gradient border-button-blue
                        border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
              style={{
                margin: "35px auto 0 auto",
                textAlign: "center",
                minWidth: "13%",
                color: "black",
                padding: "0rem 0.5rem",
              }}
              size="lg"
            >
              Proceed to Payment
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default OnlyAddressComponent;
