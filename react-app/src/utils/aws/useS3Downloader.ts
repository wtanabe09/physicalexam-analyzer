import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFileFromS3, fetchPresignedUrl } from "./s3Util";
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

  const isMountedRef = useRef(true);

  const fetchDatas = useCallback(async (isMounted: boolean) => {
    if (!selectedVideoKey) return;

    const [techniqueId, mp4FileName] = selectedVideoKey.split("-");
    const timestamp = mp4FileName.slice(0, -4);
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) return;

      // 1. プリサインドURLを取得
      const presignedUrls = await Promise.allSettled([
        // fetchPresignedUrl("GET", "mp4", idToken, null, techniqueId, timestamp, "all"),
        fetchPresignedUrl("GET", "csv", idToken, null, techniqueId, timestamp, "pose"),
        fetchPresignedUrl("GET", "csv", idToken, null, techniqueId, timestamp, "hand"),
        fetchPresignedUrl("GET", "csv", idToken, null, techniqueId, timestamp, "hand-front"),
      ]);

      // 2. 成功したURLだけを使ってダウンロード
      const results = await Promise.allSettled([
        // presignedUrls[0].status === "fulfilled" && presignedUrls[0].value ? fetchFileFromS3(presignedUrls[0].value) : null,
        presignedUrls[0].status === "fulfilled" && presignedUrls[0].value ? fetchFileFromS3(presignedUrls[0].value) : null,
        presignedUrls[1].status === "fulfilled" && presignedUrls[1].value ? fetchFileFromS3(presignedUrls[1].value) : null,
        presignedUrls[2].status === "fulfilled" && presignedUrls[2].value ? fetchFileFromS3(presignedUrls[2].value) : null,
      ]);

      if (!isMounted) return; // アンマウントチェック

      // 3. 成功したデータのみセット
      // if (results[0].status === "fulfilled" && results[0].value) setVideoBlob(results[0].value);
      if (results[0].status === "fulfilled" && results[0].value) setCsvBlobPose(results[0].value);
      if (results[1].status === "fulfilled" && results[1].value) setCsvBlobHand(results[1].value);
      if (results[2].status === "fulfilled" && results[2].value) setCsvBlobHandFrontCam(results[2].value);

    } catch (err) {
      console.error('Error fetching video:', err);
    }
  }, [selectedVideoKey]);

  const cleanupDatas = useCallback(() => {
    setVideoBlob(null);
    setCsvBlobPose(null);
    setCsvBlobHand(null);
    setCsvBlobHandFrontCam(null);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    if (selectedVideoKey) {
      fetchDatas(isMountedRef.current);
    } else {
      cleanupDatas();
    }
    return () => {
      isMountedRef.current = false;
    }
  }, [selectedVideoKey, fetchDatas, cleanupDatas]);

  return { videoBlob, csvBlobPose, csvBlobHand, csvBlobHandFrontCam };
}