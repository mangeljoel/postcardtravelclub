import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { RightArrowIcon } from "../../../styles/ChakraUI/icons";
import { BsArrowRightCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { Image, Link } from "@chakra-ui/react";
import { useContext } from "react";
import FlipCard1 from "../../../patterns/FlipCard1";
import { FlipIcon } from "../../../styles/ChakraUI/icons";
import AppContext from "../../AppContext";
import Postcard from "../../TravelExplore/TravelPostcardList/Postcard";
import AlbumSection from "./AlbumSection";
import axios from "axios";
import CityGuideSection from "./CityGuideSection";
import PostcardSection from "./PostcardSection";
import { fetchPaginatedResults } from "../../../queries/strapiQueries";
import MemoriesSection from "./MemoriesSection";
// import { dummyMemories } from "../../../data/dummyMemories";
import {
    apiNames,
    populateNewsArticles
} from "../../../services/fetchApIDataSchema";

const PostcardLibrary = () => {
    const { profile } = useContext(AppContext);
    const [firstLoad, setFirstLoad] = useState(true);

    const [stays, setStays] = useState([]);
    const [postcards, setPostcards] = useState([]);
    const [memories, setMemories] = useState([]);
    const [cityGuides, setCityGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const slug = "amitjaipuria";
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    // albumRes,
                    // cityGuidesRes,
                    postcardRes,
                    memoryRes
                ] = await Promise.all([
                    // axios.post(
                    //     `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/albums/getAlbums?page=1&pageSize=3&type=mindful-luxury-hotels`,
                    //     { tags: [] }
                    // ),

                    // fetchPaginatedResults(
                    //     "city-guides",
                    //     {}, // no filters
                    //     {
                    //         region: { fields: ["id", "name"] },
                    //         country: { fields: ["id", "name"] },
                    //         image: { fields: ["url"] }
                    //     }
                    // ),

                    axios.post(
                        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/postcards/getPostcards?page=1&pageSize=3`,
                        { tags: [] }
                    ),

                    //  Memories
                    fetchPaginatedResults(
                        "memories",
                        { user: { slug }, shareType: "public" },
                        { gallery: true, country: true, region: true },
                        "date:DESC",
                        0,
                        10
                    )
                ]);

                //  stays
                // if (albumRes?.data?.length) setStays(albumRes.data);

                // //  city guides + album counts
                // let cityGuidesArray = Array.isArray(cityGuidesRes)
                //     ? cityGuidesRes
                //     : cityGuidesRes
                //     ? [cityGuidesRes]
                //     : [];

                // const citiesWithCounts = await Promise.all(
                //     cityGuidesArray.map(async (guide) => {
                //         let albumCounts = {
                //             shopping: 0,
                //             restaurants: 0,
                //             events: 0
                //         };

                //         try {
                //             // fetch albums for this region
                //             const albumsData = await fetchPaginatedResults(
                //                 "albums",
                //                 {
                //                     region: guide.region?.id,
                //                     isActive: true
                //                 },
                //                 {
                //                     directories: { fields: ["id", "name"] }
                //                 }
                //             );

                //             const albumsArray = Array.isArray(albumsData)
                //                 ? albumsData
                //                 : albumsData
                //                 ? [albumsData]
                //                 : [];

                //             albumsArray.forEach((album) => {
                //                 const directoryIds =
                //                     album.directories?.map((dir) => dir.id) ||
                //                     [];
                //                 if (directoryIds.includes(8))
                //                     albumCounts.shopping++;
                //                 if (directoryIds.includes(6))
                //                     albumCounts.restaurants++;
                //                 if (directoryIds.includes(0))
                //                     albumCounts.events++;
                //             });
                //         } catch (err) {
                //             console.error(
                //                 "Error fetching albums for city:",
                //                 err
                //             );
                //         }

                //         return {
                //             id: guide.id,
                //             regionId: guide.region?.id,
                //             name: guide.region?.name,
                //             country: guide.country?.name,
                //             slug:
                //                 `${guide.region?.name}`
                //                     .toLowerCase()
                //                     .replace(/\s+/g, "-") +
                //                 "-" +
                //                 `${guide.country?.name}`
                //                     .toLowerCase()
                //                     .replace(/\s+/g, "-"),
                //             image:
                //                 guide.image?.url ||
                //                 "/assets/cities/bengaluru.jpg",
                //             albumCounts,
                //             description:
                //                 guide.description ||
                //                 `Discover ${guide.region?.name}`
                //         };
                //     })
                // );

                // setCityGuides(citiesWithCounts.filter((city) => city.name));

                //  postcards
                if (postcardRes?.data?.data?.length)
                    setPostcards(postcardRes?.data?.data);

                //  memories
                if (Array.isArray(memoryRes) && memoryRes.length > 0) {
                    let mem = memoryRes
                        .filter((m) => m.gallery?.length > 1)
                        .slice(0, 3);
                    setMemories(mem);
                } else {
                    // setMemories(dummyMemories);
                    console.warn("No memories returned:", memoryRes);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Flex
            flexDirection="column"
            w="100%"
            mx="auto"
            alignItems={"center"}
            gap={[4, 1]}
        >
            {/* <Text
                fontFamily="raleway"
                fontWeight={600}
                fontSize={["6.6vw", "2.81vw"]}
                lineHeight={["8vw", "3.5vw"]}
                color="#307FE2"
                px={["6.85vw", "0"]}
                ml={["0", "7vw"]}
                mb={["40px", 0]}
            >
                Introducing the <br />
                <Text as="span" fontStyle="italic" fontFamily="lora">
                    Postcard Travel Library
                </Text>
            </Text>

            <AlbumSection featuredAlbums={stays} /> */}

            {/* <Text
                fontFamily="raleway"
                fontWeight={600}
                fontSize={["6.6vw", "2.81vw"]}
                lineHeight={["8vw", "3.5vw"]}
                color="#307FE2"
                px={["6.85vw", "0"]}
                ml={["0", "7vw"]}
                mt={["40px", "60px"]}
                mb={["40px", 0]}
            >
                {" "}
                Get your private <br />
                <Text as="span" fontStyle="italic" fontFamily="lora">
                    Postcard Travel Diary
                </Text>
            </Text> */}

            <Flex
                color={"#307FE2"}
                my={["7.24vw", 0, 0, "3vw"]}
                // ml="auto"
                // mr={["-5vw", "auto"]}
                //mt="3vw"
                width={["100%", "80%"]} // Adjust width as needed
                overflowX="scroll"
                className="no-scrollbar"
                justifyContent={["start", "center"]}
                px={["11.55vw", "0"]}
                pb={["7.55vw", "1vw"]}
            >
                <Box
                    width={["100%", "50%"]}
                    minW={["100%", "auto"]}
                    position={"relative"}
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={600}
                        // fontSize={["1.125rem", "1.68rem"]}
                        fontSize={["5vw", "1.667vw"]}
                    >
                        Do you wish
                    </Text>
                    <Box
                        borderTop="2px"
                        position={"relative"}
                        borderStyle={"dashed"}
                        my={[6, 8]}
                    >
                        <Box
                            position={"absolute"}
                            top={["-9px", "-12px"]}
                            width={["15px", "23px"]}
                            height={["15px", "23px"]}
                            borderColor={"primary_3"}
                            borderWidth={"2px"}
                            borderRadius={"50%"}
                            bg={"#efe9e4"}
                        ></Box>
                        {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                    </Box>
                    <Text
                        fontFamily="raleway"
                        fontWeight={500}
                        // fontSize={["0.875rem", "1.31rem"]}
                        // lineHeight={["1.06rem", "1.68rem"]}
                        fontSize={["3.75vw", "1.25vw"]}
                        lineHeight={["4.722vw", "1.563vw"]}
                        pr={["16", "6rem"]}
                    >
                        <Text as="span">
                            To be more intentional about making memories when
                            you travel?
                        </Text>{" "}
                        <Text as="span" fontWeight={600}></Text>
                    </Text>
                </Box>
                <Box
                    width={["100%", "50%"]}
                    minW={["100%", "auto"]}
                    position={"relative"}
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={600}
                        // fontSize={["1.125rem", "1.68rem"]}
                        fontSize={["5vw", "1.667vw"]}
                    >
                        Do you want
                    </Text>
                    <Box
                        borderTop="2px"
                        position={"relative"}
                        borderStyle={"dashed"}
                        height={"1px"}
                        my={[6, 8]}
                    >
                        <Box
                            position={"absolute"}
                            top={["-9px", "-12px"]}
                            width={["15px", "23px"]}
                            height={["15px", "23px"]}
                            borderColor={"primary_3"}
                            borderWidth={"2px"}
                            borderRadius={"50%"}
                            bg={"#efe9e4"}
                        ></Box>
                        {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                    </Box>
                    <Text
                        fontFamily="raleway"
                        fontWeight={500}
                        // fontSize={["0.875rem", "1.31rem"]}
                        // lineHeight={["1.06rem", "1.68rem"]}
                        fontSize={["3.75vw", "1.25vw"]}
                        lineHeight={["4.722vw", "1.563vw"]}
                        pr={["16", "6rem"]}
                    >
                        To remember your favourite memories by people, place and
                        time?
                        {/* <Text as="span" fontWeight={600}>
                            {" "}
                            a positive impact{" "}
                        </Text>{" "}
                        in the{" "}
                        <Text as="span" fontWeight={600}>
                            places you visit{" "}
                        </Text>
                        and the{" "}
                        <Text as="span" fontWeight={600}>
                            people you meet?
                        </Text>{" "} */}
                    </Text>
                </Box>
                <Box
                    width={["100%", "40%"]}
                    minW={["100%", "auto"]}
                    position={"relative"}
                >
                    <Text
                        fontFamily="raleway"
                        fontWeight={600}
                        // fontSize={["1.125rem", "1.68rem"]}
                        fontSize={["5vw", "1.667vw"]}
                    >
                        Then you need
                    </Text>
                    <Box
                        borderTop="2px"
                        position={"relative"}
                        borderStyle={"dashed"}
                        my={[6, 8]}
                    >
                        <Box
                            position={"absolute"}
                            top={["-9px", "-12px"]}
                            width={["15px", "23px"]}
                            height={["15px", "23px"]}
                            borderColor={"primary_3"}
                            borderWidth={"2px"}
                            borderRadius={"50%"}
                            bg={"#efe9e4"}
                        ></Box>
                        {/* <Image width="7" src={"/assets/homepage/circle.png"} /> */}
                    </Box>
                    <Text
                        fontFamily="lora"
                        fontStyle={"italic"}
                        fontWeight={400}
                        // fontSize={["2.18rem", "3.25rem"]} //35
                        // lineHeight={["2.37rem", "3.25rem"]} //38
                        fontSize={["9.72vw", "2.6vw"]}
                        lineHeight={["10.55vw", "3vw"]}
                    >
                        Postcard Travel Diary
                    </Text>
                </Box>
            </Flex>

            <PostcardSection featuredPostcards={postcards} />
            {/* <CityGuideSection featuredCityGuides={cityGuides} /> */}
            <MemoriesSection featuredMemories={memories} />
        </Flex>
    );
};

export default PostcardLibrary;
