import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

// 创建样式
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: '2px solid #333',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginBottom: 8,
    borderLeft: '3px solid #1890ff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '25%',
    color: '#666',
  },
  value: {
    width: '75%',
    fontWeight: '500',
  },
  halfRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  halfItem: {
    width: '50%',
    flexDirection: 'row',
  },
  quarterItem: {
    width: '25%',
    flexDirection: 'row',
  },
  table: {
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: 5,
    borderBottom: '1px solid #eee',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  },
});

interface ResumePDFProps {
  data: ResumeData;
}

export function ResumePDF({ data }: ResumePDFProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '/';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN');
    } catch {
      return dateStr;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>应聘人员信息登记表</Text>
          <Text style={styles.subtitle}>提交时间：{new Date().toLocaleString('zh-CN')}</Text>
        </View>

        {/* 应聘渠道 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>应聘渠道</Text>
          <View style={styles.row}>
            <Text style={styles.label}>应聘渠道：</Text>
            <Text style={styles.value}>
              {data.channel_type}
              {data.channel_type === '内部推荐' && data.channel_referrer ? `（推荐人：${data.channel_referrer}）` : ''}
              {data.channel_type === '其他渠道' && data.channel_other ? `（${data.channel_other}）` : ''}
            </Text>
          </View>
          <View style={styles.halfRow}>
            <View style={styles.halfItem}>
              <Text style={styles.label}>应聘岗位：</Text>
              <Text style={styles.value}>{data.post || '/'}</Text>
            </View>
            <View style={styles.halfItem}>
              <Text style={styles.label}>岗位性质：</Text>
              <Text style={styles.value}>{data.job_type || '/'}</Text>
            </View>
          </View>
          <View style={styles.halfRow}>
            <View style={styles.halfItem}>
              <Text style={styles.label}>当前状态：</Text>
              <Text style={styles.value}>
                {data.current_status === '其他' ? data.current_status_other : data.current_status || '/'}
              </Text>
            </View>
            <View style={styles.halfItem}>
              <Text style={styles.label}>预计到岗：</Text>
              <Text style={styles.value}>{data.entry_date || '/'}</Text>
            </View>
          </View>
          <View style={styles.halfRow}>
            <View style={styles.halfItem}>
              <Text style={styles.label}>目前月薪：</Text>
              <Text style={styles.value}>{data.current_salary || '/'}</Text>
            </View>
            <View style={styles.halfItem}>
              <Text style={styles.label}>期望月薪：</Text>
              <Text style={styles.value}>{data.salary_expectation || '/'}</Text>
            </View>
          </View>
        </View>

        {/* 个人资料 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>个人资料</Text>
          <View style={styles.row}>
            <View style={styles.quarterItem}>
              <Text style={styles.label}>姓名：</Text>
              <Text style={styles.value}>{data.name || '/'}</Text>
            </View>
            <View style={styles.quarterItem}>
              <Text style={styles.label}>英文名：</Text>
              <Text style={styles.value}>{data.name_en || '/'}</Text>
            </View>
            <View style={styles.quarterItem}>
              <Text style={styles.label}>性别：</Text>
              <Text style={styles.value}>{data.sex || '/'}</Text>
            </View>
            <View style={styles.quarterItem}>
              <Text style={styles.label}>出生日期：</Text>
              <Text style={styles.value}>{formatDate(data.birthday)}</Text>
            </View>
          </View>
          <View style={styles.halfRow}>
            <View style={styles.halfItem}>
              <Text style={styles.label}>毕业院校：</Text>
              <Text style={styles.value}>{data.school || '/'}</Text>
            </View>
            <View style={styles.halfItem}>
              <Text style={styles.label}>最高学历/专业：</Text>
              <Text style={styles.value}>{data.degree || '/'}</Text>
            </View>
          </View>
          <View style={styles.halfRow}>
            <View style={styles.halfItem}>
              <Text style={styles.label}>手机：</Text>
              <Text style={styles.value}>{data.mobilephone || '/'}</Text>
            </View>
            <View style={styles.halfItem}>
              <Text style={styles.label}>邮箱：</Text>
              <Text style={styles.value}>{data.email || '/'}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>婚姻状况：</Text>
            <Text style={styles.value}>{data.marriage || '/'}</Text>
          </View>
          <View style={styles.halfRow}>
            <View style={styles.halfItem}>
              <Text style={styles.label}>户籍地：</Text>
              <Text style={styles.value}>{data.household_address || '/'}</Text>
            </View>
            <View style={styles.halfItem}>
              <Text style={styles.label}>现居住地址：</Text>
              <Text style={styles.value}>{data.living_address || '/'}</Text>
            </View>
          </View>
          <View style={styles.halfRow}>
            <View style={styles.halfItem}>
              <Text style={styles.label}>重大疾病史：</Text>
              <Text style={styles.value}>{data.has_disease || '/'}</Text>
            </View>
            <View style={styles.halfItem}>
              <Text style={styles.label}>劳动纠纷：</Text>
              <Text style={styles.value}>{data.has_dispute || '/'}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>违法记录：</Text>
            <Text style={styles.value}>{data.has_criminal || '/'}</Text>
          </View>
        </View>

        {/* 教育经历 */}
        {data.education_detail && data.education_detail.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>教育经历</Text>
            {data.education_detail.map((edu, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.value}>
                  {edu.start}~{edu.end} {edu.school} {edu.major} {edu.degree}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 工作经历 */}
        {data.career_detail && data.career_detail.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>工作经历</Text>
            {data.career_detail.map((work, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={styles.row}>
                  <Text style={styles.value}>
                    {work.start}~{work.end} {work.company} {work.department} {work.job}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>薪资/离职原因：</Text>
                  <Text style={styles.value}>{work.salary} / {work.reason || '/'}</Text>
                </View>
                {work.reference && (
                  <View style={styles.row}>
                    <Text style={styles.label}>证明人：</Text>
                    <Text style={styles.value}>{work.reference}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 紧急联系人 */}
        {data.emergency_contacts && data.emergency_contacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>紧急联系人</Text>
            {data.emergency_contacts.map((contact, index) => (
              <View key={index} style={styles.halfRow}>
                <View style={styles.halfItem}>
                  <Text style={styles.label}>姓名：</Text>
                  <Text style={styles.value}>{contact.name}</Text>
                </View>
                <View style={styles.halfItem}>
                  <Text style={styles.label}>关系：</Text>
                  <Text style={styles.value}>{contact.relation}</Text>
                </View>
                <Text style={styles.label}>电话：</Text>
                <Text style={styles.value}>{contact.mobilephone}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 页脚 */}
        <Text style={styles.footer}>
          招聘系统-EVO | 本登记表由系统自动生成
        </Text>
      </Page>
    </Document>
  );
}
