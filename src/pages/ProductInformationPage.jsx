import React,{useEffect,useState} from 'react'
import StarIcon from '@mui/icons-material/Star';
import '../css/ProductInformationPage.css'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import constants from "../constants/constants"
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function ProductInformationPage() {
    const [information, newInformation] = useState([]);
    const [isWishlist,setIsWishlist] = useState(false);
    const [isCartlist,setIsCartlist] = useState(false);

    const param = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${constants.API_BASE_URL}/productinformation/${param.id}`)
        .then((res) => {
            newInformation(res.data.response[0])
          })       
      }, []);

      const handleWishlist = (id) => {
            
            const data = {
                "product_id": id
              };
            axios.post(`${constants.API_BASE_URL}/wishlistproduct`, data, {
                headers: {
                  Authorization: Cookies.get(constants.authorization_token),
                },
              }).then((response) => {
                if (response.data.success) {
                 setIsWishlist(true);
                  toast("Added to Wishlisted successfully", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    transition: null,
                  });
                } else {
                  navigate("/login");
                }
              })
              .catch((err) => {
                console.log("Error:", err);
              });
      }

      const handleAddToCart = (id) =>{
        const data = {
            product_id: id,
            quantity: 1,
          };

          axios.post(`${constants.API_BASE_URL}/cart/add`, data, {
            headers: {
              Authorization: Cookies.get(constants.authorization_token),
            },
          })
          .then((response) => {
            if (response.data.success) {
              setIsCartlist(true);
              toast("Added to Cart successfully", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                transition: null,
                // progress: undefined,
              });
            } else if (!response.data.success) {
              navigate("/login");
            }
          })
          .catch((err) => {
            console.log("Error:", err);
          });
      }

    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col col-md-6 con">
                    <div className="row justify-content-md-center">
                        <div className="col col-lg-5 img_brand">
                            <img className='prod-image'  src={`${information.thumbnail_path}${information.id}/image1.webp`} alt='brand-1'/>
                        </div>
                        <div className="col col-lg-5 img_brand">
                            <img className='prod-image' src={`${information.thumbnail_path}${information.id}/image2.webp`} alt='brand-1'/>
                        </div>
                    </div>
                        <div className="row justify-content-md-center sec_row">
                            <div className="col col-lg-5 img_brand">
                                <img className='prod-image' src={`${information.thumbnail_path}${information.id}/image3.webp`} alt='brand-1'/>
                            </div>
                            <div className="col col-lg-5 img_brand">
                                <img className='prod-image' src={`${information.thumbnail_path}${information.id}/image4.webp`} alt='brand-1'/>
                            </div>
                        </div>
                </div>
                <div className="col col-lg-6 con_1">
                    <div className="row justify-content-md-center row_pad">
                        <div className='content-div'>
                            <h1>{information.brand}</h1>
                            <h5 className='prod-name'>{information.name}</h5>
                            <p className='rating-para box_border'>4.5
                                <span><StarIcon color='inherit' fontSize='medium' position="absolute"/></span>
                                | 5 Reviews</p>
                            <hr className='hr-line'></hr>

                        </div>
                        <div className='content-div'>
                            <h1 className='box_border'><em>${information.selling_price}</em></h1>
                            <div className='pad'>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{
                                    width: "40%"
                                }}
                                onClick={() => {
                                    handleAddToCart(param.id);
                                  }}
                                  
                                >{isCartlist ? "Added to Cart" : "Add to Cart"}</button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{
                                    width: "48%",
                                    marginLeft: "8%"
                                }}
                                onClick={() => {
                                    handleWishlist(param.id)
                                }}
                                >
                                    {isWishlist ? "Added to wishlist" : "Add to wishlist"}</button>
                            </div>
                            <hr className='hr-line'></hr>
                            <div className='content-div product-info'>
                                <p>Product Details</p>
                                    <ul>
                                        <li>{information.description}</li>
                                        <li>Machine Washable</li>
                                    </ul>
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

export default ProductInformationPage