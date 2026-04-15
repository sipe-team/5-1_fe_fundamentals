import { VStack } from '@/shared/components/layout';
import { Skeleton } from '@/shared/components/skeleton';

export function OrderDetailSkeleton() {
	return (
		<div className="pb-24">
			<div className="border-b border-gray-200 p-4">
				<Skeleton className="h-6 w-24" />
			</div>

			<VStack
				gap={4}
				className="p-4"
			>
				<VStack
					gap={2}
					className="rounded-lg bg-gray-50 p-4"
				>
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-40" />
				</VStack>

				<VStack gap={0}>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: 인덱스를 키로 사용하는 것이 안전합니다.
							key={i}
							className="border-b border-gray-100 py-3"
						>
							<Skeleton className="h-5 w-full" />
							<Skeleton className="mt-1 h-4 w-32" />
						</div>
					))}
				</VStack>

				<Skeleton className="h-6 w-full" />
			</VStack>
		</div>
	);
}
