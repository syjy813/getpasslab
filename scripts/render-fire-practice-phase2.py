"""Deterministic educational SVGs; geometry, labels and readings are explicit."""
from pathlib import Path
from math import sin, cos, radians
from html import escape

OUT = Path('public/images/fire-safety-manager-level2')
INK, MUTED, WATER, ERROR = '#25334B', '#526176', '#15785C', '#90234B'
DEFS = '''<defs>
<linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8796A6"/><stop offset=".22" stop-color="#F4F7FA"/><stop offset=".55" stop-color="#D9E1E8"/><stop offset=".8" stop-color="#9AAAB8"/><stop offset="1" stop-color="#DAE3EB"/></linearGradient>
<linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#EDF2F6"/><stop offset=".5" stop-color="#C1CDD8"/><stop offset="1" stop-color="#E5EBF0"/></linearGradient>
<linearGradient id="jet"><stop stop-color="#B9E5D6"/><stop offset="1" stop-color="#E6F6F0"/></linearGradient>
<marker id="flow" markerWidth="2.8" markerHeight="2.8" refX="2.4" refY="1.4" orient="auto"><path d="M0 0L2.8 1.4L0 2.8Z" fill="#15785C"/></marker>
<marker id="signal" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#526176"/></marker>
</defs>'''

def text(x, y, value, size=28, anchor='start', color=INK, weight=600, **attrs):
    extra=' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
    return f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}" fill="{color}" font-weight="{weight}" {extra}>{escape(value)}</text>'

def path(d, stroke=MUTED, width=3, **attrs):
    extra=' '.join(f'{k.replace("_", "-")}="{v}"' for k,v in attrs.items())
    return f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round" {extra}/>'

def pipe(d, water=True):
    return path(d, MUTED, 23)+path(d, 'url(#metal)', 18)+(path(d, WATER, 7) if water else '')

def flow(d): return path(d, WATER, 7, marker_end='url(#flow)')

def number(x,y,n):
    return f'<circle cx="{x}" cy="{y}" r="18" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>'+text(x,y+10,str(n),28,'middle','#1D4ED8',700)

def flange(x,y):
    return f'<rect x="{x-22}" y="{y-7}" width="44" height="14" rx="3" fill="url(#body)" stroke="{MUTED}" stroke-width="2"/><circle cx="{x-16}" cy="{y}" r="2" fill="{MUTED}"/><circle cx="{x+16}" cy="{y}" r="2" fill="{MUTED}"/>'

def head(x,y):
    return f'<g transform="translate({x} {y})"><rect x="-10" y="-16" width="20" height="19" rx="2" fill="url(#metal)" stroke="{MUTED}" stroke-width="2"/>'+path('M-16 2L-11 29H11L16 2',MUTED,4)+f'<rect x="-4" y="4" width="8" height="24" rx="4" fill="#B42335"/>'+path('M-23 34H23',MUTED,5)+'</g>'

def gauge(cx,cy,r=48,value=None):
    parts=[f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#metal)" stroke="{MUTED}" stroke-width="3"/><circle cx="{cx}" cy="{cy}" r="{r-7}" fill="white" stroke="#CBD5E1" stroke-width="2"/>']
    for i in range(21):
        a=radians(135+270*i/20);inner=r-(17 if i%2==0 else 12);outer=r-9
        parts.append(path(f'M{cx+inner*cos(a):.2f} {cy+inner*sin(a):.2f}L{cx+outer*cos(a):.2f} {cy+outer*sin(a):.2f}',MUTED,2 if i%2==0 else 1))
    if value is None:
        parts.append(text(cx,cy+9,'P',30,'middle',MUTED))
    else:
        for v in [0,.5,1]:
            a=radians(135+270*v);rr=r-30
            parts.append(text(cx+rr*cos(a),cy+rr*sin(a)+7,str(v),20,'middle',MUTED,500))
        a=radians(135+270*value)
        parts += [path(f'M{cx} {cy}L{cx+(r-30)*cos(a):.2f} {cy+(r-30)*sin(a):.2f}',INK,5),f'<circle cx="{cx}" cy="{cy}" r="6" fill="{INK}"/>',text(cx,cy-18,'MPa',20,'middle',MUTED),text(cx,cy+40,f'{value:.2f}',28,'middle',INK,700)]
    return ''.join(parts)

def save(name,height,title,desc,parts):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="{height}" viewBox="0 0 640 {height}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc>{DEFS}<rect width="640" height="{height}" fill="white"/><g font-family="Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic, sans-serif">'+''.join(parts)+'</g></svg>\n'
    (OUT/name).write_text(svg)

# Wet test assembly. The gauge branch is pressure sensing, not a discharge route.
p=[]
p += [f'<rect x="310" y="193" width="292" height="354" rx="14" fill="#F7F9FC" stroke="#CBD5E1" stroke-width="3"/>']
for x,y in [(322,206),(590,206),(322,535),(590,535)]:p.append(f'<circle cx="{x}" cy="{y}" r="3" fill="#9AAAB8"/>')
p += [pipe('M110 551V160H360V464'),pipe('M210 160V207'),head(210,223),pipe('M360 350H500V331'),gauge(500,283),flange(110,370),flange(110,426)]
p += [f'<rect x="79" y="377" width="62" height="42" rx="14" fill="url(#body)" stroke="{MUTED}" stroke-width="3"/>',f'<ellipse cx="110" cy="398" rx="21" ry="15" fill="#E2E8F0" stroke="{MUTED}" stroke-width="2"/>',path('M110 393V403',WATER,6)]
# Open gauge cock, with the handle parallel to its horizontal pipe.
p += [f'<rect x="418" y="340" width="24" height="20" rx="4" fill="url(#metal)" stroke="{MUTED}" stroke-width="2"/>',path('M430 340V326',MUTED,4),path('M407 326H453','#2563EB',7)]
# Open test valve, with the lever parallel to the vertical pipe.
p += [f'<rect x="343" y="392" width="34" height="43" rx="8" fill="url(#metal)" stroke="{MUTED}" stroke-width="2"/>',path('M377 412H393',MUTED,4),path('M393 384V436','#2563EB',7),f'<path d="M349 454H371L366 476H354Z" fill="url(#metal)" stroke="{MUTED}" stroke-width="2"/>',path('M360 476V507',WATER,7),f'<path d="M333 511H387L371 534H349Z" fill="url(#body)" stroke="{MUTED}" stroke-width="2"/>',pipe('M360 535V584')]
p += [flow('M110 515V477'),flow('M110 275V227'),flow('M260 160H301'),flow('M360 225V257'),flow('M360 290V316'),flow('M360 550V578')]
p += [text(150,391,'유수검지장치',27),text(220,114,'2차측',28,'middle'),text(460,145,'시험밸브함',28,'middle'),text(210,289,'헤드 닫힘',28,'middle'),text(500,219,'압력계',28,'middle'),text(473,388,'콕밸브 열림',26,'middle'),text(405,445,'시험밸브 열림',26),text(407,493,'시험용 방수구',26),text(402,578,'배수',28),text(110,595,'급수',28,'middle'),number(360,119,1),number(301,414,2),number(415,531,3)]
save('wet-test-valve-assembly-v2.svg',620,'습식 시험밸브함의 시험 상태','2차측 시험배관에서 압력계용 콕밸브와 시험밸브가 열려 있다. 물은 시험용 방수구와 물받이를 거쳐 배수된다. 폐쇄형 헤드에서는 방수하지 않는다.',p)

# A calculated example, not a manufacturer-certified pump curve.
x=lambda q:100+470*q/150
y=lambda pct:470-2.3*pct
p=[]
for pct in [65,100,140]:p += [path(f'M100 {y(pct)}H585','#DFE5ED',1.5),text(86,y(pct)+9,str(pct),26,'end',MUTED,500)]
for q in [0,100,150]:p += [path(f'M{x(q)} 82V470','#DFE5ED',1.5),text(x(q),507,str(q),28,'middle',MUTED,500)]
p += [path('M100 75V470H600',MUTED,3),text(34,38,'압력 (%)',28)]
p += [text(350,551,'유량 (정격 대비 %)',28,'middle'),path(f'M100 {y(135)}Q260 171 {x(100)} {y(100)}Q492 271 {x(150)} {y(100*.37/.60)}',WATER,7)]
p += [path(f'M100 {y(140)}H177','#855400',5),text(154,104,'140% 이하',28),path(f'M505 {y(65)}H606','#855400',5),text(601,448,'65% 이상',28,'end'),path('M606 320.5H615V414H605','#855400',2)]
for q,pct,n in [(0,135,1),(100,100,2)]:
    p += [f'<circle cx="{x(q)}" cy="{y(pct)}" r="9" fill="white" stroke="{WATER}" stroke-width="5"/>']
px,py=x(150),y(100*.37/.60)
p += [path(f'M{px-8} {py-8}L{px+8} {py+8}M{px+8} {py-8}L{px-8} {py+8}',ERROR,5),number(132,204,1),text(160,215,'체절 135%',28),number(220,286,2),text(250,297,'정격 100%',28),path('M394 277L410 252',MUTED,2),number(405,392,3),text(433,403,'최대 61.7%',28,color=ERROR),path(f'M554 365L{px} {py+15}',ERROR,2)]
save('pump-performance-reading-v2.svg',580,'체절과 최대유량 시험 결과','정격값 대비 유량과 압력의 예시 곡선. 체절 135%는 140% 상한 이내이고, 정격점은 100%, 최대유량 150%에서 압력 61.7%는 65% 하한에 미달한다. 곡선은 학습용 예시이다.',p)

# Pitot inlet faces upstream. Its pressure tube terminates at a closed gauge.
p=[text(40,61,'직사형 관창',28),number(267,52,1),text(386,61,'피토관 입구',28),number(351,52,2)]
p += [f'<path d="M28 142H106L168 154H247V198H168L106 210H28Z" fill="url(#metal)" stroke="{MUTED}" stroke-width="3"/>',f'<rect x="45" y="139" width="48" height="74" rx="5" fill="#8194A5" stroke="{MUTED}" stroke-width="3"/>']
for xx in [53,64,75,86]:p.append(path(f'M{xx} 147V205','#CFD8E2',3))
p += [f'<ellipse id="nozzle-outlet" cx="250" cy="176" rx="5" ry="22" fill="#506276"/>',f'<path d="M250 156C338 157 439 154 594 163V190C433 201 337 192 250 196Z" fill="url(#jet)"/>',flow('M432 176H507'),text(459,127,'물 흐름',28,'middle',WATER)]
p += [path('M272 176H330V483H438V461',MUTED,14),path('M272 176H330V483H438V461','#DEE7ED',8),f'<ellipse id="pitot-inlet" cx="272" cy="176" rx="4" ry="8" fill="#25334B"/>',path('M389 84L275 158',MUTED,2),gauge(438,370,90,.20),number(550,426,3),text(438,537,'압력계',28,'middle')]
p += [path('M250 217V261M272 217V261M250 248H272',MUTED,2,id='pitot-distance'),text(261,298,'D/2',28,'middle'),path('M223 154V198M218 154H230M218 198H230',MUTED,2,id='nozzle-diameter'),text(202,185,'D',24,'middle')]
save('pitot-measurement-assembly-v2.svg',570,'관창과 피토게이지의 측정 위치','직사형 관창에서 봉상주수가 오른쪽으로 흐른다. 노즐 구경 D의 절반인 D/2 거리에서 피토관 입구가 왼쪽의 흐름을 마주 본다. 0~1.0MPa 압력계는 0.20MPa를 가리키는 예시이다.',p)

# Preaction: one illustrative state, valve open, closed head, no spray.
p=[f'<rect x="39" y="28" width="270" height="114" rx="16" fill="#F7F9FC" stroke="#CBD5E1" stroke-width="2"/>']
for cx,label in [(92,'A'),(254,'B')]:
    p += [f'<ellipse cx="{cx}" cy="67" rx="26" ry="12" fill="url(#body)" stroke="{MUTED}" stroke-width="2"/>',f'<path d="M{cx-22} 67Q{cx-18} 91 {cx} 91Q{cx+18} 91 {cx+22} 67" fill="#E6ECF1" stroke="{MUTED}" stroke-width="2"/>',f'<circle cx="{cx}" cy="81" r="4" fill="#B42335"/>',text(cx,57,label,26,'middle')]
p += [number(174,63,1),text(174,125,'두 회로 감지',28,'middle'),path('M70 142V350H172',MUTED,4,stroke_dasharray='8 7',marker_end='url(#signal)'),text(92,225,'기동 신호',26),text(92,258,'(점선)',22,color=MUTED)]
p += [pipe('M220 552V188H520V245'),head(520,261),flange(220,297),flange(220,411),f'<rect x="178" y="305" width="84" height="99" rx="22" fill="url(#body)" stroke="{MUTED}" stroke-width="3"/>',f'<circle cx="220" cy="354" r="26" fill="#E9EFF4" stroke="{MUTED}" stroke-width="3"/>',path('M220 329V379',WATER,8),flow('M220 510V466'),flow('M220 270V229'),flow('M356 188H418')]
p += [text(318,354,'밸브 열림',28),number(286,343,2),text(318,390,'준비작동밸브',26,color=MUTED),number(315,239,3),text(345,250,'헤드 닫힘',28),text(520,349,'방수 없음',26,'middle',MUTED),text(391,154,'2차측 공급',28,'middle',WATER),text(220,595,'급수',28,'middle')]
save('preaction-water-supply-v2.svg',625,'밸브 개방과 헤드 닫힘','A와 B 두 회로 감지로 점선 기동 신호가 준비작동밸브에 전달된다. 열린 밸브를 통해 2차측으로 물이 공급되지만 폐쇄형 헤드는 닫혀 있어 방수하지 않는다. 물 경로와 전기 신호는 구분한다.',p)
print('Wrote four phase-2 SVGs')
