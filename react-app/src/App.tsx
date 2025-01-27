import './App.css';
import '@mantine/core/styles.css';
import { Recording } from './pages/Recording/Recording';
import { Feedback } from './pages/Feedback/Feedback';
import { AppShell, MantineProvider, createTheme, virtualColor } from '@mantine/core';
import { Routes, Route } from "react-router-dom";
import { Playback } from './pages/Playback/Playback';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsConfig from './exports/aws-exports';
import { Top } from './pages/Top/Top';
import { APPSHELL_CONFIG } from './exports/consts';
import { AppShellHeader } from './utils/uiux/AppShellHeader';

Amplify.configure({...awsConfig});

const theme = createTheme({
  colors: {
    primary: virtualColor({
      name: 'primary',
      dark: 'pink',
      light: 'cyan',
    }),
  },
});

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <Authenticator signUpAttributes={['name']}>
        {({ signOut, user }) => (
            <AppShell
              header={{ height: APPSHELL_CONFIG.HEADER_HEIGHT }}
              navbar={{ width: APPSHELL_CONFIG.NAVBAR_WIDTH, breakpoint: 'sm'}}
            >
              <AppShellHeader user={user} signOut={signOut} />
              <Routes>
                <Route path="/" element={<Top user={user} signOut={signOut} />} />
                <Route path="/recording" element={<Recording />} />
                <Route path="/videos" element={<Feedback />}/>
                <Route path="/video" element={<Playback />}/>
              </Routes>
            </AppShell>
        )}
      </Authenticator>
    </MantineProvider>
  );
};

export default App;
