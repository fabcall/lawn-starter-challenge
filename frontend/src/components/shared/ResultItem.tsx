import { Link } from 'react-router';

interface ResultItemProps {
    id: string;
    title: string;
    linkTo: string;
}

export function ResultItem({ title, linkTo }: ResultItemProps) {
    return (
        <div className="flex items-center justify-between py-4 px-4 border-b border-gray-200 last:border-b-0">
            <span className="text-lg font-semibold text-gray-900">{title}</span>
            <Link
                to={linkTo}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md transition-colors shadow-sm uppercase text-sm tracking-wide"
            >
                SEE DETAILS
            </Link>
        </div>
    );
}