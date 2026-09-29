import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EventVendors } from './EventVendors';

test('renders without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/events/ev1/vendors']}>
      <Routes>
        <Route path="/events/:eventId/vendors" element={<EventVendors />} />
      </Routes>
    </MemoryRouter>
  );
});
