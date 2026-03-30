import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/types/resume';

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/e39c0e09-3b64-4ce4-b01a-5049f108789b';

// 格式化值
function formatValue(value: string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '无';
  return value;
}

// 发送飞书通知
async function sendToFeishuWebhook(data: ResumeData): Promise<void> {
  const message = {
    msg_type: 'text',
    content: {
      text: `📋 新简历提交通知\n\n👤 姓名：${formatValue(data.name)}\n📮 应聘岗位：${formatValue(data.post)}\n📱 手机：${formatValue(data.mobilephone)}\n📧 邮箱：${formatValue(data.email)}\n🏫 学历：${formatValue(data.school)} | ${formatValue(data.degree)}\n💼 当前状态：${formatValue(data.current_status)}\n💰 目前薪资：${formatValue(data.current_salary)}\n💰 期望薪资：${formatValue(data.salary_expectation)}\n\n⏰ 提交时间：${new Date().toLocaleString('zh-CN')}`,
    }
  };

  try {
    const response = await fetch(FEISHU_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    if (result.code !== 0) {
      console.error('飞书 Webhook 发送失败:', result);
      throw new Error(`飞书消息发送失败: ${result.msg || '未知错误'}`);
    }
    console.log('飞书消息发送成功');
  } catch (error) {
    console.error('发送飞书消息时出错:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const resumeData: ResumeData = await request.json();

    // 验证必填字段
    if (!resumeData.channel_type || !resumeData.post || !resumeData.job_type ||
        !resumeData.current_status || !resumeData.salary_expectation ||
        !resumeData.name || !resumeData.sex || !resumeData.birthday ||
        !resumeData.mobilephone || !resumeData.email ||
        !resumeData.declaration) {
      return NextResponse.json(
        { success: false, error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 1. 发送飞书 Webhook 通知
    await sendToFeishuWebhook(resumeData);

    return NextResponse.json(
      { 
        success: true, 
        message: '简历提交成功'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('简历提交错误:', error);
    return NextResponse.json(
      { success: false, error: error.message || '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
}
