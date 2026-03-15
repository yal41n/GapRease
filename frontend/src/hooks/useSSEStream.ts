import { useState, useEffect, useRef } from 'react';
import { SSEEvent } from '../types/stream';
import { analysisApi } from '../api/analysis';

export function useSSEStream(sessionId: string | null) {
    const [events, setEvents] = useState<SSEEvent[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setEvents([]);
            setIsDone(false);
            return;
        }

        setIsConnecting(true);
        setEvents([]);
        setIsDone(false);

        const url = analysisApi.getStreamUrl(sessionId);
        const es = new EventSource(url);
        eventSourceRef.current = es;

        es.onopen = () => setIsConnecting(false);

        es.addEventListener('message', (e) => {
            try {
                const data: SSEEvent = JSON.parse(e.data);
                setEvents((prev) => [...prev, data]);
                if (data.type === 'complete' || data.type === 'error') {
                    setIsDone(true);
                    es.close();
                }
            } catch (err) {
                console.error("Failed to parse SSE event", err);
            }
        });

        es.onerror = (err) => {
            console.error("EventSource error", err);
            es.close();
            setIsConnecting(false);
        };

        return () => {
            es.close();
        };
    }, [sessionId]);

    return { events, isConnecting, isDone };
}
