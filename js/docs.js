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
      bowling: {
        title: '볼링 상식',
        html: `
<p>볼링을 더 재미있게 즐기기 위한 기본 지식을 모았어요.</p>

<h3>1. 볼링은 어떤 경기?</h3>
<ul>
  <li>중세 독일 교회에서 악마를 상징하는 곤봉(핀)을 쓰러뜨리던 의식에서 시작됐다고 알려져 있어요.</li>
  <li>공을 굴려 삼각형으로 세워진 <b>핀 10개</b>를 쓰러뜨리는 실내 경기로, 나이와 체력에 상관없이 누구나 즐길 수 있는 생활 스포츠예요.</li>
</ul>

<h3>2. 경기 방법</h3>
<ul>
  <li>한 게임은 <b>10프레임</b>이에요. 프레임마다 최대 2번 던질 수 있어요.</li>
  <li>첫 투구에 10개를 모두 쓰러뜨리면 <b>스트라이크</b>, 두 번에 걸쳐 모두 쓰러뜨리면 <b>스페어</b>예요. 남은 핀을 다 못 쓰러뜨리면 <b>미스</b>(오픈 프레임)예요.</li>
  <li><b>10프레임</b>에서 스트라이크나 스페어를 하면 보너스 투구를 더 해서 최대 3번까지 던져요.</li>
  <li>첫 투구가 거터나 파울이어도 두 번째 투구에 10개를 다 쓰러뜨리면 스트라이크가 아니라 <b>스페어</b>로 기록돼요.</li>
</ul>

<h3>3. 점수 계산</h3>
<ul>
  <li><b>스트라이크 (X)</b>: 10점 + <b>다음 두 번 투구</b>에서 쓰러뜨린 핀 수를 보너스로 더해요.<br><small>예) X → 다음 프레임 7, 2 ⇒ 10 + 7 + 2 = 19점</small></li>
  <li><b>스페어 (/)</b>: 10점 + <b>다음 한 번 투구</b>의 핀 수를 더해요.<br><small>예) 6 / → 다음 첫 투구 8 ⇒ 10 + 8 = 18점</small></li>
  <li><b>그 외</b>: 두 번 투구에서 쓰러뜨린 핀 수만큼이에요.</li>
  <li>점수는 프레임마다 앞 프레임 점수에 계속 더해져요. 스트라이크·스페어는 보너스 투구가 끝나야 그 프레임 점수가 확정돼요.</li>
  <li><b>퍼펙트 게임</b>: 12번 연속 스트라이크면 만점 <b>300점</b>이에요.</li>
</ul>

<h3>4. 점수표 기호</h3>
<ul>
  <li><b>X</b> 스트라이크 · <b>/</b> 스페어 · <b>-</b> 하나도 못 쓰러뜨림(0점) · <b>G</b> 거터 · <b>F</b> 파울(0점)</li>
  <li><b>파울</b>: 던질 때 몸(발끝 등)이 파울라인을 넘으면 그 투구는 0점이 돼요.</li>
  <li><b>스플릿</b>: 첫 투구에서 1번(헤드) 핀이 쓰러지고, 남은 핀들 사이가 벌어져 있는 상태예요. 예) 7-10번, 4-6번. 1번 핀이 남아 있으면 스플릿이 아니에요.</li>
</ul>

<h3>5. 레인과 핀</h3>
<ul>
  <li><b>어프로치</b>: 공을 던지기 위해 걸어 나가는 구역(길이 약 4.6m 이상).</li>
  <li><b>파울라인</b>: 어프로치와 레인의 경계선. 밟거나 넘으면 파울이에요.</li>
  <li><b>스폿</b>: 레인 바닥의 점과 삼각형 표시. 핀이 아니라 이 표시를 보고 던지면 방향 잡기가 쉬워요.</li>
  <li><b>거터</b>: 레인 양옆의 홈. 공이 빠지면 핀을 맞히지 못해요.</li>
  <li><b>핀 배열</b>: 맨 앞이 1번(헤드핀), 그 뒤로 2–3번, 4–6번, 7–10번이 역삼각형으로 서 있고, 핀 사이 간격은 약 30cm예요.</li>
</ul>

<h3>6. 장비</h3>
<ul>
  <li><b>볼</b>: 무게는 최대 16파운드(약 7.2kg). 처음에는 볼링장의 <b>하우스볼</b>로 여러 무게를 써 보고 손에 맞는 공을 찾은 뒤, 익숙해지면 <b>마이볼</b>을 맞추는 것이 좋아요. 체중의 약 10% 무게가 흔히 쓰이는 기준이에요.</li>
  <li><b>볼링화</b>: 미끄러져 멈추는 쪽 발(오른손잡이는 왼발) 바닥은 잘 미끄러지는 재질, 반대쪽은 미끄럼 방지 고무예요. 반드시 신고, 젖지 않게 해야 해요.</li>
  <li><b>손목 보호대</b>: 손목을 고정해 공의 방향과 회전을 안정시켜 줘요.</li>
</ul>

<h3>7. 그립과 구질</h3>
<ul>
  <li><b>컨벤셔널 그립</b>: 중지·약지를 둘째 마디까지 넣어요. 안정적이라 초보자에게 좋아요.</li>
  <li><b>핑거팁 그립</b>: 손가락 끝마디만 넣어요. 회전을 많이 줄 수 있어 숙련자가 많이 써요.</li>
  <li><b>스트레이트</b>: 곧게 굴러가는 공. 컨트롤이 쉬워 초보자에게 맞아요.</li>
  <li><b>훅</b>: 곧게 가다가 핀 앞에서 휘어 들어가는 공. 핀을 쓰러뜨리는 힘이 커서 스트라이크 확률이 높아요.</li>
  <li><b>커브</b>: 크게 활 모양으로 휘는 공. 위력은 크지만 컨트롤이 어려워요.</li>
  <li><b>백업</b>: 훅과 반대 방향으로 휘는 공. 손목이 바깥으로 돌아가며 생기는 경우가 많아요.</li>
</ul>

<h3>8. 잘 치는 요령</h3>
<ul>
  <li><b>4스텝</b>이 가장 기본이에요. 첫걸음과 함께 공을 앞으로 밀어 내고, 시계추처럼 팔에 힘을 빼고 흔들어요.</li>
  <li>던질 때는 엄지가 먼저 빠지고 중지·약지로 공을 들어 올리듯 놓아 주며, 끝까지 팔을 앞으로 뻗어(팔로스루) 마무리해요.</li>
  <li>마지막 걸음은 무릎을 굽히고 자세를 낮춰 미끄러지듯 멈춰야 균형이 잡혀요.</li>
  <li><b>스페어 처리</b>: 남은 핀 중 가장 앞의 핀(키 핀)을 먼저 노리고, 핀끼리 서로 쓰러뜨리는 각도를 생각해요.</li>
</ul>

<h3>9. 에티켓</h3>
<ul>
  <li>옆 레인 사람과 동시에 어프로치에 섰다면 <b>오른쪽 레인</b>에 먼저 양보해요.</li>
  <li>준비가 됐으면 바로 던지고, 다른 사람이 던질 때는 방해하지 않아요.</li>
  <li>파울라인을 넘어 레인에 들어가지 않아요.</li>
  <li>다른 사람의 공을 허락 없이 쓰지 않아요.</li>
  <li>스트라이크나 스페어가 나오면 함께 박수로 축하해요. 점수가 안 나와도 레인 탓은 하지 않기!</li>
</ul>

<h3>10. 안전</h3>
<ul>
  <li>던지기 전에 손목·어깨·허리·다리를 충분히 풀어 주세요.</li>
  <li>공을 들 때는 공과 공 사이에 손가락이 끼지 않도록 <b>양손으로 옆에서</b> 잡아요.</li>
  <li>볼링화 바닥이 젖으면 미끄러지지 않아 넘어질 수 있어요. 음료는 정해진 자리에서만 마셔요.</li>
</ul>

<p class="doc-date">참고: <a href="http://sports.koreanpc.kr:9000/sports_follow/sub/bowling/bowling_1_01_01.asp?naviNum=2" target="_blank" rel="noopener">KPC 생활체육 볼링 안내</a> 내용을 바탕으로 앱에 맞게 다시 정리했어요.</p>`,
      },
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
  <li>이름과 기본 핸디(0~300)를 입력하고 <b>멤버 추가</b>를 누릅니다. 회원은 이름 순으로 정렬돼요.</li>
  <li>✏️ 버튼으로 이름·핸디를 수정하고, 🗑 버튼으로 삭제합니다. 삭제해도 지난 기록의 점수는 남아요.</li>
  <li>기록 탭의 참가 멤버 화면에서도 바로 새 멤버를 추가할 수 있어요.</li>
</ul>

<h3>3. 날짜 고르기</h3>
<ul>
  <li>기록·정산 탭에서는 화면 맨 위 <b>Best Bowling</b> 오른쪽에 작은 <b>탁상 달력</b>이 있어요.</li>
  <li><b>‹ ›</b> 버튼으로 하루씩 앞뒤로 옮기고, 달력을 누르면 한 달 달력이 펼쳐져요. 기록이 있는 날은 금색 동그라미로 표시되고, <b>오늘</b> 버튼으로 바로 돌아올 수 있어요.</li>
  <li>미래 날짜는 고를 수 없어요. 기록 탭의 <b>최근 기록</b>을 눌러 최근 5일로 바로 이동할 수도 있어요.</li>
</ul>

<h3>4. 점수 기록 <small>기록 탭</small></h3>
<ul>
  <li><b>참가 멤버</b>: 이름을 눌러 참가자를 고르고, 사람마다 그날의 <b>핸디</b>를 입력합니다. 핸디 칸이 비어 있으면 0이에요.</li>
  <li><b>개인전 / 팀전</b>: 팀전을 고르면 팀 수(2~4)를 정하고, 멤버 옆 A·B·C·D 버튼으로 팀을 옮겨요. 팀 이름 옆 ✏️ 버튼으로 팀 이름을 바꿀 수 있어요.</li>
  <li><b>첫 경기는 연습</b>: 점수 입력 카드 위쪽 버튼을 켜면 그날 1게임은 연습으로 표시되고 총점·평균·순위에서 빠져요.</li>
  <li><b>게임</b>: 기본으로 4게임이 준비돼 있고, <b>+</b> 버튼으로 더 추가할 수 있어요. 점수가 없는 뒤쪽 게임은 결과와 통계에 나오지 않아요.</li>
  <li><b>최종결과 입력</b>: 사람별로 게임 점수(0~300)만 입력합니다.</li>
  <li><b>프레임별 입력</b>: 점수판을 누르면 키패드가 열려요. <b>X</b> 스트라이크, <b>/</b> 스페어, <b>-</b> 거터(0), 숫자는 쓰러뜨린 핀 수입니다. 점수는 자동 계산되고, 한 프레임이 끝나면 다음 사람으로 넘어가요. ⌫ 버튼으로 마지막 투구를 지웁니다.</li>
  <li>입력 방식은 <b>게임마다</b> 따로 정할 수 있고, 두 방식에 넣은 값은 각각 남아 있어요. 프레임으로 입력한 게임을 최종결과로 바꾸면 계산된 점수가 그대로 채워져요.</li>
  <li><b>팀별 보기</b>: 팀전에서는 <b>전체 / A팀 / B팀…</b> 버튼으로 입력할 팀만 골라 볼 수 있어요.</li>
  <li><b>경기 결과</b>: 순위, 게임별 점수, 핸디 합계, 총점, 평균과 팀 결과(1위 팀에 왕관)가 자동으로 정리돼요. 제목 옆에 입력 방식(최종결과 / 프레임별 / 혼합)이 표시돼요.</li>
  <li><b>이미지 저장 / 공유하기</b>: 결과를 이미지로 저장하거나 카카오톡 등으로 바로 보낼 수 있어요.</li>
  <li><b>지난 기록 잠금</b>: 오늘 이전 날짜의 기록은 실수로 바뀌지 않게 잠겨 있고, 참가한 사람만 보여요. 고치려면 <b>수정</b> 버튼을 누르세요.</li>
</ul>
<p>입력한 내용은 자동으로 저장돼요. 따로 저장 버튼을 누를 필요가 없어요.</p>

<h3>5. 비용 정산 <small>정산 탭</small></h3>
<ul>
  <li><b>금액 단위</b>(원화 / 달러 / 유로 / 엔화)를 고르고, <b>경기비(1게임당)</b>와 <b>신발비(1인당)</b>를 입력합니다. 금액은 3자리마다 콤마가 붙어요.</li>
  <li><b>기록에서 불러오기</b>를 누르면 그날 참가자와 각자 친 게임 수가 채워져요. 연습 게임도 비용에는 포함돼요.</li>
  <li>사람마다 체크(포함 여부), 게임 수(−/+), <b>신발 포함</b>을 정하면 개인별 금액과 총액이 계산돼요.</li>
  <li>팀전 기록이 있는 날은 <b>개인별 / 팀별</b> 버튼으로 팀별 합계를 볼 수 있어요.</li>
  <li><b>기타 금액</b>: <b>항목 추가</b>로 음료·간식 같은 추가 비용을 넣고, <b>나눠서 부담</b>(이름을 눌러 고른 사람끼리 똑같이)이나 <b>한 사람 부담</b>을 고르면 개인별 금액에 더해져요. 나누어 떨어지지 않으면 몇 사람이 1원씩 더 내서 합계가 정확히 맞아요.</li>
  <li><b>이미지 저장 / 공유하기</b>로 정산표를 보낼 수 있어요. 기타 금액이 있으면 개인별·팀별 표에 <b>기타</b> 칸이 생기고, 기타 금액 표도 함께 들어가요.</li>
</ul>

<h3>6. 통계 <small>통계 탭</small></h3>
<ul>
  <li>맨 위에서 <b>기간</b>(전체·이번 달·3개월·올해)을 고르고, 멤버 이름을 눌러 개인 통계를 봅니다.</li>
  <li><b>게임별</b>: 게임 점수 추이 그래프(점선은 평균), 게임 순서별 평균, 전체 게임 기록(10개가 넘으면 표 안에서 스크롤)</li>
  <li><b>최종 점수별</b>: 날짜별 평균 그래프와 날짜별 최종 점수표(날짜를 누르면 그날 기록으로 이동)</li>
  <li>맨 아래 <b>전체 순위</b>는 평균 점수 기준이에요.</li>
  <li>연습 게임은 통계에서 빠져요. 단, <b>게임 순서별 평균</b>에는 포함되고 “연습 n회 포함”으로 표시돼요.</li>
</ul>

<h3>7. 설정과 백업</h3>
<ul>
  <li><b>언어</b>: 한국어 / English. 금액 단위를 따로 고르지 않았다면 한국어는 원화, 영어는 달러로 표시돼요.</li>
  <li><b>화면 모드</b>: 라이트 / 다크 / 시스템</li>
  <li><b>백업 저장 / 백업 파일 가져오기</b>: 모든 기록은 이 휴대폰에만 저장돼요. 휴대폰을 바꾸거나 앱을 다시 설치하거나 브라우저 데이터를 지우기 전에 꼭 백업 파일을 저장해 주세요.</li>
  <li><b>모든 데이터 삭제</b>: 멤버와 기록을 모두 지웁니다. 되돌릴 수 없어요.</li>
  <li><b>앱 정보</b>: 볼링 상식, 이 사용설명서, 개인정보 처리방침, 이용약관, 오픈소스 라이선스를 볼 수 있어요.</li>
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
      bowling: {
        title: 'Bowling Basics',
        html: `
<p>A quick guide to get more out of every game.</p>

<h3>1. What is bowling?</h3>
<ul>
  <li>It is said to come from a ritual in medieval German churches, where people knocked down clubs that stood for the devil.</li>
  <li>Today it's an indoor game: roll a ball to knock down <b>10 pins</b> set in a triangle. Anyone can play, at any age or fitness level.</li>
</ul>

<h3>2. How a game works</h3>
<ul>
  <li>A game has <b>10 frames</b>, with up to two balls per frame.</li>
  <li>All 10 pins on the first ball is a <b>strike</b>; all 10 using both balls is a <b>spare</b>; pins left standing is an <b>open frame</b>.</li>
  <li>In the <b>10th frame</b>, a strike or spare earns bonus balls — up to three in total.</li>
  <li>If the first ball is a gutter or foul and the second knocks down all 10, it counts as a <b>spare</b>, not a strike.</li>
</ul>

<h3>3. Scoring</h3>
<ul>
  <li><b>Strike (X)</b>: 10 + the pins from your <b>next two balls</b>.<br><small>e.g. X, then 7 and 2 ⇒ 10 + 7 + 2 = 19</small></li>
  <li><b>Spare (/)</b>: 10 + the pins from your <b>next ball</b>.<br><small>e.g. 6 /, then 8 ⇒ 10 + 8 = 18</small></li>
  <li><b>Open frame</b>: just the pins knocked down.</li>
  <li>Each frame adds to the running total; strikes and spares are final once their bonus balls are thrown.</li>
  <li><b>Perfect game</b>: 12 strikes in a row scores the maximum, <b>300</b>.</li>
</ul>

<h3>4. Score-sheet marks</h3>
<ul>
  <li><b>X</b> strike · <b>/</b> spare · <b>-</b> no pins (0) · <b>G</b> gutter · <b>F</b> foul (0)</li>
  <li><b>Foul</b>: if any part of your body crosses the foul line as you throw, that ball scores 0.</li>
  <li><b>Split</b>: the head pin falls on the first ball and the pins left have a gap between them, e.g. 7-10 or 4-6. If the 1-pin is still standing it isn't a split.</li>
</ul>

<h3>5. Lane and pins</h3>
<ul>
  <li><b>Approach</b>: the runway where you walk up (at least about 4.6 m long).</li>
  <li><b>Foul line</b>: the line between the approach and the lane — don't step over it.</li>
  <li><b>Arrows and dots</b>: aim at these marks on the lane rather than at the pins; it's much easier to keep your line.</li>
  <li><b>Gutters</b>: the channels on both sides; a ball that drops in can't hit any pins.</li>
  <li><b>Pin layout</b>: 1-pin (head pin) in front, then 2–3, 4–6 and 7–10 in a triangle, about 30 cm apart.</li>
</ul>

<h3>6. Equipment</h3>
<ul>
  <li><b>Ball</b>: up to 16 lb (about 7.2 kg). Start with the alley's <b>house balls</b> to find a weight and fit that suit you, then get your own ball once you're comfortable. About 10% of your body weight is a common guide.</li>
  <li><b>Shoes</b>: the sliding sole (left foot for right-handers) is slick, the other is rubber for grip. Always wear them and keep them dry.</li>
  <li><b>Wrist support</b>: keeps your wrist steady for a more consistent line and spin.</li>
</ul>

<h3>7. Grips and ball paths</h3>
<ul>
  <li><b>Conventional grip</b>: middle and ring fingers in to the second knuckle — stable and great for beginners.</li>
  <li><b>Fingertip grip</b>: only the fingertips in — more spin, used by experienced bowlers.</li>
  <li><b>Straight</b>: rolls in a straight line; easiest to control.</li>
  <li><b>Hook</b>: goes straight, then breaks into the pins near the end — more pin action and more strikes.</li>
  <li><b>Curve</b>: a wide arc — powerful but hard to control.</li>
  <li><b>Backup</b>: breaks the opposite way to a hook, often from the wrist turning outward.</li>
</ul>

<h3>8. Tips</h3>
<ul>
  <li>A <b>four-step approach</b> is the standard. Push the ball out with your first step and let your arm swing like a pendulum, without forcing it.</li>
  <li>At release, your thumb leaves first and your fingers lift the ball; keep reaching toward your target in the follow-through.</li>
  <li>Bend your knee and stay low as you slide on the last step to keep your balance.</li>
  <li><b>Spares</b>: aim for the front-most remaining pin (the key pin) and think about which pins will knock others down.</li>
</ul>

<h3>9. Etiquette</h3>
<ul>
  <li>If you and the bowler next to you step up at the same time, let the one on the <b>right</b> go first.</li>
  <li>Bowl promptly when it's your turn, and don't distract others while they bowl.</li>
  <li>Never cross the foul line onto the lane.</li>
  <li>Don't use someone else's ball without asking.</li>
  <li>Cheer strikes and spares — and don't blame the lane for a bad score!</li>
</ul>

<h3>10. Safety</h3>
<ul>
  <li>Warm up your wrists, shoulders, back and legs before you start.</li>
  <li>Pick a ball up with <b>both hands from the sides</b> so your fingers can't get pinched between balls.</li>
  <li>Wet shoe soles won't slide and can make you fall; keep drinks in the seating area.</li>
</ul>

<p class="doc-date">Source: rewritten for this app from the <a href="http://sports.koreanpc.kr:9000/sports_follow/sub/bowling/bowling_1_01_01.asp?naviNum=2" target="_blank" rel="noopener">KPC community-sports bowling guide</a> (Korean).</p>`,
      },
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
  <li>Enter a name and default handicap (0–300), then tap <b>Add member</b>. Members are listed by name.</li>
  <li>Use ✏️ to edit and 🗑 to delete. Deleting a member keeps their past scores.</li>
  <li>You can also add a new member right from the Players card on the Scores tab.</li>
</ul>

<h3>3. Picking a date</h3>
<ul>
  <li>On the Scores and Settle tabs, a small <b>desk calendar</b> sits to the right of <b>Best Bowling</b> at the top.</li>
  <li>Use <b>‹ ›</b> to step one day back or forward, or tap the calendar to open the month view. Days with records are circled in gold, and <b>Today</b> jumps back to today.</li>
  <li>Future dates can't be picked. On the Scores tab you can also tap a <b>Recent</b> chip to jump to one of the last 5 days.</li>
</ul>

<h3>4. Recording scores <small>Scores tab</small></h3>
<ul>
  <li><b>Players</b>: tap names to select who played, and set each player's <b>handicap</b> for the day. An empty handicap box means 0.</li>
  <li><b>Singles / Teams</b>: in Teams, choose 2–4 teams and move players with the A·B·C·D buttons. Tap ✏️ next to a team name to rename it.</li>
  <li><b>1st game is practice</b>: turn this on at the top of the score card to mark game 1 as practice and leave it out of totals, averages and rankings.</li>
  <li><b>Games</b>: 4 games are ready by default; tap <b>+</b> to add more. Empty games at the end don't show in results or stats.</li>
  <li><b>Final Score</b>: just type each player's game score (0–300).</li>
  <li><b>By Frame</b>: tap a score sheet to open the keypad. <b>X</b> strike, <b>/</b> spare, <b>-</b> gutter (0), numbers are pins knocked down. Scores are calculated automatically and the keypad moves to the next player after each frame. ⌫ undoes the last ball.</li>
  <li>The input mode is chosen <b>per game</b>, and values entered in either mode are kept. Switching a frame-entered game to Final Score fills in the calculated scores.</li>
  <li><b>Team filter</b>: in team matches, use <b>All / Team A / Team B…</b> to show only the team you're entering.</li>
  <li><b>Results</b>: rankings, per-game scores, handicap, totals, averages and team results (with a crown for the winning team) are summarized automatically. The title shows how scores were entered (final / by frame / mixed).</li>
  <li><b>Save image / Share</b>: save the results as an image or send it straight to a messaging app.</li>
  <li><b>Locked past records</b>: records before today are locked so they can't change by accident, and only the players who played are shown. Tap <b>Edit</b> to change them.</li>
</ul>
<p>Everything you enter is saved automatically — there's no save button to press.</p>

<h3>5. Settle up <small>Settle tab</small></h3>
<ul>
  <li>Choose the <b>currency</b> (KRW / USD / EUR / JPY) and enter the <b>game fee (per game)</b> and <b>shoe rental (per person)</b>. Amounts are grouped with commas as you type.</li>
  <li><b>Load from scores</b> fills in that day's players and how many games each played. Practice games are still charged.</li>
  <li>For each person set the check (included), games (−/+) and <b>Shoes</b> to get each amount and the total.</li>
  <li>On days with a team match, switch between <b>Per person / Per team</b>.</li>
  <li><b>Extra costs</b>: tap <b>Add item</b> for drinks, snacks and so on, then choose <b>Split</b> (evenly among the people you tap) or <b>One person</b>; each share is added to that person's amount. Uneven splits put the extra cent or won on a few people so the total adds up exactly.</li>
  <li>Use <b>Save image / Share</b> to send the settlement. With extra costs, the per-person and per-team tables get an <b>Extra</b> column, and an extra-costs table is included.</li>
</ul>

<h3>6. Stats <small>Stats tab</small></h3>
<ul>
  <li>Choose a <b>period</b> (All, This month, 3 months, This year) at the top, then tap a member's name.</li>
  <li><b>By game</b>: game score trend chart (dashed line = average), average by game order, and every game played (scrolls inside the table past 10 rows).</li>
  <li><b>By session</b>: average-by-date chart and final scores by date (tap a date to open that day).</li>
  <li>The <b>Leaderboard</b> at the bottom ranks by average.</li>
  <li>Practice games are left out of stats, except <b>average by game order</b>, which includes them and notes “incl. n practice”.</li>
</ul>

<h3>7. Settings &amp; backup</h3>
<ul>
  <li><b>Language</b>: 한국어 / English. If you haven't picked a currency, amounts show in won in Korean and dollars in English.</li>
  <li><b>Appearance</b>: Light / Dark / System</li>
  <li><b>Save backup / Import backup</b>: all records live only on this phone. Save a backup before switching phones, reinstalling the app or clearing browser data.</li>
  <li><b>Erase all data</b>: deletes all members and records. This cannot be undone.</li>
  <li><b>About</b>: bowling basics, this guide, privacy policy, terms and open-source licenses.</li>
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
