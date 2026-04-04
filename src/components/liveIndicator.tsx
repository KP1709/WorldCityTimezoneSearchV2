const LiveIndicator = () => {
    return (
        <span className="absolute top-3 right-4 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
        </span>
    )
}

export default LiveIndicator;