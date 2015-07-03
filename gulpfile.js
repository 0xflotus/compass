var gulp = require('gulp');
var path = require('path');
var pkg = require('./package.json');
var child_process = require('child_process');
var async = require('async');
var npm = require('which').sync('npm');
var proc = require('child_process');
var os = require('os');
var path = require('path');

var run = function(child, task) {
  var args = task.split(' '),
    cmd = args.shift();

  return function(cb) {
    var opts = {
        cwd: path.resolve(__dirname + '/' + pkg.name + '-' + child),
        stdio: 'inherit'
      },
      p = child_process.spawn(cmd, args, opts);

    console.log('> ' + pkg.name + '@' + pkg.version, task, opts.cwd);
    p.on('exit', function(code) {
      console.log('< ' + pkg.name + '@' + pkg.version, task, 'exit ' + code);
      if (code !== 0) return cb(new Error(child + ': ' + task + ' exited with code ' + code));
      cb();
    });
  };
};

function test() {
  process.env.NODE_ENV = 'testing';
}

function dev() {
  process.env.NODE_ENV = 'development';
  process.env.DEBUG = 'mon*,sco*';
}

function prod() {
  process.env.NODE_ENV = 'production';
}

function script(name, pkgs, done) {
  if (Array.isArray(name)) {
    return name.map(function(n) {
      return script(n, pkgs, done);
    });
  }

  if (typeof pkgs === 'function') {
    done = pkgs;
    pkgs = ['client', 'brain', 'style', 'server', 'ui', 'electron'];
  }

  var args = 'run-script ' + name;
  if (name === 'install') {
    args = 'install';
  }
  async.series(pkgs.map(function(c) {
    return run(c, npm + ' ' + args);
  }), done);
}

gulp.task('install', function(done) {
  dev();
  script('install', done);
});

gulp.task('test', function(done) {
  test();
  script('test', ['server'], done);
});

gulp.task('default', ['install', 'test']);

gulp.task('start', function() {
  dev();
  script('start', ['electron']);
});
