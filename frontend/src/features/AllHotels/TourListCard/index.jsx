import { useContext } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Img } from "@chakra-ui/react";
import AppContext from "../../AppContext";
const TourListCard = ({ data, onClick }) => {
    //  const router = useRouter();
    const { profile, isTabletOrMobile, tourBkmRefetch } =
        useContext(AppContext);
    return (
        <Box
            background="#ffffff"
            boxSizing="border-box"
            boxShadow="0px 2px 6px rgba(0, 0, 0, 0.16)"
            borderRadius="8px"
            textAlign={"left"}
            borderBottomWidth="6px"
            borderBottomColor="primary_3"
            width={"100%"}
            padding={["12px", "16px"]}
            pos="relative"
            cursor={"pointer"}
            onClick={onClick}
        >
            {isTabletOrMobile ? (
                <Box>
                    <Text
                        fontFamily="raleway"
                        color="primary_14"
                        fontSize={["18px", "21px"]}
                        textAlign={"left"}
                        fontWeight="bold"
                        width="90%"
                        lineHeight={"24px"}
                    >
                        {data.name || data.title}
                    </Text>
                    {(data.company || data.user || data.link) && (
                        <Text
                            color="primary_4"
                            fontSize={["12px", "1rem"]}
                            fontFamily="raleway"
                            fontWeight="bold"
                            // fontStyle="italic"
                            mt={["2%", "1%"]}
                        >
                            {data?.company
                                ? data?.company?.name
                                : data.user?.fullName
                                    ? data.user?.fullName
                                    : new URL(data.link)?.hostname}
                        </Text>
                    )}

                    <Flex
                        pos="relative"
                        height="100%"
                        width="100%"
                        mt={["6%", "3%"]}
                        direction={"row"}
                        justifyContent="space-between"
                    >
                        <Flex
                            direction="column"
                            w="100%"
                            pos="relative"
                            pr="3%"
                            height="100%"
                            justifyContent="space-between"
                        >
                            <Box>
                                {/* <Text
                            fontFamily="raleway"
                            color="primary_14"
                            fontSize={"18px"}
                            fontWeight="bold"
                            textAlign={"left"}
                            lineHeight={"24px"}
                        >
                            {data.name}
                        </Text> */}
                                <Text
                                    textAlign={"left"}
                                    fontWeight="normal"
                                    fontSize={["14px", "1rem"]}
                                    lineHeight="18px"
                                    fontFamily="raleway"
                                    color="primary_6"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                    noOfLines={["5", "3"]}
                                    mb="3%"
                                >
                                    {data.intro || data.description}
                                </Text>
                            </Box>
                        </Flex>

                        <Img
                            src={
                                data?.coverImage?.url ||
                                data.image ||
                                global.$defaultProfile
                            }
                            // fallbackSrc={global.$defaultProfile}
                            maxH="100%"
                            borderRadius="8px"
                            boxSize={["90px", "99px"]}
                            height="100%"
                            objectFit="cover"
                            layout={"fill"}
                            alt={"cover"}
                        ></Img>
                    </Flex>
                    {(data.pricesStartingAt ||
                        data.numberOfNights ||
                        data.country) && (
                            <Flex
                                width={["66%", "25%"]}
                                height="100%"
                                direction={"row"}
                                mt={["3%", "0%"]}
                                justifyContent={"space-between"}
                            >
                                {data.country && (
                                    <Text
                                        color="primary_3"
                                        fontSize={["12px", "1rem"]}
                                        fontFamily="raleway"
                                        fontWeight="bold"
                                    >
                                        {data.country.name}
                                    </Text>
                                )}
                                {data.pricesStartingAt && (
                                    <Text
                                        color="primary_3"
                                        fontSize={["12px", "1rem"]}
                                        fontFamily="raleway"
                                        fontWeight="bold"
                                    >
                                        {data.pricesStartingAt}
                                    </Text>
                                )}

                                {data.numberOfNights && (
                                    <Text
                                        color="primary_3"
                                        fontSize={["12px", "1rem"]}
                                        fontFamily="raleway"
                                        fontWeight="bold"
                                    >
                                        {data.numberOfNights}  {
                                            data.numberOfNights > 1
                                                ? "nights"
                                                : "night"
                                        }
                                    </Text>
                                )}
                            </Flex>
                        )}
                </Box>
            ) : (
                <Box>
                    <Flex justifyContent={"space-between"}>
                        <Box pr="3%">
                            <Text
                                fontFamily="raleway"
                                color="primary_14"
                                fontSize={["18px", "21px"]}
                                textAlign={"left"}
                                fontWeight="bold"
                                width="90%"
                                lineHeight={"24px"}
                            >
                                {data.name || data.title}
                            </Text>
                            {(data.company || data.user || data.link) && (
                                <Text
                                    color="primary_4"
                                    fontSize={["12px", "1rem"]}
                                    fontFamily="raleway"
                                    fontWeight="bold"
                                    // fontStyle="italic"
                                    width="90%"
                                    mt={["2%", "1%"]}
                                >
                                    {data?.company
                                        ? data?.company?.name
                                        : data.user?.fullName
                                            ? data.user?.fullName
                                            : new URL(data.link)?.hostname}
                                </Text>
                            )}
                            <Text
                                textAlign={"left"}
                                fontWeight="normal"
                                fontSize={["14px", "1rem"]}
                                lineHeight="18px"
                                fontFamily="raleway"
                                color="primary_6"
                                textOverflow="ellipsis"
                                overflow="hidden"
                                noOfLines={["5", "3"]}
                                mb="3%"
                                mt="3%"
                            >
                                {data.intro || data.description}
                            </Text>
                        </Box>
                        <Img
                            src={
                                data?.coverImage?.url ||
                                data.image ||
                                global.$defaultProfile
                            }
                            // fallbackSrc={global.$defaultProfile} // fallbacksrc is not an attribute of Img
                            maxH="100%"
                            borderRadius="8px"
                            boxSize={["90px", "150px"]}
                            height="100%"
                            objectFit="cover"
                            alt={"cover"}
                        ></Img>
                    </Flex>

                    {(data.pricesStartingAt ||
                        data.numberOfNights ||
                        data.country) && (
                            <Flex
                                width={["66%", "30%"]}
                                height="100%"
                                direction={"row"}
                                mt={["3%", "0%"]}
                                justifyContent={"space-between"}
                            >
                                {data.country && (
                                    <Text
                                        color="primary_3"
                                        fontSize={["12px", "1rem"]}
                                        fontFamily="raleway"
                                        fontWeight="bold"
                                    >
                                        {data.country.name}
                                    </Text>
                                )}
                                {data.pricesStartingAt && (
                                    <Text
                                        color="primary_3"
                                        fontSize={["12px", "1rem"]}
                                        fontFamily="raleway"
                                        fontWeight="bold"
                                    >
                                        {data.pricesStartingAt}
                                    </Text>
                                )}

                                {data.numberOfNights && (
                                    <Text
                                        color="primary_3"
                                        fontSize={["12px", "1rem"]}
                                        fontFamily="raleway"
                                        fontWeight="bold"
                                    >
                                        {data.numberOfNights} {
                                            data.numberOfNights > 1
                                                ? "nights"
                                                : "night"
                                        }
                                    </Text>
                                )}
                            </Flex>
                        )}
                </Box>
            )}
        </Box>
    );
};
export default TourListCard;
