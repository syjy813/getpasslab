#!/usr/bin/env python3
from __future__ import annotations
import base64, hashlib, json, os, re, zlib
from collections import Counter
from pathlib import Path

CHAPTER_DIR=Path("src/content/chapters")
QUESTIONS_FILE=Path("src/data/questions.json")
EXPECTED_BASE_HASH="02744f54fce83e6cd5de8d1634d1d2771a7668c12154844f4879b32ca64d95b7"
EXPECTED_OUTPUT_HASH="7713603c55f931f832aac2ba7ac7c7f6a80b3175e93bbd76b4baac3300d0fc7b"
EXPECTED_FILE_COUNT=250
EXPECTED_CHANGED_COUNT=133
PAYLOAD_B85="""c-rkfTTfe8x_@Phrxw|5ZoNK?)M<5ebTm3sX&%l?q}C-);xhyoo22a-RWh()3^;>nFxe2Bm=<EFT-AU9qmmgZKP8XsZOvbp@3z)n`(^`erZYP8(1P*aYkljx-`1Bu4i&N^lezJ+PsSf)^ZDGZY+>mAKMsxD&ECt6WJcf2XEX5igKYX%X6#NjKYqWEzLP0r3vb-Jh0l45wccaL>MgardbhXG9eRK0=2+VDs%7`v9ruT>yI{LV_SwOyH9UNF(D0lcukKiG>vVY7t9Ptkb?59y$MPCASjeq7?rz6&+cj^dZk@G@-olo<umW#-CC8g94-dPWHLF*yxQjczYRz5TdV}_Yjn`JZlT&ZOdF{i@%jubqUrtZIj?2S7xV77My!vvlO3M!qBd`lwy=w8bkN*>%ew{(#ZH;x|Wv^LszngWNWy@RZdh6}8ZreTRzyq?RtPiJhmu$=1Y@h9Qyt=K9)my6~aK@60Tkdw(@@h694cA9p&`K8U?b&;>V9z;qm(~DauUQ0KE&vvIiJ`AjLnGs3g~|MVBHEjU(ea6FdSrZbG&51irYG{*2iY<Frayh${VJjQsCw4v0Q@Dly^Fx~s)ybpJX%DgH;cXH8lrv;fPfDG4t#*8ypx??spW11W}EX!p|kxNLZUuryA6*5weT6h0w4|E2Kvj!-s1|P7ty}c#Y6A4-Dy}D2)^5PA8n~~FWK%UutKNkK5H3xJllWnO}AbgyK`T|8ZVB|4qLD#0rYSMPF14EowNNiKv;Gk)euM^k9XqGZ**R_T=e#45eBbnyNe~g_+iW2?|6+Vz?huG^6ag%0~-+m2k;tI3pl~sDk7rr!S!7W5bZT8gq=fR=7xU44zmH#P>I*%_!qg6+~k+(+}N$$$RM!-zUWnVg>ib1OR%v!_Ykp!L}*W0$U;Xpu@(ItA!b0%+Fv6qXYDlv8YBpq5XH%DZg@xV_}5#&f>S7Ti*+IoU}t02#5tUQx(%pr1Bb$MfVJnqCD*TCw<ad;i40X3zqLlssj^Tx?!h7c`G+Fyc4WKX?GPRb0?R!p_SPJP%-uQl8pWv0{N|&V)3Yz9i!Y9U^CAC6TM&Z0<}$29B0k&oj%r#2JBT`vLbp=0gpYwcciSn8@Bk#=ScXlBNrAt*^N6^mS@=J_JB8<*@oJ}}aH<{84k`wK?|Vd&(p$A4l7TmYGN^AVPRhcaQ4Acrw>lr<AKt;Mp8}#li6uyUHh*V)Y#bP-@aE^)&$9XS?d-_iG59%}`FsGwz`?g*!Hvq<@d=&#N06<OoEzYDH_G_uvv!3fykQZyZ<Gkfz{qoDCee!fbRKn_djebo56VhJ3pg3Djwp>MJMO+sr#x8;=mgjTIFuN7ss+a<79zOdt19v;a_wgA?6^z(CmSKw2^f0|R55ST`?J#n5bcuQhqUnHHZZ3_r{2n`*KNo%FOK0A*g1_j2B>yU^%o$mJ*RuNUjz=quQnUB9BqiiM(qLw#2-g?K#UE-<VHvD-^-0<#zwMf|F?Yh_9&QF{C$AI+-!>&EA<GU7Ey`O-%g&8W?5ZMS-qO01in-B+HH`r-QMapyyMv*U<b(k^iI1DSWc0B0e-CQkh0pCg%4*Pus2)F@|6fJAe<gD2u7+xAOjXf^81T{aD(;*1_nFAFcC$GzZ4hY*DUy+-Gv2f?reo*eQDNx_MGIV{k0MTvan(HCl<yne988O4rl`(h&yKHfsPw3*c+?@0crIXPDq}KY0nNT$g~=MfUpMmBEgI}6padC$a_+;&@4S`iRvS!0JZUWR^UN|_;vu88#OT6ss=2-SMAwtA&TN0^mo?0g~KEs(tI;Os4v6;fZLSP_vB2C+<Nogi+ymW;Ot6M`Dah!LpTNCWbR=Kf9mZKOYFoT1nz;2gzm?7U{-({@-4oPFNZnrWzq5B@HgS5Ul!NAeaC%zDzK7?W027Pw^z>o3jFY>qcsM=^eq}p^OW&qBnrn9pN!^#P0unLGuQT43U@RAm&xBUyt4GfXl5+^hx?h)+-<P`gB>-5)ZQaSxxY(n29TB-fV>p_ie3<c_jr~+5jOUpyNzu;8aNAJf9PwkTJjn;YHUCmNQe7q57jlTYkA+yy4#NV?)nNy8|v?5XEp#DqppTF7(IuXDFBN<!oiRWk=a1r&<6k#{iW-z0`lw6qw<a(V&eo>h_1{~v9N)+Rdp+k7)`Ud1&=4XWk_&P8}V+LLArZ|Tj_kR@cZ;_h=0cO0~|B)bC%WsDL|M5RF)_+y$x^x+#_(MDqx<_y?qJ-hwcZ+Y8PnJ1eRKZpN(a&Gmri+tm!sN68Qis(SoxpdUg!4!46@>#x>o=4j=@+F(l`=|MS7`47CU@BCs%+zVZsFMKGkm&%8C#8Z9AMfk@bbWLfQqkjV3-D3|6z#hWhS;rHMm@EJ%znia28>NzFQOJr7on-Ey<Ssi^#ZKHjE5Lt4u!7JeRA#qBR^YlX(*%rbBzy;YDGg@TugxM)}A}A3vb7j&9v3?~|yO6n^1<(6lW-N0jdk+Nk&58W@WR}C->>uvuCh(8x$uB1chr1|T;Mu~d=~r-=0O6pCt0jz8NO^R?$v}JFV1EXVz270;sF4oippaCZt$mqJ)H-3L2KZ_skAOczYk_(NG=Ru(%!=A~7j3Nh5XaL1;Iq2OBMYkba?KsWFY}|aJeh^&2JPIaqT4!mNSI$Hx^T!B3ViAGKwb3^P!kmqAS=P5`)~Nl33>fl-Q0&6Hbx0YX&d-UKAoAE7|)GO;#cRPEr+0hWjZzJS<t8(+oV@mu>wxu8M2eCp&L{990m&LfdDIfQwHRd{)L|qi>`LXyYn7@51uy*pwIZc?I9SNO^~79`a@K8;5CsLfsR|G$OiZ&rC7(_W8RnDNX4U>YXO_>ub}-$qDu;*IR(LQyvW%NZ^IUn({6xvw1<Ak3y1$^7ES@&1KRx<83<5=075K&aEPY8Tk@)#1OkUkhMGx=^mt?9P}mQn`U;AO>0(`0>x)r|*ZPUPQpnvI8zA|3&L${3(sT_XFg!_Wz@6?Or*e!0LCY!xP-|qv4qLv!Q>yG4XM(=l1^B_}vP24+BJ|N}#qvNEtnZ39gzhc`mb?w=5ZXzyUJMt*0}KO!&c-amu3q=wYt&#jd5@owb0|8^%#(qK7{51zXPuc3y2AXpA-E!^ZtDmQOUMZZBp!DO1qqsfBQVap@zO+Dbonuvu)55g*sLZqS0rzCH#2r8H+Cmo7|GneJwAFXEhJ}aKfu^8wlJbV!^T2-K#2qdb+gu6K@Q#rM(+Yww5!0>;%ku`pwt<<%8W2}vWyTRtniT%(~hrdWIL4Q?{?fr4TJ}lVmG5jis;}FRI&&|OisZ_VNk@-`jLR=_c_^zub`z_taBa}Vu3%Q9>6~*VmOPjZl3a5=<mXB_eV4N^zGbdc?gfm+f9$$&*um0+{G3OG`JloF|6H?ujUR>)q<tncKk$w``3!f;MGsnGoY5*ly*jk7PJ#4Yn&;Jl8{H*PYhh}dZ>F5vx{~1Q!1{FoUhz}#Dg8<!6u_vmPNyi+~6pAmwnbKTM|7df9(S>Jgg%S`+SBjGd2eCMf&QMD_7F_%;ccN1GuI8H6$&EYQ8qVnt~ND{k?c%U3F(MYF`5m^b_T9wiYJGSo0G@PCLCBaMik6vVp~qYRqSB>e@gTwFwak&vh+z<H{BJD9UfSLh0fq<aGdz{EIaR8r#ZfMske4f>bYASFf<S@{ed;yO9e1;l^9U{Qf)dzVXgm<Pp(!#=86mH1j|aa;Y$j1>&wE9!$L=GIXj!QYh#Gu46KQDha|eaoOPP7Zao71r(EWIGx~(VVZmCdmsoXW6U0|@h8rbNgahe%C27qA*c^q!^0dv&P=Hl;5+?ER$zCJl<gF#dd?XHQkPNd1UP8gYE8`dwmRw)yP*CK=Kf>=Dcqs7<fd<JfGp&)YB)i>?FN5B)k-8bU{~+QL5G<IR25~+?_wqawSlNVGB`e~ikia{fEZ(@r9rMaR<XeA1@_0BIWk|lNd6Ti8Pw(&?zaD8WN}eFegVeilYDk!G&4e?N|iQ5!e+<1cI6rg*}L8omE8vReaGD|84MS1d01snK@5qRWbecY=p%G5(P3>&sf9K<NwnGNty0m$>OHZ&xrg#K`t<1Ps%#SHJobydxrQJT_^*!%WGjN0@cs6HJ;CT<rH#5;c?=yo7=R8whSUkzJ~2;F<Uz|O#dAX`1C7@Zjn@q{zVmJni|{)7?hv^mlo~s3bE{WfR^B>b2Yvbd8Huj341k(YLDn&Cgqaay`;AU2i~S|A8#D_6^Mu$8+a~0HF-+{-t3+!jh)v$pcMFN>QHQus=aXC~z^p>)4FjduuK`MNV@x=ZDGo>7EL1vt2L-iEp%Dm-k3)C2ZGD>0KFDQ1f8V+}^uH5#aQ9x-zB%+M+1px!$`S;M6$i+*>i|e9_N(jf3XH-U!T<=I&=>177Ln4-)_OA~R{vF!bHdYGz|5iwh-p~bFe9_qmWNS!h5Z1aB_ik&sTj^@P@Tn0!;nN!>WB2A)ECXXObF#>zN8k>aa1x4BqHig1S$fDv*l%uwd&8+`BFpaFpU*)l~{;ekuP>|c!oN=QFb4$xXmfdNw^E!z|k!{6jBCItSh~My*{fOU?yaIRNamgwdCdf8brVjC$Twk5TgX#BT4O4sW2SMXqd$a1v0&d0*Wz@4FD1_n)z8c&(HsYzTTg)fQ35McdH08+yvN|NKQ_BSF#VNCqM%s>DRi35)U1rKd<PgL%KZ%HBQ9`>RdS+LjTow!;1TD5n!|n?Oimy>$~nOYDF~1c8y81%_aOmmWGmVAWHfV>?m+5@<|1I1GwXWa||fu+-d;+Zm0_C*YSNvK?o?~W-?_T(mNL*IQ2>>datc;Ek+SLM8-i!CoIvi6=gz+l|&ba^E@f>^HpOGTCgS63!zf=eOq4=r0ePprMt=VdCUCjntT;yimUJVYTZ5PVh~J$fE~Y*whvb#-qp3hSMM2Ly_dZETY;|v>s?jsIy3L>*;)*O*%5{8fJM6=#tLdnwTFo^eRj&2=q)tYMGUO4oX=>ViZ4$ds;OR(lT<qd1#LQ!gA5cvc1n&IO8umCB8OZkWZ^(2NEKTT>|hKh5#O}q&ex(=1+`LCdur>#R-H;$gRKj>TahL*vNH)eC?(gJZ1VG6m~7&@6sH>jqief;xj#xuaZj+U+33yGwLX`ZRVxh_=p=tjA;6YbFOxNGuPM3#9;+PyjQh&4Kv3kIG5Is$5@KKp3R6S6_*a;&B=<*3r^CY*rYEQtA8?@2mnUaR^}rmFQfBljs7Xz(b%6*md06E!F_w`t6&f5{1rosnbf{BIs(FFJpg7>laf|q3zp`GgH~!XL!qAog5h#X--%qS&{v0*OgzR$?rhU=@_hC|)y3Bl(6HymVh)HUaO%32$LBj_CJIP6{U<Z=1HZ=hlU}Fk@v2Lm?UvT6A9j|(7`SQ~jvkBlt;YjMF3xjhmEE;}2E(PB5iQ~7!g>f2TV~~;)gyd)CX6h0JVO`&$^jWY`umce=<-8VmF2lbAt2VEKf8$K#^&6ttKK|%G$PRSdh8Ib?N1A%1+JNtAP7*&o;(Z2nRx#Wb6kZ5TNFs2=lkRkfKyYH4f`T5A^bW#-@c9p39RK>o@rN&tKhjV%u*H?!VfbzFkh~7-(+~c3TKf?G`w0H~^{0{CS=0zAv`}?}`;A(Zfje&xlS6PaDim%s4ny#;Sl|j&Gprb{+SLf!RJ{MPh<Q^=+a`4ll59wqH+rCrDb?r4orH?9AXw8@E!3x|Qv2aXz?a3k*>Gq}kB@REsCO^qVrlD2FPa^JfG4wAF=a*j08>_PV_tO(Hp}uPd_Xz<uiyRlzmZ156-;@=5#lPiwgd}6<Nghqj8Ji0l!_S8f@wz@B!gQ63ORKZaK<APeh(d6<ls2h_C0in0s6!jO@B4|;#aAmiSa@-^{MmTBjfizyI-LCP#&)tQ0I+gzi${R4b=e>=MNeWaTv-E#kso{y65aaQbyiv9EDSwJ0`ZBP@}cT55+>%Zyl|2d-dlO%O&I;F4u<gOXVuUI1WB72JZrS3;9MhPoFbyk$n1MC`%DVg`bBIhd)@x2$q&O?@MoReIAR=hTpF@Gx8ci3whq|f`5m{zhroP0oCzO7AXgN7KO2L_dtO>AYS8s)7)hCo-QVGs~V?>z$3I95^hK!5bA3pN1Yxv63+Y{W~sVuDqB}ON~IXhUykTK?113AH`s@amMBGasz#NIx~!twyJ)ZKsz4&=R<QZGHg@TStcFgZ%S&b?gjCZ@kyjLS+Wi=kA`%r>2BSVZQVobW<>yA|KLkSwv6dgjUew1o%hR_<Glje92Zc0ft{k^BV-KC;tjBHb(=j=)nSs(JR7%sus^MXNR48RMKiYc`xtYb7l)8m?V5@kMt1!d>Pbz>@)n6uyv28(L4cww{TZ%}p0JZ=b`vPhPGe&xeeFY*<_{vy9JJ2QXocPsL-$~`bOzdVi605Md;k6{`K9)#F?p7FqlEfuWG+c7qAS2sU_J{MlICl4+V`~&fp?>T^a=O0jt#-JPpDr{=wLKUng;EYa9)qEvA2NpGB=j#r$20<;fzVPUM#P$#4+dljS4o1Rlgnq*h5Hi|`D}q2JSOtFv60-wsOi&1eQWL1X}Sq}a^gZlN@U-LZsc96cz;5>;XQ7Vg9TKk9|X16-jP6&OFH;1$Lm_fa)&GJ;=d;sJuy@PT{&0Aa724!NpN2P+Rgw_<?^PE%r6BjHeuWbDH;7_GLyfPoy^_}L?IBGOny0<9m8w1;}hBZWUeo9-VORrZ<}Aeljv5xry^+&d<?tWo7=J|9O!6oWqsFeZox^(je0NneSS-pS?s!vGX4#92r|s^4j{v<%a~d{WJ$Gtid<+6ni~>oN(Dv?ha}jPsodC(GnFP5UmTl=^FJA9HS3!}T#;JtiznmVi{Z&+FWMm`c|y76osyT0dlBm9SAxz?%1;^qv540I3Te_xMcIR)z%Q!aQ5BDA_3ACpuB%8c&;o*{2y7!f>G!YbHd0czs!_b&RS5)eq-qUg4F<*ZjSvEHLe%}>zFA6$iOfU4{|`STIRflp|CB?Sntaeegn(p8Q#ShsMh~88t8_!9<6qMtwvvtoT~$&34tXZzpNk)2vKt{AjA_#j%_#5_rMlk4IXWJ4K+?}`Er<mkm%vy1Im+k303BU&k`V^#L}tJC&owu}wD^&8nJ1#z34%Jw!eX^^qoi{?$!AFog@#p7X44#15g8%D<0wdg%%Ks|*2W~2V-i}U!!QEtCk?{jZP-C-V~h|YbX{p03V9>kqF4+u$Q_G1V)?nw`?H+VBpw}>j~z*n1EDT9=>xUd(kxxWQxiWTgFZrd^R0%l6`O_N`siF4tJ<<E8lUMcLkc!)F;w$YwbE4RQ!OYTCThgKm;@DzEQ(Dx>xL(a^dB*R4DplkDw9;A=rxxHpSpGW;@Ci&Bl1ZI6rD~lFuzcP4j-NY=rbFIn+CLwFbw+sV>ATQH6J0QGmK25BU3F1Q5)#o3`AL)ZY?hybCy);P``U%Nne*w(sms_affc%$W{A*D3G0tF9n8gvpmS&&5ev^(>TIs@_v3SItL~la``YHjoqkV`c8QAg3P6$$tvK^Kp;f-pMhS|o5&8Hq%Y!gA?bndv)7@j$pJ+mvLGN)YZ-SwYDFfO4wY+aWbDlN*uR8Qn9NS3C&%xP+)Y0iADztH$tGY!D&ss+h412G>sqxcOi0L?QXOsdO{g55gb#UBtxRw7m5@l4QL;IF+r+$?M`@x9j+qHwD;T>qK6y8rhfffLepaB|Ktba|>pqaiInFjl<`WqXleqny-9UY<B_`SPPaEn9?{I)hu=gOmrtlDjvRPKiO%fJk<Hu~`k5-Z-;amy!co&>5vWe4ZxQZ$lD|G;D&~C@=u9LfgoG&%1N|l8&3Fqq)8sIqpGl6=!qE$QzD0U|o?V*t-2wy?g>;Xzb*Xro}s_-2;uF6C?7B@%nO?gtooGs{o9d!^jUJ=v`tC&2a$Cg2sQBQqpO_v)zF|ge$SnT+Bd)N6!N}O+?#4EmCak+}^zwAv5tq6;LL#LGRgXyhTI2psz<9G00BF>$1@Lo8MxIhIP8T7$-I&3w7<ziVRwMpWP5xkIZOe5(FiIHJB+duJ6{JtJTr3P;i)esgcW^k2629kub3;|D$;)!yRZn&IB+5YTD<g2R)k<vwSJzZ|E_Bpl^yo59NKj!7eQvCn97;#Zub)icV!I=`6oobvU-GB((eTdGuh+K#udebfch@Me4L)Vkt6968#c#iNB;E&5UvYH0^U$b%bl}!EUXPEscaWtFxJ;+}AvpoC)BAESRBs*caM{ySKZR(ce$r+4Z3T)A-?uOdZIKPanK<Qf^EvR}Db#6~pkwt2_hOH*!&6G?|#et?<l+x%#GdWHPNURN4k=DZ6Mg0`-Kw#XkdP*}mOb^s;(q;SJI%eIJIeON@%0~(GElot-#10C33wTc)UTS&+{zYk`J}BhEMIH?J-Hy8qQgF2EZSL_!hS*U3;uARnvsoo0p)Vu^?;zlhMlH~Bi{}q@$_ASs92!UkCqmD+Z$N8ado}<G&-l>A3gaqn#F~VshV-7y(&!MtE)SI9i|29kV6+6V<uO#kz^)F%HN8EVNf*An_u2TUAFCzXW1O%7N^!ac|9=f}vyK+|b=>6U5Qmri<;@}SzTg*b3RZuXP#?!=;0$5ls_#V|(*1vD%UwKtgOEunDI8G>7F-J9s+VSC`!!f<0~GnTq$u%zDqowC4q=g>qZ&MObLe$$j-?_BdWU?QmE8-)E-#B};EdPo%3c3K4oV+{nCMWUje&|FBD7kN(WtNk`Xrb)Bu6BK4w?Mb=lEzi=<M9%AOpKFS;NgyQX@gGSv}OOp^M})7`$-aBDsLvTSV7_zz7enoUwH>m|*4%(@!c2#?BS&GnGXxZkEvb9tal=ksGCdg~M*HKgaAWV-#WrzZm6WsZ<*U<M@6cGOIe=@VT@9kV1&&A-12)P}U_=C}ax-O1lIa{u1WCfJuEiFOiFJ31@hiOX8fb<4I*3IAO`&!oi)0p{F=&l}?9qu0X+T!%H%flQkixOdsuGH-<2{^vVP;3i$QAtz|68#oUVE!PAETEULwl+rSBX3y1#r({SxZpGyuT!@bLf%?;$816o-JV#&k1X*w(%BDN>or#NASJVNXYP{26yGN*8OoCKjs+(ttwg{N-^3*Sa|OF_eHs_M5)fC^qWsqUiZ7&Bk`d;`!1Nq5p*vY3Hna^pjdMl*+#;anOXPZpd-7J9{;O9oD*8a{Kf19lT)9EgRGX?x`|{d8wfsA~%&cn3?A+==8TLP;CR?12ukQNlE0)mdy#9tKq#oI!=LDEI#2MbVTMNV0N$IzG(`02xEp$m!MsC7E6|HBpBwGG(NHUuXYm^p_cgIglG@4iL^Np;Sm<W@Rcgj8Z){Xvie@9<S28`cSHM`!qaQDILhtvMVm@h%yN0XF-fr6y!%3X6n^U8b@wKM(6XXVW7dep#CfcnYkg^e8Umfqd@(U(=oZI@VN89qy^x4(k!UB_uPeTu>!t>XsQr{bBu0O-*+@}Qhm+QMaCTu;-5gmHWi#LtUvN>VUno*9mFQKVLGNyU^WURjjWQ)^D|0vfGZj$h`N*rJY79yla8uPrX`!54gEqM9zccTd}*|c8FJG!s=AqoAZHJ>Nc1Ko0YMWdWy-TEC%0GJVkH<{s!K@5D5|s>GxSf1Uuv4>Ic6vi)E(@S_tu}HvGk=hCT3NGlxfg%aGJ6yJYZnv9{Tg<l15sqe7njkN*<V<BvQ8K3}!R^M|o?$B!ny!lhBQynk>Vx(54&1lP!um<wB`HA(=qaQw$UTkr-434qk@9k~Q8B+`)90^j{^op5e@;&T#t0Gb0AocIvXDb_Ys-Fl*`GM=^cAQbWeuQYs=k^n@;CR565}!fYP$db8A9bL8KDk(brf_&y`a<!*I&0B%BZkO$xbtJLJ5I^kKneMhOs=fF&zuRXiLE?qh%FUA%&n(i2IYkZJ|pX<g^!sJ}@u8e>OfZAIs)=0^}`vaJOr&1QrLQV;<0v&1QE)7G*<_*3u!|he1`}M4GYzguk33-xZRi-D1BiF=SfBaP(pes#EqycQO+nViuTaI4J;igII|Jw1%faj5A$*KSiAM1Y#iI&H?i>DOdp!MA^>LojzDz+`-IuV^zEDl<T%{^ocwOhX_ARLt>-&Eq+!%Ag>sJP8-7i1x3=xFL3;u|2OCiSV%5E$H`tb9#Sa6Xaihx~60>A9||b&#FBK#j&{Cmm|pKCV^gCkI#}FJeBJ{Kkw-raf(~N7W~o^8WY^7q&6I7jjV&$RTIoMDa#gxNnaAg0nVgkmXl@2lT2PaR"""
DATA=json.loads(zlib.decompress(base64.b85decode(PAYLOAD_B85)).decode("utf-8"))
SECTION_OVERRIDES=DATA["section_overrides"]
EXACT_REPLACEMENTS=DATA["exact_replacements"]
POST_REPLACEMENTS=DATA["post_replacements"]
FINAL_TARGETED_REPLACEMENTS=DATA["final_targeted"]
FINAL_SECTION_OVERRIDES=DATA["final_sections"]

FORBIDDEN={
"internal question_id":re.compile(r"\b\d{8}_\d{3}\b"),
"internal question alias":re.compile(r"\bq\d{8}\b",re.I),
"PDF":re.compile(r"\bPDF\b",re.I),
"JSON":re.compile(r"\bJSON\b",re.I),
"question_id wording":re.compile(r"\bquestion_id\b",re.I),
"review state":re.compile(r"\breview\s*:",re.I),
"jpg review flag":re.compile(r"jpg\s*확필",re.I),
"repository wording":re.compile(r"저장소"),
"rendering wording":re.compile(r"렌더링"),
"public filter wording":re.compile(r"안전\s*필터"),
"questions array wording":re.compile(r"`?questions`?\s*배열",re.I),
"exam DB wording":re.compile(r"기출\s*DB",re.I),
"DB ID wording":re.compile(r"DB\s*ID",re.I),
"public screen wording":re.compile(r"공개\s*(?:화면|페이지)"),
"image asset wording":re.compile(r"이미지\s*자산"),
"stored source wording":re.compile(r"저장된\s*원문"),
}

def split_frontmatter(text:str)->tuple[str,str]:
    m=re.match(r"^---\r?\n[\s\S]*?\r?\n---\r?\n?",text)
    return (m.group(0),text[m.end():]) if m else ("",text)

def tree_hash(root:Path)->str:
    h=hashlib.sha256()
    for f in sorted(root.rglob("*.md"),key=lambda p:p.relative_to(root).as_posix()):
        rel=f.relative_to(root).as_posix()
        h.update(rel.encode());h.update(b"\0");h.update(f.read_bytes());h.update(b"\0")
    return h.hexdigest()

def fm_value(frontmatter:str,key:str)->str|None:
    m=re.search(rf"^{re.escape(key)}:\s*(.+?)\s*$",frontmatter,re.M)
    return m.group(1).strip().strip("'\"") if m else None

def replace_section(body:str,heading:str,content:str)->str:
    p=re.compile(rf"(^##\s+{re.escape(heading)}\s*\n)([\s\S]*?)(?=^##\s+|\Z)",re.M)
    if not p.search(body): raise RuntimeError(f"section not found: {heading}")
    return p.sub(lambda m:m.group(1)+"\n"+content.strip()+"\n\n",body,count=1)

def main()->None:
    files=sorted(CHAPTER_DIR.rglob("*.md"),key=lambda p:p.relative_to(CHAPTER_DIR).as_posix())
    if len(files)!=EXPECTED_FILE_COUNT: raise SystemExit(f"chapter count mismatch: {len(files)}")
    before=tree_hash(CHAPTER_DIR)
    if before!=EXPECTED_BASE_HASH:
        raise SystemExit(f"baseline changed; stop\nexpected={EXPECTED_BASE_HASH}\nactual={before}")
    questions=json.loads(QUESTIONS_FILE.read_text(encoding="utf-8"))
    qmap={q["id"]:q for q in questions}
    originals={f:f.read_text(encoding="utf-8") for f in files}
    frontmatters={f:split_frontmatter(originals[f])[0] for f in files}
    slug_to_title={}
    for f in files:
        fm=frontmatters[f]
        slug,title=fm_value(fm,"slug"),fm_value(fm,"title")
        if slug and title: slug_to_title[slug]=title

    def exam_ref(qid:str)->str:
        q=qmap.get(qid)
        if q: return f"{q['label'].replace(' 시행',' 시험')} {q['number']}번"
        return f"{qid[:4]}년 {int(qid[4:6])}월 시험 {int(qid.split('_')[1])}번"

    def replace_ids(body:str)->str:
        particles={"은":"은","는":"은","이":"이","가":"이","을":"을","를":"을","과":"과","와":"과","의":"의","에서":"에서","처럼":"처럼","도":"도","에는":"에는","에서는":"에서는","으로":"으로","로":"으로"}
        for p in sorted(particles,key=len,reverse=True):
            body=re.sub(r"`?(\d{8}_\d{3})`?"+re.escape(p),lambda m:exam_ref(m.group(1))+particles[p],body)
        return re.sub(r"`?(\d{8}_\d{3})`?",lambda m:exam_ref(m.group(1)),body)

    def replace_slugs(body:str)->str:
        for slug,title in sorted(slug_to_title.items(),key=lambda x:len(x[0] or ""),reverse=True):
            esc=re.escape(slug)
            body=re.sub(rf"`{esc}`은",f"**{title}** 챕터는",body)
            body=re.sub(rf"`{esc}`는",f"**{title}** 챕터는",body)
            body=re.sub(rf"`{esc}`에서",f"**{title}** 챕터에서",body)
            body=re.sub(rf"`{esc}`의",f"**{title}** 챕터의",body)
            body=re.sub(rf"`{esc}`와",f"**{title}** 챕터와",body)
            body=re.sub(rf"`{esc}`과",f"**{title}** 챕터와",body)
            body=body.replace(f"`{slug}`",f"**{title}**")
        return body

    def generic(body:str)->str:
        pairs=[("연결 문항","관련 기출"),("연결된 두 문항","관련 두 기출"),("연결된 세 문항","관련 세 기출"),("연결된 네 문항","관련 네 기출"),("연결 기출","관련 기출"),("저장된 정답","정답"),("저장소에 보존된 기출","수록 기출"),("저장소에서 정한 학습 범위","이 페이지의 학습 범위"),("개념 매핑","개념 연결"),("공개 렌더링","페이지 표시"),("저장소의 역사적 매핑","기존 분류 관계"),("PDF 원문과 JSON의 선택지는","문제에 제시된 선택지는"),("PDF 원문과 JSON의 정답은","문제의 정답은"),("JSON의 정답은","계산 결과는"),("JSON과 PDF의 정답은","정답은"),("PDF 보기","제시된 보기"),("PDF의","제시된"),("안전 필터","공개 기준")]
        for a,b in pairs: body=body.replace(a,b)
        body=re.sub(r"`?review:\s*[\"']jpg\s*확필[\"']`?","이미지 확인이 필요한 상태",body,flags=re.I)
        body=re.sub(r"`?jpg\s*확필`?","이미지 확인 필요",body,flags=re.I)
        body=re.sub(r"정답은\s*[1-4]번\(([^)]+)\)이다",r"정답은 \1이다",body)
        body=re.sub(r"정답은\s*[1-4]번\s*“([^”]+)”이다",r"정답은 “\1”이다",body)
        body=re.sub(r"정답은\s*[1-4]번\s*`([^`]+)`이다",r"정답은 `\1`이다",body)
        return re.sub(r"\n{3,}","\n\n",body)

    output={};changed=[]
    for f in files:
        rel=f.relative_to(CHAPTER_DIR).as_posix()
        source=originals[f];fm,body=split_frontmatter(source)
        body=generic(replace_slugs(replace_ids(body)))
        for a,b in EXACT_REPLACEMENTS.items(): body=body.replace(a,b)
        for heading,content in SECTION_OVERRIDES.get(rel,{}).items(): body=replace_section(body,heading,content)
        body=body.replace("2021년 3월 시험 95번와","2021년 3월 시험 95번과")
        for a,b in POST_REPLACEMENTS.get(rel,{}).items(): body=body.replace(a,b)
        body=body.replace("이미지 확인 필요 상태","이미지나 표가 제시된 문제")
        for a,b in FINAL_TARGETED_REPLACEMENTS.get(rel,{}).items():
            if a not in body: raise RuntimeError(f"reviewed source missing: {rel} :: {a[:80]}")
            body=body.replace(a,b)
        for heading,content in FINAL_SECTION_OVERRIDES.get(rel,{}).items(): body=replace_section(body,heading,content)
        result=fm+body
        if split_frontmatter(result)[0]!=frontmatters[f]: raise RuntimeError(f"frontmatter changed: {rel}")
        output[f]=result
        if result!=source: changed.append(rel)

    if len(changed)!=EXPECTED_CHANGED_COUNT: raise SystemExit(f"changed count mismatch: {len(changed)}")
    errors=[];known=set(slug_to_title)
    for f,result in output.items():
        rel=f.relative_to(CHAPTER_DIR).as_posix();_,body=split_frontmatter(result)
        for label,p in FORBIDDEN.items():
            matches=sorted(set(p.findall(body)))
            if matches: errors.append(f"{rel}: {label} -> {matches}")
        for code in re.findall(r"`([^`\n]+)`",body):
            if code in known: errors.append(f"{rel}: internal chapter slug -> {code}")
    if errors: raise SystemExit("reviewed output defects:\n"+"\n".join(errors))
    for f,result in output.items(): f.write_text(result,encoding="utf-8")
    after=tree_hash(CHAPTER_DIR)
    if after!=EXPECTED_OUTPUT_HASH: raise SystemExit(f"output hash mismatch\nexpected={EXPECTED_OUTPUT_HASH}\nactual={after}")
    counts=Counter(x.split("/",1)[0] for x in changed)
    print(f"[content-cleanup] changed {len(changed)} chapter files")
    for subject,count in sorted(counts.items()): print(f"[content-cleanup] {subject}: {count}")
    print(f"[content-cleanup] output hash: {after}")

if __name__=="__main__": main()
