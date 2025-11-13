import {
    Box,
    Avatar,
    Text,
    Button,
    UnorderedList,
    ListItem
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { avatar } from "./index.module.scss";

import AppContext from "../../../AppContext";
import { useSignupModal } from "../../../SignupModalContext";
// import ModalSignupLogin from "../../../ModalSignupLogin";

const ExpertCard = ({ expert, showFollow }) => {
    const [cardProfile, setCardProfile] = useState(expert);
    const [loading, setloading] = useState(true);
    const {
        profile,
        profileFriends,
        profileFriendsLoading,
        profileFriendsIdle,
        followUnFollowProfile
    } = useContext(AppContext);
    const { openLoginModal } = useSignupModal()
    const [visibilityChange, setvisibilityChange] = useState(false);
    const router = useRouter();
    const getPath = (expert) => {
        if (expert.slug) return "/u/hub/" + expert.slug;
        else return "/" + expert.slug;
    };
    useEffect(() => { }, [visibilityChange]);
    useEffect(() => {
        if (expert && !profileFriendsLoading && !profileFriendsIdle) {
            let friendExists = false;
            if (profileFriends && profileFriends.length > 0)
                profileFriends.map((invitation) => {
                    if (invitation.requested_profile?.id === expert?.id) {
                        friendExists = true;
                        expert.inviteId = invitation.id;
                    }
                    if (friendExists) {
                        expert.isFriend = true;
                    } else expert.isFriend = false;
                });
            setCardProfile(expert);
            setloading(false);
        }
    }, [expert]);

    return (
        expert &&
        !profileFriendsLoading &&
        !loading && (
            <Box
                bg="cardBackground"
                boxShadow="0px 2px 6px rgba(0, 0, 0, 0.16)"
                boxSizing="border-box"
                borderRadius="8px"
                p="8px"
                d="inline-block"
                mb="5%"
                onClick={() => {
                    global.$isTravelExpertsDetailPage = true;
                    router.push(getPath(expert));
                }}
                width="100%"
            >
                <Box pos="relative" m="-8px">
                    <Box
                        borderTopLeftRadius="8px"
                        borderTopRightRadius="8px"
                        pos="relative"
                        w="100%"
                        minH="200"
                        overflow="hidden"
                    >
                        <Image
                            src={
                                expert.s3CoverImageURLNew
                                    ? expert.s3CoverImageURLNew
                                    : expert.s3CoverImageURL
                                        ? expert.s3CoverImageURL
                                        : "/assets/images/p_stamp.png"
                            }
                            placeholder="blur"
                            objectFit="cover"
                            layout="fill"
                            alt="expert_image"
                            blurDataURL={
                                expert.s3CoverImageURLNew
                                    ? expert.s3CoverImageURLNew.replace(
                                        "/origin/small",
                                        "/thumbnail/thumbnail"
                                    )
                                    : "/assets/images/p_stamp.png"
                            }
                        ></Image>
                    </Box>
                    {expert.Type && (
                        <Box
                            boxSize="80px"
                            borderRadius="50%"
                            pos="absolute"
                            bottom="-15%"
                            left={["38%", "38%", "39%"]}
                            zIndex={999}
                            border="2px solid #fff"
                            overflow="hidden"
                        >
                            <Image
                                src={
                                    expert.s3PicURLNew
                                        ? expert.s3PicURLNew
                                        : "/assets/images/p_stamp.png"
                                }
                                alt="expert_avatar"
                                layout="fill"
                                objectFit="contain"
                            />
                        </Box>
                    )}
                </Box>
                <Box
                    pos="relative"
                    mt="20%!important"
                    textAlign="center"
                    m="auto"
                >
                    <Text
                        textAlign="center"
                        fontSize="16"
                        fontWeight="bold"
                        lineHeight="18px"
                        fontFamily="raleway"
                        color="primary_9"
                    >
                        {expert.Name}
                    </Text>
                    {expert.Type &&
                        expert.Type === "StoryTeller" &&
                        expert.postcards && (
                            <Text
                                textAlign="center"
                                fontSize="13px"
                                lineHeight="18px"
                                fontFamily="raleway"
                                color="primary_5"
                                marginTop="6px"
                            >
                                {expert.postcards.length} postcards
                            </Text>
                        )}
                    {!expert.Type && expert.postcardCount && (
                        <>
                            <Text
                                textAlign="center"
                                fontSize="13px"
                                lineHeight="18px"
                                fontFamily="raleway"
                                color="primary_5"
                                marginTop="6px"
                            >
                                {expert.postcardCount} postcards
                            </Text>

                            {expert.profiles && (
                                <UnorderedList
                                    mt="24px"
                                    mb="12px"
                                    styleType="none"
                                    display="flex"
                                    justifyContent="center"
                                    flexWrap="wrap"
                                >
                                    {expert.profiles.map((profile, index) => (
                                        <ListItem
                                            textAlign="center"
                                            cursor="pointer"
                                            mr="12px"
                                            pr="5px"
                                            pl="12px"
                                            mb="5%"
                                            bg="cardBackground"
                                            key={"hubprofile_" + index}
                                            borderLeftWidth="1px"
                                            borderColor="primary_1"
                                            _odd={{ borderLeftWidth: "0px" }}
                                        >
                                            <Text
                                                color="primary_6"
                                                fontSize="sm"
                                            >
                                                {profile.Name}
                                            </Text>
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            )}
                        </>
                    )}
                    {!expert.profile_types && (
                        <Text
                            textAlign="left"
                            colr="primary_6"
                            fontFamily="raleway"
                            lineHeight="1.5"
                            fontSize="1rem"
                            marginTop="10%!important"
                            m="5%"
                            fontWeight="400"
                            noOfLines={8}
                            textOverflow="ellipsis"
                            overflow="hidden"
                        >
                            {expert.Bio}
                        </Text>
                    )}
                    {expert.profile_types && (
                        <Text
                            textAlign="left"
                            noOfLines={8}
                            colr="primary_6"
                            fontFamily="raleway"
                            lineHeight="1.5"
                            fontSize="1rem"
                            marginTop="10%!important"
                            m="5%"
                            fontWeight="400"
                            textOverflow="ellipsis"
                            overflow="hidden"
                        >
                            {expert.description}
                        </Text>
                    )}
                    {showFollow && (
                        <Button
                            textAlign="center"
                            fontWeight="400"
                            variant="outline"
                            borderRadius="25"
                            height="30px"
                            lineHeight="24px"
                            fontSize="14px"
                            m="5%"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (profile) {
                                    followUnFollowProfile(
                                        expert,
                                        expert.inviteId,
                                        (invite) => {
                                            expert.isFriend = !expert.isFriend;
                                            expert.inviteId = invite.id;

                                            setvisibilityChange(
                                                !visibilityChange
                                            );
                                        }
                                    );
                                } else openLoginModal()
                            }}
                        >
                            {expert.isFriend ? "Following" : "Follow"}
                        </Button>
                    )}
                </Box>
            </Box>
        )
    );
};

export default ExpertCard;
