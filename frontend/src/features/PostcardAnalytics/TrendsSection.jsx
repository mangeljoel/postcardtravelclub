import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { BsGlobe } from "react-icons/bs";
import BarChart from "../../patterns/Charts/BarChart";
import LineChart from "../../patterns/Charts/LineChart";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { apiNames } from "../../services/fetchApIDataSchema";
import AppContext from "../AppContext";
import LoadingGif from "../../patterns/LoadingGif";

const TrendsSection = ({
    icon,
    title,
    chartText,
    isHotel,
    companyId,
    dateRange
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emptyState, setEmptyState] = useState("");

    useEffect(() => {
        if (title == "Total visitors referred to partner websites") {
            setEmptyState("No visitors referred");
        } else if (title == "Total partner profile page views") {
            setEmptyState("No Profile page views");
        } else if (title == "Total postcards collected") {
            setEmptyState("No Postcards Collected");
        } else if (title == "Total followers") {
            setEmptyState("No followers");
        }
    }, [title]);

    useEffect(() => {
        const generateDateRange = (startDate, endDate) => {
            const dates = [];
            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        };

        const processData = (data) => {
            // Initialize an empty object to store counts
            const counts = {};

            const minDate = new Date(
                Math.min(...data.map((item) => new Date(item.createdAt)))
            );
            const startDate = dateRange.start
                ? new Date(dateRange.start)
                : minDate;
            const endDate = dateRange.end
                ? new Date(dateRange.end)
                : new Date();

            const allDates = generateDateRange(startDate, endDate);
            allDates.forEach((date) => {
                const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });
                counts[formattedDate] = 0;
            });
            // Calculate counts for each formatted date
            data.forEach((item) => {
                const date = new Date(item.createdAt);
                const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });
                counts[formattedDate] = (counts[formattedDate] || 0) + 1;
            });

            // Extract labels and values from counts object
            const labels = Object.keys(counts);
            const values = Object.values(counts);

            // Calculate cumulative values
            let totalSum = 0;
            const cumulativeValues = values.reduce((acc, value) => {
                totalSum += value;
                acc.push(acc.length > 0 ? acc[acc.length - 1] + value : value);
                return acc;
            }, []);

            // Update state or perform any other action with the processed data
            setData({ labels, values, cumulativeValues, totalSum });
        };

        let dateFilter = null;
        if (dateRange.start && dateRange.end) {
            dateFilter = {
                $and: [
                    { createdAt: { $gte: dateRange.start.toISOString() } },
                    { createdAt: { $lte: dateRange.end.toISOString() } }
                ]
            };
        }
        setLoading(true)
        if (title == "Total visitors referred to partner websites") {
            fetchPaginatedResults(
                apiNames.event,
                {
                    event_master: 1,
                    ...(isHotel
                        ? {
                            $or: [
                                {
                                    postcard: {
                                        album: {
                                            company: {
                                                id: companyId
                                            }
                                        }
                                    }
                                },
                                {
                                    album: {
                                        company: { id: companyId }
                                    }
                                }
                            ]
                        }
                        : {}),
                    ...(dateFilter ? dateFilter : {})
                },
                {},
                "updatedAt:ASC"
            ).then((response) => {
                if (Array.isArray(response)) processData(response);
                else processData([response]);
                setLoading(false)
            });
        } else if (title == "Total partner profile page views") {
            fetchPaginatedResults(
                apiNames.event,
                {
                    event_master: 2,
                    ...(isHotel
                        ? { album: { company: { id: companyId } } }
                        : {}),
                    ...(dateFilter ? dateFilter : {})
                },
                {},
                "updatedAt:ASC"
            ).then((response) => {
                if (Array.isArray(response)) processData(response);
                else processData([response]);
                setLoading(false)
            });
        } else if (title == "Total postcards collected") {
            fetchPaginatedResults(
                "bookmarks",
                {
                    ...(isHotel
                        ? {
                            postcard: {
                                album: {
                                    company: { id: companyId }
                                }
                            }
                        }
                        : {}),
                    user: { id: { $notNull: true } },
                    ...(dateFilter ? dateFilter : {})
                },
                {},
                "updatedAt:ASC"
            ).then((response) => {
                if (Array.isArray(response)) processData(response);
                else processData([response]);
                setLoading(false)
            });
        } else if (title == "Total followers") {
            fetchPaginatedResults(
                isHotel ? "follow-companies" : "follow-albums",
                {
                    ...(isHotel
                        ? {
                            company: { id: companyId },
                            follower: { id: { $notNull: true } }
                        }
                        : { follower: { id: { $notNull: true } } }),
                    ...(dateFilter ? dateFilter : {})
                },
                {},
                "updatedAt:ASC"
            ).then((response) => {
                if (Array.isArray(response)) processData(response);
                else processData([response]);
                setLoading(false)
            });
        }
    }, [title, dateRange]);
    return (
        <Box>
            <Flex
                gap="15px"
                justifyContent={"flex-start"}
                alignItems={"center"}
            >
                {icon}
                <Text
                    color={"#5A5A5A"}
                    fontWeight={"700"}
                    fontSize={"40px"}
                    fontFamily={"raleway"}
                >
                    {title}
                </Text>
            </Flex>
            <Flex
                flexWrap={"wrap"}
                my={10}
                border={"1px solid black"}
                borderRadius={"10px"}
                p={5}
            >
                <Box
                    width="50%"
                    height="300px"
                    position={"relative"}
                    p={2}
                    borderBottom="0.5px solid grey"
                    borderRight="0.5px solid grey"
                >
                    <Text
                        position={"absolute"}
                        fontFamily="raleway"
                        fontWeight={"500"}
                        top="0"
                        left="10px"
                    >
                        Total Number
                    </Text>
                    <Flex
                        height={"100%"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Text
                            fontFamily={"raleway"}
                            fontWeight={"300"}
                            fontSize={"90"}
                            color="#4285F4"
                        >
                            {loading ? <Flex h={"100%"} justify={"center"} alignItems={"center"}>
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl'
                                />
                            </Flex> : data?.totalSum || 0}
                        </Text>
                    </Flex>
                </Box>
                <Box
                    width="50%"
                    height="300px"
                    position={"relative"}
                    p={2}
                    borderBottom="0.5px solid grey"
                    borderLeft="0.5px solid grey"
                >
                    <Text
                        position={"absolute"}
                        fontFamily="raleway"
                        fontWeight={"500"}
                        top="0"
                        left="10px"
                    >
                        World Map
                    </Text>
                    <Flex
                        height={"100%"}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Text
                            fontFamily={"raleway"}
                            fontWeight={"500"}
                            fontSize={"40"}
                            color="#4285F4"
                        >
                            Coming soon...
                        </Text>
                    </Flex>
                </Box>
                <Box
                    width="50%"
                    height="300px"
                    position={"relative"}
                    p={2}
                    borderTop="0.5px solid grey"
                    borderRight="0.5px solid grey"
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={"500"}
                        top="0"
                        left="10px"
                    >
                        Daily {chartText}
                    </Text>
                    {loading ? <Flex h={"100%"} justify={"center"} alignItems={"center"}>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    </Flex> : data?.values?.length && data?.totalSum > 0 ? (
                        <Box height={"100%"}>
                            <BarChart
                                data={{
                                    labels: data?.labels,
                                    datasets: [
                                        {
                                            data: data?.values,
                                            backgroundColor: "#4886f4",
                                            borderRadius: 0
                                        }
                                    ]
                                }}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            suggestedMin: 0,
                                            grid: {
                                                display: false
                                            }
                                        },
                                        x: {
                                            grid: {
                                                display: false
                                            }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        datalabels: {
                                            display: false,
                                            anchor: "end",
                                            align: "top",
                                            offset: -27,
                                            color: "#FFFFFF",
                                            font: {
                                                weight: "medium",
                                                size: 16
                                            },

                                            formatter: function (
                                                value,
                                                context
                                            ) {
                                                return value;
                                            }
                                        }
                                        // zoom: {
                                        //     pan: {
                                        //         enabled: true,
                                        //         mode: "x",
                                        //         speed: 0.1
                                        //     },
                                        //     zoom: {
                                        //         wheel: {
                                        //             enabled: true,
                                        //             speed: 0.1
                                        //         },
                                        //         pinch: {
                                        //             enabled: true,
                                        //             speed: 0.1
                                        //         },
                                        //         mode: "x",
                                        //         limits: {
                                        //             y: { min: 0 }
                                        //         },
                                        //         rangeMin: {
                                        //             y: 0 // Ensure the zoom does not go below 0 on the y-axis
                                        //         }
                                        //     }
                                        // }
                                    }
                                }}
                            />
                        </Box>
                    ) : (
                        <Flex
                            height={"100%"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <Text
                                fontFamily={"raleway"}
                                fontWeight={"500"}
                                fontSize={"20"}
                                color="#4285F4"
                            >
                                {emptyState}
                            </Text>
                        </Flex>
                    )}
                </Box>
                <Box
                    width="50%"
                    height="300px"
                    position="relative"
                    p="2"
                    borderTop="0.5px solid grey"
                    borderLeft="0.5px solid grey"
                >
                    <Text fontFamily="raleway" fontWeight={"500"} left="10px">
                        Cummulative {chartText}
                    </Text>
                    {loading ? <Flex h={"100%"} justify={"center"} alignItems={"center"}>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    </Flex> : data?.cumulativeValues?.length && data?.totalSum > 0 ? (
                        <Box height={"100%"}>
                            <LineChart
                                data={{
                                    labels: data?.labels,
                                    datasets: [
                                        {
                                            data: data?.cumulativeValues,
                                            // label: "Cummulative referral traffic",
                                            tension: 0.3,
                                            pointRadius: 1, // set to 0 to hide points
                                            pointHoverRadius: 5, // set to 0 to hide points on hover

                                            borderColor: "#4886f4",
                                            // shadowColor: "#4886f4",
                                            // fill: true,
                                            backgroundColor: "transparent",
                                            // backgroundColor: createGradient,
                                            backgroundColor: (ctx) => {
                                                const gradient =
                                                    ctx.chart.ctx.createLinearGradient(
                                                        0,
                                                        0,
                                                        0,
                                                        300
                                                    );
                                                gradient.addColorStop(
                                                    0,
                                                    "rgba(72, 134, 244, 0.6)"
                                                ); // Moderate shadow color with transparency at bottom
                                                gradient.addColorStop(
                                                    0.3,
                                                    "rgba(72, 134, 244, 0.2)"
                                                ); // Partial transparency stop
                                                gradient.addColorStop(
                                                    1,
                                                    "rgba(72, 134, 244, 0)"
                                                ); // Transparent stop at the top
                                                return gradient;
                                            },
                                            borderWidth: 3,
                                            fill: true
                                        }
                                    ]
                                }}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            ticks: {
                                                stepSize: 1
                                            },
                                            grid: { display: false }
                                        },
                                        x: {
                                            grid: { display: false }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false,
                                            align: "start"
                                        },
                                        datalabels: {
                                            display: false
                                        },
                                        shadow: {
                                            enabled: true,
                                            color: "#4886f4", // Shadow color same as borderColor
                                            x: 0, // Offset in x direction
                                            y: 10, // Offset in y direction
                                            blur: 10 // Blur effect
                                        }
                                        // zoom: {
                                        //     pan: {
                                        //         enabled: true,
                                        //         mode: "x",
                                        //         speed: 0.1
                                        //     },
                                        //     zoom: {
                                        //         wheel: {
                                        //             enabled: true,
                                        //             speed: 0.1
                                        //         },
                                        //         pinch: {
                                        //             enabled: true,
                                        //             speed: 0.1
                                        //         },
                                        //         mode: "x",
                                        //         limits: {
                                        //             y: { min: 0 }
                                        //         },
                                        //         rangeMin: {
                                        //             y: 0 // Ensure the zoom does not go below 0 on the y-axis
                                        //         }
                                        //     }
                                        // }
                                    }
                                }}
                            />
                        </Box>
                    ) : (
                        <Flex
                            height={"100%"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <Text
                                fontFamily={"raleway"}
                                fontWeight={"500"}
                                fontSize={"20"}
                                color="#4285F4"
                            >
                                {emptyState}
                            </Text>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Box>
    );
};

export default TrendsSection;
