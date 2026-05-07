import type { ReactNode } from 'react';
import { VStack } from '@/shared/components/layout';
import { Button } from '@/shared/components/button';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Title({ children }: { children: ReactNode }) {
	return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
}

function Message({ children }: { children: ReactNode }) {
	return <p className="text-sm text-gray-500">{children}</p>;
}

function Retry({
	onRetry,
	children,
}: {
	onRetry: () => void;
	children?: ReactNode;
}) {
	return (
		<Button
			variant="outline"
			className="gap-2"
			onClick={onRetry}
		>
			<RefreshCcw className="size-4" />
			{children ?? '다시 시도'}
		</Button>
	);
}

function GoBack({
	onClick,
	children,
}: {
	onClick?: () => void;
	children?: ReactNode;
}) {
	const navigate = useNavigate();

	return (
		<Button
			variant="outline"
			className="gap-2"
			onClick={() => {
				if (onClick) {
					onClick();
				} else {
					navigate(-1);
				}
			}}
		>
			<ArrowLeft className="size-4" />
			{children ?? '뒤로 가기'}
		</Button>
	);
}

interface ErrorContentComponent {
	(props: { children: ReactNode }): ReactNode;
	Title: typeof Title;
	Message: typeof Message;
	Retry: typeof Retry;
	GoBack: typeof GoBack;
}

export const ErrorContent: ErrorContentComponent = ({ children }) => (
	<VStack
		gap={4}
		align="center"
		className="py-16"
	>
		{children}
	</VStack>
);

ErrorContent.Title = Title;
ErrorContent.Message = Message;
ErrorContent.Retry = Retry;
ErrorContent.GoBack = GoBack;
