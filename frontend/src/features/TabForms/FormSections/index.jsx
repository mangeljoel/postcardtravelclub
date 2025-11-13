import React, { useState } from "react";
import {
    Box,
    Textarea,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    Button
} from "@chakra-ui/react";

const FormSections = ({ tab }) => {
    const [formData, setFormData] = useState({});

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const fieldValue = type === "checkbox" ? checked : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: fieldValue
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                {tab.map((field) => (
                    <FormControl key={field.name} mb={4}>
                        <FormLabel>{field.label}</FormLabel>
                        {field.type === "textarea" ? (
                            <Textarea
                                name={field.name}
                                value={formData[field.name] || ""}
                                required={field.required}
                                onChange={handleInputChange}
                            />
                        ) : field.type === "checkbox" ? (
                            <Checkbox
                                name={field.name}
                                checked={!!formData[field.name]}
                                onChange={handleInputChange}
                            >
                                {field.label}
                            </Checkbox>
                        ) : (
                            <Input
                                variant="filled"
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ""}
                                required={field.required}
                                onChange={handleInputChange}
                            />
                        )}
                    </FormControl>
                ))}
                <Button colorScheme="teal" type="submit">
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default FormSections;
