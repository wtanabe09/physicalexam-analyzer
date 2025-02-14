import { useEffect, useState } from 'react';
import { AppShell, ComboboxItem, Container, Grid } from '@mantine/core';
import { FRAMERATE, FRAMESIZE } from '../../exports/consts';
import { useRecorder } from '../../utils/video/useRecorder';
import { useMediaStream } from '../../utils/video/useMediaStream';
import { ControlPanel } from './ControlPanel';
import { RealtimeVideoPanel } from './RealtimeVideoPanel';
import { useMediaQuery } from '@mantine/hooks';
import { LandmarkChunk } from '../../exports/types';
import { useNavigate } from 'react-router-dom';
import { createRowData } from '../../utils/aws/useCsvChunk';
import { fetchPresignedUrl, getTimestamp, uploadFileToS3 } from '../../utils/aws/s3Util';
import { fetchAuthSession } from 'aws-amplify/auth';

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

        const timestamp = getTimestamp();
        const uploadThisSession = async() => {
          try {
            console.log("### upload start ### : " + timestamp);
          
            const poseDataArray = poseLandmarkChunk.map(([timestamp, landmarks]) => createRowData(timestamp, landmarks));
            const poseBlob = new Blob(poseDataArray, { type: 'text/csv' });
            
            const handTopDataArray = handLandmarkChunkTopCamera.map(([timestamp, landmarks]) => createRowData(timestamp, landmarks));
            const handTopBlob = new Blob(handTopDataArray, { type: 'text/csv' });
  
            const handFrontDataArray = handLandmarkChunkFrontCamera.map(([timestamp, landmarks]) => createRowData(timestamp, landmarks));
            const handFrontBlob = new Blob(handFrontDataArray, { type: 'text/csv' });

            const session = await fetchAuthSession();
            const idToken = session.tokens?.idToken?.toString();
            const userNum = selectedUser.value
            const techniqueId = selectedTechnique.value
            
            // 1. presigned URLs を取得
            const presignedUrls = await Promise.all([
              fetchPresignedUrl('PUT', 'mp4', idToken!, userNum, techniqueId, timestamp, 'all'),
              fetchPresignedUrl('PUT', 'csv', idToken!, userNum, techniqueId, timestamp, 'pose'),
              fetchPresignedUrl('PUT', 'csv', idToken!, userNum, techniqueId, timestamp, 'hand'),
              fetchPresignedUrl('PUT', 'csv', idToken!, userNum, techniqueId, timestamp, 'hand-front'),
            ]);

            if (!presignedUrls.every(url => url)) throw new Error("Failed to fetch presigned URLs");

            // 2. ファイルを並列でアップロード
            await Promise.all([
              uploadFileToS3(presignedUrls[0]!, recordedBlob),
              uploadFileToS3(presignedUrls[1]!, poseBlob),
              uploadFileToS3(presignedUrls[2]!, handTopBlob),
              uploadFileToS3(presignedUrls[3]!, handFrontBlob),
            ]);
            console.log("### upload done ###: " + timestamp);
          } catch (error) {
            console.error('Error upload session data: ', error);
          }
        }
        uploadThisSession();

        // 画面遷移はRecordingに書きたいし、uploadは各コンポーネントにかきたい
        navigate(`/video/${selectedTechnique.value}-${timestamp}`, { state: {
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
      {/* <AppShell.Navbar>
        
      </AppShell.Navbar> */}
      <AppShell.Main>
        <Container fluid>
        <Grid grow>
          <Grid.Col span={2}>
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
          </Grid.Col>
          <Grid.Col span={10}>
            <RealtimeVideoPanel
              stream={stream}
              isRecording={isRecording}
              isDisplayPosture={isDisplayRealtimePosture}
              setPoseLandmarkChunk={setPoseLandmarkChunk}
              setHandLandmarkChunk={setHandLandmarkChunk}
              setHandLandmarkChunkForHeatmap={setHandLandmarkChunkForHeatmap}
            />
          </Grid.Col>
        </Grid>
        </Container>
      </AppShell.Main>
    </>
  );
}