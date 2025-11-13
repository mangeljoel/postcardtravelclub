import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for debounced input handling with a reset function.
 * @param {number} debounceTime - Time in milliseconds to debounce the input.
 * @param {function} onDebounce - Callback function invoked with debounced value.
 * @param {string} initialValue - Initial value for the input (optional).
 * @returns {Array} - `[value, debouncedValue, handleChange, resetValue, setValue]`
 */
const useDebouncedInput = (
    debounceTime = 1000,
    onDebounce,
    initialValue = ""
) => {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, debounceTime);

        return () => clearTimeout(handler);
    }, [value, debounceTime]);

    // Trigger callback when debounced value changes
    useEffect(() => {
        if (onDebounce) {
            onDebounce(debouncedValue);
        }
    }, [debouncedValue, onDebounce]);

    // Reset function
    const resetValue = useCallback(() => {
        setValue("");
        setDebouncedValue("");
    }, []);

    // Change handler
    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return [value, debouncedValue, handleChange, resetValue, setValue];
};

export default useDebouncedInput;
