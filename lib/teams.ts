export type Team = {
  id: string;
  name: string;
  color: string;
};

export const TEAMS: Team[] = [
  { id: 'kia',     name: 'KIA 타이거즈',   color: '#EA0029' },
  { id: 'samsung', name: '삼성 라이온즈',   color: '#0066B3' },
  { id: 'lg',      name: 'LG 트윈스',       color: '#C30452' },
  { id: 'doosan',  name: '두산 베어스',     color: '#131230' },
  { id: 'ssg',     name: 'SSG 랜더스',      color: '#CE0E2D' },
  { id: 'kt',      name: 'kt wiz',          color: '#000000' },
  { id: 'lotte',   name: '롯데 자이언츠',   color: '#041E42' },
  { id: 'hanwha',  name: '한화 이글스',     color: '#FF6600' },
  { id: 'kiwoom',  name: '키움 히어로즈',   color: '#570514' },
  { id: 'nc',      name: 'NC 다이노스',     color: '#315288' },
];

export function getTeam(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}
