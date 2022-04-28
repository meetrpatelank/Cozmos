//Author: Fenil Shah

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import constants from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState({
    success: false,
    items: [],
  });

  const toastStyle = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    transition: null,
  };

  const navigate = useNavigate();

  // API Endpoints
  const getCartItemsApi = `${constants.API_BASE_URL}/getcartitems`;
  const addToCartApi = `${constants.API_BASE_URL}/cart/add`;
  const removeFromCartApi = `${constants.API_BASE_URL}/cart/remove`;
  const emptyCartApi = `${constants.API_BASE_URL}/cart/empty`;
  const updateCartApi = `${constants.API_BASE_URL}/cart/update`;

  // The below useEffect hook will make a GET request when this Cart component is rendered.
  // It is used for getting all the items present in the User's cart.
  useEffect(() => {
    axios
      .get(getCartItemsApi, {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      })
      .then((response) => {
        console.log("Response received in Frontend: ", response);
        if (response.data.success) {
          console.log("response.data.success", response.data.success);
          setCartItems({
            success: response.data.success,
            items: response.data.response,
          });
        } else if (!response.data.success) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);
  console.log("State is :", cartItems);

  const handleAddToCart = (id) => {
    console.log("Calling backend API of addtocart for Product with ID:", id);

    const data = {
      product_id: id,
      quantity: 1,
    };

    // POST API request for adding a product into the User's cart.
    axios
      .post(addToCartApi, data, {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      })
      .then((response) => {
        console.log("Response received in Frontend: ", response);
        if (response.data.success) {
          console.log("response.data.success", response.data.success);

          setCartItems({
            success: response.data.success,
            items: response.data.response,
          });
          toast("Added to Cart successfully", toastStyle);
        } else if (!response.data.success) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const handleRemoveFromCart = (id) => {
    console.log(
      "Calling backend API of removeFromCart for Product with ID:",
      id
    );

    const data = {
      product_id: id,
    };

    // DELETE API request for removing a particular product from the User's cart.
    axios
      .delete(removeFromCartApi, {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
        data,
      })
      .then((response) => {
        console.log("Response received in Frontend: ", response);
        if (response.data.success) {
          console.log("response.data.success", response.data.success);
          setCartItems({
            success: response.data.success,
            items: response.data.response,
          });
          toast("Removed from Cart successfully", toastStyle);
        } else if (!response.data.success) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const handleMoveToWishList = (id) => {
    console.log(
      "Calling backend APIs for moveToWishlist for Product with ID:",
      id
    );

    const data = {
      product_id: id,
    };

    //Here, 2 API requests are made:
    // 1st request is a DELETE request for removing a particular product from the User's cart.
    // 2nd request is a POST request for adding a product into the User's wishlist.
    const request1 = axios.delete(removeFromCartApi, {
      headers: {
        Authorization: Cookies.get(constants.authorization_token),
      },
      data,
    });

    const request2 = axios.post(
      `${constants.API_BASE_URL}/wishlistproduct`,
      data,
      {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      }
    );

    //I referred the following code of making concurrent requests in axios from:
    //https://www.codegrepper.com/code-examples/typescript/how+to+pass+the+two+axios+requests+in+one+function
    axios
      .all([request1, request2])
      .then(
        axios.spread((...response) => {
          const response1 = response[0];
          const response2 = response[1];
          console.log(
            "Response received in Frontend for 1st request: ",
            response1
          );

          if (response1.data.success && response2.data.success) {
            console.log("response1.data.success", response1.data.success);
            console.log("response2.data.success", response2.data.success);
            setCartItems({
              success: response1.data.success,
              items: response1.data.response,
            });
            toast("Moved to Wishlist successfully", toastStyle);
          } else if (!response1.data.success || !response2.data.success) {
            navigate("/login");
          }
        })
      )
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const handleEmptyCart = () => {
    console.log("Calling backend API of emptyCart");

    //DELETE API request for removing all the products present in the User's cart.
    axios
      .delete(emptyCartApi, {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      })
      .then((response) => {
        console.log("Response received in Frontend: ", response);
        if (response.data.success) {
          console.log("response.data.success", response.data.success);
          setCartItems({
            success: response.data.success,
            items: response.data.response,
          });
          toast("Cart has been emptied successfully", toastStyle);
        } else if (!response.data.success) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const handleUpdateCart = (id, quantity) => {
    console.log("Calling backend API of updateCart for Product with ID:", id);

    const data = {
      product_id: id,
      quantity: quantity,
    };

    //POST API request for updating the quantity of a particular product present in the User's cart.
    axios
      .post(updateCartApi, data, {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      })
      .then((response) => {
        console.log("Response received in Frontend: ", response);
        if (response.data.success) {
          console.log("response.data.success", response.data.success);
          setCartItems({
            success: response.data.success,
            items: response.data.response,
          });
        } else if (!response.data.success) {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  return (
    <div>
      <ToastContainer
        autoClose={10}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
      <ToastContainer />

      <div>
        {cartItems.items.length > 1 ? (
          <div className="p-5">
            <div className="container cart-container p-3">
              <div className="row justify-content-md-center">
                <div className="d-flex align-items-center justify-content-between">
                  <h2>Your Cart</h2>

                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                      handleEmptyCart();
                    }}
                  >
                    Empty Cart
                  </button>
                </div>
                {cartItems.items.map((entry) => {
                  return (
                    <div>
                      {entry.product_id !== 0 ? (
                        <div className="card m-2 " key={entry.product_id}>
                          <div className="row d-flex align-items-center justify-content-between">
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <img
                                src={`${entry.thumbnail_path}${entry.product_id}/image1.webp`}
                                className="card-img-top cart-img"
                                alt={entry.name}
                              />
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <h2 className="title">{entry.name}</h2>
                              <h5 className="brand-label">
                                <i>Brand: {entry.brand}</i>
                              </h5>

                              <h5>
                                <a
                                  href={
                                    "/productinformation/" + entry.product_id
                                  }
                                  className="cardLink"
                                >
                                  View Product Details
                                </a>
                              </h5>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 text-center">
                              <button
                                className="btn-quantity"
                                disabled={entry.quantity > 1 ? false : true}
                                onClick={() => {
                                  handleUpdateCart(
                                    entry.product_id,
                                    entry.quantity - 1
                                  );
                                }}
                              >
                                -
                              </button>

                              <span className="fs-16 mx-1">
                                {entry.quantity}
                              </span>
                              <button
                                className="btn-quantity"
                                onClick={() => {
                                  handleUpdateCart(
                                    entry.product_id,
                                    entry.quantity + 1
                                  );
                                }}
                              >
                                +
                              </button>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 text-center">
                              <h3>Price: ${entry.selling_price}</h3>

                              <button
                                type="button"
                                className="btn btn-primary m-2"
                                onClick={() => {
                                  handleMoveToWishList(entry.product_id);
                                }}
                              >
                                Move to Wishlist
                              </button>

                              <button
                                type="button"
                                className="btn btn-secondary m-2"
                                onClick={() => {
                                  handleRemoveFromCart(entry.product_id);
                                }}
                              >
                                Remove from Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="row mt-3">
                          <div className="col-lg-4 col-md-6 col-sm-12"></div>
                          <div className="col-lg-4 col-md-6 col-sm-12"></div>
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <h3>Total Amount: ${entry.selling_price}</h3>
                            <h5>
                              <i>{entry.quantity} items</i>
                            </h5>

                            <button
                              type="button"
                              className="btn btn-success m-2 w-100"
                              onClick={() => {
                                navigate(`/placeorder`);
                              }}
                            >
                              Checkout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 style={{ textAlign: "center", margin: "5%" }}>Your Cart is Empty. Please go to the Home page to find a product of your interest and add to your cart.</h1>
          </div>
        )}
      </div>

    </div>
  );
}

export default Cart;
