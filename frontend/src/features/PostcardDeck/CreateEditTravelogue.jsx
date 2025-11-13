import {
    Button,
    FormControl,
    FormLabel,
    Input,
    ModalBody,
    ModalFooter,
    Select
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { slugify } from '../../services/utilities';
import strapi from '../../queries/strapi';
import { createDBEntry, fetchPaginatedResults, updateDBValue } from '../../queries/strapiQueries';
import { set } from 'lodash';

const CreateEditTravelogue = ({
    isDx,
    profile,
    dxs,
    users,
    isOpen,
    onClose,
    editMode,
    selectedDeck,
    refreshDecks,
    onComplete
}) => {
    // const [dxs, setDxs] = useState(dxsProp || []);
    const handleUser = async (email, updateData) => {
        let data = await strapi.find("users", { filters: { email } });
        if (data.length) return data[0];
        const created = await strapi.register(updateData);
        return created?.user || null;
    };

    const handleCreateEditDeck = async (mode = 'create', id, email, payload) => {
        if (email) {
            const user = await handleUser(email, {
                email,
                password: "test123",
                username: email,
                slug: slugify(email),
                user_type: 1
            });

            if (user) {
                payload.user = user.id;
                return mode === "edit"
                    ? await updateDBValue("travelogues", id, payload)
                    : await createDBEntry("travelogues", payload);
            }
        }
        return null;
    };

    // useEffect(() => {
    //     const fetchDxs = async () => {
    //         const response = await fetchPaginatedResults(
    //             "destination-experts",
    //             {
    //                 $and: [
    //                     { user: { user_type: { name: "DestinationExpert" } } },
    //                     { user: { id: { $notNull: true } } },
    //                     { status: "published" }
    //                 ],
    //             },
    //             {
    //                 user: {
    //                     fields: ["username", "fullName", "id", "slug", "user_type", "firstName", "lastName"],
    //                 }
    //             },
    //             undefined,
    //         )
    //         const dxsData = Array.isArray(response) ? response : [response];
    //         setDxs(dxsData);
    //     }

    //     (!dxsProp || dxsProp.length === 0) && fetchDxs();
    // }, [dxsProp]);

    return (
        <Formik
            enableReinitialize
            initialValues={{
                title: selectedDeck?.title || '',
                dxId: selectedDeck?.destination_expert?.id?.toString() || '',
                userId: selectedDeck?.user?.id?.toString() || '',
                email: selectedDeck?.user?.email || '',
                status: selectedDeck?.status || ''
            }}
            onSubmit={async (values, { isSubmitting, setSubmitting }) => {
                if (isSubmitting) return;
                setSubmitting(true);
                const payload = {
                    user: Number(values.userId),
                    title: values.title,
                    destination_expert: Number(values.dxId),
                    status: values.status,
                    ...(!editMode ? { slug: slugify(values.title), status: 'draft' } : {})
                };

                const email = values.email.trim().toLowerCase();
                let submitAction;

                if (isDx) {
                    submitAction = editMode
                        ? await handleCreateEditDeck("edit", selectedDeck.id, email, payload)
                        : await handleCreateEditDeck("create", null, email, payload);
                } else {
                    submitAction = editMode
                        ? await updateDBValue("travelogues", selectedDeck.id, payload)
                        : await createDBEntry("travelogues", payload);
                }

                if (submitAction) {
                    // console.log("Deck saved successfully:", submitAction);
                    if (onComplete) onComplete(submitAction?.data || null);
                    refreshDecks();
                    onClose();
                    setSubmitting(false);
                }
            }}
        >
            {({ setFieldValue, values }) => (
                <Form>
                    <ModalBody pb={6}>
                        <Field name="title">
                            {({ field }) => (
                                <FormControl>
                                    <FormLabel>Title</FormLabel>
                                    <Input {...field} bg="white" placeholder="Enter title" />
                                </FormControl>
                            )}
                        </Field>

                        <Field name="dxId">
                            {({ field }) => {
                                const isDisabled = isDx;
                                const expertId = isDx
                                    ? dxs.find((dx) => dx.user.id === profile.id)?.id || ''
                                    : field.value;

                                useEffect(() => {
                                    if (isDx) {
                                        const dxId = dxs.find(dx => dx.user.id === profile.id)?.id || '';
                                        setFieldValue("dxId", dxId);
                                    }
                                }, [isDx, profile.id]);

                                return (
                                    <FormControl mt={4} isDisabled={isDisabled}>
                                        <FormLabel>Destination Expert</FormLabel>
                                        <Select
                                            {...field}
                                            value={expertId}
                                            bg="white"
                                            placeholder="Select Destination Expert"
                                            onChange={(e) => setFieldValue("dxId", e.target.value)}
                                        >
                                            {dxs.map((dx) => (
                                                <option key={dx.id} value={dx.id}>{dx.name}</option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                );
                            }}
                        </Field>

                        {!isDx ? (
                            <Field name="userId">
                                {({ field }) => (
                                    <FormControl mt={4}>
                                        <FormLabel>User</FormLabel>
                                        <Select
                                            {...field}
                                            bg="white"
                                            placeholder="Select user"
                                            onChange={(e) => setFieldValue("userId", e.target.value)}
                                        >
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.fullName || user.username}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </Field>
                        ) : (
                            <Field name="email">
                                {({ field }) => (
                                    <FormControl>
                                        <FormLabel>User</FormLabel>
                                        <Input {...field} bg="white" type="email" placeholder="Enter User Email" />
                                    </FormControl>
                                )}
                            </Field>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button type="submit" colorScheme="blue" mr={3}>
                            Submit
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </Form>
            )}
        </Formik>
    );
};

export default CreateEditTravelogue;
