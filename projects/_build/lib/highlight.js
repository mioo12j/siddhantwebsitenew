/* ═══════════════════════════════════════════════════════════════════
   highlight.js — build-time syntax highlighting.

   Tokenising at build time means documentation pages ship zero
   highlighting JavaScript: the coloured markup is already in the HTML,
   which keeps Largest Contentful Paint and Total Blocking Time low.

   Supported: cpp/ino, python, bash, json, yaml, javascript, sql, html.
════════════════════════════════════════════════════════════════════ */
'use strict';

const KEYWORDS = {
  cpp: ['alignas', 'auto', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'constexpr', 'continue', 'default', 'delete', 'do', 'double', 'else', 'enum', 'explicit', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'int8_t', 'int16_t', 'int32_t', 'int64_t', 'long', 'namespace', 'new', 'nullptr', 'operator', 'private', 'protected', 'public', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef', 'typename', 'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'while', 'String', 'size_t'],
  python: ['and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield', 'self'],
  javascript: ['async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'of', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'undefined', 'var', 'void', 'while', 'yield'],
  bash: ['if', 'then', 'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'case', 'esac', 'function', 'return', 'export', 'local', 'source', 'sudo', 'apt', 'pip', 'pip3', 'python3', 'docker', 'git', 'cd', 'mkdir', 'echo', 'cat', 'chmod', 'systemctl', 'curl', 'wget', 'npm'],
  sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'JOIN', 'LEFT', 'INNER', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'AND', 'OR', 'NOT', 'NULL', 'AS', 'ON'],
};

const ALIAS = { ino: 'cpp', arduino: 'cpp', c: 'cpp', 'c++': 'cpp', py: 'python', js: 'javascript', sh: 'bash', shell: 'bash', console: 'bash', text: 'plain', txt: 'plain', ini: 'yaml', toml: 'yaml' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Tokenise one line, protecting strings and comments first. */
function line(src, lang) {
  const out = [];
  let i = 0;
  const kw = KEYWORDS[lang] || [];
  const kwSet = new Set(kw);
  const push = (cls, text) => out.push(cls ? `<span class="tok-${cls}">${esc(text)}</span>` : esc(text));

  const lineComment = lang === 'python' || lang === 'bash' || lang === 'yaml' ? '#' : '//';

  while (i < src.length) {
    const rest = src.slice(i);

    /* comments to end of line */
    if (rest.startsWith(lineComment)) { push('c', rest); break; }
    if (lang === 'cpp' && rest.startsWith('/*')) {
      const end = rest.indexOf('*/');
      const seg = end === -1 ? rest : rest.slice(0, end + 2);
      push('c', seg); i += seg.length; continue;
    }
    if (lang === 'sql' && rest.startsWith('--')) { push('c', rest); break; }

    /* preprocessor */
    if (lang === 'cpp' && /^\s*#\w/.test(src) && i === 0) {
      const m = src.match(/^(\s*#\s*\w+)/);
      push('p', m[1]); i += m[1].length; continue;
    }

    /* strings */
    const q = rest[0];
    if (q === '"' || q === "'" || q === '`') {
      let j = 1;
      while (j < rest.length) {
        if (rest[j] === '\\') { j += 2; continue; }
        if (rest[j] === q) { j++; break; }
        j++;
      }
      push('s', rest.slice(0, j)); i += j; continue;
    }

    /* numbers */
    let m = rest.match(/^(0[xX][0-9a-fA-F]+|0[bB][01]+|\d+\.?\d*([eE][-+]?\d+)?)/);
    if (m && !/[\w$]/.test(src[i - 1] || '')) { push('n', m[1]); i += m[1].length; continue; }

    /* identifiers */
    m = rest.match(/^[A-Za-z_$][\w$]*/);
    if (m) {
      const word = m[1] || m[0];
      const after = rest.slice(word.length).match(/^\s*\(/);
      if (kwSet.has(word)) push('k', word);
      else if (after) push('f', word);
      else if (/^[A-Z][A-Za-z0-9_]*$/.test(word) && lang !== 'bash') push('t', word);
      else push(null, word);
      i += word.length; continue;
    }

    /* operators / punctuation */
    m = rest.match(/^[+\-*/%=<>!&|^~?:;,.[\]{}()@]+/);
    if (m) { push('o', m[0]); i += m[0].length; continue; }

    push(null, rest[0]); i += 1;
  }
  return out.join('');
}

function jsonLine(src) {
  return esc(src)
    .replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="tok-t">$1</span>$2')
    .replace(/:\s*(&quot;.*?&quot;)/g, ': <span class="tok-s">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="tok-k">$1</span>')
    .replace(/(:\s*)(-?\d+\.?\d*)/g, '$1<span class="tok-n">$2</span>');
}

function yamlLine(src) {
  const c = src.indexOf('#');
  if (c === 0 || (c > 0 && !/["']/.test(src.slice(0, c)))) {
    return yamlLine(src.slice(0, c)) + `<span class="tok-c">${esc(src.slice(c))}</span>`;
  }
  return esc(src)
    .replace(/^(\s*-?\s*)([\w.\-/]+)(\s*:)/, '$1<span class="tok-t">$2</span>$3')
    .replace(/(:\s+)(.+)$/, (all, a, b) => a + `<span class="tok-s">${b}</span>`);
}

function highlight(code, langRaw) {
  const lang = ALIAS[String(langRaw || '').toLowerCase()] || String(langRaw || 'plain').toLowerCase();
  const lines = String(code).replace(/\t/g, '  ').split('\n');
  if (lang === 'plain') return lines.map(esc).join('\n');
  if (lang === 'json') return lines.map(jsonLine).join('\n');
  if (lang === 'yaml') return lines.map(yamlLine).join('\n');
  if (lang === 'html') {
    return lines.map(l => esc(l)
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tok-t">$2</span>')
      .replace(/([\w-]+)(=)(&quot;.*?&quot;)/g, '<span class="tok-f">$1</span>$2<span class="tok-s">$3</span>')
    ).join('\n');
  }
  /* multi-line C block comments need cross-line state */
  if (lang === 'cpp') {
    let inBlock = false;
    return lines.map(l => {
      if (inBlock) {
        const end = l.indexOf('*/');
        if (end === -1) return `<span class="tok-c">${esc(l)}</span>`;
        inBlock = false;
        return `<span class="tok-c">${esc(l.slice(0, end + 2))}</span>` + line(l.slice(end + 2), lang);
      }
      const open = l.indexOf('/*');
      if (open !== -1 && l.indexOf('*/', open) === -1) {
        inBlock = true;
        return line(l.slice(0, open), lang) + `<span class="tok-c">${esc(l.slice(open))}</span>`;
      }
      return line(l, lang);
    }).join('\n');
  }
  /* python triple-quoted docstrings */
  if (lang === 'python') {
    let inDoc = false, delim = '';
    return lines.map(l => {
      if (inDoc) {
        if (l.includes(delim)) { inDoc = false; }
        return `<span class="tok-s">${esc(l)}</span>`;
      }
      const m = l.match(/("""|''')/);
      if (m) {
        const rest = l.slice(l.indexOf(m[1]) + 3);
        if (!rest.includes(m[1])) { inDoc = true; delim = m[1]; return `<span class="tok-s">${esc(l)}</span>`; }
      }
      return line(l, lang);
    }).join('\n');
  }
  return lines.map(l => line(l, lang)).join('\n');
}

module.exports = { highlight, esc };
