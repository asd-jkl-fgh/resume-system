"use client";

import { useForm, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData, EmergencyContact } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EmergencySectionProps {
  form: ReturnType<typeof useForm<ResumeData>>;
}

export function EmergencySection({ form }: EmergencySectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emergency_contacts",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Partial<EmergencyContact>>({});

  const handleAdd = () => {
    setCurrentContact({
      id: Date.now().toString(),
      name: "",
      relation: "",
      mobilephone: "",
    });
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (currentContact.name && currentContact.relation && currentContact.mobilephone) {
      append(currentContact as EmergencyContact);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>🚨</span> 紧急联系人（至少填写2位）
            </span>
            <Button type="button" size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-1" /> 添加
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <FormLabel>姓名</FormLabel>
                      <div className="mt-1 font-medium">
                        {form.getValues(`emergency_contacts.${index}.name`)}
                      </div>
                    </div>
                    <div>
                      <FormLabel>关系</FormLabel>
                      <div className="mt-1 font-medium">
                        {form.getValues(`emergency_contacts.${index}.relation`)}
                      </div>
                    </div>
                    <div>
                      <FormLabel>手机号码</FormLabel>
                      <div className="mt-1 font-medium">
                        {form.getValues(`emergency_contacts.${index}.mobilephone`)}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              暂无紧急联系人，请至少添加2位紧急联系人
            </p>
          )}
          {fields.length > 0 && fields.length < 2 && (
            <p className="text-amber-600 text-sm mt-2">
              ⚠️ 请再添加至少 {2 - fields.length} 位紧急联系人
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加紧急联系人</DialogTitle>
            <DialogDescription>
              请填写紧急联系人的姓名、关系和手机号码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name={`emergency_contacts.${fields.length}.name` as any}
              render={() => (
                <FormItem>
                  <FormLabel>姓名 *</FormLabel>
                  <FormControl>
                    <Input
                      value={currentContact.name || ""}
                      onChange={(e) =>
                        setCurrentContact({ ...currentContact, name: e.target.value })
                      }
                      placeholder="请输入紧急联系人姓名"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`emergency_contacts.${fields.length}.relation` as any}
              render={() => (
                <FormItem>
                  <FormLabel>关系 *</FormLabel>
                  <FormControl>
                    <Input
                      value={currentContact.relation || ""}
                      onChange={(e) =>
                        setCurrentContact({ ...currentContact, relation: e.target.value })
                      }
                      placeholder="如：父亲、配偶"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`emergency_contacts.${fields.length}.mobilephone` as any}
              render={() => (
                <FormItem>
                  <FormLabel>手机号码 *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      value={currentContact.mobilephone || ""}
                      onChange={(e) =>
                        setCurrentContact({ ...currentContact, mobilephone: e.target.value })
                      }
                      placeholder="请输入手机号码"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!currentContact.name || !currentContact.relation || !currentContact.mobilephone}
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
