import { Box, Input } from "@chakra-ui/react";
import { Field } from "formik";
import { useEffect, useRef } from "react";

// Custom dropdown component to reduce repetition
const SearchableDropdown = ({
    inputValue,
    placeholder,
    suggestions,
    isOpen,
    onBlur,
    setIsOpen,
    onInputChange,
    onItemSelect,
    filterFn = (item, value) => item.name.toLowerCase().includes(value?.toLowerCase() ?? ''),
    disabled = false,
    maxHeight = "200px",
    onKeyDown = () => { },
}) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    const filteredSuggestions = suggestions.filter(item => filterFn(item, inputValue));

    return (
        <Box position="relative" ref={dropdownRef}>
            <Field
                as={Input}
                bg="white"
                zIndex={5}
                onBlur={onBlur}
                value={inputValue || ''}
                placeholder={placeholder}
                autoComplete="off"
                onChange={onInputChange}
                onFocus={() => setIsOpen(suggestions.length > 0)}
                isDisabled={disabled}
                onKeyDown={onKeyDown}

            />
            {isOpen && filteredSuggestions.length > 0 && (
                <Box
                    border="1px solid"
                    bg="white"
                    mt={1}
                    zIndex={99}
                    p={2}
                    borderRadius="md"
                    position="absolute"
                    width="100%"
                    maxH={maxHeight}
                    overflowY="auto"
                    boxShadow="md"
                >
                    {filteredSuggestions.map((item) => (
                        <Box
                            key={item.id}
                            p={2}
                            _hover={{ bg: "gray.100", cursor: "pointer" }}
                            onClick={() => onItemSelect(item)}
                        >
                            {item.name}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default SearchableDropdown;