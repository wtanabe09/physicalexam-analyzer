import { techniqueOptions, userOptions } from "../../consts/consts";
import { LoadingStatus } from "../../consts/types";
import { RecordingButton } from "../../utils/video/RecordingButton";
import { ComboboxItem, Select } from "@mantine/core";
import { ToggleButton } from "../../utils/uiux/ToggleButton";
import { useEffect, useState } from "react";
import { getSessionFilename } from "../../utils/s3/s3Utils";
import { LinkButton } from "../../utils/uiux/LinkButton";

interface ControlPanelProps {
  isRecording: boolean;
  loadingStatus: LoadingStatus;
  startRecording: () => void;
  stopRecording: () => void;
  isDisplayPosture: boolean;
  setIsDisplayPosture: React.Dispatch<React.SetStateAction<boolean>>;
  isLocalSave: boolean;
  setIsLocalSave: React.Dispatch<React.SetStateAction<boolean>>;
  sessionName: String | null;
  setSessionName: React.Dispatch<React.SetStateAction<String | null>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isRecording, loadingStatus, startRecording, stopRecording,
  isDisplayPosture, setIsDisplayPosture,
  isLocalSave,setIsLocalSave,
  sessionName, setSessionName
}) => {
  const [selectedUser, setUserValue] = useState<ComboboxItem | null>(null);
  const [selectedTechnique, setTechniqueValue] = useState<ComboboxItem | null>(null);

  useEffect(() => {
    if (selectedUser && selectedTechnique) {
      setSessionName(getSessionFilename(selectedUser, selectedTechnique));
    } else {
      setSessionName(null);
    }
  }, [selectedUser, selectedTechnique]);

  return (
    <div className="container p-2">
      <div className="link-field mb-4 pb-2 border-b">
        <LinkButton text="動画選択画面へ" path="/videos" />
      </div>
      <div className="select-session-container">
        <h2 className="text-lg font-semibold mb-2">演習者選択</h2>
        <div>
          {sessionName ? 
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