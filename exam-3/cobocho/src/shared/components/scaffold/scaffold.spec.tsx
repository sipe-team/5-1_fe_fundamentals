import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { TestProvider } from '@/test/test-provider';
import { Scaffold } from './scaffold';

function SuspendingChild(): ReactNode {
	throw new Promise(() => {});
}

function ErrorChild(): ReactNode {
	throw new Error('테스트 에러');
}

function NormalChild() {
	return <p>정상 렌더링</p>;
}

describe('Scaffold', () => {
	it('children이 정상이면 그대로 렌더링한다', () => {
		render(
			<TestProvider>
				<Scaffold
					error={<p>에러</p>}
					fallback={<p>로딩</p>}
				>
					<NormalChild />
				</Scaffold>
			</TestProvider>,
		);

		expect(screen.getByText('정상 렌더링')).toBeInTheDocument();
	});

	it('children이 suspend하면 fallback을 보여준다', () => {
		render(
			<TestProvider>
				<Scaffold
					error={<p>에러</p>}
					fallback={<p>로딩</p>}
				>
					<SuspendingChild />
				</Scaffold>
			</TestProvider>,
		);

		expect(screen.getByText('로딩')).toBeInTheDocument();
	});

	it('children이 에러를 throw하면 error fallback을 보여준다', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<TestProvider>
				<Scaffold
					error={<p>에러 발생</p>}
					fallback={<p>로딩</p>}
				>
					<ErrorChild />
				</Scaffold>
			</TestProvider>,
		);

		expect(screen.getByText('에러 발생')).toBeInTheDocument();

		vi.restoreAllMocks();
	});
});

describe('Scaffold.with', () => {
	it('컴포넌트를 Scaffold로 감싸서 반환한다', () => {
		const Wrapped = Scaffold.with(
			{
				error: <p>에러</p>,
				fallback: <p>로딩</p>,
			},
			function Inner() {
				return <p>래핑된 컴포넌트</p>;
			},
		);

		render(
			<TestProvider>
				<Wrapped />
			</TestProvider>,
		);

		expect(screen.getByText('래핑된 컴포넌트')).toBeInTheDocument();
	});

	it('suspend하면 fallback을 보여준다', () => {
		const Wrapped = Scaffold.with(
			{
				error: <p>에러</p>,
				fallback: <p>로딩 중</p>,
			},
			SuspendingChild,
		);

		render(
			<TestProvider>
				<Wrapped />
			</TestProvider>,
		);

		expect(screen.getByText('로딩 중')).toBeInTheDocument();
	});

	it('에러 시 error fallback을 보여준다', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});

		const Wrapped = Scaffold.with(
			{
				error: <p>에러 화면</p>,
				fallback: <p>로딩</p>,
			},
			ErrorChild,
		);

		render(
			<TestProvider>
				<Wrapped />
			</TestProvider>,
		);

		expect(screen.getByText('에러 화면')).toBeInTheDocument();

		vi.restoreAllMocks();
	});

	it('props를 내부 컴포넌트에 전달한다', () => {
		const Wrapped = Scaffold.with(
			{
				error: <p>에러</p>,
				fallback: <p>로딩</p>,
			},
			function Inner({ message }: { message: string }) {
				return <p>{message}</p>;
			},
		);

		render(
			<TestProvider>
				<Wrapped message="안녕하세요" />
			</TestProvider>,
		);

		expect(screen.getByText('안녕하세요')).toBeInTheDocument();
	});
});
