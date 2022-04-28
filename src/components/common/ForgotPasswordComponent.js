// Author: Harsh Patel
import React from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import constants from "../../constants/constants";
import Cookies from "js-cookie";
import {toast, ToastContainer} from "react-toastify";

export const ForgotPasswordComponent = () => {
    let navigate = useNavigate();

    const [formValues, setFormValues] = React.useState({
        email: "",

    });
    const [emailError,setEmailError] = React.useState(false);
    const validateFormSchema = () => {

        let email = formValues.email;

        if(email.trim().length < 1){
            // console.log("ERROR IN EMAIL",email);
            setEmailError(true);
            return false;
        }

        return true;
    }
    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = React.useCallback( (e) => {
        e.preventDefault();
        let returnVariable  = validateFormSchema(formValues);
        console.log("returnVariable",returnVariable)
        if(returnVariable){
            // Call API on successful validation
            axios.post(`${constants.API_BASE_URL}/get-email-for-forgot-password`, {
                "email" : formValues.email,
                //ramsingh@gmail.com RamSingh@123
            })
                .then(function (response) {
                    console.log(response);
                    if(response && response.data){
                        // console.log("response: ",response);
                        toast('Email sent successfully', {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            transition: null,
                            // progress: undefined,
                        });
                        // navigate("/");
                    }
                })
                .catch(function (error) {
                    toast("An error occurred. Please try later", {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        transition: null,
                        // progress: undefined,
                    });
                    console.log("error:   ",error);
                });

            // window.location.href = '/profile';
        }else{
        }

    },[formValues])

    return(
        <div>
            <div className="blue-main-gradient py-5">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-4 col-md-8 col-12 ">
                            <div className="card text-center">
                                <h1 className="my-4"> Forgot Password</h1>
                                <div className="container">
                                    <hr className="mt-0"/>
                                    <small className="fc-light-black mt-2">
                                        If you have an account with us, you will receive an email with a link to change the password.
                                    </small>
                                    <small className="fc-light-black mt-2">
                                        Please check your spam folder.
                                    </small>
                                    <TextField
                                        className="w-100 mt-1"
                                        label="Enter your email*"
                                        name="email"
                                        value={formValues.email}
                                        onChange={handleInputChange}
                                        error={emailError}
                                        helperText={emailError && "Please enter email"}
                                    />
                                    <button type="submit" className="w-100 my-5 blue-main-gradient border-button-blue
                                        height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
                                            onClick={handleSubmit}>Submit</button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                autoClose={10}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
            />
            <ToastContainer />
        </div>
    )
}