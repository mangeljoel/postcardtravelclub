import { useContext, useState, useEffect } from "react";
import {
    root,
    headerClick,
    icons_layout,
    mobile_layout,
    drawer
} from "./index.module.scss";
import { Box, Text, Flex } from "@chakra-ui/react";
import Image from "next/image";
import AppContext from "../AppContext";
const AppFooter = ({ isDrawer, style }) => {
    const { isSubscribeToNewsLetterShown, isTabletOrMobile } =
        useContext(AppContext);

    const [renderClientSideComponent, setRenderClientSideComponent] =
        useState(false);
    const logo = "/assets/images/p_stamp_trans.png";
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setRenderClientSideComponent(true);
    }, []);

    return (
        <Box
            id="AppFooter"
            pl={isDrawer ? "5%" : "10%"}
            pr={isDrawer ? "3%" : "10%"}
            pb="0%"
            pt={isDrawer ? "3%" : ["10%", "3%"]}
            width={"100%"}
            className={`${root} ${isTabletOrMobile ? mobile_layout : ""} ${isDrawer ? drawer : ""
                }`}
            bg={"primary_3"}
            pos={"relative"}
            mx={["auto", "0px"]}
            mb={isDrawer ? "0px!important" : "auto"}
            bottom={0}
            alignItems={"center"}
        >
            {/* <Text
                color="white"
                fontStyle="normal"
                fontSize="14px"
                fontWeight="bold"
                letterSpacing={"0.5px"}
                fontFamily="raleway"
                mb={["2%", "1%"]}
            >
                Postcard stories
            </Text> */}

            {/* <a rel="noopener noreferrer" href="https://stories.postcard.travel">
                <Text
                    color="white"
                    fontStyle="normal"
                    fontSize="14px"
                    fontWeight="bold"
                    fontFamily="raleway"
                >
                    Our Magazine
                </Text>
            </a> */}
            {/* <a
                rel="noopener noreferrer"
                href="https://postcard.notion.site/Apply-to-Publish-87c9c85aa3c84a37bc24f17effe85d63"
            >
                <Text
                    color="white"
                    fontStyle="normal"
                    fontSize="18px"
                    fontFamily="raleway"
                >
                    Apply to publish
                </Text>
            </a> */}
            {/* <a
                rel="noopener noreferrer"
                href="https://www.notion.so/About-us-a6314a1cc70e48fca56d4f24b0ae5a5a"
            >
                <Label
                    size={isTabletOrMobile ? "md" : "lg"}
                    fontStyle="normal"
                    copy="Postcard for Travellers"
                    color="primary-5"
                    fontFamily="raleway"
                />
            </a>
            <a
                rel="noopener noreferrer"
                href="https://www.notion.so/getstarlife/Postcard-for-Travel-Storytellers-ab976e493be644bc9e79e363d0424862"
            >
                <Label
                    size={isTabletOrMobile ? "md" : "lg"}
                    fontStyle="normal"
                    copy="Postcard for Storytellers"
                    color="primary-5"
                    fontFamily="raleway"
                />
            </a>
            <a
                rel="noopener noreferrer"
                href="https://getstarlife.notion.site/Postcard-for-travel-boutique-brands-caabb9bcfa6046f597b56dfcb54ee6aa"
            >
                <Label
                    size={isTabletOrMobile ? "md" : "lg"}
                    fontStyle="normal"
                    copy="Postcard for travel boutique brands"
                    color="primary-5"
                    fontFamily="raleway"
                />
            </a> */}
            {/* <br />
            <br />
            <Label
                size={isTabletOrMobile ? "md" : "lg"}
                fontStyle="bold"
                copy="Postcard
        for Business"
                color="primary-8"
                fontFamily="raleway"
            />
            coming soon.. */}
            <Box mx={["auto"]} className={headerClick}>
                <Box
                    display={isDrawer ? "none" : "block"}
                    textAlign={["center", "left"]}
                    mx={["auto", "0px"]}
                    mt="2em"
                >
                    {" "}
                    <Image
                        loading="lazy"
                        objectFit={"contain"}
                        width={220}
                        height={80}
                        src={logo}
                        alt="logo"
                    />
                </Box>
                {/* <Text
                    color="white"
                    display={isDrawer ? "none" : "block"}
                    fontSize={"1.5rem"}
                    fontWeight="bold"
                    textAlign={"center"}
                    fontFamily="raleway"
                    width="100%"
                    mx="auto"
                >
                    TRAVEL CLUB
                </Text> */}
            </Box>
            <Box
                mx={["auto"]}
                textAlign={"center"}
                display={isDrawer ? "none" : "block"}
                mb={["30px", "50px"]}
                mt={["30px", "30px"]}
            >
                <Text
                    // mt={["3%", "1%"]}
                    color="white"
                    // ml={["1.5%", "0%"]}
                    fontSize={["1rem", "2rem"]}
                    fontWeight="bold"
                    // textAlign={["center", "left"]}
                    // mx={["auto", "0px"]}
                    fontFamily="raleway"
                    width="100%"
                >
                    A wonder-full world is waiting for you!
                </Text>
            </Box>
            <Flex
                textAlign={["center", "left"]}
                direction={["column", "row"]}
                mx={["auto", "0px"]}
                // mt={["5%", "4%"]}
                fontSize={"20px"}
                mb={["10%", "4%"]}
                className={icons_layout}
                display={isDrawer ? "none" : "flex"}
            >
                <a rel="noopener noreferrer" href="/our-story" target="_blank">
                    <Text color="white" fontWeight={"bold"}>
                        Our Story
                    </Text>
                </a>
                {/* <a
                    rel="noopener noreferrer"
                    href="/champions-of-change"
                    target="_blank"
                >
                    <Text color="white" fontWeight={"bold"}>
                        {" "}
                        Partners
                    </Text>
                </a> */}
                {/* <a
                    rel="noopener noreferrer"
                    href="/affiliations"
                    target="_blank"
                >
                    <Text color="white" fontWeight={"bold"}>
                        Affiliations
                    </Text>
                </a> */}
                <a
                    rel="noopener noreferrer"
                    href="https://blog.postcard.travel"
                    target="_blank"
                >
                    <Text color="white" fontWeight={"bold"}>
                        Newsletter
                    </Text>
                </a>
            </Flex>
            <Box
                textAlign={["center", "left"]}
                mx={["auto", "0px"]}
                // mt={["5%", "4%"]}
                display={isDrawer ? "none" : "flex"}
                mb={["5%", "4%"]}
                className={icons_layout}
            >
                {/* <a
                    rel="noopener noreferrer"
                    href="https://mobile.twitter.com/postcard2020"
                    target="_blank"
                >
                    <Image
                        width={["30px", "45px"]}
                        height={["30px", "45px"]}
                        objectFit="cover"
                        src={"/assets/social/twitter.png"}
                        alt="twitter"
                    />
                </a> */}
                <a
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/company/postcardtravelclub"
                    target="_blank"
                >
                    <Image
                        width={isTabletOrMobile ? 30 : 45}
                        height={isTabletOrMobile ? 30 : 45}
                        objectFit="cover"
                        src={"/assets/social/linkedin.png"}
                        alt="linkedin"
                    />
                </a>

                <a
                    rel="noopener noreferrer"
                    href="https://facebook.com/postcardtravelclub/"
                    target="_blank"
                >
                    <Image
                        width={isTabletOrMobile ? 30 : 45}
                        height={isTabletOrMobile ? 30 : 45}
                        objectFit="cover"
                        src={"/assets/social/facebook.png"}
                        alt="facebook"
                    />
                </a>
                <a
                    rel="noopener noreferrer"
                    href="https://www.instagram.com/postcardtravelclub/"
                    target="_blank"
                >
                    <Image
                        width={isTabletOrMobile ? 30 : 45}
                        height={isTabletOrMobile ? 30 : 45}
                        objectFit="cover"
                        src={"/assets/social/instagram.png"}
                        alt="insta"
                    />
                </a>
                <a
                    rel="noopener noreferrer"
                    href="https://pin.it/3Eq83L2"
                    target="_blank"
                >
                    <Image
                        width={isTabletOrMobile ? 30 : 45}
                        height={isTabletOrMobile ? 30 : 45}
                        objectFit="cover"
                        src={"/assets/social/pinterest.png"}
                        alt="pinterest"
                    />
                </a>
                {/*
                <a
                    rel="noopener noreferrer"
                    href="https://youtube.com/channel/UCqKPJ7D6qbo2v_f4gPH0piw"
                    target="_blank"
                >
                    <Image
                        width={isTabletOrMobile ? "30px" : "45px"}
                        height={isTabletOrMobile ? "30px" : "45px"}
                        objectFit="cover"
                        src={"/assets/social/youtube.png"}
                        alt=""
                    />
                </a> */}
            </Box>
            {/* <Link
                href={{
                    pathname: "/"
                }}
            >
                <div className={headerClick}>
                    <Image
                        loading="lazy"
                        width="100px"
                        height="40px"
                        src={logo}
                        alt="logo"
                    />
                </div>
            </Link>
            <br /> */}
            {/* <a rel="noopener noreferrer" href="https://bit.ly/postcardvision">
                <Text
                    color="white"
                    fontStyle="normal"
                    fontSize="18px"
                    fontFamily="raleway"
                >
                    Who we are
                </Text>
            </a> */}
            <Flex textAlign={"center"} mx={["auto", "0px"]} fontSize={"13px"}>
                <a rel="noopener noreferrer" href="/privacy">
                    <Text
                        color="white"
                        fontStyle="normal"
                        textDecor={"underline"}
                        size="sm"
                        fontFamily="raleway"
                    >
                        Privacy
                    </Text>
                </a>
                <Text color="white" fontStyle="normal" fontFamily="raleway">
                    &nbsp; and&nbsp;
                </Text>

                <a rel="noopener noreferrer" href="/terms-conditions">
                    <Text
                        color="white"
                        textDecor={"underline"}
                        fontStyle="normal"
                        fontFamily="raleway"
                    >
                        Terms & Conditions
                    </Text>
                </a>
            </Flex>
            <Text
                textAlign={["center", "left"]}
                mx={["auto", "0px"]}
                my="10px"
                color="white"
                fontSize={"13px"}
                fontStyle="normal"
                fontFamily="raleway"
            >
                Copyright 2022 Starlife Idea Lab Pvt. Ltd. All rights reserved.
            </Text>
        </Box>
    );
};

export default AppFooter;
