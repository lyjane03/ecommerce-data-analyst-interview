// Day 7: Crisis Communication & Brand Reputation Management
AppContent.days.push({
  day: 7,
  theme: 'Crisis Communication & Brand Reputation Management',
  themeZh: '危机沟通与品牌声誉管理',
  minutes: 240,

  listening: {
    title: 'Managing a Product Safety Crisis — A Brand Manager\'s Account',
    text: [
      'No brand manager hopes to face a crisis, but the way you respond in the first 24 hours defines your brand\'s reputation for years to come.',
      'We faced a serious situation when social media reports emerged claiming our product had caused allergic reactions in a small number of consumers.',
      'Our first action was to activate the crisis management protocol: convene the core team, establish the facts, and agree on a single spokesperson within two hours.',
      'We issued an initial holding statement within four hours — acknowledging the reports, expressing genuine care for the affected consumers, and committing to a thorough investigation.',
      'The holding statement did not admit fault, but it was empathetic and transparent — two qualities that are essential in any crisis response.',
      'Internally, we contacted all major retail partners to brief them proactively, before they heard the news from media — maintaining their trust was critical to protecting shelf space.',
      'The investigation found that the reactions were linked to an undisclosed allergen from a third-party ingredient supplier, which we immediately removed from the formula.',
      'Within 72 hours, we issued a full public statement with the investigation findings, a formula update, and a consumer goodwill program — which helped contain the reputational damage.'
    ],
    textZh: [
      '没有品牌经理希望面对危机，但你在最初24小时内的应对方式，将决定品牌未来多年的声誉。',
      '当社交媒体上出现报告称我们的产品导致少数消费者过敏反应时，我们面临了严峻的局面。',
      '我们的第一个行动是启动危机管理流程：在两小时内召集核心团队、确认事实，并确定唯一发言人。',
      '我们在四小时内发布了初步声明——承认报告的存在，对受影响的消费者表达真切关怀，并承诺进行彻底调查。',
      '这份初步声明没有承认过失，但语气真诚且透明——这是任何危机应对中不可或缺的两种品质。',
      '在内部，我们主动联系了所有主要零售合作伙伴进行通报，先于他们从媒体获知消息——维护他们的信任对保住货架空间至关重要。',
      '调查发现，过敏反应与第三方原料供应商的一种未披露过敏原有关，我们立即将其从配方中去除。',
      '在72小时内，我们发布了包含调查结果、配方更新和消费者善意计划的完整公开声明——这有助于遏制声誉损失。'
    ],
    keywords: ['crisis management', 'holding statement', 'spokesperson', 'transparent', 'proactive', 'allergen', 'reputational damage', 'goodwill program'],
    comprehension: [
      {
        question: 'What are two essential qualities of a good crisis response, according to the speaker?',
        options: [
          'Speed and aggression',
          'Empathy and transparency',
          'Denial and redirection',
          'Silence and legal defense'
        ],
        answer: 1,
        explanationZh: '良好危机应对的两个关键品质是：真诚（empathy）和透明（transparency）。'
      },
      {
        question: 'Why did the team contact retail partners before the news broke publicly?',
        options: [
          'To ask retailers to remove the product from shelves',
          'To negotiate better pricing deals',
          'To brief them proactively and maintain their trust, protecting shelf space',
          'To inform them of a product recall'
        ],
        answer: 2,
        explanationZh: '团队主动联系零售合作伙伴，是为了在媒体报道前先行通报，维护信任，保住货架空间。'
      },
      {
        question: 'What was the root cause of the consumer allergic reactions?',
        options: [
          'A manufacturing defect in the brand\'s own factory',
          'An undisclosed allergen from a third-party ingredient supplier',
          'Incorrect product storage by retailers',
          'Consumer misuse of the product'
        ],
        answer: 1,
        explanationZh: '根本原因是第三方原料供应商的一种未披露过敏原。'
      }
    ]
  },

  writing: {
    title: 'Crisis Holding Statement Email to Retail Partners',
    scenario: 'Social media posts are circulating claiming that some Mizone consumers experienced unusual symptoms after drinking a new product variant. No investigation has been completed yet. Write a proactive email to your top 10 retail partners to brief them before media coverage escalates, without admitting fault.',
    template: {
      subject: 'Important Update: Mizone — Proactive Communication on Recent Social Media Reports',
      structure: [
        {
          label: 'Opening — Proactive Outreach',
          text: 'Dear [Partner Name],\n\nI am reaching out proactively to brief you on recent social media activity related to the Mizone brand, before you encounter this through media channels.',
          textZh: '尊敬的[合作伙伴名称]，\n\n我主动联系您，是为了在您通过媒体渠道获知相关信息之前，向您通报近期脉动品牌的社交媒体动态。'
        },
        {
          label: 'Situation Statement',
          text: 'We have become aware of a small number of social media posts where consumers report experiencing discomfort after consuming Mizone [Product Variant]. We take any consumer concern extremely seriously and want to ensure you have full, accurate information.',
          textZh: '我们注意到少量社交媒体帖子反映，部分消费者在饮用脉动[产品型号]后出现不适。我们极其重视每一位消费者的关切，并希望确保您获得完整、准确的信息。'
        },
        {
          label: 'Actions Being Taken',
          text: 'We have immediately activated our consumer safety protocol and launched a thorough internal investigation in collaboration with our quality and regulatory teams. We expect to have preliminary findings within 48 hours.',
          textZh: '我们已立即启动消费者安全流程，并与质量和法规团队合作开展全面内部调查。预计48小时内获得初步结论。'
        },
        {
          label: 'Your Action — Hold Position',
          text: 'At this time, we recommend continuing normal product operations. We will notify you immediately with investigation findings and any recommended next steps.',
          textZh: '目前，我们建议继续正常产品运营。一旦有调查结果或建议的下一步行动，我们会立即通知您。'
        },
        {
          label: 'Consumer Inquiry Handling',
          text: 'If consumers raise questions in-store, please direct them to our consumer hotline: [Number]. Our team is standing by to respond to all inquiries promptly.',
          textZh: '如果消费者在店内提出问题，请引导他们拨打我们的消费者热线：[电话号码]。我们的团队随时准备及时回应所有咨询。'
        },
        {
          label: 'Commitment & Closing',
          text: 'We are committed to full transparency throughout this process. I will personally provide you with a status update within 24 hours.\n\nThank you for your continued partnership.\n\nSincerely,\nXueyan Xu\nBrand Manager, Mizone',
          textZh: '我们承诺在整个过程中保持完全透明。我将在24小时内亲自向您提供进展更新。\n\n感谢您一如既往的合作。\n\n谨上，\n徐雪艳\n脉动品牌经理'
        }
      ]
    },
    task: 'Rewrite this panicked and unprofessional crisis email:\n\n"Hi. We have a big problem. People are saying bad things about our product online. Don\'t worry, it\'s not our fault. We will fix it. Please don\'t stop selling. Thanks."',
    reference: 'Subject: Important Update: Mizone — Proactive Communication on Recent Social Media Reports\n\nDear [Partner Name],\n\nI am reaching out proactively to ensure you have accurate, first-hand information regarding recent social media activity related to Mizone.\n\nSituation: We have become aware of a limited number of social media posts in which consumers report discomfort after consuming Mizone [Variant]. We take every consumer concern with the utmost seriousness.\n\nImmediate Actions: We have activated our consumer safety protocol and launched a full investigation with our quality and regulatory teams. We expect preliminary findings within 48 hours.\n\nOur Recommendation: We advise continuing normal operations while the investigation is underway. We will notify you immediately should any action be required.\n\nConsumer Inquiries: Please direct any in-store consumer questions to our dedicated hotline: [Number]. Our team is responding to all inquiries on a priority basis.\n\nI will personally provide you with a full status update within 24 hours. Thank you for your trust and continued partnership.\n\nSincerely,\nXueyan Xu\nBrand Manager, Mizone | Danone China',
    referenceZh: '主题：重要通知：脉动——关于近期社交媒体报告的主动沟通\n\n尊敬的[合作伙伴名称]，\n\n我主动联系您，是为了确保您获得关于近期脉动品牌社交媒体动态的准确第一手信息。\n\n情况说明：我们注意到少量社交媒体帖子中，消费者反映饮用脉动[产品型号]后出现不适。我们对每一位消费者的关切都给予最高度的重视。\n\n即时行动：我们已启动消费者安全流程，并与质量和法规团队开展全面调查，预计48小时内获得初步结论。\n\n我们的建议：在调查进行期间，建议继续正常运营。如有任何需要采取的行动，我们会立即通知您。\n\n消费者咨询：如有消费者在店内提出问题，请引导其拨打我们的专属热线：[电话号码]。我们的团队正在优先处理所有咨询。\n\n我将在24小时内亲自向您提供完整的进展更新。感谢您的信任与持续合作。\n\n谨上，\n徐雪艳\n脉动品牌经理 | 达能中国'
  },

  speaking: {
    title: 'How Would You Handle a Social Media Crisis for Mizone?',
    outline: [
      { point: '1. Immediate Response — First 2 Hours (0:00–0:25)', note: 'Activate crisis team, assign spokesperson, establish facts before communicating.', noteZh: '启动危机团队、指定发言人、在对外沟通前先确认事实。' },
      { point: '2. Holding Statement — First 4 Hours (0:25–0:45)', note: 'Issue an empathetic, transparent message that acknowledges concern without admitting fault.', noteZh: '发布一份真诚、透明的声明，承认关切但不在调查前承认过失。' },
      { point: '3. Stakeholder Management (0:45–1:05)', note: 'Sequence: consumers → retail partners → media → regulators. Each audience needs a tailored message.', noteZh: '沟通顺序：消费者→零售合作伙伴→媒体→监管机构。每个受众需要针对性的信息。' },
      { point: '4. Investigation & Resolution (1:05–1:25)', note: 'Conduct a rigorous root cause investigation. Communicate findings openly. Introduce a goodwill program if warranted.', noteZh: '开展严格的根因调查。公开沟通调查结果。如有必要，推出消费者善意计划。' },
      { point: '5. Post-Crisis Review (1:25–1:45)', note: 'Conduct a post-mortem. Update crisis protocols. Rebuild brand trust through consistent, positive brand actions.', noteZh: '进行事后复盘。更新危机应对流程。通过持续、正面的品牌行动重建消费者信任。' }
    ],
    keySentences: [
      'In a crisis, the first rule is: communicate before you are communicated about. Proactive transparency is always better than reactive denial.',
      'The holding statement is your most critical communication — it must be empathetic and transparent without admitting fault before the facts are established.',
      'I would sequence stakeholder communications very carefully: consumers first via social channels, then retail partners before media runs the story, then regulators if required.',
      'A consumer goodwill program — such as a refund offer or a product replacement — can significantly accelerate trust recovery once the root cause has been identified and addressed.',
      'After every crisis, I conduct a formal post-mortem to update our response protocols and identify any systemic gaps — so the next team is better prepared.'
    ],
    keySentencesZh: [
      '在危机中，第一条规则是：在别人说你之前先主动发声。主动透明永远优于被动否认。',
      '初步声明是你最关键的沟通——它必须真诚且透明，但在事实确认之前不能承认过失。',
      '我会非常谨慎地安排利益相关方沟通顺序：先通过社交渠道触达消费者，然后在媒体报道前通知零售合作伙伴，如有必要再联系监管机构。',
      '消费者善意计划——如退款或产品更换——一旦根本原因被识别并解决，可以显著加速信任恢复。',
      '每次危机之后，我都会进行正式的事后复盘，更新应对流程并识别任何系统性漏洞——让下一个团队做好更充分的准备。'
    ],
    selfEvalCriteria: [
      { label: 'Crisis Sequence', desc: 'Did you clearly describe what happens in the first 2 hours, first 24 hours, and beyond?' },
      { label: 'Stakeholder Thinking', desc: 'Did you address multiple stakeholder groups — not just consumers?' },
      { label: 'Communication Tone', desc: 'Did you emphasize empathy and transparency throughout?' },
      { label: 'Problem-Solving', desc: 'Did you demonstrate a structured, calm, solution-oriented approach?' },
      { label: 'Brand Protection', desc: 'Did you show awareness of long-term reputation impact, not just short-term damage control?' }
    ]
  },

  quiz: {
    questions: [
      {
        type: 'mcq',
        question: 'What is the primary purpose of a "holding statement" in a crisis?',
        options: [
          'To admit fault and apologize immediately',
          'To acknowledge the situation and express concern while the investigation is ongoing, without prematurely assigning blame',
          'To deny all claims made on social media',
          'To announce a product recall'
        ],
        answer: 1,
        explanation: 'A holding statement buys time during a crisis — it shows the brand is aware and caring, while the investigation establishes the facts before a full statement is made.',
        explanationZh: '初步声明在危机期间争取时间——它表明品牌知情且有关怀，同时调查在发布完整声明前确认事实。'
      },
      {
        type: 'mcq',
        question: 'In crisis communication, "proactive" means:',
        options: [
          'Waiting for media to ask questions before responding',
          'Communicating with stakeholders before they receive the news from external sources',
          'Immediately launching a new advertising campaign to distract consumers',
          'Hiring a PR agency to handle all communications'
        ],
        answer: 1,
        explanation: 'Proactive crisis communication means reaching key stakeholders BEFORE they hear the news elsewhere — maintaining trust through first-hand briefing.',
        explanationZh: '主动式危机沟通意味着在关键利益相关方从其他地方获知消息之前主动联系他们——通过第一手通报维护信任。'
      },
      {
        type: 'fillblank',
        question: 'Damage to a brand\'s public image and consumer trust caused by a crisis or scandal is called ________ damage.',
        answer: 'reputational',
        explanation: '"Reputational damage" refers to the harm done to how a brand is perceived — often harder to repair than financial losses from a crisis.',
        explanationZh: '"Reputational damage"（声誉损失）指危机对品牌形象造成的伤害——通常比财务损失更难修复。'
      },
      {
        type: 'mcq',
        question: 'Which of the following best describes a "consumer goodwill program" in a post-crisis context?',
        options: [
          'A loyalty program launched before a crisis',
          'An initiative (e.g., refunds, replacements, donations) offered to affected consumers to rebuild trust after a crisis',
          'A PR campaign promoting the brand\'s positive community activities',
          'A discount program for new consumer acquisition'
        ],
        answer: 1,
        explanation: 'A goodwill program demonstrates that the brand takes responsibility and values its consumers, helping to accelerate trust recovery after a crisis.',
        explanationZh: '善意计划表明品牌承担责任并重视消费者，有助于加速危机后的信任恢复。'
      },
      {
        type: 'correction',
        question: 'Correct this sentence: "We take every consumer concern with utmost serious and will investigate thorough."',
        corrected: 'We take every consumer concern with the utmost seriousness and will investigate thoroughly.',
        answer: 'We take every consumer concern with the utmost seriousness and will investigate thoroughly.',
        explanation: 'Errors: "utmost serious" → "the utmost seriousness" (noun needed; missing article "the"); "investigate thorough" → "investigate thoroughly" (adverb needed).',
        explanationZh: '错误：(1)"utmost serious"→"the utmost seriousness"（需用名词形式，且缺少冠词"the"）；(2)"investigate thorough"→"investigate thoroughly"（需用副词形式）。'
      }
    ]
  }
});
