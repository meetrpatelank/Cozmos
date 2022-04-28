//implementation referred from official https://react-chartjs-2.js.org/examples/vertical-bar-chart
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import constants from "../../constants/constants";

function TrendingProductsComponent() {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const trendingProductsApi = `${constants.API_BASE_URL}/trendingProducts`;

  const [tProducts, setTProducts] = useState([]);
  const [labels, setLabels] = useState([]);

  let products = [];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Trending products",
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of people bought these products",
        data: tProducts.map((ele) => ele.product_fn),
        backgroundColor: "#75aaf0",
      },
    ],
  };

  useEffect(() => {
    //GET request to fetch the trending products at Cozmos
    axios
      .get(trendingProductsApi, {
        headers: {},
      })
      .then((res) => {
        console.log("data ", res.data.response);
        setTProducts(res.data.response);

        for (let i = 0; i < res.data.response.length; i++) {
          products[i] = res.data.response[i].name;
        }
        console.log("names: ", products);
        setLabels(products);
      })
      .catch((err) => {
        console.log("Err", err);
      });
  }, []);

  return (
    <div style={{ width: "50%", margin: "auto", marginTop: "25px", border: "1px solid", padding: "10px", boxShadow: "5px 10px" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
}

export default TrendingProductsComponent;
