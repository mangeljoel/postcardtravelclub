import { Flex, Text, Input } from "@chakra-ui/react";
import { PropertyIcon } from "../../../../styles/ChakraUI/icons";

const AlbumDetailsInput = (props) => {
    const { icon, text, inputUI, formikProps } = props;
    return (
        <Flex w="100%" {...props} fontSize={"18px"}>
            <Flex alignItems={"center"} w="35%" mr="1em">
                {icon ?? <PropertyIcon />}
                <Text
                    fontSize={"18px"}
                    fontWeight={400}
                    color={"primary_1"}
                    fontFamily={"Cabin"}
                >
                    {text ?? "Property Name"}
                </Text>
            </Flex>
            {inputUI ?? <Input w="50%" />}
        </Flex>
    );
};
export default AlbumDetailsInput;
