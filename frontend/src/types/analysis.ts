export interface User {
    id: number;
    username: string;
    role: string;
}

export interface Finding {
    id: number;
    agent: string;
    domain?: string;
    severity?: string;
    confidence?: number;
    raw_text?: string;
    nist_function?: string;
    nist_category?: string;
    nist_id?: string;
    gap_description?: string;
    remediation?: string;
}

export interface AnalysisSession {
    id: string;
    user_id: number;
    status: string;
    framework: string;
    created_at: string;
    report_markdown?: string;
    findings: Finding[];
}
