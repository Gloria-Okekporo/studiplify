'use server';

import { stripe } from '../stripe';
import { createActionSupabaseClient } from '../supabase-server';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(priceId: string) {
  const supabase = createActionSupabaseClient();
  const { data: { session: authSession } } = await supabase.auth.getSession();

  if (!authSession) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authSession.user.id)
    .single();

  const { data: subData } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', authSession.user.id)
    .single();

  const stripeSession = await stripe.checkout.sessions.create({
    customer: subData?.stripe_customer_id || undefined,
    customer_email: subData?.stripe_customer_id ? undefined : authSession.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
    metadata: {
      userId: authSession.user.id,
    },
  });

  if (!stripeSession.url) throw new Error('Failed to create checkout session');
  
  redirect(stripeSession.url);
}

export async function createBillingPortal() {
  const supabase = createActionSupabaseClient();
  const { data: { session: authSession } } = await supabase.auth.getSession();

  if (!authSession) throw new Error('Unauthorized');

  const { data: subData } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', authSession.user.id)
    .single();

  if (!subData?.stripe_customer_id) throw new Error('No stripe customer found');

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subData.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings`,
  });

  redirect(portalSession.url);
}

export async function getSubscriptionStatus() {
  const supabase = createActionSupabaseClient();
  const { data: { session: authSession } } = await supabase.auth.getSession();

  if (!authSession) return null;

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', authSession.user.id)
    .single();

  return data;
}
