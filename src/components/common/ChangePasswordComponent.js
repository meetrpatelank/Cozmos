// Author: Harsh Patel
import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import constants from "../../constants/constants";
import Cookies from "js-cookie";
import {toast, ToastContainer} from "react-toastify";
import TextField from "@material-ui/core/TextField";



export const ChangePasswordComponent = () => {
    let navigate = useNavigate();
    const [formValues, setFormValues] = React.useState({firstName: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [passwordError,setPasswordError] = React.useState(false);
    const [newPasswordError,setNewPasswordError] = React.useState(false);
    const [confirmNewPasswordError,setConfirmNewPassword] = React.useState(false);

    // https://flaviocopes.com/axios-send-authorization-header/
    useEffect(() => {
        console.log("Line 11");
        axios.get(`${constants.API_BASE_URL}/get-user-details`,{headers: {
                'Authorization': Cookies.get(constants.authorization_token)
            }}).then(
            (res) => {
                // console.log("Res: "+JSON.stringify(res));
                if(res.data.success){
                    console.log("res.data.success",res.data.success);
                    // formValues.firstName = res.data.userData.first_name
                    // formValues.lastName = res.data.userData.last_name;
                    // formValues.email = res.data.
                } else if (!(res.data.success)) {
                    navigate("/login");
                }

            }
        ).catch((err) => {
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
            navigate("/login");
            console.log("Err",err);
        })
    },[])


    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };
    const validateFormSchema = () => {
        let flag = true;
        let password = formValues.password;
        let newPassword = formValues.newPassword;
        let confirmNewPassword = formValues.confirmNewPassword;

        if (password.trim().length < 1 || newPassword.trim().length < 1 || confirmNewPassword.trim().length < 1) {

            console.log("LINE $)")

            toast('Please fill out all fields', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                transition: null,
                // progress: undefined,
            });
            return false;
        }

        if(!(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,26}$/.test(newPassword))){
            // console.log("ERROR IN password");
            setNewPasswordError(true);
            flag = false;

        }

        if(!(newPassword === confirmNewPassword)){
            // console.log("ERROR IN ===");
            setConfirmNewPassword(true);
            flag = false;

        }

        if(flag){
            return true;
        }
        return false;
    }

    const handleSubmit = React.useCallback( (e) => {
        e.preventDefault();
        let returnVariable  = validateFormSchema(formValues);
        console.log("return: "+returnVariable);

        if(returnVariable){
            // Call API on successful validation
            axios.post(`${constants.API_BASE_URL}/change-user-password`, {
                "password" : formValues.password,
                "newPassword" : formValues.newPassword,
            },{
                headers: {
                    'Authorization': Cookies.get(constants.authorization_token)
                }})
                .then(function (response) {
                    console.log(response);
                    if(response && response.data && response.data.success){
                        toast('Password updated successfully', {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            transition: null,
                            // progress: undefined,
                        });

                        navigate("/profile");
                    } else if(response && response.data) {
                        console.log("Line 128");
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
                    }
                })
                .catch(function (error) {
                    toast('An error occurred Please try again later', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        transition: null,
                        // progress: undefined,
                    });
                    // console.log("error:   An error occurred: ",error);
                });
        }else{
        }

    },[formValues])
    return(
        <div>

            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-10">
                        <div className="card mt-5">
                            <div className="container">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-lg-12 my-3">
                                            <h2>Change Password</h2>
                                            <hr />
                                        </div>

                                        <div className="col-lg-4 col-md-12">
                                            <TextField
                                                label="Enter your old password*"
                                                className="w-100 mt-4 "
                                                name="password"
                                                type="password"
                                                value={formValues.password}
                                                onChange={handleInputChange}
                                                error={passwordError}
                                                helperText={passwordError && "Enter your old password"}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-12">
                                            <TextField
                                                label="Enter your new password*"
                                                className="w-100 mt-4 "
                                                name="newPassword"
                                                type="password"
                                                value={formValues.newPassword}
                                                onChange={handleInputChange}
                                                error={newPasswordError}
                                                helperText={"Password should be at least 8 characters and should contain one number and one of '!@#$%^&*'"}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-12">
                                            <TextField
                                                className="w-100 mt-4"
                                                label="Confirm your new password*"
                                                name="confirmNewPassword"
                                                type="password"
                                                value={formValues.confirmNewPassword}
                                                onChange={handleInputChange}
                                                error={confirmNewPasswordError}
                                                helperText={confirmNewPasswordError && "New Password and confirm password should match"}
                                            />
                                        </div>
                                        {/*<div className="col-lg-3 col-md-12">*/}
                                        {/*    /!*<h1>Harsh</h1>*!/*/}
                                        {/*</div>*/}
                                        <div className="col-lg-4 col-md-12">
                                            <button type="submit"
                                                    className="w-100 my-4 my-3 blue-main-gradient border-button-blue
                                                    height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 my-5"
                                                    onClick={handleSubmit}>UPDATE</button>
                                        </div>

                                    </div>
                                </form>
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