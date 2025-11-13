import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteTag
} from "@choc-ui/chakra-autocomplete";
import { Stack, Text } from "@chakra-ui/react";

const MultiTagAutoComplete = () => {
    const countries = [
        { id: 1, name: "India" },
        { id: 2, name: "China" },
        { id: 3, name: "South Korea" },
        { id: 4, name: "Japan" },
        { id: 5, name: "USA" }
    ];
    return (
        <Stack direction="column">
            <Text>Multi select with tags</Text>
            <AutoComplete
                openOnFocus
                multiple
                onChange={(vals) => console.log(vals)}
            >
                <AutoCompleteInput placeholder="Search..." variant="filled">
                    {({ tags }) =>
                        tags.map((tag, tid) => (
                            <AutoCompleteTag
                                key={tid}
                                label={tag.label}
                                onRemove={tag.onRemove}
                            />
                        ))
                    }
                </AutoCompleteInput>
                <AutoCompleteList>
                    {countries.map((country, cid) => (
                        <AutoCompleteItem
                            key={`option-${cid}`}
                            value={country.name}
                            textTransform="capitalize"
                            _selected={{ bg: "whiteAlpha.50" }}
                            _focus={{ bg: "whiteAlpha.100" }}
                        >
                            {country.name}
                        </AutoCompleteItem>
                    ))}
                </AutoCompleteList>
            </AutoComplete>
        </Stack>
    );
};
export default MultiTagAutoComplete;
