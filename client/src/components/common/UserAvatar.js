import React from 'react';

// Reusable component to render Avatar + Equipped Frame
const UserAvatar = ({ avatar, frame, size = "w-12 h-12", className = "" }) => {
    return (
        <div className={`relative ${size} ${className} shrink-0`}>
            {/* Base Avatar */}
            <div className="w-full h-full rounded-full overflow-hidden bg-white/10 border border-white/10">
                <img
                    src={avatar || "/assets/avatars/default.png"}
                    alt="User"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Frame Overlay (Only renders if frame exists) */}
            {frame && (
                <img
                    src={frame}
                    alt="Frame"
                    className="absolute -top-[12%] -left-[12%] w-[124%] h-[124%] object-contain pointer-events-none z-10"
                />
            )}
        </div>
    );
};

export default UserAvatar;