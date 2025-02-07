import { Group, Radio, Title } from "@mantine/core"
import { useState } from "react";
import { ClipRegion, LandmarkChunk } from "../../exports/types";
import { CameraRegions } from "../../exports/consts";
import { HeatmapVideo } from "../../utils/graph/HeatmapVideo";
import { VideoPanelProps } from "./ZoomPanel";

export const HeatMapPanel = ({
  videoRef, handLandmarksFrontCamera, handLandmarksTopCamera, isDisplayPosture,
  canvasWidth, canvasHeight
}: VideoPanelProps) => {

  // const [heatmapLandmarks, setHeatmapLandmarks] = useState<LandmarkChunk>(handLandmarksFrontCamera);
  // const [heatmapCamera, setHeatmapCamera] = useState<ClipRegion>(CameraRegions.Front);

  // const [radioValue, setRadioValue] = useState<string>("Front");
  // const setCamera = (value: string) => {
  //   if (value === "Front") {
  //     setHeatmapCamera(CameraRegions.Front);
  //     setHeatmapLandmarks(handLandmarksFrontCamera);
  //   } else if (value === "Top") {
  //     setHeatmapCamera(CameraRegions.Top);
  //     setHeatmapLandmarks(handLandmarksTopCamera);
  //   }
  //   setRadioValue(value);
  // }
  
  return (
    <div className="heatmap-container">
      <Title order={3} mb={2}>(4) ヒートマップ</Title>
      <Group>
        <HeatmapVideo
          originVideoRef={videoRef}
          landmarks={handLandmarksFrontCamera}
          clipRegion={CameraRegions.Front}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
        <HeatmapVideo
          originVideoRef={videoRef}
          landmarks={handLandmarksTopCamera}
          clipRegion={CameraRegions.Top}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      </Group>
      {/* <Radio.Group
        value={radioValue}
        onChange={(event) => setCamera(event)}
      >
        <Radio value="Top" label="(2) 上カメラ"/>
        <Radio value="Front" label="(3) 患者カメラ"/>
      </Radio.Group> */}
    </div>
  )
}