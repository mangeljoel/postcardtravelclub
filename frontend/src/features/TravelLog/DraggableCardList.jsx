import React, { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Grid, useToast } from "@chakra-ui/react";
import DxCard from "../DestinationExpert/DxCard";
import DxCardCarousel from "../DestinationExpert/DxCardCarousel";

// Single sortable card
function SortableCard({ id, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : "auto",
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
    };

    return (
        <Box ref={setNodeRef} style={style}>
            {/* <Box {...attributes} {...listeners} cursor="grab">
                Drag handle
            </Box> */}
            {children({ attributes, listeners, isDragging })}
        </Box>
    );
}

// Main grid component
const DraggableCardList = ({ blocks, cardProps, onOrderChange, setDxCardMemory }) => {
    const [items, setItems] = useState(blocks);
    const sensors = useSensors(useSensor(PointerSensor));
    const toast = useToast();

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(items, oldIndex, newIndex);

        // Extract all dated items (with .date) in their new order
        const datedItems = reordered.filter(item => item.date);

        // Check if these dated items are in ascending date order
        const isDatedAscending = datedItems.every((item, i, arr) => {
            if (i === 0) return true;
            return new Date(arr[i - 1].date) <= new Date(item.date);
        });

        if (isDatedAscending) {
            setItems(reordered);
            onOrderChange?.(reordered);
        } else {
            toast({
                title: "The blocks with dates must remain in ascending order.",
                status: "error",
                isClosable: true,
                position: 'top',
            });
        }
    };


    useEffect(() => {
        setItems(blocks || []);
    }, [blocks]);


    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <Grid templateColumns={[
                    "repeat(1, 1fr)",
                    "repeat(2, 1fr)",
                    "repeat(2, 1fr)",
                    "repeat(3, 1fr)",
                ]} gap={4} mx={"auto"}>
                    {items.map((item) => (
                        <SortableCard key={item.id} id={item.id}>
                            {({ attributes, listeners, isDragging }) => (
                                <>
                                    <DxCard
                                        key={item.id}
                                        data={item}
                                        setDxCardMemory={setDxCardMemory}
                                        dragHandleProps={{ ...attributes, ...listeners }}
                                        isDragging={isDragging}
                                        {...cardProps}
                                        carouselMedia={item?.gallery || []}
                                    />
                                </>
                            )}
                        </SortableCard>
                    ))}
                </Grid>
            </SortableContext>
        </DndContext>
    );
};

export default DraggableCardList;
