import { Box, Flex, Button, Text } from "@chakra-ui/react";
// import { RiDeleteBin6Line, RiAddFill } from "react-icons/ri";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import AppContext from "../../AppContext";
import TabsPart from "../../TabsPart";
import CollectionPanel from "./CollectionPanel";
import PostcardModal from "../../PostcardModal";
import ModalShare from "../../ModalShare";
// import ModalSignupLogin from "../../ModalSignupLogin";
import TourList from "../../AllTours/TourList";
import {
    getPostcardsbyTags,
    updateLeads
} from "../../../queries/strapiQueries";
import { FlexBox } from "../../../styles/Layout/FlexBox";
import TravelPostcardList from "../../TravelExplore/TravelPostcardList";
// import ContactUsForm from "../../ContactUsForm";
import { exampleCallback } from "../../../services/utilities";
import CountryFilter from "../../AllTours/CountryFilter";
import SignUpInModal from "../../HomePage1/SignUpInModal";
import SignUpInfoModal from "../../HomePage1/SignUpInfoModal";

const TravelExpertsDetailContainer = ({
    postcardsData,
    isPostcardsLoading,
    stories,
    isStoriesLoading,
    bkmStory,
    profile,
    refetch,
    isForm,
    podCastsData,
    expertType,
    ispodCastsLoading,
    refetchPostcards,
    currentProfile,
    type
}) => {
    const { isTablet, isTabletOrMobile, isActiveProfile } =
        useContext(AppContext);
    const [shareData, setShareData] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showModal, setShowModal] = useState({
        mode: "",
        isShow: false
    });
    const [displayPostcards, setDisplayPostcards] = useState([]);
    const [loginModal, setLoginModal] = useState({ mode: "", isShow: false });
    const [showSignModal, setShowSignModal] = useState({
        isShow: false,
        title: "",
        message: ""
    });
    const [showContact, setShowContact] = useState(false);
    const [scrollbehav, setscrollBehaviour] = useState("outside");
    const [modalSize, setModalSize] = useState("xl");
    const [isLeadApproved, setLeadApproved] = useState(
        type === "Leads" ? currentProfile?.status : false
    );
    const [isCopied, setIsCopied] = useState(false);
    const router = useRouter();
    const leadData = currentProfile?.lead
        ? currentProfile.lead
        : currentProfile?.lead_hotel
            ? currentProfile?.lead_hotel
            : currentProfile?.lead_tour
                ? currentProfile?.lead_tour
                : currentProfile;
    const getPostcardstoDisplay = () => {
        // console.log(bkmStory, postcardsData, currentProfile);
        let pcs =
            postcardsData.length > 0
                ? postcardsData
                : currentProfile?.user?.albums[0]?.postcards?.length
                    ? currentProfile?.user?.albums[0]?.postcards
                    : [];
        pcs = bkmStory?.postcards.concat(pcs);
        // console.log(pcs);
        return pcs;
    };
    useEffect(() => {
        // if (bkmStory && bkmStory?.postcards?.length)
        //     setDisplayPostcards(getPostcardstoDisplay());
        // else
        setDisplayPostcards(
            postcardsData.length > 0
                ? postcardsData
                : currentProfile?.user?.albums[0]?.postcards?.length
                    ? currentProfile?.user?.albums[0]?.postcards
                    : []
        );
    }, [bkmStory, postcardsData, currentProfile]);

    useEffect(() => { }, [leadData]);
    const tabData = [
        {
            name: "Experiences",
            childComp: (
                <Box w="100%">
                    {displayPostcards.length === 0 && (
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
                    {displayPostcards.length !== 0 && (
                        <>
                            <TravelPostcardList
                                postcards={displayPostcards}
                                isHomePage={true}
                                canEdit={true}
                                refetch={refetch}
                                handlePublish={refetch}
                                isMobile={isTabletOrMobile}
                                isTab={isTablet}
                                onShareClick={(shareData) => {
                                    setShareData({
                                        ...shareData
                                    });
                                    setShowShareModal(true);
                                }}
                                isPostcardsLoading={isPostcardsLoading}
                            />
                        </>
                    )}
                </Box>
            )
        },
        {
            name: expertType === "Hotels" ? "Stays" : "Tours",
            childComp:
                stories && stories.length ? (
                    <Box w="100%">
                        <CollectionPanel
                            stories={stories}
                            refetch={refetch}
                            isStoriesLoading={isStoriesLoading}
                            isTabletOrMobile={isTabletOrMobile}
                            expert={currentProfile}
                        ></CollectionPanel>
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
    const checkAndAddArticle = async (link) => {
        // if (
        //     link.match(
        //         /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
        //     )
        // ) {
        //     let data = [{ link: link }];
        //     let resp = await fetchMetaTags(data);
        //     let articleData = formik.values.article;
        //     let publicationName = formik.values.publication.filter((publish) =>
        //         link.includes(publish.validationString)
        //     );
        //     if (publicationName.length > 0) {
        //         resp[0].publicationName = publicationName[0].name;
        //     } else
        //         publicationName = [
        //             { id: 8, name: "Other", validationString: null }
        //         ];
        //     if (articleData && articleData.length > 0) {
        //         articleData.push({
        //             link: link,
        //             publish: publicationName[0] ? publicationName[0].name : "",
        //             publicationId: publicationName[0]
        //                 ? publicationName[0].id
        //                 : "",
        //             title: resp[0] ? resp[0].title : link
        //         });
        //     } else
        //         articleData = [
        //             {
        //                 link: link,
        //                 publish: publicationName[0]
        //                     ? publicationName[0].name
        //                     : "",
        //                 publicationId: publicationName[0]
        //                     ? publicationName[0].id
        //                     : "",
        //                 title: resp[0] ? resp[0].title : link
        //             }
        //         ];
        // }
    };
    const profileTabs =
        currentProfile?.albums?.length || currentProfile?.user?.albums.length
            ? [
                {
                    name: "Articles",
                    childComp: (
                        <Box w="100%">
                            {leadData && leadData?.article?.length === 0 && (
                                <Text
                                    my={"10%"}
                                    mx="auto"
                                    variant={"aboutTitles"}
                                    fontWeight="bold"
                                    color="primary_3"
                                    textAlign={"center"}
                                    fontSize={["18px", "24px"]}
                                >
                                    Coming soon...
                                </Text>
                            )}
                            {leadData && leadData.article?.length > 0 && (
                                <TourList
                                    isArticle={true}
                                    isActiveProfile={isActiveProfile(
                                        leadData?.user
                                            ? leadData.user
                                            : currentProfile
                                    )}
                                    data={leadData.article}
                                ></TourList>
                            )}
                        </Box>
                    )
                },
                {
                    name: "Pages",
                    childComp: (
                        <Box w="100%">
                            <CollectionPanel
                                stories={
                                    currentProfile.albums
                                        ? currentProfile.albums
                                        : currentProfile?.user?.albums
                                }
                                isTabletOrMobile={isTabletOrMobile}
                                expert={currentProfile}
                            ></CollectionPanel>
                        </Box>
                    )
                },
                {
                    name: "Experiences",
                    childComp: (
                        <Box w="100%">
                            {displayPostcards.length === 0 && (
                                <Text
                                    my={"10%"}
                                    mx="auto"
                                    variant={"aboutTitles"}
                                    fontWeight="bold"
                                    color="primary_3"
                                    textAlign={"center"}
                                    fontSize={["18px", "24px"]}
                                >
                                    Coming soon...
                                </Text>
                            )}
                            {displayPostcards.length !== 0 && (
                                <>
                                    <TravelPostcardList
                                        postcards={displayPostcards}
                                        canEdit={true}
                                        isMobile={isTabletOrMobile}
                                        refetch={refetchPostcards}
                                        handlePublish={refetchPostcards}
                                        isTab={isTablet}
                                        isHomePage={true}
                                        onShareClick={(shareData) => {
                                            setShareData({
                                                ...shareData
                                            });
                                            setShowShareModal(true);
                                        }}
                                        isPostcardsLoading={
                                            isPostcardsLoading
                                        }
                                    />
                                </>
                            )}
                        </Box>
                    )
                }
            ]
            : [
                {
                    name: "Articles",
                    childComp: (
                        <Box w="100%">
                            {/* {isActiveProfile(
                              leadData?.user ? leadData.user : currentProfile
                          ) && (
                              <InputGroup>
                                  <Input
                                      type="text"
                                      id="articleLink"
                                      name="articleLink"
                                      mt="1%"
                                      variant="editProfileInput"
                                      placeholder="Add a link to your published article"
                                  ></Input>
                                  <InputRightElement
                                      mt="1%"
                                      children={
                                          <Icon
                                              as={RiAddFill}
                                              color="primary_1"
                                              boxSize="25px"
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  checkAndAddArticle(
                                                      " formik.values.articleLink"
                                                  );
                                              }}
                                          />
                                      }
                                  />
                              </InputGroup>
                          )} */}
                            {leadData && leadData?.article?.length === 0 && (
                                <Text
                                    my={"10%"}
                                    mx="auto"
                                    variant={"aboutTitles"}
                                    fontWeight="bold"
                                    color="primary_3"
                                    textAlign={"center"}
                                    fontSize={["18px", "24px"]}
                                >
                                    Coming soon...
                                </Text>
                            )}
                            {leadData && leadData.article?.length > 0 && (
                                <TourList
                                    isArticle={true}
                                    isActiveProfile={isActiveProfile(
                                        leadData?.user
                                            ? leadData.user
                                            : currentProfile
                                    )}
                                    data={leadData.article}
                                ></TourList>
                            )}
                        </Box>
                    )
                }
            ];
    const shuffleStory = (storyList) => {
        let storyWithPostcard = storyList.filter(
            (item) => item?.postcards?.length > 0
        );
        let storyWithoutPostcard = storyList
            .filter((item) => item?.postcards?.length <= 0)
            .sort(() => Math.random() - 0.5);

        return storyWithPostcard.concat(storyWithoutPostcard);
    };

    return (
        <FlexBox variant="travelExpert" mt="0%!important">
            <TabsPart tabData={tabData}></TabsPart>

            {!isActiveProfile(currentProfile) && type === "Leads" && (
                <Box w="100%" m="auto" mb={["3%", "1%"]} textAlign={"justify"}>
                    {/* <Box mt={["9%", "3%"]}>
                        {currentProfile.user_type?.name === "StoryTeller" ? (
                            <TabsPart tabData={[profileTabs[0]]}></TabsPart>
                        ) : (
                            <TabsPart tabData={profileTabs}></TabsPart>
                        )}
                    </Box> */}
                    {leadData?.editorialFee && isForm && (
                        <Box
                            w={["100%", "92%"]}
                            m="auto"
                            mt={["9%", "3%"]}
                            mb={["9%", "3%"]}
                            textAlign={"justify"}
                        >
                            <Text
                                p="3px"
                                mb={["6%", "1%"]}
                                variant="subHeading"
                                fontSize={["18px", "24px"]}
                                fontWeight={"bold"}
                            >
                                Editorial fee <br />
                                <Text fontSize={["15px", "18px"]}>
                                    (12 stories, 300-350 words each)
                                </Text>
                            </Text>
                            <Text
                                mx="auto"
                                my={["3%", "1%"]}
                                variant={"aboutTitles"}
                                fontWeight="bold"
                                fontFamily={"raleway"}
                                color="primary_3"
                                textAlign={"center"}
                                fontSize={["18px", "24px"]}
                            >
                                {leadData.editorialFee} /-
                            </Text>
                        </Box>
                    )}
                    {/* {currentProfile?.article?.length !== 0 && (
                        <Text
                            pb="0px!important"
                            fontWeight={"bold"}
                            mt={["9%", "3%"]}
                            variant="subHeading"
                            fontSize={["18px", "24px"]}
                        >
                            Featured Albums
                        </Text>
                    )}

                    {currentProfile && currentProfile.albums?.length > 0 && (
                        <TourList
                            data={
                                currentProfile.albums
                                    ? currentProfile.albums
                                    : []
                            }
                        ></TourList>
                    )}

                    {leadData?.article?.length !== 0 && (
                        <Text
                            pb="0px!important"
                            fontWeight={"bold"}
                            mt={["9%", "3%"]}
                            variant="subHeading"
                            fontSize={["18px", "24px"]}
                        >
                            Featured Articles
                        </Text>
                    )}
                    {leadData &&
                        leadData?.article?.length === 0 &&
                        currentProfile?.albums?.length === 0 && (
                            <Text
                                my={"10%"}
                                mx="auto"
                                variant={"aboutTitles"}
                                fontWeight="bold"
                                color="primary_3"
                                textAlign={"center"}
                                fontSize={["18px", "24px"]}
                            >
                                Coming soon...
                            </Text>
                        )}
                    {leadData && leadData.article?.length > 0 && (
                        <TourList data={leadData.article}></TourList>
                    )} */}
                    {leadData?.editorialFee && !isForm && (
                        <Box textAlign="center" mb={["45px", "5%"]}>
                            <Text
                                variant={"aboutTitles"}
                                fontWeight="bold"
                                color="black"
                                textAlign={"center"}
                                fontSize={["18px", "24px"]}
                                mb="2%"
                            >
                                Storytelling Fee
                            </Text>
                            <Text fontSize={["15px", "18px"]}>
                                (12 stories, 300-350 words each)
                            </Text>
                            <Text
                                variant={"aboutTitles"}
                                color="black"
                                fontStyle={"italic"}
                                fontWeight="500"
                                textAlign={"center"}
                                fontSize={"15px"}
                                my="2%"
                            >
                                {leadData.editorialFee}
                            </Text>

                            <Button
                                height="50px"
                                mt={["15px", "3%"]}
                                px={5}
                                onClick={() => {
                                    if (profile) setShowContact(true);
                                    else
                                        setLoginModal({
                                            isShow: true,
                                            mode: "login",
                                            isContact: true
                                        });
                                }}
                            >
                                Contact {currentProfile.fullName}
                            </Button>
                        </Box>
                    )}
                    {/* <PostcardModal
                        isShow={loginModal.isShow}
                        headerText={
                            showModal.mode === "login"
                                ? "Sign in"
                                : "Free Sign Up!"
                        }
                        size={showModal.mode === "login" ? "xl" : "sm"}
                        children={
                            <ModalSignupLogin
                                mode={loginModal.mode}
                                toggleMode={() =>
                                    setLoginModal({
                                        isShow: true,
                                        mode:
                                            loginModal.mode === "login"
                                                ? "signup"
                                                : "login"
                                    })
                                }
                                handleClose={() => {
                                    if (loginModal.isContact)
                                        setShowContact(true);
                                    else setLoginModal({ isShow: false });
                                }}
                            />
                        }
                        handleClose={() => {
                            setLoginModal({ isShow: false });
                        }}
                    /> */}
                    <SignUpInModal
                        isShow={loginModal.isShow}
                        mode={loginModal.mode}
                        setShowModal={setLoginModal}
                        setShowSignModal={setShowSignModal}
                    />
                    <SignUpInfoModal
                        state={showSignModal}
                        setShowSignModal={setShowSignModal}
                    />
                    <PostcardModal
                        isShow={showContact}
                        headerText={"Contact " + currentProfile?.fullName}
                        size={modalSize}
                        scrollBehavior={scrollbehav}
                        children={
                            <></>
                            // <ContactUsForm
                            //     profile={currentProfile}
                            //     onClose={() => {
                            //         setShowContact(false);
                            //         setShowModal(false);
                            //     }}
                            // />
                        }
                        handleClose={() => {
                            setShowContact(false);
                            setShowModal(false);
                        }}
                    />

                    {type === "Leads" &&
                        profile?.user_type &&
                        (profile?.user_type?.name === "SuperAdmin" ||
                            profile?.user_type?.name === "Admin") && (
                            <Box w={"100%"} m="auto" textAlign={"center"}>
                                <Flex
                                    w={["100%", "100%", "60%"]}
                                    m="auto"
                                    direction={["column", "row"]}
                                    my={"6%"}
                                    justify="space-around"
                                    textAlign={"center"}
                                >
                                    {leadData.accessCode && (
                                        <Button
                                            my={["3%", ""]}
                                            onClick={() => {
                                                let link =
                                                    "https://postcard.travel/storyteller-application?editCode=" +
                                                    leadData.accessCode;
                                                const el =
                                                    document.createElement(
                                                        "input"
                                                    );
                                                el.value = link;
                                                document.body.appendChild(el);
                                                el.select();
                                                document.execCommand("copy");
                                                document.body.removeChild(el);
                                                setIsCopied(true);
                                            }}
                                        >
                                            {isCopied
                                                ? "Copied"
                                                : "Copy Edit URL"}
                                        </Button>
                                    )}
                                    {leadData.email && (
                                        <Button
                                            my={["3%", ""]}
                                            onClick={() => {
                                                window &&
                                                    window?.open(
                                                        "mailto:" +
                                                        currentProfile.email +
                                                        "?subject=Your Postcard Onboarding Status"
                                                    );
                                            }}
                                        >
                                            Mail to
                                        </Button>
                                    )}
                                    <Button
                                        my={["3%", ""]}
                                        onClick={() => {
                                            if (isLeadApproved !== "approved") {
                                                let data = {
                                                    status: "approved"
                                                };
                                                updateLeads(
                                                    currentProfile.id,
                                                    data
                                                ).then((resp) => {
                                                    if (resp) {
                                                        setLeadApproved(
                                                            resp?.data?.status
                                                        );
                                                    }
                                                });
                                            } else if (
                                                isLeadApproved === "approved"
                                            ) {
                                                let data = {
                                                    status: "lead"
                                                };
                                                updateLeads(
                                                    currentProfile.id,
                                                    data
                                                ).then((resp) => {
                                                    if (resp) {
                                                        setLeadApproved(
                                                            resp?.data?.status
                                                        );
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {isLeadApproved === "approved"
                                            ? "Approved"
                                            : "Approve"}
                                    </Button>
                                    <Button
                                        my={["3%", ""]}
                                        onClick={() => {
                                            if (isLeadApproved !== "archived") {
                                                let data = {
                                                    status: "archived"
                                                };
                                                updateLeads(
                                                    currentProfile.id,
                                                    data
                                                ).then((resp) => {
                                                    if (resp) {
                                                        setLeadApproved(
                                                            resp?.data?.status
                                                        );
                                                    }
                                                });
                                            } else if (
                                                isLeadApproved === "archived"
                                            ) {
                                                let data = {
                                                    status: "lead"
                                                };
                                                updateLeads(
                                                    currentProfile.id,
                                                    data
                                                ).then((resp) => {
                                                    if (resp) {
                                                        setLeadApproved(
                                                            resp?.data?.status
                                                        );
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {isLeadApproved === "archived"
                                            ? "Archived"
                                            : "Archive"}
                                    </Button>
                                    <Button
                                        my={["3%", ""]}
                                        onClick={() => {
                                            if (isLeadApproved !== "dropped") {
                                                let data = {
                                                    status: "dropped"
                                                };
                                                updateLeads(
                                                    currentProfile.id,
                                                    data
                                                ).then((resp) => {
                                                    if (resp) {
                                                        setLeadApproved(
                                                            resp?.data?.status
                                                        );
                                                    }
                                                });
                                            } else if (
                                                isLeadApproved === "dropped"
                                            ) {
                                                let data = {
                                                    status: "lead"
                                                };
                                                updateLeads(
                                                    currentProfile.id,
                                                    data
                                                ).then((resp) => {
                                                    if (resp) {
                                                        setLeadApproved(
                                                            resp?.data?.status
                                                        );
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {isLeadApproved === "dropped"
                                            ? "Dropped"
                                            : "Drop"}
                                    </Button>
                                </Flex>
                            </Box>
                        )}
                </Box>
            )}
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
        </FlexBox>
    );
};

export default TravelExpertsDetailContainer;
