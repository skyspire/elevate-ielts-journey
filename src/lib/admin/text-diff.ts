// Tiny word-level diff. LCS over word arrays. Good enough for a few hundred
// words — not designed for novel-length text.

export type DiffPart = { value: string; added?: boolean; removed?: boolean };

function tokenize(text: string): string[] {
  // Split keeping whitespace so we can reassemble cleanly.
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

export function diffArrays(a: string, b: string): DiffPart[] {
  const A = tokenize(a);
  const B = tokenize(b);
  const n = A.length;
  const m = B.length;

  // LCS DP table
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (A[i] === B[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: DiffPart[] = [];
  let i = 0;
  let j = 0;
  const push = (part: DiffPart) => {
    const last = out[out.length - 1];
    if (last && !!last.added === !!part.added && !!last.removed === !!part.removed) {
      last.value += part.value;
    } else {
      out.push(part);
    }
  };
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      push({ value: A[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push({ value: A[i], removed: true });
      i++;
    } else {
      push({ value: B[j], added: true });
      j++;
    }
  }
  while (i < n) push({ value: A[i++], removed: true });
  while (j < m) push({ value: B[j++], added: true });

  return out;
}
