interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = 'Searching...' }: LoadingStateProps) {
    return (
        <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">{message}</p>
        </div>
    );
}