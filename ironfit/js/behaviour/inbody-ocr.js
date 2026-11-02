/* ---------- InBody OCR enhancement ---------- */
const IB_OCR_RULES=[
  {key:'height',label:/\bheight\b/i,min:100,max:250},
  {key:'weight',label:/\bweight\b|\bwt\.?\b/i,min:20,max:400,mass:true},
  {key:'bmi',label:/\bbmi\b|body\s+mass\s+index/i,min:10,max:70},
  {key:'bf',label:/percent\s+body\s+fat|body\s+fat\s+percentage|body\s+fat\s*%|\bpbf\b/i,min:2,max:75},
  {key:'fatMass',label:/body\s+fat\s+mass|fat\s+mass|\bbfm\b/i,min:1,max:250,mass:true},
  {key:'muscle',label:/skeletal\s+muscle\s+mass|\bsmm\b/i,min:5,max:120,mass:true},
  {key:'ffm',label:/fat[\s-]*free\s+mass|\bffm\b/i,min:10,max:250,mass:true},
  {key:'tbw',label:/total\s+body\s+water|\btbw\b/i,min:10,max:120},
  {key:'visceral',label:/visceral\s+fat\s+level|visceral\s+fat/i,min:1,max:30},
  {key:'bmrDevice',label:/basal\s+metabolic\s+rate|\bbmr\b/i,min:600,max:4500},
  {key:'waist',label:/waist(?![\s-]*hip)[^:\n]{0,12}/i,min:40,max:200},
  {key:'seg_rArm',label:/right\s+arm|\br\.?\s*arm\b/i,min:.01,max:80,mass:true,segment:true},
  {key:'seg_lArm',label:/left\s+arm|\bl\.?\s*arm\b/i,min:.01,max:80,mass:true,segment:true},
  {key:'seg_trunk',label:/\btrunk\b/i,min:.01,max:80,mass:true,segment:true},
  {key:'seg_rLeg',label:/right\s+leg|\br\.?\s*leg\b/i,min:.01,max:80,mass:true,segment:true},
  {key:'seg_lLeg',label:/left\s+leg|\bl\.?\s*leg\b/i,min:.01,max:80,mass:true,segment:true}
];
function ibOcrParseDetailed(text,lineDetails){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean),out={};
  for(const spec of IB_OCR_RULES)for(let i=0;i<lines.length;i++){
    const line=lines[i],match=spec.label.exec(line);if(!match)continue;
    const tail=line.slice(match.index+match[0].length).trimStart();
    if(spec.key==='weight'&&/^(?:control|goal|range)\b/i.test(tail))continue;
    let tokens=ibOcrTokens(tail),valueLine=line;
    if(!tokens.length&&i+1<lines.length){
      const next=lines[i+1];
      if(/^\s*(?:\d[\d,.-]*\s*)+(?:kg|lb|lbs|cm|l|kcal|%)?\s*$/i.test(next)&&!IB_OCR_RULES.some(rule=>rule.label.test(next))){tokens=ibOcrTokens(next);valueLine=next}
    }
    if(spec.segment&&/%/.test(tail+' '+valueLine)&&tokens.length<2&&!/\b(?:kg|lb|lbs)\b/i.test(tail+' '+valueLine))continue;
    const token=tokens.find(x=>{const value=spec.key==='height'&&x.value>0&&x.value<3?x.value*100:x.value;return value>=spec.min&&value<=spec.max});
    if(!token){
      const suspicious=tokens.find(x=>x.value/10>=spec.min&&x.value/10<=spec.max||x.value*10>=spec.min&&x.value*10<=spec.max);
      if(suspicious){
        const detail=Array.isArray(lineDetails)&&lineDetails.find(x=>String(x.text||'').replace(/\s+/g,' ').trim().toLowerCase()===valueLine.toLowerCase());
        out[spec.key]={value:suspicious.value,confidence:detail&&Number.isFinite(+detail.confidence)?Math.max(0,Math.min(100,+detail.confidence)):null,line:valueLine,suspiciousDecimal:true}
      }
      continue
    }
    let value=spec.key==='height'&&token.value>0&&token.value<3?token.value*100:token.value;
    if(spec.mass&&/\b(?:lb|lbs|pounds?)\b/i.test(line+' '+valueLine))value*=LB_TO_KG;
    const detail=Array.isArray(lineDetails)&&lineDetails.find(x=>String(x.text||'').replace(/\s+/g,' ').trim().toLowerCase()===valueLine.toLowerCase());
    out[spec.key]={value:+value.toFixed(2),confidence:detail&&Number.isFinite(+detail.confidence)?Math.max(0,Math.min(100,+detail.confidence)):null,line:valueLine};
    break
  }
  const date=String(text||'').match(/(?:test\s*date(?:\s*\/\s*time)?|measurement\s*date|scan\s*date)\s*[:\s-]*((?:19|20)\d{2})[./-](\d{1,2})[./-](\d{1,2})/i);
  if(date){
    const value=`${date[1]}-${date[2].padStart(2,'0')}-${date[3].padStart(2,'0')}`,check=new Date(value+'T12:00:00');
    if(!Number.isNaN(check.getTime())&&check.toISOString().slice(0,10)===value&&value<=today())out.date={value,confidence:null,line:date[0]}
  }
  return out
}
function ibOcrTolerance(key){return key==='date'?0:key==='height'?1:key==='bmi'||key==='bf'?.35:key.startsWith('seg_')?.25:.3}
function ibOcrResolve(attempts){
  const keys=new Set();attempts.forEach(attempt=>Object.keys(attempt).forEach(key=>keys.add(key)));
  const values={};
  keys.forEach(key=>{
    const found=attempts.map(attempt=>attempt[key]).filter(Boolean),groups=[];
    found.forEach(item=>{
      let group=groups.find(g=>key==='date'?g.value===item.value:Math.abs(g.value-item.value)<=ibOcrTolerance(key));
      if(!group){group={value:item.value,items:[]};groups.push(group)}
      group.items.push(item)
    });
    const ranked=groups.map(group=>{
      const confidence=group.items.map(item=>item.confidence).filter(Number.isFinite);
      const average=confidence.length?confidence.reduce((a,b)=>a+b,0)/confidence.length:null;
      return Object.assign(group,{average,score:(average==null?65:average)+Math.min(12,group.items.length*4)})
    }).sort((a,b)=>b.score-a.score);
    const best=ranked[0],conflict=ranked.length>1;
    const chosen=best.items.slice().sort((a,b)=>(b.confidence==null?0:b.confidence)-(a.confidence==null?0:a.confidence))[0];
    const rule=IB_OCR_RULES.find(item=>item.key===key),valid=key==='date'||!!rule&&chosen.value>=rule.min&&chosen.value<=rule.max;
    const suspiciousDecimal=best.items.some(item=>item.suspiciousDecimal);let level='low';
    if(valid&&!conflict&&!suspiciousDecimal)level=best.average==null?'medium':best.average>=85?'high':best.average>=60?'medium':'low';
    values[key]={value:chosen.value,confidence:best.average,estimated:best.average==null,level,conflict:!!conflict,
      validated:valid&&!conflict&&!suspiciousDecimal,suspiciousDecimal,reason:suspiciousDecimal?'decimal':undefined,count:best.items.length,line:best.items[0].line||''}
  });
  return values
}
function ibOcrCrossValidate(values){
  const n=key=>values[key]&&values[key].value,mark=(keys,reason)=>keys.forEach(key=>{
    if(values[key]){values[key].level='low';values[key].validated=false;values[key].reason=reason}
  });
  const weight=n('weight'),height=n('height'),bmi=n('bmi'),bf=n('bf'),fat=n('fatMass'),ffm=n('ffm'),tbw=n('tbw'),muscle=n('muscle');
  if(weight&&height&&bmi&&Math.abs(bmi-weight/Math.pow(height/100,2))>2)mark(['weight','height','bmi'],'relationship');
  if(weight&&bf&&fat&&Math.abs(fat-weight*bf/100)>Math.max(2,weight*.04))mark(['bf','fatMass'],'relationship');
  if(weight&&ffm&&fat&&Math.abs(weight-ffm-fat)>Math.max(2,weight*.04))mark(['weight','ffm','fatMass'],'relationship');
  if(ffm&&muscle&&muscle>ffm+1)mark(['muscle','ffm'],'relationship');
  if(ffm&&tbw&&tbw>ffm+1)mark(['tbw','ffm'],'relationship');
  return values
}
function ibOcrGray(canvas){
  const data=canvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,canvas.width,canvas.height),pixels=data.data;
  for(let i=0;i<pixels.length;i+=4){const gray=.299*pixels[i]+.587*pixels[i+1]+.114*pixels[i+2];pixels[i]=pixels[i+1]=pixels[i+2]=gray;pixels[i+3]=255}
  return data
}
function ibOcrYield(){return new Promise(resolve=>setTimeout(resolve,0))}
async function ibOcrGrayAsync(canvas){
  const data=canvas.getContext('2d',{willReadFrequently:true}).getImageData(0,0,canvas.width,canvas.height),pixels=data.data;
  for(let y=0;y<canvas.height;y++){
    for(let x=0;x<canvas.width;x++){const i=(y*canvas.width+x)*4,gray=.299*pixels[i]+.587*pixels[i+1]+.114*pixels[i+2];pixels[i]=pixels[i+1]=pixels[i+2]=gray;pixels[i+3]=255}
    if(y&&y%80===0)await ibOcrYield()
  }
  return data
}
async function ibOcrDenoise(data,width,height){
  const source=data.data,out=new ImageData(new Uint8ClampedArray(source),width,height),pixels=out.data;
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
    const i=(y*width+x)*4,value=source[i];let low=255,high=0,sum=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(dx||dy){const n=source[((y+dy)*width+x+dx)*4];low=Math.min(low,n);high=Math.max(high,n);sum+=n}
    if(high-low<28){const smoothed=value*.82+(sum/8)*.18;pixels[i]=pixels[i+1]=pixels[i+2]=smoothed}
    if(x===width-2&&y%48===0)await ibOcrYield()
  }
  return out
}
function ibOcrCanvasFromData(data,width,height){
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d').putImageData(data,0,0);return canvas
}
async function ibOcrClahe(gray,width,height){
  const tiles=Math.max(1,Math.min(8,width,height)),luts=[],clip=Math.max(1,Math.floor(width*height/(tiles*tiles)/256*2.2));
  for(let ty=0;ty<tiles;ty++){
    luts[ty]=[];
    for(let tx=0;tx<tiles;tx++){
      const histogram=new Uint32Array(256),x0=Math.floor(tx*width/tiles),x1=Math.floor((tx+1)*width/tiles);
      const y0=Math.floor(ty*height/tiles),y1=Math.floor((ty+1)*height/tiles);let count=0;
      for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){histogram[gray.data[(y*width+x)*4]]++;count++}
      await ibOcrYield()
      let excess=0;for(let i=0;i<256;i++)if(histogram[i]>clip){excess+=histogram[i]-clip;histogram[i]=clip}
      const each=Math.floor(excess/256),extra=excess%256,lut=new Uint8Array(256);let sum=0;
      for(let i=0;i<256;i++){sum+=histogram[i]+each+(i<extra?1:0);lut[i]=Math.max(0,Math.min(255,Math.round(sum*255/Math.max(1,count))))}
      luts[ty][tx]=lut
    }
  }
  const out=new ImageData(width,height),src=gray.data,dst=out.data;
  for(let y=0;y<height;y++){
    const fy=(y+.5)*tiles/height-.5,y0=Math.max(0,Math.floor(fy)),y1=Math.min(tiles-1,y0+1),wy=Math.max(0,Math.min(1,fy-y0));
    for(let x=0;x<width;x++){
      const fx=(x+.5)*tiles/width-.5,x0=Math.max(0,Math.floor(fx)),x1=Math.min(tiles-1,x0+1),wx=Math.max(0,Math.min(1,fx-x0));
      const i=(y*width+x)*4,value=src[i],a=luts[y0][x0][value]*(1-wx)+luts[y0][x1][value]*wx;
      const b=luts[y1][x0][value]*(1-wx)+luts[y1][x1][value]*wx,v=Math.round(a*(1-wy)+b*wy);
      dst[i]=dst[i+1]=dst[i+2]=v;dst[i+3]=255
    }
    if(y&&y%48===0)await ibOcrYield()
  }
  return out
}
async function ibOcrThreshold(gray,width,height){
  const source=gray.data,stride=width+1,integral=new Uint32Array((width+1)*(height+1));
  for(let y=1;y<=height;y++){
    let row=0;for(let x=1;x<=width;x++){row+=source[((y-1)*width+x-1)*4];integral[y*stride+x]=integral[(y-1)*stride+x]+row}
    if(y%48===0)await ibOcrYield()
  }
  const out=new ImageData(width,height),dest=out.data,radius=Math.max(10,Math.round(Math.min(width,height)*.018));
  for(let y=0;y<height;y++){
    const y0=Math.max(0,y-radius),y1=Math.min(height,y+radius+1);
    for(let x=0;x<width;x++){
      const x0=Math.max(0,x-radius),x1=Math.min(width,x+radius+1);
      const sum=integral[y1*stride+x1]-integral[y0*stride+x1]-integral[y1*stride+x0]+integral[y0*stride+x0];
      const mean=sum/((x1-x0)*(y1-y0)),i=(y*width+x)*4,value=source[i]<mean-9?0:255;
      dest[i]=dest[i+1]=dest[i+2]=value;dest[i+3]=255
    }
    if(y&&y%48===0)await ibOcrYield()
  }
  return out
}
function ibOcrRotate(source,angle){
  const radians=angle*Math.PI/180,cos=Math.abs(Math.cos(radians)),sin=Math.abs(Math.sin(radians)),canvas=document.createElement('canvas');
  canvas.width=Math.ceil(source.width*cos+source.height*sin);canvas.height=Math.ceil(source.width*sin+source.height*cos);
  const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);
  context.translate(canvas.width/2,canvas.height/2);context.rotate(radians);context.drawImage(source,-source.width/2,-source.height/2);return canvas
}
async function ibOcrDeskew(source){
  const width=Math.min(480,source.width),height=Math.max(1,Math.round(source.height*width/source.width)),sample=document.createElement('canvas');
  sample.width=width;sample.height=height;sample.getContext('2d').drawImage(source,0,0,width,height);
  const score=angle=>{
    const rotated=document.createElement('canvas');rotated.width=width;rotated.height=height;
    const context=rotated.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,width,height);
    context.translate(width/2,height/2);context.rotate(angle*Math.PI/180);context.drawImage(sample,-width/2,-height/2);
    const pixels=ibOcrGray(rotated).data,rows=new Uint16Array(height);let sum=0,sum2=0;
    for(let y=0;y<height;y++){for(let x=0;x<width;x++)if(pixels[(y*width+x)*4]<150)rows[y]++;sum+=rows[y];sum2+=rows[y]*rows[y]}
    return sum2/Math.max(1,sum)
  };
  const baseline=score(0);let best=baseline,bestAngle=0;
  for(let angle=-4;angle<=4.001;angle+=.5){if(!angle)continue;const candidate=score(angle);if(candidate>best){best=candidate;bestAngle=angle}await ibOcrYield()}
  return bestAngle&&best>baseline*1.04?-bestAngle:0
}
function ibOcrImageSource(){
  if(!ibImg||!ui.ib.file)throw new Error('Image preview is unavailable');
  const file=ui.ib.file,sourceWidth=ibImg.width,sourceHeight=ibImg.height,rot=file.rot,sourceScale=Math.min(1,3200/Math.max(sourceWidth,sourceHeight));
  const width=Math.round((rot%180===0?sourceWidth:sourceHeight)*sourceScale),height=Math.round((rot%180===0?sourceHeight:sourceWidth)*sourceScale),oriented=document.createElement('canvas');
  oriented.width=width;oriented.height=height;
  const context=oriented.getContext('2d');context.translate(width/2,height/2);context.rotate(rot*Math.PI/180);
  context.drawImage(ibImg,-sourceWidth*sourceScale/2,-sourceHeight*sourceScale/2,sourceWidth*sourceScale,sourceHeight*sourceScale);
  const crop=file.crop,x=width*crop.l/100,y=height*crop.t/100,cropWidth=Math.max(1,width*(1-(crop.l+crop.r)/100)),cropHeight=Math.max(1,height*(1-(crop.t+crop.b)/100));
  const scale=Math.min(3,2600/Math.max(cropWidth,cropHeight)),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(cropWidth*scale));canvas.height=Math.max(1,Math.round(cropHeight*scale));
  canvas.getContext('2d').drawImage(oriented,x,y,cropWidth,cropHeight,0,0,canvas.width,canvas.height);
  return{canvas,width:cropWidth/sourceScale,height:cropHeight/sourceScale}
}
function ibOcrQuality(canvas,sourceWidth,sourceHeight){
  const scale=Math.min(1,700/Math.max(canvas.width,canvas.height)),small=document.createElement('canvas');
  small.width=Math.max(1,Math.round(canvas.width*scale));small.height=Math.max(1,Math.round(canvas.height*scale));
  small.getContext('2d').drawImage(canvas,0,0,small.width,small.height);
  const pixels=ibOcrGray(small).data,width=small.width,height=small.height;let total=0,bright=0,dark=0,edge=0,lap=0,lap2=0,count=0;
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
    const i=(y*width+x)*4,value=pixels[i];total+=value;if(value>248)bright++;if(value<100)dark++;
    const delta=4*value-pixels[i-4]-pixels[i+4]-pixels[i-width*4]-pixels[i+width*4];lap+=delta;lap2+=delta*delta;count++
  }
  const band=Math.max(2,Math.round(Math.min(width,height)*.025));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(x<band||x>=width-band||y<band||y>=height-band)if(pixels[(y*width+x)*4]<110)edge++;
  const mean=total/Math.max(1,count),darkRatio=dark/Math.max(1,count),brightRatio=bright/Math.max(1,count);
  const variance=lap2/Math.max(1,count)-Math.pow(lap/Math.max(1,count),2),warnings=[];
  if(Math.max(sourceWidth,sourceHeight)<1000||Math.min(sourceWidth,sourceHeight)<650)warnings.push('small');
  if(variance<24)warnings.push('blurry');if(mean<72)warnings.push('dark');
  if(mean>254.5&&brightRatio>.995&&darkRatio<.0002)warnings.push('overexposed');
  if(dark>180&&edge/dark>.18)warnings.push('cropped');
  return warnings
}
async function ibOcrPreprocess(source){
  await ibOcrYield();
  const angle=await ibOcrDeskew(source),deskewed=angle?ibOcrRotate(source,angle):source;
  const gray=await ibOcrDenoise(await ibOcrGrayAsync(deskewed),deskewed.width,deskewed.height),contrast=await ibOcrClahe(gray,deskewed.width,deskewed.height);
  return{angle,source:deskewed,variants:[
    source,
    ibOcrCanvasFromData(gray,deskewed.width,deskewed.height),
    ibOcrCanvasFromData(contrast,deskewed.width,deskewed.height),
    ibOcrCanvasFromData(await ibOcrThreshold(contrast,deskewed.width,deskewed.height),deskewed.width,deskewed.height)
  ]}
}
async function ibOcrPdfPage(pdf,number){
  const page=await pdf.getPage(number),initial=page.getViewport({scale:1});
  const scale=Math.min(300/72,3200/initial.width,3200/initial.height),viewport=page.getViewport({scale}),canvas=document.createElement('canvas');
  canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
  await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;return canvas
}
function ibOcrPdfText(content){
  const rows=[];content.items.forEach(item=>{const y=Math.round(item.transform[5]),row=rows.find(value=>Math.abs(value.y-y)<3);
    if(row)row.items.push(item);else rows.push({y,items:[item]})});
  return rows.sort((a,b)=>b.y-a.y).map(row=>row.items.sort((a,b)=>a.transform[4]-b.transform[4]).map(item=>item.str).join(' ')).join('\n')
}
async function ibOcrPdfLoad(file){
  const pdfjs=await loadIbScript('pdfjs','https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js','pdfjsLib');
  pdfjs.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  const pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise,pages=[];let best=null;
  for(let number=1;number<=Math.min(pdf.numPages,10);number++){
    const page=await pdf.getPage(number),text=ibOcrPdfText(await page.getTextContent()),parsed=ibOcrParseDetailed(text),score=Object.keys(parsed).length;
    const entry={number,text,parsed,score};pages.push(entry);if(!best||score>best.score)best=entry;if(score>=6)break
  }
  const canvas=await ibOcrPdfPage(pdf,best.number);ibPdf=canvas;return{pdf,pages,best,canvas}
}
async function ibOcrReadCanvas(source,worker,status,attempts){
  const processed=await ibOcrPreprocess(source);
  for(let i=0;i<processed.variants.length;i++){
    status(t('ocrAttempt',{n:i+1,total:processed.variants.length}));
    const result=await worker.recognize(processed.variants[i]);attempts.push(ibOcrParseDetailed(result.data.text,result.data.lines));processed.variants[i]=null
  }
  let values=ibOcrCrossValidate(ibOcrResolve(attempts)),count=Object.keys(values).filter(key=>values[key].level!=='low').length,rotated=false;
  if(count<3)for(const angle of [90,180,270]){
    status(t('ocrOrientation',{n:angle}));
    const canvas=ibOcrRotate(processed.source,angle),contrast=await ibOcrClahe(await ibOcrDenoise(await ibOcrGrayAsync(canvas),canvas.width,canvas.height),canvas.width,canvas.height);
    const result=await worker.recognize(ibOcrCanvasFromData(contrast,canvas.width,canvas.height));
    attempts.push(ibOcrParseDetailed(result.data.text,result.data.lines));
    values=ibOcrCrossValidate(ibOcrResolve(attempts));count=Object.keys(values).filter(key=>values[key].level!=='low').length;
    if(count>=3){rotated=true;break}
  }
  return{values,angle:processed.angle,rotated}
}
async function extractIbReport(){
  const file=ui.ib.file;if(!file)return;captureIb();const runId=uid();
  ui.ib.ocr={status:'running',id:runId,message:t('ocrStarting'),fields:[],readings:{},warnings:[]};render();
  const status=message=>{if(ui.ib.ocr&&ui.ib.ocr.id===runId){ui.ib.ocr.message=message;const node=$('#ibocrstatus');if(node)node.textContent=message}};
  let worker=null;
  try{
    let source,pdf=null,attempts=[],warnings=[];
    if(file.type==='pdf'){
      const loaded=await ibOcrPdfLoad(file.blob);pdf=loaded;source=loaded.canvas;
      warnings=ibOcrQuality(source,source.width,source.height);
      if(loaded.best.score>=3)attempts.push(loaded.best.parsed)
    }else{
      const loaded=ibOcrImageSource();source=loaded.canvas;warnings=ibOcrQuality(source,loaded.width,loaded.height)
    }
    if(!ui.ib.ocr||ui.ib.ocr.id!==runId)return;
    if(file.type!=='pdf'||!pdf||pdf.best.score<3){
      const api=await loadIbScript('tesseract','https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js','Tesseract');
      worker=await api.createWorker('eng',1,{logger:message=>{
        if(message.status==='recognizing text')status(t('ocrWorking',{n:Math.round((message.progress||0)*100)}))
      }});
      if(file.type==='pdf'&&pdf){
        let bestAttempts=null,bestCount=-1,bestQuality=warnings;
        for(let number=1;number<=Math.min(pdf.pdf.numPages,10);number++){
          const native=pdf.pages.find(page=>page.number===number);
          if(native&&native.score>=3){
            const count=Object.keys(native.parsed).length;
            if(count>bestCount){bestAttempts=[native.parsed];bestCount=count;bestQuality=ibOcrQuality(source,source.width,source.height)}
            break
          }
          if(number!==pdf.best.number){source=await ibOcrPdfPage(pdf.pdf,number);ibPdf=source}
          const pageAttempts=native&&native.score?[native.parsed]:[],result=await ibOcrReadCanvas(source,worker,status,pageAttempts);
          const pageWarnings=ibOcrQuality(source,source.width,source.height);if(result.angle||result.rotated)pageWarnings.push('rotated');
          const count=Object.keys(result.values).filter(key=>result.values[key].level!=='low').length;
          if(count>bestCount){bestAttempts=pageAttempts;bestCount=count;bestQuality=pageWarnings}
          if(count>=3)break
        }
        if(bestAttempts){attempts=bestAttempts;warnings=bestQuality}
      }else{const result=await ibOcrReadCanvas(source,worker,status,attempts);if(result.angle||result.rotated)warnings.push('rotated')}
    }
    if(!ui.ib.ocr||ui.ib.ocr.id!==runId)return;
    const readings=ibOcrCrossValidate(ibOcrResolve(attempts)),form=Object.assign({},ui.ib.form||{}),fields=[];
    Object.keys(readings).forEach(key=>{
      const item=readings[key];if(item.level==='low')return;
      if(key==='date'){if(!form.date||form.date===today()){form.date=item.value;fields.push(key)}return}
      if(num(form[key])!=null)return;
      form[key]=item.value;fields.push(key)
    });
    if(Object.values(readings).filter(item=>item.level!=='low').length<3)warnings.push('missing');
    if(Object.values(readings).some(item=>item.suspiciousDecimal))warnings.push('decimal');
    if(pdf){const preview=$('#ibpdfprev');if(preview){preview.width=ibPdf.width;preview.height=ibPdf.height;preview.getContext('2d').drawImage(ibPdf,0,0)}}
    ui.ib.form=form;
    ui.ib.ocr={status:'done',id:runId,fields,readings,warnings,
      message:fields.length?t('ocrFound',{n:fields.length}):Object.keys(readings).length?t('ocrKept',{n:Object.keys(readings).length}):t('ocrNoResults')};
    render()
  }catch(error){
    console.error('InBody report OCR failed:',error);
    if(ui.ib.ocr&&ui.ib.ocr.id===runId){ui.ib.ocr={status:'error',id:runId,fields:[],readings:{},warnings:[],message:t('ocrFailed')};render()}
  }finally{if(worker)await worker.terminate()}
}
