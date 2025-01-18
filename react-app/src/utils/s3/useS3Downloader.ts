import { useCallback, useEffect, useState } from "react";
import { ComboboxItem } from "@mantine/core";
import { fetchBlob } from "./s3Utils";

export const baseBucket = process.env.REACT_APP_TEST_DATA_BUCKET_NAME as string;
export const videoBucketName = `${baseBucket}-mp4`;
export const csvBucketName = `${baseBucket}-csv`;

interface VideoSelectBoxState {
  videoBlob: Blob | null;
  csvBlobPose: Blob | null;
  csvBlobHand: Blob | null;
  csvBlobHandFrontCam: Blob | null;
}

export const useS3Downloader = (selectedVideoKey: ComboboxItem | null, isCorrectPass: boolean): VideoSelectBoxState => {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [csvBlobPose, setCsvBlobPose] = useState<Blob | null>(null);
  const [csvBlobHand, setCsvBlobHand] = useState<Blob | null>(null);
  const [csvBlobHandFrontCam, setCsvBlobHandFrontCam] = useState<Blob | null>(null);

  
  const fetchDatas = useCallback(async () => {
    if (!selectedVideoKey) return;

    const pathComp = selectedVideoKey.value.split("/");
    try {
      const resVideo = await fetchBlob('GET', null, pathComp[0].slice(-2), pathComp[1].slice(-2), pathComp[2], pathComp[3],  "all", "mp4");
      setVideoBlob(await resVideo?.blob()!);
      
      const resCsvPose = await fetchBlob('GET', null, pathComp[0].slice(-2), pathComp[1].slice(-2), pathComp[2], pathComp[3],  "pose", "csv");
      setCsvBlobPose(await resCsvPose?.blob()!);
      
      const resCsvHand = await fetchBlob('GET', null, pathComp[0].slice(-2), pathComp[1].slice(-2), pathComp[2], pathComp[3],  "hand", "csv");
      setCsvBlobHand(await resCsvHand?.blob()!);
      
      const resCsvHandP = await fetchBlob('GET', null, pathComp[0].slice(-2), pathComp[1].slice(-2), pathComp[2], pathComp[3],  "hand_patient_camera", "csv");
      setCsvBlobHandFrontCam(await resCsvHandP?.blob()!);

    } catch (err) {
      console.error('Error fetching video:', err);
    }
  }, [selectedVideoKey]);

  useEffect(() => {
    if (selectedVideoKey && isCorrectPass) {
      fetchDatas();
    } else {
      setVideoBlob(null);
      setCsvBlobPose(null);
      setCsvBlobHand(null);
    }
  }, [selectedVideoKey, fetchDatas, isCorrectPass]);

  return { videoBlob, csvBlobPose, csvBlobHand, csvBlobHandFrontCam };
}