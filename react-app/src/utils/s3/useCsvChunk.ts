import { useCallback, useEffect, useState } from "react";
import { FormattedCsvType, LandmarkType } from "../../consts/types";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { NAN_ARRAY } from "../../consts/consts";

export const useCsvChunk = (csvBlob: Blob, landmarkType: LandmarkType) => {
  const [landmarkChunk, setLandmarkChunk] = useState<FormattedCsvType | null>(null);

  // Read the blob as text
  const readBlobAsText = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }, []);

  // Process the CSV data
  const processCsv = useCallback((csvText: string): FormattedCsvType => {
    const firstIndex = landmarkType === 'pose' ? [1, 67] : [1, 43];
    const secondIndex = landmarkType === 'pose' ? [67, 133] : [43, 85];
    return csvText.split("\n").map((data) => {
      const row = data.split(",").map(Number);
      const time = row[0];
      const doctor = row.slice(firstIndex[0], firstIndex[1]);
      const patient = row.slice(secondIndex[0], secondIndex[1]);
      return [time, [doctor, patient]]
    });
  }, [landmarkType]);

  const blobToCsv = useCallback(async (blob: Blob): Promise<FormattedCsvType> => {
    try {
      const csvText = await readBlobAsText(blob);
      return processCsv(csvText);
    } catch (err) {
      throw new Error(`Failed to process CSV: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [readBlobAsText, processCsv]);

  useEffect(() => {
    let isMounted = true;

    const fetchCsv = async () => {
      if (!csvBlob) {
        setLandmarkChunk(null);
        return;
      }
      try {
        const csv = await blobToCsv(csvBlob);
        if (isMounted) {
          setLandmarkChunk(csv);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLandmarkChunk(null);
        }
      }
    };

    fetchCsv();
    
    return () => {
      isMounted = false;
    };
  }, [csvBlob, blobToCsv]);

  return { landmarkChunk }
}

export const createRowData = (timestamp: number, landmarks: NormalizedLandmark[][]) => {
  return landmarks.reduce((row, result) => {
    if (result) {
      result.forEach(res => {
        row.push(res.x.toString(), res.y.toString());
      });
    } else {
      row.push(...NAN_ARRAY);
    }
    return row;
  }, [timestamp.toString()]).join(',') + '\n';
};