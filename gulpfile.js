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

const imagemin = require('gulp-imagemin');

const imageminMozjpeg = require('imagemin-mozjpeg');

const imageminPngquant = require('imagemin-pngquant');


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

gulp.task('imagemin', () =>
  gulp.src('assets/*.{png,jpg,gif,svg}')
  .pipe(imagemin([
    imageminMozjpeg({
      //画質
      quality: 70,
    }),
    imageminPngquant({
      //画質
      quality: 70,
    }),
    imagemin.svgo({
      plugins: [
        // viewBox属性を削除する（widthとheight属性がある場合）。
        // 表示が崩れる原因になるので削除しない。
        {
          removeViewBox: false
        },
        // <metadata>を削除する。
        // 追加したmetadataを削除する必要はない。
        {
          removeMetadata: false
        },
        // SVGの仕様に含まれていないタグや属性、id属性やvertion属性を削除する。
        // 追加した要素を削除する必要はない。
        {
          removeUnknownsAndDefaults: false
        },
        // コードが短くなる場合だけ<path>に変換する。
        // アニメーションが動作しない可能性があるので変換しない。
        {
          convertShapeToPath: false
        },
        // 重複や不要な`<g>`タグを削除する。
        // アニメーションが動作しない可能性があるので変換しない。
        {
          collapseGroups: false
        },
        // SVG内に<style>や<script>がなければidを削除する。
        // idにアンカーが貼られていたら削除せずにid名を縮小する。
        // id属性は動作の起点となることがあるため削除しない。
        {
          cleanupIDs: false
        },
      ]
    }),
    imagemin.optipng(),
    imagemin.gifsicle(),
  ]))
  .pipe(gulp.dest('images'))
);

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
gulp.task("default", gulp.parallel("sass", "imagemin", "browserSyncTask"));
