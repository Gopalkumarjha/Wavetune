const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${s} rounded-full border-2 border-wave-border border-t-wave-accent animate-spin`} />
      {text && <p className="text-wave-muted text-sm">{text}</p>}
    </div>
  );
};
export default LoadingSpinner;
