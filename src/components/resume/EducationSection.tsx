"use client";

import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData, EducationDetail } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface EducationSectionProps {
  form: ReturnType<typeof useForm<ResumeData>>;
}

export function EducationSection({ form }: EducationSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education_detail",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Partial<EducationDetail>>({});

  const handleAdd = () => {
    setCurrentEducation({
      id: Date.now().toString(),
      start: "",
      end: "",
      school: "",
      major: "",
      degree: "",
      certificate: "",
    });
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (currentEducation.start && currentEducation.school) {
      append(currentEducation as EducationDetail);
      setDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>🎓</span> 教育及培训经历
          </span>
          <Button type="button" size="sm" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> 添加
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fields.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>起止年月</TableHead>
                <TableHead>学校/培训机构</TableHead>
                <TableHead>专业/培训项目</TableHead>
                <TableHead>学历/资格</TableHead>
                <TableHead>证书</TableHead>
                <TableHead className="w-16">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {form.getValues(`education_detail.${index}.start`)} ~{" "}
                    {form.getValues(`education_detail.${index}.end`)}
                  </TableCell>
                  <TableCell>{form.getValues(`education_detail.${index}.school`)}</TableCell>
                  <TableCell>{form.getValues(`education_detail.${index}.major`)}</TableCell>
                  <TableCell>{form.getValues(`education_detail.${index}.degree`)}</TableCell>
                  <TableCell>{form.getValues(`education_detail.${index}.certificate`)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-center py-4">暂无教育经历，点击右上角添加按钮添加</p>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加教育经历</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <FormLabel>开始时间</FormLabel>
              <Input
                value={currentEducation.start || ""}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, start: e.target.value })
                }
                placeholder="如：2020.09"
              />
            </div>
            <div>
              <FormLabel>结束时间</FormLabel>
              <Input
                value={currentEducation.end || ""}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, end: e.target.value })
                }
                placeholder="如：2024.06"
              />
            </div>
            <div className="col-span-2">
              <FormLabel>学校/培训机构 *</FormLabel>
              <Input
                value={currentEducation.school || ""}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, school: e.target.value })
                }
                placeholder="请输入学校或培训机构名称"
              />
            </div>
            <div>
              <FormLabel>专业/培训项目</FormLabel>
              <Input
                value={currentEducation.major || ""}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, major: e.target.value })
                }
                placeholder="请输入专业或培训项目"
              />
            </div>
            <div>
              <FormLabel>学历/资格</FormLabel>
              <Input
                value={currentEducation.degree || ""}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, degree: e.target.value })
                }
                placeholder="如：本科"
              />
            </div>
            <div className="col-span-2">
              <FormLabel>证书</FormLabel>
              <Input
                value={currentEducation.certificate || ""}
                onChange={(e) =>
                  setCurrentEducation({ ...currentEducation, certificate: e.target.value })
                }
                placeholder="请输入获得的证书"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleConfirm}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
