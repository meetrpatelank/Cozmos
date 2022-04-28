//Author: Rahul Tulani
import React from "react";
import PlaceOrderComponent from "../components/checkout/PlaceOrderComponent";

//General Functionality of the task:
//This page 'Place order' is one of the first task pages of the Checkout feature. 
//This task handles dual functionality with below use cases:

//Use case 1: If user has any address saved in their profile: This task give them the option to choose from set of 
//previous address or enter a new delivery address.

//Use case 2: If user does not have any delivery address saved already in their profile, this task ask them to enter a new delivery address.

//For use case 1: The task renders the saved addresses of a user as a deck of cards and a form to enter new delivery address
// details on the same page.

//For use case 2: User need to enter their new address of delivery.

export const PlaceOrder = () => {
  return (
    <div>
      <PlaceOrderComponent />
    </div>
  );
};
