import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, jest } from '@jest/globals'
import SearchInput from '../SearchInput'

describe('SearchInput Component', () => {
  test('renders the input field', () => {
    // Render the SearchInput component
    render(<SearchInput />)
    // Get the input element by its role
    const inputElement = screen.getByRole('textbox')
    // Assert that the input element is in the document
    expect(inputElement).toBeInTheDocument()
  })

  test('calls onChange when typing', () => {
    // Create a mock function for the onChange handler
    const handleChange = jest.fn()
    // Render the SearchInput component with the mock onChange handler
    render(<SearchInput onChange={handleChange} />)
    // Get the input element by its role
    const inputElement = screen.getByRole('textbox')

    // Simulate a change event on the input element
    fireEvent.change(inputElement, { target: { value: 'test' } })
    // Assert that the handleChange function was called with the expected value
    expect(handleChange).toHaveBeenCalledWith('test')
  })
})
