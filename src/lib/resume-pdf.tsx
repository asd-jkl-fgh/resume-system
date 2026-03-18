import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { ResumeData } from '@/types/resume';
import fs from 'fs';
import path from 'path';

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/60e7f51d-2a4d-456a-9b88-f74be41fb01a';

// 生成 HTML 内容
function generateResumeHTML(data: ResumeData): string {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '/';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN');
    } catch {
      return dateStr;
    }
  };

  const emergencyContacts = data.emergency_contacts?.map((c, i) => 
    `<tr>
      <td style="border: 1px solid #ddd; padding: 8px;">联系人${i + 1}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${c.name}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${c.relation}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${c.mobilephone}</td>
    </tr>`
  ).join('') || '';

  const education = data.education_detail?.map(e => 
    `<tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${e.start || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${e.end || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${e.school || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${e.major || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${e.degree || '/'}</td>
    </tr>`
  ).join('') || '<tr><td colspan="5" style="border: 1px solid #ddd; padding: 8px; text-align: center;">无</td></tr>';

  const career = data.career_detail?.map(w => 
    `<tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${w.start || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${w.end || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${w.company || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${w.department || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${w.job || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${w.salary || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${w.reason || '/'}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${w.reference || '/'}</td>
    </tr>`
  ).join('') || '<tr><td colspan="8" style="border: 1px solid #ddd; padding: 8px; text-align: center;">无</td></tr>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 20mm; }
        body { 
          font-family: "Microsoft YaHei", "SimHei", "Helvetica Neue", Arial, sans-serif; 
          font-size: 12px; 
          line-height: 1.6;
          padding: 20px;
          background: white;
          width: 180mm;
        }
        .header { 
          text-align: center; 
          margin-bottom: 20px; 
          border-bottom: 2px solid #333; 
          padding-bottom: 15px;
        }
        .header h1 { font-size: 22px; margin-bottom: 5px; }
        .header p { color: #666; font-size: 11px; }
        .section { margin-bottom: 15px; }
        .section-title { 
          font-size: 14px; 
          font-weight: bold; 
          background: #f5f5f5; 
          padding: 8px 12px; 
          margin-bottom: 10px;
          border-left: 4px solid #1890ff;
        }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        td { padding: 8px; border: 1px solid #ddd; }
        td.label { 
          width: 120px; 
          background: #f9f9f9; 
          font-weight: 500;
          color: #333;
        }
        .footer { 
          text-align: center; 
          font-size: 10px; 
          color: #999; 
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }
        .two-col { display: flex; }
        .two-col > div { flex: 1; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>应聘人员信息登记表</h1>
        <p>提交时间：${new Date().toLocaleString('zh-CN')}</p>
      </div>

      <div class="section">
        <div class="section-title">应聘渠道</div>
        <table>
          <tr>
            <td class="label">应聘渠道</td>
            <td>${data.channel_type}${data.channel_type === '内部推荐' && data.channel_referrer ? `（推荐人：${data.channel_referrer}）` : ''}${data.channel_type === '其他渠道' && data.channel_other ? `（${data.channel_other}）` : ''}</td>
            <td class="label">应聘岗位</td>
            <td>${data.post || '/'}</td>
          </tr>
          <tr>
            <td class="label">岗位性质</td>
            <td>${data.job_type || '/'}</td>
            <td class="label">当前状态</td>
            <td>${data.current_status === '其他' ? data.current_status_other : data.current_status || '/'}</td>
          </tr>
          <tr>
            <td class="label">预计到岗时间</td>
            <td>${data.entry_date || '/'}</td>
            <td class="label">期望月薪</td>
            <td>${data.salary_expectation || '/'}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">个人资料</div>
        <table>
          <tr>
            <td class="label">姓名（中文）</td>
            <td>${data.name || '/'}</td>
            <td class="label">姓名（英文）</td>
            <td>${data.name_en || '/'}</td>
          </tr>
          <tr>
            <td class="label">性别</td>
            <td>${data.sex || '/'}</td>
            <td class="label">出生日期</td>
            <td>${formatDate(data.birthday)}</td>
          </tr>
          <tr>
            <td class="label">毕业院校</td>
            <td>${data.school || '/'}</td>
            <td class="label">最高学历/专业</td>
            <td>${data.degree || '/'}</td>
          </tr>
          <tr>
            <td class="label">手机</td>
            <td>${data.mobilephone || '/'}</td>
            <td class="label">电子邮件</td>
            <td>${data.email || '/'}</td>
          </tr>
          <tr>
            <td class="label">婚姻状况</td>
            <td>${data.marriage || '/'}</td>
            <td class="label">户籍地</td>
            <td>${data.household_address || '/'}</td>
          </tr>
          <tr>
            <td class="label">现居住地址</td>
            <td colspan="3">${data.living_address || '/'}</td>
          </tr>
          <tr>
            <td class="label">重大疾病史</td>
            <td>${data.has_disease || '/'}</td>
            <td class="label">劳动纠纷</td>
            <td>${data.has_dispute || '/'}</td>
          </tr>
          <tr>
            <td class="label">违法记录</td>
            <td colspan="3">${data.has_criminal || '/'}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">教育经历</div>
        <table>
          <tr style="background: #f5f5f5;">
            <td style="border: 1px solid #ddd; padding: 8px;">起始时间</td>
            <td style="border: 1px solid #ddd; padding: 8px;">终止时间</td>
            <td style="border: 1px solid #ddd; padding: 8px;">学校名称</td>
            <td style="border: 1px solid #ddd; padding: 8px;">专业</td>
            <td style="border: 1px solid #ddd; padding: 8px;">学历</td>
          </tr>
          ${education}
        </table>
      </div>

      <div class="section">
        <div class="section-title">工作经历</div>
        <table>
          <tr style="background: #f5f5f5;">
            <td style="border: 1px solid #ddd; padding: 8px;">起始</td>
            <td style="border: 1px solid #ddd; padding: 8px;">终止</td>
            <td style="border: 1px solid #ddd; padding: 8px;">公司</td>
            <td style="border: 1px solid #ddd; padding: 8px;">部门</td>
            <td style="border: 1px solid #ddd; padding: 8px;">职位</td>
            <td style="border: 1px solid #ddd; padding: 8px;">薪资</td>
            <td style="border: 1px solid #ddd; padding: 8px;">离职原因</td>
            <td style="border: 1px solid #ddd; padding: 8px;">证明人</td>
          </tr>
          ${career}
        </table>
      </div>

      <div class="section">
        <div class="section-title">紧急联系人</div>
        <table>
          <tr style="background: #f5f5f5;">
            <td style="border: 1px solid #ddd; padding: 8px;">序号</td>
            <td style="border: 1px solid #ddd; padding: 8px;">姓名</td>
            <td style="border: 1px solid #ddd; padding: 8px;">关系</td>
            <td style="border: 1px solid #ddd; padding: 8px;">手机号码</td>
          </tr>
          ${emergencyContacts}
        </table>
      </div>

      <div class="footer">
        招聘系统-EVO | 本登记表由系统自动生成
      </div>
    </body>
    </html>
  `;
}

// 生成 PDF（使用 Puppeteer 在无头浏览器中渲染）
export async function generatePDF(data: ResumeData): Promise<{ buffer: Buffer; filename: string; filepath: string }> {
  let browser = null;
  
  try {
    // 设置 chromium 参数
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
    ];
    
    // 启动无头浏览器
    browser = await puppeteer.launch({
      headless: true,
      args,
      executablePath: await chromium.executablePath(),
    });

    const page = await browser.newPage();
    
    // 设置视口大小 (A4 尺寸)
    await page.setViewport({
      width: 794,  // A4 width in pixels at 96 DPI
      height: 1123 // A4 height in pixels at 96 DPI
    });

    // 生成 HTML 内容
    const html = generateResumeHTML(data);
    
    // 设置页面内容
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    // 生成 PDF
    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    // 转换为 Buffer
    const pdfBuffer = Buffer.from(pdfUint8Array);

    // 关闭浏览器
    await browser.close();

    // 生成文件名
    const timestamp = Date.now();
    const sanitizedName = (data.name || 'Unknown').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const filename = `Resume_${sanitizedName}_${timestamp}.pdf`;
    
    // 保存到 public 目录
    const publicDir = path.join(process.cwd(), 'public', 'resumes');
    
    // 确保目录存在
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const filepath = path.join(publicDir, filename);
    fs.writeFileSync(filepath, pdfBuffer);
    
    return { buffer: pdfBuffer, filename, filepath };
  } catch (error) {
    console.error('生成 PDF 失败:', error);
    if (browser) {
      await browser.close();
    }
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
