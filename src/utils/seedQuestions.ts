import type { SectionId } from '../types';

export interface SeedQuestion {
  emoji: string;
  title: string;
  questions: string[];
}

export const seedQuestions: Record<SectionId, SeedQuestion> = {
  'social-problem': {
    emoji: '🌍',
    title: 'Social Problem',
    questions: [
      'What social issue or imbalance are we addressing?',
      'Who is most affected, and why does it matter?',
      'What happens if no one tackles this problem?',
      'Why are *we* the right team to solve it?'
    ]
  },
  'service-portfolio': {
    emoji: '🧩',
    title: 'Service Portfolio',
    questions: [
      'What specific services or programs do we deliver?',
      'How do these directly respond to the social problem?',
      'What activities make up each service?',
      'What results do participants or clients see?'
    ]
  },
  'core-value-offerings': {
    emoji: '💡',
    title: 'Core Value Offerings',
    questions: [
      'What transformation do we create for our beneficiaries?',
      'Why is our approach unique or more ethical?',
      'What emotional and practical value do we provide?',
      'How does our offer make a measurable difference?'
    ]
  },
  'beneficiaries': {
    emoji: '👥',
    title: 'Beneficiaries',
    questions: [
      'Who benefits directly from our work?',
      'What are their key needs, barriers, or motivations?',
      'How do we reach and support them fairly?',
      'What does success look like for them?'
    ]
  },
  'impact': {
    emoji: '🎯',
    title: 'Impact',
    questions: [
      'What positive change do we aim to create?',
      'How will we measure or evidence it?',
      'What stories or metrics will demonstrate our success?',
      "How do we know when we've made a difference?"
    ]
  },
  'network-partners': {
    emoji: '🤝',
    title: 'Network Partners',
    questions: [
      'Who helps us deliver or amplify our mission?',
      'What do they contribute (funding, expertise, credibility, reach)?',
      'How do we make partnerships mutually valuable?',
      'Who might we collaborate with in the future?'
    ]
  },
  'channels': {
    emoji: '📣',
    title: 'Channels',
    questions: [
      'How do people discover or access our services?',
      'What digital and in-person touchpoints do we use?',
      'How do we communicate our story and impact?',
      'Which channels are most effective for each audience?'
    ]
  },
  'costs': {
    emoji: '💷',
    title: 'Costs',
    questions: [
      'What are our biggest costs or resource demands?',
      'Which are essential for quality and safeguarding?',
      'How can we stay lean and sustainable?',
      'What fixed vs. variable costs do we have?'
    ]
  },
  'revenue-stream': {
    emoji: '💰',
    title: 'Revenue Streams',
    questions: [
      'Who pays — and for what value?',
      'Which income sources best align with our mission?',
      'How can we balance grants, sponsorships, and earned income?',
      'How will we sustain and grow our funding base?'
    ]
  }
};
