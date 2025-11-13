import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { CloseIcon } from "../../styles/ChakraUI/icons";
import strapi from "../../queries/strapi";
import LoadingGif from "../../patterns/LoadingGif";

const CountryFilter = ({
    filter,
    setFilter,
    tag,
    type,
    forProfile = false,
    slug,
    countryList
}) => {
    const [open, setOpen] = useState(false);

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleApply = (country) => {
        setFilter((prev) => ({
            ...prev,
            country: country?.id !== -1 ? country : null
        }));
        setOpen(false);
    };

    const handleReset = () => {
        setFilter((prev) => ({ ...prev, country: null }));
        setSelectedCountry(null);
        setOpen(false);
    };

    const centerElementInView = () => {
        const element = document.getElementById("CountryFilter");
        const modalBody = document.getElementById("GuidedSearchBody");

        if (element && modalBody) {
            const elementRect = element.getBoundingClientRect();
            const bodyRect = modalBody.getBoundingClientRect();
            const elementTop = elementRect.top + window.scrollY;
            const windowHeight = window.innerHeight;
            const bodyHeight = bodyRect.height;

            // Calculate the scroll position to center the element
            const scrollPosition = elementTop - (windowHeight - bodyHeight) / 2;

            // Smoothly scroll to the calculated position
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (open) {
            centerElementInView();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // Reset overflow on cleanup
        };
    }, [open]);

    useEffect(() => {
        const fetchCountries = async () => {
            const queryParts = [];
            if (tag) {
                queryParts.push(`tags=${tag?.id}`);
            }
            if (type == "hotels") {
                queryParts.push(`type=hotels`);
            } else if (type == "tours") {
                queryParts.push(`type=tours`);
            }
            if (forProfile && slug) {
                queryParts.push(`profile=${slug}`);
                queryParts.push(`resultFor=albums`);
            }
            const query =
                queryParts?.length > 0 ? `${queryParts?.join("&")}` : "";
            const res = await strapi.find(`country/getCountries?${query}`, {
                sort: "name:ASC"
            });
            setCountries(res || []);
        };
        countryList ? setCountries(countryList || []) : fetchCountries();
    }, [tag]);

    return (
        <Box
            id={"CountryFilter"}
            w={open ? "100%" : "50%"}
            px={["0%", "10%"]}
            mx={"auto"}
            position={"relative"}
        >
            {/* Overlay */}
            {open && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    w="100vw"
                    h="100vh"
                    zIndex={59}
                    bg="rgba(0, 0, 0, 0.4)" // Adjust transparency as needed
                    backdropFilter="blur(2px)"
                ></Box>
            )}

            <Flex w={"100%"} h={["9.167vw", "3.472vw"]} justify={"center"}>
                <Flex
                    borderRadius={["7.22vw", "2.78vw"]}
                    w={"100%"}
                    boxShadow={[
                        "20px 0px 15px -3px rgba(0,0,0,0.1)",
                        "20px 0px 15px -3px rgba(0,0,0,0.1)"
                    ]}
                    justify={"center"}
                    alignItems={"center"}
                    fontSize={["3.056vw", "1.46vw"]}
                    fontWeight={600}
                    fontFamily={"raleway"}
                    bg={
                        selectedCountry
                            ? "primary_1"
                            : open
                            ? "#EDB6A9"
                            : "white"
                    }
                    color={selectedCountry ? "white" : "primary_1"}
                    transition={"background-color 1s ease"}
                    zIndex={open ? 64 : 14}
                    onClick={(e) => setOpen(true)}
                >
                    {selectedCountry ? selectedCountry.name : "Country"}
                </Flex>
            </Flex>
            <Flex
                id={"GuidedSearchBody"}
                flexDirection={"column"}
                display={open ? "flex" : "none"}
                h={["auto", "43.96vw"]}
                maxH={["90vh", "43.96vw"]}
                mt={["-9.167vw", "-3.472vw"]}
                borderRadius={["4.5vw", "2.083vw"]}
                px={["8.33vw", "3.05vw"]}
                py={["7.77vw", "2.64vw"]}
                w={["100%", "80%"]}
                mx={[0, "10%"]}
                bg={"white"}
                zIndex={60}
                position={"absolute"}
                left={0}
                justifyContent={"space-between"}
            >
                {countries?.length > 0 ? (
                    <Flex
                        animation={
                            open
                                ? "fadeIn 1s ease-in-out forwards"
                                : "fadeOut 1s ease-in-out forwards"
                        }
                        flexDirection={"column"}
                        h={"90%"}
                        pt={["6.4vw", "2.64vw"]}
                        position={"relative"}
                    >
                        <Text
                            fontSize={["3.611vw", "1.4vw"]}
                            fontFamily={"raleway"}
                            textAlign={"left"}
                            color={"primary_1"}
                        >
                            SELECT COUNTRY
                        </Text>
                        <Box
                            w={"100%"}
                            h={["1px", "2px"]}
                            bg={"primary_1"}
                            my={["4.167vw", "1.6vw"]}
                        ></Box>

                        <Flex
                            overflow={"auto"}
                            flexDirection={"column"}
                            position="relative"
                            h="100%"
                            pb={["22vw", "10vw"]}
                        >
                            <Text
                                fontSize={["3.611vw", "1.46vw"]}
                                fontFamily={"raleway"}
                                color={
                                    selectedCountry?.id == -1
                                        ? "primary_1"
                                        : "#646260"
                                }
                                textAlign={"left"}
                                cursor={"pointer"}
                                onClick={(e) => {
                                    if (selectedCountry?.id == -1) {
                                        setSelectedCountry(null);
                                        handleReset(); // Use handleReset instead
                                    } else {
                                        setSelectedCountry({
                                            id: -1,
                                            name: "All Countries"
                                        });
                                        handleReset(); // Changed from handleApply
                                    }
                                }}
                            >
                                {selectedCountry?.id == -1
                                    ? "Clear All"
                                    : "Select All"}
                            </Text>

                            <Flex
                                flexWrap={"wrap"}
                                gap={["2.2vw", "1.4vw"]}
                                mt={["2.2vw", "1.4vw"]}
                            >
                                {countries?.map((country, index) => (
                                    <Text
                                        w={"30%"}
                                        fontSize={["3.611vw", "1.46vw"]}
                                        fontFamily={"raleway"}
                                        color={
                                            selectedCountry?.id == -1 ||
                                            selectedCountry?.id == country.id
                                                ? "primary_1"
                                                : "#646260"
                                        }
                                        textAlign={"left"}
                                        key={index}
                                        onClick={(e) => {
                                            setSelectedCountry(country);
                                            handleApply(country);
                                        }}
                                        cursor="pointer"
                                    >
                                        {country.name}
                                    </Text>
                                ))}
                            </Flex>
                        </Flex>

                        {/* Gradient Overlay */}
                        <Box
                            w="100%"
                            h={["27%", "30%"]}
                            bg={
                                "linear-gradient(to top, white 33%, transparent)"
                            }
                            position="absolute"
                            bottom="0"
                            zIndex={61}
                            pointerEvents="none" /* Ensures it doesn't block interactions with content */
                        />
                    </Flex>
                ) : (
                    <LoadingGif />
                )}

                <Flex justify={"space-between"}>
                    <Box
                        w={["6.11vw", "2.36vw"]}
                        h={["6.11vw", "2.36vw"]}
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon
                            width={"100%"}
                            height={"100%"}
                            stroke={"#B8B3AF"}
                        />
                    </Box>

                    {/* <Flex gap={"1.46vw"}>
                        <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"white"} color={"primary_1"} border={"2px"} fontFamily={"raleway"} onClick={handleReset}>Reset</Button>
                        <Button variant="none" fontSize={["3.611vw", "1.46vw"]} borderRadius={["7.22vw", "2.78vw"]} px={["8.33vw", "4.34vw"]} h={["8.33vw", "3.125vw"]} bg={"primary_1"} color={"white"} fontFamily={"raleway"} onClick={handleApply}>Apply</Button>
                    </Flex> */}
                </Flex>
            </Flex>
        </Box>
    );
};

export default CountryFilter;
