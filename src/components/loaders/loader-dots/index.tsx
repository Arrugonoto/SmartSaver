export const LoaderDots = () => {
  return (
    <div className="flex w-10 bg-neutral-700 p-1 rounded-md">
      <div
        className="w-[60px] aspect-[4] bg-[length:calc(100%/3)100%] [--_g:no-repeat_radial-gradient(circle_closest-side,#a7a7a7_90%,#0000)] animate-loading-dots"
        style={{
          background: 'var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%',
        }}
      ></div>
    </div>
  );
};
