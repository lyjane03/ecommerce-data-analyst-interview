// Day 9: New Product Launch & Go-to-Market Strategy
AppContent.days.push({
  day: 9,
  theme: 'New Product Launch & Go-to-Market Strategy',
  themeZh: '新品上市与GTM策略',
  minutes: 240,

  listening: {
    title: 'Launching a New Beverage Variant — Go-to-Market Strategy',
    text: [
      'Launching a new product is one of the most complex and high-stakes activities in brand management — the success window is narrow and the cost of failure is high.',
      'Our go-to-market strategy for the new Mizone wellness variant was built around four pillars: distribution readiness, consumer awareness, trial generation, and repeat purchase.',
      'Distribution readiness came first — we set a target of 40,000 points of distribution within the first three months, with priority given to modern trade and health-focused specialty channels.',
      'For consumer awareness, we led with a Douyin-first approach: a teaser campaign featuring fitness micro-KOLs that launched two weeks before the product hit shelves.',
      'Trial generation was driven through in-store sampling events at 200 key outlets, a digital coupon program in partnership with Meituan, and a first-purchase gift-with-purchase offer.',
      'Repeat purchase is the hardest challenge for any new product — our retention strategy included a WeChat loyalty program, personalized reorder reminders, and a subscription model piloted on JD.com.',
      'In the first four months, the new variant achieved 85% of its distribution target, a 22% trial rate among target consumers, and a 38% repeat purchase rate — beating our launch benchmarks.',
      'The most critical lesson: a great product with poor in-store execution is invisible. Distribution and shelving are the non-negotiable foundations of any successful launch.'
    ],
    textZh: [
      '推出新产品是品牌管理中最复杂、风险最高的活动之一——成功的窗口期很窄，失败的代价很高。',
      '我们针对脉动新健康变体的上市战略建立在四大支柱上：铺货准备、消费者认知、试用转化和复购。',
      '铺货准备是第一位的——我们设定了前三个月内进入4万个分销网点的目标，优先考虑现代渠道和健康专注的特殊渠道。',
      '在消费者认知方面，我们采用抖音优先策略：在产品上架前两周，通过健身微型KOL发起预热活动。',
      '试用转化通过以下方式推动：在200个重点网点举办店内试饮活动、与美团合作的数字优惠券计划，以及首次购买赠品活动。',
      '复购是任何新产品面临的最大挑战——我们的留存策略包括微信忠诚度计划、个性化复购提醒，以及在京东试点的订阅模式。',
      '前四个月，新变体实现了铺货目标的85%、目标消费者22%的试用率和38%的复购率——超越了我们的上市基准。',
      '最关键的经验：优质产品搭配差劲的终端执行等于隐形。铺货和陈列是任何成功上市的不可谈判的基础。'
    ],
    keywords: ['go-to-market', 'points of distribution', 'trial generation', 'repeat purchase', 'sampling', 'digital coupon', 'retention', 'launch benchmark'],
    comprehension: [
      {
        question: 'What were the four pillars of the go-to-market strategy?',
        options: [
          'Product, price, place, promotion',
          'Distribution readiness, consumer awareness, trial generation, and repeat purchase',
          'R&D, manufacturing, logistics, and retail',
          'Awareness, consideration, intent, and purchase'
        ],
        answer: 1,
        explanationZh: '上市战略的四大支柱是：铺货准备、消费者认知、试用转化和复购。'
      },
      {
        question: 'How did the brand generate trial among target consumers?',
        options: [
          'Through celebrity TV commercials only',
          'In-store sampling, digital coupons via Meituan, and a first-purchase gift-with-purchase offer',
          'Price reductions at all retail channels',
          'Free product distribution at public events'
        ],
        answer: 1,
        explanationZh: '试用转化通过三种方式推动：店内试饮、美团数字优惠券，以及首次购买赠品活动。'
      },
      {
        question: 'What repeat purchase rate did the new variant achieve in the first four months?',
        options: ['22%', '38%', '50%', '85%'],
        answer: 1,
        explanationZh: '新变体在前四个月实现了38%的复购率（22%是试用率，85%是铺货目标达成率）。'
      }
    ]
  },

  writing: {
    title: 'New Product Launch Announcement Email to the Sales Team',
    scenario: 'Mizone is launching a new variant — "Mizone Focus+" — targeting office workers who need mental clarity and hydration during long work hours. It launches nationally on July 1st. Write an internal email to your sales team (50 people) to brief them on the launch, arm them with key talking points, and outline their distribution targets for Q3.',
    template: {
      subject: 'LAUNCH BRIEF: Mizone Focus+ Goes Live July 1st — Your Q3 Distribution Targets Inside',
      structure: [
        {
          label: 'Opening & Excitement',
          text: 'Hi Sales Team,\n\nExciting news — Mizone Focus+ launches nationally on July 1st, and your work in the field will be the single biggest driver of its success. Here\'s everything you need to hit the ground running.',
          textZh: '销售团队好，\n\n振奋人心的消息——脉动Focus+将于7月1日全国上市，你们在一线的工作将是其成功最大的驱动力。以下是你们需要的一切，助你们立刻起跑。'
        },
        {
          label: 'Product Snapshot',
          text: 'What it is: Mizone Focus+ is a 500ml functional hydration drink with added B-vitamins and electrolytes, designed for urban professionals who need sustained focus during the workday. Key claim: "Hydrate your body. Sharpen your mind."',
          textZh: '产品简介：脉动Focus+是一款500ml功能性补水饮料，添加了B族维生素和电解质，专为需要在工作日保持持续专注的城市职场人士设计。核心主张："补水滋养身体，锐化专注思维。"'
        },
        {
          label: 'Your Key Selling Points (For Buyer Conversations)',
          text: '1. First-mover in "workday wellness" beverage category in China.\n2. Backed by Danone\'s science and nutrition credibility.\n3. Strong Q3 marketing investment: RMB 15M in digital, OOH, and KOL support.\n4. Trial-driving in-store support: sampling kit and POS materials included.',
          textZh: '1. 中国"工作日健康饮品"品类的先行者。\n2. 背靠达能的科学和营养公信力。\n3. 强劲的Q3营销投入：1500万元用于数字、户外和KOL支持。\n4. 促进试用的店内支持：含试饮套件和POS物料。'
        },
        {
          label: 'Q3 Distribution Targets',
          text: 'National target: 40,000 points of distribution by September 30th. Tier-1 cities: 15,000 PODs. Tier-2 cities: 18,000 PODs. Health & fitness channels: 7,000 PODs. Targets are broken down by region in the attached spreadsheet.',
          textZh: '全国目标：9月30日前进入4万个分销网点。一线城市：1.5万个。二线城市：1.8万个。健身健康渠道：7000个。各区域具体目标见附件表格。'
        },
        {
          label: 'Launch Support Available to You',
          text: 'Available now: product samples (request via [link]), sales deck (attached), POS/sampling kit (dispatch from [Date]). Please contact [Name] for any support needs.',
          textZh: '现已提供：产品样品（通过[链接]申请）、销售演示文稿（附件）、POS/试饮套件（[日期]起发货）。如有任何支持需求请联系[姓名]。'
        },
        {
          label: 'Call to Action',
          text: 'Let\'s make this launch a success. Please confirm you have received your regional targets by [Date].\n\nGo get them!\n\nXueyan Xu\nBrand Manager, Mizone',
          textZh: '让我们共同让这次上市取得成功。请在[日期]前确认已收到您的区域目标。\n\n冲吧！\n\n徐雪艳\n脉动品牌经理'
        }
      ]
    },
    task: 'Rewrite this disorganized launch email:\n\n"Hi. We have a new product. It is called Focus+. Please try to sell it a lot. There are targets but I will send later. It comes out July 1. Good luck."',
    reference: 'Subject: LAUNCH BRIEF: Mizone Focus+ Goes Live July 1st — Your Q3 Distribution Targets Inside\n\nHi Sales Team,\n\nMizone Focus+ launches nationally on July 1st — and the energy and execution you bring to the field over the next 90 days will define this product\'s trajectory. Here\'s your complete launch brief.\n\nProduct: Mizone Focus+ (500ml) — functional hydration with B-vitamins and electrolytes for sustained workday focus. Key message: "Hydrate your body. Sharpen your mind."\n\nYour Top 4 Selling Points with Buyers:\n1. First-mover in the "workday wellness" beverage segment in China.\n2. Danone science and nutrition credentials — strong buy-in from health-oriented retailers.\n3. RMB 15M Q3 marketing investment across digital, OOH, and KOL — you can promise buyer support.\n4. Full in-store trial support: sampling kits and POS materials included at no cost to the retailer.\n\nQ3 National Distribution Target: 40,000 PODs by September 30th.\n(Regional breakdown attached. Please review and flag any concerns by [Date].)\n\nSupport Available: Samples, sales deck, and POS kits will be dispatched from [Date]. Contact [Name] for any field needs.\n\nPlease confirm receipt of your regional targets by [Date].\n\nLet\'s make Focus+ a brand-building launch for Mizone.\n\nXueyan Xu | Brand Manager, Mizone | Danone China',
    referenceZh: '主题：上市简报：脉动Focus+ 7月1日正式上线——附Q3铺货目标\n\n销售团队好，\n\n脉动Focus+将于7月1日全国上市——接下来90天你们在一线投入的精力和执行力，将决定这款产品的走向。以下是完整的上市简报。\n\n产品：脉动Focus+（500ml）——含B族维生素和电解质的功能性补水饮料，助力工作日持续专注。核心信息："补水滋养身体，锐化专注思维。"\n\n与采购方沟通的四大卖点：\n1. 中国"工作日健康饮品"细分领域先行者。\n2. 达能科学与营养背书——深受健康导向零售商认可。\n3. Q3营销投入1500万元（数字、户外、KOL）——可向采购方承诺营销支持。\n4. 完整的店内试用支持：含试饮套件和POS物料，对零售商免费。\n\nQ3全国铺货目标：9月30日前4万个分销网点。\n（区域明细见附件，请于[日期]前审阅并提出问题。）\n\n支持资源：样品、销售演示和POS套件将于[日期]起发货。现场需求请联系[姓名]。\n\n请于[日期]前确认已收到您的区域目标。\n\n让我们让Focus+成为脉动品牌建设的标志性上市！\n\n徐雪艳 | 脉动品牌经理 | 达能中国'
  },

  speaking: {
    title: 'How Would You Plan a New Product Launch for Mizone?',
    outline: [
      { point: '1. Start With the Consumer (0:00–0:20)', note: 'Who is the target consumer? What unmet need does this product solve? What\'s the brand promise?', noteZh: '目标消费者是谁？这款产品解决了什么未被满足的需求？品牌承诺是什么？' },
      { point: '2. Pre-Launch — Readiness Phase (0:20–0:45)', note: 'Distribution build, sales team training, agency brief, pre-launch teaser campaign.', noteZh: '铺货建设、销售团队培训、代理商简报、上市前预热活动。' },
      { point: '3. Launch Phase — Awareness & Trial (0:45–1:15)', note: 'Awareness campaign (KOLs, digital, OOH), trial mechanics (sampling, coupon, GWP), distribution milestone check.', noteZh: '认知活动（KOL、数字、户外），试用机制（试饮、优惠券、买赠），铺货里程碑检查。' },
      { point: '4. Post-Launch — Sustain & Optimize (1:15–1:40)', note: 'Monitor trial-to-repeat conversion, optimize media spend, retailer performance review, agile creative refresh.', noteZh: '监控试用到复购的转化率，优化媒体投入，零售商表现复盘，敏捷创意更新。' },
      { point: '5. Success Metrics (1:40–2:00)', note: 'Distribution target %, trial rate, repeat purchase rate, brand awareness lift, volume vs. forecast.', noteZh: '铺货目标达成率、试用率、复购率、品牌知名度提升、实际销量与预测对比。' }
    ],
    keySentences: [
      'Any successful product launch starts not with the product, but with a precise understanding of the unmet consumer need it addresses.',
      'I would structure the launch into three phases: pre-launch readiness, launch activation, and post-launch sustain — each with distinct objectives and KPIs.',
      'Distribution readiness is the non-negotiable foundation — the most brilliant campaign is wasted if consumers cannot find the product when they want to buy it.',
      'To drive trial, I would invest in a combination of physical sampling at high-traffic touchpoints and digital incentives — coupons, first-purchase rebates, and influencer exclusive codes.',
      'I would measure launch success against five KPIs: distribution target achievement, consumer awareness lift, trial rate, repeat purchase rate, and volume vs. plan.'
    ],
    keySentencesZh: [
      '任何成功的产品上市都不是从产品本身出发，而是从精准理解其解决的未被满足的消费者需求出发。',
      '我会将上市分为三个阶段：上市前准备、上市激活和上市后持续——每个阶段都有明确的目标和KPI。',
      '铺货准备是不可谈判的基础——如果消费者在想买的时候找不到产品，再精彩的营销活动也是浪费。',
      '为推动试用，我会将高客流触点的线下试饮与数字激励相结合——优惠券、首购返现和KOL专属码。',
      '我会用五个KPI衡量上市成功：铺货目标达成率、消费者认知提升、试用率、复购率，以及实际销量对比计划。'
    ],
    selfEvalCriteria: [
      { label: 'Consumer Centricity', desc: 'Did you start with the consumer need, not the product itself?' },
      { label: 'Phase Structure', desc: 'Did you clearly articulate pre-launch, launch, and post-launch phases?' },
      { label: 'Trial Strategy', desc: 'Did you propose specific, creative trial-generation mechanics?' },
      { label: 'Measurement', desc: 'Did you name 3+ specific launch KPIs?' },
      { label: 'Risk Awareness', desc: 'Did you acknowledge any launch risks and how you would mitigate them?' }
    ]
  },

  quiz: {
    questions: [
      {
        type: 'mcq',
        question: 'In a product launch context, "points of distribution" (PODs) refers to:',
        options: [
          'The number of marketing touchpoints in a campaign',
          'The total number of retail outlets where the product is available for purchase',
          'The number of distribution centers in the supply chain',
          'The geographic coverage of the sales team'
        ],
        answer: 1,
        explanation: 'PODs (Points of Distribution) measure how widely available a product is — how many stores carry it. Higher PODs = broader availability = more purchase opportunities.'
      },
      {
        type: 'mcq',
        question: 'What does "trial rate" measure in a product launch?',
        options: [
          'The number of times a consumer samples the product at an in-store event',
          'The percentage of the target consumer population who has purchased the product at least once',
          'The average number of units purchased per transaction',
          'The number of consumer complaints received after launch'
        ],
        answer: 1,
        explanation: '"Trial rate" = % of target consumers who have tried the product at least once. It measures how effectively the launch is converting awareness into first purchase.'
      },
      {
        type: 'fillblank',
        question: 'The percentage of consumers who purchase a product a second time after their first purchase is called the ________ purchase rate.',
        answer: 'repeat',
        explanation: '"Repeat purchase rate" is the critical indicator of product satisfaction and long-term commercial viability — it shows whether trial converts to habit.'
      },
      {
        type: 'mcq',
        question: 'A "go-to-market strategy" (GTM) for a new product primarily covers:',
        options: [
          'The product\'s manufacturing and quality assurance plan',
          'How a company will bring a new product to market — covering distribution, pricing, promotion, and launch sequencing',
          'The company\'s international expansion plan',
          'The financial projection model for the new product'
        ],
        answer: 1,
        explanation: 'A GTM strategy defines HOW you take a new product to market: which channels, which consumers, which messages, and in what sequence — connecting product readiness to commercial launch.'
      },
      {
        type: 'correction',
        question: 'Correct this sentence: "The new product will achieve 40,000 point of distributions in three month."',
        corrected: 'The new product will achieve 40,000 points of distribution in three months.',
        answer: 'The new product will achieve 40,000 points of distribution in three months.',
        explanation: 'Two errors: "40,000 point of distributions" → "40,000 points of distribution" (correct: "points" is plural, "distribution" remains singular); "three month" → "three months" (plural).'
      }
    ]
  }
});
