import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EventTasks } from './EventTasks';

test('renders without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/events/ev1/tasks']}>
      <Routes>
        <Route path="/events/:eventId/tasks" element={<EventTasks />} />
      </Routes>
    </MemoryRouter>
  );
});
