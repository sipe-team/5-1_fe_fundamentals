import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteContent,
	AutoCompleteItem,
} from './auto-complete';

const items = ['Apple', 'Banana', 'Avocado'];

const renderAutoComplete = (
	overrides: {
		value?: string;
		onChange?: () => void;
		onSelect?: () => void;
	} = {},
) => {
	const props = {
		value: overrides.value ?? '',
		onChange: overrides.onChange ?? vi.fn(),
		onSelect: overrides.onSelect ?? vi.fn(),
	};

	return {
		...props,
		...render(
			<AutoComplete {...props}>
				<AutoCompleteInput />
				<AutoCompleteContent>
					{items.map((item) => (
						<AutoCompleteItem
							key={item}
							value={item}
						/>
					))}
				</AutoCompleteContent>
			</AutoComplete>,
		),
	};
};

describe('AutoComplete', () => {
	it('input을 렌더링한다', () => {
		renderAutoComplete();
		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	it('포커스 전에는 목록이 보이지 않는다', () => {
		renderAutoComplete();
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('input에 포커스하면 목록이 표시된다', async () => {
		renderAutoComplete();
		await userEvent.click(screen.getByRole('combobox'));

		expect(screen.getByRole('listbox')).toBeInTheDocument();
		expect(screen.getAllByRole('option')).toHaveLength(3);
	});

	it('전달된 children을 모두 표시한다', async () => {
		renderAutoComplete();
		await userEvent.click(screen.getByRole('combobox'));

		expect(screen.getAllByRole('option')).toHaveLength(3);
	});

	it('입력하면 onChange가 호출된다', async () => {
		const onChange = vi.fn();
		renderAutoComplete({ onChange });

		await userEvent.type(screen.getByRole('combobox'), 'a');

		expect(onChange).toHaveBeenCalledWith('a');
	});

	it('항목을 클릭하면 onSelect가 호출된다', async () => {
		const onSelect = vi.fn();
		renderAutoComplete({ onSelect });

		await userEvent.click(screen.getByRole('combobox'));
		await userEvent.click(screen.getByText('Banana'));

		expect(onSelect).toHaveBeenCalledWith('Banana');
	});

	it('항목 선택 후 목록이 닫힌다', async () => {
		renderAutoComplete();

		await userEvent.click(screen.getByRole('combobox'));
		await userEvent.click(screen.getByText('Apple'));

		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('외부 클릭 시 목록이 닫힌다', async () => {
		renderAutoComplete();

		await userEvent.click(screen.getByRole('combobox'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();

		fireEvent.mouseDown(document.body);
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('children이 없으면 목록이 표시되지 않는다', async () => {
		render(
			<AutoComplete value="" onChange={vi.fn()} onSelect={vi.fn()}>
				<AutoCompleteInput />
				<AutoCompleteContent>
					{[]}
				</AutoCompleteContent>
			</AutoComplete>,
		);
		await userEvent.click(screen.getByRole('combobox'));

		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('ArrowDown으로 다음 항목을 활성화한다', async () => {
		renderAutoComplete();
		const input = screen.getByRole('combobox');
		await userEvent.click(input);

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true');
	});

	it('ArrowUp으로 이전 항목을 활성화한다', async () => {
		renderAutoComplete();
		const input = screen.getByRole('combobox');
		await userEvent.click(input);

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'ArrowUp' });

		expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
	});

	it('Enter 키로 활성화된 항목을 선택한다', async () => {
		const onSelect = vi.fn();
		renderAutoComplete({ onSelect });
		const input = screen.getByRole('combobox');
		await userEvent.click(input);

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(onSelect).toHaveBeenCalledWith('Apple');
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('Escape 키로 목록을 닫는다', async () => {
		renderAutoComplete();
		const input = screen.getByRole('combobox');
		await userEvent.click(input);

		expect(screen.getByRole('listbox')).toBeInTheDocument();

		fireEvent.keyDown(input, { key: 'Escape' });

		expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
	});

	it('활성 항목 없이 Enter를 누르면 onSelect가 호출되지 않는다', async () => {
		const onSelect = vi.fn();
		renderAutoComplete({ onSelect });
		const input = screen.getByRole('combobox');
		await userEvent.click(input);

		fireEvent.keyDown(input, { key: 'Enter' });

		expect(onSelect).not.toHaveBeenCalled();
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});
});
