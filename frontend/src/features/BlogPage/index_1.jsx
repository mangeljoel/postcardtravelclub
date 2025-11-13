import { Box, Text, Flex, Button, Divider, Link, Image } from "@chakra-ui/react";
import RenderMarkdown from "../../patterns/RenderMarkdown";
import { markdownStyles, root, noMarginbottom } from "./index.module.scss";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
import LoadingGif from "../../patterns/LoadingGif";
import { useState, useEffect, useRef } from "react";
import {
    LocationIcon,
    PriceIcon,
    PropertyIcon,
    RoomIcon,
    WebsiteIcon
} from "../../styles/ChakraUI/icons";
import { LinkIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import IndexSection from "../CreatePostcardPage/Patterns/IndexSection";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import Postcard from "../TravelExplore/TravelPostcardList/Postcard";
// import { motion } from "framer-motion";
import { motion, scroll, animate } from "motion";

const BlogPage = (props) => {
    const { blogPost, pageSections, ...restProps } = props;
    const [newsArticle, setNewsArticle] = useState(null);
    const [renderSections, setRenderSections] = useState([])
    const [tagList, setTagList] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const router = useRouter();
    // console.log(blogPost)

    const getTags = async () => {
        let tags = [];
        if (newsArticle?.album && newsArticle.album.id)
            tags = await fetchPaginatedResults(
                "albums/gettags?albumId=" + newsArticle.album.id,
                {},
                {}
            );
        const capitalizedTags = tags.map((tag) =>
            tag
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        );
        // console.log(capitalizedTags)
        setTagList(capitalizedTags);
    };

    const handleTagClick = (tagName) => {
        if (selectedTag != tagName) {
            setSelectedTag(tagName)
        }
        else if (selectedTag == tagName) {
            setSelectedTag('')
        }
    }

    useEffect(() => {
        if (blogPost) setNewsArticle(blogPost);
    }, [blogPost]);

    useEffect(() => {
        const result = []
        if (pageSections?.length > 0) {
            for (const pageSection of pageSections) {
                if (newsArticle?.block?.length > 0) {
                    const section = newsArticle?.block.filter((section) => (pageSection.id === section.album_section.id))
                    if (section?.length > 0) {
                        result.push(section)
                    }
                }
            }
        }
        // console.log("res",result)
        setRenderSections(result)
    }, [pageSections, newsArticle])

    useEffect(() => {
        getTags();
    }, [newsArticle]);

    useEffect(() => {
        const $cardsWrapper = document.querySelector("#cards")
        const $cards = document.querySelectorAll('.card');

        const numCards = $cards.length;

        $cards.forEach(($card, index0) => {
            const index = index0 + 1;
            const reverseIndex0 = numCards - index;

            // Extra padding per card
            // $card.style.paddingTop = `calc(${index} * var(--card-top-offset))`;

            // Scroll-Linked Animation
            scroll(
                animate($card, {
                    scale: [1, 1 - (0.1 * reverseIndex0)],
                }), {
                target: $cardsWrapper,
                offset: [`${index0 / numCards * 100}%`, `${index / numCards * 100}%`],
            }
            );
        });
    }, [renderSections]);

    return newsArticle ? (
        <Flex flexDirection={"column"} w={"100%"} alignItems={"center"}>

            <Box w={"100%"} minH={["181.11vw", "58.4vw"]} px={["5.56vw", "2.22vw"]} my={["6.94vw", "2.22vw"]}>
                <Box w={"100%"} h={"100%"} bg={"#111111"} borderRadius={["4.167vw", "2.08vw"]} position="relative">
                    <ChakraNextImage
                        borderTopRadius={["4.167vw", "2.08vw"]}
                        noLazy={true}
                        priority
                        src={newsArticle?.image?.url ?? ""}
                        w={"100%"}
                        h={["143.33vw", "46.74vw"]}
                        objectFit="cover"
                        alt={blogPost?.album?.name + " coverImage"}
                    />

                    <Box w={"100%"} h={["143.33vw", "46.74vw"]} position={"absolute"} top={0} left={0} pl={["8.33vw", "6.46vw"]} pr={["6.67vw", "6.11vw"]} bg={"rgba(0,0,0,0.4)"} borderTopRadius={["4.167vw", "2.08vw"]}>
                        <Flex w={"100%"} h={"100%"} flexDirection={"column"} borderRadius={["4.167vw", "2.08vw"]}>
                            <Flex display={{ base: "none", sm: "flex" }} h={"14.1vw"} mt={"17.8vw"} justifyContent={"space-between"} alignItems={"flex-end"}>
                                <Text maxW={"55.76vw"} fontSize={"4.58vw"} lineHeight={"4.72vw"} color={"white"} fontFamily={"raleway"}>
                                    {newsArticle?.album?.name && newsArticle?.title?.includes(newsArticle?.album?.name?.trim()) ? (
                                        <>
                                            {newsArticle?.title.split(newsArticle?.album?.name)[0]}
                                            <Text as="span" fontFamily={"lora"} fontStyle={"italic"}>
                                                {newsArticle?.album?.name?.trim()}
                                            </Text>
                                            {newsArticle?.title.split(newsArticle?.album?.name)[1]}
                                        </>
                                    ) : (
                                        newsArticle?.title
                                    )}
                                </Text>
                                <Button variant={"none"} color={"white"} w={"21.74vw"} h={"3.47vw"} border={"2px"} borderColor={"white"} backdropFilter={"blur(10px)"} borderRadius={"2.78vw"} fontFamily={"raleway"} fontWeight={400} fontSize={"1.46vw"} lineHeight={"1.87vw"} _hover={{ color: "#111111", bg: "#EFE9E4" }}>Play Video</Button>
                            </Flex>

                            <Flex display={{ base: "flex", sm: "none" }} flexDirection={"column"} mt={"64.22vw"} gap={"6.67vw"}>
                                <Text w={"100%"} fontSize={"7.78vw"} lineHeight={"8.88vw"} color={"white"} fontStyle={"italic"} fontFamily={"lora"}>{newsArticle?.title}</Text>
                                <Text color={"#EFE9E4"} fontFamily={"raleway"} fontWeight={400} fontSize={"3.89vw"} lineHeight={"5vw"}>{blogPost?.description}</Text>
                                <Button variant={"none"} color={"white"} w={"49.72vw"} h={"8.33vw"} border={"1px"} borderColor={"white"} backdropFilter={"blur(10px)"} borderRadius={"5.55vw"} fontFamily={"raleway"} fontWeight={400} fontSize={"3.33vw"} lineHeight={"10.28vw"} _hover={{ color: "#111111", bg: "#EFE9E4" }}>Play Video</Button>
                            </Flex>

                            <Text display={{ base: "none", sm: "flex" }} color={"#EFE9E4"} fontFamily={"raleway"} fontWeight={400} fontSize={"1.87vw"} mt={"3.26vw"}>{blogPost?.description}</Text>

                            <Box display={{ base: "none", sm: "flex" }} h={"2px"} mt={"2.01vw"} w={"100%"} bg={"#EFE9E4"}></Box>
                        </Flex>
                    </Box>

                    <Flex
                        display={{ base: "none", sm: "flex" }}
                        h={["calc(58.4vw - 46.74vw)"]} // Take up the remaining height
                        justifyContent={"space-around"}
                        alignItems={"center"}
                        flexGrow={1} // Allow the Flex to grow and take up remaining space
                        color={"#EFE9E4"}
                    >
                        <Box maxW={["33.89vw", "16.94vw"]}>
                            <Text fontFamily={"raleway"} fontWeight={600} fontSize={"1.46vw"} lineHeight={"1.6vw"}>{blogPost?.album?.name}</Text>
                            <Text fontFamily={"raleway"} fontWeight={600} fontSize={"1.25vw"} lineHeight={"1.6vw"} color={"#9C9895"}>{blogPost?.album?.country?.name}</Text>
                        </Box>

                        <Box maxW={["33.89vw", "16.94vw"]}>
                            <Text fontFamily={"raleway"} fontWeight={600} fontSize={"1.46vw"} lineHeight={"1.6vw"}>Best Time To Visit</Text>
                            <Text fontFamily={"raleway"} fontWeight={600} fontSize={"1.25vw"} lineHeight={"1.6vw"} color={"#9C9895"}>{blogPost?.album?.bestTimetoTravel || "N/A"}</Text>
                        </Box>

                        <Box maxW={["33.89vw", "16.94vw"]}>
                            <Text fontFamily={"raleway"} fontWeight={600} fontSize={"1.46vw"} lineHeight={"1.6vw"}>Prices Starting at</Text>
                            <Text fontFamily={"raleway"} fontWeight={600} fontSize={"1.25vw"} lineHeight={"1.6vw"} color={"#9C9895"}>{blogPost?.album?.pricesStartingAt || "N/A"}</Text>
                        </Box>

                        <Box maxW={["33.89vw", "16.94vw"]}>
                            <Text fontFamily={"raleway"} fontWeight={600} fontSize={"1.46vw"} lineHeight={"1.6vw"}>Accommodations</Text>
                            <Text fontFamily={"raleway"} fontWeight={600} fontSize={"1.25vw"} lineHeight={"1.6vw"} color={"#9C9895"}>{blogPost?.album?.numberOfNights || "N/A"}</Text>
                        </Box>
                    </Flex>

                    <Flex display={{ base: "flex", sm: "none" }} h={"calc(181.11vw - 143.33vw)"} flexWrap={"wrap"} pt={"8.89vw"} pb={"3.33vw"} px={"7vw"} gap={"5.83vw"}>
                        <Box>
                            <Box maxW={"33.89vw"} minW={"33.89vw"} minH={"12.78vw"}>
                                <Text fontFamily={"raleway"} fontWeight={600} fontSize={"3.33vw"} lineHeight={"3.61vw"} color={"#EFE9E4"}>{blogPost?.album?.name}</Text>
                                <Text fontFamily={"raleway"} fontWeight={600} fontSize={"2.78vw"} lineHeight={"3.61vw"} color={"#9C9895"}>{blogPost?.album?.country?.name}</Text>
                            </Box>
                            <Box maxW={"33.89vw"} minW={"33.89vw"} minH={"12.78vw"}>
                                <Text fontFamily={"raleway"} fontWeight={600} fontSize={"3.33vw"} lineHeight={"3.61vw"} color={"#EFE9E4"}>Prices Starting at</Text>
                                <Text fontFamily={"raleway"} fontWeight={600} fontSize={"2.78vw"} lineHeight={"3.61vw"} color={"#9C9895"}>{blogPost?.album?.pricesStartingAt || "N/A"}</Text>
                            </Box>
                        </Box>

                        <Box>
                            <Box maxW={"33.89vw"} minW={"33.89vw"} minH={"12.78vw"}>
                                <Text fontFamily={"raleway"} fontWeight={600} fontSize={"3.33vw"} lineHeight={"3.61vw"} color={"#EFE9E4"}>Best Time To Visit</Text>
                                <Text fontFamily={"raleway"} fontWeight={600} fontSize={"2.78vw"} lineHeight={"3.61vw"} color={"#9C9895"}>{blogPost?.album?.bestTimetoTravel || "N/A"}</Text>
                            </Box>
                            <Box maxW={"33.89vw"} minW={"33.89vw"} minH={"12.78vw"}>
                                <Text fontFamily={"raleway"} fontWeight={600} fontSize={"3.33vw"} lineHeight={"3.61vw"} color={"#EFE9E4"}>Accommodations</Text>
                                <Text fontFamily={"raleway"} fontWeight={600} fontSize={"2.78vw"} lineHeight={"3.61vw"} color={"#9C9895"}>{blogPost?.album?.numberOfNights || "N/A"}</Text>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
            </Box>

            <Box w={"100%"} id="cards">

                {renderSections?.length > 0 && renderSections?.map((pageSection, index) => {
                    const lenOfSection = pageSection?.length || 0
                    return (
                        <Box key={index} w={"100%"} className="card"
                        // mb={[`calc(-${index+1} * 7em)`]}
                        >
                            {pageSection?.length > 0 && pageSection.map((section, index) => (
                                <>
                                    {section?.album_section.id == 1 && (
                                        <Box id={section.album_section?.name} w={"100%"} bg={"primary_1"} px={["12.22vw", "8.5vw"]} py={["10.83vw", "6.875vw"]} borderTopRadius={["4.167vw", "2.08vw"]} >
                                            <Flex flexDirection={"column"}>
                                                <Text color={"#EFE9E4"} fontFamily={"lora"} fontStyle={"italic"} fontSize={["7.78vw", "3.06vw"]}>{section.album_section?.name}</Text>

                                                <Box h={["1px", "2px"]} mt={["6.94vw", "3.125vw"]} w={"100%"} bg={"#EFE9E4"}></Box>

                                                <Flex mt={["0vw", "2.57vw"]} justifyContent={"space-between"} flexDirection={["column", "row"]}>
                                                    <Flex flexDirection={"column"} w={["100%", "52.85vw"]} className={root}>

                                                        <RenderMarkdown
                                                            className={markdownStyles}
                                                            content={section.content}
                                                            color={"#EFE9E4"}
                                                        />
                                                    </Flex>

                                                    <Flex flexDirection={"column"} w={["100%", "21.6vw"]} gap={["3.06vw", "1.04vw"]}>
                                                        <IndexSection pageSections={pageSections} newsArticle={newsArticle} />
                                                    </Flex>


                                                </Flex>
                                            </Flex>

                                        </Box>)
                                    }


                                    {section?.album_section.id !== 1 && section?.album_section.id !== 7 && (
                                        <Box id={section.album_section?.name} w={"100%"} bg={"white"} borderTopRadius={["4.167vw", "2.08vw"]} mt={["-4.167vw", "-2.08vw"]} px={["10.55vw", "18.54vw"]} pt={["13.33vw", "6.32vw"]} pb={index == lenOfSection - 1 && ["11.4vw", "6.32vw"]} boxShadow={index == 0 && ["0px -20px 25px 0px rgba(0,0,0,0.2)", "0px -35px 25px 0px rgba(0,0,0,0.2)"]}>

                                            <Flex flexDirection={"column"}>
                                                {index == 0 && <Text color={"primary_1"} fontFamily={"lora"} fontStyle={"italic"} fontSize={["6.4vw", "3.06vw"]}>{section.album_section?.name}</Text>}
                                                {index > 0 && <Box h={["1px", "2px"]} mb={["8.88vw", "4.9vw"]} w={"100%"} bg={"#111111"}></Box>}

                                                <Box mt={index == 0 && "2.5vw"} className={root}>
                                                    <Text fontSize={["4.44vw!important", "2.08vw!important"]} lineHeight={["5.55vw!important", "2.64vw!important"]} fontFamily={"raleway"} textAlign={"left!important"} color={"#111111"} fontWeight={"500!important"}>
                                                        {section.album_section?.name ===
                                                            "Sustainability Story" &&
                                                            section?.title !=
                                                            "Caring for People and the Planet"
                                                            ? "Caring for People and the Planet"
                                                            : section?.title}
                                                    </Text>

                                                    {section?.image?.url && <Image src={section.image?.url} alt={"Section Image"} />}
                                                    {section?.image?.url && section?.imageCopyright && <Box textAlign={"center"}>{`Photo Copyright: ${section.imageCopyright}`}</Box>}
                                                    <RenderMarkdown
                                                        className={markdownStyles}
                                                        content={section.content}
                                                    />
                                                </Box>
                                            </Flex>
                                        </Box>)
                                    }

                                </>
                            ))}
                        </Box>
                    )
                })}
            </Box>

            {/* for postcards */}
            {newsArticle?.album?.postcards?.length > 0 && (
                <Flex id={"Postcard Experiences"} w={"100%"} bg={"#111111"} pl={[0, "8.68vw"]} gap={["2vw", "2.78vw"]} flexDirection={["column", "row"]}>
                    <Box w={["72.22vw", "21.46vw"]} pt={["15.55vw", "11.18vw"]} pb={[0, "9.1vw"]} mx={["auto", ""]}>
                        <Text fontSize={["6.4vw", "3.33vw"]} lineHeight={["6.67vw", "3.61vw"]} fontFamily={"lora"} fontStyle={"italic"} color={"#EFE9E4"}>
                            Postcard Experiences
                        </Text>

                        <Flex mt={["6.67vw", "5vw"]} flexWrap={"wrap"} gap={["2.5vw", "1.04vw"]}>
                            {tagList?.map((tag) => (<Text onClick={() => handleTagClick(tag)} border={"1px"} borderColor={"#EFE9E4"} color={"#EFE9E4"} h={["7.5vw", "2.92vw"]} lineHeight={["6.5vw", "2.92vw"]} px={["3.33vw", "1.74vw"]} fontSize={["3.62vw", "1.18vw"]} borderRadius={["8.88vw", "3vw"]} fontFamily={"raleway"}>{tag}</Text>))}
                        </Flex>
                    </Box>

                    <Flex px={["5.8vw", "3.26vw"]} w={["100%", "63.82vw"]} pt={"11.18vw"} pb={"9.1vw"} overflowX={"auto"} gap={["8.88vw", "2.36vw"]} className="no-scrollbar" flexDirection={["column", "row"]}>
                        {[...newsArticle.album.postcards, ...newsArticle.album.postcards].map((postcard) => (
                            postcard?.isComplete && (
                                <Postcard key={postcard?.id} postcard={postcard} from={"albumPage"} />
                            )
                        ))}
                    </Flex>
                </Flex>
            )}
        </Flex>
    ) : (
        <LoadingGif />
    );
};

export default BlogPage;
