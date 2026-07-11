const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/rs7-2026.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function countWords(str) {
    if (!str || typeof str !== 'string') return 0;
    return str.split(/\s+/).filter(w => w.length > 0).length;
}

function countWordsInObj(obj, total = { es: 0, en: 0, fr: 0, ar: 0 }) {
    if (!obj) return total;
    if (typeof obj === 'string') {
        total.es += countWords(obj);
        return total;
    }
    if (Array.isArray(obj)) {
        obj.forEach(item => countWordsInObj(item, total));
        return total;
    }
    if (typeof obj === 'object') {
        for (const [key, val] of Object.entries(obj)) {
            if (key === 'es' || key === 'en' || key === 'fr' || key === 'ar') {
                const subtotal = { es: 0, en: 0, fr: 0, ar: 0 };
                countWordsInObj(val, subtotal);
                total[key] += subtotal.es + subtotal.en + subtotal.fr + subtotal.ar;
            } else {
                countWordsInObj(val, total);
            }
        }
        return total;
    }
    return total;
}

const newSections = ['review', 'drivingExperience', 'exteriorDesign', 'interior', 'technology', 'safety', 'runningCosts', 'ownership'];
const coverage = [];
let totalNewWords = { es: 0, en: 0, fr: 0, ar: 0 };

newSections.forEach(section => {
    const sectionData = data[section];
    const hasData = !!sectionData && (typeof sectionData === 'object' ? Object.keys(sectionData).length > 0 : !!sectionData);
    const words = countWordsInObj(sectionData);
    totalNewWords.es += words.es;
    totalNewWords.en += words.en;
    totalNewWords.fr += words.fr;
    totalNewWords.ar += words.ar;
    coverage.push({
        section,
        populated: hasData,
        wordsEs: words.es,
        wordsEn: words.en,
        wordsFr: words.fr,
        wordsAr: words.ar
    });
});

// Count pageText words per language
const pageTextWords = { es: 0, en: 0, fr: 0, ar: 0 };
if (data.pageText) {
    for (const lang of ['es', 'en', 'fr', 'ar']) {
        const langWords = { es: 0, en: 0, fr: 0, ar: 0 };
        countWordsInObj(data.pageText[lang], langWords);
        pageTextWords[lang] = langWords.es + langWords.en + langWords.fr + langWords.ar;
    }
}

// Related models
const relatedPopulated = data.relatedModels && data.relatedModels.length >= 3;

// Summary
const report = {
    car: data.id,
    coverage,
    relatedModelsPopulated: relatedPopulated,
    relatedModelsCount: (data.relatedModels || []).length,
    totalNewContentWords: totalNewWords,
    pageTextWords,
    grandTotal: {
        es: totalNewWords.es + pageTextWords.es,
        en: totalNewWords.en + pageTextWords.en,
        fr: totalNewWords.fr + pageTextWords.fr,
        ar: totalNewWords.ar + pageTextWords.ar
    }
};

console.log(JSON.stringify(report, null, 2));
