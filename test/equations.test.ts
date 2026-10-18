import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

import { Maths } from '../src/components/Maths';
import { evaluateLines } from '../src/hooks/evaluate';
import { format } from '../src/hooks/format';

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
});

afterAll(() => {
  vi.useRealTimers();
});

it('evaluates test/equations.txt', async () => {
  const math = await Maths();
  const lines = readFileSync(new URL('./equations.txt', import.meta.url), 'utf8').split('\n');
  const results = evaluateLines(math, lines);

  const width = Math.max(...lines.map((line) => line.length));
  const transcript = lines
    .map((line, lineNumber) => {
      const result = results.get(lineNumber);
      return `${ line.padEnd(width) }  =>  ${ result === null ? '' : format(math, result) }`.trimEnd();
    })
    .join('\n');

  await expect(transcript).toMatchFileSnapshot('./__snapshots__/equations.txt');
});
