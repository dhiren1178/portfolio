export interface TimelineEntry { id: string; year: string; kind: "education" | "experience"; title: string; org: string; description: string; tags: string[]; }
export const timelineEntries: TimelineEntry[] = [
 {id:"btech",year:"2020 — 2024",kind:"education",title:"B.Tech, Computer Science & Engineering (AI)",org:"Vel Tech, Chennai",description:"Specialized in artificial intelligence, machine learning and software engineering.",tags:["Artificial Intelligence","Computer Science"]},
 {id:"isro",year:"2024",kind:"experience",title:"Machine Learning Engineer Intern",org:"Indian Space Research Organisation (ISRO)",description:"Estimated canopy height from sub-meter satellite imagery using DINOv2, DPT and CNN ensembles; validated maps against airborne LiDAR.",tags:["DINOv2","DPT","Rasterio","GDAL"]},
 {id:"vegayan",year:"2025",kind:"experience",title:"Machine Learning Engineer",org:"Vegayan Systems",description:"Built and deployed a support-ticket classification workflow with XGBoost, Freshdesk, FastAPI and AWS.",tags:["XGBoost","FastAPI","AWS"]},
 {id:"msc",year:"2025 — Present",kind:"education",title:"M.Sc., Artificial Intelligence",org:"Friedrich-Alexander-Universität Erlangen–Nürnberg",description:"Graduate study in artificial intelligence, with interests in computer vision, Earth observation and intelligent systems.",tags:["AI","Computer Vision","Research"]},
];
export interface SkillGroup {label:string;skills:string[];}
export const skillGroups: SkillGroup[] = [
 {label:"AI & Research",skills:["Machine Learning","Deep Learning","Computer Vision","Geospatial AI","Transformers","Agentic AI"]},
 {label:"Frameworks & Data",skills:["Python","PyTorch","TensorFlow","Scikit-learn","Rasterio","GDAL","SQL"]},
 {label:"Engineering",skills:["FastAPI","Next.js","Docker","AWS","Git","PostgreSQL"]},
];
