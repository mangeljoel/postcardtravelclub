import { Box, Flex, Icon, IconButton, Link, Text } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState, memo } from 'react';
import { IoIosAddCircleOutline, IoIosCheckmarkCircle } from "react-icons/io";

import { ChakraNextImage } from '../../patterns/ChakraNextImage';
import { FolderIcon } from '../../styles/ChakraUI/icons';
import AppContext from '../AppContext';
import strapi from '../../queries/strapi';
import { addAlbumEvent } from '../../services/utilities';

const EventCard = ({
    isMobile,
    index,
    event,
    followed,
    onFollow,
    eventDetails,
    setEventDetails,
    onClick
}) => {
    const { profile } = useContext(AppContext);
    const [desc, setDesc] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [name, setName] = useState('');
    const [loc, setLoc] = useState('');
    const [url, setURL] = useState('');

    const timeAgo = useCallback((timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInSeconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / (3600 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return "Just now";
    }, []);

    const handleEventClick = useCallback(() => {
        setEventDetails({
            id: event?.id,
            user: event?.user,
            createdAt: event?.createdAt,
            desc: desc,
            code: event?.event_master?.code,
            postcard: event?.postcard,
            album: event?.album,
            following: event?.following
        });
        if (isMobile) onClick();
    }, [desc, event, isMobile, onClick, setEventDetails]);

    useEffect(() => {
        if (!isMobile && !eventDetails && index === 0) {
            setEventDetails({
                id: event?.id,
                user: event?.user,
                createdAt: event?.createdAt,
                desc: desc,
                code: event?.event_master?.code,
                postcard: event?.postcard,
                album: event?.album,
                following: event?.following
            });
        }
    }, [isMobile, desc, event, eventDetails, index]);

    const updateEventDetails = useCallback(async () => {
        if (!event?.event_master?.code) return;

        const userName = event?.user?.fullName || event?.user?.username;

        switch (event.event_master.code) {
            case "COLLECT_POSTCARD": {
                const othersCount = event?.postcard?.bookmarks?.length - 1;
                setDesc(`${userName} ${othersCount > 0 ? `and ${othersCount} others` : ''} collected this postcard`);
                setImageUrl(event?.postcard?.coverImage?.url);
                setName(event?.postcard?.name);
                setLoc((event?.postcard?.album?.region ? `${event?.postcard?.album?.region?.name}, ` : "") + event?.postcard?.country?.name);
                setURL(event?.postcard?.album?.news_article ? `/postcard-pages/${event?.postcard?.album?.slug}` : event?.postcard?.album?.slug);
                break;
            }
            case "FOLLOW_ALBUM": {
                const othersCount = event?.album?.follow_albums?.length - 1;
                setDesc(`${userName} ${othersCount > 0 ? `and ${othersCount} others have` : ''} collected this postcard album`);
                setImageUrl(event?.album?.news_article?.image?.url);
                setName(event?.album?.news_article?.title);
                setLoc((event?.album?.region ? `${event?.album?.region?.name}, ` : "") + event?.album?.country?.name);
                setURL(event?.album?.news_article ? `/postcard-pages/${event?.album?.slug}` : event?.album?.slug);
                break;
            }
            case "FOLLOW_USER": {
                const othersCount = event?.user?.follows?.length - 1;
                setDesc(`${userName} ${othersCount > 0 ? `and ${othersCount} others` : ''} followed <a href='${event?.following?.slug}' target="_blank" style="text-decoration: underline;" >${event?.following?.fullName}</a>`);
                setImageUrl(event?.following?.coverImage?.url || "/assets/default-profile-pic.png");
                setName(event?.following?.fullName);
                setLoc(event?.following?.country?.name);
                setURL(`/${event?.following?.slug}`);
                break;
            }
            case "BACKLINK": {
                try {
                    const response = await strapi.find(`events/albumStats?id=${event?.album?.id || event?.postcard?.album?.id}`);
                    const isAlbum = !!event?.album;

                    setDesc(`${userName} ${response?.websiteCount > 1 ? `and ${response?.websiteCount - 1} others have` : ''} visited this partner website`);
                    setImageUrl(isAlbum ?
                        (event?.album?.news_article?.image?.url || event?.album?.coverImage?.url) :
                        (event?.postcard?.album?.news_article?.image?.url || event?.postcard?.album?.coverImage?.url)
                    );
                    setName(isAlbum ?
                        event?.album?.name :
                        (event?.postcard?.album?.news_article?.title || event?.postcard?.album?.name)
                    );
                    setLoc(
                        isAlbum
                            ? (event?.album?.region ? `${event?.album?.region?.name}, ` : "") + event?.album?.country?.name
                            : (event?.postcard?.album?.region ? `${event?.postcard?.album?.region?.name}, ` : "") + event?.postcard?.country?.name
                    );
                    setURL(isAlbum ?
                        (event?.album?.news_article ? `/postcard-pages/${event?.album?.slug}` : event?.album?.slug) :
                        (event?.postcard?.album?.news_article ? `/postcard-pages/${event?.postcard?.album?.slug}` : event?.postcard?.album?.slug)
                    );
                } catch (error) {
                    console.error('Error fetching backlink stats:', error);
                }
                break;
            }
        }
    }, [event]);

    useEffect(() => {
        if (event) {
            updateEventDetails();
        }
    }, [event, updateEventDetails]);

    if (!desc || !imageUrl || !url || !name) {
        return null;
    }

    return (
        <Flex
            w={["100%", "28.6vw"]}
            h={["82.5vw", "23.5vw"]}
            borderRadius={["4.167vw", "1.16vw"]}
            flexDirection="column"
            bg="white"
            onClick={handleEventClick}
        >
            <Flex mx={["4.44vw", "1.25vw"]}>
                <Box w={["8.33vw", "2.9vw"]} h={["8.33vw", "2.8vw"]} borderRadius="100%" mt={["5vw", "1.11vw"]}>
                    <ChakraNextImage
                        w="100%"
                        h="100%"
                        borderRadius="100%"
                        objectFit="cover"
                        src={event?.user?.profilePic?.url || event?.user?.profilePicURL || "/assets/default-profile-pic.png"}
                        fallbackImg="/assets/default-profile-pic.png"
                        alt="event user profile pic"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Box>

                <Flex flex={1} flexDirection="column" mx={["3.61vw", "0.9vw"]}>
                    <Flex justifyContent="space-between" mt={["4vw", "0.3vw", "0.6vw", "1.4vw"]}>
                        <Box>
                            <Text
                                as={Link}
                                href={event?.user?.slug}
                                fontSize={["3.33vw", "0.93vw"]}
                                fontFamily="raleway"
                                fontWeight={600}
                                textDecoration="underline"
                                _hover={{ textDecoration: "underline", cursor: "pointer" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {event?.user?.fullName || event?.user?.username}
                            </Text>
                            <Text
                                fontSize={["2.22vw", "0.7vw"]}
                                lineHeight={["4vw", "1vw"]}
                                fontFamily="raleway"
                                fontWeight={600}
                                color="#494746"
                            >
                                {timeAgo(event?.createdAt)}
                            </Text>
                        </Box>

                        {event?.user?.id !== profile?.id && (
                            <Text
                                mt={["1.8vw", "1vw", "0.8vw", "0"]}
                                fontSize={["2.78vw", "0.93vw"]}
                                fontFamily="raleway"
                                fontWeight={600}
                                color="primary_3"
                                display="flex"
                                alignItems="start"
                                cursor="pointer"
                                onClick={onFollow}
                            >
                                <Icon
                                    w={["4.44vw", "1.2vw"]}
                                    h={["4.44vw", "1.2vw"]}
                                    as={followed ? IoIosCheckmarkCircle : IoIosAddCircleOutline}
                                    color="primary_3"
                                    mr={["0.8vw", "0.2vw"]}
                                />
                                {followed ? "Following" : "Follow"}
                            </Text>
                        )}
                    </Flex>

                    <Text
                        my={["1.8vw", "0.6vw"]}
                        fontSize={["2.9vw", "0.93vw"]}
                        lineHeight={["2.9vw", "1vw"]}
                        fontFamily="raleway"
                        color="#111111"
                        dangerouslySetInnerHTML={{ __html: desc }}
                    />
                </Flex>
            </Flex>

            <Flex w={"100%"} flex="1" overflow="hidden" position={"relative"}>
                <ChakraNextImage borderBottomRadius={["4.167vw", "1.16vw"]} w={"100%"} h="100%" objectFit={"cover"} noLazy={index == 0 ? true : false} priority={index == 0 ? true : false} src={imageUrl} alt={"event image"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                {/* <Box
                    w={"100%"}
                    h={"100%"}
                    position={"absolute"}
                    top={0}
                    left={0}
                    bg={eventDetails?.id == event?.id && !isMobile ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.6)"}
                    borderBottomRadius={["4.167vw", "1.16vw"]}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    src={imageUrl}
                    alt="event image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                /> */}
                <Box
                    w="100%"
                    h="100%"
                    position="absolute"
                    top={0}
                    left={0}
                    bgGradient="linear(to-t, black 10%, transparent 50%)"
                    borderBottomRadius={["4.167vw", "1.16vw"]}
                />

                <Flex
                    px={["5.55vw", "1.94vw"]}
                    w="100%"
                    flexDirection="column"
                    gap={["2.22vw", "1.04vw"]}
                    position="absolute"
                    bottom={["4.72vw", "1.875vw"]}
                >
                    <Text color="white" fontSize={["2.8vw", "0.81vw"]} fontFamily="raleway">
                        {loc}
                    </Text>
                    <Box h={["1px", "2px"]} bg="#EFE9E4" w="100%" />
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text color="white" fontSize={["3.5vw", "0.83vw"]} fontFamily="raleway">
                            {name}
                        </Text>
                        <IconButton
                            as={Link}
                            href={url}
                            target="_blank"
                            w={["5vw", "1.4vw"]}
                            h={["4.44vw", "1.25vw"]}
                            variant="none"
                            icon={<FolderIcon w="100%" h="100%" stroke="white" />}
                        // onClick={(e) => {
                        //     e.stopPropagation();
                        //     addAlbumEvent(profile?.id, url, event?.album?.id, event?.postcard?.id);
                        // }}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default EventCard;