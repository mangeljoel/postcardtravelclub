import { Box, Button, Input, Textarea } from "@chakra-ui/react";
import { memo } from "react";
import FormField from "./FormField";

const Testimonial = memo(({ index, onRemove }) => (
    <Box
        key={index}
        borderWidth="1px"
        borderRadius="md"
        p={4}
        mb={4}
        align="stretch"
        bg="white"
    >
        <FormField label="Title" name={`testimonials.${index}.title`} component={Input} placeholder="Title" mb={4} />
        <FormField label="Message" name={`testimonials.${index}.message`} component={Textarea} placeholder="Message..." mb={4} />
        <FormField label="Name" name={`testimonials.${index}.name`} component={Input} placeholder="Name" mb={4} />
        <FormField label="Location" name={`testimonials.${index}.location`} component={Input} placeholder="Location" mb={4} />
        <Button
            mt={4}
            colorScheme="red"
            onClick={onRemove}
        >
            Remove Testimonial
        </Button>
    </Box>
));

export default Testimonial; 