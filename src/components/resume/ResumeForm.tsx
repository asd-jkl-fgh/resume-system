"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "sonner";
import { ResumeData, initialResumeData } from "@/types/resume";
import { BasicInfoSection } from "./BasicInfoSection";
import { ContactSection } from "./ContactSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { EducationSection } from "./EducationSection";
import { CareerSection } from "./CareerSection";
import { FamilySection } from "./FamilySection";
import { IncompanySection } from "./IncompanySection";
import { TraitsSection } from "./TraitsSection";
import { EmergencySection } from "./EmergencySection";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const resumeSchema = z.object({
  name: z.string().min(1, "请输入姓名"),
  sex: z.string().min(1, "请选择性别"),
  nation: z.string(),
  birthday: z.string(),
  bloodtype: z.string(),
  height: z.string(),
  marriage: z.string(),
  birth_status: z.string(),
  mobilephone: z.string().min(11, "请输入正确的手机号码"),
  telephone: z.string(),
  living_address: z.string(),
  household_address: z.string(),
  household_type: z.string(),
  avatar: z.string(),
  english_level: z.string(),
  english_read: z.string(),
  english_write: z.string(),
  other_language: z.string(),
  language_read: z.string(),
  language_write: z.string(),
  degree: z.string().min(1, "请选择最高学历"),
  post: z.string().min(1, "请输入应聘岗位"),
  salary_expectation: z.string(),
  entry_expectation: z.string(),
  job_expectation_1: z.string(),
  job_expectation_2: z.string(),
  education_detail: z.array(z.any()),
  career_detail: z.array(z.any()),
  character: z.string(),
  speciality: z.string(),
  project_detail: z.string(),
  job_duty: z.string(),
  plan: z.string(),
  family_info: z.array(z.any()),
  incompany_detail: z.array(z.any()),
  emergency_name: z.string().min(1, "请输入紧急联系人姓名"),
  emergency_relation: z.string().min(1, "请输入紧急联系人关系"),
  emergency_mobilephone: z.string().min(11, "请输入正确的紧急联系人手机号码"),
  hobby: z.string(),
  health: z.string(),
  criminal: z.string(),
  other: z.string(),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-8">
      {/* 基本信息 */}
      <BasicInfoSection form={form} />

      {/* 联系方式和住址 */}
      <ContactSection form={form} />

      {/* 个人信息 */}
      <PersonalInfoSection form={form} />

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
