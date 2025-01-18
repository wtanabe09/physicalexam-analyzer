import { useEffect, useState } from "react";
import { AppShell, ComboboxItem, Loader } from "@mantine/core";
import { useCsvChunk } from "../../utils/s3/useCsvChunk";
import { useS3Downloader } from "../../utils/s3/useS3Downloader";
import { ControlPanel } from "./ControlPanel";
import { usePassword } from "../../utils/uiux/usePassword";
import { NAVBAR_WIDTH } from "../../consts/consts";
import { useNavigate } from "react-router-dom";
import { useObjectKeys } from "../../utils/video/useObjectKeys";

export const Feedback = () => {
  const [selectedDate, setDateValue] = useState<ComboboxItem|null>(null);
  const [selectedUser, setUserValue] = useState<ComboboxItem|null>(null);
  const [selectedVideoKey, setVideoKey] = useState<ComboboxItem|null>(null);

  const [password, setPassword] = useState('');
  const { isCorrectPass } = usePassword(selectedUser!, password);

  const { objectKeys, onGetObjectKeys } = useObjectKeys({ selectedDate, selectedUser, isCorrectPass }); // ユーザー毎の動画の一覧を取得
  const { videoBlob, csvBlobPose, csvBlobHand, csvBlobHandFrontCam } = useS3Downloader(selectedVideoKey, isCorrectPass);
  
  const { landmarkChunk: landmarkChunkPose } = useCsvChunk(csvBlobPose!, 'pose');
  const { landmarkChunk: landmarkChunkHand } = useCsvChunk(csvBlobHand!, 'hand');
  const { landmarkChunk: landmarkChunkHandFrontCam } = useCsvChunk(csvBlobHandFrontCam!, 'hand');

  const navigate = useNavigate();
  useEffect(() => {
    console.log("navigation standby");

    if (videoBlob && landmarkChunkPose && landmarkChunkHand && landmarkChunkHandFrontCam) {
      navigate("/video", { state: {
        videoBlob: videoBlob,
        poseLandmarks: landmarkChunkPose,
        handLandmarksTopCamera: landmarkChunkHand,
        handLandmarksFrontCamera: landmarkChunkHandFrontCam,
      }});
    }
  }, [videoBlob, landmarkChunkPose, landmarkChunkHand, landmarkChunkHandFrontCam, navigate]);

  useEffect(() => {
    if (objectKeys.length === 0) {setVideoKey(null)}
  }, [objectKeys]);


  return(
    <AppShell
      navbar={{
        width: NAVBAR_WIDTH, breakpoint: 'sm',
      }}
    >
      <AppShell.Navbar>
        <ControlPanel
          selectedDate={selectedDate}
          setDateValue={setDateValue}
          selectedUser={selectedUser}
          setUserValue={setUserValue}
          password={password}
          setPassword={setPassword}
          isCorrectPassword={isCorrectPass}
          onGetObjectKeys={onGetObjectKeys}
          videoOptions={objectKeys}
          selectedVideo={selectedVideoKey}
          setVideoKey={setVideoKey}
        />
      </AppShell.Navbar>
      <AppShell.Main p={'lg'}>
        {selectedVideoKey && !videoBlob && (
          <Loader/>
        )}
      </AppShell.Main>
    </AppShell>
  );
}