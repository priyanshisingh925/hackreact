const store = require('../data/store');

const messages = {
  English: {
    respectful: {
      sms: (acc) => `Dear ${acc.name.split(' ')[0]}, your ${acc.accountType} account (${acc.id}) at ${acc.branch} has been inactive for ${acc.dormancyYears} years with a balance of ₹${acc.balance.toLocaleString('en-IN')}. Please visit your nearest branch to reactivate. Helpline: 1800-XXX-XXXX`,
      emailSubject: (acc) => `Important: Reactivation of your ${acc.accountType} Account — ${acc.id}`,
      emailBody: (acc) => `Dear ${acc.name},\n\nWe hope this message finds you in good health. We write to bring to your attention that your ${acc.accountType} account (${acc.id}) at our ${acc.branch} branch has been dormant for ${acc.dormancyYears} years.\n\nYour current account balance stands at ₹${acc.balance.toLocaleString('en-IN')}.\n\nAs per RBI guidelines, accounts inactive for over 2 years are classified as dormant, and those inactive for 10+ years may be transferred to the Depositor Education and Awareness Fund (DEAF).\n\nWe respectfully request you to visit your nearest branch at your earliest convenience to reactivate your account. Our team is ready to assist you.\n\nWarm regards,\nCustomer Care Team`,
      ivr: (acc) => `Namaste. This is a message for ${acc.name}. Your bank account ending in ${acc.id.slice(-4)} has been dormant for ${acc.dormancyYears} years. Your balance is secure with us. Please press 1 to speak with a representative, or visit your ${acc.branch} branch.`
    },
    direct: {
      sms: (acc) => `${acc.name.split(' ')[0]}: Your ${acc.accountType} a/c ${acc.id} has ₹${acc.balance.toLocaleString('en-IN')} dormant for ${acc.dormancyYears} yrs. Reactivate NOW at ${acc.branch} or call 1800-XXX-XXXX. Don't risk DEAF transfer.`,
      emailSubject: (acc) => `Action Required: Your Account ${acc.id} Has Been Dormant for ${acc.dormancyYears} Years`,
      emailBody: (acc) => `Hi ${acc.name.split(' ')[0]},\n\nYour ${acc.accountType} account (${acc.id}) has ₹${acc.balance.toLocaleString('en-IN')} sitting dormant for ${acc.dormancyYears} years at ${acc.branch}.\n\nTake action now:\n• Visit your branch: ${acc.branch}\n• Call us: 1800-XXX-XXXX\n• Use net banking to reactivate\n\nAccounts dormant 10+ years transfer to RBI's DEAF fund. Reactivate today.\n\nTeam ReActivate`,
      ivr: (acc) => `Hello, ${acc.name}. Urgent update: Your ${acc.accountType} account has been inactive for ${acc.dormancyYears} years with a balance of ₹${acc.balance.toLocaleString('en-IN')}. Press 1 to reactivate immediately. Press 2 to speak to an agent.`
    },
    urgent: {
      sms: (acc) => `URGENT: ${acc.name.split(' ')[0]}, ₹${acc.balance.toLocaleString('en-IN')} in your ${acc.id} account risks DEAF transfer! ${acc.dormancyYears} years dormant. Reactivate immediately at ${acc.branch}. Call 1800-XXX-XXXX.`,
      emailSubject: (acc) => `⚠️ URGENT: ₹${acc.balance.toLocaleString('en-IN')} at Risk — Account ${acc.id} Approaching DEAF Transfer`,
      emailBody: (acc) => `Dear ${acc.name},\n\nURGENT NOTICE: Your ${acc.accountType} account (${acc.id}) carrying a balance of ₹${acc.balance.toLocaleString('en-IN')} has been dormant for ${acc.dormancyYears} years.\n\nAs per RBI Circular, accounts dormant for 10 years are transferred to the Depositor Education and Awareness Fund (DEAF). Claiming funds back from DEAF requires a lengthy legal process.\n\nIMMEDIATE ACTION REQUIRED:\n➤ Visit ${acc.branch} with your KYC documents\n➤ Call 1800-XXX-XXXX (toll-free, 24/7)\n➤ Email: reactivate@bankname.com\n\nDo not delay.\n\nCompliance & Customer Care`,
      ivr: (acc) => `IMPORTANT MESSAGE for ${acc.name}. Your account ${acc.id} with balance ₹${acc.balance.toLocaleString('en-IN')} is at serious risk of regulatory transfer after ${acc.dormancyYears} years of inactivity. Press 1 to be connected to our emergency reactivation desk. Press 9 to repeat this message.`
    },
    gentle: {
      sms: (acc) => `Hi ${acc.name.split(' ')[0]}, we noticed your ${acc.accountType} account ${acc.id} at ${acc.branch} has been quiet for ${acc.dormancyYears} years. Your ₹${acc.balance.toLocaleString('en-IN')} is safe with us. Just checking in — call 1800-XXX-XXXX anytime.`,
      emailSubject: (acc) => `We Miss You — Your Account ${acc.id} Is Waiting`,
      emailBody: (acc) => `Hello ${acc.name.split(' ')[0]},\n\nIt's been a while! Your ${acc.accountType} account (${acc.id}) at ${acc.branch} has been inactive for ${acc.dormancyYears} years.\n\nYour savings of ₹${acc.balance.toLocaleString('en-IN')} are completely safe with us. We just wanted to reach out and see if you need any help with your account.\n\nWhenever you're ready, we'd love to have you back. You can:\n• Visit us at ${acc.branch}\n• Call anytime: 1800-XXX-XXXX\n\nTake care,\nYour Bank Family`,
      ivr: (acc) => `Hello, ${acc.name}. This is a gentle reminder from your bank. Your account has been inactive for a while and we want to make sure everything is fine. Press 1 to speak with a customer care executive who can help you reactivate your account at your convenience.`
    }
  },
  Hindi: {
    respectful: {
      sms: (acc) => `प्रिय ${acc.name.split(' ')[0]}, आपका ${acc.accountType} खाता (${acc.id}) ${acc.branch} शाखा में ${acc.dormancyYears} वर्षों से निष्क्रिय है। शेष राशि ₹${acc.balance.toLocaleString('en-IN')} है। कृपया खाता पुनः सक्रिय करने हेतु शाखा में पधारें।`,
      emailSubject: (acc) => `महत्वपूर्ण: खाता ${acc.id} पुनः सक्रियण आवश्यक`,
      emailBody: (acc) => `आदरणीय ${acc.name},\n\nआपका ${acc.accountType} खाता (${acc.id}) ${acc.dormancyYears} वर्षों से निष्क्रिय है। आपकी शेष राशि ₹${acc.balance.toLocaleString('en-IN')} पूर्णतः सुरक्षित है।\n\nRBI के निर्देशानुसार, 10 वर्ष से अधिक निष्क्रिय खाते DEAF फंड में स्थानांतरित हो सकते हैं।\n\nकृपया ${acc.branch} शाखा में जाकर अपना खाता पुनः सक्रिय करें।\n\nसादर,\nग्राहक सेवा दल`,
      ivr: (acc) => `नमस्ते ${acc.name} जी। आपका बैंक खाता ${acc.dormancyYears} वर्षों से निष्क्रिय है। आपकी राशि ₹${acc.balance.toLocaleString('en-IN')} सुरक्षित है। प्रतिनिधि से बात करने के लिए 1 दबाएं।`
    },
    direct: {
      sms: (acc) => `${acc.name.split(' ')[0]} जी, खाता ${acc.id} में ₹${acc.balance.toLocaleString('en-IN')} ${acc.dormancyYears} वर्षों से निष्क्रिय। तुरंत ${acc.branch} जाएं या 1800-XXX-XXXX पर कॉल करें।`,
      emailSubject: (acc) => `तत्काल: खाता ${acc.id} पुनः सक्रिय करें`,
      emailBody: (acc) => `${acc.name} जी,\n\nआपका खाता ${acc.dormancyYears} वर्षों से बंद है। ₹${acc.balance.toLocaleString('en-IN')} DEAF फंड में जा सकते हैं।\n\nआज ही ${acc.branch} जाएं।`,
      ivr: (acc) => `${acc.name} जी, आपका खाता ${acc.dormancyYears} वर्षों से निष्क्रिय है। तुरंत सक्रिय करने के लिए 1 दबाएं।`
    },
    urgent: {
      sms: (acc) => `अत्यावश्यक: ${acc.name.split(' ')[0]} जी, ₹${acc.balance.toLocaleString('en-IN')} DEAF में जाने का खतरा! ${acc.dormancyYears} वर्ष निष्क्रिय। तुरंत ${acc.branch} जाएं।`,
      emailSubject: (acc) => `⚠️ अत्यावश्यक: खाता ${acc.id} में ₹${acc.balance.toLocaleString('en-IN')} खतरे में`,
      emailBody: (acc) => `${acc.name} जी,\n\nआपका खाता ${acc.dormancyYears} वर्षों से निष्क्रिय है और ₹${acc.balance.toLocaleString('en-IN')} DEAF फंड में जा सकते हैं। तुरंत ${acc.branch} शाखा में KYC दस्तावेज़ लेकर जाएं।`,
      ivr: (acc) => `${acc.name} जी, तत्काल संदेश। आपका खाता DEAF स्थानांतरण के खतरे में है। तुरंत कार्यवाही के लिए 1 दबाएं।`
    },
    gentle: {
      sms: (acc) => `${acc.name.split(' ')[0]} जी, आपका खाता ${acc.dormancyYears} वर्षों से शांत है। ₹${acc.balance.toLocaleString('en-IN')} सुरक्षित है। जब चाहें 1800-XXX-XXXX पर संपर्क करें।`,
      emailSubject: (acc) => `हम आपको याद कर रहे हैं — खाता ${acc.id}`,
      emailBody: (acc) => `${acc.name.split(' ')[0]} जी,\n\nआपका ${acc.accountType} खाता ${acc.dormancyYears} वर्षों से निष्क्रिय है। आपकी बचत ₹${acc.balance.toLocaleString('en-IN')} पूरी तरह सुरक्षित है।\n\nजब भी सुविधा हो, ${acc.branch} में आएं।\n\nआपका बैंक`,
      ivr: (acc) => `नमस्ते ${acc.name} जी। बस एक सौम्य याद दिलाने के लिए कॉल किया। प्रतिनिधि से बात के लिए 1 दबाएं।`
    }
  }
};

// Simplified templates for other languages
const regionalTemplates = {
  Bengali: {
    sms: (acc, tone) => `প্রিয় ${acc.name.split(' ')[0]}, আপনার ${acc.accountType} অ্যাকাউন্ট (${acc.id}) ${acc.dormancyYears} বছর ধরে নিষ্ক্রিয়। ব্যালেন্স ₹${acc.balance.toLocaleString('en-IN')}। ${acc.branch} শাখায় যোগাযোগ করুন।`,
    emailSubject: (acc) => `গুরুত্বপূর্ণ: অ্যাকাউন্ট ${acc.id} পুনরায় সক্রিয় করুন`,
    emailBody: (acc) => `প্রিয় ${acc.name},\n\nআপনার অ্যাকাউন্ট ${acc.dormancyYears} বছর ধরে নিষ্ক্রিয়। ₹${acc.balance.toLocaleString('en-IN')} সুরক্ষিত আছে। ${acc.branch} শাখায় যোগাযোগ করুন।`,
    ivr: (acc) => `নমস্কার ${acc.name}, আপনার ব্যাংক অ্যাকাউন্ট ${acc.dormancyYears} বছর ধরে নিষ্ক্রিয়। প্রতিনিধির সাথে কথা বলতে ১ চাপুন।`
  },
  Telugu: {
    sms: (acc) => `ప్రియమైన ${acc.name.split(' ')[0]}, మీ ${acc.accountType} ఖాతా (${acc.id}) ${acc.dormancyYears} సంవత్సరాలుగా నిద్రాణంగా ఉంది. బ్యాలెన్స్ ₹${acc.balance.toLocaleString('en-IN')}. ${acc.branch} కి వెళ్ళండి.`,
    emailSubject: (acc) => `ముఖ్యమైనది: ఖాతా ${acc.id} పునః సక్రియం చేయండి`,
    emailBody: (acc) => `ప్రియమైన ${acc.name},\n\nమీ ఖాతా ${acc.dormancyYears} సంవత్సరాలుగా నిద్రాణంగా ఉంది. ₹${acc.balance.toLocaleString('en-IN')} సురక్షితంగా ఉంది. ${acc.branch} బ్రాంచ్‌ని సందర్శించండి.`,
    ivr: (acc) => `నమస్కారం ${acc.name}, మీ బ్యాంక్ ఖాతా ${acc.dormancyYears} సంవత్సరాలుగా నిద్రాణంగా ఉంది. ప్రతినిధితో మాట్లాడటానికి 1 నొక్కండి.`
  },
  Marathi: {
    sms: (acc) => `प्रिय ${acc.name.split(' ')[0]}, तुमचे ${acc.accountType} खाते (${acc.id}) ${acc.dormancyYears} वर्षांपासून निष्क्रिय आहे. शिल्लक ₹${acc.balance.toLocaleString('en-IN')}. ${acc.branch} शाखेला भेट द्या.`,
    emailSubject: (acc) => `महत्त्वाचे: खाते ${acc.id} पुन्हा सक्रिय करा`,
    emailBody: (acc) => `प्रिय ${acc.name},\n\nतुमचे खाते ${acc.dormancyYears} वर्षांपासून निष्क्रिय आहे. ₹${acc.balance.toLocaleString('en-IN')} सुरक्षित आहे. ${acc.branch} शाखेला भेट द्या.`,
    ivr: (acc) => `नमस्कार ${acc.name}, तुमचे बँक खाते ${acc.dormancyYears} वर्षांपासून निष्क्रिय आहे. प्रतिनिधीशी बोलण्यासाठी 1 दाबा.`
  },
  Tamil: {
    sms: (acc) => `அன்பான ${acc.name.split(' ')[0]}, உங்கள் ${acc.accountType} கணக்கு (${acc.id}) ${acc.dormancyYears} ஆண்டுகளாக செயலற்று உள்ளது. இருப்பு ₹${acc.balance.toLocaleString('en-IN')}. ${acc.branch} கிளையை அணுகவும்.`,
    emailSubject: (acc) => `முக்கியமானது: கணக்கு ${acc.id} மீண்டும் செயல்படுத்தவும்`,
    emailBody: (acc) => `அன்பான ${acc.name},\n\nஉங்கள் கணக்கு ${acc.dormancyYears} ஆண்டுகளாக செயலற்று உள்ளது. ₹${acc.balance.toLocaleString('en-IN')} பாதுகாப்பாக உள்ளது. ${acc.branch} கிளையை அணுகவும்.`,
    ivr: (acc) => `வணக்கம் ${acc.name}, உங்கள் வங்கிக் கணக்கு ${acc.dormancyYears} ஆண்டுகளாக செயலற்று உள்ளது. பிரதிநிதியிடம் பேசுவதற்கு 1 அழுத்தவும்.`
  },
  Gujarati: {
    sms: (acc) => `પ્રિય ${acc.name.split(' ')[0]}, તમારું ${acc.accountType} ખાતું (${acc.id}) ${acc.dormancyYears} વર્ષથી નિષ્ક્રિય છે. બેલેન્સ ₹${acc.balance.toLocaleString('en-IN')}. ${acc.branch} શાખામાં જાઓ.`,
    emailSubject: (acc) => `મહત્ત્વપૂર્ણ: ખાતું ${acc.id} ફરી સક્રિય કરો`,
    emailBody: (acc) => `પ્રિય ${acc.name},\n\nતમારું ખાતું ${acc.dormancyYears} વર્ષથી નિષ્ક્રિય છે. ₹${acc.balance.toLocaleString('en-IN')} સુરક્ષિત છે. ${acc.branch} શાખામાં જાઓ.`,
    ivr: (acc) => `નમસ્કાર ${acc.name}, તમારું બેંક ખાતું ${acc.dormancyYears} વર્ષથી નિષ્ક્રિয છે. પ્રતિનિધિ સાથે વાત કરવા 1 દબાવો.`
  },
  Kannada: {
    sms: (acc) => `ಪ್ರಿಯ ${acc.name.split(' ')[0]}, ನಿಮ್ಮ ${acc.accountType} ಖಾತೆ (${acc.id}) ${acc.dormancyYears} ವರ್ಷಗಳಿಂದ ನಿಷ್ಕ್ರಿಯವಾಗಿದೆ. ಬ್ಯಾಲೆನ್ಸ್ ₹${acc.balance.toLocaleString('en-IN')}. ${acc.branch} ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ.`,
    emailSubject: (acc) => `ಮುಖ್ಯ: ಖಾತೆ ${acc.id} ಮರಳಿ ಸಕ್ರಿಯಗೊಳಿಸಿ`,
    emailBody: (acc) => `ಪ್ರಿಯ ${acc.name},\n\nನಿಮ್ಮ ಖಾತೆ ${acc.dormancyYears} ವರ್ಷಗಳಿಂದ ನಿಷ್ಕ್ರಿಯವಾಗಿದೆ. ₹${acc.balance.toLocaleString('en-IN')} ಸುರಕ್ಷಿತವಾಗಿದೆ. ${acc.branch} ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ.`,
    ivr: (acc) => `ನಮಸ್ಕಾರ ${acc.name}, ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ${acc.dormancyYears} ವರ್ಷಗಳಿಂದ ನಿಷ್ಕ್ರಿಯವಾಗಿದೆ. ಪ್ರತಿನಿಧಿಯೊಂದಿಗೆ ಮಾತನಾಡಲು 1 ಒತ್ತಿರಿ.`
  }
};

function selectTone(account) {
  if (account.age > 60) return 'respectful';
  if (account.dormancyYears >= 8 || account.balance > 500000) return 'urgent';
  if (account.age >= 18 && account.age <= 35) return 'direct';
  if (account.engagementScore < 0.3) return 'gentle';
  return 'direct';
}

function selectLanguage(account) {
  const { regionType, preferredLanguage, engagementScore } = account;
  if (regionType === 'URBAN') {
    return engagementScore < 0.25 ? preferredLanguage : 'English';
  } else {
    return engagementScore > 0.7 ? 'English' : (preferredLanguage || 'Hindi');
  }
}

function generateMessages(account) {
  const tone = selectTone(account);
  const language = selectLanguage(account);

  let templates;
  if (language === 'English' || language === 'Hindi') {
    templates = messages[language]?.[tone] || messages['English']['direct'];
  } else {
    templates = regionalTemplates[language] || regionalTemplates['Telugu'];
  }

  // Track stats
  if (store.languageStats[language]) {
    store.languageStats[language].sent++;
  }
  if (store.toneStats[tone]) {
    store.toneStats[tone].sent++;
  }

  const sms = templates.sms ? templates.sms(account, tone) : `Contact ${account.name} at ${account.branch}`;
  const emailSubject = templates.emailSubject ? templates.emailSubject(account) : `Account Reactivation Notice — ${account.id}`;
  const emailBody = templates.emailBody ? templates.emailBody(account) : `Dear ${account.name}, please reactivate your account.`;
  const ivr = templates.ivr ? templates.ivr(account) : `Hello ${account.name.split(' ')[0]}, this is your bank. Please contact us.`;

  return { sms, emailSubject, emailBody, ivrScript: ivr, tone, languageUsed: language };
}

module.exports = { generateMessages, selectTone, selectLanguage };
