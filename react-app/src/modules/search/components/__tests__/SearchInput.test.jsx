import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, jest } from '@jest/globals'
import SearchInput from '../SearchInput'

describe('SearchInput Component', () => {
  test('renders the input field', () => {
    render(<SearchInput />)
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toBeInTheDocument()
  })

  test('calls onChange when typing', () => {
    const handleChange = jest.fn()
    render(<SearchInput onChange={handleChange} />)
    const inputElement = screen.getByRole('textbox')

    fireEvent.change(inputElement, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledWith('test')
  })
})
