import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EventOverview } from './EventOverview';

test('renders without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/events/ev1/overview']}>
      <Routes>
        <Route path="/events/:eventId/overview" element={<EventOverview />} />
      </Routes>
    </MemoryRouter>
  );
});
