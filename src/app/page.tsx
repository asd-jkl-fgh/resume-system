import type { Metadata } from 'next';
import { ResumeForm } from '@/components/resume/ResumeForm';

export const metadata: Metadata = {
  title: '简历填写 - 招聘系统',
  description: '请填写您的个人简历信息',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            应聘人员信息登记表
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            请认真填写以下信息，带 * 为必填项
          </p>
        </div>

        {/* 表单内容 */}
        <ResumeForm />

        {/* 页脚 */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 招聘系统 - 人力资源部</p>
        </div>
      </div>
    </div>
  );
}
