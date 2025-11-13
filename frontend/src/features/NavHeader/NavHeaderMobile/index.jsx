import React, { useState, useRef } from "react";
import {
    Flex,
    Box,
    Image,
    Button,
    PopoverTrigger,
    Popover,
    PopoverContent,
    Icon,
    Text,
    IconButton,
    useDisclosure
} from "@chakra-ui/react";
import PostcardModal from "../../PostcardModal";
import { useRouter } from "next/router";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useSignupModal } from "../../SignupModalContext";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import { BsJournalBookmarkFill } from "react-icons/bs";

const NavHeaderMobile = ({
    onClick,
    isLoggedIn,
    NAV_ITEMS,
    itemClicked,
    profile,
    fontcolor
}) => {
    const logo = "/assets/new_ui/stamp.png";
    const [isSearchOpen, setSearchOpen] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { openLoginModal } = useSignupModal()
    const initRef = useRef();
    const router = useRouter();

    return (
        <>
            {!isSearchOpen && (
                <Flex
                    direction="row"
                    bg="transparent!important"
                    alignItems="space-between"
                    justifyContent="space-between"
                    py="16px"
                    px="10px"
                    boxSizing="border-box"
                    w="100%"
                >
                    <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        ml={0}
                        w="70%"
                    >
                        <Image
                            loading="lazy"
                            objectFit={"cover"}
                            layout="fill"
                            src={
                                fontcolor === "white"
                                    ? "/assets/images/p_stamp.png"
                                    : "/assets/images/p_stamp.png"
                            }
                            alt="logo"
                            w={"3.5em"}
                            onClick={() => router.push("/")}
                        />
                        <Text whiteSpace={"nowrap"} ml="1%" fontFamily={"raleway"}
                            fontSize={"14px"}
                            fontWeight={"bold"} color={fontcolor}>POSTCARD TRAVEL CLUB</Text>

                        <MobileMenuDrawer
                            isOpen={isOpen}
                            onClose={onClose}
                            isLoggedIn={isLoggedIn}
                            profile={profile}
                            fontcolor={fontcolor}
                            NAV_ITEMS={NAV_ITEMS}
                            itemClicked={itemClicked}
                            onSignIn={onClick}
                        ></MobileMenuDrawer>
                    </Flex>

                    <Flex justifyContent={"flex-end"} gap={3} alignItems={"center"}>
                        {!isLoggedIn && (
                            <Button
                                p="2vw"
                                h={["8vw", "3.4vw"]}
                                my={"auto"}
                                bg={"#EA6146!important"}
                                color="#EFE9E4"
                                fontFamily={"raleway"}
                                fontSize="14px"
                                borderRadius="30px"
                                onClick={openLoginModal}
                            >
                                Sign In
                            </Button>
                        )}

                        {isLoggedIn && profile?.slug && (
                            <Icon
                                as={BsJournalBookmarkFill}
                                width={"1.5em"}
                                height={"1.5em"}
                                color={"primary_1"}
                                cursor="pointer"
                                onClick={() => router.push(`/${profile.slug}`)}
                            />
                        )}

                        <Icon
                            as={HamburgerIcon}
                            width={"1.8em"}
                            height={"1.8em"}
                            color={"primary_1"}
                            cursor="pointer"
                            onClick={onOpen}
                        />
                    </Flex>

                </Flex>
            )}
            {isSearchOpen && (
                <>
                    <Flex
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        p="16px"
                        boxSizing="border-box"
                        w="100%"
                    >
                        <i
                            className="fa fa-close fa-2x"
                            style={{
                                color: "#EA6147",
                                marginTop: "5%",
                                marginBottom: "auto",
                                marginLeft: "5px"
                            }}
                            onClick={() => {
                                setSearchOpen(!isSearchOpen);
                            }}
                        />
                    </Flex>
                </>
            )}
        </>
    );
};

export default NavHeaderMobile;