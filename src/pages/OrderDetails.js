//Author: Harvik Kakadiya

import React, { useEffect, useState } from "react";
import constants from "../constants/constants";
import axios from "axios";
import Cookies from "js-cookie";

function OrderDetails() {
    const orderDetailsUrl = `${constants.API_BASE_URL}/getOrderDetails`;
    const [orderDetails, setOrederDetails] = useState([]);
    const [searchedOrderDetails, setSearchedOrderDEtails] = useState([])
    const [billingInfo, setbiliingInfo] = useState([]);

    useEffect(() => {
        var orderId = window.location.pathname.split('/')[2];
        axios
            .get(orderDetailsUrl, {
                headers: {
                    Authorization: Cookies.get(constants.authorization_token),
                },
                params: { order_id: orderId }
            })
            .then((response) => {
                setOrederDetails(response.data.response)
                setSearchedOrderDEtails(response.data.response)
                setbiliingInfo(response.data.billingInfo[0])
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    }, [])

    const searchByName = (query) => {
        query = query.toLocaleLowerCase().trim();

        let array = [];

        array = orderDetails.filter(item => {
            console.log(item.title.toLocaleLowerCase())
            return item.title.toLocaleLowerCase().includes(query);
        })

        setSearchedOrderDEtails(array)
    }

    return (
        <div class="container py-5">
            <div class="col-md-6 mb-2 offset-md-3 row mt-2">
                <input type="search" onChange={(e) => searchByName(e.target.value)} class="form-control" placeholder="Search products" aria-label="Search" />
            </div>

            <div class="card">
                <div class="card-header">
                    <strong>Shipping Address</strong>
                </div>
                <div class="card-body">
                    <h5 class="card-title">{billingInfo ? billingInfo.name : ""}</h5>
                    <p class="card-text">
                        {billingInfo ? billingInfo.address : ""}
                        <br /> {billingInfo ? billingInfo.city : ""}
                        <br /> {billingInfo ? billingInfo.country : ""}
                    </p>
                </div>
                <div class="card-footer text-muted">
                    <strong>Payment Type: </strong>{billingInfo ? billingInfo.payment_type : ""}
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-12 row">
                    {
                        searchedOrderDetails && searchedOrderDetails.map((item, index) => {
                            let url = "/write-review/" + item.id;
                            return (
                                <div class="card text-black col-md-4 m-2">
                                    <img
                                        src={`${item.thumbnail_path}${item.id}/image1.webp`}
                                        class="card-img-top order-detail-image mt-3"
                                        alt="Apple Computer"
                                    />
                                    <div class="card-body">
                                        <div class="text-center">
                                            <h5 class="card-title">{item.title}</h5>
                                        </div>
                                        <div>
                                            <div class="d-flex justify-content-between">
                                                <span>About</span><span>{item.description}</span>
                                            </div>
                                            <div class="d-flex justify-content-between">
                                                <span>Price</span><span>${item.selling_price}</span>
                                            </div>
                                            <div class="d-flex justify-content-between">
                                                <span>Quantity</span><span>{item.quantity}</span>
                                            </div>
                                            <div className="">
                                                <a href={url}>
                                                    <button type="submit" className="w-100 my-3 blue-main-gradient border-button-blue
                                                    height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 ">
                                                        Write a review
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </div>

        </div>
    )
}

export default OrderDetails;