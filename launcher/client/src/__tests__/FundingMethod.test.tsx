import * as React from 'react';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { LoginWithMetamask } from 'src/components/LoginWithMetamask';
import { Providers, setupClient, getSigners } from 'tests/utils';
import { MockConnector } from '@wagmi/core/connectors/mock';

describe('when rendered FundingMethod component', () => {
  it('should render Crypto and Fiat buttons', async () => {
    const client = setupClient({
      connectors: [
        new MockConnector({ options: { signer: getSigners()[0]! } }),
      ],
    });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<LoginWithMetamask onChange={() => 1} />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <Providers client={client}>{children}</Providers>
        ),
      });
    });
    expect(screen.getByText('Crypto')).toBeTruthy();
    expect(screen.getByText('Fiat')).toBeTruthy();
  });

  it('Crypto and fiat buttons should be enabled', async () => {
    const client = setupClient({
      connectors: [
        new MockConnector({ options: { signer: getSigners()[0]! } }),
      ],
    });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<LoginWithMetamask onChange={() => 1} />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <Providers client={client}>{children}</Providers>
        ),
      });
    });

    expect(screen.getByText('Crypto')).toBeEnabled();
    expect(screen.getByText('Fiat')).toBeEnabled();
  });
});

it('FundingMethod component renders correctly, corresponds to the snapshot', () => {
  const client = setupClient({
    connectors: [new MockConnector({ options: { signer: getSigners()[0]! } })],
  });
  const tree = renderer
    .create(
      <Providers client={client}>
        <LoginWithMetamask onChange={() => 1} />
      </Providers>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
