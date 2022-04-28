// Author: Harsh Patel
import React, {useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import Cookies from 'js-cookie'
import constants from "../../../src/constants/constants"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export const LoginComponent = () => {
    let navigate = useNavigate();

    useEffect(()=> {
        if(Cookies.get(constants.authorization_token)){
            navigate('/');
        }
    },[])
    const [formValues, setFormValues] = React.useState({
        email: "",
        password: "",
    });
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const validateFormSchema = () => {
        let flag = true;

        let email = formValues.email;
        email = email.trim();
        let password = formValues.password;
        if(email.trim().length < 1){
            // console.log("ERROR IN EMAIL",email);
            setEmailError(true);
            flag = false;

        }
        if(password.length < 1){
            // console.log("ERROR IN password",password);
            setPasswordError(true);
            flag = false;

        }
        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))){
            // console.log("ERROR IN EMAIL",email);
            setEmailError(true);
            flag = false;
        }
        if(flag){
            return true;
        }
        return false

    }

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        let returnVariable  = validateFormSchema(formValues);

        if(returnVariable){
            // Call API on successful validation
            axios.post(`${constants.API_BASE_URL}/login`, {
                "email" : formValues.email,
                //ramsingh@gmail.com RamSingh@123
                "password" : formValues.password
            })
                .then(function (response) {
                    // console.log(response);
                    if(response && response.data){
                        // console.log("response: ",response);
                        Cookies.set(constants.authorization_token, response.data.token, { expires: 30 });
                        toast('Logged in successfully', {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            transition: null,
                            // progress: undefined,
                        });
                        navigate("/");
                    }
                })
                .catch(function (error) {
                    toast("An error occurred. Unauthorized access", {
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
        } else {
        }

    }, [formValues])

    return (
        <div>
            <ToastContainer
                autoClose={10}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
            />
            <ToastContainer />
            <div className="d-none d-sm-block">
                <div className="blue-main-gradient py-5">
                    <div className="container">
                        <div className="row">
                            <div className="card">
                            <div className="container my-5">
                                <div className="row d-flex justify-content-center">
                                    <div className="col-lg-12 d-flex justify-content-center">
                                        <h1>WELCOME</h1>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-lg-6 px-md-5 c-border-right ">
                                        <div className="row">
                                            <div className="col-12">
                                                <h2>LOGIN</h2>
                                            </div>
                                            <div className="col-12 ">
                                                <div className="">
                                                    <form onSubmit={handleSubmit}>
                                                        <TextField
                                                            className="w-100 mt-2"
                                                            label="Enter your email*"
                                                            name="email"
                                                            value={formValues.email}
                                                            onChange={handleInputChange}
                                                            error={emailError}
                                                            helperText={emailError && "Please enter email in a valid format"}
                                                        />
                                                        <TextField
                                                            className="w-100 mt-4"
                                                            label="Password*"
                                                            name="password"
                                                            value={formValues.password}
                                                            onChange={handleInputChange}
                                                            type="password"
                                                            error={passwordError}
                                                            helperText={passwordError && "Please enter password"}
                                                        />
                                                        <button type="submit" className="w-100 my-5 blue-main-gradient border-button-blue
                                                height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
                                                                onClick={handleSubmit}>Submit</button>
                                                    </form>
                                                    <div className="d-flex justify-content-center">
                                                        <a href="/forgot-password">
                                                            <small   className="text-decoration-none align-content-center text-center fw-bold fc-light-black cursor-pointer l-spacing-2-0">
                                                                Forgot password?
                                                            </small>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 px-md-5">
                                        <div className="row">
                                            <div className=" ">
                                                <h2>New User?</h2>
                                            </div>
                                            <div className="mt-3">
                                                <h3>Create an account</h3>
                                            </div>
                                            <small className="fc-light-black mt-2">
                                                By creating an account, you get access to early deals, offers, and various coupon
                                                codes to use on the website
                                            </small>
                                            <div className="">
                                                <a href="/register">
                                                    <button type="submit" className="w-100 my-3 blue-main-gradient border-button-blue
                                                    height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 ">
                                                        Register
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="d-block d-sm-none">
                <div className="container-fluid ">

                    <div className="col-12 px-2">
                        <div className="row">
                            <div className=" d-flex justify-content-center mt-4">
                                <h1>WELCOME</h1>
                            </div>
                            <div className=" d-flex justify-content-center mt-2">
                                <h2>LOGIN</h2>
                            </div>
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <form onSubmit={handleSubmit}>
                                        <TextField
                                            className="w-100 mt-1"
                                            label="Enter your email*"
                                            name="email"
                                            value={formValues.email}
                                            onChange={handleInputChange}
                                            error={emailError}
                                            helperText={emailError && "Please enter email"}
                                        />
                                        <TextField
                                            className="w-100 mt-1"
                                            label="Password*"
                                            name="password"
                                            value={formValues.password}
                                            onChange={handleInputChange}
                                            type="password"
                                            error={passwordError}
                                            helperText={passwordError && "Please enter password"}
                                        />
                                        <button type="submit" className="w-100 my-5 blue-main-gradient border-button-blue
                                        height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
                                                onClick={handleSubmit}>Submit</button>
                                    </form>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center">
                                <a href="/forgot-password">
                                    <small   className="text-decoration-none align-content-center text-center fw-bold fc-light-black cursor-pointer l-spacing-2-0">
                                        Forgot password?
                                    </small>
                                </a>
                            </div>
                        </div>
                    </div>

                <hr />
                <div className="col-12 px-2">
                    <div className="row">
                        <div className="  mt-5">
                            <h1>New User?</h1>
                        </div>
                        <div className="">
                            <h2>Create an account</h2>
                        </div>
                        <small className="fc-light-black">
                            By creating an account, you get access to early deals, offers, and various coupon
                            codes to use on the website
                        </small>
                        <div className="">
                            <a href="/register">
                                <button type="submit" className="w-100 my-3 blue-main-gradient border-button-blue
                                                    height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 ">
                                    Register
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );

}