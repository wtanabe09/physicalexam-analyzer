import { Affix, AppShell, Container, Tabs } from "@mantine/core";
import { GalleryPanel } from "./GalleryPanel";
import { useLocation } from "react-router-dom";
import { LandmarkChunk } from "../../exports/types";
import { IconPhoto, Icon123 } from '@tabler/icons-react';
import { useEffect, useRef, useState } from "react";
import { FRAMESIZE } from "../../exports/consts";
import { useViewportSize } from "@mantine/hooks";
import  ReactPlayer  from "react-player";
import { VideoControls } from "./VideoControls";
import { ZoomPanel } from "./ZoomPanel";
import { HeatMapPanel } from "./HeatMapPanel";
import { ComparisonPanel } from "./ComparisonPanel";

export const Playback = () => {
  type LocationState = {
    videoUrl: string,
    poseLandmarks: LandmarkChunk,
    handLandmarksTopCamera: LandmarkChunk,
    handLandmarksFrontCamera: LandmarkChunk,
  };

  const location = useLocation();
  const { 
    videoUrl, poseLandmarks, handLandmarksTopCamera, handLandmarksFrontCamera
  } = location.state as LocationState

  const playerRef = useRef<ReactPlayer>(null);
  const videoEle = playerRef.current?.getInternalPlayer() as HTMLVideoElement;

  const { width } = useViewportSize();
  const [canvasSize, setCanvasSize] = useState({ width: FRAMESIZE.CANVAS.WIDTH, height: FRAMESIZE.CANVAS.HEIGHT });

  const [isDisplayPosture, setIsDisplayPosture] = useState<boolean>(true);

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

  const commonParams = {
    videoEle,
    poseLandmarks,
    handLandmarksTopCamera,
    handLandmarksFrontCamera,
    isDisplayPosture,
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height
  }

  return(
    <AppShell.Main>
      
      {/* <video
        id="input_stream"
        ref={videoRef}
        width={FRAMESIZE.CANVAS.WIDTH} height={FRAMESIZE.CANVAS.HEIGHT}
        style={{ display: "none" }}
      /> */}
      <Container fluid p={15}>
        <Tabs radius="xs"defaultValue="gallery" mb={20}>
          <Tabs.List>
            <Tabs.Tab value="gallery" leftSection={<IconPhoto size={12} />}>一覧表示</Tabs.Tab>
            <Tabs.Tab value="zoom" leftSection={<Icon123 size={12} />}>拡大</Tabs.Tab>
            <Tabs.Tab value="heatmap" leftSection={<Icon123 size={12} />}>ヒートマップ</Tabs.Tab>
            <Tabs.Tab value="comparison" leftSection={<Icon123 size={12} />}>比較</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="gallery">
            <GalleryPanel {...commonParams} />
          </Tabs.Panel>
          <Tabs.Panel value="zoom">
            <ZoomPanel {...commonParams} />
          </Tabs.Panel>
          <Tabs.Panel value="heatmap">
            <HeatMapPanel {...commonParams} />
          </Tabs.Panel>
          <Tabs.Panel value="comparison">
            <ComparisonPanel {...commonParams} />
          </Tabs.Panel>
        </Tabs>
        <Affix w={"100%"} position={{bottom:5}}>
          <VideoControls
            playerRef={playerRef}
            videoUrl={videoUrl}
            isDisplayPosture={isDisplayPosture}
            setIsDisplayPosture={setIsDisplayPosture}
          />
        </Affix>
      </Container>
    </AppShell.Main>
  )
}