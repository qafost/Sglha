# Sglha

> **سجّلها قبل ما تنساها.**

**Sglha** هي منصة ملاحظات ذكية تعتمد على الذكاء الاصطناعي، مصممة لتكون مساحة تفكير شخصية تستطيع التحدث معها من خلال WhatsApp.

بدلًا من فتح تطبيق Notes وكتابة وترتيب كل شيء بنفسك، كل ما عليك هو إرسال فكرتك أو كلامك إلى Sglha.

الذكاء الاصطناعي يفهم ما قلته، ثم يحوله تلقائيًا إلى **Note منظمة** تحتوي على تفاصيل الفكرة، المهام المرتبطة بها، التذكيرات، والروابط المهمة.

---

## الفكرة

أحيانًا تأتيك فكرة وأنت في الشارع، أثناء المواصلات، أثناء العمل، أو قبل النوم.

قد ترسل لنفسك رسالة مثل:

```text
عايز أعمل مشروع اسمه سجلها.

الفكرة إن المستخدم يبعت أفكاره من خلال واتساب،
والذكاء الاصطناعي يفهم الكلام وينظم كل فكرة في نوت.

محتاج كمان يكون فيه Tasks مرتبطة بالفكرة،
ولو فيه حاجة محتاجة تذكير يفتكرني بيها.

ولو أنا ذكرت لينك لموقع أو GitHub أو أي حاجة،
يتحفظ اللينك مع الفكرة.
```

بدل أن تظل هذه الرسالة مجرد رسالة في WhatsApp، يقوم Sglha بتحويلها إلى:

```text
📌 Sglha

الفكرة:
منصة ملاحظات ذكية يتم التحكم فيها من خلال WhatsApp.

الوصف:
المستخدم يستطيع إرسال أفكاره وكلامه بشكل طبيعي،
ويقوم الذكاء الاصطناعي بفهم المحتوى وتنظيمه داخل Note.

Tasks:
☐ تصميم نظام إنشاء الـ Notes
☐ بناء WhatsApp Integration
☐ بناء AI Parser

Reminders:
⏰ مراجعة فكرة Sglha

Links:
🔗 GitHub
🔗 Documentation
```

---

# Core Concept

Sglha مبنية حول فكرة بسيطة:

> **لا تجعل المستخدم ينظم أفكاره، اجعل الذكاء الاصطناعي ينظمها له.**

المستخدم يتحدث بشكل طبيعي.

الذكاء الاصطناعي يتولى عملية:

```text
Conversation
     ↓
Understanding
     ↓
Extraction
     ↓
Organization
     ↓
Note
     ↓
Tasks / Reminders / Links
```

---

# لماذا WhatsApp؟

WhatsApp هو أسرع مكان يمكن للمستخدم أن يرسل إليه فكرة.

بدلًا من:

```text
افتح التطبيق
    ↓
افتح Notes
    ↓
أنشئ Note
    ↓
اكتب العنوان
    ↓
اكتب التفاصيل
    ↓
أضف Task
    ↓
حدد Reminder
```

يكفي:

```text
"افتكرت فكرة لمشروع..."
```

ثم Sglha يتولى الباقي.

---

# كيف تعمل Sglha؟

## 1. إرسال الفكرة

المستخدم يرسل رسالة إلى Sglha عبر WhatsApp.

```text
عايز أعمل موقع للـ portfolio
بس يكون فيه animations جامدة
وعايز أخلص النسخة الأولى يوم الجمعة
ودي فكرة للـ hero section:
https://example.com
```

---

## 2. فهم الرسالة

الـ AI يحلل الرسالة ويحدد:

* ما هي الفكرة؟
* ما هو وصفها؟
* هل يوجد Tasks؟
* هل يوجد موعد؟
* هل يحتاج المستخدم إلى Reminder؟
* هل توجد روابط؟
* هل توجد معلومات إضافية؟
* هل الرسالة مرتبطة بفكرة سابقة؟

---

## 3. إنشاء Note

يتم إنشاء Note منظمة تلقائيًا.

```text
Portfolio Website

Description:
إنشاء Portfolio يحتوي على animations
وتصميم حديث مع Hero Section مميز.

Tasks:
- تصميم Hero Section
- إضافة animations
- بناء النسخة الأولى

Deadline:
Friday

Links:
https://example.com
```

---

# Notes

كل فكرة يتم تحويلها إلى Note.

الـ Note ليست مجرد نص، ولكنها تحتوي على بيانات منظمة.

مثال:

```json
{
  "title": "Portfolio Website",
  "description": "إنشاء Portfolio يحتوي على animations",
  "tasks": [
    {
      "title": "تصميم Hero Section",
      "completed": false
    },
    {
      "title": "إضافة animations",
      "completed": false
    }
  ],
  "reminders": [],
  "links": [
    "https://example.com"
  ]
}
```

---

# Tasks

إذا اكتشف Sglha أن الرسالة تحتوي على شيء يحتاج إلى تنفيذ، يتم تحويله إلى Task.

مثال:

```text
عايز أضيف Login للمشروع
وأعمل صفحة Dashboard
وأخلصهم بكرة.
```

يصبح:

```text
Project Tasks

☐ إضافة Login
☐ إنشاء Dashboard

Deadline:
Tomorrow
```

ويمكن تحديث حالة الـ Task:

```text
Todo
  ↓
In Progress
  ↓
Completed
```

---

# Reminders

إذا كان هناك شيء يحتاج إلى تذكير، يستطيع Sglha إنشاء Reminder.

مثال:

```text
فكرني بكرة الساعة 10 الصبح
أراجع فكرة المشروع.
```

يتم إنشاء:

```text
Reminder

📌 مراجعة فكرة المشروع

🕙 Tomorrow — 10:00 AM
```

وعندما يحين الوقت، يقوم Sglha بإرسال رسالة للمستخدم عبر WhatsApp:

```text
⏰ تذكير

عندك Reminder لمراجعة فكرة المشروع.

اضغط هنا لفتح الفكرة.
```

الهدف من التذكير ليس مجرد "موعد"، وإنما **إرجاع المستخدم إلى الفكرة أو الـ Task المرتبطة به**.

---

# Links

Sglha يستطيع اكتشاف الروابط الموجودة داخل الرسائل.

مثال:

```text
لقيت مكتبة كويسة للـ animations:

https://example.com/library
```

يتم حفظ الرابط داخل الـ Note:

```text
Links

🔗 Animation Library
https://example.com/library
```

ويمكن لاحقًا تصنيف الروابط حسب نوعها، مثل:

```text
GitHub
Documentation
Website
YouTube
Article
Reference
Other
```

---

# Context & Memory

واحدة من أهم أفكار Sglha هي أن الـ AI لا يتعامل مع كل رسالة وكأنها منفصلة.

مثال:

### الرسالة الأولى

```text
عندي فكرة أعمل SaaS لإدارة المشاريع الصغيرة.
```

Sglha ينشئ:

```text
📌 SaaS لإدارة المشاريع الصغيرة
```

### بعد يوم

```text
عايز أضيف WhatsApp integration.
```

الذكاء الاصطناعي يستطيع فهم أن الرسالة مرتبطة بالفكرة السابقة.

بدل إنشاء Note جديدة، يمكنه تحديث:

```text
📌 SaaS لإدارة المشاريع الصغيرة
```

وإضافة:

```text
Task:
☐ إضافة WhatsApp integration
```

وهنا يبدأ Sglha في بناء **ذاكرة منظمة لأفكار المستخدم**.

---

# Natural Language

المستخدم لا يحتاج إلى استخدام Commands محددة.

ليس مطلوبًا أن يقول:

```text
/create-note
/add-task
/reminder
```

يمكنه التحدث بشكل طبيعي.

مثل:

```text
افتكرت فكرة لمشروع جديد...
```

أو:

```text
فكرني بعد أسبوع أشوف موضوع الـ API ده.
```

أو:

```text
ضيف دي للـ project بتاع Sglha.
```

أو:

```text
خلصت الـ task بتاعة تصميم الـ login.
```

الذكاء الاصطناعي هو المسؤول عن فهم Intent المستخدم.

---

# System Architecture

```text
                         User
                           │
                           │ WhatsApp
                           ▼
                  ┌─────────────────┐
                  │ WhatsApp API    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Sglha API     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   AI Engine     │
                  │                 │
                  │ Intent          │
                  │ Extraction      │
                  │ Classification  │
                  │ Context         │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Notes          Tasks       Reminders
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   PostgreSQL    │
                  └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Sglha Dashboard │
                  └─────────────────┘
```

---

# Main Components

## WhatsApp Interface

مسؤول عن:

* استقبال الرسائل.
* استقبال الصور والملفات مستقبلًا.
* إرسال الردود.
* إرسال التذكيرات.
* التفاعل مع المستخدم.

---

## AI Engine

مسؤول عن فهم الرسائل وتحويلها إلى Structured Data.

مثل:

```text
User Message
      ↓
Intent Detection
      ↓
Entity Extraction
      ↓
Context Retrieval
      ↓
Action Decision
      ↓
Structured Output
```

---

## Notes

مسؤولة عن تخزين الأفكار والمعلومات.

كل Note يمكن أن تحتوي على:

* Title
* Description
* Content
* Tasks
* Reminders
* Links
* Tags
* Created At
* Updated At

---

## Tasks

مسؤولة عن الأشياء التي تحتاج إلى تنفيذ.

كل Task يمكن أن تحتوي على:

* Title
* Description
* Status
* Priority
* Due Date
* Note ID
* Created At
* Completed At

---

## Reminders

مسؤولة عن تذكير المستخدم.

يمكن أن تكون مرتبطة بـ:

```text
Note
Task
Reminder
```

مثال:

```text
Reminder
   │
   ├── Note
   │     └── Sglha Project
   │
   └── Task
         └── Build WhatsApp Integration
```

---

# Suggested Database Structure

```text
users
│
├── notes
│   │
│   ├── tasks
│   │
│   ├── reminders
│   │
│   └── links
│
└── messages
```

الجداول الأساسية:

```text
users
notes
tasks
reminders
links
messages
```

---

# Example User Flow

```text
User
 │
 │ "عندي فكرة أعمل تطبيق..."
 ▼
WhatsApp
 │
 ▼
Webhook
 │
 ▼
Sglha API
 │
 ▼
AI
 │
 ├── Detect Idea
 ├── Extract Tasks
 ├── Extract Dates
 ├── Extract Links
 └── Find Context
 │
 ▼
Database
 │
 ├── Note
 ├── Tasks
 ├── Reminders
 └── Links
 │
 ▼
WhatsApp
 │
 │ "سجلت الفكرة وطلعت منها 3 Tasks."
 ▼
User
```

---

# Dashboard

بالرغم من أن WhatsApp هو الواجهة الأساسية للإدخال، سيكون هناك Dashboard لعرض وتنظيم كل شيء.

يمكن للمستخدم رؤية:

```text
┌──────────────────────────────────┐
│ Sglha                            │
├──────────────────────────────────┤
│                                  │
│ Notes                            │
│                                  │
│ 📌 Sglha                         │
│ 📌 Portfolio                     │
│ 📌 SaaS Idea                     │
│ 📌 New App                       │
│                                  │
├──────────────────────────────────┤
│ Tasks                            │
│                                  │
│ ☐ Build API                      │
│ ☐ Design Dashboard               │
│ ☑ Setup Database                 │
│                                  │
└──────────────────────────────────┘
```

---

# Tech Stack

## Backend

* Node.js
* Express.js
* PostgreSQL
* REST API

## AI

* LLM API
* Structured Outputs
* Function / Tool Calling
* Context Retrieval

## Messaging

* WhatsApp Business Platform / WhatsApp API

## Infrastructure

* Docker
* Docker Compose

## Frontend

* Web Dashboard
* HTML / CSS / JavaScript في الـ MVP
* ويمكن استخدام Framework لاحقًا إذا احتاج المشروع

---

# Project Structure

```text
sglha/
│
├── apps/
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   │   ├── ai/
│   │   │   │   ├── whatsapp/
│   │   │   │   ├── notes/
│   │   │   │   ├── tasks/
│   │   │   │   └── reminders/
│   │   │   │
│   │   │   ├── models/
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── app.js
│   │   │
│   │   └── package.json
│   │
│   └── web/
│       └── ...
│
├── packages/
│   ├── database/
│   └── shared/
│
├── docker-compose.yml
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

# MVP

النسخة الأولى من Sglha لا تحتاج إلى كل شيء.

الـ MVP يجب أن يثبت الفكرة الأساسية:

```text
WhatsApp
   ↓
Message
   ↓
AI
   ↓
Note
   ↓
Tasks
   ↓
Database
   ↓
WhatsApp Response
```

### MVP Features

* [ ] إنشاء User.
* [ ] استقبال WhatsApp messages.
* [ ] حفظ Messages.
* [ ] AI message processing.
* [ ] إنشاء Notes.
* [ ] استخراج Tasks.
* [ ] إنشاء Reminders.
* [ ] استخراج Links.
* [ ] ربط الرسائل بالـ Notes.
* [ ] تحديث Note موجودة.
* [ ] إرسال Confirmation للمستخدم.
* [ ] Dashboard بسيط.

---

# Future Features

بعد نجاح الـ MVP يمكن إضافة:

* [ ] البحث بالذكاء الاصطناعي.
* [ ] سؤال Sglha عن الأفكار القديمة.
* [ ] Semantic Search.
* [ ] Knowledge Graph.
* [ ] Tags تلقائية.
* [ ] تصنيف الأفكار.
* [ ] دعم الصور.
* [ ] تحويل Voice Messages إلى Notes.
* [ ] تلخيص المحادثات.
* [ ] اقتراح Tasks.
* [ ] اقتراح Reminders.
* [ ] ربط Google Calendar.
* [ ] ربط GitHub.
* [ ] ربط Notion.
* [ ] Telegram.
* [ ] Browser Extension.
* [ ] Mobile App.

---

# Vision

Sglha ليست مجرد تطبيق Notes آخر.

الفكرة هي بناء مساحة يستطيع المستخدم **التفكير فيها بصوت عالٍ**، بينما يتولى النظام تنظيم هذا التفكير.

بدلًا من أن يكون المستخدم مسؤولًا عن:

```text
Writing
Organizing
Categorizing
Creating Tasks
Creating Reminders
Saving Links
```

يصبح دوره فقط:

```text
Think
   ↓
Talk
   ↓
Sglha organizes everything
```

---

# Core Philosophy

> **Your thoughts are messy. Your second brain doesn't have to be.**

أو بالعربي:

> **فكرتك مش لازم تكون منظمة عشان تسجلها. سجلها، وسجلها هينظمها.**

---

# Status

```text
🚧 MVP — Active Development
```

Sglha في مرحلة بناء الـ MVP، والهدف الحالي هو إثبات الـ Core Loop:

```text
Think → WhatsApp → AI → Note → Task / Reminder / Link
```

---

## License

سيتم تحديد الترخيص لاحقًا.

**Sglha © 2026**
