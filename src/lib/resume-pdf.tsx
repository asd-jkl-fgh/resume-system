import { renderToBuffer } from '@react-pdf/renderer';
import { ResumePDF } from '@/components/resume/ResumePDF';
import { ResumeData } from '@/types/resume';
import fs from 'fs';
import path from 'path';

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/60e7f51d-2a4d-456a-9b88-f74be41fb01a';

// 生成 PDF 并保存到本地
export async function generatePDF(data: ResumeData): Promise<{ buffer: Buffer; filename: string; filepath: string }> {
  try {
    // 创建 PDF 组件
    const pdfDoc = <ResumePDF data={data} />;
    
    // 渲染 PDF 到 buffer
    const buffer = await renderToBuffer(pdfDoc);
    
    // 生成文件名
    const timestamp = Date.now();
    const sanitizedName = (data.name || '未知').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const filename = `简历_${sanitizedName}_${timestamp}.pdf`;
    
    // 保存到 public 目录
    const publicDir = path.join(process.cwd(), 'public', 'resumes');
    
    // 确保目录存在
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const filepath = path.join(publicDir, filename);
    fs.writeFileSync(filepath, buffer);
    
    return { buffer, filename, filepath };
  } catch (error) {
    console.error('生成 PDF 失败:', error);
    throw error;
  }
}

// 获取 PDF 下载 URL
export function getPDFDownloadUrl(filename: string): string {
  // 使用环境变量中的域名
  const domain = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'http://localhost:5000';
  return `${domain}/resumes/${filename}`;
}

// 发送消息到飞书 Webhook
export async function sendToFeishuWebhook(data: ResumeData, pdfUrl: string): Promise<void> {
  // 构建消息内容
  const emergencyContacts = data.emergency_contacts?.map((c, i) => 
    `联系人${i + 1}: ${c.name}(${c.relation}) ${c.mobilephone}`
  ).join('\n') || '未填写';

  const education = data.education_detail?.map(e => 
    `${e.start}~${e.end} ${e.school} ${e.major} ${e.degree}`
  ).join('\n') || '未填写';

  const career = data.career_detail?.map(w => 
    `${w.start}~${w.end} ${w.company} ${w.department} ${w.job}`
  ).join('\n') || '未填写';

  const message = {
    msg_type: 'interactive',
    card: {
      config: {
        wide_screen_mode: true
      },
      header: {
        title: {
          tag: 'plain_text',
          content: '📋 新简历提交通知'
        },
        template: 'blue'
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【基本信息】**\n**姓名：**${data.name || '/'}\n**应聘岗位：**${data.post || '/'}\n**性别：**${data.sex || '/'} | **出生日期：**${data.birthday || '/'}`
          }
        },
        {
          tag: 'hr'
        },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【联系方式】**\n**手机：**${data.mobilephone || '/'}\n**邮箱：**${data.email || '/'}`
          }
        },
        {
          tag: 'hr'
        },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【应聘信息】**\n**应聘渠道：**${data.channel_type || '/'}${data.channel_referrer ? `（推荐人：${data.channel_referrer}）` : ''}${data.channel_other ? `（${data.channel_other}）` : ''}\n**岗位性质：**${data.job_type || '/'}\n**当前状态：**${data.current_status === '其他' ? data.current_status_other : data.current_status || '/'}\n**期望月薪：**${data.salary_expectation || '/'}`
          }
        },
        {
          tag: 'hr'
        },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【学历背景】**\n${data.school || '/'} | ${data.degree || '/'}`
          }
        },
        {
          tag: 'hr'
        },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【紧急联系人】**\n${emergencyContacts}`
          }
        },
        {
          tag: 'hr'
        },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: {
                tag: 'plain_text',
                content: '📥 下载PDF简历'
              },
              type: 'primary',
              url: pdfUrl
            }
          ]
        },
        {
          tag: 'note',
          elements: [
            {
              tag: 'plain_text',
              content: `提交时间：${new Date().toLocaleString('zh-CN')}`
            }
          ]
        }
      ]
    }
  };

  try {
    const response = await fetch(FEISHU_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

// 主函数：生成 PDF 并发送通知
export async function processResumeAndNotify(data: ResumeData): Promise<{ pdfUrl: string }> {
  // 1. 生成 PDF
  const { filename } = await generatePDF(data);
  
  // 2. 获取下载 URL
  const pdfUrl = getPDFDownloadUrl(filename);
  
  // 3. 发送飞书通知
  await sendToFeishuWebhook(data, pdfUrl);
  
  return { pdfUrl };
}
