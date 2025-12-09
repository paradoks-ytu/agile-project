import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '@/service/authService';

interface ClubMentionProps {
    clubId: number;
}

const ClubMention: React.FC<ClubMentionProps> = ({ clubId }) => {
    const [clubName, setClubName] = useState<string>(`Club-${clubId}`);

    useEffect(() => {
        const fetchClubName = async () => {
            try {
                // Try to get from cache first if possible, or just fetch
                // authService.getClubById caches nothing but we can rely on browser cache or fast network
                const club = await authService.getClubById(clubId);
                setClubName(club.name);
            } catch (error) {
                console.error(`Failed to fetch club name for ID ${clubId}`, error);
            }
        };

        fetchClubName();
    }, [clubId]);

    return (
        <Link
            to={`/clubs/${clubId}`}
            style={{
                color: 'var(--color-primary)',
                fontWeight: 'bold',
                textDecoration: 'none',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                padding: '0 4px',
                borderRadius: '4px'
            }}
        >
            @{clubName}
        </Link>
    );
};

export default ClubMention;
