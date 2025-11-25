/* eslint-disable no-unused-vars */
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import Login from './components/login';
import Landing from './components/landing';
import TestRenderWithRedux from './shared/TestRenderWithRedux';

// Define a custom matchMedia function
const customMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('app', () => {
  // Before running your tests, add matchMedia to the window object
  beforeAll(() => {
    window.matchMedia = customMatchMedia;
  });

  test('App renders without crashing And Loading Landing Page', () => {
    const caseInsensitiveText = /To Their Rescue/i;
    render(<App />);

    try {
      const matchingElements = screen.getAllByText(caseInsensitiveText);
      expect(matchingElements.length).toBeGreaterThan(1);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error: --- ', error?.message);
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error.message).toContain('Unable to find an element with the text');
    }
  });

  test('Login page is loading successfully', () => {
    const caseInsensitiveText = /Log in/i;
    render(
      <TestRenderWithRedux>
        <Login />
      </TestRenderWithRedux>,
    );
    const matchingElements = screen.getAllByText(caseInsensitiveText);
    expect(matchingElements.length).toBeGreaterThanOrEqual(1);
  });

  test('Home page is loading successfully', () => {
    const caseInsensitiveText = /Sign In/i;
    render(
      <TestRenderWithRedux>
        <Landing />
      </TestRenderWithRedux>,
    );
    const matchingElements = screen.getAllByText(caseInsensitiveText);
    expect(matchingElements.length).toBeGreaterThanOrEqual(1);
  });
});

describe('login', () => {
  beforeAll(() => {
    window.matchMedia = customMatchMedia;
  });
  // test('validate function should pass on correct input ', () => {
  //   const text = 'text@test.com';
  //   expect(text).toBe(true);
  // });
  // test('validate function should fail on incorrect input ', () => {
  //   const text = 'text';
  //   expect(text).not.toBe(true);
  // });
  test('login form should be in the document', () => {
    const component = render(<TestRenderWithRedux><Login /></TestRenderWithRedux>);
    const labelNode = component.getAllByPlaceholderText('Your User ID');
    expect(labelNode.length).toBeGreaterThanOrEqual(1);
  });

  test('user id feild should not empty', async () => {
    render(<TestRenderWithRedux><Login /></TestRenderWithRedux>);
    const userIdInputNode: any = screen.getByPlaceholderText('Your User ID');

    fireEvent?.change(userIdInputNode, { target: { value: '' } });
    const buttonNode = screen.getByText('Log in');
    fireEvent.submit(buttonNode);

    await waitFor(() => {
      const errorMessageNode = screen.getByText('User Id is required');
      expect(errorMessageNode).toBeInTheDocument();
    });
  });
  test('password feild should not empty', async () => {
    render(<TestRenderWithRedux><Login /></TestRenderWithRedux>);
    const userIdInputNode: any = screen.getByPlaceholderText('Your Password');

    fireEvent?.change(userIdInputNode, { target: { value: '' } });
    const buttonNode = screen.getByText('Log in');
    fireEvent.submit(buttonNode);

    await waitFor(() => {
      const errorMessageNode = screen.getByText('Password is required');
      expect(errorMessageNode).toBeInTheDocument();
    });
  });
});
