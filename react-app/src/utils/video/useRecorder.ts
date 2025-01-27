/*
StreamからMediaRecorderを生成し，録画を行う.
録画ボタンが押されたら録画を開始し，終了ボタンが押されたら録画を終了する
*/

import { useCallback, useRef, useState } from "react";
import { downloadBlob } from "./blobDownloads";
import { ComboboxItem } from "@mantine/core";

interface StreamProps {
  stream: MediaStream | null;
  selectedUser: ComboboxItem | null;
  selectedTechnique: ComboboxItem | null;
  isLocalSave: boolean;
}

type ReturnValues = {
  recordedBlob: Blob | null,
  isRecording: boolean,
  startRecording: () => void,
  stopRecording: () => void
};

export const useRecorder = ({
  stream, selectedUser, selectedTechnique, isLocalSave,
}: StreamProps): ReturnValues => {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob|null>(null);

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    if (event.data.size > 0) mediaChunksRef.current.push(event.data);
  }, []);

  const handleStop = useCallback(() => {

    if (mediaChunksRef.current.length < 1) return;
    const blob = new Blob(mediaChunksRef.current, { type: 'video/mp4' });
    setRecordedBlob(blob);
    mediaChunksRef.current = [];

    if (blob && selectedUser && selectedTechnique) {
      if (isLocalSave) downloadBlob(blob, `user${selectedUser}-session${selectedTechnique}.mp4`);
    }
    
  }, [isLocalSave, selectedTechnique, selectedUser]);

  // Recordingボタンがクリックされたら実行．csvデータ，動画データの記録を開始する．
  const startRecording = useCallback(() => {
    if (!stream) {
      console.error('No stream available');
      return;
    }

    try {
      recorderRef.current = new MediaRecorder(stream);
      recorderRef.current.ondataavailable = handleDataAvailable;
      recorderRef.current.onstop = handleStop;
      recorderRef.current.start();

      setIsRecording(true);
    } catch(err) {
      console.error('Failed to start recording:', err);
    }

  }, [stream, handleDataAvailable, handleStop]);

  // Recordingボタンがクリックされたら実行．csvデータ，動画データの記録を開始する．
  const stopRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);


  return {recordedBlob, isRecording, startRecording, stopRecording};
}
