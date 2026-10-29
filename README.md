# Best Bowling

볼링 점수 기록 · 팀전 · 핸디캡 · 비용 정산 앱 (설치형 웹앱 / PWA).
모든 데이터는 서버 없이 **휴대폰 브라우저 저장소(localStorage)** 에만 저장됩니다.

## 구성
- `index.html`, `css/style.css`, `js/app.js` — 앱 본체 (빌드 과정 없음)
- `manifest.webmanifest`, `sw.js` — 홈 화면 설치 및 오프라인 동작
- `icons/` — 앱 아이콘 (`node tools/make-icons.mjs` 로 재생성, `sharp` 필요)

## PC에서 미리보기
```bash
python -m http.server 5173
```
브라우저에서 http://localhost:5173 접속.

## 휴대폰에 설치하기
1. 이 폴더를 HTTPS 정적 호스팅에 올립니다 (예: GitHub Pages, Netlify Drop — 폴더를 끌어다 놓으면 끝).
2. 휴대폰 브라우저로 주소를 엽니다.
   - Android(Chrome): 메뉴 → **홈 화면에 추가 / 앱 설치**
   - iPhone(Safari): 공유 버튼 → **홈 화면에 추가**
3. 설치 후에는 인터넷 없이도 동작하며, 기록은 그 휴대폰에만 남습니다.
   휴대폰을 바꿀 때는 설정 → **백업 파일 내보내기 / 가져오기** 를 사용하세요.
