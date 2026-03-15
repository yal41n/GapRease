export interface SSEEvent {
    type: 'system' | 'agent_message' | 'clarification_required' | 'progress' | 'complete' | 'error';
    message?: string;
    agent?: string;
    confidence?: number;
    percent?: number;
    label?: string;
    report_markdown?: string;
    findings?: any[];
    questions?: string[];
    session_id?: string;
}
