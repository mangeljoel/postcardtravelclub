import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsGlobe } from "react-icons/bs";
import DateRangeComponent from "./DateRangeComponent";
import { CalendarIcon, CloseIcon } from "@chakra-ui/icons";
import TrendsSection from "./TrendsSection";
import { FaRegBookmark, FaRegFolderOpen } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";

const PostcardTrends = ({ isHotel, companyId }) => {
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [showSection, setShowSection] = useState(false);

    const formatDate = (date) => {
        if (!date) return "";
        const formattedDate = new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        return formattedDate;
    };

    const trendsSection = [
        {
            icon: <FaRegFolderOpen size={32} color="#307FE2" />,
            title: "Total partner profile page views",
            chart_text: "active visits"
        },
        {
            icon: <BsGlobe size={32} color="#307FE2" />,
            title: "Total visitors referred to partner websites",
            chart_text: "referral traffic"
        },
        {
            icon: <FaRegBookmark size={32} color="#307FE2" />,
            title: "Total postcards collected",
            chart_text: "postcards collected"
        },
        {
            icon: <AiOutlineUserAdd size={32} color="#307FE2" />,
            title: "Total followers",
            chart_text: "followers"
        }
    ];

    // const createGradient = (ctx) => {
    //     const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
    //     gradient.addColorStop(0, "rgba(72, 134, 244, 0.6)"); // Moderate shadow color with transparency at bottom
    //     gradient.addColorStop(0.3, "rgba(72, 134, 244, 0.2)"); // Partial transparency stop
    //     gradient.addColorStop(1, "rgba(72, 134, 244, 0)"); // Transparent stop at the top
    //     return gradient;
    // };
    return (
        <Box mx={32} style={{ position: "relative" }}>
            <Button onClick={() => setShowSection((prev) => !prev)}>
                {dateRange.start && dateRange.end ? (
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <CalendarIcon mr="2" />
                        {`${formatDate(dateRange.start)} - ${formatDate(
                            dateRange.end
                        )}`}
                        <button
                            style={{
                                marginLeft: "10px",
                                width: "15px",
                                height: "15px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDateRange({ start: null, end: null });
                            }}
                        >
                            <CloseIcon height="12px" width="15px" />
                        </button>
                    </span>
                ) : (
                    "Select Date Range"
                )}
            </Button>
            {showSection && (
                <div
                    style={{
                        position: "absolute",
                        marginTop: "10px",
                        padding: "10px",
                        // background: "#E5E7EB",
                        background: "white",
                        borderRadius: "10px",
                        zIndex: "10"
                    }}
                >
                    <DateRangeComponent
                        setShowSection={setShowSection}
                        setDateRange={setDateRange}
                    />
                </div>
            )}

            <Flex my={12} flexDirection={"column"}>
                {/* <Box>
                    <Flex
                        gap="15px"
                        justifyContent={"flex-start"}
                        alignItems={"center"}
                    >
                        <BsGlobe size={32} color="#578EFB" />
                        <Text
                            color={"#5A5A5A"}
                            fontWeight={"700"}
                            fontSize={"40px"}
                            fontFamily={"raleway"}
                        >
                            Total visitors referred to partner websites
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
                                    1060
                                </Text>
                            </Flex>
                        </Box>
                        <Box
                            width="50%"
                            height="300px"
                            position={"relative"}
                            p={2}
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
                        >
                            <Text
                                fontFamily="raleway"
                                fontWeight={"500"}
                                top="0"
                                left="10px"
                            >
                                Daily referral traffic
                            </Text>
                            <Box height={"100%"}>
                                <BarChart
                                    data={{
                                        labels: [
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thusday",
                                            "Friday",
                                            "Saturday",
                                            "Sunday"
                                        ],
                                        datasets: [
                                            {
                                                data: [
                                                    40, 100, 60, 30, 10, 70, 50
                                                ],
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
                                                display: true,
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
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box
                            width="50%"
                            height="300px"
                            position="relative"
                            p="2"
                        >
                            <Text
                                fontFamily="raleway"
                                fontWeight={"500"}
                                left="10px"
                            >
                                Cummulative referral traffic
                            </Text>
                            <Box height={"100%"}>
                                <LineChart
                                    data={{
                                        labels: [
                                            "Mon",
                                            "Tue",
                                            "Wed",
                                            "Thu",
                                            "Fri",
                                            "Sat",
                                            "Sun"
                                        ],
                                        datasets: [
                                            {
                                                data: [
                                                    10, 20, 25, 35, 40, 60, 55
                                                ],
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
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Flex>
                </Box> */}
                {trendsSection.map(({ icon, title, chart_text }) => (
                    <TrendsSection
                        icon={icon}
                        title={title}
                        chartText={chart_text}
                        isHotel={isHotel}
                        companyId={companyId}
                        dateRange={dateRange}
                    />
                ))}
            </Flex>
        </Box>
    );
};

export default PostcardTrends;
