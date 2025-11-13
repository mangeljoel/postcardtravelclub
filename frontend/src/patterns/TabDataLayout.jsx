import { AspectRatio, Box, IconButton, Link, Text } from "@chakra-ui/react";
import Image from "next/image";
import CountryFilter from "../features/AllTours/CountryFilter";
import TabsPart from "../features/TabsPart";
import LoadingGif from "./LoadingGif";
import { LinkIcon } from "@chakra-ui/icons";

const TabDataLayout = ({
    imageSrc,
    title,
    description,
    actionButtons,
    countryList,
    filterAlbums,
    pageLoading,
    affilLink,
    onTabChange,
    tabData
}) => {
    return (
        <Box
            pos="relative"
            mt={["0%", "3%"]}
            pl={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            pr={{ base: "5%", sm: "5%", md: "5%", lg: "10%" }}
            mx="auto"
            textAlign="center"
        >
            {imageSrc ? (
                <AspectRatio
                    w={["100%", "500px"]}
                    maxW={["100%", "500px"]}
                    ratio={1}
                    borderRadius="8px"
                    padding={["5%", "0px"]}
                    //_before={{ paddingBottom: "0%!important" }}
                    pos="relative"
                    margin="auto"
                >
                    <Box
                        pos="relative"
                        borderRadius="8px"
                        padding={["5%", "0px"]}
                        boxShadow="6px 6px 6px rgba(0, 0, 0, 0.16)"
                    >
                        <Image
                            src={imageSrc || global.$defaultProfile}
                            // layout="fill"
                            fill={true}
                            // objectFit="cover"
                            style={{ objectFit: "cover" }}
                            key={imageSrc}
                            // loading="lazy"
                            // lazyBoundary="500px"
                            alt="page_logo"
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </Box>
                </AspectRatio>
            ) : (
                <Box
                    pos="relative"
                    borderRadius="8px"
                    width={["300px", "350px"]}
                    m="auto"
                    height={["120px", "130px"]}
                >
                    <Image
                        loading="lazy"
                        layout="fill"
                        style={{ objectFit: "cover" }}
                        src={"/assets/new_ui/icons/logo_noshad.png"}
                        key="logo"
                        alt="logo"
                    />
                </Box>
            )}
            {title && (
                <Text textAlign="center" mt={"5%"} variant="Heading">
                    {title}
                </Text>
            )}
            {affilLink && (
                <Box my="1em" mx="auto" textAlign={"center"}>
                    <Link
                        textAlign={"center"}
                        mx="auto"
                        _hover={{ background: "transparent" }}
                        color="primary_1"
                        fontSize={["1em", "1.2em"]}
                        fontWeight={"semibold"}
                        textDecor="underline"
                        fontStyle={"italic"}
                        href={affilLink}
                        target="_blank"
                    >
                        {affilLink}
                    </Link>
                </Box>
            )}
            {/*
            <IconButton
                icon={<LinkIcon />}
                w="14px"
                h="14px"
                _hover={{ background: "transparent" }}
                // onClick={handleCopy}
                // mr="0.5em"
                //variant="solid"
                bg="transparent"
                aria-label="Copy"
                // isRound={true}
                color="primary_1"
            /> */}
            {description && (
                <Text
                    mt={["5%", "2%"]}
                    // mb={["5%", "2%"]}
                    w={["100%", "70%"]}
                    variant="subHeading"
                    whiteSpace={"pre-line"}
                    textAlign="center"
                >
                    {description}
                </Text>
            )}
            {actionButtons && actionButtons}
            <Box my="3em">
                {countryList && countryList.length > 1 && (
                    <CountryFilter
                        my={"2em"}
                        countryList={countryList}
                        filterAlbums={filterAlbums}
                        isCountry={true}
                        type="stories"
                    />
                )}
            </Box>
            {pageLoading ? (
                <LoadingGif />
            ) : (
                <TabsPart
                    tabData={tabData}
                    onTabChange={onTabChange}
                ></TabsPart>
            )}
        </Box>
    );
};
export default TabDataLayout;
