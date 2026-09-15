// Day 4: Integrated Marketing Campaign Planning
AppContent.days.push({
  day: 4,
  theme: 'Integrated Marketing Campaign Planning',
  themeZh: '整合营销传播与活动策划',
  minutes: 240,

  listening: {
    title: 'Planning a 360-Degree Marketing Campaign',
    text: [
      'A successful integrated marketing campaign starts with a crystal-clear objective — awareness, trial, loyalty, or all three at different stages.',
      'Before briefing the agency, you need to define your target audience with precision: demographics, psychographics, media consumption habits, and purchase triggers.',
      'The campaign brief is the most important document in the process — a poorly written brief leads to off-strategy creative, wasted budget, and missed deadlines.',
      'In an integrated campaign, every touchpoint — TV, digital, out-of-home, in-store — must carry the same brand story, just adapted for the medium.',
      'We typically use a "hero, hub, hygiene" content framework: hero content drives mass awareness, hub content deepens engagement, and hygiene content answers specific consumer questions.',
      'Measurement must be built into the campaign from day one — KPIs should be defined before the campaign launches, not after.',
      'For our last summer campaign, we ran a 12-week phased approach: two weeks of teaser, six weeks of launch, and four weeks of sustain with personalized retargeting.',
      'Post-campaign analysis showed that the digital-first channels delivered 40% lower cost per engagement compared to traditional media, which directly informed our next budget allocation.'
    ],
    textZh: [
      '一场成功的整合营销活动始于清晰明确的目标——知名度、试用、忠诚度，或在不同阶段兼顾三者。',
      '在向代理商下达创意简报之前，你需要精确定义目标受众：人口统计特征、心理特征、媒体消费习惯和购买触发因素。',
      '营销活动简报是整个过程中最重要的文件——一份写得差的简报会导致偏离策略的创意、浪费预算和错过截止日期。',
      '在整合营销活动中，每一个触点——电视、数字、户外、店内——都必须传达相同的品牌故事，只是根据媒介进行适配。',
      '我们通常使用"英雄、枢纽、日常"内容框架：英雄内容驱动大规模知名度，枢纽内容深化互动，日常内容回答具体的消费者问题。',
      '效果衡量必须从第一天就纳入活动规划——KPI应在活动上线前定义，而非之后。',
      '在我们上一次夏季活动中，我们采用了12周的分阶段方法：两周预热、六周上线、四周持续投放并配合个性化再营销。',
      '活动后分析显示，数字优先渠道的单次互动成本比传统媒体低40%，这直接影响了我们下一次的预算分配。'
    ],
    keywords: ['integrated campaign', 'campaign brief', 'touchpoint', 'hero hub hygiene', 'KPI', 'phased approach', 'retargeting', 'cost per engagement'],
    comprehension: [
      {
        question: 'What is described as the most important document in the campaign planning process?',
        options: ['The media plan', 'The campaign brief', 'The post-campaign analysis report', 'The budget allocation sheet'],
        answer: 1,
        explanationZh: '营销活动简报（campaign brief）被描述为整个活动策划过程中最重要的文件。'
      },
      {
        question: 'In the "hero, hub, hygiene" framework, what does "hub" content do?',
        options: [
          'Drives mass awareness',
          'Deepens engagement with interested consumers',
          'Answers specific consumer questions',
          'Manages in-store promotions'
        ],
        answer: 1,
        explanationZh: '在"英雄、枢纽、日常"框架中，"枢纽"内容的作用是深化与感兴趣的消费者的互动。'
      },
      {
        question: 'What did the post-campaign analysis reveal about digital-first channels?',
        options: [
          'They delivered 40% higher cost per engagement',
          'They were less effective than traditional media',
          'They delivered 40% lower cost per engagement',
          'They generated 40% more TV viewers'
        ],
        answer: 2,
        explanationZh: '活动后分析显示数字优先渠道的单次互动成本比传统媒体低40%。'
      }
    ]
  },

  writing: {
    title: 'Campaign Brief Email to Creative Agency',
    scenario: 'You are briefing your creative agency for Mizone\'s upcoming summer campaign "Stay Sharp, Stay Hydrated" targeting urban professionals aged 22–35. The campaign runs for 8 weeks across digital, out-of-home, and in-store channels, with a total budget of RMB 5 million. Write the briefing email.',
    template: {
      subject: 'Campaign Brief: Mizone Summer 2026 — "Stay Sharp, Stay Hydrated"',
      structure: [
        {
          label: 'Opening & Campaign Overview',
          text: 'Hi [Agency Team],\n\nPlease find below the brief for Mizone\'s Summer 2026 campaign. We\'re targeting a high-energy 8-week run starting [Date].',
          textZh: '您好 [代理商团队]，\n\n以下是脉动2026年夏季活动的简报。我们计划从[日期]开始，进行为期8周的高能量投放。'
        },
        {
          label: 'Objective',
          text: 'Primary objective: Drive trial among urban professionals aged 22–35 who currently do not consider Mizone as part of their workday routine. Secondary: Increase brand awareness by 15% in Tier-1 cities.',
          textZh: '首要目标：推动22-35岁城市职场人群的试用，他们目前尚未将脉动纳入工作日饮品选择。次要目标：一线城市品牌知名度提升15%。'
        },
        {
          label: 'Target Audience',
          text: 'Urban professionals, 22–35, career-focused, health-aware but time-poor. They seek functional benefits (focus, energy, recovery) from what they consume during the workday.',
          textZh: '城市职场人群，22-35岁，事业心强，注重健康但时间紧张。他们从工作日饮品中寻求功能性益处（专注力、能量、恢复）。'
        },
        {
          label: 'Key Message & Tone',
          text: 'Campaign Line: "Stay Sharp, Stay Hydrated." Tone: energetic, modern, credible. Avoid sports clichés — this is about mental performance, not athletic performance.',
          textZh: '活动口号："保持敏锐，保持水分"。基调：活力、现代、可信。避免运动类套话——这里讲的是脑力表现，不是体育表现。'
        },
        {
          label: 'Channel Mix & Budget',
          text: 'Total Budget: RMB 5M. Allocation: Digital (Douyin, WeChat) 50%, OOH (office districts) 30%, In-store activation 20%. Please include a channel-by-channel creative execution plan.',
          textZh: '总预算：500万元。分配：数字渠道（抖音、微信）50%，户外广告（办公区域）30%，店内激活20%。请提供分渠道的创意执行方案。'
        },
        {
          label: 'Deliverables & Timeline',
          text: 'We need: (1) Creative concepts for review by [Date], (2) Final assets by [Date], (3) Campaign goes live: [Date]. Please confirm receipt and timeline feasibility.',
          textZh: '交付物要求：(1) 创意概念在[日期]前提交审核，(2) 最终素材在[日期]前完成，(3) 活动上线日期：[日期]。请确认收到简报并反馈时间线可行性。'
        }
      ]
    },
    task: 'Improve this poorly written brief email:\n\n"Hi agency. We need a summer campaign for Mizone. Budget is 5 million. Do something creative and exciting. Please send ideas soon."',
    reference: 'Subject: Campaign Brief: Mizone Summer 2026 — "Stay Sharp, Stay Hydrated"\n\nHi [Agency Team],\n\nThank you for your continued partnership on the Mizone brand. Please find below the brief for our Summer 2026 campaign, kicking off [Date].\n\nObjective: Drive trial among urban professionals (22–35) who have not yet incorporated Mizone into their workday routine, and increase brand awareness by 15% in Tier-1 cities.\n\nTarget Audience: Career-focused urban professionals who are health-aware but time-poor. They seek functional benefits — focus, clarity, recovery — from what they consume during busy workdays.\n\nKey Campaign Line: "Stay Sharp, Stay Hydrated." The tone should be energetic and modern. Please avoid traditional sports imagery — the insight here is mental performance, not athletic performance.\n\nChannel Mix (Total: RMB 5M): Digital 50% (Douyin, WeChat), OOH 30% (office district placements), In-store activation 20%.\n\nDeliverables: (1) Three creative concept directions by [Date], (2) Final approved assets by [Date], (3) Campaign live date: [Date].\n\nPlease confirm receipt of this brief and flag any questions by [Date]. Looking forward to an outstanding campaign.\n\nBest regards,\nXueyan Xu',
    referenceZh: '主题：活动简报：脉动2026夏季——"保持敏锐，保持水分"\n\n您好 [代理商团队]，\n\n感谢你们在脉动品牌上的持续合作。以下是我们2026年夏季活动的简报，计划于[日期]启动。\n\n目标：推动22-35岁城市职场人群的试用（他们尚未将脉动纳入工作日饮品选择），并在一线城市将品牌知名度提升15%。\n\n目标受众：事业心强的城市职场人群，注重健康但时间紧张。他们从忙碌工作日的饮品中寻求功能性益处——专注力、清晰度、恢复。\n\n核心活动口号："保持敏锐，保持水分"。基调应活力而现代。请避免传统体育形象——这里的洞察是脑力表现，而非体育表现。\n\n渠道组合（总计：500万元）：数字渠道50%（抖音、微信），户外广告30%（办公区域投放），店内激活20%。\n\n交付物：(1) 三个创意概念方向在[日期]前提交，(2) 最终审核通过的素材在[日期]前完成，(3) 活动上线日期：[日期]。\n\n请确认收到此简报，并在[日期]前提出任何问题。期待一场出色的活动。\n\n此致，\n徐雪艳'
  },

  speaking: {
    title: 'Walk Me Through a Campaign You Planned — End to End',
    outline: [
      { point: '1. Context — Why This Campaign (0:00–0:20)', note: 'Set the scene: what brand challenge or opportunity triggered the campaign? State the objective clearly.', noteZh: '设定背景：什么品牌挑战或机会触发了这次活动？清晰陈述目标。' },
      { point: '2. Consumer & Insight (0:20–0:40)', note: 'What was the target audience? What insight drove the creative strategy?', noteZh: '目标受众是谁？什么洞察驱动了创意策略？' },
      { point: '3. Creative Strategy & Channels (0:40–1:10)', note: 'What was the campaign concept? Which channels were used and why? How did the message adapt per channel?', noteZh: '活动概念是什么？使用了哪些渠道及原因？信息如何根据渠道适配？' },
      { point: '4. Execution & Team (1:10–1:30)', note: 'How did you manage the agency and cross-functional team? Any pivots or challenges?', noteZh: '你如何管理代理商和跨职能团队？是否有调整或挑战？' },
      { point: '5. Results & Learning (1:30–2:00)', note: 'What were the KPI outcomes? What would you do differently? End with a learning.', noteZh: 'KPI成果如何？你会做出什么不同的决策？以学到的经验收尾。' }
    ],
    keySentences: [
      'The campaign was born from a single consumer insight: our target audience associated Mizone with sport, but 65% of them never exercised regularly.',
      'Our creative strategy pivoted from "fuel your workout" to "fuel your day" — a more inclusive and relevant platform for a broader audience.',
      'We ran a phased approach across 10 weeks: two weeks of teaser content on Douyin, followed by a full-funnel launch across digital, OOH, and in-store.',
      'One mid-campaign challenge was an underperforming OOH placement — we quickly reallocated that budget to high-performing Douyin formats within 72 hours.',
      'The campaign delivered a 28% uplift in brand consideration among our target and a 19% increase in retail volume — and taught us the value of agile budget reallocation.'
    ],
    keySentencesZh: [
      '这次活动源于一个消费者洞察：我们的目标受众将脉动与运动联系在一起，但其中65%的人从不定期锻炼。',
      '我们的创意策略从"为你的锻炼加油"转向"为你的一天加油"——一个对更广泛受众更具包容性和相关性的平台。',
      '我们采用了为期10周的分阶段方法：两周抖音预热内容，随后在数字、户外和店内全渠道上线。',
      '活动中期的一个挑战是户外广告表现不佳——我们在72小时内迅速将该预算重新分配到表现优异的抖音形式上。',
      '活动在目标人群中实现了28%的品牌考虑度提升和19%的零售销量增长——也让我们认识到了灵活预算调配的价值。'
    ],
    keySentencesZh: [
      '这次活动源于一个消费者洞察：我们的目标受众将脉动与运动联系在一起，但他们中65%从不规律运动。',
      '我们的创意策略从"为你的锻炼加油"转向"为你的一天加油"——一个更具包容性和相关性的平台，覆盖更广泛的受众。',
      '我们采用了10周的分阶段方法：两周在抖音上投放预热内容，随后在数字、户外和店内渠道进行全链路上线。',
      '活动中期的一个挑战是户外广告效果不佳——我们在72小时内迅速将该预算重新分配到表现优异的抖音形式上。',
      '活动在目标人群中实现了28%的品牌考虑度提升和19%的零售销量增长——并让我们认识到灵活预算再分配的价值。'
    ],
    selfEvalCriteria: [
      { label: 'Story Arc', desc: 'Did you follow a clear: challenge → insight → strategy → execution → result structure?' },
      { label: 'Specificity', desc: 'Did you use specific numbers, channels, and timelines — not vague descriptions?' },
      { label: 'Strategic Role', desc: 'Did you clearly show YOUR contribution and decision-making role?' },
      { label: 'Learning & Growth', desc: 'Did you demonstrate reflection and growth from the experience?' },
      { label: 'Engagement', desc: 'Was your storytelling compelling enough to hold the panel\'s attention?' }
    ]
  },

  quiz: {
    questions: [
      {
        type: 'mcq',
        question: 'In campaign planning, a "KPI" stands for:',
        options: [
          'Key Product Initiative',
          'Key Performance Indicator',
          'Knowledge and Planning Index',
          'Key Promotional Investment'
        ],
        answer: 1,
        explanation: 'KPI = Key Performance Indicator. These are measurable values that define the success of a campaign (e.g., reach, engagement rate, trial rate).',
        explanationZh: 'KPI = 关键绩效指标。它们是定义活动成功与否的可衡量数值（如触达量、互动率、试用率）。'
      },
      {
        type: 'mcq',
        question: 'What is the primary purpose of a "campaign brief"?',
        options: [
          'To summarize the campaign results after it ends',
          'To provide the creative team with clear direction on objectives, audience, message, and deliverables',
          'To document the media buying plan',
          'To report campaign spending to finance'
        ],
        answer: 1,
        explanation: 'A campaign brief aligns all stakeholders — creative, media, and brand teams — on the strategic direction before any creative work begins.',
        explanationZh: '活动简报在任何创意工作开始之前，将所有利益相关方——创意、媒体和品牌团队——统一在战略方向上。'
      },
      {
        type: 'fillblank',
        question: 'An advertising strategy that uses multiple channels (TV, digital, OOH, in-store) to deliver a unified brand message is called ________ marketing.',
        answer: 'integrated',
        explanation: '"Integrated marketing" (or IMC — Integrated Marketing Communications) ensures brand consistency across every consumer touchpoint.',
        explanationZh: '"Integrated marketing"（整合营销，即IMC——整合营销传播）确保品牌在每一个消费者触点上保持一致性。'
      },
      {
        type: 'mcq',
        question: 'In digital advertising, "retargeting" refers to:',
        options: [
          'Changing the campaign\'s target audience mid-flight',
          'Showing ads to users who have previously interacted with your brand online',
          'Targeting new consumers who have never heard of your brand',
          'Reusing old creative assets for a new campaign'
        ],
        answer: 1,
        explanation: 'Retargeting serves ads to users who previously visited your site or engaged with your content, keeping your brand top-of-mind as they move closer to purchase.',
        explanationZh: '再营销（retargeting）向曾经访问过你网站或与你内容互动过的用户展示广告，在他们接近购买时保持品牌在心智中的首位。'
      },
      {
        type: 'correction',
        question: 'Correct this sentence: "We need define our KPIs before the campaign launch, not after."',
        corrected: 'We need to define our KPIs before the campaign launches, not after.',
        answer: 'We need to define our KPIs before the campaign launches, not after.',
        explanation: 'Two errors: (1) "need define" → "need to define" (infinitive required); (2) "launch" → "launches" (third-person singular present tense).',
        explanationZh: '两处错误：(1)"need define"应改为"need to define"（需要不定式）；(2)"launch"应改为"launches"（第三人称单数现在时）。'
      }
    ]
  }
});
