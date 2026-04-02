/**
 * Pricing Tiers
 * -------------
 * - Basic: entry-level (intentionally minimal)
 * - Standard: recommended / most popular (highlighted)
 * - Premium: high-anchor price for complex needs
 *
 * Edit price, features, and CTA text to match your current rates.
 */

export const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$799',
    period: 'one-time',
    tagline: 'Get online fast',
    description: 'Perfect for getting a simple professional presence online.',
    features: [
      'Single landing page',
      'Mobile responsive',
      'Contact form',
      'Basic SEO setup',
      '1 revision round',
      '14-day delivery',
    ],
    notIncluded: [
      'Multiple pages',
      'Animations',
      'Backend / database',
    ],
    cta: 'Get Started',
    highlighted: false,
    badge: null,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '$2,499',
    period: 'one-time',
    tagline: 'Everything your business needs',
    description: 'The complete package for businesses serious about their online presence.',
    features: [
      'Up to 8 pages',
      'Smooth animations',
      'Portfolio / gallery section',
      'Blog-ready structure',
      'Advanced SEO + sitemap',
      'Google Analytics setup',
      '3 revision rounds',
      '30-day post-launch support',
      '21-day delivery',
    ],
    notIncluded: [],
    cta: 'Start Your Project',
    highlighted: true,  // Gold border, slightly enlarged
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$5,999+',
    period: 'starting at',
    tagline: 'Full custom application',
    description: 'For businesses that need powerful functionality behind a beautiful interface.',
    features: [
      'Custom web application',
      'User authentication',
      'Payment integration',
      'Database & backend API',
      'Admin dashboard',
      'Unlimited revisions',
      '90-day support',
      'Custom timeline',
    ],
    notIncluded: [],
    cta: 'Let\'s Talk',
    highlighted: false,
    badge: 'Best Value',
  },
]
