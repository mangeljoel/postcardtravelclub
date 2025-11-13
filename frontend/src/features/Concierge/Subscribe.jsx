import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import {
    Text,
    Button,
    Flex,
    Box,
    Avatar,
    FormControl,
    FormLabel,
    Input
} from "@chakra-ui/react";
import PostcardModal from "../PostcardModal";
import { AutoCompleteField } from "../../patterns/FormBuilder/AutoCompleteField";
import { createDBEntry, getCountries } from "../../queries/strapiQueries";
import { useRouter } from "next/router";
import strapi from "../../queries/strapi";

const Subscribe = () => {
    const { profile } = useContext(AppContext);
    const router = useRouter();
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [country, setCountry] = useState(null);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [countryList, setCountryList] = useState([]);

    const handleSubscribe = async () => {
        let isCardNumberUsed = true;
        const lastRecord = await strapi.find("loyalty-cards", {
            sort: "createdAt:desc",
            pagination: {
                start: 0,
                limit: 1
            }
        });
        let newCardNumber = parseInt(lastRecord.data[0].cardNumber) + 1;
        while (isCardNumberUsed) {
            const res = await strapi.find("loyalty-cards", {
                filters: {
                    cardNumber: newCardNumber.toString().padStart(6, "0")
                }
            });
            if (res.data?.length == 0) isCardNumberUsed = false;
            else newCardNumber += 1;
        }
        const startDate = new Date();

        // Calculate the expiry date as 365 days from the start date
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + 365);
        createDBEntry("loyalty-cards", {
            cardNumber: newCardNumber.toString().padStart(6, "0"),
            name,
            country: country.id,
            user: profile.id,
            startDate,
            expiryDate
        }).then((response) => router.push("/success"));
    };

    useEffect(() => {
        if (profile?.fullName) {
            setName(profile.fullName);
        }
    }, [profile]);

    useEffect(() => {
        getCountries().then((response) => setCountryList(response));
    }, []);
    return (
        <>
            <PostcardModal
                isShow={showSubscribeModal}
                headerText="SUBSCRIBE"
                children={
                    <>
                        <FormControl
                            id="name"
                            isRequired
                            display={"flex"}
                            mt="5"
                            flexDirection={"row"}
                        >
                            <FormLabel width="50%">Name</FormLabel>
                            <Input
                                placeholder="Enter your Name"
                                bg={"white"}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl
                            id="contact"
                            isRequired
                            mt={4}
                            display={"flex"}
                            flexDirection={"row"}
                        >
                            <FormLabel width="50%">Contact</FormLabel>
                            <Input
                                placeholder="Enter your Contact"
                                bg={"white"}
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                isInvalid={
                                    !/^\d{10}$/.test(contact) &&
                                    contact.length > 0
                                }
                            />
                        </FormControl>

                        <FormControl
                            id="country"
                            isRequired
                            mt={4}
                            display={"flex"}
                            flexDirection={"row"}
                        >
                            <FormLabel width="50%">Country</FormLabel>
                            {/* <Input
                                placeholder="Enter your Country"
                                bg={"white"}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            /> */}
                            <AutoCompleteField
                                component={{
                                    label: "country",
                                    isVisible: true,
                                    name: "Country",
                                    fieldStyle: {
                                        bg: "white",
                                        borderColor: "white",
                                        _focusVisible: {
                                            borderColor: "#BFBFBF"
                                        }
                                    },
                                    placeholder: "Select Country",
                                    options: countryList,
                                    optionType: "object",
                                    displayKey: "name",
                                    valueKey: "id",

                                    onChange: (e) => {},
                                    onSelectOption: (e) => {}
                                }}
                                value={country}
                                onChange={(e) => {
                                    setCountry(e);
                                }}
                            />
                        </FormControl>
                        <Flex
                            alignItems={"center"}
                            justifyContent={"center"}
                            my={5}
                            mt={20}
                        >
                            <Button
                                onClick={handleSubscribe}
                                isDisabled={!name || !country || !contact}
                            >
                                Confirm
                            </Button>
                        </Flex>
                    </>
                }
                size="xl"
                style={{ minHeight: "60%" }}
                handleClose={() => {
                    setShowSubscribeModal(false);
                    setName("");
                    setCountry(null);
                    setContact("");
                }}
            />
            {profile && (
                <>
                    <Text
                        fontWeight={700}
                        fontSize={30}
                        fontFamily="raleway"
                        color="primary_1"
                        mb={10}
                    >
                        $250/year
                    </Text>
                    <Button
                        mt={["-10", "-16"]}
                        onClick={() => setShowSubscribeModal(true)}
                    >
                        SUBSCRIBE
                    </Button>

                    {/* Testimonials */}
                    <Text
                        fontWeight={700}
                        fontSize={25}
                        fontFamily="raleway"
                        color="primary_1"
                        mt={12}
                    >
                        Testimonials
                    </Text>

                    <Flex
                        overflowX="auto"
                        gap="30px"
                        width={["100%", "100%", "70%", "70%"]}
                        px={"auto"}
                        py={12}
                        mx={30}
                        justifyContent={"flex-start"}
                        className="no-scrollbar"
                    >
                        <Flex
                            flexDirection={"column"}
                            border={"1px"}
                            borderColor={"primary_1"}
                            borderRadius={"xl"}
                            alignItems={"center"}
                            minWidth={"250"}
                            maxWidth={"250"}
                            position={"relative"}
                            py={10}
                        >
                            <Box
                                display="inline-block"
                                borderWidth="1px"
                                borderColor="primary_1"
                                borderRadius="full"
                                mt={["-7", "-10"]}
                                // overflow="hidden"
                                zIndex={2}
                                position={"absolute"}
                                top={0}
                            >
                                <Avatar
                                    alt="profile-pic"
                                    size={["md", "lg"]}
                                    src="/assets/no-avatar.png"
                                />
                            </Box>
                            <Text
                                fontWeight={700}
                                fontSize={20}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                textAlign={"center"}
                            >
                                Aniket Pawar
                            </Text>
                            <Text
                                fontWeight={500}
                                fontSize={15}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                padding={5}
                                whiteSpace="normal"
                                mx={2}
                            >
                                Intro note: Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Integer consectetur
                                neque mauris, sit amet convallis ipsum cursus
                            </Text>
                        </Flex>

                        <Flex
                            flexDirection={"column"}
                            border={"1px"}
                            borderColor={"primary_1"}
                            borderRadius={"xl"}
                            alignItems={"center"}
                            minWidth={"250"}
                            maxWidth={"250"}
                            position={"relative"}
                            py={10}
                        >
                            <Box
                                display="inline-block"
                                borderWidth="1px"
                                borderColor="primary_1"
                                borderRadius="full"
                                mt={["-7", "-10"]}
                                // overflow="hidden"
                                zIndex={2}
                                position={"absolute"}
                                top={0}
                            >
                                <Avatar
                                    alt="profile-pic"
                                    size={["md", "lg"]}
                                    src="/assets/no-avatar.png"
                                />
                            </Box>
                            <Text
                                fontWeight={700}
                                fontSize={20}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                textAlign={"center"}
                            >
                                Aniket Pawar
                            </Text>
                            <Text
                                fontWeight={500}
                                fontSize={15}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                padding={5}
                                whiteSpace="normal"
                                mx={2}
                            >
                                Intro note: Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Integer consectetur
                                neque mauris, sit amet convallis ipsum cursus
                            </Text>
                        </Flex>

                        <Flex
                            flexDirection={"column"}
                            border={"1px"}
                            borderColor={"primary_1"}
                            borderRadius={"xl"}
                            alignItems={"center"}
                            minWidth={"250"}
                            maxWidth={"250"}
                            position={"relative"}
                            py={10}
                        >
                            <Box
                                display="inline-block"
                                borderWidth="1px"
                                borderColor="primary_1"
                                borderRadius="full"
                                mt={["-7", "-10"]}
                                // overflow="hidden"
                                zIndex={2}
                                position={"absolute"}
                                top={0}
                            >
                                <Avatar
                                    alt="profile-pic"
                                    size={["md", "lg"]}
                                    src="/assets/no-avatar.png"
                                />
                            </Box>
                            <Text
                                fontWeight={700}
                                fontSize={20}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                textAlign={"center"}
                            >
                                Aniket Pawar
                            </Text>
                            <Text
                                fontWeight={500}
                                fontSize={15}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                padding={5}
                                whiteSpace="normal"
                                mx={2}
                            >
                                Intro note: Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Integer consectetur
                                neque mauris, sit amet convallis ipsum cursus
                            </Text>
                        </Flex>

                        <Flex
                            flexDirection={"column"}
                            border={"1px"}
                            borderColor={"primary_1"}
                            borderRadius={"xl"}
                            alignItems={"center"}
                            minWidth={"250"}
                            maxWidth={"250"}
                            position={"relative"}
                            py={10}
                        >
                            <Box
                                display="inline-block"
                                borderWidth="1px"
                                borderColor="primary_1"
                                borderRadius="full"
                                mt={["-7", "-10"]}
                                // overflow="hidden"
                                zIndex={2}
                                position={"absolute"}
                                top={0}
                            >
                                <Avatar
                                    alt="profile-pic"
                                    size={["md", "lg"]}
                                    src="/assets/no-avatar.png"
                                />
                            </Box>
                            <Text
                                fontWeight={700}
                                fontSize={20}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                textAlign={"center"}
                            >
                                Aniket Pawar
                            </Text>
                            <Text
                                fontWeight={500}
                                fontSize={15}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                padding={5}
                                whiteSpace="normal"
                                mx={2}
                            >
                                Intro note: Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Integer consectetur
                                neque mauris, sit amet convallis ipsum cursus
                            </Text>
                        </Flex>

                        <Flex
                            flexDirection={"column"}
                            border={"1px"}
                            borderColor={"primary_1"}
                            borderRadius={"xl"}
                            alignItems={"center"}
                            minWidth={"250"}
                            maxWidth={"250"}
                            position={"relative"}
                            py={10}
                        >
                            <Box
                                display="inline-block"
                                borderWidth="1px"
                                borderColor="primary_1"
                                borderRadius="full"
                                mt={["-7", "-10"]}
                                // overflow="hidden"
                                zIndex={2}
                                position={"absolute"}
                                top={0}
                            >
                                <Avatar
                                    alt="profile-pic"
                                    size={["md", "lg"]}
                                    src="/assets/no-avatar.png"
                                />
                            </Box>
                            <Text
                                fontWeight={700}
                                fontSize={20}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                textAlign={"center"}
                            >
                                Aniket Pawar
                            </Text>
                            <Text
                                fontWeight={500}
                                fontSize={15}
                                fontFamily="raleway"
                                color="#5A5A5A"
                                padding={5}
                                whiteSpace="normal"
                                mx={2}
                            >
                                Intro note: Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Integer consectetur
                                neque mauris, sit amet convallis ipsum cursus
                            </Text>
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    );
};

export default Subscribe;
