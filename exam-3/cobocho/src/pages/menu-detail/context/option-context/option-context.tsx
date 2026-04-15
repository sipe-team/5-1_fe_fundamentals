import {
	createContext,
	useContext,
	useMemo,
	useReducer,
	type ReactNode,
} from 'react';
import type { MenuOption } from '@/domain/catalog/api';
import { calcOptionPrice, type Selections } from './option-context.lib';

export interface GridAction {
	type: 'grid';
	optionId: number;
	label: string;
}

export interface SelectAction {
	type: 'select';
	optionId: number;
	label: string;
}

export interface ListAction {
	type: 'list';
	optionId: number;
	label: string;
	maxCount: number;
}

export type OptionAction = GridAction | SelectAction | ListAction;

function optionReducer(state: Selections, action: OptionAction): Selections {
	switch (action.type) {
		case 'grid':
			return { ...state, [action.optionId]: [action.label] };

		case 'select':
			return {
				...state,
				[action.optionId]: action.label ? [action.label] : [],
			};

		case 'list': {
			const current = state[action.optionId] ?? [];
			const isSelected = current.includes(action.label);

			if (isSelected) {
				return {
					...state,
					[action.optionId]: current.filter((l) => l !== action.label),
				};
			}
			if (current.length >= action.maxCount) {
				return state;
			}
			return {
				...state,
				[action.optionId]: [...current, action.label],
			};
		}
	}
}

interface OptionContextValue {
	options: MenuOption[];
	selections: Selections;
	optionPrice: number;
	dispatch: (action: OptionAction) => void;
}

const OptionContext = createContext<OptionContextValue | null>(null);

interface OptionProviderProps {
	options: MenuOption[];
	children: ReactNode;
}

export function OptionProvider({ options, children }: OptionProviderProps) {
	const [selections, dispatch] = useReducer(optionReducer, {});

	const optionPrice = useMemo(
		() => calcOptionPrice(options, selections),
		[options, selections],
	);

	const value = useMemo(
		() => ({ options, selections, optionPrice, dispatch }),
		[options, selections, optionPrice],
	);

	return (
		<OptionContext.Provider value={value}>{children}</OptionContext.Provider>
	);
}

export function useOptionContext() {
	const context = useContext(OptionContext);
	if (!context) {
		throw new Error('useOptionContext must be used within OptionProvider');
	}
	return context;
}
