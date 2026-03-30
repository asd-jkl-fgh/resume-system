import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('f');
    let data = searchParams.get('d');

    if (!filename || !data) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    // 安全检查：只允许 PDF 文件
    if (!filename.endsWith('.pdf')) {
      return NextResponse.json({ error: '无效的文件类型' }, { status: 400 });
    }

    try {
      // 还原 URL-safe Base64 为标准 Base64
      data = data.replace(/-/g, '+').replace(/_/g, '/').replace(/\./g, '=');
      const pdfBuffer = Buffer.from(data, 'base64');
      
      // 直接返回 PDF 下载
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      });
    } catch (e) {
      console.error('解码错误:', e);
      return NextResponse.json({ error: '数据解码失败' }, { status: 400 });
    }
  } catch (error) {
    console.error('PDF 下载错误:', error);
    return NextResponse.json({ error: '下载失败' }, { status: 500 });
  }
}
