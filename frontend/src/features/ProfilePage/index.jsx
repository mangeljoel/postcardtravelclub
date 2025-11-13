import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import AppContext from '../AppContext'
import UserProfile from './UserProfile'
import MyCollectionPage from '../MyCollections'

const ProfilePage = ({ expert }) => {
    const { profile } = useContext(AppContext)
    return (
        <Flex flexDirection="column" w={"100%"}>
            <UserProfile slug={expert?.slug} />
            <MyCollectionPage expert={expert} />

        </Flex>
    )
}

export default ProfilePage