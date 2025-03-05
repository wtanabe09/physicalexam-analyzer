## physicalexam-analyzer
- 骨格推定を用いた身体診察演習支援システム
- ブラウザで動作するWebアプリ（最新版のブラウザ利用を推奨）
- ブラウザで映像を撮影し，映像に対して骨格推定を実施．得られた骨格座標より特徴量を取得しユーザーにフィードバックする．
- 研究室内でのみ共有可能な情報を[参考資料](https://docs.google.com/document/d/1jzHDg9hF71cSaEYhFjsqm3rTtxFcrI0ClkBVvTX8AhE/edit?usp=sharing)に記載

## 環境
<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->
| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| Node.js               | 16.18.96    |
| React                 | 18.2.0      |
| Mantine               | 7.9.0       |
| Mediapipe             | 0.10.12     |

その他のパッケージのバージョンはpackage.json を参照してください

## ディレクトリ構成

> $ tree -a -I "node_modules|.git|static|.DS_Store" -L 2
<pre>
.
├── .gitignore
├── README.md
├── compose.yml
├── deploy
│   └── react-deploy.sh
├── dockerfiles
│   └── front
└── react-app
    ├── .env
    ├── .gitignore
    ├── README.md
    ├── build
    ├── config
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.cjs
    ├── postcss.config.js
    ├── public
    ├── scripts
    ├── src
    ├── tailwind.config.js
    ├── tsconfig.json
    └── yarn.lock
</pre>

## 開発環境構築
<!-- コンテナの作成方法、パッケージのインストール方法など、開発環境構築に必要な情報を記載 -->

### コンテナの作成と起動
.env ファイルを作成後、以下のコマンドで開発環境を構築

.env ファイルを[参考資料](https://docs.google.com/document/d/1jzHDg9hF71cSaEYhFjsqm3rTtxFcrI0ClkBVvTX8AhE/edit?usp=sharing)をもとに作成


docker compose run --rm node npm install <br>
docker compose up -d --build

### 動作確認
http://127.0.0.1:3000 にアクセスできるか確認
アクセスできたら成功

### コンテナの停止
以下のコマンドでコンテナを停止することができます
docker compose down

### デプロイ
プロジェクトルートディレクトリにて以下のコマンドを実行することで，フロントエンドアプリをS3のアプリケーション用バケットにアップロードすることができます
> (初回のみ)<br>
$ aws configure <br>
AWS Access Key ID [None]: myaccesskey([参考資料](https://docs.google.com/document/d/1jzHDg9hF71cSaEYhFjsqm3rTtxFcrI0ClkBVvTX8AhE/edit?usp=sharing)をもとに入力) <br>
AWS Secret Access Key [None]: mysecretkey([参考資料](https://docs.google.com/document/d/1jzHDg9hF71cSaEYhFjsqm3rTtxFcrI0ClkBVvTX8AhE/edit?usp=sharing)をもとに入力) <br>
Default region name [None]: ap-northeast-3 <br>
Default output format [None]: json <br>

> $ sh deploy/react-deploy.sh

## トラブルシューティング

### .env: no such file or directory

.env ファイルがないので環境変数の一覧を参考に作成しましょう

### docker daemon is not running

Docker Desktop が起動できていないので起動させましょう

### Ports are not available: address already in use

別のコンテナもしくはローカル上ですでに使っているポートがある可能性があります
<br>
下記記事を参考にしてください
<br>
[コンテナ起動時に Ports are not available: address already in use が出た時の対処法について](https://qiita.com/shun198/items/ab6eca4bbe4d065abb8f)
