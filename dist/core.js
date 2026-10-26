export class LogicError extends Error { constructor(code,pos=0){super(code);this.code=code;this.pos=pos;} }
const words={NOT:'!',AND:'&',XOR:'^',OR:'|',IMPLIES:'->',IFF:'<->'};
export function parse(source){
 if(!source.trim())throw new LogicError('empty');
 if(source.length>300)throw new LogicError('long');
 const tokens=[];let i=0;
 while(i<source.length){if(/\s/.test(source[i])){i++;continue;}let p=i,s=source.slice(i),m=s.match(/^(<->|->|&&|\|\||[!~¬&∧^⊕|∨→↔()01])/);if(m){let x=m[0];tokens.push({v:({'~':'!','¬':'!','&&':'&','∧':'&','⊕':'^','||':'|','∨':'|','→':'->','↔':'<->'})[x]||x,p});i+=x.length;continue;}m=s.match(/^[A-Za-z][A-Za-z0-9_]{0,15}/);if(m){tokens.push({v:words[m[0].toUpperCase()]||m[0],p});i+=m[0].length;continue;}throw new LogicError('token',p+1);}
 let at=0;const vars=new Set();const peek=()=>tokens[at]?.v;
 function atom(){let t=tokens[at++];if(!t)throw new LogicError('expected',source.length+1);if(t.v==='!')return {op:'!',a:atom()};if(t.v==='('){const a=iff();if(peek()!==')')throw new LogicError('paren',t.p+1);at++;return a;}if(t.v==='0'||t.v==='1')return {value:+t.v};if(/^[A-Za-z]/.test(t.v)){vars.add(t.v);return {name:t.v};}throw new LogicError('expected',t.p+1);}
 function chain(next,op){let a=next();while(peek()===op){at++;a={op,a,b:next()};}return a;}
 const and=()=>chain(atom,'&'),xor=()=>chain(and,'^'),or=()=>chain(xor,'|');
 function implies(){let a=or();if(peek()==='->'){at++;a={op:'->',a,b:implies()};}return a;}
 const iff=()=>chain(implies,'<->');const ast=iff();if(at<tokens.length)throw new LogicError('extra',tokens[at].p+1);if(vars.size>6)throw new LogicError('variables');return {ast,variables:[...vars].sort()};
}
export function evaluate(n,env){if('value'in n)return n.value;if(n.name)return env[n.name];const a=evaluate(n.a,env);if(n.op==='!')return 1-a;const b=evaluate(n.b,env);return {'&':()=>a&b,'|':()=>a|b,'^':()=>a^b,'->':()=>Number(!a||b),'<->':()=>Number(a===b)}[n.op]();}
export function analyze(source){const {ast,variables}=parse(source),rows=[];for(let i=0;i<2**variables.length;i++){const bits=variables.map((_,j)=>(i>>(variables.length-j-1))&1);rows.push({bits,value:evaluate(ast,Object.fromEntries(variables.map((v,j)=>[v,bits[j]])))});}return {variables,rows,sop:simplify(variables,rows)};}
export function simplify(vars,rows){const ones=rows.filter(r=>r.value).map(r=>r.bits.join(''));if(!ones.length)return '0';if(ones.length===rows.length)return '1';let current=new Set(ones),primes=new Set();while(current.size){let next=new Set(),used=new Set(),list=[...current];for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){let diff=-1,valid=true;for(let k=0;k<list[i].length;k++)if(list[i][k]!==list[j][k]){if(diff>=0||list[i][k]==='-'||list[j][k]==='-'){valid=false;break;}diff=k;}if(valid&&diff>=0){used.add(list[i]);used.add(list[j]);next.add(list[i].slice(0,diff)+'-'+list[i].slice(diff+1));}}for(const p of current)if(!used.has(p))primes.add(p);current=next;}
 const covers=(p,m)=>[...p].every((c,i)=>c==='-'||c===m[i]);let uncovered=new Set(ones),chosen=new Set();for(const m of ones){let candidates=[...primes].filter(p=>covers(p,m));if(candidates.length===1)chosen.add(candidates[0]);}for(const p of chosen)for(const m of uncovered)if(covers(p,m))uncovered.delete(m);while(uncovered.size){let best=[...primes].sort((a,b)=>[...uncovered].filter(m=>covers(b,m)).length-[...uncovered].filter(m=>covers(a,m)).length||a.replaceAll('-','').length-b.replaceAll('-','').length||a.localeCompare(b))[0];chosen.add(best);for(const m of uncovered)if(covers(best,m))uncovered.delete(m);}
 return [...chosen].map(p=>[...p].flatMap((c,i)=>c==='-'?[]:[(c==='0'?'!':'')+vars[i]]).join(' & ')).map(t=>chosen.size>1?'('+t+')':t).join(' | ');
}
