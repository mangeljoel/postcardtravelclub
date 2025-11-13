import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables);
Chart.register(ChartDataLabels);

function BarChart(props) {
    const [zoomPlugin, setZoomPlugin] = useState(null);

    useEffect(() => {
        // Dynamic import of chartjs-plugin-zoom to ensure it runs only in the browser
        import("chartjs-plugin-zoom")
            .then((zoom) => {
                Chart.register(zoom.default);
                setZoomPlugin(zoom.default); // Store the loaded plugin in state
            })
            .catch((error) => {
                console.error("Failed to load chartjs-plugin-zoom", error);
            });
    }, []);

    return (
        <Bar
            data={props?.data}
            options={props?.options}
            plugins={
                zoomPlugin ? [ChartDataLabels, zoomPlugin] : [ChartDataLabels]
            } // Use the plugin only if it has been loaded
        />
    );
}

export default BarChart;
