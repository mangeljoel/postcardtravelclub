import { Button, Flex, FormControl, FormLabel, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../AppContext'
import TableComponent from '../PostcardAnalytics/TableComponent'
import { createDBEntry, deleteDBEntry, fetchPaginatedResults } from '../../queries/strapiQueries'
import { apiNames } from '../../services/fetchApIDataSchema'
import { AdminDashboardSchema } from './schema'
import { Field, Form, Formik } from 'formik'
import PostcardModal from '../PostcardModal'
import PostcardAlert from '../PostcardAlert'
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'

const ActionButtons = ({ row, refreshData }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDeleteDXPage = () => {
        // Add delete logic here
        deleteDBEntry("destination-experts", row.original.id).then(() => { onClose(); refreshData(); });
    };

    return (
        <Flex justify={"center"} gap={"1vw"}>
            <PostcardAlert
                show={{ mode: isOpen, message: `Are you sure you want to delete the DX Page- ${row.original.user.fullName.toUpperCase()}?` }}
                handleAction={handleDeleteDXPage}
                closeAlert={onClose}
                buttonText="DELETE"
            />
            <Button
                as={Link}
                target="_blank"
                href={`/destination-experts/${row.original.user?.slug}`}
                p={0}
                bg={"#34D962"}
                _hover={{}}
                _focus={{}}
                _active={{}}
                borderRadius={"xl"}
            >
                <ViewIcon />
            </Button>
            <Button
                as={Link}
                target="_blank"
                href={`/destination-experts/${row.original.user?.slug}?isEdit=true`}
                p={0}
                bg={"#F9C43C"}
                borderRadius={"xl"}
                _hover={{}}
                _focus={{}}
                _active={{}}
            >
                <EditIcon />
            </Button>
            <Button
                p={0}
                bg={"#F5896D"}
                borderRadius={"xl"}
                _hover={{}}
                _focus={{}}
                _active={{}}
                onClick={onOpen}
            // onClick={() => console.log("View DX Page")}
            >
                <DeleteIcon />
            </Button>
        </Flex>
    );
};

const DXDashboard = () => {
    const { profile } = useContext(AppContext);
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const fetchDXPages = () => {
        fetchPaginatedResults(
            "destination-experts",
            {
                $and: [
                    { user: { user_type: { name: "DestinationExpert" } } },
                    { user: { id: { $notNull: true } } }
                ],
            },
            {
                user: {
                    fields: ["username", "fullName", "id", "slug", "user_type", "firstName", "lastName"],
                }
            },
            undefined,
        ).then((response) => {
            const data = Array.isArray(response) ? response : [response];
            setData(data);
        });
    };

    const fetchUsersWithoutDXPage = () => {
        fetchPaginatedResults(apiNames.user, {
            user_type: { name: "DestinationExpert" },
            destination_expert: { id: { $null: true } },
        }).then((res) => {
            const usersList = Array.isArray(res) ? res : [res];
            setUsers(usersList);
        });
    }

    useEffect(() => {
        fetchDXPages(); // Initial data fetch
    }, []);

    // Fetch users for dropdown
    useEffect(() => {
        fetchUsersWithoutDXPage();
    }, []);

    return (
        <Flex flexDirection={"column"} py={[4]}>
            <Flex justify={"space-between"} mx={["5vh"]}>
                <Text fontSize={[10, 20]} fontWeight={600}>{`${profile?.fullName}'s Dashboard`}</Text>
                <Button onClick={onOpen}>Create New</Button>
            </Flex>

            {/* Pass refreshData function to the schema */}
            <TableComponent columns={AdminDashboardSchema.map(col =>
                col.accessor === "actions"
                    ? { ...col, Cell: ({ row }) => <ActionButtons row={row} refreshData={() => { fetchDXPages(); fetchUsersWithoutDXPage(); }} /> }
                    : col
            )} data={data} />

            {/* Modal */}
            <PostcardModal
                size="xl"
                isShow={isOpen}
                headerText={"Create New Destination Expert"}
                children={
                    <Formik
                        initialValues={{ title: '', userId: '', company: '', companyName: '' }}
                        onSubmit={(values) => {
                            console.log('Form Submitted:', values)
                            // submit logic here
                            createDBEntry('destination-experts', { user: Number(values.userId), title: values.title }).then((data) => {
                                fetchDXPages()
                                onClose()
                            })
                        }}
                    >
                        {({ setFieldValue, values }) => (
                            <Form>
                                <ModalBody pb={6}>
                                    <Field name="title">
                                        {({ field }) => (
                                            <FormControl>
                                                <FormLabel>Title</FormLabel>
                                                <Input {...field} bg={"white"} placeholder="Enter title" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="userId">
                                        {({ field }) => (
                                            <FormControl mt={4}>
                                                <FormLabel>User</FormLabel>
                                                <Select
                                                    {...field}
                                                    bg={"white"}
                                                    placeholder="Select user"
                                                    onChange={(e) => {
                                                        const userId = e.target.value
                                                        const selected = users.find(u => u.id === userId)
                                                        setFieldValue('userId', userId)
                                                        if (selected?.company) {
                                                            setFieldValue('company', selected?.company?.id)
                                                            setFieldValue('companyName', selected?.company?.name)
                                                        } else {
                                                            setFieldValue('company', '')
                                                            setFieldValue('companyName', '')
                                                        }
                                                    }}
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

                                    <Field name="companyName">
                                        {({ field }) => (
                                            <FormControl mt={4}>
                                                <FormLabel>Company</FormLabel>
                                                <Input bg={"white"} {...field} isReadOnly />
                                            </FormControl>
                                        )}
                                    </Field>
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
                }
                handleClose={onClose}
            />
        </Flex>
    );
};

export default DXDashboard