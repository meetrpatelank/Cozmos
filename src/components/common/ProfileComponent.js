// Author: Harsh Patel
import React, {useEffect}  from 'react';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import Cookies from 'js-cookie'
import constants from "../../../src/constants/constants"
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";

export const ProfileComponent = () => {
    let navigate = useNavigate();
    const [formValues, setFormValues] = React.useState({firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [userName,setUserName] = React.useState("User");
    // https://flaviocopes.com/axios-send-authorization-header/
    useEffect(() => {
        // on load call to API
        axios.get(`${constants.API_BASE_URL}/get-user-details`,{headers: {
                'Authorization': Cookies.get(constants.authorization_token)
            }}).then(
            (res) => {
                // console.log("Res: "+JSON.stringify(res));
                console.log("Res: "+res.data);
                console.log("Res: "+res.data.userData.first_name);

                if(res.data.success){
                    console.log("res.data.success",res.data.success);
                    setFormValues({ ...formValues,
                        firstName: res.data.userData.first_name
                        ,lastName: res.data.userData.last_name,
                        email:res.data.userData.email })
                    setUserName(res.data.userData.first_name);
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
    },[]);




    const [firstNameError,setFirstNameError] = React.useState(false);
    const [lastNameError,setLastNameError] = React.useState(false);
    const [emailError,setEmailError] = React.useState(false);

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };
    const validateFormSchema = () => {
        let flag = true;
        let fName = formValues.firstName;
        let lName = formValues.lastName;
        let email = formValues.email;

        if(fName.trim().length < 1 || lName.trim().length < 1 || email.trim().length < 1){
            // alert("Please fill out all fields and password with min length 8")
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
        fName = fName.trim();
        lName = lName.trim();
        email = email.trim();

        if(!(/^[a-zA-Z]+$/.test(fName))){
            // console.log("ERROR IN FNAME"+fName+"sfd");
            setFirstNameError(true);
            flag = false;

        }
        if(!(/^[a-zA-Z]+$/.test(lName))){
            // console.log("ERROR IN LNAME",lName);
            setLastNameError(true);
            flag = false;

        }
        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))){
            // console.log("ERROR IN EMAIL",email);
            setEmailError(true);
            flag = false;

        }
        // console.log("LINEn 74",(/^[A-Za-z0-9_@./#&+-]*$/.test(password)));
        //https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters

        if(flag){
            return true;
        }
        return false

    }


    const handleSubmit = React.useCallback( (e) => {
        e.preventDefault();
        let returnVariable  = validateFormSchema(formValues);
        console.log("return: "+returnVariable);

        if(returnVariable){

            axios.post(`${constants.API_BASE_URL}/update-user-details`, {
                "first_name" : formValues.firstName,
                "last_name" : formValues.lastName,
                "email" : formValues.email,
            },{
                headers: {
                    'Authorization': Cookies.get(constants.authorization_token)
                }})
                .then(function (response) {
                    console.log(response);
                    if(response && response.data && response.data.success){
                        toast('User updated successfully', {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            transition: null,
                            // progress: undefined,
                        });
                        // Cookies.set(constants.authorization_token, response.data.token, { expires: 30 });

                        // navigate("/");
                    } else {
                        toast('Email already exist', {
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


    const handleLogout = React.useCallback( (e) => {
        axios.get(`${constants.API_BASE_URL}/logout`,
        {
            headers: {
                'Authorization': Cookies.get(constants.authorization_token)
            }}
        ).then(function (response){
            console.log("response",response);
            if(response && response.data && response.data.success){
                Cookies.remove(constants.authorization_token)
                toast('Logged out successfully', {
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
        }).catch(function (error) {
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
    },[formValues])
    return (
        <div>
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-10 d-flex justify-content-between mt-5">
                        <h1>Welcome {userName}</h1>
                        <button type="submit"
                                className="w-25 blue-main-gradient border-button-blue
                                                    height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
                                onClick={handleLogout}>LOGOUT</button>
                    </div>

                </div>
            </div>
            <div className="container">
               <div className="row d-flex justify-content-center">
                   <div className="col-lg-10">
                       <div className="card mt-5">
                           <div className="container">

                                    <div className="row">
                                   <div className="col-lg-12 my-3">
                                        <h2>Edit Profile</h2>
                                        <hr />
                                    </div>

                                       <div className="col-lg-3 col-md-12 mb-4">
                                           <TextField
                                               label="Enter your first name*"
                                               className="w-100 mt-4 "
                                               name="firstName"
                                               value={formValues.firstName}
                                               onChange={handleInputChange}
                                               error={firstNameError}
                                               helperText={firstNameError && "First Name only accepts letters"}
                                           />
                                       </div>
                                       <div className="col-lg-3 col-md-12 mb-4">
                                           <TextField
                                               label="Enter your last name*"
                                               className="w-100 mt-4 "
                                               name="lastName"
                                               value={formValues.lastName}
                                               onChange={handleInputChange}
                                               error={lastNameError}
                                               helperText={lastNameError && "Last Name only accepts letters"}
                                           />
                                       </div>
                                       <div className="col-lg-3 col-md-12 mb-4">
                                           <TextField
                                               className="w-100 mt-4"
                                               label="Enter your email*"
                                               name="email"
                                               value={formValues.email}
                                               onChange={handleInputChange}
                                               error={emailError}
                                               helperText={emailError && "Please enter in correct email format"}
                                           />
                                       </div>
                                       <div className="col-lg-3 col-md-12">
                                           {/*<h1>Harsh</h1>*/}
                                       </div>
                                        <div className="col-lg-3 col-md-12">
                                            <button type="submit"
                                                    className="w-100 my-2 blue-main-gradient border-button-blue
                                                    height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 "
                                                    onClick={handleSubmit}>UPDATE</button>
                                        </div>

                                        <div className="col-lg-3 col-md-12">
                                            <a href="/change-password">
                                            <button
                                                    className="w-100 my-2  grey-gradient border border-dark
                                                    height-40 border-radius-20 fw-bold fs-16 text-uppercase l-spacing-2-0 ">
                                                Change Password</button>
                                            </a>
                                        </div>

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
    );

}