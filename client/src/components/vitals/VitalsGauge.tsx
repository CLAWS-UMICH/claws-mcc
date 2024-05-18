import React, { Component } from "react";
import Chart from "react-apexcharts";

// Define the props type with text as a string
type VitalsGaugeProps = {
    id: string;
    text: string;
    name: number;
    value: number;
};

// Define the component using the function component syntax with the VitalsGaugeProps type
const VitalsGauge: React.FC<VitalsGaugeProps> = ({ id, text, name, value }) => {
    var nameVal = name.toString();
    if (name > 9999) {
        var tens = name / 1000;
        nameVal = tens.toString() + "K";
    }

    const options = {
        colors: ["#FFFFFF"],
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                track: {
                    background: '#76767676',
                    startAngle: -135,
                    endAngle: 135,
                },
                dataLabels: {
                    name: {
                        show: true,
                        fontSize: "18.5px",
                        fontWeight: "400",
                        offsetY: "6.5"
                    },
                    value: {
                        fontSize: "11.5px",
                        offsetY: "10",
                        color: "#FFFFFF",
                        show: true,
                        formatter: function (val: any) {
                            return text
                        }
                            }
                }
            }
        },
        fill: {
            type: "solid",
        },
        stroke: {
            lineCap: "round"
        },
        labels: [nameVal]
    };

    const series = [value]

    return (
        <div style={{ width: '80px', height: '80px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Chart
                options={options}
                series={series}
                type="radialBar"
                height="125"
                width="125"
                />
            </div>
        </div>
    )
}

export default VitalsGauge;