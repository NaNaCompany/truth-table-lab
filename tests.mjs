import assert from 'node:assert/strict';
import {analyze,parse} from './dist/core.js';
import fs from 'node:fs';
import {catalogs} from './dist/i18n.js';
assert.deepEqual(analyze('A ^ B').rows.map(r=>r.value),[0,1,1,0]);
assert.deepEqual(analyze('A -> B').rows.map(r=>r.value),[1,1,0,1]);
assert.equal(analyze('A | !A').sop,'1');assert.equal(analyze('A & !A').sop,'0');
assert.equal(analyze('(A & B) | (A & !B)').sop,'A');
assert.deepEqual(analyze('!(A & B)').rows.map(r=>r.value),[1,1,1,0]);
assert.deepEqual(analyze('A | B & C').rows.map(r=>r.value),[0,0,0,1,1,1,1,1]);
assert.deepEqual(analyze('A -> B -> C').rows.map(r=>r.value),[1,1,1,1,1,1,0,1]);
for(const s of ['', 'A + B','A B','(A','A &','alert(1)','A|B|C|D|E|F|G','A;fetch(1)'])assert.throws(()=>parse(s));
function sopValue(s,env){if(s==='0'||s==='1')return Number(s);return Number(s.split('|').some(term=>term.replaceAll(/[()]/g,'').trim().split('&').every(literal=>{const l=literal.trim();return l.startsWith('!')?!env[l.slice(1)]:!!env[l];})));}
for(const s of ['A ^ B ^ C','(A & B) | (!A & C)','A <-> (B | C)','(A|B)&(!C|D)','A ^ B ^ C ^ D ^ E ^ F']){const a=analyze(s);for(const r of a.rows){const env=Object.fromEntries(a.variables.map((v,i)=>[v,r.bits[i]]));assert.equal(sopValue(a.sop,env),r.value);}}
for(const [lang,c]of Object.entries(catalogs)){assert.deepEqual(Object.keys(c).sort(),Object.keys(catalogs.ko).sort());const page=fs.readFileSync(`dist/${lang==='ko'?'':lang+'/'}index.html`,'utf8');assert.ok(page.includes(`lang="${lang}"`));for(const match of page.matchAll(/data-t="([^"]+)"/g))assert.ok(c[match[1]]);}
console.log('PASS: 7 known truth fixtures, 8 invalid inputs, 5 equivalent SOP fixtures including 64 rows, 6 complete locale catalogs/routes.');
