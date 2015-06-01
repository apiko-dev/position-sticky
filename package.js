Package.describe({
  name: 'jss:position-sticky',
  version: '0.1.0',
  summary: 'Polyfill for CSS position:sticky feature',
  git: 'https://github.com/JSSolutions/position-sticky',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');
  api.use('mrt:modernizr-meteor@2.6.2');
  api.addFiles(['position-sticky.js'], 'client');
});
