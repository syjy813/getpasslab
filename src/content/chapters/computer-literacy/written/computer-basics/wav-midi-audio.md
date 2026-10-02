---
chapter_id: "P1-03b-01"
title: "WAV·MIDI의 소리 표현 방식 비교"
slug: "wav-midi-audio"
cert_id: "computer-literacy"
exam: "written"
subject_id: 1
group: "멀티미디어와 표현"
tags: ["개념"]
summary: "소리 파형 데이터와 음높이·길이·악기 연주 명령 비교"
questions: ["20200229_002"]
supportingQuestions: [{"id": "20150307_006", "note": "WAV 오디오와 이미지·음성 코덱·재생 도구를 구별", "chapter": "image-file-compression"}, {"id": "20150627_017", "note": "WAV 오디오와 이미지·음성 코덱·재생 도구를 구별", "chapter": "media-playback-editing"}, {"id": "20160305_009", "note": "WAV 오디오와 이미지·음성 코덱·재생 도구를 구별", "chapter": "image-file-compression"}]
related: []
order: 130
priority: "1차"
status: "완료"
---

WAV는 **주로 PCM 파형 데이터를 담는 오디오 파일 형식**, MIDI는 **악기·음높이·길이·세기 등 연주 명령을 기록하는 방식**임

## WAV

- `.wav` 확장자 사용
- 샘플링 주파수·비트 수·채널·재생 시간 등에 따라 파일 크기가 달라짐
- 실제 오디오 파형 데이터를 저장하는 방식

## MIDI

- 음높이·음길이·세기·악기 등 연주 이벤트를 기록
- 같은 연주라면 파형 녹음보다 데이터량이 작을 수 있음
- 재생 음색은 사용 장치·음원에 영향을 받을 수 있음

따라서 `WAV에 음높이·음길이·세기 등의 음악 기호가 정의되어 있다`는 설명은 MIDI의 성격과 혼동한 것이므로 오답임

MP3·AC-3는 압축된 오디오 형식·코덱 계열로 WAV·MIDI와 표현 원리가 다름

WAV는 Windows Media Player 등 오디오 재생 도구에서 재생 가능 · WAV 파일이 항상 비압축인 것은 아님
