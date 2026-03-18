import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/types/resume';
import { processResumeAndNotify } from '@/lib/resume-pdf';

// 飞书开放平台 API 配置（可选）
// 如果配置了多维表格，数据会同时写入多维表格

interface FeishuTokenResponse {
  access_token: string;
  expires_in: number;
}

// 获取飞书访问令牌（用于多维表格）
async function getFeishuAccessToken(): Promise<string> {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('飞书应用配置缺失');
  }

  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: appId,
      app_secret: appSecret,
    }),
  });

  const data = await response.json();
  
  if (data.code !== 0) {
    throw new Error(`获取飞书访问令牌失败: ${data.msg}`);
  }

  return data.tenant_access_token;
}

// 将简历数据发送到飞书多维表格（可选）
async function sendToFeishuBitable(resumeData: ResumeData): Promise<void> {
  const bitableToken = process.env.FEISHU_BITABLE_TOKEN;
  const tableId = process.env.FEISHU_TABLE_ID;

  if (!bitableToken || !tableId) {
    // 没有配置多维表格，跳过
    return;
  }

  try {
    const token = await getFeishuAccessToken();

    // 构建多维表格记录
    const fields: Record<string, any> = {
      '应聘渠道': resumeData.channel_type,
      '推荐人': resumeData.channel_referrer,
      '其他渠道说明': resumeData.channel_other,
      '应聘岗位': resumeData.post,
      '预计到岗时间': resumeData.entry_date,
      '岗位性质': resumeData.job_type,
      '当前状态': resumeData.current_status === '其他' ? resumeData.current_status_other : resumeData.current_status,
      '目前月薪': resumeData.current_salary,
      '期望月薪': resumeData.salary_expectation,
      '姓名（中文）': resumeData.name,
      '姓名（英文）': resumeData.name_en,
      '性别': resumeData.sex,
      '出生日期': resumeData.birthday,
      '毕业院校': resumeData.school,
      '最高学历/专业': resumeData.degree,
      '户籍地': resumeData.household_address,
      '手机': resumeData.mobilephone,
      '电子邮件': resumeData.email,
      '婚姻状况': resumeData.marriage,
      '现居住地址': resumeData.living_address,
      '是否曾患重大疾病': resumeData.has_disease,
      '是否曾发生劳动纠纷': resumeData.has_dispute,
      '是否曾被判刑或拘留': resumeData.has_criminal,
      '性格特点': resumeData.character,
      '特长': resumeData.speciality,
      '项目经历': resumeData.project_detail,
      '工作职责理解': resumeData.job_duty,
      '职业规划': resumeData.plan,
      '兴趣爱好': resumeData.hobby,
      '其他说明': resumeData.other,
      '提交时间': new Date().toLocaleString('zh-CN'),
    };

    // 添加教育经历
    if (resumeData.education_detail.length > 0) {
      fields['教育经历'] = resumeData.education_detail
        .map((edu) => `${edu.start}~${edu.end} ${edu.school} ${edu.major} ${edu.degree}`)
        .join('\n');
    }

    // 添加工作经历
    if (resumeData.career_detail.length > 0) {
      fields['工作经历'] = resumeData.career_detail
        .map((work) => `${work.start}~${work.end} ${work.company} ${work.department} ${work.job} 证明人:${work.reference || '无'}`)
        .join('\n');
    }

    // 添加家庭信息
    if (resumeData.family_info.length > 0) {
      fields['家庭信息'] = resumeData.family_info
        .map((family) => `${family.name}(${family.relation}) ${family.organ} ${family.work}`)
        .join('\n');
    }

    await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${bitableToken}/tables/${tableId}/records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );
  } catch (error) {
    console.error('写入飞书多维表格失败（非关键错误）:', error);
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

    // 1. 生成 PDF 并发送飞书 Webhook 通知
    const { pdfUrl } = await processResumeAndNotify(resumeData);

    // 2. 写入飞书多维表格（可选，如果配置了的话）
    await sendToFeishuBitable(resumeData);

    return NextResponse.json(
      { 
        success: true, 
        message: '简历提交成功',
        pdfUrl: pdfUrl
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
