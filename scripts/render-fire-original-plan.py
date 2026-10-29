"""Original-plan technical drawings. Read figure-briefs.json and the image standard first."""
from pathlib import Path
from html import escape
import json
R=Path(__file__).resolve().parents[1]; A=R/'docs/audits/2026-10-28-fire-original-plan'; O=R/'public/images/fire-safety-manager-level2'
N='#25334B'; M='#526176'; B='#175C9B'; W='#15785C'
def t(x,y,s,size=22,color=N,anchor='start',weight=600):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" text-anchor="{anchor}" font-weight="{weight}">{escape(s)}</text>'
def box(x,y,w,h,fill='#F7F9FC',stroke='#CBD5E1',rx=10):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def p(d,color=M,width=3,arrow=False,dash=False):return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"'+(' marker-end="url(#water)"' if arrow and color==W else ' marker-end="url(#blue)"' if arrow else '')+(' stroke-dasharray="6 6"' if dash else '')+'/>'
def circle(x,y,r,fill='white',stroke=M):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2.5"/>'
def cyl(x,y,w,h):return box(x,y,w,h,'url(#metal)',M,w*.3)+box(x+w*.28,y-16,w*.44,16,'#DCE1E7',M,3)
def pump(x,y):return circle(x,y,27,'url(#metal)')+circle(x,y,12,'white')+p(f'M{x} {y}Q{x+13} {y-5} {x+4} {y-12}M{x} {y}Q{x-11} {y-8} {x-12} {y+2}M{x} {y}Q{x-1} {y+12} {x+10} {y+7}',M,2)+box(x+27,y-21,66,42,'url(#metal)',M,4)+p(f'M{x+39} {y-14}V{y+14}M{x+51} {y-14}V{y+14}M{x+63} {y-14}V{y+14}',M,2)
def valve(x,y):return p(f'M{x-16} {y-16}L{x+16} {y+16}H{x-16}L{x+16} {y-16}Z',M,2.5)+p(f'M{x} {y}H{x+35}',M,2.5)+circle(x+39,y,9,'white')
def gauge(x,y):return circle(x,y,32,'white')+p(f'M{x-20} {y+12}Q{x} {y-27} {x+20} {y+12}',M,2)+p(f'M{x} {y}L{x+11} {y-17}',B,3)+circle(x,y,3,B,B)

def relief():
 s=p('M70 42V300',W,9)+p('M70 235H328V288',W,9)+circle(70,235,5,W,W)
 s+=valve(70,78)+t(126,85,'토출밸브 닫힘',22)+circle(70,150,20)+p('M57 160L70 140L83 160Z',M,2)+t(126,158,'체크밸브',22)
 s+=box(215,219,40,32,'url(#metal)',M,3)+p('M235 219V210L227 205L243 200L227 195',M,2)
 s+=t(184,184,'릴리프밸브',22)+p('M98 235H150',W,3,True)+p('M278 235H314',W,3,True)+t(284,321,'배수',22)
 s+=p('M70 300V313',W,9)+pump(70,340)+p('M18 340H43',W,8,True)+t(35,391,'펌프 운전',22)+t(20,28,'설비측',22)
 s+=p('M20 423H360','#CBD5E1',1.5)
 for x,opened in [(95,False),(280,True)]:
  s+=t(x,464,'닫힘' if not opened else '열림',23,B,'middle',700)
  s+=box(x-50,540,100,96,'url(#metal)',M,8)+box(x-39,552,78,68,'white','white',3)
  s+=p(f'M{x} 650V595',W,10)
  s+=p(f'M{x+39} 580H{x+72}',M,12)
  s+=p(f'M{x} 490V500L{x-10} 505L{x+10} 515L{x-10} 525L{x+10} 535L{x} 540V{574 if opened else 590}',M,2.5)
  s+=box(x-18,570 if opened else 586,36,8,M,M,1)
  if opened:s+=p(f'M{x} 600V589Q{x} 580 {x+15} 580H{x+69}',W,7,True)
  s+=t(x,687,'물의 압력' if opened else '스프링 힘',21,N,'middle')
 return s,710

def chamber():
 s=t(22,34,'① 압력계',22)+t(204,34,'② 압력스위치',21)
 s+=gauge(96,108)+p('M96 140V218',M,9)
 s+=box(218,82,76,64,'url(#metal)',M,6)+t(256,124,'PS',25,B,'middle',700)+p('M256 146V222',M,8)
 s+=p('M294 110H342V161',B,3,True,True)+t(310,190,'기동 신호',21,B,'middle')
 s+=box(80,214,190,230,'url(#metal)',M,44)+box(92,230,166,200,'#F7F9FC','none',34)
 s+='<path d="M93 344H257V396Q257 430 223 430H127Q93 430 93 396Z" fill="#DCEDE6"/>'
 s+=t(175,292,'공기',23,N,'middle')+t(175,393,'물',23,W,'middle')
 s+=p('M270 302H314',M,9)+box(306,282,20,35,'url(#metal)',M,3)+p('M316 282V270L308 264L324 258',M,2)
 s+=t(322,222,'③',21,N,'middle')+t(322,247,'안전밸브',21,N,'middle')+p('M20 374H80',W,8)+p('M175 444V510H320',W,8)+valve(175,480)+t(212,548,'④ 배수밸브',21)
 s+=t(20,590,'배관 압력과 연결',22)
 return s,620

def tank():
 s=box(48,50,198,440,'url(#metal)',M,12)+box(57,65,180,412,'white','white',5)
 s+=box(58,100,178,80,'#EFF6F2','none',0)+box(58,180,178,240,'#DCEDE6','none',0)+box(58,420,178,55,'#EEF0F3','none',0)
 s+=p('M58 100H236',W,3)+p('M58 180H236M58 420H236',M,1.5,False,True)
 s+=p('M246 180H340',W,9).replace('<path ', '<path id="general-intake" ',1)+p('M246 420H340',W,9).replace('<path ', '<path id="fire-intake" ',1)+p('M285 180H322',W,3,True)+p('M285 420H322',W,3,True)
 s+=t(302,152,'일반급수',21,N,'middle')+t(302,460,'소화용',22,N,'middle')
 s+=t(146,270,'소화용',24,W,'middle',700)+t(146,306,'유효수량',24,W,'middle',700)+t(146,344,'높이 1.5m',22,W,'middle')
 s+=p('M32 180V420M26 180H38M26 420H38',M,2)+t(146,458,'흡수구 아래',21,M,'middle')
 s+=t(190,540,'두 흡수구 사이의 물',23,N,'middle')
 return s,570

def gas():
 s=box(16,18,348,296)+box(34,76,126,72,'url(#metal)',M,8)+t(97,120,'제어반',23,N,'middle')
 s+=p('M160 111H228',B,3,True,True)+t(191,88,'명령',21,B,'middle')
 s+=box(236,93,48,36,'url(#metal)',M,3)+p('M260 129V161',M,5)+cyl(226,170,68,102)
 s+=t(260,58,'솔레노이드',21,N,'middle')+t(260,299,'기동용기',23,N,'middle')+t(36,218,'기동용',22,B)+t(36,249,'가스',22,B)
 s+=box(16,340,348,274)+p('M32 525H342',M,10)+p('M175 525V473',M,7)
 s+=box(135,411,80,62,'url(#metal)',M,6)+t(175,452,'PS',25,B,'middle',700)+t(175,386,'압력스위치',21,N,'middle')
 s+=p('M215 443H246',B,3,True,True)+box(248,405,96,75,'#F7F9FC',M,6)+t(296,434,'제어반',21,N,'middle')+t(296,464,'확인표시',21,N,'middle')
 s+=t(190,572,'감시 대상 배관',23,N,'middle')
 return s,640

def overview():
 s=box(28,28,105,105,'url(#metal)',M,9)+box(35,80,91,46,'#DCEDE6','none',2)+t(175,90,'수원',24)
 s+=p('M80 133V189M80 244V515H337',W,9)+pump(80,217)+t(194,225,'펌프',23)
 s+=circle(80,310,20)+p('M67 300L80 320L93 300Z',M,2)+t(140,318,'체크밸브',22)
 s+=valve(80,400)+t(140,408,'개폐밸브',22)+p('M80 460H225',W,7)+circle(80,460,5,W,W)
 s+=box(225,435,110,56,'url(#metal)',M,7)+t(280,471,'압력 검지',21,N,'middle')+p('M335 463H355V557',B,3,True,True)+t(310,590,'기동 신호',21,B,'middle')
 s+=p('M80 267V281',W,3,True)+p('M174 515H211',W,3,True)+t(20,565,'설비로 공급',22,W)
 return s,620

def modes():
 s=''
 for y,name in [(16,'전역방출'),(220,'국소방출'),(424,'호스릴')]:s+=box(16,y,348,186)+t(34,y+34,name,24)
 s+=box(34,76,150,109,'white',M,2)+p('M51 100H167',M,4)
 for x in [67,137]:
  s+=p(f'M{x} 100V110M{x-7} 114H{x+7}',M,3)
  s+=p(f'M{x} 118L{x-18} 160M{x} 118V164M{x} 118L{x+18} 160',M,2,False,True)
 s+=box(91,154,36,28,'#DCE1E7',M,2)+t(224,121,'구획 공간',21)+t(224,153,'전체',23)
 s+=box(66,332,91,42,'url(#metal)',M,3)+p('M112 267V286M103 290H121',M,4)
 s+=p('M112 297L83 330M112 297V330M112 297L141 330',M,2,False,True)+t(224,319,'방호대상',21)+t(224,351,'주변',23)
 s+=circle(91,517,32,'url(#metal)')+circle(91,517,20,'white')+circle(91,517,10,'white')
 s+=p('M91 549Q91 580 140 580Q184 580 176 542',M,6)+p('M171 542L190 528M185 523L196 534',M,4)+t(224,516,'호스와',22)+t(224,548,'노즐',22)
 return s,628

def safety():
 s=''
 for y,title in [(18,'방출 차단 확인'),(218,'신호와 경보 시험'),(418,'분리·정지 장치 복구')]:s+=box(16,y,348,165)+t(190,y+37,title,23,N,'middle',700)
 s+=cyl(46,96,46,65)+t(145,100,'전기 경로',21)+t(145,128,'수동·기계 경로',21)+p('M304 126L314 136L338 109',W,4)
 s+=p('M190 188V209',B,3,True)+box(44,286,124,68,'url(#metal)',M,6)+circle(65,311,7,W,W)+circle(65,336,7,B,B)+t(195,313,'입력 확인',22)+t(195,346,'경보 확인',22)
 s+=p('M190 388V409',B,3,True)+box(48,474,95,90,'white',M,4)
 for y in [491,516,541]:s+=p(f'M59 {y}L65 {y+6}L76 {y-6}',W,2.5)+p(f'M84 {y}H130','#CBD5E1',2)
 s+=t(177,509,'기록과 대조',22)+t(177,546,'정상 상태 확인',21)
 return s,600

briefs=json.loads((A/'figure-briefs.json').read_text()); fns={'FSM2-080':relief,'FSM2-081':chamber,'FSM2-082':tank,'FSM2-083':gas,'FSM2-033':overview,'FSM2-041':modes,'FSM2-042':safety}
for b in briefs['figures']:
 if b['id']=='FSM2-047':
  import re
  b['height']=int(re.search(r'height="(\d+)"',(O/b['asset']).read_text())[1]);continue
 content,height=fns[b['id']]();b['height']=height
 defs=f'<defs><linearGradient id="metal" x2="0%" y2="100%"><stop stop-color="#F4F6F8"/><stop offset=".5" stop-color="#DCE1E7"/><stop offset="1" stop-color="#F1F3F6"/></linearGradient><marker id="water" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto"><path d="M0 0L10 5L0 10Z" fill="{W}"/></marker><marker id="blue" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto"><path d="M0 0L10 5L0 10Z" fill="{B}"/></marker></defs>'
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="380" height="{height}" viewBox="0 0 380 {height}" role="img" aria-labelledby="t d"><title id="t">{escape(b["caption"])}</title><desc id="d">{escape(b["alt"])}</desc>{defs}<rect width="380" height="{height}" fill="white"/><g font-family="Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic, sans-serif">{content}</g></svg>'
 (O/b['asset']).write_text(svg+'\n')
(A/'figure-briefs.json').write_text(json.dumps(briefs,ensure_ascii=False,indent=2)+'\n')
print('Rendered seven technical diagrams; retained approved normal-state artwork')
