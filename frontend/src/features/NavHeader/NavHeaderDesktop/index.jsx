import { Box, Flex, Image, Text, Link } from "@chakra-ui/react";
import AppContext from "../../AppContext";
import { useContext } from "react";
import { useRouter } from "next/router";
import DesktopItems from "./DesktopItems";
import { root } from "./index.module.scss";
import LoggedInSection from "./LoggedInSection";

function NavHeaderDesktop({
    onClick,
    isLoggedIn,
    NAV_ITEMS,
    fontcolor,
    itemClicked,
    profile
}) {
    const { updateUser } = useContext(AppContext);

    const router = useRouter();

    return (
        <Box width={"99vw"} pos="absolute" top={0} my={3}>
            <Flex
                justifyContent="space-between"
                alignItems={"center"}
                className={root}
                width={"100%"}
                bgColor={"transparent"}
                padding={"10px"}
            >
                <Flex
                    pos={"relative"}
                    as={Link}
                    href={isLoggedIn ? "/" : "/"}
                    alignItems={"center"}
                    width="28%"

                //height="40px"
                >
                    <Box pos={"relative"} ml={2} width="80px"
                        cursor="pointer">
                        <Image
                            loading="lazy"
                            objectFit={"contain"}
                            layout="fill"
                            w="100%"
                            height="100%"
                            m="auto"
                            src={
                                fontcolor === "white"
                                    ? "/assets/images/p_stamp.png"
                                    : "/assets/images/p_stamp.png"
                            }
                            alt="logo"
                        />
                    </Box>
                    <Text ml="2%" fontFamily={"raleway"}
                        fontSize={"1.3vw"}
                        fontWeight={"bold"} color={fontcolor}>POSTCARD TRAVEL CLUB</Text>
                </Flex>
                <Flex flex="1" alignItems="center" justifyContent="flex-start">
                    <DesktopItems NAV_ITEMS={NAV_ITEMS} fontcolor={fontcolor} />
                </Flex>

                <LoggedInSection
                    isLoggedIn={isLoggedIn}
                    onClick={onClick}
                    NAV_ITEMS={NAV_ITEMS}
                    updateUser={updateUser}
                    fontcolor={fontcolor}
                    profile={profile}
                    router={router}
                    itemClicked={itemClicked}
                    orientation={"row"}
                />
            </Flex>
        </Box>
    );
}

export default NavHeaderDesktop;
