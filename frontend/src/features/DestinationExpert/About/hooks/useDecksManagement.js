import React, { useCallback, useEffect } from "react";
import { fetchPaginatedResults } from "../../../../queries/strapiQueries";

export const useDecksManagement = (isDx, profile) => {
    const [decks, setDecks] = React.useState([]);
    const [selectedDeck, setSelectedDeck] = React.useState(null);
    const [selectedCards, setSelectedCards] = React.useState({});

    const fetchDecks = useCallback(async () => {
        if (!isDx || !profile?.id) return;

        try {
            const response = await fetchPaginatedResults(
                "travelogues",
                {
                    destination_expert: { user: { id: profile.id } },
                    status: { $not: "completed" }
                },
                {
                    destination_expert: {
                        fields: ['id', 'name', 'slug'],
                    },
                    user: {
                        fields: ['id', 'fullName', 'username', "email", 'slug'],
                    }
                }
            );
            const data = Array.isArray(response) ? response : [response];
            setDecks(data);
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    }, [isDx, profile?.id]);

    const fetchSelectedCards = useCallback(async (deckId) => {
        if (!deckId) return;

        try {
            const deck = await fetchPaginatedResults("travelogues", { id: deckId }, {
                itinerary_block: {
                    fields: ["order", "date"],
                    populate: {
                        dx_card: {
                            fields: ['id', 'name'],
                        }
                    }
                },
            });

            if (deck?.itinerary_block) {
                const cardMap = deck.itinerary_block.reduce((acc, block) => {
                    const cardId = block?.dx_card?.id;
                    const date = block?.date;
                    if (cardId) {
                        acc[cardId] = date;
                    }
                    return acc;
                }, {});
                setSelectedCards(cardMap);
            } else {
                setSelectedCards({});
            }
        } catch (error) {
            console.error('Error fetching selected cards:', error);
            setSelectedCards({});
        }
    }, []);

    const addDeck = useCallback((newDeck) => {
        setDecks(prev => [...prev, newDeck]);
    }, []);

    const updateSelectedCards = useCallback((cardId, date) => {
        setSelectedCards(prev => ({ ...prev, [cardId]: date }));
    }, []);

    const removeSelectedCard = useCallback((cardId) => {
        setSelectedCards(prev => {
            const updated = { ...prev };
            delete updated[cardId];
            return updated;
        });
    }, []);

    // useEffect(() => { console.log("Decks updated:", selectedCards); }, [selectedCards]);

    return {
        decks,
        selectedDeck,
        selectedCards,
        setSelectedCards,
        setSelectedDeck,
        fetchDecks,
        fetchSelectedCards,
        addDeck,
        updateSelectedCards,
        removeSelectedCard
    };
};