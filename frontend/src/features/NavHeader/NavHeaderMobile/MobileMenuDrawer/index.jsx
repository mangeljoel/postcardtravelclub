import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerFooter,
    Divider,
    DrawerCloseButton,
    IconButton,
    useDisclosure,
    Box,
    Image,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Flex,
    Link
} from "@chakra-ui/react";
import { HamburgerIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

import AppFooter from "../../../AppFooter";
import PostcardModal from "../../../PostcardModal";
import AccordionSection from "../AccordionSection";
import { getProfileSlug } from "../../../../services/utilities";
import * as ga from "../../../../services/googleAnalytics";
import MyCircle from "../../../MyCircle";
import LoggedInSection from "../../NavHeaderDesktop/LoggedInSection";
import { useContext } from "react";
import AppContext from "../../../AppContext";

const MobileMenuDrawer = ({
    isOpen,
    onClose,
    isLoggedIn,
    itemClicked,
    NAV_ITEMS,
    onSignIn,
    fontcolor,
    profile
}) => {
    const router = useRouter();
    const btnRef = React.useRef();
    const { updateUser } = useContext(AppContext);
    const [showCircleModal, setshowCircleModal] = useState(false);
    const logo = "/assets/images/p_stamp_trans.png";

    useEffect(() => {
        const handleRouteChange = () => {
            onClose();
        };
        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
                size={"full"}
            >
                <DrawerOverlay />
                <DrawerContent bg="#1E1E1E">
                    <DrawerBody
                        style={{
                            pos: "relative",
                            padding: "0px"
                        }}
                        overflow="auto"
                        css={{
                            "&::-webkit-scrollbar": {
                                display: "none"
                            }
                        }}
                    >
                        <Box
                            width={"20vw"}
                            mt={"5%"}
                            ml={"5%"}
                            onClick={() => {
                                window.location.href = "/";
                                onClose()
                            }}
                        >
                            <Image
                                src={"/assets/postcard-logo-white.png"}
                                width={"100%"}
                                height={"100%"}
                                alt={"Postcard Logo"}
                            />
                        </Box>
                        <Box
                            width={"25px"}
                            position={"absolute"}
                            top={"3%"}
                            right={"5%"}
                            onClick={onClose}
                        >
                            <Image
                                src={"/assets/close-icon.svg"}
                                width={"100%"}
                                height={"100%"}
                                alt={"Close Icon"}
                            />
                        </Box>
                        <Box mt={"5%"}>
                            <Flex
                                flexDirection={"column"}
                                ml={"10%"}
                                justifyContent={"flex-start"}
                                background={"#1E1E1E"}
                                width={"100%"}
                                height={"100%"}
                                gap={"4%"}
                            >
                                <Box width={["220px", "400px", "600px"]}>
                                    {NAV_ITEMS.map((item, index) => (
                                        item.children ? (
                                            <Accordion key={index} allowToggle border="none">
                                                <AccordionItem border="none">
                                                    <AccordionButton
                                                        px={0}
                                                        py={"7.5%"}
                                                        _hover={{ bg: "transparent" }}
                                                    >
                                                        <Text
                                                            flex="1"
                                                            textAlign="left"
                                                            color="#EFE9E4"
                                                            fontFamily={"raleway"}
                                                            fontWeight={"semibold"}
                                                            fontSize={["20px", "32px", "40px"]}
                                                        >
                                                            {item.label}
                                                        </Text>
                                                        <ChevronDownIcon
                                                            color="#EFE9E4"
                                                            fontSize={["24px", "36px", "44px"]}
                                                        />
                                                    </AccordionButton>
                                                    <AccordionPanel px={0} py={0}>
                                                        {item.children.map((child, childIndex) => (
                                                            <Text
                                                                key={childIndex}
                                                                onClick={() => {
                                                                    if (router.pathname !== child.href) {
                                                                        router.push(child.href);
                                                                    }
                                                                    onClose();
                                                                }}
                                                                color="#EFE9E4"
                                                                fontFamily={"raleway"}
                                                                fontWeight={"normal"}
                                                                fontSize={["18px", "28px", "36px"]}
                                                                my={"5%"}
                                                                ml={"5%"}
                                                            >
                                                                {child.label}
                                                            </Text>
                                                        ))}
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            </Accordion>
                                        ) : item.label && item.href ? (
                                            <Text
                                                key={index}
                                                onClick={() => {
                                                    if (router.pathname !== item.href) {
                                                        router.push(item.href);
                                                    }
                                                    onClose();
                                                }}
                                                color="#EFE9E4"
                                                fontFamily={"raleway"}
                                                fontWeight={"semibold"}
                                                fontSize={["20px", "32px", "40px"]}
                                                my={"7.5%"}
                                            >
                                                {item.label}
                                            </Text>
                                        ) : null
                                    ))}
                                    <Text
                                        onClick={() => {
                                            router.push("/our-story");
                                            onClose();
                                        }}
                                        color="#EFE9E4"
                                        fontFamily={"raleway"}
                                        fontWeight={"semibold"}
                                        fontSize={["20px", "32px", "40px"]}
                                        my={"7.5%"}
                                    >
                                        Our Story
                                    </Text>
                                    {/* <Text
                                        onClick={() => {
                                            router.push("/champions-of-change");
                                            onClose();
                                        }}
                                        color="#EFE9E4"
                                        fontFamily={"raleway"}
                                        fontWeight={"semibold"}
                                        fontSize={["20px", "32px", "40px"]}
                                        my={"7.5%"}
                                    >
                                        Partners
                                    </Text>
                                    <Text
                                        onClick={() => {
                                            router.push("/affiliations");
                                            onClose();
                                        }}
                                        color="#EFE9E4"
                                        fontFamily={"raleway"}
                                        fontWeight={"semibold"}
                                        fontSize={["20px", "32px", "40px"]}
                                        my={"7.5%"}
                                    >
                                        Affiliations
                                    </Text> */}
                                </Box>

                                <Box width={["220px", "400px", "600px"]}>
                                    <LoggedInSection
                                        isLoggedIn={isLoggedIn}
                                        onClick={onSignIn}
                                        NAV_ITEMS={NAV_ITEMS}
                                        updateUser={updateUser}
                                        fontcolor={fontcolor}
                                        profile={profile}
                                        router={router}
                                        itemClicked={itemClicked}
                                        orientation={"column"}
                                        drawerClose={onClose}
                                    />
                                </Box>
                            </Flex>
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <PostcardModal
                isShow={showCircleModal}
                headerText={"My Circle"}
                children={
                    <MyCircle onClose={() => setshowCircleModal(false)} />
                }
                handleClose={() => setshowCircleModal(false)}
                style={{ padding: "20px", width: "100%" }}
                size={"xl"}
            />
        </>
    );
};

export default MobileMenuDrawer;