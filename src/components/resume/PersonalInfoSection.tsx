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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";

interface PersonalInfoSectionProps {
  form: ReturnType<typeof useForm<ResumeData>>;
}

export function PersonalInfoSection({ form }: PersonalInfoSectionProps) {
  const watchEnglishLevel = form.watch("english_level");
  const watchOtherLanguage = form.watch("other_language");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💼</span> 个人信息
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 语言能力 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <FormField
            control={form.control}
            name="english_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>英语等级</FormLabel>
                <FormControl>
                  <Input placeholder="请输入英语等级" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="english_read"
            render={({ field }) => (
              <FormItem>
                <FormLabel>听说能力</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-2"
                    disabled={!watchEnglishLevel}
                  >
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="优秀" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">优秀</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="良好" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">良好</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="一般" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">一般</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="english_write"
            render={({ field }) => (
              <FormItem>
                <FormLabel>读写能力</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-2"
                    disabled={!watchEnglishLevel}
                  >
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="优秀" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">优秀</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="良好" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">良好</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="一般" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">一般</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 其他语种 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <FormField
            control={form.control}
            name="other_language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>其他语种</FormLabel>
                <FormControl>
                  <Input placeholder="请输入其他语种" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language_read"
            render={({ field }) => (
              <FormItem>
                <FormLabel>听说能力</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-2"
                    disabled={!watchOtherLanguage}
                  >
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="优秀" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">优秀</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="良好" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">良好</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="一般" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">一般</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language_write"
            render={({ field }) => (
              <FormItem>
                <FormLabel>读写能力</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-2"
                    disabled={!watchOtherLanguage}
                  >
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="优秀" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">优秀</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="良好" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">良好</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <RadioGroupItem value="一般" />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">一般</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 应聘信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最高学历 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="初中及以下">初中及以下</SelectItem>
                    <SelectItem value="中专/中技">中专/中技</SelectItem>
                    <SelectItem value="高中">高中</SelectItem>
                    <SelectItem value="大专">大专</SelectItem>
                    <SelectItem value="本科">本科</SelectItem>
                    <SelectItem value="研究生">研究生</SelectItem>
                    <SelectItem value="博士">博士</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem>
                <FormLabel>应聘岗位 *</FormLabel>
                <FormControl>
                  <Input placeholder="请输入应聘岗位" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary_expectation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>期望月薪</FormLabel>
                <FormControl>
                  <Input placeholder="请输入期望月薪" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entry_expectation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最早到岗时间</FormLabel>
                <FormControl>
                  <Input placeholder="请输入最早到岗时间" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 岗位意愿 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="job_expectation_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>岗位意愿一</FormLabel>
                <FormControl>
                  <Input placeholder="请输入岗位意愿" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="job_expectation_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>岗位意愿二</FormLabel>
                <FormControl>
                  <Input placeholder="请输入岗位意愿" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
