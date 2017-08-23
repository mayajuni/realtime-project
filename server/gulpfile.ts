import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as runSequence from 'run-sequence';
import * as del from 'del';
import * as rename from 'gulp-rename';
import * as nodemon from 'gulp-nodemon';
import tslint from 'gulp-tslint';


const path: any = {
    src: ['src/**/*.ts', 'src/**/**/*.ts', 'src/**/**/**/*.ts', 'src/**/**/**/**.ts'],
    buildTs: ['src/app.ts', 'src/**/**/*.ts', 'src/**/**/**/*.ts', 'src/**/**/**/**.ts', '!src/server-dev.ts', '!src/server-prod.ts', '!src/server-test.ts'],
    testTs: 'src/server-test.ts',
    devTs: 'src/server-dev.ts',
    prodTs: 'src/server-prod.ts',
    watchJs: ['dist/**/*.js', 'src/**/**/*.js', 'dist/**/**/**/*.js', 'dist/**/**/**/**.js']
};


const tsProject = ts.createProject('tsconfig.json');

/**
 * 코드 컨벤션 및 오류 확인
 */
gulp.task('ts-lint', () =>
    gulp.src(path.src)
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report())
);

/**
 * server-dev rename
 */
gulp.task('tsc', () => {
    const ts = gulp.src(path.buildTs)
        .pipe(tsProject());

    return ts.js.pipe(gulp.dest('dist'));
});

/**
 * test ts빌드
 */
gulp.task('tsc-server-test', () => {
    const ts = gulp.src(path.testTs)
        .pipe(tsProject());

    return ts.js.pipe(rename({basename: 'server', extname: '.js'})).pipe(gulp.dest('dist'));
});

/**
 * dev ts빌드
 */
gulp.task('tsc-server-dev', () => {
    const ts = gulp.src(path.devTs)
        .pipe(tsProject());

    return ts.js.pipe(rename({basename: 'server', extname: '.js'})).pipe(gulp.dest('dist'));
});

/**
 * dev ts빌드
 */
gulp.task('tsc-server-prod', () => {
    const ts = gulp.src(path.prodTs)
        .pipe(tsProject());

    return ts.js.pipe(rename({basename: 'server', extname: '.js'})).pipe(gulp.dest('dist'));
});

/**
 * typescript 컴파일전 ts-lint를 구동한다.
 */
gulp.task('ts', (done: any) => runSequence(
    'ts-lint',
    'tsc',
    done
));

/**
 * dist 폴더 삭제
 */
gulp.task('clean', () => {
    del('dist');
});

/**
 * build-test
 */
gulp.task('build-test', (done: any) => runSequence(
    'clean',
    'ts-lint',
    'tsc',
    'tsc-server-test',
    done
));

/**
 * build-dev
 */
gulp.task('build-dev', (done: any) => runSequence(
    'clean',
    'ts-lint',
    'tsc',
    'tsc-server-dev',
    done
));

/**
 * build-prod
 */
gulp.task('build-prod', (done: any) => {
    runSequence(
        'clean',
        'ts-lint',
        'tsc',
        'tsc-server-prod',
        done
    );
});

gulp.task('server-dev', (done: any) => {
    runSequence(
        'build-dev',
        'server',
        'watch'
    );
});

/**
 * 서버 구동
 */
gulp.task('server', () => {
    const stream = nodemon({
        script: 'dist/server.js',
        ext: 'js',
        env: {}
    });

    stream.on('crash', function () {
        console.error('Application has crashed!\n');
        stream.emit('restart', 10);  // restart the server in 10 seconds
    });
});

/**
 * 소스 변화를 감지한다
 */
gulp.task('watch', () => {
    gulp.watch(['src/app.ts', 'src/**/**/*.ts', 'src/**/**/**/*.ts', 'src/**/**/**/**.ts', '!src/server-dev.ts', '!src/server-prod.ts'], () => runSequence('ts'));

    gulp.watch(path.devTs, () => runSequence('tsc-server-dev'));

    gulp.watch(path.prodTs, () => runSequence('tsc-server-prod'));
});