import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Use service role key to bypass RLS for background updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription) as any;
    const customerId = session.customer;
    const userId = session.metadata.userId;

    // Determine plan type from price ID
    let planType = 'pro';
    if (subscription.items.data[0].price.id === process.env.STRIPE_TEAM_PRICE_ID) {
      planType = 'team';
    }

    await supabaseAdmin
      .from('subscriptions')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: session.subscription,
        plan_type: planType,
        status: 'active',
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('user_id', userId);
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as any;
    
    await supabaseAdmin
      .from('subscriptions')
      .update({
        plan_type: subscription.items.data[0].price.id === process.env.STRIPE_TEAM_PRICE_ID ? 'team' : 'pro',
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    
    await supabaseAdmin
      .from('subscriptions')
      .update({
        plan_type: 'free',
        status: 'canceled',
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  return NextResponse.json({ received: true });
}
