import { useEffect, useState } from 'react';
import { AppShell, ComboboxItem, Container } from '@mantine/core';
import { FRAMERATE, FRAMESIZE } from '../../exports/consts';
import { useRecorder } from '../../utils/video/useRecorder';
import { useMediaStream } from '../../utils/video/useMediaStream';
import { ControlPanel } from './ControlPanel';
import { RealtimeVideoPanel } from './RealtimeVideoPanel';
import { useMediaQuery } from '@mantine/hooks';
import { LandmarkChunk } from '../../exports/types';
import { useNavigate } from 'react-router-dom';
import { createRowData } from '../../utils/s3/useCsvChunk';
import { fetchSessionData, fetchBlob } from '../../utils/s3/s3Utils';

export const Recording = () => {
  const [isDisplayRealtimePosture, setIsDisplayRealtimePosture] = useState<boolean>(true);
  const [isLocalSave, setIsLocalSave] = useState<boolean>(false);

  const [selectedUser, setUserValue] = useState<ComboboxItem | null>(null);
  const [selectedTechnique, setTechniqueValue] = useState<ComboboxItem | null>(null);

  const { stream } = useMediaStream({width: FRAMESIZE.VIDEO.WIDTH, height: FRAMESIZE.VIDEO.HEIGHT, frameRate: FRAMERATE});
  const { recordedBlob, isRecording, startRecording, stopRecording } = useRecorder({ stream, selectedUser, selectedTechnique, isLocalSave });
  
  const [ poseLandmarkChunk, setPoseLandmarkChunk] = useState<LandmarkChunk>([[-1, []]]);
  const [ handLandmarkChunkTopCamera, setHandLandmarkChunk] = useState<LandmarkChunk>([[-1, []]]);
  const [ handLandmarkChunkFrontCamera, setHandLandmarkChunkForHeatmap] = useState<LandmarkChunk>([[-1, []]]);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedUser && selectedTechnique) {
      if (recordedBlob && poseLandmarkChunk.length > 1 && handLandmarkChunkTopCamera.length > 1 && handLandmarkChunkTopCamera.length > 1) {

        const uploadThisSession = async() => {
          try {
            const sessionData: {session_id: string; timestamp: string } = await fetchSessionData();
            console.log("### upload start ### : " + sessionData['timestamp']);

            if (sessionData) {
            
              const poseDataArray = poseLandmarkChunk.map(([timestamp, landmarks]) => createRowData(timestamp, landmarks));
              const poseBlob = new Blob(poseDataArray, { type: 'text/csv' });
              
              const handTopDataArray = handLandmarkChunkTopCamera.map(([timestamp, landmarks]) => createRowData(timestamp, landmarks));
              const handTopBlob = new Blob(handTopDataArray, { type: 'text/csv' });
    
              const handFrontDataArray = handLandmarkChunkFrontCamera.map(([timestamp, landmarks]) => createRowData(timestamp, landmarks));
              const handFrontBlob = new Blob(handFrontDataArray, { type: 'text/csv' });
              
              await fetchBlob('PUT', recordedBlob, selectedUser.value, selectedTechnique.value, sessionData['timestamp'], sessionData['session_id'],  "all", "mp4")
              await fetchBlob('PUT', poseBlob, selectedUser.value, selectedTechnique.value, sessionData['timestamp'], sessionData['session_id'], "pose", "csv")
              await fetchBlob('PUT', handTopBlob, selectedUser.value, selectedTechnique.value, sessionData['timestamp'], sessionData['session_id'], "hand", "csv")
              await fetchBlob('PUT', handFrontBlob, selectedUser.value, selectedTechnique.value, sessionData['timestamp'], sessionData['session_id'], "hand_patient_camera", "csv")
            }
            console.log("### upload done ###: " + sessionData['timestamp']);
          } catch (error) {
            console.error('Error upload session data: ', error);
          }
        }
        uploadThisSession();

        // 画面遷移はRecordingに書きたいし、uploadは各コンポーネントにかきたい
        navigate("/video", { state: {
          videoBlob: recordedBlob,
          poseLandmarks: poseLandmarkChunk,
          handLandmarksTopCamera: handLandmarkChunkTopCamera,
          handLandmarksFrontCamera: handLandmarkChunkFrontCamera,
        }});
      }
    }
  }, [recordedBlob, handLandmarkChunkTopCamera, poseLandmarkChunk, handLandmarkChunkFrontCamera, navigate, selectedUser, selectedTechnique]);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (isMobile) return (
    <Container fluid p="h-lg" style={{height: '100vh'}}>
      <h2>スマホでは録画できません🙇‍♂️</h2>
    </Container>
  );

  return (
      <>
        <AppShell.Navbar>
          <ControlPanel
            selectedUser={selectedUser}
            setUserValue={setUserValue}
            selectedTechnique={selectedTechnique}
            setTechniqueValue={setTechniqueValue}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            isDisplayPosture={isDisplayRealtimePosture}
            setIsDisplayPosture={setIsDisplayRealtimePosture}
            isLocalSave={isLocalSave}
            setIsLocalSave={setIsLocalSave}
          />
        </AppShell.Navbar>
        <AppShell.Main>
          <RealtimeVideoPanel
            stream={stream}
            isRecording={isRecording}
            isDisplayPosture={isDisplayRealtimePosture}
            setPoseLandmarkChunk={setPoseLandmarkChunk}
            setHandLandmarkChunk={setHandLandmarkChunk}
            setHandLandmarkChunkForHeatmap={setHandLandmarkChunkForHeatmap}
          />
        </AppShell.Main>
      </>
  );
}