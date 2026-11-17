<script>
(function(){
/* Everything a student needs works without this script; it only adds the name, navigation polish and printing. */
document.documentElement.className += ' js';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var nj=$('#nojs'); if(nj) nj.style.display='none';
var GROUP={t1:'سفيرات الصحة',t2:'نجمات النشاط',t3:'خبيرات العادات',t4:'مبدعات الصحة'};
var TIMES=['الصباح الباكر','في المدرسة','وقت الغداء','العصر','الليل'];
var student='';
try{student=localStorage.getItem('hg-name')||''}catch(e){}
$('#sname').value=student;
$('#sname').addEventListener('input',function(){student=this.value.trim();$('#warn').textContent='';try{localStorage.setItem('hg-name',student)}catch(e){}});

function show(id){$$('section').forEach(function(s){s.hidden=s.id!==id});window.scrollTo(0,0);
  $$('[data-name]').forEach(function(e){e.textContent='الطالبة: '+(student||'—')});}
$$('[data-open]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();
  student=$('#sname').value.trim();
  if(!student){$('#warn').textContent='اكتبي اسمك أولًا، ثم افتحي مهمة مجموعتك.';$('#sname').focus();return}
  show(b.getAttribute('data-open'))})});
$$('[data-home]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();show('home');try{history.replaceState(null,'',location.pathname)}catch(x){}})});
if(/^#t[1-4]$/.test(location.hash)){student=$('#sname').value.trim();show(location.hash.slice(1))}

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function picked(f,name){var i=$('input[name="'+name+'"]:checked',f);return i?{v:i.value,ok:i.hasAttribute('data-ok')}:null}
function mark(p){return !p?'لم تُجب':esc(p.v)+(p.ok?' ✔':' ✘')}
function box(t){return '<div class="pr">'+esc(t||'—')+'</div>'}
$$('[data-print]').forEach(function(b){b.addEventListener('click',function(){
  var id=b.getAttribute('data-print'),f=b.closest('form'),h='<h1>فرق الصحة الأربع | مهام التعلم التعاوني</h1><p><b>اسم الطالبة:</b> '+esc(student||'—')+' &nbsp; <b>المجموعة:</b> '+GROUP[id]+'</p>';
  if(id==='t1'){h+='<h2>تصنيف العادات</h2>'+$$('.item',f).map(function(it,i){return '<div class="pr">'+esc($('b',it).textContent)+' ← '+mark(picked(f,'a'+(i+1)))+'</div>'}).join('')+'<h2>السبب</h2>'+box(f.why.value)}
  if(id==='t2'){h+='<h2>١ أيهما تحافظ على صحتها أكثر؟</h2><div class="pr">'+mark(picked(f,'q1'))+'</div><h2>٢ لماذا تشعر ريم بالنشاط أكثر من هند؟</h2>'+box(f.q2.value)+'<h2>٣ ماذا تلاحظين في نتائج قياس النبض؟ وبماذا تفسّرين ذلك؟</h2>'+box(f.q3.value)}
  if(id==='t3'){h+='<h2>نموذج «يومي الصحي»</h2>'+$$('.items .item',f).map(function(it,i){var p=picked(f,'d'+(i+1));return '<div class="pr">'+esc($('b',it).textContent)+' ← '+(p?esc(TIMES[p.v-1])+(p.ok?' ✔':' ✘'):'لم تُحدَّد')+'</div>'}).join('')}
  if(id==='t4'){h+='<h2>عنوان القصة</h2>'+box(f.title.value)+'<h2>١ العادة غير الصحية</h2>'+box(f.s1.value)+'<h2>٢ التغيير</h2>'+box(f.s2.value)+'<h2>٣ النتيجة</h2>'+box(f.s3.value)+'<h2>المعايير المحققة</h2>'+box($$('input[name="k"]:checked',f).map(function(x){return x.value}).join('، '))}
  h+='<p style="text-align:center;margin-top:16px"><b>أ/ شامه البقمي</b></p>';
  $('#print').innerHTML=h;window.print()})});
})();
</script>