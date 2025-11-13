import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import {
    ClockIcon,
    DoubleArrowDownIcon,
    UserCircleIcon
} from "../../styles/ChakraUI/icons";
import { FiCalendar } from "react-icons/fi";
// import { TbCalendarCancel, TbCalendarCheck } from "react-icons/tb";
import AppContext from "../AppContext";
import axios from "axios";
import { createDBEntry, updateDBValue } from "../../queries/strapiQueries";
import strapi from "../../queries/strapi";
import { defaultSort } from "../../services/fetchApIDataSchema";
import LoadingGif from "../../patterns/LoadingGif";
import LoyaltyCard from "./LoyaltyCard";

const ScheduleCall = () => {
    const { profile } = useContext(AppContext);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledInfo, setScheduledInfo] = useState(null);
    const [callHistory, setCallHistory] = useState([]);
    const [timeUntilStart, setTimeUntilStart] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [shouldValidateInfo, setShouldValidateInfo] = useState(false);
    const [loyaltyCard, setLoyaltyCard] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [callHistoryLoading, setCallHistoryLoading] = useState(false);
    const [visibleCallHistoryCount, setVisibleCallHistoryCount] = useState(5);
    const hasScheduledEventRef = useRef(false);

    const fetchInviteeDetails = async (url) => {
        const res = await axios.get(url + "/invitees", {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_CALENDLY_ACCESS_TOKEN}`
            }
        });
        return res.data.collection[0];
    };

    const fetchEventDetails = async (url) => {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_CALENDLY_ACCESS_TOKEN}`
            }
        });
        return res.data.resource;
    };

    const handlePopupWidget = (url) => {
        window.Calendly.initPopupWidget({
            url,
            prefill: {
                email: profile?.email || "",
                name: profile?.fullName || ""
            },
            utm: {},
            onClose: () => { }
        });
    };

    const handleScheduledCall = async (event_url, event_uuid) => {
        setIsLoading(true);
        const { cancel_url, email, reschedule_url, status } =
            await fetchInviteeDetails(event_url);
        const {
            end_time,
            event_type,
            start_time,
            location: { join_url }
        } = await fetchEventDetails(event_url);

        if (!hasScheduledEventRef.current) {
            hasScheduledEventRef.current = true;
            const newScheduledInfo = {
                booking_email: email,
                user: profile?.id,
                start_time,
                end_time,
                reschedule_url,
                event_url,
                cancel_url,
                event_uuid,
                status,
                event_type,
                join_url:
                    "https://zoom.us/j/96248401734?pwd=HFqTo9d4lbiEgQWnUQWxSJIptGdTa5.1"
            };
            setScheduledInfo(newScheduledInfo);
            setIsScheduled(true);
            await createDBEntry("scheduled-calls", newScheduledInfo);
        }
        setIsLoading(false);
    };

    const handleButtonClick = (type) => {
        if (typeof window !== "undefined" && window.Calendly) {
            setShouldValidateInfo(true);
            switch (type) {
                case "reschedule":
                    handlePopupWidget(scheduledInfo.reschedule_url);
                    break;
                case "cancel":
                    handlePopupWidget(scheduledInfo.cancel_url);
                    break;
                default:
                    handlePopupWidget(
                        "https://calendly.com/concierge-postcard/30min"
                    );
                    break;
            }

            const eventListener = async (e) => {
                if (e.data.event?.includes("calendly.event_scheduled")) {
                    window.Calendly.closePopupWidget();
                    const eventURI = e.data.payload?.event?.uri;
                    const eventUUID = eventURI?.split("/").pop();
                    await handleScheduledCall(eventURI, eventUUID);
                }
            };

            window.addEventListener("message", eventListener);

            return () => window.removeEventListener("message", eventListener);
        }
    };

    const checkSchedule = async () => {
        const response = await fetchInviteeDetails(scheduledInfo.event_url);
        if (response.rescheduled || response.status === "canceled") {
            const isCanceled = await updateDBValue(
                "scheduled-calls",
                scheduledInfo.id,
                {
                    status: "canceled"
                }
            );
            hasScheduledEventRef.current = false;
            // set these only if it is cancel
            if (isCanceled && !response.rescheduled) {
                setIsScheduled(false);
                setScheduledInfo(null);
            }
            if (response.new_invitee) {
                const event_url = response.new_invitee
                    .split("/")
                    .slice(0, 5)
                    .join("/");
                const eventUUID = event_url.split("/").pop();
                await handleScheduledCall(event_url, eventUUID);
            }
        }
    };

    const getFormattedDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        return `${day}${daySuffix(day)} ${month} ${year}`;
    };

    const getFormattedTime = (inputDate) => {
        const date = new Date(inputDate);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
    };

    const daySuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    [...mutation.addedNodes].some((node) =>
                        node.classList?.contains("calendly-overlay")
                    )
                ) {
                    setIsPopupOpen(true);
                }
                if (
                    [...mutation.removedNodes].some((node) =>
                        node.classList?.contains("calendly-overlay")
                    )
                ) {
                    setIsPopupOpen(false);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!profile) return;
        strapi
            .find("loyalty-cards", {
                filters: {
                    user: profile.id,
                    startDate: { $lte: new Date().toISOString() },
                    expiryDate: { $gte: new Date().toISOString() }
                }
            })
            .then((response) => {
                if (response?.data?.length > 0)
                    setLoyaltyCard(response.data[0]);
            });
    }, [profile]);

    useEffect(() => {
        if (!profile) return;
        if (isLoading) return;

        const fetchScheduledCalls = async () => {
            setCallHistoryLoading(true);
            const response = await strapi.find("scheduled-calls", {
                filters: { user: profile.id },
                sort: defaultSort
            });
            // console.log(response?.data);
            const currentTime = new Date();
            const activeCalls = [];
            const historyCalls = [];

            response.data.forEach((call) => {
                const startTime = new Date(call.start_time);
                const endTime = new Date(call.end_time);
                if (currentTime < startTime && call.status === "active") {
                    activeCalls.push(call);
                } else if (
                    currentTime >= startTime &&
                    currentTime < endTime &&
                    call.status === "active"
                ) {
                    activeCalls.push(call);
                } else {
                    historyCalls.push(call);
                }
            });

            if (activeCalls.length > 0) {
                setScheduledInfo(activeCalls[0]);
                setIsScheduled(true);
            } else {
                setIsScheduled(false);
                setScheduledInfo(null);
            }

            setCallHistory(historyCalls);
            setCallHistoryLoading(false);
        };
        fetchScheduledCalls();

        return () => {
            // setScheduledInfo(null);
            setCallHistory([]);
        };
    }, [isScheduled, isLoading, profile]);

    useEffect(() => {
        if (scheduledInfo) {
            checkSchedule();
            const updateTimer = () => {
                const currentTime = new Date();
                const startTime = new Date(scheduledInfo.start_time);
                const timeDiff = startTime - currentTime;

                if (timeDiff > 0) {
                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor(
                        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    const minutes = Math.floor(
                        (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    setTimeUntilStart(`${days}d ${hours}hr ${minutes}mins`);
                } else {
                    setTimeUntilStart(null);
                }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000 * 60);

            return () => clearInterval(interval);
        }
    }, [scheduledInfo]);

    useEffect(() => {
        if (!isPopupOpen && shouldValidateInfo) {
            setShouldValidateInfo(false);
            if (scheduledInfo) {
                checkSchedule();
            }
        }
    }, [isPopupOpen]);

    const renderLoyaltyCardDetails = () =>
        loyaltyCard && (
            <Box
                flex="1"
                p={[2, 8]}
                display="flex"
                justifyContent={["center", "center", "flex-end"]}
            >
                {/* <Box width={"fit-content"} position={"relative"}>
                    <LoyaltyCard width="360" />
                    <Text
                        color="white"
                        position={"absolute"}
                        left={5}
                        top={3}
                        fontSize={24}
                        fontFamily={"raleway"}
                        fontWeight={600}
                    >
                        {loyaltyCard.name}
                    </Text>
                    <Text
                        color="white"
                        position={"absolute"}
                        left={5}
                        top={12}
                        fontSize={15}
                        fontFamily={"raleway"}
                        fontWeight={500}
                    >
                        Postcard Traveler
                    </Text>
                    <Text
                        color="white"
                        position={"absolute"}
                        left={5}
                        bottom={12}
                        fontSize={15}
                        fontFamily={"raleway"}
                        fontWeight={500}
                    >
                        Membership #
                    </Text>
                    <Text
                        color="white"
                        position={"absolute"}
                        left={5}
                        bottom={7}
                        fontSize={15}
                        fontFamily={"raleway"}
                        fontWeight={500}
                    >
                        {loyaltyCard.cardNumber}
                    </Text>
                    <Text
                        color="white"
                        position={"absolute"}
                        right={5}
                        bottom={12}
                        fontSize={15}
                        fontFamily={"raleway"}
                        fontWeight={500}
                    >
                        Expiry date
                    </Text>
                    <Text
                        color="white"
                        position={"absolute"}
                        right={5}
                        bottom={7}
                        fontSize={15}
                        fontFamily={"raleway"}
                        fontWeight={500}
                    >
                        {new Date(loyaltyCard.expiryDate).toLocaleDateString(
                            "en-GB"
                        )}
                    </Text>
                </Box> */}
                <LoyaltyCard loyaltyCard={loyaltyCard} />
            </Box>
        );

    const renderMeetingInfo = () => (
        <Box
            flex="1"
            p={[2, 8]}
            fontFamily={"raleway"}
            py={"auto"}
            display="flex"
            flexDirection={"column"}
            alignItems={["center", "center", "flex-start"]}
        >
            <Flex
                fontWeight={700}
                mb={5}
                justifyContent={"center"}
                alignItems={["center", "center", "flex-start"]}
                flexDirection={"column"}
                minWidth={350}
            >
                <Text>Your meeting with our travel advisor begins in</Text>
                <Text color={"primary_3"}>{timeUntilStart}</Text>
            </Flex>

            <Flex
                alignItems="center"
                fontWeight={600}
                justifyContent={"flex-start"}
                minWidth={350}
            >
                <FiCalendar size={22} />
                <Text ml={2}>{getFormattedDate(scheduledInfo.start_time)}</Text>
            </Flex>
            <Flex
                alignItems="center"
                fontWeight={600}
                my={2}
                justifyContent={"flex-start"}
                minWidth={350}
            >
                <ClockIcon />
                <Text ml={2}>{getFormattedTime(scheduledInfo.start_time)}</Text>
            </Flex>
            <Flex
                alignItems="center"
                fontWeight={600}
                justifyContent={"flex-start"}
                minWidth={350}
            >
                <UserCircleIcon />
                <Text ml={2}>Amit Jaipuria</Text>
            </Flex>

            <Flex alignItems="center" gap={5} my={3}>
                {timeUntilStart ? (
                    <>
                        <Button
                            variant={"outline"}
                            onClick={() => handleButtonClick("cancel")}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => handleButtonClick("reschedule")}>
                            Reschedule
                        </Button>
                    </>
                ) : (
                    <a href={scheduledInfo.join_url} target="_blank">
                        <Button>Join Meeting</Button>
                    </a>
                )}
            </Flex>
        </Box>
    );

    const renderCallHistory = () =>
        callHistory &&
        callHistory?.length > 0 && (
            <>
                <Text
                    fontWeight={700}
                    fontSize={20}
                    fontFamily="raleway"
                    color="#5A5A5A"
                    my={[4, 2, 0]}
                >
                    Call History
                </Text>

                <Flex
                    flexDirection={"column"}
                    width={["80%", "80%", "100%", "100%"]}
                    mt={4}
                    gap={1}
                >
                    {callHistory
                        .slice(0, visibleCallHistoryCount)
                        .map((call, index) => (
                            <Flex
                                key={"call_" + index}
                                border={"1px"}
                                p={[4, 4, 1]}
                                borderRadius={"8"}
                                borderColor={"#D9D9D9"}
                                fontFamily={"raleway"}
                            >
                                <Flex
                                    justifyContent={"space-evenly"}
                                    width={["60%", "60%", "80%", "80%"]}
                                    flexDirection={[
                                        "column",
                                        "column",
                                        "row",
                                        "row"
                                    ]}
                                    gap={1}
                                >
                                    <Flex
                                        alignItems="center"
                                        fontWeight={600}
                                        justifyContent={"flex-start"}
                                    >
                                        <FiCalendar size={20} />
                                        <Text ml={2} fontSize={14}>
                                            {getFormattedDate(call.start_time)}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        alignItems="center"
                                        fontWeight={600}
                                        justifyContent={"flex-start"}
                                    >
                                        <ClockIcon width={20} />
                                        <Text ml={2} fontSize={14}>
                                            {getFormattedTime(call.start_time)}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        alignItems="center"
                                        fontWeight={600}
                                        justifyContent={"flex-start"}
                                    >
                                        <UserCircleIcon width={20} />
                                        <Text ml={2} fontSize={14}>
                                            Amit Jaipuria
                                        </Text>
                                    </Flex>
                                    <Flex
                                        alignItems="center"
                                        fontWeight={600}
                                        justifyContent={"flex-start"}
                                    >
                                        {/* {call.status == "canceled" ? (
                                            <TbCalendarCancel size={20} />
                                        ) : (
                                            <TbCalendarCheck size={20} />
                                        )} */}
                                        <Text ml={2} fontSize={14}>
                                            {call.status == "canceled"
                                                ? "Canceled"
                                                : "Completed"}
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Flex
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    width={["40%", "40%", "20%", "20%"]}
                                >
                                    <Button
                                        fontSize={14}
                                        fontFamily={"raleway"}
                                        isDisabled={
                                            scheduledInfo ? true : false
                                        }
                                        onClick={() =>
                                            handleButtonClick("schedule")
                                        }
                                    >
                                        Connect again
                                    </Button>
                                </Flex>
                            </Flex>
                        ))}
                </Flex>
                {visibleCallHistoryCount < callHistory.length && (
                    <Button
                        variant={"outline"}
                        onClick={() =>
                            setVisibleCallHistoryCount(
                                (prevCount) => prevCount + 5
                            )
                        }
                        mt={4}
                    >
                        View More <DoubleArrowDownIcon width={35} />
                    </Button>
                )}
            </>
        );

    return (
        loyaltyCard && (
            <>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Flex
                        direction={["column", "column", "row"]}
                        justify="space-between"
                        py={4}
                        // width={["100%", "100%", "100%", "70%"]}
                        // mx={20}
                        my={[-6, -10, 0]}
                    >
                        {renderLoyaltyCardDetails()}
                        {isLoading ? (
                            <LoadingGif />
                        ) : scheduledInfo ? (
                            renderMeetingInfo()
                        ) : (
                            <Box
                                flex="1"
                                p={8}
                                fontFamily={"raleway"}
                                py={"auto"}
                                display="flex"
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={["center", "center", "flex-start"]}
                            >
                                <Button onClick={handleButtonClick}>
                                    SCHEDULE A CALL
                                </Button>
                            </Box>
                        )}
                    </Flex>

                    {callHistoryLoading ? <LoadingGif /> : renderCallHistory()}
                </Flex>
            </>
        )
    );
};

export default ScheduleCall;
