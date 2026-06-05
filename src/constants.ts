export const RESUME_DATA = {
  name: "Manjunathan Chettiar",
  role: "Back-end Software Engineer",
  email: "manjunathanchettiar2908@gmail.com",
  phone: "+91 91XXXXX143",
  linkedin: "https://www.linkedin.com/in/manjunathan-chettiar1999",
  resumeUrl: "/Manjunathan_Resume.pdf",
  summary: "Back-end Software Engineer with 2 years of professional experience in designing, developing, and optimizing scalable backend systems. Skilled in Python, FastAPI, Django, Celery, and SQL with expertise in RESTful API development, microservices, and data processing pipelines. Adept at asynchronous task execution, database optimization, and cloud-based deployments. Proven track record of improving system performance, reducing latency, and delivering reliable, high-performance solutions.",
  experience: [
    {
      title: "Software Engineer",
      company: "Xecutables Pvt. Ltd",
      location: "Bengaluru",
      period: "Sep 2023 - Present",
      achievements: [
        "Engineered a Python-based QA chatbot using GPT-3, FastAPI, and Redis caching, improving NLP response accuracy by 25% through optimized context retrieval.",
        "Optimized LLM API latency with asynchronous Celery task execution, reducing processing overhead by 30% and enabling high-volume request handling.",
        "Designed and deployed RESTful APIs enabling chatbot integration with 3+ external data sources, increasing system interoperability and data availability.",
        "Implemented structured error handling and centralized logging, reducing system downtime by 20% and improving monitoring accuracy."
      ]
    },
    {
      title: "Software Engineer Intern",
      company: "Xecutables Pvt. Ltd",
      location: "Bengaluru",
      period: "Feb 2023 - Aug 2023",
      achievements: [
        "Built an anomaly detection system using Python, SQL, and Elasticsearch with statistical thresholds, reducing security risks by 30% across real-time logs.",
        "Integrated multi-database aggregation pipelines using Python ETL scripts, improving accessibility of 1M+ records and enabling consolidated analytics dashboards.",
        "Automated anomaly detection with Python scripts, cutting manual monitoring efforts by 40% and reducing average incident response time.",
        "Optimized MySQL queries with indexing and partitioning strategies, reducing average retrieval time by 40% for high-volume data queries."
      ]
    }
  ],
  skills: {
    languages: ["Python", "Go", "C/C++", "HTML", "CSS"],
    databases: ["MySQL", "SQLite", "Elasticsearch", "SurrealDB"],
    frameworks: ["FastAPI", "Flask", "Django", "Celery", "GraphQL"],
    libraries: ["Pandas", "NumPy", "TensorFlow", "OpenCV"],
    tools: ["Apache Nifi", "Redis", "RabbitMQ", "JMeter", "Git"],
    devops: ["Docker", "Kubernetes", "CI/CD"]
  },
  projects: [
    {
      title: "Intelligent Event Stream Pipeline using Ollama",
      description: "Built an intelligent event stream pipeline with Ollama LLM integration, summarizing 10k+ daily event logs into contextual insights with >90% accuracy.",
      details: [
        "Engineered modular pipeline architecture with dynamic config management, enabling flexible deployment across multiple LLM models.",
        "Supports storing and retrieving chat interactions in Elasticsearch, Redis, and file storage."
      ]
    },
    {
      title: "Object Detection using Custom Dataset",
      description: "Developed and trained a computer vision model in Python using TensorFlow and OpenCV for object detection, achieving 90% accuracy on custom datasets.",
      details: [
        "Implemented preprocessing and augmentation techniques, improving model precision by 15% on edge-case images.",
        "Optimized model architecture and hyperparameters to improve detection precision."
      ]
    },
    {
      title: "QA Chatbot",
      description: "Developed a Python-driven QA chatbot using GPT-3 with FastAPI integration, improving answer accuracy by 25% through advanced prompt engineering.",
      details: [
        "Integrated Ollama API for dynamic data exchange, enabling chatbot connectivity to 3+ enterprise data sources.",
        "Implemented structured error handling and latency optimization, reducing API response time by 30%."
      ]
    },
    {
      title: "Time-series Forecasting",
      description: "Designed and implemented a time-series forecasting model in Python (Pandas, NumPy) to predict daily employee counts with 85% accuracy.",
      details: [
        "Applied ARIMA and regression models, reducing forecast error by 20% compared to baseline methods.",
        "Conducted exploratory data analysis to identify trends and seasonality in employee data."
      ]
    },
    // {
    //   title: "Anomaly Detection",
    //   description: "Architected and deployed an anomaly detection system using Python and SQL with Elasticsearch, reducing security risks by 30% through automated log monitoring.",
    //   details: [
    //     "Integrated multi-database pipelines (MySQL, SQLite, Elasticsearch) to consolidate 1M+ records.",
    //     "Automated anomaly detection with Python scripts, reducing manual review effort by 40%."
    //   ]
    // },
  ],
  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Dayananda Sagar University, Bengaluru",
      period: "Feb 2021 - Jun 2023"
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Veer Narmad South Gujarat University",
      period: "Jun 2018 - Mar 2020"
    }
  ],
  certifications: [
    "Build Real World AI Applications with Gemini and Imagen, 2025",
    "Prompt Design in Vertex AI, 2025",
    "Develop GenAI Apps with Gemini and Streamlit, 2025"
  ]
};
