import React, { useState } from 'react';
import {
    Chip,
    Tooltip,
    IconButton,
    Snackbar,
    Alert,
    Box,
    Typography
} from '@mui/material';
import {
    Launch as LaunchIcon
} from '@mui/icons-material';

interface TransactionIdChipProps {
    transactionId: string;
    label?: string;
    size?: 'small' | 'medium';
    variant?: 'filled' | 'outlined';
    showExplorerLink?: boolean;
}

const TransactionIdChip: React.FC<TransactionIdChipProps> = ({
    transactionId,
    label = 'Transaction ID',
    size = 'small',
    variant = 'outlined',
    showExplorerLink = true
}) => {
    const [showCopySuccess, setShowCopySuccess] = useState(false);

    const handleCopyTransactionId = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            await navigator.clipboard.writeText(transactionId);
            setShowCopySuccess(true);
        } catch (err) {
            console.error('Failed to copy transaction ID:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = transactionId;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setShowCopySuccess(true);
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    };

    const handleExplorerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Open Cardano explorer (you can customize this URL based on your network)
        const explorerUrl = `https://cardanoscan.io/transaction/${transactionId}`;
        window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    };

    const shortTransactionId = `${transactionId.slice(0, 8)}...${transactionId.slice(-6)}`;

    return (
        <Box display="inline-flex" alignItems="center" gap={0.5}>
            <Tooltip title={`${label}: ${transactionId}`} arrow>
                <Chip
                    label={
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                {shortTransactionId}
                            </Typography>
                        </Box>
                    }
                    variant={variant}
                    size={size}
                    color="primary"
                    onClick={handleCopyTransactionId}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'primary.50',
                            borderColor: 'primary.main'
                        },
                        fontFamily: 'monospace'
                    }}
                />
            </Tooltip>
            
            {showExplorerLink && (
                <Tooltip title="View on Cardano Explorer" arrow>
                    <IconButton
                        size="small"
                        onClick={handleExplorerClick}
                        sx={{ 
                            p: 0.5,
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.50'
                            }
                        }}
                    >
                        <LaunchIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}

            <Snackbar
                open={showCopySuccess}
                autoHideDuration={2000}
                onClose={() => setShowCopySuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowCopySuccess(false)} 
                    severity="success" 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Transaction ID copied to clipboard!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TransactionIdChip;