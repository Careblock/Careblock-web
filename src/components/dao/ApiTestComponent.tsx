import { useEffect } from 'react';
import VotingApiService from '@/services/votingApi.service';

const ApiTestComponent = () => {
    useEffect(() => {
        console.log('Testing API call...');
        
        VotingApiService.getAllVotingsWithPagination(1, 20).subscribe({
            next: (response) => {
                console.log('SUCCESS - Full response:', response);
                console.log('Votings array:', response?.votings);
                console.log('Total count:', response?.totalCount);
            },
            error: (error) => {
                console.error('ERROR:', error);
                console.log('Error response:', error.response);
            }
        });
    }, []);

    return <div>Check console for API test results</div>;
};

export default ApiTestComponent;