import { useContext, useEffect, useState } from "react";
import UserProfile from "../ProfilePage/UserProfile";
import AppContext from "../AppContext";
import { Box, Flex, Icon } from "@chakra-ui/react";
import UserPostcards from "./UserPostcards";
import UserStays from "./UserStays";
import UserTours from "./UserTours";
import { fetchPaginatedResults } from "../../queries/strapiQueries";
import UserMemories from "./UserMemories";
import UserDecks from "./UserDecks";
import { BiHotel } from "react-icons/bi";
import { FaRegStar, FaRegCalendarAlt, FaList } from "react-icons/fa";
import { IoImage, IoRestaurant } from "react-icons/io5";
import UserWanderlust from "./UserWanderlust";
import UserRestaurants from "./UserRestaurants";

const MyCollections = ({ expert }) => {
    const { profile, isActiveProfile } = useContext(AppContext);
    // const tabs = ["Experiences", "Stays", "Tours"];
    // const allTabs = ["Stays", "Experiences"];
    const allTabs = [{ name: "Stays", icon: BiHotel },
    // { name: "Restaurants", icon: IoRestaurant },
    { name: "Experiences", icon: FaRegStar },]
    const [tabs, setTabs] = useState([
        { name: "Stays", icon: BiHotel },
        // { name: "Restaurants", icon: IoRestaurant },
        { name: "Experiences", icon: FaRegStar }]); // default without Memories
    // const tabs = ["Memories", "Decks", "Stays", "Experiences"];
    const [decks, setDecks] = useState([]);
    const [dxCardMaps, setDxCardMaps] = useState({})
    const [dxCardIds, setDxCardIds] = useState([])
    const [selectedTab, setSelectedTab] = useState(0);
    const [memCount, setMemCount] = useState(0);

    async function getDxCardIdGalleryMap(slug) {
        let travelogues = await fetchPaginatedResults(
            'travelogues',
            {
                user: { slug },
                status: { $in: ["deckFreeze", "onTrip", "complete"] }
            },
            {
                fields: ["id", "title", "startDate", "endDate"],
                destination_expert: {
                    fields: ['name', 'title'],
                    populate: {
                        user: {
                            fields: ['id', 'slug']
                        }
                    }
                },
                itinerary_block: {
                    fields: ['id', "date", "order"],
                    populate: {
                        dx_card: {
                            fields: ['id'],
                            populate: {
                                coverImage: { fields: ['url'] },
                            },
                        },
                        gallery: {
                            fields: ['id', 'url', "caption"],
                        }
                    }
                }
            },
            "startDate:DESC"
        );

        travelogues = Array.isArray(travelogues) ? travelogues : [travelogues];

        const dxCardGalleryArray = [];
        const uniqueDxCardIds = new Set();

        travelogues?.forEach((travelogue) => {
            const travelogueId = travelogue.id;

            travelogue.itinerary_block?.forEach((block) => {
                const dxCard = block.dx_card;
                const { date, order, gallery } = block;
                if (dxCard?.id && Array.isArray(gallery) && gallery.length > 0) {
                    dxCardGalleryArray.push({
                        travelogueId,
                        dxCardId: dxCard.id,
                        date,
                        order,
                        gallery
                    });
                    uniqueDxCardIds.add(dxCard.id);
                }
            });
        });

        return {
            travelogues,
            dxCardGalleryArray,
            uniqueDxCardIds: Array.from(uniqueDxCardIds),
        };
    }

    const tabContent = {
        Experiences: <UserPostcards slug={expert?.slug} header={{ title: "Collected Postcards", subtitle: "Personal collection of Postcard travel experiences." }} />,
        Stays: <UserStays slug={expert?.slug} header={{ title: "Collected Stays", subtitle: "Personal collection of Postcard partner properties." }} />,
        // Restaurants: <UserRestaurants slug={expert?.slug} header={{ title: "Postcard Food And Beverages", subtitle: "Personal collection of Postcard Food and Beverages." }} />,
        Memories: <UserMemories slug={expert?.slug} dxCardMaps={dxCardMaps} dxCardIds={dxCardIds} header={{
            title: "Postcard Memories", subtitle: "Personal photo-stories from Postcard  travel experiences."
        }} />,
        Itineraries: <UserDecks slug={expert?.slug} decks={decks} header={{ title: "Postcard Itineraries", subtitle: "Personal collection of Postcard travel itineraries." }} />,
        Wanderlust: <UserWanderlust isDiary={expert?.id} header={{
            title: "Postcard Wanderlust", subtitle: "Browsing journey on the Postcard travel platform."
        }} />
        // Tours: <UserTours slug={expert?.slug} />,
    };
    const getMemoriesCount = async (slug) => {
        if (!slug) return;

        const filter = { user: { slug: slug } };

        // If viewing someone else's profile, only count public memories
        if (!isActiveProfile({ slug })) {
            filter.shareType = 'public';
        }

        let res = await fetchPaginatedResults("memories", filter, {});
        const memories = Array.isArray(res) ? res : (res ? [res] : []);
        setMemCount(memories.length);
    };

    useEffect(() => {
        if (!expert?.slug) return;
        getMemoriesCount(expert?.slug)
        getDxCardIdGalleryMap(expert?.slug).then((res) => {
            const { travelogues, dxCardGalleryArray, uniqueDxCardIds } = res;
            setDxCardMaps(dxCardGalleryArray || []);
            setDxCardIds(uniqueDxCardIds || [])
            setDecks(travelogues || [])
            let newTabs = [];

            newTabs = [
                { name: "Experiences", icon: FaRegStar },
                { name: "Stays", icon: BiHotel },
                { name: "Memories", icon: IoImage },
            ];

            // Add "Itineraries" (Decks) if available or if viewing own profile
            if (travelogues?.length > 0 || profile?.slug == expert?.slug) {
                newTabs.push({ name: "Itineraries", icon: FaRegCalendarAlt });
            }

            setTabs(newTabs);

        });
    }, [expert]);

    return (
        <Box bg="#efe9e4">
            <UserProfile slug={expert?.slug} memCount={memCount} />
            <Flex flexDirection="column">
                {/* Tabs */}
                <Flex position="relative" w="100%" h={["11.11vw", "3.33vw"]} bg={["#307fe27f", "#7faae3"]} overflowX={"auto"} className="no-scrollbar">
                    {tabs.map((tab, index) => {
                        const isSelected = selectedTab === index;

                        const backgroundColor = isSelected
                            // ? "#f7ede2"
                            ? "#efe9e4"
                            : index < selectedTab
                                ? "#EA6146"
                                : "#EB836E";

                        const textColor = isSelected ? "#EA6146" : "#EFE9E4";

                        return (
                            <Flex
                                key={index}
                                zIndex={10 - index}
                                onClick={() => setSelectedTab(index)}
                                h="100%"
                                pr={["5.55vw", "2vw"]}
                                borderTopRightRadius={["4.167vw", "1.4vw"]}
                                justifyContent="flex-end"
                                alignItems="center"
                                position="absolute"
                                w={[`${20 + index * 20}vw`, `${7 + index * 7}vw`]}
                                // textAlign="right"
                                top={0}
                                left={0}
                                bg={backgroundColor}
                                // color={textColor}
                                // fontFamily="raleway"
                                // fontWeight={500}
                                // fontSize={["4.44vw", "1.5vw"]}
                                boxShadow={!isSelected && ["10px 0px 10px -7px rgba(0,0,0,0.1)", "15px 0px 10px -7px rgba(0,0,0,0.1)"]}
                                cursor="pointer"
                                transition={"background-color 0.5s ease"}
                            >
                                {/* {tab} */}
                                <Icon
                                    as={tab.icon}
                                    width={"auto"}
                                    height={[
                                        "24px",
                                        "24px",
                                        "24px",
                                        "1.80vw"
                                    ]}
                                    cursor={"pointer"}
                                    fill={textColor}
                                />
                            </Flex>
                        );
                    })}
                </Flex>

                {/* Content */}
                <Flex w="100%" pt={["12%", "5%"]} justify={"center"}>
                    {tabContent[tabs[selectedTab].name]}
                </Flex>
            </Flex>
        </Box>
    );
};

export default MyCollections;