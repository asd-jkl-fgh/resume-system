"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "sonner";
import { ResumeData, initialResumeData } from "@/types/resume";
import { ChannelSection } from "./ChannelSection";
import { PersonalSection } from "./PersonalSection";
import { EducationSection } from "./EducationSection";
import { CareerSection } from "./CareerSection";
import { FamilySection } from "./FamilySection";
import { TraitsSection } from "./TraitsSection";
import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

// 生成简历HTML内容（用于前端PDF生成）
function generateResumeHTML(data: ResumeData): string {
  const formatValue = (value: string | undefined | null) => {
    if (value === undefined || value === null || value === '') return '无';
    return value;
  };

  const education = data.education_detail?.map(e => 
    `<tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(e.start)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(e.end)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(e.school)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(e.major)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(e.degree)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(e.certificate)}</td>
    </tr>`
  ).join('');

  const career = data.career_detail?.map(w => 
    `<tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(w.start)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(w.end)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(w.company)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(w.department)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(w.job)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(w.salary)}</td>
    </tr>
    <tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt; background: #f5f5f5;">离职原因</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt; text-align: left;" colspan="3">${formatValue(w.reason)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt; background: #f5f5f5;">证明人及联系方式</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(w.reference)}</td>
    </tr>`
  ).join('');

  const family = data.family_info?.map(f => 
    `<tr>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(f.name)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(f.relation)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(f.organ)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(f.work)}</td>
      <td style="border: 1px solid #333; padding: 3px; font-size: 9pt;">${formatValue(f.age)}</td>
    </tr>`
  ).join('');

  return `
    <div style="width: 210mm; padding: 10mm; font-family: 'Microsoft YaHei', 'SimHei', sans-serif; font-size: 10pt; line-height: 1.3; color: #333;">
      <h1 style="text-align: center; font-size: 18pt; margin-bottom: 3mm; border-bottom: 2px solid #333; padding-bottom: 5mm;">应聘人员信息登记表</h1>
      <p style="text-align: center; color: #666; font-size: 9pt; margin-bottom: 5mm;">提交时间：${new Date().toLocaleString('zh-CN')}</p>
      
      <div style="margin-bottom: 5mm;">
        <h2 style="font-size: 11pt; background: #e6e6e6; padding: 2px 6px; border-left: 3px solid #1890ff; margin-bottom: 3px;">一、应聘渠道</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5; width: 28mm;">应聘渠道</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.channel_type)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5; width: 28mm;">应聘岗位</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.post)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">预计到岗时间</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.entry_date)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">岗位性质</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.job_type)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">当前状态</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.current_status)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">目前月薪（税前）</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.current_salary)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">期望月薪（税前）</td>
            <td style="border: 1px solid #333; padding: 3px;" colspan="3">${formatValue(data.salary_expectation)}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 5mm;">
        <h2 style="font-size: 11pt; background: #e6e6e6; padding: 2px 6px; border-left: 3px solid #1890ff; margin-bottom: 3px;">二、个人资料</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5; width: 28mm;">姓名（中文）</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.name)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5; width: 28mm;">姓名（英文）</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.name_en)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">性别</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.sex)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">出生日期</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.birthday)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">毕业院校</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.school)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">最高学历</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.degree)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">专业</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.major)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">婚姻状况</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.marriage)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">手机</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.mobilephone)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">电子邮件</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.email)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">户籍地</td>
            <td style="border: 1px solid #333; padding: 3px; text-align: left;" colspan="3">${formatValue(data.household_address)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">现居住地址</td>
            <td style="border: 1px solid #333; padding: 3px; text-align: left;" colspan="3">${formatValue(data.living_address)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">是否曾患重大疾病</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.has_disease)}</td>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">是否发生劳动纠纷</td>
            <td style="border: 1px solid #333; padding: 3px;">${formatValue(data.has_dispute)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">是否有犯罪记录</td>
            <td style="border: 1px solid #333; padding: 3px;" colspan="3">${formatValue(data.has_criminal)}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 5mm;">
        <h2 style="font-size: 11pt; background: #e6e6e6; padding: 2px 6px; border-left: 3px solid #1890ff; margin-bottom: 3px;">三、教育经历</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <tr style="background: #e6e6e6;">
            <td style="border: 1px solid #333; padding: 3px;">起始</td>
            <td style="border: 1px solid #333; padding: 3px;">终止</td>
            <td style="border: 1px solid #333; padding: 3px;">学校名称</td>
            <td style="border: 1px solid #333; padding: 3px;">专业</td>
            <td style="border: 1px solid #333; padding: 3px;">学历</td>
            <td style="border: 1px solid #333; padding: 3px;">证书/学位</td>
          </tr>
          ${education}
        </table>
      </div>

      <div style="margin-bottom: 5mm;">
        <h2 style="font-size: 11pt; background: #e6e6e6; padding: 2px 6px; border-left: 3px solid #1890ff; margin-bottom: 3px;">四、工作经历</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <tr style="background: #e6e6e6;">
            <td style="border: 1px solid #333; padding: 3px;">起始</td>
            <td style="border: 1px solid #333; padding: 3px;">终止</td>
            <td style="border: 1px solid #333; padding: 3px;">公司名称</td>
            <td style="border: 1px solid #333; padding: 3px;">部门</td>
            <td style="border: 1px solid #333; padding: 3px;">职位</td>
            <td style="border: 1px solid #333; padding: 3px;">薪资</td>
          </tr>
          ${career}
        </table>
      </div>

      <div style="margin-bottom: 5mm;">
        <h2 style="font-size: 11pt; background: #e6e6e6; padding: 2px 6px; border-left: 3px solid #1890ff; margin-bottom: 3px;">五、个人特质</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5; width: 50mm;">性格特点</td>
            <td style="border: 1px solid #333; padding: 3px; text-align: left;">${formatValue(data.character)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">特长</td>
            <td style="border: 1px solid #333; padding: 3px; text-align: left;">${formatValue(data.speciality)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">最有价值的项目和自我收获</td>
            <td style="border: 1px solid #333; padding: 3px; text-align: left;">${formatValue(data.project_detail)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">工作职责理解</td>
            <td style="border: 1px solid #333; padding: 3px; text-align: left;">${formatValue(data.job_duty)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #333; padding: 3px; background: #f5f5f5;">职业规划</td>
            <td style="border: 1px solid #333; padding: 3px; text-align: left;">${formatValue(data.plan)}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 5mm;">
        <h2 style="font-size: 11pt; background: #e6e6e6; padding: 2px 6px; border-left: 3px solid #1890ff; margin-bottom: 3px;">六、家庭信息</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <tr style="background: #e6e6e6;">
            <td style="border: 1px solid #333; padding: 3px;">姓名</td>
            <td style="border: 1px solid #333; padding: 3px;">关系</td>
            <td style="border: 1px solid #333; padding: 3px;">工作单位</td>
            <td style="border: 1px solid #333; padding: 3px;">职位</td>
            <td style="border: 1px solid #333; padding: 3px;">年龄</td>
          </tr>
          ${family}
        </table>
      </div>

      <div style="margin-top: 10mm; padding: 5mm; border: 1px solid #333;">
        <h3 style="font-size: 12pt; margin-bottom: 5mm;">声明</h3>
        <p style="font-size: 8pt; line-height: 1.6; margin-bottom: 8mm;">本人已经明白及接受上述之个人资料保障原则。同时，有关本人在求职申请表上所填写之一切均真实及正确。在必要时同意授权上海进化时代营销策划有限公司对上述信息进行核实确认。一旦以上任意陈述被发现不实或本人蓄意隐瞒相关事实，公司有权立即解除劳动关系并不给予任何经济补偿。</p>
        <p>应聘人签署：________________　　应聘日期：________________</p>
      </div>
    </div>
  `;
}

const resumeSchema = z.object({
  // 应聘渠道
  channel_type: z.string().min(1, "请选择应聘渠道"),
  channel_referrer: z.string(),
  channel_other: z.string(),
  
  // 应聘信息
  post: z.string().min(1, "请输入应聘岗位"),
  entry_date: z.string().min(1, "请填写预计到岗时间"),
  job_type: z.string().min(1, "请选择岗位性质"),
  current_status: z.string().min(1, "请选择当前状态"),
  current_status_other: z.string(),
  current_salary: z.string().min(1, "请填写目前月薪"),
  salary_expectation: z.string().min(1, "请输入期望月薪"),
  
  // 个人资料
  name: z.string().min(1, "请输入姓名"),
  name_en: z.string().min(1, "请输入英文名"),
  sex: z.string().min(1, "请选择性别"),
  birthday: z.string().min(1, "请选择出生日期"),
  school: z.string().min(1, "请填写毕业院校"),
  degree: z.string().min(1, "请填写最高学历"),
  major: z.string().min(1, "请填写专业"),
  household_address: z.string().min(1, "请填写户籍地"),
  mobilephone: z.string().min(11, "请输入正确的手机号码"),
  email: z.string().email("请输入正确的邮箱地址"),
  marriage: z.string().min(1, "请选择婚姻状况"),
  living_address: z.string().min(1, "请填写现居住地址"),
  has_disease: z.string().min(1, "请选择是否曾患重大疾病"),
  has_dispute: z.string().min(1, "请选择是否曾发生劳动纠纷"),
  has_criminal: z.string().min(1, "请选择是否有犯罪记录"),
  
  // 教育经历
  education_detail: z.array(z.object({
    id: z.string(),
    start: z.string().min(1, "请填写开始时间"),
    end: z.string().min(1, "请填写结束时间"),
    school: z.string().min(1, "请填写学校名称"),
    major: z.string().min(1, "请填写专业"),
    degree: z.string().min(1, "请填写学历"),
    certificate: z.string().min(1, "请填写证书/学位"),
  })).min(1, "请至少填写1条教育经历"),
  
  // 工作经历
  career_detail: z.array(z.object({
    id: z.string(),
    start: z.string().min(1, "请填写开始时间"),
    end: z.string().min(1, "请填写结束时间"),
    company: z.string().min(1, "请填写公司名称"),
    department: z.string().min(1, "请填写部门"),
    job: z.string().min(1, "请填写职位"),
    salary: z.string().min(1, "请填写薪资"),
    reason: z.string().min(1, "请填写离职原因"),
    reference: z.string().min(1, "请填写证明人及联系方式"),
  })).min(1, "请至少填写1条工作经历"),
  
  // 个人特质
  character: z.string().min(1, "请填写性格特点"),
  speciality: z.string().min(1, "请填写特长"),
  project_detail: z.string().min(1, "请填写项目经历"),
  job_duty: z.string().min(1, "请填写工作职责理解"),
  plan: z.string().min(1, "请填写职业规划"),
  
  // 家庭信息
  family_info: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "请填写姓名"),
    relation: z.string().min(1, "请填写关系"),
    organ: z.string().min(1, "请填写工作单位"),
    work: z.string().min(1, "请填写职位"),
    age: z.string().min(1, "请填写年龄"),
  })).min(1, "请至少填写1条家庭信息"),
  
  // 其他信息（选填）
  hobby: z.string(),
  health: z.string(),
  criminal: z.string(),
  other: z.string(),
  
  // 声明
  declaration: z.boolean().refine((val) => val === true, {
    message: "请确认信息真实有效",
  }),
});

export function ResumeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema) as any,
    defaultValues: initialResumeData,
    mode: "onChange",
  });

  const onSubmit = async (data: ResumeData) => {
    setIsSubmitting(true);
    try {
      // 1. 先发送数据到服务器
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 2. 生成并下载PDF
        try {
          const html2pdf = (await import('html2pdf.js')).default;
          
          // 创建PDF内容
          const pdfContent = document.createElement('div');
          pdfContent.innerHTML = generateResumeHTML(data);
          pdfContent.style.fontFamily = 'Microsoft YaHei, SimHei, sans-serif';
          pdfContent.style.fontSize = '10pt';
          pdfContent.style.lineHeight = '1.3';
          pdfContent.style.padding = '10mm';
          pdfContent.style.width = '210mm';
          pdfContent.style.background = 'white';
          pdfContent.style.color = '#333';
          
          document.body.appendChild(pdfContent);
          
          const opt = {
            margin: 0,
            filename: `Resume_${data.name}_${Date.now()}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
          };
          
          await html2pdf().set(opt).from(pdfContent).save();
          document.body.removeChild(pdfContent);
        } catch (pdfError) {
          console.error('生成PDF失败:', pdfError);
        }
        
        toast.success("提交成功", {
          description: "您的简历已成功提交，PDF正在下载中！",
        });
        form.reset(initialResumeData);
      } else {
        throw new Error(result.error || "提交失败");
      }
    } catch (error: any) {
      toast.error("提交失败", {
        description: error.message || "提交过程中出现错误，请稍后重试",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理表单验证错误
  const onInvalid = (errors: any) => {
    console.log("表单验证错误:", errors);
    
    // 收集所有错误信息
    const errorMessages: string[] = [];
    
    if (errors.channel_type) errorMessages.push("请选择应聘渠道");
    if (errors.channel_referrer) errorMessages.push("请填写推荐人");
    if (errors.channel_other) errorMessages.push("请填写其他渠道");
    if (errors.post) errorMessages.push("请输入应聘岗位");
    if (errors.entry_date) errorMessages.push("请填写预计到岗时间");
    if (errors.job_type) errorMessages.push("请选择岗位性质");
    if (errors.current_status) errorMessages.push("请选择当前状态");
    if (errors.current_salary) errorMessages.push("请填写目前月薪");
    if (errors.salary_expectation) errorMessages.push("请输入期望月薪");
    if (errors.name) errorMessages.push("请输入姓名");
    if (errors.name_en) errorMessages.push("请输入英文名");
    if (errors.sex) errorMessages.push("请选择性别");
    if (errors.birthday) errorMessages.push("请选择出生日期");
    if (errors.school) errorMessages.push("请填写毕业院校");
    if (errors.degree) errorMessages.push("请填写学历/专业");
    if (errors.household_address) errorMessages.push("请填写户籍地");
    if (errors.mobilephone) errorMessages.push("请输入正确的手机号码");
    if (errors.email) errorMessages.push("请输入正确的邮箱地址");
    if (errors.marriage) errorMessages.push("请选择婚姻状况");
    if (errors.living_address) errorMessages.push("请填写现居住地址");
    if (errors.has_disease) errorMessages.push("请选择健康状况");
    if (errors.has_dispute) errorMessages.push("请选择劳动纠纷情况");
    if (errors.has_criminal) errorMessages.push("请选择犯罪记录情况");
    if (errors.education_detail) errorMessages.push("请至少填写1条教育经历");
    if (errors.career_detail) errorMessages.push("请至少填写1条工作经历");
    if (errors.character) errorMessages.push("请填写性格特点");
    if (errors.speciality) errorMessages.push("请填写特长");
    if (errors.project_detail) errorMessages.push("请填写项目经历");
    if (errors.job_duty) errorMessages.push("请填写工作职责");
    if (errors.plan) errorMessages.push("请填写职业规划");
    if (errors.family_info) errorMessages.push("请至少填写1条家庭信息");
    if (errors.hobby) errorMessages.push("请填写兴趣爱好");
    if (errors.health) errorMessages.push("请填写健康状况");
    if (errors.criminal) errorMessages.push("请填写犯罪记录");
    if (errors.other) errorMessages.push("请填写其他说明");
    if (errors.declaration) errorMessages.push("请勾选信息真实性声明");
    
    toast.error("表单验证失败", {
      description: errorMessages.length > 0 
        ? errorMessages.slice(0, 3).join("、") + (errorMessages.length > 3 ? "..." : "")
        : "请检查表单填写是否完整",
    });
  };

  return (
    <Form {...form}>
      <form suppressHydrationWarning onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6 pb-8">
        {/* 应聘渠道 */}
        <ChannelSection form={form} />

        {/* 个人资料 */}
        <PersonalSection form={form} />

        {/* 教育经历 */}
        <EducationSection form={form} />

        {/* 工作经历 */}
        <CareerSection form={form} />

        {/* 个人特质 */}
        <TraitsSection form={form} />

        {/* 家庭信息 */}
        <FamilySection form={form} />

        {/* 声明 */}
        <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
          <FormField
            control={form.control}
            name="declaration"
            render={({ field }) => (
              <Checkbox
                id="declaration"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="declaration"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              个人资料保障声明
            </label>
            <p className="text-sm text-gray-500">
              本人已经明白及接受上述之个人资料保障原则。同时，有关本人在求职申请表上所填写之一切均真实及正确。在必要时同意授权上海进化时代营销策划有限公司对上述信息进行核实确认。一旦以上任意陈述被发现不实或本人蓄意隐瞒相关事实，公司有权立即解除劳动关系并不给予任何经济补偿。
            </p>
            {form.formState.errors.declaration && (
              <p className="text-sm text-red-500">
                {form.formState.errors.declaration.message}
              </p>
            )}
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="px-12"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            提交简历
          </Button>
        </div>
      </form>
    </Form>
  );
}
