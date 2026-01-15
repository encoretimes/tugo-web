import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  const borderRadius = Math.round(size.width * 0.22); // Apple 스타일 둥근 모서리
  const fontSize = Math.round(size.width * 0.55);
  const paddingTop = Math.round(size.width * 0.12);

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          borderRadius: borderRadius,
          paddingTop: paddingTop,
        }}
      >
        <span
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: fontSize,
            fontWeight: 900,
            color: '#fafafa',
          }}
        >
          T
        </span>
      </div>
    ),
    { ...size }
  );
}
