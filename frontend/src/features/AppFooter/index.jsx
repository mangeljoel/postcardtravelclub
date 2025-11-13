import { useContext, useState, useEffect } from "react";
import {
    root,
    headerClick,
    icons_layout,
    mobile_layout,
    drawer
} from "./index.module.scss";
import { Box, Text, Flex, Image, Link, Button } from "@chakra-ui/react";
import AppContext from "../AppContext";
import { ChakraNextImage } from "../../patterns/ChakraNextImage";
const AppFooter = ({ isDrawer, style }) => {
    const logo = "/assets/images/p_stamp_trans.png";

    return (
        <Flex
            pos="relative"
            id="AppFooter"
            mb={0}
            width={"100%"}
            bg={"primary_3"}
            color={"#EFE9E4"}
            // minHeight={"337px"}
            pl={{ base: "13.33vw", sm: "5vw" }}
            pr={{ base: "0", sm: "5vw" }}
            pt={["7.78vw", "4.5vw"]}
            pb={["3.33vw", "4.8vw"]}
            flexDirection={{ base: "column", sm: "row" }}
        >
            <Box
                width={["31.9vw", "11vw"]}
                height={["29.1vw", "10vw"]}
                mt={[0, "-1.11vw"]}
                ml={["-6.67vw", 0]}
            >
                <ChakraNextImage
                    loading="lazy"
                    objectFit={"contain"}
                    width={"100%"}
                    height={"100%"}
                    src={logo}
                    alt="logo"
                />
            </Box>

            {/* Desktop */}
            <Flex display={{ base: "none", sm: "flex" }} ml={"2.43vw"}>
                <Flex flexDirection={"column"}>
                    <Text
                        fontSize={"2vw"}
                        fontFamily={"lora"}
                        fontStyle={"italic"}
                        fontWeight={500}
                        lineHeight={"2.9vw"}
                        w={"30.44vw"}
                    >
                        Collect Postcards.<br /> Make Memories.

                    </Text>

                    <Text
                        mt={"3.26vw"}
                        w={"21.11vw"}
                        fontFamily={"raleway"}
                        fontSize={"1.11vw"}
                        lineHeight={"1.67vw"}
                    >
                        Copyright 2022 Starlife Idea Lab Pvt. Ltd. All rights
                        reserved.
                    </Text>
                </Flex>

                <Flex ml={"1.04vw"} flexDirection={"column"} alignItems={"center"}>
                    <Flex gap={"0.608vw"}>
                        {/* <Box
                            as={Link}
                            href="https://pin.it/3Eq83L2"
                            target="_blank"
                            w={"3.33vw"}
                            h={"3.33vw"}
                        >
                            <ChakraNextImage
                                src={"/assets/footer/pinterest.png"}
                                objectFit={"cover"}
                                w={"100%"}
                                h={"100%"}
                                alt={"pinterest logo"}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Box> */}
                        <Box
                            as={Link}
                            href="https://www.linkedin.com/company/postcardtravelclub"
                            target="_blank"
                            w={"3.33vw"}
                            h={"3.33vw"}
                        >
                            <ChakraNextImage
                                src={"/assets/footer/linkedin.png"}
                                objectFit={"cover"}
                                w={"100%"}
                                h={"100%"}
                                alt={"linkedin logo"}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Box>
                        <Box
                            as={Link}
                            href="https://www.instagram.com/postcardtravelclub/"
                            target="_blank"
                            w={"3.33vw"}
                            h={"3.33vw"}
                        >
                            <ChakraNextImage
                                src={"/assets/footer/instagram.png"}
                                objectFit={"cover"}
                                w={"100%"}
                                h={"100%"}
                                alt={"instagram logo"}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Box>
                        <Box
                            as={Link}
                            href="https://facebook.com/postcardtravelclub/"
                            target="_blank"
                            w={"3.33vw"}
                            h={"3.33vw"}
                        >
                            <ChakraNextImage
                                src={"/assets/footer/facebook.png"}
                                objectFit={"cover"}
                                w={"100%"}
                                h={"100%"}
                                alt={"facebook logo"}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Box>
                        {/* <Box
                            as={Link}
                            href="https://whatsapp.com/channel/0029Vak5BjzB4hdXcaq7Bl3k"
                            target="_blank"
                            w={"3.33vw"}
                            h={"3.33vw"}
                        >
                            <ChakraNextImage
                                src={"/assets/footer/whatsapp.png"}
                                objectFit={"cover"}
                                w={"100%"}
                                h={"100%"}
                                alt={"whatsapp logo"}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Box> */}
                        <Box
                            as={Link}
                            href="https://blog.postcard.travel/"
                            target="_blank"
                            w={"3.33vw"}
                            h={"3.33vw"}
                        >
                            <ChakraNextImage
                                src={"/assets/footer/substack.png"}
                                objectFit={"cover"}
                                w={"100%"}
                                h={"100%"}
                                alt={"substack logo"}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Box>
                        <Box
                            as={Link}
                            href="https://open.spotify.com/show/6RoF77zymjRRsv95fiOYoP?si=RwILcO9oQR6KmQlK-fqY8g&nd=1&dlsi=6e11f73d73b941cf"
                            target="_blank"
                            w={"3.33vw"}
                            h={"3.33vw"}
                        >
                            <ChakraNextImage
                                src={"/assets/footer/spotify.png"}
                                objectFit={"cover"}
                                w={"100%"}
                                h={"100%"}
                                alt={"spotify logo"}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Box>
                    </Flex>

                    <Button
                        as={Link}
                        href="https://blog.postcard.travel"
                        target="_blank"
                        mt={"4.167vw"}
                        variant={"none"}
                        p={0}
                        textAlign={"center"}
                        w={"27.5vw"}
                        h={"3.47vw"}
                        borderWidth={"3px"}
                        borderRadius={"2.78vw"}
                        fontFamily={"raleway"}
                        fontSize={"1.46vw"}
                        lineHeight={"1.87vw"}
                        _hover={{ bg: "#EFE9E4", color: "primary_3" }}
                    >
                        Subscribe to the Newsletter
                    </Button>
                </Flex>

                <Flex flexDirection={"column"} ml={"6.5vw"}>
                    <Flex
                        flexDirection={"column"}
                        fontFamily={"raleway"}
                        gap={"1.94vw"}
                    >
                        <Flex flexDirection={"column"} gap={"0.97vw"}>
                            <a
                                rel="noopener noreferrer"
                                href="/our-story"
                                target="_blank"
                            >
                                <Text
                                    fontWeight={"bold"}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.87vw"}
                                >
                                    Our Story
                                </Text>
                            </a>
                            <a
                                rel="noopener noreferrer"
                                href="/concierge"
                                target="_blank"
                            >
                                <Text
                                    fontWeight={"bold"}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.87vw"}
                                >
                                    Travel Concierge
                                </Text>
                            </a>
                            <a
                                rel="noopener noreferrer"
                                href="https://open.spotify.com/show/6RoF77zymjRRsv95fiOYoP?si=RwILcO9oQR6KmQlK-fqY8g&nd=1&dlsi=6e11f73d73b941cf"
                                target="_blank"
                            >
                                <Text
                                    fontWeight={"bold"}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.87vw"}
                                >
                                    Podcast
                                </Text>
                            </a>
                            {/* <a
                                rel="noopener noreferrer"
                                href="/champions-of-change"
                                target="_blank"
                            >
                                <Text
                                    fontWeight={"bold"}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.87vw"}
                                >
                                    Partners
                                </Text>
                            </a>
                            <a
                                rel="noopener noreferrer"
                                href="/affiliations"
                                target="_blank"
                            >
                                <Text
                                    fontWeight={"bold"}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.87vw"}
                                >
                                    Affiliations
                                </Text>
                            </a> */}
                            {/* <a
                                rel="noopener noreferrer"
                                href="https://blog.postcard.travel"
                                target="_blank"
                            >
                                <Text
                                    fontWeight={"bold"}
                                    fontSize={"1.46vw"}
                                    lineHeight={"1.87vw"}
                                >
                                    Newsletter
                                </Text>
                            </a> */}
                        </Flex>
                        <Flex flexDirection={"column"} gap={"0.97vw"}>
                            <a rel="noopener noreferrer" href="/privacy">
                                <Text
                                    fontWeight={400}
                                    textDecoration={"underline"}
                                    fontSize={"1.11vw"}
                                    lineHeight={"1.67vw"}
                                >
                                    Privacy
                                </Text>
                            </a>
                            <a
                                rel="noopener noreferrer"
                                href="/terms-conditions"
                            >
                                <Text
                                    fontWeight={400}
                                    textDecoration={"underline"}
                                    fontSize={"1.11vw"}
                                    lineHeight={"1.67vw"}
                                >
                                    Terms & Conditions
                                </Text>
                            </a>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>

            {/* Mobile */}
            <Flex
                display={{ base: "flex", sm: "none" }}
                flexDirection={"column"}
                mt={"3.33vw"}
            // pl={"13.33vw"}
            >
                <Text
                    fontSize={"4.8vw"}
                    fontFamily={"raleway"}
                    fontWeight={500}
                    lineHeight={"1.3"}
                    w={"100%"}
                >
                    Collect Postcards. Make Memories.                </Text>

                <Flex
                    // flexDirection={"column"}
                    w={"80%"}
                    justifyContent={"space-between"}
                    gap={"1.39vw"}
                    mt={"4.44vw"}
                    fontFamily={"raleway"}
                >
                    <a
                        rel="noopener noreferrer"
                        href="/our-story"
                        target="_blank"
                    >
                        <Text
                            fontWeight={"bold"}
                            fontSize={"2.9vw"}
                            lineHeight={"5vw"}
                        >
                            Our Story
                        </Text>
                    </a>
                    <a
                        rel="noopener noreferrer"
                        href="/concierge"
                        target="_blank"
                    >
                        <Text
                            fontWeight={"bold"}
                            fontSize={"2.9vw"}
                            lineHeight={"5vw"}
                        >
                            Travel Concierge
                        </Text>
                    </a>
                    <a
                        rel="noopener noreferrer"
                        href="https://open.spotify.com/show/6RoF77zymjRRsv95fiOYoP?si=RwILcO9oQR6KmQlK-fqY8g&nd=1&dlsi=6e11f73d73b941cf"
                        target="_blank"
                    >
                        <Text
                            fontWeight={"bold"}
                            fontSize={"2.9vw"}
                            lineHeight={"5vw"}
                        >
                            Podcast
                        </Text>
                    </a>
                    {/* <a
                        rel="noopener noreferrer"
                        href="/champions-of-change"
                        target="_blank"
                    >
                        <Text
                            fontWeight={"bold"}
                            fontSize={"2.9vw"}
                            lineHeight={"5vw"}
                        >
                            Partners
                        </Text>
                    </a>
                    <a
                        rel="noopener noreferrer"
                        href="/affiliations"
                        target="_blank"
                    >
                        <Text
                            fontWeight={"bold"}
                            fontSize={"2.9vw"}
                            lineHeight={"5vw"}
                        >
                            Affiliations
                        </Text>
                    </a> */}
                </Flex>

                <Button
                    as={Link}
                    href="https://blog.postcard.travel"
                    target="_blank"
                    mt={"4.44vw"}
                    variant={"none"}
                    p={0}
                    textAlign={"center"}
                    w={"47.5vw"}
                    h={"6.944vw"}
                    borderWidth={"2px"}
                    borderRadius={"6.25vw"}
                    fontFamily={"raleway"}
                    fontSize={"2.9vw"}
                    lineHeight={"4.167vw"}
                    _hover={{ bg: "#EFE9E4", color: "primary_3" }}
                >
                    Subscribe to the Newsletter
                </Button>

                <Flex gap={"2.78vw"} mt={"7.5vw"} fontFamily={"raleway"}>
                    {/* <Box
                        as={Link}
                        href="https://pin.it/3Eq83L2"
                        target="_blank"
                        w={"6.9vw"}
                        h={"6.9vw"}
                    >
                        <ChakraNextImage
                            src={"/assets/footer/pinterest.png"}
                            objectFit={"cover"}
                            w={"100%"}
                            h={"100%"}
                            alt={"pinterest logo"}
                        />
                    </Box> */}
                    <Box
                        as={Link}
                        href="https://www.linkedin.com/company/postcardtravelclub"
                        target="_blank"
                        w={"6.9vw"}
                        h={"6.9vw"}
                    >
                        <ChakraNextImage
                            src={"/assets/footer/linkedin.png"}
                            objectFit={"cover"}
                            w={"100%"}
                            h={"100%"}
                            alt={"linkedin logo"}
                        />
                    </Box>
                    <Box
                        as={Link}
                        href="https://www.instagram.com/postcardtravelclub/"
                        target="_blank"
                        w={"6.9vw"}
                        h={"6.9vw"}
                    >
                        <ChakraNextImage
                            src={"/assets/footer/instagram.png"}
                            objectFit={"cover"}
                            w={"100%"}
                            h={"100%"}
                            alt={"instagram logo"}
                        />
                    </Box>
                    <Box
                        as={Link}
                        href="https://facebook.com/postcardtravelclub/"
                        target="_blank"
                        w={"6.9vw"}
                        h={"6.9vw"}
                    >
                        <ChakraNextImage
                            src={"/assets/footer/facebook.png"}
                            objectFit={"cover"}
                            w={"100%"}
                            h={"100%"}
                            alt={"facebook logo"}
                        />
                    </Box>
                    {/* <Box
                        as={Link}
                        href="https://whatsapp.com/channel/0029Vak5BjzB4hdXcaq7Bl3k"
                        target="_blank"
                        w={"6.9vw"}
                        h={"6.9vw"}
                    >
                        <ChakraNextImage
                            src={"/assets/footer/whatsapp.png"}
                            objectFit={"cover"}
                            w={"100%"}
                            h={"100%"}
                            alt={"whatsapp logo"}
                        />
                    </Box> */}
                    <Box
                        as={Link}
                        href="https://blog.postcard.travel/"
                        target="_blank"
                        w={"6.9vw"}
                        h={"6.9vw"}
                    >
                        <ChakraNextImage
                            src={"/assets/footer/substack.png"}
                            objectFit={"cover"}
                            w={"100%"}
                            h={"100%"}
                            alt={"substack logo"}
                        />
                    </Box>
                    <Box
                        as={Link}
                        href="https://open.spotify.com/show/6RoF77zymjRRsv95fiOYoP?si=RwILcO9oQR6KmQlK-fqY8g&nd=1&dlsi=6e11f73d73b941cf"
                        target="_blank"
                        w={"6.9vw"}
                        h={"6.9vw"}
                    >
                        <ChakraNextImage
                            src={"/assets/footer/spotify.png"}
                            objectFit={"cover"}
                            w={"100%"}
                            h={"100%"}
                            alt={"spotify logo"}
                        />
                    </Box>
                </Flex>

                <Flex mt={"7.5vw"} gap={"3.61vw"} fontFamily={"raleway"}>
                    <a rel="noopener noreferrer" href="/terms-conditions">
                        <Text
                            fontWeight={400}
                            textDecoration={"underline"}
                            fontSize={"2.22vw"}
                            lineHeight={"2.78vw"}
                        >
                            Terms & Conditions
                        </Text>
                    </a>
                    <a rel="noopener noreferrer" href="/privacy">
                        <Text
                            fontWeight={400}
                            textDecoration={"underline"}
                            fontSize={"2.22vw"}
                            lineHeight={"2.78vw"}
                        >
                            Privacy
                        </Text>
                    </a>
                </Flex>

                <Text
                    mt={"1.542vw"}
                    fontFamily={"raleway"}
                    fontSize={"2.22vw"}
                    lineHeight={"3.056vw"}
                >
                    Copyright 2022 Starlife Idea Lab Pvt. Ltd. All rights
                    reserved.
                </Text>
            </Flex>
        </Flex>
    );
};

export default AppFooter;
