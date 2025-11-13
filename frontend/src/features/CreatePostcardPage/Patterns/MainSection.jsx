import { Box, Text, VStack, Input, Divider, Flex, Textarea } from "@chakra-ui/react";
import AddImage from "../Properties/AddImage";
import { ImageIcon } from "../../../styles/ChakraUI/icons";
import { Field, FieldArray } from "formik";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import SubSection from "./SubSection";
import { AddIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import CreatePostcards from "./CreatePostcards";
import Postcard from "../../TravelExplore/TravelPostcardList/Postcard";
import AppContext from "../../AppContext";
import DraftsCard from "../../DraftsCard";

const MainSection = (props) => {
    const {
        name,
        image,
        id,
        subSections,
        content,
        hasSubsection,
        hasSubTitle,
        formikProps,
        refetchNewsArticle,
        deleteSubsection,
        blogPost,
        ...styleProps
    } = props;

    const { canCreatePostcard } = useContext(AppContext)
    const [newsArticle, setNewsArticle] = useState(blogPost || null)
    const [showAddSection, setShowAddSection] = useState(true);

    useEffect(() => {
        setNewsArticle(blogPost)
    }, [blogPost])

    return (
        <Box {...styleProps} gap="40px" display={"grid"} id={name} w="100%">
            <Text fontWeight={700} fontSize={"50px"} color="#8F8F8F" mr="20%">
                {name ?? "Others"}
            </Text>

            <FieldArray
                name="block"
                render={(arrayHelper) => (
                    <>
                        {formikProps.values.block &&
                            formikProps.values.block.length > 0 &&
                            formikProps.values.block.map((sec, index) => {
                                return (
                                    sec.album_section &&
                                    sec.album_section.id === id && (
                                        <SubSection
                                            {...sec}
                                            index={index}
                                            blogPostId={newsArticle?.id}
                                            mainSectionId={id}
                                            formikProps={formikProps}
                                            onDelete={() => {
                                                arrayHelper.remove(index);

                                                setShowAddSection(
                                                    formikProps.values.block.filter(
                                                        (sec) =>
                                                            sec.album_section
                                                                ?.id === id
                                                    ).length === 1 ||
                                                    hasSubsection
                                                );
                                            }}
                                        />
                                    )
                                );
                            })}

                        {showAddSection && id !== 7 && (
                            <AddImage
                                icon={<AddIcon />}
                                text={"Add Subsection"}
                                onClick={() => {
                                    arrayHelper.push({
                                        title: "",
                                        content: "",
                                        album_section: { id: id },
                                        suborder:
                                            formikProps.values.block
                                                .map((sec) => sec.album_section)
                                                .filter(
                                                    (album_section) =>
                                                        album_section.id === id
                                                ).length + 1,
                                        imageUrl: null
                                    });

                                    setShowAddSection(hasSubsection);
                                }}
                            />
                        )}
                        {/* {id === 7 && (
                            <>
                                <Flex
                                    id={
                                        "Postcard Experiences"
                                    }
                                    zIndex={100}
                                    w={"80%"}
                                    mx={"-5%"}
                                    bg={"#111111"}
                                    paddingBottom={[
                                        "25vw",
                                        "0px"
                                    ]}
                                    pl={[0, "8.68vw"]}
                                    gap={[
                                        "2vw",
                                        "2.78vw"
                                    ]}
                                    flexDirection={[
                                        "column",
                                        "row"
                                    ]}
                                    borderTopRadius={[
                                        "4.167vw",
                                        "2.08vw"
                                    ]}
                                >
                                    <Box
                                        w={[
                                            "72.22vw",
                                            "21.46vw"
                                        ]}
                                        pt={[
                                            "15.55vw",
                                            "11.18vw"
                                        ]}
                                        pb={[
                                            0,
                                            "9.1vw"
                                        ]}
                                        mx={[
                                            "auto",
                                            ""
                                        ]}
                                    >
                                        <Text
                                            fontSize={[
                                                "6.4vw",
                                                "3.33vw"
                                            ]}
                                            lineHeight={[
                                                "6.67vw",
                                                "3.61vw"
                                            ]}
                                            fontFamily={
                                                "lora"
                                            }
                                            fontStyle={
                                                "italic"
                                            }
                                            color={
                                                "#EFE9E4"
                                            }
                                        >
                                            Postcard
                                            Experiences
                                        </Text>

                                        <Flex
                                            mt={[
                                                "6.67vw",
                                                "5vw"
                                            ]}
                                            flexWrap={
                                                "wrap"
                                            }
                                            gap={[
                                                "2.5vw",
                                                "1.04vw"
                                            ]}
                                        >
                                            {tagList?.map(
                                                (
                                                    tag,
                                                    index
                                                ) => (
                                                    <Text
                                                        onClick={() =>
                                                            handleTagClick(
                                                                tag
                                                            )
                                                        }
                                                        key={
                                                            index
                                                        }
                                                        border={
                                                            "1px"
                                                        }
                                                        borderColor={
                                                            "#EFE9E4"
                                                        }
                                                        color={
                                                            "#EFE9E4"
                                                        }
                                                        h={[
                                                            "7.5vw",
                                                            "2.92vw"
                                                        ]}
                                                        lineHeight={[
                                                            "6.5vw",
                                                            "2.92vw"
                                                        ]}
                                                        px={[
                                                            "3.33vw",
                                                            "1.74vw"
                                                        ]}
                                                        fontSize={[
                                                            "3.62vw",
                                                            "1.18vw"
                                                        ]}
                                                        borderRadius={[
                                                            "8.88vw",
                                                            "3vw"
                                                        ]}
                                                        fontFamily={
                                                            "raleway"
                                                        }
                                                    >
                                                        {
                                                            tag
                                                        }
                                                    </Text>
                                                )
                                            )}
                                        </Flex>
                                    </Box>

                                    <Flex
                                        px={[
                                            "5.8vw",
                                            "3.26vw"
                                        ]}
                                        w={[
                                            "100%",
                                            "63.82vw"
                                        ]}
                                        pt={[
                                            0,
                                            "11.18vw"
                                        ]}
                                        pb={[
                                            0,
                                            "9.1vw"
                                        ]}
                                        mt={[
                                            "11.18vw",
                                            0
                                        ]}
                                        mb={[
                                            "9.1vw",
                                            0
                                        ]}
                                        overflowX={
                                            "auto"
                                        }
                                        gap={[
                                            "8.88vw",
                                            "1.36vw"
                                        ]}
                                        className="no-scrollbar"
                                        flexDirection={[
                                            "column",
                                            "row"
                                        ]}
                                    >
                                        {newsArticle.album.postcards.map(
                                            (
                                                postcard,
                                                index
                                            ) => {
                                                // console.log(postcard)
                                                if (!postcard) return;
                                                postcard.isEdit = postcard?.isEdit || !(postcard?.story && postcard?.intro && postcard?.country)
                                                return (
                                                    postcard?.isComplete && !postcard?.isEdit ? (
                                                        <Postcard
                                                            key={
                                                                postcard?.id
                                                            }
                                                            postcard={
                                                                postcard
                                                            }
                                                            from={
                                                                "albumPage"
                                                            }
                                                            setIsEdit={(value) => {
                                                                let postcards = newsArticle.album.postcards
                                                                postcards[index] = { ...postcard, isEdit: value }
                                                                setNewsArticle((prev) => ({ ...prev, album: { ...prev.album, postcards } }))
                                                            }
                                                            }
                                                            canEdit={canCreatePostcard(newsArticle)}
                                                            refetch={async () => await refetchNewsArticle(newsArticle?.id)}
                                                        />
                                                    ) :
                                                        <DraftsCard postcard={postcard} isEdit={postcard?.isEdit} refetch={async () => await refetchNewsArticle(newsArticle?.id)} />
                                                )
                                            }
                                        )}
                                    </Flex>
                                </Flex>

                                <CreatePostcards
                                    album={newsArticle?.album}
                                    refetchNewsArticle={refetchNewsArticle}
                                />
                            </>
                        )} */}
                    </>
                )}
            />
            <Divider
                my="3em"
                width="80%"
                borderBottomWidth="1.5px"
                borderColor="#5A5A5A"
            />
        </Box>
    );
};
export default MainSection;
