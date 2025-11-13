import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsGlobe } from "react-icons/bs";
import { FaRegBookmark, FaRegFolderOpen } from "react-icons/fa";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import { useEffect, useState } from "react";

export const AffiliationsColumn = [
    {
        Header: "Image",
        accessor: "logo.url",
        Cell: ({ value }) => (
            <Flex justifyContent={"center"} alignItems={"center"}>
                <img src={value} height={"60px"} width={"60px"} />
            </Flex>
        )
    },
    {
        Header: "Affiliations",
        accessor: "name",
        Cell: ({ value }) => (
            <Text
                // textAlign={"center"}
                fontFamily={"raleway"}
                fontWeight={"500"}
            >
                {value}
            </Text>
        )
    },
    // {
    //     Header: "Country",
    //     accessor: "country",
    //     Cell: ({ value }) => (
    //         <Text
    //             textAlign={"center"}
    //             fontFamily={"raleway"}
    //             fontWeight={"500"}
    //         >
    //             {value}
    //         </Text>
    //     )
    // },
    {
        Header: "No. of Partners",
        accessor: "companies",
        Cell: ({ value }) => (
            <Text
                textAlign={"center"}
                fontSize="x-large"
                fontFamily={"raleway"}
                fontWeight={"500"}
            >
                {value?.length}
            </Text>
        )
    },
    {
        Header: () => <FaRegFolderOpen size={24} color="#307FE2" />,
        accessor: "albumCount",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <BsGlobe size={24} color="#307FE2" />,
        accessor: "websiteCount",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily="raleway"
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <FaRegBookmark size={24} color="#307FE2" />,
        accessor: "bkmCount",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <AiOutlineUserAdd size={25} color="#307FE2" />,
        accessor: "affiliateFollowCount",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    }
];

export const PropertiesColumn = [
    {
        Header: "Image",
        accessor: "coverImage.url",
        Cell: ({ value }) => (
            <>
                <img src={value} style={{ aspectRatio: "1/1" }} />
            </>
        )
    },
    {
        Header: "Property",
        accessor: "name",
        width: "20%",
        Cell: ({ value, row }) => (
            <Text
                as={Link}
                href={`/postcard-analytics/${row.original?.company?.name}`}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                cursor={"pointer"}
                // textAlign={"center"}
                fontFamily={"raleway"}
                fontWeight={"500"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: "Country",
        accessor: "country.name",
        Cell: ({ value }) => (
            <Text
                textAlign={"center"}
                fontFamily={"raleway"}
                fontWeight={"500"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: "No. of Postcards",
        accessor: "postcardsCount",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value || 0}
            </Text>
        )
    },
    {
        Header: "No. of Interest Tags",
        accessor: "tags",
        width: "15%",
        // width: "300px",
        // maxWidth: "400px",
        // flex: 2,
        Cell: ({ value }) => (
            // <Flex flexWrap={"wrap"}>
            //     {value?.map((tag) => (
            //         <Text
            //             key={tag?.id} // Ensure each item has a unique key
            //             display="inline-block"
            //             border="1px solid #307FE2"
            //             borderRadius="15px"
            //             paddingX="5px"
            //             paddingY="3px"
            //             color="#5A5A5A"
            //             margin="2px"
            //             minWidth="fit-content"
            //             whiteSpace="nowrap" // Prevent wrapping to the next line
            //             fontSize="inherit" // Dynamically adjust font size
            //         >
            //             {tag?.name}
            //         </Text>
            //     ))}
            // </Flex>
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value?.length || 0}
            </Text>
        )
    },
    {
        Header: () => <FaRegFolderOpen size={24} color="#307FE2" />,
        accessor: "albumCount",
        maxWidth: "110px",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <BsGlobe size={24} color="#307FE2" />,
        accessor: "websiteCount",
        maxWidth: "110px",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <FaRegBookmark size={24} color="#307FE2" />,
        accessor: "bkmCount",
        maxWidth: "110px",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <AiOutlineUserAdd size={25} color="#307FE2" />,
        accessor: "albumFollowCount",
        maxWidth: "110px",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    }
];

export const PostcardColumn = [
    {
        Header: "Image",
        accessor: "coverImage.url",
        Cell: ({ value }) => (
            <>
                <img src={value} style={{ aspectRatio: "1/1" }} />
            </>
        )
    },
    {
        Header: "Postcard",
        accessor: "name",
        width: "20%",
        Cell: ({ value }) => (
            <Text
                // textAlign={"center"}
                fontFamily={"raleway"}
                fontWeight={"500"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: "Property",
        accessor: "album.name",
        Cell: ({ value }) => (
            <Text
                // textAlign={"center"}
                fontFamily={"raleway"}
                fontWeight={"500"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: "Interest Tags",
        accessor: "tags",
        width: "15%",
        // width: "300px",
        // maxWidth: "400px",
        // flex: 2,
        Cell: ({ value }) => (
            <Flex flexWrap={"wrap"}>
                {value?.map((tag) => {
                    // Calculate font size based on tag length
                    let fontSize = "inherit"; // default font size
                    // if (tag.length > 10) {
                    //     // Adjust font size if tag length is greater than 10 characters
                    //     fontSize = "10px"; // You can adjust this value as needed
                    // }

                    return (
                        <Text
                            key={tag} // Ensure each item has a unique key
                            display="inline-block"
                            border="1px solid #307FE2"
                            borderRadius="15px"
                            paddingX="5px"
                            paddingY="3px"
                            color="#5A5A5A"
                            margin="2px"
                            minWidth="fit-content"
                            whiteSpace="nowrap" // Prevent wrapping to the next line
                            fontSize={fontSize} // Dynamically adjust font size
                        >
                            {tag.name}
                        </Text>
                    );
                })}
            </Flex>
        )
    },
    {
        Header: () => <FaRegFolderOpen size={24} color="#307FE2" />,
        accessor: "albumCount",
        maxWidth: "110px",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <BsGlobe size={24} color="#307FE2" />,
        accessor: "websiteCount",
        maxWidth: "110px",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <FaRegBookmark size={24} color="#307FE2" />,
        accessor: "bkmCount",
        maxWidth: "110px",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    },
    {
        Header: () => <AiOutlineUserAdd size={25} color="#307FE2" />,
        accessor: "albumFollowCount",
        maxWidth: "110px",
        Cell: ({ value }) => (
            <Text
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="x-large"
                fontWeight={"500"}
                fontFamily={"raleway"}
            >
                {value}
            </Text>
        )
    }
];
