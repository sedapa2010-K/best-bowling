/* Best Bowling — in-app documents (user guide, privacy policy, terms, open-source notices).
   Shared by the app (Settings) and the public privacy.html page. */
window.BB_DOCS = (() => {
  const UPDATED = '2026-10-30';
  const REPO = 'https://github.com/sedapa2010-K/best-bowling';
  const ISSUES = REPO + '/issues';
  const OFL = 'https://openfontlicense.org';

  return {
    updated: UPDATED,
    ko: {
      guide: {
        title: '사용설명서',
        html: `
<h3>1. 설치하기</h3>
<p>Best Bowling은 휴대폰 홈 화면에 설치해서 앱처럼 쓰는 웹앱입니다.</p>
<ul>
  <li><b>안드로이드(Chrome)</b>: 메뉴(⋮) → <b>앱 설치</b> 또는 <b>홈 화면에 추가</b></li>
  <li><b>아이폰(Safari)</b>: 공유 버튼 → <b>홈 화면에 추가</b></li>
</ul>
<p>설치 후에는 인터넷 없이도 사용할 수 있어요.</p>

<h3>2. 회원 등록 <small>회원 탭</small></h3>
<ul>
  <li>이름과 기본 핸디를 입력하고 <b>멤버 추가</b>를 누릅니다.</li>
  <li>✏️ 버튼으로 이름·핸디를 수정하고, 🗑 버튼으로 삭제합니다. 삭제해도 지난 기록의 점수는 남아요.</li>
  <li>기록 탭의 참가 멤버 화면에서도 바로 새 멤버를 추가할 수 있어요.</li>
</ul>

<h3>3. 점수 기록 <small>기록 탭</small></h3>
<ul>
  <li><b>날짜 선택</b>: 맨 위 날짜를 누르면 달력이 열려요. 기록이 있는 날은 금색 동그라미로 표시돼요. 아래 <b>최근 기록</b>을 눌러 바로 이동할 수도 있어요.</li>
  <li><b>참가 멤버</b>: 이름을 눌러 참가자를 고르고, 사람마다 그날의 <b>핸디</b>를 입력합니다.</li>
  <li><b>개인전 / 팀전</b>: 팀전을 고르면 팀 수(2~4)를 정하고, 멤버 옆 A·B·C·D 버튼으로 팀을 옮겨요. 팀 이름 옆 ✏️ 버튼으로 팀 이름을 바꿀 수 있어요.</li>
  <li><b>게임</b>: 기본으로 4게임이 준비돼 있고, <b>+</b> 버튼으로 더 추가할 수 있어요.</li>
  <li><b>최종결과 입력</b>: 사람별로 게임 점수(0~300)만 입력합니다.</li>
  <li><b>프레임별 입력</b>: 점수판을 누르면 키패드가 열려요. <b>X</b> 스트라이크, <b>/</b> 스페어, <b>-</b> 거터(0), 숫자는 쓰러뜨린 핀 수입니다. 점수는 자동 계산되고, 한 프레임이 끝나면 다음 사람으로 넘어가요. ⌫ 버튼으로 마지막 투구를 지웁니다.</li>
  <li><b>팀별 보기</b>: 팀전에서는 <b>전체 / A팀 / B팀…</b> 버튼으로 입력할 팀만 골라 볼 수 있어요.</li>
  <li><b>첫 경기는 연습</b>: 경기 결과 오른쪽 위 버튼을 켜면 그날 1게임은 연습으로 표시되고 총점·평균에서 빠져요.</li>
  <li><b>경기 결과</b>: 순위, 게임별 점수, 핸디 합계, 총점, 평균과 팀 결과가 자동으로 정리돼요.</li>
  <li><b>이미지 저장 / 공유하기</b>: 결과를 이미지로 저장하거나 카카오톡 등으로 바로 보낼 수 있어요.</li>
</ul>
<p>입력한 내용은 자동으로 저장돼요. 따로 저장 버튼을 누를 필요가 없어요.</p>

<h3>4. 비용 정산 <small>정산 탭</small></h3>
<ul>
  <li>날짜를 고르고 <b>경기비(1게임당)</b>와 <b>신발비(1인당)</b>를 입력합니다.</li>
  <li><b>기록에서 불러오기</b>를 누르면 그날 참가자와 각자 친 게임 수가 채워져요.</li>
  <li>사람마다 체크(포함 여부), 게임 수(−/+), <b>신발 포함</b>을 정하면 개인별 금액과 총액이 계산돼요.</li>
  <li>팀전 기록이 있는 날은 <b>개인별 / 팀별</b> 버튼으로 팀별 합계를 볼 수 있어요.</li>
  <li><b>이미지 저장 / 공유하기</b>로 정산표를 보낼 수 있어요.</li>
</ul>

<h3>5. 통계 <small>통계 탭</small></h3>
<ul>
  <li>맨 위에서 <b>기간</b>(전체·이번 달·3개월·올해)을 고르고, 멤버 이름을 눌러 개인 통계를 봅니다.</li>
  <li><b>게임별</b>: 최근 게임 점수 그래프, 게임 순서별 평균, 전체 게임 기록</li>
  <li><b>최종 점수별</b>: 날짜별 평균 그래프와 날짜별 최종 점수표(날짜를 누르면 그날 기록으로 이동)</li>
  <li>맨 아래 <b>전체 순위</b>는 평균 점수 기준이에요. 연습 게임은 통계에서 빠집니다.</li>
</ul>

<h3>6. 설정과 백업</h3>
<ul>
  <li><b>언어</b>: 한국어 / English (영어에서는 금액이 달러로 표시돼요)</li>
  <li><b>화면 모드</b>: 라이트 / 다크 / 시스템</li>
  <li><b>백업 파일 내보내기 / 가져오기</b>: 모든 기록은 이 휴대폰에만 저장돼요. 휴대폰을 바꾸거나 브라우저 데이터를 지우기 전에 꼭 백업 파일을 내보내 주세요.</li>
  <li><b>모든 데이터 삭제</b>: 멤버와 기록을 모두 지웁니다. 되돌릴 수 없어요.</li>
</ul>`,
      },
      privacy: {
        title: '개인정보처리방침',
        html: `
<p class="doc-date">시행일: ${UPDATED}</p>
<p>Best Bowling(이하 "앱")은 이용자의 개인정보를 소중히 여기며, 개인정보를 수집하지 않는 것을 원칙으로 합니다.</p>

<h3>1. 수집하는 개인정보</h3>
<p>앱은 이용자의 개인정보를 <b>수집하지 않으며</b>, 회원가입이나 로그인 기능이 없습니다.</p>

<h3>2. 이용자가 입력하는 정보의 저장</h3>
<p>이용자가 직접 입력하는 멤버 이름, 핸디, 볼링 점수, 팀 정보, 정산 금액 등은 <b>이용자 기기의 브라우저 저장소에만</b> 저장됩니다. 이 정보는 개발자나 다른 서버로 전송되지 않으며, 개발자는 이 정보에 접근할 수 없습니다.</p>

<h3>3. 개인정보의 제3자 제공 및 처리 위탁</h3>
<p>앱은 개인정보를 수집하지 않으므로 제3자에게 제공하거나 처리를 위탁하지 않습니다. 광고, 분석(애널리틱스), 추적 도구를 사용하지 않습니다.</p>

<h3>4. 외부 서비스</h3>
<ul>
  <li><b>앱 호스팅</b>: 앱 파일은 GitHub Pages에서 제공됩니다. 앱을 내려받을 때 GitHub가 IP 주소 등 기술 정보를 서버 로그로 처리할 수 있습니다. (<a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub 개인정보 처리방침</a>)</li>
  <li><b>글꼴</b>: 앱 제목 글꼴을 Google Fonts에서 불러오며, 이때 Google이 IP 주소 등 기술 정보를 처리할 수 있습니다. (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google 개인정보처리방침</a>)</li>
</ul>

<h3>5. 기기 권한</h3>
<p>앱은 카메라, 위치, 연락처, 마이크 등 기기 권한을 사용하지 않습니다. 이미지 공유는 이용자가 직접 선택한 앱으로만 전달됩니다.</p>

<h3>6. 정보의 보관 및 삭제</h3>
<p>저장된 정보는 이용자가 삭제할 때까지 기기에 남아 있습니다. <b>설정 → 모든 데이터 삭제</b>, 앱 삭제, 또는 브라우저의 사이트 데이터 삭제로 언제든지 모든 정보를 지울 수 있습니다.</p>

<h3>7. 아동의 개인정보</h3>
<p>앱은 어떤 연령의 이용자로부터도 개인정보를 수집하지 않습니다.</p>

<h3>8. 방침의 변경</h3>
<p>이 방침이 변경되면 앱과 이 페이지를 통해 시행일과 함께 알려드립니다.</p>

<h3>9. 문의</h3>
<p>개인정보 관련 문의는 <a href="${ISSUES}" target="_blank" rel="noopener">GitHub 문의 게시판</a>으로 보내 주세요.</p>`,
      },
      terms: {
        title: '이용약관',
        html: `
<p class="doc-date">시행일: ${UPDATED}</p>
<h3>1. 서비스</h3>
<p>Best Bowling은 볼링 점수 기록, 통계, 비용 정산을 돕는 무료 앱입니다. 별도의 회원가입 없이 누구나 사용할 수 있습니다.</p>
<h3>2. 데이터의 관리</h3>
<p>모든 기록은 이용자의 기기에만 저장되며, 기기 분실·초기화·브라우저 데이터 삭제 등으로 사라질 수 있습니다. 중요한 기록은 <b>설정 → 백업 파일 내보내기</b>로 직접 보관해 주세요.</p>
<h3>3. 정확성</h3>
<p>점수 계산과 정산 금액은 이용자가 입력한 내용을 바탕으로 한 참고용 결과입니다. 실제 결제·정산 시에는 이용자가 직접 확인해야 합니다.</p>
<h3>4. 책임의 제한</h3>
<p>앱은 "있는 그대로" 제공되며, 관련 법령이 허용하는 범위에서 데이터 손실이나 계산 결과로 인한 손해에 대해 책임을 지지 않습니다.</p>
<h3>5. 약관의 변경</h3>
<p>약관이 변경되면 앱을 통해 시행일과 함께 알려드립니다. 변경 후에도 앱을 계속 사용하면 변경된 약관에 동의한 것으로 봅니다.</p>
<h3>6. 문의</h3>
<p><a href="${ISSUES}" target="_blank" rel="noopener">GitHub 문의 게시판</a></p>`,
      },
      oss: {
        title: '오픈소스 라이선스',
        html: `
<p>Best Bowling은 다음 오픈소스를 사용합니다. 각 저작권자에게 감사드립니다.</p>
<h3>Playfair Display <small>글꼴</small></h3>
<p>Copyright 2017 The Playfair Display Project Authors<br>SIL Open Font License, Version 1.1 — <a href="${OFL}" target="_blank" rel="noopener">openfontlicense.org</a></p>
<h3>Feather Icons <small>아이콘 일부</small></h3>
<p>Copyright (c) 2013-2023 Cole Bemis<br>MIT License</p>
<pre>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</pre>
<h3>sharp <small>아이콘 이미지 제작 도구, 앱에는 포함되지 않음</small></h3>
<p>Copyright Lovell Fuller and contributors<br>Apache License 2.0</p>
<p>앱 소스 코드: <a href="${REPO}" target="_blank" rel="noopener">${REPO.replace('https://', '')}</a></p>`,
      },
    },
    en: {
      guide: {
        title: 'User Guide',
        html: `
<h3>1. Install</h3>
<p>Best Bowling is a web app you install on your home screen and use like a regular app.</p>
<ul>
  <li><b>Android (Chrome)</b>: menu (⋮) → <b>Install app</b> or <b>Add to Home screen</b></li>
  <li><b>iPhone (Safari)</b>: Share button → <b>Add to Home Screen</b></li>
</ul>
<p>Once installed, it works without an internet connection.</p>

<h3>2. Members <small>Members tab</small></h3>
<ul>
  <li>Enter a name and default handicap, then tap <b>Add member</b>.</li>
  <li>Use ✏️ to edit and 🗑 to delete. Deleting a member keeps their past scores.</li>
  <li>You can also add a new member right from the Players card on the Scores tab.</li>
</ul>

<h3>3. Recording scores <small>Scores tab</small></h3>
<ul>
  <li><b>Pick a date</b>: tap the date at the top to open the calendar. Days with records are circled in gold. Tap a <b>Recent</b> chip to jump to that day.</li>
  <li><b>Players</b>: tap names to select who played, and set each player's <b>handicap</b> for the day.</li>
  <li><b>Singles / Teams</b>: in Teams, choose 2–4 teams and move players with the A·B·C·D buttons. Tap ✏️ next to a team name to rename it.</li>
  <li><b>Games</b>: 4 games are ready by default; tap <b>+</b> to add more.</li>
  <li><b>Final Score</b>: just type each player's game score (0–300).</li>
  <li><b>By Frame</b>: tap a score sheet to open the keypad. <b>X</b> strike, <b>/</b> spare, <b>-</b> gutter (0), numbers are pins knocked down. Scores are calculated automatically and the keypad moves to the next player after each frame. ⌫ undoes the last ball.</li>
  <li><b>Team filter</b>: in team matches, use <b>All / Team A / Team B…</b> to show only the team you're entering.</li>
  <li><b>1st game is practice</b>: turn this on at the top right of Results to mark game 1 as practice and leave it out of totals and averages.</li>
  <li><b>Results</b>: rankings, per-game scores, handicap, totals, averages and team results are summarized automatically.</li>
  <li><b>Save image / Share</b>: save the results as an image or send it straight to a messaging app.</li>
</ul>
<p>Everything you enter is saved automatically — there's no save button to press.</p>

<h3>4. Settle up <small>Settle tab</small></h3>
<ul>
  <li>Pick a date and enter the <b>game fee (per game)</b> and <b>shoe rental (per person)</b>.</li>
  <li><b>Load from scores</b> fills in that day's players and how many games each played.</li>
  <li>For each person set the check (included), games (−/+) and <b>Shoes</b> to get each amount and the total.</li>
  <li>On days with a team match, switch between <b>Per person / Per team</b>.</li>
  <li>Use <b>Save image / Share</b> to send the settlement.</li>
</ul>

<h3>5. Stats <small>Stats tab</small></h3>
<ul>
  <li>Choose a <b>period</b> (All, This month, 3 months, This year) at the top, then tap a member's name.</li>
  <li><b>By game</b>: recent game scores chart, average by game order, and every game played.</li>
  <li><b>By session</b>: average-by-date chart and final scores by date (tap a date to open that day).</li>
  <li>The <b>Leaderboard</b> at the bottom ranks by average. Practice games are not counted.</li>
</ul>

<h3>6. Settings &amp; backup</h3>
<ul>
  <li><b>Language</b>: 한국어 / English (amounts are shown in dollars in English)</li>
  <li><b>Appearance</b>: Light / Dark / System</li>
  <li><b>Export / Import backup</b>: all records live only on this phone. Export a backup before switching phones or clearing browser data.</li>
  <li><b>Erase all data</b>: deletes all members and records. This cannot be undone.</li>
</ul>`,
      },
      privacy: {
        title: 'Privacy Policy',
        html: `
<p class="doc-date">Effective: ${UPDATED}</p>
<p>Best Bowling ("the app") respects your privacy and is designed not to collect personal information.</p>

<h3>1. Information we collect</h3>
<p>The app <b>does not collect</b> any personal information. There is no sign-up or login.</p>

<h3>2. Data you enter</h3>
<p>Member names, handicaps, bowling scores, team details and settlement amounts you enter are stored <b>only in your device's browser storage</b>. This data is never sent to the developer or any server, and the developer cannot access it.</p>

<h3>3. Sharing with third parties</h3>
<p>Because the app collects no personal information, nothing is shared with or processed by third parties. The app uses no advertising, analytics or tracking tools.</p>

<h3>4. External services</h3>
<ul>
  <li><b>Hosting</b>: the app's files are served by GitHub Pages. When the app is downloaded, GitHub may process technical data such as your IP address in server logs. (<a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub Privacy Statement</a>)</li>
  <li><b>Fonts</b>: the title font is loaded from Google Fonts, and Google may process technical data such as your IP address. (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a>)</li>
</ul>

<h3>5. Device permissions</h3>
<p>The app does not use the camera, location, contacts, microphone or other device permissions. Shared images go only to the app you choose.</p>

<h3>6. Retention and deletion</h3>
<p>Data stays on your device until you delete it. You can erase everything at any time with <b>Settings → Erase all data</b>, by uninstalling the app, or by clearing the site's browser data.</p>

<h3>7. Children</h3>
<p>The app does not collect personal information from users of any age.</p>

<h3>8. Changes</h3>
<p>If this policy changes, the new version and effective date will be posted in the app and on this page.</p>

<h3>9. Contact</h3>
<p>Questions about privacy: <a href="${ISSUES}" target="_blank" rel="noopener">GitHub issues</a>.</p>`,
      },
      terms: {
        title: 'Terms of Use',
        html: `
<p class="doc-date">Effective: ${UPDATED}</p>
<h3>1. The service</h3>
<p>Best Bowling is a free app for recording bowling scores, viewing stats and splitting costs. No account is required.</p>
<h3>2. Your data</h3>
<p>All records are stored only on your device and may be lost if the device is lost or reset or browser data is cleared. Keep important records with <b>Settings → Export backup</b>.</p>
<h3>3. Accuracy</h3>
<p>Scores and settlement amounts are calculated from what you enter and are for reference only. Please check amounts yourself before paying.</p>
<h3>4. Limitation of liability</h3>
<p>The app is provided "as is". To the extent permitted by law, the developer is not liable for data loss or for damages arising from calculated results.</p>
<h3>5. Changes</h3>
<p>Changes to these terms will be announced in the app with an effective date. Continuing to use the app means you accept the updated terms.</p>
<h3>6. Contact</h3>
<p><a href="${ISSUES}" target="_blank" rel="noopener">GitHub issues</a></p>`,
      },
      oss: {
        title: 'Open-source licenses',
        html: `
<p>Best Bowling uses the following open-source software. Thank you to their authors.</p>
<h3>Playfair Display <small>font</small></h3>
<p>Copyright 2017 The Playfair Display Project Authors<br>SIL Open Font License, Version 1.1 — <a href="${OFL}" target="_blank" rel="noopener">openfontlicense.org</a></p>
<h3>Feather Icons <small>some icons</small></h3>
<p>Copyright (c) 2013-2023 Cole Bemis<br>MIT License</p>
<pre>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</pre>
<h3>sharp <small>icon build tool, not shipped in the app</small></h3>
<p>Copyright Lovell Fuller and contributors<br>Apache License 2.0</p>
<p>App source code: <a href="${REPO}" target="_blank" rel="noopener">${REPO.replace('https://', '')}</a></p>`,
      },
    },
  };
})();
