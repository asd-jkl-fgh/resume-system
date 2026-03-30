import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResumeData } from '@/types/resume';

// 飞书 Webhook URL
const FEISHU_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/e39c0e09-3b64-4ce4-b01a-5049f108789b';

// 格式化值
function formatValue(value: string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '无';
  return value;
}

// 生成 PDF
export async function generatePDF(data: ResumeData): Promise<{ buffer: Buffer; filename: string; base64: string }> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    // 标题
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('应聘人员信息登记表', pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`提交时间：${new Date().toLocaleString('zh-CN')}`, pageWidth / 2, y, { align: 'center' });
    y += 10;

    // 分隔线
    doc.setLineWidth(0.5);
    doc.line(15, y, pageWidth - 15, y);
    y += 8;

    // 一、应聘渠道
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('一、应聘渠道', 15, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [],
      body: [
        ['应聘渠道', formatValue(data.channel_type), '应聘岗位', formatValue(data.post)],
        ['预计到岗时间', formatValue(data.entry_date), '岗位性质', formatValue(data.job_type)],
        ['当前状态', formatValue(data.current_status), '目前月薪（税前）', formatValue(data.current_salary)],
        ['期望月薪（税前）', formatValue(data.salary_expectation), '', ''],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 45 }, 2: { cellWidth: 35 }, 3: { cellWidth: 45 } },
      margin: { left: 15, right: 15 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // 二、个人资料
    doc.setFontSize(11);
    doc.text('二、个人资料', 15, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [],
      body: [
        ['姓名（中文）', formatValue(data.name), '姓名（英文）', formatValue(data.name_en)],
        ['性别', formatValue(data.sex), '出生日期', formatValue(data.birthday)],
        ['毕业院校', formatValue(data.school), '最高学历', formatValue(data.degree)],
        ['专业', formatValue(data.major), '婚姻状况', formatValue(data.marriage)],
        ['手机', formatValue(data.mobilephone), '电子邮件', formatValue(data.email)],
        ['户籍地', formatValue(data.household_address), '', ''],
        ['现居住地址', formatValue(data.living_address), '', ''],
        ['是否曾患重大疾病', formatValue(data.has_disease), '是否发生劳动纠纷', formatValue(data.has_dispute)],
        ['是否有犯罪记录', formatValue(data.has_criminal), '', ''],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 50 }, 2: { cellWidth: 40 }, 3: { cellWidth: 40 } },
      didParseCell: function(data: any) {
        if (data.column.index === 2 && data.row.section === 'body' && !data.cell.text[0]) {
          data.cell.styles.cellWidth = 80;
        }
      },
      margin: { left: 15, right: 15 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // 三、教育经历
    doc.setFontSize(11);
    doc.text('三、教育经历', 15, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['起始', '终止', '学校名称', '专业', '学历', '证书/学位']],
      body: data.education_detail?.length > 0
        ? data.education_detail.map(e => [
            formatValue(e.start),
            formatValue(e.end),
            formatValue(e.school),
            formatValue(e.major),
            formatValue(e.degree),
            formatValue(e.certificate),
          ])
        : [['无', '', '', '', '', '']],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      margin: { left: 15, right: 15 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // 四、工作经历
    doc.setFontSize(11);
    doc.text('四、工作经历', 15, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['起始', '终止', '公司名称', '部门', '职位', '薪资']],
      body: data.career_detail?.length > 0
        ? data.career_detail.map(w => [
            formatValue(w.start),
            formatValue(w.end),
            formatValue(w.company),
            formatValue(w.department),
            formatValue(w.job),
            formatValue(w.salary),
          ])
        : [['无', '', '', '', '', '']],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      margin: { left: 15, right: 15 },
    });
    y = (doc as any).lastAutoTable.finalY + 6;

    // 工作经历详情
    if (data.career_detail?.length > 0) {
      data.career_detail.forEach((w, index) => {
        autoTable(doc, {
          startY: y,
          head: [],
          body: [
            ['离职原因', formatValue(w.reason)],
            ['证明人及联系方式', formatValue(w.reference)],
          ],
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 2 },
          headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
          columnStyles: { 0: { cellWidth: 50 } },
          margin: { left: 15, right: 15 },
        });
        y = (doc as any).lastAutoTable.finalY + 4;
      });
    }
    y += 6;

    // 五、个人特质
    doc.setFontSize(11);
    doc.text('五、个人特质', 15, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [],
      body: [
        ['性格特点', formatValue(data.character)],
        ['特长', formatValue(data.speciality)],
        ['最有价值的项目和自我收获', formatValue(data.project_detail)],
        ['工作职责理解', formatValue(data.job_duty)],
        ['职业规划', formatValue(data.plan)],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, minCellHeight: 10 },
      headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 60 } },
      margin: { left: 15, right: 15 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // 六、家庭信息
    doc.setFontSize(11);
    doc.text('六、家庭信息', 15, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['姓名', '关系', '工作单位', '职位', '年龄']],
      body: data.family_info?.length > 0
        ? data.family_info.map(f => [
            formatValue(f.name),
            formatValue(f.relation),
            formatValue(f.organ),
            formatValue(f.work),
            formatValue(f.age),
          ])
        : [['无', '', '', '', '']],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      margin: { left: 15, right: 15 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // 声明
    doc.setFontSize(11);
    doc.text('声明', 15, y);
    y += 6;

    doc.setFontSize(9);
    const declaration = '本人已经明白及接受上述之个人资料保障原则。同时，有关本人在求职申请表上所填写之一切均真实及正确。在必要时同意授权上海进化时代营销策划有限公司对上述信息进行核实确认。一旦以上任意陈述被发现不实或本人蓄意隐瞒相关事实，公司有权立即解除劳动关系并不给予任何经济补偿。';
    const lines = doc.splitTextToSize(declaration, pageWidth - 30);
    doc.text(lines, 15, y);
    y += lines.length * 5 + 10;

    doc.text('应聘人签署：________________', 15, y);
    doc.text('应聘日期：________________', pageWidth - 80, y);

    // 生成文件
    const pdfBuffer = doc.output('arraybuffer');
    const pdfArray = new Uint8Array(pdfBuffer);
    const buffer = Buffer.from(pdfArray);
    const timestamp = Date.now();
    const sanitizedName = (data.name || 'Unknown').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const filename = `Resume_${sanitizedName}_${timestamp}.pdf`;

    return {
      buffer,
      filename,
      base64: buffer.toString('base64'),
    };
  } catch (error) {
    console.error('生成 PDF 失败:', error);
    throw error;
  }
}

// 获取 PDF 下载链接
export function getPDFDownloadUrl(filename: string, base64: string): string {
  const domain = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'http://localhost:5000';
  const encoded = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '.');
  return `${domain}/d?f=${encodeURIComponent(filename)}&d=${encoded}`;
}

export async function sendToFeishuWebhook(data: ResumeData, pdfUrl: string): Promise<void> {
  const formatVal = (value: string | undefined | null) => {
    if (value === undefined || value === null || value === '') return '无';
    return value;
  };

  const message = {
    msg_type: 'text',
    content: {
      text: `📋 新简历提交通知\n\n👤 姓名：${formatVal(data.name)}\n📮 应聘岗位：${formatVal(data.post)}\n📱 手机：${formatVal(data.mobilephone)}\n📧 邮箱：${formatVal(data.email)}\n🏫 学历：${formatVal(data.school)} | ${formatVal(data.degree)}\n💼 当前状态：${formatVal(data.current_status)}\n💰 期望薪资：${formatVal(data.salary_expectation)}\n\n⏰ 提交时间：${new Date().toLocaleString('zh-CN')}`,
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
  const { filename, base64 } = await generatePDF(data);
  const pdfUrl = getPDFDownloadUrl(filename, base64);
  await sendToFeishuWebhook(data, pdfUrl);
  return { pdfUrl };
}
