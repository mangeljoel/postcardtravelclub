import { Select } from "@chakra-ui/react";
import React from "react";

export const DeckSelector = React.memo(({
    isDx,
    decks,
    selectedDeck,
    onDeckChange,
    onCreateDeck
}) => {
    if (!isDx) return null;

    return (
        <Select
            w="30%"
            bg="white"
            mb={6}
            placeholder="Select a deck"
            value={selectedDeck?.id || ""}
            onChange={(e) => {
                const selectedId = e.target.value;
                if (selectedId === "__create__") {
                    onCreateDeck();
                    return;
                }
                onDeckChange(selectedId);
            }}
        >
            {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                    {deck.title}
                </option>
            ))}
            <option value="__create__" style={{ fontWeight: 'bold' }}>
                + Create New Deck
            </option>
        </Select>
    );
});