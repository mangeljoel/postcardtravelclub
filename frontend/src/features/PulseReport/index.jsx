import {
    Box, Text, Flex, Grid, useDisclosure, Drawer, DrawerOverlay, DrawerContent,
    DrawerBody, DrawerHeader, useBreakpointValue
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { createDBEntry, deleteDBEntry, fetchPaginatedResults } from "../../queries/strapiQueries";
import { apiNames, populateEvents } from "../../services/fetchApIDataSchema";
import EventCard from "./EventCard";
import AppContext from "../AppContext";
import LoadingGif from "../../patterns/LoadingGif";
import InfiniteScroll from "react-infinite-scroll-component";
import EventDetailsCard from "./EventDetailsCard";
import { motion } from "framer-motion";
import { useSignupModal } from "../SignupModalContext";


const MotionBox = motion(Box);
const MemoizedEventCard = React.memo(EventCard);
const MemoizedEventDetailsCard = React.memo(EventDetailsCard);

const PulseReport = ({ isDiary }) => {
    const { profile } = useContext(AppContext);
    const { openLoginModal } = useSignupModal()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [followedUsers, setFollowedUsers] = useState({});
    const [eventDetails, setEventDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [uniqueKeys, setUniqueKeys] = useState({});

    const isMobile = useBreakpointValue({ base: true, sm: false });

    const handleOpenDetails = onOpen;

    const resetData = useCallback(() => {
        setPage(0);
        setPageData([]);
        setHasMore(true);
        setUniqueKeys({});
        getPageData(0, true);
    }, []);

    const generateUniqueKey = useCallback((event) => {
        const { event_master, album, postcard, following } = event;
        const code = event_master?.code;

        const keyMap = {
            'BACKLINK': () => `${code}_${album?.id}`,
            'COLLECT_POSTCARD': () => `${code}_${postcard?.id}`,
            'FOLLOW_ALBUM': () => `${code}_${album?.id}`,
            'FOLLOW_USER': () => `${code}_${following?.id}`
        };

        return keyMap[code]?.() || null;
    }, []);

    const getPageData = useCallback(async (currentPage = page, reset = false) => {
        if (isFetching || !hasMore) return;

        setIsFetching(true);
        const newKeys = { ...uniqueKeys };
        const allFilteredData = [];
        let tempPage = currentPage;

        while (allFilteredData.length < 6 && hasMore) {
            const filter = {
                $and: [
                    { event_master: { id: { $in: [1, 3, 6, 7] } } },
                    { user: { id: isDiary ? isDiary : { $notNull: true } } }
                    // {
                    //     $or: [
                    //         {
                    //             postcard: {
                    //                 id: { $notNull: true },
                    //                 coverImage: { id: { $notNull: true } },
                    //                 name: { $notNull: true },
                    //                 album: {
                    //                     slug: { $notNull: true }
                    //                 }
                    //             }
                    //         },
                    //         {
                    //             album: {
                    //                 id: { $notNull: true },
                    //                 news_article: {
                    //                     image: { id: { $notNull: true } },
                    //                     title: { $notNull: true }
                    //                 },
                    //                 slug: { $notNull: true }
                    //             }
                    //         },
                    //         {
                    //             following: {
                    //                 slug: { $notNull: true },
                    //                 fullName: { $notNull: true }
                    //             }
                    //         }
                    //     ]
                    // }
                ]
            };

            const data = await fetchPaginatedResults(
                apiNames.event,
                filter,
                populateEvents,
                undefined,
                tempPage * 6,
                6
            );

            if (!data.length) {
                setHasMore(false);
                break;
            }

            const filteredData = data.filter((event) => {
                const uniqueKey = generateUniqueKey(event);
                if (newKeys[uniqueKey]) return false;
                newKeys[uniqueKey] = true;
                return true;
            });

            allFilteredData.push(...filteredData);
            // console.log(allFilteredData)
            tempPage++;
        }

        setUniqueKeys(newKeys);
        setIsFetching(false);
        setPageData((prevData) => reset ? allFilteredData : [...prevData, ...allFilteredData]);
        setPage(tempPage);
    }, [page, hasMore, isFetching, uniqueKeys]);

    const handleFollowUser = useCallback(async (userId) => {
        if (!profile?.id || !userId) return;

        if (followedUsers[userId]) {
            await deleteDBEntry('follows', followedUsers[userId]);
            setFollowedUsers((prev) => ({ ...prev, [userId]: null }));
        } else {
            const response = await createDBEntry('follows', { follower: profile.id, following: userId });
            if (response.data?.id) {
                setFollowedUsers((prev) => ({ ...prev, [userId]: response.data.id }));
                await createDBEntry("events", { event_master: 7, user: profile.id, following: userId });
            }
        }
    }, [followedUsers, profile]);

    const getFollowedUsers = useCallback(async () => {
        if (!profile?.id) return;

        const response = await fetchPaginatedResults('follows', { follower: profile.id }, { follower: true, following: true });
        if (Array.isArray(response)) {
            setFollowedUsers(response.reduce((acc, follow) => {
                acc[follow.following.id] = follow.id;
                return acc;
            }, {}));
        } else {
            setFollowedUsers({ [response.following.id]: response.id });
        }
    }, [profile]);

    useEffect(() => {
        getFollowedUsers();
        resetData();
    }, [profile]);

    const onFollow = (e, userId) => {
        e.stopPropagation();
        if (!profile) {
            openLoginModal()
            return;
        }
        handleFollowUser(userId);
    };

    const renderEventCard = useCallback((event, index) => (
        <MemoizedEventCard
            key={index}
            isMobile={isMobile}
            index={index}
            event={event}
            followed={followedUsers[event?.user?.id]}
            onFollow={(e) => onFollow(e, event?.user?.id)}
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            onClick={handleOpenDetails}
        />
    ), [isMobile, followedUsers, eventDetails]);

    return (
        <Flex flexDirection="column" px="4vw" py="2vw" gap={["11.9vw", "1.67vw"]} width="100%">

            <Flex gap="2.36vw" flexDirection={["column-reverse", "row"]}>
                <InfiniteScroll dataLength={pageData.length} next={getPageData} hasMore={hasMore} scrollThreshold={0.8} loader={<LoadingGif />}>
                    <Grid w="100%" templateColumns={["1fr", "repeat(2, 1fr)"]} gap={["8.88vw", "2.4vw"]} minW={"60vw"} className="no-scrollbar">
                        {pageData.map(renderEventCard)}
                    </Grid>
                </InfiniteScroll>

                {!isMobile && eventDetails && (
                    <MemoizedEventDetailsCard
                        eventDetails={eventDetails}
                        followed={followedUsers[eventDetails?.following?.id]}
                        onFollow={(e) => onFollow(e, eventDetails?.following?.id)}
                    />
                )}

                <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent
                        borderTopRadius="5vw"
                        // bg="#D9D9D9"
                        bg={"#efe9e4 !important"}
                        as={MotionBox}
                        minW="100vw"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, info) => info.offset.y > window.innerHeight * 0.2 && onClose()}
                    >
                        <DrawerHeader>
                            <Box w="23.6vw" h="5px" bg="#111111" opacity="0.25" borderRadius="2vw" mx="auto" />
                        </DrawerHeader>
                        <DrawerBody p={0} mt="calc(-2em - 5px)" display="flex" alignItems="center" justifyContent="center">
                            {eventDetails && (
                                <MemoizedEventDetailsCard
                                    eventDetails={eventDetails}
                                    followed={followedUsers[eventDetails?.following?.id]}
                                    onFollow={(e) => onFollow(e, eventDetails?.following?.id)}
                                />
                            )}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Flex>
        </Flex>
    );
};

export default PulseReport;