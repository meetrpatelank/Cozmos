// Author: Harsh Patel
import React from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import constants from "../../constants/constants";
import Cookies from "js-cookie";
import {toast, ToastContainer} from "react-toastify";
import TextField from "@material-ui/core/TextField";

export const SetPasswordComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    console.log("searchParams",searchParams);

    let navigate = useNavigate();

    const [formValues, setFormValues] = React.useState({
        password: "",
        confirmPassword: ""
    });
    const [passwordError,setPasswordError] = React.useState(false);
    const [confirmPasswordError,setConfirmPasswordError] = React.useState(false);

    const validateFormSchema = () => {

        let password = formValues.password;
        let confirmPassword = formValues.confirmPassword;

        if(password < 1 && confirmPassword < 1){
            // console.log("ERROR IN EMAIL",email);
            setPasswordError(true);
            return false;
        }

        if(!(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,26}$/.test(password))){
            setPasswordError(true);
            return false;
        }

        if(!(password === confirmPassword)){
            // console.log("ERROR IN ===");
            setConfirmPasswordError(true);
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
        console.log("searchParams.query: ",searchParams.get("query"))
        let forgot_password_token = searchParams.get("query");
        if(returnVariable){
            // alert("validation passed");
            axios.post(`${constants.API_BASE_URL}/set-password`, {
                "password" : formValues.password,
                "forgot_password_token": forgot_password_token || ""

            })
                .then(function (response) {
                    console.log(response);
                    // on successful password change redirect to login
                    if(response && response.data && response.data.success){

                        toast('Password Updated', {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            transition: null,
                            // progress: undefined,
                        });
                        navigate("/login");
                    } else if(response && response.data && response.data.message){

                        toast(response.data.message, {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            transition: null,
                            // progress: undefined,
                        });
                    } else{
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

            {/*<h1 className="mb-0 ">HEADER</h1>*/}
            <div className="blue-main-gradient py-5">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-4 col-md-8 col-12 ">
                            <div className="card text-center">
                                <h1 className="my-4"> Set Password</h1>
                                <div className="container">
                                    <hr className="mt-0"/>
                                    <TextField
                                        className="w-100 mt-1"
                                        label="Enter your password*"
                                        name="password"
                                        value={formValues.password}
                                        onChange={handleInputChange}
                                        error={passwordError}
                                        type="password"
                                        helperText={"Password should be at least 8 characters and should contain one number and one of '!@#$%^&*'"}
                                    />

                                    <div>
                                        <TextField
                                            className="w-100 mt-4"
                                            label="Confirm Password*"
                                            name="confirmPassword"
                                            value={formValues.confirmPassword}
                                            onChange={handleInputChange}
                                            type="password"
                                            error={confirmPasswordError}
                                            helperText={confirmPasswordError && "Password and confirm password should match"}
                                        />
                                    </div>
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