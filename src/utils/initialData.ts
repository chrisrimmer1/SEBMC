import type { CanvasData } from '../types';

export function getInitialCanvasData(): CanvasData {
  return {
    sections: {
      'social-problem': {
        id: 'social-problem',
        title: 'Social problem',
        subtitle: 'A problem which is causing disequilibrium in the society.',
        items: [],
        icon: 'search'
      },
      'service-portfolio': {
        id: 'service-portfolio',
        title: 'Service portfolio',
        subtitle: 'A list of services/actions/programs that deliver the core value.',
        items: [],
        icon: 'briefcase'
      },
      'core-value': {
        id: 'core-value',
        title: 'Core value offerings',
        subtitle: 'The value proposition that aims to eradicate the social problem addressed.',
        items: [],
        icon: 'heart'
      },
      'beneficiaries': {
        id: 'beneficiaries',
        title: 'Beneficiaries',
        subtitle: 'The target group/vulnerable segment who will be benefited.',
        items: [],
        icon: 'users'
      },
      'impact': {
        id: 'impact',
        title: 'Impact',
        subtitle: 'A set of matrices to measure the progress of the value offered.',
        items: [],
        icon: 'trending-up'
      },
      'network-partners': {
        id: 'network-partners',
        title: 'Network partners',
        subtitle: 'Reference groups/peer-support network who are willing to join the cause.',
        items: [],
        icon: 'users-2'
      },
      'channels': {
        id: 'channels',
        title: 'Channels',
        subtitle: 'Media through which the services will be provided, i.e. online, off-line.',
        items: [],
        icon: 'monitor'
      },
      'costs': {
        id: 'costs',
        title: 'Costs',
        subtitle: 'Sources of expenditure, capital cost, operational cost.',
        items: [],
        icon: 'circle-dollar-sign'
      },
      'revenue-stream': {
        id: 'revenue-stream',
        title: 'Revenue stream',
        subtitle: 'Sources of earnings which will keep the venture sustainable.',
        items: [],
        icon: 'piggy-bank'
      }
    },
    lastModified: new Date().toISOString()
  };
}

// Generate unique ID for items
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
