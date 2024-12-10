import { useEffect, useState } from "react";
import { AppShell, ComboboxItem } from "@mantine/core";
import { useCsvChunk } from "../../utils/s3/useCsvChunk";
import { useS3Data } from "../../utils/s3/useS3Data";
import { ControlPanel } from "./ControlPanel";
import { usePassword } from "../../utils/uiux/usePassword";
import { NAVBAR_WIDTH } from "../../consts/consts";
import { useNavigate } from "react-router-dom";
import { useGetVideoListButton } from "../../utils/video/useGetVideoListButton";
import { LoaderCenter } from "../../utils/uiux/LoaderCenter";

export const Feedback = () => {
  const [selectedDate, setDateValue] = useState<ComboboxItem|null>(null);
  const [selectedUser, setUserValue] = useState<ComboboxItem|null>(null);
  const [selectedVideo, setVideoValue] = useState<ComboboxItem|null>(null);
  const [password, setPassword] = useState('');

  const { isCorrectPass } = usePassword(selectedUser!, password);
  const { options, onGetVideo } = useGetVideoListButton({ selectedDate, selectedUser, isCorrectPass }); // ユーザー毎の動画の一覧を取得
  const { videoBlob, csvBlobPose, csvBlobHand, csvBlobHandFrontCam, placeholder, videoLoadState } = useS3Data(options, selectedVideo, isCorrectPass);
  
  const { landmarkChunk: landmarkChunkPose, error: errorPose } = useCsvChunk(csvBlobPose!, 'pose');
  const { landmarkChunk: landmarkChunkHand, error: errorHand } = useCsvChunk(csvBlobHand!, 'hand');
  const { landmarkChunk: landmarkChunkHandFrontCam, error: errorHandFrontCam } = useCsvChunk(csvBlobHandFrontCam!, 'hand');
  if (errorPose) console.error("Error processing CSV:", errorPose);
  if (errorHand) console.error("Error processing CSV:", errorHand);
  if (errorHandFrontCam) console.error("Error processing CSV:", errorHandFrontCam);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("navigation standby", videoLoadState);
    if(videoBlob && landmarkChunkPose && landmarkChunkHand) {
      navigate("/video", { state: {
        videoBlob: videoBlob,
        loadingStatus: videoLoadState,
        poseLandmarks: landmarkChunkPose,
        handLandmarksTopCamera: landmarkChunkHand,
        handLandmarksFrontCamera: landmarkChunkHandFrontCam,
      }});
    }
  }, [videoLoadState, videoBlob, landmarkChunkPose, landmarkChunkHand]);

  useEffect(() => {
    if (options.length === 0) {setVideoValue(null)}
  }, [options]);


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
          onGetVideo={onGetVideo}
          videoOptions={options}
          selectedVideo={selectedVideo}
          setVideoValue={setVideoValue}
          placeholder={placeholder}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <LoaderCenter status={videoLoadState} />
      </AppShell.Main>
    </AppShell>
  );
}