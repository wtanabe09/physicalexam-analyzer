import { useCallback, useEffect, useState } from "react";
import { fetchBlob } from "./s3Util";
import { fetchAuthSession } from "aws-amplify/auth";

interface VideoSelectBoxState {
  videoBlob: Blob | null;
  csvBlobPose: Blob | null;
  csvBlobHand: Blob | null;
  csvBlobHandFrontCam: Blob | null;
}

export const useS3Downloader = (selectedVideoKey: string | null): VideoSelectBoxState => {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [csvBlobPose, setCsvBlobPose] = useState<Blob | null>(null);
  const [csvBlobHand, setCsvBlobHand] = useState<Blob | null>(null);
  const [csvBlobHandFrontCam, setCsvBlobHandFrontCam] = useState<Blob | null>(null);

  
  const fetchDatas = useCallback(async () => {
    if (!selectedVideoKey) return;

    const [techniqueId, mp4FileName] = selectedVideoKey.split("-");
    const timestamp = mp4FileName.split(".")[0]
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      const resVideo = await fetchBlob('GET', idToken!, null, session.userSub!, techniqueId, timestamp, "all", "mp4");
      const resCsvPose = fetchBlob('GET', idToken!, null, session.userSub!, techniqueId, timestamp, "pose", "csv");
      const resCsvHand = fetchBlob('GET', idToken!, null, session.userSub!, techniqueId, timestamp, "hand", "csv");
      const resCsvHandP = fetchBlob('GET', idToken!, null, session.userSub!, techniqueId, timestamp, "hand-front", "csv");
 
      resVideo?.blob().then(video => setVideoBlob(video));
      resCsvPose?.then(res => res?.blob().then(pose => setCsvBlobPose(pose)));
      resCsvHand?.then(res => res?.blob().then(hand => setCsvBlobHand(hand)));
      resCsvHandP?.then(res => res?.blob().then(handp => setCsvBlobHandFrontCam(handp)));


    } catch (err) {
      console.error('Error fetching video:', err);
    }
  }, [selectedVideoKey]);

  const cleanupDatas = useCallback(() => {
      setVideoBlob(null);
      setCsvBlobPose(null);
      setCsvBlobHand(null);
  }, []);

  useEffect(() => {
    if (selectedVideoKey) {
      fetchDatas();
    } else {
      cleanupDatas();
    }
  }, [selectedVideoKey, fetchDatas, cleanupDatas]);

  return { videoBlob, csvBlobPose, csvBlobHand, csvBlobHandFrontCam };
}