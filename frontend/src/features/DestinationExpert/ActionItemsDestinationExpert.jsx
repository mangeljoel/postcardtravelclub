import { Button, Flex, useToast } from '@chakra-ui/react'
import { set } from 'lodash'
import React from 'react'
import { updateDBValue } from '../../queries/strapiQueries';

const ActionItemsDestinationExpert = ({ status, editMode, setEditMode, formikRef, handleSubmit, handleUnpublish }) => {
    const toast = useToast();
    const handleSave = async () => {
        if (formikRef.current) {
            const values = formikRef.current.values;
            const success = await handleSubmit(values, formikRef.current, false);
            if (success) {
                toast({
                    title: "Your changes are saved successfully!",
                    status: "success",
                    duration: 3000, // Duration in milliseconds
                    isClosable: true,
                    position: "top",
                    variant: 'left-accent'
                });
                if (status == "published") setEditMode(false)
            }
        }
    };

    const handlePublish = async () => {
        if (formikRef.current) {
            // Set all fields as touched to trigger validation
            formikRef.current.setTouched({
                title: true,
                name: true,
                country: true,
                coverImage: true,
                tagLine: true,
                quotes: {
                    quoteText: true,
                    quoteAuthor: true,
                },
                founderMessage: {
                    founderBrief: true,
                    founderImage: true,
                },
                sections: true,
                testimonials: true,
            });

            const values = formikRef.current.values;
            const success = await handleSubmit(values, formikRef.current, true, true);
            if (success) {
                setEditMode(false);
            } else {
                toast({
                    title: "Fill all the Details!",
                    status: "info",
                    duration: 3000, // Duration in milliseconds
                    isClosable: true,
                    position: "top",
                    variant: 'left-accent'
                });
            }
        }
    };

    return (
        <Flex flexDirection={"column"} gap={4} my={4}>
            {!editMode && <Button
                variant="none"
                bg={"white"}
                color={"primary_1"}
                borderColor={"primary_1!important"}
                border={"2px"}
                onClick={() => setEditMode(true)}
            >
                Edit
            </Button>}
            {editMode && (
                <Button
                    variant="none"
                    bg={"white"}
                    color={"primary_1"}
                    borderColor={"primary_1!important"}
                    border={"2px"}
                    onClick={handleSave}
                >
                    Save
                </Button>
            )}
            {status == "published" && <Button
                variant="none"
                bg={"white"}
                color={"primary_1"}
                borderColor={"primary_1!important"}
                border={"2px"}
                onClick={() => handleUnpublish()}
            >
                Unpublish
            </Button>}
            {status == "draft" && (
                <Button
                    variant="none"
                    bg={"white"}
                    color={"primary_1"}
                    borderColor={"primary_1!important"}
                    border={"2px"}
                    onClick={handlePublish}
                >
                    Publish
                </Button>
            )}
        </Flex>
    )
}

export default ActionItemsDestinationExpert