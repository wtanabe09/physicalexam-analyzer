
import { Radio } from "@mantine/core";
import { LinkButton } from "../../utils/uiux/LinkButton";
import { ToggleButton } from "../../utils/uiux/ToggleButton";
import { ZoomLevelBar } from "../../utils/uiux/ZoomLevelBar";

interface Props {
  isDisplayPosture: boolean
  setIsDisplayPosture: React.Dispatch<React.SetStateAction<boolean>>;
  zoomLevelTopCam: number;
  setZoomLevelTopCam: React.Dispatch<React.SetStateAction<number>>;
  zoomLevelFrontCam: number;
  setZoomLevelFrontCam: React.Dispatch<React.SetStateAction<number>>;
  radioValue: string;
  setCamera: (value: string) => void;
}

export const ControlPanel: React.FC<Props> = ({
  isDisplayPosture,
  setIsDisplayPosture,
  zoomLevelTopCam,
  setZoomLevelTopCam,
  zoomLevelFrontCam,
  setZoomLevelFrontCam,
  radioValue,
  setCamera,
}) => {

  return (
    <div className="bg-white p-4 m-2">
      <div className="button-container hidden md:block border-b pb-4 mb-2">
        <LinkButton text="録画画面へ" path="/" />
        <LinkButton text="動画選択画面へ" path="/videos" />
      </div>
      <div className="mt-10 mb-10 pb-4 border-b">
        <ToggleButton
          labelText="骨格マーキング表示"
          status={isDisplayPosture}
          setState={setIsDisplayPosture}
        />
      </div>
      <div className="landmark-control border-b pb-8 mb-11">
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
      <div className="border-b mb-4 pb-4">
        <p className="pb-1">ヒートマップ対象カメラ選択</p>
        <Radio.Group
          value={radioValue}
          onChange={(event) => setCamera(event)}
        >
          <Radio value="Top" label="(2) 上カメラ"/>
          <Radio value="Front" label="(3) 患者カメラ"/>
        </Radio.Group>
      </div>
    </div>
  )
}