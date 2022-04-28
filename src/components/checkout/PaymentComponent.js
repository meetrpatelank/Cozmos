//Author: Rahul Tulani
import React from "react";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import Cookies from "js-cookie";
import constants from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function PaymentComponent() {
  const [validated, setValidated] = useState(false);
  const [creditCard, setCreditCard] = useState();
  const [email, setemail] = useState();
  const [errorEmail, setErrorEmail] = useState();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [ccError, setCcError] = useState("");
  const [cartItems, setCartItems] = useState([{ name: "default", quantity: 5, price: 10 }]);
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();
  const cardInput = React.useRef();
  const monthInput = React.useRef();
  const yearInput = React.useRef();
  const cvvInput = React.useRef();

  //API end points being hit through this front end page
  const cartApi = `${constants.API_BASE_URL}/getcartitems`;
  const generateOrderApi = `${constants.API_BASE_URL}/generateorder`;
  const generateOrderItemsApi = `${constants.API_BASE_URL}/generateorderitems`;
  const generateBillingInfoApi = `${constants.API_BASE_URL}/generatebillinginfo`;
  const emptyCartApi = `${constants.API_BASE_URL}/cart/empty`;

  let navigate = useNavigate();

  let orderIdGenerated;

  const handlePay = async (event) => {
    if (cartItems.length > 1) {
      const checkout = event.currentTarget;
      if (checkout.checkValidity() === false || errorEmail) {
        event.preventDefault();
        event.stopPropagation();
        //Sweet alert for invalid details entered
        Swal.fire({
          icon: "error",
          title: "Invalid details entered",
          text: "Please enter valid details",
        });
      } else {
        if (creditCard === false) {
          setCcError("Please enter valid credit card details");
          //Sweet alert for invalid card details entered
          Swal.fire({
            icon: "error",
            title: "Invalid card details",
            text: "Please enter valid card details",
          });

          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          event.stopPropagation();
          //POST API hit to generate the Order details for the placed order --> Order details to be used by order management page
          await axios
            .post(
              generateOrderApi,
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
              //Logic to store the generated Order Id which is used by next two APIs to generate the Billing info
              //and Order Items
              orderIdGenerated = res.data.response.insertId;
              if (res.data.success) {
                console.log("res.data.success", res.data.success);
              } else if (!res.data.success) {
                navigate("/login");
              }
            })
            .catch((err) => {
              console.log("Err", err);
            });
          //POST API request to generate the Billing information against the Order Id generated
          await axios
            .post(
              generateBillingInfoApi,
              { orderId: orderIdGenerated, name: name, email: email, address: address, country: country, city: city, zip: zip, paymentType: paymentMethod },
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
              } else if (!res.data.success) {
                navigate("/login");
              }
            })
            .catch((err) => {
              console.log("Err", err);
            });
          //POST API request to generate the Order items(Order Id and Product Ids) against the Order Id generated
          await axios
            .post(
              generateOrderItemsApi,
              { orderId: orderIdGenerated },
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
              } else if (!res.data.success) {
                navigate("/login");
              }
            })
            .catch((err) => {
              console.log("Err", err);
            });

          // DELETE API request for Emptying the User's cart after the successful payment.
          await axios
            .delete(emptyCartApi, {
              headers: {
                Authorization: Cookies.get(constants.authorization_token),
              },
            })
            .then((response) => {
              console.log("Response received in Frontend: ", response);
              if (response.data.success) {
                console.log("response.data.success", response.data.success);
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful",
                });
                navigate("/orders");
              } else if (!response.data.success) {
                navigate("/login");
              }
            })
            .catch((err) => {
              console.log("Error:", err);
            });
        }
      }
      setValidated(true);
    } else {
      event.preventDefault();
      event.stopPropagation();
      //Sweet alert error for empty cart
      Swal.fire({
        icon: "error",
        title: "Cart is empty",
        text: "Cannot proceed with payment and order",
      });
    }
  };

  const handleCC = (event) => {
    setCreditCard(false);
    const reg_exp = /^[0-9]+$/;

    if (event.target.value.length > 0 && event.target.value.length === 16 && event.target.value.length < 17 && reg_exp.test(event.target.value)) {
      setCreditCard(true);
    } else {
      setCreditCard(false);
    }
  };

  const handleEmail = (event) => {
    const reg_exp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    setErrorEmail("");

    if (event.target.value === "" || reg_exp.test(event.target.value)) {
      setemail(event.target.value);
    } else {
      setErrorEmail("Invalid email address");
    }
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleAddress = (event) => {
    setAddress(event.target.value);
  };
  const handleCountry = (event) => {
    setCountry(event.target.value);
  };

  const handleCity = (event) => {
    setCity(event.target.value);
  };

  const handleZIP = (event) => {
    setZip(event.target.value);
  };

  const paymentMethodDetection = (event) => {
    setPaymentMethod(event.target.value);
    if (event.target.value === "COD") {
      if (creditCard === false) {
        setCreditCard(true);
      }
      cardInput.current.value = "";
      monthInput.current.value = "";
      yearInput.current.value = "";
      cvvInput.current.value = "";
      setCcError("");
    }
  };

  useEffect(() => {
    //GET request to fetch the cart items of the user and their total bill
    axios
      .get(cartApi, {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      })
      .then((res) => {
        if (res.data.success) {
          setCartItems(res.data.response);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("Err", err);
      });
  }, []);

  return (
    <div>
      <Container fluid={true}>
        <Row>
          <Col md="8" sm="12">
            <h1 style={{ marginTop: "20px" }}>Billing Information</h1>
            <Form noValidate validated={validated} onSubmit={handlePay}>
              <Row>
                <Col lg={true}>
                  <Form.Group controlId="form.Name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required type="text" placeholder="Enter your full name" onChange={handleName} />
                    <Form.Control.Feedback type="invalid">Please enter your full name.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group controlId="form.Email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required type="email" placeholder="abc@example.com" onChange={handleEmail} />
                    <Form.Control.Feedback type="invalid">Please enter your email address.</Form.Control.Feedback>
                    {errorEmail}
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="form.Textarea">
                <Form.Label>Address</Form.Label>
                <Form.Control required as="textarea" rows={3} placeholder="Address" onChange={handleAddress} />
                <Form.Control.Feedback type="invalid">Please enter your billing address.</Form.Control.Feedback>
              </Form.Group>
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
                    <Form.Control.Feedback type="invalid">Please enter your country.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group controlId="form.City">
                    <Form.Label>City</Form.Label>
                    <Form.Control required type="text" placeholder="Enter your City" onChange={handleCity} />
                    <Form.Control.Feedback type="invalid">Please enter your city.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group controlId="form.ZIP">
                    <Form.Label>ZIP</Form.Label>
                    <Form.Control required type="text" placeholder="Enter your ZIP Code" onChange={handleZIP} />
                    <Form.Control.Feedback type="invalid">Please enter your ZIP Code.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <hr style={{ color: "black", backgroundColor: "black", height: "5", marginTop: "35px" }}></hr>
              <h1>Payment</h1>
              <Form.Check required name="payment-type" type="radio" label="Cash on Delivery" value="COD" onChange={paymentMethodDetection} />
              <Form.Check required name="payment-type" type="radio" label="Card Payment" value="Card" onChange={paymentMethodDetection} />

              <Form.Group controlId="form.cc" style={{ marginTop: "25px" }}>
                <Form.Label>Credit Card Number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter your 16 digit credit card number"
                  onChange={handleCC}
                  isValid={creditCard}
                  disabled={paymentMethod === "COD"}
                  ref={cardInput}
                ></Form.Control>
                <div style={{ color: "red" }}>{ccError}</div>
                <Form.Control.Feedback type="invalid">Credit card details cannot be blank</Form.Control.Feedback>
              </Form.Group>
              <Row>
                <Col lg={true}>
                  <Form.Group>
                    <Form.Label>Month</Form.Label>
                    <Form.Control required type="text" placeholder="Expiry Month" disabled={paymentMethod === "COD"} ref={monthInput}></Form.Control>
                    <Form.Control.Feedback type="invalid">Please enter the expiry month.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group>
                    <Form.Label>Year</Form.Label>
                    <Form.Control required type="text" placeholder="Expiry Year" disabled={paymentMethod === "COD"} ref={yearInput}></Form.Control>
                    <Form.Control.Feedback type="invalid">Please enter the expiry year.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg={true}>
                  <Form.Group>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control required type="text" placeholder="CVV" disabled={paymentMethod === "COD"} ref={cvvInput}></Form.Control>
                    <Form.Control.Feedback type="invalid">Please enter the CVV.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <div className="col-md-12 text-center">
                <Button
                  className="my-5 blue-main-gradient border-button-blue
                        border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
                  type="submit"
                  style={{ marginTop: "35px", textAlign: "center", marginBottom: "15px", color: "black", padding: "0rem 0.5rem" }}
                  size="lg"
                  onSubmit={creditCard}
                >
                  Place Order
                </Button>
              </div>
            </Form>
          </Col>
          <Col md="4" sm="12">
            <Card className="blue-main-gradient" style={{ width: "100%", marginTop: "20px", border: "2px solid #000000" }}>
              <Card.Header style={{ textAlign: "center", fontWeight: "bold" }}>
                Your Cart
                <img src="/icons/cart.png" width="30" height="30" />
              </Card.Header>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h5>Item</h5>
                  </Col>
                  <Col>
                    <h5 style={{ textAlign: "center" }}>Quantity</h5>
                  </Col>
                  <Col>
                    <h5 style={{ textAlign: "right" }}>Price</h5>
                  </Col>
                </Row>
              </ListGroup.Item>

              {Array.from({ length: 1 }).map((_, idx) =>
                cartItems.map((r) => (
                  <div key={r.name}>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <p style={{ fontWeight: "bold" }}>{r.name}</p>
                        </Col>
                        <Col>
                          <p style={{ textAlign: "center" }}>{r.quantity}</p>
                        </Col>
                        <Col>
                          <p style={{ textAlign: "right" }}>${r.selling_price}</p>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </div>
                ))
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PaymentComponent;
