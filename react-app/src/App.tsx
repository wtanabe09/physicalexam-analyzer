import './App.css';
import '@mantine/core/styles.css';
// import { Top } from './pages/Top/Top';
import { Recording } from './pages/Recording/Recording';
import { Feedback } from './pages/Feedback/Feedback';
import { MantineProvider, createTheme, virtualColor } from '@mantine/core';
import { Routes, Route } from "react-router-dom";
import { Playback } from './pages/Playback/Playback';


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
      <Routes>
        <Route path="/" element={<Recording />} />
        <Route path="/recording" element={<Recording />} />
        <Route path="/videos" element={<Feedback />}/>
        <Route path="/video" element={<Playback />}/>
      </Routes>
    </MantineProvider>
  );
};

export default App;
