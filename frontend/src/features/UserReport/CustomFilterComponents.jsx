import { Flex, Input, Select } from "@chakra-ui/react";
import { useState, useMemo } from "react";
export const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter }
}) => {
    const count = preFilteredRows.length;
    return (
        <Input
            value={filterValue || ""}
            onChange={(e) => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    );
};
export const GlobalFilter = ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    style
}) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState(globalFilter);
    const onChange = (value) => {
        setGlobalFilter(value || undefined);
    };
    return (
        <Input
            border="1px"
            my="auto"
            borderColor="black"
            fontSize="1em"
            value={value || ""}
            onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
            }}
            placeholder={`Search ${count} records...`}
            style={style}
        />
    );
};
export const DefaultSelectFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id }
}) => {
    const options = useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <Select
            // py={2}
            bg="cardBackground"
            value={filterValue}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Select>
    );
};
// export const fuzzyTextFilter = (rows, id, filterValue) => {
//     return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
// };
// fuzzyTextFilterFn.autoRemove = (val) => !val;
