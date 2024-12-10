import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react"
import { ClipRegion, LandmarkChunk, LandmarkType } from "../../consts/types";
import { uploadBlobToS3 } from "../../utils/s3/s3Utils";
import { createRowData } from "../s3/useCsvChunk";
import { POSE_INDEX } from "../../consts/poseLandmarkIndex";
import { HAND_INDEX } from "../../consts/handLandmarkIndex";

const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find(key => object[key] === value);
}

interface Props {
  landmarks: [number, NormalizedLandmark[][]]  | undefined,
  landmarkType: LandmarkType,
  isRecording: boolean,
  sessionName: String | null,
  clipRegion: ClipRegion
}
// landmarkのchunkを親のコンポーネントにセットa
export const useLandmarkChunk = ({ 
  landmarks, landmarkType, isRecording, sessionName, clipRegion
}: Props) => {
  const [chunk, setChunk] = useState<LandmarkChunk|null>(null);
  const chunkRef = useRef<LandmarkChunk>([[-1, []]]);
  const startRecordingTimeRef = useRef<number>(0);

  const resetChunk = useCallback(() => {
    chunkRef.current = [[-1, []]];
    startRecordingTimeRef.current = 0;
  }, []);
  
  useEffect(() => {
    if(landmarks && isRecording) {
      // csv を保存する処理を書く．初期値では[]が入るため．0番目の要素が[]ならば，0番目にlandmarksを入れる．
      let [timestamp, landmarkData] = landmarks;
      if (chunkRef.current[0][0] === -1) {
        startRecordingTimeRef.current = timestamp;
        chunkRef.current[0] = [0, landmarkData];
      } else {
        const durationTime = timestamp - startRecordingTimeRef.current!
        const newLandmarks: [number, NormalizedLandmark[][]] = [durationTime, landmarkData]
        chunkRef.current.push(newLandmarks);
      }
    }

  }, [landmarks, isRecording]);


  useEffect(() => {
    // 録画停止のタイミングで，Chunkにデータが溜まっていれば親にLandmarkのチャンクを渡す
    if(!isRecording && chunkRef.current.length > 1){
      const landmarkChunk = [...chunkRef.current] as LandmarkChunk;
      setChunk(landmarkChunk);
      
      const dataArray = landmarkChunk.map(([timestamp, landmarks]) => createRowData(timestamp, landmarks));
      const blob = new Blob(dataArray, { type: 'text/csv' });
      if (blob && sessionName) {
        const csvFileName = landmarkType + "/" + sessionName + ".csv";
        uploadBlobToS3(blob, csvFileName);
      }

      resetChunk();
    }
  }, [isRecording, sessionName]);

  return chunk;
}