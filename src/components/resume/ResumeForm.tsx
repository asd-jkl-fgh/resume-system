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
import { IncompanySection } from "./IncompanySection";
import { TraitsSection } from "./TraitsSection";
import { EmergencySection } from "./EmergencySection";
import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

const resumeSchema = z.object({
  // 应聘渠道
  channel_type: z.string().min(1, "请选择应聘渠道"),
  channel_referrer: z.string(),
  channel_other: z.string(),
  
  // 应聘信息
  post: z.string().min(1, "请输入应聘岗位"),
  entry_date: z.string(),
  job_type: z.string().min(1, "请选择岗位性质"),
  current_status: z.string().min(1, "请选择当前状态"),
  current_status_other: z.string(),
  current_salary: z.string(),
  salary_expectation: z.string().min(1, "请输入期望月薪"),
  
  // 个人资料
  name: z.string().min(1, "请输入姓名"),
  name_en: z.string(),
  sex: z.string().min(1, "请选择性别"),
  birthday: z.string().min(1, "请选择出生日期"),
  school: z.string(),
  degree: z.string(),
  household_address: z.string(),
  mobilephone: z.string().min(11, "请输入正确的手机号码"),
  email: z.string().email("请输入正确的邮箱地址"),
  marriage: z.string(),
  living_address: z.string(),
  has_disease: z.string(),
  has_dispute: z.string(),
  has_criminal: z.string(),
  
  // 教育经历
  education_detail: z.array(z.any()),
  
  // 工作经历
  career_detail: z.array(z.any()),
  
  // 个人特质
  character: z.string(),
  speciality: z.string(),
  project_detail: z.string(),
  job_duty: z.string(),
  plan: z.string(),
  
  // 家庭信息
  family_info: z.array(z.any()),
  
  // 本公司亲友
  incompany_detail: z.array(z.any()),
  
  // 紧急联系人（至少2位）
  emergency_contacts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    relation: z.string(),
    mobilephone: z.string(),
  })).min(2, "请至少添加2位紧急联系人"),
  
  // 其他信息
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
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("提交成功", {
          description: "您的简历已成功提交，我们会尽快与您联系！",
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
    if (errors.post) errorMessages.push("请输入应聘岗位");
    if (errors.job_type) errorMessages.push("请选择岗位性质");
    if (errors.current_status) errorMessages.push("请选择当前状态");
    if (errors.salary_expectation) errorMessages.push("请输入期望月薪");
    if (errors.name) errorMessages.push("请输入姓名");
    if (errors.sex) errorMessages.push("请选择性别");
    if (errors.birthday) errorMessages.push("请选择出生日期");
    if (errors.mobilephone) errorMessages.push("请输入正确的手机号码");
    if (errors.email) errorMessages.push("请输入正确的邮箱地址");
    if (errors.emergency_contacts) errorMessages.push("请至少添加2位紧急联系人");
    if (errors.declaration) errorMessages.push("请勾选信息真实性声明");
    
    toast.error("表单验证失败", {
      description: errorMessages.length > 0 
        ? errorMessages.slice(0, 3).join("、") + (errorMessages.length > 3 ? "..." : "")
        : "请检查表单填写是否完整",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6 pb-8">
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

        {/* 本公司亲友 */}
        <IncompanySection form={form} />

        {/* 紧急联系人和其他信息 */}
        <EmergencySection form={form} />

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
              信息真实性声明
            </label>
            <p className="text-sm text-gray-500">
              本人声明：以上填写的信息真实、准确、完整。如有虚假，愿承担相应责任。
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
