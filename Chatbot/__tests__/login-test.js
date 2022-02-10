import React from 'react';
import Login from '../screens/Login';
import { render } from '@testing-library/react-native';

// describe('Chat Screen', () => {
//     it('go to selection on login', () => {
//         const page = render(<ChatScreen />);

//     })
// })

it("renders default elements", () => {
    const { getAllByText } = render(<Login />);
    
    expect(getAllByText("Please").length).toBe(2);
});