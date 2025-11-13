import { Box, Button } from "@chakra-ui/react";
import { TagIcon } from "../../../styles/ChakraUI/icons";
import PostcardModal from "../../PostcardModal";
import TagSelection from "../../GuidedSearch/TagSelection";
import { useRef, useState } from "react";

const SelectInterest = ({
    editTags,
    setEditTags,
    tagList,
    customButton,
    onClear
}) => {
    const [showEditTags, setShowEditTags] = useState(false);
    const btnRef = useRef(null);
    let buttonStyle = {};
    if (!editTags || editTags.length == 0) {
        buttonStyle = {
            variant: "outlined",
            border: "1px solid #EA6147",
            color: "#EA6147"
        };
    }

    const handleShowInterest = () => setShowEditTags(!showEditTags);
    return (
        <>
            {customButton ? (
                customButton(handleShowInterest)
            ) : (
                <Button
                    {...buttonStyle}
                    height={"36px"}
                    onClick={() => {
                        setShowEditTags(!showEditTags);
                    }}
                >
                    <TagIcon
                        color={
                            !editTags || editTags.length == 0
                                ? "#EA6147"
                                : "white"
                        }
                        mr="5px"
                        w="16px"
                        h="16px"
                    />
                    {editTags?.length == 0
                        ? "Filter Interest"
                        : editTags.length}
                </Button>
            )}
            <PostcardModal
                isShow={showEditTags}
                headerText={"Select Interests"}
                children={
                    <Box w="100%" px="2%" mx="auto" textAlign={"center"}>
                        <TagSelection
                            hideTitle={true}
                            btnRef={btnRef}
                            showOptions={showEditTags}
                            setSelectedTags={(tags) => {
                                // console.log(tags)
                                //if (tags && tags.length > 0) {
                                setEditTags(tagList?.filter(tag => tags?.some(t => t === tag.name)));
                                // setSelectedValues((prev) => ({
                                //     ...prev,
                                //     tags: tags,
                                //     selectedTags: tags
                                // }));

                                // else {
                                //     setSelectedTags(selectedValues.tags);
                                //     setSelectedValues((prev) => ({
                                //         ...prev,
                                //         tags: selectedValues.tags,
                                //         selectedTags: selectedValues.tags
                                //     }));
                                // }
                            }}
                            tagList={tagList?.map(t => t.name)}
                            selectedValues={editTags?.map(t => t.name)}
                        />
                    </Box>
                }
                footerChildren={
                    <>
                        <Button
                            mx="0.5em"
                            mb="0.5em"
                            ref={btnRef}
                            isDisabled={!editTags || editTags?.length <= 0}
                            textAlign="center"
                            width="20%"
                            onClick={() => {
                                setEditTags([]);
                                setShowEditTags(false);
                                onClear && onClear();
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            mx="0.5em"
                            mb="0.5em"
                            ref={btnRef}
                            isDisabled={!editTags || editTags?.length <= 0}
                            textAlign="center"
                            width="20%"
                            onClick={() => {
                                setShowEditTags(false);
                            }}
                        >
                            Next
                        </Button>
                    </>
                }
                handleClose={() => setShowEditTags(false)}
                style={{
                    padding: "2%",
                    width: "100%",
                    minHeight: "50vh",
                    position: "relative"
                }}
                size={"3xl"}
            />
        </>
    );
};

export default SelectInterest;
