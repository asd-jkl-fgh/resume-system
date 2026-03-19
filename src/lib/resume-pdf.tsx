import { ResumeData } from '@/types/resume';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottom: '2 solid #333', paddingBottom: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  headerSubText: { fontSize: 9, color: '#666', marginTop: 3 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', backgroundColor: '#e6e6e6', padding: 3, paddingLeft: 6, borderLeft: '3 solid #1890ff', marginBottom: 6 },
  row: { flexDirection: 'row', borderBottom: '1 solid #333' },
  label: { width: 90, backgroundColor: '#f5f5f5', padding: 3, paddingLeft: 5, fontWeight: '500' },
  value: { flex: 1, padding: 3, paddingLeft: 5, textAlign: 'center' },
  valueLeft: { flex: 1, padding: 3, paddingLeft: 5 },
  table: { border: '1 solid #333', marginBottom: 6 },
  th: { backgroundColor: '#e6e6e6', padding: 3, textAlign: 'center', borderBottom: '1 solid #333', borderRight: '1 solid #333' },
  td: { padding: 3, textAlign: 'center', borderBottom: '1 solid #333', borderRight: '1 solid #333', fontSize: 9 },
  tdLeft: { padding: 3, textAlign: 'left', borderBottom: '1 solid #333', borderRight: '1 solid #333', fontSize: 9 },
  footer: { position: 'absolute', bottom: 15, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#999', borderTop: '1 solid #eee', paddingTop: 5 },
  declaration: { marginTop: 20, padding: 10, border: '1 solid #333' },
  declarationTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  declarationText: { fontSize: 8, lineHeight: 1.6, textAlign: 'justify', marginBottom: 15 },
  signRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 9 },
  signLine: { borderBottom: '1 solid #333', minWidth: 100, marginHorizontal: 5 },
});

const formatValue = (value: string | undefined | null) => {
  if (value === undefined || value === null || value === '') return '无';
  return value;
};

const ResumePDF = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* 头部 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>EVOLUTICAN</Text>
        </View>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>应聘人员信息登记表</Text>
          <Text style={styles.headerSubText}>提交时间：{new Date().toLocaleString('zh-CN')}</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* 一、应聘渠道 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>一、应聘渠道</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>应聘渠道</Text>
            <Text style={styles.value}>{formatValue(data.channel_type)}</Text>
            <Text style={styles.label}>应聘岗位</Text>
            <Text style={styles.value}>{formatValue(data.post)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>预计到岗时间</Text>
            <Text style={styles.value}>{formatValue(data.entry_date)}</Text>
            <Text style={styles.label}>岗位性质</Text>
            <Text style={styles.value}>{formatValue(data.job_type)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>当前状态</Text>
            <Text style={styles.value}>{data.current_status === '其他' ? formatValue(data.current_status_other) : formatValue(data.current_status)}</Text>
            <Text style={styles.label}>目前/期望月薪</Text>
            <Text style={styles.value}>{formatValue(data.current_salary)} / {formatValue(data.salary_expectation)}</Text>
          </View>
        </View>
      </View>

      {/* 二、个人资料 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>二、个人资料</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>姓名（中文）</Text>
            <Text style={styles.value}>{formatValue(data.name)}</Text>
            <Text style={styles.label}>姓名（英文）</Text>
            <Text style={styles.value}>{formatValue(data.name_en)}</Text>
            <Text style={styles.label}>性别</Text>
            <Text style={styles.value}>{formatValue(data.sex)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>出生日期</Text>
            <Text style={styles.value}>{data.birthday || '无'}</Text>
            <Text style={styles.label}>兴趣爱好</Text>
            <Text style={styles.value}>{formatValue(data.hobby)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>婚姻状况</Text>
            <Text style={styles.value}>{formatValue(data.marriage)}</Text>
            <Text style={styles.label}>毕业院校</Text>
            <Text style={styles.value}>{formatValue(data.school)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>最高学历/专业</Text>
            <Text style={styles.value}>{formatValue(data.degree)}</Text>
            <Text style={styles.label}>手机</Text>
            <Text style={styles.value}>{formatValue(data.mobilephone)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>电子邮件</Text>
            <Text style={styles.value}>{formatValue(data.email)}</Text>
            <Text style={styles.label}>户籍地</Text>
            <Text style={styles.value}>{formatValue(data.household_address)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>现居住地址</Text>
            <Text style={styles.valueLeft} >{formatValue(data.living_address)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>是否曾患重大疾病</Text>
            <Text style={styles.value}>{formatValue(data.has_disease)}</Text>
            <Text style={styles.label}>是否曾发生劳动纠纷</Text>
            <Text style={styles.value}>{formatValue(data.has_dispute)}</Text>
            <Text style={styles.label}>是否有犯罪记录</Text>
            <Text style={styles.value}>{formatValue(data.has_criminal)}</Text>
          </View>
        </View>
      </View>

      {/* 三、教育经历 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>三、教育经历 <Text style={{ fontWeight: 'normal', fontSize: 8 }}>（请从高中开始填写）</Text></Text>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row', backgroundColor: '#e6e6e6' }}>
            <Text style={{ ...styles.th, width: 40 }}>起始</Text>
            <Text style={{ ...styles.th, width: 40 }}>终止</Text>
            <Text style={{ ...styles.th, flex: 1 }}>学校名称</Text>
            <Text style={{ ...styles.th, width: 50 }}>专业</Text>
            <Text style={{ ...styles.th, width: 40 }}>学历</Text>
            <Text style={{ ...styles.th, width: 50 }}>证书/学位</Text>
          </View>
          {data.education_detail && data.education_detail.length > 0 ? (
            data.education_detail.map((e, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                <Text style={{ ...styles.td, width: 40 }}>{formatValue(e.start)}</Text>
                <Text style={{ ...styles.td, width: 40 }}>{formatValue(e.end)}</Text>
                <Text style={{ ...styles.tdLeft, flex: 1 }}>{formatValue(e.school)}</Text>
                <Text style={{ ...styles.td, width: 50 }}>{formatValue(e.major)}</Text>
                <Text style={{ ...styles.td, width: 40 }}>{formatValue(e.degree)}</Text>
                <Text style={{ ...styles.td, width: 50 }}>{formatValue(e.certificate)}</Text>
              </View>
            ))
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...styles.td, flex: 1 }}>无</Text>
            </View>
          )}
        </View>
      </View>

      {/* 四、工作经历 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>四、工作经历</Text>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row', backgroundColor: '#e6e6e6' }}>
            <Text style={{ ...styles.th, width: 40 }}>起始</Text>
            <Text style={{ ...styles.th, width: 40 }}>终止</Text>
            <Text style={{ ...styles.th, flex: 1 }}>公司名称</Text>
            <Text style={{ ...styles.th, width: 50 }}>部门</Text>
            <Text style={{ ...styles.th, width: 50 }}>职位</Text>
            <Text style={{ ...styles.th, width: 40 }}>薪资</Text>
          </View>
          {data.career_detail && data.career_detail.length > 0 ? (
            data.career_detail.map((w, i) => (
              <View key={i}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ ...styles.td, width: 40 }}>{formatValue(w.start)}</Text>
                  <Text style={{ ...styles.td, width: 40 }}>{formatValue(w.end)}</Text>
                  <Text style={{ ...styles.tdLeft, flex: 1 }}>{formatValue(w.company)}</Text>
                  <Text style={{ ...styles.td, width: 50 }}>{formatValue(w.department)}</Text>
                  <Text style={{ ...styles.td, width: 50 }}>{formatValue(w.job)}</Text>
                  <Text style={{ ...styles.td, width: 40 }}>{formatValue(w.salary)}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ ...styles.td, width: 60, backgroundColor: '#f5f5f5' }}>离职原因</Text>
                  <Text style={{ ...styles.tdLeft, flex: 1 }} >{formatValue(w.reason)}</Text>
                  <Text style={{ ...styles.td, width: 60, backgroundColor: '#f5f5f5' }}>证明人</Text>
                  <Text style={{ ...styles.td, width: 60 }}>{formatValue(w.reference)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...styles.td, flex: 1 }}>无</Text>
            </View>
          )}
        </View>
      </View>

      {/* 五、个人特质 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>五、个人特质</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>性格特点</Text>
            <Text style={styles.valueLeft}>{formatValue(data.character)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>特长</Text>
            <Text style={styles.valueLeft}>{formatValue(data.speciality)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>最有价值的项目和自我收获</Text>
            <Text style={styles.valueLeft}>{formatValue(data.project_detail)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>工作职责理解</Text>
            <Text style={styles.valueLeft}>{formatValue(data.job_duty)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>职业规划</Text>
            <Text style={styles.valueLeft}>{formatValue(data.plan)}</Text>
          </View>
        </View>
      </View>

      {/* 六、家庭信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>六、家庭信息</Text>
        <View style={styles.table}>
          <View style={{ flexDirection: 'row', backgroundColor: '#e6e6e6' }}>
            <Text style={{ ...styles.th, flex: 1 }}>姓名</Text>
            <Text style={{ ...styles.th, width: 50 }}>关系</Text>
            <Text style={{ ...styles.th, flex: 1 }}>工作单位</Text>
            <Text style={{ ...styles.th, width: 50 }}>职位</Text>
            <Text style={{ ...styles.th, width: 40 }}>年龄</Text>
          </View>
          {data.family_info && data.family_info.length > 0 ? (
            data.family_info.map((f, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                <Text style={{ ...styles.td, flex: 1 }}>{formatValue(f.name)}</Text>
                <Text style={{ ...styles.td, width: 50 }}>{formatValue(f.relation)}</Text>
                <Text style={{ ...styles.tdLeft, flex: 1 }}>{formatValue(f.organ)}</Text>
                <Text style={{ ...styles.td, width: 50 }}>{formatValue(f.work)}</Text>
                <Text style={{ ...styles.td, width: 40 }}>{formatValue(f.age)}</Text>
              </View>
            ))
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...styles.td, flex: 1 }}>无</Text>
            </View>
          )}
        </View>
      </View>

      {/* 页脚 */}
      <Text style={styles.footer}>招聘系统-EVO | 本登记表由系统自动生成</Text>

      {/* 声明 */}
      <View style={styles.declaration}>
        <Text style={styles.declarationTitle}>声明</Text>
        <Text style={styles.declarationText}>
          本人已经明白及接受上述之个人资料保障原则。同时，有关本人在求职申请表上所填写之一切均真实及正确。在必要时同意授权上海进化时代营销策划有限公司对上述信息进行核实确认。一旦以上任意陈述被发现不实或本人蓄意隐瞒相关事实，公司有权立即解除劳动关系并不给予任何经济补偿。
        </Text>
        <View style={styles.signRow}>
          <Text>应聘人签署：</Text>
          <Text style={styles.signLine}></Text>
          <Text>应聘日期：</Text>
          <Text style={styles.signLine}></Text>
        </View>
      </View>
    </Page>
  </Document>
);

// 生成 PDF（使用 @react-pdf/renderer）
export async function generatePDF(data: ResumeData): Promise<{ buffer: Buffer; filename: string; filepath: string }> {
  try {
    const pdfBlob = await pdf(<ResumePDF data={data} />).toBlob();
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const sanitizedName = (data.name || 'Unknown').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const filename = `Resume_${sanitizedName}_${timestamp}.pdf`;
    
    const publicDir = '/tmp/resumes';
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const filepath = path.join(publicDir, filename);
    fs.writeFileSync(filepath, pdfBuffer);
    
    return { buffer: pdfBuffer, filename, filepath };
  } catch (error) {
    console.error('生成 PDF 失败:', error);
    throw error;
  }
}

export function getPDFDownloadUrl(filename: string): string {
  // 部署环境使用 /tmp，需要通过 API 路由访问
  return `/api/download?file=${encodeURIComponent(filename)}`;
}

export async function sendToFeishuWebhook(data: ResumeData, pdfUrl: string): Promise<void> {
  const FEISHU_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/e39c0e09-3b64-4ce4-b01a-5049f108789b';

  const formatValue = (value: string | undefined | null) => {
    if (value === undefined || value === null || value === '') return '无';
    return value;
  };

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
            content: `**【基本信息】**\n**姓名：**${formatValue(data.name)}\n**应聘岗位：**${formatValue(data.post)}\n**性别：**${formatValue(data.sex)} | **出生日期：**${formatValue(data.birthday)}`
          }
        },
        { tag: 'hr' },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【联系方式】**\n**手机：**${formatValue(data.mobilephone)}\n**邮箱：**${formatValue(data.email)}`
          }
        },
        { tag: 'hr' },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【应聘信息】**\n**应聘渠道：**${formatValue(data.channel_type)}\n**岗位性质：**${formatValue(data.job_type)}\n**当前状态：**${data.current_status === '其他' ? formatValue(data.current_status_other) : formatValue(data.current_status)}\n**薪资：**${formatValue(data.current_salary)} / ${formatValue(data.salary_expectation)}`
          }
        },
        { tag: 'hr' },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**【学历背景】**\n${formatValue(data.school)} | ${formatValue(data.degree)}`
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
