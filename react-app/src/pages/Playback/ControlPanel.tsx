
import { Title, Radio, Stack, Text, Checkbox, Space } from "@mantine/core";
import { ZoomLevelBar } from "../../utils/uiux/ZoomLevelBar";
import { useParams } from "react-router-dom";
import { techniqueOptions } from "../../exports/consts";

export interface VideoControlsProps {
  isDisplayPosture: boolean
  setIsDisplayPosture: React.Dispatch<React.SetStateAction<boolean>>;
  zoomLevelTopCam: number;
  setZoomLevelTopCam: React.Dispatch<React.SetStateAction<number>>;
  zoomLevelFrontCam: number;
  setZoomLevelFrontCam: React.Dispatch<React.SetStateAction<number>>;
  radioValue: string;
  setCamera: (value: string) => void;
}

export const ControlPanel: React.FC<VideoControlsProps> = ({
  isDisplayPosture, setIsDisplayPosture,
  zoomLevelTopCam, setZoomLevelTopCam,
  zoomLevelFrontCam, setZoomLevelFrontCam,
  radioValue, setCamera,
}) => {
  const params = useParams();
  const techniqueName = techniqueOptions.find(option => option.value === params.id?.split("-")[0]);
  return (
    <Stack p={5} my={10}>
      <Title order={3} className="font-semibold mb-2">プレイバック</Title>
      <Text>{params.id?.split("-")[1].replace("T", " ")}</Text>
      <Text>{techniqueName?.label}</Text>
      <Checkbox
        label="骨格マーキング表示"
        checked={isDisplayPosture}
        onChange={(event) => setIsDisplayPosture(event.currentTarget.checked)}
        color="cyan"
      />
      <Text>カメラ拡大率</Text>
      <Stack px="lg" mb="lg" className="landmark-control">
        <ZoomLevelBar
          label="(2)真上カメラ 拡大率"
          zoomLevel={zoomLevelTopCam}
          setZoomLevel={setZoomLevelTopCam}
        />
        <Space/>
        <ZoomLevelBar
          label="(3)患者正面カメラ 拡大率"
          zoomLevel={zoomLevelFrontCam}
          setZoomLevel={setZoomLevelFrontCam}
        />
      </Stack>
      <Space/>
      <Stack>
        <Text>ヒートマップ対象カメラ選択</Text>
        <Radio.Group
          value={radioValue}
          onChange={(event) => setCamera(event)}
        >
          <Radio value="Top" label="(2) 上カメラ"/>
          <Radio value="Front" label="(3) 患者カメラ"/>
        </Radio.Group>
      </Stack>
    </Stack>
  )
}