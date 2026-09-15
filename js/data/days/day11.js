// Day 11: Competitive Analysis & Market Intelligence
AppContent.days.push({
  day: 11,
  theme: 'Competitive Analysis & Market Intelligence',
  themeZh: '竞争分析与市场情报',
  minutes: 240,

  listening: {
    title: 'Staying Ahead of the Competition — Market Intelligence in Action',
    text: [
      'In a fast-moving market like functional beverages, the competitive landscape can shift dramatically within a single quarter — a brand that ignores its competitors does so at its own peril.',
      'We built a competitive intelligence system that monitored three layers: market structure data from Nielsen, social listening for emerging trends and competitor brand sentiment, and field intelligence from our sales team.',
      'One of our most valuable intelligence sources was actually our own sales representatives — they saw new product placements, price changes, and promotional activities before any syndicated data captured it.',
      'On a quarterly basis, we conducted a full competitor brand audit: reviewing their advertising campaigns, social content strategy, media spend estimates, and distribution footprint.',
      'A key competitive insight we uncovered was that our primary competitor was over-investing in the 16–22 age group while underinvesting in 26–35 professional consumers — precisely where our data showed the highest growth potential.',
      'We also used share of voice analysis to track our brand\'s share of online conversation relative to competitors — a strong leading indicator of future market share movement.',
      'Our competitive strategy was not to copy the market leader, but to find the spaces where they were not playing and win there decisively.',
      'The output of our quarterly competitive review was a one-page competitive battlecard that every sales rep carried — translated competitor intelligence into actionable selling ammunition.'
    ],
    textZh: [
      '在功能性饮料这样快速变化的市场中，竞争格局可能在一个季度内发生剧变——无视竞争对手的品牌是在拿自己的前途冒险。',
      '我们建立了一个监测三个层面的竞争情报系统：来自尼尔森的市场结构数据、用于追踪新兴趋势和竞争对手品牌情绪的社交聆听，以及来自销售团队的一线情报。',
      '我们最有价值的情报来源之一实际上是我们自己的销售代表——他们在任何联合数据捕捉到之前，就能看到新产品陈列、价格变化和促销活动。',
      '每季度，我们进行一次全面的竞争对手品牌审计：审查他们的广告活动、社交内容策略、媒体支出估算和分销布局。',
      '我们发现的一个关键竞争洞察是，我们的主要竞争对手在16-22岁年龄段过度投入，而在26-35岁职场消费者上投入不足——而我们的数据显示，这恰恰是增长潜力最高的地方。',
      '我们还使用声量份额分析来追踪我们品牌在网络对话中相对于竞争对手的占比——这是未来市场份额变动的强有力先行指标。',
      '我们的竞争策略不是复制市场领导者，而是找到他们不参与的空间并在那里决定性地获胜。',
      '我们季度竞争对手审查的成果是一份每个销售代表都随身携带的单页竞争情报卡——将竞争情报转化为可操作的销售弹药。'
    ],
    keywords: ['competitive intelligence', 'market structure', 'social listening', 'brand audit', 'share of voice', 'competitive battlecard', 'syndicated data', 'differentiation'],
    comprehension: [
      {
        question: 'What three layers made up the competitive intelligence system?',
        options: [
          'Marketing, sales, and finance data',
          'Nielsen market data, social listening, and field intelligence from the sales team',
          'Consumer surveys, retail audits, and brand tracking',
          'TV monitoring, digital analytics, and competitor interviews'
        ],
        answer: 1,
        explanationZh: '竞争情报系统的三个层面是：来自尼尔森的市场结构数据、社交聆听，以及来自销售团队的一线情报。'
      },
      {
        question: 'What competitive opportunity was identified regarding the primary competitor?',
        options: [
          'The competitor was over-investing in premium channels',
          'The competitor was over-investing in the 16–22 age group while underinvesting in 26–35 professionals',
          'The competitor was reducing prices in key markets',
          'The competitor was launching a new product variant'
        ],
        answer: 1,
        explanationZh: '发现的竞争机会是：主要竞争对手在16-22岁群体过度投入，而在26-35岁职场消费者上投入不足——后者恰恰是增长潜力最高的群体。'
      },
      {
        question: 'What was the purpose of the competitive battlecard?',
        options: [
          'To share confidential competitor data with media',
          'To give every sales rep translated competitive intelligence to use as actionable selling ammunition',
          'To brief the creative agency on competitive advertising',
          'To report competitive findings to the board of directors'
        ],
        answer: 1,
        explanationZh: '竞争情报卡的目的是为每个销售代表提供快速参考的竞争情报，作为可操作的销售弹药用于采购方谈话。'
      }
    ]
  },

  writing: {
    title: 'Quarterly Competitive Landscape Summary Email',
    scenario: 'You have completed Mizone\'s Q2 competitive landscape review. Key findings: (1) Competitor A launched a new sugar-free variant targeting Gen Z; (2) Competitor B increased Douyin ad spend by an estimated 40%; (3) Mizone\'s share of voice declined 3 points. Write a summary email to your marketing team with findings and recommended responses.',
    template: {
      subject: 'Q2 Competitive Intelligence Review — 3 Key Findings & Recommended Actions',
      structure: [
        {
          label: 'Opening & Purpose',
          text: 'Hi team,\n\nPlease find below the Q2 Competitive Landscape Review for Mizone. This quarter\'s analysis highlights three developments that require our strategic attention.',
          textZh: '团队好，\n\n以下是脉动第二季度竞争格局审查报告。本季度分析重点指出了三个需要我们战略关注的动态。'
        },
        {
          label: 'Finding 1: New Competitive Entry',
          text: 'Finding: Competitor A launched a sugar-free functional beverage variant in May, directly targeting Gen Z (16–24). Initial Nielsen data suggests strong early trial in CVS channels.\nImplication: Our Gen Z positioning may face intensified competitive pressure in H2.',
          textZh: '发现：竞争对手A于5月推出无糖功能性饮料变体，直接针对Z世代（16-24岁）。尼尔森初步数据显示，便利店渠道的早期试用情况强劲。\n影响：我们的Z世代定位在下半年可能面临更激烈的竞争压力。'
        },
        {
          label: 'Finding 2: Competitor B Digital Surge',
          text: 'Finding: Competitor B increased estimated Douyin ad spend by ~40% in Q2, focusing on fitness and productivity content formats.\nImplication: Our share of voice on Douyin has declined. We need to respond with a content quality and frequency upgrade.',
          textZh: '发现：竞争对手B在第二季度将估计抖音广告支出增加约40%，专注于健身和效率内容形式。\n影响：我们在抖音上的声量份额有所下滑，需要通过内容质量和频率升级来应对。'
        },
        {
          label: 'Finding 3: Mizone Share of Voice Decline',
          text: 'Finding: Mizone\'s total digital share of voice declined 3 percentage points this quarter (from 31% to 28%).\nRecommended Action: Increase micro-KOL content frequency and activate our WeChat loyalty community for user-generated content in Q3.',
          textZh: '发现：脉动本季度数字声量份额总体下降3个百分点（从31%降至28%）。\n建议行动：在第三季度增加微型KOL内容频率，并激活微信忠诚度社区以产生用户生成内容。'
        },
        {
          label: 'Overall Strategic Recommendation',
          text: 'I recommend we accelerate our Gen Z digital strategy and strengthen Mizone\'s differentiation through the "workday wellness" positioning — a space neither Competitor A nor B has yet claimed.',
          textZh: '我建议我们加快Z世代数字战略，并通过"工作日健康"定位强化脉动的差异化——这是竞争对手A和B都尚未占据的领域。'
        },
        {
          label: 'Next Step',
          text: 'I will present the full competitive battlecard in our next team meeting on [Date]. Please review the attached data deck in advance.\n\nBest,\nXueyan Xu',
          textZh: '我将在[日期]的下次团队会议上展示完整的竞争情报卡。请提前审阅附件数据报告。\n\n此致\n徐雪艳'
        }
      ]
    },
    task: 'Reorganize and professionalize this competitive update email:\n\n"Hi. I looked at competitors. Competitor A has a new drink. Competitor B is spending more on Douyin. Our share of voice went down. We should do something. Thanks."',
    reference: 'Subject: Q2 Competitive Intelligence Review — 3 Key Findings & Recommended Actions\n\nHi team,\n\nBelow is our Q2 Competitive Landscape Review for Mizone. Three developments require your attention:\n\n1. Competitor A — Gen Z Entry: Competitor A launched a sugar-free functional variant in May targeting Gen Z (16–24), with strong early CVS trial data. This directly challenges our Q3 Gen Z growth ambitions.\n\n2. Competitor B — Douyin Surge: Estimated Douyin spend increased ~40% in Q2 with heavy investment in fitness and productivity content. Mizone\'s Douyin share of voice has consequently softened.\n\n3. Mizone Share of Voice Decline: Our digital SOV dropped from 31% to 28% this quarter — a signal we need to increase content frequency and quality.\n\nRecommended Responses:\n• Accelerate Gen Z content plan on Douyin with 20+ micro-KOL activations in Q3.\n• Differentiate through "workday wellness" positioning — a territory neither competitor currently occupies.\n• Activate WeChat community for UGC to build organic SOV.\n\nFull competitive battlecard will be presented at our team meeting on [Date]. Please review the attached data deck.\n\nBest,\nXueyan Xu | Brand Manager, Mizone',
    referenceZh: '主题：第二季度竞争情报审查——3项关键发现与建议应对措施\n\n团队好，\n\n以下是脉动第二季度竞争格局审查报告，三个动态需要你们的关注：\n\n1. 竞争对手A——Z世代入局：竞争对手A于5月推出针对Z世代（16-24岁）的无糖功能性变体，便利店渠道早期试用数据强劲，直接挑战我们第三季度的Z世代增长目标。\n\n2. 竞争对手B——抖音激增：估计第二季度抖音支出增加约40%，大量投入健身和效率内容，导致脉动抖音声量份额有所下滑。\n\n3. 脉动声量份额下滑：我们的数字声量份额本季度从31%降至28%——这是我们需要提高内容频率和质量的信号。\n\n建议应对措施：\n• 在第三季度加速Z世代内容计划，启动20+个微型KOL活动。\n• 通过"工作日健康"定位实现差异化——目前两个竞争对手都没有占据这一领域。\n• 激活微信社区以产生用户生成内容，建立自然声量份额。\n\n完整竞争情报卡将在[日期]的团队会议上展示，请提前审阅附件数据报告。\n\n此致\n徐雪艳 | 脉动品牌经理'
  },

  speaking: {
    title: 'How Do You Monitor and Respond to Competition?',
    outline: [
      { point: '1. Competitive Intelligence System (0:00–0:25)', note: 'Describe your 3-layer approach: syndicated data (Nielsen), social listening, and field intelligence from the sales team.', noteZh: '描述你的三层方法：联合数据（尼尔森）、社交聆听，以及来自销售团队的一线情报。' },
      { point: '2. Quarterly Review Process (0:25–0:50)', note: 'Quarterly brand audit of competitors: advertising, digital strategy, distribution moves, pricing changes.', noteZh: '季度性竞争对手品牌审计：广告、数字策略、分销动向、价格变化。' },
      { point: '3. A Specific Example (0:50–1:20)', note: 'Share an instance where competitive intelligence led to a strategic decision that benefited your brand. STAR format.', noteZh: '分享一个竞争情报推动战略决策并让你的品牌受益的案例，使用STAR格式。' },
      { point: '4. Share of Voice & Positioning Response (1:20–1:40)', note: 'How you use SOV data to guide media investment and how you identify positioning white spaces vs. competitors.', noteZh: '你如何使用声量份额数据指导媒体投资，以及如何识别相对于竞争对手的定位空白。' },
      { point: '5. Your Philosophy on Competition (1:40–2:00)', note: 'End with a principle: you don\'t copy the competition — you find the spaces they can\'t or won\'t occupy.', noteZh: '以一个原则结束：你不复制竞争——你找到他们无法或不愿占据的空间。' }
    ],
    keySentences: [
      'I run a three-layer competitive intelligence system: syndicated market data, social listening tools, and real-time field intelligence from the sales force.',
      'On a quarterly basis, I review each major competitor\'s advertising strategy, digital content, media spend estimates, and in-store execution — and translate findings into a battlecard for the sales team.',
      'In one specific instance, our competitive intelligence revealed that our main rival was ignoring the 26–35 professional segment — we pivoted our media strategy toward that audience and gained 2 points of share within two quarters.',
      'I track share of voice as a leading indicator of future market share — when SOV trends down for three consecutive months, that\'s my early warning signal to act.',
      'My competitive philosophy is simple: don\'t fight the market leader where they\'re strongest. Find the spaces they don\'t value — and own those spaces definitively.'
    ],
    keySentencesZh: [
      '我运行一个三层竞争情报系统：联合市场数据、社交聆听工具，以及来自销售力量的实时一线情报。',
      '每季度，我审查每个主要竞争对手的广告策略、数字内容、媒体支出估算和店内执行——并将发现转化为销售团队的情报卡。',
      '在一个具体案例中，我们的竞争情报揭示，主要竞争对手忽视了26-35岁职场细分市场——我们将媒体策略转向该受众，在两个季度内获得了2个份额点。',
      '我将声量份额作为未来市场份额的先行指标追踪——当声量份额连续三个月下滑时，这就是我采取行动的预警信号。',
      '我的竞争理念很简单：不要在市场领导者最强的地方与之正面交锋。找到他们不重视的空间——并决定性地占据那些空间。'
    ],
    selfEvalCriteria: [
      { label: 'Intelligence System', desc: 'Did you describe a structured, multi-source competitive monitoring system?' },
      { label: 'Specific Example', desc: 'Did you share a real example of competitive intelligence leading to a strategic win?' },
      { label: 'Share of Voice', desc: 'Did you demonstrate familiarity with SOV as a metric and its implications?' },
      { label: 'Strategic Response', desc: 'Did you show how intelligence translates into strategic decisions — not just monitoring?' },
      { label: 'Competitive Philosophy', desc: 'Did you articulate a clear, distinctive point of view on competition?' }
    ]
  },

  quiz: {
    questions: [
      {
        type: 'mcq',
        question: '"Share of voice" (SOV) in digital marketing measures:',
        options: [
          'The volume of your brand\'s customer service calls',
          'Your brand\'s proportion of total online conversation or advertising within its category',
          'The number of social media platforms your brand is active on',
          'Your brand\'s share of total industry revenue'
        ],
        answer: 1,
        explanation: 'Share of voice (SOV) = your brand\'s mentions/impressions as a % of total category mentions/impressions. High SOV is a leading indicator of brand salience and future market share.',
        explanationZh: '声量份额（SOV）= 你的品牌提及/展示量占品类总量的百分比。高SOV是品牌显著度和未来市场份额的先行指标。'
      },
      {
        type: 'mcq',
        question: 'What is "social listening" used for in competitive intelligence?',
        options: [
          'Monitoring conversations, trends, and sentiment about your brand and competitors across social platforms',
          'Listening to customer service calls recorded on social media',
          'Tracking the number of social media followers of competitors',
          'Reviewing competitor job postings on LinkedIn'
        ],
        answer: 0,
        explanation: 'Social listening tools (Brandwatch, Meltwater, etc.) scan social platforms for brand mentions, sentiment, topic trends, and competitive conversations — providing real-time market intelligence.',
        explanationZh: '社交聆听工具（Brandwatch、Meltwater等）扫描社交平台，追踪品牌提及、情绪、话题趋势和竞争对手对话——提供实时市场情报。'
      },
      {
        type: 'fillblank',
        question: 'Standardized market research data sold by companies like Nielsen to multiple clients across an industry is called ________ data.',
        answer: 'syndicated',
        explanation: '"Syndicated data" (e.g., Nielsen, Kantar) is industry-standard market research purchased by multiple companies — covering market size, share, distribution, and pricing across retail channels.',
        explanationZh: '"联合数据"（如尼尔森、凯度）是由多家公司购买的行业标准市场研究——涵盖跨零售渠道的市场规模、份额、分销和定价。'
      },
      {
        type: 'mcq',
        question: 'A "competitive battlecard" is primarily used to:',
        options: [
          'Plan competitive advertising attacks on rival brands',
          'Give sales representatives quick-reference intelligence about competitors to use in buyer conversations',
          'Visualize the competitive landscape for the board of directors',
          'Track competitors\' financial performance over time'
        ],
        answer: 1,
        explanation: 'A battlecard is a concise sales enablement tool — it gives reps the key facts about competitors (strengths, weaknesses, positioning) and tailored rebuttals to use in the field.',
        explanationZh: '竞争情报卡是简洁的销售赋能工具——为销售代表提供竞争对手关键事实（优势、劣势、定位）以及在一线使用的针对性应对话术。'
      },
      {
        type: 'correction',
        question: 'Correct this sentence: "We must monitor close our competitors movement to ensure we are not losing market shares."',
        corrected: 'We must closely monitor our competitors\' movements to ensure we are not losing market share.',
        answer: 'We must closely monitor our competitors\' movements to ensure we are not losing market share.',
        explanation: 'Errors: "monitor close" → "closely monitor" (adverb placement); "competitors movement" → "competitors\' movements" (possessive apostrophe + plural); "market shares" → "market share" (uncountable).',
        explanationZh: '三处错误："monitor close"→"closely monitor"（副词位置）；"competitors movement"→"competitors\' movements"（所有格+复数）；"market shares"→"market share"（不可数名词）。'
      }
    ]
  }
});
