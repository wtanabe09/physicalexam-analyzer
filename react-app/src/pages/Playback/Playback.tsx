import { AppShell, Group, Radio, Stack} from "@mantine/core";
import { VideoPanel } from "./VideoPanel ";
import { ControlPanel } from "./ControlPanel";
import { CameraRegions } from "../../exports/consts";
import { useLocation } from "react-router-dom";
import { ClipRegion, LandmarkChunk } from "../../exports/types";
import { useState } from "react";
import { ToggleButton } from "../../utils/uiux/ToggleButton";
import { ZoomLevelBar } from "../../utils/uiux/ZoomLevelBar";

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
    <>
      <AppShell.Navbar visibleFrom="sm">
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

          <Stack p={5} m={10} hiddenFrom="sm">
            <div className="mb-2 pb-4 border-b">
              <ToggleButton
                labelText="骨格マーキング表示"
                status={isDisplayPosture}
                setState={setIsDisplayPosture}
              />
            </div>
            <div className="landmark-control border-b pb-8">
              <p className="mb-2">カメラ拡大率</p>
              <div className="mb-8">
                <ZoomLevelBar
                  label="(2)真上カメラ 拡大率"
                  zoomLevel={zoomLevelTopCam}
                  setZoomLevel={setZoomLevelTopCam}
                />
              </div>
              <div>
                <ZoomLevelBar
                  label="(3)患者正面カメラ 拡大率"
                  zoomLevel={zoomLevelFrontCam}
                  setZoomLevel={setZoomLevelFrontCam}
                />
              </div>
            </div>
            <Group className="border-b mb-4 pb-4">
              <p className="pb-1">ヒートマップ対象カメラ選択</p>
              <Radio.Group
                value={radioValue}
                onChange={(event) => setCamera(event)}
              >
                <Radio value="Top" label="(2) 上カメラ"/>
                <Radio value="Front" label="(3) 患者カメラ"/>
              </Radio.Group>
            </Group>
          </Stack>

        </AppShell.Main>
    </>
  )
}