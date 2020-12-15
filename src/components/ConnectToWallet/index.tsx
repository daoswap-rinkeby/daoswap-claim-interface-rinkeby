import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const ConnectToWallet: React.FC = () => {
  const isMetamask = window.ethereum?.isMetaMask;
  console.info(isMetamask);
  return (
    <Box m={5}>
      <Box display="flex" justifyContent="center" m={1} p={1}>
        <Button variant="contained" color="secondary" size="large">
          Connect Wallet
        </Button>
      </Box>
    </Box>
  );
};

export default ConnectToWallet;
