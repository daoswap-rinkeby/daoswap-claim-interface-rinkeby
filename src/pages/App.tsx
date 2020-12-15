import React, { Suspense } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ConnectToWallet from '../components/ConnectToWallet';

const isConnectWallet = false;

function GetAppScreen() {
  if (isConnectWallet) {
    return (
      <Box m={5}>
        <Box display="flex" justifyContent="center" m={1} p={1}>
          <Typography component="div">
            <Box display="flex" justifyContent="center" fontSize="h4.fontSize" m={1}>
              Extractable DOI
            </Box>
            <Box display="flex" justifyContent="center" fontSize="h3.fontSize" m={1}>
              10
            </Box>
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" m={1} p={1}>
          <Button variant="contained" color="primary" size="large">
            Claim
          </Button>
        </Box>
      </Box>
    );
  } else {
    return <ConnectToWallet />;
  }
}

const App: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <GetAppScreen />
    </Suspense>
  );
};

export default App;
