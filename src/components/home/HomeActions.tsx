import React from 'react';
import { Box, Button, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import { HowToVote, LocalHospital } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/enums/RoutePath';

interface QuickActionCardProps {
    icon: React.ReactElement;
    title: string;
    description: string;
    buttonText: string;
    buttonColor?: 'primary' | 'secondary';
    gradient: string;
    onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
    icon,
    title,
    description,
    buttonText,
    buttonColor = 'primary',
    gradient,
    onClick,
}) => {
    return (
        <Card 
            sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
            }}
            onClick={onClick}
        >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
                {React.cloneElement(icon, { sx: { fontSize: 60, mb: 2 } })}
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                    {description}
                </Typography>
                <Button 
                    variant="contained" 
                    color={buttonColor}
                    size="large"
                    sx={{ 
                        background: gradient,
                        minWidth: 200 
                    }}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
};

const HomeActions: React.FC = () => {
    const navigate = useNavigate();

    const moveToAppointmentPage = () => {
        navigate(PATHS.APPOINTMENT_STEP1);
    };

    const moveToDAOVotingPage = () => {
        navigate(PATHS.DAO_VOTING);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to CareBlock
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Decentralized Healthcare Platform
                </Typography>
            </Box>

            {/* Action Cards */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <QuickActionCard
                        icon={<LocalHospital color="primary" />}
                        title="🏥 Health Services"
                        description="Book appointments, access medical records, and manage your healthcare journey"
                        buttonText="Access Health Services"
                        buttonColor="primary"
                        gradient="linear-gradient(45deg, #4CAF50 30%, #45a049 90%)"
                        onClick={moveToAppointmentPage}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <QuickActionCard
                        icon={<HowToVote color="secondary" />}
                        title="🗳️ DAO Governance"
                        description="Participate in decentralized voting and help shape the future of CareBlock"
                        buttonText="Vote Now"
                        buttonColor="secondary"
                        gradient="linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
                        onClick={moveToDAOVotingPage}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default HomeActions;