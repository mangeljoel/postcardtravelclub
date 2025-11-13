import { Flex } from '@chakra-ui/react'
import React from 'react'

const FilterHeader = ({ isFirst, bg, color, zIndex, onClick, displayText }) => {
    return (
        <Flex
            borderRadius={["7.22vw", "2.78vw"]}
            w={"100%"}
            boxShadow={["20px 0px 15px -3px rgba(0,0,0,0.1)", "20px 0px 15px -3px rgba(0,0,0,0.1)"]}
            ml={["-7vw", "-3vw"]}
            justify={"center"}
            alignItems={"center"}
            fontSize={["3vw", "1.46vw"]}
            fontWeight={600}
            fontFamily={"raleway"}
            transition={"background-color 0.5s ease"}
            bg={bg || "white"}
            color={color || "primary_1"}
            zIndex={zIndex}
            onClick={onClick}
            {...(!isFirst ? { pl: ["5%", "0"] } : { ml: "" })}
        >
            {displayText}
        </Flex>
    )
}

export default FilterHeader