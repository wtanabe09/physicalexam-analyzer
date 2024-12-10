import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingStatus } from "../../consts/types";
import { ComboboxItem } from "@mantine/core";
import { S3Client } from "@aws-sdk/client-s3";
import { createS3Client, csvBucketName, videoBucketName } from "./s3Utils";
import { changeObjectToBlob, getS3Object } from "./s3GetObject";

interface Option {
  value: string;
  label: string;
}

interface VideoSelectBoxState {
  videoBlob: Blob | null;
  csvBlobPose: Blob | null;
  csvBlobHand: Blob | null;
  csvBlobHandFrontCam: Blob | null;
  placeholder: string;
  videoLoadState: LoadingStatus;
}

const useS3Client = () => {
  const clientRef = useRef<S3Client | null>(null);
  
  const getClient = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = createS3Client();
    }
    return clientRef.current;
  }, []);

  return getClient;
};

const getVideoPlaceholder = (videoOptions: Option[], isCorrect: boolean) => {
  return videoOptions.length > 0 && isCorrect
    ? "ビデオを選択"
    : "ビデオは選択できません";
};

export const useS3Data = (
  videoOptions: Option[], selectedVideo: ComboboxItem | null, isCorrectPass: boolean
): VideoSelectBoxState => {
  const [videoBlob, setVideoBlob] = useState<Blob|null>(null);
  const [csvBlobPose, setCsvBlobPose] = useState<Blob|null>(null);
  const [csvBlobHand, setCsvBlobHand] = useState<Blob|null>(null);
  const [csvBlobHandFrontCam, setCsvBlobHandFrontCam] = useState<Blob|null>(null);
  const [videoLoadState, setLoadingStatus] = useState<LoadingStatus>('idle');

  const placeholder = getVideoPlaceholder(videoOptions, isCorrectPass);
  const getS3Client = useS3Client();
  
  const fetchData = useCallback(async () => {
    if (!selectedVideo) return;

    setLoadingStatus('loading');
    const fileBaseName = selectedVideo.value.split(".")[0];
    try {
      const client = getS3Client();
      
      const [videoObject, csvObject] = await Promise.all([
        getS3Object(client, videoBucketName, `${fileBaseName}.mp4`),
        getS3Object(client, csvBucketName, `pose/${fileBaseName}.csv`),
      ]);
  
      let csvObjectHand = null;
      let csvObjectHandFront = null;
      try {
        csvObjectHand = await getS3Object(client, csvBucketName, `hand/${fileBaseName}.csv`);
        csvObjectHandFront = await getS3Object(client, csvBucketName, `hand_patient_camera/${fileBaseName}.csv`);
      } catch (handError) {
        console.log(`Hand CSVが見つかりませんでした: ${handError}`);
      }

      setVideoBlob(videoObject ? await changeObjectToBlob(videoObject) : null);
      setCsvBlobPose(csvObject ? await changeObjectToBlob(csvObject) : null);
      setCsvBlobHand(csvObjectHand ? await changeObjectToBlob(csvObjectHand) : null);
      setCsvBlobHandFrontCam(csvObjectHandFront ? await changeObjectToBlob(csvObjectHandFront) : null);

      setLoadingStatus('loaded');
    } catch (err) {
      console.error('Error fetching video:', err);
      setLoadingStatus('error');
    }
  }, [getS3Client, selectedVideo]);

  useEffect(() => {
    if (selectedVideo && isCorrectPass) {
      fetchData();
    } else {
      setLoadingStatus('idle');
      setVideoBlob(null);
      setCsvBlobPose(null);
      setCsvBlobHand(null);
    }
  }, [selectedVideo, fetchData, isCorrectPass]);

  return { videoBlob, csvBlobPose, csvBlobHand, csvBlobHandFrontCam,  placeholder, videoLoadState };
}