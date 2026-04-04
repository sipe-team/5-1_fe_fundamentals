import React, { useEffect, useRef } from 'react';

interface InfinityScrollProps extends React.HTMLAttributes<HTMLDivElement> {
	onFetchMore: () => void;
	error?: boolean;
	loading?: boolean;
	disabled?: boolean;
}

const InfinityScroll = ({
	onFetchMore,
	error,
	loading = false,
	disabled = false,
	children,
	...rest
}: InfinityScrollProps) => {
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || loading || disabled) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) onFetchMore();
		});

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [loading, disabled, onFetchMore]);

	return (
		<div {...rest}>
			{children}
			<div ref={sentinelRef} />
			{loading && (
				<div className="flex w-full justify-center py-6">
					<div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
				</div>
			)}
			{!loading && error && (
				<div className="flex w-full flex-col items-center gap-2 py-6">
					<p className="text-sm text-gray-500">문제가 발생했습니다</p>
					<button
						type="button"
						className="rounded-md border border-gray-300 px-4 py-1.5 text-sm transition-colors hover:bg-gray-100"
						onClick={onFetchMore}
					>
						다시 시도
					</button>
				</div>
			)}
		</div>
	);
};

export default InfinityScroll;
