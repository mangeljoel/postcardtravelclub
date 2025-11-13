import { Box, Text, Textarea, Input } from "@chakra-ui/react";
import AddImage from "../Properties/AddImage";
import React, { useEffect, useState } from "react";
import { ImageIcon } from "../../../styles/ChakraUI/icons";
import { Field } from "formik";
import { CloseIcon, DeleteIcon, Icon } from "@chakra-ui/icons";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import { getUrlOfUploadImage } from "../../../services/utilities";
import MarkdownEditor from "../Properties/MarkdownEditor";
import { RiDeleteBin6Line } from "react-icons/ri";
import PostcardAlert from "../../PostcardAlert";
import { updateDBValue } from "../../../queries/strapiQueries";
import { apiNames } from "../../../services/fetchApIDataSchema";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Link
} from "@chakra-ui/react";
import PostcardModal from "../../PostcardModal";

const SubSection = (props) => {
    const { index, suborder, onDelete, blogPostId, formikProps } = props;
    const [deleteAlert, setDeleteAlert] = useState({
        message: "Are your sure to delete this section?",
        mode: false
    });
    const [showAddButton, setShowAddButton] = useState(false);
    // const imageUrl =
    //     formikProps.values.block && formikProps.values.block.length > 0
    //         ? formikProps.values.block[index]?.imageUrl
    //         : "";
    // const src = useMemo(() => {
    //     return imageUrl ? URL.createObjectURL(imageUrl) : "";
    // }, [imageUrl]);

    return (
        <Box
            {...props}
            mr="20%"
            gap="40px"
            display={"grid"}
            id={formikProps?.values?.block[index].title}
            pos="relative"
        >
            <Icon
                as={RiDeleteBin6Line}
                cursor={"pointer"}
                color={"primary_1"}
                pos="absolute"
                right="8px"
                size={"xl"}
                zIndex={999}
                top="8px"
                onClick={() =>
                    setDeleteAlert({
                        mode: true,
                        message: "Are your sure to delete this section?"
                    })
                }
            />
            <PostcardAlert
                isCentered={true}
                closeOnEsc={true}
                closeOnOverlayClick={true}
                show={deleteAlert}
                closeAlert={() => setDeleteAlert({ mode: false })}
                handleAction={() => {
                    onDelete();
                }}
                buttonText="DELETE"
            />
            <Field
                as={Input}
                px={0}
                // id={`block.${index}.title`}
                name={`block.${index}.title`}
                type="text"
                fontSize="32px"
                color="#5A5A5A"
                fontWeight={600}
                placeholder="Enter Subtitle..."
                border="none"
                _focusVisible={{ borderColor: "transparent" }}
                onBlur={(e) => {
                    if (formikProps && blogPostId && formikProps.values?.block)
                        updateDBValue(apiNames.newsArticles, blogPostId, {
                            block: formikProps.values?.block
                        });
                }}
            />
            {/* <Input
                mb={2}
                placeholder="Title"
                value={formikProps.values.block[index].title}
                onChange={(e) =>
                    formikProps.setFieldValue(
                        `block[${index}].title`,
                        e.target.value
                    )
                }
            /> */}

            {formikProps.values.block &&
                formikProps.values.block.length > 0 &&
                formikProps.values.block[index]?.image?.url && (
                    <Box my="1em" pos="relative">
                        <Text
                            pos="absolute"
                            mx="auto"
                            textAlign={"center"}
                            zIndex={999}
                            top="2em"
                            right="16px"
                            color="primary_1"
                            fontWeight={700}
                            fontSize={"md"}
                            bg="white"
                            px="5px"
                            cursor="pointer"
                            borderColor={"primary_1"}
                            borderWidth={"2px"}
                            borderRadius={"20px"}
                            onClick={() => {
                                document
                                    .getElementById(`block.${index}.imageSrc`)
                                    .click();
                            }}
                        >
                            Change
                        </Text>

                        <ChakraNextImage
                            mt="1em"
                            src={
                                formikProps.values.block[index]?.image?.url ??
                                ""
                            }
                            w="100%"
                            display={
                                formikProps.values.block[index]?.image?.url
                                    ? "block"
                                    : "none" // Dynamically generate the field name
                            }
                            ratio={4 / 3}
                            objectFit="cover"
                            boxShadow="3px 3px 6px rgba(0, 0, 0, 0.16)"
                            alt={
                                formikProps.values.block[index]?.imageUrl
                                // Dynamically generate the field name
                            }
                            borderRadius={"md"}
                            overflow="hidden"
                        />
                    </Box>
                )}
            {!formikProps.values.block[index]?.image?.url && (
                <AddImage
                    width="fit-content"
                    icon={<ImageIcon w="20px" h="20px" />}
                    text={"Add Image"}
                    onClick={() => {
                        document
                            .getElementById(`block.${index}.imageSrc`)
                            .click();
                    }}
                />
            )}
            <Field
                as={Input}
                type={"file"}
                display="none"
                id={`block.${index}.imageSrc`}
                name={`block.${index}.imageSrc`}
                onChange={async (event) => {
                    // formikProps.setFieldValue(
                    //     `block.${index}.imageUrl`,
                    //     event.target.files[0]
                    // );

                    await getUrlOfUploadImage(
                        event.target.files[0],
                        (result) => {
                            if (result) {
                                formikProps.setFieldValue(
                                    `block.${index}.image.url`,
                                    result.url
                                );
                                formikProps.setFieldValue(
                                    `block.${index}.image.id`,
                                    result.id
                                );
                            }
                        }
                    );
                }}
            />
            {formikProps.values.block[index]?.image?.url && (
                <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    mt="-10"
                    color="#a8a8a8"
                >
                    Photo Copyright:&nbsp;
                    <Input
                        px={0}
                        // id={`block.${index}.title`}
                        name={`block.${index}.imageCopyright`}
                        value={formikProps.values.block[index].imageCopyright}
                        type="text"
                        width="300px"
                        fontSize="15px"
                        color="#a8a8a8"
                        placeholder="Enter Copyright..."
                        _placeholder={{ color: "#a8a8a8" }}
                        p={2}
                        // border="none"
                        // _focusVisible={{ borderColor: "transparent" }}
                        onChange={(e) =>
                            formikProps.setFieldValue(
                                `block[${index}].imageCopyright`,
                                e.target.value
                            )
                        }
                    />
                </Flex>
            )}

            <Box my="1em">
                <Field
                    px={0}
                    id={`block.${index}.content`}
                    name={`block.${index}.content`}
                    type="text"
                >
                    {({ field }) => (
                        //console.log(field);
                        <MarkdownEditor
                            // key={index}
                            id={`block.${index}.content`}
                            {...field}
                            onBlur={(e) => {
                                if (
                                    formikProps &&
                                    blogPostId &&
                                    formikProps.values?.block
                                )
                                    updateDBValue(
                                        apiNames.newsArticles,
                                        blogPostId,
                                        {
                                            block: formikProps.values?.block
                                        }
                                    );
                            }}
                            onChange={(e) =>
                                formikProps.setFieldValue(
                                    `block.${index}.content`,
                                    e
                                )
                            }
                        />
                    )}
                </Field>
            </Box>
            {!formikProps.values.block[index]?.buttonText ? (
                <>
                    <PostcardModal
                        isShow={showAddButton}
                        headerText={"Custom Button"}
                        children={
                            <>
                                <FormControl>
                                    <FormLabel htmlFor="btnName">
                                        Button Name
                                    </FormLabel>
                                    <Input bg="white" id="btnName" />
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel htmlFor="btnUrl">
                                        Button URL
                                    </FormLabel>
                                    <Input bg="white" id="btnUrl" />
                                </FormControl>
                                <Flex mt="8" gap="2" justifyContent={"center"}>
                                    <Button
                                        onClick={() => {
                                            const btnName =
                                                document.getElementById(
                                                    "btnName"
                                                ).value;
                                            const btnUrl =
                                                document.getElementById(
                                                    "btnUrl"
                                                ).value;
                                            if (!btnName && !btnUrl) return;
                                            formikProps.setFieldValue(
                                                `block[${index}].buttonText`,
                                                btnName
                                            );
                                            formikProps.setFieldValue(
                                                `block[${index}].buttonUrl`,
                                                btnUrl
                                            );
                                            setShowAddButton(false);
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        onClick={() => setShowAddButton(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Flex>
                            </>
                        }
                        handleClose={() => setShowAddButton(false)}
                        style={{ padding: "20px", width: "100%" }}
                        size={"sm"}
                    />
                    <Flex justifyContent={"center"}>
                        <Button
                            variant={"outline"}
                            onClick={() => setShowAddButton(true)}
                        >
                            Add Button
                        </Button>
                    </Flex>
                </>
            ) : (
                <Flex justifyContent={"center"}>
                    <Box p={1} position={"relative"}>
                        <Link
                            href={formikProps.values.block[index]?.buttonUrl}
                            target="_blank"
                            style={{ marginRight: "2px" }}
                            minWidth={"120px"}
                        >
                            <Button
                                minWidth={"120px"}
                            // pr={"30px"}
                            >
                                {formikProps.values.block[index]?.buttonText}
                            </Button>
                        </Link>
                        <button
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "white",
                                color: "black",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                position: "absolute",
                                right: 0,
                                top: 0
                            }}
                            onClick={(e) => {
                                // e.preventDefault();
                                // e.stopPropagation();
                                formikProps.setFieldValue(
                                    `block[${index}].buttonText`,
                                    null
                                );
                                formikProps.setFieldValue(
                                    `block[${index}].buttonUrl`,
                                    null
                                );
                            }}
                        >
                            <CloseIcon width="8px" />
                        </button>
                    </Box>
                </Flex>
            )}
        </Box>
    );
};
export default SubSection;
