"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { ResumeData, IncompanyDetail } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface IncompanySectionProps {
  form: ReturnType<typeof useForm<ResumeData>>;
}

export function IncompanySection({ form }: IncompanySectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "incompany_detail",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIncompany, setCurrentIncompany] = useState<Partial<IncompanyDetail>>({});

  const handleAdd = () => {
    setCurrentIncompany({
      id: Date.now().toString(),
      name: "",
      work: "",
      relation: "",
    });
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (currentIncompany.name) {
      append(currentIncompany as IncompanyDetail);
      setDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>👥</span> 本公司亲友
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
                <TableHead>姓名</TableHead>
                <TableHead>部门及职务（岗位）</TableHead>
                <TableHead>关系</TableHead>
                <TableHead className="w-16">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{form.getValues(`incompany_detail.${index}.name`)}</TableCell>
                  <TableCell>{form.getValues(`incompany_detail.${index}.work`)}</TableCell>
                  <TableCell>{form.getValues(`incompany_detail.${index}.relation`)}</TableCell>
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
          <p className="text-gray-500 text-center py-4">暂无亲友信息，点击右上角添加按钮添加</p>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加本公司亲友</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <FormLabel>姓名 *</FormLabel>
              <Input
                value={currentIncompany.name || ""}
                onChange={(e) =>
                  setCurrentIncompany({ ...currentIncompany, name: e.target.value })
                }
                placeholder="请输入姓名"
              />
            </div>
            <div>
              <FormLabel>部门及职务（岗位）</FormLabel>
              <Input
                value={currentIncompany.work || ""}
                onChange={(e) =>
                  setCurrentIncompany({ ...currentIncompany, work: e.target.value })
                }
                placeholder="请输入部门及职务"
              />
            </div>
            <div>
              <FormLabel>关系</FormLabel>
              <Input
                value={currentIncompany.relation || ""}
                onChange={(e) =>
                  setCurrentIncompany({ ...currentIncompany, relation: e.target.value })
                }
                placeholder="如：表哥、高中同学"
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
