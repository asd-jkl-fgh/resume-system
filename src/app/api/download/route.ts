import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json({ error: '文件名不能为空' }, { status: 400 });
    }

    // 安全检查：只允许 PDF 文件
    if (!filename.endsWith('.pdf')) {
      return NextResponse.json({ error: '无效的文件类型' }, { status: 400 });
    }

    // 防止路径遍历攻击
    const safeFilename = path.basename(filename);
    const filepath = path.join('/tmp/resumes', safeFilename);

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: '文件不存在' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filepath);

    // 使用简单的 Content-Disposition 避免编码问题
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('下载文件错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json({ error: '下载失败', details: errorMessage }, { status: 500 });
  }
}
