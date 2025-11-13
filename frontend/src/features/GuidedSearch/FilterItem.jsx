import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const FilterItem = ({ key, type, onClick, selectedState, displayText }) => {
    return (
        <>
            {type == 1 && <Text
                {...(key ? { key } : {})}
                w={"30%"}
                fontSize={["3.611vw", "1.46vw"]}
                fontFamily={"raleway"}
                color={selectedState ? "primary_1" : "#646260"}
                textAlign={"left"}
                onClick={onClick}
                cursor="pointer"
            >
                {displayText}
            </Text>}

            {type == 2 && <Text
                {...(key ? { key } : {})}
                as={Flex}
                px={["8.33vw", "2.67vw"]}
                minH={["8.33vw", "3.125vw"]}
                fontSize={["3.33vw", "1.25vw"]}
                borderRadius={["7.22vw", "2.78vw"]}
                bg={selectedState ? "primary_1" : "#D9D9D9"}
                color={selectedState ? "white" : "#111111"}
                w={"fit-content"}
                justifyContent={"center"}
                alignItems={"center"}
                fontFamily={"raleway"}
                fontWeight={500}
                onClick={onClick}
                cursor={"pointer"}
            >
                {displayText}
            </Text>}

            {type == 3 && <Text
                {...(key ? { key } : {})}
                as={Flex}
                px={["4vw", "2.67vw"]}
                minH={["8.33vw", "3.125vw"]}
                fontSize={["3.33vw", "1.25vw"]}
                borderRadius={["7.22vw", "2.78vw"]}
                border={["1px", "2px"]}
                borderColor={selectedState ? "primary_1" : "#807D7B"}
                color={selectedState ? "primary_1" : "#807D7B"}
                w={"fit-content"}
                justifyContent={"center"}
                alignItems={"center"}
                fontFamily={"raleway"}
                fontWeight={500}
                onClick={onClick}
                cursor={"pointer"}
                textTransform={"capitalize"}
            >
                {displayText}
            </Text>}
        </>
    )
}

export default FilterItem