import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Alert,
    Chip,
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { CreateProposalRequest } from '@/types/daoVoting.type';
import { ProposalType, ProposalCategory } from '@/enums/DAOVoting';
import ProposalService from '@/services/proposal.service';

const validationSchema = yup.object({
    title: yup
        .string()
        .required('Title is required')
        .min(10, 'Title must be at least 10 characters')
        .max(200, 'Title must not exceed 200 characters'),
    description: yup
        .string()
        .required('Description is required')
        .min(50, 'Description must be at least 50 characters'),
    type: yup
        .string()
        .oneOf(Object.values(ProposalType))
        .required('Proposal type is required'),
    category: yup
        .string()
        .oneOf(Object.values(ProposalCategory))
        .required('Category is required'),
    rationale: yup
        .string()
        .required('Rationale is required')
        .min(50, 'Rationale must be at least 50 characters'),
    impact: yup.string(),
    implementation: yup.string(),
    votingDuration: yup
        .number()
        .required('Voting duration is required')
        .min(1, 'Voting duration must be at least 1 day')
        .max(30, 'Voting duration cannot exceed 30 days'),
});

const CreateProposalPage: React.FC = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);

    const formik = useFormik<CreateProposalRequest>({
        initialValues: {
            title: '',
            description: '',
            type: ProposalType.INFO,
            category: ProposalCategory.GOVERNANCE,
            rationale: '',
            impact: '',
            implementation: '',
            votingDuration: 7,
            documents: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            setSubmitting(true);
            setError(null);

            try {
                const proposalData: CreateProposalRequest = {
                    ...values,
                    documents,
                };

                ProposalService.createProposal(proposalData).subscribe({
                    next: (proposal) => {
                        console.log('Proposal created successfully:', proposal);
                        navigate('/dao/proposals');
                    },
                    error: (error) => {
                        console.error('Error creating proposal:', error);
                        setError('Failed to create proposal. Please try again.');
                        setSubmitting(false);
                    }
                });
            } catch (error) {
                console.error('Error creating proposal:', error);
                setError('Failed to create proposal. Please try again.');
                setSubmitting(false);
            }
        },
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setDocuments(prev => [...prev, ...files]);
        }
    };

    const removeDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const getTypeDescription = (type: ProposalType) => {
        switch (type) {
            case ProposalType.CONSTITUTIONAL:
                return 'Fundamental changes to governance structure';
            case ProposalType.PARAMETER_CHANGE:
                return 'Modify protocol parameters';
            case ProposalType.TREASURY:
                return 'Treasury fund allocation';
            case ProposalType.INFO:
                return 'Information and advisory proposals';
            case ProposalType.HARD_FORK:
                return 'Major protocol upgrades';
            case ProposalType.NO_CONFIDENCE:
                return 'Vote of no confidence';
            default:
                return '';
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Proposal
            </Typography>

            <Paper sx={{ p: 4 }}>
                <form onSubmit={formik.handleSubmit}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {/* Basic Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                label="Proposal Title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    id="type"
                                    name="type"
                                    value={formik.values.type}
                                    onChange={formik.handleChange}
                                    error={formik.touched.type && Boolean(formik.errors.type)}
                                >
                                    {Object.values(ProposalType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            <Box>
                                                <Typography variant="body1">{type}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {getTypeDescription(type)}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    id="category"
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    error={formik.touched.category && Boolean(formik.errors.category)}
                                >
                                    {Object.values(ProposalCategory).map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                id="description"
                                name="description"
                                label="Description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </Grid>

                        <Divider sx={{ width: '100%', my: 2 }} />

                        {/* Detailed Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Detailed Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                id="rationale"
                                name="rationale"
                                label="Rationale"
                                placeholder="Explain why this proposal is necessary and beneficial..."
                                value={formik.values.rationale}
                                onChange={formik.handleChange}
                                error={formik.touched.rationale && Boolean(formik.errors.rationale)}
                                helperText={formik.touched.rationale && formik.errors.rationale}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                id="impact"
                                name="impact"
                                label="Expected Impact (Optional)"
                                placeholder="Describe the expected impact of this proposal..."
                                value={formik.values.impact}
                                onChange={formik.handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                id="implementation"
                                name="implementation"
                                label="Implementation Details (Optional)"
                                placeholder="Describe how this proposal will be implemented..."
                                value={formik.values.implementation}
                                onChange={formik.handleChange}
                            />
                        </Grid>

                        <Divider sx={{ width: '100%', my: 2 }} />

                        {/* Voting Configuration */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Voting Configuration
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                id="votingDuration"
                                name="votingDuration"
                                label="Voting Duration (days)"
                                value={formik.values.votingDuration}
                                onChange={formik.handleChange}
                                error={formik.touched.votingDuration && Boolean(formik.errors.votingDuration)}
                                helperText={formik.touched.votingDuration && formik.errors.votingDuration}
                                inputProps={{ min: 1, max: 30 }}
                            />
                        </Grid>

                        {/* Documents */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Supporting Documents (Optional)
                            </Typography>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileUpload}
                                style={{ marginBottom: 16 }}
                            />
                            {documents.length > 0 && (
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {documents.map((file, index) => (
                                        <Chip
                                            key={index}
                                            label={file.name}
                                            onDelete={() => removeDocument(index)}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            )}
                        </Grid>

                        {/* Actions */}
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="space-between" mt={3}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/dao/proposals')}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Creating...' : 'Create Proposal'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateProposalPage;