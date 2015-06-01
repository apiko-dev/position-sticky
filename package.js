Package.describe({
  name: 'jss:position-sticky',
  version: '0.1.0',
  summary: 'Polyfill for CSS position:sticky feature',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');
  api.use('mrt:modernizr-meteor');
  api.addFiles(['position-sticky.js'], 'client');
});
