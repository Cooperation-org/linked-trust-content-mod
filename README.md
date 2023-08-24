# The Linked Trust Content Moderation

## What is it about ? 

Leverages blockchain technology and human protocol integration to ensure accurate and transparent content reviews. 
The project aims to provide a secure and efficient way to moderate content using blockchain technology and a human protocol integration. It facilitates content review tasks, enforces moderation rules defined by group owners, and ensures fair compensation for content workers. 

## Features 

- Group setup and moderation rule definition by group owners.
- Escrow-based funding of content moderation tasks.
- Integration with a human protocol for content review.
- Content reporting by users, triggering content moderation tasks.
- On-chain job registration, routing, and settlement.


## How to run 


### Metamask Account Setup
1. Set up Accounts: In Metamask, create three accounts: one for the Job Creator and two for Moderators.
2. Fund with Matic: Add Matic to the Job Creator's account using the Polygon Scan faucet.
3. Token Setup:
  - Click 'Import tokens' in Metamask.
  - For 'Token Contract Address', input 0x0376D26246Eb35FF4F9924cF13E6C05fd0bD7Fb4.
  - Set 'Token Symbol' as 'HMT'.
  - Click 'Add custom token'.
  - Repeat for both Moderator accounts.
4. Test HMT Acquisition:
  - Visit the Human Faucet for testnet.
  - Insert the Job Creator's account address.
  - Receive test HMT tokens.

### Group and Job Creation
1. Access Launcher:
  - Visit Repute Social Launcher.
  - Sign in using the Job Creator account.
2. Create a Group (change the route please) 
  - Fill in the necessary group details.
  - Click 'Fund and Request Group'.
  - Note down the displayed group ID.
3. Job Creation via API:
  - Navigate to the job dashboard in the Launcher.
  - Select 'View Details' for your new group.
  - Generate API KEY and copy it. 
  - Click 'Create Job', then choose 'Open Swagger'.
  - In Swagger UI, use the /groups/{groupId}/jobs API.
  - Copy your API KEY in Authorize (@public missing in readme). 
  - Click 'Try it out' and replace {groupId} with your actual group ID.
  - Hit 'Execute' to create the job.
4. Adding Workers to Group:
  - Back in the Launcher, inside the group details, click 'Add Worker'.
  - Add both Moderator accounts (Worker 1 & Worker 2) to this group.

### Moderator App Review
1. Moderator Review:
  - Open the Moderator app.
  - Sign in as Worker 1.
  - Choose your group from the dropdown.
  - View the job, then mark as 'Risk' or 'No risk'.
2. Second Moderator Review:
  - Logout as Worker 1.
  - Sign in as Worker 2.
  - Repeat the review steps.
3. Verify Token Receipt:
  - Ensure both Worker 1 and Worker 2 received HMTs in their Metamask wallets.


