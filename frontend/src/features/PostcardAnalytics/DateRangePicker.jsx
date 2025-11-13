import React, { useEffect, useState } from "react";
import { Select } from "@chakra-ui/react";
import moment from "moment";

const DateRangePicker = () => {
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [selectedOption, setSelectedOption] = useState("last7days");

    useEffect(() => handleDateRangeChange("last7days"), []);

    const handleDateRangeChange = (value) => {
        let startDate = null;
        let endDate = moment(); // Using moment for endDate

        switch (value) {
            case "last7days":
                startDate = moment().subtract(6, "days");
                break;
            case "last1month":
                startDate = moment().subtract(1, "months").startOf("day");
                break;
            case "last1quarter":
                startDate = moment().subtract(3, "months").startOf("day");
                break;
            case "last1year":
                startDate = moment().subtract(1, "years").startOf("day");
                break;
            default:
                break;
        }

        setDateRange({ start: startDate, end: endDate });
        setSelectedOption(value);
    };

    return (
        // <MantineProvider>
        <div style={{ maxWidth: "400px", margin: "auto" }}>
            <Select
                value={selectedOption}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                style={{ width: "100%", marginBottom: "1em" }}
            >
                <option value="last7days">Last 7 days</option>
                <option value="last1month">Last 1 month</option>
                <option value="last1quarter">Last 1 quarter</option>
                <option value="last1year">Last year to today</option>
            </Select>
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center"
                }}
            >
            </div>
        </div>
    );
};

export default DateRangePicker;
