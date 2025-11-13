import { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme CSS file
import { DateRangePicker, DefinedRange, DateRange } from "react-date-range";
import { Flex, Button } from "@chakra-ui/react";
import { template } from "lodash";

const DateRangeComponent = ({ setShowSection, setDateRange }) => {
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        }
    ]);

    // Define your custom ranges without "days up to today" and "days starting today"
    const customRanges = {
        selection: {
            startDate: state[0].startDate,
            endDate: state[0].endDate,
            key: "selection"
        }
    };

    const getDefault = () => {
        return { startDate: null, endDate: null };
    };

    // Function to get date for "Last 7 days"
    const getLast7DaysRange = () => {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6); // Set start date 7 days ago
        return { startDate, endDate };
    };

    // Function to get date for "Last 1 month"
    const getLast1MonthRange = () => {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 1); // Set start date 1 month ago
        return { startDate, endDate };
    };

    const getLast1QuarterRange = () => {
        const endDate = new Date();
        const startDate = new Date(endDate);

        // Calculate start date for last quarter (3 months ago)
        startDate.setMonth(startDate.getMonth() - 3);

        return { startDate, endDate };
    };

    // Function to get date for "Last year to today"
    const getLastYearToTodayRange = () => {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setFullYear(startDate.getFullYear() - 1); // Set start date 1 year ago
        return { startDate, endDate };
    };

    return (
        <Flex flexDirection="column">
            {/* <Flex gap="30px" m={"20px"}>
                <DefinedRange
                    onChange={(item) => setState([item.selection])}
                    ranges={state}
                    staticRanges={[
                        {
                            label: "Last 7 days",
                            range: getLast7DaysRange,
                            isSelected: (range) => {
                                const today = new Date();
                                return (
                                    range.startDate <= today &&
                                    range.endDate >= today
                                );
                            }
                        },
                        {
                            label: "Last 1 month",
                            range: getLast1MonthRange,
                            isSelected: (range) => {
                                const today = new Date();
                                return (
                                    range.startDate <= today &&
                                    range.endDate >= today
                                );
                            }
                        },
                        {
                            label: "Last 1 quarter",
                            range: getLast1QuarterRange,
                            isSelected: (range) => {
                                const today = new Date();
                                return (
                                    range.startDate <= today &&
                                    range.endDate >= today
                                );
                            }
                        },
                        {
                            label: "Last year to today",
                            range: getLastYearToTodayRange,
                            isSelected: (range) => {
                                const today = new Date();
                                return (
                                    range.startDate <= today &&
                                    range.endDate >= today
                                );
                            }
                        }
                    ]}
                />
                <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setState([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                />
            </Flex> */}
            <DateRangePicker
                onChange={(item) => setState([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={state}
                staticRanges={[
                    {
                        label: "Select Default",
                        range: getDefault,
                        isSelected: (range) => {
                            return (
                                range.startDate === null &&
                                range.endDate === null
                            );
                        }
                    },
                    {
                        label: "Last 7 days",
                        range: getLast7DaysRange,
                        isSelected: (range) => {
                            const today = new Date();
                            return (
                                range.startDate <= today &&
                                range.endDate >= today
                            );
                        }
                    },
                    {
                        label: "Last 1 month",
                        range: getLast1MonthRange,
                        isSelected: (range) => {
                            const today = new Date();
                            return (
                                range.startDate <= today &&
                                range.endDate >= today
                            );
                        }
                    },
                    {
                        label: "Last 1 quarter",
                        range: getLast1QuarterRange,
                        isSelected: (range) => {
                            const today = new Date();
                            return (
                                range.startDate <= today &&
                                range.endDate >= today
                            );
                        }
                    },
                    {
                        label: "Last year to today",
                        range: getLastYearToTodayRange,
                        isSelected: (range) => {
                            const today = new Date();
                            return (
                                range.startDate <= today &&
                                range.endDate >= today
                            );
                        }
                    }
                ]}
                inputRanges={[]}
                // rangeColors={["#578EFB"]}
                direction="horizontal"
                style={{ width: "250px" }}
                maxDate={new Date()}
            />
            <Flex justifyContent="flex-end" mt="2.5" gap="15px">
                <Button variant="outline" onClick={() => setShowSection(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        if (state[0].startDate && state[0].endDate) {
                            setDateRange({
                                start: state[0].startDate,
                                end: state[0].endDate
                            });
                            setShowSection(false);
                        } else {
                            setDateRange({
                                start: null,
                                end: null
                            });
                            setShowSection(false);
                        }
                    }}
                >
                    Apply
                </Button>
            </Flex>
        </Flex>
    );
};

export default DateRangeComponent;
