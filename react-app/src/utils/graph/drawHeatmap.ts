
const getHeatColor = (value: number) => {
  const h = (value * 4.0) < 240 ? 240 - (value * 4.0) : 0;
  // const h = (1.0 - value) * 240; // degree 0.0: blue, 1.0: red
  return `hsl(${h}, 100%, 70%, 0.5)`;
}

export const drawHeatmap = (
  sourceCanvas: HTMLCanvasElement, heatmapCanvas: HTMLCanvasElement, heatmapData: number[][], heatmapSize: number = 1
) => {
  const canvasWidth = heatmapCanvas.width;
  const canvasHeight = heatmapCanvas.height;
  if (!sourceCanvas || !heatmapCanvas || !heatmapData) return;
  
  if(!heatmapData[0]) return;
  const heatmapWidth = heatmapData[0].length;
  const heatmapHeight = heatmapData.length;
  const widthRatio = canvasWidth / heatmapWidth;
  const heightRatio = canvasHeight / heatmapHeight;

  // const initialValue = 0;
  // const sumOfHeatmapArray = heatmapData.reduce(
  //   (acc, cur) => acc + cur.reduce((acc2, cur2) => acc2 + cur2, initialValue),
  //   initialValue
  // );

  const canvasCtx = heatmapCanvas.getContext("2d")!;
  for (let y = 0; y < heatmapHeight; y++) {
    for (let x = 0; x < heatmapWidth; x++) {
      const value = heatmapData[y][x];
      const colorValue = value;
      canvasCtx.fillStyle = getHeatColor(colorValue);
      canvasCtx.fillRect(x * widthRatio, y * heightRatio, widthRatio, heightRatio);
    }
  }
}