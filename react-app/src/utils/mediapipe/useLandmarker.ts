import { useState, useEffect } from 'react';
import { Landmarker, LandmarkType } from "../../consts/types";
import { setupHandLandmarker, setupPoseLandmarker } from "./modelSettings";

const initializeLandmarker = async (landmarkerType: LandmarkType): Promise<Landmarker> => {
  return landmarkerType === 'pose' ? await setupPoseLandmarker() : await setupHandLandmarker();
};

export const useLandmarker = (landmarkerType: LandmarkType) => {
  const [landmarker, setLandmarker] = useState<Landmarker | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    initializeLandmarker(landmarkerType).then(initializedLandmarker => {
      if (isMounted) {
        setLandmarker(initializedLandmarker);
        console.log("landmarker initialized");
      }
    }).catch(err => {
      if (isMounted) {
        setError(err);
        console.error("ランドマーカーの初期化に失敗しました:", err);
      }
    });
    
    return () => { 
      isMounted = false;
      landmarker?.close();
    };
  }, [landmarkerType]);

  return { landmarker, error };
};