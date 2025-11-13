import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../AppContext'
import strapi from '../../queries/strapi'
import { ChakraNextImage } from '../../patterns/ChakraNextImage'
import { BsGlobe } from 'react-icons/bs'
import { FaRegBookmark, FaRegFolderOpen } from 'react-icons/fa'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { Box, Flex, Text } from '@chakra-ui/react'
import PostcardAnalytics from '.'
import LoadingGif from '../../patterns/LoadingGif'
import NotPrivileged from '../../patterns/NotPrivileged'

const AnalyticsDashboard = ({ company }) => {
    const { profile } = useContext(AppContext)
    const [isHotel, setIsHotel] = useState(false)
    const [image, setImage] = useState(null)
    const [isFetching, setIsFetching] = useState()
    const [analyticsData, setAnalyticsData] = useState({
        "Total Postcard Page Views": {
            icon: <FaRegFolderOpen />,
            count: 0,
        },
        "Total Website Referrals": { icon: <BsGlobe />, count: 0 },
        "Total Postcards Collected": { icon: <FaRegBookmark />, count: 0 },
        "Total Followers": { icon: <AiOutlineUserAdd />, count: 0 },
    });

    const fetchAnalytics = async () => {
        try {
            setIsFetching(true)
            if (isHotel || company) {
                const response = await strapi
                    .find(`events/companyStats?id=${company ? company.id : profile?.company?.id}`)
                setAnalyticsData((prevData) => ({
                    ...prevData,
                    "Total Postcard Page Views": {
                        ...prevData["Total Postcard Page Views"],
                        count: response.albumCount || 0,
                    },
                    "Total Website Referrals": {
                        ...prevData["Total Website Referrals"],
                        count: response.websiteCount || 0,
                    },
                    "Total Postcards Collected": {
                        ...prevData["Total Postcards Collected"],
                        count: response.bkmCount || 0,
                    },
                    "Total Followers": {
                        ...prevData["Total Followers"],
                        count: response.companyFollowCount || 0,
                    },
                }));
            } else {
                const response = await strapi.find(`events/totalStats`)
                setAnalyticsData((prevData) => ({
                    ...prevData,
                    "Total Postcard Page Views": {
                        ...prevData["Total Postcard Page Views"],
                        count: response.albumCount || 0,
                    },
                    "Total Website Referrals": {
                        ...prevData["Total Website Referrals"],
                        count: response.websiteCount || 0,
                    },
                    "Total Postcards Collected": {
                        ...prevData["Total Postcards Collected"],
                        count: response.bkmCount || 0,
                    },
                    "Total Followers": {
                        ...prevData["Total Followers"],
                        count: response.companyFollowCount || 0,
                    },
                }));
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        if (company || profile?.user_type?.name == "Hotels") {
            setIsHotel(true)
            setImage(company?.icon?.url || profile?.company?.icon?.url)
        }
    }, [profile])

    useEffect(() => {
        fetchAnalytics()
    }, [isHotel])

    if (!isFetching && !isHotel && (!profile || !["Admin", "EditorialAdmin", "EditorInChief", "SuperAdmin"].includes(profile?.user_type?.name))) {
        return <NotPrivileged />
    }

    return (
        <Flex
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            margin="2vw"
        >
            {isHotel && image && (
                <ChakraNextImage src={image} alt={"Image"} width={150} height={150} />
            )}
            <Text as="h1" fontFamily={"lora"} fontStyle={"italic"} fontWeight={"bold"} fontSize={"xxx-large"}>
                Postcard Analytics
            </Text>
            <Box width="100%">
                <Text
                    fontFamily={"raleway"}
                    fontWeight={"bold"}
                    fontSize={"xx-large"}
                    color={"primary_3"}
                >
                    LIFETIME
                </Text>
            </Box>

            {!isFetching ? <><Flex width="100%" marginY="35px" justifyContent="space-between">
                {Object.keys(analyticsData).map((key, index) => {
                    const opacity = index % 2 == 0 ? "0.2" : "0";
                    return (
                        <Box
                            key={index}
                            borderRadius="10px"
                            height="160px"
                            w={"25%"}
                            background={`rgba(245, 137, 109, ${opacity})`}
                            padding="20px"
                        >
                            <Text fontFamily={"raleway"} height="50%" fontSize="20px" fontWeight="600">
                                {key}
                            </Text>
                            <Flex height="50%" gap="20px" alignItems="center">
                                <Box fontSize="35px" color="primary_3">
                                    {analyticsData[key].icon}
                                </Box>
                                <Box fontSize="xx-large" fontWeight="600">
                                    {/* {item.count} */}
                                    <Text fontFamily={"raleway"}>
                                        {analyticsData[key].count}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    );
                })}
            </Flex>

                <PostcardAnalytics
                    isHotel={isHotel}
                    companyId={company?.id || profile?.company?.id}
                /></> : <LoadingGif />}
        </Flex>
    )
}

export default AnalyticsDashboard