import {
  Canvas,
  Features,
  Stats,
} from '@cbnventures/docusaurus-preset-nova/blocks';

import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import styles from './index.module.css';

/**
 * Pages - Home.
 *
 * Root landing page that composes the hero header, feature grid,
 * and stats section using theme blocks.
 *
 * @constructor
 *
 * @since UNRELEASED
 */
function Home() {
  return (
    <Layout description={translate({
      id: 'home.layout.description',
      message: 'Ensure that only sponsors and recognized contributors have access to support.',
      description: 'Front page layout description (meta description for SEO)',
    })}
    >
      <Head>
        <title>
          {translate({
            id: 'home.head.title',
            message: 'Sponsor Gated Support - Support Reserved for Sponsors',
            description: 'Front page browser tab title',
          })}
        </title>
      </Head>
      <Canvas container="full" className={styles['hero']}>
        <div className={styles['heroInner']}>
          <div className={styles['heroContent']}>
            <p className="nova-hero-eyebrow">
              {translate({
                id: 'home.hero.eyebrow',
                message: 'GitHub Action',
                description: 'Front page hero eyebrow above the heading',
              })}
            </p>
            <Heading as="h1" className="nova-hero-heading">
              {translate({
                id: 'home.hero.heading',
                message: 'Support reserved for sponsors.',
                description: 'Front page hero main heading',
              })}
            </Heading>
            <p className="nova-hero-tagline">
              {translate({
                id: 'home.hero.tagline',
                message: 'Sponsor Gated Support is a GitHub Action that gates issue opening to users who sponsor the project, appear as contributors, or are listed in an exempt file. Only the labels you choose are gated, so bug reports and feature requests stay freely accessible.',
                description: 'Front page hero tagline beneath the heading',
              })}
            </p>
            <div className={`nova-hero-actions ${styles['heroActions']}`}>
              <Link
                className="nova-cta-primary"
                to="/docs/overview/"
              >
                {translate({
                  id: 'home.hero.ctaLabel',
                  message: 'Get Started',
                  description: 'Front page hero primary call-to-action button label',
                })}
              </Link>
              <Link
                className="nova-cta-secondary"
                to="https://github.com/mrjackyliang/sponsor-gated-support"
              >
                {translate({
                  id: 'home.hero.secondaryCtaLabel',
                  message: 'View on GitHub',
                  description: 'Front page hero secondary call-to-action button label',
                })}
              </Link>
            </div>
          </div>
          <div className={styles['verdictStack']} aria-hidden="true">
            <div className={styles['verdictCard']}>
              <div className={styles['verdictTop']}>
                <div className={`${styles['verdictAvatar']} ${styles['avatarSponsor']}`} />
                <div className={styles['verdictInfo']}>
                  <div className={styles['verdictTitle']}>Setup wizard fails on step 3</div>
                  <div className={styles['verdictMeta']}>
                    {'@sponsor-user · '}
                    <span className={styles['verdictLabel']}>support</span>
                  </div>
                </div>
                <span className={`${styles['verdictStamp']} ${styles['stampApproved']}`}>Approved</span>
              </div>
              <div className={styles['verdictComment']}>
                Thank you for sponsoring this project. Your support issue is now open.
              </div>
            </div>
            <div className={styles['verdictCard']}>
              <div className={styles['verdictTop']}>
                <div className={`${styles['verdictAvatar']} ${styles['avatarNone']}`} />
                <div className={styles['verdictInfo']}>
                  <div className={styles['verdictTitle']}>How do I configure the API key?</div>
                  <div className={styles['verdictMeta']}>
                    {'@new-user · '}
                    <span className={styles['verdictLabel']}>support</span>
                  </div>
                </div>
                <span className={`${styles['verdictStamp']} ${styles['stampClosed']}`}>Closed</span>
              </div>
              <div className={`${styles['verdictComment']} ${styles['verdictCommentClosed']}`}>
                Support issues are reserved for project sponsors. Bug reports and feature requests remain open to everyone.
              </div>
            </div>
          </div>
        </div>
      </Canvas>
      <main>
        <Features
          items={[
            {
              icon: 'lucide:shield-check',
              title: translate({
                id: 'home.features.sponsorGating.title',
                message: 'Sponsor Gating',
                description: 'Front page Features card title for Sponsor Gating',
              }),
              description: translate({
                id: 'home.features.sponsorGating.description',
                message: 'Checks the issue author against your live GitHub Sponsors list via the GraphQL API with pagination. Eligible users receive a welcome message; everyone else is notified, closed, and locked.',
                description: 'Front page Features card description for Sponsor Gating',
              }),
            },
            {
              icon: 'lucide:user-check',
              title: translate({
                id: 'home.features.contributorBypass.title',
                message: 'Contributor Bypass',
                description: 'Front page Features card title for Contributor Bypass',
              }),
              description: translate({
                id: 'home.features.contributorBypass.description',
                message: 'Members, owners, contributors, and collaborators bypass the sponsorship requirement automatically based on GitHub author association. An exempt file grants access to anyone you choose.',
                description: 'Front page Features card description for Contributor Bypass',
              }),
            },
            {
              icon: 'lucide:tag',
              title: translate({
                id: 'home.features.labelScoping.title',
                message: 'Label Scoping',
                description: 'Front page Features card title for Label Scoping',
              }),
              description: translate({
                id: 'home.features.labelScoping.description',
                message: 'Only issues carrying the labels you configure are gated. Bug reports, feature requests, and other issue types stay freely accessible to everyone.',
                description: 'Front page Features card description for Label Scoping',
              }),
            },
            {
              icon: 'lucide:message-square-x',
              title: translate({
                id: 'home.features.commentModeration.title',
                message: 'Comment Moderation',
                description: 'Front page Features card title for Comment Moderation',
              }),
              description: translate({
                id: 'home.features.commentModeration.description',
                message: 'Comments on gated issues from anyone other than the issue creator, members, owners, contributors, or collaborators are automatically deleted.',
                description: 'Front page Features card description for Comment Moderation',
              }),
            },
            {
              icon: 'lucide:gauge',
              title: translate({
                id: 'home.features.sponsorshipThresholds.title',
                message: 'Sponsorship Thresholds',
                description: 'Front page Features card title for Sponsorship Thresholds',
              }),
              description: translate({
                id: 'home.features.sponsorshipThresholds.description',
                message: 'Require active sponsorships only and set a minimum monthly tier amount in cents. Sponsors below the threshold are treated as non-sponsors.',
                description: 'Front page Features card description for Sponsorship Thresholds',
              }),
            },
            {
              icon: 'lucide:building-2',
              title: translate({
                id: 'home.features.orgSupport.title',
                message: 'Organization Support',
                description: 'Front page Features card title for Organization Support',
              }),
              description: translate({
                id: 'home.features.orgSupport.description',
                message: 'Teams running GitHub Sponsors on an organization account get the same gating on organization-owned repositories via the organization mode.',
                description: 'Front page Features card description for Organization Support',
              }),
            },
          ]}
        />
        <Stats
          heading={translate({
            id: 'home.stats.heading',
            message: 'By the Numbers',
            description: 'Front page Stats section heading',
          })}
          items={[
            {
              value: '3',
              label: translate({
                id: 'home.stats.accessTiers.label',
                message: 'Access tiers',
                description: 'Front page Stats label for access tiers count',
              }),
              color: 'primary',
            },
            {
              value: '11',
              label: translate({
                id: 'home.stats.configurableInputs.label',
                message: 'Configurable inputs',
                description: 'Front page Stats label for configurable inputs count',
              }),
              color: 'accent',
            },
            {
              value: '2',
              label: translate({
                id: 'home.stats.tokens.label',
                message: 'Tokens for separation',
                description: 'Front page Stats label for tokens count',
              }),
              color: 'primary',
            },
            {
              value: '0',
              label: translate({
                id: 'home.stats.manualModeration.label',
                message: 'Manual moderation',
                description: 'Front page Stats label for manual moderation needed',
              }),
              color: 'accent',
            },
          ]}
        />
      </main>
    </Layout>
  );
}

export default Home;
