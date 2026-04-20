// Pre-written content library — no API calls needed.
// Add more entries to any array to expand variety.

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── CAFE / RESTAURANT ────────────────────────────────────────────────────────

const CAFE = {
  taglines: [
    'Where Every Cup Tells a Story',
    'Good Coffee, Great Moments',
    'Brewed with Passion, Served with Love',
    'Your Daily Ritual, Elevated',
    "Life's Too Short for Bad Coffee",
    'Small Batch. Big Heart.',
    'The Best Part of Waking Up.',
  ],
  heroSubtitles: [
    'Handcrafted drinks, homemade bakes, and a warm welcome — every single day.',
    'From bean to cup, we pour our heart into every order.',
    'A neighborhood favorite serving exceptional coffee and good vibes.',
    'Slow down. Sip something great.',
  ],
  abouts: [
    (name, city) =>
      `${name} was born from a simple idea: great coffee should feel like coming home. Nestled in ${city}, we source our beans from ethical small-batch roasters and craft every drink by hand. Our team of passionate baristas treats your cup as a canvas — never rushed, always right. Whether you're here for your morning ritual, a quiet afternoon, or a catch-up with a friend, we're glad you stopped in. Pull up a chair. You belong here.`,
    (name, city) =>
      `What started as a passion project in ${city} has grown into one of the neighborhood's most beloved spots. At ${name}, we believe coffee is more than a beverage — it's a moment of pause in a busy world. Every ingredient is carefully chosen: single-origin beans, house-baked pastries, and seasonal specials crafted with whatever's fresh. Come as you are and leave a little more yourself.`,
    (name, city) =>
      `${name} opened its doors in ${city} with one goal: to create the kind of café you actually want to stay in. The kind with a great playlist, baristas who remember your order, and coffee that makes you close your eyes for a second. We partner with independent roasters, bake in-house daily, and keep things honest — because great coffee doesn't need to be complicated.`,
  ],
  highlights: [
    { icon: '☕', title: 'Single-Origin Beans',   desc: 'Sourced from ethical farms and roasted locally to unlock every flavor note.' },
    { icon: '🥐', title: 'Baked Fresh Daily',      desc: 'Our pastries and baked goods are made in-house every morning before you arrive.' },
    { icon: '✨', title: 'Cozy & Welcoming',       desc: 'A space designed for lingering — bring a book, a laptop, or a good friend.' },
    { icon: '🌿', title: 'Community First',        desc: "We're proud to be part of this neighborhood and give back whenever we can." },
    { icon: '🍂', title: 'Seasonal Specials',      desc: 'Our menu evolves with the seasons to bring you something new to look forward to.' },
    { icon: '💛', title: 'Made with Love',         desc: 'Every drink, every bite, every visit — crafted with genuine care.' },
  ],
  services: [
    { name: 'House Espresso',    desc: 'Our signature blend — rich, smooth, and perfectly balanced with notes of dark chocolate and caramel.', price: '$4' },
    { name: 'Oat Milk Latte',   desc: 'Velvety steamed oat milk meets our single-origin espresso. A fan favorite, every single day.',         price: '$6' },
    { name: 'Pour-Over Coffee', desc: 'Brewed to order with rotating single-origin beans. Clean, nuanced, and absolutely worth the wait.',     price: '$7' },
    { name: 'Matcha Latte',     desc: 'Ceremonial-grade matcha whisked smooth and paired with your choice of milk. Earthy and energizing.',    price: '$6' },
    { name: 'Croissant',        desc: 'Buttery, flaky, and baked fresh each morning. Best enjoyed warm with your favorite drink.',             price: '$4.50' },
    { name: "Today's Special",  desc: 'Ask your barista about our featured drink — crafted from whatever\'s fresh and in season.',             price: 'Ask Us' },
  ],
  hours: { monFri: '7:00 AM – 6:00 PM', sat: '8:00 AM – 5:00 PM', sun: '9:00 AM – 4:00 PM' },
};

// ─── SALON / SPA ──────────────────────────────────────────────────────────────

const SALON = {
  taglines: [
    'Where Beauty Meets Confidence',
    'You Deserve to Feel Extraordinary',
    'Your Look. Your Story. Our Craft.',
    'Elevating Beauty, One Client at a Time',
    'Expert Hands. Stunning Results.',
    'Transform. Refresh. Shine.',
  ],
  heroSubtitles: [
    'Premium hair and beauty services in a space designed just for you.',
    'Step in for a service. Step out feeling like a whole new you.',
    'Where skilled artistry meets a warm, welcoming atmosphere.',
    'Your transformation starts the moment you walk through our door.',
  ],
  abouts: [
    (name, city) =>
      `${name} is a boutique salon in ${city} built on the belief that every person deserves to feel beautiful, confident, and cared for. Our team of experienced stylists are dedicated to understanding your unique style, hair type, and lifestyle — then crafting a look that works for your real life. We use only curated, professional-grade products that are gentle on your hair and the environment. From a quick trim to a full transformation, we bring the same level of care to every appointment.`,
    (name, city) =>
      `Founded in ${city} by stylists who believed in doing things differently, ${name} is a sanctuary for beauty, self-care, and transformation. We've created a welcoming, inclusive space where every client feels seen and valued. Our team stays at the cutting edge of trends through regular education, so you always get the latest delivered with genuine expertise. We use only professional-grade products and take the time to truly listen before we touch a single strand.`,
    (name, city) =>
      `At ${name} in ${city}, we think getting your hair done should feel like a treat, not a chore. That's why we've crafted an experience that's as enjoyable as the results. From the moment you walk in, you're in good hands — experienced, passionate, and genuinely invested in making you look and feel your absolute best. We specialize in tailored color, precision cuts, and restorative treatments for every hair type.`,
  ],
  highlights: [
    { icon: '✂️', title: 'Expert Stylists',      desc: 'Our team brings years of training and true artistry to every chair, every client, every time.' },
    { icon: '🌿', title: 'Premium Products',     desc: 'We use only professional-grade, cruelty-free products that deliver real, lasting results.' },
    { icon: '✨', title: 'Your Comfort First',   desc: 'A relaxing atmosphere, attentive service, and zero judgment — just great results.' },
    { icon: '💛', title: 'Personalized Service', desc: "No cookie-cutter looks here. Every service is tailored to your unique style and goals." },
    { icon: '🌸', title: 'Clean & Curated',      desc: 'A thoughtfully designed space that feels calm, clean, and truly welcoming.' },
  ],
  services: [
    { name: "Women's Cut & Style",   desc: 'A personalized cut tailored to your face shape, lifestyle, and style goals. Includes a professional blowout.', price: 'From $65' },
    { name: 'Color & Highlights',    desc: 'Full color, balayage, highlights, or creative color — our colorists make the process seamless and the results stunning.', price: 'From $95' },
    { name: 'Keratin Treatment',     desc: 'Smooths frizz, reduces styling time, and leaves hair silky and manageable for months.', price: 'From $150' },
    { name: 'Blowout & Style',       desc: 'A professional blow-dry and finish to leave your hair smooth, shiny, and ready for anything.', price: 'From $45' },
    { name: 'Deep Conditioning',     desc: 'Restore moisture, strength, and shine with our salon-grade deep conditioning treatment.', price: 'From $35' },
    { name: "Men's Cut",             desc: "A clean, precise cut tailored to your style. Includes a hot towel finish and styling.", price: 'From $40' },
  ],
  hours: { monFri: '9:00 AM – 7:00 PM', sat: '9:00 AM – 6:00 PM', sun: '10:00 AM – 4:00 PM' },
};

// ─── GENERIC BUSINESS ─────────────────────────────────────────────────────────

const GENERIC = {
  taglines: [
    'Excellence in Every Detail',
    'Trusted Expertise. Real Results.',
    'Your Vision, Our Commitment',
    'Delivering What Matters Most',
    'Where Quality Meets Dedication',
    'Built on Trust. Driven by Results.',
  ],
  heroSubtitles: [
    'Serving the community with passion, expertise, and a commitment to excellence.',
    "We're here to help you achieve your goals — with skill, dedication, and genuine care.",
    'Professional service backed by real experience and a commitment to you.',
    'Reliable. Experienced. Always in your corner.',
  ],
  abouts: [
    (name, city) =>
      `${name} was founded on a simple but powerful principle: do great work and treat people right. Based in ${city}, we've spent years building a reputation for excellence, reliability, and results that speak for themselves. Our team combines deep expertise with a genuine commitment to every client we serve. We don't believe in one-size-fits-all — we take the time to understand your unique needs and deliver work tailored exactly to you. Our clients come back not just because of the quality, but because of how we make them feel throughout the entire process.`,
    (name, city) =>
      `For years, ${name} has been one of ${city}'s most trusted names in the industry. What started as a small operation has grown into a full-service team, but our core values have never changed: honest work, clear communication, and results you can count on. We bring expertise, professionalism, and genuine care to every client relationship. Whether you're working with us for the first time or you've been with us for years, we treat every project with the same pride and dedication.`,
    (name, city) =>
      `At ${name}, we believe great service is built on trust. Since opening in ${city}, we've made it our mission to deliver consistent, high-quality results while making the process as smooth and transparent as possible. Our experienced team listens carefully, communicates clearly, and delivers on every promise. We measure our success by the satisfaction and loyalty of the people we're privileged to serve.`,
  ],
  highlights: [
    { icon: '⭐', title: 'Expert Team',       desc: 'Years of hands-on experience and genuine passion for our craft in every project we take on.' },
    { icon: '📈', title: 'Proven Results',    desc: 'Our track record speaks for itself — clients who trust us and outcomes that show it.' },
    { icon: '🤝', title: 'Client-Centered',   desc: 'Your needs come first. We listen, adapt, and always put your goals at the center.' },
    { icon: '🔒', title: 'You Can Count On Us', desc: 'Reliable, responsive, and ready to help — exactly when you need us.' },
    { icon: '💡', title: 'Smart Solutions',   desc: 'We bring creative thinking and practical know-how to every challenge.' },
  ],
  services: [
    { name: 'Free Consultation',  desc: 'Start with a no-obligation conversation to discuss your goals, timeline, and how we can help.', price: 'Free' },
    { name: 'Core Service',       desc: 'Our flagship offering, delivered with the expertise and care that clients have come to rely on.', price: 'Get a Quote' },
    { name: 'Premium Package',    desc: 'Everything you need, bundled together for a seamless experience from start to finish.', price: 'Get a Quote' },
    { name: 'Ongoing Support',    desc: 'Regular check-ins, updates, and expert guidance to keep everything running smoothly.', price: 'Monthly' },
    { name: 'Custom Solution',    desc: "Have specific needs? We'll build a tailored plan that fits your goals exactly.", price: 'Contact Us' },
    { name: 'Rush / Priority',    desc: 'Need results fast? Ask about our priority service with accelerated turnaround.', price: 'Contact Us' },
  ],
  testimonials: [
    { text: 'Working with this team has been an absolute pleasure. The quality exceeded my expectations, and the communication throughout was excellent. I highly recommend them to anyone.',             author: 'Sarah M.' },
    { text: "I've worked with a lot of businesses over the years, but this one stands out. Professional, reliable, and genuinely great at what they do. I keep coming back because they consistently deliver.", author: 'James T.' },
    { text: 'From start to finish, the experience was outstanding. They took the time to truly understand what I needed and delivered results I could not be happier with. Five stars all the way.',    author: 'Emily R.' },
    { text: 'The level of care and attention to detail here is something you rarely see. They treat every client like a priority, and it shows in the results. Couldn\'t recommend more highly.',       author: 'David K.' },
    { text: "I found this place on a recommendation and I'm so glad I did. Incredible service, great team, and real results. This is now my go-to, and I've already referred several friends.",          author: 'Priya S.' },
  ],
  hours: { monFri: '9:00 AM – 6:00 PM', sat: '10:00 AM – 4:00 PM', sun: 'By Appointment' },
};

// ─── Export ───────────────────────────────────────────────────────────────────

function getContent(templateKey, businessName, city) {
  const src = templateKey === 'cafe' ? CAFE : templateKey === 'salon' ? SALON : GENERIC;

  const shuffled = [...src.highlights].sort(() => Math.random() - 0.5);
  const h = shuffled.slice(0, 3);

  const result = {
    TAGLINE:       pick(src.taglines),
    HERO_SUBTITLE: pick(src.heroSubtitles),
    ABOUT:         pick(src.abouts)(businessName, city),
    PHONE:         '(555) 000-0000',
    EMAIL:         `hello@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
    HOURS_MON_FRI: src.hours.monFri,
    HOURS_SAT:     src.hours.sat,
    HOURS_SUN:     src.hours.sun,

    HIGHLIGHT_1_ICON: h[0]?.icon  ?? '⭐',
    HIGHLIGHT_1:      h[0]?.title ?? 'Our Difference',
    HIGHLIGHT_1_DESC: h[0]?.desc  ?? '',
    HIGHLIGHT_2_ICON: h[1]?.icon  ?? '✨',
    HIGHLIGHT_2:      h[1]?.title ?? 'Quality First',
    HIGHLIGHT_2_DESC: h[1]?.desc  ?? '',
    HIGHLIGHT_3_ICON: h[2]?.icon  ?? '🤝',
    HIGHLIGHT_3:      h[2]?.title ?? 'Always Here',
    HIGHLIGHT_3_DESC: h[2]?.desc  ?? '',
  };

  src.services.forEach((s, i) => {
    result[`SERVICE_${i+1}_NAME`]  = s.name  ?? '';
    result[`SERVICE_${i+1}_DESC`]  = s.desc  ?? '';
    result[`SERVICE_${i+1}_PRICE`] = s.price ?? '';
  });

  if (src.testimonials) {
    const picked = [...src.testimonials].sort(() => Math.random() - 0.5).slice(0, 3);
    picked.forEach((t, i) => {
      result[`TESTIMONIAL_${i+1}`]        = t.text   ?? '';
      result[`TESTIMONIAL_${i+1}_AUTHOR`] = t.author ?? '';
    });
  }

  return result;
}

module.exports = { getContent };
