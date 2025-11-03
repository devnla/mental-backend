import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            {/* Head */}
            <circle cx="20" cy="8" r="5" fill="currentColor" />

            {/* Body */}
            <rect x="16" y="14" width="8" height="10" fill="currentColor" />

            {/* Left Arm (pointing) */}
            <line
                x1="16"
                y1="16"
                x2="4"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="3" cy="11" r="1.5" fill="currentColor" />

            {/* Right Arm (raised) */}
            <line
                x1="24"
                y1="15"
                x2="32"
                y2="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="33" cy="7" r="1.5" fill="currentColor" />

            {/* Left Leg */}
            <line
                x1="18"
                y1="24"
                x2="15"
                y2="35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Right Leg */}
            <line
                x1="22"
                y1="24"
                x2="25"
                y2="35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Whistle (coaching symbol) */}
            <rect
                x="26"
                y="18"
                width="3"
                height="6"
                rx="1.5"
                fill="currentColor"
            />
            <circle
                cx="28.5"
                cy="25"
                r="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}
