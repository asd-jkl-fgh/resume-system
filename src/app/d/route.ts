import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('f');
    const data = searchParams.get('d');

    if (!filename || !data) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    // 安全检查：只允许 PDF 文件
    if (!filename.endsWith('.pdf')) {
      return NextResponse.json({ error: '无效的文件类型' }, { status: 400 });
    }

    try {
      // 尝试解压数据
      let base64;
      try {
        const pako = require('pako');
        const compressed = Buffer.from(data, 'base64');
        const decompressed = pako.inflate(compressed, { to: 'string' });
        base64 = decompressed;
      } catch (e) {
        // 如果解压失败，假设是原始 Base64
        base64 = Buffer.from(data, 'base64').toString();
      }
      
      const pdfBuffer = Buffer.from(base64, 'base64');
      
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
