// gulpプラグインの読み込み
const gulp = require("gulp");
// Sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass");
//postcssプラグインの読み込み
const postcss = require("gulp-postcss");
//autoprefixerプラグインの読み込み
const autoprefixer = require("autoprefixer");
//browserSyncプラグインの読み込み
const browserSync = require("browser-sync");


// style.scssの監視タスクを作成する
gulp.task("sass", function() {
  // ★ style.scssファイルを監視
  return gulp.watch("css/style.scss", function() {
    // style.scssの更新があった場合の処理
    // style.scssファイルを取得
    return (
      gulp
      .src("css/style.scss")
      // Sassのコンパイルを実行
      .pipe(
        sass({
          outputStyle: "expanded"
        })
        // Sassのコンパイルエラーを表示
        // (これがないと自動的に止まってしまう)
        .on("error", sass.logError)
      )
      .pipe(postcss([
        autoprefixer({
          // ☆IEは11以上、Androidは4.4以上
          // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
          browsers: ["last 2 versions", "ie >= 11", "Android >= 4"],
          cascade: false
        })
      ]))
      // cssフォルダー以下に保存
      .pipe(gulp.dest("css"))
    );
  });
});
// タスクの設定
gulp.task("browserSyncTask", function() {
  browserSync({
    server: {
      baseDir: "./" // ルートとなるディレクトリを指定
    }
  });

  // srcフォルダ以下のファイルを監視
  gulp.watch("./**", function(cb) {
    browserSync.reload(); // ファイルに変更があれば同期しているブラウザをリロード
    // browserSyncのreload()が終わったことを通知する
    cb();
  });
});

// sassのタスクとbrowserSyncTaskを同時に実行する
gulp.task("default", gulp.parallel("sass", "browserSyncTask"));
