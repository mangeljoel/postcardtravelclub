import { Box, Flex, Grid, GridItem, Image, SimpleGrid } from "@chakra-ui/react";
import HoverCard from "./HoverCard";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";

const ImageGallery = ({ featuredAlbums = [] }) => {
    const images = [
        {
            news_article: {
                image: {
                    url: "/assets/homepage/gallery_1.webp",
                }
            },
            name: "Eremito",
            country: {
                name: "ITALY",
            },
            slug: "eremito-hotelito-del-alma"
        },
        {
            news_article: {
                image: {
                    url: "/assets/homepage/gallery_2.webp",
                }
            },
            name: "Nimali Tarangire",
            country: {
                name: "TANZANIA",
            },
            slug: "nimali-tarangire"
        },
        {
            news_article: {
                image: {
                    url: "/assets/homepage/gallery_3.webp",
                }
            },
            name: "Papaya Playa Project",
            country: {
                name: "MEXICO",
            },
            slug: "papaya-playa-project"
        },
        {
            news_article: {
                image: {
                    url: "/assets/homepage/gallery_4.webp",
                }
            },
            name: "RAAS Devigarh",
            country: {
                name: "INDIA",
            },
            slug: "raas-devigarh"
        },
        {
            news_article: {
                image: {
                    url: "/assets/homepage/gallery_5.webp",
                }
            },
            name: "Zhiwa Ling Heritage",
            country: {
                name: "BHUTAN",
            },
            slug: "zhiwaling-heritage"
        },
        {
            news_article: {
                image: {
                    url: "/assets/homepage/gallery_6.webp",
                }
            },
            name: "Treehotel",
            country: {
                name: "SWEDEN",
            },
            slug: "treehotel"
        }
    ];

    const data = featuredAlbums?.length >= 6 ? featuredAlbums : images

    return (
        <Grid
            w={["100%", "80%"]}
            mx={[0, "8.65vw"]}
            px={["11.55vw", "0"]}
            my={[8, 8, 16]}
            className="no-scrollbar"
            // mr={["-5vw", "auto"]}
            // ml={["5vw", "auto"]}
            // h={["30vh", "80vh"]}
            overflowX={["auto", "auto", "hidden"]}
            templateColumns={["", "repeat(3, 1fr)"]}
            gridAutoFlow={"column"}
            templateRows={["", "repeat(2, 1fr)"]}
            gap={6}
        >
            {data.map((album, index) => (
                <Box
                    key={index}
                    flex="0 0 auto"
                    maxH={["184px", "368px"]}
                    width={["75vw", "auto"]}
                    maxW={["256px", "512px"]}
                    aspectRatio={"4 / 3"}
                    borderRadius="20px"
                    overflow="hidden"
                >
                    <HoverCard
                        child={
                            // <Image
                            //     src={image.src}
                            //     alt={`Image ${index + 1}`}
                            //     objectFit="cover"
                            //     borderRadius="20px"
                            //     w={["100%", "100%"]}
                            //     h="100%"
                            // />
                            <ChakraNextImage
                                src={album?.news_article?.image?.url}
                                alt={`Stays Image ${index + 1}`}
                                objectFit="cover"
                                borderRadius="20px"
                                priority={false}
                                w={["100%", "100%"]}
                                h="100%"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        }
                        loc={album?.name}
                        country={`${album?.region ? `${album?.region?.name}, ${album?.country?.name}` : `${album?.country?.name}`}`}
                        path={`/postcard-pages/${album?.slug}`}
                    />
                </Box>
            ))}
        </Grid>
    );
};

export default ImageGallery;
