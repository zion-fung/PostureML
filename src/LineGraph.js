import React, { Component } from 'react'
import Chart from "chart.js";
// import classes from "./chart.module.css";

export default class LineGraph extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");


        new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: ["Jan", "Feb", "March"],
                datasets: [
                    {
                        label: "Sales",
                        data: [86, 67, 91],
                    }
                ]
            },
            options: {
            }
        });
    }
    render() {
        return (
            <div>
                <canvas
                    id="myChart" width="150" height="50"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}
