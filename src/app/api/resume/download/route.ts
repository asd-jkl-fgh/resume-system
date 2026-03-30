import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('file');
    const data = searchParams.get('data');

    if (!filename) {
      return NextResponse.json({ error: '缺少文件名参数' }, { status: 400 });
    }

    // 安全检查：只允许 PDF 文件
    if (!filename.endsWith('.pdf')) {
      return NextResponse.json({ error: '无效的文件类型' }, { status: 400 });
    }

    // 如果有 Base64 数据，直接解码返回
    if (data) {
      try {
        const pdfBuffer = Buffer.from(data, 'base64');
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': pdfBuffer.length.toString(),
          },
        });
      } catch (e) {
        return NextResponse.json({ error: 'Base64 解码失败' }, { status: 400 });
      }
    }

    // 没有 data 参数，返回错误
    return NextResponse.json({ error: '缺少 PDF 数据' }, { status: 400 });
  } catch (error) {
    console.error('PDF 下载错误:', error);
    return NextResponse.json({ error: '下载失败' }, { status: 500 });
  }
}
