import React, { useCallback } from "react";

export const useAIInfo = () => {
    const [aiInfo, setAiInfo] = React.useState({
        loading: false,
        title: '',
        message: ''
    });

    const fetchAIInfo = useCallback(async (dxcardId) => {
        setAiInfo(prev => ({ ...prev, loading: true }));
        try {
            const res = await fetch(`/api/dxcard/details/${dxcardId}`);
            if (!res.ok) throw new Error('Failed to fetch postcard details');
            const data = await res.json();
            setAiInfo(prev => ({
                ...prev,
                loading: false,
                message: data?.detailedInfo
            }));
        } catch (error) {
            console.error('Error fetching AI info:', error);
            setAiInfo(prev => ({
                ...prev,
                loading: false,
                message: 'Failed to load information'
            }));
        }
    }, []);

    const resetAIInfo = useCallback(() => {
        setAiInfo({ loading: false, title: '', message: '' });
    }, []);

    const setTitle = useCallback((title) => {
        setAiInfo(prev => ({ ...prev, title }));
    }, []);

    return { aiInfo, fetchAIInfo, resetAIInfo, setTitle };
};