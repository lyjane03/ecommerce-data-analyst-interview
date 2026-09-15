var AppContent = {
  appId: 'ecommerce-data-analyst-interview',
  days: []
};

AppContent.addDay = function (day) {
  this.days.push(day);
};

AppContent.q = function (type, domain, question, answer, explanation, explanationZh, sourceIds) {
  var q = { type: type, domain: domain, question: question, explanation: explanation, explanationZh: explanationZh, sourceIds: sourceIds };
  if (type === 'mcq') { q.options = answer.options; q.answer = answer.answer; }
  else if (type === 'fillblank') { q.answer = answer; q.acceptedAnswers = [answer]; }
  else { q.corrected = answer; q.answer = answer; }
  return q;
};
