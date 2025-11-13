import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react'
import FilterItem from './FilterItem';

const FilterDisplay = ({ type, animation, headerText, selectedValue, onSelectAll, values, onSelectValue, emptyState, isActive }) => {
    return (
        values?.length > 0 ?
            <Flex
                animation={
                    animation
                        ? "fadeIn 1s ease-in-out forwards"
                        : "fadeOut 1s ease-in-out forwards"
                }
                flexDirection={"column"} h={"100%"}
                pt={["6.4vw", "2.64vw"]}
                overflow={"hidden"} position={"relative"}>
                <Text fontSize={["3.611vw", "1.4vw"]} fontFamily={"raleway"} textAlign={"left"} color={"primary_1"}>{headerText}</Text>
                <Box w={"100%"} h={["1px", "2px"]} bg={"primary_1"} my={["4.167vw", "1.6vw"]}></Box>

                <Flex
                    overflow={"auto"}
                    flexDirection={"column"}
                    position="relative"
                    h="100%"
                    pb={["15vw", "10vw"]}
                >
                    <FilterItem
                        type={type}
                        onClick={onSelectAll}
                        selectedState={Array.isArray(selectedValue) ?
                            values?.length == selectedValue?.length
                            : selectedValue?.id == -1
                        }
                        displayText={Array.isArray(selectedValue)
                            ? (selectedValue?.length === values?.length ? "Clear All" : "Select All")
                            : (selectedValue?.id === -1 ? "Clear All" : "Select All")
                        }
                    />

                    <Flex flexWrap={"wrap"} gap={["2.2vw", "1.4vw"]} mt={["2.2vw", "1.4vw"]}>
                        {values.map((value, index) => (
                            <FilterItem
                                type={type}
                                key={index}
                                onClick={() => onSelectValue(value)}
                                selectedState={Array.isArray(selectedValue) ?
                                    selectedValue.some((t) => t.id === value.id)
                                    : selectedValue?.id == -1 || selectedValue?.id == value.id
                                }
                                displayText={value?.name}
                            />
                        ))}
                    </Flex>
                </Flex>

                {/* Gradient Overlay */}
                <Box
                    w="100%"
                    h={["20%", "30%"]}
                    bg={"linear-gradient(to top, white 33%, transparent)"}
                    position="absolute"
                    bottom="0"
                    zIndex={61}
                    pointerEvents="none" /* Ensures it doesn't block interactions with content */
                />
            </Flex>
            : <Flex flex={1} h={"90%"} justify={"center"} alignItems={"center"}>
                <Text fontSize={["3.61vw", "1.875vw"]} fontFamily={"lora"} fontStyle={"italic"}>
                    {emptyState}
                </Text>
            </Flex>
    )
}

export default FilterDisplay