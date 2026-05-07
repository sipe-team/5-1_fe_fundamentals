import { HStack, VStack } from '@/shared/components/layout';
import { Skeleton } from '@/shared/components/skeleton';

export function CartSkeleton() {
	return (
		<div className="pb-24">
			<div className="border-gray-200 border-b p-4">
				<Skeleton className="h-6 w-20" />
			</div>

			<VStack gap={0}>
				{[0, 1, 2].map((i) => (
					<VStack
						key={i}
						gap={3}
						className="border-gray-100 border-b p-4"
					>
						<HStack
							justify="between"
							className="items-start"
						>
							<VStack
								gap={2}
								className="flex-1"
							>
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-4 w-16" />
							</VStack>
							<Skeleton className="h-6 w-6 rounded-full" />
						</HStack>
						<HStack justify="between">
							<Skeleton className="h-8 w-24 rounded-full" />
							<Skeleton className="h-5 w-16" />
						</HStack>
					</VStack>
				))}
			</VStack>
		</div>
	);
}
