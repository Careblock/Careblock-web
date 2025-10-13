export enum ProposalType {
    CONSTITUTIONAL = 'CONSTITUTIONAL',
    PARAMETER_CHANGE = 'PARAMETER_CHANGE',
    TREASURY = 'TREASURY',
    INFO = 'INFO',
    HARD_FORK = 'HARD_FORK',
    NO_CONFIDENCE = 'NO_CONFIDENCE',
}

export enum ProposalStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    PASSED = 'PASSED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
}

export enum VoteChoice {
    YES = 'YES',
    NO = 'NO',
    ABSTAIN = 'ABSTAIN',
}

export enum GovernanceRole {
    DREP = 'DREP',
    CC_MEMBER = 'CC_MEMBER',
    SPO = 'SPO',
    CITIZEN = 'CITIZEN',
}

export enum VotingPower {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
}

export enum ProposalCategory {
    TECHNICAL = 'TECHNICAL',
    ECONOMIC = 'ECONOMIC',
    GOVERNANCE = 'GOVERNANCE',
    SOCIAL = 'SOCIAL',
    EMERGENCY = 'EMERGENCY',
}