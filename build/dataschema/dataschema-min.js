YUI.add("dataschema-base",function(b){var a=b.Lang,c={apply:function(d,e){return e;},parse:function(d,e){if(e.parser){var f=(a.isFunction(e.parser))?e.parser:b.Parsers[e.parser+""];if(f){d=f.call(this,d);}else{}}return d;}};b.namespace("DataSchema").Base=c;b.namespace("Parsers");},"@VERSION@",{requires:["base"]});YUI.add("dataschema-json",function(c){var a=c.Lang,b={getPath:function(d){var g=null,f=[],e=0;if(d){d=d.replace(/\[(['"])(.*?)\1\]/g,function(i,h,j){f[e]=j;return".@"+(e++);}).replace(/\[(\d+)\]/g,function(i,h){f[e]=parseInt(h,10)|0;return".@"+(e++);}).replace(/^\./,"");if(!/[^\w\.\$@]/.test(d)){g=d.split(".");for(e=g.length-1;e>=0;--e){if(g[e].charAt(0)==="@"){g[e]=f[parseInt(g[e].substr(1),10)];}}}else{}}return g;},getLocationValue:function(g,f){var e=0,d=g.length;for(;e<d;e++){if(a.isObject(f)&&(g[e] in f)){f=f[g[e]];}else{f=undefined;break;}}return f;},apply:function(g,h){var d=h,f={results:[],meta:{}};if(!a.isObject(h)){try{d=c.JSON.parse(h);}catch(i){f.error=i;return f;}}if(a.isObject(d)&&g){if(!a.isUndefined(g.resultListLocator)){f=b._parseResults.call(this,g,d,f);}if(!a.isUndefined(g.metaFields)){f=b._parseMeta(g.metaFields,d,f);}}else{f.error=new Error("JSON schema parse failure");}return f;},_parseResults:function(h,d,g){var f=[],i,e;if(h.resultListLocator){i=b.getPath(h.resultListLocator);if(i){f=b.getLocationValue(i,d);if(f===undefined){g.results=[];e=new Error("JSON results retrieval failure");}else{if(a.isArray(f)){if(a.isArray(h.resultFields)){g=b._getFieldValues.call(this,h.resultFields,f,g);}else{g.results=f;}}else{g.results=[];e=new Error("JSON Schema fields retrieval failure");}}}else{e=new Error("JSON Schema results locator failure");}if(e){g.error=e;}}return g;},_getFieldValues:function(n,s,e){var g=[],p=n.length,h,f,r,t,m,v,d,l=[],q=[],o=[],u,k;for(h=0;h<p;h++){r=n[h];t=r.key||r;m=r.locator||t;v=b.getPath(m);if(v){if(v.length===1){l[l.length]={key:t,path:v[0]};}else{q[q.length]={key:t,path:v};}}else{}d=(a.isFunction(r.parser))?r.parser:c.Parsers[r.parser+""];if(d){o[o.length]={key:t,parser:d};}}for(h=s.length-1;h>=0;--h){k={};u=s[h];if(u){for(f=l.length-1;f>=0;--f){k[l[f].key]=c.DataSchema.Base.parse.call(this,(a.isUndefined(u[l[f].path])?u[f]:u[l[f].path]),l[f]);}for(f=q.length-1;f>=0;--f){k[q[f].key]=c.DataSchema.Base.parse.call(this,(b.getLocationValue(q[f].path,u)),q[f]);}for(f=o.length-1;f>=0;--f){t=o[f].key;k[t]=o[f].parser.call(this,k[t]);if(a.isUndefined(k[t])){k[t]=null;}}g[h]=k;}}e.results=g;return e;},_parseMeta:function(g,d,f){if(a.isObject(g)){var e,h;for(e in g){if(g.hasOwnProperty(e)){h=b.getPath(g[e]);if(h&&d){f.meta[e]=b.getLocationValue(h,d);}}}}else{f.error=new Error("JSON meta data retrieval failure");}return f;}};c.DataSchema.JSON=c.mix(b,c.DataSchema.Base);},"@VERSION@",{requires:["dataschema-base","json"]});YUI.add("dataschema-xml",function(c){var b=c.Lang,a={apply:function(f,g){var d=g,e={results:[],meta:{}};if(d&&d.nodeType&&(9===d.nodeType||1===d.nodeType||11===d.nodeType)&&f){e=a._parseResults.call(this,f,d,e);e=a._parseMeta.call(this,f.metaFields,d,e);}else{e.error=new Error("XML schema parse failure");}return e;},_getLocationValue:function(l,i){var g=l.locator||l.key||l,f=i.ownerDocument||i,d,h,j=null;try{d=a._getXPathResult(g,i,f);while(h=d.iterateNext()){j=h.textContent||h.value||h.text||h.innerHTML||null;}return c.DataSchema.Base.parse.call(this,j,l);}catch(k){}return null;},_getXPathResult:function(k,f,s){if(!b.isUndefined(s.evaluate)){return s.evaluate(k,f,s.createNSResolver(f.ownerDocument?f.ownerDocument.documentElement:f.documentElement),0,null);}else{var p=[],r=k.split(/\b\/\b/),j=0,h=r.length,o,d,g,q;try{s.setProperty("SelectionLanguage","XPath");p=f.selectNodes(k);}catch(n){for(;j<h&&f;j++){o=r[j];if((o.indexOf("[")>-1)&&(o.indexOf("]")>-1)){d=o.slice(o.indexOf("[")+1,o.indexOf("]"));d--;f=f.children[d];q=true;}else{if(o.indexOf("@")>-1){d=o.substr(o.indexOf("@"));f=d?f.getAttribute(d.replace("@","")):f;}else{if(-1<o.indexOf("//")){d=f.getElementsByTagName(o.substr(2));f=d.length?d[d.length-1]:null;}else{if(h!=j+1){for(g=f.childNodes.length-1;0<=g;g-=1){if(o===f.childNodes[g].tagName){f=f.childNodes[g];g=-1;}}}}}}}if(f){if(b.isString(f)){p[0]={value:f};}else{if(q){p[0]={value:f.innerHTML};}else{p=c.Array(f.childNodes,0,true);}}}}return{index:0,iterateNext:function(){if(this.index>=this.values.length){return undefined;}var e=this.values[this.index];this.index+=1;return e;},values:p};}},_parseField:function(f,d,e){if(f.schema){d[f.key]=a._parseResults.call(this,f.schema,e,{results:[],meta:{}}).results;}else{d[f.key||f]=a._getLocationValue.call(this,f,e);}},_parseMeta:function(h,g,f){if(b.isObject(h)){var e,d=g.ownerDocument||g;for(e in h){if(h.hasOwnProperty(e)){f.meta[e]=a._getLocationValue.call(this,h[e],d);}}}return f;},_parseResult:function(e,g){var d={},f;for(f=e.length-1;0<=f;f--){a._parseField.call(this,e[f],d,g);}return d;},_parseResults:function(g,d,h){if(g.resultListLocator&&b.isArray(g.resultFields)){var m=d.ownerDocument||d,l=g.resultFields,k=[],e,n,f,j=0;if(g.resultListLocator.match(/^[:\-\w]+$/)){f=d.getElementsByTagName(g.resultListLocator);for(j=f.length-1;0<=j;j--){k[j]=a._parseResult.call(this,l,f[j]);}}else{f=a._getXPathResult(g.resultListLocator,d,m);while(e=f.iterateNext()){k[j]=a._parseResult.call(this,l,e);j+=1;}}if(k.length){h.results=k;}else{h.error=new Error("XML schema result nodes retrieval failure");}}return h;}};c.DataSchema.XML=c.mix(a,c.DataSchema.Base);},"@VERSION@",{requires:["dataschema-base"]});YUI.add("dataschema-array",function(c){var a=c.Lang,b={apply:function(f,g){var d=g,e={results:[],meta:{}};if(a.isArray(d)){if(f&&a.isArray(f.resultFields)){e=b._parseResults.call(this,f.resultFields,d,e);}else{e.results=d;}}else{e.error=new Error("Array schema parse failure");}return e;},_parseResults:function(h,m,d){var g=[],q,p,k,l,o,n,f,e;for(f=m.length-1;f>-1;f--){q={};p=m[f];k=(a.isObject(p)&&!a.isFunction(p))?2:(a.isArray(p))?1:(a.isString(p))?0:-1;if(k>0){for(e=h.length-1;e>-1;e--){l=h[e];
o=(!a.isUndefined(l.key))?l.key:l;n=(!a.isUndefined(p[o]))?p[o]:p[e];q[o]=c.DataSchema.Base.parse.call(this,n,l);}}else{if(k===0){q=p;}else{q=null;}}g[f]=q;}d.results=g;return d;}};c.DataSchema.Array=c.mix(b,c.DataSchema.Base);},"@VERSION@",{requires:["dataschema-base"]});YUI.add("dataschema-text",function(c){var b=c.Lang,a={apply:function(f,g){var d=g,e={results:[],meta:{}};if(b.isString(d)&&b.isString(f.resultDelimiter)){e=a._parseResults.call(this,f,d,e);}else{e.error=new Error("Text schema parse failure");}return e;},_parseResults:function(d,m,e){var k=d.resultDelimiter,h=[],n,r,u,t,l,p,s,q,g,f,o=m.length-k.length;if(m.substr(o)==k){m=m.substr(0,o);}n=m.split(d.resultDelimiter);for(g=n.length-1;g>-1;g--){u={};t=n[g];if(b.isString(d.fieldDelimiter)){r=t.split(d.fieldDelimiter);if(b.isArray(d.resultFields)){l=d.resultFields;for(f=l.length-1;f>-1;f--){p=l[f];s=(!b.isUndefined(p.key))?p.key:p;q=(!b.isUndefined(r[s]))?r[s]:r[f];u[s]=c.DataSchema.Base.parse.call(this,q,p);}}}else{u=t;}h[g]=u;}e.results=h;return e;}};c.DataSchema.Text=c.mix(a,c.DataSchema.Base);},"@VERSION@",{requires:["dataschema-base"]});YUI.add("dataschema",function(a){},"@VERSION@",{use:["dataschema-base","dataschema-json","dataschema-xml","dataschema-array","dataschema-text"]});