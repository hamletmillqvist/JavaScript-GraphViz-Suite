import { findNodes, removeNode } from "./dom";
import { isString, toArray } from "./utils";
const HTML_ATTR_LIST_RX = new RegExp('^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' +
    'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' +
    'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' +
    'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' +
    'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' +
    'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)', 'g');
const SVG_ATTR_LIST_RX = new RegExp('^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' +
    'baseProfile|bbox|begin|by|calcMode|cap-height|class|color|color-rendering|content|' +
    'cx|cy|d|dx|dy|descent|display|dur|end|fill|fill-rule|font-family|font-size|font-stretch|' +
    'font-style|font-variant|font-weight|from|fx|fy|g1|g2|glyph-name|gradientUnits|hanging|' +
    'height|horiz-adv-x|horiz-origin-x|ideographic|k|keyPoints|keySplines|keyTimes|lang|' +
    'marker-end|marker-mid|marker-start|markerHeight|markerUnits|markerWidth|mathematical|' +
    'max|min|offset|opacity|orient|origin|overline-position|overline-thickness|panose-1|' +
    'path|pathLength|points|preserveAspectRatio|r|refX|refY|repeatCount|repeatDur|' +
    'requiredExtensions|requiredFeatures|restart|rotate|rx|ry|slope|stemh|stemv|stop-color|' +
    'stop-opacity|strikethrough-position|strikethrough-thickness|stroke|stroke-dasharray|' +
    'stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|' +
    'stroke-width|systemLanguage|target|text-anchor|to|transform|type|u1|u2|underline-position|' +
    'underline-thickness|unicode|unicode-range|units-per-em|values|version|viewBox|visibility|' +
    'width|widths|x|x-height|x1|x2|xlink:actuate|xlink:arcrole|xlink:role|xlink:show|xlink:title|' +
    'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)', 'g');
const DEFAULT_TAG_DENY_LIST = [
    'script',
    'iframe',
    'textarea',
    'form',
    'button',
    'select',
    'input',
    'meta',
    'style',
    'link',
    'title',
    'embed',
    'object',
];
const XSS_ATTR_RX = /href|src|background/gi;
const XSS_VALUE_RX = /((java|vb|live)script|x):/gi;
const ON_EVENT_RX = /^on\S+/;
export function sanitizeHTML(html) {
    const root = document.createElement('div');
    if (isString(html)) {
        html = html.replace(/<!--[\s\S]*?-->/g, '');
        root.innerHTML = html;
    }
    else {
        root.appendChild(html);
    }
    removeUnnecessaryTags(root);
    leaveOnlyWhitelistAttribute(root);
    return root.innerHTML;
}
function removeUnnecessaryTags(html) {
    const removedTags = findNodes(html, DEFAULT_TAG_DENY_LIST.join(','));
    removedTags.forEach((node) => {
        removeNode(node);
    });
}
function isXSSAttribute(attrName, attrValue) {
    return attrName.match(XSS_ATTR_RX) && attrValue.match(XSS_VALUE_RX);
}
function removeBlacklistAttributes(node, blacklistAttrs) {
    blacklistAttrs.forEach(({ name }) => {
        if (ON_EVENT_RX.test(name)) {
            node[name] = null;
        }
        if (node.getAttribute(name)) {
            node.removeAttribute(name);
        }
    });
}
function leaveOnlyWhitelistAttribute(html) {
    findNodes(html, '*').forEach((node) => {
        const { attributes } = node;
        const blacklist = toArray(attributes).filter((attr) => {
            const { name, value } = attr;
            const htmlAttr = name.match(HTML_ATTR_LIST_RX);
            const svgAttr = name.match(SVG_ATTR_LIST_RX);
            const xssAttr = htmlAttr && isXSSAttribute(name, value);
            return (!htmlAttr && !svgAttr) || xssAttr;
        });
        removeBlacklistAttributes(node, blacklist);
    });
}
