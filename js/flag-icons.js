/**
 * Flag Icons Utility
 * Replaces flag emoji characters (which don't render on Windows) with flag images from flagcdn.com
 */
(function () {
    const FLAG_SIZE = '24x18';
    const FLAG_BASE = 'https://flagcdn.com/' + FLAG_SIZE;
    const FLAG_REGEX = /(\uD83C[\uDDE6-\uDDFF])(\uD83C[\uDDE6-\uDDFF])/g;

    function regionalIndicatorToLetter(ch) {
        const code = ch.codePointAt(0);
        return String.fromCharCode(code - 0x1F1E6 + 65);
    }

    function flagEmojiToCode(emoji) {
        if (!emoji) return null;
        var chars = Array.from(emoji);
        if (chars.length !== 2) return null;
        var a = regionalIndicatorToLetter(chars[0]);
        var b = regionalIndicatorToLetter(chars[1]);
        if (!a || !b) return null;
        return (a + b).toLowerCase();
    }

    function createFlagImg(countryCode, alt) {
        var img = document.createElement('img');
        img.src = FLAG_BASE + '/' + countryCode + '.png';
        img.alt = alt || countryCode.toUpperCase();
        img.className = 'flag-icon';
        img.width = 20;
        img.height = 15;
        img.loading = 'lazy';
        img.style.cssText = 'display:inline-block;vertical-align:middle;width:20px;height:15px;object-fit:cover;border-radius:2px;flex-shrink:0';
        return img;
    }

    function replaceFlagEmojisInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            var text = node.textContent;
            FLAG_REGEX.lastIndex = 0;
            if (!FLAG_REGEX.test(text)) return;
            FLAG_REGEX.lastIndex = 0;
            var frag = document.createDocumentFragment();
            var lastIndex = 0;
            var match;
            while ((match = FLAG_REGEX.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                }
                var code = flagEmojiToCode(match[0]);
                if (code) {
                    frag.appendChild(createFlagImg(code));
                } else {
                    frag.appendChild(document.createTextNode(match[0]));
                }
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < text.length) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex)));
            }
            if (node.parentNode) {
                node.parentNode.replaceChild(frag, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
            var children = Array.prototype.slice.call(node.childNodes);
            children.forEach(replaceFlagEmojisInNode);
        }
    }

    function replaceAllFlagEmojis() {
        if (document.body) {
            replaceFlagEmojisInNode(document.body);
        }
    }

    // Disabled automatic replacement - dropdowns.js handles icon normalization
    // if (document.body) {
    //     replaceAllFlagEmojis();
    // }
    // if (document.readyState === 'loading') {
    //     document.addEventListener('DOMContentLoaded', replaceAllFlagEmojis);
    // } else {
    //     replaceAllFlagEmojis();
    // }
    // setTimeout(replaceAllFlagEmojis, 50);
    // setTimeout(replaceAllFlagEmojis, 200);

    window.replaceFlagEmojis = replaceFlagEmojisInNode;
    window.replaceAllFlagEmojis = replaceAllFlagEmojis;
    window.createFlagImg = createFlagImg;
    window.flagEmojiToCode = flagEmojiToCode;
})();
