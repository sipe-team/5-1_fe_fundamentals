import { useErrorBoundaryFallbackProps } from '@suspensive/react';
import { useNavigate } from 'react-router-dom';
import { ErrorContent } from '@/shared/components/error-content';
import {
	InternalServerError,
	ServiceUnavailableError,
} from '@/shared/lib/error';

export function CartError() {
	const { reset, error } = useErrorBoundaryFallbackProps();
	const navigate = useNavigate();

	if (
		error instanceof InternalServerError ||
		error instanceof ServiceUnavailableError
	) {
		return (
			<ErrorContent>
				<ErrorContent.Title>장바구니를 불러오지 못했어요.</ErrorContent.Title>
				<ErrorContent.Message>{error.message}</ErrorContent.Message>
				<ErrorContent.Retry onRetry={reset} />
			</ErrorContent>
		);
	}

	return (
		<ErrorContent>
			<ErrorContent.Title>장바구니를 불러오지 못했어요.</ErrorContent.Title>
			<ErrorContent.Message>{error.message}</ErrorContent.Message>
			<ErrorContent.Retry onRetry={reset} />
			<ErrorContent.GoBack onClick={() => navigate('/')}>
				메뉴 페이지로 이동
			</ErrorContent.GoBack>
		</ErrorContent>
	);
}
