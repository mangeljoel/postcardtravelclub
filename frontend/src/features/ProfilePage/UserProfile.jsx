import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { getExpertbyUserLink } from '../../queries/strapiQueries'
import AppContext from '../AppContext'
import UserCard from './UserCard'
import EditUserCard from './EditUserCard'

const UserProfile = ({ slug, memCount }) => {
    const { profile } = useContext(AppContext)
    const [userData, setUserData] = useState(null)
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        if (slug) {
            getExpertbyUserLink(slug).then((response) => {
                console.log(response)
                setUserData(Array.isArray(response) ? response[0] : response)
            })
        }
    }, [slug, profile])


    return (
        <Flex w={"100%"} px={["5.55vw", 0]} bg={["linear-gradient(0deg, rgba(48,127,226,0.5) 0%, rgba(140,178,227,0.5) 90%, rgba(239,233,228,1) 100%)", "linear-gradient(0deg, rgba(48,127,226,0.6) 0%, rgba(239,233,228,1) 90%)"]} justifyContent={"center"} alignItems={"center"} >
            <Box h={["fit-content", "65vh"]} mt="3%" mb={["10%", "2%"]}>
                {userData && !editMode && <UserCard userData={userData} memCount={memCount} editProfile={() => setEditMode(true)} />}
                {userData && editMode && <EditUserCard userData={userData} memCount={memCount} closeEditProfile={() => setEditMode(false)} />}
            </Box>
        </Flex>
    )
}

export default UserProfile