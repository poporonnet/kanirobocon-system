# kanirobocon-system / かにロボコン運営システム

かにロボコン得点システム、クライアント側 for iPad / PC

## 汎用得点システム

- [汎用得点システム](https://fkpc.github.io/kanirobocon-system/static/score_3rd.html)
- [8チーム用トーナメントテンプレート for PowerPoint](https://fkpc.github.io/kanirobocon-system/tournament-template.pptx)

## 起動方法

[Deno](https://deno.land/)をインストールし下記で実行

```bash
deno run -A kanirobo-server.ts
```

- [http://[::]:8000/](http://[::]:8000/)を開く

## 起動オプション

### IPv4でポート8888を使用して起動

```bash
deno run -A kanirobo-server.ts --ipv4 8888
```

- [http://localhost:8888/](http://localhost:8888/)を開く

### キャッシュされたリソースの再読み込み

-r オプションにより、リモートリソースの再読み込みを行って起動

```bash
deno run -r -A kanirobo-server.ts
```

## ID/パスワード

- id: kanirobo
- password: 29122 (運用時 [password.txt](password.txt)
  を編集して変更してください)

## 設定

### 大会情報

settings.js で各種設定が可能です

- 大会名 : 各ページ見出しへの反映
- 部門名 : T ... エントリー部門 , K ... 歩行部門
- 決勝トーナメント出場者数 : 部門別に設定 (4, 8, 16 ...)
- 予選の部門別ステージ数 : エントリー部門 1 or 2, 歩行部門 1
- 得点ポイントの名称: 越前がにロボコンと同一の場合名称変更が可能

### 参加者

data/entry.csv に、参加者情報を記入してください

## 貢献者

- [福井こどもプログラミング協議会](https://fkpc.github.io/)
- [PCN魚津](https://pcn-uozu.com/)

## 修正しなければいけないこと
- [ ] デッドコードを削除
- [x] `var`を削除
- [ ] 大規模なリファクタリング
  - [ ] csv -> json or Deno KV
  - [ ] JS -> TS
