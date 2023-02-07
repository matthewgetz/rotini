const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/okaidia');
const path = require('path');

const versions = require('./versions.json');

const makeVersions = () => {
  const results = {};
  versions.forEach(version => {
    results[version] = {
      path: version,
      label: version
    }
  });
  return results;
};

module.exports = {
  title: 'rotini',
  tagline: 'a framework for building node.js cli programs',
  titleDelimiter: '·',
  url: 'https://matthewgetz.github.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'matthewgetz',
  projectName: 'rotini',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: path.resolve(__dirname, './sidebars.json'),
          editUrl: 'https://github.com/matthewgetz/rotini/website/docs',
          includeCurrentVersion: false,
          versions: {
            ...makeVersions()
          }
        },
        blog: {
          showReadingTime: false,
          editUrl: 'https://github.com/matthewgetz/rotini/website/blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }
    ],
  ],
  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'rotini',
      items: [
        {
          type: 'docsVersionDropdown',
          dropdownActiveClassDisabled: true,
          position: 'left',
        },
        {
          label: 'Documentation',
          docId: 'index',
          type: 'doc',
          position: 'left',
        },
        {
          label: 'API',
          docId: 'api/index',
          type: 'doc',
          position: 'left',
        },
        {
          label: 'Blog',
          to: '/blog',
          position: 'left',
        },
        {
          href: 'https://github.com/matthewgetz/rotini',
          className: 'header-github-link',
          'aria-label': 'GitHub Repository',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};
