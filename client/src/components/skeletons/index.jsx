export function SkeletonBox({ width = '100%', height = '1rem', borderRadius = '8px', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #eef3fa 25%, #e4ebf5 50%, #eef3fa 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    >
      <style>{`@keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 8px 24px rgba(16, 35, 61, 0.06)',
    }}>
      <SkeletonBox height="200px" borderRadius="12px" style={{ marginBottom: '1rem' }} />
      <SkeletonBox height="1.25rem" width="70%" style={{ marginBottom: '0.75rem' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          height="0.875rem"
          width={`${Math.random() * 30 + 60}%`}
          style={{ marginBottom: '0.5rem' }}
        />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 6, columns = 3 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '1.5rem',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem', marginBottom: '1rem' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} height="0.75rem" width="60%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1rem', padding: '0.75rem 0', borderTop: '1px solid #eef3fa' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBox key={c} height="0.875rem" width={`${Math.random() * 40 + 30}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}