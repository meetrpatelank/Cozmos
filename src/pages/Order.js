//Author: Harvik Kakadiya

import { Fragment, useEffect, useState } from "react";
import constants from "../constants/constants";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};


function Orders(){

    const [currentMode, setCurrerntMode] = useState("pending");
    const gerOurdersUrl = `${constants.API_BASE_URL}/getorders`;
    const updateOrderStatusUrl = `${constants.API_BASE_URL}/updateOrderStatus`;
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [cancelOrConfirmOrderId, setCancelOrConfirmOrderId] = useState();
    const [updateMode, setUpdateMode] = useState();

    useEffect(()=> {
        getOrders()
    }, [currentMode])

    const getOrders = () => {
        axios
        .get(gerOurdersUrl, {
          headers: {
            Authorization: Cookies.get(constants.authorization_token),
          },
          params:{status: currentMode}
        })
        .then((response) => {
          console.log("Response received in Frontend: ", response.data);
          if (response.data.status == 200) {
            console.log("response.data.success", response.data.success);
            setOrders(response.data.response)
          } else {
            navigate('/login')
          }
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    }

    const confirmOrder = (orderId) => {
      setCancelOrConfirmOrderId(orderId);
      setIsOpen(true);
      setUpdateMode('confirm')
    }
    
    const callConfirmOrder = () => {
      axios
      .post(updateOrderStatusUrl, {
        "order_id": cancelOrConfirmOrderId,
        "status": "completed"
      }, {
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      }
      )
      .then((response) => {
        getOrders();
        setCancelOrConfirmOrderId(null)
        setIsOpen(false);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
    }

    const cancelOrder = (orderId) => {
      setCancelOrConfirmOrderId(orderId);
      setIsOpen(true);
      setUpdateMode('cancel')
    }

    const callCancelOrder = () => {
      axios
      .post(updateOrderStatusUrl,{
        "order_id": cancelOrConfirmOrderId,
        "status": "cancelled"
      },{
        headers: {
          Authorization: Cookies.get(constants.authorization_token),
        },
      })
      .then((response) => {
        getOrders();
        setCancelOrConfirmOrderId(null)
        setIsOpen(false);
      })
      .catch((err) => {
        console.log("Error:", err);
      }); 
    }

    const callOrderUpdate = () => {
      if (updateMode == 'cancel') {
        callCancelOrder();
      } else {
        callConfirmOrder();
      }
    }

    return (
        <div className="container">
            <Fragment>
            <div class="btn-group col-md-12 mt-2" role="group" aria-label="Basic example">
                <button type="button" onClick={() => setCurrerntMode("pending")} className={`col-md-4 btn border ${currentMode == "pending" ? "btn-secondary text-white" : ""}`}>Pending orders</button>
                <button type="button" onClick={() => setCurrerntMode("past")} className={`col-md-4 btn border ${currentMode == "past" ? "btn-secondary text-white" : ""}`}>Past orders</button>
                <button type="button" onClick={() => setCurrerntMode("canceelled")} className={`col-md-4 btn border ${currentMode == "canceelled" ? "btn-secondary text-white" : ""}`}>Cancelled orders</button>
            </div>
            
            <Modal
              isOpen={modalIsOpen}
              style={customStyles}
            >
              <div>Are you sure, you want to {updateMode} this order ?</div>
              <hr/>
              <div className="text-center">
                <button className="btn btn-primary m-2" onClick={callOrderUpdate}>Yes</button>
                <button className="btn btn-secondary m-2" onClick={(e) => {setIsOpen(false)}}>No</button>
              </div>
            </Modal>

            <div className="col-md-12 mt-3">
                {
                    orders.length ? orders.map((item, index) => {
                        return(
                            <div class="card">
                                <div class="row no-gutters">
                                    <div class="col-sm-7">
                                        <div class="card-body">
                                            <h5 class="card-title">Order Id : {item.order_id}</h5>
                                            <p className="card-text"> Total Amount: {item.order_total_amount}$</p>
                                            <a href={"/orderDetails/" + item.order_id} class="btn btn-primary m-2">Order Details</a>
                                            { currentMode != "pending" ? null :<button href="" class="btn btn-success m-2" onClick={(e)=> {e.stopPropagation(); confirmOrder(item.order_id)}}>Confirm Order received</button>}
                                            { currentMode != "pending" ? null:<button href="" class="btn btn-danger m-2" onClick={(e)=>cancelOrder(item.order_id)}>Cancel Order</button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                      }) : <h3 className="text-center">No orders</h3>
                }
            </div>
        </Fragment>
    
        </div>
    )
}

export default Orders;