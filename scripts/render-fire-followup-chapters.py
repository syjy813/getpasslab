"""Deterministic, original learning diagrams; see the figure briefs before editing."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/images/fire-safety-manager-level2'
BRIEFS = json.loads((ROOT / 'docs/audits/2026-10-28-fire-followup-chapters/figure-briefs.json').read_text())['figures']
NAVY, MUTED, BLUE, GREEN, AMBER, RED = '#25334B', '#526176', '#175C9B', '#15785C', '#855400', '#90234B'

def rect(x,y,w,h,fill='#F7F9FC',stroke='#CBD5E1',r=12):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>'
def text(x,y,s,size=23,color=NAVY,weight=600,anchor='start'):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}" text-anchor="{anchor}">{escape(s)}</text>'
def line(d,color=BLUE,width=3,arrow=False):
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"'+(' marker-end="url(#'+('water' if color==GREEN else 'error' if color==RED else 'arrow')+')"' if arrow else '')+'/>'
def lamp(y,name,on):
    color=GREEN if on else MUTED
    return f'<circle cx="48" cy="{y-8}" r="13" fill="{color}" stroke="white" stroke-width="3"/>'+text(74,y,name,23)+text(334,y,'켜짐' if on else '꺼짐',22,color,600,'end')
def bell(x,y):
    return line(f'M{x-22} {y+14}Q{x-12} {y+1} {x-13} {y-14}Q{x-12} {y-35} {x} {y-35}Q{x+12} {y-35} {x+13} {y-14}Q{x+12} {y+1} {x+22} {y+14}Z',MUTED,3)+f'<circle cx="{x}" cy="{y+23}" r="5" fill="{MUTED}"/>'
def arrow(y,color=BLUE): return line(f'M190 {y}V{y+25}',color,3,True)

def normal():
    s=rect(16,18,348,306,'url(#metal)',MUTED)
    s+=rect(28,30,324,44,NAVY,NAVY,6)+text(190,61,'평상시 감시',24,'white',700,'middle')
    for y,name,on in [(112,'교류전원',True),(174,'전압지시 정상',True),(236,'예비전원감시',False),(298,'스위치주의',False)]: s+=lamp(y,name,on)
    s+=rect(16,348,348,168,'#FFF9EB','#C4AA71')
    s+=text(36,383,'스위치가 정상 위치를 벗어난 경우',21,AMBER)
    s+='<circle cx="48" cy="420" r="13" fill="#855400" stroke="white" stroke-width="3"/>'
    s+=text(74,428,'스위치주의',23)+text(334,463,'켜짐 / 점멸',22,AMBER,600,'end')
    s+=text(36,495,'시험·정지 스위치 위치 확인',22,AMBER)
    return s

def targets():
    s=''
    for top,label,location in [(18,'주경종 정지','수신기 주변'),(256,'지구경종 정지','각 경계구역')]:
        s+=rect(16,top,348,218)
        s+=rect(38,top+18,304,49,BLUE,BLUE,8)+text(190,top+51,label,24,'white',700,'middle')
        s+=arrow(top+78)
        s+=bell(88,top+158)
        s+=text(147,top+147,location,22,MUTED)
        s+=text(147,top+182,'주경종' if top==18 else '지구경종',25,NAVY,700)
    return s

def reset():
    s=''
    for top,color,tag,labels in [(18,RED,'원인이 남아 있음',['발신기 눌림 유지','수신기만 복구','다시 화재신호']), (290,GREEN,'원인을 먼저 제거',['발신기 원위치','수신기 복구','화재표시 복구'])]:
        s+=rect(16,top,348,254,'#FFF', '#DBC1CE' if color==RED else '#A7C9BD')
        s+=rect(30,top+12,320,38,color,color,7)+text(190,top+39,tag,22,'white',700,'middle')
        for n,label in enumerate(labels):
            y=top+84+n*66
            s+=text(190,y,label,24,color if n==2 else NAVY,700,'middle')
            if n<2:s+=line(f'M190 {y+11}V{y+35}',color,3,True)
    return s

def pipes():
    s=rect(16,18,348,224)+text(36,56,'성능시험배관',25,NAVY,700)
    s+=text(36,87,'펌프 토출측 분기',21,MUTED)
    s+=line('M40 137H143M195 137H247M281 137H336',GREEN,8)
    s+='<circle cx="169" cy="137" r="27" fill="white" stroke="#526176" stroke-width="3"/>'
    s+=line('M152 147L169 128L185 147',MUTED,2)
    s+=line('M247 121L281 153V121L247 153Z',MUTED,2)
    s+=line('M264 121V108M251 108H277',MUTED,3)
    s+=line('M82 137H111',GREEN,3,True)+line('M300 137H325',GREEN,3,True)
    s+=text(169,190,'유량계',22,NAVY,600,'middle')+text(270,190,'유량조절',22,NAVY,600,'middle')
    s+=text(36,223,'유량과 압력을 시험',23,BLUE,700)
    s+=rect(16,266,348,226)+text(36,304,'순환배관',25,NAVY,700)
    s+=text(36,335,'펌프 토출측 분기',21,MUTED)
    s+=line('M40 382H150M198 382H336',GREEN,8)
    s+=rect(150,365,48,34,'url(#metal)',MUTED,4)
    s+=line('M174 365V360L166 355L182 350L166 345',MUTED,2)
    s+=line('M80 382H111',GREEN,3,True)+line('M282 382H318',GREEN,3,True)
    s+=text(174,430,'릴리프밸브',22,NAVY,600,'middle')+text(315,430,'배수',22,NAVY,600,'middle')
    s+=text(36,473,'체절운전 시 수온 상승 방지',23,BLUE,700)
    return s

for brief,draw in zip(BRIEFS,[normal,targets,reset,pipes]):
    h=brief['height']
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="380" height="{h}" viewBox="0 0 380 {h}" role="img" aria-labelledby="t d"><title id="t">{escape(brief['caption'])}</title><desc id="d">{escape(brief['alt'])}</desc><defs><linearGradient id="metal" x2="0%" y2="100%"><stop stop-color="#F4F6F8"/><stop offset=".5" stop-color="#DCE1E7"/><stop offset="1" stop-color="#F1F3F6"/></linearGradient><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0L10 5L0 10Z" fill="{BLUE}"/></marker><marker id="water" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0L10 5L0 10Z" fill="{GREEN}"/></marker><marker id="error" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0L10 5L0 10Z" fill="{RED}"/></marker></defs><rect width="380" height="{h}" fill="white"/><g font-family="Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic, sans-serif">{draw()}</g></svg>'''
    (OUT/brief['asset']).write_text(svg+'\n')
print('Rendered four original SVGs')
