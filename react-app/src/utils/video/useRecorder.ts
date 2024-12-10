/*
StreamからMediaRecorderを生成し，録画を行う.
録画ボタンが押されたら録画を開始し，終了ボタンが押されたら録画を終了する
*/

import { useCallback, useRef, useState } from "react";
import { LoadingStatus } from "../../consts/types";
import { uploadBlobToS3 } from "../s3/s3Utils";
import { downloadBlob } from "./blobUtils";

interface StreamProps {
  stream: MediaStream | null;
  sessionName: String | null;
  isLocalSave: boolean;
}

type ReturnValues = {
  recordedBlob: Blob | null,
  isRecording: boolean,
  loadingStatus: LoadingStatus,
  startRecording: () => void,
  stopRecording: () => void
};

export const useRecorder = ({
  stream, sessionName, isLocalSave,
}: StreamProps): ReturnValues => {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob|null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('idle');

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    if (event.data.size > 0) mediaChunksRef.current.push(event.data);
  }, []);

  const handleStop = useCallback(() => {
    setLoadingStatus('loading');

    if (mediaChunksRef.current.length < 1) return;
    const blob = new Blob(mediaChunksRef.current, { type: 'video/mp4' });
    setRecordedBlob(blob);
    mediaChunksRef.current = [];
    
    setLoadingStatus('loaded');

    if (blob && sessionName) {
      const uploadFileName = sessionName + ".mp4";
      uploadBlobToS3(blob, uploadFileName);
      if (isLocalSave) downloadBlob(blob, "video.mp4");
    }
    
  }, [isLocalSave, sessionName]);

  // Recordingボタンがクリックされたら実行．csvデータ，動画データの記録を開始する．
  const startRecording = useCallback(() => {
    if (!stream) {
      console.error('No stream available');
      setLoadingStatus('error');
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
      setLoadingStatus('error');
    }

  }, [stream, handleDataAvailable, handleStop]);

  // Recordingボタンがクリックされたら実行．csvデータ，動画データの記録を開始する．
  const stopRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);


  return {recordedBlob, isRecording, loadingStatus, startRecording, stopRecording};
}
