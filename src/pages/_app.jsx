import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, polygon, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '../../styles/globals.css';
import Pagelayout from '../pagelayout/pagelayout';
import { useAccount } from "wagmi";

const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});



function MyApp({ Component, pageProps }) {
  const { data: account } = useAccount();
  const address = account?.address;

  useEffect(() => {
    if (address) {
      // Send the address to the login route
      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Successfully logged in');
          } else {
            console.log('Failed to log in');
          }
        })
        .catch((error) => {
          console.error('Failed to log in:', error);
        });
    }
  }, [address]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
      <Pagelayout>
        <Component {...pageProps} />
      </Pagelayout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
