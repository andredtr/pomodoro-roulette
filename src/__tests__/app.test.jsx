import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

beforeEach(() => {
  localStorage.clear()
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

async function addTask(text) {
  const input = screen.getByPlaceholderText(/enter a new task/i)
  await userEvent.type(input, text)
  await userEvent.click(screen.getByRole('button', { name: /add/i }))
}

test('adding and deleting a task', async () => {
  render(<App />)
  await addTask('Task 1')
  expect(screen.getByText('Task 1')).toBeInTheDocument()
  window.confirm = jest.fn(() => true)
  await userEvent.click(screen.getByLabelText("Delete task 'Task 1'"))
  expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
})

test('start timer from task list', async () => {
  render(<App />)
  await addTask('Task 1')
  await userEvent.click(screen.getByLabelText("Start timer for task 'Task 1'"))
  expect(await screen.findByText(/selected task/i)).toBeInTheDocument()
  expect(screen.getByText('Task 1')).toBeInTheDocument()
})

test('spinning the wheel and starting timer', async () => {
  render(<App />)
  await addTask('Task 1')
  await addTask('Task 2')
  await userEvent.click(screen.getByRole('button', { name: /spin the wheel/i }))
  jest.advanceTimersByTime(4000)
  expect(await screen.findByText(/selected task/i)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /start timer/i }))
  expect(screen.getByText('25:00')).toBeInTheDocument()
})

test('completed tasks appear and paginate with analytics', async () => {
  localStorage.setItem('rouletteSettings', JSON.stringify({ soundsEnabled: true, pomodoroDuration: 1 }))
  render(<App />)
  for (let i = 1; i <= 6; i++) {
    await addTask('Task ' + i)
    await userEvent.click(screen.getByLabelText(`Start timer for task 'Task ${i}'`))
    await userEvent.click(await screen.findByRole('button', { name: /start timer/i }))
    jest.advanceTimersByTime(60000)
    await screen.findByText(/time for a 1-minute pomodoro session!/i)
    window.confirm = jest.fn(() => true)
    await userEvent.click(screen.getByRole('button', { name: /complete task/i }))
  }
  expect(screen.getByText(/completed tasks \(6\)/i)).toBeInTheDocument()
  expect(screen.getByText(/pomodoros today: 6/i)).toBeInTheDocument()
  const next = screen.getByRole('button', { name: /next/i })
  expect(next).not.toBeDisabled()
  await userEvent.click(next)
  expect(screen.getByRole('button', { name: /prev/i })).not.toBeDisabled()
})
