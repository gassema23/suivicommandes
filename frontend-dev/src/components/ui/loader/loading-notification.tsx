import Shimmer from './loading-shimmer';

export default function LoadingNotification() {
    return (
        <div className="flex w-full items-start gap-3 p-4">
            <div>
                <Shimmer rounded="full" width={64} height={64} />
            </div>
            <div className="min-w-0 flex-1">
                <Shimmer height={20} width="100%" />
                <Shimmer height={30} width="100%" className="mt-1" />
                <Shimmer height={10} width="50%" className="mt-2" />
            </div>
        </div>
    );
}
