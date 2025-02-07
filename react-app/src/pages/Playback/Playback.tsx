import { AppShell, Container, Tabs } from "@mantine/core";
import { VideoPanel } from "./VideoPanel";
import { useLocation } from "react-router-dom";
import { LandmarkChunk } from "../../exports/types";
import { IconPhoto, Icon123 } from '@tabler/icons-react';
import { ZoomPanel } from "./ZoomPanel";
import { useEffect, useRef, useState } from "react";
import { FRAMESIZE } from "../../exports/consts";
import { VideoControls } from "./VideoControls";
import { HeatMapPanel } from "./HeatMapPanel";
import { useViewportSize } from "@mantine/hooks";
import { ComparisonPanel } from "./ComparisonPanel";

export const Playback = () => {
  type LocationState = {
    videoBlob: Blob,
    poseLandmarks: LandmarkChunk,
    handLandmarksTopCamera: LandmarkChunk,
    handLandmarksFrontCamera: LandmarkChunk,
  };

  const location = useLocation();
  const { 
    videoBlob, poseLandmarks, handLandmarksTopCamera, handLandmarksFrontCamera
  } = location.state as LocationState

  const videoRef = useRef<HTMLVideoElement>(null);
  // const widthRef = useRef<number>(FRAMESIZE.CANVAS.WIDTH);
  // const heighthRef = useRef<number>(FRAMESIZE.CANVAS.HEIGHT);
  const {width} = useViewportSize();

  const [isDisplayPosture, setIsDisplayPosture] = useState<boolean>(true);

  const [canvasSize, setCanvasSize] = useState({ width: FRAMESIZE.CANVAS.WIDTH, height: FRAMESIZE.CANVAS.HEIGHT });


  useEffect(() => {
    if (width) {
      const mag = (width / 2) / FRAMESIZE.CANVAS.WIDTH;
      const offset = {width: (0.05 * FRAMESIZE.CANVAS.WIDTH), height: (0.05 * FRAMESIZE.CANVAS.HEIGHT)};
      setCanvasSize({
        width: mag < 1 ? FRAMESIZE.CANVAS.WIDTH * mag - offset.width : FRAMESIZE.CANVAS.WIDTH,
        height: mag < 1 ? FRAMESIZE.CANVAS.HEIGHT * mag - offset.height : FRAMESIZE.CANVAS.HEIGHT,
      });
    }
  }, [width]);

  // useEffect(() => {
  //   const innerWidth = window.innerWidth
  //   const mag = (innerWidth / 2) / FRAMESIZE.CANVAS.WIDTH;
  //   const offset = {width: (0.05 * FRAMESIZE.CANVAS.WIDTH), height: (0.05 * FRAMESIZE.CANVAS.HEIGHT)};
  //   widthRef.current = mag < 1 ? FRAMESIZE.CANVAS.WIDTH * mag - offset.width : FRAMESIZE.CANVAS.WIDTH;
  //   heighthRef.current =  mag < 1 ? FRAMESIZE.CANVAS.HEIGHT * mag - offset.height : FRAMESIZE.CANVAS.HEIGHT;
  // }, []);

  return(
    <AppShell.Main>
      <video
        id="input_stream"
        ref={videoRef}
        width={FRAMESIZE.CANVAS.WIDTH} height={FRAMESIZE.CANVAS.HEIGHT}
        style={{ display: "none" }}
      />
      <Container fluid p={15}>
        <Tabs radius="xs"defaultValue="gallery" mb={20}>
          <Tabs.List>
            <Tabs.Tab value="gallery" leftSection={<IconPhoto size={12} />}>一覧表示</Tabs.Tab>
            <Tabs.Tab value="zoom" leftSection={<Icon123 size={12} />}>拡大</Tabs.Tab>
            <Tabs.Tab value="heatmap" leftSection={<Icon123 size={12} />}>ヒートマップ</Tabs.Tab>
            <Tabs.Tab value="comparison" leftSection={<Icon123 size={12} />}>比較</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="gallery">
            <VideoPanel
              videoRef={videoRef}
              poseLandmarks={poseLandmarks}
              handLandmarksTopCamera={handLandmarksTopCamera}
              handLandmarksFrontCamera={handLandmarksFrontCamera}
              isDisplayPosture={isDisplayPosture}
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
            />
          </Tabs.Panel>
          <Tabs.Panel value="zoom">
            <ZoomPanel
              videoRef={videoRef}
              poseLandmarks={poseLandmarks}
              handLandmarksFrontCamera={handLandmarksFrontCamera}
              handLandmarksTopCamera={handLandmarksTopCamera}
              isDisplayPosture={isDisplayPosture}
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
            />
          </Tabs.Panel>
          <Tabs.Panel value="heatmap">
            <HeatMapPanel
              videoRef={videoRef}
              poseLandmarks={poseLandmarks}
              handLandmarksFrontCamera={handLandmarksFrontCamera}
              handLandmarksTopCamera={handLandmarksTopCamera}
              isDisplayPosture={isDisplayPosture}
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
            />
          </Tabs.Panel>
          <Tabs.Panel value="comparison">
            <ComparisonPanel
              videoRef={videoRef}
              poseLandmarks={poseLandmarks}
              handLandmarksFrontCamera={handLandmarksFrontCamera}
              handLandmarksTopCamera={handLandmarksTopCamera}
              isDisplayPosture={isDisplayPosture}
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
            />
          </Tabs.Panel>
        </Tabs>
        <AppShell.Footer>
          <VideoControls
            videoRef={videoRef}
            videoBlob={videoBlob}
            isDisplayPosture={isDisplayPosture}
            setIsDisplayPosture={setIsDisplayPosture}
          />
        </AppShell.Footer>
      </Container>
    </AppShell.Main>
  )
}