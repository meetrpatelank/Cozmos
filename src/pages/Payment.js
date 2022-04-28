//Author: Rahul Tulani
import React from "react";
import PaymentComponent from "../components/checkout/PaymentComponent";

//General Functionality of the task
//This page 'Payment' is second task page of the Checkout feature.

//This page asks users to enter their billing information.
//It also asks the users to select their preferred mode of payment: Card Payment or Cash on Delivery.
//This task also shows the cart of the user on the right side, along with the total bill to be paid.

export const Payment = () => {
  return (
    <div>
      <PaymentComponent />
    </div>
  );
};
