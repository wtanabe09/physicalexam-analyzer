import { Stack, Table, Anchor, Text, Progress, Container} from "@mantine/core"
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchUserAttr } from "../../utils/aws/cognitoUtil";
import { fetchObjectKeys } from "../../utils/aws/s3Util";
import { useNavigate,  } from "react-router-dom";
import { useS3Downloader } from "../../utils/aws/useS3Downloader";
import { useCsvChunk } from "../../utils/aws/useCsvChunk";
import { techniqueOptions } from "../../exports/consts";

export const ItemsPanel = () => {
  const [ rows, setRow ] = useState<JSX.Element[]|null>(null);
  const [ selectedVideoKey, setVideoKey ] = useState<string|null>(null);

  const { videoBlob, csvBlobPose, csvBlobHand, csvBlobHandFrontCam } = useS3Downloader(selectedVideoKey);
  const { landmarkChunk: landmarkChunkPose } = useCsvChunk(csvBlobPose!, 'pose');
  const { landmarkChunk: landmarkChunkHand } = useCsvChunk(csvBlobHand!, 'hand');
  const { landmarkChunk: landmarkChunkHandFrontCam } = useCsvChunk(csvBlobHandFrontCam!, 'hand');
  
  const navigate = useNavigate();
  const [ downloadProgress, setProgress ] = useState<number>(0);
  const completedDownload = useRef<number>(0);
  const totalDownloads = 4;

  // 進捗を更新する関数
  const updateProgress = () => {
    const newCompleted = completedDownload.current + 1;
    setProgress((newCompleted / totalDownloads) * 100);
    return newCompleted;
  };

  useEffect(() => {
    if (videoBlob || landmarkChunkPose || landmarkChunkHand || landmarkChunkHandFrontCam) {
      updateProgress();
    }
    if (videoBlob && landmarkChunkPose && landmarkChunkHand && landmarkChunkHandFrontCam) {
      console.log("navigation stand by ok");
      navigate(`/video/${selectedVideoKey}`, { state: {
        videoBlob: videoBlob,
        poseLandmarks: landmarkChunkPose,
        handLandmarksTopCamera: landmarkChunkHand,
        handLandmarksFrontCamera: landmarkChunkHandFrontCam,
      }});
    };
    return () => {
      setProgress(0)
    }
  }, [landmarkChunkHand, landmarkChunkHandFrontCam, landmarkChunkPose, navigate, selectedVideoKey, videoBlob]);
  
  // 選択したユーザー名のPrefixがついたS3ファイルKeyの一覧を取得
  const getObjectKeys = useCallback(async () => {
    const currentUser = await fetchUserAttr();
    const filteredKeys = await fetchObjectKeys(currentUser.sub!);

    const newRows = filteredKeys!.map((element) => {
      const [techniqueIdString, timestampString] = element.split("-");
      const techniqueName = techniqueOptions.find(option => option.value === techniqueIdString.slice(-2));
      return (
        <Table.Tr key={timestampString}>
          <Table.Td>{currentUser.name}</Table.Td>
          <Table.Td>{techniqueName?.label}</Table.Td>
          <Table.Td>{
            <Anchor href={"#"} onClick={() => setVideoKey(element)}>
              { timestampString }
            </Anchor>
          }</Table.Td>
          <Table.Td>{}</Table.Td>
        </Table.Tr>
      )
    });
    setRow(newRows);

  }, []);

  useEffect(() => {
    getObjectKeys();
    return () => {
      setRow([]);
      setProgress(0);
      setVideoKey(null);
    };
  }, [getObjectKeys]);

  return (
    <Stack p="lg">
      {selectedVideoKey && 
        <Container size="md">
            <Text>{selectedVideoKey} 動画を読み取り中</Text>
            <Progress value={downloadProgress} transitionDuration={150} />
        </Container>
      }
      <Table horizontalSpacing={"xs"}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Technique</Table.Th>
            <Table.Th>Timestamp</Table.Th>
            <Table.Th>Image</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  )
}