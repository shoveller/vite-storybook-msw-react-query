import type {Meta, StoryObj} from '@storybook/react';
import { rest } from 'msw'

import src from './App.tsx';
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {getWorker} from "msw-storybook-addon";

const meta: Meta<typeof src> = {
    title: 'App',
    component: src,
    argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const 기본적인_사용법: Story = {
    parameters: {
        controls: {expanded: true},
    },
    args: {},
    decorators: [(Story,props) => {
        const worker = getWorker();
        worker.use(
            rest.get('https://pokeapi.co/api/v2/pokemon', (_, res, ctx) => {
                return res(
                    ctx.json({
                        results: Array.from({ length: props.args.page || 0 }).fill(undefined)
                    })
                )
            })
        )

        return (
            <QueryClientProvider client={new QueryClient()}>
                <MemoryRouter initialEntries={['/?page=5']}>
                    <Routes>
                        <Route path="/" element={<Story key={props.args.page} />}/>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }]
};
