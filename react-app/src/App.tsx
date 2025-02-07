import './App.css';
import '@mantine/core/styles.css';
import '@aws-amplify/ui-react/styles.css';

import { Top } from './pages/Top/Top';
import { Recording } from './pages/Recording/Recording';
import { Feedback } from './pages/Feedback/Feedback';
import { AppShell, MantineProvider, createTheme, virtualColor } from '@mantine/core';
import { Routes, Route } from "react-router-dom";
import { Playback } from './pages/Playback/Playback';

import awsConfig from './exports/aws-exports';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { I18n } from 'aws-amplify/utils';
import { APPSHELL_CONFIG } from './exports/consts';
import { AppShellHeader } from './utils/uiux/AppShellHeader';

Amplify.configure({...awsConfig});
I18n.setLanguage('ja');
I18n.putVocabulariesForLanguage('ja', {
  'Sign In': 'Login', // Tab header
  'Sign in': 'Log in', // Button label
  'Username': 'メールアドレス', // Username label
  'Enter your Username': 'Enter your email',
  'Enter your username': 'Enter your Email',
  'Password': 'パスワード', // Password label
  'Confirm Password': 'パスワード確認',
});

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
              // navbar={{ 
              //   width: APPSHELL_CONFIG.NAVBAR_WIDTH,
              //   breakpoint: 'xs',
              //   collapsed: {mobile: true},
              // }}
              footer={{ height: 150}}
            >
              <AppShellHeader signOut={signOut} />
              <Routes>
                <Route path="/" element={<Top user={user} signOut={signOut} />} />
                <Route path="/recording" element={<Recording />} />
                <Route path="/videos" element={<Feedback />}/>
                <Route path="/video/:id" element={<Playback />}/>
              </Routes>
            </AppShell>
        )}
      </Authenticator>
    </MantineProvider>
  );
};

export default App;
