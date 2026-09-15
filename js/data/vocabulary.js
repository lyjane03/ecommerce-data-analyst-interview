var AppVocabulary = {
  categories: [
    { id: 'core_metrics', name: 'Core Business Metrics', words: [
      { word: 'GMV (gross merchandise value)', def: '商品交易总额；下单商品在扣除退款前的成交价值', example: 'I use GMV to size demand, but I do not treat it as recognized revenue.', formula: 'sum(item price × quantity before refunds)', pitfall: 'GMV can include cancelled or refunded orders depending on the business rule.', sourceIds: ['shopify_cohorts', 'disney_role'] },
      { word: 'NMV (net merchandise value)', def: '净商品交易额；按约定扣除退款、取消或折扣后的交易价值', example: 'NMV gives the commercial team a cleaner view of realized merchandise value.', formula: 'GMV − defined cancellations/refunds/discount adjustments', pitfall: 'Always state which deductions are included.', sourceIds: ['shopify_cohorts', 'disney_role'] },
      { word: 'gross revenue', def: '毛收入；确认扣减前的销售收入', example: 'Gross revenue rose, although the refund rate also increased.', formula: 'recognized sales before returns and allowances', pitfall: 'Do not use it interchangeably with GMV.', sourceIds: ['disney_role', 'ga4_events'] },
      { word: 'net revenue', def: '净收入；按会计或业务口径扣除退货、折让等后的收入', example: 'The recommendation is based on net revenue rather than traffic alone.', formula: 'gross revenue − returns − allowances', pitfall: 'Accounting recognition rules may differ from a marketplace metric.', sourceIds: ['disney_role', 'ga4_events'] },
      { word: 'AOV (average order value)', def: '平均订单金额', example: 'AOV increased after bundles were added to the cart.', formula: 'revenue ÷ completed orders', pitfall: 'Use the same order and revenue scopes in numerator and denominator.', sourceIds: ['ga4_events', 'levis_role'] },
      { word: 'UPT (units per transaction)', def: '平均每笔交易件数', example: 'UPT is a better diagnostic than AOV when price levels changed.', formula: 'units sold ÷ completed orders', pitfall: 'A single order may contain multiple line items and units.', sourceIds: ['ga4_scopes', 'levis_role'] },
      { word: 'order count', def: '订单数；需要先明确是下单、支付成功还是完成订单', example: 'I counted paid order IDs after deduplicating retry events.', formula: 'count distinct order_id under a stated order status', pitfall: 'Counting rows can inflate orders when one order has multiple items.', sourceIds: ['ga4_scopes', 'bigquery_sql'] },
      { word: 'units sold', def: '售出件数', example: 'Units sold grew faster than order count, which explains the UPT change.', formula: 'sum(quantity) for the defined order scope', pitfall: 'Returned units may need to be removed for a net view.', sourceIds: ['ga4_scopes', 'shopify_cohorts'] },
      { word: 'gross margin', def: '毛利率；收入扣除商品成本后的利润比例', example: 'The promotion lifted volume but diluted gross margin.', formula: '(net revenue − cost of goods sold) ÷ net revenue', pitfall: 'Shipping and ad costs may sit outside gross margin.', sourceIds: ['amazon_acos', 'levis_role'] },
      { word: 'contribution margin', def: '贡献利润率；扣除与订单直接相关的变动成本后的利润比例', example: 'I would cap the discount when contribution margin turns negative.', formula: '(revenue − variable costs) ÷ revenue', pitfall: 'Define whether fulfillment and payment fees are included.', sourceIds: ['amazon_acos', 'disney_role'] }
    ]},
    { id: 'funnel_behavior', name: 'Funnel & Customer Behavior', words: [
      { word: 'impression', def: '曝光；一次可计量的内容或广告展示', example: 'Impressions increased, but product views did not move with them.', sourceIds: ['ga4_events', 'ga4_scopes'] },
      { word: 'product view', def: '商品详情页浏览事件', example: 'A product view is an event, not a unique customer.', sourceIds: ['ga4_events', 'ga4_scopes'] },
      { word: 'add-to-cart rate', def: '加购率', example: 'The add-to-cart rate dropped on mobile after the image change.', formula: 'add-to-cart sessions or users ÷ defined product-view base', pitfall: 'Keep the base unit consistent.', sourceIds: ['ga4_events', 'ga4_scopes'] },
      { word: 'checkout rate', def: '进入结账比例', example: 'Checkout rate was stable, so the payment step needs the next deep dive.', sourceIds: ['ga4_events', 'ga4_scopes'] },
      { word: 'conversion rate', def: '转化率；需要明确是 session、user 还是 order 转化', example: 'I report conversion rate with its denominator beside the headline.', formula: 'completed orders ÷ defined sessions/users', pitfall: 'A user-based rate and a session-based rate answer different questions.', sourceIds: ['ga4_events', 'ga4_scopes'] },
      { word: 'abandonment rate', def: '放弃率；在某步骤开始但未完成下一步的比例', example: 'Checkout abandonment rose after the payment gateway error.', formula: '1 − completed next step ÷ started step', pitfall: 'Do not mix event counts with user counts.', sourceIds: ['ga4_events', 'quince_role'] },
      { word: 'click-through rate (CTR)', def: '点击率', example: 'CTR improved, but I checked downstream revenue before calling the ad successful.', formula: 'clicks ÷ impressions', pitfall: 'A high CTR can still bring low-intent traffic.', sourceIds: ['amazon_acos', 'ga4_attribution'] },
      { word: 'bounce rate', def: '跳出率；按所选分析工具对低互动会话的定义计算', example: 'I would validate the bounce-rate definition before comparing platforms.', sourceIds: ['ga4_scopes', 'quince_role'] },
      { word: 'session', def: '会话；在指定平台规则下的一段访问活动', example: 'One customer can generate several sessions in a day.', pitfall: 'Session boundaries depend on platform and timeout rules.', sourceIds: ['ga4_scopes', 'ga4_events'] },
      { word: 'event taxonomy', def: '事件分类体系；统一事件名称、参数和触发条件', example: 'A clear event taxonomy makes the funnel reproducible across teams.', sourceIds: ['ga4_events', 'ga4_scopes', 'quince_role'] }
    ]},
    { id: 'acquisition_media', name: 'Acquisition & Paid Media', words: [
      { word: 'CAC (customer acquisition cost)', def: '获客成本', example: 'Blended CAC rose because new-customer mix shifted to paid social.', formula: 'acquisition spend ÷ new customers', pitfall: 'State the spend window and whether brand media is included.', sourceIds: ['amazon_acos', 'belkin_role'] },
      { word: 'ROAS (return on ad spend)', def: '广告投入产出比', example: 'ROAS improved, but contribution margin did not, so I would not scale yet.', formula: 'attributed revenue ÷ ad spend', pitfall: 'ROAS is not profit and depends on attribution.', sourceIds: ['amazon_acos', 'ga4_attribution'] },
      { word: 'ACOS (advertising cost of sales)', def: '广告销售成本比', example: 'ACOS is the inverse view of ROAS and should be read with margin.', formula: 'ad spend ÷ attributed ad revenue', pitfall: 'A lower ACOS is not automatically better for growth.', sourceIds: ['amazon_acos'] },
      { word: 'cost per click (CPC)', def: '单次点击成本', example: 'CPC rose after the keyword auction became more competitive.', formula: 'ad spend ÷ clicks', sourceIds: ['amazon_acos', 'belkin_role'] },
      { word: 'cost per mille (CPM)', def: '千次曝光成本', example: 'CPM is useful for reach efficiency, not a standalone conversion measure.', formula: 'ad spend ÷ impressions × 1,000', sourceIds: ['amazon_acos', 'ga4_attribution'] },
      { word: 'attribution window', def: '归因窗口；转化被分配给触点的时间范围', example: 'I aligned the attribution window before comparing channel ROAS.', sourceIds: ['ga4_attribution', 'amazon_acos'] },
      { word: 'incrementality', def: '增量性；活动带来的超出自然基线的额外结果', example: 'Incrementality matters when retargeting claims users who would have purchased anyway.', sourceIds: ['ga4_attribution', 'belkin_role'] },
      { word: 'paid search', def: '付费搜索流量或投放渠道', example: 'Paid search captured high-intent demand, while social created discovery.', sourceIds: ['amazon_acos', 'belkin_role'] },
      { word: 'affiliate channel', def: '联盟营销渠道', example: 'I checked commission expense before ranking the affiliate channel by revenue.', sourceIds: ['ga4_attribution', 'belkin_role'] },
      { word: 'blended CAC', def: '综合获客成本；把多个渠道或自然流量的整体投入与新客相连', example: 'Blended CAC is more stable for the annual plan than one platform CAC.', formula: 'total acquisition spend ÷ total new customers', pitfall: 'It can hide an inefficient channel.', sourceIds: ['amazon_acos', 'ga4_attribution'] }
    ]},
    { id: 'lifecycle', name: 'Lifecycle & Customer Value', words: [
      { word: 'cohort', def: '同期群；按首单或首次行为时间归组的客户', example: 'I compare January and February first-order cohorts at the same customer age.', sourceIds: ['shopify_cohorts', 'levis_role'] },
      { word: 'retention rate', def: '留存率；某 cohort 在后续期间仍活跃或复购的比例', example: 'The new-member cohort has stronger 30-day retention.', formula: 'returning cohort customers ÷ original cohort customers', sourceIds: ['shopify_cohorts', 'levis_role'] },
      { word: 'repeat purchase rate', def: '复购率', example: 'Repeat purchase rate improved after the replenishment reminder.', formula: 'customers with a later qualifying order ÷ customers in base cohort', sourceIds: ['shopify_cohorts', 'levis_role'] },
      { word: 'churn rate', def: '流失率；在定义观察期内停止活跃的比例', example: 'I would define the inactivity window before reporting churn.', sourceIds: ['shopify_cohorts', 'levis_role'] },
      { word: 'LTV (lifetime value)', def: '客户生命周期价值', example: 'I use LTV with CAC to evaluate payback, not as a precise promise.', formula: 'expected contribution from a customer over a defined horizon', pitfall: 'The horizon, margin and retention model must be explicit.', sourceIds: ['shopify_cohorts', 'amazon_acos', 'levis_role'] },
      { word: 'first-order date', def: '首单日期；cohort 划分的常用锚点', example: 'The first-order date is fixed even when a customer changes channel later.', sourceIds: ['shopify_cohorts', 'levis_role'] },
      { word: 'reactivation', def: '唤回；让一段时间未活跃的客户再次购买或互动', example: 'Reactivation campaigns should be measured against an eligible lapsed audience.', sourceIds: ['shopify_cohorts', 'belkin_role'] },
      { word: 'active customer', def: '活跃客户；需明确活跃行为和观察窗口', example: 'The dashboard labels the active-customer definition next to the metric.', sourceIds: ['shopify_cohorts', 'levis_role'] },
      { word: 'RFM (recency, frequency, monetary)', def: '近度、频次、金额客户分群方法', example: 'RFM helps the CRM team prioritize high-value but recently inactive customers.', sourceIds: ['shopify_cohorts', 'levis_role'] },
      { word: 'customer segment', def: '客户分群；按行为、价值或属性形成的分析组', example: 'The recommendation differs by customer segment rather than using one average.', sourceIds: ['quince_role', 'levis_role'] }
    ]},
    { id: 'experimentation', name: 'Experimentation & Statistics', words: [
      { word: 'control group', def: '对照组；不接受实验处理的比较组', example: 'The control group keeps the baseline experience during the test.', sourceIds: ['microsoft_srm', 'stats_power'] },
      { word: 'treatment group', def: '实验组；接受新版本或处理的组', example: 'The treatment group saw the new checkout copy.', sourceIds: ['microsoft_srm', 'stats_power'] },
      { word: 'randomization', def: '随机分组；让处理分配与潜在结果独立的实验设计步骤', example: 'Randomization reduces systematic differences between treatment and control.', sourceIds: ['microsoft_srm', 'stats_power'] },
      { word: 'statistical power', def: '统计检验力；在效果真实存在时发现它的概率', example: 'The team increased sample size to achieve adequate statistical power.', sourceIds: ['stats_power', 'microsoft_srm'] },
      { word: 'p-value', def: 'p 值；在零假设成立时观察到当前或更极端结果的概率度量', example: 'I report the p-value alongside effect size and uncertainty.', pitfall: 'It is not the probability that the hypothesis is true.', sourceIds: ['stats_power', 'microsoft_srm'] },
      { word: 'confidence interval', def: '置信区间；对效果估计不确定性的区间表达', example: 'The confidence interval is too wide to support a rollout decision.', sourceIds: ['stats_power', 'microsoft_srm'] },
      { word: 'minimum detectable effect (MDE)', def: '最小可检测效果；实验设计希望可靠识别的最小差异', example: 'We set the MDE based on the smallest change worth shipping.', sourceIds: ['stats_power', 'target_role'] },
      { word: 'guardrail metric', def: '护栏指标；防止主指标提升却造成严重副作用的指标', example: 'Refund rate is a guardrail metric for the conversion test.', sourceIds: ['microsoft_srm', 'disney_role'] },
      { word: 'sample ratio mismatch (SRM)', def: '样本比例失配；实际分流比例偏离设计比例的实验异常', example: 'An SRM alert made us pause the experiment before reading lift.', sourceIds: ['microsoft_srm'] },
      { word: 'pre-registration', def: '预注册；在看结果前记录假设、指标和分析规则', example: 'Pre-registration limits outcome-driven metric selection.', sourceIds: ['stats_power', 'microsoft_srm'] }
    ]},
    { id: 'merchandising', name: 'Merchandising & Pricing', words: [
      { word: 'SKU (stock keeping unit)', def: '库存单位；可独立定价、库存和销售的商品单元', example: 'The SKU-level view showed that the category average hid two weak variants.', sourceIds: ['levis_role', 'quince_role'] },
      { word: 'assortment', def: '商品组合；某渠道或品类提供的商品集合', example: 'We optimized the assortment for mobile shoppers with limited shelf space.', sourceIds: ['levis_role', 'belkin_role'] },
      { word: 'category', def: '商品品类；用于分组、比较和经营管理的商品层级', example: 'The category view separates traffic from assortment availability.', sourceIds: ['levis_role', 'quince_role'] },
      { word: 'product detail page (PDP)', def: '商品详情页', example: 'PDP quality is a likely driver of the add-to-cart decline.', sourceIds: ['ga4_events', 'quince_role'] },
      { word: 'search relevance', def: '搜索相关性；结果与用户意图匹配的程度', example: 'Search relevance improved when synonyms were added to the catalog.', sourceIds: ['quince_role', 'levis_role'] },
      { word: 'click share', def: '点击份额；一个商品或结果获得的点击占比', example: 'The top SKU gained click share after its title was clarified.', sourceIds: ['quince_role', 'belkin_role'] },
      { word: 'conversion by SKU', def: '按 SKU 分解的转化率', example: 'Conversion by SKU identifies whether the issue is assortment-specific.', sourceIds: ['ga4_scopes', 'quince_role'] },
      { word: 'price index', def: '价格指数；相对竞品或基准价格的比值', example: 'A price index above 100 signals that the item is priced above the benchmark.', sourceIds: ['levis_role', 'belkin_role'] },
      { word: 'markdown', def: '降价；为促销、清库存或需求管理而降低标价', example: 'The markdown cleared inventory but reduced contribution margin.', sourceIds: ['levis_role', 'amazon_acos'] },
      { word: 'attach rate', def: '连带购买率；主商品订单中同时购买关联商品的比例', example: 'The attach rate supports testing a bundle on the PDP.', sourceIds: ['quince_role', 'levis_role'] }
    ]},
    { id: 'inventory_fulfillment', name: 'Inventory & Fulfillment', words: [
      { word: 'available-to-promise (ATP)', def: '可承诺库存；在约定时间内可用于承诺订单的库存', example: 'I joined ATP to the funnel before attributing lost orders to demand.', sourceIds: ['disney_role', 'target_role'] },
      { word: 'stockout', def: '缺货；需求存在但没有可售库存', example: 'The stockout affected conversion for the hero SKU during the campaign.', sourceIds: ['target_role', 'levis_role'] },
      { word: 'fill rate', def: '满足率；订单或需求中被库存满足的比例', example: 'Fill rate fell in one fulfillment node despite healthy total inventory.', sourceIds: ['target_role', 'disney_role'] },
      { word: 'order cycle time', def: '订单周期时间；从订单到履约完成的耗时', example: 'Longer order cycle time preceded the rise in cancellation rate.', sourceIds: ['disney_role', 'target_role'] },
      { word: 'cancellation rate', def: '取消率', example: 'I split cancellation rate by customer-initiated and system-initiated cases.', sourceIds: ['ga4_events', 'disney_role'] },
      { word: 'return rate', def: '退货率', example: 'Return rate is a guardrail for the size-guide experiment.', sourceIds: ['disney_role', 'levis_role'] },
      { word: 'refund rate', def: '退款率；已支付金额中被退回的比例或退款订单比例', example: 'Refund rate rose two days after the payment incident.', sourceIds: ['ga4_events', 'disney_role'] },
      { word: 'split shipment', def: '拆单发货；一笔订单由多个包裹或节点发出', example: 'Split shipments can inflate fulfillment cost per order.', sourceIds: ['target_role', 'disney_role'] },
      { word: 'safety stock', def: '安全库存；用于应对需求或供应波动的库存缓冲', example: 'We adjusted safety stock after measuring demand volatility.', sourceIds: ['target_role', 'levis_role'] },
      { word: 'on-time delivery', def: '准时交付率', example: 'On-time delivery improved after the warehouse cutoff changed.', sourceIds: ['disney_role', 'target_role'] }
    ]},
    { id: 'sql_modeling', name: 'SQL & Data Modeling', words: [
      { word: 'grain', def: '数据粒度；一行记录代表的业务实体或事件层级', example: 'Before joining tables, I write down the grain of each source.', sourceIds: ['ga4_scopes', 'bigquery_sql'] },
      { word: 'primary key', def: '主键；唯一标识一行实体记录的字段或字段组合', example: 'The order ID is the primary key at order grain.', sourceIds: ['bigquery_sql', 'ga4_scopes'] },
      { word: 'foreign key', def: '外键；连接到另一张表实体标识的字段', example: 'The item table uses order ID as a foreign key to the order table.', sourceIds: ['bigquery_sql', 'ga4_scopes'] },
      { word: 'CTE (common table expression)', def: '公共表表达式；用 WITH 命名中间查询结果', example: 'I use a CTE to separate deduplication from metric aggregation.', sourceIds: ['bigquery_sql'] },
      { word: 'inner join', def: '内连接；只保留两侧能匹配的记录', example: 'An inner join would silently remove orders without a matching campaign.', sourceIds: ['bigquery_sql', 'ga4_scopes'] },
      { word: 'left join', def: '左连接；保留左表全部记录并补充右表匹配信息', example: 'I use a left join to keep zero-purchase sessions in the funnel base.', sourceIds: ['bigquery_sql', 'ga4_scopes'] },
      { word: 'window function', def: '窗口函数；在不折叠行的情况下计算分组内排名或累计值', example: 'A window function gives each customer a running order number.', sourceIds: ['bigquery_window', 'bigquery_sql'] },
      { word: 'deduplication', def: '去重；按业务规则保留同一实体或事件的唯一记录', example: 'Deduplication removes retry events before counting purchases.', sourceIds: ['bigquery_sql', 'ga4_scopes'] },
      { word: 'NULL', def: '缺失或未知值，不等同于零或空字符串', example: 'I treat NULL campaign IDs as unknown rather than organic by default.', pitfall: 'NULL comparisons require IS NULL or IS NOT NULL.', sourceIds: ['bigquery_sql'] },
      { word: 'slowly changing dimension (SCD)', def: '缓慢变化维度；记录客户或商品属性随时间变化的方法', example: 'An SCD table lets us use the product category valid at order time.', sourceIds: ['bigquery_sql', 'levis_role'] }
    ]},
    { id: 'measurement_quality', name: 'Measurement & Data Quality', words: [
      { word: 'data contract', def: '数据契约；生产方与使用方约定 schema、语义和质量要求', example: 'The data contract makes a breaking event change visible before launch.', sourceIds: ['quince_role', 'target_role'] },
      { word: 'schema drift', def: '模式漂移；字段结构或类型未经协同而变化', example: 'Schema drift caused the quantity field to arrive as text.', sourceIds: ['quince_role', 'ga4_scopes'] },
      { word: 'data freshness', def: '数据新鲜度；数据到达或可查询的及时程度', example: 'The dashboard shows freshness next to the last successful load.', sourceIds: ['quince_role', 'levis_role'] },
      { word: 'completeness', def: '完整性；必需记录或字段是否齐全', example: 'Completeness fell when mobile purchase events stopped firing.', sourceIds: ['ga4_events', 'quince_role'] },
      { word: 'validity', def: '有效性；值是否符合允许的类型、范围或业务规则', example: 'I validated that discount amounts cannot exceed item value.', sourceIds: ['bigquery_sql', 'quince_role'] },
      { word: 'reconciliation', def: '对账；将两个独立来源的总量按共同口径核对', example: 'Daily reconciliation found a gap between payment and order totals.', sourceIds: ['disney_role', 'quince_role'] },
      { word: 'time zone', def: '时区；时间戳转换与日界线聚合必须声明的时间标准', example: 'I normalize event timestamps before comparing daily revenue.', sourceIds: ['ga4_scopes', 'bigquery_sql'] },
      { word: 'currency normalization', def: '币种标准化；将不同币种转换到共同报告币种', example: 'Currency normalization uses the agreed rate date and keeps original currency.', sourceIds: ['disney_role', 'levis_role'] },
      { word: 'source of truth', def: '事实来源；团队认可的某项指标或实体的权威系统', example: 'The warehouse order table is the source of truth for paid orders.', sourceIds: ['quince_role', 'disney_role'] },
      { word: 'data lineage', def: '数据血缘；字段从采集到报表的来源和变换链路', example: 'Data lineage made it possible to trace the revenue mismatch to a filter.', sourceIds: ['quince_role', 'levis_role'] }
    ]},
    { id: 'communication_impact', name: 'Communication & Influence', words: [
      { word: 'executive summary', def: '执行摘要；先给结论、影响和建议的短摘要', example: 'My executive summary starts with the business decision, not the query steps.', sourceIds: ['target_role', 'levis_role'] },
      { word: 'key takeaway', def: '核心结论；听众应该记住的一句话', example: 'The key takeaway is that availability, not demand, constrained the campaign.', sourceIds: ['target_role', 'disney_role'] },
      { word: 'hypothesis', def: '假设；可用数据验证的对问题原因或机会的解释', example: 'My first hypothesis is a mobile payment failure, which I test by gateway.', sourceIds: ['quince_role', 'target_role'] },
      { word: 'root cause', def: '根因；导致现象的关键机制，而不是表面相关性', example: 'The root cause was a duplicated join, not a sudden customer preference shift.', sourceIds: ['bigquery_sql', 'quince_role'] },
      { word: 'trade-off', def: '权衡；一个目标改善伴随另一目标代价', example: 'The trade-off is higher conversion at the cost of margin and returns.', sourceIds: ['amazon_acos', 'disney_role'] },
      { word: 'recommendation', def: '建议；基于证据和约束提出的行动方向', example: 'My recommendation is to fix the event first and then rerun the comparison.', sourceIds: ['target_role', 'quince_role'] },
      { word: 'next step', def: '下一步；明确负责人和时间的后续行动', example: 'The next step is for the payments team to validate the error log today.', sourceIds: ['disney_role', 'target_role'] },
      { word: 'stakeholder alignment', def: '利益相关方对齐；对口径、决策和行动形成共同理解', example: 'Stakeholder alignment prevented three teams from using different conversion rates.', sourceIds: ['levis_role', 'quince_role'] },
      { word: 'deep dive', def: '深度分析；针对一个问题深入拆解的分析工作', example: 'I propose a deep dive by device, payment method and fulfillment node.', sourceIds: ['target_role', 'disney_role'] },
      { word: 'caveat', def: '限制说明；可能影响结论解释或外推的条件', example: 'The main caveat is that the marketplace attribution window changed mid-month.', sourceIds: ['ga4_attribution', 'levis_role'] }
    ]}
  ],

  getAllWords: function () {
    var all = [];
    for (var i = 0; i < this.categories.length; i++) {
      for (var j = 0; j < this.categories[i].words.length; j++) {
        var word = this.categories[i].words[j];
        all.push({
          category: this.categories[i].name,
          categoryId: this.categories[i].id,
          word: word.word,
          def: word.def,
          example: word.example,
          formula: word.formula || '',
          pitfall: word.pitfall || '',
          sourceIds: word.sourceIds || []
        });
      }
    }
    return all;
  },

  getByCategory: function (categoryId) {
    for (var i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === categoryId) return this.categories[i].words;
    }
    return [];
  },

  search: function (query) {
    var q = query.toLowerCase();
    return this.getAllWords().filter(function (w) {
      return w.word.toLowerCase().indexOf(q) >= 0 || w.def.indexOf(q) >= 0;
    });
  }
};
