import { useErrorBoundaryFallbackProps } from '@suspensive/react';

import {
	InternalServerError,
	ServiceUnavailableError,
} from '@/shared/lib/error';
import { ErrorContent } from '@/shared/components/error-content';

export function MenuPageError() {
	const { reset, error } = useErrorBoundaryFallbackProps();

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
