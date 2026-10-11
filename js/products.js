/**
 * SKYnROOT Product Catalog & Configurable Data
 * Natural skincare meets modern luxury
 * Brand: SKYnROOT SKINCARE
 * Currency: INR (₹)
 */

export const PRODUCTS = [
  {
    id: 'charcoal-face-wash',
    name: 'Charcoal Face Wash',
    brand: 'SKYnROOT',
    category: 'Face Wash',
    categorySlug: 'facewash',
    price: 699,
    size: '150 ml / 5.1 fl oz',
    badge: 'Purifying',
    tagline: 'Deep pore detox with bamboo carbon & wild botanicals',
    image: 'assets/images/charcoal-facewash.png',
    rating: 4.9,
    reviewsCount: 128,
    description: 'A silky clarifying gel cleanser infused with micro-milled activated bamboo charcoal and calming organic botanicals. Gently extracts impurities, environmental pollutants, and excess sebum without disturbing the delicate lipid barrier.',
    ingredients: [
      'Activated Bamboo Charcoal (Carbon)',
      'Organic Aloe Barbadensis Leaf Juice',
      'Camellia Sinensis (Green Tea) Leaf Extract',
      'Vegetable Glycerin',
      'Decyl Glucoside',
      'Pelargonium Graveolens (Geranium) Essential Oil'
    ],
    ritual: 'Morning & Evening. Dispense 1-2 pumps onto damp palms. Massage gently over face and neck in circular motions for 60 seconds. Rinse thoroughly with lukewarm water.',
    packaging: '100% Recyclable deep matte forest bottle with brushed champagne gold dispenser.',
    keyBenefit: 'Removes deep impurities while preserving vital barrier hydration.'
  },
  {
    id: 'neem-extract-face-wash',
    name: 'Neem Extract Face Wash',
    brand: 'SKYnROOT',
    category: 'Face Wash',
    categorySlug: 'facewash',
    price: 649,
    size: '150 ml / 5.1 fl oz',
    badge: 'Clarifying',
    tagline: 'Bio-purifying herbal gel for balanced, calm complexion',
    image: 'assets/images/neem-facewash.png',
    rating: 4.8,
    reviewsCount: 94,
    description: 'Harnesses wild-harvested Indian neem leaf extracts celebrated for centuries in Ayurvedic apothecary. Clarifies congested skin, soothes visible redness, and delivers bio-balancing botanicals for a refreshed, tranquil glow.',
    ingredients: [
      'Azadirachta Indica (Neem) Leaf Water',
      'Centella Asiatica (Gotu Kola) Extract',
      'Organic Aloe Barbadensis Leaf Juice',
      'Coco-Glucoside',
      'Rose Flower Distillate',
      'Tea Tree Leaf Hydrosol'
    ],
    ritual: 'Dispense a dime-sized amount into wet hands, work into a soft botanical lather, and gently massage across damp skin. Rinse cleanly.',
    packaging: 'Frosted sage green glass bottle with gold pump.',
    keyBenefit: 'Calms redness, balances blemish-prone skin naturally.'
  },
  {
    id: 'aloe-vera-face-wash',
    name: 'Aloe Vera Face Wash',
    brand: 'SKYnROOT',
    category: 'Face Wash',
    categorySlug: 'facewash',
    price: 599,
    size: '150 ml / 5.1 fl oz',
    badge: 'Hydrating',
    tagline: 'Gentle moisture-replenishing wash for sensitive skin',
    image: 'assets/images/aloe-facewash.png',
    rating: 4.9,
    reviewsCount: 156,
    description: 'An ultra-cushioning gel wash crafted with cold-pressed organic aloe vera inner-leaf fillet and soothing chamomile hydrosol. Melts away daily impurities while drenching parched skin in biocompatible hydration.',
    ingredients: [
      'Organic Aloe Barbadensis Leaf Inner Juice (78%)',
      'Matricaria Chamomilla (Chamomile) Floral Water',
      'Botanical Hyaluronic Acid (Sodium Hyaluronate)',
      'Cucumber Fruit Hydrosol',
      'Propanediol (Plant Derived)'
    ],
    ritual: 'Use morning and evening as the first step of your ritual. Massage onto wet skin and rinse with cool or lukewarm water.',
    packaging: 'Recycled translucent glass bottle with pump dispenser.',
    keyBenefit: 'Cushions and replenishes moisture during cleansing.'
  },
  {
    id: 'watermelon-sunscreen',
    name: 'Watermelon Sunscreen',
    brand: 'SKYnROOT',
    category: 'Sunscreen',
    categorySlug: 'sunscreen',
    price: 799,
    size: '60 ml / 2.0 fl oz',
    badge: 'Broad Spectrum',
    tagline: 'Weightless invisible daily shield with lycopene surge',
    image: 'assets/images/watermelon-sunscreen.png',
    rating: 5.0,
    reviewsCount: 210,
    description: 'An invisible, featherlight mineral sunscreen enriched with antioxidant-rich cold-pressed watermelon seed oil and natural lycopene. Absorbs instantly with a dewy, non-greasy satin finish and zero white cast.',
    ingredients: [
      'Citrullus Lanatus (Watermelon) Seed Extract & Fruit Water',
      'Non-Nano Zinc Oxide (Clean Mineral Dispersion)',
      'Squalane (Olive Derived)',
      'Niacinamide (Vitamin B3)',
      'Tocopherol (Sunflower Vitamin E)'
    ],
    ritual: 'Shake gently. Apply generously as the final step in your morning ritual, at least 15 minutes before sun exposure. Reapply every 2 hours during outdoor activity.',
    packaging: 'Matte ivory tube with brushed gold precision pump.',
    keyBenefit: 'Invisible daily mineral protection with intense fruit hydration.'
  },
  {
    id: 'blackberry-sunscreen',
    name: 'Blackberry Sunscreen',
    brand: 'SKYnROOT',
    category: 'Sunscreen',
    categorySlug: 'sunscreen',
    price: 849,
    size: '60 ml / 2.0 fl oz',
    badge: 'Antioxidant Shield',
    tagline: 'Polyphenol-packed protective veil against UV & environmental stressors',
    image: 'assets/images/blackberry-sunscreen.png',
    rating: 4.9,
    reviewsCount: 142,
    description: 'Infused with cold-pressed wild blackberry seed extract rich in anthocyanins, vitamin C, and ellagic acid. Shields the skin barrier while reversing oxidative dullness for a radiant, protected canvas.',
    ingredients: [
      'Rubus Fruticosus (Wild Blackberry) Seed Oil & Extract',
      'Non-Nano Mineral Zinc Oxide',
      'Astaxanthin (Microalgae Botanical Shield)',
      'Organic Jojoba Seed Oil',
      'Lecithin (Sunflower Derived)'
    ],
    ritual: 'Warm 2 pumps between fingertips and smooth evenly across face, neck, and décolleté every morning. Flawless beneath makeup or worn bare.',
    packaging: 'Deep obsidian plum frosted glass container with gold cap.',
    keyBenefit: 'Defends against photo-damage and pollution with wild berry polyphenols.'
  },
  {
    id: 'signature-serum',
    name: 'Signature Serum',
    brand: 'SKYnROOT',
    category: 'Serum',
    categorySlug: 'serum',
    price: 1499,
    size: '30 ml / 1.0 fl oz',
    badge: 'Award Winner',
    tagline: 'Our flagship concentrate of concentrated botanical actives & peptides',
    image: 'assets/images/signature-serum.png',
    rating: 5.0,
    reviewsCount: 384,
    description: 'The pinnacle of SKYnROOT botanical alchemy. A concentrated golden elixir blending multi-molecular botanical hyaluronic acid, fermented marine minerals, and cold-pressed botanical essences. Restores firmness, deep elasticity, and a luminous inner radiance.',
    ingredients: [
      'Fermented Botanical Polysaccharides',
      'Tri-Molecular Botanical Hyaluronic Acid',
      'Sea Kelp Bioferment',
      'Rosa Canina (Rosehip) Seed Extract',
      'Frankincense Resin Essential Oil',
      'Coenzyme Q10 (Plant Derived)'
    ],
    ritual: 'Morning & evening. Dispense 3 to 4 drops into palm. Press into freshly cleansed and toned skin using upward sweeping motions. Allow 60 seconds to absorb before moisturizing.',
    packaging: 'Heavy frosted luxury glass bottle with brushed champagne gold dropper.',
    keyBenefit: 'Deep cellular hydration and visibly energized, firmer skin.'
  },
  {
    id: 'aloe-vera-moisturizer',
    name: 'Aloe Vera Moisturizer',
    brand: 'SKYnROOT',
    category: 'Moisturizer',
    categorySlug: 'moisturizer',
    price: 899,
    size: '50 ml / 1.7 oz',
    badge: 'Hydra-Plump',
    tagline: 'Velvety water-cream for enduring barrier resilience',
    image: 'assets/images/aloe-moisturizer.png',
    rating: 4.8,
    reviewsCount: 167,
    description: 'A whipped cloud cream combining mountain-harvested aloe vera juice with plant ceramides and shea butter. Melts seamlessly upon skin contact to seal in moisture for up to 72 hours without clogging pores.',
    ingredients: [
      'Aloe Barbadensis Leaf Juice',
      'Ceramide NP (Plant Derived)',
      'Butyrospermum Parkii (Shea) Butter',
      'Simmondsia Chinensis (Jojoba) Oil',
      'Sodium Hyaluronate',
      'Bisabolol'
    ],
    ritual: 'Gently scoop a pearl-sized amount with the included gold spatula. Warm between fingertips and press into face and neck after serum.',
    packaging: 'Heavy frosted crystal glass jar with brushed champagne gold lid.',
    keyBenefit: 'Long-lasting 72h moisture seal with weightless breathability.'
  },
  {
    id: 'neem-extract-moisturizer',
    name: 'Neem Extract Moisturizer',
    brand: 'SKYnROOT',
    category: 'Moisturizer',
    categorySlug: 'moisturizer',
    price: 949,
    size: '50 ml / 1.7 oz',
    badge: 'Balancing Veil',
    tagline: 'Weightless balancing emulsion for clear, refined tone',
    image: 'assets/images/neem-moisturizer.png',
    rating: 4.9,
    reviewsCount: 118,
    description: 'A light, fast-absorbing botanical emulsion crafted with organic neem extract, willow bark, and sage leaf hydrosol. Balances sebum production, refines pores, and provides non-greasy hydration all day long.',
    ingredients: [
      'Azadirachta Indica (Neem) Leaf Extract',
      'Salix Alba (Willow Bark) Extract',
      'Salvia Officinalis (Sage) Water',
      'Squalane (Sugar Cane Derived)',
      'Phospholipids'
    ],
    ritual: 'Smooth 1-2 pumps over cleansed and treated skin morning and night. Excellent calming base for daily wear.',
    packaging: 'Frosted sage green glass jar with gold cap.',
    keyBenefit: 'Refines texture and regulates oily or combination skin.'
  },
  {
    id: 'daily-toner',
    name: 'Daily Toner',
    brand: 'SKYnROOT',
    category: 'Toner',
    categorySlug: 'toner',
    price: 699,
    size: '200 ml / 6.7 fl oz',
    badge: 'Harmonizing',
    tagline: 'pH-balancing botanical essence with floral hydrosols',
    image: 'assets/images/daily-toner.png',
    rating: 4.9,
    reviewsCount: 204,
    description: 'An essential preparatory step after cleansing. Blends damask rose hydrosol, organic witch hazel, and soothing centella asiatica to harmonize skin pH, tighten pores, and prime skin for maximum serum absorption.',
    ingredients: [
      'Rosa Damascena (Rose) Flower Distillate',
      'Hamamelis Virginiana (Witch Hazel) Distillate',
      'Centella Asiatica Leaf Extract',
      'Glycerin',
      'Panthenol (Pro-Vitamin B5)',
      'Sodium PCA'
    ],
    ritual: 'Following cleansing, pour a few drops into the palms and gently pat onto face, neck, and décolleté until absorbed, or mist with a cotton pad.',
    packaging: 'Tall cylindrical frosted glass bottle with gold cap.',
    keyBenefit: 'Restores skin pH and triples subsequent serum absorption.'
  }
];

export const INGREDIENTS_DATA = [
  {
    name: 'Activated Bamboo Charcoal',
    botanical: 'Phyllostachys Edulis Carbon',
    role: 'Pore Clarifier & Environmental Detox',
    description: 'Microporous natural carbon produced via sustainable steam activation. Possesses an extraordinary magnetic ability to bind to heavy metals, pollution particles, and deep sebum without drying skin.',
    origin: 'Sustainably harvested bamboo groves',
    color: '#343838'
  },
  {
    name: 'Wild Neem Extract',
    botanical: 'Azadirachta Indica',
    role: 'Bio-Balancing & Blemish Calming',
    description: 'Revered in ancient Ayurvedic traditions as the sacred miracle tree. Rich in nimbin and nimbidol, providing potent soothing action to balance breakouts, soothe redness, and calm irritated skin.',
    origin: 'Ethically wild-harvested Indian foothills',
    color: '#4B6B48'
  },
  {
    name: 'Organic Aloe Vera',
    botanical: 'Aloe Barbadensis Miller',
    role: 'Deep Hydra-Cushion & Barrier Repair',
    description: 'Harvested from certified organic inner-leaf fillets. Contains 75+ active phytonutrients, including acemannan polysaccharides, vitamins A, C, and E, delivering immediate moisture relief.',
    origin: 'Cold-pressed organic plantations',
    color: '#7D9D75'
  },
  {
    name: 'Cold-Pressed Watermelon',
    botanical: 'Citrullus Lanatus',
    role: 'Lycopene Shield & Vital Moisture Surge',
    description: 'Extracted from nutrient-dense seeds and fruit pulp. Naturally dense in lycopene, citrulline, and essential fatty acids that neutralize free radicals and lock in dewiness without heaviness.',
    origin: 'Upcycled Mediterranean harvest',
    color: '#D47E73'
  },
  {
    name: 'Wild Blackberry Extract',
    botanical: 'Rubus Fruticosus',
    role: 'Polyphenol & Vitamin C Antioxidant Shield',
    description: 'A northern wild berry powerhouse rich in anthocyanins and ellagic acid. Shields skin cells against environmental photo-oxidative stress and promotes visible elasticity.',
    origin: 'Hand-picked sub-arctic wildlands',
    color: '#523A50'
  }
];

export const RITUAL_STEPS = [
  {
    step: '01',
    phase: 'PURIFY',
    title: 'Cleanse with Botanical Care',
    time: 'AM & PM',
    description: 'Dissolve daily impurities, urban smog, and sebum while safeguarding the microbiome with our cold-pressed face washes.',
    productId: 'charcoal-face-wash',
    productName: 'Charcoal Face Wash',
    duration: '60 Seconds'
  },
  {
    step: '02',
    phase: 'BALANCE',
    title: 'Harmonize Skin pH',
    time: 'AM & PM',
    description: 'Reset skin back to its ideal 5.5 pH with our botanical toner. Infuses floral hydrosols that prepare skin cells for active delivery.',
    productId: 'daily-toner',
    productName: 'Daily Toner',
    duration: '30 Seconds'
  },
  {
    step: '03',
    phase: 'NOURISH',
    title: 'The Concentrated Elixir',
    time: 'AM & PM',
    description: 'Deliver tri-molecular hydration and bio-ferments directly to the skin with 3 golden drops of our Signature Serum.',
    productId: 'signature-serum',
    productName: 'Signature Serum',
    duration: '60 Seconds'
  },
  {
    step: '04',
    phase: 'SEAL',
    title: 'Moisture Barrier Lock',
    time: 'AM & PM',
    description: 'Envelop skin in a weightless ceramide and aloe cloud cream to lock in vital actives and provide lasting 72-hour moisture cushion.',
    productId: 'aloe-vera-moisturizer',
    productName: 'Aloe Vera Moisturizer',
    duration: '45 Seconds'
  },
  {
    step: '05',
    phase: 'SHIELD',
    title: 'All-Day Mineral Defense',
    time: 'AM (Every Morning)',
    description: 'Complete the morning ritual with an invisible mineral shield against solar radiation, blue light, and oxidative pollution.',
    productId: 'watermelon-sunscreen',
    productName: 'Watermelon Sunscreen',
    duration: 'Daily Shield'
  }
];
