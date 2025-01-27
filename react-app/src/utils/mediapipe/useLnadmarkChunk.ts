import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react"
import { LandmarkChunk, LandmarkType } from "../../exports/types";

interface Props {
  landmarks: [number, NormalizedLandmark[][]]  | undefined,
  landmarkType: LandmarkType,
  isRecording: boolean,
  landmarksToParent: React.Dispatch<React.SetStateAction<LandmarkChunk>>
}
// landmarkのchunkを親のコンポーネントにセットa
export const useLandmarkChunk = ({ landmarks, landmarkType, isRecording, landmarksToParent }: Props) => {
  const chunkRef = useRef<LandmarkChunk>([[-1, []]]);
  const startRecordingTimeRef = useRef<number>(0);
  
  useEffect(() => {
    if(landmarks && isRecording) {
      // csv を作成．初期値では[]が入るため．0番目の要素が[]ならば，0番目にlandmarksを入れる．
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
      landmarksToParent(landmarkChunk);

      // chunk reset
      chunkRef.current = [[-1, []]];
      startRecordingTimeRef.current = 0;
    }
  }, [isRecording, landmarkType, landmarksToParent]);
}