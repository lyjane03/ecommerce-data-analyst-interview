var AppScoring = (function () {

  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [];
      for (var j = 0; j <= n; j++) {
        if (i === 0) dp[i][j] = j;
        else if (j === 0) dp[i][j] = i;
        else dp[i][j] = 0;
      }
    }
    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[m][n];
  }

  function normalize(text) {
    return (text || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  }

  function scoreDictation(original, userInput) {
    var origWords = normalize(original).split(' ').filter(Boolean);
    var userWords = normalize(userInput).split(' ').filter(Boolean);
    if (origWords.length === 0) return { accuracy: 0, correct: 0, total: 0, missed: [] };

    var matched = {};
    var correct = 0;

    for (var i = 0; i < origWords.length; i++) {
      var best = -1;
      var bestDist = 999;
      for (var j = 0; j < userWords.length; j++) {
        if (matched[j]) continue;
        var d = levenshtein(origWords[i], userWords[j]);
        if (d < bestDist) { bestDist = d; best = j; }
      }
      var threshold = origWords[i].length <= 3 ? 0 : origWords[i].length <= 6 ? 1 : 2;
      if (best >= 0 && bestDist <= threshold) {
        correct++;
        matched[best] = true;
      }
    }

    var missed = [];
    for (var i = 0; i < origWords.length; i++) {
      var found = false;
      for (var j = 0; j < userWords.length; j++) {
        var th = origWords[i].length <= 3 ? 0 : origWords[i].length <= 6 ? 1 : 2;
        if (levenshtein(origWords[i], userWords[j]) <= th) { found = true; break; }
      }
      if (!found && missed.indexOf(origWords[i]) === -1) missed.push(origWords[i]);
    }

    return {
      accuracy: Math.round((correct / origWords.length) * 100),
      correct: correct,
      total: origWords.length,
      missed: missed
    };
  }

  function scoreKeywords(expected, userKeywords) {
    var expNorm = expected.map(function (k) { return normalize(k); });
    var userNorm = (userKeywords || []).map(function (k) { return normalize(k); });
    var found = 0, foundWords = [], missedWords = [];

    for (var i = 0; i < expNorm.length; i++) {
      var hit = false;
      for (var j = 0; j < userNorm.length; j++) {
        if (expNorm[i] === userNorm[j] ||
            userNorm[j].indexOf(expNorm[i]) >= 0 ||
            expNorm[i].indexOf(userNorm[j]) >= 0 ||
            levenshtein(expNorm[i], userNorm[j]) <= 2) {
          hit = true; break;
        }
      }
      if (hit) { found++; foundWords.push(expected[i]); }
      else { missedWords.push(expected[i]); }
    }

    return {
      score: expected.length ? Math.round((found / expected.length) * 100) : 0,
      found: found,
      total: expected.length,
      foundWords: foundWords,
      missedWords: missedWords
    };
  }

  function scoreEmailStructure(emailText) {
    var text = (emailText || '').toLowerCase();
    var scores = {};

    scores.subject = /^(subject|re|fwd)\s*:/im.test(emailText) ? 5 :
      (emailText.split('\n')[0].length > 5 && emailText.split('\n')[0].length < 100) ? 3 : 1;

    var openPat = ['dear ', 'hi ', 'hello ', 'good morning', 'good afternoon', 'good evening'];
    scores.opening = openPat.some(function (p) { return text.indexOf(p) >= 0; }) ? 5 : 2;

    var purPat = ["i'm writing to", 'i am writing to', 'i would like to', "i'd like to",
      'the purpose of', 'regarding', 'this is to', 'following up on', 'as discussed'];
    scores.purpose = purPat.some(function (p) { return text.indexOf(p) >= 0; }) ? 5 : 2;

    var hasBullets = /[-•*]\s/.test(emailText) || /\d+[.)]\s/.test(emailText);
    var hasParagraphs = emailText.split(/\n\s*\n/).length >= 3;
    scores.keyPoints = hasBullets ? 5 : hasParagraphs ? 4 : 2;

    var actPat = ['please', 'could you', 'would you', 'action required', 'next step',
      'deadline', 'let me know', 'kindly', 'at your earliest', 'by end of'];
    var actCount = actPat.filter(function (p) { return text.indexOf(p) >= 0; }).length;
    scores.actionItems = actCount >= 3 ? 5 : actCount >= 1 ? 3 : 1;

    var tonePat = ['best regards', 'kind regards', 'sincerely', 'thank you', 'thanks',
      'looking forward', 'appreciate', 'warm regards'];
    var toneCount = tonePat.filter(function (p) { return text.indexOf(p) >= 0; }).length;
    scores.tone = toneCount >= 2 ? 5 : toneCount >= 1 ? 3 : 1;

    var total = 0, max = 30;
    for (var k in scores) total += scores[k];

    return {
      scores: scores,
      total: total,
      max: max,
      percentage: Math.round((total / max) * 100)
    };
  }

  function scoreQuiz(questions, answers) {
    var correct = 0;
    var results = [];

    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var a = answers[i];
      var isCorrect = false;

      if (q.type === 'mcq') {
        isCorrect = a === q.answer;
      } else if (q.type === 'fillblank') {
        isCorrect = normalize(a || '') === normalize(q.answer);
      } else if (q.type === 'correction') {
        var normA = normalize(a || '');
        var normC = normalize(q.corrected);
        if (normC.length === 0) { isCorrect = normA.length === 0; }
        else {
          var sim = 1 - (levenshtein(normA, normC) / Math.max(normC.length, 1));
          isCorrect = sim >= 0.75;
        }
      }

      if (isCorrect) correct++;
      results.push({
        questionIndex: i,
        userAnswer: a,
        correct: isCorrect,
        correctAnswer: q.type === 'correction' ? q.corrected : q.answer
      });
    }

    return {
      score: questions.length ? Math.round((correct / questions.length) * 100) : 0,
      correct: correct,
      total: questions.length,
      results: results
    };
  }

  function scoreComprehension(questions, answers) {
    var correct = 0, results = [];
    for (var i = 0; i < questions.length; i++) {
      var ok = answers[i] === questions[i].answer;
      if (ok) correct++;
      results.push({ correct: ok, userAnswer: answers[i] });
    }
    return {
      score: questions.length ? Math.round((correct / questions.length) * 100) : 0,
      correct: correct,
      total: questions.length,
      results: results
    };
  }

  return {
    scoreDictation: scoreDictation,
    scoreKeywords: scoreKeywords,
    scoreEmailStructure: scoreEmailStructure,
    scoreQuiz: scoreQuiz,
    scoreComprehension: scoreComprehension,
    normalize: normalize
  };
})();
