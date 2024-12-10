// S3への動画ファイルアップロードを行う関数

// 撮影された動画をダウンロードする関数
export const downloadBlob = (blob: Blob, filename: string) => {
  console.log("in downloadVideo", blob, filename);
  try{
    const videoURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = videoURL;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(videoURL);
    console.log("success download");
  } catch (e) {
    console.log(e);
  };
};

export const downloadCsv = (array: number[][], filename: string) => {
  const csv = array.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, filename);
}