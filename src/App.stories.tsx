import type {Meta, StoryObj} from '@storybook/react';

import src from './App.tsx';
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const meta: Meta<typeof src> = {
    title: 'App',
    component: src,
    argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const 기본적인_사용법: Story = {
    parameters: {
        controls: {expanded: true}
    },
    args: {},
    decorators: [(Story) => {
        return (
            <QueryClientProvider client={new QueryClient()}>
                <MemoryRouter initialEntries={['/?page=5']}>
                    <Routes>
                        <Route path="/" element={<Story/>}/>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }]
};
