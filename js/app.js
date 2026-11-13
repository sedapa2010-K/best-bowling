/* 볼링비서 (Bowling Secretary) — all data lives in this device's localStorage only. */
(() => {
  'use strict';

  const STORE_KEY = 'bestbowling:v1'; // kept from the app's first name (Best Bowling) so existing records load
  // App name per language: plain part + gold part (the logo shows the second part in gold).
  const BRAND = { ko: ['볼링', '비서'], en: ['Bowling ', 'Secretary'] };
  const TEAMS = ['A', 'B', 'C', 'D'];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toInt = (v) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; };
  const HDCP_MAX = 100; // per game; real handicaps are rarely over ~80
  const toHdcp = (v) => Math.min(HDCP_MAX, Math.max(0, toInt(v)));

  /* ───────── i18n ───────── */
  const I18N = {
    ko: {
      tabRecord: '기록', tabMembers: '회원', tabCost: '정산', tabStats: '통계', tabSettings: '설정',
      allPlayers: '전체', extraCosts: '기타 금액', extraAdd: '항목 추가', extraEmpty: '음료, 간식 같은 추가 비용을 넣을 수 있어요.', extraLabelPh: '음료, 간식 등',
      extraSplit: '나눠서 부담', extraOne: '한 사람 부담', extraSplitHint: '{0}명이 1인당 {1}씩 나눠 내요', extraOneHint: '{0} 님이 {1} 모두 부담해요',
      extraPickOne: '부담할 사람을 선택하세요', extraNoOne: '정산에 포함된 사람이 없어요', extraNeedOne: '최소 한 명은 선택해야 해요', extraShort: '기타',
      extraItem: '항목', extraWhoCol: '부담', extraSplitN: '{0}명 나눠서', pracIncl: '연습 {0}회 포함', modeMixed: '혼합 입력', currency: '금액 단위', curKRW: '원화', curUSD: '달러', curEUR: '유로', curJPY: '엔화', entryHint: '입력한 점수에 따라 아래 경기 결과가 바로 바뀌어요', teamShort: '{0}팀', editTeamName: '팀 이름 수정', editRecord: '수정', lockedHint: '지난 기록이에요. 수정 버튼을 눌러야 바꿀 수 있어요',
      lockedTap: '위의 수정 버튼을 눌러 주세요', periodAll: '전체', periodMonth: '이번 달', period3m: '3개월', periodYear: '올해',
      noStatsPeriod: '이 기간에는 경기 기록이 없어요', appInfo: '앱 정보', appInfoSub: '볼링 상식 · 사용설명서 · 정책 · 라이선스', byPerson: '개인별', byTeam: '팀별', teamSettle: '팀별 정산', noTeam: '팀 없음', practice: '연습', firstPractice: '첫 경기는 연습',
      statsTitle: '통계', noStats: '아직 경기 기록이 없어요', high: '최고', low: '최저', over200: '200점 이상', hdcpAvg: '핸디 포함 평균',
      exportXlsx: '엑셀', confirmXlsx: '{0} 기록을 엑셀 파일로 저장할까요?', xlsxSaved: '엑셀 파일을 저장했어요', xlsxGames: '게임 기록', xlsxDays: '날짜별 요약', xlsxMembers: '회원별 통계', xlsxColsGames: '날짜|요일|이름|팀|게임|점수|핸디|합계|연습|입력 방식', xlsxColsDays: '날짜|요일|이름|팀|게임 수|점수 합계|평균|핸디 합계|총점|최고점|순위', xlsxColsMembers: '이름|기본 핸디|참가 일수|게임 수|평균|최고|최저|200점 이상|핸디 포함 평균', xlsxYes: '예', xlsxFinal: '최종 점수', xlsxFrame: '프레임', sessionsN: '{0}회 출전', byGame: '게임별', byFinal: '날짜별', trendGames: '게임별 점수 추이', trendFinal: '날짜별 평균 추이', lastN: '최근 {0}개',
      gameOrder: '게임 순서별 평균', highShort: '최고 {0}', gUnit: '게임', allGames: '전체 게임 기록', game: '게임', score: '점수',
      finalTable: '날짜별 최종 점수', tapRowHint: '날짜를 누르면 그날 기록으로 이동해요', leaderboard: '전체 순위', byAvg: '평균 기준',
      today: '오늘', recent: '최근 기록', noRecent: '아직 저장된 기록이 없어요', gamesPeople: '{0}게임 · {1}명',
      selectedDate: '선택한 날짜', participants: '참가 멤버', nPeople: '{0}명',
      noMembers: '등록된 멤버가 없어요. 아래에서 바로 추가해 보세요.', newMemberPh: '새 멤버 이름', hdcp: '핸디', add: '추가',
      individual: '개인전', teamMatch: '팀전', teamCount: '팀 수', teamHint: '멤버 옆의 팀 버튼(A·B…)을 눌러 팀을 옮길 수 있어요.', teamEmpty: '아직 멤버가 없어요', teamName: '{0}팀',
      pickHint: '참가할 멤버를 선택하면\n사람별로 점수를 입력할 수 있어요.',
      finalMode: '최종결과 입력', frameMode: '프레임별 입력',
      gameN: '{0}게임', gameLbl: '게임', vertView: '세로보기', horizView: '가로보기', deleteGame: '{0}게임 삭제', confirmDelGame: '{0}게임 기록을 삭제할까요?',
      tapToInput: '점수판을 누르면 키패드가 열려요',
      frameRoll: '{0}프레임 · {1}구', splitBtn: '스플릿', gameDone: '게임 완료', next: '다음 사람', done: '완료', allDone: '모든 멤버의 게임이 끝났어요',
      results: '경기 결과', name: '이름', total: '총점', avg: '평균', scratch: '스크래치', team: '팀',
      teamResults: '팀 결과', win: '승리', draw: '무승부',
      backExit: '뒤로 버튼을 한 번 더 누르면 종료돼요', certBtn: '인증서 만들기', certPick: '어떤 인증서를 만들까요?', certPerfect: '퍼펙트게임', certHigh: '하이스코어', certWin: '우승',
      certSub_perfect: '300점, 열두 번 연속 스트라이크', certSub_high: '오늘의 최고 점수', certSub_win: '오늘의 1위', certHead: '{0} 인증서', certBack: '뒤로',
      certDate: '날짜', certWho: '대상자', certScore: '점수', certMates: '함께한 동료', certPlace: '볼링장', certTheme: '테마', certTheme_navy: '로열 네이비', certTheme_black: '블랙 골드', certTheme_wine: '버건디', certTheme_emerald: '에메랄드', certEvent: '대회명', certEventPh: '예: 제3회 친선 볼링대회', certPlacePh: '예: OO볼링장', optional: '(선택)', certMatesPh: '이름을 쉼표로 구분해 주세요',
      certPhotos: '사진 (최대 2장)', certGallery: '갤러리', certCamera: '사진 찍기', certRemove: '사진 빼기', certNameReq: '대상자 이름을 넣어 주세요',
      certBodyPerfect: '위 사람은 {0} 볼링 경기에서 퍼펙트게임을 달성하였기에 그 영예를 기리어 이 인증서를 드립니다.',
      certBodyHigh: '위 사람은 {0} 볼링 경기에서 {1}점의 하이스코어를 기록하였기에 그 실력을 인정하여 이 인증서를 드립니다.',
      certBodyWin: '위 사람은 {0} 볼링 경기에서 우승하였기에 그 영광을 기리어 이 인증서를 드립니다.',
      certBodyWinEvent: '위 사람은 {0} {1}에서 우승하였기에 그 영광을 기리어 이 인증서를 드립니다.',
      saveImage: '이미지 저장', share: '공유하기', autosave: '입력한 기록은 이 휴대폰에 자동 저장돼요',
      deleteRecord: '기록 삭제', confirmDelRecord: '{0}\n기록을 삭제할까요?',
      cancel: '취소', delete: '삭제', ok: '확인', save: '저장', close: '닫기',
      membersTitle: '회원 관리', addMember: '멤버 추가', memberName: '이름', defaultHdcp: '기본 핸디',
      memberCount: '총 {0}명', noMembersYet: '아직 등록된 멤버가 없어요.\n위에서 첫 멤버를 추가해 보세요.',
      statLine: '{0}게임 · 평균 {1} · 최고 {2}', noGames: '아직 경기 기록 없음',
      confirmDelMember: '{0} 님을 삭제할까요?\n지난 기록의 점수는 그대로 남아요.',
      nameRequired: '이름을 입력해 주세요', dupName: '이미 같은 이름의 멤버가 있어요', added: '{0} 님을 추가했어요',
      renderErr: '화면을 그리는 중 문제가 생겼어요. 이 화면을 캡처해서 알려 주세요', costTitle: '비용 정산', moneyMax: '최대 {0}까지 입력할 수 있어요', date: '날짜', gameFee: '경기비', perGame: '1게임당', shoeFee: '신발비', perPerson: '1인당',
      perPersonTitle: '인원별 정산', loadFromRecord: '기록에서 불러오기', noRecordForDate: '이 날짜에 저장된 경기 기록이 없어요',
      confirmReload: '현재 정산 목록을 경기 기록 기준으로 다시 불러올까요?', loaded: '경기 기록을 불러왔어요',
      costEmpty: '기록에서 불러오거나 아래 멤버를 눌러 추가하세요.', addPerson: '멤버 추가',
      games: '게임', shoes: '신발', shoesIncl: '신발 포함', amount: '금액', people: '인원', totalGames: '총 게임', grandTotal: '총 금액',
      settingsTitle: '설정', language: '언어', languageSub: '앱에 표시되는 언어', theme: '화면 모드', themeSub: '밝기 테마 선택',
      light: '라이트', dark: '다크', system: '시스템',
      data: '데이터 관리', dataNote: '모든 기록은 서버 없이 이 휴대폰에만 저장돼요. 휴대폰을 바꾸기 전에 백업 파일을 내보내 주세요.',
      exportData: '백업 파일 내보내기', saveBackup: '백업 저장', importData: '백업 파일 가져오기', resetData: '모든 데이터 삭제',
      confirmImport: '백업 파일로 현재 데이터를 덮어쓸까요?', imported: '백업을 불러왔어요', badFile: '올바른 백업 파일이 아니에요',
      confirmReset: '모든 멤버와 기록을 삭제할까요?\n되돌릴 수 없어요.', resetDone: '모든 데이터를 삭제했어요', exported: '백업 파일을 저장했어요',
      savedImg: '이미지를 저장했어요', shareFallback: '공유를 지원하지 않아 이미지로 저장했어요', longPress: '이미지를 길게 눌러 사진에 저장하세요',
      storageErr: '저장 공간이 부족해 저장하지 못했어요', fee: '경기비 {0} · 신발비 {1}',
    },
    en: {
      tabRecord: 'Scores', tabMembers: 'Members', tabCost: 'Settle', tabStats: 'Stats', tabSettings: 'Settings',
      allPlayers: 'All', extraCosts: 'Extra costs', extraAdd: 'Add item', extraEmpty: 'Add extras such as drinks or snacks.', extraLabelPh: 'Drinks, snacks…',
      extraSplit: 'Split', extraOne: 'One person', extraSplitHint: '{0} people pay {1} each', extraOneHint: '{0} pays the full {1}',
      extraPickOne: 'Choose who pays', extraNoOne: 'No one is included in the settlement', extraNeedOne: 'Pick at least one person', extraShort: 'Extra',
      extraItem: 'Item', extraWhoCol: 'Paid by', extraSplitN: 'Split by {0}', pracIncl: 'incl. {0} practice', modeMixed: 'Mixed input', currency: 'Currency', curKRW: 'KRW ₩', curUSD: 'USD $', curEUR: 'EUR €', curJPY: 'JPY ¥', entryHint: 'Results below update as you enter scores', teamShort: '{0}', editTeamName: 'Rename team', editRecord: 'Edit', lockedHint: 'This is a past record — tap Edit to change it',
      lockedTap: 'Tap Edit above to change it', periodAll: 'All', periodMonth: 'This month', period3m: '3 months', periodYear: 'This year',
      noStatsPeriod: 'No games in this period', appInfo: 'About', appInfoSub: 'Bowling basics · guide · policies · licenses', byPerson: 'Per person', byTeam: 'Per team', teamSettle: 'Per team', noTeam: 'No team', practice: 'Practice', firstPractice: '1st game is practice',
      statsTitle: 'Statistics', noStats: 'No games recorded yet', high: 'High', low: 'Low', over200: '200+ games', hdcpAvg: 'Avg with HDCP',
      exportXlsx: 'Excel', confirmXlsx: 'Save the records for {0} as an Excel file?', xlsxSaved: 'Excel file saved', xlsxGames: 'Games', xlsxDays: 'By date', xlsxMembers: 'By member', xlsxColsGames: 'Date|Day|Name|Team|Game|Score|HDCP|Total|Practice|Input', xlsxColsDays: 'Date|Day|Name|Team|Games|Scratch|Average|HDCP total|Total|High|Rank', xlsxColsMembers: 'Name|HDCP|Days|Games|Average|High|Low|200+|Avg incl. HDCP', xlsxYes: 'Yes', xlsxFinal: 'Final', xlsxFrame: 'Frame', sessionsN: '{0} sessions', byGame: 'By game', byFinal: 'By date', trendGames: 'Game scores', trendFinal: 'Average by date', lastN: 'Last {0}',
      gameOrder: 'Average by game order', highShort: 'High {0}', gUnit: 'g', allGames: 'All games', game: 'Game', score: 'Score',
      finalTable: 'Final scores by date', tapRowHint: 'Tap a date to open that day\'s scores', leaderboard: 'Leaderboard', byAvg: 'by average',
      today: 'Today', recent: 'Recent', noRecent: 'No saved records yet', gamesPeople: '{0} games · {1}',
      selectedDate: 'Selected date', participants: 'Players', nPeople: '{0} players',
      noMembers: 'No members yet. Add one right below.', newMemberPh: 'Name', hdcp: 'HDCP', add: 'Add',
      individual: 'Singles', teamMatch: 'Teams', teamCount: 'Teams', teamHint: 'Tap a team letter next to a player to move them.', teamEmpty: 'No players yet', teamName: 'Team {0}',
      pickHint: 'Select the players\nto start entering scores.',
      finalMode: 'Final Score', frameMode: 'By Frame',
      gameN: 'Game {0}', gameLbl: 'Game', vertView: 'Vertical', horizView: 'Horizontal', deleteGame: 'Delete game {0}', confirmDelGame: 'Delete game {0}?',
      tapToInput: 'Tap a score sheet to open the keypad',
      frameRoll: 'Frame {0} · Ball {1}', splitBtn: 'Split', gameDone: 'Game complete', next: 'Next', done: 'Done', allDone: 'Everyone has finished the game',
      results: 'Results', name: 'Name', total: 'Total', avg: 'Avg', scratch: 'Scratch', team: 'Team',
      teamResults: 'Team results', win: 'Win', draw: 'Draw',
      backExit: 'Press back again to exit', certBtn: 'Make a certificate', certPick: 'Which certificate would you like?', certPerfect: 'Perfect Game', certHigh: 'High Score', certWin: 'Champion',
      certSub_perfect: '300 — twelve strikes in a row', certSub_high: 'Best game of the day', certSub_win: 'Top of the day', certHead: '{0}', certBack: 'Back',
      certDate: 'Date', certWho: 'Awarded to', certScore: 'Score', certMates: 'Bowled with', certPlace: 'Bowling alley', certTheme: 'Theme', certTheme_navy: 'Royal Navy', certTheme_black: 'Black Gold', certTheme_wine: 'Burgundy', certTheme_emerald: 'Emerald', certEvent: 'Event', certEventPh: 'e.g. Autumn Cup', certPlacePh: 'e.g. Sunset Lanes', optional: '(optional)', certMatesPh: 'Names, separated by commas',
      certPhotos: 'Photos (up to 2)', certGallery: 'Gallery', certCamera: 'Camera', certRemove: 'Remove photo', certNameReq: 'Enter a name',
      certBodyPerfect: 'For bowling a perfect game on {0}.',
      certBodyHigh: 'For rolling an outstanding high score of {1} on {0}.',
      certBodyWin: 'For winning the day on {0}.',
      certBodyWinEvent: 'For winning {1} on {0}.',
      saveImage: 'Save image', share: 'Share', autosave: 'Scores are saved automatically on this phone',
      deleteRecord: 'Delete record', confirmDelRecord: 'Delete the record for\n{0}?',
      cancel: 'Cancel', delete: 'Delete', ok: 'OK', save: 'Save', close: 'Close',
      membersTitle: 'Members', addMember: 'Add member', memberName: 'Name', defaultHdcp: 'Handicap',
      memberCount: '{0} total', noMembersYet: 'No members yet.\nAdd your first member above.',
      statLine: '{0} games · avg {1} · high {2}', noGames: 'No games yet',
      confirmDelMember: 'Delete {0}?\nPast scores will be kept.',
      nameRequired: 'Please enter a name', dupName: 'A member with that name already exists', added: '{0} added',
      renderErr: 'Something went wrong drawing this screen. Please send a screenshot of it', costTitle: 'Settle up', moneyMax: 'Up to {0}', date: 'Date', gameFee: 'Game fee', perGame: 'per game', shoeFee: 'Shoe rental', perPerson: 'per person',
      perPersonTitle: 'Per person', loadFromRecord: 'Load from scores', noRecordForDate: 'No scores saved for this date',
      confirmReload: 'Reload the list from this date\'s scores?', loaded: 'Loaded from scores',
      costEmpty: 'Load from scores, or tap a member below to add.', addPerson: 'Add member',
      games: 'Games', shoes: 'Shoes', shoesIncl: 'Shoes', amount: 'Amount', people: 'People', totalGames: 'Games', grandTotal: 'Total',
      settingsTitle: 'Settings', language: 'Language', languageSub: 'Display language', theme: 'Appearance', themeSub: 'Brightness theme',
      light: 'Light', dark: 'Dark', system: 'System',
      data: 'Data', dataNote: 'All records stay on this phone only — there is no server. Export a backup before switching phones.',
      exportData: 'Export backup', saveBackup: 'Save backup', importData: 'Import backup', resetData: 'Erase all data',
      confirmImport: 'Replace current data with this backup?', imported: 'Backup imported', badFile: 'Not a valid backup file',
      confirmReset: 'Delete all members and records?\nThis cannot be undone.', resetDone: 'All data erased', exported: 'Backup saved',
      savedImg: 'Image saved', shareFallback: 'Sharing isn\'t supported, so the image was saved', longPress: 'Long-press the image to save it to Photos',
      storageErr: 'Storage is full — could not save', fee: 'Game {0} · Shoes {1}',
    },
  };
  const WD = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ───────── Storage ───────── */
  // Everything read from storage or an imported backup is untrusted: rebuild it field by field, keeping only
  // well-formed ids, dates, numbers and strings, so nothing unexpected can reach the HTML templates.
  const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
  const clampInt = (v, lo, hi, dflt = 0) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt; };
  const money = (v, dflt) => { const n = Number(v); return Number.isFinite(n) && n >= 0 ? Math.min(1e9, Math.round(n * 100) / 100) : dflt; };
  // Money limits in won (other currencies scale by CUR_RATE): game/shoe fee per item, and an extra (drinks, food…).
  const MONEY_MAX = { fee: 100000, extra: 5000000 };
  // Rough value of each currency against the won, used to convert amounts when the currency is switched.
  const CUR_RATE = { KRW: 1, USD: 0.001, EUR: 0.001, JPY: 0.1 };
  const capMoney = (v, kind) => Math.min(MONEY_MAX[kind], money(v, 0));
  const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const entries = (o) => (isObj(o) ? Object.keys(o).map((k) => [k, o[k]]) : []);
  function cleanSession(date, x) {
    const teamCount = clampInt(x.teamCount, 2, 4, 2);
    const players = (Array.isArray(x.players) ? x.players : []).filter((q) => isObj(q) && ID_RE.test(q.id))
      .map((q) => ({ id: q.id, name: str(q.name, 40), hdcp: clampInt(q.hdcp, 0, HDCP_MAX), team: clampInt(q.team, 0, teamCount - 1) }));
    const games = (Array.isArray(x.games) ? x.games : []).slice(0, 50).filter(isObj).map((g) => {
      const ent = {};
      entries(g.entries).forEach(([id, e]) => {
        if (!ID_RE.test(id) || !isObj(e)) return;
        const score = e.score === null || e.score === undefined || e.score === '' ? null : clampInt(e.score, 0, 300, null);
        const rolls = (Array.isArray(e.rolls) ? e.rolls : []).slice(0, 21).map((r) => clampInt(r, 0, 10));
        ent[id] = { score, rolls };
        // splits: indexes into rolls of first balls marked as a split (shown in red)
        const splits = (Array.isArray(e.splits) ? e.splits : []).map((i) => clampInt(i, 0, 20, -1))
          .filter((i, k, a) => i >= 0 && i < rolls.length && a.indexOf(i) === k && splitOk(rolls, i)).sort((a, b) => a - b);
        if (splits.length) ent[id].splits = splits;
      });
      return { mode: g.mode === 'frame' ? 'frame' : 'final', entries: ent };
    });
    if (!games.length) games.push({ mode: 'final', entries: {} });
    return {
      date, teamMode: !!x.teamMode, teamCount, firstPractice: !!x.firstPractice,
      teamNames: (Array.isArray(x.teamNames) ? x.teamNames : []).slice(0, 4).map((n) => str(n, 12)),
      players, games, active: clampInt(x.active, 0, games.length - 1), updatedAt: clampInt(x.updatedAt, 0, 1e15),
    };
  }
  function cleanCost(date, x) {
    return {
      date, gameFee: capMoney(x.gameFee, 'fee'), shoeFee: capMoney(x.shoeFee, 'fee'),
      rows: (Array.isArray(x.rows) ? x.rows : []).filter((r) => isObj(r) && ID_RE.test(r.id))
        .map((r) => ({ id: r.id, name: str(r.name, 40), on: r.on !== false, games: clampInt(r.games, 0, 99), shoes: !!r.shoes })),
      extras: (Array.isArray(x.extras) ? x.extras : []).slice(0, 30).filter((e) => isObj(e) && ID_RE.test(e.id))
        .map((e) => ({ id: e.id, label: str(e.label, 20), amount: capMoney(e.amount, 'extra'), mode: e.mode === 'one' ? 'one' : 'split',
          who: (Array.isArray(e.who) ? e.who : []).filter((id) => typeof id === 'string' && ID_RE.test(id)).slice(0, 60) })),
    };
  }
  function normalize(d) {
    d = isObj(d) ? d : {};
    const ko = (navigator.language || 'ko').toLowerCase().startsWith('ko');
    const st = isObj(d.settings) ? d.settings : {}, fee = isObj(d.feeDefaults) ? d.feeDefaults : {};
    const sessions = {}, costs = {};
    entries(d.sessions).forEach(([k, x]) => { if (DATE_RE.test(k) && isObj(x)) sessions[k] = cleanSession(k, x); });
    entries(d.costs).forEach(([k, x]) => { if (DATE_RE.test(k) && isObj(x)) costs[k] = cleanCost(k, x); });
    return {
      members: (Array.isArray(d.members) ? d.members : []).filter((m) => isObj(m) && ID_RE.test(m.id) && str(m.name, 40))
        .map((m) => ({ id: m.id, name: str(m.name, 40), handicap: clampInt(m.handicap, 0, HDCP_MAX) })),
      sessions, costs,
      settings: { lang: ['ko', 'en'].includes(st.lang) ? st.lang : ko ? 'ko' : 'en', theme: ['light', 'dark', 'system'].includes(st.theme) ? st.theme : 'system',
        ...(['KRW', 'USD', 'EUR', 'JPY'].includes(st.currency) ? { currency: st.currency } : {}),
        ...(st.resultsVert === true ? { resultsVert: true } : {}) },
      feeDefaults: { gameFee: Math.min(MONEY_MAX.fee, money(fee.gameFee, 3000)), shoeFee: Math.min(MONEY_MAX.fee, money(fee.shoeFee, 1500)) },
    };
  }
  function load() {
    try { return normalize(JSON.parse(localStorage.getItem(STORE_KEY))); } catch (e) { return normalize(null); }
  }
  let db = load();
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch (e) { toast(t('storageErr')); }
  }

  const lang = () => (I18N[db.settings.lang] ? db.settings.lang : 'ko');
  const brandName = () => BRAND[lang()].join('');
  const brandHTML = () => `${BRAND[lang()][0]}<em>${BRAND[lang()][1]}</em>`;
  function t(k, ...args) {
    let s = I18N[lang()][k] ?? I18N.ko[k] ?? k;
    args.forEach((v, i) => { s = s.replace(`{${i}}`, v); });
    return s;
  }

  /* ───────── UI state ───────── */
  const now = new Date();
  const ui = {
    tab: 'record',
    date: ymd(now),
    calY: now.getFullYear(),
    calM: now.getMonth(),
    calOpen: false,    // month calendar expanded
    kp: null,          // { pid } while the frame keypad is open
    kpScroll: false,
    editId: null,      // member being edited
    statId: null,      // member shown on the stats tab
    statView: 'game',  // 'game' | 'final'
    statPeriod: 'all', // 'all' | 'month' | '3m' | 'year'
    unlocked: null,    // past date the user unlocked for editing
    editTeam: null,    // team index whose name is being edited
    costView: 'person', // cost tab in team matches: 'person' | 'team'
    entryTeam: 'all',  // score-entry filter in team matches: 'all' or a team index
    busy: false,
    draft: null,       // unsaved empty session for the selected date
    cdraft: null,      // unsaved cost sheet for the selected date
  };

  /* ───────── Icons ───────── */
  const P = {
    pin: '<path d="M12 2.2c1.6 0 2.3 1.3 2.3 2.7 0 1.4-.9 2.2-.9 3.1 0 .9 2.5 2.9 2.5 6.5 0 3-1.1 5.5-1.7 7.3H9.8c-.6-1.8-1.7-4.3-1.7-7.3 0-3.6 2.5-5.6 2.5-6.5 0-.9-.9-1.7-.9-3.1 0-1.4.7-2.7 2.3-2.7z"/><path d="M10.5 6.1h3"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    frames: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M7 6v12M12 6v12M17 6v12"/>',
    sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    auto: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    crown: '<path d="M3 9.6l5.2 4.4L12 5.6l3.8 8.4L21 9.6V16H3z"/><path d="M3 16.2q9 2.6 18 0V19q-9 2.6-18 0z"/><circle cx="3" cy="7.9" r="1.3"/><circle cx="12" cy="3.9" r="1.4"/><circle cx="21" cy="7.9" r="1.3"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    back: '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M18 9l-6 6M12 9l6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/>',
    db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    shoe: '<path d="M2.5 17.5V9.5l3.5-1 2 2.5 3-1.5 3 3.5 5.3 1.4a2 2 0 0 1 1.5 1.9v1.7z"/><path d="M2.5 20.5h19"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    next: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chart: '<path d="M3 20h18"/><path d="M6 16v-5M11 16V6M16 16v-8M21 16v-3" stroke-width="2.4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    up: '<path d="M18 15l-6-6-6 6"/>',
  };
  // The winner's crown in colour (three points with balls, a band with gems), shared by the app (SVG) and the
  // share images (canvas, drawCrown) so both look the same. Coordinates are in a 24×24 box.
  const CROWN = [
    { d: 'M3 9.6L8.2 14 12 5.6 15.8 14 21 9.6V17H3Z', fill: '#f8c515', stroke: '#efa20a', w: 1.2 },
    { d: 'M2.6 15.7Q12 18.4 21.4 15.7V19.7Q12 22.4 2.6 19.7Z', fill: '#f59b0b' },
    ...[[3, 8.1, 1.75], [12, 4.1, 1.95], [21, 8.1, 1.75]].map(([cx, cy, r]) => ({ c: [cx, cy, r], fill: '#ffd51f', stroke: '#efa20a', w: 0.9 })),
    ...[[7.2, 18.7, 1.15], [12, 19.4, 1.35], [16.8, 18.7, 1.15]].map(([cx, cy, r]) => ({ c: [cx, cy, r], fill: '#ffe24d', stroke: '#f6b70c', w: 0.6 })),
  ];
  const crownArt = () => `<svg class="ic crown-art" viewBox="0 0 24 24" aria-hidden="true">${CROWN.map((p) => {
    const paint = `fill="${p.fill}"${p.stroke ? ` stroke="${p.stroke}" stroke-width="${p.w}" stroke-linejoin="round"` : ''}`;
    return p.d ? `<path d="${p.d}" ${paint}/>` : `<circle cx="${p.c[0]}" cy="${p.c[1]}" r="${p.c[2]}" ${paint}/>`;
  }).join('')}</svg>`;
  const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

  /* ───────── Formatting ───────── */
  function dateLong(k) {
    const d = parseYmd(k), w = WD[lang()][d.getDay()];
    return lang() === 'ko'
      ? `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${w})`
      : `${w}, ${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  // "11월 6일 (금)" / "Fri, Nov 6"; the year is added only when it isn't this year.
  function dateMid(k) {
    const d = parseYmd(k), w = WD[lang()][d.getDay()], y = d.getFullYear() !== new Date().getFullYear();
    return lang() === 'ko'
      ? `${y ? `${d.getFullYear()}년 ` : ''}${d.getMonth() + 1}월 ${d.getDate()}일 (${w})`
      : `${w}, ${MON[d.getMonth()]} ${d.getDate()}${y ? `, ${d.getFullYear()}` : ''}`;
  }
  function dateShort(k) {
    const d = parseYmd(k);
    return { main: `${d.getMonth() + 1}.${pad(d.getDate())}`, wd: WD[lang()][d.getDay()] };
  }
  const monthLabel = (y, m) => (lang() === 'ko' ? `${y}년 ${m + 1}월` : `${MON[m]} ${y}`);
  // Currency for the settle tab: chosen there (원화/달러/유로), otherwise won in Korean and dollars in English.
  // Won is whole numbers; dollars and euros allow cents.
  const CURRENCIES = ['KRW', 'USD', 'EUR', 'JPY'];
  const CUR_SYM = { KRW: '₩', USD: '$', EUR: '€', JPY: '¥' };
  const currency = () => (CURRENCIES.includes(db.settings.currency) ? db.settings.currency : lang() === 'ko' ? 'KRW' : 'USD');
  const hasCents = () => currency() !== 'KRW' && currency() !== 'JPY'; // won and yen are whole numbers
  const roundCur = (n, c) => (c === 'KRW' || c === 'JPY' ? Math.round(n) : Math.round(n * 100) / 100);
  // Largest amount an input takes in the current currency: 100,000원 / $100 / €100 / ¥10,000 for fees, 5,000,000원 / $5,000 / ¥500,000 for an extra.
  const moneyMax = (kind) => roundCur(MONEY_MAX[kind] * CUR_RATE[currency()], currency());
  // "12,345" / "12,345.5" — digits grouped by 3; up to 2 decimals for dollars/euros.
  const groupNum = (n) => (hasCents()
    ? (n || 0).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n || 0) ? 0 : 2, maximumFractionDigits: 2 })
    : Math.round(n || 0).toLocaleString('en-US'));
  function fmtMoney(n) {
    const c = currency();
    if (lang() === 'ko' && c === 'KRW') return `${groupNum(n)}원`;
    return `${CUR_SYM[c]}${groupNum(n)}`;
  }
  function moneyInput(k, v, inp = 'fee', id = '') {
    const c = currency();
    const input = `<input type="text" inputmode="${hasCents() ? 'decimal' : 'numeric'}" autocomplete="off" data-inp="${inp}" data-k="${k}"${id ? ` data-id="${esc(id)}"` : ''} value="${esc(v ? groupNum(v) : '')}" placeholder="0">`;
    if (lang() === 'ko' && c === 'KRW') return `<div class="money">${input}<em>원</em></div>`; // yen uses ¥ in Korean too
    return `<div class="money"><em>${CUR_SYM[c]}</em>${input}</div>`;
  }

  /* ───────── Bowling scoring ───────── */
  // Where the next ball goes: frame index, ball within frame, pins standing, and whether it is thrown at a full
  // rack (fresh: X is possible) or at what the previous ball left (/ is possible — even after a first-ball miss).
  function frameState(rolls) {
    let i = 0;
    for (let f = 0; f < 9; f++) {
      if (i >= rolls.length) return { frame: f, ball: 0, standing: 10, fresh: true, done: false };
      if (rolls[i] === 10) { i++; continue; }
      if (i + 1 >= rolls.length) return { frame: f, ball: 1, standing: 10 - rolls[i], fresh: false, done: false };
      i += 2;
    }
    const r = rolls.slice(i), n = r.length;
    if (n === 0) return { frame: 9, ball: 0, standing: 10, fresh: true, done: false };
    if (n === 1) return { frame: 9, ball: 1, standing: r[0] === 10 ? 10 : 10 - r[0], fresh: r[0] === 10, done: false };
    if (n === 2) {
      if (r[0] === 10) return { frame: 9, ball: 2, standing: r[1] === 10 ? 10 : 10 - r[1], fresh: r[1] === 10, done: false };
      if (r[0] + r[1] === 10) return { frame: 9, ball: 2, standing: 10, fresh: true, done: false };
    }
    return { frame: 9, ball: n, standing: 0, fresh: false, done: true };
  }
  // A split can only be marked on a ball thrown at a full rack that knocked down 1–8 pins.
  // (a function declaration: normalize() uses it while the stored data loads, before this line runs)
  function splitOk(rolls, i) { return rolls[i] >= 1 && rolls[i] <= 8 && frameState(rolls.slice(0, i)).fresh; }
  // The ball the split button acts on: the last ball, or the first ball of a frame whose second ball is already in.
  function splitTarget(rolls) {
    const n = rolls.length;
    if (!n) return -1;
    if (splitOk(rolls, n - 1)) return n - 1;
    if (n >= 2 && !frameState(rolls.slice(0, n - 1)).fresh && splitOk(rolls, n - 2)) return n - 2;
    return -1;
  }
  function splitFrames(rolls) {
    const fr = []; let i = 0;
    for (let f = 0; f < 9; f++) {
      if (i >= rolls.length) { fr.push([]); continue; }
      if (rolls[i] === 10) { fr.push([10]); i++; } else { fr.push(rolls.slice(i, i + 2)); i += 2; }
    }
    fr.push(rolls.slice(i, i + 3));
    return fr;
  }
  // Running totals per frame; null once a frame can't be scored yet.
  function cumScores(rolls) {
    const out = []; let i = 0, total = 0, ok = true;
    for (let f = 0; f < 10; f++) {
      const a = rolls[i], b = rolls[i + 1], c = rolls[i + 2];
      let s = null;
      if (ok && a !== undefined) {
        if (f < 9) {
          if (a === 10) { if (b !== undefined && c !== undefined) s = 10 + b + c; i += 1; }
          else if (b !== undefined) { if (a + b === 10) { if (c !== undefined) s = 10 + c; } else s = a + b; i += 2; }
        } else if (a === 10 || (b !== undefined && a + b === 10)) {
          if (b !== undefined && c !== undefined) s = a + b + c;
        } else if (b !== undefined) s = a + b;
      }
      if (s === null) ok = false; else total += s;
      out.push(ok ? total : null);
    }
    return out;
  }
  const mk = (v) => (v === undefined ? '' : v === 0 ? '-' : String(v));
  function frameMarks(fr, f) {
    const [a, b, c] = fr;
    if (f < 9) {
      if (a === 10) return ['', 'X'];
      return [mk(a), b === undefined ? '' : a + b === 10 ? '/' : mk(b)];
    }
    const m = ['', '', ''];
    if (a !== undefined) m[0] = a === 10 ? 'X' : mk(a);
    if (b !== undefined) m[1] = a === 10 ? (b === 10 ? 'X' : mk(b)) : a + b === 10 ? '/' : mk(b);
    if (c !== undefined) m[2] = a === 10 && b !== 10 ? (b + c === 10 ? '/' : mk(c)) : c === 10 ? 'X' : mk(c);
    return m;
  }
  // Score from frame-by-frame rolls (running total so far), or null when no ball has been entered.
  function rollsScore(e) {
    if (!e || !e.rolls || !e.rolls.length) return null;
    let last = 0;
    cumScores(e.rolls).forEach((v) => { if (v !== null) last = v; });
    return last;
  }
  const finalScore = (e) => (!e || e.score === null || e.score === undefined || e.score === '' ? null : Number(e.score));
  // A game's score uses its current input mode first and falls back to the other one, so switching
  // between "final score" and "by frame" never makes an already-entered score disappear from results.
  function entryScore(game, pid) {
    const e = game.entries[pid];
    if (!e) return null;
    return game.mode === 'frame' ? rollsScore(e) ?? finalScore(e) : finalScore(e) ?? rollsScore(e);
  }

  /* ───────── Sessions ───────── */
  const DEFAULT_GAMES = 4;
  const blankSession = (date) => ({ date, teamMode: false, teamCount: 2, players: [], games: Array.from({ length: DEFAULT_GAMES }, () => ({ mode: 'final', entries: {} })), active: 0 });
  const hasRecord = (s) => !!(s && s.players && s.players.length);
  function sess() {
    if (db.sessions[ui.date]) return db.sessions[ui.date];
    if (!ui.draft || ui.draft.date !== ui.date) ui.draft = blankSession(ui.date);
    return ui.draft;
  }
  function commit(s) {
    s.updatedAt = Date.now();
    if (s.players.length) db.sessions[s.date] = s; else delete db.sessions[s.date];
    save();
  }
  const memberById = (id) => db.members.find((m) => m.id === id);
  const pname = (p) => (memberById(p.id) ? memberById(p.id).name : p.name || '?');
  const avatar = (s, p) => (s.teamMode ? `<span class="team-badge t${p.team}">${TEAMS[p.team]}</span>` : '');
  const curGame = (s) => s.games[s.active] || s.games[0];
  // Saved records from past days are read-only until the user taps "Edit" (ui.unlocked holds that date).
  const isPastRecord = (s) => hasRecord(s) && s.date < ymd(new Date());
  const isLocked = (s) => isPastRecord(s) && ui.unlocked !== s.date;
  const EDIT_ACTS = new Set(['togglePlayer', 'quickAdd', 'matchMode', 'teamCount', 'cycleTeam', 'setTeam', 'editTeamName', 'saveTeamName',
    'addGame', 'delGame', 'mode', 'openKp', 'kp', 'practice', 'delRecord']);
  // A team's display name: the custom name set for that day, or "A팀" / "Team A".
  const teamLabel = (s, ti) => (s.teamNames && s.teamNames[ti]) || t('teamName', TEAMS[ti]);
  // Games up to the last one that has any score (at least 1) — empty trailing games are left out of results.
  const gameHasScore = (s, g) => s.players.some((p) => entryScore(g, p.id) !== null);
  function usedGames(s) {
    let n = 0;
    s.games.forEach((g, i) => { if (gameHasScore(s, g)) n = i + 1; });
    return s.games.slice(0, Math.max(1, n));
  }
  const rollsOf = (g, pid) => (g.entries[pid] && g.entries[pid].rolls) || [];
  // "First game is practice": game 1 of that day is shown but left out of totals and averages.
  const isPractice = (s, gi) => !!s.firstPractice && gi === 0;
  // Players on the score-entry screen: everyone (grouped by team), or just the team picked in the filter.
  // Lists are shown in name order (Korean collation in Korean, English otherwise); stored order is untouched.
  const byName = (a, b) => a.localeCompare(b, lang() === 'ko' ? 'ko' : 'en', { numeric: true, sensitivity: 'base' });
  const membersByName = () => db.members.slice().sort((a, b) => byName(a.name, b.name));
  const playersByName = (s) => s.players.slice().sort((a, b) => byName(pname(a), pname(b)));
  const rowsByName = (rows) => rows.slice().sort((a, b) => byName(rowName(a), rowName(b)));
  function entryPlayers(s) {
    if (!s.teamMode) return playersByName(s);
    if (ui.entryTeam === 'all' || ui.entryTeam >= s.teamCount) return playersByName(s).sort((a, b) => a.team - b.team);
    return playersByName(s).filter((p) => p.team === ui.entryTeam);
  }

  function playerStats(s) {
    return s.players.map((p) => {
      const scores = usedGames(s).map((g) => entryScore(g, p.id));
      const played = scores.filter((v, gi) => v !== null && !isPractice(s, gi));
      const scratch = played.reduce((a, b) => a + b, 0);
      const hd = (toInt(p.hdcp)) * played.length;
      return { p, scores, played: played.length, scratch, hdcp: hd, total: scratch + hd, avg: played.length ? Math.round(scratch / played.length) : 0 };
    }).sort((a, b) => b.total - a.total || b.scratch - a.scratch);
  }
  function teamStats(s) {
    const out = [];
    for (let ti = 0; ti < s.teamCount; ti++) {
      const ps = s.players.filter((p) => p.team === ti);
      const games = usedGames(s).map((g) => {
        let sum = null;
        ps.forEach((p) => { const v = entryScore(g, p.id); if (v !== null) sum = (sum || 0) + v + toInt(p.hdcp); });
        return sum;
      });
      out.push({ ti, ps, games, total: games.reduce((a, b, gi) => a + (isPractice(s, gi) ? 0 : b || 0), 0) });
    }
    const max = Math.max(...out.map((x) => x.total));
    const winners = out.filter((x) => x.total === max && max > 0).length;
    out.forEach((x) => { x.win = max > 0 && x.total === max && winners === 1; x.draw = max > 0 && x.total === max && winners > 1; });
    return out;
  }

  function memberStats(id) {
    let n = 0, sum = 0, hi = 0;
    Object.values(db.sessions).forEach((s) => {
      if (!s.players.some((p) => p.id === id)) return;
      s.games.forEach((g, gi) => { const v = entryScore(g, id); if (v !== null && !isPractice(s, gi)) { n++; sum += v; hi = Math.max(hi, v); } });
    });
    return { n, avg: n ? Math.round(sum / n) : 0, hi };
  }

  /* ───────── Render: shell ───────── */
  function renderTabbar() {
    const tabs = [['record', 'pin', 'tabRecord'], ['members', 'users', 'tabMembers'], ['cost', 'receipt', 'tabCost'], ['stats', 'chart', 'tabStats'], ['settings', 'gear', 'tabSettings']];
    $('#tabbar').innerHTML = tabs.map(([id, icon, label]) =>
      `<button class="${ui.tab === id ? 'on' : ''}" data-act="tab" data-tab="${id}" aria-label="${t(label)}">${ic(icon)}<span>${t(label)}</span></button>`).join('');
  }
  function render() {
    document.documentElement.lang = lang();
    const brand = $('.brand span');
    if (brand) { brand.innerHTML = brandHTML(); brand.classList.toggle('ko', lang() === 'ko'); }
    document.title = brandName();
    renderTabbar();
    const v = $('#view');
    const prevTabs = $('.gtabs');
    const tabsScroll = prevTabs ? prevTabs.scrollLeft : 0;
    // A failure while drawing a tab used to leave the previous screen in place with the date tile gone;
    // show what failed instead, so a screenshot tells us the cause (seen once on a Galaxy Tab).
    try {
      renderTopCal();
      v.innerHTML = ui.tab === 'record' ? renderRecord()
        : ui.tab === 'members' ? renderMembers()
        : ui.tab === 'cost' ? renderCost()
        : ui.tab === 'stats' ? renderStats()
        : renderSettings();
      keepGameTabInView(tabsScroll);
      updateScrollBars();
      applyLock();
      renderKeypad();
    } catch (e) {
      v.innerHTML = errorCard(e);
    }
  }
  function errorCard(e) {
    const ua = (navigator.userAgent.match(/(Chrome|SamsungBrowser|Version)\/[\d.]+/g) || []).join(' ');
    return `<div class="card err-card"><b>${t('renderErr')}</b>
      <code>${esc(ui.tab)} · ${esc(e && e.name)}: ${esc(e && e.message)}</code><small>${esc(ua)}</small></div>`;
  }
  // Locked past record: inputs become read-only and editing controls are disabled (actions are also guarded).
  function applyLock() {
    const sec = $('#sess');
    if (!sec || ui.tab !== 'record') return;
    const locked = isLocked(sess());
    sec.classList.toggle('locked', locked);
    if (!locked) return;
    $$('input', sec).forEach((i) => { i.readOnly = true; });
    // aria-disabled, not disabled: a disabled button swallows the tap, and the tap should say "tap Edit" (lockedNudge)
    $$('[data-act]', sec).forEach((b) => { if (EDIT_ACTS.has(b.dataset.act) && 'disabled' in b && !b.disabled) b.setAttribute('aria-disabled', 'true'); });
  }
  // A tap on a locked past record: a short hint, and the Edit button pulses once.
  function lockedNudge() {
    toast(t('lockedTap'));
    const b = $('#sess [data-act="unlock"]');
    if (!b) return;
    b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge');
  }
  // Switching game / filter / input mode re-renders the score card. If a score box had focus, the phone's keyboard
  // closes at that moment and the browser drops the scroll it added to keep the box visible, so the page jumped.
  // Keep the game-tab strip at the same spot on screen instead: measure it (relative to the visible viewport) before,
  // and re-align after the render and again while the keyboard is closing.
  function renderKeepingGameTabs() {
    const vv = window.visualViewport, screenTop = (el) => el.getBoundingClientRect().top - (vv ? vv.offsetTop : 0);
    const strip = $('.gtabs'), top = strip ? screenTop(strip) : null;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    render();
    if (top === null) return;
    const fix = () => { const g = $('.gtabs'); if (g) window.scrollBy(0, screenTop(g) - top); };
    fix();
    if (vv) { vv.addEventListener('resize', fix); setTimeout(() => vv.removeEventListener('resize', fix), 800); }
    setTimeout(fix, 400);
  }
  // Re-rendering resets the game-tab strip's horizontal scroll; restore it and keep the selected game visible.
  function keepGameTabInView(scrollLeft) {
    const strip = $('.gtabs'), on = strip && $('.gtab.on', strip);
    if (!on) return;
    strip.scrollLeft = scrollLeft;
    const l = on.offsetLeft - strip.offsetLeft, r = l + on.offsetWidth;
    if (l < strip.scrollLeft) strip.scrollLeft = l - 8;
    else if (r > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = r - strip.clientWidth + 48;
  }

  /* ───────── Render: record tab ───────── */
  function calendarHTML() {
    if (!ui.calOpen) return '';
    const y = ui.calY, m = ui.calM;
    const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    const today = ymd(new Date());
    let cells = '';
    for (let i = 0; i < first; i++) cells += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const k = `${y}-${pad(m + 1)}-${pad(d)}`;
      const cls = ['cal-d', (first + d - 1) % 7 === 0 && 'sun', k === today && 'today', hasRecord(db.sessions[k]) && 'has', k === ui.date && 'sel'].filter(Boolean).join(' ');
      cells += `<button class="${cls}" data-act="pick" data-date="${esc(k)}"><span>${d}</span></button>`;
    }
    return `<div class="card cal">
      <div class="cal-h">
        <button class="cal-nav" data-act="calToggle" aria-expanded="true" aria-label="close">${ic('up')}</button>
        <b>${monthLabel(y, m)}</b>
        <button class="cal-today" data-act="calToday">${t('today')}</button>
        <button class="cal-nav" data-act="calMove" data-d="-1" aria-label="prev">${ic('left')}</button>
        <button class="cal-nav" data-act="calMove" data-d="1" aria-label="next">${ic('right')}</button>
      </div>
      <div class="cal-w">${WD[lang()].map((w) => `<span>${lang() === 'en' ? w[0] : w}</span>`).join('')}</div>
      <div class="cal-g">${cells}</div>
    </div>`;
  }
  // Desk-calendar tile in the top bar (record and settle tabs): tap opens the month view, arrows step a day.
  function renderTopCal() {
    const box = $('#topcal');
    if (!box) return;
    if (ui.tab !== 'record' && ui.tab !== 'cost') { box.innerHTML = ''; return; }
    const d = parseYmd(ui.date), wd = d.getDay(), en = lang() === 'en';
    const isToday = ui.date === ymd(new Date());
    box.innerHTML = `<button class="tc-nav" data-act="calDay" data-d="-1" aria-label="prev">${ic('left')}</button>
      <button class="tc-tile${ui.calOpen ? ' open' : ''}${isToday ? ' today' : ''}" data-act="calToggle" aria-expanded="${ui.calOpen}" aria-label="${esc(dateLong(ui.date))}">
        <span class="tc-y">${d.getFullYear()}</span>
        <span class="tc-card"><span class="tc-m">${en ? MON[d.getMonth()].toUpperCase() : `${d.getMonth() + 1}월`}</span>
          <b class="tc-d">${d.getDate()}</b><span class="tc-w${wd === 0 ? ' sun' : wd === 6 ? ' sat' : ''}">${en ? WD.en[wd].toUpperCase() : WD.ko[wd]}</span></span>
      </button>
      <button class="tc-nav" data-act="calDay" data-d="1" aria-label="next">${ic('right')}</button>`;
  }
  function recentHTML() {
    const list = Object.values(db.sessions).filter(hasRecord).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    const chips = list.map((s) => {
      const d = dateShort(s.date);
      const n = s.games.filter((g) => gameHasScore(s, g)).length;
      return `<button class="rchip ${s.date === ui.date ? 'on' : ''}" data-act="pick" data-date="${esc(s.date)}" data-scroll="1">
        <b>${d.main} <small>${d.wd}</small></b><small>${n ? t('gamesPeople', n, s.players.length) : t('nPeople', s.players.length)}</small></button>`;
    }).join('');
    return `<div class="sec-label"><span>${t('recent')}</span></div>
      <div class="recent">${chips || `<div class="recent-empty">${t('noRecent')}</div>`}</div>`;
  }
  function playersCard(s) {
    const sel = new Set(s.players.map((p) => p.id));
    const chips = isLocked(s)
      ? playersByName(s).map((p) => `<span class="chip on">${ic('check')}${esc(pname(p))}</span>`).join('')
      : membersByName().map((m) =>
      `<button class="chip ${sel.has(m.id) ? 'on' : ''}" data-act="togglePlayer" data-id="${esc(m.id)}">${sel.has(m.id) ? ic('check') : ''}${esc(m.name)}</button>`).join('');
    let h = `<div class="card">
      <div class="card-h"><h3>${ic('users')}${t('participants')}</h3><span class="muted">${t('nPeople', s.players.length)}</span></div>
      ${chips ? `<div class="chips">${chips}</div>` : `<p class="hint">${t('noMembers')}</p>`}
      <div class="quick">
        <input id="qName" class="field" placeholder="${t('newMemberPh')}" maxlength="20" enterkeyhint="done">
        <input id="qH" class="field num" type="number" min="0" max="100" inputmode="numeric" placeholder="${t('hdcp')}">
        <button class="btn sm gold" data-act="quickAdd">${t('add')}</button>
      </div>`;
    if (s.players.length) {
      h += `<div class="divider"></div>
        <div class="seg">
          <button class="${!s.teamMode ? 'on' : ''}" data-act="matchMode" data-v="0">${ic('pin')}${t('individual')}</button>
          <button class="${s.teamMode ? 'on' : ''}" data-act="matchMode" data-v="1">${ic('users')}${t('teamMatch')}</button>
        </div>`;
      // Same look as the quick-add 핸디 box: plain field, label as placeholder, empty when the handicap is 0
      const hdInput = (p) => `<input class="field num hdf" type="number" inputmode="numeric" placeholder="${t('hdcp')}" aria-label="${t('hdcp')}" min="0" max="100" data-inp="hdcp" data-id="${esc(p.id)}" value="${toInt(p.hdcp) || ''}">`;
      if (s.teamMode) {
        h += `<div class="row between" style="margin-top:12px">
            <span class="label">${t('teamCount')}</span>
            <div class="stepper"><button data-act="teamCount" data-d="-1">−</button><b>${s.teamCount}</b><button data-act="teamCount" data-d="1">+</button></div>
          </div>
          <p class="hint" style="margin-top:6px">${t('teamHint')}</p>`;
        for (let ti = 0; ti < s.teamCount; ti++) {
          const ps = playersByName(s).filter((p) => p.team === ti);
          const moves = (p) => `<div class="tmove">${TEAMS.slice(0, s.teamCount).map((L, j) =>
            `<button class="${j === ti ? `on t${j}` : ''}" data-act="setTeam" data-id="${esc(p.id)}" data-t="${j}" ${j === ti ? 'disabled' : ''}>${L}</button>`).join('')}</div>`;
          h += `<div class="tsec tc${ti}">
            <div class="tsec-h"><span class="team-badge t${ti}">${TEAMS[ti]}</span>${ui.editTeam === ti
              ? `<input id="teamNameIn" class="field tname-in" maxlength="12" value="${esc((s.teamNames && s.teamNames[ti]) || '')}" placeholder="${t('teamName', TEAMS[ti])}" enterkeyhint="done">
                 <button class="icon-btn sm gold-ic" data-act="saveTeamName" data-t="${ti}" aria-label="${t('save')}">${ic('check')}</button>`
              : `<b>${esc(teamLabel(s, ti))}</b><button class="icon-btn sm" data-act="editTeamName" data-t="${ti}" aria-label="${t('editTeamName')}">${ic('edit')}</button>
                 <span class="muted">${t('nPeople', ps.length)}</span>`}</div>
            ${ps.length ? `<div class="plist">${ps.map((p) => `<div class="prow ${s.teamCount > 2 ? 'trow' : ''}">
              <span class="pname">${esc(pname(p))}</span>${hdInput(p)}${moves(p)}</div>`).join('')}</div>`
              : `<div class="tsec-empty">${t('teamEmpty')}</div>`}
          </div>`;
        }
      } else {
        h += `<div class="plist">${playersByName(s).map((p) => `<div class="prow">${avatar(s, p)}
            <span class="pname">${esc(pname(p))}</span>${hdInput(p)}</div>`).join('')}</div>`;
      }
    }
    return h + '</div>';
  }
  function totHTML(sc, hd) {
    if (sc === null) return '<span class="dim">—</span>';
    return hd ? `${sc + hd}<small>${sc} +${hd}</small>` : `${sc}`;
  }
  function finalEntries(s, g) {
    return `<div class="elist">${entryPlayers(s).map((p) => {
      const e = g.entries[p.id];
      const v = e && e.score !== null && e.score !== undefined ? e.score : '';
      return `<div class="erow">${avatar(s, p)}<span class="pname">${esc(pname(p))}</span>
        <input class="score-in" type="number" inputmode="numeric" min="0" max="300" placeholder="0" enterkeyhint="next" data-inp="score" data-id="${esc(p.id)}" value="${esc(v)}">
        <span class="etot" id="et-${esc(p.id)}">${totHTML(entryScore(g, p.id), toInt(p.hdcp))}</span></div>`;
    }).join('')}</div>`;
  }
  function frameEntries(s, g) {
    return `<p class="tap-hint">${t('tapToInput')}</p><div class="elist">${entryPlayers(s).map((p) => {
      const rolls = rollsOf(g, p.id), st = frameState(rolls), cum = cumScores(rolls);
      const active = ui.kp && ui.kp.pid === p.id;
      const splits = (g.entries[p.id] && g.entries[p.id].splits) || [];
      let start = 0; // index in rolls of each frame's first ball
      const cells = splitFrames(rolls).map((f, i) => {
        const cur = active && !st.done && st.frame === i, at = start;
        start += f.length;
        // mark j sits on ball at+j, except a frame 1–9 strike, whose X is drawn in the second box (never a split)
        const marks = frameMarks(f, i).map((x, j) => `<span${splits.includes(at + j) && !(i < 9 && f[0] === 10) ? ' class="split"' : ''}>${x}</span>`);
        return `<div class="fr ${i === 9 ? 'f10' : ''} ${cur ? 'cur' : ''}"><div class="fr-n">${i + 1}</div>
          <div class="fr-r">${marks.join('')}</div>
          <div class="fr-s">${cum[i] ?? ''}</div></div>`;
      }).join('');
      const sc = entryScore(g, p.id), hd = toInt(p.hdcp);
      return `<div class="fblock ${active ? 'active' : ''}" data-act="openKp" data-id="${esc(p.id)}">
        <div class="fhead">${avatar(s, p)}<span class="pname">${esc(pname(p))}</span>
          <span class="ftot">${sc === null ? '—' : sc}${sc !== null && hd ? `<small>+${hd}</small>` : ''}</span></div>
        <div class="frames">${cells}</div></div>`;
    }).join('')}</div>`;
  }
  function gameCard(s) {
    const g = curGame(s);
    // Number-only tabs after a "게임" label, so more games fit on one line.
    const tabs = s.games.map((x, i) => `<button class="gtab ${i === s.active ? 'on' : ''}" data-act="game" data-i="${i}" aria-label="${t('gameN', i + 1)}">${i + 1}${isPractice(s, i) ? `<small class="prac-tag">${t('practice')}</small>` : ''}</button>`).join('');
    const filter = s.teamMode ? `<div class="seg entry-filter">
        <button class="${ui.entryTeam === 'all' ? 'on' : ''}" data-act="entryTeam" data-v="all">${t('allPlayers')}</button>
        ${TEAMS.slice(0, s.teamCount).map((L, j) => `<button class="${ui.entryTeam === j ? 'on' : ''}" data-act="entryTeam" data-v="${j}"><span class="tdot t${j}"></span><span class="fl">${s.teamNames && s.teamNames[j] ? esc(s.teamNames[j]) : t('teamShort', L)}</span></button>`).join('')}
      </div>` : '';
    return `<div class="card">
      <div class="entry-top">
        <p class="entry-hint">${ic('info')}${t('entryHint')}</p>
        <button class="mini-toggle ${s.firstPractice ? 'on' : ''}" data-act="practice" aria-pressed="${!!s.firstPractice}">${ic('check')}${t('firstPractice')}</button>
      </div>
      <div class="gtabs-row"><span class="gtabs-lbl">${t('gameLbl')}</span>
        <div class="gtabs">${tabs}<button class="gtab add" data-act="addGame" aria-label="add game">+</button></div></div>
      <div class="mode-switch">
        <button class="mode ${g.mode === 'final' ? 'on' : ''}" data-act="mode" data-v="final">${ic('edit')}<span>${t('finalMode')}</span></button>
        <button class="mode ${g.mode === 'frame' ? 'on' : ''}" data-act="mode" data-v="frame">${ic('frames')}<span>${t('frameMode')}</span></button>
      </div>
      ${filter}
      ${g.mode === 'frame' ? frameEntries(s, g) : finalEntries(s, g)}
      ${s.games.length > 1 ? `<button class="link danger" data-act="delGame">${t('deleteGame', s.active + 1)}</button>` : ''}
    </div>`;
  }
  function summaryInner(s) {
    const st = playerStats(s);
    const gh = usedGames(s).map((_, i) => (isPractice(s, i) ? `<th class="prac">${t('practice')}</th>` : `<th>G${i + 1}</th>`)).join('');
    // Which input mode the results come from: one mode for every game, or a mix.
    const modes = new Set(usedGames(s).map((g) => g.mode));
    const modeTag = modes.size > 1 ? t('modeMixed') : modes.has('frame') ? t('frameMode') : t('finalMode');
    const vert = !!db.settings.resultsVert;
    let h = `<div class="card-h"><h3>${ic('crown')}${t('results')}<span class="mode-tag">${modeTag}</span></h3>
        <button class="btn sm ghost vert-btn" data-act="sumVert" aria-pressed="${vert}">${ic(vert ? 'right' : 'down')}${t(vert ? 'horizView' : 'vertView')}</button></div>`;
    if (vert) h += resultsVertical(s, st);
    else h += `<div class="tbl-wrap"><table class="tbl pin2"><thead><tr><th></th><th class="nm">${t('name')}</th>${gh}<th>${t('hdcp')}</th><th>${t('total')}</th><th>${t('avg')}</th></tr></thead><tbody>
      ${st.map((x, i) => `<tr>
        <td class="rkn ${x.played && i === 0 ? 'top' : ''}">${i + 1}</td>
        <td class="nm"><span class="nm-in">${s.teamMode ? `<span class="tl tl${x.p.team}">${TEAMS[x.p.team]}</span>&nbsp;` : ''}${esc(pname(x.p))}</span></td>
        ${x.scores.map((v, gi) => `<td class="${v === null || isPractice(s, gi) ? 'dim' : ''} ${isPractice(s, gi) ? 'prac' : ''}">${v === null ? '-' : v}</td>`).join('')}
        <td class="dim">${x.hdcp ? '+' + x.hdcp : 0}</td><td class="tot">${x.total}</td><td>${x.avg}</td></tr>`).join('')}
      </tbody></table></div>`;
    if (s.teamMode) {
      h += `<div class="teams">${teamStats(s).map((x) => `<div class="team-card ${x.win ? 'win' : ''}">
          <span class="team-badge t${x.ti}">${TEAMS[x.ti]}</span>
          <div class="tm"><b>${esc(teamLabel(s, x.ti))}${x.win ? crownArt() : ''}</b>
            <small>${x.ps.map((p) => esc(pname(p))).join(', ') || '—'}</small></div>
          <div class="tt">${x.total}<small>${x.win ? t('win') : x.draw ? t('draw') : ''}</small></div>
          <div class="tg">${x.games.map((v, i) => `<span class="${isPractice(s, i) ? 'prac' : ''}">${isPractice(s, i) ? t('practice') : `G${i + 1}`} <b>${v ?? '-'}</b></span>`).join('')}</div></div>`).join('')}</div>`;
    }
    return h;
  }
  // Results turned on their side: one column per bowler (in rank order), one row per game, then handicap,
  // total and average. Easier to read with few bowlers and many games.
  function resultsVertical(s, st) {
    const games = usedGames(s);
    const head = st.map((x, i) => `<th class="vh"><span class="vr ${x.played && i === 0 ? 'top' : ''}">${i + 1}</span>
      <span class="nm-in">${s.teamMode ? `<span class="tl tl${x.p.team}">${TEAMS[x.p.team]}</span> ` : ''}${esc(pname(x.p))}</span></th>`).join('');
    const rows = games.map((_, gi) => `<tr class="${isPractice(s, gi) ? 'prac' : ''}"><th class="rl">${isPractice(s, gi) ? t('practice') : `G${gi + 1}`}</th>
      ${st.map((x) => { const v = x.scores[gi]; return `<td class="${v === null || isPractice(s, gi) ? 'dim' : ''}">${v === null ? '-' : v}</td>`; }).join('')}</tr>`).join('');
    return `<div class="tbl-wrap"><table class="tbl vtbl"><thead><tr><th class="rl"></th>${head}</tr></thead><tbody>${rows}
      <tr class="vsum vfirst"><th class="rl">${t('hdcp')}</th>${st.map((x) => `<td class="dim">${x.hdcp ? '+' + x.hdcp : 0}</td>`).join('')}</tr>
      <tr class="vsum"><th class="rl">${t('total')}</th>${st.map((x) => `<td class="tot">${x.total}</td>`).join('')}</tr>
      <tr><th class="rl">${t('avg')}</th>${st.map((x) => `<td>${x.avg}</td>`).join('')}</tr></tbody></table></div>`;
  }
  function renderRecord() {
    const s = sess();
    let h = calendarHTML() + recentHTML();
    h += `<section id="sess">
      <div class="sess-h"><div><div class="eyebrow">${t('selectedDate')}</div><h2 class="display">${dateLong(s.date)}</h2></div>
        <div class="sess-btns">${s.date !== ymd(new Date()) ? `<button class="btn sm ghost today-btn" data-act="goToday">${t('today')}</button>` : ''}${isLocked(s)
          ? `<button class="btn sm ghost" data-act="unlock">${ic('edit')}${t('editRecord')}</button>`
          : `${isPastRecord(s) ? `<button class="btn sm gold" data-act="lock">${ic('check')}${t('done')}</button>` : ''}
             ${hasRecord(s) ? `<button class="icon-btn danger" data-act="delRecord" aria-label="${t('deleteRecord')}">${ic('trash')}</button>` : ''}`}</div></div>
      ${isLocked(s) ? `<p class="lock-note">${ic('shield')}${t('lockedHint')}</p>` : ''}
      ${playersCard(s)}`;
    if (s.players.length) {
      h += gameCard(s);
      h += `<div class="card" id="summary">${summaryInner(s)}</div>
        <div class="autosave">${ic('shield')}${t('autosave')}</div>
        <div class="actions">
          <button class="btn ghost" data-act="recImg" data-mode="save">${ic('download')}${t('saveImage')}</button>
          <button class="btn gold" data-act="recImg" data-mode="share">${ic('share')}${t('share')}</button>
        </div>
        <button class="btn block cert-btn" data-act="certOpen">${crownArt()}${t('certBtn')}</button>`;
    } else {
      h += `<div class="empty">${esc(t('pickHint')).replace('\n', '<br>')}</div>`;
    }
    return h + '</section>';
  }
  // Phones hide scrollbars, so tables wider than the screen get their own always-visible bar underneath.
  function updateScrollBars() {
    $$('.tbl-wrap').forEach((w) => {
      let bar = w.nextElementSibling;
      if (!bar || !bar.classList.contains('hbar')) {
        bar = document.createElement('div');
        bar.className = 'hbar';
        bar.innerHTML = '<i></i>';
        w.after(bar);
      }
      syncScrollBar(w);
    });
  }
  function syncScrollBar(w) {
    const bar = w.nextElementSibling;
    if (!bar || !bar.classList.contains('hbar')) return;
    const over = w.scrollWidth - w.clientWidth > 2;
    bar.hidden = !over;
    w.classList.toggle('scrollable', over);
    if (!over) return;
    const thumb = bar.firstElementChild, ratio = w.clientWidth / w.scrollWidth;
    thumb.style.width = `${ratio * 100}%`;
    thumb.style.left = `${(w.scrollLeft / w.scrollWidth) * 100}%`;
  }
  function refreshRecordNumbers() {
    const s = sess(), g = curGame(s);
    s.players.forEach((p) => { const el = $(`#et-${p.id}`); if (el) el.innerHTML = totHTML(entryScore(g, p.id), toInt(p.hdcp)); });
    const sum = $('#summary');
    if (sum) { sum.innerHTML = summaryInner(s); updateScrollBars(); }
  }

  /* ───────── Frame keypad ───────── */
  function renderKeypad() {
    const el = $('#keypad');
    const s = sess(), g = curGame(s);
    const p = ui.kp && s.players.find((x) => x.id === ui.kp.pid);
    if (ui.tab !== 'record' || !p || g.mode !== 'frame') {
      ui.kp = null; el.hidden = true; document.body.classList.remove('kp-open');
      return;
    }
    const rolls = rollsOf(g, p.id), st = frameState(rolls);
    const sc = entryScore(g, p.id);
    const num = (n) => `<button data-act="kp" data-v="${n}" ${!st.done && n < st.standing ? '' : 'disabled'}>${n}</button>`;
    const sp = splitTarget(rolls), spOn = sp >= 0 && ((g.entries[p.id] && g.entries[p.id].splits) || []).includes(sp);
    el.innerHTML = `<div class="kp-h">${avatar(s, p)}
        <div><div class="pn">${esc(pname(p))}</div><div class="info">${st.done ? t('gameDone') : t('frameRoll', st.frame + 1, st.ball + 1)}</div></div>
        <button class="kp-split ${spOn ? 'on' : ''}" data-act="kp" data-v="split" aria-pressed="${spOn}" ${sp >= 0 ? '' : 'disabled'}>${t('splitBtn')}</button>
        <div class="sc">${sc ?? 0}</div></div>
      <div class="kp-g">
        ${num(1)}${num(2)}${num(3)}<button class="sp" data-act="kp" data-v="X" ${!st.done && st.fresh ? '' : 'disabled'}>X</button>
        ${num(4)}${num(5)}${num(6)}<button class="sp" data-act="kp" data-v="/" ${!st.done && !st.fresh ? '' : 'disabled'}>/</button>
        ${num(7)}${num(8)}${num(9)}<button class="sp" data-act="kp" data-v="0" ${st.done ? 'disabled' : ''}>-</button>
        <button class="act" data-act="kp" data-v="back" ${rolls.length ? '' : 'disabled'} aria-label="undo">${ic('back')}</button>
        <button class="act" data-act="kp" data-v="next">${t('next')}</button>
        <button class="go" data-act="kp" data-v="close">${ic('check')}${t('done')}</button>
      </div>`;
    el.hidden = false;
    document.body.classList.add('kp-open');
    if (ui.kpScroll) {
      ui.kpScroll = false;
      const blk = $('.fblock.active');
      if (blk) {
        const r = blk.getBoundingClientRect(), kpTop = window.innerHeight - el.offsetHeight;
        if (r.top < 70 || r.bottom > kpTop - 10) window.scrollBy({ top: r.bottom - kpTop + 16 + Math.max(0, 70 - r.top - (r.bottom - kpTop + 16)), behavior: 'smooth' });
      }
    }
  }
  function moveToNextPlayer(s, g) {
    const ids = entryPlayers(s).map((p) => p.id);
    const i = ids.indexOf(ui.kp.pid);
    for (let k = 1; k <= ids.length; k++) {
      const id = ids[(i + k) % ids.length];
      if (!frameState(rollsOf(g, id)).done) { ui.kp = { pid: id }; ui.kpScroll = true; return; }
    }
    ui.kp = null;
    toast(t('allDone'));
  }
  function keypadPress(v) {
    const s = sess(), g = curGame(s);
    if (!ui.kp) return;
    if (v === 'close') { ui.kp = null; render(); return; }
    if (v === 'next') { moveToNextPlayer(s, g); render(); return; }
    const e = g.entries[ui.kp.pid] || (g.entries[ui.kp.pid] = { score: null, rolls: [] });
    e.rolls = e.rolls || [];
    if (v === 'back') {
      e.rolls.pop();
      if (e.splits) { e.splits = e.splits.filter((i) => i < e.rolls.length); if (!e.splits.length) delete e.splits; }
      commit(s); render(); return;
    }
    if (v === 'split') { // toggle the split mark on the frame's first ball
      const i = splitTarget(e.rolls);
      if (i < 0) return;
      const set = new Set(e.splits || []);
      if (set.has(i)) set.delete(i); else set.add(i);
      if (set.size) e.splits = [...set].sort((a, b) => a - b); else delete e.splits;
      commit(s); render(); return;
    }
    const st = frameState(e.rolls);
    if (st.done) return;
    let pins;
    if (v === 'X') { if (!st.fresh) return; pins = 10; }
    else if (v === '/') { if (st.fresh) return; pins = st.standing; }
    else { pins = toInt(v); if (pins >= st.standing) return; }
    e.rolls.push(pins);
    commit(s);
    // stay on this bowler frame after frame; move on only when their game is complete ("다음" moves any time)
    if (frameState(e.rolls).done) moveToNextPlayer(s, g);
    render();
  }

  /* ───────── Render: members tab ───────── */
  function renderMembers() {
    const list = membersByName().map((m) => {
      if (ui.editId === m.id) {
        return `<div class="mcard editing">
          <div class="medit"><input id="eName" class="field" value="${esc(m.name)}" maxlength="20" aria-label="${t('memberName')}">
            <label class="hd hd-edit"><input id="eH" class="field num sm" type="number" min="0" max="100" inputmode="numeric" aria-label="${t('hdcp')}" value="${toInt(m.handicap)}"></label></div>
          <div class="mbtns"><button class="icon-btn" data-act="saveMember" data-id="${esc(m.id)}" aria-label="${t('save')}" style="color:var(--gold)">${ic('check')}</button>
          <button class="icon-btn" data-act="cancelEdit" aria-label="${t('cancel')}">${ic('x')}</button></div></div>`;
      }
      const st = memberStats(m.id);
      return `<div class="mcard">
        <div class="minfo"><b><span>${esc(m.name)}</span><em class="tag">${t('hdcp')} ${toInt(m.handicap)}</em></b>
          <div class="mstats">${st.n ? t('statLine', st.n, st.avg, st.hi) : t('noGames')}</div></div>
        <div class="mbtns"><button class="icon-btn" data-act="editMember" data-id="${esc(m.id)}" aria-label="edit">${ic('edit')}</button>
        <button class="icon-btn danger" data-act="delMember" data-id="${esc(m.id)}" aria-label="${t('delete')}">${ic('trash')}</button></div></div>`;
    }).join('');
    return `<div class="page-h"><div><div class="eyebrow">Members</div><h2 class="display">${t('membersTitle')}</h2></div><span class="muted">${t('memberCount', db.members.length)}</span></div>
      <div class="card">
        <div class="card-h"><h3>${ic('userPlus')}${t('addMember')}</h3></div>
        <div class="add-grid">
          <div><label class="field-l" for="mName">${t('memberName')}</label><input id="mName" class="field" maxlength="20" placeholder="${t('newMemberPh')}" enterkeyhint="done"></div>
          <div><label class="field-l" for="mH">${t('defaultHdcp')}</label><input id="mH" class="field num" type="number" min="0" max="100" inputmode="numeric" placeholder="0"></div>
        </div>
        <button class="btn gold block" data-act="addMember">${ic('plus')}${t('addMember')}</button>
      </div>
      ${db.members.length ? `<div class="mlist">${list}</div>` : `<div class="empty">${esc(t('noMembersYet')).replace('\n', '<br>')}</div>`}`;
  }
  function addMember(name, hd) {
    name = (name || '').trim();
    if (!name) { toast(t('nameRequired')); return null; }
    if (db.members.some((m) => m.name === name)) { toast(t('dupName')); return null; }
    const m = { id: uid(), name, handicap: toHdcp(hd) };
    db.members.push(m);
    save();
    toast(t('added', name));
    return m;
  }

  /* ───────── Render: cost tab ───────── */
  function rowsFromSession(s) {
    return playersByName(s).map((p) => {
      const played = s.games.filter((g) => entryScore(g, p.id) !== null).length;
      return { id: p.id, name: pname(p), on: true, games: played || 1, shoes: true };
    });
  }
  function costDoc() {
    if (db.costs[ui.date]) return db.costs[ui.date];
    if (!ui.cdraft || ui.cdraft.date !== ui.date) {
      const s = db.sessions[ui.date];
      ui.cdraft = { date: ui.date, gameFee: db.feeDefaults.gameFee, shoeFee: db.feeDefaults.shoeFee, rows: hasRecord(s) ? rowsFromSession(s) : [] };
    }
    return ui.cdraft;
  }
  const commitCost = (c) => { db.costs[c.date] = c; save(); };
  const baseAmount = (r, c) => (r.on ? r.games * c.gameFee + (r.shoes ? c.shoeFee : 0) : 0);
  // Extra costs (drinks, snacks…): 'split' divides the amount among the chosen people (everyone included
  // when none are chosen); 'one' charges it all to the single chosen person. Won shares are whole numbers.
  function extraPayers(x, c) {
    const onIds = c.rows.filter((r) => r.on).map((r) => r.id);
    const who = (x.who || []).filter((id) => onIds.includes(id));
    if (x.mode === 'one') return who.slice(0, 1);
    return who.length ? who : onIds;
  }
  // Exact split: the amount is divided in the smallest unit (1 won or 1 cent) and any remainder goes to
  // the first payers, so the shares always add up to the item's amount.
  function splitShare(amount, payers, id) {
    const i = payers.indexOf(id);
    if (i < 0 || !amount) return 0;
    const unit = hasCents() ? 0.01 : 1, units = Math.round(amount / unit), base = Math.floor(units / payers.length);
    return Math.round((base + (i < units - base * payers.length ? 1 : 0)) * unit * 100) / 100;
  }
  function extraShare(r, c) {
    if (!r.on) return 0;
    return (c.extras || []).reduce((sum, x) => sum + splitShare(x.amount, extraPayers(x, c), r.id), 0);
  }
  const rowAmount = (r, c) => (r.on ? Math.round((baseAmount(r, c) + extraShare(r, c)) * 100) / 100 : 0);
  const extrasTotal = (c) => (c.extras || []).reduce((a, x) => a + (extraPayers(x, c).length ? x.amount || 0 : 0), 0);
  const rowName = (r) => (memberById(r.id) ? memberById(r.id).name : r.name);
  function costTotals(c) {
    const on = c.rows.filter((r) => r.on);
    return { people: on.length, games: on.reduce((a, r) => a + r.games, 0), total: Math.round(on.reduce((a, r) => a + rowAmount(r, c), 0) * 100) / 100 };
  }
  // Team view of the cost sheet: rows grouped by the team each person played on that day.
  function costTeams(c) {
    const s = db.sessions[c.date];
    if (!hasRecord(s) || !s.teamMode) return null;
    const teamOf = (id) => { const p = s.players.find((x) => x.id === id); return p ? p.team : -1; };
    const groups = [];
    for (let ti = -1; ti < s.teamCount; ti++) {
      const rows = rowsByName(c.rows).filter((r) => r.on && teamOf(r.id) === ti);
      if (ti === -1 && !rows.length) continue;
      groups.push({ ti, rows, games: rows.reduce((a, r) => a + r.games, 0), total: Math.round(rows.reduce((a, r) => a + rowAmount(r, c), 0) * 100) / 100 });
    }
    return groups.sort((a, b) => (a.ti === -1) - (b.ti === -1));
  }
  const costTeamLabel = (c, ti) => (ti === -1 ? t('noTeam') : teamLabel(db.sessions[c.date], ti));
  function costTeamsHTML(c, groups) {
    return `<div class="tcosts">${groups.map((g) => `<div class="tsec ${g.ti >= 0 ? 'tc' + g.ti : 'tcx'}">
        <div class="tsec-h">${g.ti >= 0 ? `<span class="team-badge t${g.ti}">${TEAMS[g.ti]}</span>` : ''}<b>${esc(costTeamLabel(c, g.ti))}</b>
          <span class="amt">${fmtMoney(g.total)}</span></div>
        <div class="tcost-meta">${t('nPeople', g.rows.length)} · ${g.games}${t('gUnit')}</div>
        ${g.rows.length ? `<div class="tcost-list">${g.rows.map((r) => `<div class="tcost-row"><span class="pname">${esc(rowName(r))}</span>
          <small>${r.games}G${r.shoes ? ' · ' + t('shoes') : ''}</small><b>${fmtMoney(rowAmount(r, c))}</b></div>`).join('')}</div>`
          : `<div class="tsec-empty">${t('teamEmpty')}</div>`}
      </div>`).join('')}</div>`;
  }
  function extraHint(x, c) {
    const payers = extraPayers(x, c);
    if (!payers.length) return x.mode === 'one' ? t('extraPickOne') : t('extraNoOne');
    if (x.mode === 'one') return t('extraOneHint', rowName(c.rows.find((r) => r.id === payers[0])), fmtMoney(x.amount || 0));
    return t('extraSplitHint', payers.length, fmtMoney(splitShare(x.amount || 0, payers, payers[payers.length - 1])));
  }
  function extrasCardHTML(c) {
    const ppl = rowsByName(c.rows).filter((r) => r.on);
    const items = (c.extras || []).map((x) => {
      const payers = extraPayers(x, c);
      return `<div class="xitem">
        <div class="xitem-top">
          <input class="field xlabel" type="text" maxlength="20" placeholder="${t('extraLabelPh')}" data-inp="extraLabel" data-id="${esc(x.id)}" value="${esc(x.label)}">
          <div class="fee xamt">${moneyInput('amount', x.amount, 'extraAmt', x.id)}</div>
          <button class="x-btn" data-act="extraDel" data-id="${esc(x.id)}" aria-label="${t('delete')}">${ic('x')}</button>
        </div>
        <div class="seg xmode">
          <button class="${x.mode !== 'one' ? 'on' : ''}" data-act="extraMode" data-id="${esc(x.id)}" data-v="split">${ic('users')}${t('extraSplit')}</button>
          <button class="${x.mode === 'one' ? 'on' : ''}" data-act="extraMode" data-id="${esc(x.id)}" data-v="one">${ic('userPlus')}${t('extraOne')}</button>
        </div>
        ${ppl.length ? `<div class="chips xwho">${ppl.map((r) => `<button class="chip ${payers.includes(r.id) ? 'on' : ''}" data-act="extraWho" data-id="${esc(x.id)}" data-p="${esc(r.id)}">${payers.includes(r.id) ? ic('check') : ''}${esc(rowName(r))}</button>`).join('')}</div>` : ''}
        <p class="hint xhint" id="xh-${esc(x.id)}">${esc(extraHint(x, c))}</p>
      </div>`;
    }).join('');
    return `<div class="card">
      <div class="card-h"><h3>${ic('receipt')}${t('extraCosts')}</h3><button class="btn sm ghost" data-act="extraAdd">${ic('plus')}${t('extraAdd')}</button></div>
      ${items || `<p class="hint">${t('extraEmpty')}</p>`}
    </div>`;
  }
  function costTotalsHTML(c) {
    const x = costTotals(c);
    return `<div class="eyebrow">${t('grandTotal')}</div>
      <div class="hero-total">${fmtMoney(x.total)}</div>
      <div class="hero-grid"><div><small>${t('people')}</small><b>${x.people}</b></div><div><small>${t('totalGames')}</small><b>${x.games}</b></div>
        ${extrasTotal(c) ? `<div class="hero-wide"><small>${t('extraCosts')}</small><b>${fmtMoney(extrasTotal(c))}</b></div>` : ''}</div>`;
  }
  function renderCost() {
    const c = costDoc();
    const inRows = new Set(c.rows.map((r) => r.id));
    const rows = rowsByName(c.rows).map((r) => `<div class="crow ${r.on ? '' : 'off'}">
        <div class="crow-top">
          <button class="check ${r.on ? 'on' : ''}" data-act="costToggle" data-id="${esc(r.id)}" aria-label="include">${ic('check')}</button>
          <span class="pname">${esc(rowName(r))}<small class="xshare" id="xs-${esc(r.id)}">${extraShare(r, c) ? `${t('extraShort')} +${fmtMoney(extraShare(r, c))}` : ''}</small></span>
          <span class="amt" id="amt-${esc(r.id)}">${fmtMoney(rowAmount(r, c))}</span>
        </div>
        <div class="crow-bot">
          <div class="stepper"><button data-act="costGames" data-id="${esc(r.id)}" data-d="-1">−</button><b>${r.games}</b><small>G</small><button data-act="costGames" data-id="${esc(r.id)}" data-d="1">+</button></div>
          <button class="pill ${r.shoes ? 'on' : ''}" data-act="costShoe" data-id="${esc(r.id)}">${ic('shoe')}${t('shoesIncl')}</button>
          <button class="x-btn" data-act="costRemove" data-id="${esc(r.id)}" aria-label="${t('delete')}">${ic('x')}</button>
        </div></div>`).join('');
    const others = membersByName().filter((m) => !inRows.has(m.id));
    const groups = costTeams(c), teamView = !!groups && ui.costView === 'team';
    return `<div class="page-h"><div><div class="eyebrow">Settlement</div><h2 class="display">${t('costTitle')}<span class="h-date">${esc(dateMid(c.date))}</span></h2></div></div>
      ${calendarHTML()}
      <div class="card">
        <div class="cur-row"><span class="label">${t('currency')}</span>
          <div class="seg cur-seg">${CURRENCIES.map((cc) => `<button class="${currency() === cc ? 'on' : ''}" data-act="currency" data-v="${cc}">${t('cur' + cc)}</button>`).join('')}</div></div>
        <div class="fee-grid">
          <label class="fee"><span>${t('gameFee')} <small>· ${t('perGame')}</small></span>${moneyInput('gameFee', c.gameFee)}</label>
          <label class="fee"><span>${t('shoeFee')} <small>· ${t('perPerson')}</small></span>${moneyInput('shoeFee', c.shoeFee)}</label>
        </div>
      </div>
      <div class="card">
        <div class="card-h"><h3>${ic('users')}${teamView ? t('teamSettle') : t('perPersonTitle')}</h3><button class="btn sm ghost" data-act="costLoad">${ic('download')}${t('loadFromRecord')}</button></div>
        ${groups ? `<div class="seg" style="margin-bottom:12px">
          <button class="${teamView ? '' : 'on'}" data-act="costView" data-v="person">${ic('users')}${t('byPerson')}</button>
          <button class="${teamView ? 'on' : ''}" data-act="costView" data-v="team">${ic('crown')}${t('byTeam')}</button></div>` : ''}
        ${teamView ? costTeamsHTML(c, groups) : rows ? `<div class="clist">${rows}</div>` : `<p class="hint">${t('costEmpty')}</p>`}
        ${others.length && !teamView ? `<div class="divider"></div><div class="field-l">${t('addPerson')}</div>
          <div class="chips">${others.map((m) => `<button class="chip dashed" data-act="costAdd" data-id="${esc(m.id)}">${ic('plus')}${esc(m.name)}</button>`).join('')}</div>` : ''}
      </div>
      ${extrasCardHTML(c)}
      <div class="card hero" id="costTotals">${costTotalsHTML(c)}</div>
      <div class="actions">
        <button class="btn ghost" data-act="costImg" data-mode="save">${ic('download')}${t('saveImage')}</button>
        <button class="btn gold" data-act="costImg" data-mode="share">${ic('share')}${t('share')}</button>
      </div>`;
  }
  function refreshCostNumbers() {
    const c = costDoc();
    c.rows.forEach((r) => {
      const el = $(`#amt-${r.id}`); if (el) el.textContent = fmtMoney(rowAmount(r, c));
      const xs = $(`#xs-${r.id}`); if (xs) xs.textContent = extraShare(r, c) ? `${t('extraShort')} +${fmtMoney(extraShare(r, c))}` : '';
    });
    (c.extras || []).forEach((x) => { const h = $(`#xh-${x.id}`); if (h) h.textContent = extraHint(x, c); });
    $('#costTotals').innerHTML = costTotalsHTML(c);
    const tc = $('.tcosts'), groups = tc && costTeams(c);
    if (groups) tc.outerHTML = costTeamsHTML(c, groups);
  }

  /* ───────── Render: stats tab ───────── */
  // Every scored game a member played, oldest first.
  // Start date (inclusive) of the selected stats period; '' means all time.
  function periodFrom() {
    const d = new Date();
    if (ui.statPeriod === 'month') return ymd(new Date(d.getFullYear(), d.getMonth(), 1));
    if (ui.statPeriod === '3m') return ymd(new Date(d.getFullYear(), d.getMonth() - 3, d.getDate() + 1));
    if (ui.statPeriod === 'year') return `${d.getFullYear()}-01-01`;
    return '';
  }
  // "2026.10.01 ~ 2026.10.30" for the selected period (all time starts at the first record).
  function periodRange() {
    const dot = (k) => k.replace(/-/g, '.');
    const first = Object.values(db.sessions).filter(hasRecord).map((x) => x.date).sort()[0];
    const from = periodFrom() || first;
    return from ? `${dot(from)} ~ ${dot(ymd(new Date()))}` : t('noStats');
  }
  // A member's scored games in the stats period, oldest first. Practice games are left out unless
  // `withPractice` is set (only the game-order card uses them, flagged with `prac`).
  function memberGames(id, withPractice) {
    const out = [], from = periodFrom();
    Object.values(db.sessions).sort((a, b) => a.date.localeCompare(b.date)).forEach((s) => {
      const p = s.players.find((x) => x.id === id);
      if (!p || s.date < from) return;
      usedGames(s).forEach((g, gi) => {
        const v = entryScore(g, id);
        const prac = isPractice(s, gi);
        if (v !== null && (withPractice || !prac)) out.push({ date: s.date, gi, score: v, hdcp: toInt(p.hdcp), prac });
      });
    });
    return out;
  }
  function bySession(games) {
    const map = new Map();
    games.forEach((g) => {
      const x = map.get(g.date) || { date: g.date, games: 0, sum: 0, hdcp: 0, high: 0 };
      x.games++; x.sum += g.score; x.hdcp += g.hdcp; x.high = Math.max(x.high, g.score);
      map.set(g.date, x);
    });
    return [...map.values()].map((x) => ({ ...x, final: x.sum + x.hdcp, avg: Math.round(x.sum / x.games) }));
  }
  const avgOf = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

  // Single-series bar chart (baseline 0, thin rounded bars, max value labelled, tap/hover for value).
  // Single-series line chart: SVG path stretched to the plot box, dots/labels as HTML so they stay round.
  // Y axis is fitted to the data in 50-point steps; tap/hover a point (wide hit area) to see its value.
  function lineChart(points, title) {
    if (!points.length) return '';
    const vals = points.map((p) => p.value);
    const max = Math.max(...vals), min = Math.min(...vals);
    let lo = Math.max(0, Math.floor((min - 10) / 50) * 50), hi = Math.min(300, Math.ceil((max + 10) / 50) * 50);
    if (hi - lo < 100) { hi = Math.min(300, lo + 100); lo = Math.max(0, hi - 100); }
    const n = points.length;
    const x = (i) => ((i + 0.5) / n) * 100;
    const y = (v) => ((v - lo) / (hi - lo)) * 100;
    const grid = [];
    for (let v = lo; v <= hi; v += 50) grid.push(v);
    const every = Math.ceil(n / 6);
    const maxIdx = vals.lastIndexOf(max);
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / n);
    return `<div class="chart line" role="img" aria-label="${esc(title)}">
      <div class="chart-top"><div class="chart-tip">${esc(points[n - 1].tip)}</div><span class="chart-avg-key"><i></i>${t('avg')} ${avg}</span></div>
      <div class="chart-plot">
        ${grid.map((v) => `<div class="chart-grid" style="bottom:${y(v)}%"><span>${v}</span></div>`).join('')}
        <div class="chart-avg" style="bottom:${y(avg)}%"></div>
        <svg class="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="${points.map((p, i) => `${x(i)},${100 - y(p.value)}`).join(' ')}" vector-effect="non-scaling-stroke"/>
        </svg>
        ${points.map((p, i) => `<button class="chart-pt ${i === n - 1 ? 'on' : ''}" style="left:${x(i)}%;width:${100 / n}%" data-tip="${esc(p.tip)}" aria-label="${esc(p.tip)}">
          <i style="bottom:${y(p.value)}%"></i>${i === maxIdx ? `<em style="bottom:${y(p.value)}%">${p.value}</em>` : ''}</button>`).join('')}
      </div>
      <div class="chart-x">${points.map((p, i) => `<span>${(n - 1 - i) % every === 0 ? esc(p.label) : ''}</span>`).join('')}</div>
    </div>`;
  }
  function barChart(points, title) {
    if (!points.length) return '';
    const max = Math.max(...points.map((p) => p.value));
    const top = Math.max(100, Math.ceil((max * 1.12) / 50) * 50);
    const grid = [100, 200, 300].filter((v) => v < top);
    const every = Math.ceil(points.length / 6);
    const maxIdx = points.findIndex((p) => p.value === max);
    return `<div class="chart" role="img" aria-label="${esc(title)}">
      <div class="chart-tip">${esc(points[points.length - 1].tip)}</div>
      <div class="chart-plot">
        ${grid.map((v) => `<div class="chart-grid" style="bottom:${(v / top) * 100}%"><span>${v}</span></div>`).join('')}
        <div class="chart-bars">${points.map((p, i) => `<button class="chart-bar" data-tip="${esc(p.tip)}" aria-label="${esc(p.tip)}">
          ${i === maxIdx ? `<em style="bottom:${(p.value / top) * 100}%">${p.value}</em>` : ''}
          <i style="height:${Math.max(1.5, (p.value / top) * 100)}%"></i></button>`).join('')}</div>
      </div>
      <div class="chart-x">${points.map((p, i) => `<span>${(points.length - 1 - i) % every === 0 ? esc(p.label) : ''}</span>`).join('')}</div>
    </div>`;
  }
  function renderStats() {
    const withGames = membersByName().map((m) => ({ m, games: memberGames(m.id) }));
    if (!ui.statId || !memberById(ui.statId)) {
      const best = withGames.slice().sort((a, b) => b.games.length - a.games.length)[0];
      ui.statId = best ? best.m.id : null;
    }
    let h = `<div class="page-h"><div><div class="eyebrow">Statistics</div><h2 class="display">${t('statsTitle')}</h2></div>
        <button class="btn sm ghost xlsx-btn" data-act="exportXlsx">${ic('download')}${t('exportXlsx')}</button></div>
      <div class="seg period">${[['all', 'periodAll'], ['month', 'periodMonth'], ['3m', 'period3m'], ['year', 'periodYear']].map(([v, k]) =>
        `<button class="${ui.statPeriod === v ? 'on' : ''}" data-act="statPeriod" data-v="${v}">${t(k)}</button>`).join('')}</div>
      <p class="period-note">${ic('calendar')}${periodRange()}</p>`;
    if (!ui.statId) return h + `<div class="empty">${esc(t('noMembersYet')).replace('\n', '<br>')}</div>`;
    h += `<div class="chips stat-pick">${withGames.map(({ m, games }) =>
      `<button class="chip ${m.id === ui.statId ? 'on' : ''}" data-act="statPick" data-id="${esc(m.id)}">${esc(m.name)}<small>${games.length}</small></button>`).join('')}</div>`;

    const m = memberById(ui.statId), games = memberGames(m.id), scores = games.map((g) => g.score);
    if (!games.length) return h + `<div class="empty">${ui.statPeriod === 'all' ? t('noStats') : t('noStatsPeriod')}</div>` + leaderboard(withGames);
    const sessions = bySession(games);
    const sd = (k) => dateShort(k).main;
    h += `<div class="card hero">
        <div class="row between"><div class="hero-name">${esc(m.name)}</div><span class="tag">${t('hdcp')} ${toInt(m.handicap)}</span></div>
        <div class="hero-avg"><span>${t('avg')}</span><div class="hero-total">${avgOf(scores)}</div></div>
        <div class="hero-grid four">
          <div><small>${t('games')}</small><b>${games.length}</b></div>
          <div><small>${t('high')}</small><b>${Math.max(...scores)}</b></div>
          <div><small>${t('low')}</small><b>${Math.min(...scores)}</b></div>
          <div><small>${t('over200')}</small><b>${scores.filter((v) => v >= 200).length}</b></div>
        </div>
        <p class="hero-note">${t('hdcpAvg')} <b>${avgOf(games.map((g) => g.score + g.hdcp))}</b> · ${t('sessionsN', sessions.length)}</p>
      </div>
      <div class="seg" style="margin-bottom:14px">
        <button class="${ui.statView !== 'final' ? 'on' : ''}" data-act="statView" data-v="game">${ic('frames')}${t('byGame')}</button>
        <button class="${ui.statView === 'final' ? 'on' : ''}" data-act="statView" data-v="final">${ic('calendar')}${t('byFinal')}</button>
      </div>`;

    if (ui.statView !== 'final') {
      const recent = games.slice(-20);
      // Game-order averages include practice games (the 1st game on practice days), unlike the other stats.
      const order = [], pracN = [];
      memberGames(m.id, true).forEach((g) => { (order[g.gi] = order[g.gi] || []).push(g.score); if (g.prac) pracN[g.gi] = (pracN[g.gi] || 0) + 1; });
      const bestAvg = Math.max(...order.filter(Boolean).map(avgOf));
      h += `<div class="card"><div class="card-h"><h3>${ic('chart')}${t('trendGames')}</h3><span class="muted">${t('lastN', recent.length)}</span></div>
          ${lineChart(recent.map((g) => ({ value: g.score, label: sd(g.date), tip: `${sd(g.date)} · ${t('gameN', g.gi + 1)} · ${g.score}` })), t('trendGames'))}</div>
        <div class="card"><div class="card-h"><h3>${ic('frames')}${t('gameOrder')}</h3></div>
          <div class="order-list">${order.map((arr, i) => (arr ? `<div class="order-row">
            <span class="order-n">${t('gameN', i + 1)}</span>
            <div class="order-bar"><i style="width:${(avgOf(arr) / 300) * 100}%"></i></div>
            <span class="order-v ${avgOf(arr) === bestAvg ? 'best' : ''}">${avgOf(arr)}</span>
            <small>${t('highShort', Math.max(...arr))} · ${arr.length}${t('gUnit')}${pracN[i] ? ` · ${t('pracIncl', pracN[i])}` : ''}</small></div>` : '')).join('')}</div></div>
        <div class="card"><div class="card-h"><h3>${ic('pin')}${t('allGames')}</h3><span class="muted">${games.length}</span></div>
          <div class="tbl-wrap ${games.length > 10 ? 'tbl-scroll' : ''}"><table class="tbl"><thead><tr><th class="nm">${t('date')}</th><th>${t('game')}</th><th>${t('score')}</th><th>${t('hdcp')}</th><th>${t('total')}</th></tr></thead><tbody>
          ${games.slice().reverse().map((g) => `<tr><td class="nm">${sd(g.date)} <small class="muted">${dateShort(g.date).wd}</small></td><td>G${g.gi + 1}</td>
            <td class="${g.score >= 200 ? 'tot' : ''}">${g.score}</td><td class="dim">${g.hdcp ? '+' + g.hdcp : 0}</td><td><b>${g.score + g.hdcp}</b></td></tr>`).join('')}
          </tbody></table></div></div>`;
    } else {
      const recent = sessions.slice(-12);
      h += `<div class="card"><div class="card-h"><h3>${ic('chart')}${t('trendFinal')}</h3><span class="muted">${t('lastN', recent.length)}</span></div>
          ${barChart(recent.map((x) => ({ value: x.avg, label: sd(x.date), tip: `${sd(x.date)} · ${t('avg')} ${x.avg} · ${t('total')} ${x.final}` })), t('trendFinal'))}</div>
        <div class="card"><div class="card-h"><h3>${ic('crown')}${t('finalTable')}</h3><span class="muted">${t('sessionsN', sessions.length)}</span></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th class="nm">${t('date')}</th><th>${t('games')}</th><th>${t('scratch')}</th><th>${t('hdcp')}</th><th>${t('total')}</th><th>${t('avg')}</th></tr></thead><tbody>
          ${sessions.slice().reverse().map((x) => `<tr class="link-row" data-act="pick" data-date="${esc(x.date)}" data-goto="record"><td class="nm">${sd(x.date)} <small class="muted">${dateShort(x.date).wd}</small></td><td>${x.games}</td><td>${x.sum}</td>
            <td class="dim">${x.hdcp ? '+' + x.hdcp : 0}</td><td class="tot">${x.final}</td><td>${x.avg}</td></tr>`).join('')}
          </tbody></table></div><p class="hint" style="margin-top:8px">${t('tapRowHint')}</p></div>`;
    }
    return h + leaderboard(withGames);
  }
  function leaderboard(withGames) {
    const rows = withGames.filter((x) => x.games.length).map(({ m, games }) => {
      const sc = games.map((g) => g.score);
      return { m, n: sc.length, avg: avgOf(sc), high: Math.max(...sc) };
    }).sort((a, b) => b.avg - a.avg || b.high - a.high);
    if (!rows.length) return '';
    return `<div class="card"><div class="card-h"><h3>${ic('users')}${t('leaderboard')}</h3><span class="muted">${t('byAvg')}</span></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th class="nm">${t('name')}</th><th>${t('games')}</th><th>${t('avg')}</th><th>${t('high')}</th></tr></thead><tbody>
      ${rows.map((x, i) => `<tr class="link-row ${x.m.id === ui.statId ? 'sel' : ''}" data-act="statPick" data-id="${esc(x.m.id)}"><td><span class="rk ${i < 3 ? 'rk' + (i + 1) : ''}">${i + 1}</span></td>
        <td class="nm">${esc(x.m.name)}</td><td>${x.n}</td><td class="tot">${x.avg}</td><td>${x.high}</td></tr>`).join('')}
      </tbody></table></div></div>`;
  }

  /* ───────── Render: settings tab ───────── */
  function renderSettings() {
    const L = lang(), th = db.settings.theme;
    return `<div class="page-h"><div><div class="eyebrow">Settings</div><h2 class="display">${t('settingsTitle')}</h2></div></div>
      <div class="card">
        <div class="set-row"><span class="set-ic">${ic('globe')}</span><div><b>${t('language')}</b><small>${t('languageSub')}</small></div></div>
        <div class="seg">
          <button class="${L === 'ko' ? 'on' : ''}" data-act="lang" data-v="ko">한국어</button>
          <button class="${L === 'en' ? 'on' : ''}" data-act="lang" data-v="en">English</button>
        </div>
      </div>
      <div class="card">
        <div class="set-row"><span class="set-ic">${ic(th === 'dark' ? 'moon' : th === 'light' ? 'sun' : 'auto')}</span><div><b>${t('theme')}</b><small>${t('themeSub')}</small></div></div>
        <div class="seg">
          <button class="${th === 'light' ? 'on' : ''}" data-act="theme" data-v="light">${ic('sun')}${t('light')}</button>
          <button class="${th === 'dark' ? 'on' : ''}" data-act="theme" data-v="dark">${ic('moon')}${t('dark')}</button>
          <button class="${th === 'system' ? 'on' : ''}" data-act="theme" data-v="system">${ic('auto')}${t('system')}</button>
        </div>
      </div>
      <div class="card">
        <div class="set-row"><span class="set-ic">${ic('db')}</span><div><b>${t('data')}</b></div></div>
        <p class="hint">${t('dataNote')}</p>
        <div class="data-btns">
          <button class="btn ghost" data-act="export">${ic('download')}${t('saveBackup')}</button>
          <button class="btn ghost" data-act="import">${ic('upload')}${t('importData')}</button>
          <button class="btn outline-red" data-act="reset">${ic('trash')}${t('resetData')}</button>
        </div>
      </div>
      <div class="card">
        <div class="set-row"><span class="set-ic">${ic('info')}</span><div><b>${t('appInfo')}</b><small>${t('appInfoSub')}</small></div></div>
        <div class="link-list">${[['bowling', 'pin'], ['guide', 'book'], ['privacy', 'shield'], ['terms', 'fileText'], ['oss', 'code']].map(([k, i]) =>
          `<button class="link-item" data-act="doc" data-k="${k}">${ic(i)}<span>${docOf(k).title}</span>${ic('right')}</button>`).join('')}</div>
      </div>
      <div class="about"><img src="icons/icon.svg" alt=""><h2 class="${lang() === 'ko' ? 'ko' : ''}">${brandHTML()}</h2><p>VERSION ${APP_VERSION}</p></div>`;
  }

  /* ───────── Documents (guide, policies) ───────── */
  const APP_VERSION = '1.0.6'; // the Play Store app version (keep in step with appVersionName in tools/make-twa.mjs)
  const docOf = (k) => (window.BB_DOCS[lang()] || window.BB_DOCS.ko)[k];
  function showDoc(k) {
    const d = docOf(k), m = $('#modal');
    m.className = 'modal doc-modal';
    m.innerHTML = `<div class="doc" role="dialog" aria-label="${esc(d.title)}">
        <div class="doc-h"><h2>${esc(d.title)}</h2><button class="icon-btn" data-r="1" aria-label="${t('close')}">${ic('x')}</button></div>
        <div class="doc-body">${d.html}</div></div>`;
    m.hidden = false;
    m.onclick = (e) => {
      if (!e.target.closest('[data-r]') && e.target !== m) return;
      m.hidden = true; m.onclick = null; m.className = 'modal';
    };
  }

  /* ───────── Theme ───────── */
  function applyTheme() {
    const th = db.settings.theme, root = document.documentElement;
    if (th === 'system') root.removeAttribute('data-theme'); else root.dataset.theme = th;
  }

  /* ───────── Toast & dialogs ───────── */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  function ask(msg, okLabel = t('ok'), danger = false) {
    return new Promise((resolve) => {
      const m = $('#modal');
      m.innerHTML = `<div class="dialog" role="dialog"><p>${esc(msg)}</p><div class="btns">
        <button class="btn ghost" data-r="0">${t('cancel')}</button><button class="btn ${danger ? 'red' : 'gold'}" data-r="1">${esc(okLabel)}</button></div></div>`;
      m.hidden = false;
      m.onclick = (e) => {
        const b = e.target.closest('[data-r]');
        if (!b && e.target !== m) return;
        m.hidden = true; m.onclick = null;
        resolve(!!(b && b.dataset.r === '1'));
      };
    });
  }
  function showPreview(url) {
    const m = $('#modal');
    m.innerHTML = `<div class="dialog preview"><img src="${url}" alt=""><p>${t('longPress')}</p><button class="btn gold block" data-r="1">${t('close')}</button></div>`;
    m.hidden = false;
    m.onclick = (e) => { if (e.target.closest('[data-r]') || e.target === m) { m.hidden = true; m.onclick = null; } };
  }

  /* ───────── Image export (drawn on canvas, works offline) ───────── */
  const IMG_SANS = '"Pretendard","Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic","Segoe UI",Roboto,sans-serif';
  const IMG_SERIF = '"Playfair Display",Georgia,"Times New Roman",serif';
  const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  function rr(x, X, Y, w, h, r) {
    x.beginPath(); x.moveTo(X + r, Y);
    x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r);
    x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
  }
  function fit(x, s, w) {
    s = String(s);
    if (x.measureText(s).width <= w) return s;
    while (s.length > 1 && x.measureText(s + '…').width > w) s = s.slice(0, -1);
    return s + '…';
  }
  function cellText(x, v, X, w, cy, al) {
    x.textBaseline = 'middle';
    const s = fit(x, v, w - 24);
    if (al === 'l') { x.textAlign = 'left'; x.fillText(s, X + 14, cy); }
    else if (al === 'r') { x.textAlign = 'right'; x.fillText(s, X + w - 14, cy); }
    else { x.textAlign = 'center'; x.fillText(s, X + w / 2, cy); }
    x.textAlign = 'left'; x.textBaseline = 'alphabetic';
  }
  const PADX = 64, RH = 66, HH = 58;
  const COL_UNIT = 92; // minimum px per column weight, so 3-digit scores never get cut off
  let W = 1080;        // widened per image when a table has many columns
  function drawCrown(x, X, cy) {
    // CROWN spans x 0.85–23.15, y 2.15–22.2 of its 24 box; draw it 30px wide starting at X, centred on cy.
    const k = 30 / 22.3;
    x.save();
    x.translate(X - 0.85 * k, cy - 12.2 * k);
    x.scale(k, k);
    x.lineJoin = 'round';
    CROWN.forEach((p) => {
      const path = new Path2D();
      if (p.d) path.addPath(new Path2D(p.d)); else path.arc(p.c[0], p.c[1], p.c[2], 0, Math.PI * 2);
      x.fillStyle = p.fill; x.fill(path);
      if (p.stroke) { x.strokeStyle = p.stroke; x.lineWidth = p.w; x.stroke(path); }
    });
    x.restore();
  }
  function drawTable(x, b, y) {
    const tw = W - 2 * PADX;
    if (b.title) { x.fillStyle = '#e9cf95'; x.font = `700 32px ${IMG_SANS}`; x.fillText(b.title, PADX + 4, y + 38); y += 66; }
    const sw = b.cols.reduce((a, c) => a + c.w, 0);
    const xs = []; let cx = PADX;
    b.cols.forEach((c) => { xs.push(cx); cx += (c.w / sw) * tw; });
    const cw = (i) => (b.cols[i].w / sw) * tw;
    x.fillStyle = 'rgba(214,180,110,.14)'; rr(x, PADX, y, tw, HH, 16); x.fill();
    x.fillStyle = '#d6b46e'; x.font = `700 23px ${IMG_SANS}`;
    b.cols.forEach((c, i) => cellText(x, c.t, xs[i], cw(i), y + HH / 2, c.al));
    y += HH;
    b.rows.forEach((r, ri) => {
      if (r.em) { x.fillStyle = 'rgba(214,180,110,.13)'; rr(x, PADX, y + 4, tw, RH - 8, 14); x.fill(); }
      else if (ri % 2) { x.fillStyle = 'rgba(255,255,255,.035)'; rr(x, PADX, y + 4, tw, RH - 8, 14); x.fill(); }
      const cy = y + RH / 2;
      r.cells.forEach((v, i) => {
        const c = b.cols[i];
        if (c.rank) {
          const med = { 1: ['#f3dca6', '#b88f45'], 2: ['#f1f1f3', '#9a9ca3'], 3: ['#ebbd94', '#9a5f34'] }[r.medal ? v : 0];
          const mx = xs[i] + cw(i) / 2;
          x.beginPath(); x.arc(mx, cy, 20, 0, Math.PI * 2);
          if (med) { const gg = x.createLinearGradient(mx - 20, cy - 20, mx + 20, cy + 20); gg.addColorStop(0, med[0]); gg.addColorStop(1, med[1]); x.fillStyle = gg; }
          else x.fillStyle = 'rgba(255,255,255,.08)';
          x.fill();
          x.fillStyle = med ? '#1a1408' : '#cfc9bd'; x.font = `800 21px ${IMG_SANS}`;
          cellText(x, v, xs[i], cw(i), cy, 'c');
          return;
        }
        x.fillStyle = c.gold || r.em ? '#e9cf95' : c.dim ? '#9d978b' : '#ece8df';
        x.font = `${c.gold ? 800 : c.bold ? 700 : 500} 28px ${IMG_SANS}`;
        if (i === 0 && r.crown && c.al === 'l') {
          // Winner: name first, then a small drawn crown right after it (emoji/symbol glyphs render unevenly).
          const s = fit(x, v, cw(i) - 24 - 40);
          cellText(x, s, xs[i], cw(i) - 40, cy, 'l');
          drawCrown(x, xs[i] + 14 + x.measureText(s).width + 10, cy);
          return;
        }
        cellText(x, v, xs[i], cw(i), cy, c.al);
      });
      y += RH;
    });
    return y + 36;
  }
  function drawKV(x, b, y, gold) {
    const n = b.items.length, gap = 16, tw = W - 2 * PADX, bw = (tw - gap * (n - 1)) / n, h = 132;
    b.items.forEach(([k, v], i) => {
      const X = PADX + i * (bw + gap);
      x.fillStyle = 'rgba(255,255,255,.045)'; rr(x, X, y, bw, h, 20); x.fill();
      x.strokeStyle = 'rgba(214,180,110,.3)'; x.lineWidth = 1.5; x.stroke();
      x.fillStyle = '#9d978b'; x.font = `600 24px ${IMG_SANS}`; x.fillText(fit(x, k, bw - 44), X + 22, y + 46);
      const last = b.big && i === n - 1;
      x.fillStyle = last ? gold : '#f1ead9'; x.font = `800 ${last ? 44 : 40}px ${IMG_SANS}`; x.fillText(fit(x, v, bw - 44), X + 22, y + 102);
    });
    return y + h + 36;
  }
  async function buildImage(subtitle, blocks) {
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    W = Math.max(1080, ...blocks.filter((b) => b.type === 'table')
      .map((b) => Math.ceil(2 * PADX + b.cols.reduce((a, c) => a + c.w, 0) * COL_UNIT)));
    const bh = (b) => (b.type === 'table' ? (b.title ? 66 : 0) + HH + b.rows.length * RH + 36 : 168);
    const H = Math.round(250 + blocks.reduce((a, b) => a + bh(b), 0) + 70);
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#171b28'); bg.addColorStop(1, '#0a0b10');
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const glow = x.createRadialGradient(W * 0.88, 0, 0, W * 0.88, 0, 720);
    glow.addColorStop(0, 'rgba(214,180,110,.22)'); glow.addColorStop(1, 'rgba(214,180,110,0)');
    x.fillStyle = glow; x.fillRect(0, 0, W, H);
    const gold = x.createLinearGradient(0, 0, W, 0);
    gold.addColorStop(0, '#f3dca6'); gold.addColorStop(0.5, '#d6b46e'); gold.addColorStop(1, '#a8823f');
    x.strokeStyle = 'rgba(214,180,110,.45)'; x.lineWidth = 2; rr(x, 22, 22, W - 44, H - 44, 34); x.stroke();
    try {
      const im = await loadImg('icons/icon-192.png');
      x.save(); rr(x, PADX, PADX, 104, 104, 26); x.clip(); x.drawImage(im, PADX, PADX, 104, 104); x.restore();
    } catch (e) { /* icon optional */ }
    x.fillStyle = gold; x.font = lang() === 'ko' ? `800 58px ${IMG_SANS}` : `italic 600 60px ${IMG_SERIF}`; x.fillText(brandName(), PADX + 134, PADX + 62);
    x.fillStyle = '#b5afa3'; x.font = `500 30px ${IMG_SANS}`; x.fillText(subtitle, PADX + 136, PADX + 104);
    let y = PADX + 150;
    x.fillStyle = gold; x.fillRect(PADX, y, W - 2 * PADX, 2);
    y += 32;
    for (const b of blocks) y = b.type === 'table' ? drawTable(x, b, y) : drawKV(x, b, y, gold);
    x.fillStyle = '#6f6a60'; x.font = `600 20px ${IMG_SANS}`; x.textAlign = 'center';
    x.fillText('B E S T   B O W L I N G', W / 2, H - 50);
    x.textAlign = 'left';
    return c;
  }
  // Team name for share images: "A · 스트라이크킹즈" when renamed, otherwise the default "A팀".
  const teamImgLabel = (s, ti) => (s.teamNames && s.teamNames[ti] ? `${TEAMS[ti]} · ${s.teamNames[ti]}` : teamLabel(s, ti));
  // Image columns per game; a practice game is labelled and greyed out.
  const gameCols = (s) => usedGames(s).map((_, i) => (isPractice(s, i) ? { t: t('practice'), w: 1.4, al: 'c', dim: true } : { t: `G${i + 1}`, w: 1, al: 'c' }));
  function recordBlocks(s) {
    const st = playerStats(s);
    const cols = [{ t: '#', w: 0.8, al: 'c', rank: true }, { t: t('name'), w: 2.6, al: 'l', bold: true }]
      .concat(gameCols(s))
      .concat([{ t: t('hdcp'), w: 1, al: 'c', dim: true }, { t: t('total'), w: 1.3, al: 'c', gold: true }, { t: t('avg'), w: 1.1, al: 'c' }]);
    const blocks = [{
      type: 'table', title: t('results'), cols,
      rows: st.map((x, i) => ({
        medal: x.played > 0 && i < 3,
        cells: [i + 1, (s.teamMode ? `${TEAMS[x.p.team]} · ` : '') + pname(x.p), ...x.scores.map((v) => (v === null ? '-' : v)), x.hdcp ? `+${x.hdcp}` : '0', x.total, x.avg],
      })),
    }];
    if (s.teamMode) {
      const ts = teamStats(s).sort((a, b) => b.total - a.total);
      blocks.push({
        type: 'table', title: t('teamResults'),
        cols: [{ t: t('team'), w: 2.6, al: 'l', bold: true }].concat(gameCols(s)).concat([{ t: t('total'), w: 1.4, al: 'c', gold: true }]),
        rows: ts.map((x) => ({ em: x.win, crown: x.win, cells: [`${teamImgLabel(s, x.ti)} (${x.ps.length})`, ...x.games.map((v) => v ?? '-'), x.total] })),
      });
    }
    return blocks;
  }
  function costBlocks(c) {
    const on = rowsByName(c.rows).filter((r) => r.on), x = costTotals(c);
    const groups = costTeams(c);
    // With extras, the settle tables get a 기타 column so each share is visible next to the total
    const hasX = on.some((r) => extraShare(r, c));
    const xCol = hasX ? [{ t: t('extraShort'), w: 1.5, al: 'r' }] : [];
    const xCell = (v) => (hasX ? [v ? '+' + fmtMoney(v) : '–'] : []);
    if (groups && ui.costView === 'team') {
      const teamName = (id) => { const g = groups.find((gg) => gg.rows.some((r) => r.id === id)); return g && g.ti >= 0 ? `${TEAMS[g.ti]} · ` : ''; };
      return [
        { type: 'kv', items: [[`${t('gameFee')} · ${t('perGame')}`, fmtMoney(c.gameFee)], [`${t('shoeFee')} · ${t('perPerson')}`, fmtMoney(c.shoeFee)]] },
        {
          type: 'table', title: t('teamSettle'),
          cols: [{ t: t('team'), w: 2.2, al: 'l', bold: true }, { t: t('people'), w: 1, al: 'c' }, { t: t('games'), w: 1, al: 'c' }, ...xCol, { t: t('amount'), w: 1.8, al: 'r', gold: true }],
          rows: groups.map((g) => ({ cells: [g.ti === -1 ? t('noTeam') : teamImgLabel(db.sessions[c.date], g.ti), g.rows.length, g.games,
            ...xCell(Math.round(g.rows.reduce((a, r) => a + extraShare(r, c), 0) * 100) / 100), fmtMoney(g.total)] })),
        },
        {
          type: 'table', title: t('perPersonTitle'),
          cols: [{ t: t('name'), w: 2.6, al: 'l', bold: true }, { t: t('games'), w: 1, al: 'c' }, { t: t('shoes'), w: 1, al: 'c' }, ...xCol, { t: t('amount'), w: 1.8, al: 'r', gold: true }],
          rows: groups.flatMap((g) => g.rows).map((r) => ({ cells: [teamName(r.id) + rowName(r), r.games, r.shoes ? '✓' : '–', ...xCell(extraShare(r, c)), fmtMoney(rowAmount(r, c))] })),
        },
        ...extraBlocks(c),
        { type: 'kv', big: true, items: [[t('people'), String(x.people)], [t('totalGames'), String(x.games)], [t('grandTotal'), fmtMoney(x.total)]] },
      ];
    }
    return [
      { type: 'kv', items: [[`${t('gameFee')} · ${t('perGame')}`, fmtMoney(c.gameFee)], [`${t('shoeFee')} · ${t('perPerson')}`, fmtMoney(c.shoeFee)]] },
      {
        type: 'table', title: t('perPersonTitle'),
        cols: [{ t: t('name'), w: 2.6, al: 'l', bold: true }, { t: t('games'), w: 1, al: 'c' }, { t: t('shoes'), w: 1, al: 'c' }, ...xCol, { t: t('amount'), w: 1.8, al: 'r', gold: true }],
        rows: on.map((r) => ({ cells: [rowName(r), r.games, r.shoes ? '✓' : '–', ...xCell(extraShare(r, c)), fmtMoney(rowAmount(r, c))] })),
      },
      ...extraBlocks(c),
      { type: 'kv', big: true, items: [[t('people'), String(x.people)], [t('totalGames'), String(x.games)], [t('grandTotal'), fmtMoney(x.total)]] },
    ];
  }
  function extraBlocks(c) {
    const xs = (c.extras || []).filter((x) => x.amount && extraPayers(x, c).length);
    if (!xs.length) return [];
    return [{
      type: 'table', title: t('extraCosts'),
      cols: [{ t: t('extraItem'), w: 2.2, al: 'l', bold: true }, { t: t('extraWhoCol'), w: 2.4, al: 'l' }, { t: t('amount'), w: 1.8, al: 'r', gold: true }],
      rows: xs.map((x) => {
        const payers = extraPayers(x, c);
        const who = x.mode === 'one' ? rowName(c.rows.find((r) => r.id === payers[0])) : t('extraSplitN', payers.length);
        return { cells: [x.label || t('extraCosts'), who, fmtMoney(x.amount)] };
      }),
    }];
  }
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  async function exportImage(canvas, name, mode) {
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
    const file = new File([blob], name, { type: 'image/png' });
    if (mode === 'share' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: brandName() }); }
      catch (e) { if (e.name !== 'AbortError') toast(e.message || 'Share failed'); }
      return;
    }
    if (isIOS()) { showPreview(URL.createObjectURL(blob)); return; }
    downloadBlob(blob, name);
    toast(mode === 'share' ? t('shareFallback') : t('savedImg'));
  }
  async function withBusy(fn) {
    if (ui.busy) return;
    ui.busy = true;
    try { await fn(); } finally { ui.busy = false; }
  }

  /* ───────── Certificates (record tab: perfect game / high score / champion) ───────── */
  // A modal of its own: pick a type, fill in the fields (prefilled from the day's scores), add up to two
  // photos from the gallery or the camera, and save the certificate as an image. Nothing here is stored:
  // photos stay in memory only, and the modal is self-contained (its own click/input handlers, data-c).
  const CERT_TYPES = ['perfect', 'high', 'win'];
  // Background themes: spotlight gradient (centre → edge), the medal's centre, and the ribbon colours.
  const CERT_THEMES = {
    navy: { bg: ['#24426a', '#132640', '#060a12'], core: ['#2c4d7d', '#0b182b'], rib: ['#5e0d1c', '#b4253c', '#6b1022'] },
    black: { bg: ['#3d362c', '#17140f', '#050403'], core: ['#3e3628', '#0d0b08'], rib: ['#5e0d1c', '#b4253c', '#6b1022'] },
    wine: { bg: ['#74213a', '#3f0f1e', '#14040a'], core: ['#7d2540', '#2a0710'], rib: ['#0f2a4a', '#2a5c96', '#0f2a4a'] },
    emerald: { bg: ['#226650', '#0f3a2d', '#03120d'], core: ['#287259', '#082219'], rib: ['#5e0d1c', '#b4253c', '#6b1022'] },
  };
  let certTheme = 'navy';
  const certTh = () => CERT_THEMES[cert && cert.theme] || CERT_THEMES.navy;
  const CERT_MAX_SCORE = 9999;
  let cert = null;
  let certPlace = '', certEvent = ''; // the alley / event typed last, offered again while the app stays open
  const certTypeName = (k) => t({ perfect: 'certPerfect', high: 'certHigh', win: 'certWin' }[k]);
  const star = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="#f8c515" stroke="#efa20a" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const certTypeIcon = (k) => (k === 'win' ? crownArt() : k === 'high' ? star : '<span class="cert-300">300</span>');
  function certDefaults(type) {
    const s = sess(), st = playerStats(s);
    const best = (p) => Math.max(0, ...usedGames(s).map((g, gi) => (isPractice(s, gi) ? null : entryScore(g, p.id))).filter((v) => v !== null));
    let pick = st[0] ? st[0].p : null;
    if (type !== 'win' && st.length) {
      const byBest = st.map((x) => ({ p: x.p, b: best(x.p) })).sort((a, b) => b.b - a.b);
      pick = (type === 'perfect' && byBest.find((x) => x.b === 300) || byBest[0]).p;
    }
    return { pid: pick ? pick.id : null, ...certFor(type, pick) };
  }
  // Name, score and teammates for one bowler of today's record.
  function certFor(type, p) {
    const s = sess(), st = playerStats(s);
    if (!p) return { name: '', score: type === 'perfect' ? 300 : '', mates: '' };
    const row = st.find((x) => x.p.id === p.id);
    const games = usedGames(s).map((g, gi) => (isPractice(s, gi) ? null : entryScore(g, p.id))).filter((v) => v !== null);
    const score = type === 'perfect' ? 300 : type === 'high' ? (games.length ? Math.max(...games) : '') : (row ? row.total : '');
    const mates = playersByName(s).filter((q) => q.id !== p.id).map(pname).join(', ');
    return { name: pname(p), score, mates };
  }
  function openCert() {
    cert = { type: null, date: ui.date, pid: null, name: '', score: '', mates: '', place: certPlace, event: certEvent, theme: certTheme, photos: [null, null] };
    const m = $('#modal');
    m.className = 'modal doc-modal';
    m.hidden = false;
    m.onclick = certClick;
    m.oninput = certInput;
    m.onchange = certChange;
    renderCert();
  }
  function closeCert() {
    const m = $('#modal');
    if (cert) cert.photos.forEach((ph) => ph && URL.revokeObjectURL(ph.url));
    cert = null;
    m.hidden = true; m.onclick = m.oninput = m.onchange = null; m.className = 'modal'; m.innerHTML = '';
  }
  function renderCert() {
    const m = $('#modal');
    const head = (title, back) => `<div class="doc-h">${back ? `<button class="icon-btn" data-c="back" aria-label="${t('certBack')}">${ic('left')}</button>` : ''}
      <h2>${esc(title)}</h2><button class="icon-btn" data-c="close" aria-label="${t('close')}">${ic('x')}</button></div>`;
    if (!cert.type) {
      m.innerHTML = `<div class="doc cert" role="dialog" aria-label="${t('certBtn')}">${head(t('certBtn'))}
        <div class="doc-body"><p class="cert-q">${t('certPick')}</p>
          <div class="cert-types">${CERT_TYPES.map((k) => `<button class="cert-type" data-c="type" data-k="${k}">
            <span class="cert-ic">${certTypeIcon(k)}</span><span><b>${certTypeName(k)}</b><small>${t('certSub_' + k)}</small></span>${ic('right')}</button>`).join('')}</div>
        </div></div>`;
      return;
    }
    const s = sess();
    const chips = playersByName(s).map((p) => `<button class="chip ${cert.pid === p.id ? 'on' : ''}" data-c="who" data-id="${esc(p.id)}">${esc(pname(p))}</button>`).join('');
    const slot = (i) => {
      const ph = cert.photos[i];
      return `<div class="cert-slot">${ph
        ? `<img src="${ph.url}" alt=""><button class="icon-btn sm cert-rm" data-c="rm" data-i="${i}" aria-label="${t('certRemove')}">${ic('x')}</button>`
        : `<label class="btn sm ghost">${ic('upload')}${t('certGallery')}<input type="file" accept="image/*" data-photo="${i}" hidden></label>
           <label class="btn sm ghost">${ic('plus')}${t('certCamera')}<input type="file" accept="image/*" capture="environment" data-photo="${i}" hidden></label>`}</div>`;
    };
    m.innerHTML = `<div class="doc cert" role="dialog" aria-label="${esc(certTypeName(cert.type))}">${head(t('certHead', certTypeName(cert.type)), true)}
      <div class="doc-body">
        <div class="cert-prev"><canvas id="certCv"></canvas></div>
        <div class="cert-form">
          <div class="cert-f"><span>${t('certTheme')}</span><div class="cert-themes">${Object.keys(CERT_THEMES).map((k) => {
            const th = CERT_THEMES[k];
            return `<button class="cert-theme ${cert.theme === k ? 'on' : ''}" data-c="theme" data-k="${k}" aria-pressed="${cert.theme === k}">
              <span class="ct-card" style="background:radial-gradient(circle at 50% 30%, ${th.bg[0]}, ${th.bg[1]} 55%, ${th.bg[2]})"><i style="background:radial-gradient(circle at 40% 35%, #fff3c4, #d4a640 55%, #7a5513)"></i></span>
              <b>${t('certTheme_' + k)}</b></button>`;
          }).join('')}</div></div>
          <label class="cert-f"><span>${t('certDate')}</span><input class="field" type="date" data-cf="date" value="${esc(cert.date)}"></label>
          ${cert.type === 'win' ? `<label class="cert-f"><span>${t('certEvent')} <small>${t('optional')}</small></span><input class="field" maxlength="30" data-cf="event" value="${esc(cert.event)}" placeholder="${t('certEventPh')}"></label>` : ''}
          <div class="cert-f"><span>${t('certWho')}</span>${chips ? `<div class="chips">${chips}</div>` : ''}
            <input class="field" maxlength="20" data-cf="name" value="${esc(cert.name)}" placeholder="${t('name')}"></div>
          <label class="cert-f"><span>${t('certScore')}</span><input class="field num" type="number" inputmode="numeric" min="0" max="${CERT_MAX_SCORE}" data-cf="score" value="${esc(cert.score)}"></label>
          <label class="cert-f"><span>${t('certMates')}</span><input class="field" maxlength="120" data-cf="mates" value="${esc(cert.mates)}" placeholder="${t('certMatesPh')}"></label>
          <label class="cert-f"><span>${t('certPlace')} <small>${t('optional')}</small></span><input class="field" maxlength="30" data-cf="place" value="${esc(cert.place)}" placeholder="${t('certPlacePh')}"></label>
          <div class="cert-f"><span>${t('certPhotos')}</span><div class="cert-slots">${slot(0)}${slot(1)}</div></div>
        </div>
        <div class="actions cert-actions">
          <button class="btn ghost" data-c="save" data-mode="save">${ic('download')}${t('saveImage')}</button>
          <button class="btn gold" data-c="save" data-mode="share">${ic('share')}${t('share')}</button>
        </div>
      </div></div>`;
    drawCertPreview();
  }
  function certClick(e) {
    const m = $('#modal');
    if (e.target === m) { closeCert(); return; } // also how the phone's back button closes it (backStep)
    const b = e.target.closest('[data-c]');
    if (!b) return;
    const c = b.dataset.c;
    if (c === 'close') closeCert();
    else if (c === 'back') { cert.type = null; renderCert(); }
    else if (c === 'theme') {
      cert.theme = certTheme = b.dataset.k;
      $$('[data-c="theme"]').forEach((x) => { const on = x.dataset.k === cert.theme; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
      drawCertPreview();
    } else if (c === 'type') { cert.type = b.dataset.k; Object.assign(cert, certDefaults(cert.type)); renderCert(); }
    else if (c === 'who') {
      const p = sess().players.find((x) => x.id === b.dataset.id);
      cert.pid = p ? p.id : null; Object.assign(cert, certFor(cert.type, p)); renderCert();
    } else if (c === 'rm') {
      const i = toInt(b.dataset.i), ph = cert.photos[i];
      if (ph) URL.revokeObjectURL(ph.url);
      cert.photos[i] = null; renderCert();
    } else if (c === 'save') saveCert(b.dataset.mode);
  }
  let certTimer;
  function certInput(e) {
    const f = e.target.dataset.cf;
    if (!f || !cert) return;
    let v = e.target.value;
    if (f === 'score') { v = v === '' ? '' : Math.max(0, Math.min(CERT_MAX_SCORE, toInt(v))); if (v !== '' && String(v) !== e.target.value) e.target.value = v; }
    if (f === 'date' && !DATE_RE.test(v)) return;
    cert[f] = v;
    if (f === 'place') certPlace = v;
    if (f === 'event') certEvent = v;
    if (f === 'name') { cert.pid = null; $$('[data-c="who"]').forEach((x) => x.classList.toggle('on', pname(sess().players.find((p) => p.id === x.dataset.id) || {}) === v)); }
    clearTimeout(certTimer);
    certTimer = setTimeout(drawCertPreview, 120);
  }
  async function certChange(e) {
    const inp = e.target;
    if (!inp.matches('input[type=file][data-photo]') || !cert) return;
    const file = inp.files && inp.files[0];
    if (!file || !/^image\//.test(file.type)) return;
    const i = toInt(inp.dataset.photo), url = URL.createObjectURL(file);
    try {
      const img = await loadImg(url);
      if (!cert) { URL.revokeObjectURL(url); return; }
      if (cert.photos[i]) URL.revokeObjectURL(cert.photos[i].url);
      cert.photos[i] = { url, img };
      renderCert();
    } catch (err) { URL.revokeObjectURL(url); toast(t('badFile')); }
  }
  async function drawCertPreview() {
    const cv = $('#certCv');
    if (!cv || !cert || !cert.type) return;
    const src = await drawCert();
    cv.width = src.width; cv.height = src.height;
    cv.getContext('2d').drawImage(src, 0, 0);
  }
  function saveCert(mode) {
    if (!cert.name.trim()) { toast(t('certNameReq')); const n = $('[data-cf="name"]'); if (n) n.focus(); return; }
    withBusy(async () => {
      const cv = await drawCert();
      await exportImage(cv, `BowlingSecretary_${cert.type}_${cert.date}.png`, mode);
    });
  }
  function certDateText(k) {
    const d = parseYmd(k);
    return lang() === 'ko' ? `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일` : `${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  // Word wrap for canvas text (Korean breaks at spaces too; a very long word is split by characters).
  function wrapText(x, text, maxW) {
    const out = []; let line = '';
    String(text).split(/\s+/).filter(Boolean).forEach((w) => {
      const tryLine = line ? `${line} ${w}` : w;
      if (x.measureText(tryLine).width <= maxW) { line = tryLine; return; }
      if (line) out.push(line);
      line = '';
      for (const ch of w) { if (x.measureText(line + ch).width > maxW && line) { out.push(line); line = ''; } line += ch; }
    });
    if (line) out.push(line);
    return out;
  }
  // Like wrapText, but two lines are split near the middle so the second line isn't a lone word.
  function wrapBalanced(x, text, maxW) {
    const ls = wrapText(x, text, maxW);
    if (ls.length !== 2) return ls;
    const words = String(text).split(/\s+/).filter(Boolean);
    let best = ls, bestW = Infinity;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
      const w = Math.max(x.measureText(a).width, x.measureText(b).width);
      if (w <= maxW && w < bestW) { best = [a, b]; bestW = w; }
    }
    return best;
  }
  function goldGrad(x, x0, y0, x1, y1) {
    const g = x.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#f8e7a8'); g.addColorStop(0.35, '#e2bd62'); g.addColorStop(0.6, '#b8862b'); g.addColorStop(1, '#f3d67f');
    return g;
  }
  // Polaroid-style photo: white mat, cover-cropped picture, slight tilt, soft shadow.
  function drawPhoto(x, img, cx, cy, w, h, tilt) {
    const mat = 14;
    x.save();
    x.translate(cx, cy); x.rotate(tilt);
    x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 30; x.shadowOffsetY = 12;
    x.fillStyle = '#f7f3ea'; x.fillRect(-w / 2 - mat, -h / 2 - mat, w + 2 * mat, h + 2 * mat + 18);
    x.shadowColor = 'transparent';
    const r = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const sw = w / r, sh = h / r;
    x.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, -w / 2, -h / 2, w, h);
    x.strokeStyle = 'rgba(184,134,43,.6)'; x.lineWidth = 2; x.strokeRect(-w / 2 - mat, -h / 2 - mat, w + 2 * mat, h + 2 * mat + 18);
    x.restore();
  }
  // Laurel branch: shaded leaves with a midrib along an arc on one side of the medal, plus a few gold
  // berries (side = -1 left, 1 right).
  function drawLaurel(x, cx, cy, R, side) {
    x.save();
    x.strokeStyle = '#9c7425'; x.lineWidth = 3.5; x.lineCap = 'round';
    x.beginPath(); x.arc(cx, cy, R, Math.PI / 2 + side * 0.22, Math.PI / 2 + side * 2.6, side < 0); x.stroke();
    for (let i = 0; i < 11; i++) {
      const a = Math.PI / 2 + side * (0.3 + i * 0.215);
      const out = i % 2 ? 9 : -9; // leaves alternate outside / inside the stem
      const px = cx + Math.cos(a) * (R + out), py = cy + Math.sin(a) * (R + out);
      const len = 24 - i * 0.7;
      x.save(); x.translate(px, py); x.rotate(a + side * (Math.PI / 2) + side * (i % 2 ? -0.5 : 0.5));
      const g = x.createLinearGradient(0, -8, 0, 8);
      g.addColorStop(0, '#fbe7a1'); g.addColorStop(0.5, '#d4a640'); g.addColorStop(1, '#8a6420');
      x.fillStyle = g;
      x.beginPath(); x.moveTo(-len, 0); x.quadraticCurveTo(0, -11, len, 0); x.quadraticCurveTo(0, 11, -len, 0); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(110,75,18,.65)'; x.lineWidth = 1.2;
      x.beginPath(); x.moveTo(-len + 3, 0); x.lineTo(len - 4, 0); x.stroke();
      x.restore();
      if (i % 3 === 1) {
        const bx = cx + Math.cos(a + side * 0.1) * (R - 1), by = cy + Math.sin(a + side * 0.1) * (R - 1);
        const bg = x.createRadialGradient(bx - 1.5, by - 1.5, 0.5, bx, by, 5);
        bg.addColorStop(0, '#fff5cf'); bg.addColorStop(1, '#c08a22');
        x.fillStyle = bg; x.beginPath(); x.arc(bx, by, 4.5, 0, Math.PI * 2); x.fill();
      }
    }
    x.restore();
  }
  // Four-point sparkle.
  function sparkle(x, sx, sy, r, alpha) {
    x.save(); x.translate(sx, sy);
    x.fillStyle = `rgba(255,240,190,${alpha})`;
    x.beginPath();
    x.moveTo(0, -r); x.quadraticCurveTo(r * 0.18, -r * 0.18, r, 0); x.quadraticCurveTo(r * 0.18, r * 0.18, 0, r);
    x.quadraticCurveTo(-r * 0.18, r * 0.18, -r, 0); x.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r); x.closePath(); x.fill();
    x.restore();
  }
  // The medal on top of the certificate: a glow, crimson ribbon tails, a laurel wreath, a beaded rim and a
  // polished gold disc framing a navy centre with fine rays and the type's sign (300 / star / crown).
  function drawEmblem(x, type, cx, cy, th = CERT_THEMES.navy) {
    x.save();
    const halo = x.createRadialGradient(cx, cy, 40, cx, cy, 180);
    halo.addColorStop(0, 'rgba(255,214,120,.35)'); halo.addColorStop(1, 'rgba(255,214,120,0)');
    x.fillStyle = halo; x.beginPath(); x.arc(cx, cy, 180, 0, Math.PI * 2); x.fill();
    drawLaurel(x, cx, cy, 110, -1); drawLaurel(x, cx, cy, 110, 1);
    // ribbon tails, over the bottom of the wreath
    [-1, 1].forEach((side) => {
      x.save(); x.translate(cx + side * 30, cy + 62); x.rotate(side * 0.34);
      const rg = x.createLinearGradient(-18, 0, 18, 0);
      rg.addColorStop(0, th.rib[0]); rg.addColorStop(0.5, th.rib[1]); rg.addColorStop(1, th.rib[2]);
      x.fillStyle = rg;
      x.beginPath(); x.moveTo(-18, 0); x.lineTo(18, 0); x.lineTo(18, 46); x.lineTo(0, 36); x.lineTo(-18, 46); x.closePath(); x.fill();
      x.strokeStyle = '#e2bd62'; x.lineWidth = 2.5; x.stroke();
      x.strokeStyle = 'rgba(248,231,168,.55)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(-11, 4); x.lineTo(-11, 40); x.moveTo(11, 4); x.lineTo(11, 40); x.stroke();
      x.restore();
    });
    // beaded rim
    x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 26; x.shadowOffsetY = 6;
    x.fillStyle = '#7a5513'; x.beginPath(); x.arc(cx, cy, 86, 0, Math.PI * 2); x.fill();
    x.shadowColor = 'transparent'; x.shadowBlur = 0; x.shadowOffsetY = 0;
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2, bx = cx + Math.cos(a) * 83, by = cy + Math.sin(a) * 83;
      const bg = x.createRadialGradient(bx - 1, by - 1, 0.3, bx, by, 3.6);
      bg.addColorStop(0, '#fff3c4'); bg.addColorStop(1, '#c4932c');
      x.fillStyle = bg; x.beginPath(); x.arc(bx, by, 3.3, 0, Math.PI * 2); x.fill();
    }
    // polished gold disc
    const disc = x.createRadialGradient(cx - 26, cy - 30, 6, cx, cy, 80);
    disc.addColorStop(0, '#fff6cf'); disc.addColorStop(0.35, '#f0c75a'); disc.addColorStop(0.75, '#b8862b'); disc.addColorStop(1, '#7a5513');
    x.fillStyle = disc; x.beginPath(); x.arc(cx, cy, 78, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#6b4a10'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, 66, 0, Math.PI * 2); x.stroke();
    // navy centre with fine gold rays
    const navy = x.createRadialGradient(cx, cy - 20, 4, cx, cy, 64);
    navy.addColorStop(0, th.core[0]); navy.addColorStop(1, th.core[1]);
    x.fillStyle = navy; x.beginPath(); x.arc(cx, cy, 64, 0, Math.PI * 2); x.fill();
    x.save(); x.beginPath(); x.arc(cx, cy, 64, 0, Math.PI * 2); x.clip();
    x.translate(cx, cy);
    for (let i = 0; i < 24; i++) {
      x.rotate((Math.PI * 2) / 24);
      x.fillStyle = 'rgba(240,200,110,.12)';
      x.beginPath(); x.moveTo(0, 0); x.lineTo(-5, -64); x.lineTo(5, -64); x.closePath(); x.fill();
    }
    x.restore();
    x.strokeStyle = 'rgba(248,231,168,.8)'; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, 59, 0, Math.PI * 2); x.stroke();
    // the type's sign
    x.save();
    x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 10; x.shadowOffsetY = 3;
    if (type === 'win') {
      const k = 4.6; x.translate(cx - 12 * k, cy - 12.8 * k); x.scale(k, k);
      CROWN.forEach((p) => {
        const path = new Path2D();
        if (p.d) path.addPath(new Path2D(p.d)); else path.arc(p.c[0], p.c[1], p.c[2], 0, Math.PI * 2);
        x.fillStyle = p.fill; x.fill(path);
        if (p.stroke) { x.strokeStyle = p.stroke; x.lineWidth = p.w; x.stroke(path); }
      });
    } else if (type === 'high') {
      const k = 4.2; x.translate(cx - 12 * k, cy - 12.2 * k); x.scale(k, k);
      const path = new Path2D('M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z');
      const sg = x.createLinearGradient(4, 3, 20, 20); sg.addColorStop(0, '#fff3b0'); sg.addColorStop(0.5, '#f8c515'); sg.addColorStop(1, '#d98e06');
      x.fillStyle = sg; x.fill(path); x.strokeStyle = '#a86a04'; x.lineWidth = 0.9; x.lineJoin = 'round'; x.stroke(path);
    } else {
      x.fillStyle = goldGrad(x, cx - 50, cy - 30, cx + 50, cy + 30);
      x.font = `800 54px ${IMG_SERIF}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('300', cx, cy + 3);
    }
    x.restore();
    // highlight on the disc and sparkles above the wreath
    x.save(); x.beginPath(); x.arc(cx, cy, 78, 0, Math.PI * 2); x.clip();
    const hl = x.createLinearGradient(cx - 70, cy - 80, cx + 10, cy);
    hl.addColorStop(0, 'rgba(255,255,255,.35)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = hl; x.beginPath(); x.ellipse(cx - 28, cy - 40, 52, 24, -0.6, 0, Math.PI * 2); x.fill();
    x.restore();
    sparkle(x, cx, cy - 118, 13, 0.95); sparkle(x, cx - 40, cy - 106, 7, 0.75); sparkle(x, cx + 40, cy - 106, 7, 0.75);
    sparkle(x, cx + 70, cy - 62, 5, 0.6);
    x.restore();
  }
  // The app mark at the bottom right: the app icon in a gold ring, then the name with its first part in
  // pearl white and the second in shining gold (like the logo), with a soft glow.
  async function drawCertBrand(x, right, base) {
    const [a, b] = BRAND[lang()], ko = lang() === 'ko';
    const font = ko ? `800 32px ${IMG_SANS}` : `italic 700 32px ${IMG_SERIF}`;
    x.save();
    x.font = font; x.textAlign = 'left';
    const wa = x.measureText(a).width, wb = x.measureText(b).width, ico = 44, gap = 12;
    const x0 = right - (ico + gap + wa + wb);
    try {
      const im = await loadImg('icons/icon-192.png');
      const iy = base - 33;
      x.shadowColor = 'rgba(232,196,110,.55)'; x.shadowBlur = 16;
      x.fillStyle = goldGrad(x, x0, iy, x0 + ico, iy + ico); rr(x, x0 - 3, iy - 3, ico + 6, ico + 6, 14); x.fill();
      x.shadowColor = 'transparent'; x.shadowBlur = 0;
      x.save(); rr(x, x0, iy, ico, ico, 11); x.clip(); x.drawImage(im, x0, iy, ico, ico); x.restore();
    } catch (e) { /* icon optional */ }
    const tx = x0 + ico + gap;
    const pearl = x.createLinearGradient(0, base - 30, 0, base + 4);
    pearl.addColorStop(0, '#ffffff'); pearl.addColorStop(1, '#d6dde8');
    x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 8; x.shadowOffsetY = 2;
    x.fillStyle = pearl; x.fillText(a, tx, base);
    x.shadowColor = 'rgba(248,210,110,.75)'; x.shadowBlur = 18; x.shadowOffsetY = 0;
    const shine = x.createLinearGradient(tx + wa, base - 32, tx + wa + wb, base + 4);
    shine.addColorStop(0, '#fff3c4'); shine.addColorStop(0.45, '#f2c94c'); shine.addColorStop(0.7, '#c8921f'); shine.addColorStop(1, '#ffe08a');
    x.fillStyle = shine; x.fillText(b, tx + wa, base);
    x.restore();
  }
  async function drawCert() {
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    const W2 = 1080, ko = lang() === 'ko';
    const photos = cert.photos.filter(Boolean);
    const m = document.createElement('canvas').getContext('2d');
    // Measure the wrapped texts first so the canvas height fits them.
    const score = cert.score === '' ? '' : String(cert.score);
    const ev = cert.type === 'win' ? cert.event.trim() : '';
    // With an event name the champion text names it: "제3회 친선 볼링대회에서" (or "OO배 대회에서" when the name has no 대회).
    const evPhrase = ko && ev && !/대회$/.test(ev) ? `${ev} 대회` : ev;
    const body = ev ? t('certBodyWinEvent', certDateText(cert.date), evPhrase)
      : t({ perfect: 'certBodyPerfect', high: 'certBodyHigh', win: 'certBodyWin' }[cert.type], certDateText(cert.date), score || '—');
    // Korean text breaks after "…하였기에" ("그 영광을 기리어…" starts a new line); on three lines or more the
    // closing words ("이 인증서를 드립니다.") also get a line of their own.
    m.font = `500 31px ${IMG_SANS}`;
    const wrapW = W2 - 220, brk = ko ? body.indexOf('기에 ') : -1;
    const parts = brk > 0 ? [body.slice(0, brk + 2), body.slice(brk + 3)] : [body];
    const tail = ko ? '이 인증서를 드립니다.' : '';
    const wrapLast = (pt) => {
      const ls = wrapBalanced(m, pt, wrapW);
      if (!tail || ls.length < 2 || !pt.endsWith(tail)) return ls;
      const rest = pt.slice(0, -tail.length).trim();
      return [...(rest ? wrapBalanced(m, rest, wrapW) : []), tail];
    };
    const bodyLines = [...parts.slice(0, -1).flatMap((pt) => wrapBalanced(m, pt, wrapW)), ...wrapLast(parts[parts.length - 1])];
    m.font = `600 28px ${IMG_SANS}`; const mateLines = cert.mates.trim() ? wrapText(m, cert.mates.trim(), W2 - 300).slice(0, 3) : [];
    const place = cert.place.trim();
    const photoH = photos.length === 1 ? 470 : photos.length === 2 ? 380 : 0;
    let H = 960 + bodyLines.length * 48 + (mateLines.length ? 70 + mateLines.length * 40 : 0) + (photoH ? photoH + 90 : 0) + 170;
    H = Math.max(H, 1350);
    const c = document.createElement('canvas'); c.width = W2; c.height = H;
    const x = c.getContext('2d');
    // Background: deep navy with a spotlight, gold light rays, scattered sparkles and a lane-board sheen.
    const th = certTh();
    const bg = x.createRadialGradient(W2 / 2, 330, 40, W2 / 2, 520, H * 0.95);
    bg.addColorStop(0, th.bg[0]); bg.addColorStop(0.45, th.bg[1]); bg.addColorStop(1, th.bg[2]);
    x.fillStyle = bg; x.fillRect(0, 0, W2, H);
    x.save(); x.translate(W2 / 2, 250);
    for (let i = 0; i < 36; i++) {
      x.rotate((Math.PI * 2) / 36);
      x.fillStyle = i % 2 ? 'rgba(232,196,110,.055)' : 'rgba(232,196,110,.02)';
      x.beginPath(); x.moveTo(0, 0); x.lineTo(-38, -H); x.lineTo(38, -H); x.closePath(); x.fill();
    }
    x.restore();
    for (let i = 0; i < 26; i++) { // lane boards fading in gradually towards the bottom
      const bx = (i / 26) * W2, a = i % 2 ? 0.025 : 0.045;
      const lg = x.createLinearGradient(0, H * 0.4, 0, H);
      lg.addColorStop(0, 'rgba(214,180,110,0)'); lg.addColorStop(1, `rgba(214,180,110,${a})`);
      x.fillStyle = lg; x.fillRect(bx, H * 0.4, W2 / 26, H * 0.6);
    }
    let seed = 11; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 90; i++) {
      const sx = 60 + rnd() * (W2 - 120), sy = 60 + rnd() * (H - 120), r = 0.8 + rnd() * 2.2;
      x.fillStyle = `rgba(248,226,160,${0.15 + rnd() * 0.45})`;
      x.beginPath(); x.arc(sx, sy, r, 0, Math.PI * 2); x.fill();
    }
    // Frames: thick gold outer, thin inner, ornaments in the corners.
    x.strokeStyle = goldGrad(x, 0, 0, W2, H); x.lineWidth = 10; x.strokeRect(30, 30, W2 - 60, H - 60);
    x.strokeStyle = 'rgba(232,196,110,.65)'; x.lineWidth = 2; x.strokeRect(54, 54, W2 - 108, H - 108);
    [[54, 54, 1, 1], [W2 - 54, 54, -1, 1], [54, H - 54, 1, -1], [W2 - 54, H - 54, -1, -1]].forEach(([cx, cy, sx, sy]) => {
      x.save(); x.translate(cx, cy); x.scale(sx, sy);
      x.strokeStyle = goldGrad(x, 0, 0, 80, 80); x.lineWidth = 4;
      x.beginPath(); x.moveTo(0, 70); x.lineTo(0, 16); x.quadraticCurveTo(0, 0, 16, 0); x.lineTo(70, 0); x.stroke();
      x.fillStyle = '#f0d081'; x.beginPath(); x.moveTo(22, 10); x.lineTo(30, 22); x.lineTo(22, 34); x.lineTo(14, 22); x.closePath(); x.fill();
      x.restore();
    });
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    drawEmblem(x, cert.type, W2 / 2, 210, th);
    let y = 360;
    x.fillStyle = '#e8c46e'; x.font = `600 25px ${IMG_SERIF}`;
    x.fillText('C E R T I F I C A T E   O F   A C H I E V E M E N T', W2 / 2, y);
    y += 100;
    const title = ev ? `${ev} ${certTypeName(cert.type)}` : certTypeName(cert.type);
    const tFont = (px) => (ko ? `800 ${px}px ${IMG_SANS}` : `italic 700 ${px}px ${IMG_SERIF}`);
    let tpx = ko ? 86 : 94;
    x.font = tFont(tpx);
    while (tpx > 50 && x.measureText(title).width > W2 - 200) { tpx -= 4; x.font = tFont(tpx); }
    x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 18; x.shadowOffsetY = 6;
    x.fillStyle = goldGrad(x, 0, y - 80, 0, y + 10); x.fillText(fit(x, title, W2 - 200), W2 / 2, y);
    x.shadowColor = 'transparent'; x.shadowBlur = 0; x.shadowOffsetY = 0;
    y += 44;
    x.strokeStyle = goldGrad(x, W2 / 2 - 220, 0, W2 / 2 + 220, 0); x.lineWidth = 2;
    x.beginPath(); x.moveTo(W2 / 2 - 220, y); x.lineTo(W2 / 2 - 22, y); x.moveTo(W2 / 2 + 22, y); x.lineTo(W2 / 2 + 220, y); x.stroke();
    x.fillStyle = '#e8c46e'; x.beginPath(); x.moveTo(W2 / 2, y - 10); x.lineTo(W2 / 2 + 10, y); x.lineTo(W2 / 2, y + 10); x.lineTo(W2 / 2 - 10, y); x.closePath(); x.fill();
    y += 120;
    x.fillStyle = '#ffffff'; x.font = `800 80px ${IMG_SANS}`;
    const nm = fit(x, cert.name.trim() || t('certWho'), W2 - 240); x.fillText(nm, W2 / 2, y);
    const nw = Math.min(W2 - 240, x.measureText(nm).width + 120);
    y += 30;
    x.fillStyle = goldGrad(x, W2 / 2 - nw / 2, 0, W2 / 2 + nw / 2, 0); x.fillRect(W2 / 2 - nw / 2, y, nw, 3);
    y += 76;
    x.fillStyle = '#e8c46e'; x.font = `700 24px ${IMG_SANS}`;
    x.fillText(cert.type === 'win' ? 'T O T A L' : 'S C O R E', W2 / 2, y);
    y += 118;
    x.font = `700 130px ${IMG_SERIF}`;
    x.shadowColor = 'rgba(232,196,110,.45)'; x.shadowBlur = 30;
    x.fillStyle = goldGrad(x, 0, y - 110, 0, y); x.fillText(score || '—', W2 / 2, y);
    x.shadowColor = 'transparent'; x.shadowBlur = 0;
    y += 74;
    x.fillStyle = '#ddd6c8'; x.font = `500 31px ${IMG_SANS}`;
    bodyLines.forEach((l) => { x.fillText(l, W2 / 2, y); y += 48; });
    if (mateLines.length) {
      y += 30;
      x.fillStyle = '#e8c46e'; x.font = `700 23px ${IMG_SANS}`; x.fillText(t('certMates'), W2 / 2, y);
      y += 44;
      x.fillStyle = '#f1ece2'; x.font = `600 28px ${IMG_SANS}`;
      mateLines.forEach((l) => { x.fillText(l, W2 / 2, y); y += 40; });
    }
    if (photoH) {
      y += 50;
      if (photos.length === 1) drawPhoto(x, photos[0].img, W2 / 2, y + photoH / 2, 620, photoH - 60, -0.015);
      else {
        drawPhoto(x, photos[0].img, W2 / 2 - 222, y + photoH / 2, 400, photoH - 70, -0.035);
        drawPhoto(x, photos[1].img, W2 / 2 + 222, y + photoH / 2 + 6, 400, photoH - 70, 0.03);
      }
      y += photoH;
    }
    // Footer: date on the left, bowling alley in the middle, app name on the right, a thin gold rule above.
    const fy = H - 110;
    x.fillStyle = 'rgba(232,196,110,.5)'; x.fillRect(120, fy - 40, W2 - 240, 1.5);
    x.font = `600 24px ${IMG_SANS}`; x.fillStyle = '#b9c2cf';
    x.textAlign = 'left'; x.fillText(certDateText(cert.date), 120, fy);
    if (place) { x.textAlign = 'center'; x.fillStyle = '#f1ece2'; x.font = `700 25px ${IMG_SANS}`; x.fillText(fit(x, place, ko ? 300 : 170), W2 / 2, fy); } // the English app name is wider
    await drawCertBrand(x, W2 - 120, fy);
    x.textAlign = 'left';
    return c;
  }

  /* ───────── Excel export (stats tab) ───────── */
  // Three sheets for the selected stats period: every game (practice flagged, not dropped), one row per player per day
  // (same numbers as the results table), and one row per member (same numbers as the stats tab). Built by js/xlsx.js.
  function xlsxSheets() {
    const from = periodFrom(), cols = (k) => t(k).split('|');
    const days = Object.values(db.sessions).filter((s) => hasRecord(s) && s.date >= from).sort((a, b) => a.date.localeCompare(b.date));
    const wd = (k) => WD[lang()][parseYmd(k).getDay()];
    const team = (s, p) => (s.teamMode ? teamLabel(s, p.team) : '');
    const games = [cols('xlsxColsGames')], perDay = [cols('xlsxColsDays')], perMember = [cols('xlsxColsMembers')];
    days.forEach((s) => {
      playersByName(s).forEach((p) => usedGames(s).forEach((g, gi) => {
        const v = entryScore(g, p.id);
        if (v === null) return;
        const hd = isPractice(s, gi) ? 0 : toInt(p.hdcp);
        games.push([{ date: s.date }, wd(s.date), pname(p), team(s, p), gi + 1, v, hd, v + hd,
          isPractice(s, gi) ? t('xlsxYes') : '', g.mode === 'frame' ? t('xlsxFrame') : t('xlsxFinal')]);
      }));
      playerStats(s).filter((r) => r.played).forEach((r, i) => {
        const counted = r.scores.filter((v, gi) => v !== null && !isPractice(s, gi));
        perDay.push([{ date: s.date }, wd(s.date), pname(r.p), team(s, r.p), r.played, r.scratch, r.avg, r.hdcp, r.total, Math.max(...counted), i + 1]);
      });
    });
    membersByName().forEach((m) => {
      const gs = memberGames(m.id);
      if (!gs.length) return;
      const sc = gs.map((g) => g.score);
      perMember.push([m.name, toInt(m.handicap), new Set(gs.map((g) => g.date)).size, sc.length, avgOf(sc), Math.max(...sc), Math.min(...sc),
        sc.filter((v) => v >= 200).length, avgOf(gs.map((g) => g.score + g.hdcp))]);
    });
    if (games.length === 1) return null;
    return [
      { name: t('xlsxGames'), widths: [12, 6, 14, 12, 6, 7, 7, 7, 7, 11], rows: games },
      { name: t('xlsxDays'), widths: [12, 6, 14, 12, 8, 10, 7, 10, 8, 8, 6], rows: perDay },
      { name: t('xlsxMembers'), widths: [14, 10, 10, 8, 8, 7, 7, 10, 14], rows: perMember },
    ];
  }
  async function exportXlsx() {
    const sheets = xlsxSheets();
    if (!sheets) { toast(ui.statPeriod === 'all' || !ui.statPeriod ? t('noStats') : t('noStatsPeriod')); return; }
    if (!(await ask(t('confirmXlsx', periodRange()), t('save')))) return;
    const blob = new Blob([window.BBXlsx(sheets)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    downloadBlob(blob, `BowlingSecretary_${ymd(new Date())}.xlsx`);
    toast(t('xlsxSaved'));
  }

  /* ───────── Backup ───────── */
  const backupText = () => JSON.stringify({ app: 'best-bowling', version: 1, exportedAt: new Date().toISOString(), data: db }, null, 2);
  const backupName = () => `best-bowling-backup-${ymd(new Date())}`;
  function exportData() {
    downloadBlob(new Blob([backupText()], { type: 'application/json' }), `${backupName()}.json`);
    toast(t('exported'));
  }
  const IMPORT_MAX = 5 * 1024 * 1024;
  async function importData(file) {
    if (!file) return;
    if (file.size > IMPORT_MAX) { toast(t('badFile')); return; }
    try {
      const json = JSON.parse(await file.text());
      const data = json && json.data ? json.data : json;
      if (!data || !Array.isArray(data.members) || typeof data.sessions !== 'object') throw new Error('bad');
      if (!(await ask(t('confirmImport')))) return;
      db = normalize(data);
      save(); applyTheme(); ui.draft = ui.cdraft = null; render();
      toast(t('imported'));
    } catch (e) { toast(t('badFile')); }
  }

  /* ───────── Actions ───────── */
  function pickDate(k, scroll) {
    ui.date = k; ui.kp = null; ui.calOpen = false; ui.unlocked = null;
    const d = parseYmd(k); ui.calY = d.getFullYear(); ui.calM = d.getMonth();
    render();
    if (scroll) { const el = $('#sess'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }
  }
  function quickAdd() {
    const m = addMember($('#qName').value, $('#qH').value);
    if (!m) return;
    const s = sess();
    s.players.push({ id: m.id, name: m.name, hdcp: m.handicap, team: nextTeam(s) });
    commit(s); render();
    const q = $('#qName'); if (q) q.focus();
  }
  function nextTeam(s) {
    const counts = Array.from({ length: s.teamCount }, (_, i) => s.players.filter((p) => p.team === i).length);
    return counts.indexOf(Math.min(...counts));
  }

  const actions = {
    tab(el) { ui.tab = el.dataset.tab; ui.kp = null; ui.editId = null; render(); window.scrollTo(0, 0); },
    calToggle() {
      ui.calOpen = !ui.calOpen;
      if (ui.calOpen) { const d = parseYmd(ui.date); ui.calY = d.getFullYear(); ui.calM = d.getMonth(); }
      render();
    },
    calMove(el) { const d = new Date(ui.calY, ui.calM + toInt(el.dataset.d), 1); ui.calY = d.getFullYear(); ui.calM = d.getMonth(); render(); },
    calToday() { pickDate(ymd(new Date())); },
    calDay(el) { const d = parseYmd(ui.date); d.setDate(d.getDate() + toInt(el.dataset.d)); pickDate(ymd(d)); },
    pick(el) {
      if (el.dataset.goto) { ui.tab = el.dataset.goto; window.scrollTo(0, 0); }
      pickDate(el.dataset.date, !!el.dataset.scroll || !!el.dataset.goto);
    },
    entryTeam(el) { ui.entryTeam = el.dataset.v === 'all' ? 'all' : toInt(el.dataset.v); ui.kp = null; renderKeepingGameTabs(); },
    editTeamName(el) { ui.editTeam = toInt(el.dataset.t); render(); const i = $('#teamNameIn'); if (i) { i.focus(); i.select(); } },
    saveTeamName(el) {
      const s = sess(), ti = toInt(el.dataset.t), name = ($('#teamNameIn') || {}).value || '';
      s.teamNames = s.teamNames || [];
      s.teamNames[ti] = name.trim();
      ui.editTeam = null; commit(s); render();
    },
    currency(el) {
      const from = currency(), to = el.dataset.v;
      if (!CUR_RATE[to] || from === to) return;
      // The currency applies to every sheet, so convert all saved amounts (and the defaults) at the rough rate:
      // 3,500원 → $3.50 / €3.50 / ¥350. Won and yen come out whole, dollars and euros to the cent.
      const conv = (v) => roundCur((v || 0) * CUR_RATE[to] / CUR_RATE[from], to);
      [...Object.values(db.costs), ui.cdraft].forEach((c) => {
        if (!c) return;
        c.gameFee = conv(c.gameFee); c.shoeFee = conv(c.shoeFee);
        (c.extras || []).forEach((x) => { x.amount = conv(x.amount); });
      });
      db.feeDefaults.gameFee = conv(db.feeDefaults.gameFee); db.feeDefaults.shoeFee = conv(db.feeDefaults.shoeFee);
      db.settings.currency = to;
      save(); render();
    },
    costView(el) { ui.costView = el.dataset.v; render(); },
    unlock() { ui.unlocked = ui.date; render(); },
    lock() { ui.unlocked = null; ui.kp = null; ui.editTeam = null; render(); },
    practice() { const s = sess(); s.firstPractice = !s.firstPractice; commit(s); render(); },
    statPeriod(el) { ui.statPeriod = el.dataset.v; render(); },
    exportXlsx() { exportXlsx(); },
    doc(el) { showDoc(el.dataset.k); },
    statPick(el) { ui.statId = el.dataset.id; render(); },
    sumVert() { // results table orientation; a view setting, so allowed on locked records
      db.settings.resultsVert = !db.settings.resultsVert;
      if (!db.settings.resultsVert) delete db.settings.resultsVert;
      save();
      const sum = $('#summary');
      if (sum) { sum.innerHTML = summaryInner(sess()); updateScrollBars(); }
    },
    statView(el) { ui.statView = el.dataset.v; render(); },
    togglePlayer(el) {
      const s = sess(), id = el.dataset.id, i = s.players.findIndex((p) => p.id === id);
      if (i >= 0) s.players.splice(i, 1);
      else { const m = memberById(id); s.players.push({ id, name: m.name, hdcp: toInt(m.handicap), team: nextTeam(s) }); }
      if (ui.kp && ui.kp.pid === id) ui.kp = null;
      commit(s); render();
    },
    quickAdd,
    matchMode(el) { const s = sess(); s.teamMode = el.dataset.v === '1'; commit(s); render(); },
    teamCount(el) {
      const s = sess();
      s.teamCount = Math.min(4, Math.max(2, s.teamCount + toInt(el.dataset.d)));
      s.players.forEach((p) => { if (p.team >= s.teamCount) p.team = s.teamCount - 1; });
      commit(s); render();
    },
    setTeam(el) { const s = sess(), p = s.players.find((x) => x.id === el.dataset.id); p.team = toInt(el.dataset.t); commit(s); render(); },
    cycleTeam(el) { const s = sess(), p = s.players.find((x) => x.id === el.dataset.id); p.team = (p.team + 1) % s.teamCount; commit(s); render(); },
    game(el) { const s = sess(); s.active = toInt(el.dataset.i); ui.kp = null; commit(s); renderKeepingGameTabs(); },
    addGame() { const s = sess(); s.games.push({ mode: curGame(s).mode, entries: {} }); s.active = s.games.length - 1; ui.kp = null; commit(s); render(); },
    async delGame() {
      const s = sess();
      if (!(await ask(t('confirmDelGame', s.active + 1), t('delete'), true))) return;
      s.games.splice(s.active, 1); s.active = Math.max(0, s.active - 1); ui.kp = null; commit(s); render();
    },
    mode(el) {
      const s = sess(), g = curGame(s);
      g.mode = el.dataset.v;
      // Switching to final-score entry: copy each player's frame total into an empty score box.
      if (g.mode === 'final') Object.values(g.entries).forEach((e) => { if (finalScore(e) === null && rollsScore(e) !== null) e.score = rollsScore(e); });
      ui.kp = null; commit(s); renderKeepingGameTabs();
    },
    openKp(el) {
      if (ui.kp && ui.kp.pid === el.dataset.id) return;
      ui.kp = { pid: el.dataset.id }; ui.kpScroll = true; render();
    },
    kp(el) { keypadPress(el.dataset.v); },
    async delRecord() {
      if (!(await ask(t('confirmDelRecord', dateLong(ui.date)), t('delete'), true))) return;
      delete db.sessions[ui.date]; ui.draft = null; ui.kp = null; save(); render();
    },
    certOpen() { openCert(); },
    goToday() { pickDate(ymd(new Date())); },
    recImg(el) {
      withBusy(async () => {
        const s = sess();
        const cv = await buildImage(dateLong(s.date), recordBlocks(s));
        await exportImage(cv, `BowlingSecretary_${s.date}.png`, el.dataset.mode);
      });
    },
    addMember() {
      if (addMember($('#mName').value, $('#mH').value)) { render(); const n = $('#mName'); if (n) n.focus(); }
    },
    editMember(el) { ui.editId = el.dataset.id; render(); const n = $('#eName'); if (n) n.focus(); },
    cancelEdit() { ui.editId = null; render(); },
    saveMember(el) {
      const m = memberById(el.dataset.id), name = $('#eName').value.trim();
      if (!name) { toast(t('nameRequired')); return; }
      if (db.members.some((x) => x.name === name && x.id !== m.id)) { toast(t('dupName')); return; }
      m.name = name; m.handicap = toHdcp($('#eH').value); ui.editId = null; save(); render();
    },
    async delMember(el) {
      const m = memberById(el.dataset.id);
      if (!(await ask(t('confirmDelMember', m.name), t('delete'), true))) return;
      db.members = db.members.filter((x) => x.id !== m.id); save(); render();
    },
    async costLoad() {
      const s = db.sessions[ui.date];
      if (!hasRecord(s)) { toast(t('noRecordForDate')); return; }
      const c = costDoc();
      if (c.rows.length && !(await ask(t('confirmReload')))) return;
      c.rows = rowsFromSession(s); commitCost(c); render(); toast(t('loaded'));
    },
    costToggle(el) { const c = costDoc(), r = c.rows.find((x) => x.id === el.dataset.id); r.on = !r.on; commitCost(c); render(); },
    costShoe(el) { const c = costDoc(), r = c.rows.find((x) => x.id === el.dataset.id); r.shoes = !r.shoes; commitCost(c); render(); },
    costGames(el) { const c = costDoc(), r = c.rows.find((x) => x.id === el.dataset.id); r.games = Math.min(99, Math.max(0, r.games + toInt(el.dataset.d))); commitCost(c); render(); },
    extraAdd() {
      const c = costDoc();
      (c.extras = c.extras || []).push({ id: uid(), label: '', amount: 0, mode: 'split', who: [] });
      commitCost(c); render();
      const inputs = $$('.xlabel'); if (inputs.length) inputs[inputs.length - 1].focus();
    },
    extraDel(el) { const c = costDoc(); c.extras = (c.extras || []).filter((x) => x.id !== el.dataset.id); commitCost(c); render(); },
    extraMode(el) {
      const c = costDoc(), x = (c.extras || []).find((e) => e.id === el.dataset.id);
      if (!x) return;
      x.mode = el.dataset.v;
      // One person: keep the first chosen person (or the first player); split: back to everyone.
      const firstOn = rowsByName(c.rows).find((r) => r.on);
      if (x.mode === 'one') x.who = x.who.length ? [x.who[0]] : firstOn ? [firstOn.id] : [];
      else x.who = [];
      commitCost(c); render();
    },
    extraWho(el) {
      const c = costDoc(), x = (c.extras || []).find((e) => e.id === el.dataset.id), pid = el.dataset.p;
      if (!x) return;
      if (x.mode === 'one') x.who = [pid];
      else {
        const cur = extraPayers(x, c);
        const next = cur.includes(pid) ? cur.filter((id) => id !== pid) : cur.concat(pid);
        if (!next.length) { toast(t('extraNeedOne')); return; }
        const all = c.rows.filter((r) => r.on).map((r) => r.id);
        x.who = next.length === all.length ? [] : next;
      }
      commitCost(c); render();
    },
    costRemove(el) { const c = costDoc(); c.rows = c.rows.filter((x) => x.id !== el.dataset.id); commitCost(c); render(); },
    costAdd(el) {
      const c = costDoc(), m = memberById(el.dataset.id), s = db.sessions[ui.date];
      c.rows.push({ id: m.id, name: m.name, on: true, games: hasRecord(s) ? s.games.filter((g) => gameHasScore(s, g)).length || 1 : 1, shoes: true });
      commitCost(c); render();
    },
    costImg(el) {
      withBusy(async () => {
        const c = costDoc();
        const cv = await buildImage(`${t('costTitle')} · ${dateLong(c.date)}`, costBlocks(c));
        await exportImage(cv, `BowlingSecretary_${c.date}_cost.png`, el.dataset.mode);
      });
    },
    lang(el) { db.settings.lang = el.dataset.v; save(); render(); },
    theme(el) { db.settings.theme = el.dataset.v; save(); applyTheme(); render(); },
    export: exportData,
    import() { const f = $('#importFile'); f.value = ''; f.click(); },
    async reset() {
      if (!(await ask(t('confirmReset'), t('delete'), true))) return;
      const settings = db.settings;
      db = normalize({ settings }); ui.draft = ui.cdraft = null; save(); render(); toast(t('resetDone'));
    },
  };

  /* ───────── Events ───────── */
  // Any other uncaught error (e.g. inside a button action) shows briefly instead of failing silently.
  window.addEventListener('error', (e) => { if (e.message) toast(`⚠ ${e.message}`); });
  window.addEventListener('unhandledrejection', (e) => { const r = e.reason; if (r && r.name !== 'AbortError') toast(`⚠ ${(r && r.message) || r}`); });
  document.addEventListener('click', (e) => {
    if (ui.tab === 'record' && e.target.closest('#sess.locked input[readonly]')) { lockedNudge(); return; }
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    if (ui.tab === 'record' && EDIT_ACTS.has(el.dataset.act) && isLocked(sess())) { lockedNudge(); return; }
    const fn = actions[el.dataset.act];
    if (fn) fn(el);
  });
  // Chart tooltips: hovering or tapping a bar shows its value above the plot.
  const showTip = (e) => {
    const bar = e.target.closest && e.target.closest('[data-tip]');
    if (!bar) return;
    const chart = bar.closest('.chart');
    $$('[data-tip].on', chart).forEach((b) => b.classList.remove('on'));
    bar.classList.add('on');
    $('.chart-tip', chart).textContent = bar.dataset.tip;
  };
  document.addEventListener('pointerover', showTip);
  document.addEventListener('scroll', (e) => { if (e.target.classList && e.target.classList.contains('tbl-wrap')) syncScrollBar(e.target); }, true);
  window.addEventListener('resize', updateScrollBars);
  document.addEventListener('click', showTip);
  // Money text fields: keep only digits (and one decimal point for dollars/euros), re-show them grouped
  // by 3 digits while typing, and return the number.
  // Amounts above moneyMax(kind) are cut to it, with a short note.
  function readMoneyInput(el, kind) {
    let raw = el.value.replace(/[^\d.]/g, '');
    if (!hasCents()) raw = raw.replace(/\./g, '');
    const [int = '', ...rest] = raw.split('.');
    const dec = rest.join('').slice(0, 2);
    const v = Number(`${int || 0}.${dec || 0}`), max = moneyMax(kind);
    if (v > max) { el.value = groupNum(max); toast(t('moneyMax', fmtMoney(max))); return max; }
    el.value = int === '' && !raw.includes('.') ? '' : Number(int || 0).toLocaleString('en-US') + (raw.includes('.') ? `.${dec}` : '');
    return v;
  }
  document.addEventListener('input', (e) => {
    // Handicap boxes on the member forms: keep the typed value within 0–HDCP_MAX.
    if (['qH', 'mH', 'eH'].includes(e.target.id) && e.target.value !== '' && String(toHdcp(e.target.value)) !== e.target.value) e.target.value = toHdcp(e.target.value);
    const el = e.target.closest('[data-inp]');
    if (!el) return;
    const k = el.dataset.inp;
    if ((k === 'hdcp' || k === 'score') && isLocked(sess())) return;
    if (k === 'hdcp') {
      const s = sess(), p = s.players.find((x) => x.id === el.dataset.id);
      if (!p) return;
      p.hdcp = toHdcp(el.value);
      if (el.value !== '' && String(p.hdcp) !== el.value) el.value = p.hdcp;
      commit(s); refreshRecordNumbers();
    } else if (k === 'score') {
      const s = sess(), g = curGame(s);
      let v = el.value === '' ? null : Math.max(0, Math.min(300, toInt(el.value)));
      if (v !== null && String(v) !== el.value) el.value = v;
      (g.entries[el.dataset.id] || (g.entries[el.dataset.id] = { score: null, rolls: [] })).score = v;
      commit(s); refreshRecordNumbers();
    } else if (k === 'fee') {
      const c = costDoc(), v = readMoneyInput(el, 'fee');
      c[el.dataset.k] = v; db.feeDefaults[el.dataset.k] = v;
      commitCost(c); refreshCostNumbers();
    } else if (k === 'extraAmt' || k === 'extraLabel') {
      const c = costDoc(), x = (c.extras || []).find((e) => e.id === el.dataset.id);
      if (!x) return;
      if (k === 'extraAmt') x.amount = readMoneyInput(el, 'extra'); else x.label = el.value.slice(0, 20);
      commitCost(c); refreshCostNumbers();
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'importFile') importData(e.target.files[0]);
  });
  // Enter in the name fields submits. While an IME is composing, Enter usually just commits the text: for Japanese/Chinese
  // that's picking the conversion, so it must not submit; for Korean it finishes the last syllable, and users expect the
  // same Enter to submit. So an Enter during composition waits for compositionend and submits only if Hangul was committed.
  // (Chrome fires keydown with isComposing before compositionend; Safari fires compositionend first, then keydown 229.)
  const ENTER_FIELDS = ['qName', 'qH', 'mName', 'mH', 'teamNameIn', 'eName', 'eH'];
  const HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;
  let imeEnter = null, lastCommit = null;
  function submitField(el) {
    const id = el.id;
    if (id === 'qName' || id === 'qH') quickAdd();
    else if (id === 'mName' || id === 'mH') actions.addMember();
    else if (id === 'teamNameIn') { const b = $('[data-act="saveTeamName"]'); if (b) actions.saveTeamName(b); }
    else if (id === 'eName' || id === 'eH') { const b = $('[data-act="saveMember"]'); if (b) actions.saveMember(b); }
  }
  document.addEventListener('compositionend', (e) => {
    const hangul = HANGUL.test(e.data || '');
    lastCommit = { el: e.target, hangul, at: Date.now() };
    if (imeEnter === e.target) { imeEnter = null; if (hangul) setTimeout(() => submitField(e.target)); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.keyCode !== 229) return;
    if (ENTER_FIELDS.includes(e.target.id)) {
      if (e.isComposing) { if (e.key === 'Enter') imeEnter = e.target; return; }
      if (e.keyCode === 229) {
        const c = lastCommit;
        if (e.key === 'Enter' && c && c.el === e.target && Date.now() - c.at < 150 && c.hangul) { e.preventDefault(); submitField(e.target); }
        return;
      }
      e.preventDefault(); submitField(e.target);
    } else if (e.key === 'Enter' && e.target.dataset.inp === 'score') {
      e.preventDefault();
      const all = $$('[data-inp="score"]'), i = all.indexOf(e.target);
      if (all[i + 1]) all[i + 1].focus(); else e.target.blur();
    }
  });

  /* ───────── Phone back button ───────── */
  // Android's back button used to close the app at once (there was no page history). Keep one extra history
  // entry: each back press lands in popstate, which closes the top layer (dialog, keypad, calendar), returns
  // to the record tab, and only on a second press within 2 seconds leaves the app.
  let lastBack = 0;
  function backStep() {
    const m = $('#modal');
    if (m && !m.hidden) {
      if (cert && cert.type) { cert.type = null; renderCert(); return true; }
      m.click(); // every dialog treats a tap on its backdrop as cancel/close
      return true;
    }
    if (ui.kp) { ui.kp = null; render(); return true; }
    if (ui.calOpen) { ui.calOpen = false; render(); return true; }
    if (ui.editId !== null && ui.editId !== undefined) { ui.editId = null; render(); return true; }
    if (ui.tab !== 'record') { ui.tab = 'record'; render(); window.scrollTo(0, 0); return true; }
    return false;
  }
  window.addEventListener('popstate', () => {
    if (backStep()) { history.pushState({ bb: 1 }, ''); return; }
    if (Date.now() - lastBack < 2000) { history.back(); return; } // second press: leave
    lastBack = Date.now();
    toast(t('backExit'));
    history.pushState({ bb: 1 }, '');
  });

  /* ───────── Boot ───────── */
  if (window.top !== window.self) { document.documentElement.innerHTML = ''; return; }
  applyTheme();
  render();
  if (!history.state || !history.state.bb) history.pushState({ bb: 1 }, '');
  const launch = $('#launch');
  if (launch) {
    const closeLaunch = () => { launch.classList.add('hide'); setTimeout(() => launch.remove(), 400); };
    setTimeout(closeLaunch, 1000);
    launch.addEventListener('click', closeLaunch);
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
    // No reload when an updated worker takes over: it fetches network-first with revalidation, so this launch
    // already runs the latest files, and a reload would flash the page.
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then((reg) => reg.update()).catch(() => {}));
  }
})();
