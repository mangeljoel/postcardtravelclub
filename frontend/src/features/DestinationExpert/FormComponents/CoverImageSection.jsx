import { Box, Button } from "@chakra-ui/react";
import { memo } from "react";
import { ChakraNextImage } from "../../../patterns/ChakraNextImage";
import { CameraIcon } from "../../../styles/ChakraUI/icons";
import AddImage from "../../CreatePostcardPage/Properties/AddImage";

const CoverImageSection = memo(({ values, onImageClick }) => (
    values.coverImage ? (
        <Box
            position="relative"
            width="100%"
            h={["101.1vw", "50.4vw"]}
            borderRadius={["4.167vw", "2.083vw"]}
            overflow="hidden"
            cursor="pointer"
            bg={values.coverImage ? 'transparent' : 'gray.200'}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <ChakraNextImage src={values.coverImageUrl} alt="Uploaded" objectFit="cover" width="100%" height="100%" priority={true} noLazy={true} />
            <Button
                variant="none"
                position="absolute"
                top={1}
                right={1}
                onClick={onImageClick}
                bg="white"
                borderRadius="full"
                p={1}
            >
                <CameraIcon w="100%" h="100%" display="flex" justifyContent="center" alignItems="center" mx="auto" viewBox="0 0 14 14" />
            </Button>
        </Box>
    ) : (
        <AddImage
            mt="1em"
            mb="2em"
            onClick={onImageClick}
            text={values.coverImageUrl ? "Change Cover Image" : "Add Cover Image"}
        />
    )
));

export default CoverImageSection;