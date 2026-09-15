// Day 10: Marketing ROI & Budget Management
AppContent.days.push({
  day: 10,
  theme: 'Marketing ROI & Budget Management',
  themeZh: '营销ROI与预算管理',
  minutes: 240,

  listening: {
    title: 'Making the Case for Your Marketing Budget — ROI and Accountability',
    text: [
      'Every marketing budget is an investment hypothesis — the CFO is essentially asking: if we give you this money, what return can the business expect?',
      'Gone are the days when brand managers could justify budgets with vague references to brand equity and awareness. Today, every dollar must be accountable.',
      'We measure marketing ROI across two dimensions: short-term commercial return — incremental revenue and volume driven directly by the campaign — and long-term brand equity return, measured through brand tracking.',
      'For our last major campaign, we used a marketing mix modeling approach to isolate the sales contribution of each channel — TV, digital, trade, and sampling.',
      'The model showed that digital channels generated a 3.2x return on ad spend, while sampling events drove the highest trial conversion rate at 18%.',
      'Armed with these numbers, I was able to make a data-driven case to redirect 20% of our TV budget into digital and sampling in the following year.',
      'Budget management is not just about spending wisely — it\'s about building the credibility to ask for more. Every campaign result you can quantify is an argument for future investment.',
      'The brand managers who thrive are those who speak the language of the CFO: incremental revenue, payback period, and return on ad spend — not just reach and engagement.'
    ],
    textZh: [
      '每一笔营销预算都是一个投资假设——CFO本质上在问：如果我们给你这笔钱，业务能期待什么回报？',
      '品牌经理只需模糊提到品牌资产和知名度就能为预算辩护的时代已经过去了。如今，每一分钱都必须有交代。',
      '我们从两个维度衡量营销ROI：短期商业回报——由活动直接驱动的增量收入和销量——以及通过品牌追踪衡量的长期品牌资产回报。',
      '在上一次大型活动中，我们使用营销组合建模方法来区分每个渠道的销售贡献——电视、数字、渠道推广和试饮。',
      '模型显示，数字渠道的广告支出回报率为3.2倍，而试饮活动的试用转化率最高，达到18%。',
      '有了这些数据，我有能力提出数据驱动的方案，在下一年将20%的电视预算重新分配到数字和试饮。',
      '预算管理不仅仅是明智地花钱——更是建立信誉以申请更多资源。每一个你能量化的活动结果都是未来投资的论据。',
      '蓬勃发展的品牌经理是那些说CFO语言的人：增量收入、回收期和广告支出回报率——而不仅仅是触达和互动。'
    ],
    keywords: ['marketing ROI', 'return on ad spend', 'marketing mix modeling', 'brand equity', 'incremental revenue', 'payback period', 'budget reallocation', 'accountability'],
    comprehension: [
      {
        question: 'What approach was used to isolate the sales contribution of each marketing channel?',
        options: [
          'Consumer surveys and brand tracking',
          'Marketing mix modeling',
          'A/B testing of creative assets',
          'Retail audit data'
        ],
        answer: 1,
        explanationZh: '所使用的方法是营销组合建模，通过统计分析来区分每个营销渠道的销售贡献。'
      },
      {
        question: 'Which channel showed the highest return on ad spend?',
        options: [
          'TV with a 3.2x ROAS',
          'Sampling events with 18% trial conversion',
          'Digital channels with a 3.2x ROAS',
          'Trade marketing with a 5x ROAS'
        ],
        answer: 2,
        explanationZh: '数字渠道显示出最高的广告支出回报率，为3.2倍（试饮活动的试用转化率18%最高，但那是转化率而非广告支出回报率）。'
      },
      {
        question: 'According to the speaker, what do high-performing brand managers speak?',
        options: [
          'The language of consumers: awareness and sentiment',
          'The language of agencies: reach and creative quality',
          'The language of the CFO: incremental revenue, payback period, and return on ad spend',
          'The language of retailers: shelf placement and promotional calendar'
        ],
        answer: 2,
        explanationZh: '优秀的品牌经理会说CFO的语言：增量收入、回收期和广告支出回报率——而不仅仅是触达和互动。'
      }
    ]
  },

  writing: {
    title: 'Budget Justification Email to the CFO',
    scenario: 'You are requesting approval for a RMB 8 million incremental budget for Mizone\'s H2 digital campaign. The CFO has asked for a written justification showing expected ROI before approving. Write a concise, data-backed email to make the case.',
    template: {
      subject: 'Budget Approval Request: Mizone H2 Digital Campaign — RMB 8M | Projected ROI: 2.8x',
      structure: [
        {
          label: 'Opening — Clear Ask',
          text: 'Dear [CFO Name],\n\nI am writing to request approval for a RMB 8 million incremental marketing investment for Mizone\'s H2 2026 digital campaign, with a projected ROI of 2.8x based on our marketing mix model.',
          textZh: '亲爱的[CFO姓名]，\n\n我写此信是为了申请批准脉动2026年下半年数字营销活动800万元人民币的增量营销投资，根据我们的营销组合模型，预计广告支出回报率为2.8倍。'
        },
        {
          label: 'Business Opportunity',
          text: 'Our consumer data shows a 35% purchase intent gap among the 22–35 urban professional segment — a high-value cohort currently underserved by our media mix. This campaign is designed specifically to convert that intent into trial and purchase.',
          textZh: '我们的消费者数据显示，22-35岁城市职场人群中存在35%的购买意向差距——这是目前被我们媒体组合严重忽视的高价值群体。本次活动专门设计用于将这种意向转化为试用和购买。'
        },
        {
          label: 'Investment Plan',
          text: 'RMB 8M breakdown: Douyin paid media (RMB 3.5M), Micro-KOL partnerships (RMB 2.5M), WeChat CRM activation (RMB 1M), Content production (RMB 1M).',
          textZh: '800万元人民币分配方案：抖音付费媒体（350万元）、微型KOL合作（250万元）、微信CRM激活（100万元）、内容制作（100万元）。'
        },
        {
          label: 'Projected Financial Return',
          text: 'Based on marketing mix modeling benchmarks: projected incremental revenue: RMB 22.4M. Expected payback period: 7 months. ROAS: 2.8x. Sensitivity analysis (low/base/high) attached.',
          textZh: '基于营销组合建模基准：预计增量收入：2,240万元人民币。预期回收期：7个月。广告支出回报率：2.8倍。敏感性分析（低/基础/高情景）见附件。'
        },
        {
          label: 'Risk & Mitigation',
          text: 'Primary risk: digital platform algorithm changes reducing reach efficiency. Mitigation: we have contingency creative assets and a flexible media booking structure with 4-week cancellation windows.',
          textZh: '主要风险：数字平台算法变化导致触达效率降低。缓解措施：我们备有应急创意素材，并采用灵活的媒体预订结构，设有4周取消窗口期。'
        },
        {
          label: 'Request & Next Step',
          text: 'I would welcome the opportunity to present this in more detail at your convenience. Could you please approve by [Date] to meet our campaign launch timeline?\n\nThank you for your consideration.\n\nBest regards,\nXueyan Xu',
          textZh: '若方便，我希望有机会更详细地介绍此方案。请您于[日期]前批准，以便我们能够按时启动活动？\n\n感谢您的考虑。\n\n此致\n徐雪艳'
        }
      ]
    },
    task: 'Rewrite this weak budget request:\n\n"Hi. We need 8 million for marketing. Digital is very important now. We think it will work well. Please approve. Thanks."',
    reference: 'Subject: Budget Approval Request: Mizone H2 Digital Campaign — RMB 8M | Projected ROI: 2.8x\n\nDear [CFO Name],\n\nI am writing to request approval for a RMB 8 million incremental investment in Mizone\'s H2 2026 digital campaign. Based on our marketing mix model and comparable campaign benchmarks, I project a 2.8x return on ad spend.\n\nOpportunity: Our consumer tracking data reveals a 35% purchase intent gap among urban professionals (22–35) — our highest-value growth segment — who remain underserved by our current media mix.\n\nInvestment Plan (RMB 8M):\n• Douyin paid media: RMB 3.5M\n• Micro-KOL partnerships: RMB 2.5M\n• WeChat CRM activation: RMB 1M\n• Content production: RMB 1M\n\nProjected Returns: Incremental revenue RMB 22.4M | Payback: 7 months | ROAS: 2.8x (sensitivity analysis attached).\n\nRisk Mitigation: Flexible media booking with 4-week cancellation windows protects against platform volatility.\n\nI am available to present detailed modeling at your convenience. Approval by [Date] is needed to meet our campaign timeline.\n\nThank you.\n\nXueyan Xu | Brand Manager, Mizone',
    referenceZh: '主题：预算批准申请：脉动下半年数字营销活动——800万元 | 预计广告支出回报率：2.8倍\n\n亲爱的[CFO姓名]，\n\n我写此信是为了申请批准脉动2026年下半年数字营销活动800万元人民币的增量投资。根据我们的营销组合模型及可比活动基准，我预计广告支出回报率为2.8倍。\n\n机遇：我们的消费者追踪数据显示，城市职场人士（22-35岁）——我们最高价值的增长细分市场——中存在35%的购买意向差距，而我们目前的媒体组合对该群体服务严重不足。\n\n投资计划（800万元）：\n• 抖音付费媒体：350万元\n• 微型KOL合作：250万元\n• 微信CRM激活：100万元\n• 内容制作：100万元\n\n预期回报：增量收入2,240万元 | 回收期：7个月 | 广告支出回报率：2.8倍（敏感性分析见附件）。\n\n风险缓解：灵活的媒体预订及4周取消窗口期，以应对平台波动。\n\n若方便，我可以随时详细介绍建模方案。请于[日期]前批准，以便我们按时启动活动。\n\n谢谢。\n\n徐雪艳 | 脉动品牌经理'
  },

  speaking: {
    title: 'How Do You Measure and Justify Your Marketing Spend?',
    outline: [
      { point: '1. The Accountability Mindset (0:00–0:20)', note: 'Start by affirming: every marketing dollar must be accountable. You speak the language of business, not just brand.', noteZh: '首先肯定：每一分营销预算都必须有交代。你说的是商业语言，而不仅仅是品牌语言。' },
      { point: '2. ROI Framework (0:20–0:50)', note: 'Short-term: ROAS, incremental revenue, volume lift. Long-term: brand equity scores, awareness lift, purchase intent. Marketing mix modeling.', noteZh: '短期：广告支出回报率、增量收入、销量提升。长期：品牌资产评分、知名度提升、购买意向。营销组合建模。' },
      { point: '3. A Real Example (0:50–1:20)', note: 'Share a specific case: what was the budget, what did you measure, what was the ROI, what decision did the data drive?', noteZh: '分享一个具体案例：预算是多少、你衡量了什么、ROI是多少、数据推动了什么决策？' },
      { point: '4. Budget Optimization Process (1:20–1:45)', note: 'How you continuously optimize: weekly performance reviews, in-flight reallocation, post-campaign analysis feeding next planning cycle.', noteZh: '你如何持续优化：每周绩效回顾、活动途中预算调整、活动后分析为下一规划周期提供依据。' },
      { point: '5. What You Would Do for Mizone (1:45–2:05)', note: 'Name the first metric you would establish for Mizone and how you would track it.', noteZh: '说出你将为脉动建立的第一个指标以及你将如何追踪它。' }
    ],
    keySentences: [
      'I believe every marketing budget is an investment hypothesis — and my job is to prove the return, not just spend the money.',
      'I use a two-dimensional ROI framework: short-term commercial return measured by ROAS and incremental revenue, and long-term brand equity return tracked through quarterly brand health studies.',
      'In my previous role, marketing mix modeling showed that our digital channels delivered 3.2x ROAS versus 1.1x for traditional TV — data that directly informed a budget reallocation decision.',
      'I review campaign performance weekly during a live campaign and make in-flight reallocations within 48 hours when performance data signals an underperforming channel.',
      'For Mizone, my first priority would be establishing a baseline marketing mix model so that every future investment decision is grounded in data, not intuition.'
    ],
    keySentencesZh: [
      '我相信每一笔营销预算都是一个投资假设——我的工作是证明回报，而不仅仅是花钱。',
      '我使用双维度ROI框架：以广告支出回报率和增量收入衡量的短期商业回报，以及通过季度品牌健康研究追踪的长期品牌资产回报。',
      '在我之前的职位中，营销组合建模显示我们的数字渠道广告支出回报率为3.2倍，而传统电视仅为1.1倍——这一数据直接推动了预算重新分配的决策。',
      '在活动进行期间，我每周回顾活动表现，并在绩效数据显示某渠道表现不佳时，在48小时内进行途中调整。',
      '对于脉动，我的第一优先级是建立基础营销组合模型，以确保每一个未来的投资决策都基于数据而非直觉。'
    ],
    selfEvalCriteria: [
      { label: 'Financial Fluency', desc: 'Did you use specific financial terms: ROAS, payback period, incremental revenue?' },
      { label: 'Framework Clarity', desc: 'Did you articulate a clear ROI measurement framework — not just "we measure things"?' },
      { label: 'Real Example', desc: 'Did you ground your answer in a specific, data-rich real experience?' },
      { label: 'Optimization Mindset', desc: 'Did you show that you optimize continuously, not just at campaign end?' },
      { label: 'CFO Language', desc: 'Would a CFO feel confident in your financial stewardship after hearing your answer?' }
    ]
  },

  quiz: {
    questions: [
      {
        type: 'mcq',
        question: 'ROAS stands for:',
        options: [
          'Return on Advertising Spend',
          'Rate of Advertising Success',
          'Revenue of All Sales',
          'Return on Agency Services'
        ],
        answer: 0,
        explanation: 'ROAS = Return on Advertising Spend. If you spend RMB 1M and generate RMB 3.2M in revenue, your ROAS is 3.2x. It\'s the primary efficiency metric for marketing investment.',
        explanationZh: 'ROAS（广告支出回报率）= 广告费用带来的收入回报。若花费100万元并产生320万元收入，则ROAS为3.2倍。这是营销投资效率的主要衡量指标。'
      },
      {
        type: 'mcq',
        question: 'What does "marketing mix modeling" do?',
        options: [
          'It creates the optimal creative mix for an advertising campaign',
          'It uses statistical analysis to isolate the sales contribution of each individual marketing channel',
          'It models the ideal marketing team structure',
          'It predicts future consumer demand based on demographics'
        ],
        answer: 1,
        explanation: 'Marketing mix modeling (MMM) uses econometric analysis to attribute sales uplift to specific marketing inputs — TV, digital, sampling, etc. — enabling data-driven budget allocation.',
        explanationZh: '营销组合建模（MMM）使用计量经济学分析，将销售提升归因于特定营销投入——电视、数字、试饮等——从而实现数据驱动的预算分配。'
      },
      {
        type: 'fillblank',
        question: 'The time it takes for a marketing investment to generate enough revenue to cover its cost is called the ________ period.',
        answer: 'payback',
        explanation: '"Payback period" is the time from investment to break-even. Shorter payback periods are preferred by finance, especially for new brands or product launches with uncertain ROI.',
        explanationZh: '"回收期"是从投资到盈亏平衡所需的时间。财务部门更倾向于较短的回收期，尤其对于ROI不确定的新品牌或新品上市。'
      },
      {
        type: 'mcq',
        question: 'What does "incremental revenue" mean in marketing measurement?',
        options: [
          'The total revenue generated by the brand in a period',
          'Revenue that is directly attributable to the marketing campaign — above and beyond what would have occurred without it',
          'The revenue difference between two product variants',
          'Revenue from newly launched products only'
        ],
        answer: 1,
        explanation: '"Incremental revenue" isolates the campaign\'s true contribution — stripping away baseline sales trends, seasonality, and competitor actions to show what marketing specifically drove.',
        explanationZh: '"增量收入"剔除基准销售趋势、季节性因素和竞争对手行动，专门呈现营销活动真正带来的收入贡献。'
      },
      {
        type: 'correction',
        question: 'Correct this sentence: "The campaign generate a 2.8 time return on our advertising spend."',
        corrected: 'The campaign generated a 2.8x return on our advertising spend.',
        answer: 'The campaign generated a 2.8x return on our advertising spend.',
        explanation: 'Two errors: "generate" → "generated" (past tense); "2.8 time" → "2.8x" (use "x" for multiples in business contexts, or write "2.8 times").',
        explanationZh: '两处错误："generate"→"generated"（过去时）；"2.8 time"→"2.8x"（商业语境中用"x"表示倍数，或写"2.8 times"）。'
      }
    ]
  }
});
