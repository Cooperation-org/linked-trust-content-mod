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
