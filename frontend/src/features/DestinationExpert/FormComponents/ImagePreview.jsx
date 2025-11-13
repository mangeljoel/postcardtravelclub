import { Button, Flex, Icon } from "@chakra-ui/react";
import { memo } from "react";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import { TrashIcon } from "../../../styles/ChakraUI/icons";
import { IoMdCrop } from "react-icons/io";

const ImagePreview = memo(({ image, onRemove, onCrop }) => (
    <Flex
        w={40}
        h={40}
        bg="gray.200"
        borderRadius="md"
        cursor="pointer"
        justify="center"
        alignItems="center"
        position="relative"
    >
        <ChakraNextImage
            src={image.url}
            alt="Uploaded"
            borderRadius="md"
            objectFit="cover"
            width="100%"
            height="100%"
        />
        <Button
            variant="none"
            p={0}
            position="absolute"
            top={1}
            right={1}
            onClick={onRemove}
            bg="white"
        >
            <TrashIcon />
        </Button>
        {onCrop && <Button
            variant="none"
            p={0}
            position="absolute"
            top={12}
            right={1}
            onClick={onCrop}
            w={"44px"}
            h={"44px"}
            bg={"#FFF4D8"}
            color={"#EA6147"}
        >
            <Icon as={IoMdCrop} w={"24px"} h={"24px"} />
        </Button>}
    </Flex>
));

export default ImagePreview;