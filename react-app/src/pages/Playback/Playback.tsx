import { AppShell } from "@mantine/core";
import { VideoPanel } from "./VideoPanel ";
import { ControlPanel } from "./ControlPanel";
import { CameraRegions } from "../../exports/consts";
import { useLocation } from "react-router-dom";
import { ClipRegion, LandmarkChunk } from "../../exports/types";
import { useState } from "react";
import { ControlInMobile } from "./ControlInMobile";

export const Playback = () => {
  type LocationState = {
    videoBlob: Blob,
    poseLandmarks: LandmarkChunk,
    handLandmarksTopCamera: LandmarkChunk,
    handLandmarksFrontCamera: LandmarkChunk,
  };

  const location = useLocation();
  const { videoBlob, poseLandmarks, handLandmarksTopCamera, handLandmarksFrontCamera } = location.state as LocationState

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
    <>
      <AppShell.Navbar visibleFrom="sm" >
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
        <ControlInMobile
          isDisplayPosture={isDisplayPosture}
          setIsDisplayPosture={setIsDisplayPosture}
          zoomLevelTopCam={zoomLevelTopCam}
          setZoomLevelTopCam={setZoomLevelTopCam}
          zoomLevelFrontCam={zoomLevelFrontCam}
          setZoomLevelFrontCam={setZoomLevelFrontCam}
          radioValue={radioValue}
          setCamera={setCamera}
        />
      </AppShell.Main>
    </>
  )
}