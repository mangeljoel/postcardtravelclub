import { Box, AspectRatio, Text } from "@chakra-ui/react";
import { img_main, action_icons, flipperContainer } from "./index.module.scss";
import Image from "next/image";

const PreviewCard = ({ indexId, postcard, togglePreview }) => {
    return (
        <Box
            background="primary_15"
            boxSizing="border-box"
            boxShadow="0px 2px 6px rgba(0, 0, 0, 0.16)"
            borderRadius="8px"
            pos="relative"
            onClick={() => togglePreview(indexId)}
        >
            <AspectRatio
                pos="relative"
                className={img_main}
                borderTopRadius="8px"
                overflow="hidden"
                ratio={1}
            >
                <Image
                    src={postcard.coverImage?.url || global.$defaultProfile}
                    layout="fill"
                    objectFit="cover"
                    loading="lazy"
                    lazyBoundary="500px"
                    alt="pc_img"
                />
            </AspectRatio>
            <Box p="8px" cursor="pointer" textAlign={"left"} m="auto">
                <Text fontSize="0.9rem" fontWeight="bold">
                    {postcard.name}
                </Text>

                <Text mt="1em" fontSize="0.6rem" color="primary_3">
                    {postcard.country?.name}
                </Text>
            </Box>
        </Box>
    );
};
export default PreviewCard;
