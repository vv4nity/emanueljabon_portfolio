export function AmbientOrbs() {
  return (
    <>
      <div
        className="orb pointer-events-none absolute -left-24 -top-48 z-0 h-[700px] w-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(193,123,232,0.4), transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="orb pointer-events-none absolute -right-36 top-48 z-0 h-[800px] w-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(96,128,255,0.3), transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="orb pointer-events-none absolute top-[50%] left-[30%] z-0 h-[600px] w-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(193,123,232,0.2), transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
    </>
  );
}
