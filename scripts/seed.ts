/**
 * Seed script: populates Sanity with sample content.
 * Run with: npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * and SANITY_API_TOKEN env vars to be set (write token).
 */
import { createClient } from '@sanity/client'
// Load .env.local manually so the seed script doesn't require dotenv as a dep
import { readFileSync } from 'fs'
try {
  const envFile = readFileSync('.env.local', 'utf-8')
  for (const line of envFile.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
} catch { /* .env.local not found, use existing env */ }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const categories = [
  { _type: 'category', name: 'IT Audit', slug: { _type: 'slug', current: 'it-audit' }, description: 'IT audit methodologies, frameworks, and best practices.' },
  { _type: 'category', name: 'SOC Reports', slug: { _type: 'slug', current: 'soc-reports' }, description: 'SOC 1, SOC 2, and SOC 3 reporting insights and guidance.' },
  { _type: 'category', name: 'Internal Audit', slug: { _type: 'slug', current: 'internal-audit' }, description: 'Internal audit strategies, tools, and techniques.' },
  { _type: 'category', name: 'Cybersecurity', slug: { _type: 'slug', current: 'cybersecurity' }, description: 'Cybersecurity governance, controls, and risk management.' },
  { _type: 'category', name: 'Technology Risk', slug: { _type: 'slug', current: 'technology-risk' }, description: 'Emerging technology risks and mitigation strategies.' },
  { _type: 'category', name: 'Forensics', slug: { _type: 'slug', current: 'forensics' }, description: 'Digital forensics, investigations, and fraud examination.' },
  { _type: 'category', name: 'AI Governance', slug: { _type: 'slug', current: 'ai-governance' }, description: 'AI risk, governance frameworks, and audit considerations.' },
  { _type: 'category', name: 'Data Analytics', slug: { _type: 'slug', current: 'data-analytics' }, description: 'Data analytics in audit, continuous monitoring, and reporting.' },
]

const authorDoc = {
  _type: 'author',
  name: 'The IT Auditor',
  bio: 'An IT audit and technology risk professional with extensive experience across financial services, healthcare, and technology sectors. Background includes IT general controls testing, SOC examinations, cybersecurity assessments, and digital forensics investigations.',
  linkedinUrl: 'https://www.linkedin.com',
}

function makeContent(paragraphs: string[]) {
  return paragraphs.map((text, i) => ({
    _key: `block${i}`,
    _type: 'block',
    style: 'normal',
    children: [{ _key: `span${i}`, _type: 'span', text, marks: [] }],
    markDefs: [],
  }))
}

async function seed() {
  console.log('Seeding categories…')
  const createdCats: Record<string, string> = {}
  for (const cat of categories) {
    const doc = await client.create(cat)
    createdCats[cat.slug.current] = doc._id
    console.log(`  Created category: ${cat.name}`)
  }

  console.log('Seeding author…')
  const author = await client.create(authorDoc)
  console.log(`  Created author: ${author.name}`)

  const articles = [
    {
      _type: 'article',
      title: 'Why IT Auditors Think Differently Than Financial Auditors',
      slug: { _type: 'slug', current: 'why-it-auditors-think-differently-than-financial-auditors' },
      excerpt: 'IT auditors and financial auditors share the same professional skepticism, but approach risk, evidence, and controls in fundamentally different ways. Understanding these differences makes you more effective in both disciplines.',
      category: { _type: 'reference', _ref: createdCats['it-audit'] },
      author: { _type: 'reference', _ref: author._id },
      tags: ['IT audit', 'financial audit', 'controls', 'methodology'],
      publishedDate: '2024-01-15T10:00:00Z',
      featured: true,
      content: makeContent([
        'When financial auditors encounter a control, they typically ask: does this control prevent a material misstatement in the financial statements? IT auditors ask a different but equally important question: does this control reliably function as designed, and is that function adequate given the underlying technology risk?',
        'This distinction drives a fundamentally different audit mindset. Financial auditors are trained to follow the money — tracing transactions through ledgers, vouching documents, and testing balances. IT auditors follow the data — examining how systems process, store, and transmit information, and whether the controls surrounding that processing are effective.',
        'Consider user access controls. A financial auditor reviewing segregation of duties will compare role assignments against a matrix of incompatible duties. An IT auditor goes further: examining how access is provisioned, modified, and terminated in the underlying system; whether the access control matrix matches actual system permissions; whether privileged access is appropriately restricted and monitored; and whether the provisioning workflow includes adequate approval and documentation.',
        'IT auditors also think in terms of systemic risk. A single misconfigured setting in an enterprise system can affect thousands of transactions simultaneously. This differs from the more isolated nature of many financial control failures. IT auditors therefore place significant emphasis on change management controls, because a single unauthorized or untested change can compromise the integrity of a system that processes millions of records.',
        'Understanding these differences — and being able to bridge them — is one of the most valuable skills in the IT audit profession. The auditors who can speak fluently in both languages are the ones who add the most value in integrated audits, SOC examinations, and enterprise risk assessments.',
      ]),
      seoTitle: 'Why IT Auditors Think Differently Than Financial Auditors',
      seoDescription: 'Explore the fundamental differences in mindset, methodology, and risk focus between IT auditors and financial auditors.',
    },
    {
      _type: 'article',
      title: 'A Practical Guide to Testing IT General Controls',
      slug: { _type: 'slug', current: 'practical-guide-testing-it-general-controls' },
      excerpt: 'IT general controls (ITGCs) are the foundation of a reliable IT environment. This guide walks through the five key ITGC domains and how to test them effectively.',
      category: { _type: 'reference', _ref: createdCats['it-audit'] },
      author: { _type: 'reference', _ref: author._id },
      tags: ['ITGC', 'IT general controls', 'testing', 'SOX', 'access management'],
      publishedDate: '2024-02-10T10:00:00Z',
      featured: true,
      content: makeContent([
        'IT general controls (ITGCs) are foundational to any IT audit program. Unlike application controls — which are embedded in specific systems and validate individual transactions — ITGCs operate at the infrastructure and platform level, providing the conditions under which application controls can function reliably.',
        'The five primary ITGC domains are: (1) Access to Programs and Data, (2) Program Changes, (3) Computer Operations, (4) Program Development, and (5) Data Center and Network Operations. Most SOX and SOC audit programs organize ITGC testing around these domains.',
        'Access to Programs and Data is typically the most extensive area. Testing should cover logical access provisioning (is the process formally documented and followed?), access recertification (are access reviews performed periodically and do they result in appropriate removals?), privileged access (are administrative accounts limited, monitored, and tightly controlled?), and termination controls (is access removed promptly when employees separate?).',
        'For Change Management, the key question is whether changes to in-scope systems follow an authorized, documented process. Testing typically includes reviewing a sample of changes for approval evidence, testing documentation, and implementation authorization. Pay particular attention to emergency changes, which are common exceptions to normal process — and common control deficiencies.',
        'Computer Operations covers job scheduling, batch processing, and backup and recovery. Auditors should verify that batch jobs are monitored, failures are escalated and resolved, and that backup and recovery procedures are tested periodically. Many organizations have strong backup processes but weak recovery testing — a critical gap when a control failure is discovered during an incident.',
        'Effective ITGC testing requires strong scoping decisions. Not every system in the environment warrants full testing coverage. Focus your efforts on systems that directly support financial reporting, process material transaction volumes, or host sensitive data. Document your scoping rationale carefully — it will be scrutinized.',
      ]),
      seoTitle: 'A Practical Guide to Testing IT General Controls (ITGCs)',
      seoDescription: 'Step-by-step guidance on scoping and testing IT general controls across access management, change management, and computer operations.',
    },
    {
      _type: 'article',
      title: 'Common SOC 2 Control Deficiencies and How to Avoid Them',
      slug: { _type: 'slug', current: 'common-soc-2-control-deficiencies-how-to-avoid-them' },
      excerpt: 'SOC 2 examinations regularly surface the same control gaps across service organizations. Understanding the most common deficiencies helps management address them before auditors find them.',
      category: { _type: 'reference', _ref: createdCats['soc-reports'] },
      author: { _type: 'reference', _ref: author._id },
      tags: ['SOC 2', 'control deficiencies', 'service organizations', 'AICPA', 'TSC'],
      publishedDate: '2024-03-05T10:00:00Z',
      featured: false,
      content: makeContent([
        'In a SOC 2 examination, the Trust Services Criteria (TSC) provide the framework against which a service organization\'s controls are evaluated. After reviewing dozens of SOC 2 engagements, certain deficiency patterns emerge repeatedly — regardless of industry, size, or maturity.',
        'Vendor management is consistently one of the most underdeveloped areas. Many organizations have hundreds of subservice providers but lack a formal program for identifying, assessing, and monitoring them. The CC9.2 criteria specifically addresses risk management for vendors and business partners. Common gaps include no formal vendor inventory, no periodic risk assessments, and no contract terms requiring security controls.',
        'Logical access reviews are another persistent problem. Organizations often have periodic access recertification processes on paper, but when auditors test them, the evidence tells a different story: reviews completed after the deadline, terminated users not removed, and no documentation of who reviewed and approved access for each system in scope.',
        'Encryption in transit and at rest is required by CC6.7 but is frequently incomplete. Organizations may encrypt production databases but overlook development environments, backup media, or certain API connections. A thorough inventory of data flows is essential before asserting that encryption controls are comprehensive.',
        'Incident response procedures are often documented but not practiced. The CC7 criteria requires that incidents be identified, responded to, and communicated. Auditors will request evidence of actual incident response activities — log review, alert handling, and communication records. Organizations that have procedures but no evidence of execution will have deficiencies.',
        'The most effective way to avoid these deficiencies is a pre-audit readiness assessment — essentially a dry run of the examination using the same criteria and sampling approach an auditor would apply. This allows management to identify and remediate gaps on their own timeline rather than discovering them during the examination.',
      ]),
      seoTitle: 'Common SOC 2 Control Deficiencies and How to Avoid Them',
      seoDescription: 'Identify and address the most frequent SOC 2 control gaps before your examination, including vendor management, access reviews, and incident response.',
    },
    {
      _type: 'article',
      title: 'Understanding Layering in Financial Fraud Investigations',
      slug: { _type: 'slug', current: 'understanding-layering-financial-fraud-investigations' },
      excerpt: 'Layering is one of three stages in money laundering and is often the most technically complex to trace. Forensic investigators must follow funds through multiple transactions and entities to reconstruct the full scheme.',
      category: { _type: 'reference', _ref: createdCats['forensics'] },
      author: { _type: 'reference', _ref: author._id },
      tags: ['forensics', 'money laundering', 'layering', 'fraud investigation', 'financial crime'],
      publishedDate: '2024-04-20T10:00:00Z',
      featured: false,
      content: makeContent([
        'Money laundering is conventionally divided into three stages: placement (introducing illicit funds into the financial system), layering (obscuring the trail through complex transactions), and integration (returning funds to the legitimate economy). Of these three, layering presents the greatest investigative challenge.',
        'During the layering stage, perpetrators deliberately create distance between the original source of funds and their current location. Common techniques include structuring transactions to avoid reporting thresholds, transferring funds through multiple shell companies across different jurisdictions, converting funds between asset classes (cash to cryptocurrency to real estate), and using trade-based money laundering through over- and under-invoicing of goods.',
        'For forensic investigators, the challenge of layering is both a data problem and an analytical one. The data problem arises because layering transactions are intentionally designed to be opaque: documentation is incomplete, entities are deliberately structured to obscure beneficial ownership, and cross-border transactions involve records held by institutions in multiple legal jurisdictions.',
        'The analytical challenge is reconstructing the full transaction network from incomplete data. Investigators typically use link analysis tools to map relationships between entities, accounts, and transactions. Pattern recognition is critical: unusual transaction timing, round-number amounts, and circular fund flows are all hallmarks of layering activity.',
        'Digital evidence has significantly changed how layering investigations are conducted. Bank records and wire transfer data can now be analyzed algorithmically, and blockchain forensics tools allow investigators to trace cryptocurrency transactions across wallets and exchanges, even when participants attempt to use mixers or privacy coins.',
        'The most important discipline in a layering investigation is documentation. Every transaction traced, every entity identified, and every analytical inference made must be documented in a way that supports the legal standard of the proceeding — whether civil, criminal, or regulatory. Investigators who are sloppy about documentation undermine their own findings.',
      ]),
      seoTitle: 'Understanding Layering in Financial Fraud Investigations',
      seoDescription: 'A forensic investigator\'s guide to the layering stage of money laundering — techniques used, investigative challenges, and how to trace funds effectively.',
    },
    {
      _type: 'article',
      title: 'Auditing AI Systems: Risks and Control Considerations',
      slug: { _type: 'slug', current: 'auditing-ai-systems-risks-and-control-considerations' },
      excerpt: 'AI systems present audit challenges that traditional IT audit frameworks were not designed to address. This article explores the key risk areas and how to build an effective AI audit program.',
      category: { _type: 'reference', _ref: createdCats['ai-governance'] },
      author: { _type: 'reference', _ref: author._id },
      tags: ['AI governance', 'AI audit', 'machine learning', 'model risk', 'algorithmic bias'],
      publishedDate: '2024-05-12T10:00:00Z',
      featured: true,
      content: makeContent([
        'Artificial intelligence and machine learning systems are increasingly embedded in consequential business processes — credit decisioning, fraud detection, clinical diagnosis support, hiring, and more. As these systems proliferate, internal audit and technology risk functions face a new challenge: how do you audit a system whose behavior is not fully deterministic and whose decision logic may be opaque even to its developers?',
        'The first and most fundamental risk in AI systems is model risk — the risk that a model produces inaccurate outputs or is used inappropriately. Model risk in AI is broader than in traditional quantitative models because machine learning models can learn spurious correlations from training data, exhibit performance degradation over time as the data environment changes (model drift), and behave unexpectedly in input conditions they were not trained on.',
        'Bias and fairness risk is a critical subset of model risk with significant legal and reputational implications. A model trained on historical data may perpetuate or amplify historical patterns of discrimination. Auditors should evaluate whether the organization has defined appropriate fairness metrics for each AI use case, tested model outputs for disparate impact across protected classes, and documented the testing methodology and results.',
        'Data governance is foundational to AI risk management and often underdeveloped. The quality of a machine learning model is directly dependent on the quality of its training data. Audit programs should examine data lineage documentation, controls over training data selection and labeling, processes for identifying and addressing data quality issues, and retention and version control practices for training datasets.',
        'Governance and accountability controls are frequently the weakest link. Many organizations have deployed AI systems without clear ownership, documented approval processes, or defined performance monitoring protocols. Effective AI governance requires a model inventory, a formal model approval process including independent validation, ongoing performance monitoring with defined thresholds, and a process for model retirement or retraining.',
        'Finally, auditors should assess explainability and documentation. Regulators in multiple jurisdictions are increasingly requiring that organizations be able to explain automated decisions to affected individuals. Beyond regulatory compliance, adequate documentation of model design, training, and validation is essential for internal accountability and for future audit activities.',
      ]),
      seoTitle: 'Auditing AI Systems: Risks and Control Considerations',
      seoDescription: 'How to build an AI audit program covering model risk, bias, data governance, and explainability for internal audit and technology risk teams.',
    },
  ]

  console.log('Seeding articles…')
  for (const article of articles) {
    const doc = await client.create(article)
    console.log(`  Created article: ${doc.title}`)
  }

  console.log('\nSeed complete.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
