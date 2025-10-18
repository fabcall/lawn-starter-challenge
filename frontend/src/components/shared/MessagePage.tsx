import { useNavigate } from 'react-router';

interface MessagePageProps {
    icon?: string;
    title: string;
    subtitle?: string;
    description?: string;
    primaryAction?: {
        label: string;
        onClick?: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick?: () => void;
    };
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
};

export function MessagePage({
    icon = '🔍',
    title,
    subtitle,
    description,
    primaryAction,
    secondaryAction,
    maxWidth = '2xl',
}: MessagePageProps) {
    const navigate = useNavigate();

    const handlePrimaryAction = () => {
        if (primaryAction?.onClick) {
            primaryAction.onClick();
        } else {
            navigate('/');
        }
    };

    const handleSecondaryAction = () => {
        if (secondaryAction?.onClick) {
            secondaryAction.onClick();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 py-12`}>
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                    <span className="text-6xl">{icon}</span>
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-4">{title}</h1>

                {subtitle && (
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        {subtitle}
                    </h2>
                )}
                {description && (
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
                )}

                {(primaryAction || secondaryAction) && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {primaryAction && (
                            <button
                                onClick={handlePrimaryAction}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-md transition-colors shadow-sm uppercase tracking-wide"
                            >
                                {primaryAction.label}
                            </button>
                        )}

                        {secondaryAction && (
                            <button
                                onClick={handleSecondaryAction}
                                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-md transition-colors shadow-sm border border-gray-300 uppercase tracking-wide"
                            >
                                {secondaryAction.label}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}