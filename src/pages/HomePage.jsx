import React, { useEffect, useState } from "react";
import "../css/HomePage.css";
import { Grid } from "@mui/material";
import { Card, Carousel, Col, Container, Row, Button } from "react-bootstrap";
import constants from "../constants/constants"
import {useNavigate} from 'react-router-dom'

function HomePage() {
  const [information, newInformation] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    fetch(`${constants.API_BASE_URL}/productcatalogue`)
      .then((response) => response.json())
      .then((response) => {
        newInformation(response.response);
      });
  }, []);


  return (
    <div>
      <div className="container main-div">
        <Grid container spacing={4}>
          <Grid item xs>
            <Carousel> 
              <Carousel.Item interval={3000}>
                <img
                  className="d-block w-100"
                  src={"assets/images/carousel/image1.jpg"}
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <img
                  className="d-block w-100"
                  src={"assets/images/carousel/image2.jpg"}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <img
                  className="d-block w-100"
                  src={"assets/images/carousel/image3.jpg"}
                  alt="Third slide"
                />
                <Carousel.Caption>                  
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Grid>
          <Grid item xs>
            <Carousel>
              <Carousel.Item interval={3000}>
                <img
                  className="d-block w-100"
                  src={"assets/images/carousel/image4.jpg"}
                  alt="First slide"
                />
                <Carousel.Caption>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <img
                  className="d-block w-100"
                  src={"assets/images/carousel/image5.jpg"}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <img
                  className="d-block w-100"
                  src={"assets/images/carousel/image6.jpg"}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          </Grid>
        </Grid>
      </div>
      <Container className="card-container">
        <Row xs={1} md={4} className="g-4">
          {information.map((item) => {
            return (
              <Col className="card-col">
                <Card className="card-body" key={item.id} onClick = {() => {navigate(`/productinformation/${item.id}`)}}>
                  <Card.Img
                    variant="top"
                    src={item.thumbnail_path + item.id + "/image1.webp"}
                  />
                  <Card.Body>
                    <Card.Title >{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default HomePage; 
