import { NovaIdentity } from '@cbnventures/nova/toolkit';

import type { DocusaurusNovaConfig } from '@cbnventures/docusaurus-preset-nova/types/config';

/**
 * Identity.
 *
 * @since UNRELEASED
 */
const identity = new NovaIdentity().forDocs();

/**
 * Docusaurus Configuration.
 *
 * @since 0.11.0
 */
const config: DocusaurusNovaConfig = {
  // Site Metadata.
  title: identity['title'] ?? '',
  titleDelimiter: ' - ',
  tagline: identity['tagline'],
  favicon: './favicon.ico',

  // Deployment.
  url: identity['url'] ?? '',
  baseUrl: identity['baseUrl'] ?? '',
  organizationName: identity['organizationName'],
  projectName: identity['projectName'],
  deploymentBranch: undefined,
  githubHost: undefined,
  githubPort: undefined,
  trailingSlash: true,
  noIndex: false,

  // Error Handling.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',

  // Static Assets.
  staticDirectories: ['static'],
  baseUrlIssueBanner: true,
  scripts: [],
  stylesheets: [],
  clientModules: [],
  themes: [],

  // Custom Fields.
  customFields: {},

  // Head Tags.
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${identity['baseUrl'] ?? '/'}apple-touch-icon.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: `${identity['baseUrl'] ?? '/'}favicon-96x96.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `${identity['baseUrl'] ?? '/'}favicon.svg`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: `${identity['baseUrl'] ?? '/'}site.webmanifest`,
      },
    },
  ],

  // Internationalization.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
    },
  },

  // Markdown.
  markdown: {
    format: 'mdx',
    mermaid: true,
    emoji: true,
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
    anchors: {
      maintainCase: false,
    },
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'throw',
    },
  },

  // Presets (Nova).
  presets: [[
    '@cbnventures/docusaurus-preset-nova',
    {
      // Preset Identity.
      preset: 'marshal',

      // Preset Overrides (undefined = use preset default).
      overrides: {
        colors: {
          primary: {
            light: '#B8860B',
            dark: '#D4A843',
          },
          secondary: {
            light: '#6B4226',
            dark: '#A06840',
          },
          text: {
            light: '#2C2418',
            dark: '#F0E6D2',
          },
          border: {
            light: '#D6C9AE',
            dark: '#4A3D28',
          },
          warning: {
            light: '#E08A00',
            dark: '#F5A623',
          },
          danger: {
            light: '#C0392B',
            dark: '#E74C3C',
          },
        },
        fonts: {
          display: 'DM Serif Display',
          body: 'DM Sans',
          code: 'JetBrains Mono',
        },
        navbar: undefined,
        footer: undefined,
      },

      // Plugins.
      plugins: {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/mrjackyliang/sponsor-gated-support/tree/main/apps/docs/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Current',
              badge: false,
              banner: 'none',
            },
          },
        },
        blog: false,
        pages: undefined,
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/docs/tags/**'],
          filename: 'sitemap.xml',
        },
      },

      // Analytics.
      analytics: {
        gtm: undefined,
      },

      // Search.
      search: {
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: 'docs',
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutKeymap: 'mod+k',
        searchResultLimits: 8,
        fuzzyMatchingDistance: 1,
        ignorePatterns: [],
      },

      // Progress Bar.
      progressBar: true,
    },
  ]],

  // Plugins.
  plugins: [],

  // Theme Config.
  themeConfig: {
    // Site.
    site: {
      logo: {
        alt: 'Sponsor Gated Support',
        src: {
          light: `${identity['baseUrl'] ?? '/'}images/logo.svg`,
          dark: undefined,
        },
        href: '/',
        target: undefined,
        rel: undefined,
        ariaLabel: undefined,
        wordmark: {
          light: undefined,
          dark: undefined,
        },
      },
      image: '/thumbnails/brand.png',
      metadata: [
        {
          name: 'description',
          content: identity['metaDescription'] ?? '',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
    },

    // Color Mode.
    colorMode: {
      defaultMode: 'system',
      disableSwitch: false,
    },

    // Navbar.
    navbar: {
      hideOnScroll: false,
      items: [
        {
          label: 'Overview',
          position: 'left',
          type: 'doc',
          docId: 'overview',
          icon: 'lucide:book-open',
        },
        {
          label: 'Usage',
          position: 'left',
          type: 'doc',
          docId: 'getting-started/usage',
          icon: 'lucide:play',
        },
        {
          label: 'Sponsor',
          position: 'right',
          type: undefined,
          href: 'https://github.com/sponsors/mrjackyliang',
          icon: 'lucide:heart',
        },
      ],
    },

    // Docs.
    docs: {
      versionPersistence: 'localStorage',
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },

    // Table of Contents.
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },

    // Announcement Bar.
    announcementBar: undefined,

    // Back to Top Button.
    backToTopButton: true,

    // Error Pages - overrides Nova's randomized defaults with consumer copy.
    // Any unset field falls through to the Nova-flavored randomized pool.
    errorPages: {
      notFound: {
        title: 'This page could not be found.',
        description: 'The page you are looking for may have been moved or never existed.',
        backHomeLabel: 'Back to the overview',
        backHomeHref: '/docs/overview/',
      },
      errorPageContent: {
        title: 'This page could not be opened.',
        retryLabel: 'Reload the page',
      },
      error: {
        retryLabel: 'Retry',
      },
    },

    // Footer.
    footer: {
      sections: {
        docs: [
          {
            label: 'Overview',
            href: '/docs/overview/',
          },
          {
            label: 'Usage',
            href: '/docs/getting-started/usage/',
          },
          {
            label: 'Inputs',
            href: '/docs/reference/inputs/',
          },
          {
            label: 'Outputs',
            href: '/docs/reference/outputs/',
          },
          {
            label: 'Personal Access Token',
            href: '/docs/reference/personal-access-token/',
          },
        ],
        project: [
          {
            label: 'GitHub',
            href: 'https://github.com/mrjackyliang/sponsor-gated-support',
          },
          {
            label: 'Report an Issue',
            href: 'https://github.com/mrjackyliang/sponsor-gated-support/issues',
          },
        ],
        legal: [{
          label: 'License',
          href: 'https://github.com/mrjackyliang/sponsor-gated-support/blob/main/LICENSE',
        }],
      },
      layout: {
        docs: {
          title: 'Docs',
          section: 'docs',
        },
        project: {
          title: 'Project',
          section: 'project',
        },
        legal: {
          title: 'Legal',
          section: 'legal',
        },
      },
      socialLinks: [
        {
          icon: 'ri:github-fill',
          href: 'https://github.com/mrjackyliang',
          label: 'GitHub',
        },
        {
          icon: 'ri:heart-fill',
          href: 'https://github.com/sponsors/mrjackyliang',
          label: 'GitHub Sponsors',
        },
      ],
      copyright: identity['copyright'],
      credit: true,
      cta: {
        label: 'View on GitHub',
        href: 'https://github.com/mrjackyliang/sponsor-gated-support',
      },
    },
  },
};

export default config;
