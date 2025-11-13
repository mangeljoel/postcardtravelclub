import {
    Box,
    Flex,
    Text,
    AspectRatio,
    Button,
    Img,
    Image
} from "@chakra-ui/react";
import Flipcard from "../../patterns/FlipCard";
import FadeTextOnScroll from "../../patterns/FadeTextOnScroll";
import InfiniteMasonry from "../../patterns/InfiniteMasonry";
import { useEffect, useState } from "react";
import CountryFilter from "../AllTours/CountryFilter";
import { useRouter } from "next/router";

function PodNewsLayout({ title, description, stories = [], isNews }) {
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const router = useRouter();
    const [filteredStories, setFilteredStories] = useState(stories);
    const getMasonryItems = (stories) => {
        if (stories && stories.length >= 0) {
            return stories.map((item, index) => (
                <Flipcard
                    key={item.id}
                    indexId={index}
                    background="#fbf8f5"
                    frontChild={
                        <Box borderRadius="8px" pb={"0.1px"}>
                            <AspectRatio
                                ratio={isNews ? 4 / 3 : 1}
                                pos="relative"
                                overflow="hidden"
                                borderTopRadius="8px"
                                w="100%"
                                h="100%"
                                margin="auto"
                            >
                                <Image
                                    src={
                                        isNews
                                            ? item.image?.url
                                            : item?.thumbnail?.url
                                    }
                                    layout="fill"
                                    objectFit="cover"
                                    alt={"postcard"}
                                />
                            </AspectRatio>
                            <Box m={4} textAlign={"left"} px="8px">
                                {isNews ? (
                                    <>
                                        <Text
                                            fontSize="24px"
                                            lineHeight={1.2}
                                            mt={"2em"}
                                            fontWeight="bold"
                                        >
                                            {item.title}
                                        </Text>
                                        {item?.album?.country?.name ? (
                                            <Text
                                                color="primary_3"
                                                mt="1em"
                                                fontSize={"14px"}
                                                fontFamily="raleway"
                                                fontWeight="bold"
                                            >
                                                {item?.album?.country?.name}
                                            </Text>
                                        ) : (
                                            item.creator?.fullName && (
                                                <Text
                                                    color="primary_3"
                                                    mt="1em"
                                                    fontSize={"14px"}
                                                    fontFamily="raleway"
                                                    fontWeight="bold"
                                                >
                                                    {item.creator.fullName}
                                                </Text>
                                            )
                                        )}
                                        <Text
                                            color="primary_6"
                                            mt={4}
                                            // px="8px"
                                            fontFamily="raleway"
                                            whiteSpace="pre-line"
                                            fontSize="1rem"
                                            textAlign="left"
                                            overflowY={"auto"}
                                        >
                                            {item.description}
                                        </Text>
                                        <Button
                                            my="2em"
                                            mx="auto"
                                            fontSize={"16px"}
                                            pb={0.5}
                                            // height="1.8rem"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isNews && item?.id)
                                                    // router.push(
                                                    //     "/wanderlust/" +
                                                    //         item.id,
                                                    //     "_blank"
                                                    // );
                                                    window.open(
                                                        "/postcard-pages/" +
                                                        item.id,
                                                        "_blank"
                                                    );
                                                else
                                                    window.open(
                                                        item.podcastUrl,
                                                        "_blank"
                                                    );
                                            }}
                                            display="flex"
                                        >
                                            {isNews
                                                ? "Discover More"
                                                : "Listen to the Episode"}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            fontSize="1.5rem"
                                            mt={"1em"}
                                            mb="0.5em"
                                            fontWeight="bold"
                                        >
                                            {item?.appleUrl}
                                        </Text>
                                        {item.album?.company?.name && (
                                            <Text fontWeight={"bold"}>
                                                Founder -{" "}
                                                {item.album.company.name}
                                            </Text>
                                        )}
                                        <Flex
                                            justifyContent="space-between"
                                            mt="2em"
                                            mb="1em"
                                        >
                                            <Img
                                                alt="flip"
                                                width="25px!important"
                                                cursor={"pointer"}
                                                height="23px"
                                                src={
                                                    "../../../../assets/flip-icon.svg"
                                                }
                                            />
                                            <Text
                                                color="primary_3"
                                                fontSize="12px"
                                                mt={2}
                                                fontFamily="raleway"
                                                fontWeight={700}
                                            >
                                                Postcard Travel Show
                                            </Text>
                                        </Flex>
                                    </>
                                )}
                            </Box>
                        </Box>
                    }
                    backChild={
                        isNews ? null : (
                            <Box
                                display="flex"
                                className="iosFlickeringcssfix"
                                alignItems="center"
                                flexDirection="column"
                                p="8px"
                                width="100%"
                                bg="cardBackground"
                                pos="relative"
                                height="100%"
                            >
                                <Box
                                    height="7px"
                                    width="100%"
                                    mb="3%"
                                    top="2vh"
                                    bg="cardBackground"
                                    pos="relative"
                                    px="4px"
                                    borderRadius="8px"
                                    w="100%"
                                >
                                    <Image
                                        layout="fill"
                                        src={
                                            "/assets/new_ui/icons/pc_lines.svg"
                                        }
                                        alt="postalstripes"
                                        objectFit="contain"
                                    />
                                </Box>
                                <FadeTextOnScroll
                                    indexId={"followPodcast" + index}
                                    mt="25px"
                                    h="80%"
                                    children={
                                        <Text
                                            color="primary_6"
                                            fontFamily="raleway"
                                            whiteSpace="pre-line"
                                            fontSize="1rem"
                                            textAlign="justify"
                                            overflowY={"auto"}
                                        >
                                            {item.description}
                                        </Text>
                                    }
                                />
                                <Button
                                    mx="auto"
                                    fontSize={"16px"}
                                    //height="2rem"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(
                                            isNews
                                                ? item?.link
                                                : item.podcastUrl,
                                            "_blank"
                                        );
                                    }}
                                    my="2em"
                                    display="flex"
                                    pb={0.5}
                                >
                                    {isNews
                                        ? "Discover More"
                                        : "Listen to the Episode"}
                                </Button>
                            </Box>
                        )
                    }
                />
            ));
        }
    };
    useEffect(() => {
        if (isNews && stories.length) {
            let countries = [];
            stories.map((story) => {
                if (
                    story.album &&
                    story.album.country?.id &&
                    countries.filter((e) => e.id === story.album.country.id)
                        .length == 0
                ) {
                    countries.push(story.album.country);
                }
            });
            countries.sort((a, b) => a.name.localeCompare(b.name));
            setCountryList(countries);
        }
    }, [stories]);
    const filterStories = async (type, name) => {
        setSelectedCountry(name);
        if (name === "" || name == "All Countries") {
            setFilteredStories(stories);
        } else {
            let filtered = stories.filter(
                (story) => story?.album?.country?.name === name
            );
            setFilteredStories(filtered);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            my={["1em", "3em"]}
        >
            <Box>
                <Text
                    textAlign="center"
                    // mt={"2%"}
                    // my="1em"
                    fontSize={["24px", "28px"]}
                    //color="primary_3"
                    fontWeight={700}
                >
                    {title.toUpperCase()}
                </Text>
                <Text
                    my={["5%", "2%"]}
                    mx="auto"
                    fontSize={["16px", "20px"]}
                    w={["95%", "70%"]}
                    whiteSpace={"pre-line"}
                    textAlign="center"
                >
                    {description}
                </Text>
            </Box>

            {isNews && countryList && countryList.length > 0 && (
                <Box w="90%" mx="auto">
                    <CountryFilter
                        countryList={countryList}
                        filterAlbums={filterStories}
                        isCountry={true}
                        type="stories"
                        allCountriesOption={true}
                    />
                </Box>
            )}

            <Box width={["90%", "80%"]} mb="6rem">
                <InfiniteMasonry
                    hasMore={false}
                    showPreview={false}
                    masonryItems={getMasonryItems(filteredStories)}
                />
            </Box>
            {/* {!isNews && (
                <Button
                    mb="4rem"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                            isNews
                                ? "https:/blog.postcard.travel"
                                : "https://omny.fm/shows/the-postcard-travel-show",
                            _blank
                        );
                    }}
                >
                    {isNews ? "Postcard Weekly Digest" : "Postcard Travel Show"}
                </Button>
            )} */}
        </Box>
    );
}

export default PodNewsLayout;
