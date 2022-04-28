// AUTHOR: MEET PATEL

import React, { Component } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cookies from 'js-cookie'
import constants from "../../src/constants/constants"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Wishlist() {

    const [wishlistItems, setWishlistItems] = useState([]);
    const [deleteWishItems, setDeleteWishlistItems] = useState([]);
    console.log("in wishlist");

    const navigate = useNavigate();

    const toastStyle = {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        transition: null,
    };

    const wishlistedPrdouct = `${constants.API_BASE_URL}/getwishlistedproducts`;

    useEffect(() => {
        console.log("in effect");
        axios.get(wishlistedPrdouct, {
            headers: {
                'Authorization': Cookies.get(constants.authorization_token)
            }
        }).then((res) => {
            if (res && res.data && res.data.response) {

                setWishlistItems(res.data.response);
                console.log(Object.keys(wishlistItems).length);
            } else {

            }

        });
    }, []);

    const deleteProduct = React.useCallback((product_id) => {

        console.log("product_id", product_id);
        axios.post(`${constants.API_BASE_URL}/deleteWishlistProduct`,
            { "product_id": product_id },
            {
                headers: {
                    'Authorization': Cookies.get(constants.authorization_token)
                }
            })
            .then(function (response) {
                console.log("Line 43");
                console.log(response);
                toast("Deleted successfully", toastStyle);

                console.log(" delete response 34: ", response.data.response);
                setWishlistItems(response.data.response);
            })

    });

    const addToCartRemoveWishlist = (id, product_id) => {
        console.log("Line 69");
        const data = {
            product_id: id,
            quantity: 1,
        };

        const request1 = axios.post(`${constants.API_BASE_URL}/deleteWishlistProduct`,
            { "product_id": id },
            {
                headers: {
                    'Authorization': Cookies.get(constants.authorization_token)
                }
            })

        const request2 = axios.post(
            `${constants.API_BASE_URL}/cart/add`,
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
                        console.log("response1.data.success", response1.data);
                        console.log("response2.data.success", response2.data);
                        console.log("In response 2");
                        setWishlistItems(response1.data.response);
                        toast("Moved to Cart successfully", toastStyle);
                    } else if (!response1.data.success || !response2.data.success) {
                        navigate("/login");
                    }
                })
            )
            .catch((err) => {
                console.log("Error:", err);
                toast("Already in Cart", toastStyle);
            });

    };

    return (
        <div className="container wishlist-container">
            <div className="row wishlist-row">
                <h1>My Wishlists</h1>
                {
                    wishlistItems.map((r) => (
                        <div className="col-lg-3 border-20-px" >
                            {console.log("image", r.thumbnail_path + r.id + "/image1.webp")}
                            {console.log(r)}
                            <div class="wishlist-card" style={{ float: 'left' }}>
                                <img src={r.thumbnail_path + r.id + "/image1.webp"} width="195" height="260"></img>
                                <div class="wishlist-card-body">
                                    <h5 class="wishlist-card-title">{r.name}</h5>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <h4 class="list-group-item">CAD: {r.selling_price}</h4>
                                </ul>

                                <div>
                                    <button onClick={addToCartRemoveWishlist.bind(this, r.id)} class="addToCart-button">
                                        Add to cart
                                    </button>
                                </div>

                                <button onClick={deleteProduct.bind(this, r.id, r.product_id)} class="wishlist-remove-button">
                                    Remove
                                </button>


                            </div>

                        </div>
                    ))
                }



            </div>
            <ToastContainer
                autoClose={10}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
            />
            <ToastContainer />
        </div>

    );
}

export default Wishlist;
