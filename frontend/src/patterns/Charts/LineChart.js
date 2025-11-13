import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";

Chart.register(...registerables);

function LineChart(props) {
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
    return <Line data={props?.data} options={props?.options} />;
}

export default LineChart;
