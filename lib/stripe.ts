import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia', // Using a stable version
});

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    ai_limit: 5,
    storage_limit: '100MB'
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    ai_limit: 100,
    storage_limit: '5GB'
  },
  TEAM: {
    id: 'team',
    name: 'Team',
    priceId: process.env.STRIPE_TEAM_PRICE_ID,
    ai_limit: Infinity,
    storage_limit: '50GB'
  }
};
