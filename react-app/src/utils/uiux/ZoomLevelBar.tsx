import { Slider, Text } from "@mantine/core";

interface Props {
  label: string,
  zoomLevel: number,
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>,
}

export const ZoomLevelBar = ({ label, zoomLevel, setZoomLevel }: Props) => (
  <div className="zoomelevel-slider" style={{width: "100"}}>
    <Text>{label}</Text>
    <Slider
      value={zoomLevel}
      onChange={setZoomLevel}
      min={1}
      max={3}
      step={1}
      label={(value) => `${value*100}%`}
      marks={[
        { value: 1, label: '100%' },
        { value: 2, label: '200%' },
        { value: 3, label: '300%' },
      ]}
    />
  </div>
);