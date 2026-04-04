import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

describe('ToggleGroup', () => {
	describe('type="single"', () => {
		const SingleToggle = () => {
			const [value, setValue] = useState<string | null>(null);
			return (
				<ToggleGroup type="single" value={value} onChange={setValue}>
					<ToggleGroupItem value="a">A</ToggleGroupItem>
					<ToggleGroupItem value="b">B</ToggleGroupItem>
					<ToggleGroupItem value="c">C</ToggleGroupItem>
				</ToggleGroup>
			);
		};

		it('아이템을 클릭하면 선택된다', async () => {
			render(<SingleToggle />);

			await userEvent.click(screen.getByText('A'));

			expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'true');
			expect(screen.getByText('B')).toHaveAttribute('aria-pressed', 'false');
		});

		it('선택된 아이템을 다시 클릭하면 선택 해제된다', async () => {
			render(<SingleToggle />);

			await userEvent.click(screen.getByText('A'));
			await userEvent.click(screen.getByText('A'));

			expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'false');
		});

		it('다른 아이템을 클릭하면 이전 선택이 해제된다', async () => {
			render(<SingleToggle />);

			await userEvent.click(screen.getByText('A'));
			await userEvent.click(screen.getByText('B'));

			expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'false');
			expect(screen.getByText('B')).toHaveAttribute('aria-pressed', 'true');
		});
	});

	describe('type="multiple"', () => {
		const MultipleToggle = () => {
			const [value, setValue] = useState<string[]>([]);
			return (
				<ToggleGroup type="multiple" value={value} onChange={setValue}>
					<ToggleGroupItem value="a">A</ToggleGroupItem>
					<ToggleGroupItem value="b">B</ToggleGroupItem>
					<ToggleGroupItem value="c">C</ToggleGroupItem>
				</ToggleGroup>
			);
		};

		it('여러 아이템을 동시에 선택할 수 있다', async () => {
			render(<MultipleToggle />);

			await userEvent.click(screen.getByText('A'));
			await userEvent.click(screen.getByText('B'));

			expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'true');
			expect(screen.getByText('B')).toHaveAttribute('aria-pressed', 'true');
			expect(screen.getByText('C')).toHaveAttribute('aria-pressed', 'false');
		});

		it('선택된 아이템을 다시 클릭하면 해제된다', async () => {
			render(<MultipleToggle />);

			await userEvent.click(screen.getByText('A'));
			await userEvent.click(screen.getByText('A'));

			expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'false');
		});
	});
});
