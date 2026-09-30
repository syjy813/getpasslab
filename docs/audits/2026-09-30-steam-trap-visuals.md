# 증기트랩·응축수 환수: 작동부 그림 개선 기록

- 대상: `steam-traps-condensate`의 트랩 분류·대표 형식
- 기준: `docs/standards/learning-image-design-system-v1.md` v1.2 §1·2·5·6·7·9 및 `CHAPTER_WRITING_GUIDE.md`
- 기출 근거: `20110417_023`, `20111009_013`, `20120212_045`, `20140720_020`, `20140720_056`, `20151010_047`, `20160710_052` 등은 기계식·온도조절식·열역학식의 대표 형식 구분을 요구함

## 그림 브리프

| 그림·표현 | 학습 질문과 캡션 | 식별 부품·작동 관계 | 그리지 않은 관계 |
|---|---|---|---|
| 플로트식 / L2 구조 비교 | 구형 부자가 있는 것은? · `플로트식 · 기계식` | 응축수가 차면 금속 부자가 떠올라 레버로 밸브를 엶 | 실제 출입관·공기배출기·유로·순간 개폐 상태 |
| 역버킷식 / L2 구조 비교 | 거꾸로 된 버킷은 어느 계열인가? · `역버킷식 · 기계식` | 아래가 열린 버킷이 증기로 부력을 얻으면 올라가 밸브를 닫음. 작은 통기 구멍 | 물·증기의 전체 이동 경로·차압별 운전 상태 |
| 바이메탈식 / L2 구조 비교 | 온도에 반응하는 금속편은? · `바이메탈식 · 온도조절식` | 이종 금속 적층부가 온도에 따라 휘어 밸브 위치를 바꿈 | 정확한 모델별 적층 수·배관 연결·설정 온도 |
| 디스크식 / L2 구조 비교 | 윗덮개 아래 자유 원판은? · `디스크식 · 열역학식` | 재증발증기 흐름과 상부실 압력 변화에 따라 단일 원판이 움직임 | 원판의 시점별 개폐 단계·정확한 환형 유로 |

- 공통 캡션은 HTML `figcaption`에, 직접 식별할 부품은 카드 아래 키와 `alt`에 둠. 그림 안에는 글자·화살표를 생성하지 않음
- PC 2열·모바일 1열 공통 WebP. 320px·390px에서 키는 CSS 14px이며 이미지는 카드 너비에 맞춰 축소
- 생성 그림은 특정 제조사 제품의 도면이나 실제 배관 설치 지침이 아님. 실물감은 부품 식별에만 쓰며 문서 본문에 유로 생략 범위를 명시

## 기술 근거·생성 시안 수정

- Spirax Sarco, [Mechanical Steam Traps](https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/mechanical-steam-traps): 부자의 상승과 밸브 개방, 역버킷의 상승·밸브 폐쇄 및 작은 상부 통기 구멍
- Spirax Sarco, [Thermostatic Steam Traps](https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/thermostatic-steam-traps): 바이메탈 적층부의 온도 응답
- Spirax Sarco, [Thermodynamic Steam Traps](https://www.spiraxsarco.com/learn-about-steam/steam-traps-and-steam-trapping/thermodynamic-steam-traps): 원판은 상부실의 유일한 운동 부품, 재증발증기와 압력 변화로 개폐
- 디스크 초안에서 원판과 중앙축이 붙은 듯 보이는 부분을 제거한 파생본을 채택. 역버킷 초안에서 빠진 상부 작은 통기 구멍을 보완한 파생본을 채택
- **확인한 관계:** 부품 종류와 분류, 부력·온도·유체역학적 작동 원리. **생략한 관계:** 실제 모델별 계통 연결, 증기·응축수·공기의 완전한 통로, 시간순 작동 단계. **미확인 디테일:** 표면 볼트·밸브 시트의 치수와 이음 방식은 생성 이미지의 임의 형태

## QA

- `npm run build`: 295페이지 성공. 대상 빌드 HTML에서 각 WebP 참조 1회, 네 파일 모두 `dist/images`에 존재
- `npm run check:seo`: 경고·오류 0. `npm run check:public-content`, `npm run check:deferred-question-content`: 오류 0. `git diff --check`: 통과
- 각 WebP 1254×1254, 카드 내 `width`·`height`·`alt`와 부품 키 제공
- 320px·390px 모바일의 실제 브라우저 캡처와 Production 배포·확인은 아직 실행하지 않음. CSS는 767px 이하에서 한 열이며 핵심 키는 고정 14px
