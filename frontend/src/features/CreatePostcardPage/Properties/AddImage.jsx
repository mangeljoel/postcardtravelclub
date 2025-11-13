import { Flex, Text, Icon, Button } from "@chakra-ui/react";
import { ImageIcon } from "../../../styles/ChakraUI/icons";

const AddImage = (props) => {
    const { icon, text, onClick } = props;
    return (
        <Button
            width="fit-content"
            px="21px"
            py="5px"
            fontSize={"17px"}
            variant="outline"
            {...props}
            onClick={onClick}
            leftIcon={icon ?? <ImageIcon w="20px" h="20px" />}
        >
            {text ?? "Add Cover Image"}
        </Button>
    );
};

export default AddImage;
