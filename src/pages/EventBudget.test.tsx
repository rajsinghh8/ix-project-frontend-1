import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EventBudget } from './EventBudget';

test('renders without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/events/ev1/budget']}>
      <Routes>
        <Route path="/events/:eventId/budget" element={<EventBudget />} />
      </Routes>
    </MemoryRouter>
  );
});
