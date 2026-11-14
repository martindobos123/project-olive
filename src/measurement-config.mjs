import { createHash } from 'node:crypto';

// Build-time public IDs only. Never pass access tokens or API secrets to this module.
export function measurementConfig(env = process.env) {
  const fields = {
    openai: ['CHATGPT_PIXEL_ID', /^[A-Za-z0-9_-]{10,80}$/],
    ga4: ['GA4_MEASUREMENT_ID', /^G-[A-Z0-9]{4,20}$/],
    gtm: ['GTM_CONTAINER_ID', /^GTM-[A-Z0-9]{4,20}$/],
    meta: ['META_PIXEL_ID', /^\d{5,25}$/],
    googleAds: ['GOOGLE_ADS_ID', /^AW-\d{5,20}$/],
    adsLeadLabel: ['GOOGLE_ADS_LEAD_LABEL', /^[A-Za-z0-9_-]{5,100}$/],
    linkedin: ['LINKEDIN_PARTNER_ID', /^\d{3,20}$/],
    linkedinLead: ['LINKEDIN_LEAD_CONVERSION_ID', /^\d{3,20}$/],
    tiktok: ['TIKTOK_PIXEL_ID', /^[A-Z0-9]{10,30}$/],
  };
  // Bump when the purposes or published consent notice changes.
  const config = { noticeVersion: '2026-11-14.4' };
  for (const [key, [name, pattern]] of Object.entries(fields)) {
    config[key] = (env[name] || '').trim();
    if (config[key] && !pattern.test(config[key])) throw new Error(`Invalid ${name}`);
  }
  if (config.adsLeadLabel && !config.googleAds) throw new Error('GOOGLE_ADS_LEAD_LABEL needs GOOGLE_ADS_ID');
  if (config.linkedinLead && !config.linkedin) throw new Error('LINKEDIN_LEAD_CONVERSION_ID needs LINKEDIN_PARTNER_ID');
  const services = (env.GTM_SERVICES || '').split(',').map(s => s.trim()).filter(Boolean);
  const names = ['ga4', 'meta', 'googleAds', 'linkedin', 'tiktok'];
  if (services.some(s => !names.includes(s))) throw new Error('Unknown GTM_SERVICES provider');
  if (config.gtm && names.some(s => config[s])) throw new Error('Use GTM OR direct measurement IDs to avoid duplicate tags');
  if (config.gtm && !services.length) throw new Error('Declare GTM_SERVICES for provider disclosure and CSP');
  if (!config.gtm && services.length) throw new Error('GTM_SERVICES needs GTM_CONTAINER_ID');
  config.providers = names.filter(s => config[s] || services.includes(s));
  // OpenAI is a separate consent-gated image pixel; never also install it in GTM.
  if (config.openai) config.providers.push('openai');
  config.active = config.providers.length > 0;
  config.debug = env.MEASUREMENT_DEBUG === 'true';
  // Enable only after auditing every GTM tag's Additional Consent Checks.
  config.purposeGatingVerified = !!config.gtm && env.GTM_PURPOSE_GATING_VERIFIED === 'true';
  // A changed provider/configuration requires a fresh choice, including across deployments.
  config.revision = createHash('sha256').update(JSON.stringify(config)).digest('hex').slice(0, 16);
  return config;
}

export const measurement = measurementConfig();

export function measurementCsp(config = measurement) {
  const script = [], connect = [], img = [], frame = [];
  const has = name => config.providers.includes(name);
  if (config.gtm || has('ga4') || has('googleAds')) {
    script.push('https://www.googletagmanager.com');
    connect.push('https://www.googletagmanager.com', 'https://*.google-analytics.com', 'https://*.google.com');
    img.push('https://www.googletagmanager.com', 'https://*.google-analytics.com');
  }
  if (has('googleAds')) {
    script.push('https://www.googleadservices.com', 'https://www.google.com');
    const ads = ['https://www.googleadservices.com', 'https://googleads.g.doubleclick.net', 'https://pagead2.googlesyndication.com', 'https://www.google.com', 'https://www.google.hu', 'https://ad.doubleclick.net'];
    connect.push(...ads); img.push(...ads); frame.push('https://www.googletagmanager.com');
  }
  if (has('openai')) { connect.push('https://bzr.openai.com'); img.push('https://bzr.openai.com'); }
  if (has('meta')) { script.push('https://connect.facebook.net', 'https://cdn.jsdelivr.net/npm/meta-capi-param-builder-clientjs/', 'https://unpkg.com/meta-capi-param-builder-clientjs/'); connect.push('https://www.facebook.com'); img.push('https://www.facebook.com'); }
  if (has('linkedin')) { script.push('https://snap.licdn.com'); connect.push('https://px.ads.linkedin.com', 'https://px4.ads.linkedin.com'); img.push('https://px.ads.linkedin.com', 'https://px4.ads.linkedin.com', 'https://p.adsymptotic.com'); }
  if (has('tiktok')) { script.push('https://analytics.tiktok.com', 'https://anlytics-ipv6.tiktokw.us'); connect.push('https://analytics.tiktok.com', 'https://anlytics-ipv6.tiktokw.us'); img.push('https://analytics.tiktok.com', 'https://anlytics-ipv6.tiktokw.us'); }
  return { script: [...new Set(script)].join(' '), connect: [...new Set(connect)].join(' '), img: [...new Set(img)].join(' '), frame: frame.join(' ') || "'none'" };
}
