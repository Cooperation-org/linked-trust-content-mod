# Content Moderator

### Run the dev environment from project root

```
yarn dev
```

## Process Flow

![Diagram](assets/flow1.png)
![Diagram](assets/flow2.png)
![Diagram](assets/flow3.png)
![Diagram](assets/flow4.png)
![Diagram](assets/flow5.png)

### Testing

- With Metamask, create at least 3 accounts. One for the job creator and other 2 for the moderators.
- The job creator account will need some Matic as gas. Add some matic using [polygon scan faucet](https://faucet.polygon.technology/) for the job creator's account.
- Then in Metamask, click on 'Import tokens'. Fill in 'Token Contract Address' field with this token address- `0x0376D26246Eb35FF4F9924cF13E6C05fd0bD7Fb4` and 'Token symbol' with 'HMT'. Then click on 'Add custom token'.
- Do the previous step for worker accounts as well.
- Then go to [Human Faucet for testnet](https://dashboard.humanprotocol.org/faucet). In the 'Address' field paste your job creator account address to receive some HMT for testing.
- Using the job creator account sign in to https://launcher.repute.social. Fill in the the required information for creating a group. Then click of 'Fund and Request Group'. A group should be created in the backend and it should show the id of the group. Keep note of the group id.
- Go to job dashboard. The newly created group should show up in the dashboard. Click on 'View Details' button on the group that was just created. Click on create job. A pop up sould appear. Click on open swagger.
- From the swagger ui, click on `/groups/{groupId}/jobs` api. Click on 'Try it out' button. Change the group id with the id of the group you created. Then click on 'Execute'. A job should have been created.
- Go back to launcher app. From the group details of the job click on `Add worker` button and add your worker 1 and worker 2 accounts to add the workers to this group.
- Now go to [moderator's app](https://exchange.repute.social/). Log in using one of the worker accounts. From the `Select a group` dropdown, select the group you previously created as job creator. The job that was created by the job owner should be visible. Click on the 'View Details' button to check out the job and review as 'Risk' or 'No risk' using respective buttons.
- Disconnect from the current worker account, and log in using another worker account and repeat the previous step.
- Once both the review is done, both the worker should receive some HMTs. Check both wallets to ensure the tokens have been transferred.


# Linked Trust Content Moderation

Welcome to the Linked Trust Content Moderation project! This repository contains code and documentation for a content moderation system that leverages blockchain technology and human protocol integration to ensure accurate and transparent content reviews. The system also includes CI/CD pipelines for building and updating Docker containers.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Architecture](#architecture)
- [Workflow](#workflow)
- [CI/CD Pipelines](#cicd-pipelines)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Linked Trust Content Moderation project aims to provide a secure and efficient way to moderate content using blockchain technology and a human protocol integration. It facilitates content review tasks, enforces moderation rules defined by group owners, and ensures fair compensation for content workers.

## Features

- Group setup and moderation rule definition by group owners.
- Escrow-based funding of content moderation tasks.
- Integration with a human protocol for content review.
- Content reporting by users, triggering content moderation tasks.
- On-chain job registration, routing, and settlement.
- CI/CD pipelines for Docker container management.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- List your prerequisites, e.g., programming languages, frameworks, tools, etc.

### Installation

1. Clone this repository.
2. Detailed installation steps, dependencies, and configurations.

### Usage

1. Instructions for configuring and running the system.
2. How to define group rules and moderation criteria.
3. How users can report content and initiate moderation tasks.
4. Monitoring and reporting mechanisms.

## Architecture

Explain the high-level architecture of your system. Describe the roles of components like the Job Launcher, Exchange Oracle, Content Moderators, etc. Provide diagrams if possible.

## Workflow

Outline the step-by-step workflow of your content moderation process. You can use bullet points or diagrams to make it easier to understand.

## CI/CD Pipelines

This project includes two CI/CD pipelines for managing Docker containers:

### Build Pipeline

1. Describe how the build pipeline works.
2. Any specific stages, scripts, or configurations used.
3. How it triggers when changes are pushed to the repository.

### Update Pipeline

1. Explain the update pipeline's purpose.
2. How it updates Docker containers in production.
3. Any safeguards or approval steps in place.

## Contributing

We welcome contributions to improve and expand this project. To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your enhancements or fixes.
4. Submit a pull request, describing your changes.

## License

This project is licensed under the [License Name] License - see the [LICENSE](LICENSE) file for details.
