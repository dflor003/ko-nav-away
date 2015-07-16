require('jake-utils');

desc('Builds, combines, and minifys everything into the "dist" folder');
task('build', function () {
    start('Copying ko-nav-away.js to dist');
    jake.mkdirP('dist');
    var src = read('src/ko-nav-away.js');
    write('dist/ko-nav-away.js', src);
    end();

    start('Minifying source...');
    var result = minify({
        src: 'dist/ko-nav-away.js',
        dest: 'dist/ko-nav-away.min.js'
    });
    end();
});