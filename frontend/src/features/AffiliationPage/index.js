import React, { useContext, useEffect, useState } from 'react'
import LandingHeroSection from '../../patterns/LandingHeroSection'
import { Box, Button, Flex, Icon, Link, Text, useBreakpointValue, useToast } from '@chakra-ui/react';
import GuidedSearchPostcard from '../GuidedSearch/GuidedSearchPostcard';
import AffPostcards from './AffPostcards';
import AffStays from './AffStays';
import { ChakraNextImage } from '../../patterns/ChakraNextImage';
import { createDBEntry, deleteDBEntry, fetchPaginatedResults, getTotalRecords } from '../../queries/strapiQueries';
import AppContext from '../AppContext';
import { useSignupModal } from '../SignupModalContext';
import strapi from '../../queries/strapi';
import { IoShareOutline } from "react-icons/io5";

const AffiliationPage = ({ affiliation }) => {
    // console.log(affiliation)
    const { profile } = useContext(AppContext)
    const { openLoginModal } = useSignupModal()
    const tabs = ["Stays", "Experiences"];
    const [selectedTab, setSelectedTab] = useState(0);
    const [followId, setFollowId] = useState(null)
    const [details, setDetails] = useState({
        albumCount: 0,
        postcardCount: 0,
        tagCount: 0,
        followerCount: 0
    })
    const toast = useToast()
    const isMobile = useBreakpointValue({ base: true, md: false });


    const handleShareClick = () => {
        const currentUrl = window.location.href;

        // If mobile and navigator.share is supported, use the native share API
        if (isMobile && navigator.share) {
            navigator.share({
                title: document.title,
                url: currentUrl,
            })
        } else {
            // For desktop or when share is unavailable, copy the URL to clipboard
            try {
                navigator.clipboard.writeText(currentUrl)
                    .then(() => {
                        toast({
                            title: `URL Copied`,
                            status: 'success',
                            isClosable: true,
                            position: 'top',
                            variant: "subtle"
                        })
                    })
                    .catch((err) => {
                        // console.log('Error copying URL:', err);
                    });
            } catch (err) {
                // console.log('Error:', err);
            }
        }
    };

    const handleFollowUnfollowAff = () => {
        if (!profile) openLoginModal()
        if (followId) {
            deleteDBEntry('follow-affiliates', followId).then((response) => setFollowId(null))
        }
        else {
            createDBEntry('follow-affiliates', { follower: profile.id, affiliation: affiliation?.id }).then((response) => {
                setFollowId(response?.data?.id)
            })
        }
    }

    const tabContent = {
        Experiences: <AffPostcards aff={affiliation?.id} />,
        Stays: <AffStays aff={affiliation?.id} />,
        // Tours: <UserTours slug={expert?.slug} />,
    };

    const getDetails = async () => {
        const [albumCount, postcardCount, tagCount, followerCount] = await Promise.all([
            getTotalRecords('albums', {
                isFeatured: true,
                isActive: true,

                company: { affiliations: affiliation?.id }
            }),
            getTotalRecords('postcards', {
                album: {
                    isActive: true,
                    company: { affiliations: affiliation?.id }
                },
                isComplete: true
            }),
            strapi.find(`tags/getTags?affiliation=${affiliation?.id}`).then((resp) => resp?.length || 0),
            affiliation?.follow_affiliates?.length || 0
        ])
        setDetails((prev) => ({
            ...prev,
            albumCount,
            postcardCount,
            tagCount,
            followerCount
        }))
    }

    useEffect(() => {
        fetchPaginatedResults('follow-affiliates', { follower: profile?.id, affiliation: affiliation?.id }).then((response) => {
            if (response) setFollowId(response?.id)
        })
    }, [profile])

    useEffect(() => {
        getDetails()
    }, [])

    return (
        <>
            {/* <Icon
                as={IoShareOutline}
                position="absolute"
                right={["5%", "3%"]}
                top={"3%"}
                color={"white"}
                zIndex={10}
                w={["10vw", "4vw"]}
                h={["10vw", "4vw"]}
                size={"full"}
                cursor={"pointer"}
                onClick={handleShareClick}
            /> */}
            <Box pb={["10vw", "3vw"]} bg={["linear-gradient(0deg, rgba(48,127,226,0.5) 0%, rgba(140,178,227,0.5) 90%, rgba(239,233,228,1) 100%)", "linear-gradient(0deg, rgba(48,127,226,0.6) 0%, rgba(239,233,228,1) 90%)"]}>
                <Box
                    w={"100%"}
                    minH={["181.11vw", "50.4vw"]}
                    px={["5.56vw", "2.22vw"]}
                    my={["6.94vw", "2.22vw"]}
                // bg="#EFE9E4"
                >
                    <Box
                        w={"100%"}
                        h={"100%"}
                        bg={"#111111"}
                        borderRadius={["4.167vw", "2.08vw"]}
                        position="relative"
                    >
                        {/* <Icon
                            as={IoShareOutline}
                            position="absolute"
                            right={["5%", "3%"]}
                            top={"3%"}
                            color={"white"}
                            zIndex={10}
                            w={["10vw", "4vw"]}
                            h={["10vw", "4vw"]}
                            size={"full"}
                            cursor={"pointer"}
                            onClick={handleShareClick}
                        /> */}
                        <ChakraNextImage
                            borderTopRadius={["4.167vw", "2.08vw"]}
                            noLazy={true}
                            priority={true}
                            src={"/assets/landingpage/stays-2.png"}
                            w={"100%"}
                            h={["152.33vw", "42.74vw"]}
                            objectFit="cover"
                            alt={affiliation?.name + " coverImage"}
                        />

                        <Box
                            w={"100%"}
                            h={["152.33vw", "42.74vw"]}
                            position={"absolute"}
                            top={0}
                            left={0}
                            pl={["8.33vw", "6.46vw"]}
                            pr={["6.67vw", "6.11vw"]}
                            bgGradient="linear(to-t, #111111 2%, transparent 50%)"
                            borderTopRadius={["4.167vw", "2.08vw"]}
                        >
                            <Flex
                                w={"100%"}
                                h={"100%"}
                                flexDirection={"column"}
                                justify={"flex-end"}
                                borderRadius={["4.167vw", "2.08vw"]}
                            >
                                <Flex
                                    display={{ base: "none", sm: "flex" }}
                                    h={"14.1vw"}
                                    mt={"17.8vw"}
                                    justifyContent={"space-between"}
                                    alignItems={"flex-end"}
                                >
                                    <Text
                                        maxW={"55.76vw"}
                                        fontSize={"4.58vw"}
                                        lineHeight={"4.72vw"}
                                        color={"white"}
                                        fontFamily={"raleway"}
                                    >
                                        {affiliation?.name}
                                    </Text>
                                    {/* <Button variant={"none"} color={"white"} w={"21.74vw"} h={"3.47vw"} border={"2px"} borderColor={"white"} backdropFilter={"blur(10px)"} borderRadius={"2.78vw"} fontFamily={"raleway"} fontWeight={400} fontSize={"1.46vw"} lineHeight={"1.87vw"} _hover={{color: "#111111",bg: "#EFE9E4"}}>Play Video</Button> */}
                                    {/* placeholder for play video button */}
                                    <Box h={"3.47vw"}></Box>
                                </Flex>

                                <Flex
                                    display={{ base: "flex", sm: "none" }}
                                    flexDirection={"column"}
                                    mt={"64.22vw"}
                                    gap={"6.67vw"}
                                >
                                    <Text
                                        w={"100%"}
                                        fontSize={"7.78vw"}
                                        lineHeight={"8.88vw"}
                                        color={"white"}
                                        fontFamily={"raleway"}
                                    >
                                        {affiliation?.name}
                                    </Text>
                                    <Text
                                        color={"#EFE9E4"}
                                        fontFamily={"raleway"}
                                        fontWeight={400}
                                        fontSize={"3.89vw"}
                                        lineHeight={"5vw"}
                                    >
                                        {affiliation?.description}
                                    </Text>
                                    {/* <Button variant={"none"} color={"white"} w={"49.72vw"} h={"8.33vw"} border={"1px"} borderColor={"white"} backdropFilter={"blur(10px)"} borderRadius={"5.55vw"} fontFamily={"raleway"} fontWeight={400} fontSize={"3.33vw"} lineHeight={"10.28vw"} _hover={{color: "#111111",bg: "#EFE9E4"}}>Play Video</Button> */}
                                    {/* <Box h={"4.33vw"}></Box> */}
                                </Flex>

                                <Text
                                    display={{ base: "none", sm: "flex" }}
                                    color={"#EFE9E4"}
                                    fontFamily={"raleway"}
                                    fontWeight={400}
                                    fontSize={"1.87vw"}
                                    mt={"3.26vw"}
                                >
                                    {affiliation?.description}
                                </Text>

                                <Flex
                                    w={"100%"}
                                    justifyContent={"flex-start"}
                                    mt={["5vw", "3vw"]}
                                    mb={[0, , "1vw"]}
                                    gap={[2, "2.083vw"]}
                                >
                                    {/* <Button
                                        variant="none"
                                        fontSize={["3.33vw", "1.6vw"]}
                                        w={["50%", "20%"]}
                                        borderRadius={["5.55vw", "2.64vw"]}
                                        h={["8.33vw", "3.96vw"]}
                                        px={["9.167vw", "4.375vw"]}
                                        border="2px"
                                        borderColor={"white"}
                                        bg={followId ? "white" : "transparent"}
                                        color={followId ? "#111111" : "white"}
                                        fontFamily={"raleway"} fontWeight={500}
                                        _hover={{ bg: "white", color: "#111111" }}
                                        onClick={handleFollowUnfollowAff}
                                    >
                                        {followId ? "Following" : "Follow"}
                                    </Button> */}
                                    <Button
                                        variant="none"
                                        fontSize={["3.33vw", "1.6vw"]}
                                        w={["50%", "20%"]}
                                        borderRadius={["5.55vw", "2.64vw"]}
                                        h={["8.33vw", "3.96vw"]}
                                        px={["9.167vw", "4.375vw"]}
                                        border="2px"
                                        borderColor={"white"}
                                        bg={followId ? "white" : "transparent"}
                                        color={followId ? "#111111" : "white"}
                                        fontFamily={"raleway"} fontWeight={500}
                                        _hover={{ bg: "white", color: "#111111" }}
                                        onClick={handleShareClick}
                                    >
                                        Share
                                    </Button>
                                    {affiliation?.website && <Button
                                        variant="none"
                                        fontSize={["3.33vw", "1.6vw"]}
                                        w={["50%", "20%"]}
                                        borderRadius={["5.55vw", "2.64vw"]}
                                        h={["8.33vw", "3.96vw"]}
                                        px={["9.167vw", "3vw"]}
                                        border="2px"
                                        borderColor={"white"}
                                        bg={"transparent"}
                                        color={"white"}
                                        fontFamily={"raleway"} fontWeight={500}
                                        _hover={{ bg: "white", color: "#111111" }}
                                        as={Link}
                                        href={affiliation?.website}
                                        target="_blank"
                                    >
                                        Visit Website
                                    </Button>}

                                </Flex>
                            </Flex>
                        </Box>

                        <Box
                            h={"2px!important"}
                            mt={["4vw", "1.5vw"]}
                            bg={"#EFE9E4"}
                            ml={["8.33vw", "6.46vw"]}
                            mr={["6.67vw", "6.11vw"]}
                        ></Box>

                        <Box
                            pt={["3vw"]}
                            display={{ base: "none", sm: "block" }}
                            h={["calc(58.4vw - 46.74vw)"]}
                            color={"#EFE9E4"}
                        >
                            <Flex
                                // Take up the remaining height
                                // w="100%"
                                justifyContent={"space-between"}
                                ml={["8.33vw", "6.46vw"]}
                                mr={["6.67vw", "6.11vw"]}
                                alignItems={"center"}
                                flexGrow={1} // Allow the Flex to grow and take up remaining space
                                mb={2}
                            >
                                <Box maxW={["33.89vw", "16.94vw"]}>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.8vw"}
                                        lineHeight={"1.6vw"}
                                        color={"#9C9895"}
                                        my={3}
                                    >
                                        {details?.albumCount || 0}
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.46vw"}
                                        lineHeight={"1.6vw"}
                                    >
                                        Boutique Properties
                                    </Text>

                                </Box>

                                <Box maxW={["33.89vw", "16.94vw"]}>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.8vw"}
                                        lineHeight={"1.6vw"}
                                        color={"#9C9895"}
                                        my={3}
                                    >
                                        {details?.postcardCount || 0}
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.46vw"}
                                        lineHeight={"1.6vw"}
                                    >
                                        Experiences
                                    </Text>

                                </Box>

                                <Box maxW={["33.89vw", "16.94vw"]}>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.8vw"}
                                        lineHeight={"1.6vw"}
                                        color={"#9C9895"}
                                        my={3}
                                    >
                                        {details?.tagCount || 0}
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.46vw"}
                                        lineHeight={"1.6vw"}
                                    >
                                        Personal Interests
                                    </Text>

                                </Box>

                                <Box maxW={["33.89vw", "16.94vw"]}>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.8vw"}
                                        lineHeight={"1.6vw"}
                                        color={"#9C9895"}
                                        my={3}
                                    >
                                        {details?.followerCount || 0}
                                    </Text>
                                    <Text
                                        fontFamily={"raleway"}
                                        fontWeight={600}
                                        fontSize={"1.46vw"}
                                        lineHeight={"1.6vw"}
                                    >
                                        Total Followers
                                    </Text>

                                </Box>
                            </Flex>
                        </Box>

                        <Box
                            display={{ base: "flex", sm: "none" }}
                            h={"calc(181.11vw - 143.33vw)"}
                            // pt={["1vw", "8.89vw"]}
                            // pb={"3.33vw"}
                            pl={["8.33vw", "6.46vw"]}
                            pr={["6.67vw", "6.11vw"]}
                            alignItems={"center"}

                        >
                            <Flex
                                // display={{ base: "flex", sm: "none" }}
                                // h={"calc(181.11vw - 143.33vw)"}
                                flexWrap={"wrap"}
                                // pt={"8.89vw"}
                                // pb={"3.33vw"}
                                // px={"7vw"}
                                gap={"5.83vw"}
                                mb={2}
                            >
                                <Box>
                                    <Box
                                        maxW={"33.89vw"}
                                        minW={"33.89vw"}
                                        minH={"12.78vw"}
                                    >
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"4.3vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#9C9895"}
                                            my={3}
                                        >
                                            {details?.albumCount || 0}
                                        </Text>
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"3.33vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#EFE9E4"}
                                        >
                                            Boutique Properties
                                        </Text>

                                    </Box>
                                    <Box
                                        maxW={"33.89vw"}
                                        minW={"33.89vw"}
                                        minH={"12.78vw"}
                                    >
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"4.3vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#9C9895"}
                                            my={3}
                                        >
                                            {details?.postcardCount || 0}
                                        </Text>
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"3.33vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#EFE9E4"}
                                        >
                                            Experiences
                                        </Text>

                                    </Box>
                                </Box>

                                <Box>
                                    <Box
                                        maxW={"33.89vw"}
                                        minW={"33.89vw"}
                                        minH={"12.78vw"}
                                    >
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"4.3vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#9C9895"}
                                            my={3}
                                        >
                                            {details?.tagCount || 0}
                                        </Text>
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"3.33vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#EFE9E4"}
                                        >
                                            Personal Interests
                                        </Text>

                                    </Box>
                                    <Box
                                        maxW={"33.89vw"}
                                        minW={"33.89vw"}
                                        minH={"12.78vw"}
                                    >
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"4.3vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#9C9895"}
                                            my={3}
                                        >
                                            {details?.followerCount || 0}
                                        </Text>
                                        <Text
                                            fontFamily={"raleway"}
                                            fontWeight={600}
                                            fontSize={"3.33vw"}
                                            lineHeight={"3.61vw"}
                                            color={"#EFE9E4"}
                                        >
                                            Total Followers
                                        </Text>

                                    </Box>
                                </Box>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Flex flexDirection="column">
                {/* Tabs */}
                <Flex position="relative" w="100%" h={["11.11vw", "3.33vw"]} bg={["#307fe27f", "#7faae3"]}>
                    {tabs.map((tab, index) => {
                        const isSelected = selectedTab === index;

                        const backgroundColor = isSelected
                            // ? "#f7ede2"
                            ? "#efe9e4"
                            : index < selectedTab
                                ? "#EA6146"
                                : "#EB836E";

                        const textColor = isSelected ? "#EA6146" : "#EFE9E4";

                        return (
                            <Flex
                                key={index}
                                zIndex={10 - index}
                                onClick={() => setSelectedTab(index)}
                                h="100%"
                                pr={["5.55vw", "2vw"]}
                                borderTopRightRadius={["4.167vw", "1.4vw"]}
                                justifyContent="flex-end"
                                alignItems="center"
                                position="absolute"
                                w={[`${23.22 + index * 38.62}vw`, `${15.7 + index * 13.7}vw`]}
                                textAlign="right"
                                top={0}
                                left={0}
                                bg={backgroundColor}
                                color={textColor}
                                fontFamily="raleway"
                                fontWeight={500}
                                fontSize={["4.44vw", "1.5vw"]}
                                boxShadow={!isSelected && ["10px 0px 10px -7px rgba(0,0,0,0.1)", "15px 0px 10px -7px rgba(0,0,0,0.1)"]}
                                cursor="pointer"
                                transition={"background-color 0.5s ease"}
                            >
                                {tab}
                            </Flex>
                        );
                    })}
                </Flex>

                {/* Content */}
                <Flex w="100%" pt={["12%", "5%"]}>
                    {tabContent[tabs[selectedTab]]}
                </Flex>
            </Flex>
        </>
    )
}

export default AffiliationPage