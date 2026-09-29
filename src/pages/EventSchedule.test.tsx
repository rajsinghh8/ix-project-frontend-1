import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EventSchedule } from './EventSchedule';

test('renders without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/events/ev1/schedule']}>
      <Routes>
        <Route path="/events/:eventId/schedule" element={<EventSchedule />} />
      </Routes>
    </MemoryRouter>
  );
});
