import { Box, Flex, Image, Text, Link } from "@chakra-ui/react";
const AlbumDetails = ({ album }) => {
    const companyIconUrl =
        album?.company?.icon?.url || "/assets/images/p_stamp.png";
    const albumCoverUrl =
        album?.coverImage?.url || "/assets/images/p_stamp.png";
    return (
        <Box textAlign="center" my="2em">
            {album.company?.name && album.name && (
                <>
                    <Text
                        fontWeight={"bold"}
                        //textDecor="underline"
                        fontSize={"20px"}
                        // mb="1em"
                    >
                        Read more stories from <br />
                        <Link
                            fontWeight={"bold"}
                            textDecor="underline"
                            fontSize={"20px"}
                            href={`/${album?.slug}`}
                            color="primary_1"
                        >
                            {album.name}
                        </Link>
                    </Text>
                </>
            )}
            {/* <AspectRatio
                mt="3em"
                mb="4em"
                ratio={1}
                mx="auto"
                w={["60vw", "25vw"]}
            >
                <Image borderRadius="8px" src={companyIconUrl} />
            </AspectRatio>
            <Text variant="profileName" mb="1em">
                From the Collection
            </Text>
            <AspectRatio my="3em" ratio={1} mx="auto" w={["60vw", "25vw"]}>
                <Image borderRadius="8px" src={albumCoverUrl} />
            </AspectRatio>
            <Link
                fontWeight={"bold"}
                textDecor="underline"
                fontSize={"20px"}
                href={`/${album?.slug}`}
                color="primary_1"
            >
                {album.name}
            </Link> */}
        </Box>
    );
};
export default AlbumDetails;
