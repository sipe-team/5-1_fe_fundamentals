import { useNavigate } from 'react-router-dom';
import { useErrorBoundaryFallbackProps } from '@suspensive/react';

import {
	InternalServerError,
	NotFoundError,
	ServiceUnavailableError,
} from '@/shared/lib/error';
import { ErrorContent } from '@/shared/components/error-content';

export function OrderDetailError() {
	const { reset, error } = useErrorBoundaryFallbackProps();
	const navigate = useNavigate();

	if (error instanceof NotFoundError) {
		return (
			<ErrorContent>
				<ErrorContent.Title>주문을 찾을 수 없습니다.</ErrorContent.Title>
				<ErrorContent.Message>
					요청하신 주문 정보를 찾을 수 없습니다.
				</ErrorContent.Message>
				<ErrorContent.GoBack onClick={() => navigate('/')}>
					메뉴판으로 돌아가기
				</ErrorContent.GoBack>
			</ErrorContent>
		);
	}

	if (
		error instanceof InternalServerError ||
		error instanceof ServiceUnavailableError
	) {
		return (
			<ErrorContent>
				<ErrorContent.Title>오류가 발생했습니다.</ErrorContent.Title>
				<ErrorContent.Message>{error.message}</ErrorContent.Message>
				<ErrorContent.Retry onRetry={reset} />
			</ErrorContent>
		);
	}

	return (
		<ErrorContent>
			<ErrorContent.Title>오류가 발생했습니다.</ErrorContent.Title>
			<ErrorContent.Message>{error.message}</ErrorContent.Message>
			<ErrorContent.Retry onRetry={reset} />
		</ErrorContent>
	);
}
