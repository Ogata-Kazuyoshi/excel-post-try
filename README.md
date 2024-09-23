# EXCEL-Management

<details open="open">
<summary>目次</summary>


- [今回のシステム概要図](#今回のシステム概要図)
- [samのセットアップ、ローカルでの開発](#samのセットアップ、ローカルでの開発)
- [作業手順CLIでデプロイ(SAM)](#作業手順CLIでデプロイ(SAM))
- [作業手順CLIでデプロイ(cloudFront)](#作業手順CLIでデプロイ(cloudFront))
- [備考](#備考)
- [参考](#参考)
</details>

# 今回のシステム概要図
<details>
<summary> システム概要図</summary>

</details>




# samのセットアップ、ローカルでの開発

<details>
<summary> 0. sam-cliのインストール</summary>

- 下記コマンドでインストール

```zh
   brew tap aws/tap
   brew install aws-sam-cli
```

</details>


<details>
<summary> 1.samのディレクトリのセットアップ</summary>

- 下記コマンドで好きなランタイムでセットアップ
- Which template source would you like to use? -> 1
- Choose an AWS Quick Start application template -> 1
- Select your starter template -> 2
- 後はNoでOK

```zh
sam init --runtime nodejs18.x
```

</details>

<details>
<summary> 2.必要な変更を加える</summary>

- 好きにラムダ関数をかく
- デフォルトでルート直下にapp.tsが配置されて、使いづらいので、「controller」などのフォルダに切り分けた場合は、template.yamlの参照先も変更が必要


</details>

<details>
<summary> 3.ローカルでの確認</summary>

- 下記コマンドでlocalhost:3000で起動する。dynamoDBローカルなど、別のdocker-composeで起動しているコンテナと連携するためには --networkの設定が必須
- 今回は make sam-localでビルドとスタートの両方を実施するMakefileを準備した

```zh
sam build
sam local start-api --docker-network  <ネットワーク名>
```

</details>

# 作業手順CLIでデプロイ(SAM)

<details>
<summary> 1.lambdaの実行ロールを先にcloudFormationで作成する</summary>

- いつものようにAWS configの設定 (一時アクセスキーを環境変数に入れる)
- ルートディレクトリーにて、makeコマンドでロールの作成（CLI実行の場合は、GithubActions用のAssumeロールは不要）

```zh
make iac-role-deploy
```

</details>

<details>
<summary> 2.dynamoDBのテーブルを作成</summary>

- いつものようにAWS configの設定 (一時アクセスキーを環境変数に入れる)
- ルートディレクトリーにて、makeコマンドでdynamoDBのテーブルを作成

```zh
make iac-dynamodb-deploy
```

</details>

<details>
<summary> 3.SAMのルートディレクトリで、Makeコマンドでデプロイ</summary>

- いつものようにAWS configの設定 (一時アクセスキーを環境変数に入れる)
- 環境変数でS3のバケット名を登録 (S3_BUCKET)
- SAMのルートディレクトリにあるMakeコマンドでAPIGateway、Lambdaをデプロイ。UpdateもこのコマンドでOK

```zh
make sam-deploy
```

</details>

# 作業手順CLIでデプロイ(cloudFront)

<details>
<summary> 1.cloudFrontにアタッチするWAFをcloudFormationで作成(IP制限のため)</summary>

- いつものようにAWS configの設定 (一時アクセスキーを環境変数に入れる)
- IPsetで特定のIPの条件をかく
- 上記IPsetはAWSWAFに定義して、そのWAFをcloudFrontにアタッチする感じ
- AWSWAFの作成はus-east1でしかできないので、cloudFormationのリージョンを気をつけること

```zh
make iac-wafacl-deploy
```

</details>

<details>
<summary> 2.cloudFrontを作成する</summary>

- いつものようにAWS configの設定 (一時アクセスキーを環境変数に入れる)

```zh
make iac-cloudfront-deploy
```

</details>

<details>
<summary> 3.cloudFrontディレクトリー内のフロントエンドに変更があれば再デプロイする</summary>

- いつものようにAWS configの設定 (一時アクセスキーを環境変数に入れる)
- 環境変数設定
- cloudFrontのルートディレクトリにあるMakeコマンドでアップデートする

```zh
make cloudfront-deploy
```

</details>


# 備考

- dockerでdynamodb-localを立ち上げる時になぜか、ボリュームマウントができなかったので、バイマウントで実施。そのためルート直下にdynamodbのメタデータ格納ディレクトリを作成
- lambda関数でmultiformdataをパースするのにformidableやbusboyなどを使ったがダメだった。結果Qittaのlambda-multipart-parserを使用して出来た！！
- コマンドラインからエクセルをポストして、DBに登録できることも確認済み
-  license_finder report --format=csv --save=../licenses.csv


```zh
make excel-post
```



# 参考

[lambdaでmultipleformをパース](https://qiita.com/Occhiii623/items/a66a689b28d2730e0130)
