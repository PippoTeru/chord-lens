// コード名フォーマット変換

/**
 * 複数の括弧を1つにまとめてカンマ区切りにする
 */
export function mergeParentheses(chordName: string): string {
  // スラッシュコードの場合、スラッシュで分割
  const slashIndex = chordName.indexOf('/');
  const hasSlash = slashIndex !== -1;
  const chordPart = hasSlash ? chordName.substring(0, slashIndex) : chordName;
  const bassPart = hasSlash ? chordName.substring(slashIndex) : '';

  // Step 1: 括弧内の要素を抽出（コード部分のみから）
  const elements: string[] = [];
  const regex = /\(([^)]+)\)/g;
  let match;

  while ((match = regex.exec(chordPart)) !== null) {
    elements.push(match[1]);
  }

  if (elements.length === 0) return chordName;

  // Step 2: 要素を並び替え
  const sorted = sortElements(elements);

  // Step 3: カンマ区切りで結合
  const merged = sorted.join(', ');

  // Step 4: コード部分から括弧を削除して、新しい括弧を追加
  const baseChord = chordPart.replace(/\([^)]+\)/g, '');
  return baseChord + '(' + merged + ')' + bassPart;
}

/**
 * 括弧内の要素を正しい順序でソート
 * 順序: -5/+5 → 9系 → 11系 → 13系 → omit3 → omit5
 */
function sortElements(elements: string[]): string[] {
  const order: Record<string, number> = {
    '-5': 0, '+5': 0,
    '-9': 1, '9': 1, '+9': 1,
    '11': 2,
    '-13': 3, '13': 3, '+13': 3,
    '+11': 4,  // #11テンション（単独コードではなくテンションとしてのみ使用）
    'omit3': 5,
    'omit5': 6
  };

  return elements.sort((a, b) => {
    return (order[a] ?? 99) - (order[b] ?? 99);
  });
}

