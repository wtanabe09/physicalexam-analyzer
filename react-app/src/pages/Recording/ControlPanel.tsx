import { techniqueOptions } from "../../exports/consts";
import { RecordingButton } from "../../utils/video/RecordingButton";
import { Box, Checkbox, ComboboxItem, Select, Stack, Title } from "@mantine/core";

interface ControlPanelProps {
  selectedUser: ComboboxItem | null;
  setUserValue: React.Dispatch<React.SetStateAction<ComboboxItem | null>>;
  selectedTechnique: ComboboxItem | null;
  setTechniqueValue: React.Dispatch<React.SetStateAction<ComboboxItem | null>>;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  isDisplayPosture: boolean;
  setIsDisplayPosture: React.Dispatch<React.SetStateAction<boolean>>;
  isLocalSave: boolean;
  setIsLocalSave: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedUser, setUserValue, selectedTechnique, setTechniqueValue,
  isRecording, startRecording, stopRecording,
  isDisplayPosture, setIsDisplayPosture,
  isLocalSave, setIsLocalSave,
}) => {
  const userOptions = [{value: "", label: ""}];
  return (
    <Stack pt={10}>
      <Box className="select-session-container">
        <Title order={3} >演習者選択</Title>
        <Box>
          {selectedUser && selectedTechnique ? 
            <p className="text-slate-400 mb-2">録画は保存されます</p> :
            <p className="text-slate-400 mb-2">ユーザーと手技を選択してください</p>
          }
        </Box>
        <Select
          data={userOptions!}
          value={selectedUser ? selectedUser.value : null}
          onChange={(_value, option) => setUserValue(option)}
          placeholder="ユーザーを選択してください"
        />
        <Select
          data={techniqueOptions}
          value={selectedTechnique ? selectedTechnique.value : null}
          onChange={(_value, option) => setTechniqueValue(option)}
          placeholder="手技を選択してください"
        />
      </Box>
      <Box>
        <RecordingButton
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
        <Checkbox
          label="骨格マーキング表示"
          checked={isDisplayPosture}
          onChange={(event) => setIsDisplayPosture(event.currentTarget.checked)}
          color="cyan"
        />
        {/* <ToggleButton
          status={isLocalSave}
          setState={setIsLocalSave}
          labelText="AR動画表示"
        /> */}
      </Box>
    </Stack>
  )
};