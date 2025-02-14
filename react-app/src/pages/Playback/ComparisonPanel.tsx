import { Title, NavLink, Text, Group, Slider, Box } from "@mantine/core"
import { VideoPanelProps } from "./ZoomPanel";
import { ComparisonVideo } from "../../utils/graph/ComparisonVideo";
import { useCallback, useEffect, useState } from "react";
import { fetchFileFromS3, fetchObjectKeys, fetchPresignedUrl } from "../../utils/aws/s3Util";
import { useParams } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import { useCsvChunk } from "../../utils/aws/useCsvChunk";
import { getSmalestFeature } from "../../utils/feature/calcFeature";

export const ComparisonPanel = ({
  videoEle, poseLandmarks, canvasWidth, canvasHeight
}: VideoPanelProps) => {
  const params = useParams();
  const techniqueId = params.id?.split("-")[0];

  const [comparisonKeys, setKeys] = useState<string[]|null>(null);
  const [csvBlobPose, setCsvBlob] = useState<Blob|null>(null);
  const [selectKey, setKey] = useState<string|null>(null);

  const { landmarkChunk } = useCsvChunk(csvBlobPose, 'pose');
  const [downloadError, setDownloadError] = useState<boolean>(false);
  const [errorMessageShown, setErrorMessageShown] = useState<boolean>(false);

  const [comparisonRow, setComaprisonRow] = useState<number>(0);

  const fetchCsvKeys = useCallback(async () => {
    try {
      const keys = await fetchObjectKeys("csv", techniqueId);
      setKeys(keys!);
    } catch(e) {
      console.error(e);
      setDownloadError(true);
    }
  }, [techniqueId]);

  useEffect(() => {
    fetchCsvKeys();
  }, [fetchCsvKeys]);

  const fetchCsvData = useCallback(async () => {
    if (selectKey && techniqueId) {
      try {
        const session = (await fetchAuthSession());
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) return;
        const timestamp = selectKey.split("/")[1];
        const userNum = selectKey.split("/")[0].slice(-2);
        const presignedUrl = await fetchPresignedUrl("GET", "csv", idToken, userNum, techniqueId, timestamp, "pose");
        const fetchedBlob = await fetchFileFromS3(presignedUrl!);

        if (fetchedBlob) {
          setCsvBlob(fetchedBlob);
          setDownloadError(false);  // 成功したのでエラーフラグを解除
          setErrorMessageShown(false);  // エラーメッセージを消す
        } else {
          setDownloadError(true);
          setErrorMessageShown(true);
        }
      } catch(e) {
        console.error(e);
        setDownloadError(true);
        setErrorMessageShown(true);
      }
    }
  }, [selectKey, techniqueId]);

  useEffect(() => {
    if (errorMessageShown) {
      const timer = setTimeout(() => {
        setErrorMessageShown(false);  // エラーメッセージを一定時間後に非表示
      }, 5000);  // 5秒後にエラーメッセージを非表示
  
      return () => clearTimeout(timer);  // クリーンアップ
    }
  }, [errorMessageShown]);  

  useEffect(() => {
    fetchCsvData();
    return () => {
    };
  }, [fetchCsvData]);

  useEffect(() => {
    if (landmarkChunk) {
      const smallList = getSmalestFeature(landmarkChunk);
      setComaprisonRow(smallList.rowHip);
    }
  }, [landmarkChunk]);

  const comparisonItems = comparisonKeys?.map((item, i) => {
    return (
      <NavLink
        key={i}
        label={item}
        onClick={() => setKey(item)}
      />
    )
  });

  return (
    <div className="comparison-container">
      <Title order={3}>他ユーザーと比較</Title>
      <Group>
        <div>
          <ComparisonVideo
            originVideoEle={videoEle}
            landmarkChunkOriginal={poseLandmarks}
            landmarkChunkTarget={landmarkChunk!}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            isDisplayPosture={true}
            landmarkType="pose"
            comparisonRow={comparisonRow}
          />
          {selectKey && (
            <Box mt={20}>
              <Text>比較対象：{selectKey}</Text>
              {landmarkChunk && (
                <Slider 
                  value={comparisonRow}
                  onChange={setComaprisonRow}
                  max={landmarkChunk?.length || 0}
                />
              )}
            </Box>
          )}
        </div>
        <Box>
          <Title order={5}>他ユーザーの骨格座標</Title>
          {!comparisonKeys ? (
            <Text>データがロードされていません</Text>
          ) : downloadError ? (
            <Text>ダウンロードエラー</Text>
          ) : (
            comparisonItems
          )}
        </Box>
      </Group>
    </div>
  )
}