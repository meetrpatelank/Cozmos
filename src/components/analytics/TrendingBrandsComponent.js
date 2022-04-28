//implementation referred from official https://react-chartjs-2.js.org/examples/vertical-bar-chart
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import constants from "../../constants/constants";

function TrendingBrandsComponent() {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const trendingBrandsApi = `${constants.API_BASE_URL}/trendingBrands`;

  const [tBrands, setTBrands] = useState([]);
  const [labels, setLabels] = useState([]);

  let brands = [];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Trending brands",
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of people ordered from these brands",
        data: tBrands.map((ele) => ele.brand_fn),
        backgroundColor: "#75aaf0",
      },
    ],
  };

  useEffect(() => {
    //GET request to fetch the trending brands at Cozmos
    axios
      .get(trendingBrandsApi, {
        headers: {},
      })
      .then((res) => {
        console.log("data ", res.data.response);
        setTBrands(res.data.response);

        for (let i = 0; i < res.data.response.length; i++) {
          brands[i] = res.data.response[i].brand;
        }
        console.log("names: ", brands);
        setLabels(brands);
      })
      .catch((err) => {
        console.log("Err", err);
      });
  }, []);

  return (
    <div style={{ width: "50%", margin: "auto", marginTop: "25px", marginBottom: "25px", border: "1px solid", padding: "10px", boxShadow: "5px 10px" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
}

export default TrendingBrandsComponent;
