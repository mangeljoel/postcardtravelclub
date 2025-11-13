import React, { useState, useEffect } from "react";
import {
    Stack,
    Button,
    Flex,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Image,
    Text,
    Icon
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { loggedin_menu_account } from "../index.module.scss";
import { useRouter } from "next/router";
import { ChakraNextImage } from "../../../../patterns/ChakraNextImage";

const LoggedInSection = ({
    isLoggedIn,
    onClick,
    updateUser,
    profile,
    fontcolor,
    NAV_ITEMS,
    orientation,
    itemClicked,
    drawerClose
}) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleSignIn = async () => {
            // await updateUser();
            setIsSignedIn(true);
        };

        handleSignIn();
    }, []);

    if (!isLoggedIn) {
        if (orientation == "row") {
            return (
                <Stack
                    // flex={{ base: 1, md: 0 }}
                    justify={"flex-end"}
                    direction={"row"}
                    // width="50vw"
                    w={"auto"}
                    alignItems={"end"}
                    spacing={6}
                >
                    <Button
                        as={"a"}
                        fontSize={["8px", "12px", "16px", "20px"]}
                        color={fontcolor}
                        fontFamily={"raleway"}
                        fontWeight={"semibold"}
                        variant={"link"}
                        alignItems={"end!important"}
                        href={"#"}
                        onClick={() => {
                            onClick("login");
                            if (drawerClose) drawerClose();
                        }}
                    >
                        Sign In
                    </Button>
                    <Button
                        as={"a"}
                        display={{ base: "none", sm: "inline-flex" }}
                        borderRadius={"20px"}
                        fontSize={["8px", "12px", "16px", "21px"]}
                        fontFamily={"raleway"}
                        fontWeight={600}
                        color={"white"}
                        bg="#EA6146"
                        href={"#"}
                        _hover={{
                            bg: "#111111"
                        }}
                        onClick={() => {
                            if (drawerClose) drawerClose();
                            onClick("signup");
                        }}
                    >
                        Become a Member
                    </Button>
                </Stack>
            );
        } else {
            return (
                <Stack mt={4}>
                    <Button
                        borderRadius={"30px"}
                        bg={"#EA6146!important"}
                        // py={["10px", "30px"]}
                        _hover={{
                            transform: "scale(1.1)"
                        }}
                        onClick={() => {
                            if (drawerClose) drawerClose();
                            onClick("signup");
                        }}
                    >
                        <Text
                            color="#EFE9E4"
                            fontFamily={"raleway"}
                            fontWeight={"semibold"}
                            fontSize={["20px", "32px", "40px"]}
                            my={"5%"}
                        >
                            Become a Member!
                        </Text>
                    </Button>
                    <Text
                        onClick={() => {
                            if (drawerClose) drawerClose();
                            onClick("login");
                        }}
                        cursor={"pointer"}
                        color="#EFE9E4"
                        fontFamily={"raleway"}
                        fontWeight={"semibold"}
                        fontSize={["20px", "32px", "40px"]}
                        my={"5%"}
                    >
                        Sign in
                    </Text>
                </Stack>
            );
        }
        // return (
        //     <Stack
        //         flex={{ base: 1, md: 0 }}
        //         justify={"flex-end"}
        //         direction={"row"}
        //         width="50vw"
        //         alignItems={"end"}
        //         spacing={6}
        //     >
        //         <Button
        //             as={"a"}
        //             fontSize={["8px", "12px", "16px", "20px"]}
        //             color={fontcolor}
        //             fontFamily={"raleway"}
        //             fontWeight={"semibold"}
        //             variant={"link"}
        //             // alignItems={"end!important"}
        //             href={"#"}
        //             onClick={() => onClick("login")}
        //         >
        //             Sign In
        //         </Button>
        //         <Button
        //             as={"a"}
        //             display={{ base: "none", md: "inline-flex" }}
        //             borderRadius={"20px"}
        //             fontSize={["8px", "12px", "16px", "20px"]}
        //             fontFamily={"raleway"}
        //             fontWeight={"semibold"}
        //             color={"white"}
        //             bg="#EA6146"
        //             href={"#"}
        //             _hover={{
        //                 transform: "scale(1.1)"
        //             }}
        //             onClick={() => onClick("signup")}
        //         >
        //             Become a Member!
        //         </Button>
        //     </Stack>
        // );
    } else {
        if (orientation == "row") {
            return (
                <Flex gap={6}>
                    <Button
                        variant={"none"}
                        display={{ base: "none", sm: "inline-flex" }}
                        borderRadius={["4.167vw", "2.78vw"]}
                        h={["7.6vw", "2.8vw"]}
                        fontSize={["8px", "15px", "18px", "21px"]}
                        fontFamily={"raleway"}
                        fontWeight={600}
                        color={"white"}
                        bgColor="primary_1"
                        _hover={{
                            bg: "#111111"
                        }}
                        onClick={() => {
                            const targetRoute = `/${profile?.slug}`;
                            if (router.asPath !== targetRoute) {
                                router.push(targetRoute);
                            }
                        }}
                    >
                        My Travel Diary
                    </Button>
                    {/* <ChakraNextImage
                        borderRadius="full"
                        width="42px"
                        cursor="pointer"
                        height="42px"
                        //mr="1em"
                        objectFit="cover"
                        alt={"Profile Picture"}
                        onClick={(e) => {
                            // e.stopPropagation();
                            // if (
                            //     profile &&
                            //     profile.slug &&
                            //     profile.firstName &&
                            //     profile.firstName !== "" &&
                            //     profile.lastName &&
                            //     profile.lastName !== ""
                            // ) {
                            router.push(`/${profile?.slug}`);
                            // } else router.push("/edit-profile");
                        }}
                        src={
                            profile?.profilePic?.url
                                ? profile?.profilePic?.url
                                : profile?.profilePicURL ? profile?.profilePicURL : "/assets/default-profile-pic.png"
                        }
                        fallbackImg={"/assets/default-profile-pic.png"}
                    /> */}
                    {/* <Icon as={HamburgerIcon} width={"5em"} color={"primary_3"} /> */}
                    <Popover trigger={"hover"} >
                        <PopoverTrigger onOpen={() => updateUser()}>
                            {/* <Button
                                padding="0px"
                                variant="success"
                                _hover={{
                                    span: { transform: `scale(1.1)` }
                                }}
                            //borderWidth="2px"
                            // borderColor="white"
                            //bg="primary_1"
                            // color="white"
                            // borderRadius="10px"
                            >
                                <ChevronDownIcon
                                    w={8}
                                    h={8}
                                    bg="transparent"
                                    color="primary_1"
                                />
                            </Button> */}
                            <Icon as={HamburgerIcon} width={"2em"} height={"2em"} color={"primary_1"} />
                        </PopoverTrigger>
                        <PopoverContent
                            className={loggedin_menu_account}
                            backgroundColor="primary_1"
                            color="white"
                            p={3}
                            m={3}
                            _hover={{ transform: `scale(0.0)` }}
                            w="220px"
                        >
                            {isLoggedIn && (
                                <>
                                    {NAV_ITEMS.map(
                                        (navItem) =>
                                            navItem.primary &&
                                            navItem.primary.map(
                                                (buttonProps, index) => (
                                                    <Button
                                                        key={index}
                                                        color="white"
                                                        fontStyle="normal"
                                                        fontSize="14px"
                                                        fontFamily="raleway"
                                                        background="transparent"
                                                        _focus={{
                                                            background:
                                                                "transparent"
                                                        }}
                                                        _hover={{
                                                            transform: `scale(1.1)`,
                                                            background:
                                                                "transparent"
                                                        }}
                                                        fontWeight="bold"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            buttonProps.onClick();
                                                        }}
                                                        {...buttonProps}
                                                    >
                                                        {buttonProps.label}{" "}
                                                    </Button>
                                                )
                                            )
                                    )}
                                </>
                            )}
                        </PopoverContent>
                    </Popover>
                </Flex>
            );
        } else {
            return (
                <>
                    {/* <Text
                        color="#EFE9E4"
                        fontFamily={"raleway"}
                        fontWeight={"semibold"}
                        fontSize={[
                            "20px",
                            "32px",
                            "40px"
                        ]}
                        my={"7.5%"}
                        onClick={() => {
                            const targetRoute = `/${profile?.slug}`;
                            if (router.asPath !== targetRoute) {
                                router.push(targetRoute);
                            }
                            drawerClose()
                        }}
                    >
                        My Travel Diary
                    </Text> */}
                    <Button
                        borderRadius={"30px"}
                        bg={"#EA6146!important"}
                        py={["10px", "30px"]}
                        _hover={{
                            transform: "scale(1.1)"
                        }}
                    >
                        <Text
                            color="#EFE9E4"
                            fontFamily={"raleway"}
                            fontWeight={"semibold"}
                            fontSize={["20px", "32px", "40px"]}
                            my={"5%"}
                            onClick={() => {
                                const targetRoute = `/${profile?.slug}`;
                                if (router.asPath !== targetRoute) {
                                    router.push(targetRoute);
                                }
                                drawerClose()
                            }}
                        >
                            My Travel Diary
                        </Text>
                    </Button>
                    {NAV_ITEMS.map(
                        (navItem) =>
                            navItem.primary &&
                            navItem.primary.map(
                                (
                                    buttonProps,
                                    index
                                ) => buttonProps?.label !== "Sign Out" && (
                                    <Text
                                        key={index}
                                        color="#EFE9E4"
                                        fontFamily={"raleway"}
                                        fontWeight={"semibold"}
                                        fontSize={[
                                            "20px",
                                            "32px",
                                            "40px"
                                        ]}
                                        my={"7.5%"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            buttonProps.onClick();
                                            drawerClose()
                                        }}
                                        {...buttonProps}
                                    >
                                        {buttonProps.label}
                                    </Text>
                                )
                            )
                    )}
                    <Text
                        color="#EFE9E4"
                        fontFamily={"raleway"}
                        fontWeight={"semibold"}
                        fontSize={[
                            "20px",
                            "32px",
                            "40px"
                        ]}
                        my={"7.5%"}
                        onClick={() => itemClicked("LOGOUT", "/")}
                    >
                        Sign out
                    </Text>
                    {/* <Button
                        borderRadius={"30px"}
                        bg={"#EA6146!important"}
                        py={["10px", "30px"]}
                        _hover={{
                            transform: "scale(1.1)"
                        }}
                    >
                        <Text
                            color="#EFE9E4"
                            fontFamily={"raleway"}
                            fontWeight={"semibold"}
                            fontSize={["20px", "32px", "40px"]}
                            my={"5%"}
                            onClick={() => itemClicked("LOGOUT", "/")}
                        >
                            Sign out
                        </Text>
                    </Button> */}
                </>
            );
        }
    }
};

export default LoggedInSection;
