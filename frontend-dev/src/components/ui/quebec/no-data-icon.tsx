import empty from '@/assets/empty.png';

export default function NoDataIcon({ withImage = false }: React.PropsWithChildren<{ withImage?: boolean }>) {
    // Si withImage est vrai, on affiche une image, sinon on affiche une icône SVG
    return (
        <div className="mb-4 flex w-full flex-col items-center justify-center">
            {withImage ? (
                <img src={empty} alt="No data" className="h-auto w-20 object-cover" />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 41" className="h-auto w-20">
                    <g fill="none" transform="translate(0 1)">
                        <ellipse cx={32} cy={33} fill="#f5f5f5" rx={32} ry={7} />
                        <g stroke="#d9d9d9">
                            <path d="M55 12.76 44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
                            <path
                                fill="#fafafa"
                                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                            />
                        </g>
                    </g>
                </svg>
            )}
        </div>
    );
}
