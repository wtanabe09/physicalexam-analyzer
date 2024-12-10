import { AppShell, Container } from '@mantine/core';
import { FRAMERATE, FRAMESIZE, NAVBAR_WIDTH } from '../../consts/consts';
import { useState } from 'react';
import { useRecorder } from '../../utils/video/useRecorder';
import { useMediaStream } from '../../utils/video/useMediaStream';
import { ControlPanel } from './ControlPanel';
import { RealtimeVideoPanel } from './RealtimeVideoPanel';
import { LinkButton } from '../../utils/uiux/LinkButton';
import { useMediaQuery } from '@mantine/hooks';

export const Recording = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // リアルタイムの骨格座標の表示/非表示を管理するためのステート
  const [isDisplayRealtimePosture, setIsDisplayRealtimePosture] = useState<boolean>(true);
  const [isLocalSave, setIsLocalSave] = useState<boolean>(false);
  const [sessionName, setSessionName] = useState<String|null>(null);

  const { stream } = useMediaStream({
    width: FRAMESIZE.VIDEO.WIDTH,
    height: FRAMESIZE.VIDEO.HEIGHT,
    frameRate: FRAMERATE
  });

  const {
    recordedBlob,
    isRecording,
    loadingStatus,
    startRecording, stopRecording
  } = useRecorder({ stream, sessionName, isLocalSave });

  if (isMobile) return (
    <Container fluid p="h-lg" style={{height: '100vh'}}>
      <h2>スマホでは録画できません🙇‍♂️</h2>
      <LinkButton text="動画選択画面へ" path="/videos" />
    </Container>
  );

  return (
      <AppShell
        navbar={{ width: NAVBAR_WIDTH, breakpoint: 'sm'}}
      >
        <AppShell.Navbar>
          <ControlPanel
            isRecording={isRecording}
            loadingStatus={loadingStatus}
            startRecording={startRecording}
            stopRecording={stopRecording}
            isDisplayPosture={isDisplayRealtimePosture}
            setIsDisplayPosture={setIsDisplayRealtimePosture}
            isLocalSave={isLocalSave}
            setIsLocalSave={setIsLocalSave}
            sessionName={sessionName}
            setSessionName={setSessionName}
          />
        </AppShell.Navbar>
        <AppShell.Main>
          <RealtimeVideoPanel
            stream={stream}
            isRecording={isRecording}
            recordedVideoBlob={recordedBlob}
            loadingStatus={loadingStatus}
            sessionName={sessionName}
            isDisplayPosture={isDisplayRealtimePosture}
          />
        </AppShell.Main>
      </AppShell>
  );
}