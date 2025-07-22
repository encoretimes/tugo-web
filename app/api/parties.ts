import { Party } from '@/types/party';

interface PartiesData {
    myParties: Party[];
    recommendedParties: Party[];
}

export const getParties = async (): Promise<PartiesData> => {
    const res = await fetch('/api/parties');
    if (!res.ok) {
        throw new Error('Failed to fetch parties');
    }
    return res.json();
}
