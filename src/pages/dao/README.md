# DAO Voting Module

Đây là module frontend cho chức năng DAO (Decentralized Autonomous Organization) voting government trong hệ thống CareBlock.

## Tính năng chính

### 1. Quản lý Proposals (Đề xuất)
- **Tạo đề xuất mới**: Người dùng có thể tạo các đề xuất với nhiều loại khác nhau
- **Xem danh sách đề xuất**: Hiển thị tất cả đề xuất với bộ lọc và tìm kiếm
- **Chi tiết đề xuất**: Xem thông tin chi tiết của từng đề xuất
- **Trạng thái đề xuất**: DRAFT, ACTIVE, PASSED, REJECTED, EXPIRED, CANCELLED

### 2. Hệ thống Voting (Bỏ phiếu)
- **Bỏ phiếu**: YES, NO, ABSTAIN
- **Lý do bỏ phiếu**: Người dùng có thể giải thích lý do cho quyết định của mình
- **Kiểm tra tư cách**: Xác minh người dùng có đủ điều kiện bỏ phiếu hay không
- **Lịch sử bỏ phiếu**: Theo dõi tất cả các lượt vote của người dùng

### 3. Governance Dashboard
- **Thống kê tổng quan**: Số liệu về proposals, voters, participation rate
- **Phân bổ vote**: Biểu đồ phân bố YES/NO/ABSTAIN
- **Hoạt động gần đây**: Timeline các hoạt động governance

## Cấu trúc thư mục

```
src/
├── components/dao/
│   ├── ProposalCard.tsx          # Card hiển thị thông tin proposal
│   ├── VotingDialog.tsx          # Dialog bỏ phiếu
│   └── GovernanceStatsCard.tsx   # Card thống kê governance
├── pages/dao/
│   ├── DAOProposalsPage.tsx      # Trang danh sách proposals
│   └── CreateProposalPage.tsx    # Trang tạo proposal mới
├── services/
│   ├── proposal.service.ts       # Service cho proposals
│   └── voting.service.ts         # Service cho voting
├── stores/dao/
│   ├── proposal.store.ts         # Redux store cho proposals
│   ├── voting.store.ts           # Redux store cho voting
│   └── index.ts                  # Combined DAO reducers
├── types/
│   └── daoVoting.type.ts         # Type definitions
└── enums/
    └── DAOVoting.ts              # Enums cho DAO voting
```

## Các loại Proposal

### 1. CONSTITUTIONAL
Thay đổi cơ bản trong cấu trúc governance

### 2. PARAMETER_CHANGE  
Sửa đổi các tham số protocol

### 3. TREASURY
Phân bổ quỹ treasury

### 4. INFO
Đề xuất thông tin và tư vấn

### 5. HARD_FORK
Nâng cấp protocol lớn

### 6. NO_CONFIDENCE
Vote bất tin nhiệm

## Cách sử dụng

### 1. Xem danh sách proposals
```
Truy cập: /dao/proposals
- Xem tất cả proposals
- Lọc theo status, type, category
- Tìm kiếm theo title/description
- Xem thống kê governance
```

### 2. Tạo proposal mới
```
Truy cập: /dao/proposals/create
- Điền thông tin cơ bản (title, description, type, category)
- Thêm rationale (lý do)
- Thêm impact và implementation (tùy chọn)
- Cấu hình thời gian voting
- Upload tài liệu hỗ trợ
```

### 3. Bỏ phiếu
```
- Click "Vote Now" trên ProposalCard
- Chọn YES/NO/ABSTAIN
- Thêm lý do (tùy chọn)
- Xác nhận vote
```

## API Endpoints

### Proposals
- `GET /dao/proposals` - Lấy danh sách proposals
- `GET /dao/proposals/:id` - Lấy chi tiết proposal
- `POST /dao/proposals` - Tạo proposal mới
- `PUT /dao/proposals/:id` - Cập nhật proposal
- `DELETE /dao/proposals/:id` - Xóa proposal

### Voting
- `POST /dao/votes` - Bỏ phiếu
- `GET /dao/proposals/:id/votes` - Lấy votes của proposal
- `GET /dao/voters/:id/votes` - Lấy votes của voter
- `GET /dao/voters/:id` - Thông tin voter

### Governance
- `GET /dao/governance/stats` - Thống kê governance
- `GET /dao/governance/metrics` - Metrics chi tiết
- `GET /dao/activity` - Hoạt động gần đây

## Components chính

### ProposalCard
```tsx
<ProposalCard 
  proposal={proposal}
  onVote={handleVote}
  showVoteButton={true}
/>
```

### VotingDialog
```tsx
<VotingDialog
  open={open}
  onClose={handleClose}
  onVote={handleVoteSubmit}
  proposalId={proposalId}
  proposalTitle={proposalTitle}
/>
```

### GovernanceStatsCard
```tsx
<GovernanceStatsCard stats={governanceStats} />
```

## Redux Store

### Proposal Store
- `proposals`: Danh sách proposals
- `currentProposal`: Proposal hiện tại
- `filter`: Bộ lọc
- `governanceStats`: Thống kê
- `loading`: Trạng thái loading

### Voting Store  
- `votes`: Danh sách votes
- `currentVoter`: Thông tin voter hiện tại
- `voterVotes`: Votes của voter
- `governanceActivity`: Hoạt động governance

## Validation

### Tạo Proposal
- Title: 10-200 ký tự
- Description: ít nhất 50 ký tự
- Rationale: ít nhất 50 ký tự
- Voting duration: 1-30 ngày

## Permissions

- **Tất cả user đã đăng nhập**: Xem proposals, bỏ phiếu
- **Có thể tạo proposal**: Tùy thuộc vào quyền của user
- **Admin**: Quản lý tất cả proposals

## Tích hợp Blockchain

Module này được thiết kế để tích hợp với:
- **Cardano blockchain** cho vote recording
- **Smart contracts** cho proposal execution
- **IPFS** cho document storage
- **Wallet integration** cho identity verification

## Error Handling

- Service layer xử lý lỗi API
- UI hiển thị thông báo lỗi thân thiện
- Validation form với Formik + Yup
- Loading states cho UX tốt hơn

## Responsive Design

- Mobile-first approach
- Material-UI components
- Grid layout responsive
- Touch-friendly voting interface