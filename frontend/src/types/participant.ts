export interface RegisterParticipantRequest {
    eventId: string;
    userId?: string;
    fullName: string;
    email: string;
    formAnswers: Record<string, string>;
}

export interface ParticipantResponse {
    id: string;
    eventId: string;
    fullName: string;
    email: string;
    status: string;
    ticketUrl?: string;
    ticketJobId?: string;
    ticketStatus?: string;
    registeredAt: string;
}
