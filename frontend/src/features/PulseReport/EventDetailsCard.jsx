import { Box, Flex } from '@chakra-ui/react';
import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { getExpertbyUserLink } from '../../queries/strapiQueries';
import Postcard from '../TravelExplore/TravelPostcardList/Postcard';
import AlbumCard from '../AlbumCard';
import SmallUserCard from '../ProfilePage/SmallUserCard';
import AppContext from '../AppContext';

const EventDetailsCard = ({ eventDetails, followed, onFollow }) => {
    const { profile } = useContext(AppContext);
    const [userData, setUserData] = useState(null);
    const cardRef = useRef(null);

    // Fetch user data only when the eventDetails changes and is following a user
    useEffect(() => {
        if (eventDetails?.following) {
            getExpertbyUserLink(eventDetails?.following?.slug).then((response) => {
                setUserData(response[0]);
            });
        }
    }, [eventDetails?.following]);

    // Scroll to top when eventDetails changes
    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.scrollTop = 0;
        }
    }, [eventDetails]);

    // Render different types of cards based on event code
    const renderCard = useCallback(() => {
        switch (eventDetails?.code) {
            case 'COLLECT_POSTCARD':
                return <Postcard postcard={eventDetails.postcard} from="wanderlustPage" />;
            case 'FOLLOW_ALBUM':
            case 'BACKLINK':
                return (
                    <Box w="100%">
                        <AlbumCard story={eventDetails.album || eventDetails?.postcard?.album} />
                    </Box>
                );
            case 'FOLLOW_USER':
                return (
                    <Box maxW={["auto", "23.05vw"]} minW={"100%"}>
                        <SmallUserCard userData={userData} followed={followed} onFollow={onFollow} />
                    </Box>
                );
            default:
                return null;
        }
    }, [eventDetails, userData, followed, onFollow]);

    return (
        <Flex
            ref={cardRef}
            flexDirection="column"
            position="sticky"
            top="0vw"
            flex={1}
            minH={['auto', '100vh']}
            maxH={['auto', '110vh']}
            maxW={"29.58vw"}
            minW={['100%', 'fit-content']}
            borderRadius={['4.167vw', '1.597vw']}
            // bg={"#D9D9D9"}
            px={['2.22vw']}
            gap={['6vw', '1.6vw']}
            overflowX={"hidden"}
            className="no-scrollbar"
        >
            <Flex
                minW="100%"
                minH="100%"
                maxH="fit-content"
                my="auto"
                px={['3%', '0']}
                py={['2.22vw']}
                overflowY="auto"
                overflowX="hidden"
                className="no-scrollbar"
            >
                {renderCard()}
            </Flex>
        </Flex>
    );
};

export default EventDetailsCard;
