import { type ReactNode } from 'react';
import { useNavigate } from 'react-router';

interface DetailPageLayoutProps {
    title: string;
    children: ReactNode;
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

export function DetailPageLayout({
    title,
    children,
    maxWidth = '4xl'
}: DetailPageLayoutProps) {
    const navigate = useNavigate();

    return (
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 py-12`}>
            <div className="bg-white rounded-lg shadow-md p-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>

                {children}

                <button
                    onClick={() => navigate('/')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-md transition-colors shadow-sm uppercase tracking-wide"
                >
                    BACK TO SEARCH
                </button>
            </div>
        </div>
    );
}