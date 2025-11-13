import { ViewIcon } from "@chakra-ui/icons";
import { Button, Flex, Link, Text } from "@chakra-ui/react";

export const AdminDashboardSchema = [
    {
        Header: "Sr No.",
        accessor: "srNo",
        Cell: ({ row }) => <Text textAlign={"center"}>{row.index + 1}</Text>,
    },
    {
        Header: "Title",
        accessor: "title",
        Cell: ({ value }) => (
            <Text textAlign={"center"} textTransform={"capitalize"}>
                {value}
            </Text>
        ),
    },
    {
        Header: "Destination Expert",
        accessor: "destination_expert.name",
        Cell: ({ value }) => <Text textAlign={"center"}>{value}</Text>,
    },
    {
        Header: "User",
        accessor: "user", // change this to access the entire `user` object
        Cell: ({ value }) => {
            const name = value?.fullName || value?.username || "-";
            return <Text textAlign="center">{name}</Text>;
        },
    },
    {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
            <Text textAlign={"center"} textTransform={"capitalize"}>
                {value}
            </Text>
        ),
    },
    {
        Header: "",
        accessor: "actions",
        // Cell: ({ row }) => <ActionButtons row={row} />,
    },
];
