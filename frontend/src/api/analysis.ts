import { apiClient } from './client';
import { AnalysisSession } from '../types/analysis';

export const analysisApi = {
    uploadFiles: async (files: File[]) => {
        const formData = new FormData();
        // Backend expects domain_id, passing 1 as default mock
        formData.append('domain_id', '1');
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        const { data } = await apiClient.post<{ session_id: string }>('/analysis/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    getAnalysis: async (id: string) => {
        const { data } = await apiClient.get<AnalysisSession>(`/analysis/${id}`);
        return data;
    },

    submitClarification: async (id: string, answers: string[]) => {
        const { data } = await apiClient.post(`/analysis/${id}/answer`, { answers });
        return data;
    },

    getStreamUrl: (id: string) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        return `${baseUrl}/analysis/${id}/stream`;
    }
};
