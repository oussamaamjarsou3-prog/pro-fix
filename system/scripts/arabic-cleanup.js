const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../data/noticias');

const replacements = [
    // Engineering / source names (longest first)
    { from: 'BMW M Engineering', to: 'هندسة بي إم دبليو أم' },
    { from: 'Porsche Engineering', to: 'هندسة بورش' },
    { from: 'Tesla Engineering', to: 'هندسة تسلا' },
    { from: 'Audi Sport', to: 'أودي سبورت' },
    { from: 'Motor Trend', to: 'موتور تريند' },
    { from: 'Car and Driver', to: 'كار آند درايفر' },
    { from: 'Motor1', to: 'موتور 1' },
    { from: 'Autocar', to: 'أوتوكار' },
    { from: 'Top Gear', to: 'توب جير' },
    { from: 'CarSpecio', to: 'كار سبيسيو' },

    // Full brand + model phrases
    { from: 'Audi RS7 Performance 2026', to: 'أودي آر أس 7 بيرفورمانس 2026' },
    { from: 'Audi RS7 Sportback', to: 'أودي آر أس 7 سبورت باك' },
    { from: 'Audi RS7', to: 'أودي آر أس 7' },
    { from: 'BMW M5 PHEV', to: 'بي إم دبليو أم 5 هجين قابل للشحن' },
    { from: 'BMW M5', to: 'بي إم دبليو أم 5' },
    { from: 'BMW i7', to: 'بي إم دبليو أي 7' },
    { from: 'Mercedes-AMG GT 4-door', to: 'مرسيدس-أي أم جي جي تي بأربعة أبواب' },
    { from: 'Mercedes-AMG GT', to: 'مرسيدس-أي أم جي جي تي' },
    { from: 'Nissan GT-R Final Edition', to: 'نيسان جي تي آر نسخة النهاية' },
    { from: 'Nissan GT-R Premium', to: 'نيسان جي تي آر بريميوم' },
    { from: 'Nissan GT-R R35', to: 'نيسان جي تي آر آر 35' },
    { from: 'Nissan GT-R', to: 'نيسان جي تي آر' },
    { from: 'Porsche 911 GTS T-Hybrid', to: 'بورش 911 جي تي أس تي-هايبريد' },
    { from: 'Porsche 911', to: 'بورش 911' },
    { from: 'Tesla Model S Plaid refresh', to: 'تسلا موديل أس بليد مجددة' },
    { from: 'Tesla Model S Plaid', to: 'تسلا موديل أس بليد' },
    { from: 'Tesla Model S', to: 'تسلا موديل أس' },
    { from: 'Ferrari 296 GTB', to: 'فيراري 296 جي تي بي' },
    { from: 'McLaren Artura', to: 'ماكلارين أرتورا' },
    { from: 'Toyota GR Supra', to: 'تويوتا جي آر سوبرا' },
    { from: 'Porsche Taycan', to: 'بورش تايكان' },
    { from: 'Mercedes EQS', to: 'مرسيدس أي كيو أس' },
    { from: 'Lucid Air', to: 'لوسيد آير' },
    { from: 'Porsche Panamera Turbo S E-Hybrid', to: 'بورش باناميرا توربو أس إي هايبريد' },
    { from: 'Porsche Panamera', to: 'بورش باناميرا' },
    { from: 'AMG GT 63 S E Performance', to: 'أي أم جي جي تي 63 أس إي بيرفورمانس' },
    { from: 'AMG GT 63 S E', to: 'أي أم جي جي تي 63 أس إي' },
    { from: 'GT 63 S E', to: 'جي تي 63 أس إي' },

    // Model phrases without brand
    { from: 'RS7 Performance', to: 'آر أس 7 بيرفورمانس' },
    { from: 'RS7 Sportback', to: 'آر أس 7 سبورت باك' },
    { from: 'RS7', to: 'آر أس 7' },
    { from: 'M5 PHEV', to: 'أم 5 هجين قابل للشحن' },
    { from: 'M5', to: 'أم 5' },
    { from: 'AMG GT 4-door', to: 'أي أم جي جي تي بأربعة أبواب' },
    { from: 'AMG GT', to: 'أي أم جي جي تي' },
    { from: 'GT-R Final Edition', to: 'جي تي آر نسخة النهاية' },
    { from: 'GT-R Premium', to: 'جي تي آر بريميوم' },
    { from: 'GT-R R35', to: 'جي تي آر آر 35' },
    { from: 'GT-R', to: 'جي تي آر' },
    { from: '911 GTS T-Hybrid', to: '911 جي تي أس تي-هايبريد' },
    { from: 'GTS T-Hybrid', to: 'جي تي أس تي-هايبريد' },
    { from: 'Model S Plaid refresh', to: 'موديل أس بليد مجددة' },
    { from: 'Model S Plaid', to: 'موديل أس بليد' },
    { from: 'Model S', to: 'موديل أس' },
    { from: 'Plaid refresh', to: 'بليد مجددة' },

    // Brand names
    { from: 'Audi', to: 'أودي' },
    { from: 'BMW', to: 'بي إم دبليو' },
    { from: 'Mercedes-AMG', to: 'مرسيدس-أي أم جي' },
    { from: 'Mercedes', to: 'مرسيدس' },
    { from: 'AMG', to: 'أي أم جي' },
    { from: 'Nissan', to: 'نيسان' },
    { from: 'Porsche', to: 'بورش' },
    { from: 'Tesla', to: 'تسلا' },
    { from: 'Ferrari', to: 'فيراري' },
    { from: 'McLaren', to: 'ماكلارين' },
    { from: 'Toyota', to: 'تويوتا' },
    { from: 'Lucid', to: 'لوسيد' },

    // Specific model / variant terms
    { from: 'Sportback', to: 'سبورت باك' },
    { from: 'Performance', to: 'بيرفورمانس' },
    { from: 'Quattro', to: 'كواترو' },
    { from: 'RS Dynamic', to: 'آر أس دايناميك' },
    { from: 'Competition', to: 'كومبيتيشن' },
    { from: 'M xDrive', to: 'أم إكس درايف' },
    { from: 'M Steptronic', to: 'أم ستيبترونيك' },
    { from: 'S63', to: 'إس 63' },
    { from: 'ZF', to: 'زد أف' },
    { from: 'F90', to: 'أف 90' },
    { from: 'E28', to: 'إي 28' },
    { from: 'Turbo S E-Hybrid', to: 'توربو أس إي هايبريد' },
    { from: 'S E-Hybrid', to: 'أس إي هايبريد' },
    { from: 'Panamera', to: 'باناميرا' },
    { from: 'Carrera GTS', to: 'كاريرا جي تي أس' },
    { from: 'Carrera S', to: 'كاريرا أس' },
    { from: '911 Carrera S', to: '911 كاريرا أس' },
    { from: '911 S', to: '911 أس' },
    { from: '4S', to: '4 أس' },
    { from: 'Carrera', to: 'كاريرا' },
    { from: 'GTS', to: 'جي تي أس' },
    { from: 'T-Hybrid', to: 'تي-هايبريد' },
    { from: 'PDK', to: 'بي دي كي' },
    { from: 'Spyder', to: 'سبايدر' },
    { from: 'Turbo', to: 'توربو' },
    { from: 'Plaid', to: 'بليد' },
    { from: 'Nismo Heritage', to: 'تراث نيسمو' },
    { from: 'Nismo', to: 'نيسمو' },
    { from: 'Final Edition', to: 'نسخة النهاية' },
    { from: 'Track Edition', to: 'نسخة المسار' },
    { from: 'Premium', to: 'بريميوم' },
    { from: 'takumi', to: 'تاكومي' },
    { from: 'VR38DETT 3.8 V6', to: 'محرك في آر 38 ديتي 3.8 لتر في 6' },
    { from: 'VR38DETT V6', to: 'محرك في آر 38 ديتي في 6' },
    { from: 'VR38DETT', to: 'في آر 38 ديتي' },
    { from: 'R35', to: 'آر 35' },
    { from: 'ATTESA E-TS', to: 'أتيسا إي-تي أس' },
    { from: 'DCT', to: 'ناقل حركة مزدوج القابض' },
    { from: 'Taycan', to: 'تايكان' },
    { from: 'EQS', to: 'أي كيو أس' },
    { from: 'i7', to: 'أي 7' },
    { from: 'MBUX', to: 'إم بي يو إكس' },
    { from: 'Apple CarPlay', to: 'آبل كاربلاي' },
    { from: 'Android Auto', to: 'أندرويد أوتو' },

    // Common technical terms
    { from: 'PHEV', to: 'هجين قابل للشحن' },
    { from: 'GT', to: 'جي تي' },
    { from: 'V8 4.0 TFSI', to: 'محرك في 8 سعة 4.0 لتر تي أف أس آي' },
    { from: '4.0 TFSI V8', to: 'محرك تي أف أس آي 4.0 لتر في 8' },
    { from: '4.0 TFSI', to: 'تي أف أس آي 4.0 لتر' },
    { from: 'TFSI V8', to: 'تي أف أس آي في 8' },
    { from: 'TFSI', to: 'تي أف أس آي' },
    { from: 'V8', to: 'في 8' },
    { from: 'V6', to: 'في 6' },
    { from: 'V4 Superchargers', to: 'شواحن في 4 السريعة' },
    { from: 'V4 Supercharger', to: 'شاحن في 4 السريع' },
    { from: 'V4', to: 'في 4' },
    { from: 'V3', to: 'في 3' },
    { from: 'biturbo', to: 'مزدوج التوربين' },
    { from: 'wallbox', to: 'صندوق الشحن المنزلي' },

    // Standalone words that were not caught above
    { from: 'Final', to: 'النهاية' },
    { from: 'CS', to: 'سي أس' },
    { from: 'V', to: 'في' },
    { from: 'E', to: 'إي' },
    { from: 'S', to: 'أس' }
];

function replaceInString(str) {
    if (typeof str !== 'string') return str;
    let result = str;
    for (const { from, to } of replacements) {
        // Replace whole words/phrases only, case-insensitive
        const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'giu');
        result = result.replace(regex, to);
    }
    return result;
}

function replaceInValue(value) {
    if (typeof value === 'string') return replaceInString(value);
    if (Array.isArray(value)) return value.map(replaceInValue);
    if (value && typeof value === 'object') {
        const obj = {};
        for (const key of Object.keys(value)) {
            obj[key] = replaceInValue(value[key]);
        }
        return obj;
    }
    return value;
}

function processArticle(file) {
    const filePath = path.join(ARTICLES_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.translations || !data.translations.ar) return;
    data.translations.ar = replaceInValue(data.translations.ar);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    console.log(`✅ Cleaned Arabic: ${file}`);
}

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
files.forEach(processArticle);
console.log('✅ Arabic cleanup completed');
