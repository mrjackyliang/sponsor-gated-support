/**
 * Shared - Sponsor.
 *
 * @since 1.0.1
 */
export type Shared_Sponsor_Type = 'exempt-file' | 'github-api';

export type Shared_Sponsor_Login = string;

export type Shared_Sponsor_Amount = number | null;

export type Shared_Sponsor = {
  type: Shared_Sponsor_Type;
  login: Shared_Sponsor_Login;
  amount: Shared_Sponsor_Amount;
};
