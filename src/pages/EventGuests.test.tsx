import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EventGuests } from './EventGuests';

test('renders without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/events/ev1/guests']}>
      <Routes>
        <Route path="/events/:eventId/guests" element={<EventGuests />} />
      </Routes>
    </MemoryRouter>
  );
});
