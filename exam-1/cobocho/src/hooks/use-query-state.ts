import { useCallback, useState } from 'react';

export interface Parser<T> {
	parse: (value: string) => T;
	serialize: (value: T) => string;
	nullable: () => Parser<T | null>;
	withDefault: (defaultValue: T) => SchemaEntry<T>;
}

function createParser<T>(options: Pick<Parser<T>, 'parse' | 'serialize'>): Parser<T> {
	return {
		...options,
		nullable() {
			return createParser<T | null>({
				parse: (v) => (v === '' ? null : options.parse(v)),
				serialize: (v) => (v === null ? '' : options.serialize(v)),
			});
		},
		withDefault(defaultValue: T) {
			return { parser: this, default: defaultValue };
		},
	};
}

export const parseAsString = createParser<string>({
	parse: (v) => v,
	serialize: (v) => v,
});

export const parseAsInteger = createParser<number>({
	parse: (v) => Number.parseInt(v, 10),
	serialize: (v) => String(v),
});

export const parseAsEnum = <T extends string>(
	values: readonly T[],
) =>
	createParser<T>({
		parse: (v) => (values.includes(v as T) ? (v as T) : values[0]),
		serialize: (v) => v,
	});

export const parseAsArrayOf = <T>(item: Parser<T>, separator = ',') =>
	createParser<T[]>({
		parse: (v) => (v === '' ? [] : v.split(separator).map(item.parse)),
		serialize: (v) => v.map(item.serialize).join(separator),
	});

export function useQueryState<T>(
	key: string,
	parser: Parser<T>,
	defaultValue: T,
): [T, (value: T) => void] {
	const read = (): T => {
		const raw = new URLSearchParams(window.location.search).get(key);
		return raw === null ? defaultValue : parser.parse(raw);
	};

	const [state, setState] = useState(read);

	const set = useCallback(
		(value: T) => {
			setState(value);
			const params = new URLSearchParams(window.location.search);
			const serialized = parser.serialize(value);
			const isDefault = serialized === parser.serialize(defaultValue);

			if (isDefault || serialized === '') {
				params.delete(key);
			} else {
				params.set(key, serialized);
			}

			const qs = params.toString();
			window.history.replaceState(
				{},
				'',
				qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
			);
		},
		[key, parser, defaultValue],
	);

	return [state, set];
}

export interface SchemaEntry<T = unknown> {
	parser: Parser<T>;
	default: T;
}

export function useQueryStates<T extends Record<string, unknown>>(schema: {
	[K in keyof T]: SchemaEntry<T[K]>;
}): [T, (patch: Partial<T>) => void] {
	const read = (): T => {
		const params = new URLSearchParams(window.location.search);
		const result = {} as Record<string, unknown>;
		for (const key in schema) {
			const { parser, default: def } = schema[key] as SchemaEntry;
			const raw = params.get(key);
			result[key] = raw === null ? def : parser.parse(raw);
		}
		return result as T;
	};

	const [state, setState] = useState(read);

	const set = useCallback(
		(patch: Partial<T>) => {
			setState((prev) => {
				const next = { ...prev, ...patch };
				const params = new URLSearchParams(window.location.search);

				for (const key in schema) {
					const { parser, default: def } = schema[key] as SchemaEntry;
					const serialized = parser.serialize(next[key]);
					const isDefault = serialized === parser.serialize(def);

					if (isDefault || serialized === '') {
						params.delete(key);
					} else {
						params.set(key, serialized);
					}
				}

				const qs = params.toString();
				window.history.replaceState(
					{},
					'',
					qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
				);

				return next;
			});
		},
		[schema],
	);

	return [state, set];
}
