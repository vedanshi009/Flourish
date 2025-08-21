var u=(t,e,n)=>new Promise((o,s)=>{var i=c=>{try{r(n.next(c))}catch(f){s(f)}},a=c=>{try{r(n.throw(c))}catch(f){s(f)}},r=c=>c.done?o(c.value):Promise.resolve(c.value).then(i,a);r((n=n.apply(t,e)).next())});var w;(function(t){t.STRING="string",t.NUMBER="number",t.INTEGER="integer",t.BOOLEAN="boolean",t.ARRAY="array",t.OBJECT="object"})(w||(w={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var b;(function(t){t.LANGUAGE_UNSPECIFIED="language_unspecified",t.PYTHON="python"})(b||(b={}));var M;(function(t){t.OUTCOME_UNSPECIFIED="outcome_unspecified",t.OUTCOME_OK="outcome_ok",t.OUTCOME_FAILED="outcome_failed",t.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(M||(M={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L=["user","model","function","system"];var D;(function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",t.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(D||(D={}));var G;(function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE"})(G||(G={}));var x;(function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH"})(x||(x={}));var U;(function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER"})(U||(U={}));var p;(function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.LANGUAGE="LANGUAGE",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT",t.SPII="SPII",t.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",t.OTHER="OTHER"})(p||(p={}));var H;(function(t){t.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",t.RETRIEVAL_QUERY="RETRIEVAL_QUERY",t.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",t.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",t.CLASSIFICATION="CLASSIFICATION",t.CLUSTERING="CLUSTERING"})(H||(H={}));var F;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE"})(F||(F={}));var $;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC"})($||($={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}}class R extends h{constructor(e,n){super(e),this.response=n}}class V extends h{constructor(e,n,o,s){super(e),this.status=n,this.statusText=o,this.errorDetails=s}}class v extends h{}class J extends h{}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z="https://generativelanguage.googleapis.com",Z="v1beta",tt="0.24.1",et="genai-js";var O;(function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.EMBED_CONTENT="embedContent",t.BATCH_EMBED_CONTENTS="batchEmbedContents"})(O||(O={}));class nt{constructor(e,n,o,s,i){this.model=e,this.task=n,this.apiKey=o,this.stream=s,this.requestOptions=i}toString(){var e,n;const o=((e=this.requestOptions)===null||e===void 0?void 0:e.apiVersion)||Z;let i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||z}/${o}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}function st(t){const e=[];return t!=null&&t.apiClient&&e.push(t.apiClient),e.push(`${et}/${tt}`),e.join(" ")}function ot(t){return u(this,null,function*(){var e;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",st(t.requestOptions)),n.append("x-goog-api-key",t.apiKey);let o=(e=t.requestOptions)===null||e===void 0?void 0:e.customHeaders;if(o){if(!(o instanceof Headers))try{o=new Headers(o)}catch(s){throw new v(`unable to convert customHeaders value ${JSON.stringify(o)} to Headers: ${s.message}`)}for(const[s,i]of o.entries()){if(s==="x-goog-api-key")throw new v(`Cannot set reserved header name ${s}`);if(s==="x-goog-api-client")throw new v(`Header name ${s} can only be set using the apiClient field`);n.append(s,i)}}return n})}function it(t,e,n,o,s,i){return u(this,null,function*(){const a=new nt(t,e,n,o,i);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},dt(i)),{method:"POST",headers:yield ot(a),body:s})}})}function S(r,c,f,C,I){return u(this,arguments,function*(t,e,n,o,s,i={},a=fetch){const{url:d,fetchOptions:g}=yield it(t,e,n,o,s,i);return at(d,g,a)})}function at(o,s){return u(this,arguments,function*(t,e,n=fetch){let i;try{i=yield n(t,e)}catch(a){rt(a,t)}return i.ok||(yield ct(i,t)),i})}function rt(t,e){let n=t;throw n.name==="AbortError"?(n=new J(`Request aborted when fetching ${e.toString()}: ${t.message}`),n.stack=t.stack):t instanceof V||t instanceof v||(n=new h(`Error fetching from ${e.toString()}: ${t.message}`),n.stack=t.stack),n}function ct(t,e){return u(this,null,function*(){let n="",o;try{const s=yield t.json();n=s.error.message,s.error.details&&(n+=` ${JSON.stringify(s.error.details)}`,o=s.error.details)}catch(s){}throw new V(`Error fetching from ${e.toString()}: [${t.status} ${t.statusText}] ${n}`,t.status,t.statusText,o)})}function dt(t){const e={};if((t==null?void 0:t.signal)!==void 0||(t==null?void 0:t.timeout)>=0){const n=new AbortController;(t==null?void 0:t.timeout)>=0&&setTimeout(()=>n.abort(),t.timeout),t!=null&&t.signal&&t.signal.addEventListener("abort",()=>{n.abort()}),e.signal=n.signal}return e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),T(t.candidates[0]))throw new R(`${_(t)}`,t);return lt(t)}else if(t.promptFeedback)throw new R(`Text not available. ${_(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),T(t.candidates[0]))throw new R(`${_(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),j(t)[0]}else if(t.promptFeedback)throw new R(`Function call not available. ${_(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),T(t.candidates[0]))throw new R(`${_(t)}`,t);return j(t)}else if(t.promptFeedback)throw new R(`Function call not available. ${_(t)}`,t)},t}function lt(t){var e,n,o,s;const i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(const a of(s=(o=t.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)a.text&&i.push(a.text),a.executableCode&&i.push("\n```"+a.executableCode.language+`
`+a.executableCode.code+"\n```\n"),a.codeExecutionResult&&i.push("\n```\n"+a.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function j(t){var e,n,o,s;const i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(const a of(s=(o=t.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)a.functionCall&&i.push(a.functionCall);if(i.length>0)return i}const ut=[p.RECITATION,p.SAFETY,p.LANGUAGE];function T(t){return!!t.finishReason&&ut.includes(t.finishReason)}function _(t){var e,n,o;let s="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)s+="Response was blocked",!((e=t.promptFeedback)===null||e===void 0)&&e.blockReason&&(s+=` due to ${t.promptFeedback.blockReason}`),!((n=t.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(s+=`: ${t.promptFeedback.blockReasonMessage}`);else if(!((o=t.candidates)===null||o===void 0)&&o[0]){const i=t.candidates[0];T(i)&&(s+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(s+=`: ${i.finishMessage}`))}return s}function A(t){return this instanceof A?(this.v=t,this):new A(t)}function ft(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o=n.apply(t,e||[]),s,i=[];return s={},a("next"),a("throw"),a("return"),s[Symbol.asyncIterator]=function(){return this},s;function a(d){o[d]&&(s[d]=function(g){return new Promise(function(l,E){i.push([d,g,l,E])>1||r(d,g)})})}function r(d,g){try{c(o[d](g))}catch(l){I(i[0][3],l)}}function c(d){d.value instanceof A?Promise.resolve(d.value.v).then(f,C):I(i[0][2],d)}function f(d){r("next",d)}function C(d){r("throw",d)}function I(d,g){d(g),i.shift(),i.length&&r(i[0][0],i[0][1])}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function ht(t){const e=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=Ct(e),[o,s]=n.tee();return{stream:Et(o),response:gt(s)}}function gt(t){return u(this,null,function*(){const e=[],n=t.getReader();for(;;){const{done:o,value:s}=yield n.read();if(o)return m(_t(e));e.push(s)}})}function Et(t){return ft(this,arguments,function*(){const n=t.getReader();for(;;){const{value:o,done:s}=yield A(n.read());if(s)break;yield yield A(m(o))}})}function Ct(t){const e=t.getReader();return new ReadableStream({start(o){let s="";return i();function i(){return e.read().then(({value:a,done:r})=>{if(r){if(s.trim()){o.error(new h("Failed to parse stream"));return}o.close();return}s+=a;let c=s.match(K),f;for(;c;){try{f=JSON.parse(c[1])}catch(C){o.error(new h(`Error parsing JSON response: "${c[1]}"`));return}o.enqueue(f),s=s.substring(c[0].length),c=s.match(K)}return i()}).catch(a=>{let r=a;throw r.stack=a.stack,r.name==="AbortError"?r=new J("Request aborted when reading from the stream"):r=new h("Error reading from the stream"),r})}}})}function _t(t){const e=t[t.length-1],n={promptFeedback:e==null?void 0:e.promptFeedback};for(const o of t){if(o.candidates){let s=0;for(const i of o.candidates)if(n.candidates||(n.candidates=[]),n.candidates[s]||(n.candidates[s]={index:s}),n.candidates[s].citationMetadata=i.citationMetadata,n.candidates[s].groundingMetadata=i.groundingMetadata,n.candidates[s].finishReason=i.finishReason,n.candidates[s].finishMessage=i.finishMessage,n.candidates[s].safetyRatings=i.safetyRatings,i.content&&i.content.parts){n.candidates[s].content||(n.candidates[s].content={role:i.content.role||"user",parts:[]});const a={};for(const r of i.content.parts)r.text&&(a.text=r.text),r.functionCall&&(a.functionCall=r.functionCall),r.executableCode&&(a.executableCode=r.executableCode),r.codeExecutionResult&&(a.codeExecutionResult=r.codeExecutionResult),Object.keys(a).length===0&&(a.text=""),n.candidates[s].content.parts.push(a)}s++}o.usageMetadata&&(n.usageMetadata=o.usageMetadata)}return n}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(t,e,n,o){return u(this,null,function*(){const s=yield S(e,O.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),o);return ht(s)})}function X(t,e,n,o){return u(this,null,function*(){const i=yield(yield S(e,O.GENERATE_CONTENT,t,!1,JSON.stringify(n),o)).json();return{response:m(i)}})}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function y(t){let e=[];if(typeof t=="string")e=[{text:t}];else for(const n of t)typeof n=="string"?e.push({text:n}):e.push(n);return vt(e)}function vt(t){const e={role:"user",parts:[]},n={role:"function",parts:[]};let o=!1,s=!1;for(const i of t)"functionResponse"in i?(n.parts.push(i),s=!0):(e.parts.push(i),o=!0);if(o&&s)throw new h("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!o&&!s)throw new h("No content is provided for sending chat message.");return o?e:n}function Ot(t,e){var n;let o={model:e==null?void 0:e.model,generationConfig:e==null?void 0:e.generationConfig,safetySettings:e==null?void 0:e.safetySettings,tools:e==null?void 0:e.tools,toolConfig:e==null?void 0:e.toolConfig,systemInstruction:e==null?void 0:e.systemInstruction,cachedContent:(n=e==null?void 0:e.cachedContent)===null||n===void 0?void 0:n.name,contents:[]};const s=t.generateContentRequest!=null;if(t.contents){if(s)throw new v("CountTokensRequest must have one of contents or generateContentRequest, not both.");o.contents=t.contents}else if(s)o=Object.assign(Object.assign({},o),t.generateContentRequest);else{const i=y(t);o.contents=[i]}return{generateContentRequest:o}}function Y(t){let e;return t.contents?e=t:e={contents:[y(t)]},t.systemInstruction&&(e.systemInstruction=Q(t.systemInstruction)),e}function It(t){return typeof t=="string"||Array.isArray(t)?{content:y(t)}:t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],Rt={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function pt(t){let e=!1;for(const n of t){const{role:o,parts:s}=n;if(!e&&o!=="user")throw new h(`First content should be with role 'user', got ${o}`);if(!L.includes(o))throw new h(`Each item should include role field. Got ${o} but valid roles are: ${JSON.stringify(L)}`);if(!Array.isArray(s))throw new h("Content should have 'parts' property with an array of Parts");if(s.length===0)throw new h("Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const r of s)for(const c of B)c in r&&(i[c]+=1);const a=Rt[o];for(const r of B)if(!a.includes(r)&&i[r]>0)throw new h(`Content with role '${o}' can't contain '${r}' part`);e=!0}}function k(t){var e;if(t.candidates===void 0||t.candidates.length===0)return!1;const n=(e=t.candidates[0])===null||e===void 0?void 0:e.content;if(n===void 0||n.parts===void 0||n.parts.length===0)return!1;for(const o of n.parts)if(o===void 0||Object.keys(o).length===0||o.text!==void 0&&o.text==="")return!1;return!0}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q="SILENT_ERROR";class At{constructor(e,n,o,s={}){this.model=n,this.params=o,this._requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,o!=null&&o.history&&(pt(o.history),this._history=o.history)}getHistory(){return u(this,null,function*(){return yield this._sendPromise,this._history})}sendMessage(o){return u(this,arguments,function*(e,n={}){var s,i,a,r,c,f;yield this._sendPromise;const C=y(e),I={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(i=this.params)===null||i===void 0?void 0:i.generationConfig,tools:(a=this.params)===null||a===void 0?void 0:a.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(c=this.params)===null||c===void 0?void 0:c.systemInstruction,cachedContent:(f=this.params)===null||f===void 0?void 0:f.cachedContent,contents:[...this._history,C]},d=Object.assign(Object.assign({},this._requestOptions),n);let g;return this._sendPromise=this._sendPromise.then(()=>X(this._apiKey,this.model,I,d)).then(l=>{var E;if(k(l.response)){this._history.push(C);const N=Object.assign({parts:[],role:"model"},(E=l.response.candidates)===null||E===void 0?void 0:E[0].content);this._history.push(N)}else{const N=_(l.response);N&&console.warn(`sendMessage() was unsuccessful. ${N}. Inspect response object for details.`)}g=l}).catch(l=>{throw this._sendPromise=Promise.resolve(),l}),yield this._sendPromise,g})}sendMessageStream(o){return u(this,arguments,function*(e,n={}){var s,i,a,r,c,f;yield this._sendPromise;const C=y(e),I={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(i=this.params)===null||i===void 0?void 0:i.generationConfig,tools:(a=this.params)===null||a===void 0?void 0:a.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(c=this.params)===null||c===void 0?void 0:c.systemInstruction,cachedContent:(f=this.params)===null||f===void 0?void 0:f.cachedContent,contents:[...this._history,C]},d=Object.assign(Object.assign({},this._requestOptions),n),g=W(this._apiKey,this.model,I,d);return this._sendPromise=this._sendPromise.then(()=>g).catch(l=>{throw new Error(q)}).then(l=>l.response).then(l=>{if(k(l)){this._history.push(C);const E=Object.assign({},l.candidates[0].content);E.role||(E.role="model"),this._history.push(E)}else{const E=_(l);E&&console.warn(`sendMessageStream() was unsuccessful. ${E}. Inspect response object for details.`)}}).catch(l=>{l.message!==q&&console.error(l)}),g})}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(t,e,n,o){return u(this,null,function*(){return(yield S(e,O.COUNT_TOKENS,t,!1,JSON.stringify(n),o)).json()})}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function St(t,e,n,o){return u(this,null,function*(){return(yield S(e,O.EMBED_CONTENT,t,!1,JSON.stringify(n),o)).json()})}function Nt(t,e,n,o){return u(this,null,function*(){const s=n.requests.map(a=>Object.assign(Object.assign({},a),{model:e}));return(yield S(e,O.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:s}),o)).json()})}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e,n,o={}){this.apiKey=e,this._requestOptions=o,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Q(n.systemInstruction),this.cachedContent=n.cachedContent}generateContent(o){return u(this,arguments,function*(e,n={}){var s;const i=Y(e),a=Object.assign(Object.assign({},this._requestOptions),n);return X(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},i),a)})}generateContentStream(o){return u(this,arguments,function*(e,n={}){var s;const i=Y(e),a=Object.assign(Object.assign({},this._requestOptions),n);return W(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},i),a)})}startChat(e){var n;return new At(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},e),this._requestOptions)}countTokens(o){return u(this,arguments,function*(e,n={}){const s=Ot(e,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),i=Object.assign(Object.assign({},this._requestOptions),n);return yt(this.apiKey,this.model,s,i)})}embedContent(o){return u(this,arguments,function*(e,n={}){const s=It(e),i=Object.assign(Object.assign({},this._requestOptions),n);return St(this.apiKey,this.model,s,i)})}batchEmbedContents(o){return u(this,arguments,function*(e,n={}){const s=Object.assign(Object.assign({},this._requestOptions),n);return Nt(this.apiKey,this.model,e,s)})}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(e){this.apiKey=e}getGenerativeModel(e,n){if(!e.model)throw new h("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new P(this.apiKey,e,n)}getGenerativeModelFromCachedContent(e,n,o){if(!e.name)throw new v("Cached content must contain a `name` field.");if(!e.model)throw new v("Cached content must contain a `model` field.");const s=["model","systemInstruction"];for(const a of s)if(n!=null&&n[a]&&e[a]&&(n==null?void 0:n[a])!==e[a]){if(a==="model"){const r=n.model.startsWith("models/")?n.model.replace("models/",""):n.model,c=e.model.startsWith("models/")?e.model.replace("models/",""):e.model;if(r===c)continue}throw new v(`Different value for "${a}" specified in modelParams (${n[a]}) and cachedContent (${e[a]})`)}const i=Object.assign(Object.assign({},n),{model:e.model,tools:e.tools,toolConfig:e.toolConfig,systemInstruction:e.systemInstruction,cachedContent:e});return new P(this.apiKey,i,o)}}export{mt as G};
//# sourceMappingURL=ai-apis-CARnNs-S.js.map
