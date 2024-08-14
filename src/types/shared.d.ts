/**
 * Sponsor.
 *
 * @since 1.0.0
 */
export type SponsorType = 'exempt-file' | 'github-api';

export type SponsorLogin = string;

export type SponsorAmount = number | null;

export type Sponsor = {
  type: SponsorType;
  login: SponsorLogin;
  amount: SponsorAmount;
};
