import numpy as np, wave
SR=44100; D=236.0; N=int(SR*D)
out=np.zeros((N,2))
rng=np.random.default_rng(1)
def add(sig,t,gain=1.0,pan=0.0):
    i=int(t*SR); j=min(N,i+len(sig))
    if j<=i: return
    s=sig[:j-i]*gain
    out[i:j,0]+=s*(1-pan)*.5*2**.5*.7; out[i:j,1]+=s*(1+pan)*.5*2**.5*.7
def env(n,a=.005,r=.2):
    t=np.arange(n)/SR; e=np.minimum(1,t/a)*np.exp(-t/r); return e
def tone(f,d,a=.005,r=.2,h=(1,.3,.1)):
    n=int(d*SR); t=np.arange(n)/SR
    s=sum(w*np.sin(2*np.pi*f*(k+1)*t) for k,w in enumerate(h))
    return s*env(n,a,r)
def mf(n): return 440*2**((n-69)/12)
# ---- music: I-V-vi-IV in C, 84 bpm
bpm=84; beat=60/bpm; bar=beat*4
chords=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]
music=np.zeros(N)
t=0; k=0
while t<D:
    ch=chords[k%4]
    # pad
    n=int(bar*SR*1.05); tt=np.arange(n)/SR
    pad=sum(np.sin(2*np.pi*mf(m)*tt)+.3*np.sin(2*np.pi*mf(m)*2.003*tt) for m in ch)
    pad*=np.minimum(1,tt/.6)*np.minimum(1,np.maximum(0,(bar*1.05-tt)/.5))
    i=int(t*SR); j=min(N,i+n); music[i:j]+=pad[:j-i]*.05
    # bass
    b=tone(mf(ch[0]-24),beat*2,.01,.6,(1,.2)); i=int(t*SR); j=min(N,i+len(b)); music[i:j]+=b[:j-i]*.12
    i=int((t+beat*2)*SR); j=min(N,i+len(b)); 
    if i<N: music[i:j]+=b[:j-i]*.10
    # marimba arpeggio 8ths
    pat=[0,1,2,1,0,2,1,2]
    for q in range(8):
        m=ch[pat[q]]+12+(12 if q in (3,7) else 0)
        s=tone(mf(m),.5,.002,.12,(1,.0,.15,0,.05)); i=int((t+q*beat/2)*SR); j=min(N,i+len(s))
        if i<N: music[i:j]+=s[:j-i]*.07
    t+=bar; k+=1
tm=np.arange(N)/SR
music*=np.minimum(1,tm/2)*np.minimum(1,(D-tm)/3)
out[:,0]+=music*.55; out[:,1]+=music*.55
# ---- sfx
def noise(d): return rng.standard_normal(int(d*SR))
def lowpass(x,a):
    y=np.zeros_like(x); acc=0
    for i in range(len(x)): acc+=a*(x[i]-acc); y[i]=acc
    return y
def whoosh(d=1.0):
    n=noise(d); n=lowpass(n,.08); t=np.arange(len(n))/SR
    return n*np.sin(np.pi*t/d)**2*1.5
def pop():
    n=int(.12*SR); t=np.arange(n)/SR; f=500+900*t/.12
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/.03)
def chime(base=76):
    s=np.zeros(int(1.6*SR))
    for q,m in enumerate([base,base+4,base+7,base+12]):
        x=tone(mf(m),1.2,.003,.35,(1,.2,.05)); i=int(q*.09*SR); s[i:i+len(x)]+=x
    return s*.5
def ding(m=88): return tone(mf(m),1.2,.002,.4,(1,.0,.25,0,.1))*.6
def tick(): n=int(.02*SR); return rng.standard_normal(n)*np.exp(-np.arange(n)/SR/.003)*.5
def snip(): n=int(.06*SR); return (rng.standard_normal(n)*.6+np.sin(2*np.pi*3000*np.arange(n)/SR))*np.exp(-np.arange(n)/SR/.01)*.5
def dripS(): n=int(.15*SR); t=np.arange(n)/SR; f=900+1400*t/.15; return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/.04)*.6
def pour(d): n=lowpass(noise(d),.25); t=np.arange(len(n))/SR; return n*np.minimum(1,t/.2)*np.minimum(1,(d-t)/.3)*1.2*(1+.3*np.sin(2*np.pi*7*t))
def splash(): n=lowpass(noise(.5),.3); return n*np.exp(-np.arange(len(n))/SR/.12)*1.5
def h(n): s=np.sin(n*127.1+311.7)*43758.5453; return s-np.floor(s)

add(whoosh(1.6),.9,.5)
for tt in [4.4,6.0]: add(pop(),tt,.35)
add(chime(72),4.6,.35)
for i in range(4): add(pop(),24.2+i*1.5+.4,.35,(.6-i*.4))
add(chime(79),31.4,.35)
for i in range(5): add(pop(),40.6+i*1.0+.2,.35)
add(tone(mf(69),.5,.005,.15)*.5,46.4,.4); add(tone(mf(69),.5,.005,.15)*.5,46.75,.4)
for a,b in [(53.2,55.8),(56.2,58.8)]:
    tt=a
    while tt<b: add(snip(),tt,.4); tt+=.35
add(pop(),59.1,.35); add(chime(84),60.2,.25)
add(pour(3.8),65.6,.35)
add(splash(),78.2,.3)
tt=78.6
while tt<90: add(tick(),tt,.35); tt+=.19
add(ding(),90,.35)
add(whoosh(.8),92.6,.25)
for k in range(14):
    add(dripS(),94.6+3.4*(k/14)**1.6+.45,.3)
add(ding(84),97.9,.3)
add(pop(),100.2,.3)
for tt in [101,101.8,102.8]: add(pop(),tt,.25)
add(chime(76),103.2,.25)
for i in range(4): add(pop(),106.3+i*.25,.3)
add(splash(),108.4,.3)
tt=108.6
while tt<113.2: add(tick(),tt,.3); tt+=.19
for i,nd in enumerate([10,7,4,1]):
    for k in range(nd): add(dripS(),115.4+2.6*(k/nd)**1.5+.4,.22,(.6-i*.4))
add(chime(79),118.6,.3)
add(chime(72),124.6,.35)
for i in range(4): add(pop(),126+i*.5,.25)
for i in range(4): add(pop(),132.4+i*1.2,.3)
for i in range(4):
    n=int(1.4*SR); t=np.arange(n)/SR; f=mf(64+i*3)*(1+.5*t/1.4)
    add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,t/.05)*np.exp(-t/.8)*.4,139+i*1.6,.25)
add(chime(84),146.2,.35)
add(whoosh(1.4),156.2,.4)
add(whoosh(2.5),167.8,.45)
for i in range(4): add(pop(),158.6+i*1.5,.25)
# gentle water bubbles in cross-section
for k in range(60):
    tt=171+k*.25+h(k)*.2
    if tt<186: add(dripS()*.5,tt,.15,(h(k+3)-.5))
add(pop(),186.4,.3)
add(pop(),196.6,.3)
for k in range(5): add(tone(mf(81),.3,.002,.08)*.6,202+k,.35)
add(chime(79),207.4,.45)
add(chime(72),216.4,.4); add(chime(79),216.8,.35); add(chime(84),217.2,.3)
add(pop(),222.6,.3)
add(chime(76),229.4,.4)
# normalize
pk=np.max(np.abs(out)); out=out/pk*.8
pcm=(out*32767).astype(np.int16)
with wave.open('soundtrack.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('done',pk)
