export interface EducationDetail {
  id: string;
  start: string;
  end: string;
  school: string;
  major: string;
  degree: string;
  certificate: string;
}

export interface CareerDetail {
  id: string;
  start: string;
  end: string;
  company: string;
  department: string;
  job: string;
  salary: string;
  reason: string;
}

export interface FamilyInfo {
  id: string;
  name: string;
  relation: string;
  organ: string;
  work: string;
  age: string;
}

export interface IncompanyDetail {
  id: string;
  name: string;
  work: string;
  relation: string;
}

export interface ResumeData {
  // 基本信息
  name: string;
  sex: string;
  nation: string;
  birthday: string;
  bloodtype: string;
  height: string;
  marriage: string;
  birth_status: string;
  
  // 联系方式
  mobilephone: string;
  telephone: string;
  
  // 住址籍贯
  living_address: string;
  household_address: string;
  household_type: string;
  
  // 头像
  avatar: string;
  
  // 个人信息
  english_level: string;
  english_read: string;
  english_write: string;
  other_language: string;
  language_read: string;
  language_write: string;
  degree: string;
  post: string;
  salary_expectation: string;
  entry_expectation: string;
  job_expectation_1: string;
  job_expectation_2: string;
  
  // 教育经历
  education_detail: EducationDetail[];
  
  // 工作经历
  career_detail: CareerDetail[];
  
  // 个人特质
  character: string;
  speciality: string;
  project_detail: string;
  job_duty: string;
  plan: string;
  
  // 家庭信息
  family_info: FamilyInfo[];
  
  // 本公司亲友
  incompany_detail: IncompanyDetail[];
  
  // 紧急联系人
  emergency_name: string;
  emergency_relation: string;
  emergency_mobilephone: string;
  
  // 其他信息
  hobby: string;
  health: string;
  criminal: string;
  other: string;
  
  // 声明
  declaration: boolean;
}

export const initialResumeData: ResumeData = {
  name: '',
  sex: '',
  nation: '',
  birthday: '',
  bloodtype: '',
  height: '',
  marriage: '',
  birth_status: '',
  mobilephone: '',
  telephone: '',
  living_address: '',
  household_address: '',
  household_type: '',
  avatar: '',
  english_level: '',
  english_read: '',
  english_write: '',
  other_language: '',
  language_read: '',
  language_write: '',
  degree: '',
  post: '',
  salary_expectation: '',
  entry_expectation: '',
  job_expectation_1: '',
  job_expectation_2: '',
  education_detail: [],
  career_detail: [],
  character: '',
  speciality: '',
  project_detail: '',
  job_duty: '',
  plan: '',
  family_info: [],
  incompany_detail: [],
  emergency_name: '',
  emergency_relation: '',
  emergency_mobilephone: '',
  hobby: '',
  health: '',
  criminal: '',
  other: '',
  declaration: false,
};
