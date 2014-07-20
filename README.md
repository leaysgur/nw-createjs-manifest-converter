nw-createjs-manifest-converter
==============================

FlashCC for createjsで書きだした``.js``ファイルには、  
使用している画像ファイルへのパスがマニフェストとして記述されています。

ただその場合、Flashを再生するまでにその画像を全てロードする必要があり、  
モバイル環境ではこのリクエスト数がかなりのコストとなります。

そこで、あらかじめ画像を全てbase64文字列化して使おうというわけです。

この``createjs-manifest-converter``を使うと、  
FlashCC for createjsで書きだした``.js``ファイル内のマニフェストをbase64文字列に書き換えることができます。

## 使い方
- [node-webkit](https://github.com/rogerwang/node-webkit)をインストール
- [実行ファイル](https://github.com/leader22/nw-createjs-manifest-converter/raw/master/dist/cjs-manifest-converter.nw)をダウンロードして保存
- ダウンロードしたアプリケーションを起動
- あとは、画面表示に従って使う
