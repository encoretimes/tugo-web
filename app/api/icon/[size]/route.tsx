import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const VALID_SIZES = [192, 512] as const;
type ValidSize = (typeof VALID_SIZES)[number];

function isValidSize(size: number): size is ValidSize {
  return VALID_SIZES.includes(size as ValidSize);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeParam } = await params;
  const size = parseInt(sizeParam, 10);

  if (!isValidSize(size)) {
    return new Response('Invalid size. Use 192 or 512.', { status: 400 });
  }

  // 아이콘 디자인: 어두운 배경 + 흰색 T
  const borderRadius = Math.round(size * 0.15); // 15% 둥근 모서리
  const fontSize = Math.round(size * 0.55); // 55% 폰트 크기
  const paddingTop = Math.round(size * 0.15); // 상단 여백

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
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
    {
      width: size,
      height: size,
    }
  );
}
