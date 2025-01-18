import { AppShell} from "@mantine/core";
import { VideoPanel } from "./VideoPanel ";
import { ControlPanel } from "./ControlPanel";
import { CameraRegions, NAVBAR_WIDTH } from "../../consts/consts";
import { useLocation } from "react-router-dom";
import { ClipRegion, LandmarkChunk } from "../../consts/types";
import { useState } from "react";

export const Playback = () => {
  const location = useLocation();
  const { videoBlob, poseLandmarks, handLandmarksTopCamera, handLandmarksFrontCamera} = location.state as {
    videoBlob: Blob,
    poseLandmarks: LandmarkChunk,
    handLandmarksTopCamera: LandmarkChunk,
    handLandmarksFrontCamera: LandmarkChunk,
  };

  const [isDisplayPosture, setIsDisplayPosture] = useState<boolean>(true);
  const [zoomLevelFrontCam, setZoomLevelFrontCam] = useState<number>(1);
  const [zoomLevelTopCam, setZoomLevelTopCam] = useState<number>(1);

  const [heatmapLandmarks, setHeatmapLandmarks] = useState<LandmarkChunk>(handLandmarksFrontCamera);
  const [heatmapCamera, setHeatmapCamera] = useState<ClipRegion>(CameraRegions.Front);

  const [radioValue, setRadioValue] = useState<string>("Front");
  const setCamera = (value: string) => {
    if (value === "Front") {
      setHeatmapCamera(CameraRegions.Front);
      setHeatmapLandmarks(handLandmarksFrontCamera);
    } else if (value === "Top") {
      setHeatmapCamera(CameraRegions.Top);
      setHeatmapLandmarks(handLandmarksTopCamera);
    }
    setRadioValue(value);
  }

  return(
    <AppShell
      navbar={{
        width: NAVBAR_WIDTH, breakpoint: 'sm',
        collapsed: { mobile: true }
      }}
    >
      <AppShell.Navbar>
        <ControlPanel
          isDisplayPosture={isDisplayPosture}
          setIsDisplayPosture={setIsDisplayPosture}
          zoomLevelTopCam={zoomLevelTopCam}
          setZoomLevelTopCam={setZoomLevelTopCam}
          zoomLevelFrontCam={zoomLevelFrontCam}
          setZoomLevelFrontCam={setZoomLevelFrontCam}
          radioValue={radioValue}
          setCamera={setCamera}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <VideoPanel
          videoBlob={videoBlob}
          poseLandmarks={poseLandmarks}
          handLandmarksTopCamera={handLandmarksTopCamera}
          handLandmarksFrontCamera={handLandmarksFrontCamera}
          heatmapLandmarks={heatmapLandmarks}
          heatmapCamera={heatmapCamera}
          isDisplayPosture={isDisplayPosture}
          zoomLevelFrontCam={zoomLevelFrontCam}
          zoomLevelTopCam={zoomLevelTopCam}
        />
      </AppShell.Main>
    </AppShell>
  )
}