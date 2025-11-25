/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { FC, useState, useEffect } from 'react';
import './App.less';
import 'antd/dist/reset.css';
import './index.css';
import {
  Routes, Route, BrowserRouter,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Cookies from 'universal-cookie';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

import TyrLayout from './shared/layout/layout';
import Animals from './components/animals';
import PCO from './components/pco';
import Customization from './components/customization';
import Users from './components/users';
import { Searches } from './components/searches/FtrSearches';
import { Queries } from './components/queries/FtrQueries';
import { Reports } from './components/reports/FtrReports';
import { Help } from './components/help/FtrHelp';
import Signup from './components/signup';
import Login from './components/login';
import Dashboard from './components/dashboard';
import AdminDashboard from './components/admin_dashboard';
import Invite from './components/invite';
import ConfirmPage from './components/admin_signup_confirm';
import AnimalMilestone from './components/animals/actions/milestones';
import ForgotUsernamePassword from './components/forgot_password_username';
import ResetPassword from './components/ResetPassword';
import Donation from './components/pco/actions/donation/Donation';
import History from './components/pco/actions/history/History';
import Prescription from './components/animals/actions/prescriptions/Prescriptions';
import Vaccinations from './components/animals/actions/vaccinations/Vaccinations';
import Meds from './components/animals/actions/meds/Meds';
import HealthHistory from './components/animals/actions/healthHistory/HealthHistory';
import Notes from './components/animals/actions/notes/Notes';
import AnimalHealthReport from './components/animals/actions/animalHealthReport/AnimalHealthReport';
import Soaps from './components/animals/actions/SOAPs/Soaps';
import AnimalReport from './components/animals/actions/animalReport/AnimalReport';
import WideExposure from './components/animals/actions/wideExposure/WideExposure';
import QueriesAnimalMilestone from './components/queries/animal_milestone/AnimalMilestone';
import Donations from './components/searches/donations/Donations';
import AnimalMilestones from './components/searches/animal_milestones/AnimalMilestones';
import AnimalHealth from './components/searches/animal_health/AnimalHealth';
import CurrentFosters from './components/reports/current_fosters/CurrentFosters';
import QueriesDonations from './components/queries/donations/Donations';
import MailList from './components/queries/mail_list/MailList';
import ProceduresTestTreatments from './components/animals/actions/procedureTestTreatments/ProceduresTestTreatments';
import Diary from './components/animals/actions/diary/Diary';
import TenantDiary from './components/user_diary/index';
import Email from './components/pco/actions/email/Email';
import MergePco from './components/pco/actions/merge_pco/MergePco';
import Attachments from './components/animals/actions/attachments/Attachments';
import QueriesAnimalHealth from './components/queries/animal_health/AnimalHealth';
import ReportsVolunteers from './components/reports/volunteers/VolunteersReports';
import TodaysMedsReports from './components/reports/todays_meds/TodaysMedsReports';
import AnimalHealthReports from './components/reports/animal_health/AnimalHealthReports';
import TenantAttachments from './components/customization/components/TenantAttachments';
import PcoAttachments from './components/pco/actions/attachments/PcoAttachments';
import Volunteer from './components/pco/actions/volunteer/Volunteer';
import AnimalBehavior from './components/animals/actions/behaviors/AnimalBehavior';
import { SignupConfirmation } from './components/signup/SignupConfirmation';
import MedReminder from './components/dashboard/reminders/MedReminder';
import AnimalSearch from './components/searches/animal_search/AnimalSearch';
import VaccinationReminder from './components/dashboard/reminders/VaccinationReminder';
import ProcedureReminder from './components/dashboard/reminders/ProcedureReminder';
import GalleryView from './components/animals/actions/galleryView/GalleryView';
import Onboarding from './components/onboarding/OnBoarding';
import IdleRefresh from './components/IdleRefresh';

export const isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

const App: FC<any> = () => {
  const cookies = new Cookies();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isLogIn = cookies.get('login');

  const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );

  useEffect(() => {
    setIsLoggedIn(isLogIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogIn]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <IdleRefresh />
          <Routes>
            <Route path="/registration" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Onboarding /></ErrorBoundary>} />
            <Route path="/signup/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Signup /></ErrorBoundary>} />
            <Route path="/signup/success" element={<ErrorBoundary FallbackComponent={ErrorFallback}><SignupConfirmation /></ErrorBoundary>} />
            <Route path="/auth/verify/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Invite /></ErrorBoundary>} />
            <Route path="/auth/verify-signup/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><ConfirmPage /></ErrorBoundary>} />
            <Route path="/" element={<TyrLayout />}>
              <Route path="/" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Dashboard /></ErrorBoundary>} />
              <Route path="/med-reminder" element={<ErrorBoundary FallbackComponent={ErrorFallback}><MedReminder /></ErrorBoundary>} />
              <Route path="/vaccination-reminder" element={<ErrorBoundary FallbackComponent={ErrorFallback}><VaccinationReminder /></ErrorBoundary>} />
              <Route path="/procedure-reminder" element={<ErrorBoundary FallbackComponent={ErrorFallback}><ProcedureReminder /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Login /></ErrorBoundary>} />
              <Route path="/forgot-username" element={<ErrorBoundary FallbackComponent={ErrorFallback}><ForgotUsernamePassword /></ErrorBoundary>} />
              <Route path="/forgot-password" element={<ErrorBoundary FallbackComponent={ErrorFallback}><ForgotUsernamePassword /></ErrorBoundary>} />
              <Route path="/auth/reset-password/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><ResetPassword /></ErrorBoundary>} />
              <Route path="/animals/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Animals /></ErrorBoundary>} />
              <Route path="/animals/milestone" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AnimalMilestone /></ErrorBoundary>} />
              <Route path="/pco/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><PCO /></ErrorBoundary>} />
              <Route path="/searches/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Searches /></ErrorBoundary>} />
              <Route path="/queries/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Queries /></ErrorBoundary>} />
              <Route path="/reports/*" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Reports /></ErrorBoundary>} />
              <Route path="/customization" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Customization /></ErrorBoundary>} />
              <Route path="/customization/diary" element={<ErrorBoundary FallbackComponent={ErrorFallback}><TenantDiary /></ErrorBoundary>} />
              <Route path="/customization/tenant-attachments" element={<ErrorBoundary FallbackComponent={ErrorFallback}><TenantAttachments /></ErrorBoundary>} />
              <Route path="/super-admin" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AdminDashboard /></ErrorBoundary>} />
              <Route path="#" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Help /></ErrorBoundary>} />
              <Route path="/users" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Users /></ErrorBoundary>} />
              <Route path="/pco/donation" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Donation /></ErrorBoundary>} />
              <Route path="/pco/history" element={<ErrorBoundary FallbackComponent={ErrorFallback}><History /></ErrorBoundary>} />
              <Route path="/pco/email" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Email /></ErrorBoundary>} />
              <Route path="/pco/mergePco" element={<ErrorBoundary FallbackComponent={ErrorFallback}><MergePco /></ErrorBoundary>} />
              <Route path="/pco/attachments" element={<ErrorBoundary FallbackComponent={ErrorFallback}><PcoAttachments /></ErrorBoundary>} />
              <Route path="/pco/volunteer" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Volunteer /></ErrorBoundary>} />
              <Route path="/animals/prescription" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Prescription /></ErrorBoundary>} />
              <Route path="/animals/behavior" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AnimalBehavior /></ErrorBoundary>} />
              <Route path="/animals/vaccinations" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Vaccinations /></ErrorBoundary>} />
              <Route path="/animals/meds" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Meds /></ErrorBoundary>} />
              <Route path="/animals/diary" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Diary /></ErrorBoundary>} />
              <Route path="/animals/gallery-view" element={<ErrorBoundary FallbackComponent={ErrorFallback}><GalleryView /></ErrorBoundary>} />
              <Route path="/animals/health-history" element={<ErrorBoundary FallbackComponent={ErrorFallback}><HealthHistory /></ErrorBoundary>} />
              <Route path="/animals/notes" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Notes /></ErrorBoundary>} />
              <Route path="/animals/health-report" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AnimalHealthReport /></ErrorBoundary>} />
              <Route path="/animals/soaps" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Soaps /></ErrorBoundary>} />
              <Route path="/animals/attachments" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Attachments /></ErrorBoundary>} />
              <Route path="/animals/reports" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AnimalReport /></ErrorBoundary>} />
              <Route path="/animals/wide-exposure" element={<ErrorBoundary FallbackComponent={ErrorFallback}><WideExposure /></ErrorBoundary>} />
              <Route path="/animals/procedures-test-treatments" element={<ErrorBoundary FallbackComponent={ErrorFallback}><ProceduresTestTreatments /></ErrorBoundary>} />
              <Route path="/donations-search" element={<ErrorBoundary FallbackComponent={ErrorFallback}><Donations /></ErrorBoundary>} />
              <Route path="/animal-milestone-search" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AnimalMilestones /></ErrorBoundary>} />
              <Route path="/animal-health-search" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AnimalHealth /></ErrorBoundary>} />
              <Route path="/animal-search" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AnimalSearch /></ErrorBoundary>} />
              <Route path="/animal-health-query" element={<ErrorBoundary FallbackComponent={ErrorFallback}><QueriesAnimalHealth /></ErrorBoundary>} />
              <Route path="/donations-query" element={<ErrorBoundary FallbackComponent={ErrorFallback}><QueriesDonations /></ErrorBoundary>} />
              <Route path="/mail-list-query" element={<ErrorBoundary FallbackComponent={ErrorFallback}><MailList /></ErrorBoundary>} />
              <Route path="/animal-milestone-query" element={<ErrorBoundary FallbackComponent={ErrorFallback}><QueriesAnimalMilestone /></ErrorBoundary>} />
              <Route path="/reports/volunteers" element={<ErrorBoundary FallbackComponent={ErrorFallback}><ReportsVolunteers /></ErrorBoundary>} />
              <Route path="/reports/todays-meds" element={<ErrorBoundary FallbackComponent={ErrorFallback}><TodaysMedsReports /></ErrorBoundary>} />
              <Route path="/reports/animal-health" element={<ErrorBoundary FallbackComponent={ErrorFallback}><AnimalHealthReports /></ErrorBoundary>} />
              <Route path="/reports/current-fosters" element={<ErrorBoundary FallbackComponent={ErrorFallback}><CurrentFosters /></ErrorBoundary>} />
              <Route path="*" />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
