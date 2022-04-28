import React, {useEffect, useState} from 'react';
import {TextField} from "@material-ui/core";
import Cookies from "js-cookie";
import constants from "../../constants/constants";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

export const    WriteReview = () => {
    const navigate = useNavigate();
    const [starValue, setStarValue] = React.useState(0);
    const handleStarClick = (number) => {
        setStarValue(number);
    }
    const [formValues, setFormValues] = React.useState({
        description: "",
    });
    const param = useParams();
    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };
    const [productData, setProductData] = useState([]);
    const [reviewDescription, setReviewDescription] = React.useState('');
    const getReviewItem = `${constants.API_BASE_URL}/productinformation/${param.id}`;
    useEffect(()=> {
        // if(Cookies.get(constants.authorization_token)){
        //     navigate('/');
        // }
        console.log("getReviewItem: ",getReviewItem);
        axios
            .get(getReviewItem, {
                headers: {
                    Authorization: Cookies.get(constants.authorization_token),
                },
            })
            .then((response) => {
                console.log("Response received in Frontend: ", response);
                console.log("response.data.success", response.data.response[0]);

                console.log("response.data.success", response.data.response[0]);
                setProductData(response.data.response[0]);
            })
            .catch((err) => {
                console.log("Error:", err);
                // navigate("/login");
            });
    },[]);


    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        console.log("description: ",formValues.description);
        console.log("starRating: ",starValue);


            // Call API on successful validation
            axios.post(`${constants.API_BASE_URL}/addReview`, {
                "product_id": productData.id,
                "comments" : formValues.description,
                "rating" : starValue
            },{
                headers: {
                    'Authorization': Cookies.get(constants.authorization_token)
                }}).then(function (response) {
                    console.log(response);
                    if(response && response.data){
                        // console.log("response: ",response);
                        // Cookies.set(constants.authorization_token, response.data.token, { expires: 30 });
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
                        navigate("/orders");
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


    }, [starValue,reviewDescription,formValues])


    return(
        <div>
            {console.log("productData",productData)}
            <div className="d-block d-sm-none">
                <div className="row px-1 mt-5">
                    <div className="col-5">
                        <img src={`${productData.thumbnail_path}${productData.id}/image1.webp`} width="140" height="140"/>
                    </div>
                    <div className="col-7 mt-2">
                        <div className="text-align-left fw-medium product-name-font lh1-3" >
                            {productData && productData.name}
                        </div>
                        <div className="text-align-left product-details-font mt-2">
                            Quantity:<text className="fw-medium">1</text>
                        </div>
                    </div>

                    <div className="container mt-3">
                        <div className="col-12 text-align-left px-3">
                            <div className="fs-20 fw-medium">Your Rating</div>
                            {starValue > 0 ? (
                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,1)}
                                    />)
                                :
                                (
                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,1)}
                                    />
                                )}
                            {starValue > 1 ? (
                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,2)}
                                    />)
                                :
                                (
                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,2)}
                                    />
                                )}
                            {starValue > 2 ? (
                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,3)}
                                    />)
                                :
                                (
                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,3)}
                                    />
                                )}
                            {starValue > 3 ? (
                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,4)}
                                    />)
                                :
                                (
                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,4)}
                                    />
                                )}
                            {starValue > 4 ? (
                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,5)}
                                    />)
                                :
                                (
                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                         onClick={handleStarClick.bind(this,5)}
                                    />
                                )}
                        </div>
                    </div>

                    <div className="container">
                        <div className="col-12 text-align-left px-3">
                            <div className="mt-3">
                                <TextField
                                    multiline
                                    name="description"
                                    label="Add your review"
                                    className="w-100"
                                    margin="normal"
                                    onChange={handleInputChange}
                                    inputProps={{
                                        maxLength: 300,
                                    }}
                                    value={formValues.description}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="container my-3 text-align-left" >
                        <div className="col-12 px-3">
                            <button type="submit" onClick={handleSubmit} disabled={starValue < 1} className="mouse-pointer text-uppercase mt-3 btn  btn-outline-dark fw-bold px-5 bg-info">
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container d-none d-sm-block">

                <div className="row d-flex justify-content-center text-align-left mt-5">

                    <div  className="col-lg-7 col-12 ">
                        <div className="card shadow">
                            <div className="card-body ">
                                <div className="row">
                                    <div className="col-lg-5 col-md-5 col-6">
                                        <img src={`${productData.thumbnail_path}${productData.id}/image1.webp`} width="260" height="260"/>
                                    </div>
                                    <div className="col-lg-7 col-6 mt-1">
                                        <div className="text-align-left fw-medium product-name-font lh1-3" >
                                            {productData && productData.name}</div>
                                        <div className="text-align-left product-details-font mt-2">
                                            Quantity:<text className="fw-medium">1</text>
                                        </div>
                                    </div>

                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-7 mt-3">
                                            <div className="fs-24 fw-medium">Your Rating</div>
                                            {starValue > 0 ? (
                                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,1)} className="mouse-pointer"
                                                    />)
                                                :
                                                (
                                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,1)} className="mouse-pointer"
                                                    />
                                                )}
                                            {starValue > 1 ? (
                                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,2)} className="mouse-pointer"
                                                    />)
                                                :
                                                (
                                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,2)} className="mouse-pointer"
                                                    />
                                                )}
                                            {starValue > 2 ? (
                                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,3)} className="mouse-pointer"
                                                    />)
                                                :
                                                (
                                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,3)} className="mouse-pointer"
                                                    />
                                                )}
                                            {starValue > 3 ? (
                                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,4)} className="mouse-pointer"
                                                    />)
                                                :
                                                (
                                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,4)} className="mouse-pointer"
                                                    />
                                                )}
                                            {starValue > 4 ? (
                                                    <img src="/icons/full-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,5)} className="mouse-pointer"
                                                    />)
                                                :
                                                (
                                                    <img src="/icons/empty-star.svg" width="30px" height="30px"
                                                         onClick={handleStarClick.bind(this,5)} className="mouse-pointer"
                                                    />
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="mt-3">
                                        <TextField
                                            multiline
                                            name="description"
                                            label="Add your review"
                                            className="w-100"
                                            margin="normal"
                                            onChange={handleInputChange}
                                            inputProps={{
                                                maxLength: 300,
                                            }}
                                            value={formValues.description}
                                        />
                                    </div>
                                </div>

                                <div className="container my-3" >
                                    <button onClick={handleSubmit} disabled={starValue < 1} className="text-uppercase mt-3 btn  btn-outline-dark fw-bold px-5 bg-info mouse-pointer">
                                        SUBMIT
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}