import {Page} from './models/utils';


export const pages: Page[] = [
  {
    title: 'Stops',
    icon: 'home',
    route: '/stops',
    requiresAuthentication: false,
  },
  {
    title: 'Holidays',
    icon: 'airplanemode_active',
    route: '/holidays',
    requiresAuthentication: false,
  },
  {
    title: 'Routes',
    icon: 'departure_board',
    route: '/routes',
    requiresAuthentication: false,
  },
  {
    title: 'Stats',
    icon: 'bar_chart',
    route: '/stats',
    requiresAuthentication: true,
  },
  {
    title: 'Find Route',
    icon: 'navigation',
    route: '/navigation',
    requiresAuthentication: false,
  }
];
