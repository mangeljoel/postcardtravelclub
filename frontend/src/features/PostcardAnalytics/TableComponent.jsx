import React, { useState } from "react";
import { useTable } from "react-table";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import ReactPaginate from "react-paginate";
import LoadingGif from "../../patterns/LoadingGif";

const TableComponent = ({
    loading,
    columns,
    data,
    isHotel,
    currentPage,
    setCurrentPage,
    pageCount,
    onRowClick,
    withPagination,
    tableStyles = {},
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    tabsIndex
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    });

    // Function to handle sorting on column click
    const handleSort = (accessor) => {
        if (sortField === accessor) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(accessor);
            setSortOrder("desc"); // Default to descending order when switching columns
        }
    };

    // if (loading) return <LoadingGif />

    return (
        <TableContainer margin="5vh" marginTop="1vh" {...tableStyles}>
            <Table {...getTableProps()} variant="striped" sx={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
                marginBottom: "20px"
            }}>
                <Thead marginBottom="auto">
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => {
                                const isSorted = sortField === column.id;
                                return (
                                    <Th
                                        {...column.getHeaderProps()}
                                        onClick={() => handleSort(column.id)}
                                        sx={{
                                            textColor: "black",
                                            textAlign: "center",
                                            cursor: "pointer", // Makes it clear it's clickable
                                            width: column.width || "auto",
                                            maxWidth: column.maxWidth || "auto",
                                            flexGrow: column.flex || 0,
                                            whiteSpace: "wrap"
                                        }}
                                    >
                                        <Flex alignItems="center" justifyContent="center">
                                            {column.render("Header")}
                                            {typeof (column.Header) !== 'string' && tabsIndex != 1 && <Flex
                                                ml={2}
                                                fontSize="1.4rem" // Enlarges the icons
                                                color={isSorted ? "primary_1" : "gray.400"} // Orange for active sort, gray for default
                                            >
                                                {sortOrder === "asc" ? (
                                                    <ChevronUpIcon />
                                                ) : (
                                                    <ChevronDownIcon />
                                                )}
                                            </Flex>}
                                        </Flex>
                                    </Th>
                                );
                            })}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {loading ? (
                        <Tr>
                            <Td colSpan={columns.length} textAlign="center">
                                <Flex w="100%" h="200px" justifyContent="center" alignItems="center">
                                    <LoadingGif />
                                </Flex>
                            </Td>
                        </Tr>
                    ) : rows.map((row) => {
                        prepareRow(row);
                        return (
                            <Tr
                                onClick={() => onRowClick && onRowClick(row.original)}
                                {...row.getRowProps()}
                                sx={{
                                    _odd: { td: { background: "#FEECDE!important" } },
                                    _hover: { td: { background: "#e0d0c3!important" } }
                                }}
                            >
                                {row.cells.map((cell) => (
                                    <Td {...cell.getCellProps()} sx={{ whiteSpace: "wrap" }}>
                                        {cell.render("Cell", { isHotel })}
                                    </Td>
                                ))}
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>

            {/* Pagination */}
            {withPagination && (
                <ReactPaginate
                    previousLabel={
                        <ChevronLeftIcon style={{ margin: "auto" }} />
                    }
                    nextLabel={<ChevronRightIcon />}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(event) => setCurrentPage(event.selected)}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    forcePage={currentPage}
                />
            )}
        </TableContainer>
    );
};

export default TableComponent;
