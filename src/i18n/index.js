const { I18n } = require('i18n');
const path = require('path');

const i18n = new I18n({
  locales: ['ru', 'en'],
  directory: path.join(__dirname, 'locales'),
  objectNotation: '.',
  api: {
    __: 't',
    __n: 'tn',
  },
  defaultLocale: 'ru',
});

module.exports = i18n;
