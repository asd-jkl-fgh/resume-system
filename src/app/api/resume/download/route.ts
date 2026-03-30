import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json({ error: '缺少文件名参数' }, { status: 400 });
    }

    // 安全检查：只允许 PDF 文件
    if (!filename.endsWith('.pdf')) {
      return NextResponse.json({ error: '无效的文件类型' }, { status: 400 });
    }

    const filepath = path.join('/tmp/resumes', filename);

    // 检查文件是否存在
    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: '文件不存在' }, { status: 404 });
    }

    // 读取文件
    const fileBuffer = fs.readFileSync(filepath);

    // 返回 PDF 文件
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF 下载错误:', error);
    return NextResponse.json({ error: '下载失败' }, { status: 500 });
  }
}
