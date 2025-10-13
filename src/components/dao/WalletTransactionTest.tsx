import React, { useState } from 'react';
import { BrowserWallet, Transaction } from '@meshsdk/core';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { getStakeIdFromCookies } from '../../utils/cookie.utils';

interface WalletTransactionTestProps {}

const WalletTransactionTest: React.FC<WalletTransactionTestProps> = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        stakeId?: string;
        transactionId?: string;
        error?: string;
    }>({});

    const testWalletTransaction = async () => {
        setLoading(true);
        setResult({});

        try {
            // Get stake ID from cookies
            const stakeId = getStakeIdFromCookies();
            if (!stakeId) {
                throw new Error('No stake ID found in cookies. Please login first.');
            }
            console.log('Retrieved stake ID from cookies:', stakeId);

            console.log('Connecting to Eternl wallet...');
            const wallet = await BrowserWallet.enable('eternl');
            console.log('Wallet connected:', wallet);

            // Create a simple transaction with metadata
            const tx = new Transaction({ initiator: wallet });
            
            // Add metadata to identify this as a test transaction
            tx.setMetadata(0, {
                testProposal: 'Test Proposal Creation',
                type: 'proposal_creation_test',
                timestamp: Date.now()
            });

            console.log('Building transaction...');
            const unsignedTx = await tx.build();
            
            console.log('Signing transaction...');
            const signedTx = await wallet.signTx(unsignedTx);
            
            console.log('Submitting transaction...');
            const txHash = await wallet.submitTx(signedTx);
            
            console.log('Transaction completed:', txHash);

            setResult({
                stakeId,
                transactionId: txHash
            });

        } catch (err: any) {
            console.error('Transaction test failed:', err);
            setResult({
                error: err.message || 'Unknown error occurred'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Wallet Transaction Test
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Test the wallet integration and transaction creation process
            </Typography>

            {/* Debug cookie info */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    Debug Info:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8em' }}>
                    Raw cookie: {document.cookie.includes('stakeId') ? 
                        document.cookie.split('stakeId=')[1]?.split(';')[0] : 'Not found'}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8em' }}>
                    Parsed stakeId: {getStakeIdFromCookies() || 'null'}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={testWalletTransaction}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : undefined}
                >
                    {loading ? 'Testing...' : 'Test Wallet Transaction'}
                </Button>
                
                <Button
                    variant="outlined"
                    onClick={() => {
                        const { runStakeIdTests } = require('../../utils/test-cookie-parsing');
                        runStakeIdTests();
                    }}
                    disabled={loading}
                >
                    Test Cookie Parsing
                </Button>
            </Box>

            {result.stakeId && (
                <Alert severity="success" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                        <strong>Stake ID:</strong> {result.stakeId}
                    </Typography>
                </Alert>
            )}

            {result.transactionId && (
                <Alert severity="success" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                        <strong>Transaction ID:</strong> {result.transactionId}
                    </Typography>
                </Alert>
            )}

            {result.error && (
                <Alert severity="error">
                    <Typography variant="body2">
                        <strong>Error:</strong> {result.error}
                    </Typography>
                </Alert>
            )}
        </Box>
    );
};

export default WalletTransactionTest;