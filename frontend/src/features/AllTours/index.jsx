import { useContext, useEffect, useState } from "react";
import NewStoryList from "../TravelGuide/NewStoryList";
import { Text, Box, Button, Flex } from "@chakra-ui/react";
import TravelPostcardList from "../TravelExplore/TravelPostcardList";
import MembersCardList from "../MembersPage/MemberCardList";
import { useRouter } from "next/router";
import PostcardModal from "../PostcardModal";
import ModalShare from "../ModalShare";
import TabDataLayout from "../../patterns/TabDataLayout";
import {
    createDBEntry,
    deleteDBEntry,
    fetchPaginatedResults
} from "../../queries/strapiQueries";
import AppContext from "../AppContext";
// import ModalSignupLogin from "../ModalSignupLogin";
import CollectionList from "../CollectionList";
import SignUpInModal from "../HomePage1/SignUpInModal";
import SignUpInfoModal from "../HomePage1/SignUpInfoModal";

const AllTours = ({ post, type, countryName }) => {
    const router = useRouter();
    const { profile } = useContext(AppContext);
    const [countryList, setCountryList] = useState([]);
    const [data, setData] = useState({});
    const [pageTitle, setPageTitle] = useState(
        post?.name + (countryName ? " in " + countryName : "")
    );
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [filteredPostcards, setFilteredPostcards] = useState([]);
    const [filteredComapnies, setFilteredCompanies] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showModal, setShowModal] = useState({
        mode: "",
        isShow: false
    });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    const [shareData, setShareData] = useState(null);
    const [tabData, setTabData] = useState([]);
    const [followerData, setFollowerData] = useState([]);
    const [profileIsFollower, setProfileIsFollower] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [showCollectedPopup, setShowCollectedPopup] = useState(false);

    const filterAlbums = async (type, name) => {
        setPageLoading(true);
        if (name === "") {
            setFilteredAlbums(data.albums);
            setFilteredPostcards(data.postcards);
            setFilteredCompanies(data.companies);
        } else {
            setFilteredAlbums(
                data.albums.filter((alb) => alb.country?.name === name)
            );
            setFilteredPostcards(
                data.postcards.filter((pc) => pc.country?.name === name)
            );
            setFilteredCompanies(
                data.companies.filter((comp) => comp.country?.name === name)
            );
        }
    };

    useEffect(() => {
        if (post) {
            getInitialData(post);
        }
    }, [post, profile]);
    const getInitialData = (post) => {
        let concaAlbum = [];
        let concaPostcards = [];
        let concaCompanyUsers = [];
        if (post.companies) {
            post.companies.map((affil) => {
                if (affil.albums) {
                    affil.albums.map((item) => {
                        if (item) {
                            concaAlbum.push(item);
                        }
                    });
                }
            });
        }
        concaCompanyUsers = getUsersfromCompany(post.companies);
        if (concaAlbum && concaAlbum.length >= 1) {
            concaAlbum.map((album) => {
                if (album.postcards) {
                    album.postcards.map((postcard) => {
                        if (postcard) concaPostcards.push(postcard);
                    });
                }
            });
        }
        setFilteredAlbums(concaAlbum);
        setFilteredPostcards(concaPostcards);
        setFilteredCompanies(concaCompanyUsers);
        setData({
            albums: concaAlbum,
            postcards: concaPostcards,
            companies: concaCompanyUsers
        });
        //callSetTabData(concaAlbum, concaPostcards, concaCompanyUsers);
        getCountryList(concaAlbum, concaPostcards, concaCompanyUsers);
        getFollowerData();
    };
    const getFollowerData = async () => {
        let data = await fetchPaginatedResults(
            "follow-affiliates",
            {
                affiliation: { id: post.id }
            },
            {
                follower: {
                    fields: ["fullName", "slug"],
                    populate: {
                        profilePic: {
                            fields: ["url"]
                        }
                    }
                }
            }
        );
        // let list = await fetchPaginatedResults("followerlist", {}, {});
        // console.log(list);
        let followDetails = Array.isArray(data) ? data : [data];
        setFollowerData(followDetails);
        if (profile) {
            setProfileIsFollower(
                followDetails.filter(
                    (follow) => follow?.follower?.id === profile?.id
                ).length > 0
                    ? true
                    : false
            );
            if (
                showModal.doFollow &&
                followDetails.filter(
                    (follow) => follow?.follower?.id === profile?.id
                ).length <= 0
            ) {
                setShowModal({ isShow: false, doFollow: false });
                followUnFollowProfile();
            } else setShowModal(false);
        }
    };
    useEffect(() => {
        if (filteredPostcards && filteredAlbums && filteredComapnies)
            callSetTabData(
                filteredPostcards,
                filteredAlbums,
                filteredComapnies
            );
    }, [filteredPostcards, filteredAlbums, filteredComapnies]);
    const getUsersfromCompany = (companies) => {
        let concaCompanyUsers = [];
        companies.map((affil) => {
            if (affil.users?.length >= 1) {
                concaCompanyUsers.push({
                    ...affil.users[0],
                    company: { ...affil },
                    postcardsCreated: affil?.albums[0]?.postcards?.length
                });
            }
        });
        return concaCompanyUsers;
    };
    const callSetTabData = (postcards, albums, companies) => {
        let tabData = [
            {
                name: "Experiences",
                childComp: (
                    <Box w="100%">
                        {postcards.length === 0 && (
                            <Text
                                my={"10%"}
                                mx="auto"
                                variant={"aboutTitles"}
                                fontWeight="bold"
                                color="primary_3"
                                textAlign={"center"}
                                fontSize={["18px", "24px"]}
                            >
                                No Postcard stories to display...
                            </Text>
                        )}
                        {postcards.length !== 0 && (
                            <TravelPostcardList
                                postcards={postcards.sort(
                                    () => Math.random() - 0.5
                                )}
                                isHomePage={true}
                                canEdit={true}
                            />
                        )}
                    </Box>
                )
            },
            albums.filter(
                (alb) => alb?.directories[0]?.name === "Postcard Stays | Conscious Luxury Travel"
            ).length
                ? {
                    name: "Stays",
                    childComp:
                        albums &&
                            albums.filter(
                                (alb) =>
                                    alb?.directories[0]?.name === "Postcard Stays | Conscious Luxury Travel"
                            ).length ? (
                            <Box w="100%">
                                <NewStoryList
                                    stories={
                                        albums
                                            .filter(
                                                (alb) =>
                                                    alb?.directories[0]
                                                        ?.name ===
                                                    "Boutique Stays"
                                            )
                                            .sort(
                                                () => Math.random() - 0.5
                                            ) || []
                                    }
                                    isStoriesLoading={false}
                                />
                            </Box>
                        ) : (
                            <Text
                                my={"10%"}
                                mx="auto"
                                variant={"aboutTitles"}
                                fontWeight="bold"
                                color="primary_3"
                                textAlign={"center"}
                                fontSize={["18px", "24px"]}
                            >
                                No Albums to display...
                            </Text>
                        )
                }
                : null,
            albums.filter(
                (alb) => alb?.directories[0]?.name === "Designer Tours"
            ).length
                ? {
                    name: "Tours",
                    childComp:
                        albums &&
                            albums.filter(
                                (alb) =>
                                    alb?.directories[0]?.name === "Designer Tours"
                            ).length ? (
                            <Box w="100%">
                                <NewStoryList
                                    stories={
                                        albums
                                            .filter(
                                                (alb) =>
                                                    alb?.directories[0]
                                                        ?.name ===
                                                    "Designer Tours"
                                            )
                                            .sort(
                                                () => Math.random() - 0.5
                                            ) || []
                                    }
                                    isStoriesLoading={false}
                                />
                            </Box>
                        ) : (
                            <Text
                                my={"10%"}
                                mx="auto"
                                variant={"aboutTitles"}
                                fontWeight="bold"
                                color="primary_3"
                                textAlign={"center"}
                                fontSize={["18px", "24px"]}
                            >
                                No Albums to display...
                            </Text>
                        )
                }
                : null,
            {
                name: "Partners",
                childComp:
                    companies && companies.length ? (
                        <Box w="100%">
                            <MembersCardList displayMembers={companies} />
                        </Box>
                    ) : (
                        <Text
                            my={"10%"}
                            mx="auto"
                            variant={"aboutTitles"}
                            fontWeight="bold"
                            color="primary_3"
                            textAlign={"center"}
                            fontSize={["18px", "24px"]}
                        >
                            No Postcard pages to display...
                        </Text>
                    )
            }
        ];
        setTabData(tabData);
        setPageLoading(false);
    };
    const followUnFollowProfile = () => {
        if (profileIsFollower) {
            let follow = followerData.filter(
                (follow) => follow?.follower?.id === profile?.id
            );
            deleteDBEntry("follow-affiliates", follow[0].id).then((resp) =>
                getFollowerData()
            );
        } else {
            if (
                followerData.filter(
                    (follow) => follow?.follower?.id === profile?.id
                ).length === 0
            )
                createDBEntry("follow-affiliates", {
                    follower: profile.id,
                    affiliation: post.id
                }).then((resp) => getFollowerData());
        }
        setTimeout(() => {
            setInProgress(false);
        }, 50);
    };
    const getCountryList = (albums, postcards, companies) => {
        let countries = [];
        albums.map((album) => {
            if (
                album.country?.id &&
                countries.filter((e) => e.id === album.country.id).length == 0
            ) {
                countries.push(album.country);
            }
        });
        postcards.map((pc) => {
            if (
                pc.country?.id &&
                countries.filter((e) => e.id === pc.country.id).length == 0
            ) {
                countries.push(pc.country);
            }
        });
        companies.map((comp) => {
            if (
                comp.country?.id &&
                countries.filter((e) => e.id === comp.country.id).length == 0
            ) {
                countries.push(comp.country);
            }
        });
        countries.sort((a, b) => a.name.localeCompare(b.name));

        setCountryList(countries);
    };
    const ActionButtons = () => {
        return (
            <>
                {followerData && followerData.length > 0 && (
                    <Text
                        fontSize={"18px"}
                        mt={"1em"}
                        cursor={"pointer"}
                        color="primary_1"
                        fontWeight={"bold"}
                        fontStyle={"italic"}
                        onClick={() => setShowCollectedPopup(true)}
                    >
                        {followerData.length}{" "}
                        {followerData.length > 1 ? "followers" : "follower "}
                    </Text>
                )}

                <PostcardModal
                    isShow={showCollectedPopup}
                    headerText={"Followers"}
                    children={
                        <CollectionList
                            list={followerData.map((follow) => {
                                return follow.follower;
                            })}
                            onClose={() => setShowCollectedPopup(false)}
                        />
                    }
                    handleClose={() => setShowCollectedPopup(false)}
                    style={{ padding: "20px", width: "100%" }}
                    size={"md"}
                />
                <Flex mt="2em" mx="auto" justify={"center"}>
                    <Button
                        mx="0.5em"
                        isLoading={inProgress}
                        onClick={(e) => {
                            e.stopPropagation();
                            setInProgress(true);
                            if (profile) followUnFollowProfile();
                            else {
                                setShowModal({
                                    isShow: true,
                                    mode:
                                        showModal.mode === "login"
                                            ? "signup"
                                            : "login",

                                    doFollow: true
                                });
                                setInProgress(false);
                            }
                        }}
                    >
                        {profileIsFollower
                            ? "Following Profile"
                            : "Follow Profile"}
                    </Button>
                    {/* {post.website && (
                        <Button
                            mx="0.5em"
                            variant="outline"
                            onClick={() => window.open(post.website, "_blank")}
                        >
                            Visit Website
                        </Button>
                    )} */}
                    <PostcardModal
                        isShow={showShareModal}
                        headerText="Share"
                        children={
                            <ModalShare
                                handleClose={() => setShowShareModal(false)}
                                {...shareData}
                            />
                        }
                        handleClose={() => setShowShareModal(false)}
                    />

                    {/* <PostcardModal
                        isShow={showModal.isShow}
                        headerText={
                            showModal.mode === "login"
                                ? "Sign in"
                                : "Free Sign Up!"
                        }
                        size={showModal.mode === "login" ? "xl" : "sm"}
                        // scrollBehavior={scrollbehav}
                        style={profile ? { padding: "0px" } : {}}
                        children={
                            <ModalSignupLogin
                                mode={showModal.mode}
                                isSchedulerOpen={true}
                                toggleMode={() =>
                                    setShowModal({
                                        isShow: true,
                                        mode:
                                            showModal.mode === "login"
                                                ? "signup"
                                                : "login"
                                    })
                                }
                                handleClose={() => {
                                    if (!showModal.doFollow)
                                        setShowModal(false);
                                }}
                            />

                        }
                        handleClose={() => setShowModal(false)}
                    /> */}
                    <>
                        <SignUpInModal
                            isShow={showModal.isShow}
                            mode={showModal.mode}
                            setShowModal={setShowModal}
                            setShowSignModal={setShowSignModal}
                        />
                        <SignUpInfoModal
                            state={showSignModal}
                            setShowSignModal={setShowSignModal}
                        />
                    </>
                </Flex>
            </>
        );
    };
    return (
        <TabDataLayout
            imageSrc={post.logo.url}
            title={pageTitle}
            description={post.description}
            countryList={countryList}
            filterAlbums={filterAlbums}
            affilLink={post.website}
            actionButtons={<ActionButtons />}
            tabData={tabData}
            pageLoading={pageLoading}
        />
    );
};
export default AllTours;
