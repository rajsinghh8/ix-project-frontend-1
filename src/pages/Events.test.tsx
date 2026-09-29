import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Events } from './Events';

test('renders without crashing', () => {
  render(
    <MemoryRouter>
      <Events />
    </MemoryRouter>
  );
});
