import { ImageResponse } from 'next/og';
import { personal } from '@/data/content';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #C17BE8, #6080FF)',
          color: '#ffffff',
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          borderRadius: 14,
        }}
      >
        {personal.initials}
      </div>
    ),
    size,
  );
}
