import "./css/custom.css";
import { Login } from "./pages/Login";
import { PlaceOrder } from "./pages/PlaceOrder";
import { Payment } from "./pages/Payment";
import Wishlist from "./pages/Wishlist";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/common/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Profile } from "./pages/Profile";
import "../src/css/custom.css";
import { Register } from "./pages/Register";
import { ChangePassword } from "./pages/ChangePassword";
import ProductInformationPage from "./pages/ProductInformationPage";
import Cart from "./pages/Cart";
import PageNotFound from "./pages/PageNotFound";
import { ForgotPassword } from "./pages/ForgotPassword";
import { SetPassword } from "./pages/SetPassword";
import Orders from "./pages/Order";
import OrderDetails from "./pages/OrderDetails";
import { Analytics } from "./pages/Analytics";
import {WriteReview} from "./components/users/WriteReview";

function App() {
  return (
    <div className="App">
      <NavBar />

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/wishlist" element={<Wishlist />}></Route>
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/set-password" element={<SetPassword />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/orderDetails/:id" element={<OrderDetails />}></Route>
          <Route path="/productinformation/:id" element={<ProductInformationPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/write-review/:id" element={<WriteReview />} />
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
