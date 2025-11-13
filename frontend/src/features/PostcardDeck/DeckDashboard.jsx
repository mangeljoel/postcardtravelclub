import { Button, Flex, FormControl, FormLabel, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../AppContext'
import TableComponent from '../PostcardAnalytics/TableComponent'
import { createDBEntry, deleteDBEntry, fetchPaginatedResults, updateDBValue } from '../../queries/strapiQueries'
import { apiNames } from '../../services/fetchApIDataSchema'
import { AdminDashboardSchema } from './schema'
import { Field, Form, Formik } from 'formik'
import PostcardModal from '../PostcardModal'
import PostcardAlert from '../PostcardAlert'
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import strapi from '../../queries/strapi'
import { slugify } from '../../services/utilities'
import CreateEditTravelogue from './CreateEditTravelogue'

const ActionButtons = ({ row, refreshData, onEdit }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDeleteDXPage = () => {
        deleteDBEntry("travelogues", row.original.id).then(() => {
            onClose();
            refreshData();
        });
    };

    return (
        <Flex justify={"center"} gap={"1vw"}>
            <PostcardAlert
                show={{ mode: isOpen, message: `Are you sure you want to delete this Postcard Deck- ${row.original.title}?` }}
                handleAction={handleDeleteDXPage}
                closeAlert={onClose}
                buttonText="DELETE"
            />
            <Button as={Link} target="_blank" href={`/postcard-deck/${row.original.slug}`} p={0} bg={"#34D962"} borderRadius={"xl"} _hover={{}}
                _focus={{}}
                _active={{}}>
                <ViewIcon />
            </Button>
            <Button
                p={0}
                bg={"#F9C43C"}
                borderRadius={"xl"}
                _hover={{}}
                _focus={{}}
                _active={{}}
                onClick={() => onEdit(row.original)}
            >
                <EditIcon />
            </Button>
            <Button p={0} bg={"#F5896D"} borderRadius={"xl"} onClick={onOpen} _hover={{}}
                _focus={{}}
                _active={{}}>
                <DeleteIcon />
            </Button>
        </Flex>
    );
};

const DeckDashboard = () => {
    const { profile } = useContext(AppContext);
    const isDx = profile?.user_type?.name === "DestinationExpert";
    const [data, setData] = useState([]);
    const [dxs, setDxs] = useState([]);
    const [users, setUsers] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editMode, setEditMode] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(null);

    const fetchPostcardDecks = () => {
        fetchPaginatedResults(
            "travelogues",
            {
                ...(isDx ? { destination_expert: { user: { id: profile.id } } } : {}),
            },
            {
                destination_expert: {
                    fields: ['id', 'name', 'slug'],
                },
                user: {
                    fields: ['id', 'fullName', 'username', "email", 'slug',],
                }
            },
            undefined
        ).then((response) => {
            const data = Array.isArray(response) ? response : [response];
            setData(data);
        });
    };

    const fetchDxs = async () => {
        const response = await fetchPaginatedResults(
            "destination-experts",
            {
                $and: [
                    { user: { user_type: { name: "DestinationExpert" } } },
                    { user: { id: { $notNull: true } } },
                    { status: "published" }
                ],
            },
            {
                user: {
                    fields: ["username", "fullName", "id", "slug", "user_type", "firstName", "lastName"],
                }
            },
            undefined,
        )
        const dxsData = Array.isArray(response) ? response : [response];
        setDxs(dxsData);
    }

    const fetchUsers = () => {
        fetchPaginatedResults(apiNames.user, {
            user_type: { name: "ConciergeMember" },
        }).then((res) => {
            const usersList = Array.isArray(res) ? res : [res];
            setUsers(usersList);
        });
    }

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
                if (mode === "edit") {
                    return await updateDBValue("travelogues", id, payload);
                } else {
                    return await createDBEntry("travelogues", payload);
                }
            }
        }

        return null; // Return null if no email or user not found
    };

    const handleUser = async (email, updateData) => {
        let data = await strapi.find("users", { filters: { email } });

        if (data.length) {
            return data[0];
        } else {
            let createData = await strapi.register(updateData);
            return createData?.user || null;
        }
    };

    useEffect(() => {
        fetchPostcardDecks(); // Initial data fetch
    }, []);

    // Fetch users for dropdown
    useEffect(() => {
        fetchDxs();
        !isDx && fetchUsers();
    }, []);

    return (
        <Flex flexDirection={"column"} py={[4]}>
            <Flex justify={"space-between"} mx={["5vh"]}>
                <Text fontSize={[10, 20]} fontWeight={600}>{`${profile?.fullName}'s Deck Dashboard`}</Text>
                <Button onClick={onOpen}>Create New</Button>
            </Flex>

            {/* Pass refreshData function to the schema */}
            <TableComponent
                columns={AdminDashboardSchema.map(col =>
                    col.accessor === "actions"
                        ? {
                            ...col,
                            Cell: ({ row }) => (
                                <ActionButtons
                                    row={row}
                                    refreshData={() => {
                                        fetchPostcardDecks();
                                        // fetchUsers(); // fetchUsersWithoutDXPage() seems undefined, so sticking to fetchUsers
                                    }}
                                    onEdit={(deck) => {
                                        setSelectedDeck(deck);
                                        setEditMode(true);
                                        onOpen();
                                    }}
                                />
                            )
                        }
                        : col
                )}
                data={data}
            />

            {/* Modal */}
            <PostcardModal
                size="xl"
                isShow={isOpen}
                headerText={`${editMode ? "Edit" : "Create New"} Postcard Deck`}
                handleClose={() => {
                    setEditMode(false);
                    setSelectedDeck(null);
                    onClose();
                }}
            >
                <CreateEditTravelogue
                    isDx={isDx}
                    profile={profile}
                    dxs={dxs}
                    users={users}
                    isOpen={isOpen}
                    onClose={() => {
                        setEditMode(false);
                        setSelectedDeck(null);
                        onClose();
                    }}
                    editMode={editMode}
                    selectedDeck={selectedDeck}
                    refreshDecks={fetchPostcardDecks}
                />
            </PostcardModal>
        </Flex>
    );
};

export default DeckDashboard