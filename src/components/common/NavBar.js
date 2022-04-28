import React from "react";
import { Container, Form, FormControl } from "react-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import "./Navbar.css";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { FavoriteBorderOutlined, ShoppingBagOutlined } from "@mui/icons-material";

const Styles = styled.div`
  .nav-link {
    margin-left: 25px;
  }
  .form-control {
    max-height: 30px;
    border-radius: 1.25rem;
  }
  .d-flex {
    position: relative;
    display: flex;
    width: 40%;
    margin-right: 40px;
    padding: 10px;
  }
  .icon-div {
    margin-left: 10px;
    margin-right: 15px;
  }
`;

const NavBar = () => (
  <Styles>
    <Navbar expand="lg" className="blue-main-gradient">
      <Container>
        <Navbar.Brand href="/">
          <img src="/icons/logo.png" width="55" height="55" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/orders">My Orders</Nav.Link>
            <Nav.Link href="/analytics">Trending</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" />
          </Form>
          <div className="icon-div">
            <a href="/profile">
              <Avatar src="/broken-image.jpg" sx={{ width: 35, height: 35 }} />
            </a>
          </div>
          <div className="icon-div">
            <a href="/wishlist">
              <FavoriteBorderOutlined fontSize="large" />
            </a>
          </div>
          <div className="icon-div">
            <a href="/cart">
              <ShoppingBagOutlined fontSize="large" />
            </a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </Styles>
);

export default NavBar;
