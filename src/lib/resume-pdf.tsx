import jsPDF from 'jspdf';
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
        body { 
          font-family: "Microsoft YaHei", "SimSun", "Helvetica Neue", Arial, sans-serif; 
          font-size: 12px; 
          line-height: 1.6;
          padding: 20px;
          background: white;
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
        .label { 
          width: 120px; 
          background: #f9f9f9; 
          font-weight: 500;
          color: #333;
        }
        .value { color: #333; }
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
            <td class="value">${data.channel_type}${data.channel_type === '内部推荐' && data.channel_referrer ? `（推荐人：${data.channel_referrer}）` : ''}${data.channel_type === '其他渠道' && data.channel_other ? `（${data.channel_other}）` : ''}</td>
            <td class="label">应聘岗位</td>
            <td class="value">${data.post || '/'}</td>
          </tr>
          <tr>
            <td class="label">岗位性质</td>
            <td class="value">${data.job_type || '/'}</td>
            <td class="label">当前状态</td>
            <td class="value">${data.current_status === '其他' ? data.current_status_other : data.current_status || '/'}</td>
          </tr>
          <tr>
            <td class="label">预计到岗时间</td>
            <td class="value">${data.entry_date || '/'}</td>
            <td class="label">期望月薪</td>
            <td class="value">${data.salary_expectation || '/'}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">个人资料</div>
        <table>
          <tr>
            <td class="label">姓名（中文）</td>
            <td class="value">${data.name || '/'}</td>
            <td class="label">姓名（英文）</td>
            <td class="value">${data.name_en || '/'}</td>
          </tr>
          <tr>
            <td class="label">性别</td>
            <td class="value">${data.sex || '/'}</td>
            <td class="label">出生日期</td>
            <td class="value">${formatDate(data.birthday)}</td>
          </tr>
          <tr>
            <td class="label">毕业院校</td>
            <td class="value">${data.school || '/'}</td>
            <td class="label">最高学历/专业</td>
            <td class="value">${data.degree || '/'}</td>
          </tr>
          <tr>
            <td class="label">手机</td>
            <td class="value">${data.mobilephone || '/'}</td>
            <td class="label">电子邮件</td>
            <td class="value">${data.email || '/'}</td>
          </tr>
          <tr>
            <td class="label">婚姻状况</td>
            <td class="value">${data.marriage || '/'}</td>
            <td class="label">户籍地</td>
            <td class="value">${data.household_address || '/'}</td>
          </tr>
          <tr>
            <td class="label">现居住地址</td>
            <td class="value" colspan="3">${data.living_address || '/'}</td>
          </tr>
          <tr>
            <td class="label">重大疾病史</td>
            <td class="value">${data.has_disease || '/'}</td>
            <td class="label">劳动纠纷</td>
            <td class="value">${data.has_dispute || '/'}</td>
          </tr>
          <tr>
            <td class="label">违法记录</td>
            <td class="value" colspan="3">${data.has_criminal || '/'}</td>
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

// 生成 PDF（服务端使用 jsPDF 直接生成，无需浏览器）
export async function generatePDF(data: ResumeData): Promise<{ buffer: Buffer; filename: string; filepath: string }> {
  try {
    // 创建 PDF 文档 (A4 尺寸)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // 设置中文字体支持 - 使用内置字体
    pdf.setFont('helvetica');
    
    // 由于 jsPDF 在服务端无法渲染中文，我们使用另一种方式
    // 生成纯文本格式的 PDF
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let y = margin;

    // 辅助函数
    const addTitle = (text: string) => {
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text(text, pageWidth / 2, y, { align: 'center' });
      y += 12;
    };

    const addSubtitle = (text: string) => {
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(text, pageWidth / 2, y, { align: 'center' });
      y += 8;
    };

    const addSection = (title: string) => {
      y += 5;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, y - 4, pageWidth - 2 * margin, 8, 'F');
      pdf.setDrawColor(24, 144, 255);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y - 4, margin, y + 4);
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(title, margin + 3, y + 1);
      y += 12;
    };

    const addField = (label: string, value: string, labelWidth: number = 40) => {
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text(label, margin, y);
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(value || '/', pageWidth - margin * 2 - labelWidth);
      pdf.text(lines, margin + labelWidth, y);
      y += Math.max(lines.length * 5, 6);
    };

    const addTwoFields = (label1: string, value1: string, label2: string, value2: string) => {
      const halfWidth = (pageWidth - 2 * margin) / 2;
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text(label1, margin, y);
      pdf.setTextColor(0, 0, 0);
      pdf.text(value1 || '/', margin + 30, y);
      pdf.setTextColor(80, 80, 80);
      pdf.text(label2, margin + halfWidth, y);
      pdf.setTextColor(0, 0, 0);
      pdf.text(value2 || '/', margin + halfWidth + 30, y);
      y += 7;
    };

    const checkPageBreak = () => {
      if (y > pageHeight - margin - 20) {
        pdf.addPage();
        y = margin;
      }
    };

    // 标题
    addTitle('Resume / Application Form');
    addSubtitle(`Submitted: ${new Date().toLocaleString('zh-CN')}`);
    y += 5;

    // 画线
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 10;

    // 应聘渠道
    addSection('Application Channel');
    addTwoFields('Channel:', data.channel_type, 'Position:', data.post);
    addTwoFields('Job Type:', data.job_type, 'Status:', data.current_status);
    addTwoFields('Expected:', data.entry_date, 'Salary:', data.salary_expectation);

    checkPageBreak();

    // 个人资料
    addSection('Personal Information');
    addTwoFields('Name:', data.name, 'Name(EN):', data.name_en);
    addTwoFields('Gender:', data.sex, 'Birthday:', data.birthday);
    addTwoFields('School:', data.school, 'Degree:', data.degree);
    addTwoFields('Mobile:', data.mobilephone, 'Email:', data.email);
    addTwoFields('Marriage:', data.marriage, 'Hukou:', data.household_address);
    addField('Address:', data.living_address);
    addTwoFields('Disease:', data.has_disease, 'Dispute:', data.has_dispute);
    addField('Criminal:', data.has_criminal);

    checkPageBreak();

    // 教育经历
    if (data.education_detail && data.education_detail.length > 0) {
      addSection('Education');
      data.education_detail.forEach((edu, index) => {
        addField(`Edu ${index + 1}:`, `${edu.start}~${edu.end} ${edu.school} ${edu.major} ${edu.degree}`);
      });
    }

    checkPageBreak();

    // 工作经历
    if (data.career_detail && data.career_detail.length > 0) {
      addSection('Work Experience');
      data.career_detail.forEach((work, index) => {
        addField(`Work ${index + 1}:`, `${work.start}~${work.end} ${work.company} ${work.department} ${work.job}`);
        addField('Details:', `Salary: ${work.salary}, Reason: ${work.reason}, Reference: ${work.reference}`);
      });
    }

    checkPageBreak();

    // 紧急联系人
    if (data.emergency_contacts && data.emergency_contacts.length > 0) {
      addSection('Emergency Contacts');
      data.emergency_contacts.forEach((contact, index) => {
        addField(`Contact ${index + 1}:`, `${contact.name} (${contact.relation}) - ${contact.mobilephone}`);
      });
    }

    // 页脚
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Recruitment System - EVO', pageWidth / 2, pageHeight - 10, { align: 'center' });

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
    
    // 将 PDF 转换为 Buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    fs.writeFileSync(filepath, pdfBuffer);
    
    return { buffer: pdfBuffer, filename, filepath };
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
