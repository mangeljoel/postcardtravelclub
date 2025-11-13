import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    useDisclosure,
    Flex,
    Button,
    Icon,
    Link
} from "@chakra-ui/react";
import {
    WelcomeIcon,
    UniqueActivitiesIcon,
    LodgingIcon,
    DiningIcon,
    SustainablityStoryIcon,
    ExperiencesIcon,
    RoomIcon,
    DownArrowIcon
} from "../../../styles/ChakraUI/icons";
import { BiDownArrow } from "react-icons/bi";

const IndexSection = ({ pageSections, newsArticle }) => {
    // const { isOpen, onOpen, onClose } = useDisclosure();
    const [indexSection, setIndexSection] = useState([]);
    // const [hoveredIcon, setHoveredIcon] = useState("");

    useEffect(() => getIndexSectionItems(), [newsArticle, pageSections]);

    const getIndexSectionItems = () => {
        const allSections = newsArticle?.block
            .sort((a, b) =>
                a.album_section?.order < b.album_section?.order
                    ? -1
                    : a.album_section?.order > b.album_section?.order
                        ? 1
                        : 0
            )
            ?.map((section) => section.album_section?.name)
            ?.filter((section) => section != "Unique Activities");

        // console.log(allSections, "order");
        // ?.filter((section) => !!section);

        //sort the sections of article block in order of page sections
        // const orderMap = new Map(
        //     pageSections?.map((item, index) => [item, index])
        // );
        // allSections?.sort((a, b) => orderMap.get(a) - orderMap.get(b));
        // console.log(newsArticle?.block, allSections);

        if (newsArticle?.album?.postcards?.length > 0) {
            if (allSections[0] === "Welcome")
                allSections.splice(1, 0, "Postcard Experiences");
        } else {
            allSections.splice(0, 0, "Postcard Experiences");
        }
        // if (newsArticle?.album?.company?.affiliations.length)
        //     allSections.push("Affiliations");
        // console.log("sections",allSections)
        setIndexSection([...new Set(allSections)]);
    };

    return (
        <>
            {indexSection?.length > 0 ? (
                indexSection.map(
                    (section, index) =>
                        section !== "Welcome" && section !== "Postcard Experiences" && (
                            <Flex
                                as={Link}
                                key={index}
                                href={`#${section}`}
                                w={["100%", "21.6vw"]}
                                h={["11.11vw", "4.17vw"]}
                                bg={"#EDB6A9"}
                                color={"primary_1"}
                                borderRadius={["2.78vw", "1.04vw"]}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                px={["6.4vw", "1.94vw"]}
                                fontFamily={"raleway"}
                                fontSize={["3.89vw", "1.46vw"]}
                                lineHeight={["5vw", "1.87vw"]}
                                _hover={{ bg: "#EFE9E4" }}
                            >
                                <Text>{section}</Text>
                                <DownArrowIcon
                                    h={"100%"}
                                    w={["4vw", "1.25vw"]}
                                />
                            </Flex>
                        )
                )
            ) : (
                <></>
            )}
        </>
    );
};

export default IndexSection;
