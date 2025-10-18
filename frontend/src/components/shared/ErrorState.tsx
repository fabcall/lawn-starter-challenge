import { useNavigate } from 'react-router';

interface ErrorStateProps {
    title?: string;
    message?: string;
    errorMessage?: string;
    showBackButton?: boolean;
    maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const maxWidthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
};

export function ErrorState({
    title = 'Failed to load results',
    message,
    errorMessage,
    showBackButton = true,
    maxWidth = '4xl'
}: ErrorStateProps) {
    const navigate = useNavigate();

    return (
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 py-12`}>
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 mb-4">
                    <svg
                        className="w-8 h-8 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <p className="text-red-500 font-semibold text-lg mb-2">{title}</p>
                {message && <p className="text-gray-600 text-sm mb-4">{message}</p>}
                {errorMessage && (
                    <p className="text-gray-500 text-xs max-w-md mx-auto mb-6 break-words font-mono bg-gray-50 p-3 rounded">
                        {errorMessage}
                    </p>
                )}
                {showBackButton && (
                    <button
                        onClick={() => navigate('/')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-md transition-colors shadow-sm uppercase tracking-wide"
                    >
                        BACK TO SEARCH
                    </button>
                )}
            </div>
        </div>
    );
}
