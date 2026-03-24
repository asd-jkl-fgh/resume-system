#!/bin/bash
cd /workspace/projects

# 被删除的PDF文件列表
deleted_files=(
  "public/resumes/Resume_康健_1773994394955.pdf"
  "public/resumes/Resume_张三_1773825367520.pdf"
  "public/resumes/Resume_李明_1774261052061.pdf"
  "public/resumes/Resume_测试新PDF_1773913951189.pdf"
  "public/resumes/Resume_测试用户A_1773912859462.pdf"
  "public/resumes/Resume_测试用户_1773821446349.pdf"
  "public/resumes/Resume_测试薪资_1774260822419.pdf"
  "public/resumes/Resume_测试薪资_1774260984333.pdf"
  "public/resumes/Resume_测试_1774261192522.pdf"
  "public/resumes/Resume_测试_1774261233291.pdf"
  "public/resumes/Resume_测试_1774261372413.pdf"
  "public/resumes/Resume_测试_1774261447958.pdf"
  "public/resumes/Resume_测试_1774261591117.pdf"
  "public/resumes/Resume_陈宗宇_1773889514923.pdf"
  "public/resumes/Resume_1_1773984814757.pdf"
)

for file in "${deleted_files[@]}"; do
  # 找到文件最后一次存在的提交
  commit=$(git log --all --full-history -- "$file" | grep "^commit" | head -1 | awk '{print $2}')
  if [ ! -z "$commit" ]; then
    # 获取该提交前一个提交（文件还存在的时候）
    prev_commit=$(git log --all --full-history -- "$file" | grep "^commit" | head -2 | tail -1 | awk '{print $2}')
    if [ ! -z "$prev_commit" ]; then
      echo "恢复: $file (来自提交 $prev_commit)"
      git show "$prev_commit:$file" > "$file" 2>/dev/null && echo "成功" || echo "失败"
    fi
  fi
done

echo "恢复完成！"
