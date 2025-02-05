
import { Checkbox, Group, Radio, Stack, Text } from "@mantine/core"
import { ZoomLevelBar } from "../../utils/uiux/ZoomLevelBar"

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

export const ControlInMobile = ({
  isDisplayPosture, setIsDisplayPosture,
  zoomLevelTopCam, setZoomLevelTopCam,
  zoomLevelFrontCam, setZoomLevelFrontCam,
  radioValue, setCamera,
} : VideoControlsProps) => {

  return (
    <Stack p="lg" hiddenFrom="sm">
      <div className="border-b">
        <Checkbox
          label="骨格マーキング表示"
          checked={isDisplayPosture}
          onChange={(event) => setIsDisplayPosture(event.currentTarget.checked)}
          color="cyan"
          mb="sm"
        />
      </div>
      <div className="landmark-control border-b">
        <Text pb="sm">カメラ拡大率</Text>
        <Stack px="lg" pb="xl">
          <ZoomLevelBar
            label="(2)真上カメラ 拡大率"
            zoomLevel={zoomLevelTopCam}
            setZoomLevel={setZoomLevelTopCam}
          />
          <ZoomLevelBar
            label="(3)患者正面カメラ 拡大率"
            zoomLevel={zoomLevelFrontCam}
            setZoomLevel={setZoomLevelFrontCam}
          />
        </Stack>
      </div>
      <Group mb="sm" pb="md" className="border-b">
        <Text pb="xs">ヒートマップ対象カメラ選択</Text>
        <Radio.Group
          value={radioValue}
          onChange={(event) => setCamera(event)}
        >
          <Radio value="Top" label="(2) 上カメラ"/>
          <Radio value="Front" label="(3) 患者カメラ"/>
        </Radio.Group>
      </Group>
    </Stack>
  )
}