import { techniqueOptions, userOptions } from "../../consts/consts";
import { RecordingButton } from "../../utils/video/RecordingButton";
import { ComboboxItem, Select } from "@mantine/core";
import { ToggleButton } from "../../utils/uiux/ToggleButton";
import { LinkButton } from "../../utils/uiux/LinkButton";

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
  

  return (
    <div className="container p-2">
      <div className="link-field mb-4 pb-2 border-b">
        <LinkButton text="動画選択画面へ" path="/videos" />
      </div>
      <div className="select-session-container">
        <h2 className="text-lg font-semibold mb-2">演習者選択</h2>
        <div>
          {selectedUser && selectedTechnique ? 
            <p className="text-slate-400 mb-2">録画は保存されます</p> :
            <p className="text-slate-400 mb-2">ユーザーと手技を選択してください</p>
          }
        </div>
        <Select
          data={userOptions}
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
      </div>
      {/* {selectedTechnique && selectedUser && ( */}
        <div className="">
          <RecordingButton
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
          <ToggleButton
            status={isDisplayPosture}
            setState={setIsDisplayPosture}
            labelText="骨格マーカー表示"
          />
          {/* <ToggleButton
            status={isLocalSave}
            setState={setIsLocalSave}
            labelText="AR動画表示"
          /> */}
        </div>
      {/* )} */}
    </div>
  )
};