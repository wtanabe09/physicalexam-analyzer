import { Button } from "@mantine/core";

interface Props {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}
interface StartProps {
  isRecording: boolean;
  startRecording: () => void;
}
interface StopProps {
  isRecording: boolean;
  stopRecording: () => void;
}

export const RecordingButton = ({isRecording, startRecording, stopRecording}: Props) => {
  return(
    <div className="flex gap-2 my-2">
      <StartButton isRecording={isRecording} startRecording={startRecording} />
      <StopButton isRecording={isRecording} stopRecording={stopRecording} />
    </div>
  );
}

const StartButton = ({isRecording, startRecording}: StartProps) => {
  if(isRecording) {
    return <Button variant="outline" color='red' data-disabled>録画スタート</Button>
  } else {
    return <Button onClick={startRecording} color='red'>録画スタート</Button>
  }
}

const StopButton = ({isRecording, stopRecording}: StopProps) => {
  if (isRecording) {
    return <Button onClick={stopRecording} color='gray'>録画ストップ</Button>
  } else {
    return <Button variant="outline" color='gray' data-disabled>録画ストップ</Button>
  }
}

