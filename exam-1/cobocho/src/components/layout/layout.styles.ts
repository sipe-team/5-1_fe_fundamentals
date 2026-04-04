export type Gap = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 6 | 7 | 8 | 9 | 10;

export const gapMap = {
	0.5: 'gap-0.5',
	1: 'gap-1',
	1.5: 'gap-1.5',
	2: 'gap-2',
	2.5: 'gap-2.5',
	3: 'gap-3',
	3.5: 'gap-3.5',
	4: 'gap-4',
	4.5: 'gap-4.5',
	5: 'gap-5',
	6: 'gap-6',
	7: 'gap-7',
	8: 'gap-8',
	9: 'gap-9',
	10: 'gap-10',
} as const satisfies Record<Gap, string>;
