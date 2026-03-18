import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { ResumeData } from '@/types/resume';
import fs from 'fs';
import path from 'path';

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/60e7f51d-2a4d-456a-9b88-f74be41fb01a';

// 生成 HTML 内容（优化排版到正反两页）
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

  const education = data.education_detail?.map(e => 
    `<tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${e.start || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${e.end || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${e.school || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${e.major || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${e.degree || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${e.certificate || '/'}</td>
    </tr>`
  ).join('') || '<tr><td colspan="6" style="border: 1px solid #333; padding: 3px; text-align: center;">无</td></tr>';

  const career = data.career_detail?.map(w => 
    `<tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${w.start || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${w.end || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${w.company || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${w.department || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${w.job || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${w.salary || '/'}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt; background: #f5f5f5;">离职原因</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;" colspan="3">${w.reason || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt; background: #f5f5f5;">证明人</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${w.reference || '/'}</td>
    </tr>`
  ).join('') || '<tr><td colspan="6" style="border: 1px solid #333; padding: 3px; text-align: center;">无</td></tr>';

  const family = data.family_info?.map(f => 
    `<tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${f.name || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${f.relation || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${f.organ || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${f.work || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${f.age || '/'}</td>
    </tr>`
  ).join('') || '<tr><td colspan="5" style="border: 1px solid #333; padding: 3px; text-align: center;">无</td></tr>';

  const incompany = data.incompany_detail?.map(i => 
    `<tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${i.name || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${i.work || '/'}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${i.relation || '/'}</td>
    </tr>`
  ).join('') || '<tr><td colspan="3" style="border: 1px solid #333; padding: 3px; text-align: center;">无</td></tr>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4; margin: 0; }
        body { 
          font-family: "Microsoft YaHei", "SimHei", "Helvetica Neue", Arial, sans-serif; 
          font-size: 10pt; 
          line-height: 1.3;
          width: 190mm;
          margin: 0 auto;
          padding: 0;
        }
        .page { 
          width: 190mm; 
          min-height: 277mm; 
          padding: 8mm; 
          page-break-after: always;
          background: white;
        }
        .page:last-child { page-break-after: auto; }
        
        .header { 
          text-align: center; 
          margin-bottom: 8mm; 
          border-bottom: 2px solid #333; 
          padding-bottom: 5mm;
        }
        .header h1 { font-size: 18pt; margin-bottom: 3px; }
        .header p { color: #666; font-size: 9pt; }
        
        .section { margin-bottom: 6mm; }
        .section-title { 
          font-size: 11pt; 
          font-weight: bold; 
          background: #e6e6e6; 
          padding: 3px 6px; 
          margin-bottom: 4px;
          border-left: 3px solid #1890ff;
        }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 4px; font-size: 9pt; }
        td { padding: 2px 4px; border: 1px solid #333; }
        td.label { width: 28mm; background: #f5f5f5; font-weight: 500; }
        td.label2 { width: 22mm; background: #f5f5f5; font-weight: 500; }
        td.label3 { width: 18mm; background: #f5f5f5; font-weight: 500; }
        
        .two-col { display: table; width: 100%; }
        .two-col > div { display: table-cell; }
        
        .footer { 
          text-align: center; 
          font-size: 8pt; 
          color: #999; 
          margin-top: 5mm;
          border-top: 1px solid #eee;
          padding-top: 3mm;
        }
        
        .declaration {
          margin-top: 10mm;
          padding: 5mm;
          border: 1px solid #333;
        }
        .declaration-title {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 5mm;
        }
        .declaration-content {
          font-size: 8pt;
          line-height: 1.6;
          margin-bottom: 8mm;
          text-align: justify;
        }
        .declaration-sign {
          display: flex;
          justify-content: space-between;
          font-size: 9pt;
        }
        .sign-line {
          display: inline-block;
          min-width: 50mm;
          border-bottom: 1px solid #333;
          margin: 0 3mm;
        }
      </style>
    </head>
    <body>
      <!-- 第一页 -->
      <div class="page">
        <div class="header">
          <h1>应聘人员信息登记表</h1>
          <p>提交时间：${new Date().toLocaleString('zh-CN')}</p>
        </div>

        <div class="section">
          <div class="section-title">一、应聘渠道</div>
          <table>
            <tr>
              <td class="label">应聘渠道</td>
              <td style="width: 42mm;">${data.channel_type || '/'}${data.channel_type === '内部推荐' && data.channel_referrer ? `（推荐人：${data.channel_referrer}）` : ''}${data.channel_type === '其他渠道' && data.channel_other ? `（${data.channel_other}）` : ''}</td>
              <td class="label">应聘岗位</td>
              <td>${data.post || '/'}</td>
            </tr>
            <tr>
              <td class="label">预计到岗时间</td>
              <td>${data.entry_date || '/'}</td>
              <td class="label">岗位性质</td>
              <td>${data.job_type || '/'}</td>
            </tr>
            <tr>
              <td class="label">当前状态</td>
              <td>${data.current_status === '其他' ? data.current_status_other : data.current_status || '/'}</td>
              <td class="label">目前/期望月薪</td>
              <td>${data.current_salary || '/'} / ${data.salary_expectation || '/'}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">二、个人资料</div>
          <table>
            <tr>
              <td class="label">姓名（中文）</td>
              <td style="width: 38mm;">${data.name || '/'}</td>
              <td class="label">姓名（英文）</td>
              <td style="width: 38mm;">${data.name_en || '/'}</td>
              <td class="label">性别</td>
              <td>${data.sex || '/'}</td>
            </tr>
            <tr>
              <td class="label">出生日期</td>
              <td>${formatDate(data.birthday)}</td>
              <td class="label">婚姻状况</td>
              <td colspan="3">${data.marriage || '/'}</td>
            </tr>
            <tr>
              <td class="label">毕业院校</td>
              <td>${data.school || '/'}</td>
              <td class="label">最高学历/专业</td>
              <td colspan="3">${data.degree || '/'}</td>
            </tr>
            <tr>
              <td class="label">手机</td>
              <td>${data.mobilephone || '/'}</td>
              <td class="label">电子邮件</td>
              <td colspan="3">${data.email || '/'}</td>
            </tr>
            <tr>
              <td class="label">户籍地</td>
              <td>${data.household_address || '/'}</td>
              <td class="label">现居住地址</td>
              <td colspan="3">${data.living_address || '/'}</td>
            </tr>
            <tr>
              <td class="label">是否曾患重大疾病</td>
              <td>${data.has_disease || '/'}</td>
              <td class="label">是否曾发生劳动纠纷</td>
              <td>${data.has_dispute || '/'}</td>
              <td class="label">是否有犯罪记录</td>
              <td>${data.has_criminal || '/'}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">三、教育经历</div>
          <table>
            <tr style="background: #e6e6e6;">
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">起始</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">终止</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">学校名称</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">专业</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">学历</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">证书/学位</td>
            </tr>
            ${education}
          </table>
        </div>

        <div class="section">
          <div class="section-title">四、工作经历</div>
          <table>
            <tr style="background: #e6e6e6;">
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">起始</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">终止</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">公司名称</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">部门</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">职位</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">薪资</td>
            </tr>
            ${career}
          </table>
        </div>
      </div>

      <!-- 第二页 -->
      <div class="page">
        <div class="section">
          <div class="section-title">五、个人特质</div>
          <table>
            <tr>
              <td class="label">性格特点</td>
              <td>${data.character || '/'}</td>
            </tr>
            <tr>
              <td class="label">特长</td>
              <td>${data.speciality || '/'}</td>
            </tr>
            <tr>
              <td class="label">项目经历</td>
              <td>${data.project_detail || '/'}</td>
            </tr>
            <tr>
              <td class="label">工作职责理解</td>
              <td>${data.job_duty || '/'}</td>
            </tr>
            <tr>
              <td class="label">职业规划</td>
              <td>${data.plan || '/'}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">六、家庭信息</div>
          <table>
            <tr style="background: #e6e6e6;">
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">姓名</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">关系</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">工作单位</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">职位</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">年龄</td>
            </tr>
            ${family}
          </table>
        </div>

        <div class="section">
          <div class="section-title">七、本公司亲友</div>
          <table>
            <tr style="background: #e6e6e6;">
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">姓名</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">所在部门/岗位</td>
              <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">与本人关系</td>
            </tr>
            ${incompany}
          </table>
        </div>

        <div class="section">
          <div class="section-title">八、其他信息</div>
          <table>
            <tr>
              <td class="label">兴趣爱好</td>
              <td>${data.hobby || '/'}</td>
            </tr>
            <tr>
              <td class="label">健康状况</td>
              <td>${data.health || '/'}</td>
            </tr>
            <tr>
              <td class="label">是否有犯罪记录</td>
              <td>${data.criminal || '/'}</td>
            </tr>
            <tr>
              <td class="label">其他需要说明的事项</td>
              <td>${data.other || '/'}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          招聘系统-EVO | 本登记表由系统自动生成
        </div>

        <!-- 声明 -->
        <div class="declaration">
          <div class="declaration-title">声明</div>
          <div class="declaration-content">
            本人已经明白及接受上述之个人资料保障原则。同时，有关本人在求职申请表上所填写之一切均真实及正确。在必要时同意授权上海进化时代营销策划有限公司对上述信息进行核实确认。一旦以上任意陈述被发现不实或本人蓄意隐瞒相关事实，公司有权立即解除劳动关系并不给予任何经济补偿。
          </div>
          <div class="declaration-sign">
            <span>应聘人签署：</span>
            <span class="sign-line">　</span>
            <span>应聘日期：</span>
            <span class="sign-line">　</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 生成 PDF（使用 Puppeteer 在无头浏览器中渲染）
export async function generatePDF(data: ResumeData): Promise<{ buffer: Buffer; filename: string; filepath: string }> {
  let browser = null;
  
  try {
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
    ];
    
    browser = await puppeteer.launch({
      headless: true,
      args,
      executablePath: await chromium.executablePath(),
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    const html = generateResumeHTML(data);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });

    const pdfBuffer = Buffer.from(pdfUint8Array);
    await browser.close();

    const timestamp = Date.now();
    const sanitizedName = (data.name || 'Unknown').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const filename = `Resume_${sanitizedName}_${timestamp}.pdf`;
    
    const publicDir = path.join(process.cwd(), 'public', 'resumes');
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

export function getPDFDownloadUrl(filename: string): string {
  const domain = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'http://localhost:5000';
  return `${domain}/resumes/${filename}`;
}

export async function sendToFeishuWebhook(data: ResumeData, pdfUrl: string): Promise<void> {
  const message = {
    msg_type: 'interactive',
    card: {
      config: { wide_screen_mode: true },
      header: {
        title: { tag: 'plain_text', content: '📋 新简历提交通知' },
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
        { tag: 'hr' },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【联系方式】**\n**手机：**${data.mobilephone || '/'}\n**邮箱：**${data.email || '/'}`
          }
        },
        { tag: 'hr' },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【应聘信息】**\n**应聘渠道：**${data.channel_type || '/'}${data.channel_referrer ? `（推荐人：${data.channel_referrer}）` : ''}\n**岗位性质：**${data.job_type || '/'}\n**当前状态：**${data.current_status === '其他' ? data.current_status_other : data.current_status || '/'}\n**薪资：**${data.current_salary || '/'} / ${data.salary_expectation || '/'}`
          }
        },
        { tag: 'hr' },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【学历背景】**\n${data.school || '/'} | ${data.degree || '/'}`
          }
        },
        { tag: 'hr' },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: { tag: 'plain_text', content: '📥 下载PDF简历' },
              type: 'primary',
              url: pdfUrl
            }
          ]
        },
        {
          tag: 'note',
          elements: [
            { tag: 'plain_text', content: `提交时间：${new Date().toLocaleString('zh-CN')}` }
          ]
        }
      ]
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

export async function processResumeAndNotify(data: ResumeData): Promise<{ pdfUrl: string }> {
  const { filename } = await generatePDF(data);
  const pdfUrl = getPDFDownloadUrl(filename);
  await sendToFeishuWebhook(data, pdfUrl);
  return { pdfUrl };
}
