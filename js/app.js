/* Best Bowling — all data lives in this device's localStorage only. */
(() => {
  'use strict';

  const STORE_KEY = 'bestbowling:v1';
  const TEAMS = ['A', 'B', 'C', 'D'];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toInt = (v) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; };
  const HDCP_MAX = 300;
  const toHdcp = (v) => Math.min(HDCP_MAX, Math.max(0, toInt(v)));

  /* ───────── i18n ───────── */
  const I18N = {
    ko: {
      tabRecord: '기록', tabMembers: '회원', tabCost: '정산', tabStats: '통계', tabSettings: '설정',
      allPlayers: '전체', modeMixed: '혼합 입력', currency: '금액 단위', curKRW: '원화', curUSD: '달러', curEUR: '유로', entryHint: '입력한 점수에 따라 아래 경기 결과가 바로 바뀌어요', teamShort: '{0}팀', editTeamName: '팀 이름 수정', editRecord: '수정', lockedHint: '지난 기록이에요. 수정 버튼을 눌러야 바꿀 수 있어요', periodAll: '전체', periodMonth: '이번 달', period3m: '3개월', periodYear: '올해',
      noStatsPeriod: '이 기간에는 경기 기록이 없어요', appInfo: '앱 정보', appInfoSub: '볼링 상식 · 사용설명서 · 정책 · 라이선스', byPerson: '개인별', byTeam: '팀별', teamSettle: '팀별 정산', noTeam: '팀 없음', practice: '연습', firstPractice: '첫 경기는 연습',
      statsTitle: '통계', noStats: '아직 경기 기록이 없어요', high: '최고', low: '최저', over200: '200점 이상', hdcpAvg: '핸디 포함 평균',
      sessionsN: '{0}회 출전', byGame: '게임별', byFinal: '최종 점수별', trendGames: '게임별 점수 추이', trendFinal: '날짜별 평균 추이', lastN: '최근 {0}개',
      gameOrder: '게임 순서별 평균', highShort: '최고 {0}', gUnit: '게임', allGames: '전체 게임 기록', game: '게임', score: '점수',
      finalTable: '날짜별 최종 점수', tapRowHint: '날짜를 누르면 그날 기록으로 이동해요', leaderboard: '전체 순위', byAvg: '평균 기준',
      today: '오늘', recent: '최근 기록', noRecent: '아직 저장된 기록이 없어요', gamesPeople: '{0}게임 · {1}명',
      selectedDate: '선택한 날짜', participants: '참가 멤버', nPeople: '{0}명',
      noMembers: '등록된 멤버가 없어요. 아래에서 바로 추가해 보세요.', newMemberPh: '새 멤버 이름', hdcp: '핸디', add: '추가',
      individual: '개인전', teamMatch: '팀전', teamCount: '팀 수', teamHint: '멤버 옆의 팀 버튼(A·B…)을 눌러 팀을 옮길 수 있어요.', teamEmpty: '아직 멤버가 없어요', teamName: '{0}팀',
      pickHint: '참가할 멤버를 선택하면\n사람별로 점수를 입력할 수 있어요.',
      finalMode: '최종결과 입력', frameMode: '프레임별 입력',
      gameN: '{0}게임', deleteGame: '{0}게임 삭제', confirmDelGame: '{0}게임 기록을 삭제할까요?',
      tapToInput: '점수판을 누르면 키패드가 열려요',
      frameRoll: '{0}프레임 · {1}구', gameDone: '게임 완료', next: '다음 사람', done: '완료', allDone: '모든 멤버의 게임이 끝났어요',
      results: '경기 결과', name: '이름', total: '총점', avg: '평균', scratch: '스크래치', team: '팀',
      teamResults: '팀 결과', win: '승리', draw: '무승부',
      saveImage: '이미지 저장', share: '공유하기', autosave: '입력한 기록은 이 휴대폰에 자동 저장돼요',
      deleteRecord: '기록 삭제', confirmDelRecord: '{0}\n기록을 삭제할까요?',
      cancel: '취소', delete: '삭제', ok: '확인', save: '저장', close: '닫기',
      membersTitle: '회원 관리', addMember: '멤버 추가', memberName: '이름', defaultHdcp: '기본 핸디',
      memberCount: '총 {0}명', noMembersYet: '아직 등록된 멤버가 없어요.\n위에서 첫 멤버를 추가해 보세요.',
      statLine: '{0}게임 · 평균 {1} · 최고 {2}', noGames: '아직 경기 기록 없음',
      confirmDelMember: '{0} 님을 삭제할까요?\n지난 기록의 점수는 그대로 남아요.',
      nameRequired: '이름을 입력해 주세요', dupName: '이미 같은 이름의 멤버가 있어요', added: '{0} 님을 추가했어요',
      costTitle: '비용 정산', date: '날짜', gameFee: '경기비', perGame: '1게임당', shoeFee: '신발비', perPerson: '1인당',
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
      allPlayers: 'All', modeMixed: 'Mixed input', currency: 'Currency', curKRW: 'KRW ₩', curUSD: 'USD $', curEUR: 'EUR €', entryHint: 'Results below update as you enter scores', teamShort: '{0}', editTeamName: 'Rename team', editRecord: 'Edit', lockedHint: 'This is a past record — tap Edit to change it', periodAll: 'All', periodMonth: 'This month', period3m: '3 months', periodYear: 'This year',
      noStatsPeriod: 'No games in this period', appInfo: 'About', appInfoSub: 'Bowling basics · guide · policies · licenses', byPerson: 'Per person', byTeam: 'Per team', teamSettle: 'Per team', noTeam: 'No team', practice: 'Practice', firstPractice: '1st game is practice',
      statsTitle: 'Statistics', noStats: 'No games recorded yet', high: 'High', low: 'Low', over200: '200+ games', hdcpAvg: 'Avg with HDCP',
      sessionsN: '{0} sessions', byGame: 'By game', byFinal: 'By session', trendGames: 'Game scores', trendFinal: 'Average by date', lastN: 'Last {0}',
      gameOrder: 'Average by game order', highShort: 'High {0}', gUnit: 'g', allGames: 'All games', game: 'Game', score: 'Score',
      finalTable: 'Final scores by date', tapRowHint: 'Tap a date to open that day\'s scores', leaderboard: 'Leaderboard', byAvg: 'by average',
      today: 'Today', recent: 'Recent', noRecent: 'No saved records yet', gamesPeople: '{0} games · {1}',
      selectedDate: 'Selected date', participants: 'Players', nPeople: '{0} players',
      noMembers: 'No members yet. Add one right below.', newMemberPh: 'New member name', hdcp: 'HDCP', add: 'Add',
      individual: 'Singles', teamMatch: 'Teams', teamCount: 'Teams', teamHint: 'Tap a team letter next to a player to move them.', teamEmpty: 'No players yet', teamName: 'Team {0}',
      pickHint: 'Select the players\nto start entering scores.',
      finalMode: 'Final Score', frameMode: 'By Frame',
      gameN: 'Game {0}', deleteGame: 'Delete game {0}', confirmDelGame: 'Delete game {0}?',
      tapToInput: 'Tap a score sheet to open the keypad',
      frameRoll: 'Frame {0} · Ball {1}', gameDone: 'Game complete', next: 'Next', done: 'Done', allDone: 'Everyone has finished the game',
      results: 'Results', name: 'Name', total: 'Total', avg: 'Avg', scratch: 'Scratch', team: 'Team',
      teamResults: 'Team results', win: 'Win', draw: 'Draw',
      saveImage: 'Save image', share: 'Share', autosave: 'Scores are saved automatically on this phone',
      deleteRecord: 'Delete record', confirmDelRecord: 'Delete the record for\n{0}?',
      cancel: 'Cancel', delete: 'Delete', ok: 'OK', save: 'Save', close: 'Close',
      membersTitle: 'Members', addMember: 'Add member', memberName: 'Name', defaultHdcp: 'Handicap',
      memberCount: '{0} total', noMembersYet: 'No members yet.\nAdd your first member above.',
      statLine: '{0} games · avg {1} · high {2}', noGames: 'No games yet',
      confirmDelMember: 'Delete {0}?\nPast scores will be kept.',
      nameRequired: 'Please enter a name', dupName: 'A member with that name already exists', added: '{0} added',
      costTitle: 'Settle up', date: 'Date', gameFee: 'Game fee', perGame: 'per game', shoeFee: 'Shoe rental', perPerson: 'per person',
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
  const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const entries = (o) => (isObj(o) ? Object.keys(o).map((k) => [k, o[k]]) : []);
  function cleanSession(date, x) {
    const teamCount = clampInt(x.teamCount, 2, 4, 2);
    const players = (Array.isArray(x.players) ? x.players : []).filter((q) => isObj(q) && ID_RE.test(q.id))
      .map((q) => ({ id: q.id, name: str(q.name, 40), hdcp: clampInt(q.hdcp, 0, 300), team: clampInt(q.team, 0, teamCount - 1) }));
    const games = (Array.isArray(x.games) ? x.games : []).slice(0, 50).filter(isObj).map((g) => {
      const ent = {};
      entries(g.entries).forEach(([id, e]) => {
        if (!ID_RE.test(id) || !isObj(e)) return;
        const score = e.score === null || e.score === undefined || e.score === '' ? null : clampInt(e.score, 0, 300, null);
        const rolls = (Array.isArray(e.rolls) ? e.rolls : []).slice(0, 21).map((r) => clampInt(r, 0, 10));
        ent[id] = { score, rolls };
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
      date, gameFee: money(x.gameFee, 0), shoeFee: money(x.shoeFee, 0),
      rows: (Array.isArray(x.rows) ? x.rows : []).filter((r) => isObj(r) && ID_RE.test(r.id))
        .map((r) => ({ id: r.id, name: str(r.name, 40), on: r.on !== false, games: clampInt(r.games, 0, 99), shoes: !!r.shoes })),
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
        .map((m) => ({ id: m.id, name: str(m.name, 40), handicap: clampInt(m.handicap, 0, 300) })),
      sessions, costs,
      settings: { lang: ['ko', 'en'].includes(st.lang) ? st.lang : ko ? 'ko' : 'en', theme: ['light', 'dark', 'system'].includes(st.theme) ? st.theme : 'system',
        ...(['KRW', 'USD', 'EUR'].includes(st.currency) ? { currency: st.currency } : {}) },
      feeDefaults: { gameFee: money(fee.gameFee, 3000), shoeFee: money(fee.shoeFee, 1500) },
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
    crown: '<path d="M3 18h18l-1.5-10-5 4L12 5l-2.5 7-5-4z"/>',
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
  const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

  /* ───────── Formatting ───────── */
  function dateLong(k) {
    const d = parseYmd(k), w = WD[lang()][d.getDay()];
    return lang() === 'ko'
      ? `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${w})`
      : `${w}, ${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  function dateShort(k) {
    const d = parseYmd(k);
    return { main: `${d.getMonth() + 1}.${pad(d.getDate())}`, wd: WD[lang()][d.getDay()] };
  }
  const monthLabel = (y, m) => (lang() === 'ko' ? `${y}년 ${m + 1}월` : `${MON[m]} ${y}`);
  // Currency for the settle tab: chosen there (원화/달러/유로), otherwise won in Korean and dollars in English.
  // Won is whole numbers; dollars and euros allow cents.
  const CURRENCIES = ['KRW', 'USD', 'EUR'];
  const currency = () => (CURRENCIES.includes(db.settings.currency) ? db.settings.currency : lang() === 'ko' ? 'KRW' : 'USD');
  const hasCents = () => currency() !== 'KRW';
  // "12,345" / "12,345.5" — digits grouped by 3; up to 2 decimals for dollars/euros.
  const groupNum = (n) => (hasCents()
    ? (n || 0).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n || 0) ? 0 : 2, maximumFractionDigits: 2 })
    : Math.round(n || 0).toLocaleString('en-US'));
  function fmtMoney(n) {
    const c = currency();
    if (c === 'KRW') return lang() === 'ko' ? `${groupNum(n)}원` : `₩${groupNum(n)}`;
    return `${c === 'USD' ? '$' : '€'}${groupNum(n)}`;
  }
  function moneyInput(k, v) {
    const c = currency();
    const input = `<input type="text" inputmode="${hasCents() ? 'decimal' : 'numeric'}" autocomplete="off" data-inp="fee" data-k="${k}" value="${esc(groupNum(v))}">`;
    if (c === 'KRW' && lang() === 'ko') return `<div class="money">${input}<em>원</em></div>`;
    return `<div class="money"><em>${c === 'KRW' ? '₩' : c === 'USD' ? '$' : '€'}</em>${input}</div>`;
  }

  /* ───────── Bowling scoring ───────── */
  // Where the next ball goes: frame index, ball within frame, pins standing.
  function frameState(rolls) {
    let i = 0;
    for (let f = 0; f < 9; f++) {
      if (i >= rolls.length) return { frame: f, ball: 0, standing: 10, done: false };
      if (rolls[i] === 10) { i++; continue; }
      if (i + 1 >= rolls.length) return { frame: f, ball: 1, standing: 10 - rolls[i], done: false };
      i += 2;
    }
    const r = rolls.slice(i), n = r.length;
    if (n === 0) return { frame: 9, ball: 0, standing: 10, done: false };
    if (n === 1) return { frame: 9, ball: 1, standing: r[0] === 10 ? 10 : 10 - r[0], done: false };
    if (n === 2) {
      if (r[0] === 10) return { frame: 9, ball: 2, standing: r[1] === 10 ? 10 : 10 - r[1], done: false };
      if (r[0] + r[1] === 10) return { frame: 9, ball: 2, standing: 10, done: false };
    }
    return { frame: 9, ball: n, standing: 0, done: true };
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
    renderTabbar();
    const v = $('#view');
    const prevTabs = $('.gtabs');
    const tabsScroll = prevTabs ? prevTabs.scrollLeft : 0;
    v.innerHTML = ui.tab === 'record' ? renderRecord()
      : ui.tab === 'members' ? renderMembers()
      : ui.tab === 'cost' ? renderCost()
      : ui.tab === 'stats' ? renderStats()
      : renderSettings();
    keepGameTabInView(tabsScroll);
    updateScrollBars();
    applyLock();
    renderKeypad();
  }
  // Locked past record: inputs become read-only and editing controls are disabled (actions are also guarded).
  function applyLock() {
    const sec = $('#sess');
    if (!sec || ui.tab !== 'record') return;
    const locked = isLocked(sess());
    sec.classList.toggle('locked', locked);
    if (!locked) return;
    $$('input', sec).forEach((i) => { i.readOnly = true; });
    $$('[data-act]', sec).forEach((b) => { if (EDIT_ACTS.has(b.dataset.act) && 'disabled' in b) b.disabled = true; });
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
    if (!ui.calOpen) {
      const isToday = ui.date === ymd(new Date());
      return `<div class="card cal-bar">
        <button class="cal-open" data-act="calToggle" aria-expanded="false">
          <span class="set-ic">${ic('calendar')}</span>
          <span class="cal-txt"><small>${isToday ? t('today') : t('selectedDate')}</small><b>${dateLong(ui.date)}</b></span>
          ${ic('down')}
        </button>
        ${isToday ? '' : `<button class="cal-today" data-act="calToday">${t('today')}</button>`}
      </div>`;
    }
    const y = ui.calY, m = ui.calM;
    const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    const today = ymd(new Date());
    let cells = '';
    for (let i = 0; i < first; i++) cells += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const k = `${y}-${pad(m + 1)}-${pad(d)}`;
      const cls = ['cal-d', (first + d - 1) % 7 === 0 && 'sun', k === today && 'today', hasRecord(db.sessions[k]) && 'has', k === ui.date && 'sel'].filter(Boolean).join(' ');
      const future = k > today;
      cells += `<button class="${cls}${future ? ' future' : ''}" data-act="pick" data-date="${esc(k)}" ${future ? 'disabled' : ''}><span>${d}</span></button>`;
    }
    return `<div class="card cal">
      <div class="cal-h">
        <button class="cal-nav" data-act="calToggle" aria-expanded="true" aria-label="close">${ic('up')}</button>
        <b>${monthLabel(y, m)}</b>
        <button class="cal-today" data-act="calToday">${t('today')}</button>
        <button class="cal-nav" data-act="calMove" data-d="-1" aria-label="prev">${ic('left')}</button>
        <button class="cal-nav" data-act="calMove" data-d="1" aria-label="next" ${`${y}-${pad(m + 1)}` >= today.slice(0, 7) ? 'disabled' : ''}>${ic('right')}</button>
      </div>
      <div class="cal-w">${WD[lang()].map((w) => `<span>${lang() === 'en' ? w[0] : w}</span>`).join('')}</div>
      <div class="cal-g">${cells}</div>
    </div>`;
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
        <input id="qH" class="field num" type="number" min="0" max="300" inputmode="numeric" placeholder="${t('hdcp')}">
        <button class="btn sm gold" data-act="quickAdd">${t('add')}</button>
      </div>`;
    if (s.players.length) {
      h += `<div class="divider"></div>
        <div class="seg">
          <button class="${!s.teamMode ? 'on' : ''}" data-act="matchMode" data-v="0">${ic('pin')}${t('individual')}</button>
          <button class="${s.teamMode ? 'on' : ''}" data-act="matchMode" data-v="1">${ic('users')}${t('teamMatch')}</button>
        </div>`;
      const hdInput = (p) => `<label class="hd"><span class="hd-l">${t('hdcp')}</span><input class="field num sm" type="number" inputmode="numeric" aria-label="${t('hdcp')}" min="0" max="300" data-inp="hdcp" data-id="${esc(p.id)}" value="${toInt(p.hdcp)}"></label>`;
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
      const cells = splitFrames(rolls).map((f, i) => {
        const cur = active && !st.done && st.frame === i;
        return `<div class="fr ${i === 9 ? 'f10' : ''} ${cur ? 'cur' : ''}"><div class="fr-n">${i + 1}</div>
          <div class="fr-r">${frameMarks(f, i).map((x) => `<span>${x}</span>`).join('')}</div>
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
    const tabs = s.games.map((x, i) => `<button class="gtab ${i === s.active ? 'on' : ''}" data-act="game" data-i="${i}">${t('gameN', i + 1)}${isPractice(s, i) ? `<small class="prac-tag">${t('practice')}</small>` : ''}</button>`).join('');
    const filter = s.teamMode ? `<div class="seg entry-filter">
        <button class="${ui.entryTeam === 'all' ? 'on' : ''}" data-act="entryTeam" data-v="all">${t('allPlayers')}</button>
        ${TEAMS.slice(0, s.teamCount).map((L, j) => `<button class="${ui.entryTeam === j ? 'on' : ''}" data-act="entryTeam" data-v="${j}"><span class="tdot t${j}"></span><span class="fl">${s.teamNames && s.teamNames[j] ? esc(s.teamNames[j]) : t('teamShort', L)}</span></button>`).join('')}
      </div>` : '';
    return `<div class="card">
      <div class="entry-top">
        <p class="entry-hint">${ic('info')}${t('entryHint')}</p>
        <button class="mini-toggle ${s.firstPractice ? 'on' : ''}" data-act="practice" aria-pressed="${!!s.firstPractice}">${ic('check')}${t('firstPractice')}</button>
      </div>
      <div class="mode-switch">
        <button class="mode ${g.mode === 'final' ? 'on' : ''}" data-act="mode" data-v="final">${ic('edit')}<span>${t('finalMode')}</span></button>
        <button class="mode ${g.mode === 'frame' ? 'on' : ''}" data-act="mode" data-v="frame">${ic('frames')}<span>${t('frameMode')}</span></button>
      </div>
      <div class="gtabs">${tabs}<button class="gtab add" data-act="addGame" aria-label="add game">+</button></div>
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
    let h = `<div class="card-h"><h3>${ic('crown')}${t('results')}<span class="mode-tag">${modeTag}</span></h3></div>
      <div class="tbl-wrap"><table class="tbl pin2"><thead><tr><th></th><th class="nm">${t('name')}</th>${gh}<th>${t('hdcp')}</th><th>${t('total')}</th><th>${t('avg')}</th></tr></thead><tbody>
      ${st.map((x, i) => `<tr>
        <td class="rkn ${x.played && i === 0 ? 'top' : ''}">${i + 1}</td>
        <td class="nm"><span class="nm-in">${s.teamMode ? `<span class="tl tl${x.p.team}">${TEAMS[x.p.team]}</span>&nbsp;` : ''}${esc(pname(x.p))}</span></td>
        ${x.scores.map((v, gi) => `<td class="${v === null || isPractice(s, gi) ? 'dim' : ''} ${isPractice(s, gi) ? 'prac' : ''}">${v === null ? '-' : v}</td>`).join('')}
        <td class="dim">${x.hdcp ? '+' + x.hdcp : 0}</td><td class="tot">${x.total}</td><td>${x.avg}</td></tr>`).join('')}
      </tbody></table></div>`;
    if (s.teamMode) {
      h += `<div class="teams">${teamStats(s).map((x) => `<div class="team-card ${x.win ? 'win' : ''}">
          <span class="team-badge t${x.ti}">${TEAMS[x.ti]}</span>
          <div class="tm"><b>${esc(teamLabel(s, x.ti))}${x.win ? ic('crown') : ''}</b>
            <small>${x.ps.map((p) => esc(pname(p))).join(', ') || '—'}</small></div>
          <div class="tt">${x.total}<small>${x.win ? t('win') : x.draw ? t('draw') : ''}</small></div>
          <div class="tg">${x.games.map((v, i) => `<span class="${isPractice(s, i) ? 'prac' : ''}">${isPractice(s, i) ? t('practice') : `G${i + 1}`} <b>${v ?? '-'}</b></span>`).join('')}</div></div>`).join('')}</div>`;
    }
    return h;
  }
  function renderRecord() {
    const s = sess();
    let h = calendarHTML() + recentHTML();
    h += `<section id="sess">
      <div class="sess-h"><div><div class="eyebrow">${t('selectedDate')}</div><h2 class="display">${dateLong(s.date)}</h2></div>
        <div class="sess-btns">${isLocked(s)
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
        </div>`;
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
    el.innerHTML = `<div class="kp-h">${avatar(s, p)}
        <div><div class="pn">${esc(pname(p))}</div><div class="info">${st.done ? t('gameDone') : t('frameRoll', st.frame + 1, st.ball + 1)}</div></div>
        <div class="sc">${sc ?? 0}</div></div>
      <div class="kp-g">
        ${num(1)}${num(2)}${num(3)}<button class="sp" data-act="kp" data-v="X" ${!st.done && st.standing === 10 ? '' : 'disabled'}>X</button>
        ${num(4)}${num(5)}${num(6)}<button class="sp" data-act="kp" data-v="/" ${!st.done && st.standing < 10 ? '' : 'disabled'}>/</button>
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
    if (v === 'back') { e.rolls.pop(); commit(s); render(); return; }
    const st = frameState(e.rolls);
    if (st.done) return;
    let pins;
    if (v === 'X') { if (st.standing !== 10) return; pins = 10; }
    else if (v === '/') { if (st.standing === 10) return; pins = st.standing; }
    else { pins = toInt(v); if (pins >= st.standing) return; }
    e.rolls.push(pins);
    commit(s);
    const ns = frameState(e.rolls);
    if (ns.done || ns.frame !== st.frame) moveToNextPlayer(s, g);
    render();
  }

  /* ───────── Render: members tab ───────── */
  function renderMembers() {
    const list = membersByName().map((m) => {
      if (ui.editId === m.id) {
        return `<div class="mcard editing">
          <div class="medit"><input id="eName" class="field" value="${esc(m.name)}" maxlength="20" aria-label="${t('memberName')}">
            <label class="hd hd-edit"><input id="eH" class="field num sm" type="number" min="0" max="300" inputmode="numeric" aria-label="${t('hdcp')}" value="${toInt(m.handicap)}"></label></div>
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
          <div><label class="field-l" for="mH">${t('defaultHdcp')}</label><input id="mH" class="field num" type="number" min="0" max="300" inputmode="numeric" placeholder="0"></div>
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
  const rowAmount = (r, c) => (r.on ? Math.round((r.games * c.gameFee + (r.shoes ? c.shoeFee : 0)) * 100) / 100 : 0);
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
  function costTotalsHTML(c) {
    const x = costTotals(c);
    return `<div class="eyebrow">${t('grandTotal')}</div>
      <div class="hero-total">${fmtMoney(x.total)}</div>
      <div class="hero-grid"><div><small>${t('people')}</small><b>${x.people}</b></div><div><small>${t('totalGames')}</small><b>${x.games}</b></div></div>`;
  }
  function renderCost() {
    const c = costDoc();
    const inRows = new Set(c.rows.map((r) => r.id));
    const rows = rowsByName(c.rows).map((r) => `<div class="crow ${r.on ? '' : 'off'}">
        <div class="crow-top">
          <button class="check ${r.on ? 'on' : ''}" data-act="costToggle" data-id="${esc(r.id)}" aria-label="include">${ic('check')}</button>
          <span class="pname">${esc(rowName(r))}</span>
          <span class="amt" id="amt-${esc(r.id)}">${fmtMoney(rowAmount(r, c))}</span>
        </div>
        <div class="crow-bot">
          <div class="stepper"><button data-act="costGames" data-id="${esc(r.id)}" data-d="-1">−</button><b>${r.games}</b><small>G</small><button data-act="costGames" data-id="${esc(r.id)}" data-d="1">+</button></div>
          <button class="pill ${r.shoes ? 'on' : ''}" data-act="costShoe" data-id="${esc(r.id)}">${ic('shoe')}${t('shoesIncl')}</button>
          <button class="x-btn" data-act="costRemove" data-id="${esc(r.id)}" aria-label="${t('delete')}">${ic('x')}</button>
        </div></div>`).join('');
    const others = membersByName().filter((m) => !inRows.has(m.id));
    const groups = costTeams(c), teamView = !!groups && ui.costView === 'team';
    return `<div class="page-h"><div><div class="eyebrow">Settlement</div><h2 class="display">${t('costTitle')}</h2></div></div>
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
      <div class="card hero" id="costTotals">${costTotalsHTML(c)}</div>
      <div class="actions">
        <button class="btn ghost" data-act="costImg" data-mode="save">${ic('download')}${t('saveImage')}</button>
        <button class="btn gold" data-act="costImg" data-mode="share">${ic('share')}${t('share')}</button>
      </div>`;
  }
  function refreshCostNumbers() {
    const c = costDoc();
    c.rows.forEach((r) => { const el = $(`#amt-${r.id}`); if (el) el.textContent = fmtMoney(rowAmount(r, c)); });
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
  function memberGames(id) {
    const out = [], from = periodFrom();
    Object.values(db.sessions).sort((a, b) => a.date.localeCompare(b.date)).forEach((s) => {
      const p = s.players.find((x) => x.id === id);
      if (!p || s.date < from) return;
      usedGames(s).forEach((g, gi) => {
        const v = entryScore(g, id);
        if (v !== null && !isPractice(s, gi)) out.push({ date: s.date, gi, score: v, hdcp: toInt(p.hdcp) });
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
    let h = `<div class="page-h"><div><div class="eyebrow">Statistics</div><h2 class="display">${t('statsTitle')}</h2></div></div>
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
        <button class="${ui.statView === 'final' ? 'on' : ''}" data-act="statView" data-v="final">${ic('crown')}${t('byFinal')}</button>
      </div>`;

    if (ui.statView !== 'final') {
      const recent = games.slice(-20);
      const order = [];
      games.forEach((g) => { (order[g.gi] = order[g.gi] || []).push(g.score); });
      const bestAvg = Math.max(...order.filter(Boolean).map(avgOf));
      h += `<div class="card"><div class="card-h"><h3>${ic('chart')}${t('trendGames')}</h3><span class="muted">${t('lastN', recent.length)}</span></div>
          ${lineChart(recent.map((g) => ({ value: g.score, label: sd(g.date), tip: `${sd(g.date)} · ${t('gameN', g.gi + 1)} · ${g.score}` })), t('trendGames'))}</div>
        <div class="card"><div class="card-h"><h3>${ic('frames')}${t('gameOrder')}</h3></div>
          <div class="order-list">${order.map((arr, i) => (arr ? `<div class="order-row">
            <span class="order-n">${t('gameN', i + 1)}</span>
            <div class="order-bar"><i style="width:${(avgOf(arr) / 300) * 100}%"></i></div>
            <span class="order-v ${avgOf(arr) === bestAvg ? 'best' : ''}">${avgOf(arr)}</span>
            <small>${t('highShort', Math.max(...arr))} · ${arr.length}${t('gUnit')}</small></div>` : '')).join('')}</div></div>
        <div class="card"><div class="card-h"><h3>${ic('pin')}${t('allGames')}</h3><span class="muted">${games.length}</span></div>
          <div class="tbl-wrap ${games.length > 10 ? 'tbl-scroll' : ''}"><table class="tbl"><thead><tr><th class="nm">${t('date')}</th><th>${t('game')}</th><th>${t('score')}</th><th>${t('hdcp')}</th><th>${t('total')}</th></tr></thead><tbody>
          ${games.slice().reverse().map((g) => `<tr><td class="nm">${sd(g.date)} <small class="muted">${dateShort(g.date).wd}</small></td><td>G${g.gi + 1}</td>
            <td class="${g.score >= 200 ? 'tot' : ''}">${g.score}</td><td class="dim">${g.hdcp ? '+' + g.hdcp : 0}</td><td><b>${g.score + g.hdcp}</b></td></tr>`).join('')}
          </tbody></table></div></div>`;
    } else {
      const recent = sessions.slice(-12);
      const bestFinal = Math.max(...sessions.map((x) => x.final));
      h += `<div class="card"><div class="card-h"><h3>${ic('chart')}${t('trendFinal')}</h3><span class="muted">${t('lastN', recent.length)}</span></div>
          ${barChart(recent.map((x) => ({ value: x.avg, label: sd(x.date), tip: `${sd(x.date)} · ${t('avg')} ${x.avg} · ${t('total')} ${x.final}` })), t('trendFinal'))}</div>
        <div class="card"><div class="card-h"><h3>${ic('crown')}${t('finalTable')}</h3><span class="muted">${t('sessionsN', sessions.length)}</span></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th class="nm">${t('date')}</th><th>${t('games')}</th><th>${t('scratch')}</th><th>${t('hdcp')}</th><th>${t('total')}</th><th>${t('avg')}</th></tr></thead><tbody>
          ${sessions.slice().reverse().map((x) => `<tr class="link-row" data-act="pick" data-date="${esc(x.date)}" data-goto="record"><td class="nm">${sd(x.date)} <small class="muted">${dateShort(x.date).wd}</small></td><td>${x.games}</td><td>${x.sum}</td>
            <td class="dim">${x.hdcp ? '+' + x.hdcp : 0}</td><td class="tot">${x.final === bestFinal ? '♛ ' : ''}${x.final}</td><td>${x.avg}</td></tr>`).join('')}
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
      <div class="about"><img src="icons/icon.svg" alt=""><h2>Best <em>Bowling</em></h2><p>VERSION ${APP_VERSION}</p></div>`;
  }

  /* ───────── Documents (guide, policies) ───────── */
  const APP_VERSION = '1.0';
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
  const darkMq = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() {
    const th = db.settings.theme, root = document.documentElement;
    if (th === 'system') root.removeAttribute('data-theme'); else root.dataset.theme = th;
    const dark = th === 'dark' || (th === 'system' && darkMq.matches);
    $('meta[name="theme-color"]').setAttribute('content', dark ? '#0c0e13' : '#f5f2ec');
  }
  darkMq.addEventListener && darkMq.addEventListener('change', applyTheme);

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
  // Simple three-point crown, 28px wide, vertically centred on cy.
  function drawCrown(x, X, cy) {
    x.save();
    x.fillStyle = '#e9c97e';
    x.beginPath();
    x.moveTo(X, cy + 9); x.lineTo(X, cy - 7); x.lineTo(X + 8, cy);
    x.lineTo(X + 14, cy - 11); x.lineTo(X + 20, cy); x.lineTo(X + 28, cy - 7); x.lineTo(X + 28, cy + 9);
    x.closePath(); x.fill();
    x.fillRect(X, cy + 11, 28, 3);
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
          drawCrown(x, xs[i] + 14 + x.measureText(s).width + 12, cy);
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
    x.fillStyle = gold; x.font = `italic 600 60px ${IMG_SERIF}`; x.fillText('Best Bowling', PADX + 134, PADX + 62);
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
    if (groups && ui.costView === 'team') {
      const teamName = (id) => { const g = groups.find((gg) => gg.rows.some((r) => r.id === id)); return g && g.ti >= 0 ? `${TEAMS[g.ti]} · ` : ''; };
      return [
        { type: 'kv', items: [[`${t('gameFee')} · ${t('perGame')}`, fmtMoney(c.gameFee)], [`${t('shoeFee')} · ${t('perPerson')}`, fmtMoney(c.shoeFee)]] },
        {
          type: 'table', title: t('teamSettle'),
          cols: [{ t: t('team'), w: 2.2, al: 'l', bold: true }, { t: t('people'), w: 1, al: 'c' }, { t: t('games'), w: 1, al: 'c' }, { t: t('amount'), w: 1.8, al: 'r', gold: true }],
          rows: groups.map((g) => ({ cells: [g.ti === -1 ? t('noTeam') : teamImgLabel(db.sessions[c.date], g.ti), g.rows.length, g.games, fmtMoney(g.total)] })),
        },
        {
          type: 'table', title: t('perPersonTitle'),
          cols: [{ t: t('name'), w: 2.6, al: 'l', bold: true }, { t: t('games'), w: 1, al: 'c' }, { t: t('shoes'), w: 1, al: 'c' }, { t: t('amount'), w: 1.8, al: 'r', gold: true }],
          rows: groups.flatMap((g) => g.rows).map((r) => ({ cells: [teamName(r.id) + rowName(r), r.games, r.shoes ? '✓' : '–', fmtMoney(rowAmount(r, c))] })),
        },
        { type: 'kv', big: true, items: [[t('people'), String(x.people)], [t('totalGames'), String(x.games)], [t('grandTotal'), fmtMoney(x.total)]] },
      ];
    }
    return [
      { type: 'kv', items: [[`${t('gameFee')} · ${t('perGame')}`, fmtMoney(c.gameFee)], [`${t('shoeFee')} · ${t('perPerson')}`, fmtMoney(c.shoeFee)]] },
      {
        type: 'table', title: t('perPersonTitle'),
        cols: [{ t: t('name'), w: 2.6, al: 'l', bold: true }, { t: t('games'), w: 1, al: 'c' }, { t: t('shoes'), w: 1, al: 'c' }, { t: t('amount'), w: 1.8, al: 'r', gold: true }],
        rows: on.map((r) => ({ cells: [rowName(r), r.games, r.shoes ? '✓' : '–', fmtMoney(rowAmount(r, c))] })),
      },
      { type: 'kv', big: true, items: [[t('people'), String(x.people)], [t('totalGames'), String(x.games)], [t('grandTotal'), fmtMoney(x.total)]] },
    ];
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
      try { await navigator.share({ files: [file], title: 'Best Bowling' }); }
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

  /* ───────── Backup ───────── */
  const backupText = () => JSON.stringify({ app: 'best-bowling', version: 1, exportedAt: new Date().toISOString(), data: db }, null, 2);
  const backupName = () => `best-bowling-backup-${ymd(new Date())}`;
  function exportData() {
    downloadBlob(new Blob([backupText()], { type: 'application/json' }), `${backupName()}.json`);
    toast(t('exported'));
  }
  async function importData(file) {
    if (!file) return;
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
    if (k > ymd(new Date())) return;
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
    pick(el) {
      if (el.dataset.goto) { ui.tab = el.dataset.goto; window.scrollTo(0, 0); }
      pickDate(el.dataset.date, !!el.dataset.scroll || !!el.dataset.goto);
    },
    entryTeam(el) { ui.entryTeam = el.dataset.v === 'all' ? 'all' : toInt(el.dataset.v); ui.kp = null; render(); },
    editTeamName(el) { ui.editTeam = toInt(el.dataset.t); render(); const i = $('#teamNameIn'); if (i) { i.focus(); i.select(); } },
    saveTeamName(el) {
      const s = sess(), ti = toInt(el.dataset.t), name = ($('#teamNameIn') || {}).value || '';
      s.teamNames = s.teamNames || [];
      s.teamNames[ti] = name.trim();
      ui.editTeam = null; commit(s); render();
    },
    currency(el) {
      db.settings.currency = el.dataset.v;
      // Won has no cents: round this sheet's fees (and the defaults) so what's shown is what's charged.
      if (!hasCents()) {
        const c = costDoc();
        ['gameFee', 'shoeFee'].forEach((k) => { c[k] = Math.round(c[k] || 0); db.feeDefaults[k] = Math.round(db.feeDefaults[k] || 0); });
        if (db.costs[c.date]) commitCost(c);
      }
      save(); render();
    },
    costView(el) { ui.costView = el.dataset.v; render(); },
    unlock() { ui.unlocked = ui.date; render(); },
    lock() { ui.unlocked = null; ui.kp = null; ui.editTeam = null; render(); },
    practice() { const s = sess(); s.firstPractice = !s.firstPractice; commit(s); render(); },
    statPeriod(el) { ui.statPeriod = el.dataset.v; render(); },
    doc(el) { showDoc(el.dataset.k); },
    statPick(el) { ui.statId = el.dataset.id; render(); },
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
    game(el) { const s = sess(); s.active = toInt(el.dataset.i); ui.kp = null; commit(s); render(); },
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
      ui.kp = null; commit(s); render();
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
    recImg(el) {
      withBusy(async () => {
        const s = sess();
        const cv = await buildImage(dateLong(s.date), recordBlocks(s));
        await exportImage(cv, `BestBowling_${s.date}.png`, el.dataset.mode);
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
        await exportImage(cv, `BestBowling_${c.date}_cost.png`, el.dataset.mode);
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
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    if (ui.tab === 'record' && EDIT_ACTS.has(el.dataset.act) && isLocked(sess())) { toast(t('lockedHint')); return; }
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
  document.addEventListener('input', (e) => {
    // Handicap boxes on the member forms: keep the typed value within 0–300.
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
      // Keep only digits (and one decimal point for dollars/euros), then re-show it grouped by 3 digits.
      let raw = el.value.replace(/[^\d.]/g, '');
      if (!hasCents()) raw = raw.replace(/\./g, '');
      const [int = '', ...rest] = raw.split('.');
      const dec = rest.join('').slice(0, 2);
      const v = Math.min(1e9, Number(`${int || 0}.${dec || 0}`));
      const c = costDoc();
      c[el.dataset.k] = v; db.feeDefaults[el.dataset.k] = v;
      el.value = int === '' && !raw.includes('.') ? '' : Number(int || 0).toLocaleString('en-US') + (raw.includes('.') ? `.${dec}` : '');
      commitCost(c); refreshCostNumbers();
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'importFile') importData(e.target.files[0]);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const id = e.target.id;
    if (id === 'qName' || id === 'qH') { e.preventDefault(); quickAdd(); }
    else if (id === 'mName' || id === 'mH') { e.preventDefault(); actions.addMember(); }
    else if (id === 'teamNameIn') { e.preventDefault(); const b = $('[data-act="saveTeamName"]'); if (b) actions.saveTeamName(b); }
    else if (id === 'eName' || id === 'eH') { e.preventDefault(); const b = $('[data-act="saveMember"]'); if (b) actions.saveMember(b); }
    else if (e.target.dataset.inp === 'score') {
      e.preventDefault();
      const all = $$('[data-inp="score"]'), i = all.indexOf(e.target);
      if (all[i + 1]) all[i + 1].focus(); else e.target.blur();
    }
  });

  /* ───────── Boot ───────── */
  applyTheme();
  render();
  const splash = $('#splash');
  if (splash) {
    const closeSplash = () => { splash.classList.add('hide'); setTimeout(() => splash.remove(), 500); };
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(closeSplash, reduce ? 500 : 1300);
    splash.addEventListener('click', closeSplash);
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
    // No reload when an updated worker takes over: it fetches network-first with revalidation, so this launch
    // already runs the latest files, and a reload would replay the launch splash.
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
      .then((reg) => reg.update()).catch(() => {}));
  }
})();
