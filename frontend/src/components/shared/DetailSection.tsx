import { type ReactNode } from 'react';

interface DetailSectionProps {
    title: string;
    children: ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {title}
            </h2>
            {children}
        </div>
    );
}