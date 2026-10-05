import './style.css';
import './recent.css';
import './calendar-filters.css';
import './schedule.css';
import './schedule-side-nav.css';
import ScheduleQuickNav from './components/ScheduleQuickNav';

export const metadata={title:'Success On The Spectrum | Parsippany PTO & Leave Request Portal',description:'Parsippany PTO, leave request, and calendar portal'};

export default function Layout({children}){
  return <html lang="en"><body>{children}<ScheduleQuickNav/></body></html>;
}
