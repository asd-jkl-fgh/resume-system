"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";

interface EmergencySectionProps {
  form: ReturnType<typeof useForm<ResumeData>>;
}

export function EmergencySection({ form }: EmergencySectionProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🚨</span> 紧急联系人
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="emergency_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名 *</FormLabel>
                <FormControl>
                  <Input placeholder="请输入紧急联系人姓名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergency_relation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>关系 *</FormLabel>
                <FormControl>
                  <Input placeholder="如：父亲、配偶" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergency_mobilephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手机号码 *</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="请输入手机号码" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📝</span> 其他信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="hobby"
            render={({ field }) => (
              <FormItem>
                <FormLabel>兴趣爱好</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入您的兴趣爱好..."
                    className="min-h-[60px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="health"
            render={({ field }) => (
              <FormItem>
                <FormLabel>健康状况</FormLabel>
                <FormControl>
                  <Input placeholder="如：良好" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="criminal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>是否有犯罪记录</FormLabel>
                <FormControl>
                  <Input placeholder="请说明" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>其他需要说明的事项</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="如有其他需要说明的事项，请在此填写..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}
